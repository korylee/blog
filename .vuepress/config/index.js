const nav = require("./nav/index.js");
module.exports = {
  nav,
  subSidebar: "auto",
  sidebar: {
    "/docs/vue/": ["", "theme", "plugin", "api"],
  },
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
      avatar: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
      link: "https://vuepress-theme-reco.recoluan.com",
    },
  ],
  logo: "/logo.png",
  search: true,
  searchMaxSuggestions: 10,
  lastUpdated: "Last Updated",
  author: "kory",
  authorAvatar: "/avatar.png",
  record: "kory-lee",
  startYear: "2020",
  valineConfig: {
    appId: "y7MKrA8OauBNNXFuhDBUfHOa-gzGzoHsz", // your appId
    appKey: "KenJGyybgIgnmGNKdgAja7z2", // your appKey
    placeholder: "填写邮箱可以收到回复提醒哦！",
    visitor: true,
    recordIP: true,
    showComment: false,
  },
};
