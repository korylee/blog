---
title: 前端安全
date: 2020-08-05
tags:
  - 安全
categories:
  - frontEnd
---

## 有哪些可能引发前端安全的问题

- 跨站脚本(Cross-Site Scripting, Xss): 一种代码注入方式,为了与 CSS 区分, 所以被称作 XSS。早期常见于网络论坛，起因是网站没有对用户的输入进行严格的限制，使得攻击者可以将脚本上传到帖子让其他人浏览到有恶意脚本的页面，其注入方式很简单包括但不限于 JavaScript、VBScript、CSS、Flash 等
- iframe 的滥用：iframe 的内容是第三方来提供的,默认情况下他们不受我们的控制，他们可以在 iframe 中运行 JavaScript 脚本，Flash 插件，弹出对话框等，这可能破坏前端体验
- 跨站请求伪造（Cross-Sites Request Forgeries， CSRF）：指攻击者通过设置好的陷阱，强制对已完成认证的用户进行非预期的个人信息或设定信息等某些状态更新，属于被动攻击。
- 恶意第三方库

## XSS 分为哪几类

XSS 攻击可分为存储型、反射型和 DOM 型三种。

- 存储区：恶意代码存放的位置。
- 插入点： 由谁取得恶意代码，并插入到网页上。

### 存储型 XSS

1. 攻击者将恶意代码提交到目标网站的数据库中。
2. 用户打开目标网站时，网站服务端将恶意代码从数据库中取出，拼接在 HTML 中返回给浏览器。
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者的指定操作

这种攻击常见于带有用户保存数据的网站功能，如论坛发帖、商品评论、用户私刑等。

### 反射型 XSS

1. 攻击者构造出特殊的 URL，其中包含恶意代码
2. 用户打开带有恶意代码的 URL 时，网站服务端 将恶意代码从 URL 中取出，拼接在 HTML 中返回给浏览器
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户行为，调用目标网站接口执行攻击者指定的操作

:::tip 反射型跟存储型的区别
存储型 XSS 的恶意代码存在数据库里，反射型 XSS 的恶意代码存在 URL 里
:::

反射型 XSS 漏洞常见于通过 URL 传递参数的功能，如网站搜索、跳转等。

由于需要用户 主动打开恶意的 URL 才能生效，攻击者往往会结合多种手段诱导用户点击。

POST 的内容也可以出发反射型 XSS，只不过其触发条件比较苛刻（需要构造表单提交页面，并引导用户点击，所以说非常少见）

### DOM 型 XSS

1. 攻击者构造出特殊的 URl，其中包含恶意代码
2. 用户打开带有恶意代码的 URl
3. 用户浏览器接收到响应后执行，前端 JavaScript 去除 URl 中的恶意代码并执行
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户行为，调用目标网站接口执行攻击者指定的操作

:::tip DOM 型跟前两种的区别
DOM 型 XSS 攻击中，取出和执行恶意代码有浏览器端完成，属于前端 JavaScript 自身的安全漏洞，而其他两种都属于服务端的安全漏洞
:::

## 如何预防 XSS

XSS 攻击有两大要素

1. 攻击者提交恶意代码
2. 浏览器执行恶意代码

针对这两大要素，我们可以

### 输入过滤

对于明确的输入类型，例如数字、URL、电话号码、邮件地址等内容，进行输入过滤还是有必要的，但是对于其他的用户提交内容，一旦攻击者绕过前端过滤，直接构造请求，就可以提交恶意代码了

那么换一个过滤时机，在后端写入数据库之前，对输入进行过滤，然后把“安全的”内容返回给前端，这样是否可行？
举一个栗子： 一个正常的用户输入了`5 < 7`这个内容，在写入数据库库之前，被转义，变成了`5 &lt; 7`。
问题是，再提交阶段，我们并不确定内容要输出到哪里
这里的“在提交阶段，我们并不确定内容要输出到哪里”有两层含义：

1. 用户的输入内容可能同事提供给前端和客户端，而一旦经过了`escapeHTML()`,客户端现实的内容就变成了乱码（`5 &lt; 7`）。
2. 在前端中，不同的位置所需的编码也不同
   - 当`5 &lt; 7`作为 HTMl 拼接页面时，可以正常显示
   - 当`5 &lt; 7`作为 AJAX 返回，然后赋值给 JavaScript 变量时，前端得到的字符串就是转移后的字符。这个内容不能直接用于 VUE 等模板的展示，也不能直接用于内容长度计算。不能用于标题、alert 等

所以，输入侧过滤能够在某些情况下解决特定的 XSS 问题， 但会引入很大的不确定性和乱码问题。在防范 XSS 攻击时应避免此类方法

