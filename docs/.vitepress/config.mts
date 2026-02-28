import { defineConfig, type DefaultTheme } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/reweb-docs/',
  title: "ReWeb Lab",
  description: "ReWeb Lab",
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),

    sidebar: {
      "/guide/": {
        base: "/guide/",
        items: sidebarGuide(),
      },
    },

    logo: { src: '/logo.png', width: 24, height: 24 },

    socialLinks: [
      { icon: "github", link: "https://github.com/FunnyPuppet/reweb-docs.git" },
    ],

    footer: {
      message: "基于 MIT 许可发布",
      copyright: "版权所有 © 2019-至今 ReWeb Lab",
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    outline: {
      label: '页面导航'
    },

    lastUpdated: {
      text: "最后更新于",
    },

    notFound: {
      title: "页面未找到",
      quote:
        "但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。",
      linkLabel: "前往首页",
      linkText: "带我回首页",
    },
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: "指南",
      link: "/guide/introduction",
      activeMatch: "/guide/introduction",
    },
    {
      text: "联系作者",
      link: "/guide/contact",
      activeMatch: "/guide/contact",
    },
  ];
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "联系作者",
      link: "contact",
    },
    {
      text: "简介",
      link: "introduction",
    },
    {
      text: "社交媒体",
      collapsed: false,
      items: [
        { text: "小红书", link: "xhs" },
        { text: "抖音", link: "douyin" },
        { text: "TikTok", link: "tiktok" },
      ],
    },
    {
      text: "行为验证",
      collapsed: false,
      items: [{ text: "极验3", link: "jiyan3" }],
    },
    {
      text: "案例",
      collapsed: false,
      items: [{ text: "RootData", link: "root-data" }],
    },
    { text: "结语", link: "end" },
  ];
}
