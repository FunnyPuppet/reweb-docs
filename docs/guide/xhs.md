# 小红书

## 分析

小红书的请求主要是验证请求头的x-s值，如何找到加密入口位置，这里不过多讲解，网上有很多，可以自行搜索。x-s的生成逻辑在jsvmp中，而且是混淆后的代码，所以需要进行混淆还原，然后插桩进行纯算分析。

**注：**下面的代码仅供参考，网站的代码随时会更新，导致代码不一定可用。


### AST解混淆

- 找到字符映射数组，作为模块导出，作为后续字符数组映射。
```js
var _0x5e26 = ['1OWxddp', 'UMGUw', 'PqfSQ', 'bAFBA', 'RdZOW', 'VTKBBQFM', 'zxdmC', 'tmPwM', 'wiumi', 'ΙIΙ', 'MhWZS', 'setPrototypeOf', 'PyUdY', 'MjAjc', 'xPcsI', 'EJjtF', 'HGVol', 'yxiaz', 'prototype', 'OBxQX', 'apply', 'cXDFm', '[object\x20Arguments]', 'BqDfU', 'IIΙ', 'HaYEx', 'XVDwO', 'jqHEd', 'eJIqr', 'BmFKC', 'vFVcP', 'length', 'rUBOo', 'kouSN', 'IVyLJ', 'UgkRn', '231578RZAPRo', 'iJhUX', 'slice', 'PWtFM', 'HkaBE', 'tYXYt', '321249iOnvFh', 'GADdy', 'IUXjo', 'AbRVN', 'Hcklz', 'hwjfK', 'kmriT', 'uMRFn', 'rttQd', '__bc', 'XxNlA', 'kqKnQ', 'mQhYz', 'sWKCl', 'construct', '260713ggTmlX', 'BYbSM', '3icXZpW', 'mZrHM', 'ZYFsA', 'ZQUMb', 'YtJvW', 'yuUMe', 'euoqz', 'jHwuh', 'CciCu', 'bind', 'JOCDJ', 'gqOZZ', 'IΙI', 'TNifp', 'CozeT', 'sham', 'SMVQv', 'ksZAC', '258308ThHaAN', 'qDuah', 'XBnTt', 'LzUba', '746795dpceNN', 'POWBq', 'Pwrup', 'BdEvR', 'fromCharCode', 'juZTe', 'iGuJR', 'bPojh', 'keys', 'lzlIX', 'yZBVv', 'yOsHa', 'err-209e10:\x20+\x20', 'QiARX', 'ABRVQ', 'xRIOr', 'XDOoR', 'oRfag', 'undefined', '1QZcWJQ', 'FdcjM', 'PczfC', 'ΙII', 'uixXY', 'ahwRp', 'SOoBb', 'RMSgu', 'hJTjo', 'yrDYx', 'dxzss', 'qfwSc', 'idiYu', 'DlfXv', 'UwVWk', 'PdbAc', 'push', 'gZeSF', 'nWekH', 'Kbhwt', 'ndGnJ', 'kPvxn', '121585KCTaKM', 'comGc', 'wnbho', 'QBTLS', 'NOFBb', 'SAYoa', 'XDLWq', 'cFexY', 'SygNu', 'function', 'HTOjf', 'hOwmN', 'EGbYA', 'suYWh', 'vvqfG', 'EJPiB', 'uCThz', 'FSTxk', 'Awtlv', 'XLyDS', 'qskTK', 'ZqAbc', 'PzXQN', 'sGqQS', 'JsjPA', 'tLDgE', 'QqSfw', 'xMjZi', 'Tthhs', 'IΙΙ', '742454TyjCbv', 'zmfqy', 'WLUSP', 'yrZuT', 'call', 'toString'];
var _0x4a41 = function(_0x1218b5, _0x5e2612) {
    _0x1218b5 = _0x1218b5 - 0x0;
    var _0x4a419f = _0x5e26[_0x1218b5];
    return _0x4a419f;
};
(function(_0xe72767, _0xe7f5e) {
    var _0x3fd162 = _0x4a41;
    while (!![]) {
        try {
            var _0x257514 = parseInt(_0x3fd162(0x29)) * -parseInt(_0x3fd162(0x54)) + parseInt(_0x3fd162(0x14)) + parseInt(_0x3fd162(0x41)) + -parseInt(_0x3fd162(0x2b)) * parseInt(_0x3fd162(0x6a)) + -parseInt(_0x3fd162(0x1a)) + -parseInt(_0x3fd162(0x3d)) + parseInt(_0x3fd162(0x8e)) * parseInt(_0x3fd162(0x88));
            if (_0x257514 === _0xe7f5e)
                break;
            else
                _0xe72767['push'](_0xe72767['shift']());
        } catch (_0x5c8197) {
            _0xe72767['push'](_0xe72767['shift']());
        }
    }
}(_0x5e26, 0x7deda));
```