既然输入过滤并非完全可靠，我们接要通过“防止浏览器执行恶意代码”来防范 XSS，或者部分分为两类：

- 防止 HTML 中注入
- 防止 JavaScript 执行时，执行恶意代码

### 预防存储型和反射型 XSS 攻击

存储型和反射型 XSS 都是服务器在取出恶意代码后，插入到响应 HTML 里的，攻击者刻意编写的“数据”被内嵌到“代码”中，被浏览器所执行
预防这种漏洞，有两种常见的作法

- 改成纯前端渲染，把代码和数据分隔开
- 对 HTML 做充分转义

#### 纯前端渲染

纯前端渲染的过程

1. 浏览器先加载一个静态的 HTML，此 HTML 中不包含任何跟业务相关的数据
2. 然后浏览器执行 HTML 中的 JavaScript。
3. JavaScript 通过 Ajax 加载业务数据，调用 DOM Api 更新到页面上

在纯前端渲染中，我们会明确的告诉浏览器： 下面要设置的是文本（`.innerText`)、还是属性(`.setAttribute`)、还是样式(`.style`)等等。浏览器不会被轻易的欺骗，执行预期外的代码了。

但纯前端渲染还需注意避免 DOM’型 XSS 漏洞（例如`onload`事件和`href`中的`javascript:xxx`等）

在很多内部、管理系统中，采用纯前端渲染是非常合适的。但对于性能要求高，或有 SEO 需求的页面，我们仍然要面对拼接 HTMl 的问题

#### 转义 HTML

如果拼接 HTML 是必要的，那么就要采取合适的转义库，对 HTMl 模板各处插入点进行充分的转义。
常用的模板引擎，，如 diT.js、ejs、FreeMarker 等，对于 HTML 转义通常只有一个规则，就是把`&<>"'/`这几个字符转义掉，确实能起到一定的 XSS 防护作用，但是并不完善：
| XSS 安全漏洞 | 简单转义是否有防护作用 |
| ----------------- | ---------------------- |
| HTML 标签内容文字 | 有 |
| CSS 级联样式 | 无 |
| 内联 JavaScript | 无 |
| 内联 JSON | 无 |
| 跳转链接 | 无 |

所以要完善 XSS 防护措施，我们要使用更加完善更细致的转移策略
例如在 Java 工程里，常用的转义库为`org,owasp.encoder`。

:::details

```HTML
<!-- HTML 标签内文字内容 -->
<div><%= Encode.forHtml(UNTRUSTED) %></div>
<!-- HTML 标签属性值 -->
<input value="<%= Encode.forHtml(UNTRUSTED) %>" />
<!-- CSS 属性值 -->
<div style="width:<= Encode.forCssString(UNTRUSTED) %>">
<!-- CSS URL -->
<div style="background:<= Encode.forCssUrl(UNTRUSTED) %>">
<!-- JavaScript 内联代码块 -->
<script>
  var msg = "<%= Encode.forJavaScript(UNTRUSTED) %>";
  alert(msg);
</script>
<!-- JavaScript 内联代码块内嵌 JSON -->
<script>
var __INITIAL_STATE__ = JSON.parse('<%= Encoder.forJavaScript(data.to_json) %>');
</script>
<!-- HTML 标签内联监听器 -->
<button
  onclick="alert('<%= Encode.forJavaScript(UNTRUSTED) %>');">
  click me
</button>
<!-- URL 参数 -->
<a href="/search?value=<%= Encode.forUriComponent(UNTRUSTED) %>&order=1#top">
<!-- URL 路径 -->
<a href="/page/<%= Encode.forUriComponent(UNTRUSTED) %>">
<!--
  URL.
  注意：要根据项目情况进行过滤，禁止掉 "javascript:" 链接、非法 scheme 等
-->
<a href='<%=
  urlValidator.isValid(UNTRUSTED) ?
    Encode.forHtml(UNTRUSTED) :
    "/404"
%>'>
  link
</a>
```

:::

### 预防 DOM 型 XSS 攻击

DOM 型 XSS 攻击，实际上就是网站前端 JavaScript 代码不够严谨，把不可信的数据当作代码执行了。

在使用`.innerHTML`、`.outerHTML`、`document.write()`要特别小心，不要把不可信的数据作为 HTML 查到页面上，尽量使用`textContent`、`setAttribute()`等。

如果使用 Vue/react 技术栈，并且不使用`v-html`/`dangerouslySet InnerHTML`功能，就在前端 render 避免`innerHTML`、`outerHTML`的隐患。

