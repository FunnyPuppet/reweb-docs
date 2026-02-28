# RootData

::: info
地址: https://www.rootdata.com/
:::

```python
import uuid
import requests
import json
import base64
import hashlib
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives import serialization
from Crypto.Cipher import AES
from tenacity import retry, stop_after_attempt, wait_fixed


def wrap_pem(key_str, key_type="PRIVATE KEY"):
    lines = "\n".join([key_str[i:i + 64] for i in range(0, len(key_str), 64)])
    return f"-----BEGIN {key_type}-----\n{lines}\n-----END {key_type}-----"


def sign(text):
    key_str = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALrahjsqWFxNInIYWMakRU0Aa5KEZE/PVP/qz2585WeDLdQdahbn9bjP0OeFLoWsp+bVcAp38MUaT/Qe/EWcEaVdy+x1Cmbv3zFkB3i24mQVCyrDr3gR/Y9U4Umz/r26nt65T+tVr54IKutykdLSmqEkQKRLTENBWoWAtpCRtmjtAgMBAAECgYBWrIcXas0SA7W2txR3EDwVO9yqWj8txj7nd0RBPC4tlevsOLi9Z1vUHpII0v6Bg1Ve/iK6uGg3Bb2Qv87Fe1+zSZvhceGjaoJWispTu6RLw3rspeyX9lKVDTXH3qksubuGKs0u4KZgP6KrnmAEz1ur408VWznvRQthy5nC8ZqdAQJBAPINlbD7KzZjQXKxJH8deRqQiB0LfT4W602cDt5LYPC2q7bDrJUz5aopeCO3KCUrzNE4t10C+qvyfNJsjd3yx48CQQDFnrepFg9ttqx2uCkNQm4lidwKrBTxL02HctziwuVjKweSSKkT11VrdGvBA1SV/BLZz2XWcZ2+80tRFrAlxanDAkA3VJ2kQDYHj7bVReMG37DgPquuoAK4H7sYGZVYgTierdMgyyf3T06vkB0zZNnbbWC7btCThWvRxHN+Emx3kNjHAkEAltL11SSzDccXhVw0aJxEuH2o5LRFH3Y8s52km6SnsbILi0fNUwlLdkFaY+sIyZejQ30Yejwoaq4A05h/Q7TCRQJBAIRXev2oHDvfCUG9oBBfC38GoxuSCj5Q6GEa0Fq734qUZY/F8YdEu37UNYnOOi+54zzusVJR/ZI3xlnewvrtg9M="
    pem = wrap_pem(key_str, "PRIVATE KEY")

    private_key = serialization.load_pem_private_key(
        pem.encode(),
        password=None
    )

    signature = private_key.sign(
        text.encode("utf-8"),
        padding.PKCS1v15(),
        hashes.SHA1()
    )

    return base64.b64encode(signature).decode()


def rsa_encrypt(text):
    key_str = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCcsTTLN8owkUCNgMuegNMNa3rPuUfFc1nhU3u1RdRj9xEgW9Nf7MvtnUFV8XO1B2v0P9bQPOOG3063zxKK2ycjO9RN0zmczQedFWpXOCkU5zBgXK3Obf/xRFBNTVwuhAXBc4eWM8Ibrv7Da6Hqs63EC0TuADErNW08LG66FL255QIDAQAB"
    pem = wrap_pem(key_str, "PUBLIC KEY")

    public_key = serialization.load_pem_public_key(
        pem.encode()
    )

    encrypted = public_key.encrypt(
        text.encode("utf-8"),
        padding.PKCS1v15()
    )

    return base64.b64encode(encrypted).decode()


def aes_decrypt(cipher_text):
    key = b"shjkhd9477k@326h"

    cipher_bytes = base64.b64decode(cipher_text)

    cipher = AES.new(key, AES.MODE_ECB)
    decrypted = cipher.decrypt(cipher_bytes)

    pad_len = decrypted[-1]
    decrypted = decrypted[:-pad_len]

    return decrypted.decode("utf-8")


def encrypt(text):
    content = rsa_encrypt(text)
    ds = "content=" + content
    md5_hash = hashlib.md5(ds.encode("utf-8")).hexdigest()
    signature = sign(md5_hash)

    return {
        "content": content,
        "sign": signature
    }


class RootData:
    def __init__(self):
        self.base_url = "https://www.rootdata.com"
        self.headers = {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "currency": "FIAT_USD",
            "lang": "zh-CN",
            "origin": "https://cn.rootdata.com",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "ref": "https://cn.rootdata.com/login?fromUrl=%2FProjects",
            "referer": "https://cn.rootdata.com/",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
            "x-user-id": str(uuid.uuid4())
        }

    def req_post(self, path, data):
        url = f"{self.base_url}{path}"
        data = json.dumps(data, separators=(',', ':'))
        sign_body = encrypt(data)
        data = json.dumps(sign_body, separators=(',', ':'))
        return requests.post(url, headers=self.headers, data=data)

    @retry(stop=stop_after_attempt(3), wait=wait_fixed(60))
    def login(self, email, password):
        login_resp = self.req_post("/pc/auth/sc_login", {
            "email": email,
            "loginPwd": password
        })
        login_resp.raise_for_status()
        token = login_resp.json().get("data", {}).get("token", "")
        if not token:
            return
        self.headers["token"] = token

    @retry(stop=stop_after_attempt(3), wait=wait_fixed(60))
    def item_list_page(self, page):
        item_list_resp = self.req_post("/pc/data/sc_item_list_page", {
            "page": page,
            "limit": 30,
            "sortType": 2
        })
        item_list_resp.raise_for_status()

        return json.loads(aes_decrypt(item_list_resp.json().get("data", "")))


def main():
    rd = RootData()
    username = ""
    password = ""
    rd.login(username, password)
    page = 1
    while True:
        item_data = rd.item_list_page(page)
        print(item_data)

        if not item_data.get("items"):
            break
        page += 1


if __name__ == '__main__':
    main()
```