---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "ReWeb Lab"
  text: "Web 端逆向工程"
  tagline: JavaScript 逆向 · AST 插桩 · VM 混淆分析 · 加密算法还原
  actions:
    - theme: brand
      text: 开始阅读
      link: /guide/introduction
    - theme: alt
      text: GitHub
      link: https://github.com/FunnyPuppet/reweb-docs.git

features:
  - title: AST 自动化分析
    details: 深入解析 Babel AST 结构，构建插桩系统，实现变量绑定追踪、作用域分析与混淆代码结构还原。

  - title: 运行时与 Hook 技术
    details: 基于浏览器执行机制，分析调用栈、this 绑定、原型链行为，通过 Hook 技术实现动态调试与数据追踪。

  - title: VM 混淆与算法还原
    details: 解构虚拟机型混淆执行流程，分析 opcode 调度逻辑，还原常见加密算法与自定义混淆实现。
---

