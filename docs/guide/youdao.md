# 有道翻译

## js加密代码

```js
import express from "express";
import ct from "crypto";

const app = express();
app.use(express.json());

app.get("/key", async (req, res) => {
    res.json({
        success: true,
        data: get_key_sign()
    });
});

app.post("/translate", async (req, res) => {
    const {payload} = req.body;

    const s = await fetch_data(sign({
        "product": "webfanyi",
        "appVersion": 1,
        "client": "webmain",
        "mid": 1,
        "vendor": "web",
        "screen": 1,
        "model": 1,
        "imei": 1,
        "network": "wifi",
        "keyfrom": "webfanyi.webmain",
        "keyid": "translate-webfanyi-webmain",
        "mysticTime": Date.now(),
        "yduuid": "2597fb445c06996f4a5f38a6df16ae18",
        "modelName": "llmLite",
        "useTerm": false,
        "i": encodeURIComponent(payload["i"]),
        "from": payload["from"],
        "to": payload["to"],
        "signSecretKey": payload["secretKey"],
        "keyId": "translate-webfanyi-webmain",
        "token": payload["token"],
        "source": "webmain"
    }, payload["secretKey"]));

    res.json({
        success: true,
        data: s
    });
});

app.listen(3000);

function md5(input) {
    return ct.createHash('md5').update(input, 'utf8').digest('hex');
}

function sign(o, key) {
    const r = "key";
    const n = Object.keys(o).sort().filter((e => !(void 0 === o[e])));
    n.push(r);
    o[r] = key;
    const l = `${n.map((e => `${e}=${o[e]}`)).join("&")}`;
    delete o[r];
    Object.assign(o, {
        sign: md5(l),
        pointParam: n.join(",")
    })
    return o;
}

function get_key_sign() {
    return sign({
        "product": "webfanyi",
        "appVersion": "12.0.0",
        "client": "webmain",
        "mid": 1,
        "vendor": "web",
        "screen": 1,
        "model": 1,
        "imei": 1,
        "network": "wifi",
        "keyfrom": "webfanyi.webmain",
        "keyid": "translate-webmain-key-getter",
        "mysticTime": Date.now(),
        "yduuid": "2597fb445c06996f4a5f38a6df16ae18",
        "abtest": 0,
        "targetKeyid": "translate-webfanyi-webmain"
    }, "kSy5gtKA4yRUxAVPJPrdYKZ0jBKyd3t1");
}

function parseSSE(chunk) {
    const lines = chunk.split("\n");

    let event = "message";
    let data = "";

    for (const line of lines) {
        if (line.startsWith("event:")) {
            event = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
            data += line.slice(5).trim();
        }
    }

    return {
        event,
        data
    }
}

async function fetch_data(s) {
    const l = new FormData
        , u = Object.keys(s);
    for (const r of u)
        "" !== s[r] && null !== s[r] && void 0 !== s[r] && l.append(r, s[r]);
    const c = await fetch("https://dict-trans.youdao.com/webtranslate/sse", {
        method: "POST",
        body: l,
        credentials: "include"
    });
    const d = c.body.getReader();
    let buffer = "", res = "";
    try {
        while (1) {
            const {done: e, value: t} = await d.read();
            if (e)
                break;
            buffer += (new TextDecoder).decode(t);
            let parts = buffer.split("\n\n");
            buffer = parts.pop(); // 剩余不完整部分

            for (const part of parts) {
                const e = parseSSE(part);
                if (e.event === "message") {
                    const dj = JSON.parse(e.data);
                    res += dj["transIncre"];
                }
            }
        }
    } catch (h) {
        "AbortError" === h.name && console.log("Aborted");
        console.log("catch err", h);
    } finally {
        d.releaseLock()
    }

    return res;
}
```

## 接口调用示例
```python
import requests

headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Length": "0",
    "Origin": "https://fanyi.youdao.com",
    "Pragma": "no-cache",
    "Referer": "https://fanyi.youdao.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
}
url = "https://dict-trans.youdao.com/translate/key"

resp = requests.get("http://127.0.0.1:3000/key")
data_json = resp.json()
params = data_json["data"]
response = requests.post(url, headers=headers, params=params)
data_json = response.json()
data = data_json["data"]
secret_key = data.get("secretKey")
token = data.get("token")

resp = requests.post("http://127.0.0.1:3000/translate", json={
    "payload": {
        "i": "火车",
        "from": "zh-CHS",
        "to": "en",
        "secretKey": secret_key,
        "token": token
    },
})

print(resp.json()["data"])
```