DOM 中的内联事件监听器，如`location`、`onclick`、`onerror`、`onload`、`onmouseover`等，`<a>`标签的`href`属性，JavaScript 中的`eval()`、`setTimeout()`、`setInterval()`等，这些都能把字符串作为代码运行。如果不可信的数据拼接字符串传递给这些 API，很容易产生安全隐患。

```HTML
<!-- 内联事件监听器中包含恶意代码 -->
![](https://awps-assets.meituan.net/mit-x/blog-images-bundle-2018b/3e724ce0.data:image/png,)
<!-- 链接内包含恶意代码 -->
<a href="UNTRUSTED">1</a>
<script>
// setTimeout()/setInterval() 中调用恶意代码
setTimeout("UNTRUSTED")
setInterval("UNTRUSTED")
// location 调用恶意代码
location.href = 'UNTRUSTED'
// eval() 中调用恶意代码
eval("UNTRUSTED")
</script>
```

### 其他 XSS 防范措施

#### Content Security Policy

严格的 CSP 在 XSS 防范中可以起到以下的作用

- 禁止加载外域代码，防止复杂的攻击逻辑
- 禁止外域提交，网站被攻击后，用户数据不会泄露到外域
- 禁止内联脚本执行
- 禁止未授权的脚本执行(新特性，Google Map 移动版在使用)
- 合理使用上报可以及时发现 XSS，利于尽快修复问题

#### 输入内容长度限制

对于不受信任的输入，都应该先顶一个合理的长度。虽然无法防止 XSS 发生，但可以增加 XSS 攻击的难度

#### 其他安全措施

- HTTP-only Cookie：禁止 JavaScript 读取某些敏感的 Cookie，攻击者完成 XSS 注入后也无法窃取此 cookie
- 验证码：防止脚本冒充用户提交危险操作。

> 过滤 HTML 标签能否防止 XSS？ 请列举不能的情况？

用户除了上传`<script>alert('xss')</script>`，
还可以使用图片 url 等方式来上传脚本进行攻击

```HTML
<table background="javascript:alert(/xss/)"></table>
<img src="javascript:alert('xss')">
```

还可以使用各种方式来回避检查，例如空格，回车，Tab

```HTML
<img src="javas cript:
alert('xss')">
```

还可以通过各种编码（URL 编码，Unicode 编码，html 编码，ESCAPE 等）来绕过检查）

```html
<img%20src=%22javascript:alert('xss');%22">
<img src="javascript&#116&#58alert(/xss/)">
```

## CSRF

CSRF: 攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台用户验证，达到冒充用户对被攻击的网站执行某项操作的目的

- 受害者登陆了 a 网站，并保留了登录凭证
- 攻击者引诱受害者访问了 b 网站
- b 向 a 网站发送了一个请求：`a.com/act=x`浏览器会默认携带 a 网站的 Cookie
- a 网站收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求
- a 网站以受害者的名义执行了 act=x
- 攻击完成，攻击者在受害者完全不知情的情况下，冒充受害者，让 a 网站执行了自己定义的操作

### CSRF 的攻击类型

#### GEt 类型的 CSRF

GET 类型的 CSRF 利用非常简单，只需要一个 HTTP 请求，一般会这样利用

```
https://awps-assets.meituan.net/mit-x/blog-images-bundle-2018b/ff0cdbee.example/withdraw?amount=10000&for=hacker
```

在受害者访问含有这个 img 的页面后，浏览器就会自动向`http://bank.example/withdraw?account=xiaoming&amount=10000&for=hacker`发出一次 HTTP 请求。bank.example 就会收到包含受害者登录信息的一次跨域请求。

#### POST 类型的 CSRF

这种类型的 CSRF 利用起来通常使用的是一个自动提交的表单，如：

```html
<form action="http://bank.example/withdraw" method="POST">
  <input type="hidden" name="account" value="xiaoming" />
  <input type="hidden" name="amount" value="10000" />
  <input type="hidden" name="for" value="hacker" />
</form>
<script>
  document.forms[0].submit();
</script>
```

访问该页面后，表单会自动提交，相当于模拟用户完成了一次 POST 操作。
POST 类型的攻击通常比 GET 要求更严格一点，但仍不复杂。任何网站、博客，被黑客上传页面的网站都有可能是发起攻击的来源，后端接口不能完全将安全寄托在仅允许 POST 上面。

#### 链接类型的 CSRF

链接类型的 CSRF 并不常见，比起其他两种用户打开页面就中招的情况，这种需要用户点击链接才会触发。这种类型通常是在论坛中发布的图片中恶意嵌入恶意链接，或者以广告的形式诱导用户中招，攻击者通常会议比较夸张的词语诱骗用户点击

