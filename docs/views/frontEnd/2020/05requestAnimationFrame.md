### `requestAnimationFrame`

#### 1. 是什么

`requestAnimationFrame`方法会告诉浏览器希望执行动画并请求浏览器在下一次重绘之前调用回调函数更新动画

```JS
window.requestAnimationFrame(callback)
```

- callback: 下一次重绘之前更新动画帧所调用的函数, callback 仅有一个参数,为`DOMHighResTimStamp`参数,表示`requestAnimationFrame()`开始执行回调函数的时刻

- 返回值: 一个 long 类型整数,唯一标志元组在列表中的位置,你可以传这个值给`cancelAnimationFrame()`取消动画

```JS
let count = 0
let rafID = null
/*
* 回调函数
* @param time requestAnimationFrame 调用函数时,自动传入一个时间
*/
function requestAnimation(time){
  console.log(time)
  // 动画没有执行完,则递归渲染
  if(count<5){
    count++
    // 渲染下一帧
    rafID= window.requestAnimationFrame(requesAnmation)
  }
}
// 渲染第一帧
window.requestAnmationFrame(requestAnmiation)
```

#### 2. 怎样执行

- 首先判断`document.hidden`属性是否可见(true), 可见状态下才能继续执行

- 浏览器清空上一轮的动画函数

- `requestAnimationFrame`将回调函数追加到动画帧请求回调函数的末尾

  注意: 当执行`window.requestAnimationFrame(callback)`的时候,**不会立即调用 callback 回调函数,而是将其放入回调函数队列而已**,同时注意, 每个回调函数都有一个 canceled 标识符, 初始值为 false,并对外不可见

- 单页面可见并且动画请求 callback**回调函数列表不为空**时,浏览器会**定期**将这些回调函数加入到浏览器 UI 线程的队列中(**由系统来决定回调函数的执行时机**)。当浏览器执行这些 callback 回调函数的时候，会判断每个元组的 callback 的 cancelled 标识符，只有**cancelled 为 false 时，才执行 callback 的回调函数**。

#### 3. 优点

1. `requestAnimationFrame`自带**函数节流**功能, 采用系统时间间隔,保持最佳绘制效率,不会因为间隔时间的过短,造成过度绘制,增加页面开销, 也不会因为间隔时间过长, 造成页面卡顿, 不流畅,影响页面美观

   浏览器的重绘效率一般会和显示器的刷新率保持同步。大多数采用 W3C 规范，浏览器的渲染页面的标准频率也就是 60FPS（frames/perseconend）即每秒重绘 60 次, requestAnimationFrame 的基本思想是让页面重绘的频率和刷新频率保持同步, 即 1000ms/60 = 16.7ms 执行一次。

   通过`requestAnimationFrame`调用回调函数引起的页面重绘或回流的时间间隔和显示器的刷新时间间隔相同。所以`requestAnimationFrame`不需要像`setTimeout`那样传递时间间隔, 而是浏览器通过系统获取并使用显示器刷新频率。例如在某些高频时间事件（resize，scroll 等）中，使用`requestAnimationFrame`可以防止在一个刷新时间间隔内发生多次函数执行，这样保证了流程度，也节省了开销。

2. 另外，该函数的**延时效果是精确的**，没有`setTimeout`或`setInterval`不准的情况

   `setTimeout`**的执行只是在内存中对图像进行改变，这个改变必须要等到下次浏览器重绘时才会被更新到屏幕上**。如果和屏幕刷新步调不一致，就可能导致中间某些帧的操作被跨越过去，直接更新到下下一帧的图像。即**掉帧**。

   使用`requestAnimationFrane`执行动画,最大优势是能**保证回调函数在屏幕每一次刷新间隔中被执行一次**，这样就不会引起丢帧，动画就不会卡顿

3. 节省资源，节省开销

   在之前介绍`requestAnimationFrame`执行过程，我们知道只有当页面激活的状态下，页面刷新任务才会开始，才执行`requestAnimationFrame`，单页面隐藏或最小化时，会被暂停，页面显示，会继续执行。**节省了 CPU 开销**。

   注意：当页面被隐藏或最小化时，定时器`setTimeout`仍在后台执行动画任务, 此时刷新动画是完全没有意义的(实际上 Firefox/Chrome 浏览器对定时器做了优化: 页面闲置时，如果时间间隔小于 1000ms，则停止定时器，与`requestAnimationFrame`,则停止定时器,与 requestAnimationFrame 行为类似。如果时间间隔>=1000ms，定时器仍在后台执行)

   ```JS
   // 浏览器开发者工具的console执行下面代码
   // 当开始输出count后,切换浏览器标签页,可以发现打印的值从离开前的值继续输出
   let count = 0
   function requestAnimation(){
     if(count<100){
       count++
       console.log(count)
       requestAnimationFrame(requestAnimation)
     }
   }
   requestAnimationFrame(requsetAnimation)
   ```

   4. 能在动画流刷新之后执行，即上一个动画流会**完整执行**

#### 4. 实现

可以使用`requestAnimationFrame`实现`setTimeout`及`setInterval`

```JS
function setInterval(callback,interval){
  let timer
  const now = Date.now
  let startTime = now()
  let endTime = startTime
  let loop = () => {
    timer = window.requestAnimationFrame(loop)
    endTime = now()
    if(endTime - startTime >= interval){
      startTime = endTime = now()
      callback(timer)
    }
  }
  timer = window.requestAnimationFrame(loop)
  return timer
}
let a = 0
setInterval(timer=>{
  console.log(a)
  a++
  if(a===3) window.cancelAnimationFrame(tiemr)
},1000)
```

```JS
// setTimeout()
function setTimeout(callback,interval){
  let timer
  const now = Date.now
  let startTime = now()
  let endTime = startTime
  const loop = () => {
    timer = window.requestAnimationFrame(loop)
    endtime = now()
    of(endTime-startTime >= interval){
      callback(timer)
      window.cancelAnimationFrame(timer)
    }
  }
  timer = window.requestAnimationFrame(timer)
  return timer
}
let a = 0
setTimeout(timer => {
  console.log(a)
  a++
},1000)
```
