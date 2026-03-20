# 云片

:::info
地址: https://www.yunpian.com/product/captcha
:::

## 滑块验证码

这个案例比较简单，代码没有混淆，也不需要异步调试，还是比较容易逆向的。唯一麻烦的是，网站的图片缩放以及滑块图片左侧有透明背景，对识别的距离需要特殊处理。

然后是轨迹生成，我这个只是随便弄弄，测试了下，通过率只有70%左右，也不想折腾了，就这样吧。

```python
import base64
import json
import random
import string
import uuid

import ddddocr
import requests
from Crypto.Cipher import AES, PKCS1_v1_5
from Crypto.PublicKey import RSA
from Crypto.Util.Padding import pad
from loguru import logger


class YunPian:
    def __init__(self):
        # 浏览器指纹
        self.fp = "12401fab5b6eed50ef5bb329ff7c5a46"
        self.yp_id = str(uuid.uuid4())
        self.captcha_id = "974cd565f11545b6a5006d10dc324281"
        self.token = ""
        self.slider_width = 0
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "zh,en;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Sec-Fetch-Dest": "script",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\""
        }
        self.cookies = {}

    @staticmethod
    def get_cb(length):
        chars = "0123456789abcdefghijklmnopqrstuv"
        return ''.join(random.choice(chars) for _ in range(length))

    @staticmethod
    def download_image(url, path):
        with open(path, "wb") as f:
            response = requests.get(url, stream=True)
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
                    f.flush()

    @staticmethod
    def get_random_str(length):
        result = ""
        while len(result) < length:
            result += ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(8))
        return result[:length]

    @staticmethod
    def wrap_pem(key, key_type="PUBLIC KEY"):
        lines = "\n".join([key[i:i + 64] for i in range(0, len(key), 64)])
        return f"-----BEGIN {key_type}-----\n{lines}\n-----END {key_type}-----"

    @staticmethod
    def aes_encrypt(plaintext, key, iv):
        key_bytes = key.encode('utf-8')
        iv_bytes = iv.encode('utf-8')
        data = plaintext.encode('utf-8')

        cipher = AES.new(key_bytes, AES.MODE_CBC, iv_bytes)
        encrypted = cipher.encrypt(pad(data, AES.block_size))

        return base64.b64encode(encrypted).decode()

    def rsa_encrypt(self, text):
        key = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDnOWe/gs033L/2/xR3oi6SLAMPBY5VledUqqH6dbCNOdrGX4xW+1x6NUfvmwpHRBA2C7xWDDvOIldTl0rMtERTDy9homrVqEcW6/TY+dSVFL3e2Yg2sVaehHv7FhmATkgfC2FcXt8Wvm99QpKRSrGKpcFYJwOj2F8hJh+rTG0IPQIDAQAB"

        pem_key = self.wrap_pem(key)
        rsa_key = RSA.import_key(pem_key)

        cipher = PKCS1_v1_5.new(rsa_key)
        encrypted = cipher.encrypt(text.encode('utf-8'))

        return base64.b64encode(encrypted).decode()

    def encrypt(self, data):
        text = json.dumps(data, separators=(',', ':'))

        e = self.get_random_str(16)
        n = self.get_random_str(16)

        return {
            "i": self.aes_encrypt(text, e, n),
            "k": self.rsa_encrypt(e + n)
        }

    def get(self):
        url = "https://captcha.yunpian.com/v1/jsonp/captcha/get"
        data = {
            "browserInfo": [
                {
                    "key": "userAgent",
                    "value": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36"
                },
                {
                    "key": "language",
                    "value": "zh"
                },
                {
                    "key": "hardware_concurrency",
                    "value": 20
                },
                {
                    "key": "resolution",
                    "value": [
                        2560,
                        1600
                    ]
                },
                {
                    "key": "navigator_platform",
                    "value": "Linux x86_64"
                }
            ],
            "nativeInfo": None,
            "additions": {},
            "options": {
                "sdk": "https://www.yunpian.com/static/official/js/libs/riddler-sdk-0.2.2.js",
                "sdkBuildVersion": "1.5.0(2021111001)",
                "hosts": "https://captcha.yunpian.com"
            },
            "fp": self.fp,
            "address": "https://www.yunpian.com",
            "yp_riddler_id": self.yp_id
        }
        sign_info = self.encrypt(data)
        params = {
            "cb": self.get_cb(11),
            "i": sign_info["i"],
            "k": sign_info["k"],
            "captchaId": self.captcha_id
        }
        response = requests.get(url, headers=self.headers, cookies=self.cookies, params=params)
        data_json = json.loads(response.text.replace("ypjsonp(", "")[:-1])
        logger.info(f"获取信息: {data_json}")
        bg = data_json["data"]["bg"]
        front = data_json["data"]["front"]
        self.token = data_json["data"]["token"]
        self.slider_width = data_json["data"]["sliderWidth"]

        logger.info(f"背景图片地址: {bg}")
        self.download_image(bg, "bg.jpg")
        logger.info(f"背景图片下载完成。。")
        logger.info(f"滑块图片地址: {front}")
        self.download_image(front, "slice.png")
        logger.info(f"滑块图片下载完成。。")

        det = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False)

        with open('slice.png', 'rb') as f:
            target_bytes = f.read()

        with open('bg.jpg', 'rb') as f:
            background_bytes = f.read()

        res = det.slide_match(target_bytes, background_bytes, simple_target=True)

        target_x = res['target'][0]
        logger.info(f"识别到滑动距离: {target_x}")
        """
        原网页图片有缩放以及滑块左侧透明背景的原因，本地识别的距离需要处理后才可使用。
        这个处理不一定对，只是根据数据对比后的简单处理。
        """
        dis = int(target_x * 0.68)
        logger.info(f"处理后距离: {dis}")
        return dis

    @staticmethod
    def get_points(dis):
        cur_x, cur_y, cur_t = 0, 0, random.randint(20, 50)
        init_x, init_y = random.randint(800, 850), random.randint(1900, 1950)
        track_arr = []
        while cur_x <= dis:
            if random.randint(0, 10) == 0:
                cur_y += -1 if random.randint(0, 1) == 0 else 1
            cur_x += random.randint(2, 3) if random.randint(0, 10) == 0 else 1
            progress = cur_x / dis
            if progress < 0.8:
                cur_t += random.randint(0, 15)
            else:
                rn = random.randint(0, 10)
                if rn == 0:
                    cur_t += random.randint(50, 150)
                elif rn == 10:
                    cur_t += random.randint(20, 50)
                else:
                    cur_t += random.randint(0, 10)

            track_arr.append([init_x + cur_x, init_y + cur_y, cur_t])
        if track_arr[-1][0] != init_x + dis:
            track_arr.append([init_x + dis, init_y + cur_y, cur_t + random.randint(5, 20)])

        return track_arr

    @staticmethod
    def reduce_points(t):
        if len(t) <= 50:
            return t

        e = [t[0]]
        n = t[-1]
        i = len(t) // 50
        if i < 2:
            return t
        r = 1
        while r < len(t) - 2:
            e.append(t[r])
            r += i
        e.append(n)
        return e


    def verify(self, dis):
        r = (304 - int(self.slider_width * 152 / 240)) * (dis / (304 - 42)) / 304
        points = self.get_points(dis)
        logger.info(f"生成轨迹: {points}", flush=True)
        points = self.reduce_points(points)
        logger.info(f"轨迹处理: {points}")
        data = {
            "points": points,
            "distanceX": r,
            "fp": self.fp,
            "address": "https://www.yunpian.com",
            "yp_riddler_id": self.yp_id
        }
        url = "https://captcha.yunpian.com/v1/jsonp/captcha/verify"
        sign_info = self.encrypt(data)
        params = {
            "cb": self.get_cb(11),
            "i": sign_info["i"],
            "k": sign_info["k"],
            "token": self.token,
            "captchaId": self.captcha_id
        }
        logger.info("开始验证。。")
        response = requests.get(url, headers=self.headers, cookies=self.cookies, params=params)
        logger.info(f"验证结果: {response.text}")

if __name__ == '__main__':
    yun = YunPian()
    dis = yun.get()
    yun.verify(dis)
```