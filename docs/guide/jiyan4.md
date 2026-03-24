# 极验4

:::info
地址: https://gt4.geetest.com/
:::

## 滑块验证码
```python
import os
import json
import random
import time
import uuid
import requests
import ddddocr
import secrets
import hashlib
from Crypto.Cipher import PKCS1_v1_5, AES
from Crypto.PublicKey import RSA
from Crypto.Util.Padding import pad
from loguru import logger


class Geetest:
    def __init__(self):
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "zh,en;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://gt4.geetest.com/",
            "Sec-Fetch-Dest": "script",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\""
        }
        self.rsa_hex_n = "00C1E3934D1614465B33053E7F48EE4EC87B14B95EF88947713D25EECBFF7E74C7977D02DC1D9451F79DD5D1C10C29ACB6A9B4D6FB7D0A0279B6719E1772565F09AF627715919221AEF91899CAE08C0D686D748B20A3603BE2318CA6BC2B59706592A9219D0BF05C9F65023A21D2330807252AE0066D59CEEFA5F2748EA80BAB81"
        self.captcha_id = "54088bb07d2df3c46b79f80300b0abbe"
        self.c = 1.0059466666666665
        self.aes_key = self.guid()
        self.lot_number = None
        self.pt = None
        self.payload_protocol = None
        self.payload = None
        self.process_token = None
        self.pow_detail = None
        self.pow_msg = None
        self.pow_sign = None
        self.pass_token = None
        self.gen_time = None
        self.captcha_output = None
        self.dis = 0

    @staticmethod
    def guid():
        return secrets.token_hex(8)

    def rsa_encrypt(self, text):
        key = RSA.construct((int(self.rsa_hex_n, 16), int("10001", 16)))

        cipher = PKCS1_v1_5.new(key)

        ciphertext = cipher.encrypt(text.encode())

        hex_result = ciphertext.hex()
        if len(hex_result) % 2 == 1:
            hex_result = '0' + hex_result
        return hex_result

    @staticmethod
    def aes_encrypt(data: str, key: str):
        iv = b'0000000000000000'

        cipher = AES.new(key.encode("utf-8"), AES.MODE_CBC, iv)
        ciphertext = cipher.encrypt(pad(data.encode("utf-8"), 16))

        return ciphertext.hex()

    @staticmethod
    def hash_func(name, data):
        data = data.encode("utf-8")

        if name == "md5":
            return hashlib.md5(data).hexdigest()
        elif name == "sha1":
            return hashlib.sha1(data).hexdigest()
        elif name == "sha256":
            return hashlib.sha256(data).hexdigest()
        else:
            raise ValueError("unsupported hash func")

    def pow_calc(self, lot_number, captcha_id, hash_func, version, bits, datetime, pd):
        a = bits % 4
        _ = bits // 4

        u = '0' * _

        c = f"{version}|{bits}|{hash_func}|{datetime}|{captcha_id}|{lot_number}|{pd}|"

        while True:
            h = self.guid()
            p = c + h

            l = self.hash_func(hash_func, p)

            if a == 0:
                if l.startswith(u):
                    return {
                        "pow_msg": p,
                        "pow_sign": l
                    }
            else:
                if l.startswith(u):
                    d = l[_]

                    if a == 1:
                        f = 7
                    elif a == 2:
                        f = 3
                    elif a == 3:
                        f = 1
                    else:
                        continue

                    if int(d, 16) <= f:
                        return {
                            "pow_msg": p,
                            "pow_sign": l
                        }

    @staticmethod
    def save_img(url, path):
        os.makedirs("img", exist_ok=True)
        resp = requests.get(url)
        img_path = os.path.join("img", path)
        with open(img_path, 'wb') as f:
            f.write(resp.content)

    def load(self):
        url = "https://gcaptcha4.geetest.com/load"
        ck = "geetest_" + str(int(time.time() * 1000))
        params = {
            "callback": ck,
            "captcha_id": self.captcha_id,
            "challenge": str(uuid.uuid4()),
            "client_type": "web",
            "risk_type": "slide",
            "lang": "zh"
        }
        response = requests.get(url, headers=self.headers, params=params)
        logger.info(f"获取验证信息请求: {response.text}")
        data_json = json.loads(response.text.replace(ck + "(", "")[:-1])
        data = data_json["data"]
        self.lot_number = data["lot_number"]
        self.pt = data["pt"]
        self.payload_protocol = data["payload_protocol"]
        self.payload = data["payload"]
        self.process_token = data["process_token"]
        self.pow_detail = data["pow_detail"]
        pow_info = self.pow_calc(self.lot_number, self.captcha_id, self.pow_detail["hashfunc"], self.pow_detail["version"], self.pow_detail["bits"], self.pow_detail["datetime"], "")
        logger.info(f"签名计算: {pow_info}")
        self.pow_msg = pow_info["pow_msg"]
        self.pow_sign = pow_info["pow_sign"]

        bg_path = data["bg"]
        slice_path = data["slice"]
        logger.info("开始下载背景图片")
        self.save_img(f"https://static.geetest.com/{bg_path}", "bg.png")
        logger.info("开始下载滑块图片")
        self.save_img(f"https://static.geetest.com/{slice_path}", "slice.png")

        det = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False)

        with open('./img/slice.png', 'rb') as f:
            target_bytes = f.read()

        with open('./img/bg.png', 'rb') as f:
            background_bytes = f.read()

        res = det.slide_match(target_bytes, background_bytes, simple_target=True)

        self.dis = res['target'][0]
        logger.info(f"识别到滑动距离: {self.dis}")

    def verify(self):
        data = {
            "setLeft": self.dis,
            "passtime": random.randint(1500, 2500),
            "userresponse": self.dis / self.c + 2,
            "device_id": "",
            "lot_number": self.lot_number,
            "pow_msg": self.pow_msg,
            "pow_sign": self.pow_sign,
            "geetest": "captcha",
            "lang": "zh",
            "ep": "123",
            "biht": "1426265548",
            "gee_guard": {
                "roe": {
                    "aup": "3",
                    "sep": "3",
                    "egp": "3",
                    "auh": "3",
                    "rew": "3",
                    "snh": "3",
                    "res": "3",
                    "cdc": "3"
                }
            },
            secrets.token_hex(2): secrets.token_hex(2),
            self.lot_number[17:25]: self.lot_number[26:30],
            "em": {
                "ph": 0,
                "cp": 0,
                "ek": "11",
                "wd": 1,
                "nt": 0,
                "si": 0,
                "sc": 0
            }
        }
        r = self.rsa_encrypt(self.aes_key)
        i = self.aes_encrypt(json.dumps(data, separators=(",", ":")), self.aes_key)

        url = "https://gcaptcha4.geetest.com/verify"
        ck = "geetest_" + str(int(time.time() * 1000))
        params = {
            "callback": ck,
            "captcha_id": self.captcha_id,
            "client_type": "web",
            "lot_number": self.lot_number,
            "risk_type": "slide",
            "payload": self.payload,
            "process_token": self.process_token,
            "payload_protocol": self.payload_protocol,
            "pt": self.pt,
            "w": i + r
        }
        response = requests.get(url, headers=self.headers, params=params)
        logger.info(f"验证结果请求: {response.text}")
        data_json = json.loads(response.text.replace(ck + "(", "")[:-1])
        data = data_json["data"]
        self.pass_token = data["seccode"]["pass_token"]
        self.gen_time = data["seccode"]["gen_time"]
        self.captcha_output = data["seccode"]["captcha_output"]

    def login(self):
        url = "https://gt4.geetest.com/demo/login"
        params = {
            "captcha_id": self.captcha_id,
            "lot_number": self.lot_number,
            "pass_token": self.pass_token,
            "gen_time": self.gen_time,
            "captcha_output": self.captcha_output
        }
        response = requests.get(url, headers=self.headers, params=params)
        logger.info(f"登录请求: {response.text}")


if __name__ == '__main__':
    geetest = Geetest()
    geetest.load()
    geetest.verify()
    geetest.login()
```