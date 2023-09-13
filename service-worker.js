/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "78506245a06989f8b3918a8a132d62d8"
  },
  {
    "url": "assets/css/0.styles.0e1c29bd.css",
    "revision": "a6742f84d99797cf22040d14afd1a47f"
  },
  {
    "url": "assets/fonts/iconfont.938fa69e.woff",
    "revision": "938fa69ea89bccb0f20d643cc5f07cbe"
  },
  {
    "url": "assets/fonts/iconfont.ecabaf00.ttf",
    "revision": "ecabaf00c2c5be9907d524bb21a0f0dc"
  },
  {
    "url": "assets/img/bg.2cfdbb33.svg",
    "revision": "2cfdbb338a1d44d700b493d7ecbe65d3"
  },
  {
    "url": "assets/js/1.ab1b16e7.js",
    "revision": "0759a29f0de79d74009ba174f346dc9e"
  },
  {
    "url": "assets/js/10.c6173e6b.js",
    "revision": "8f0a81e30aa288fc055ffe2e30afc1ff"
  },
  {
    "url": "assets/js/11.0efb561d.js",
    "revision": "c73d464bdc730c69a38025be8a421c92"
  },
  {
    "url": "assets/js/12.a772bce7.js",
    "revision": "25e511fb023a7714e7d3ad76825a8549"
  },
  {
    "url": "assets/js/13.46034ccb.js",
    "revision": "f9e8ad0811dfda9ae7d941e854a24daa"
  },
  {
    "url": "assets/js/14.ae4023db.js",
    "revision": "e2f33255c43e745c3050f4d28bdda168"
  },
  {
    "url": "assets/js/15.93faa505.js",
    "revision": "ebf3d31034ae1ad8cc2db3cbe707b744"
  },
  {
    "url": "assets/js/16.8e428614.js",
    "revision": "344adf32622ea358903cbaeb91cab8fb"
  },
  {
    "url": "assets/js/17.b33f88e6.js",
    "revision": "5623ee6a65b52c22e23d918e21a7dca1"
  },
  {
    "url": "assets/js/18.9193e74a.js",
    "revision": "f6707e54f227fd4a480c76266eda6e63"
  },
  {
    "url": "assets/js/19.1b0eb1c4.js",
    "revision": "554e37d3c9d819fb9f33c96212bcfa0e"
  },
  {
    "url": "assets/js/20.42d488ba.js",
    "revision": "a409ba11b248cde87c03b7f83878d065"
  },
  {
    "url": "assets/js/21.5533cd05.js",
    "revision": "f08b3d881ec19b4f982bda9a21bed8ed"
  },
  {
    "url": "assets/js/22.a0d9fc6e.js",
    "revision": "96689a433f25f6b437498c9707f876a1"
  },
  {
    "url": "assets/js/23.2cfd9909.js",
    "revision": "f88e9b7286f4c91d7d87243cb3dff4df"
  },
  {
    "url": "assets/js/24.19c1ad54.js",
    "revision": "deaf40b41f5fcee67b9e97a57144951e"
  },
  {
    "url": "assets/js/25.e9827810.js",
    "revision": "e6b476a35eb44c9229e3e5fee5bb4803"
  },
  {
    "url": "assets/js/26.a3e1bb89.js",
    "revision": "a8333902f88217a1c446ae0ca336b5d0"
  },
  {
    "url": "assets/js/27.6da90443.js",
    "revision": "39d1ec89364a37c42ad0e8664e5bf18a"
  },
  {
    "url": "assets/js/28.92535ffe.js",
    "revision": "480cf3217065c27c2c5dc2baa20ffefb"
  },
  {
    "url": "assets/js/29.690b6321.js",
    "revision": "397598c541f3539408aa6823104a5034"
  },
  {
    "url": "assets/js/3.da299676.js",
    "revision": "9c4bc0d1f836074d1f29d6f9c31a3cf8"
  },
  {
    "url": "assets/js/30.45dccc60.js",
    "revision": "97c43b23005aa53bb486919dd4d01982"
  },
  {
    "url": "assets/js/31.8abab043.js",
    "revision": "8db488c288223017d0a0c10ba8c42de1"
  },
  {
    "url": "assets/js/32.0b520094.js",
    "revision": "1a98856e5b3cc43fb75760907820d830"
  },
  {
    "url": "assets/js/33.7dbf4b14.js",
    "revision": "d749a8a0a1b477a8d43c93e6c86d1785"
  },
  {
    "url": "assets/js/34.6db3e26e.js",
    "revision": "e9d839d56c4181587f1eea6bf0114436"
  },
  {
    "url": "assets/js/35.44b2fc75.js",
    "revision": "5f6341c01af93e351d8f60c1240d2765"
  },
  {
    "url": "assets/js/36.4714bab3.js",
    "revision": "5e4323c7a7f896f65bbc823845115514"
  },
  {
    "url": "assets/js/37.6a1aaffa.js",
    "revision": "14a87d034aa6ca63c0b77093f0775e47"
  },
  {
    "url": "assets/js/4.1eceea23.js",
    "revision": "c70977fc2a094a215ab67d19dd37b166"
  },
  {
    "url": "assets/js/5.38060aab.js",
    "revision": "29dbb2d9e162f7c55817630383864851"
  },
  {
    "url": "assets/js/6.c023e8b2.js",
    "revision": "389205e7c09177ed62110978b9e86992"
  },
  {
    "url": "assets/js/7.54e300e3.js",
    "revision": "21f70387348c78155051137b2e506122"
  },
  {
    "url": "assets/js/8.4c053ac5.js",
    "revision": "2bb7c0988251e06dd1eedc47138aeec1"
  },
  {
    "url": "assets/js/9.6f916bfd.js",
    "revision": "d47c3057879b8a3616f870a5fa966dfe"
  },
  {
    "url": "assets/js/app.30990a8a.js",
    "revision": "5cb8e054fd9389c8328091017c0c4dba"
  },
  {
    "url": "avatar.png",
    "revision": "09b5baf7c2cb9422721a03eb760d015a"
  },
  {
    "url": "categories/frontEnd/index.html",
    "revision": "bfdddb5621250c98f575e48d47e60511"
  },
  {
    "url": "categories/frontEnd/page/2/index.html",
    "revision": "7f8d3721084212a5d603c78dc06af16c"
  },
  {
    "url": "categories/frontEnd/page/3/index.html",
    "revision": "9610420285b74a898cb844d759f2d444"
  },
  {
    "url": "categories/index.html",
    "revision": "bb6c30f9d340791c4a0fd3a57231dd73"
  },
  {
    "url": "hero.png",
    "revision": "5367b9349d4e048235eeed50d9ef36df"
  },
  {
    "url": "img/03/js_closure_2.png",
    "revision": "4de8a6cc95de8d4f21082cc88b3f536c"
  },
  {
    "url": "img/03/js_closure_3.png",
    "revision": "17307bb6eb357841319c4edb3a1bf88a"
  },
  {
    "url": "img/03/js_closure_4.png",
    "revision": "218007181f76e91f484c70a6e1fc7c7b"
  },
  {
    "url": "img/03/js_closure_5.png",
    "revision": "c18eb78c58bb075a2030e6b63ca213b7"
  },
  {
    "url": "img/03/js_closure_6_inc.png",
    "revision": "8279baba95a70c8add42234835026a04"
  },
  {
    "url": "img/06/render树.png",
    "revision": "864fd91b6d16d52444a949668acf762c"
  },
  {
    "url": "img/06/TCP.png",
    "revision": "190f1477dfecdade424515948b50aaa3"
  },
  {
    "url": "img/eventLoop.jpg",
    "revision": "ca15828956337d172dc99ee62ab42f3e"
  },
  {
    "url": "img/example.png",
    "revision": "4d382a91369fee1ca1bf22b7f4bcc838"
  },
  {
    "url": "img/nextTick.jpg",
    "revision": "cbb258643f3dca141fc280b470b7dbb4"
  },
  {
    "url": "img/nodeEventLoop.png",
    "revision": "f05415a17e02db0517c64a148f3c0c47"
  },
  {
    "url": "img/proto.png",
    "revision": "b6dd15f5604dfc4142aa2d8761808b10"
  },
  {
    "url": "img/scope.png",
    "revision": "1dc512afe5cdeff0538bbedbc14bbf82"
  },
  {
    "url": "img/setImmediate.jpg",
    "revision": "21b5bb7a428a0548e282c58f5203e328"
  },
  {
    "url": "img/运算符.png",
    "revision": "9def2ab799f4ad1f215f39d310d99079"
  },
  {
    "url": "index.html",
    "revision": "1f606f2a4c82fc971be92efc809b2af0"
  },
  {
    "url": "tag/CSS/index.html",
    "revision": "5bb77217f7b6664ea3f11f0048828dd7"
  },
  {
    "url": "tag/DOM/index.html",
    "revision": "7e30e52b7d148432e492bb4c31497695"
  },
  {
    "url": "tag/HTTP/index.html",
    "revision": "e54e6ef39f5ed6096d41c596c89ee00b"
  },
  {
    "url": "tag/index.html",
    "revision": "e9d348272a6070d616def0bff8b5b3ab"
  },
  {
    "url": "tag/JavaScript/index.html",
    "revision": "991911ca08433ab49c98c52d85715aa7"
  },
  {
    "url": "tag/JavaScript/page/2/index.html",
    "revision": "02d66ff9bf2c88520d338510bd76aef0"
  },
  {
    "url": "tag/nodejs/index.html",
    "revision": "07c5fb4aff66aab54c57d50978b747e6"
  },
  {
    "url": "tag/React/index.html",
    "revision": "c62896e29f3c827ed55d8e13d4bdd2be"
  },
  {
    "url": "tag/sku/index.html",
    "revision": "e8c97b08084ddc694c61476f1b4d2e90"
  },
  {
    "url": "tag/TypeScript/index.html",
    "revision": "007cb1ddc8fe3c749538207ef8d3b9db"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "5d9a5911fb070e648084dab0a0c7f202"
  },
  {
    "url": "tag/webpack/index.html",
    "revision": "364bfb361f15867b4e8ea0312144e2cc"
  },
  {
    "url": "tag/学习笔记/index.html",
    "revision": "255e600dff9a944cd0b2faa2dbc90680"
  },
  {
    "url": "tag/安全/index.html",
    "revision": "e4538598f6f5f261512314fbf9d3f62c"
  },
  {
    "url": "timeline/index.html",
    "revision": "cdf7329849807a7ae8c3a94552f4354e"
  },
  {
    "url": "views/2019/webpack.html",
    "revision": "5ce5ab83a108dc1ee4f3ebe30680d009"
  },
  {
    "url": "views/2020/042616.html",
    "revision": "42736916a20aefefe2bb2d8c5cf0f10c"
  },
  {
    "url": "views/2020/constructor.html",
    "revision": "0d50181226ac6f24bfb833a19c794d04"
  },
  {
    "url": "views/2020/css-practice.html",
    "revision": "6ac2c1da7348dc6804cbf44bce7a0d5d"
  },
  {
    "url": "views/2020/data-structure.html",
    "revision": "9c3188498c000bd63579ac2fdd02373f"
  },
  {
    "url": "views/2020/design-model.html",
    "revision": "5df8e0106ef2c85d951c1f2f4eb28540"
  },
  {
    "url": "views/2020/regular-code.html",
    "revision": "6fce3abadbfc33824f7c13064d5f76ac"
  },
  {
    "url": "views/2020/requestAnimationFrame.html",
    "revision": "326291bbb27221e3c0a20ecec230a9da"
  },
  {
    "url": "views/2020/typescript.html",
    "revision": "06702b1c58146fdda89eacf5ac15ac5e"
  },
  {
    "url": "views/2020/webpack-speed-up.html",
    "revision": "02a5076aaaaf2bb15bbcdfd4e0965cd2"
  },
  {
    "url": "views/2022/nodejs.html",
    "revision": "346bd2ebafc345689a3bb769adf15239"
  },
  {
    "url": "views/2022/sku.html",
    "revision": "ca41e08ade4f96d602b74703f6f73581"
  },
  {
    "url": "views/2022/SSR&SSG.html",
    "revision": "5a55fd7df4761833d1862abbba55f9e9"
  },
  {
    "url": "views/dom/intersection-observer.html",
    "revision": "e907887386e143e40111e1070123520b"
  },
  {
    "url": "views/dom/resize-observer.html",
    "revision": "1adb3a92ba904ec1a0ac945e2c2ea917"
  },
  {
    "url": "views/http/front-end-security.html",
    "revision": "cb21e4c437da3475cb6bb71a15833dc5"
  },
  {
    "url": "views/http/http-base.html",
    "revision": "41ffa7dec717f364e7cbb5e14d59d39c"
  },
  {
    "url": "views/http/http-cross-domain.html",
    "revision": "7f0ab43d3e0ba7c49f077a496770d5f9"
  },
  {
    "url": "views/js/closure.html",
    "revision": "65d92eb66a57fea41f87eef619465a4e"
  },
  {
    "url": "views/js/es-object.html",
    "revision": "4489cb5cc45543357fb6f393299a330a"
  },
  {
    "url": "views/js/ES6-module.html",
    "revision": "ac2fb0a09bcaf1513d0662ef01243460"
  },
  {
    "url": "views/js/eventLoop.html",
    "revision": "d72372c802a232d03c96516c7a19618f"
  },
  {
    "url": "views/js/execution-context.html",
    "revision": "00f40f5161db97598c724c1c32998374"
  },
  {
    "url": "views/vue/vue-lifetime.html",
    "revision": "fd4ed79b7a111a1d3798266e94eb6aa2"
  },
  {
    "url": "views/vue/vue3-reactive.html",
    "revision": "01c5e40cf3e7a581931f6ae4d9e368a6"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
