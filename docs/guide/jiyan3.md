# 极验3

::: info
地址: https://demos.geetest.com/
:::

## 一键通过模式

```python
import hashlib
import json
import random
import secrets
import time

import requests
from Crypto.Cipher import PKCS1_v1_5, AES
from Crypto.PublicKey import RSA
from Crypto.Util.Padding import pad


class CustomBase64:
    def __init__(self):
        self.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()'
        self.padding_char = '.'

        self.mask1 = 7274496
        self.mask2 = 9483264
        self.mask3 = 19220
        self.mask4 = 235

        self.bit_length = 24

    @staticmethod
    def _get_bit(number, position):
        return (number >> position) & 1

    def _char_from_index(self, index):
        if 0 <= index < len(self.alphabet):
            return self.alphabet[index]
        return self.padding_char

    def _index_from_char(self, char):
        return self.alphabet.find(char)

    @staticmethod
    def _string_to_bytes(text):
        return [ord(c) for c in text]

    @staticmethod
    def _bytes_to_string(byte_array):
        return ''.join(chr(b) for b in byte_array)

    def _encode_bits(self, data_byte, mask_byte, is_encoding=True):
        result = 0

        if is_encoding:
            for bit_pos in range(self.bit_length - 1, -1, -1):
                if self._get_bit(mask_byte, bit_pos) == 1:
                    data_bit = self._get_bit(data_byte, bit_pos)
                    result = (result << 1) + data_bit
        else:
            if data_byte < 0:
                return 0

            mask_bit_pos = 5
            for bit_pos in range(self.bit_length - 1, -1, -1):
                if self._get_bit(mask_byte, bit_pos) == 1:
                    data_bit = self._get_bit(data_byte, mask_bit_pos)
                    result += (data_bit << bit_pos)
                    mask_bit_pos -= 1

        return result

    def _encode_chunk(self, chunk_bytes):
        if len(chunk_bytes) == 3:
            combined = (chunk_bytes[0] << 16) + (chunk_bytes[1] << 8) + chunk_bytes[2]

            char1 = self._char_from_index(self._encode_bits(combined, self.mask1, True))
            char2 = self._char_from_index(self._encode_bits(combined, self.mask2, True))
            char3 = self._char_from_index(self._encode_bits(combined, self.mask3, True))
            char4 = self._char_from_index(self._encode_bits(combined, self.mask4, True))

            return char1 + char2 + char3 + char4, ''

        elif len(chunk_bytes) == 2:
            combined = (chunk_bytes[0] << 16) + (chunk_bytes[1] << 8)

            char1 = self._char_from_index(self._encode_bits(combined, self.mask1, True))
            char2 = self._char_from_index(self._encode_bits(combined, self.mask2, True))
            char3 = self._char_from_index(self._encode_bits(combined, self.mask3, True))

            return char1 + char2 + char3, self.padding_char

        elif len(chunk_bytes) == 1:
            combined = chunk_bytes[0] << 16

            char1 = self._char_from_index(self._encode_bits(combined, self.mask1, True))
            char2 = self._char_from_index(self._encode_bits(combined, self.mask2, True))

            return char1 + char2, self.padding_char * 2

    def encode_bytes(self, byte_data):
        result = []
        padding = ''

        for i in range(0, len(byte_data), 3):
            chunk = byte_data[i:i + 3]
            encoded_chunk, chunk_padding = self._encode_chunk(chunk)
            result.append(encoded_chunk)
            if chunk_padding:
                padding = chunk_padding

        return ''.join(result) + padding

    def encode_string(self, text):
        byte_data = self._string_to_bytes(text)
        return self.encode_bytes(byte_data)

    def _decode_chunk(self, chunk_chars):
        part1 = self._encode_bits(self._index_from_char(chunk_chars[0]), self.mask1, False)
        part2 = self._encode_bits(self._index_from_char(chunk_chars[1]), self.mask2, False)
        part3 = self._encode_bits(self._index_from_char(chunk_chars[2]), self.mask3, False)
        part4 = self._encode_bits(self._index_from_char(chunk_chars[3]), self.mask4, False)

        combined = part1 + part2 + part3 + part4

        bytes_result = []

        byte1 = (combined >> 16) & 255
        bytes_result.append(byte1)

        if chunk_chars[2] != self.padding_char:
            byte2 = (combined >> 8) & 255
            bytes_result.append(byte2)

            if chunk_chars[3] != self.padding_char:
                byte3 = combined & 255
                bytes_result.append(byte3)

        return bytes_result

    def decode_string(self, encoded_text):
        text = encoded_text
        padding_needed = (4 - len(text) % 4) % 4
        text += self.padding_char * padding_needed

        result_bytes = []

        for i in range(0, len(text), 4):
            chunk = text[i:i + 4]
            decoded_chunk = self._decode_chunk(chunk)
            result_bytes.extend(decoded_chunk)

        return self._bytes_to_string(result_bytes)


def md5_str(text):
    md5 = hashlib.md5()
    md5.update(text.encode('utf-8'))
    return md5.hexdigest()


class Geetest:
    def __init__(self):
        self.base64 = CustomBase64()
        self.rsa_hex_n = "00C1E3934D1614465B33053E7F48EE4EC87B14B95EF88947713D25EECBFF7E74C7977D02DC1D9451F79DD5D1C10C29ACB6A9B4D6FB7D0A0279B6719E1772565F09AF627715919221AEF91899CAE08C0D686D748B20A3603BE2318CA6BC2B59706592A9219D0BF05C9F65023A21D2330807252AE0066D59CEEFA5F2748EA80BAB81"
        self.aes_key = ""
        self.challenge = ""
        self.gt = ""
        self.pt = "M?d8Pjp8Pjp8Pjp8Pjp8Pjp8PjAA(U*P,,e858(),,ne5)(,bb5-88(,q5b8b5bn8bbn,(e5bb)I(b,n(9,).:(C*(?/)(U-)3,M?M97)(NM91cM97)(NBUg/1j1*-j-)M93-M?M9-U/)3)(DjT.c1@M939M?/)MN1E/*?O1cM93)(?M9/)(N1c3)(j/)M97,M?MM-U-)1?M9/)MU-,1iME21-)5U/)MU1?M9/)(j1*5U-)1E-*M9-N3*(?-U3)3)M?ME-U5)1E7*6)NI11-.5?7)(?-QM93)(E-*-dL49c3)).6p1i6OQ.gE,(A(q5qbq5b,be((5(8e(q5,((5((,(((q5b8be,((58,e5bq,(,5,be5((((((be,bcWS:U/-M9G)(NM91j/*M9/,(51)151)M9,*M?bE.5-*EA4))5-/?5--H)(N1?(?MM(@-NME3)N1-/?))QF1-/ME?)(SME9S3)N1219dM95Q(9-)*)(M-*-*(E-(M9/)(*M9(E1(1*ME*)(U1(-1-**)(93)M)1)(9M91)MM*)(M3)(E1(/)(*Mb(U-(-1-*M9*)(M/)MN(M3)M-M91?*)MU-)(E/(/)()M9(9-N(N1@-M-,(Y1)(Y/),)(9/*((,qq(((((((((0qqj*aM55n5q(8b5,(5e(,,(e((((((5nbe,b(b,(5((,,(((585e555n,8b(5,5d6S91/*(U-(3.(51)1E3(/*(5-)N1(M-U-(bE3)M*(U7(-*bM-)(I?*@)(QbE1*(MbM2*ME(M?)M*MU(N(9-N9*(9-M-5-)4)MI3*0)MN@)(NbE1?b90)MN1)8*(?-*b9-M-Y/)1?-M-db95@b91?5?-N1I/*.55*M9(I-*0)MNb915-*9U/(-Y/),)(E-(-)ME(E-(M93)()1)(U/(-)MM(E-(/*M(Lqqqqqqqqqqqqb(("
        self.s = ""
        self.c = []
        self.validate_token = ""

    @staticmethod
    def get_aes_key():
        return secrets.token_hex(8)

    def rsa_encrypt(self, text):
        key = RSA.construct((int(self.rsa_hex_n, 16), int("10001", 16)))

        cipher = PKCS1_v1_5.new(key)

        ciphertext = cipher.encrypt(text.encode())

        hex_result = ciphertext.hex()
        if len(hex_result) % 2 == 1:
            hex_result = '0' + hex_result
        return hex_result

    def aes_encrypt(self, data: str, key: str):
        iv = b'0000000000000000'

        cipher = AES.new(key.encode("latin1"), AES.MODE_CBC, iv)
        ciphertext = cipher.encrypt(pad(data.encode(), 16))

        return self.base64.encode_bytes(ciphertext)

    def register(self):
        url = "https://demos.geetest.com/gt/register-fullpage"
        params = {
            "t": str(int(time.time() * 1000))
        }
        response = requests.get(url, headers={
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "referer": "https://demos.geetest.com/fullpage.html",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
            "x-requested-with": "XMLHttpRequest"
        }, params=params)
        print("register===>: " + response.text)
        data_json = response.json()
        self.challenge = data_json['challenge']
        self.gt = data_json['gt']

    def get_type_php(self):
        url = "https://apiv6.geetest.com/gettype.php"
        params = {
            "gt": self.gt,
            "callback": "geetest_" + str(int(time.time() * 1000))
        }
        response = requests.get(url, headers={
            "accept": "*/*",
            "accept-language": "zh,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "referer": "https://demos.geetest.com/",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "script",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
        }, params=params)

        print("gettype===>: " + response.text)

    def get_php(self):
        url = "https://apiv6.geetest.com/get.php"
        w = self.get_w1()
        ts = str(int(time.time() * 1000))
        params = {
            "gt": self.gt,
            "challenge": self.challenge,
            "lang": "zh-cn",
            "pt": "0",
            "client_type": "web",
            "w": w,
            "callback": "geetest_" + ts
        }
        response = requests.get(url, headers={
            "accept": "*/*",
            "accept-language": "zh,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "referer": "https://demos.geetest.com/",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "script",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
        }, params=params)

        rt = response.text
        print("get_php===>: " + rt)
        rt = rt.replace("geetest_" + ts + "(", "")[:-1]
        get_json = json.loads(rt)
        self.s = get_json['data']['s']
        self.c = get_json['data']['c']

    def ajax_php(self):
        url = "https://api.geevisit.com/ajax.php"
        w = self.get_w2()
        ts = str(int(time.time() * 1000))
        params = {
            "gt": self.gt,
            "challenge": self.challenge,
            "lang": "zh-cn",
            "pt": "0",
            "client_type": "web",
            "w": w,
            "callback": "geetest_" + ts
        }
        resp = requests.get(url, headers={
            "Accept": "*/*",
            "Accept-Language": "zh,en;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://demos.geetest.com/",
            "Sec-Fetch-Dest": "script",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "cross-site",
            "Sec-Fetch-Storage-Access": "active",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\""
        }, params=params)
        rt = resp.text
        print("ajax_php===>: " + rt)
        rt = rt.replace("geetest_" + ts + "(", "")[:-1]
        ajax_json = json.loads(rt)
        self.validate_token = ajax_json["data"]["validate"]

    def validata(self):
        url = "https://demos.geetest.com/gt/validate-fullpage"
        data = {
            "geetest_challenge": self.challenge,
            "geetest_validate": self.validate_token,
            "geetest_seccode": f"{self.validate_token}|jordan"
        }
        response = requests.post(url, headers={
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://demos.geetest.com",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "referer": "https://demos.geetest.com/fullpage.html",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
            "x-requested-with": "XMLHttpRequest"
        }, data=data)

        print("validate===>: " + response.text)

    def get_w1(self):
        data = {
            "gt": self.gt,
            "challenge": self.challenge,
            "offline": False,
            "new_captcha": True,
            "product": "float",
            "width": "300px",
            "https": True,
            "api_server": "apiv6.geetest.com",
            "protocol": "https://",
            "type": "fullpage",
            "static_servers": [
                "static.geetest.com/",
                "static.geevisit.com/"
            ],
            "beeline": "/static/js/beeline.1.0.1.js",
            "voice": "/static/js/voice.1.2.6.js",
            "click": "/static/js/click.3.1.2.js",
            "fullpage": "/static/js/fullpage.9.2.0-guwyxh.js",
            "slide": "/static/js/slide.7.9.3.js",
            "geetest": "/static/js/geetest.6.0.9.js",
            "aspect_radio": {
                "slide": 103,
                "click": 128,
                "voice": 128,
                "beeline": 50
            },
            "cc": 20,
            "ww": True,
            "i": "-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1"
        }
        self.aes_key = g.get_aes_key()
        r = self.rsa_encrypt(self.aes_key)
        i = self.aes_encrypt(json.dumps(data, separators=(",", ":")), self.aes_key)
        return i + r

    def get_w2(self):
        pass_time = random.randint(1500, 3000)
        ts = int(time.time() * 1000)

        def tz(e, t, n):
            o, i, s, a, _ = 0, e, t[0], t[2], t[4]
            while o < len(n):
                r = n[o:o + 2]
                o += 2
                if not r:
                    break
                c = int(r, 16)
                l = chr(c)
                u = (s * c * c + a * c + _) % len(e)
                i = i[:u] + l + i[u:]
            return i

        data = {
            "lang": "zh-cn",
            "type": "fullpage",
            "tt": tz(self.pt, self.c, self.s),
            "light": "SPAN_0",
            "s": "c7c3e21112fe4f741921cb3e4ff9f7cb",
            "h": "321f9af1e098233dbd03f250fd2b5e21",
            "hh": "39bd9cad9e425c3a8f51610fd506e3b3",
            "hi": "09eb21b3ae9542a9bc1e8b63b3d9a467",
            "vip_order": -1,
            "ct": -1,
            "ep": {
                "v": "9.2.0-guwyxh",
                "te": False,
                "$_BBn": True,
                "ven": "Google Inc. (Intel)",
                "ren": "ANGLE (Intel, Mesa Intel(R) Iris(R) Xe Graphics (ADL GT2), OpenGL ES 3.2)",
                "fp": ["move", 195, 566, ts + random.randint(1500, 1800), "pointermove"],
                "lp": ["up", 441, 309, ts + random.randint(1800, 2000), "pointerup"],
                "em": {"ph": 0, "cp": 0, "ek": "11", "wd": 1, "nt": 0, "si": 0, "sc": 0},
                "tm": {
                    "a": ts,
                    "b": ts + 50,
                    "c": ts + 50,
                    "d": 0,
                    "e": 0,
                    "f": ts + 1,
                    "g": ts + 1,
                    "h": ts + 1,
                    "i": ts + 1,
                    "j": ts + 1,
                    "k": 0,
                    "l": ts + 4,
                    "m": ts + 40,
                    "n": ts + 44,
                    "o": ts + 52,
                    "p": ts + 148,
                    "q": ts + 148,
                    "r": ts + 150,
                    "s": ts + 152,
                    "t": ts + 152,
                    "u": ts + 152
                },
                "dnf": "dnf",
                "by": 0
            },
            "passtime": pass_time,
            "rp": md5_str(self.gt + self.challenge + str(pass_time)),
            "captcha_token": "508161639",
            "tsfq": "xovrayel"
        }
        return self.aes_encrypt(json.dumps(data, separators=(",", ":")), self.aes_key)


if __name__ == '__main__':
    g = Geetest()
    g.register()
    g.get_type_php()
    g.get_php()
    g.ajax_php()
    g.validata()
```

