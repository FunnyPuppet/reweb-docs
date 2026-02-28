# 小红书

## 获取x-s签名

### 接口说明

用于生成请求所需x-s请求头。  
通过传入原始请求数据，返回加密后的签名字段。

---

### 请求信息

- 请求方式：POST
- Content-Type：application/json
- 请求地址：`https://api.xffa.asia/xhs/xs`

---

### 请求参数

| 参数名 | 类型   | 是否必填 | 说明 |
|--------|--------|----------|------|
| ps    | string | 是       | 请求接口路径拼接请求参数 |
| a1   | string | 是       | cookie中a1的值 |

---

### 请求示例

```python
resp = requests.post("https://api.xffa.asia/xhs/xs", json={
    "ps": params,
    "a1": a1
})

sign = resp.json().get("xs", "")
```

## 获取小红书首页内容示例

```python
import json
import time
import uuid

import requests


def get_xs(params, a1):
    resp = requests.post("https://api.xffa.asia/xhs/xs", json={
        "ps": params,
        "a1": a1
    })

    return resp.json().get("xs", "")

headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh,en;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json;charset=UTF-8",
    "origin": "https://www.xiaohongshu.com",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://www.xiaohongshu.com/",
    "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "x-s-common": "2UQAPsHC+sIjqArjwjHjNsQhPsHCH0rjNsQhPaHCH0c1PjhEHjIj2eHjwjQPynEM2sHVHdWAH0ij2BYANgm0Ng4SGjHVHdWFH0ij+ahAN0ZjNsQh+aHCH0rEGnHIPepY8/DIqoblw/bf8nRx8nWE2/WF4gHM2eqEPgqU+7QTJ0mV+eZIPeZU+eZEPAHjNsQh+jHCHjHVHdW7H0ijHjIj2eWjwjHjNsQhwaHCN/PI+0G7+eDlPjIj2erIH0iINsQhP/rjwjQ1J7QTGnIjKc==",
}
cookies = {
    # 替换为自己的cookie
}
url = "https://edith.xiaohongshu.com/api/sns/web/v1/homefeed"
data = {
    "cursor_score": "0",
    "num": 36,
    "refresh_type": 1,
    "note_index": 35,
    "unread_begin_note_id": "",
    "unread_end_note_id": "",
    "unread_note_count": 0,
    "category": "homefeed_recommend",
    "search_key": "",
    "need_num": 16,
    "image_formats": [
        "jpg",
        "webp",
        "avif"
    ],
    "need_filter_image": False
}
data = json.dumps(data, separators=(',', ':'))
sign = get_xs("/api/sns/web/v1/homefeed" + data, cookies["a1"])
headers["x-s"] = sign
headers["x-t"] = str(time.time() * 1000)
response = requests.post(url, headers=headers, cookies=cookies, data=data)
```