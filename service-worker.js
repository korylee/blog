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
    "revision": "c4cd0b68b838701e874b22a18c156e8a"
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
    "url": "assets/js/18.724a3378.js",
    "revision": "f6707e54f227fd4a480c76266eda6e63"
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
    "url": "assets/js/35.ec168881.js",
    "revision": "5f6341c01af93e351d8f60c1240d2765"
  },
  {
    "url": "assets/js/36.0a3bff66.js",
    "revision": "5e4323c7a7f896f65bbc823845115514"
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
    "url": "assets/js/app.78442544.js",
    "revision": "834fc3769ece17bc561e8f6fbcb493d7"
  },
  {
    "url": "avatar.png",
    "revision": "09b5baf7c2cb9422721a03eb760d015a"
  },
  {
    "url": "categories/frontEnd/index.html",
    "revision": "ee40ad4fe10d24f687a54c544857abee"
  },
  {
    "url": "categories/frontEnd/page/2/index.html",
    "revision": "8530f993be43703040a3d3acc8976d97"
  },
  {
    "url": "categories/frontEnd/page/3/index.html",
    "revision": "fdddc5ef5664947151ae42632c3b6292"
  },
  {
    "url": "categories/index.html",
    "revision": "15035111d0ebf95ee2fd000e1c49057c"
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
    "revision": "fdc712d68aaa79f29ada36481e3de4e3"
  },
  {
    "url": "tag/CSS/index.html",
    "revision": "ce1b0339b72d2174ddd84396b589e4f4"
  },
  {
    "url": "tag/DOM/index.html",
    "revision": "52205c50b89420a18c14f714cff44363"
  },
  {
    "url": "tag/HTTP/index.html",
    "revision": "614897eedd40b3502f48ce106fd73790"
  },
  {
    "url": "tag/index.html",
    "revision": "212a67a52d1c7ead56103d1f921490b6"
  },
  {
    "url": "tag/JavaScript/index.html",
    "revision": "050c33727be27574dab9d2009b09a3c0"
  },
  {
    "url": "tag/JavaScript/page/2/index.html",
    "revision": "19c99eda85abd99c8be5240b61487a41"
  },
  {
    "url": "tag/nodejs/index.html",
    "revision": "ae45130df2a7c027ae8411bab38ecd10"
  },
  {
    "url": "tag/React/index.html",
    "revision": "cef6e2b9cdedeeba69315415068e109e"
  },
  {
    "url": "tag/sku/index.html",
    "revision": "fc09839b09dc7d58df8600e9b1cdd071"
  },
  {
    "url": "tag/TypeScript/index.html",
    "revision": "81a438144795dde33a0e7e770c335045"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "93b383861c45b59f13d9cec6b0ece511"
  },
  {
    "url": "tag/webpack/index.html",
    "revision": "8231a89725f54e7523ebfff212d828c4"
  },
  {
    "url": "tag/学习笔记/index.html",
    "revision": "95d35ee7827932a408707505341821f4"
  },
  {
    "url": "tag/安全/index.html",
    "revision": "ae51f870e1eba2963eab9a1b551f8bef"
  },
  {
    "url": "timeline/index.html",
    "revision": "0f28cb41de2a321fb2371dcf63ee3c12"
  },
  {
    "url": "views/2019/webpack.html",
    "revision": "214de62b65b191164aa2323d423c92fb"
  },
  {
    "url": "views/2020/042616.html",
    "revision": "d5e2b2fab3336c5d34e88df584495c7c"
  },
  {
    "url": "views/2020/constructor.html",
    "revision": "7b865c5d0d43036c8018903b738efdcb"
  },
  {
    "url": "views/2020/css-practice.html",
    "revision": "0aa20b36431561a3b2154447ef026eeb"
  },
  {
    "url": "views/2020/data-structure.html",
    "revision": "f92c142928efd7c45fd63b810cd5ca10"
  },
  {
    "url": "views/2020/design-model.html",
    "revision": "1fa51dd1d7fc08eca5fa266850c66f8b"
  },
  {
    "url": "views/2020/regular-code.html",
    "revision": "91c717228751563daebd6432174aae31"
  },
  {
    "url": "views/2020/requestAnimationFrame.html",
    "revision": "0114a10a58d4847ba8305807b2767ae5"
  },
  {
    "url": "views/2020/typescript.html",
    "revision": "2c6e14b66f52e13d721d01db5dcc75e9"
  },
  {
    "url": "views/2020/webpack-speed-up.html",
    "revision": "9ba1efb86d7991e88ded0641d46ee300"
  },
  {
    "url": "views/2022/nodejs.html",
    "revision": "a52a9b345c0e2517be39c54ed0176181"
  },
  {
    "url": "views/2022/sku.html",
    "revision": "4f1fd4196309170a87b19da94d714f15"
  },
  {
    "url": "views/2022/SSR&SSG.html",
    "revision": "78095a6b3a68a52bab875df5220732b4"
  },
  {
    "url": "views/dom/intersection-observer.html",
    "revision": "a40db0d97229ef54ef4759248611f4cb"
  },
  {
    "url": "views/dom/resize-observer.html",
    "revision": "c1fa50cee7383b1ec54872b0232c9afd"
  },
  {
    "url": "views/http/front-end-security.html",
    "revision": "cd96f70ebe535706bb42d5309a2e95c0"
  },
  {
    "url": "views/http/http-base.html",
    "revision": "67b0a9472816bcf0de916efeeceac110"
  },
  {
    "url": "views/http/http-cross-domain.html",
    "revision": "91be0e4cdf3a5f5c06a56bd266b69ab3"
  },
  {
    "url": "views/js/closure.html",
    "revision": "79b646cc71c2d5df1d2cf4d69633a153"
  },
  {
    "url": "views/js/es-object.html",
    "revision": "1b0de7efaf48fc0fbeea1de24c1849a0"
  },
  {
    "url": "views/js/ES6-module.html",
    "revision": "0dd7bdc15b8d3b609d745af59babde5c"
  },
  {
    "url": "views/js/eventLoop.html",
    "revision": "b53e967be5c3e73bcf932e50d148afd1"
  },
  {
    "url": "views/js/execution-context.html",
    "revision": "3c9e3b72dd55be8aed6e02e641e4b822"
  },
  {
    "url": "views/vue/vue-lifetime.html",
    "revision": "81a3b48ad90a5fc997e34f44e6f406e1"
  },
  {
    "url": "views/vue/vue3-reactive.html",
    "revision": "bf1d3cf6d77be0c83095fb5af97946c0"
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
