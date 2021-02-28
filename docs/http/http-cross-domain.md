---
title: HTTP跨域解决方案
date: 2021-02-21
tags:
  - HTTP
categories:
  - frontEnd
---

浏览器同源策略导致不能加载执行其他网站的脚本，这是互联网安全的一部分。跨域之后 ajax 请求可以发出，但浏览器在接收前会对其来源进行检查，如果是不跨域，直接加载数据；如果跨域，则会出现著名的`No 'Access-Control=Allow-Origin' header is present on the requested resource`。

> 常见的跨域都需要后端支持,跨域记得带上 http 头信息 Access-Control-Allow-Origin
> 跨域拦截,并不一定是浏览器限制了发起跨站请求,也可能是跨行咱请求可以正常发起,但是返回结果被浏览器拦截了

## JSONP

利用 script 标签不跨域特点,使用 get 请求到目标 api，再通过目标 api 返回 callbackName(data)方式执行 js 代码.

特点:

- 只能是 get 请求
- 需要后端配合, 因为需要知道前端 callbackName 命名
- 支持老式浏览器

```ts
var script = document.createElement("script");
script.type = "text/javascript";
// 传参并指定回调函数为onBack
script.src = "http://www.domain2.com:8080/login?:user=admin&callback=onBack";

// 回调执行函数
function onBack(res) {
  alert(JSON.stringify(res));
}
// 服务端api返回
onBack({ status: true, user: "admin" });
```

## CORS

跨域资源共享(cross origin resource sharing)是一种机制,它`使用额外的HTTP头`来告诉浏览器让运行在一个 origin 上的 web 应用被准许访问来自不通苑服务器上的指定资源。

特点

1. W3C 标准
2. 需要浏览器和服务器同时支持，包括增加额外的 http 头

### CORS 简单请求

- 请求方法：三种方法之一
  - HEAD
  - GET
  - POST
- HTTP 头信息： 不超过以下几种字段
  - Accept
  - Accept-Language
  - Last-Event-ID
  - Content-Type：只限于三个值 application/x-form-urlencoded、multipart/form-data、text/plain

在头信息之中, 增加一个`Origin字段`。说明本次请求来自哪个域（协议+域名+端口）。服务器就根据这个值，决定是否统一这次请求，响应返回`Access-Control-Allow-Origin字段`

- 正式请求/响应

  - 请求: `Origin` <Badge text="通用"/>
  - 响应: `Access-Control-Origin`<Badge text="通用"/>。如果是需要发送附带身份凭证（如 cookie）的请求（前端代码需要设置：`xhr.withCredentials = true`）

> 为安全性考虑，当响应返回 `Access-Control-Allow-Credentials: true` 时, Access-Control-Allow-Origin 必须指定具体的 Origin,而不是通配符"\*"

![img](https://media.prod.mdn.mozit.cloud/attachments/2016/10/28/14293/1abbd90c71d03f08c9b055d32b2b2911/simple_req.png)

### CORS 非简单请求

- 请求方法
  - PUT
  - DELETE
- HTTP 头部信息
  - Content-Type: application/json

规范要求,对那些可能对服务器数据产生副作用的 HTTP 请求方法，浏览器必须首先使用`Method: OPTIONS` 发起一个预检请求(preflight request)，从而获知服务器是否允许跨域请求

- 预检 Options 请求/响应
  - 请求
    - `Origin`<Badge text="通用"/>: 预检请求或实际请求的源站
    - `Access-Control-Request-Header`：将实际请求所携带的首部字段告诉服务器。
    - `Access-Control-Request-Method`：将实际请求所使用的 HTTP 方法告诉服务器
  - 响应
    - `Access-Control-Allow-Origin`<Badge text="通用"/>: 指定允许访问该资源的外域 URI
    - `Access-Control-Allow-Headers`：指明了实际请求中允许携带的首部字段
    - `Access-Control-Allow-Methods`：用于预检请求的响应，指明了实际请求所允许使用的 HTTP 方法。
    - `Access-Control-Max-Age`：指定了 preflight 请求的结果能够被缓存多久。在有效时间内，浏览器无须为同一请求发起预检请求。
- 正式请求/响应
  - 请求: `Origin/Access-Control-Request-Headers/Access-Control-Request-Method`
  - 响应：`Access-Control-Allow-Origin`

![img](https://mdn.mozillademos.org/files/14289/prelight.png)

> 大多数浏览器不支持针对于预检请求的重定向.如果一个预检请求发生了重定向,浏览器将报告错误

## 其他

- 服务端
  - nginx 代理跨域
  - nodejs 代理跨域
  - websocket
- 浏览器
  - html5 postMessage
  - iframe

## 站在巨人的肩上

- [MDN Cross-Origin-Resource Sharing(CORS)](https://mdn.mozillademos.org/files/14289/prelight.png)
- [HTTP 跨域方案](https://lq782655835.github.io/blogs/js/http-cross-domain.html)
