# 抖音

## 获取a_bogus签名

### 接口说明

用于生成请求所需的a_bogus签名参数。  
通过传入原始请求数据，返回加密后的签名字段。

---

### 请求信息

- 请求方式：POST
- Content-Type：application/json
- 请求地址：`https://api.xffa.asia/douyin/a_bogus`

---

### 请求参数

| 参数名 | 类型   | 是否必填 | 说明 |
|--------|--------|----------|------|
| ps    | string | 是       | 请求参数 |
| ua   | string | 是       | 请求头中user-agent的值 |

---

### 请求示例

```python
resp = requests.post("https://api.xffa.asia/douyin/a_bogus", json={
    "ps": params,
    "ua": ua
})

sign = resp.json().get("a_bogus", "")
```

## 获取抖音用户主页数据示例

```python
from urllib.parse import urlencode

import requests

def get_a_bogus(params, ua):
    resp = requests.post("https://api.xffa.asia/douyin/a_bogus", json={
        "ps": params,
        "ua": ua
    })

    return resp.json().get("a_bogus", "")

headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh,en;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36"
}
cookies = {
    # 替换为自己的cookie
}
url = "https://www.douyin.com/aweme/v1/web/aweme/post/"
params = {
    "device_platform": "webapp",
    "aid": "6383",
    "channel": "channel_pc_web",
    "sec_user_id": "",
    "max_cursor": "0",
    "locate_query": "false",
    "show_live_replay_strategy": "1",
    "need_time_list": "1",
    "time_list_query": "0",
    "whale_cut_token": "",
    "cut_version": "1",
    "count": "18",
    "publish_video_strategy_type": "2",
    "from_user_page": "1",
    "update_version_code": "170400",
    "pc_client_type": "1",
    "pc_libra_divert": "Linux",
    "support_h265": "1",
    "support_dash": "1",
    "cpu_core_num": "20",
    "version_code": "170400",
    "version_name": "17.4.0",
    "cookie_enabled": "true",
    "screen_width": "2560",
    "screen_height": "1600",
    "browser_language": "zh",
    "browser_platform": "Linux x86_64",
    "browser_name": "Chrome",
    "browser_version": "143.0.0.0",
    "browser_online": "true",
    "engine_name": "Blink",
    "engine_version": "143.0.0.0",
    "os_name": "Linux",
    "os_version": "x86_64",
    "device_memory": "8",
    "platform": "PC",
    "downlink": "1.45",
    "effective_type": "3g",
    "round_trip_time": "400",
    "webid": "7589637399098574399"
}
user_id = "" # 替换用户ID
headers["referer"] = f"https://www.douyin.com/user/{user_id}"
params["sec_user_id"] = user_id
params['a_bogus'] = get_a_bogus(urlencode(params), headers["user-agent"])
response = requests.get(url, headers=headers, cookies=cookies, params=params)
```

## 工具推荐

**如果是简单的获取少量数据，可以使用作者编写的工具**

::: info
链接: https://pan.quark.cn/s/84850c28bf35?pwd=2ZnX
:::