# 猫眼票房

请求接口主要验证请求参数的signKey和请求头的mygsig

## js加密代码
```js
const crypto = require("crypto");

function md5(s) {
    return crypto.createHash("md5").update(s, "utf8").digest("hex")
}

function sign(r, n, ua) {
    var o = {
        method: r,
        timeStamp: Date.now(),
        'User-Agent': btoa("".concat(ua)),
        index: Math.floor(1e3 * Math.random() + 1),
        channelId: n,
        sVersion: 2,
        key: 'A013F70DB97834C0A5492378BD76C53A'
    };
    var d = Object.keys(o).reduce(function (t, e) {
        return o[e] === 0 || o[e] ? "".concat(t, "&").concat(e, "=").concat(o[e]) : "".concat(t, "&").concat(e, "=''");
    }, '').slice(1);

    return {
        "timeStamp": '' + o["timeStamp"],
        "User-Agent": o["User-Agent"],
        "index": '' + o["index"],
        "signKey": md5(d.replace(/\s+/g, ' '))
    };
}

function get_gs(o) {
    let s = Object.entries(o).sort(function (a, b) {
        return a[0].toLowerCase().localeCompare(b[0].toLowerCase());
    }).map(function (t) {
        return "object" === typeof t[1] && (t[1] = JSON.stringify(t[1])), t[1];
    }).join("_");

    const ts = new Date().getTime();
    s = "581409236#" + s + "$" + ts;

    const r = {};
    r["m1"] = "0.0.3";
    r["m2"] = 0;
    r["m3"] = "0.0.67_tool";
    r["ms1"] = md5(s);
    r["ts"] = ts;
    r["ts1"] = new Date().getTime();

    return JSON.stringify(r);
}
```

## 接口请求示例
```python
import requests
import execjs


with open("./js/run.js", "r") as f:
    js_code = f.read()

ctx = execjs.compile(js_code)

headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh,en;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "M-APPKEY": "fe_com.sankuai.movie.fe.ipro",
    "Pragma": "no-cache",
    "Referer": "https://piaofang.maoyan.com/i/dashboard/movie",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\""
}
url = "https://piaofang.maoyan.com/i/api/dashboard-ajax/movie"
params = {
    "showDate": "20260326",
    "movieId": "",
    "orderType": "1",
    "uuid": "19d1eb90bc2c8-01c6f912bb38c78-11462c69-3e8000-19d1eb90bc3c8",
    "channelId": "40009",
    "sVersion": "2",
    "WuKongReady": "h5"
}
params.update(ctx.call("sign", "GET", params["channelId"], headers["User-Agent"]))
print(params)
gs_body = {}
gs_body.update(params)
gs_body["path"] = "/i/api/dashboard-ajax/movie"
print(gs_body)
gs = ctx.call("get_gs", gs_body)
print(gs)
headers["mygsig"] = gs
response = requests.get(url, headers=headers, params=params)
print(response.text)
```