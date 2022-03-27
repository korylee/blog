(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{599:function(t,s,a){"use strict";a.r(s);var e=a(10),n=Object(e.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("p",[t._v("浏览器同源策略导致不能加载执行其他网站的脚本，这是互联网安全的一部分。跨域之后 ajax 请求可以发出，但浏览器在接收前会对其来源进行检查，如果是不跨域，直接加载数据；如果跨域，则会出现著名的"),a("code",[t._v("No 'Access-Control=Allow-Origin' header is present on the requested resource")]),t._v("。")]),t._v(" "),a("blockquote",[a("p",[t._v("常见的跨域都需要后端支持,跨域记得带上 http 头信息 Access-Control-Allow-Origin\n跨域拦截,并不一定是浏览器限制了发起跨站请求,也可能是跨行咱请求可以正常发起,但是返回结果被浏览器拦截了")])]),t._v(" "),a("h2",{attrs:{id:"jsonp"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#jsonp"}},[t._v("#")]),t._v(" JSONP")]),t._v(" "),a("p",[t._v("利用 script 标签不跨域特点,使用 get 请求到目标 api，再通过目标 api 返回 callbackName(data)方式执行 js 代码.")]),t._v(" "),a("p",[t._v("特点:")]),t._v(" "),a("ul",[a("li",[t._v("只能是 get 请求")]),t._v(" "),a("li",[t._v("需要后端配合, 因为需要知道前端 callbackName 命名")]),t._v(" "),a("li",[t._v("支持老式浏览器")])]),t._v(" "),a("div",{staticClass:"language-ts extra-class"},[a("pre",{pre:!0,attrs:{class:"language-ts"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" script "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" document"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("createElement")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"script"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nscript"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("type "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"text/javascript"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 传参并指定回调函数为onBack")]),t._v("\nscript"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("src "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"http://www.domain2.com:8080/login?:user=admin&callback=onBack"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 回调执行函数")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("onBack")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("res"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("alert")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("JSON")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("stringify")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("res"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 服务端api返回")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("onBack")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" status"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" user"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"admin"')]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("h2",{attrs:{id:"cors"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#cors"}},[t._v("#")]),t._v(" CORS")]),t._v(" "),a("p",[t._v("跨域资源共享(cross origin resource sharing)是一种机制,它"),a("code",[t._v("使用额外的HTTP头")]),t._v("来告诉浏览器让运行在一个 origin 上的 web 应用被准许访问来自不通苑服务器上的指定资源。")]),t._v(" "),a("p",[t._v("特点")]),t._v(" "),a("ol",[a("li",[t._v("W3C 标准")]),t._v(" "),a("li",[t._v("需要浏览器和服务器同时支持，包括增加额外的 http 头")])]),t._v(" "),a("h3",{attrs:{id:"cors-简单请求"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#cors-简单请求"}},[t._v("#")]),t._v(" CORS 简单请求")]),t._v(" "),a("ul",[a("li",[t._v("请求方法：三种方法之一\n"),a("ul",[a("li",[t._v("HEAD")]),t._v(" "),a("li",[t._v("GET")]),t._v(" "),a("li",[t._v("POST")])])]),t._v(" "),a("li",[t._v("HTTP 头信息： 不超过以下几种字段\n"),a("ul",[a("li",[t._v("Accept")]),t._v(" "),a("li",[t._v("Accept-Language")]),t._v(" "),a("li",[t._v("Last-Event-ID")]),t._v(" "),a("li",[t._v("Content-Type：只限于三个值 application/x-form-urlencoded、multipart/form-data、text/plain")])])])]),t._v(" "),a("p",[t._v("在头信息之中, 增加一个"),a("code",[t._v("Origin字段")]),t._v("。说明本次请求来自哪个域（协议+域名+端口）。服务器就根据这个值，决定是否统一这次请求，响应返回"),a("code",[t._v("Access-Control-Allow-Origin字段")])]),t._v(" "),a("ul",[a("li",[a("p",[t._v("正式请求/响应")]),t._v(" "),a("ul",[a("li",[t._v("请求: "),a("code",[t._v("Origin")]),t._v(" "),a("Badge",{attrs:{text:"通用"}})],1),t._v(" "),a("li",[t._v("响应: "),a("code",[t._v("Access-Control-Origin")]),a("Badge",{attrs:{text:"通用"}}),t._v("。如果是需要发送附带身份凭证（如 cookie）的请求（前端代码需要设置："),a("code",[t._v("xhr.withCredentials = true")]),t._v("）")],1)])])]),t._v(" "),a("blockquote",[a("p",[t._v("为安全性考虑，当响应返回 "),a("code",[t._v("Access-Control-Allow-Credentials: true")]),t._v(' 时, Access-Control-Allow-Origin 必须指定具体的 Origin,而不是通配符"*"')])]),t._v(" "),a("p",[a("img",{attrs:{src:"https://media.prod.mdn.mozit.cloud/attachments/2016/10/28/14293/1abbd90c71d03f08c9b055d32b2b2911/simple_req.png",alt:"img"}})]),t._v(" "),a("h3",{attrs:{id:"cors-非简单请求"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#cors-非简单请求"}},[t._v("#")]),t._v(" CORS 非简单请求")]),t._v(" "),a("ul",[a("li",[t._v("请求方法\n"),a("ul",[a("li",[t._v("PUT")]),t._v(" "),a("li",[t._v("DELETE")])])]),t._v(" "),a("li",[t._v("HTTP 头部信息\n"),a("ul",[a("li",[t._v("Content-Type: application/json")])])])]),t._v(" "),a("p",[t._v("规范要求,对那些可能对服务器数据产生副作用的 HTTP 请求方法，浏览器必须首先使用"),a("code",[t._v("Method: OPTIONS")]),t._v(" 发起一个预检请求(preflight request)，从而获知服务器是否允许跨域请求")]),t._v(" "),a("ul",[a("li",[t._v("预检 Options 请求/响应\n"),a("ul",[a("li",[t._v("请求\n"),a("ul",[a("li",[a("code",[t._v("Origin")]),a("Badge",{attrs:{text:"通用"}}),t._v(": 预检请求或实际请求的源站")],1),t._v(" "),a("li",[a("code",[t._v("Access-Control-Request-Header")]),t._v("：将实际请求所携带的首部字段告诉服务器。")]),t._v(" "),a("li",[a("code",[t._v("Access-Control-Request-Method")]),t._v("：将实际请求所使用的 HTTP 方法告诉服务器")])])]),t._v(" "),a("li",[t._v("响应\n"),a("ul",[a("li",[a("code",[t._v("Access-Control-Allow-Origin")]),a("Badge",{attrs:{text:"通用"}}),t._v(": 指定允许访问该资源的外域 URI")],1),t._v(" "),a("li",[a("code",[t._v("Access-Control-Allow-Headers")]),t._v("：指明了实际请求中允许携带的首部字段")]),t._v(" "),a("li",[a("code",[t._v("Access-Control-Allow-Methods")]),t._v("：用于预检请求的响应，指明了实际请求所允许使用的 HTTP 方法。")]),t._v(" "),a("li",[a("code",[t._v("Access-Control-Max-Age")]),t._v("：指定了 preflight 请求的结果能够被缓存多久。在有效时间内，浏览器无须为同一请求发起预检请求。")])])])])]),t._v(" "),a("li",[t._v("正式请求/响应\n"),a("ul",[a("li",[t._v("请求: "),a("code",[t._v("Origin/Access-Control-Request-Headers/Access-Control-Request-Method")])]),t._v(" "),a("li",[t._v("响应："),a("code",[t._v("Access-Control-Allow-Origin")])])])])]),t._v(" "),a("p",[a("img",{attrs:{src:"https://mdn.mozillademos.org/files/14289/prelight.png",alt:"img"}})]),t._v(" "),a("blockquote",[a("p",[t._v("大多数浏览器不支持针对于预检请求的重定向.如果一个预检请求发生了重定向,浏览器将报告错误")])]),t._v(" "),a("h2",{attrs:{id:"其他"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#其他"}},[t._v("#")]),t._v(" 其他")]),t._v(" "),a("ul",[a("li",[t._v("服务端\n"),a("ul",[a("li",[t._v("nginx 代理跨域")]),t._v(" "),a("li",[t._v("nodejs 代理跨域")]),t._v(" "),a("li",[t._v("websocket")])])]),t._v(" "),a("li",[t._v("浏览器\n"),a("ul",[a("li",[t._v("html5 postMessage")]),t._v(" "),a("li",[t._v("iframe")])])])]),t._v(" "),a("h2",{attrs:{id:"站在巨人的肩上"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#站在巨人的肩上"}},[t._v("#")]),t._v(" 站在巨人的肩上")]),t._v(" "),a("ul",[a("li",[a("a",{attrs:{href:"https://mdn.mozillademos.org/files/14289/prelight.png",target:"_blank",rel:"noopener noreferrer"}},[t._v("MDN Cross-Origin-Resource Sharing(CORS)"),a("OutboundLink")],1)]),t._v(" "),a("li",[a("a",{attrs:{href:"https://lq782655835.github.io/blogs/js/http-cross-domain.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("HTTP 跨域方案"),a("OutboundLink")],1)])])])}),[],!1,null,null,null);s.default=n.exports}}]);