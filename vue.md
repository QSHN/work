    
#### 重点
* webpack-dev-server

#### webpack-dev-server使用
* 他是一个服务器，每次启动会分配一个端口，类似sublime server的一个工具
* 热加载、热替换
    - 在运行中->加载 在运行中->替换
* 1:安装  `npm i webpack-dev-server -D`
* 2:使用命令 `./ 或者是../node_modules/.bin/webpack-dev-server --inline --hot --open --port 端口号`
    - inline 自动刷新
    - hot 热加载 热替换，完全没有刷新的操作
    - open 自动打开默认浏览器
* 3:也可以结合package.json文件中是scripts属性
    - 如果你不记得，执行命令建议都是npm run 脚本名称
        + npm暂时不能接受../的路径,./是可以的
        + yarn目前可以

```javascript
{
    "scripts": {
        "test": "../node_modules/.bin/webpack-dev-server --inline --hot --open"
    }
}
```


#### vue 特点(了解)
* 技术点：数据劫持(setter/getter) -> ES5 defineProperty
* 虚拟DOM树 -> $parent $children -> 虚拟DOM树会的结构和数据会响应到页面

#### vue实例的相关属性
* el:'#app', //将这个元素作为渲染的目标
* data 属性挂载着页面中需要使用的数据
* template: html字符串  //有了他，el就被替换掉了
* render: c=>c(App) 有了render之后哦template就没有必要了，可以方便恢复和复用，更深，可以加入自己的css

#### 解决闪烁问题
* v-bind
* v-cloak

#### 搭建一个单文件vue项目
* 1:保证当前webpack.config.js这个文件所在的上级或者上上级能够找到node_module/.bin/webpack-dev-server.cmd 这个文件
    - 接下来就可以按照这个路径去执行该文件，不需要后缀名
    - 给上参数 `webpack-dev-server --inline --hot --open`
* 2:webpack.config.js文件中加入loader

```javascript
    {
        test:/\.vue$/,
        loader:'vue-loader'
    }
```
* 3：安装依赖包 `npm i vue -S & npm i vue-loader vue-template-compiler -D`
* 4：首先在html代码中 加入 div id="app"
* 5：进入到main.js中，做你想做的事情,构建一个vue对象的实例，并且指定render让其渲染
    - 5.1引入vue对象和我们写的app.vue对象
        + 5.1.1: `new Vue({el:'#app',render:function(c){ return c(App); }  });`
* 6:创建app.vue文件
    - 特点1:顺序三块(template->script->style) 都是标签
        + template中要保证存在一个根节点
        + vue1可以有多个根节点，2必须是这样子
        + script内部需要导出一个对象,export default {}
        + data必须是一个函数，该函数的返回值必须是一个对象，这个对象的时候，可以在当前app.vue的template中使用

#### 总结问题
* node_modules目录的位置在哪里？ 
    - exercise01 
        + package.json
    - exercise02
    - node_modules 原因在于我们在package.json文件中写的是../node_modules
* webpack.config.js 文件中 路径,  `entry:{ main : './src/js/main.js'}`
* html-webpack-plugin -> template: `./src/html/index.html`
* main -> 引入vue和app.vue组件对象 -> 构造vue对象,el和`render:function(c){return c(App)}`

####  vue中常用的v-指令演示
* 常用指令
* v-cloak 先隐藏元素，再移除该属性
* v-bind 给元素绑定属性 简写 :属性="data的属性"
* v-text 显示文本内容
* v-html 显示html内容
* v-if 如果false不创建该元素
* v-show 如果false隐藏该元素
* v-model 数据模型

#### 常用指令总结(重要)
* 所有的v-xx指令都可以直接获取到data上挂载的属性
* v-if 如果是false 本质上就没有该元素
* v-show 如果是false只是将display:none;隐藏该元素
* v-bind(v-bind:属性="值")
    - 这个指令也可以操作data上的属性
    - 简写形式
        + :属性="值"
* class灵活配置，需要结合v-bind来完成
    - 单个选择: 使用三元表达式 `data上的bool1?'red':'yellow'`
    - 多个选择: 是一个对象 `"{'red':bool1,'big':bool2}"`
* v-on(v-on:click="可以写表达式||调用函数")
    - 简写形式 `@click="methods上的函数名" `
* export default 导出的对象的属性 data/methods
    - methods是一个对象,每部需要声明函数名做key,函数体做value，
        + 利用ES6的声明方式可以简写 `func(){ }`来完成声明
* this不再和浏览器中一样了，是根据声明时所绑定的对象

####  v-for的使用
* v-for 指令
* 针对数组v-for
    - 完整的参数是 `v-for="(item,index) in list"`
* 针对对象 `v-for="(item,key,index) in person"` 
* 如果给v-for绑定一个key，那么会让其在增加或者删除元素时，需要做重新计算的性能上有明显提升，你不给Key,就是一套算法，会响应性能
* :key 绑定这个属性，就避免了每次在增删元素的时候，vue需要根据特定算法计算该对象的唯一标示，而是直接用你指定的这个，提升性能

#### 子组件使用
* components属性
* 当前组件和data属性是同一级的地方加入上一个components属性，
* 其内部是一个对象，可以有多个属性，如果你属性名和属性的值，用同一个的话，可以简写
    - `{componet1,componet2}`
    - 组件建议使用首字母大写
* 在js中如果你需要使用这个组件的时候，毫无疑问，先 __导入子组件__
* 对于标签名 开头的大写字母可以直接小写，中间的大写字母可以加上-再小写

#### 父向子组件传值
* 1:如果需要向子组件传值，非常简单，在使用组件的时候，给一个bind，值不能是常量，一定要是data下面的属性 `:sendMsg="data中的属性"`
* 2:子组件通过和data同级的属性，`props:['sendMsg']`来接受
    - 完了直接使用在页面`{{sendMsg}}`

#### 子向父组件传值（获取组件对象）(扩展)
* 每个组件对象如果有的情况下，会有自己的 $parent属性
* 每个组件对象如果有的情况下，也会有自己的$children属性
    - 他们都是VueComponent对象
    - 以上对象通过this.来获取

#### 发射器(扩展)
* $on 当某个VueComponent对象调用`$on('eventName',callback(msg){  msg;//haha});`
* $emit 上面那个函数在该对象调用$emit的时候被触发,触发多次
    - `this.$parent.$emit('eventName','haha');`
* $once 和on一样，但是该事件的回调函数只会被触发1次

#### export default 的常用属性
* data/methods/props/created/components
* data是对象methods是对象props是数组created函数components对象

#### 过滤器

#### vue-router
* 概念
* 代码结构
* router-view   

#### router-link及值的获取
* 需求:点击进入商品列表页，根据所点击商品显示商品详情

#### vue-resource
* http://www.doc00.com/doc/1001004eg

#### mint-ui