- 十六进制数字转十进制，Unicode中文解码
```js
const handlerStrAndNum = {
  NumericLiteral(path) {
    path.replaceWith(types.numericLiteral(path.node.value));
    path.skip();
  },
  StringLiteral(path) {
    path.replaceWith(types.stringLiteral(path.node.value));
    path.skip();
  },
};
```

- 字符数组映射还原
```js
const replaceSameIdentifier = {
  VariableDeclarator(path) {
    if (!(path.node.init && path.node.init.name === '_0x4a41')) return;

    const references = path.scope.getBinding(path.node.id.name).referencePaths
    for (const reference of references) {
      reference.replaceWith(types.identifier(path.node.init.name))
    }
    path.remove()
  }
}

const descryptOb = {
  CallExpression(path) {
    if (!(path.node.callee.name === decrypt.name)) return

    path.replaceWith(types.valueToNode(decrypt(path.node.arguments[0].value)));
  },
};
```

- 对象映射表提取与函数调度去虚拟化
```js
const memberObj = {};
const memberMerge = {
  VariableDeclarator(path) {
    if (path.get("init").isObjectExpression()) {
      const name = path.get("id").node.name;
      const properties = path.get("init").get("properties");
      if (properties.length === 0) return
      const propertyObj = {};
      for (const property of properties) {
        const key = property.get("key").node.value;
        const value = property.get("value").node;
        propertyObj[key] = value;
      }
      memberObj[name] = propertyObj;
      path.remove();
    }
  },
};

const CTFReserve = {
  CallExpression(path) {
    if (path.get("callee").isMemberExpression() && Object.keys(memberObj).includes(path.get("callee").get("object").node.name)) {
      const objName = path.get("callee").get("object").node.name;
      const memberName = path.get("callee").get("property").node.value;
      if (types.isFunctionExpression(memberObj[objName][memberName])) {
        const functionBody = memberObj[objName][memberName].body.body[0].argument;

        if (types.isBinaryExpression(functionBody)) {
          const operator = functionBody.operator;

          path.replaceWith(types.binaryExpression(operator, path.get("arguments")[0].node, path.get("arguments")[1].node));
        } else if (types.isCallExpression(functionBody)) {
          const arg = path.node.arguments[0];
          const otherArg = path.node.arguments.slice(1);

          path.replaceWith(types.callExpression(arg, otherArg));
        }
      }
    }
  },
  MemberExpression(path) {
    if (Object.keys(memberObj).includes(path.get("object").node.name) && types.isStringLiteral(path.get("property").node)) {
      const objName = path.get("object").node.name
      const propertyName = path.get("property").node.value
      if (!memberObj[objName][propertyName]) return
      path.replaceWith(memberObj[objName][propertyName]);
    }
  },
};
```

- 控制流平坦化
```js
const getSwitchCase = function(path) {
  if (!(path.isIfStatement() && path.get('test').isBinaryExpression() && path.get('test').get('right').node.name === '_0x30595f')) return []
  
  let cases = []
  let operand = path.get('test').get('left')
  let consequent = path.get('consequent')
  if (consequent.isReturnStatement() || consequent.isThrowStatement()) {
    cases.push(types.switchCase(operand.node, [consequent.node]))
  } else {
    cases.push(types.switchCase(operand.node, [consequent.node, types.breakStatement()]))
  }
  let alternate = path.get('alternate')
  if (alternate.isBlockStatement()) {
    for (const statement of alternate.get('body')) {
      if (statement.isIfStatement()) {
        cases.push(...getSwitchCase(statement))
      } else {
        cases.push(types.switchCase(null, [statement.node]))
      }
    }
  }

  return cases
}

const IfStatementToSwitch = {
  IfStatement(path) {
    const cases = getSwitchCase(path)
    if (cases.length === 0) return
    path.replaceWith(types.switchStatement(types.identifier('_0x30595f'), cases))
  }
}
```

经过反混淆处理后的代码，已经基本可读了，在关键指令添加日志，然后替换源代码在浏览器执行或者nodejs本地执行(需要补环境)，根据日志输出，追踪数据变化逐步还原加密算法。

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