## 滑块

```python
import hashlib
import json
import os
import random
import secrets
import time

import ddddocr
import requests
from Crypto.Cipher import PKCS1_v1_5, AES
from Crypto.PublicKey import RSA
from Crypto.Util.Padding import pad
from PIL import Image

class CustomBase64:
    def __init__(self):
        self.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()'
        self.padding_char = '.'

        self.mask1 = 7274496
        self.mask2 = 9483264
        self.mask3 = 19220
        self.mask4 = 235

        self.bit_length = 24

    @staticmethod
    def _get_bit(number, position):
        return (number >> position) & 1

    def _char_from_index(self, index):
        if 0 <= index < len(self.alphabet):
            return self.alphabet[index]
        return self.padding_char

    def _index_from_char(self, char):
        return self.alphabet.find(char)

    @staticmethod
    def _string_to_bytes(text):
        return [ord(c) for c in text]

    @staticmethod
    def _bytes_to_string(byte_array):
        return ''.join(chr(b) for b in byte_array)

    def _encode_bits(self, data_byte, mask_byte, is_encoding=True):
        result = 0

        if is_encoding:
            for bit_pos in range(self.bit_length - 1, -1, -1):
                if self._get_bit(mask_byte, bit_pos) == 1:
                    data_bit = self._get_bit(data_byte, bit_pos)
                    result = (result << 1) + data_bit
        else:
            if data_byte < 0:
                return 0

            mask_bit_pos = 5
            for bit_pos in range(self.bit_length - 1, -1, -1):
                if self._get_bit(mask_byte, bit_pos) == 1:
                    data_bit = self._get_bit(data_byte, mask_bit_pos)
                    result += (data_bit << bit_pos)
                    mask_bit_pos -= 1

        return result

    def _encode_chunk(self, chunk_bytes):
        if len(chunk_bytes) == 3:
            combined = (chunk_bytes[0] << 16) + (chunk_bytes[1] << 8) + chunk_bytes[2]

            char1 = self._char_from_index(self._encode_bits(combined, self.mask1, True))
            char2 = self._char_from_index(self._encode_bits(combined, self.mask2, True))
            char3 = self._char_from_index(self._encode_bits(combined, self.mask3, True))
            char4 = self._char_from_index(self._encode_bits(combined, self.mask4, True))

            return char1 + char2 + char3 + char4, ''

        elif len(chunk_bytes) == 2:
            combined = (chunk_bytes[0] << 16) + (chunk_bytes[1] << 8)

            char1 = self._char_from_index(self._encode_bits(combined, self.mask1, True))
            char2 = self._char_from_index(self._encode_bits(combined, self.mask2, True))
            char3 = self._char_from_index(self._encode_bits(combined, self.mask3, True))

            return char1 + char2 + char3, self.padding_char

        elif len(chunk_bytes) == 1:
            combined = chunk_bytes[0] << 16

            char1 = self._char_from_index(self._encode_bits(combined, self.mask1, True))
            char2 = self._char_from_index(self._encode_bits(combined, self.mask2, True))

            return char1 + char2, self.padding_char * 2

    def encode_bytes(self, byte_data):
        result = []
        padding = ''

        for i in range(0, len(byte_data), 3):
            chunk = byte_data[i:i + 3]
            encoded_chunk, chunk_padding = self._encode_chunk(chunk)
            result.append(encoded_chunk)
            if chunk_padding:
                padding = chunk_padding

        return ''.join(result) + padding

    def encode_string(self, text):
        byte_data = self._string_to_bytes(text)
        return self.encode_bytes(byte_data)

    def _decode_chunk(self, chunk_chars):
        part1 = self._encode_bits(self._index_from_char(chunk_chars[0]), self.mask1, False)
        part2 = self._encode_bits(self._index_from_char(chunk_chars[1]), self.mask2, False)
        part3 = self._encode_bits(self._index_from_char(chunk_chars[2]), self.mask3, False)
        part4 = self._encode_bits(self._index_from_char(chunk_chars[3]), self.mask4, False)

        combined = part1 + part2 + part3 + part4

        bytes_result = []

        byte1 = (combined >> 16) & 255
        bytes_result.append(byte1)

        if chunk_chars[2] != self.padding_char:
            byte2 = (combined >> 8) & 255
            bytes_result.append(byte2)

            if chunk_chars[3] != self.padding_char:
                byte3 = combined & 255
                bytes_result.append(byte3)

        return bytes_result

    def decode_string(self, encoded_text):
        text = encoded_text
        padding_needed = (4 - len(text) % 4) % 4
        text += self.padding_char * padding_needed

        result_bytes = []

        for i in range(0, len(text), 4):
            chunk = text[i:i + 4]
            decoded_chunk = self._decode_chunk(chunk)
            result_bytes.extend(decoded_chunk)

        return self._bytes_to_string(result_bytes)


def md5_str(text):
    md5 = hashlib.md5()
    md5.update(text.encode('utf-8'))
    return md5.hexdigest()


class Geetest:
    def __init__(self):
        self.base64 = CustomBase64()
        self.rsa_hex_n = "00C1E3934D1614465B33053E7F48EE4EC87B14B95EF88947713D25EECBFF7E74C7977D02DC1D9451F79DD5D1C10C29ACB6A9B4D6FB7D0A0279B6719E1772565F09AF627715919221AEF91899CAE08C0D686D748B20A3603BE2318CA6BC2B59706592A9219D0BF05C9F65023A21D2330807252AE0066D59CEEFA5F2748EA80BAB81"
        self.aes_key = ""
        self.challenge = ""
        self.gt = ""
        self.pt = "M?d8Pjp8Pjp8Pjp8Pjp8Pjp8PjAA(U*P,,e858(),,ne5)(,bb5-88(,q5b8b5bn8bbn,(e5bb)I(b,n(9,).:(C*(?/)(U-)3,M?M97)(NM91cM97)(NBUg/1j1*-j-)M93-M?M9-U/)3)(DjT.c1@M939M?/)MN1E/*?O1cM93)(?M9/)(N1c3)(j/)M97,M?MM-U-)1?M9/)MU-,1iME21-)5U/)MU1?M9/)(j1*5U-)1E-*M9-N3*(?-U3)3)M?ME-U5)1E7*6)NI11-.5?7)(?-QM93)(E-*-dL49c3)).6p1i6OQ.gE,(A(q5qbq5b,be((5(8e(q5,((5((,(((q5b8be,((58,e5bq,(,5,be5((((((be,bcWS:U/-M9G)(NM91j/*M9/,(51)151)M9,*M?bE.5-*EA4))5-/?5--H)(N1?(?MM(@-NME3)N1-/?))QF1-/ME?)(SME9S3)N1219dM95Q(9-)*)(M-*-*(E-(M9/)(*M9(E1(1*ME*)(U1(-1-**)(93)M)1)(9M91)MM*)(M3)(E1(/)(*Mb(U-(-1-*M9*)(M/)MN(M3)M-M91?*)MU-)(E/(/)()M9(9-N(N1@-M-,(Y1)(Y/),)(9/*((,qq(((((((((0qqj*aM55n5q(8b5,(5e(,,(e((((((5nbe,b(b,(5((,,(((585e555n,8b(5,5d6S91/*(U-(3.(51)1E3(/*(5-)N1(M-U-(bE3)M*(U7(-*bM-)(I?*@)(QbE1*(MbM2*ME(M?)M*MU(N(9-N9*(9-M-5-)4)MI3*0)MN@)(NbE1?b90)MN1)8*(?-*b9-M-Y/)1?-M-db95@b91?5?-N1I/*.55*M9(I-*0)MNb915-*9U/(-Y/),)(E-(-)ME(E-(M93)()1)(U/(-)MM(E-(/*M(Lqqqqqqqqqqqqb(("
        self.s = ""
        self.c = []
        self.ut = [39, 38, 48, 49, 41, 40, 46, 47, 35, 34, 50, 51, 33, 32, 28, 29, 27, 26, 36, 37, 31, 30, 44, 45, 43,
                   42, 12, 13, 23, 22, 14, 15, 21, 20, 8, 9, 25, 24, 6, 7, 3, 2, 0, 1, 11, 10, 4, 5, 19, 18, 16, 17]
        self.distance = 0
        self.validate_token = ""

    @staticmethod
    def get_aes_key():
        return secrets.token_hex(8)

    def rsa_encrypt(self, text):
        key = RSA.construct((int(self.rsa_hex_n, 16), int("10001", 16)))

        cipher = PKCS1_v1_5.new(key)

        ciphertext = cipher.encrypt(text.encode())

        hex_result = ciphertext.hex()
        if len(hex_result) % 2 == 1:
            hex_result = '0' + hex_result
        return hex_result

    def aes_encrypt(self, data: str, key: str):
        iv = b'0000000000000000'

        cipher = AES.new(key.encode("latin1"), AES.MODE_CBC, iv)
        ciphertext = cipher.encrypt(pad(data.encode(), 16))

        return self.base64.encode_bytes(ciphertext)

    def register(self):
        url = "https://demos.geetest.com/gt/register-slide"
        params = {
            "t": str(int(time.time() * 1000))
        }
        response = requests.get(url, headers={
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "referer": "https://demos.geetest.com/slide-float.html",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
            "x-requested-with": "XMLHttpRequest"
        }, params=params)
        data_json = response.json()
        self.challenge = data_json['challenge']
        self.gt = data_json['gt']

    def get_type_php(self):
        url = "https://apiv6.geetest.com/gettype.php"
        params = {
            "gt": self.gt,
            "callback": "geetest_" + str(int(time.time() * 1000))
        }
        response = requests.get(url, headers={
            "accept": "*/*",
            "accept-language": "zh,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "referer": "https://demos.geetest.com/",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "script",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
        }, params=params)

        print(response.text)

    def get_w1(self):
        data = {
            "gt": self.gt,
            "challenge": self.challenge,
            "offline": False,
            "new_captcha": True,
            "product": "float",
            "width": "300px",
            "https": True,
            "api_server": "apiv6.geetest.com",
            "protocol": "https://",
            "type": "fullpage",
            "static_servers": [
                "static.geetest.com/",
                "static.geevisit.com/"
            ],
            "beeline": "/static/js/beeline.1.0.1.js",
            "voice": "/static/js/voice.1.2.6.js",
            "click": "/static/js/click.3.1.2.js",
            "fullpage": "/static/js/fullpage.9.2.0-guwyxh.js",
            "slide": "/static/js/slide.7.9.3.js",
            "geetest": "/static/js/geetest.6.0.9.js",
            "aspect_radio": {
                "slide": 103,
                "click": 128,
                "voice": 128,
                "beeline": 50
            },
            "cc": 20,
            "ww": True,
            "i": "-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1"
        }
        self.aes_key = g.get_aes_key()
        r = self.rsa_encrypt(self.aes_key)
        i = self.aes_encrypt(json.dumps(data, separators=(",", ":")), self.aes_key)
        return i + r

    def get_php(self):
        url = "https://apiv6.geetest.com/get.php"
        w = self.get_w1()
        ts = str(int(time.time() * 1000))
        params = {
            "gt": self.gt,
            "challenge": self.challenge,
            "lang": "zh-cn",
            "pt": "0",
            "client_type": "web",
            "w": w,
            "callback": "geetest_" + ts
        }
        response = requests.get(url, headers={
            "accept": "*/*",
            "accept-language": "zh,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "referer": "https://demos.geetest.com/",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "script",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
        }, params=params)

        rt = response.text
        rt = rt.replace("geetest_" + ts + "(", "")[:-1]
        get_json = json.loads(rt)
        self.s = get_json['data']['s']
        self.c = get_json['data']['c']

    def get_w2(self):
        pass_time = random.randint(1500, 3000)
        ts = int(time.time() * 1000)

        def tz(e, t, n):
            o, i, s, a, _ = 0, e, t[0], t[2], t[4]
            while o < len(n):
                r = n[o:o + 2]
                o += 2
                if not r:
                    break
                c = int(r, 16)
                l = chr(c)
                u = (s * c * c + a * c + _) % len(e)
                i = i[:u] + l + i[u:]
            return i

        data = {
            "lang": "zh-cn",
            "type": "fullpage",
            "tt": tz(self.pt, self.c, self.s),
            "light": "DIV_0",
            "s": "c7c3e21112fe4f741921cb3e4ff9f7cb",
            "h": "321f9af1e098233dbd03f250fd2b5e21",
            "hh": "39bd9cad9e425c3a8f51610fd506e3b3",
            "hi": "09eb21b3ae9542a9bc1e8b63b3d9a467",
            "vip_order": -1,
            "ct": -1,
            "ep": {
                "v": "9.2.0-guwyxh",
                "te": False,
                "$_BBn": True,
                "ven": "Google Inc. (Intel)",
                "ren": "ANGLE (Intel, Mesa Intel(R) Iris(R) Xe Graphics (ADL GT2), OpenGL ES 3.2)",
                "fp": ["move", 195, 566, ts + random.randint(1500, 1800), "pointermove"],
                "lp": ["up", 441, 309, ts + random.randint(1800, 2000), "pointerup"],
                "em": {"ph": 0, "cp": 0, "ek": "11", "wd": 1, "nt": 0, "si": 0, "sc": 0},
                "tm": {
                    "a": ts,
                    "b": ts + 50,
                    "c": ts + 50,
                    "d": 0,
                    "e": 0,
                    "f": ts + 1,
                    "g": ts + 1,
                    "h": ts + 1,
                    "i": ts + 1,
                    "j": ts + 1,
                    "k": 0,
                    "l": ts + 4,
                    "m": ts + 40,
                    "n": ts + 44,
                    "o": ts + 52,
                    "p": ts + 148,
                    "q": ts + 148,
                    "r": ts + 150,
                    "s": ts + 152,
                    "t": ts + 152,
                    "u": ts + 152
                },
                "dnf": "dnf",
                "by": 0
            },
            "passtime": pass_time,
            "rp": md5_str(self.gt + self.challenge + str(pass_time)),
            "captcha_token": "508161639",
            "tsfq": "xovrayel"
        }
        return self.aes_encrypt(json.dumps(data, separators=(",", ":")), self.aes_key)

    def ajax_php(self):
        url = "https://api.geevisit.com/ajax.php"
        w = self.get_w2()
        ts = str(int(time.time() * 1000))
        params = {
            "gt": self.gt,
            "challenge": self.challenge,
            "lang": "zh-cn",
            "pt": "0",
            "client_type": "web",
            "w": w,
            "callback": "geetest_" + ts
        }
        resp = requests.get(url, headers={
            "Accept": "*/*",
            "Accept-Language": "zh,en;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://demos.geetest.com/",
            "Sec-Fetch-Dest": "script",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "cross-site",
            "Sec-Fetch-Storage-Access": "active",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\""
        }, params=params)
        print(resp.text)

    def get_php2(self):
        url = "https://api.geevisit.com/get.php"
        ts = str(int(time.time() * 1000))
        params = {
            "is_next": "true",
            "type": "slide3",
            "gt": self.gt,
            "challenge": self.challenge,
            "lang": "zh-cn",
            "https": "true",
            "protocol": "https://",
            "offline": "false",
            "product": "embed",
            "api_server": "api.geevisit.com",
            "isPC": "true",
            "autoReset": "true",
            "width": "100%",
            "callback": "geetest_" + ts
        }
        response = requests.get(url, headers={
            "Accept": "*/*",
            "Accept-Language": "zh,en;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://demos.geetest.com/",
            "Sec-Fetch-Dest": "script",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "cross-site",
            "Sec-Fetch-Storage-Access": "active",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\""
        }, params=params)

        rt = response.text
        print(rt)
        rt = rt.replace("geetest_" + ts + "(", "")[:-1]
        get_json = json.loads(rt)
        self.s = get_json['s']
        self.c = get_json['c']
        self.challenge = get_json['challenge']
        bg = "https://static.geetest.com/" + get_json['bg']
        self.req_img(bg, 'bg.png')
        img = Image.open("./img/bg.png")
        result = self.ben(img)
        result.save("./img/bg.png")
        fullbg = "https://static.geetest.com/" + get_json['fullbg']
        self.req_img(fullbg, 'fullbg.png')
        img = Image.open("./img/fullbg.png")
        result = self.ben(img)
        result.save("./img/fullbg.png")

        slice_img = "https://static.geetest.com/" + get_json['slice']
        self.req_img(slice_img, 'slice.png')

        det = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False)

        with open('./img/slice.png', 'rb') as f:
            target_bytes = f.read()

        with open('./img/bg.png', 'rb') as f:
            background_bytes = f.read()

        res = det.slide_match(target_bytes, background_bytes, simple_target=True)
        print(res)

        self.distance = res['target'][0]

    def get_w3(self):
        track_list, pass_time = self.get_slide_track(self.distance)
        ts = int(time.time() * 1000)
        data = {
            'lang': 'zh-cn',
            'userresponse': self.h(self.distance, self.challenge),
            'passtime': pass_time,
            'imgload': random.randint(50, 100),
            'aa': self.get_aa(self.tp(track_list), self.c, self.s),
            'ep': {
                "v": "7.9.3",
                "$_BIT": False,
                "me": True,
                "tm": {
                    "a": ts,
                    "b": ts + 50,
                    "c": ts + 50,
                    "d": 0,
                    "e": 0,
                    "f": ts + 1,
                    "g": ts + 1,
                    "h": ts + 1,
                    "i": ts + 1,
                    "j": ts + 1,
                    "k": 0,
                    "l": ts + 4,
                    "m": ts + 40,
                    "n": ts + 44,
                    "o": ts + 52,
                    "p": ts + 148,
                    "q": ts + 148,
                    "r": ts + 150,
                    "s": ts + 152,
                    "t": ts + 152,
                    "u": ts + 152
                },
                "td": -1
            },
            'h9s9': '1816378497',
            'rp': md5_str(self.gt + self.challenge[:32] + str(pass_time)),
        }

        self.aes_key = g.get_aes_key()
        r = self.rsa_encrypt(self.aes_key)
        i = self.aes_encrypt(json.dumps(data, separators=(",", ":")), self.aes_key)
        return i + r

    def ajax_php2(self):
        url = "https://api.geevisit.com/ajax.php"
        w = self.get_w3()
        ts = str(int(time.time() * 1000))
        params = {
            "gt": self.gt,
            "challenge": self.challenge,
            "lang": "zh-cn",
            "$_BCm": "0",
            "client_type": "web",
            "w": w,
            "callback": "geetest_" + ts
        }
        response = requests.get(url, headers={
            "Accept": "*/*",
            "Accept-Language": "zh,en;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://demos.geetest.com/",
            "Sec-Fetch-Dest": "script",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "cross-site",
            "Sec-Fetch-Storage-Access": "active",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\""
        }, params=params)
        rt = response.text
        data_json = json.loads(rt.replace("geetest_" + ts + "(", "")[:-1])
        print(data_json)
        if data_json.get("success", 0) == 0:
            raise RuntimeError("验证失败")
        self.validate_token = data_json['validate']

    def validate(self):
        url = "https://demos.geetest.com/gt/validate-slide"
        data = {
            "geetest_challenge": self.challenge,
            "geetest_validate": self.validate_token,
            "geetest_seccode": f"{self.validate_token}|jordan"
        }
        response = requests.post(url, headers={
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://demos.geetest.com",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "referer": "https://demos.geetest.com/slide-float.html",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
            "x-requested-with": "XMLHttpRequest"
        }, data=data)

        print(response.text)
        print(response)

    @staticmethod
    def h(t, e: str) -> str:
        n = e[-2:]

        r = []
        for ch in n:
            o = ord(ch)
            if o > 57:
                r.append(o - 87)
            else:
                r.append(o - 48)

        n_val = 36 * r[0] + r[1]

        a = round(t) + n_val

        buckets = [[], [], [], [], []]
        seen = {}

        u = 0
        core = e[:-2]

        for ch in core:
            if ch not in seen:
                seen[ch] = 1
                buckets[u].append(ch)
                u = 0 if (u + 1) == 5 else (u + 1)

        f = a
        d = 4
        p = ''

        g = [1, 2, 5, 10, 50]

        while f > 0:
            if f >= g[d]:
                h = int(random.random() * len(buckets[d]))
                p += buckets[d][h]
                f -= g[d]
            else:
                buckets.pop(d)
                g.pop(d)
                d -= 1

        return p

    @staticmethod
    def _encode_num(t: int) -> str:
        e = '()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqr'
        base = len(e)

        r = ''
        i = abs(t)

        o = int(i // base)

        if o >= base:
            o = base - 1

        if o:
            r = e[o]

        s = ''
        if t < 0:
            s += '!'

        if r:
            s += '$'

        i %= base
        return s + r + e[i]

    def tp(self, track_list):
        diffs = []
        o, e, n = 0, 0, 0

        for s in range(len(track_list) - 1):
            e = round(track_list[s + 1][0] - track_list[s][0])
            n = round(track_list[s + 1][1] - track_list[s][1])
            r = round(track_list[s + 1][2] - track_list[s][2])

            if e == 0 and n == 0 and r == 0:
                continue

            if e == 0 and n == 0:
                o += r
            else:
                diffs.append([e, n, r + o])
                o = 0

        if o != 0:
            diffs.append([e, n, o])
        r_list = []
        i_list = []
        o_list = []

        special = [
            [1, 0], [2, 0], [1, -1], [1, 1],
            [0, 1], [0, -1], [3, 0], [2, -1], [2, 1]
        ]
        special_chars = 'stuvwxyz~'

        for t in diffs:
            e = 0
            for idx, pair in enumerate(special):
                if t[0] == pair[0] and t[1] == pair[1]:
                    e = special_chars[idx]
                    break

            if e:
                i_list.append(e)
            else:
                r_list.append(self._encode_num(t[0]))
                i_list.append(self._encode_num(t[1]))

            o_list.append(self._encode_num(t[2]))

        return ''.join(r_list) + '!!' + ''.join(i_list) + '!!' + ''.join(o_list)

    @staticmethod
    def get_aa(t: str, e, n: str) -> str:
        if not e or not n:
            return t

        i = 0
        o = t

        s = e[0]
        a = e[2]
        _ = e[4]

        base_len = len(t)

        while True:
            r = n[i:i + 2]
            if not r:
                break

            i += 2

            c = int(r, 16)
            u = chr(c)

            l = (s * c * c + a * c + _) % base_len

            o = o[:l] + u + o[l:]

        return o

    @staticmethod
    def _ease_out_expo(sep):
        if sep == 1:
            return 1
        else:
            return 1 - pow(2, -10 * sep)

    def get_slide_track(self, distance):
        if not isinstance(distance, int) or distance < 0:
            raise ValueError(f"distance类型必须是大于等于0的整数: distance: {distance}, type: {type(distance)}")
        slide_track = [
            [random.randint(-50, -10), random.randint(-50, -10), 0],
            [0, 0, 0],
        ]
        count = 10 + int(distance / 2)
        t = random.randint(50, 100)
        _x = 0
        _y = 0
        for i in range(count):
            x = round(self._ease_out_expo(i / count) * distance)
            # y = round(__ease_out_expo(i / count) * 14)
            t += random.randint(10, 50)
            if x == _x:
                continue
            slide_track.append([x, _y, t])
            _x = x
        slide_track.append(slide_track[-1])
        return slide_track, slide_track[-1][2]

    @staticmethod
    def req_img(url, path):
        os.makedirs("img", exist_ok=True)
        resp = requests.get(url)
        with open(os.path.join("img", path), 'wb') as f:
            f.write(resp.content)

    def ben(self, src_img: Image.Image) -> Image.Image:
        n, r = src_img.size
        a = r // 2

        dst = Image.new("RGBA", (260, r))

        for idx in range(52):
            c = (self.ut[idx] % 26) * 12 + 1
            u = a if self.ut[idx] > 25 else 0

            tile = src_img.crop((c, u, c + 10, u + a))

            x = (idx % 26) * 10
            y = a if idx > 25 else 0

            dst.paste(tile, (x, y))

        return dst


if __name__ == '__main__':
    g = Geetest()
    g.register()
    g.get_type_php()
    g.get_php()
    g.ajax_php()
    g.get_php2()
    g.ajax_php2()
    g.validate()
```