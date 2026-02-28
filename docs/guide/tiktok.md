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