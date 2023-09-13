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
    "revision": "85104a60ecc92cdac4f003153e768797"
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
    "url": "assets/js/app.f12e4993.js",
    "revision": "ecff4046abe6398909c0915ad8c035c6"
  },
  {
    "url": "avatar.png",
    "revision": "09b5baf7c2cb9422721a03eb760d015a"
  },
  {
    "url": "categories/frontEnd/index.html",
    "revision": "89313b7bf481a9427edb997f48b09722"
  },
  {
    "url": "categories/frontEnd/page/2/index.html",
    "revision": "82808f68b27885c559d3892e81895575"
  },
  {
    "url": "categories/frontEnd/page/3/index.html",
    "revision": "1746e24a2d5cf48066aacf074f6320e8"
  },
  {
    "url": "categories/index.html",
    "revision": "45e5f27001b24849edbdc7f20b5255bf"
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
    "revision": "e4fadc26be38400628a2d9227229dd3f"
  },
  {
    "url": "tag/CSS/index.html",
    "revision": "c43ac02e67b96a239bc98bdf6c90537f"
  },
  {
    "url": "tag/DOM/index.html",
    "revision": "f8aa0dff5aab00ff53331e124249ef6d"
  },
  {
    "url": "tag/HTTP/index.html",
    "revision": "f329cfb7f238f5f6534881b60a71647f"
  },
  {
    "url": "tag/index.html",
    "revision": "2d164d3454d458d9a290ecfdf46eb634"
  },
  {
    "url": "tag/JavaScript/index.html",
    "revision": "5f6412cf1ab0c064493f5d197e0a0cfe"
  },
  {
    "url": "tag/JavaScript/page/2/index.html",
    "revision": "18403f754557632987e2fd745163b796"
  },
  {
    "url": "tag/nodejs/index.html",
    "revision": "0f4cbd41489e23e358966c8c583cd458"
  },
  {
    "url": "tag/React/index.html",
    "revision": "aa72c01d92f7693e33f78e389754e1e8"
  },
  {
    "url": "tag/sku/index.html",
    "revision": "8cef0432e4ac020821db725197380d8d"
  },
  {
    "url": "tag/TypeScript/index.html",
    "revision": "26ffb75d8d1a05c80f16a20a00898e5e"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "f9f3acfa5d0e33b52b68a45d5412fcce"
  },
  {
    "url": "tag/webpack/index.html",
    "revision": "2a0a684e1debbdc568b4955002ce1a13"
  },
  {
    "url": "tag/学习笔记/index.html",
    "revision": "2e74540ff8ee4a8b5e4ad697f40430e0"
  },
  {
    "url": "tag/安全/index.html",
    "revision": "e32878e256981040d061d24a669780b4"
  },
  {
    "url": "timeline/index.html",
    "revision": "f00831f25df5d6bb998a5f4e3ec0d63f"
  },
  {
    "url": "views/2019/webpack.html",
    "revision": "44b6749bd6da39113c52d72db956d360"
  },
  {
    "url": "views/2020/042616.html",
    "revision": "966ab247cfb171f7887ae3aa7aab0dec"
  },
  {
    "url": "views/2020/constructor.html",
    "revision": "f0db781c6f42fd0b927845e073e89fa7"
  },
  {
    "url": "views/2020/css-practice.html",
    "revision": "9a16c77cf9c9b4d3fe2aed7b37f54506"
  },
  {
    "url": "views/2020/data-structure.html",
    "revision": "0c9a9fe83939e62b9608acb6dbda37d9"
  },
  {
    "url": "views/2020/design-model.html",
    "revision": "ffe29ac177b9abf69e17cb9af88511c9"
  },
  {
    "url": "views/2020/regular-code.html",
    "revision": "7612a4f48e1084fe94c87afc88bc0341"
  },
  {
    "url": "views/2020/requestAnimationFrame.html",
    "revision": "e4518796cb096b3571bd7a64bae768cf"
  },
  {
    "url": "views/2020/typescript.html",
    "revision": "3f8f7e70ba25a40d2830c50cc6aa2742"
  },
  {
    "url": "views/2020/webpack-speed-up.html",
    "revision": "8c8282e7153e43f764b5a22053ab02d4"
  },
  {
    "url": "views/2022/nodejs.html",
    "revision": "322fd8544beae5536e2d78e8266a573f"
  },
  {
    "url": "views/2022/sku.html",
    "revision": "0a4dd76837e41175fbe942262793ad4b"
  },
  {
    "url": "views/2022/SSR&SSG.html",
    "revision": "fc1b21482e62a3272f4f8dfb09377eb9"
  },
  {
    "url": "views/dom/intersection-observer.html",
    "revision": "c10ff5ba6a11b17b7956a0fb273d6600"
  },
  {
    "url": "views/dom/resize-observer.html",
    "revision": "bb029d06eab5316f21900ff353601670"
  },
  {
    "url": "views/http/front-end-security.html",
    "revision": "d9fe27088764de00f729c94142e5e3b8"
  },
  {
    "url": "views/http/http-base.html",
    "revision": "6ae94d32be252bc394f284906ad2e7bf"
  },
  {
    "url": "views/http/http-cross-domain.html",
    "revision": "103071a8c95797edaf8078d3425479b7"
  },
  {
    "url": "views/js/closure.html",
    "revision": "f1bdd3f1540ad7b6b51d5b2ca0e0ae26"
  },
  {
    "url": "views/js/es-object.html",
    "revision": "9bf1be8569e2177b4e9b8ca6a4fd2ef8"
  },
  {
    "url": "views/js/ES6-module.html",
    "revision": "d0fdfee31b247be9a1fb36d20511fa7b"
  },
  {
    "url": "views/js/eventLoop.html",
    "revision": "a9e48cb6462a47fcc2294bce1f2fa69a"
  },
  {
    "url": "views/js/execution-context.html",
    "revision": "b924ca5a120a390daa561bec2a62e42b"
  },
  {
    "url": "views/vue/vue-lifetime.html",
    "revision": "1fb7020b19c857320babb73b6f504d11"
  },
  {
    "url": "views/vue/vue3-reactive.html",
    "revision": "4ee33fef9b1dbcd4b574c33789b06636"
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
