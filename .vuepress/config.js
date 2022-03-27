const isGhPages = () => process.env.GH_PAGES === "true";

module.exports = {
  title: "kory's blog",
  description: "记录，成为更好的自己。",
  dest: "public",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "viewport", content: "width=device-width,initial-scale=1,user-scalable=no" }],
  ],
  base: isGhPages() ? "/blog/" : "/",
  theme: "reco",
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    "/": {
      lang: "zh-CN",
    },
  },
  themeConfig: {
    lastUpdated: false,
    nav: [
      { text: "Home", link: "/", icon: "reco-home" },
      { text: "归档", link: "/timeline/", icon: "reco-date" },
      {
        text: "GitHub",
        link: "https://github.com/korylee/",
        icon: "reco-github",
      },
      // {
      //   text: "Contact",
      //   icon: "reco-message",
      //   items: [ ],
      // },
    ],
    sidebar: {
      "/views/http/": ["", "http-base", "http-cross-domain", "front-end-security"],
      "/views/dom/": ["intersection-observer", "resize-observer"],
      "/views/vue/": ["vue3-reactive"],
    },
    type: "blog",
    // 博客设置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        // text: 'Categories' // 默认 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        // text: 'Tags' // 默认 “标签”
      },
      socialLinks: [
        { icon: "reco-github", link: "https://github.com/korylee" },
        // { icon: 'fa-camera', link: 'https://www.npmjs.com/~reco_luan' }
      ],
    },
    logo: "/avatar.png",
    authorAvatar: "/avatar.png",
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    subSidebar: "auto",
    sidebarDepth: 4,
    // 最后更新时间
    // lastUpdated: 'Last Updated',
    // 作者
    author: "kory",
    // 备案号
    record: "xxxx",
    recordLink: "http://www.baidu.com",
    cyberSecurityRecord: "2222",
    cyberSecurityLink: "http://www.baidu.com",
    // 项目开始时间
    startYear: "2017",
    /**
     * 密钥 (if your blog is private)
     */
    friendLink: [
      {
        title: "vuepress-theme-reco",
        desc: "A simple and beautiful vuepress Blog & Doc theme.",
        avatar: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: "https://vuepress-theme-reco.recoluan.com",
      },
    ],
    /**
     * support for
     * '' | 'default'
     * 'coy'
     * 'dark'
     * 'funky'
     * 'okaidia'
     * 'solarizedlight'
     * 'tomorrow'
     * 'twilight'
     */
  },
  plugins: [
    [
      "@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: {
          message: "发现新内容可用",
          buttonText: "刷新",
        },
      },
    ],
    [
      "vuepress-plugin-nuggets-style-copy",
      {
        copyText: "复制代码",
        tip: {
          content: "复制成功!",
        },
      },
    ],
  ],
};
