"use strict";
module.exports = {
  title: "二狗同学的灌水博客",
  description: "Write once,debug everywhere",
  dest: "public",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  theme: "reco",
  themeConfig: {
    nav: [
      { text: "Home", link: "/", icon: "reco-home" },
      { text: "TimeLine", link: "/timeline/", icon: "reco-date" },
      {
        text: "Contact",
        icon: "reco-message",
        items: [
          {
            text: "GitHub",
            link: "https://github.com/Kory-lee/",
            icon: "reco-github",
          },
        ],
      },
    ],
    type: "blog",
    blogConfig: {
      category: { location: 2, text: "Category" },
      tag: { location: 3, text: "Tag" },
    },
    friendLink: [
      {
        title: "午后南杂",
        desc: "Enjoy when you can, and endure when you must.",
        email: "1156743527@qq.com",
        link: "https://www.recoluan.com",
      },
      {
        title: "vuepress-theme-reco",
        desc: "A simple and beautiful vuepress Blog & Doc theme.",
        avatar:
          "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: "https://vuepress-theme-reco.recoluan.com",
      },
    ],
    logo: "/logo.png",
    search: !0,
    searchMaxSuggestions: 10,
    sidebar: "auto",
    lastUpdated: "Last Updated",
    author: "kory",
    authorAvatar: "/avatar.png",
    record: "kory-lee",
    startYear: "2020",
    valineConfig: {
      appId: "y7MKrA8OauBNNXFuhDBUfHOa-gzGzoHsz",
      appKey: "KenJGyybgIgnmGNKdgAja7z2",
      visitor: !0,
    },
  },
  markdown: { lineNumbers: !0 },
  plugins: [["flowchart"]],
  locales: { "/": { lang: "zh-CN" } },
};
