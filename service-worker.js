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
    "revision": "bda82cab1e86f7fd90e5ba15ecd307e3"
  },
  {
    "url": "assets/css/0.styles.257c2cf1.css",
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
    "url": "assets/js/1.1171ce4e.js",
    "revision": "0759a29f0de79d74009ba174f346dc9e"
  },
  {
    "url": "assets/js/10.9cd6b22a.js",
    "revision": "8f0a81e30aa288fc055ffe2e30afc1ff"
  },
  {
    "url": "assets/js/11.e43ef649.js",
    "revision": "c73d464bdc730c69a38025be8a421c92"
  },
  {
    "url": "assets/js/12.b22fdb86.js",
    "revision": "25e511fb023a7714e7d3ad76825a8549"
  },
  {
    "url": "assets/js/13.66a15cd6.js",
    "revision": "f9e8ad0811dfda9ae7d941e854a24daa"
  },
  {
    "url": "assets/js/14.3b271529.js",
    "revision": "e2f33255c43e745c3050f4d28bdda168"
  },
  {
    "url": "assets/js/15.2f0461bd.js",
    "revision": "ebf3d31034ae1ad8cc2db3cbe707b744"
  },
  {
    "url": "assets/js/16.0b9b8525.js",
    "revision": "344adf32622ea358903cbaeb91cab8fb"
  },
  {
    "url": "assets/js/17.fa88c583.js",
    "revision": "5623ee6a65b52c22e23d918e21a7dca1"
  },
  {
    "url": "assets/js/18.9903e93d.js",
    "revision": "9879b5e66a68e1e1a66f322a1e326ea2"
  },
  {
    "url": "assets/js/19.12192a7c.js",
    "revision": "554e37d3c9d819fb9f33c96212bcfa0e"
  },
  {
    "url": "assets/js/20.115a1995.js",
    "revision": "a409ba11b248cde87c03b7f83878d065"
  },
  {
    "url": "assets/js/21.80924169.js",
    "revision": "f08b3d881ec19b4f982bda9a21bed8ed"
  },
  {
    "url": "assets/js/22.7ff92efc.js",
    "revision": "96689a433f25f6b437498c9707f876a1"
  },
  {
    "url": "assets/js/23.6525c817.js",
    "revision": "f88e9b7286f4c91d7d87243cb3dff4df"
  },
  {
    "url": "assets/js/24.a955f9b0.js",
    "revision": "deaf40b41f5fcee67b9e97a57144951e"
  },
  {
    "url": "assets/js/25.0be9fc91.js",
    "revision": "e6b476a35eb44c9229e3e5fee5bb4803"
  },
  {
    "url": "assets/js/26.292b7e2c.js",
    "revision": "a8333902f88217a1c446ae0ca336b5d0"
  },
  {
    "url": "assets/js/27.fa90754e.js",
    "revision": "39d1ec89364a37c42ad0e8664e5bf18a"
  },
  {
    "url": "assets/js/28.1798ea2f.js",
    "revision": "480cf3217065c27c2c5dc2baa20ffefb"
  },
  {
    "url": "assets/js/29.e8325b2e.js",
    "revision": "397598c541f3539408aa6823104a5034"
  },
  {
    "url": "assets/js/3.0ac8ca5b.js",
    "revision": "9c4bc0d1f836074d1f29d6f9c31a3cf8"
  },
  {
    "url": "assets/js/30.140341e2.js",
    "revision": "97c43b23005aa53bb486919dd4d01982"
  },
  {
    "url": "assets/js/31.8d77df6b.js",
    "revision": "8db488c288223017d0a0c10ba8c42de1"
  },
  {
    "url": "assets/js/32.e3ca2e64.js",
    "revision": "1a98856e5b3cc43fb75760907820d830"
  },
  {
    "url": "assets/js/33.01ca67e3.js",
    "revision": "d749a8a0a1b477a8d43c93e6c86d1785"
  },
  {
    "url": "assets/js/34.e8662591.js",
    "revision": "e9d839d56c4181587f1eea6bf0114436"
  },
  {
    "url": "assets/js/35.4f01a316.js",
    "revision": "5f6341c01af93e351d8f60c1240d2765"
  },
  {
    "url": "assets/js/36.5940a8c1.js",
    "revision": "588d9d0e99b12ccb7839e009544e1b0e"
  },
  {
    "url": "assets/js/37.978027f0.js",
    "revision": "14a87d034aa6ca63c0b77093f0775e47"
  },
  {
    "url": "assets/js/4.a102d3e6.js",
    "revision": "c70977fc2a094a215ab67d19dd37b166"
  },
  {
    "url": "assets/js/5.328b3497.js",
    "revision": "29dbb2d9e162f7c55817630383864851"
  },
  {
    "url": "assets/js/6.ea451bbf.js",
    "revision": "389205e7c09177ed62110978b9e86992"
  },
  {
    "url": "assets/js/7.7a668846.js",
    "revision": "21f70387348c78155051137b2e506122"
  },
  {
    "url": "assets/js/8.51a5a72e.js",
    "revision": "2bb7c0988251e06dd1eedc47138aeec1"
  },
  {
    "url": "assets/js/9.259b0972.js",
    "revision": "d47c3057879b8a3616f870a5fa966dfe"
  },
  {
    "url": "assets/js/app.13fb81b7.js",
    "revision": "f41a6d7fdb5c949817cda8c5ebc1541b"
  },
  {
    "url": "avatar.png",
    "revision": "09b5baf7c2cb9422721a03eb760d015a"
  },
  {
    "url": "categories/frontEnd/index.html",
    "revision": "2d87f7bd4e0ccef202b7f55d447dce74"
  },
  {
    "url": "categories/frontEnd/page/2/index.html",
    "revision": "5ef019cb0945fb417fa530ac68306bfe"
  },
  {
    "url": "categories/frontEnd/page/3/index.html",
    "revision": "3e9466d5ff076dcb08c3b1c84ffb8bd4"
  },
  {
    "url": "categories/index.html",
    "revision": "d5cb2022536e14e5b61645de49dda82d"
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
    "revision": "6cc61a3f713794e8f1de34ee333cb8ad"
  },
  {
    "url": "tag/CSS/index.html",
    "revision": "01cf2879c78e8b8306d08049342b2779"
  },
  {
    "url": "tag/DOM/index.html",
    "revision": "21af09af7aced439a1996a36cf654a68"
  },
  {
    "url": "tag/HTTP/index.html",
    "revision": "615fa84358fba411930adc8349744c40"
  },
  {
    "url": "tag/index.html",
    "revision": "0372a31c62d8071ec778ffcfb4eeac41"
  },
  {
    "url": "tag/JavaScript/index.html",
    "revision": "4e38cd2e52c19d85e71dbb81fa66941d"
  },
  {
    "url": "tag/JavaScript/page/2/index.html",
    "revision": "2e79caf34bba40cb354de2fde82b4825"
  },
  {
    "url": "tag/nodejs/index.html",
    "revision": "a8f392556b22c7e933e84208bc9390eb"
  },
  {
    "url": "tag/React/index.html",
    "revision": "c96d6706ea82f25b84fb827efdfd63f3"
  },
  {
    "url": "tag/sku/index.html",
    "revision": "fd35b083c83a6680c67490dbad042896"
  },
  {
    "url": "tag/TypeScript/index.html",
    "revision": "ef0505d053d68812c0f5605d728814a2"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "febfc44b5b904c67540b2897e5fdee97"
  },
  {
    "url": "tag/webpack/index.html",
    "revision": "9df926e45237f6dfb8b89eb38a9b35b7"
  },
  {
    "url": "tag/学习笔记/index.html",
    "revision": "774f1513f1874e9cdcc0304492ec0836"
  },
  {
    "url": "tag/安全/index.html",
    "revision": "1e34c225c6318b8e8232bb2782cb5f9c"
  },
  {
    "url": "timeline/index.html",
    "revision": "e53af4353afa26ec3699f1da8dd07cad"
  },
  {
    "url": "views/2019/webpack.html",
    "revision": "7bf2f3e94b5c57f2ca4620d3f90fd0e9"
  },
  {
    "url": "views/2020/042616.html",
    "revision": "8b749b48c28eb9039e0a397d83742d26"
  },
  {
    "url": "views/2020/constructor.html",
    "revision": "69fbb9fa8c7f65cbc276a75ff9b9615e"
  },
  {
    "url": "views/2020/css-practice.html",
    "revision": "900aa0874bbefbd4c9ba3a60f3dd97d8"
  },
  {
    "url": "views/2020/data-structure.html",
    "revision": "78a4afc1c85e036ad214231f91ff331a"
  },
  {
    "url": "views/2020/design-model.html",
    "revision": "66d7d4840ab6c367305718c273dfe974"
  },
  {
    "url": "views/2020/regular-code.html",
    "revision": "0f5272f14d23b4ad9090b758cb3df0da"
  },
  {
    "url": "views/2020/requestAnimationFrame.html",
    "revision": "e455d94cdf9cf68f14b7ca1bbf3406f3"
  },
  {
    "url": "views/2020/typescript.html",
    "revision": "a06e34111c0cbb1b22bbeddbad123ed7"
  },
  {
    "url": "views/2020/webpack-speed-up.html",
    "revision": "abef957b216c3a7978566d6a28e61961"
  },
  {
    "url": "views/2022/nodejs.html",
    "revision": "dd67f03f2feb4d57e265952292c5bea6"
  },
  {
    "url": "views/2022/sku.html",
    "revision": "70a527528eb67dbd2d281df99ecce9f4"
  },
  {
    "url": "views/2022/SSR&SSG.html",
    "revision": "7d466ba335d84aa1ea300db402b69c31"
  },
  {
    "url": "views/dom/intersection-observer.html",
    "revision": "95dc75d5b32372e26b88669ea0c08c63"
  },
  {
    "url": "views/dom/resize-observer.html",
    "revision": "4cce9d844201b35e592d7b2ca9f1df0b"
  },
  {
    "url": "views/http/front-end-security.html",
    "revision": "f167798a425aeaad2fc300a94ff8c3c5"
  },
  {
    "url": "views/http/http-base.html",
    "revision": "e30056ca91029d86073f115f9025ca4f"
  },
  {
    "url": "views/http/http-cross-domain.html",
    "revision": "3aa9f6cf0bffa5f65d982883e7f68fb0"
  },
  {
    "url": "views/js/closure.html",
    "revision": "b1cf683d0f8b987a0b45ad678b48d25e"
  },
  {
    "url": "views/js/es-object.html",
    "revision": "e79dbf64844ab015c9787fc534563ccc"
  },
  {
    "url": "views/js/ES6-module.html",
    "revision": "9e273c8f16d613bcd4b60eb71e060388"
  },
  {
    "url": "views/js/eventLoop.html",
    "revision": "0df618631cfebb955d35de9afd53c04b"
  },
  {
    "url": "views/js/execution-context.html",
    "revision": "da6e13e3ebc09de3b893737cf46e9706"
  },
  {
    "url": "views/vue/vue-hooks.html",
    "revision": "9ef2b72aa92b90be48480b70771651d2"
  },
  {
    "url": "views/vue/vue3-reactive.html",
    "revision": "d977acf05c97b5e327396b4496106be4"
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
