# 数美

:::info
地址: https://www.ishumei.com/new/product/tw/code
:::

## 滑块验证码
```python
import os
import json
import time
from datetime import datetime
import random
import requests
from Crypto.Cipher import DES
import base64
import ddddocr
import numpy as np
import math


class ShuMei:
    def __init__(self):
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "zh,en;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Origin": "https://www.ishumei.com",
            "Pragma": "no-cache",
            "Referer": "https://www.ishumei.com/",
            "Sec-Fetch-Dest": "script",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\""
        }
        self.organization = "d6tpAY1oV0Kv5jRSgxQr"
        self.captcha_uuid = self.get_captcha_uuid()
        self.rid = ""
        self.dis = 0

    @staticmethod
    def zero_pad(data: bytes, block_size=8):
        pad_len = (block_size - len(data) % block_size) % block_size
        return data + b'\x00' * pad_len

    def des_encrypt(self, key: str, word: str) -> str:
        key_bytes = key.encode('utf-8')[:8]

        data = word.encode('utf-8')
        data = self.zero_pad(data)

        cipher = DES.new(key_bytes, DES.MODE_ECB)
        encrypted = cipher.encrypt(data)

        return base64.b64encode(encrypted).decode()

    @staticmethod
    def get_captcha_uuid():
        now = datetime.now()

        def pad(x):
            return f"{x:02d}"

        time_str = str(now.year) + pad(now.month) + pad(now.day) + pad(now.hour) + pad(now.minute) + pad(now.second)

        chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"
        return time_str +  ''.join(random.choice(chars) for _ in range(18))

    @staticmethod
    def save_img(url, path):
        os.makedirs("img", exist_ok=True)
        resp = requests.get(url)
        img_path = os.path.join("img", path)
        with open(img_path, 'wb') as f:
            f.write(resp.content)

    def register(self):
        url = "https://captcha1.fengkongcloud.cn/ca/v1/register"
        ck = "sm_" + str(int(time.time() * 1000))
        params = {
            "model": "slide",
            "lang": "zh-cn",
            "channel": "default",
            "rversion": "1.0.4",
            "captchaUuid": self.captcha_uuid,
            "data": "{}",
            "appId": "default",
            "callback": ck,
            "sdkver": "1.1.3",
            "organization": self.organization
        }
        response = requests.get(url, headers=self.headers, params=params)
        data_json = json.loads(response.text.replace(ck + "(", "")[:-1])
        detail = data_json.get("detail")
        self.rid = detail.get("rid")

        bg_path = detail.get("bg")
        fg_path = detail.get("fg")
        self.save_img(f"https://castatic.fengkongcloud.cn{bg_path}", "bg.jpg")
        self.save_img(f"https://castatic.fengkongcloud.cn{fg_path}", "fg.png")

        det = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False)

        with open('./img/fg.png', 'rb') as f:
            target_bytes = f.read()

        with open('./img/bg.jpg', 'rb') as f:
            background_bytes = f.read()

        res = det.slide_match(target_bytes, background_bytes, simple_target=True)
        self.dis = int(res['target'][0] / 2)

    def get_track(self):
        x = [0, 0]
        y = [0, 0, 0]
        z = [0]

        count = np.linspace(-math.pi / 2, math.pi / 2, random.randrange(20, 30))
        func = list(map(math.sin, count))
        nx = [i + 1 for i in func]
        add = random.randrange(10, 15)
        s_add = self.dis + add

        x.extend(list(map(lambda x: x * (s_add / 2), nx)))
        x.extend(np.linspace(s_add, self.dis, 3 if add > 12 else 2))
        x = [math.floor(i) for i in x]

        for i in range(len(x) - 2):
            if y[-1] < 30:
                y.append(y[-1] + random.choice([0, 0, 1, 1, 2, 2, 2, 1, 2, 0, 0, 3, 3]))
            else:
                y.append(y[-1] + random.choice([0, 0, -1, -1, -2, -2, -1, -2, -1, -2, 0, 0, -3, -3]))

        for i in range(len(x) - 1):
            z.append((z[-1] // 100 * 100) + 100 + random.choice([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2]))

        trace = list(map(list, zip(x, y, z)))
        times = trace[-1][-1] + random.randint(1, 5)

        return trace, times

    def verify(self):
        url = "https://captcha1.fengkongcloud.cn/ca/v2/fverify"
        ck = "sm_" + str(int(time.time() * 1000))
        track, pass_time = self.get_track()
        print(track)
        params = {
            "organization": self.organization,
            "jt": self.des_encrypt("40af034e", "zh-cn"),
            "protocol": "205",
            "rversion": "1.0.4",
            "callback": ck,
            "sdkver": "1.1.3",
            "rid": self.rid,
            "ie": self.des_encrypt("93a38761", "default"),
            "ki": self.des_encrypt("0cedcaf6", str(300)),
            "ostype": "web",
            "hy": self.des_encrypt("50385fd0", "default"),
            "po": self.des_encrypt("16f63936", str(self.dis / 300)),
            "oy": self.des_encrypt("008e0555", "-1"),
            "uf": self.des_encrypt("66a0c9e1", "0"),
            "bt": self.des_encrypt("2f1b6d76", str(150)),
            "captchaUuid": self.captcha_uuid,
            "act.os": "web_pc",
            "zh": self.des_encrypt("07ca8026", "1"),
            "cr": self.des_encrypt("1fc71626", str(track).replace(" ", "")),
            "iy": self.des_encrypt("8df985ee", "11"),
            "cd": self.des_encrypt("22275674", str(pass_time))
        }
        print(params)
        response = requests.get(url, headers=self.headers, params=params)

        print(response.text)

if __name__ == '__main__':
    s = ShuMei()
    s.register()
    s.verify()
```