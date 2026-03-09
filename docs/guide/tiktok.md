# Tiktok

## 获取x_bogus、x-gnarly签名

### 接口说明

用于生成请求所需的x_bogus、x-gnarly签名参数。  
通过传入原始请求数据，返回加密后的签名字段。

---

### 请求信息

- 请求方式：POST
- Content-Type：application/json
- 请求地址：`https://api.xffa.asia/tiktok/sign`

---

### 请求参数

| 参数名 | 类型   | 是否必填 | 说明 |
|--------|--------|----------|------|
| ps    | string | 是       | 请求参数 |
| data   | string | 否       | post请求数据 |
| ua   | string | 是       | 请求头中user-agent的值 |

---

### 请求示例

```python
resp = requests.post("https://api.xffa.asia/tiktok/sign", json={
    "ps": params,
    "ua": ua
})

x_bogus = resp.json().get("x_bogus", "")
x-gnarly = resp.json().get("x-gnarly", "")
```

## 获取用户主页视频数据
```python
import json
import os.path
import random
import re
import time
from urllib.parse import urlencode
import requests
from tenacity import retry, stop_after_attempt, wait_fixed
import subprocess
import socket
from playwright.sync_api import sync_playwright

CHROME_PATH = "google-chrome"
DEBUG_PORT = 9222
USER_DATA_DIR = "/mnt/data/resources/chrome/profile"

class ChromeController:

    def __init__(self):
        self.proc = None
        self.playwright = None
        self.browser = None

    # -----------------------------
    # 启动 Chrome
    # -----------------------------
    def start_chrome(self):
        if self.is_port_open():
            print("Chrome already running.")
            return

        cmd = [
            CHROME_PATH,
            f"--remote-debugging-port={DEBUG_PORT}",
            f"--user-data-dir={USER_DATA_DIR}",
            "--no-first-run",
            "--no-default-browser-check"
        ]

        self.proc = subprocess.Popen(cmd)
        print("Chrome starting...")
        self.wait_for_debug_port()

    # -----------------------------
    # 检查端口
    # -----------------------------
    def is_port_open(self):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            return sock.connect_ex(("127.0.0.1", DEBUG_PORT)) == 0

    # -----------------------------
    # 等待 CDP 端口就绪
    # -----------------------------
    def wait_for_debug_port(self, timeout=15):
        start = time.time()
        while time.time() - start < timeout:
            try:
                requests.get(f"http://localhost:{DEBUG_PORT}/json")
                print("CDP ready.")
                return
            except:
                time.sleep(0.5)
        raise RuntimeError("CDP not available")

    # -----------------------------
    # 连接 Playwright
    # -----------------------------
    def connect(self):
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.connect_over_cdp(
            f"http://localhost:{DEBUG_PORT}"
        )
        print("Connected to Chrome via CDP.")

    # -----------------------------
    # 获取 Page
    # -----------------------------
    def get_page(self):
        context = self.browser.contexts[0] if self.browser.contexts else self.browser.new_context()
        page = context.pages[0] if context.pages else context.new_page()
        return page

    # -----------------------------
    # 自动重连
    # -----------------------------
    def ensure_connection(self):
        try:
            self.browser.contexts
        except:
            print("CDP lost. Reconnecting...")
            self.connect()

    # -----------------------------
    # 关闭
    # -----------------------------
    def shutdown(self):
        if self.browser:
            self.browser.close()
        if self.playwright:
            self.playwright.stop()
        if self.proc:
            self.proc.terminate()
        print("Shutdown complete.")

@retry(stop=stop_after_attempt(5), wait=wait_fixed(30))
def sign(params, data, ua):
    resp = requests.post("https://api.xffa.asia/tiktok/sign", json={
        "ps": params,
        "data": data,
        "ua": ua
    })
    print(resp.text)
    data_json = resp.json()
    return data_json.get("x_bogus", ""), data_json.get("x-gnarly", "")

def sanitize_filename(filename: str, max_bytes: int = 200) -> str:
    sanitized = re.sub(r'[<>:"/\\|?*\n\r\t]', '_', filename)
    sanitized = sanitized.strip()
    name, ext = os.path.splitext(sanitized)

    while len(name.encode("utf-8")) > max_bytes:
        name = name[:-1]

    return f"{name}{ext}"

headers = {
    "accept": "*/*",
    "accept-language": "zh,en;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "origin": "https://www.tiktok.com",
    "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
}
ms_token = ""

@retry(stop=stop_after_attempt(5), wait=wait_fixed(120))
def req_get(url, params, unique_id):
    headers["referer"] = f"https://www.tiktok.com/@{unique_id}"
    resp = requests.get(url, headers=headers, params=params)
    if resp.text == "":
        open_page(f"https://www.tiktok.com/@{unique_id}")
    return resp.json()


# @retry(stop=stop_after_attempt(5), wait=wait_fixed(120))
def download(play_addr, save_dir, file_name):
    video_headers = {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "origin": "https://www.tiktok.com",
        "priority": "u=1, i",
        "referer": "https://www.tiktok.com/",
        "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
    }
    video_headers["cookie"] = headers["cookie"]

    vrs = requests.get(play_addr, headers=video_headers)
    vrs.raise_for_status()
    if vrs.status_code == 200:
        with open(os.path.join(save_dir, file_name), "wb") as f:
            print(f"Downloading [{play_addr}] to [{file_name}]")
            f.write(vrs.content)
    time.sleep(random.uniform(2, 5))

def open_page(url):
    global ms_token

    controller = ChromeController()

    try:
        controller.start_chrome()
        controller.connect()

        page = controller.get_page()

        page.goto(url, wait_until="networkidle")
        page.wait_for_load_state()

        controller.browser.contexts[0].storage_state(path="storage_state.json")

        with open("storage_state.json", "r") as f:
            state = json.load(f)

        cookies = state["cookies"]

        cookie_dict = {c["name"]: c["value"] for c in cookies if ".tiktok.com" == c["domain"]}
        print(cookie_dict)

        cookie_str = "; ".join(f"{k}={v}" for k, v in cookie_dict.items())

        headers["cookie"] = cookie_str
        ms_token = cookie_dict.get("msToken", "")
    finally:
        controller.shutdown()

def get_sec_uid(unique_id):
    url = f"https://www.tiktok.com/@{unique_id}"
    response = requests.get(url)

    pattern = r'"secUid"\s*:\s*"([^"]+)"'

    match = re.search(pattern, response.text)

    if match:
        sec_uid = match.group(1)
        return sec_uid
    return None

def main():
    unique_id = ""
    if not unique_id:
        print("unique_id不能为空")
        return
    sec_uid = get_sec_uid(unique_id)
    if sec_uid is None:
        print("No Sec UID found")
        return None
    open_page(f"https://www.tiktok.com/@{unique_id}")
    url = "https://www.tiktok.com/api/post/item_list/"
    params = {
        "WebIdLastTime": "1764412798",
        "aid": "1988",
        "app_language": "zh-Hant-TW",
        "app_name": "tiktok_web",
        "browser_language": "zh",
        "browser_name": "Mozilla",
        "browser_online": "true",
        "browser_platform": "Linux x86_64",
        "browser_version": "5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
        "channel": "tiktok_web",
        "cookie_enabled": "true",
        "count": "16",
        "coverFormat": "2",
        "cursor": "",
        "data_collection_enabled": "true",
        "device_id": "7578095224544151095",
        "device_platform": "web_pc",
        "enable_cache": "false",
        "focus_state": "false",
        "from_page": "user",
        "history_len": "2",
        "is_fullscreen": "false",
        "is_page_visible": "true",
        "language": "zh-Hant-TW",
        "needPinnedItemIds": "true",
        "odinId": "7228083354872120366",
        "os": "linux",
        "post_item_list_request_type": "0",
        "priority_region": "US",
        "referer": "",
        "region": "US",
        "screen_height": "1600",
        "screen_width": "2560",
        "secUid": sec_uid,
        "tz_name": "Asia/Shanghai",
        "user_is_login": "false",
        "video_encoding": "mp4",
        "msToken": ""
    }
    save_dir = f"/mnt/data/resources/video/tiktok/{unique_id}"
    os.makedirs(save_dir, exist_ok=True)
    ua = headers["user-agent"]
    cursor = 0
    while True:
        params["cursor"] = str(cursor)
        params_str = urlencode(params)
        xb, xg = sign(params_str, "", ua)
        params["X-Bogus"] = xb
        params["X-Gnarly"] = xg
        data_json = req_get(url, params=params, unique_id=unique_id)
        item_list = data_json.get("itemList", [])
        for item in item_list:
            item_id = item.get("id", "")
            desc = item.get("desc", "")
            b_list = item.get("video", {}).get("bitrateInfo", [])
            if len(b_list) == 0:
                continue
            play_addr_list = b_list[0].get("PlayAddr", {}).get("UrlList", [])
            if len(play_addr_list) == 0:
                continue
            play_addr = play_addr_list[1]
            print(f"Find URL: {play_addr}")
            file_name = sanitize_filename(f"{item_id}_{desc}.mp4")
            if play_addr == "" or os.path.exists(os.path.join(save_dir, file_name)):
                continue
            try:
                download(play_addr, save_dir, file_name)
            except Exception as e:
                print(e)

        has_more = data_json.get("hasMore", False)
        if not has_more:
            break
        cursor = data_json.get("cursor", 0)

        del params["X-Bogus"]
        del params["X-Gnarly"]
        time.sleep(random.uniform(2, 5))

if __name__ == "__main__":
    main()
```