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
    "revision": "eece36722b1a726073a210aa1c2ee19b"
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
    "url": "assets/js/28.3ce4831e.js",
    "revision": "b39b8602e6913a2bdcbb82065d349182"
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
    "url": "assets/js/app.77e66a2b.js",
    "revision": "a0665fcce04f333710454dd6b6067fec"
  },
  {
    "url": "avatar.png",
    "revision": "09b5baf7c2cb9422721a03eb760d015a"
  },
  {
    "url": "categories/frontEnd/index.html",
    "revision": "ea6b712b80085f20902ef3b2f299375b"
  },
  {
    "url": "categories/frontEnd/page/2/index.html",
    "revision": "6c63b4b51ff9ed51aade83e1af52cb74"
  },
  {
    "url": "categories/frontEnd/page/3/index.html",
    "revision": "2763f0a8e35efbfaa72d125fd5af83a9"
  },
  {
    "url": "categories/index.html",
    "revision": "e56e6111c3dfb193276a80459737f690"
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
    "revision": "5c06101da0d007bc75026a38dc5e3dab"
  },
  {
    "url": "tag/CSS/index.html",
    "revision": "39d3f44165f91cd177111a98bfa789a3"
  },
  {
    "url": "tag/DOM/index.html",
    "revision": "1ddb936c4c7037f4feaa33f1ecfb429e"
  },
  {
    "url": "tag/HTTP/index.html",
    "revision": "a02ca549d8ad9256046273715beb345f"
  },
  {
    "url": "tag/index.html",
    "revision": "ea58819abd6a43ff006dde37534b352e"
  },
  {
    "url": "tag/JavaScript/index.html",
    "revision": "f1c45f4d7e1984bc715eeb93568244e9"
  },
  {
    "url": "tag/JavaScript/page/2/index.html",
    "revision": "b93bc6af7ba45b7c5bd1680722c28e90"
  },
  {
    "url": "tag/nodejs/index.html",
    "revision": "d4c08870c09ea68cadc84f721ca96fb3"
  },
  {
    "url": "tag/React/index.html",
    "revision": "9b3797ba8d34aca7b4c3cda1e8c0e20b"
  },
  {
    "url": "tag/sku/index.html",
    "revision": "8bbce067a41a0b8ce669f1e271390141"
  },
  {
    "url": "tag/TypeScript/index.html",
    "revision": "69f13aedf8f30baaef3a84780657b5c0"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "93d809031feff3728ed1d4c317d8f8fc"
  },
  {
    "url": "tag/webpack/index.html",
    "revision": "7d72395e31d24d2e009ceaa1384a3428"
  },
  {
    "url": "tag/学习笔记/index.html",
    "revision": "62446a803d4b4cdddbb259d3ba61e554"
  },
  {
    "url": "tag/安全/index.html",
    "revision": "86575159ac8bcff17b242f0554bf419d"
  },
  {
    "url": "timeline/index.html",
    "revision": "13002efda4cd3c097070662ed1924def"
  },
  {
    "url": "views/2019/webpack.html",
    "revision": "7f741da730e92a57bac6a5b37beaa17c"
  },
  {
    "url": "views/2020/042616.html",
    "revision": "ff1b77f7680c29c0388bfa6036bad0db"
  },
  {
    "url": "views/2020/constructor.html",
    "revision": "7936f54900faca4bf5fbde5826e52136"
  },
  {
    "url": "views/2020/css-practice.html",
    "revision": "afbaf94237b2d8269e78d8be947a5e42"
  },
  {
    "url": "views/2020/data-structure.html",
    "revision": "16adfd3422cdaa9e199e91119b160156"
  },
  {
    "url": "views/2020/design-model.html",
    "revision": "54c72632c64766c04e18c2b8369be14c"
  },
  {
    "url": "views/2020/regular-code.html",
    "revision": "6c97d34513ea4963705e8926eab19972"
  },
  {
    "url": "views/2020/requestAnimationFrame.html",
    "revision": "40a848cf5674960661322a9b6ef5407b"
  },
  {
    "url": "views/2020/typescript.html",
    "revision": "0cd44e41bb3ff07c9ebcbda1249a7290"
  },
  {
    "url": "views/2020/webpack-speed-up.html",
    "revision": "dafc576af1c10f607aa41c6922996ada"
  },
  {
    "url": "views/2022/nodejs.html",
    "revision": "2616dfb7bd5736631bd1bc915bf7d695"
  },
  {
    "url": "views/2022/sku.html",
    "revision": "6f7a612210bddeead93a69554c1723c1"
  },
  {
    "url": "views/2022/SSR&SSG.html",
    "revision": "d8d8d101cc1f396cccf0bdd9a5ddcc0e"
  },
  {
    "url": "views/dom/intersection-observer.html",
    "revision": "575da9a3cc6f0b4a5f08584a79813890"
  },
  {
    "url": "views/dom/resize-observer.html",
    "revision": "8a84e9f53431b258bfcd41812654c258"
  },
  {
    "url": "views/http/front-end-security.html",
    "revision": "9a1b19243c3ae2d027a791ff3a44f9d7"
  },
  {
    "url": "views/http/http-base.html",
    "revision": "42ecdc5d34ee389e379f5b51f1521348"
  },
  {
    "url": "views/http/http-cross-domain.html",
    "revision": "b0d63d23b6d3206f1058c9d45ab75974"
  },
  {
    "url": "views/js/closure.html",
    "revision": "6292b43acc280fb5d7499e1a7fef1ef4"
  },
  {
    "url": "views/js/es-object.html",
    "revision": "c4ddf46ea56ebf1c561aaaacc01f5c29"
  },
  {
    "url": "views/js/ES6-module.html",
    "revision": "a31360f19da8824c7cafcf1646dee37b"
  },
  {
    "url": "views/js/eventLoop.html",
    "revision": "19812259d21263e58e1d37a51d47c19a"
  },
  {
    "url": "views/js/execution-context.html",
    "revision": "e71a2bdccebe9f9ca4bf406fbc6a9914"
  },
  {
    "url": "views/vue/vue-hooks.html",
    "revision": "46bc4fe9a66a67caf86e58e17b084049"
  },
  {
    "url": "views/vue/vue3-reactive.html",
    "revision": "9d67ab29e392be6d448810039f2a03f3"
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
