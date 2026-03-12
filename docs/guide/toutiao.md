# 今日头条

## 获取a_bogus签名

### 接口说明

用于生成请求所需的a_bogus签名参数。  
通过传入原始请求数据，返回加密后的签名字段。

---

### 请求信息

- 请求方式：POST
- Content-Type：application/json
- 请求地址：`https://api.xffa.asia/toutiao/a_bogus`

---

### 请求参数

| 参数名 | 类型   | 是否必填 | 说明 |
|--------|--------|----------|------|
| ps    | string | 是       | 请求参数 |
| ua   | string | 是       | 请求头中user-agent的值 |

---

### 请求示例

```python
resp = requests.post("https://api.xffa.asia/toutiao/a_bogus", json={
    "ps": params,
    "ua": ua
})

sign = resp.json().get("a_bogus", "")
```

## 获取今日头条首页推荐数据示例

```python
from urllib.parse import urlencode

import requests


def get_a_bogus(ps, ua):
    resp = requests.post("http://127.0.0.1:8000/douyin/a_bogus", json={
        "ps": ps,
        "ua": ua
    })

    return resp.json().get("a_bogus", "")

headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh,en;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://www.toutiao.com/",
    "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
}
cookies = {
    # 替换为自己的cookie
}
url = "https://www.toutiao.com/api/pc/list/feed"
params = {
    "channel_id": "94349549395",
    "max_behot_time": "0",
    "category": "pc_profile_channel",
    "disable_raw_data": "true",
    "aid": "24",
    "app_name": "toutiao_web"
}
params['a_bogus'] = get_a_bogus(urlencode(params), headers["user-agent"])
response = requests.get(url, headers=headers, params=params)

print(response.text)
print(response)
```