由于用户之前登陆了信任的网站 A，并且保持登陆状态，只要用户主动访问恶意的 PHP 页面，则表示攻击成功

### 如何预防

CSRF 通常从第三方网站发起，被攻击的网站无法防止攻击发生，之恶能通过增强自己网站针对 CSRF 的防护能力来提升安全性
两个特点

- CSRF（通常）发生在第三方域名
- CSRF 攻击者不能获取到 Cookie 等信息，只是使用

针对这两个特点，我们可以制定专门的防护策略，如下：

- 防止不明外域访问
  - 同源检测
  - Same site Cookie
- 提交时要求附加本域才能获取的信息
  - CSRF Token
  - 双重 Cookie 验证

#### 同源检测

既然 CSRF 大多来自第三方网站，那么我们就直接禁止外域（或者不受 信任的外域）对我们发起请求

- 使用 Origin Header 确认来源域名：在部分与 CSRF 有关的请求中，请求的 Header 中会携带 Origin 字段，如果 Origin 存在，那么直接使用 Origin 中的字段来确认来源域名就可以
- 使用 Referer Header 确定来源域名，根据 HTTP 协议，在 HTTP 头中有一个字段叫做 referer，记录了该 HTTP 请求的来源地址

#### CSRF Token

CSRF 的另一个特征：攻击者无法直接窃取到用户的信息（cookie，header，网站内容等），仅仅是冒用 cookie 中的信息。
那么我们可以要求所有的用户请求都携带一个 CSRF 攻击者无法获取到的 TOKEN。服务器通过校检将正常的请求与攻击的请求分开，也可以防范 CSRF 的攻击。

#### 双重 Cookie 验证

在会话中存储 CSRF Token 比较繁琐，而且不能在通用的拦截上统一处理所有的接口

那么另一种防御措施是使用双重提交 Cookie。利用 CSRF 攻击不能获取用户 Cookie 的特点，哦我们可以要求 Ajax 和表单请求携带一个 Cookie 的值
双重 Cookie 采用以下流程：

- 在用户访问网站页面时，向请求域名注入一个 Cookie，内容为随机字符串
- 在前端向后端发起请求时，取出 Cookie，并添加到 URL 参数中
- 后端接口验证 Cookie 中的字段与 URL 参数中的字段，不一致则拒绝

#### Samesite Cookie 属性

Google 起草了一份草案来改进 HTTP，那就是为 Set-Cookie 响应头新增 samesite 属性，他用来标明这个 Cookie 是个同站 Cookie，同站 Cookie 只能作为第一方 Cookie，不能作为第三方 Cookie，Samesite 有两个属性值

- Samesite=Strict：严格模式，表明这个 Cookie 在任何情况下都不可能作为第三方 Cookie
- Samesite=Lax：宽松模式，假如这个请求满足要求并且是个 GET 请求，则这个 Cookie 可以作为第三方 Cookie

## 网络劫持

- DNS 劫持：
  - DNS 强制解析：通过修改运营商的本地 DNS 记录，来引导用户流量到缓存服务器
  - 302 跳转方式：通过监控网络出口的流量，分析判断哪些内容是可以劫持处理的，再对劫持的内存发起 302 跳转的回复，引导用户获取内容
- HTTP 劫持：由于 http 明文传输，运营商会修改你的 http 响应内容（加广告）

### 如何应对网络劫持

DNS 劫持由于涉嫌违法，已经呗监管起来，而 http 劫持依然非常盛行。
最有效的办法就是全站 https，将 HTTP 加密，这使得运营商无法获取明文，就无法劫持你的响应内容。

### 中间人攻击

中间人（Man-inthe-middle-attack,MTTM）指攻击者与通讯的两端分别创建独立的联系，并交换其收到的数据，是通讯的两端认为他们正在通过一个私密的连接与对方直接通话，但实际整个会话都被攻击者完全控制。在中间人攻击中，攻击者可以拦截通讯双方的通话并插入了新的内容
一般的过程如下：

- 客户端发送请求到服务端，请求被中间人截获
- 服务器向客户端发送公钥
- 中间人获取公钥，保留在自己手上，然后自己生成一个【伪造的】公钥，发送给客户端
- 客户端收到伪造的公钥后，生成加密的 hash 值发给服务器
- 中间人获得加密 hash 值，用自己的私钥解密获得真密钥，同时生成假的加密 hash 值，发给服务器
- 服务器用私钥解密获得假密钥，然后加密数据传输给客户端
