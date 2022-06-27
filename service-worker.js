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
    "revision": "17c9fe2a9d41a2cb6fb1699e1bb35260"
  },
  {
    "url": "assets/css/0.styles.e5d14f25.css",
    "revision": "ba9a05a2c15644b7342540b964b989b7"
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
    "url": "assets/js/1.32e05f2b.js",
    "revision": "576f3481c931085bd2df3f68194b29cf"
  },
  {
    "url": "assets/js/10.8d183476.js",
    "revision": "4ec08461b575e0ab3b35a99b73780c08"
  },
  {
    "url": "assets/js/11.329a7d0f.js",
    "revision": "e9d2743f7d242648532ec914a05af19d"
  },
  {
    "url": "assets/js/12.4d56c898.js",
    "revision": "50c2343f564f5bff47f6cbb0fd31f93d"
  },
  {
    "url": "assets/js/13.0c15316b.js",
    "revision": "8607ec41da84ec46045d339a621da12a"
  },
  {
    "url": "assets/js/14.f341845e.js",
    "revision": "7c69936ae059ab6a6e6f4e4da2f7f52b"
  },
  {
    "url": "assets/js/15.7b10223c.js",
    "revision": "fafa14bfce05709a65798ea8415e7c11"
  },
  {
    "url": "assets/js/16.aaf0a2b1.js",
    "revision": "2bb0e5941f34a26441f2ed6632e46b16"
  },
  {
    "url": "assets/js/17.3df63ac4.js",
    "revision": "3f0b8cf8bf069426363220fb708a4c52"
  },
  {
    "url": "assets/js/18.6d977263.js",
    "revision": "0bdfe455e735723543aae8039efc1f5a"
  },
  {
    "url": "assets/js/19.30610909.js",
    "revision": "40988646e26e5a84f66b1fbd44784291"
  },
  {
    "url": "assets/js/20.379b0629.js",
    "revision": "174ca80246af4e13d0a9a0bfa51f403e"
  },
  {
    "url": "assets/js/21.2733e991.js",
    "revision": "059fd45055c17718b92396533c9bcf03"
  },
  {
    "url": "assets/js/22.3e353341.js",
    "revision": "7afc886de8881c54d16edad35093d733"
  },
  {
    "url": "assets/js/23.e5620d49.js",
    "revision": "5ea917bbbbcee03e9656a2505b82ec93"
  },
  {
    "url": "assets/js/24.d8595f7d.js",
    "revision": "1b816c2b8cf936e6ffea04c9a140f910"
  },
  {
    "url": "assets/js/25.7095d50e.js",
    "revision": "e578e6e16f76bbf8d3c3fb50e4104ced"
  },
  {
    "url": "assets/js/26.be66be2c.js",
    "revision": "ed1b2c8c8d70961d46dc9f67f6ad3c89"
  },
  {
    "url": "assets/js/27.de0e3c71.js",
    "revision": "acd33593917b48f7b68abbe3f061610f"
  },
  {
    "url": "assets/js/28.e18cbe25.js",
    "revision": "397f0210f6f56c408a5209a553727344"
  },
  {
    "url": "assets/js/29.ed012321.js",
    "revision": "acb11aae670a75e5d9ffb65eeecfda0c"
  },
  {
    "url": "assets/js/3.434a33f8.js",
    "revision": "b2d383049304428e98b01c631b6eb41b"
  },
  {
    "url": "assets/js/30.533ee78c.js",
    "revision": "85dd39f41ee137121febab6120b0fe5d"
  },
  {
    "url": "assets/js/31.76996670.js",
    "revision": "b0629839d0ced46e9c932ec5b0cda508"
  },
  {
    "url": "assets/js/32.617ee5b4.js",
    "revision": "101e4375ad04f99bbf4920310ac3cb94"
  },
  {
    "url": "assets/js/33.585cf783.js",
    "revision": "e41fc7c501ba99758a1c6d439eaeae49"
  },
  {
    "url": "assets/js/34.5ca815fd.js",
    "revision": "d901bdf587749f5e2c5ddc7417f15bbb"
  },
  {
    "url": "assets/js/35.c661472c.js",
    "revision": "fb22c606f05b25f489abb9bb93e90007"
  },
  {
    "url": "assets/js/36.538b2b41.js",
    "revision": "c3dff00d65eb70da902463cefb9d2fbf"
  },
  {
    "url": "assets/js/37.d25c3793.js",
    "revision": "ae20d7c40c0f8edaaf4a86a09b1f2a76"
  },
  {
    "url": "assets/js/4.f8a03f16.js",
    "revision": "a7aa208edfcf2411d66c8a3c9a5437b7"
  },
  {
    "url": "assets/js/5.97e22675.js",
    "revision": "e967fc2d728dd3d97663173272f60dd0"
  },
  {
    "url": "assets/js/6.66819944.js",
    "revision": "90b5eec14e899ee543705c826147ba38"
  },
  {
    "url": "assets/js/7.1f8ac238.js",
    "revision": "8196324039d8e45b91964690741f1e31"
  },
  {
    "url": "assets/js/8.2de49000.js",
    "revision": "3f45d94dc6b05797ac4d814e206b79ed"
  },
  {
    "url": "assets/js/9.dae10805.js",
    "revision": "013c161ee73fa03b98648fe5a5889c9e"
  },
  {
    "url": "assets/js/app.1bc9607c.js",
    "revision": "6f9c603bae657c074c6bbb1fe0f92e2c"
  },
  {
    "url": "avatar.png",
    "revision": "09b5baf7c2cb9422721a03eb760d015a"
  },
  {
    "url": "categories/frontEnd/index.html",
    "revision": "8154991e07326b65cd7d0ec5aeb40e2b"
  },
  {
    "url": "categories/frontEnd/page/2/index.html",
    "revision": "c0abd3822aa159491c2d186dbb8f7d2f"
  },
  {
    "url": "categories/frontEnd/page/3/index.html",
    "revision": "8c899226a703b22597dd4d4317fceaa7"
  },
  {
    "url": "categories/index.html",
    "revision": "fba0fa81d1bfde408e40691b905d5474"
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
    "revision": "ff75172549fe9695fa58cf76827863af"
  },
  {
    "url": "tag/CSS/index.html",
    "revision": "724e62be6d1b152014a1f0f123613204"
  },
  {
    "url": "tag/DOM/index.html",
    "revision": "5ccaad293a394d1df49006dca0a67098"
  },
  {
    "url": "tag/HTTP/index.html",
    "revision": "1ed7f9e536445df680c2e7c0640d80a6"
  },
  {
    "url": "tag/index.html",
    "revision": "c855d3afbb52de8985a80239afc9ca97"
  },
  {
    "url": "tag/JavaScript/index.html",
    "revision": "efc8e9c09d641ad9f1eaf31a85baa948"
  },
  {
    "url": "tag/JavaScript/page/2/index.html",
    "revision": "8fb20124306136492698e8d041994d79"
  },
  {
    "url": "tag/nodejs/index.html",
    "revision": "cff061e29713ebd147ba175e4bb719a5"
  },
  {
    "url": "tag/sku/index.html",
    "revision": "15d9e97d1c96eb976dc7b3d99fc652bc"
  },
  {
    "url": "tag/TypeScript/index.html",
    "revision": "a72b102ba88ac703b07782b9e50b82d3"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "b5c826d19896a51bbc2a657ea3b4ec1e"
  },
  {
    "url": "tag/webpack/index.html",
    "revision": "daba133c22532bd51f27335d02c9d2ae"
  },
  {
    "url": "tag/学习笔记/index.html",
    "revision": "7febeabf713cc0dfe002757d6a910364"
  },
  {
    "url": "tag/安全/index.html",
    "revision": "af56f3f0523dbb21d3cfbfeb36aaf084"
  },
  {
    "url": "timeline/index.html",
    "revision": "844aa0ada70bce094733b8a9bb621df4"
  },
  {
    "url": "views/2019/webpack.html",
    "revision": "12fd0e2e6590f25762052f81e7dbe874"
  },
  {
    "url": "views/2020/042616.html",
    "revision": "919bef291f59adc992479331fcb6b60f"
  },
  {
    "url": "views/2020/constructor.html",
    "revision": "ab9908f3979a6069d208c93e3a837dae"
  },
  {
    "url": "views/2020/css-practice.html",
    "revision": "a038fee40a9c5d3191a0c2ce325fad32"
  },
  {
    "url": "views/2020/data-structure.html",
    "revision": "c00fdc20e14a84b4b565b8de5d1a31eb"
  },
  {
    "url": "views/2020/design-model.html",
    "revision": "773cadf1ccb92c1416732fa98191d507"
  },
  {
    "url": "views/2020/regular-code.html",
    "revision": "349423dfc2c563fa97b40eb1c4539b4d"
  },
  {
    "url": "views/2020/requestAnimationFrame.html",
    "revision": "b8a2ff45a79f8e016d76a975b10e7855"
  },
  {
    "url": "views/2020/typescript.html",
    "revision": "f299984fd3150afb395416478134e79f"
  },
  {
    "url": "views/2020/webpack-speed-up.html",
    "revision": "a678ac55dba6bd3122a0e203c41ddde8"
  },
  {
    "url": "views/2022/nodejs.html",
    "revision": "745eb0daeb7b709e7ea9f8b4863522ea"
  },
  {
    "url": "views/2022/sku.html",
    "revision": "8885e7c4555e8fbdec4032215579bdef"
  },
  {
    "url": "views/dom/intersection-observer.html",
    "revision": "9c196095ff92334da6bf8e827493300f"
  },
  {
    "url": "views/dom/resize-observer.html",
    "revision": "3e886df063bcb5fbbbd1b8dac36c9508"
  },
  {
    "url": "views/http/front-end-security.html",
    "revision": "97775597ee7ee7ec2a262aa14f43316d"
  },
  {
    "url": "views/http/http-base.html",
    "revision": "80ff850b8daecfc75671fb9a15ee4a93"
  },
  {
    "url": "views/http/http-cross-domain.html",
    "revision": "22104e73340d8340d25cd17185c92adc"
  },
  {
    "url": "views/http/index.html",
    "revision": "fbd1cca5e2039c59bd7b3fef8e8565cc"
  },
  {
    "url": "views/js/closure.html",
    "revision": "e57305ae804b4652d069a77188f73725"
  },
  {
    "url": "views/js/es-object.html",
    "revision": "9bc50545fd86aa20a3d32a769b62b3ca"
  },
  {
    "url": "views/js/ES6-module.html",
    "revision": "49e9109601f1864c12bb0d62d2a6a32f"
  },
  {
    "url": "views/js/eventLoop.html",
    "revision": "fc3c6fabf9c0f0c3a1fe82773d540276"
  },
  {
    "url": "views/js/execution-context.html",
    "revision": "dc68a4cf88c9bcc4fd23c9d602d5a515"
  },
  {
    "url": "views/vue/vue-hooks.html",
    "revision": "8e4b15c03d4fbe7c7f3720922197048d"
  },
  {
    "url": "views/vue/vue3-reactive.html",
    "revision": "2d535936577ca8f074836b06b149c2c5"
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
