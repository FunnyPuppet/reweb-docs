# 猫眼票房

请求接口主要验证请求参数的signKey和请求头的mygsig

## js加密代码
```js
const crypto = require("crypto");

function sha384(text) {
    return crypto.createHash("sha384").update(text, "utf8").digest("hex")
}

function sha256(text) {
    return crypto.createHash("sha256").update(text, "utf8").digest("hex")
}

function sha1(text) {
    return crypto.createHash("sha1").update(text, "utf8").digest("hex")
}

function md5(text) {
    return crypto.createHash("md5").update(text, "utf8").digest("hex")
}

function randomInt(e, t) {
    return Math.floor(Math.random() * (t - e + 1) + e)
}

function base36(e) {
    var r = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 9, b = e, n = ""; 0 != b;) {
        var o = b % 36
            , l = b / 36;
        n = r.charAt(o) + n,
            b = Math.round(Math.floor(l))
    }
    return ("0000000000000000" + n).substr(-t)
}

function newUUID(e) {
    var t = (new Date).getTime();
    return (e ? "xxxxxxxxxxxxxyxxxxyxxxxxxxxxxxxx" : "xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxx").replace(/[xy]/g, (function (e) {
            var n = (t + 16 * Math.random()) % 16 | 0;
            return t = Math.floor(t / 16),
                ("x" == e ? n : 3 & n | 8).toString(16)
        }
    ))
}

function sign() {
    const secret = "!@iiD5R4Mljlk4JWYk*YOiub2RnKkahR";
    const ts = Date.now();
    const sid = "S_" + base36(ts - 2000, 9) + base36(randomInt(0, 78364164095), 7);
    const traceId = base36(ts, 9) + base36(randomInt(0, 78364164095), 7);
    const nonce = newUUID(!0);
    const clientId = newUUID();
    const timestamp = String(ts);

    const F = sha256(nonce);
    const A = sha384(timestamp);
    const $ = md5(nonce + '(lo__ol)' + clientId);
    let W = sha1(timestamp + '_hnw_+_--_123_)' + secret);
    W = W['substring'](W['length'] - 16, W['length'] - 1);
    const T = BigInt("0x" + W).toString(10);
    const P = [F, A, $, T];
    const I = P.reduce(function (e, t) {
        return e + '(o1o)' + t;
    });
    const sign = sha384(I);

    return {
        nonce,
        sid,
        traceId,
        clientId,
        timestamp,
        sign
    };
}
```

## 接口请求示例
```python
import requests
import execjs

ctx = execjs.compile(open("js/run.js", "r").read())


headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    "origin": "https://www.cnhnb.com",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://www.cnhnb.com/",
    "sec-ch-ua": "\"Google Chrome\";v=\"147\", \"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"147\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    "x-client-appid": "4",
    "x-client-environment": "pro",
    "x-client-page": "/gongying/7429118/",
    "x-hn-job": "If you see these message, I hope you dont hack us, I hope you can join us! Please visit https://www.cnhnkj.com/job.html"
}
url = "https://pcapi.cnhnb.com/hn-biz-gateway/api/biz-gateway/supply/comment/page"
data = {
    "supplyId": "7429118",
    "pageNum": "1",
    "pageSize": "10",
    "minRating": "3"
}
sign_info = ctx.call("sign")
headers["x-b3-traceid"] = sign_info["traceId"]
headers["x-client-id"] = sign_info["clientId"]
headers["x-client-nonce"] = sign_info["nonce"]
headers["x-client-sid"] = sign_info["sid"]
headers["x-client-sign"] = sign_info["sign"]
headers["x-client-time"] = sign_info["timestamp"]
response = requests.post(url, headers=headers, data=data)
print(response.text)
print(response)
```