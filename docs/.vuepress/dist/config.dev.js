"use strict";

module.exports = {
  "title": "二狗同学的灌水博客",
  "description": "Write once,debug everywhere",
  "dest": "public",
  "head": [["link", {
    "rel": "icon",
    "href": "/favicon.ico"
  }], ["meta", {
    "name": "viewport",
    "content": "width=device-width,initial-scale=1,user-scalable=no"
  }]],
  "theme": "reco",
  "themeConfig": {
    "nav": [{
      "text": "Home",
      "link": "/",
      "icon": "reco-home"
    }, {
      "text": "TimeLine",
      "link": "/timeline/",
      "icon": "reco-date"
    }, {
      "text": "Contact",
      "icon": "reco-message",
      "items": [// {
      //   "text": "NPM",
      //   "link": "https://www.npmjs.com/~reco_luan",
      //   "icon": "reco-npm"
      // },
      {
        "text": "GitHub",
        "link": "https://github.com/Kory-lee/",
        "icon": "reco-github"
      } // {
      //   "text": "博客圆",
      //   "link": "https://www.cnblogs.com/luanhewei/",
      //   "icon": "reco-bokeyuan"
      // },
      // {
      //   "text": "WeChat",
      //   "link": "https://mp.weixin.qq.com/s/mXFqeUTegdvPliXknAAG_A",
      //   "icon": "reco-wechat"
      // }
      ]
    }],
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "Category"
      },
      "tag": {
        "location": 3,
        "text": "Tag"
      }
    },
    "friendLink": [{
      "title": "午后南杂",
      "desc": "Enjoy when you can, and endure when you must.",
      "email": "1156743527@qq.com",
      "link": "https://www.recoluan.com"
    }, {
      "title": "vuepress-theme-reco",
      "desc": "A simple and beautiful vuepress Blog & Doc theme.",
      "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
      "link": "https://vuepress-theme-reco.recoluan.com"
    }],
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "sidebar": "auto",
    "lastUpdated": "Last Updated",
    "author": "kory",
    "authorAvatar": "/avatar.png",
    "record": "kory-lee",
    "startYear": "2020",
    // 评论区
    valineConfig: {
      appId: 'y7MKrA8OauBNNXFuhDBUfHOa-gzGzoHsz',
      // your appId
      appKey: 'KenJGyybgIgnmGNKdgAja7z2',
      // your appKey
      visitor: true
    }
  },
  "markdown": {
    "lineNumbers": true
  },
  // plugins: [
  //   ['vuepress-plugin-smooth-scroll']
  // ],
  // 站点多语言配置
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  }
};