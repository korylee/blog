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
    "revision": "ea840d6e03c48bea0baf37cf55f9bf98"
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
    "url": "assets/js/22.c6bf5ad2.js",
    "revision": "00a956ba5dbb5abc60fccd405955fdd0"
  },
  {
    "url": "assets/js/23.f5af7961.js",
    "revision": "16b9c959e35db0034a118939b31746eb"
  },
  {
    "url": "assets/js/24.13766eba.js",
    "revision": "ecca333cb2d798730629b110a051909d"
  },
  {
    "url": "assets/js/25.9ee51df5.js",
    "revision": "46fdfecfb11d225c1644ac0c021cd026"
  },
  {
    "url": "assets/js/26.de7ebf57.js",
    "revision": "ac1af3480572aa46f58b83708e5cefc6"
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
    "url": "assets/js/app.5959696a.js",
    "revision": "9772314419a058ded905a2438bbac0a3"
  },
  {
    "url": "avatar.png",
    "revision": "09b5baf7c2cb9422721a03eb760d015a"
  },
  {
    "url": "categories/frontEnd/index.html",
    "revision": "cd784ee134fe8d28fddd83cf63eca72a"
  },
  {
    "url": "categories/frontEnd/page/2/index.html",
    "revision": "cd9934f30100245f6c8589ed6ceede57"
  },
  {
    "url": "categories/frontEnd/page/3/index.html",
    "revision": "76d7149a749888fe8ce57b66177ad224"
  },
  {
    "url": "categories/index.html",
    "revision": "a4832800860dfa35e6dfe4cf44323c90"
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
    "revision": "4eba67db8f847756aee8afd4df3591f9"
  },
  {
    "url": "tag/CSS/index.html",
    "revision": "ba15a7f21a9facecacec459fb14cc3cf"
  },
  {
    "url": "tag/DOM/index.html",
    "revision": "0afe57bd1ea575655b5484b26f6ba71b"
  },
  {
    "url": "tag/HTTP/index.html",
    "revision": "eaf92afc3f08a5c40ec8bd01669fb6c5"
  },
  {
    "url": "tag/index.html",
    "revision": "e13ad627563eb96df361a36db4c3dcee"
  },
  {
    "url": "tag/JavaScript/index.html",
    "revision": "5312cedbf2b0aa73cb3e198c4cad2e9b"
  },
  {
    "url": "tag/JavaScript/page/2/index.html",
    "revision": "c8973309c74d7c9d723ae75e5e1297c1"
  },
  {
    "url": "tag/nodejs/index.html",
    "revision": "09b7ba0b2287bccf7bb282d8bff91807"
  },
  {
    "url": "tag/sku/index.html",
    "revision": "cd161a6a840f1aabc3cf01278dcc7f94"
  },
  {
    "url": "tag/TypeScript/index.html",
    "revision": "c96e8eca6535861a6cd115e787ee9f6f"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "089329295cbd8b56e055259a1f44eaaf"
  },
  {
    "url": "tag/webpack/index.html",
    "revision": "585a9e8eb53fce47da7bf3dd15ef5bbc"
  },
  {
    "url": "tag/学习笔记/index.html",
    "revision": "b9dda32b9368e78e2904893c9515db19"
  },
  {
    "url": "tag/安全/index.html",
    "revision": "3980e681768e8ab95810907d567e7c79"
  },
  {
    "url": "timeline/index.html",
    "revision": "1e29f2879d3f0160b0634b3824a335d2"
  },
  {
    "url": "views/2019/webpack.html",
    "revision": "df2d35e1fb1c2eb061baca3c5c327439"
  },
  {
    "url": "views/2020/042616.html",
    "revision": "5f807a4919dc444cbe9e210c2d8f3ebf"
  },
  {
    "url": "views/2020/constructor.html",
    "revision": "faee64e4ddba6a0b6c464f3a6c7278bb"
  },
  {
    "url": "views/2020/css-practice.html",
    "revision": "05d7a9950c0b0d28828c6317f9a54ffc"
  },
  {
    "url": "views/2020/data-structure.html",
    "revision": "4187b5eb62369b98c835240529ca2d2c"
  },
  {
    "url": "views/2020/design-model.html",
    "revision": "16ea7aa356bc96c502e527265121f573"
  },
  {
    "url": "views/2020/regular-code.html",
    "revision": "1fae3eee569d1412afddfd5f8bad209d"
  },
  {
    "url": "views/2020/requestAnimationFrame.html",
    "revision": "8ca70697c65d653f5226f42f6b7baf82"
  },
  {
    "url": "views/2020/typescript.html",
    "revision": "78f80b1f191fb329c7679c40291cef87"
  },
  {
    "url": "views/2020/webpack-speed-up.html",
    "revision": "cc70979646cf4e7e0abeda415587ba24"
  },
  {
    "url": "views/2022/nodejs.html",
    "revision": "d538f18e552fbda534de495795999696"
  },
  {
    "url": "views/2022/sku.html",
    "revision": "d777993af7f3a290613f2ac9d4e7f3cd"
  },
  {
    "url": "views/dom/intersection-observer.html",
    "revision": "4fb9a415775549278e5cafb54bbeb663"
  },
  {
    "url": "views/dom/resize-observer.html",
    "revision": "31538b35065a430a703e3e195370a6fe"
  },
  {
    "url": "views/http/front-end-security.html",
    "revision": "4a2ab8d967692ca44b1a9a5bedf67a5d"
  },
  {
    "url": "views/http/http-base.html",
    "revision": "34e482976e56ea2f57f389542ce30619"
  },
  {
    "url": "views/http/http-cross-domain.html",
    "revision": "1ac8f43391904945faafbced93e4da56"
  },
  {
    "url": "views/http/index.html",
    "revision": "70b5930f90837ccd6949d9ff56dbbbf1"
  },
  {
    "url": "views/js/closure.html",
    "revision": "0c2342c11ce14e453b4a7c087c16dc77"
  },
  {
    "url": "views/js/es-object.html",
    "revision": "cdf712e40dbff32f4bcb975fddc9cbdf"
  },
  {
    "url": "views/js/ES6-module.html",
    "revision": "3119c7dd85eb4d3bcb1b8301f1e90104"
  },
  {
    "url": "views/js/eventLoop.html",
    "revision": "d3fb9993766f869c300f0a7c3669efc7"
  },
  {
    "url": "views/js/execution-context.html",
    "revision": "f655214a282139f65131d4d8bb74ff4c"
  },
  {
    "url": "views/vue/vue-hooks.html",
    "revision": "0eb1c291f7d75993a604e4a8cd6de203"
  },
  {
    "url": "views/vue/vue3-reactive.html",
    "revision": "b3a5fb5dcdded39789932d233d55942a"
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
