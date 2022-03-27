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
    "revision": "e13de3c0e41df3991b14ffcc79572cb4"
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
    "url": "assets/js/10.c65f26ff.js",
    "revision": "f86c7d907a88aa098230dd0023d87212"
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
    "url": "assets/js/22.cfa84449.js",
    "revision": "6a63762ea276d7e20e32633af9711eb8"
  },
  {
    "url": "assets/js/23.58efe58c.js",
    "revision": "e685d5afcf3a1582b9fc73cf4e97ca03"
  },
  {
    "url": "assets/js/24.40b6cf44.js",
    "revision": "afc62a07384dc533dd72390553f82398"
  },
  {
    "url": "assets/js/25.15f90830.js",
    "revision": "6e319ea4a63e5ac2027cda77611baf55"
  },
  {
    "url": "assets/js/26.6958f5f9.js",
    "revision": "4f7e766876d9234b927d4032049dbb08"
  },
  {
    "url": "assets/js/27.4f31c36a.js",
    "revision": "3f42a29666a3fcef063f76f2fcf53094"
  },
  {
    "url": "assets/js/28.3bdc95f2.js",
    "revision": "ab3c79a08689575c35d29f91f5a52a63"
  },
  {
    "url": "assets/js/29.6c947cd1.js",
    "revision": "6c2d7de6be03e5f2122db03fd9e47517"
  },
  {
    "url": "assets/js/3.434a33f8.js",
    "revision": "b2d383049304428e98b01c631b6eb41b"
  },
  {
    "url": "assets/js/30.c23af6c3.js",
    "revision": "c06db95b053aaea8f381fc9d3ee5e2b6"
  },
  {
    "url": "assets/js/31.9656a7aa.js",
    "revision": "75a2edfde289a3068e74b23315852122"
  },
  {
    "url": "assets/js/32.06a05022.js",
    "revision": "708a4e939d771c327bedd2820f2dc70a"
  },
  {
    "url": "assets/js/33.e0a64371.js",
    "revision": "6709d24f37b0c71e27497a2045f8a2bd"
  },
  {
    "url": "assets/js/34.578180ef.js",
    "revision": "acc0db23cb234a22cb16f7490205f02e"
  },
  {
    "url": "assets/js/35.a44c3e55.js",
    "revision": "471af036c857be7bce909202b6334155"
  },
  {
    "url": "assets/js/36.478e7357.js",
    "revision": "45fb0d37fc9f3be85849743fe84e4449"
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
    "url": "assets/js/app.d253a4fb.js",
    "revision": "6e7d253e8eb3135d8da3a2a5d25ffbeb"
  },
  {
    "url": "avatar.png",
    "revision": "09b5baf7c2cb9422721a03eb760d015a"
  },
  {
    "url": "categories/frontEnd/index.html",
    "revision": "a67230445b89cd79f0e650e4404b39e2"
  },
  {
    "url": "categories/frontEnd/page/2/index.html",
    "revision": "8bd9ea271abb1657163b10817bada6a4"
  },
  {
    "url": "categories/frontEnd/page/3/index.html",
    "revision": "9123aa2797abe0b9035df12a63666009"
  },
  {
    "url": "categories/index.html",
    "revision": "b697bd0c43167d94c197ee49fcf3a947"
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
    "revision": "1930fa65bcfb50a6aee1b2ec0e089311"
  },
  {
    "url": "tag/CSS/index.html",
    "revision": "53cd711b2e9f05fc0f1af3039dfaba16"
  },
  {
    "url": "tag/DOM/index.html",
    "revision": "db440a7a01eaf99774792f6f96d8b9c8"
  },
  {
    "url": "tag/HTTP/index.html",
    "revision": "b38a35c1ad3570798c5546d44f495fc6"
  },
  {
    "url": "tag/index.html",
    "revision": "6ce5909de52f91b6e9072b5d8a055716"
  },
  {
    "url": "tag/JavaScript/index.html",
    "revision": "cc475a992d013182a7a7e9554ae81035"
  },
  {
    "url": "tag/JavaScript/page/2/index.html",
    "revision": "1479536790c760fd26bfda1d7207e527"
  },
  {
    "url": "tag/sku/index.html",
    "revision": "da606b14b64698b745bd0333dea0b930"
  },
  {
    "url": "tag/TypeScript/index.html",
    "revision": "555edab5c12eb636d2a48d38b300bf0b"
  },
  {
    "url": "tag/vue/index.html",
    "revision": "d1978cf7f81d2d9751a9f77b54725005"
  },
  {
    "url": "tag/Vue/index.html",
    "revision": "0ecdc8584d0c868fa1b0f81140aeaa95"
  },
  {
    "url": "tag/webpack/index.html",
    "revision": "1a5e7b22caadef529023b28f4c1f79ff"
  },
  {
    "url": "tag/学习笔记/index.html",
    "revision": "67519b8691b0bed8c577ad27410e5845"
  },
  {
    "url": "tag/安全/index.html",
    "revision": "2b0025f3f0c69b301186c9da42a37fe2"
  },
  {
    "url": "timeline/index.html",
    "revision": "503b634db96ba79bcc5d2d5fb170ecb8"
  },
  {
    "url": "views/2019/webpack.html",
    "revision": "aecb061faecadb9bd0872a65261efec6"
  },
  {
    "url": "views/2020/042616.html",
    "revision": "03ca00d5c161aa732dd6ed4ef5846abc"
  },
  {
    "url": "views/2020/constructor.html",
    "revision": "63589394e6f9948ac7944b673be72fba"
  },
  {
    "url": "views/2020/css-practice.html",
    "revision": "77fdb3ce5fa4ee1bcbd73ea1209006e6"
  },
  {
    "url": "views/2020/data-structure.html",
    "revision": "da2f4d5987f7d58ca3cee002b2ff3602"
  },
  {
    "url": "views/2020/design-model.html",
    "revision": "dae567605532dce9f943a3fe2df96a30"
  },
  {
    "url": "views/2020/regular-code.html",
    "revision": "bfab8b650b68ed5628c48be922391532"
  },
  {
    "url": "views/2020/requestAnimationFrame.html",
    "revision": "aeee5ce6f25ee9b468fb9985731bc011"
  },
  {
    "url": "views/2020/typescript.html",
    "revision": "0dfdee0fd586a81f8f6437cf3613b458"
  },
  {
    "url": "views/2020/webpack-speed-up.html",
    "revision": "2e14f6200df2c9ab857c2f870053764e"
  },
  {
    "url": "views/2022/sku.html",
    "revision": "6ebbdb3ab5a4a5a85cf93d70dd41a2a0"
  },
  {
    "url": "views/dom/intersection-observer.html",
    "revision": "72897576349569180a70979cdef05e01"
  },
  {
    "url": "views/dom/resize-observer.html",
    "revision": "c777aabd412185ec7a008430b14577cc"
  },
  {
    "url": "views/http/front-end-security.html",
    "revision": "e74188b58f1ffbb1d979c118f126a93f"
  },
  {
    "url": "views/http/http-base.html",
    "revision": "0e979546ad93bbd305974ebc9bd9465a"
  },
  {
    "url": "views/http/http-cross-domain.html",
    "revision": "c471671477388577cd7e91cabab9d943"
  },
  {
    "url": "views/http/index.html",
    "revision": "e47c003013bdf51e5859056d39bdbc14"
  },
  {
    "url": "views/js/closure.html",
    "revision": "f1f2b1d3b76fd6f33c31d209db1a0491"
  },
  {
    "url": "views/js/es-object.html",
    "revision": "9e5914973925110b38c2450d88602b2e"
  },
  {
    "url": "views/js/ES6-module.html",
    "revision": "87666a3474d30c8d0f2fa7a107320f38"
  },
  {
    "url": "views/js/eventLoop.html",
    "revision": "2149b7467b397b754df99c8407fecdb4"
  },
  {
    "url": "views/js/execution-context.html",
    "revision": "0a65de6f444c0916eb57805cb5a141ea"
  },
  {
    "url": "views/vue/vue-hooks.html",
    "revision": "07952feadfc05ca5c66f85b8d0d23612"
  },
  {
    "url": "views/vue/vue3-reactive.html",
    "revision": "83f9b4424ac152409ba0a9615389b223"
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
