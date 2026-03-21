# 当当网

## 账密登录

- 加密相关代码
```js
const crypto = require("crypto");
const CryptoJS = require("crypto-js");

function md5(s) {
    return crypto.createHash("md5").update(s, "utf8").digest("hex")
}

function generatePermanentId() {
    var t = "DDClick521"
        , e = new Date
        , n = e.getFullYear() + ""
        , a = e.getMonth() + 1;
    a < 10 && (a = "0" + a);
    var r = e.getDate();
    r < 10 && (r = "0" + r);
    var s = e.getHours();
    s < 10 && (s = "0" + s);
    var i = e.getMinutes();
    i < 10 && (i = "0" + i);
    var o = e.getSeconds();
    o < 10 && (o = "0" + o);
    var c = "00" + e.getMilliseconds();
    c = c.substr(c.length - 3, 3);
    var l = Math.floor(1e5 + 9e5 * Math.random())
        , u = Math.floor(1e5 + 9e5 * Math.random())
        , d = n + a + r + s + i + o + c + l + u + t
        , p = md5(d)
        , h = function (t) {
        var e = function (t, e) {
            return new Array(e + 1).join(t)
        }
            , n = parseInt(t.substr(0, 8), 16)
            , a = String(n).substr(0, 6)
            , r = a.length;
        return r < 6 && (a += e("0", Math.abs(6 - r))),
            a
    };
    return p = h(p),
    n + a + r + s + i + o + c + p + l + u
}

function aesEncrypt(plaintext, key) {
    const encrypted = CryptoJS.AES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse("0102030405060708"),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
}

function pre(t, requestId, permanentId) {
    var n = {
        t: (new Date).getTime(),
        ct: "pc",
        permanent_id: permanentId,
        requestId: requestId
    };

    var a = {};
    n = Object.assign(n, t);
    Object.keys(n).sort().map((function (t) {
            ("sign" != t && n[t] || 0 === n[t]) && (a[t] = n[t])
        }
    ));

    return a;
}

function sign(r, randkey) {
    r = decodeURIComponent(r);
    r = md5(r);
    r = aesEncrypt(r, randkey);

    return r;
}
```

- 登录示例代码
```python
import json
import random
import ddddocr
import requests
import execjs
from urllib.parse import urlencode
from loguru import logger

class DangDang:
    def __init__(self):
        self.ctx = self.get_ctx()
        self.permanent_id = self.ctx.call("generatePermanentId")
        self.headers = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh,en;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://login.dangdang.com",
            "Pragma": "no-cache",
            "Referer": "https://login.dangdang.com",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\""
        }

    @staticmethod
    def get_ctx():
        with open("./js/run.js", "r") as f:
            js_code = f.read()

        return execjs.compile(js_code)

    @staticmethod
    def download_image(url, path):
        with open(path, "wb") as f:
            response = requests.get(url, stream=True)
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
                    f.flush()

    def sign(self, t: dict, request_id, permanent_id, ran_key):
        data = self.ctx.call("pre", t, request_id, permanent_id)
        data["sign"] = self.ctx.call("sign", urlencode(data), ran_key)

        return data

    def account_login(self, username: str, password: str):
        url = "https://login.dangdang.com/api/customer/loginapi/getRankey"
        data = self.ctx.call("pre", {}, "", self.permanent_id)
        data["sign"] = self.ctx.call("sign", urlencode(data), "")
        response = requests.post(url, headers=self.headers, data=data)
        logger.info(f"请求ranKey：{response.text}")
        data_json = response.json()
        request_id = data_json["requestId"]
        ran_key = data_json["rankey"]

        data = self.ctx.call("pre", {}, request_id, self.permanent_id)
        data["sign"] = self.ctx.call("sign", urlencode(data), ran_key)
        url = "https://login.dangdang.com/api/customer/loginapi/isShowSlide"
        response = requests.post(url, headers=self.headers, data=data)
        logger.info(f"是否需要滑块验证：{response.text}")

        data = self.ctx.call("pre", {"situation": "login"}, request_id, self.permanent_id)
        data["sign"] = self.ctx.call("sign", urlencode(data), ran_key)
        url = "https://login.dangdang.com/api/customer/loginapi/getSlidingVerifyCode"
        response = requests.post(url, headers=self.headers, data=data)
        logger.info(f"获取滑块验证信息：{response.text}")
        data_json = response.json()
        token = data_json["data"]["token"]
        y = data_json["data"]["y"]
        encryptKey = data_json["data"]["encryptKey"]
        bgImg = data_json["data"]["bgImg"]
        slideImg = data_json["data"]["slideImg"]

        logger.info(f"背景图片地址：{bgImg}")
        logger.info(f"滑块图片地址：{slideImg}")
        self.download_image(bgImg, "bg.jpg")
        self.download_image(slideImg, "slice.png")

        det = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False)

        with open('slice.png', 'rb') as f:
            target_bytes = f.read()

        with open('bg.jpg', 'rb') as f:
            background_bytes = f.read()

        res = det.slide_match(target_bytes, background_bytes, simple_target=True)

        target_x = res['target'][0]
        dis = int(target_x / 408 * 350)
        logger.info(f"识别到滑动距离: {target_x}，处理后距离：{dis}")

        data = self.ctx.call("pre", {
            "situation": "login",
            "verifyToken": token,
            "slide_cost_time": random.randint(1500, 3000),
            "need_new_verifydata": 0,
            "point_json": self.ctx.call("aesEncrypt", json.dumps({
                "x": dis / 350,
                "y": y
            }), encryptKey)
        }, request_id, self.permanent_id)
        data["sign"] = self.ctx.call("sign", urlencode(data), ran_key)
        url = "https://login.dangdang.com/api/customer/loginapi/checkSlidingVerifyCode"
        response = requests.post(url, headers=self.headers, data=data)
        logger.info(f"滑块验证结果：{response.text}")
        data_json = response.json()
        check_code = data_json["data"]["checkCode"]

        data = self.ctx.call("pre", {
            "username": username,
            "password": self.ctx.call("aesEncrypt", password, "qrcode_p@ssw0rdK"),
            "autokey": "off",
            "token": token,
            "check_code": check_code,
            "check_code_type": "1"
        }, request_id, self.permanent_id)
        data["sign"] = self.ctx.call("sign", urlencode(data), ran_key)
        url = "https://login.dangdang.com/api/customer/loginapi/accountLogin"
        response = requests.post(url, headers=self.headers, data=data)
        logger.info(f"密码登录结果：{response.text}")

if __name__ == '__main__':
    d = DangDang()
    d.account_login("", "") # 填入账号密码
```