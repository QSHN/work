# Canvas

### 非零环绕原则
> 这是一个用来判断哪些区域属于路径内，哪些区域属于路径外的一种算法规则，
这个算法canvas内部已经实现了。在我们填充的时候，
canvas会通过这种算法判断哪些区域属于路径内，只有路径内的区域才会被填充。

> canvas内部在判断一块区域是不是路径内时，
会先在该区域内随机找一个点，
然后基于这个点向一个随机方向发射一条射线，
让这条射线与外围的所有路径相交，
然后开始计数，初始值从0开始，
依次判断所有相交的路径，相对与该点是顺时针还是逆时针，
顺时针+1，逆时针-1，最终结果不为0，
那么就认为该区域属于路径内，否则属于路径外。

> 一个区域向外发射的射线，如果相交的数量为基数，
那么该区域++--结果一定非0，一定会被路径环绕。
如果数量为偶数，那就要具体分析了。

### Canvas

##### getContext
- 作用：获取绘图上下文
- 语法：cvs.getContext('2d' || 'webgl')

##### width
- 作用：设置或者获取画布宽度

##### height
- 作用：设置或者获取画布高度

### Context

##### moveTo
- 作用：设置当前路径的起点
- 语法：ctx.moveTo(x, y)

##### lineTo
- 作用：画子路径
- 语法：ctx.lineTo(x, y)

##### stroke
- 作用：根据当前的路径进行描边
- 语法：ctx.stroke()

##### fill
- 作用：根据当前的路径进行填充
- 语法：ctx.fill()

##### strokeStyle
- 作用：设置描边样式 
- 语法：ctx.strokeStyle = css所有的颜色表示 || 渐变对象 || 图像模式对象

##### fillStyle
- 作用：设置填充样式 
- 语法：ctx.fillStyle = css所有的颜色表示 || 渐变对象 || 图像模式对象

##### clearRect
- 作用：清除画布
- 语法：ctx.clearRect(x, y, width, height)

##### beginPath
- 作用：清除当前路径（开辟一条新路径）
- 语法：ctx.beginPath();

##### closePath
- 作用：当前路径的起点与结束点相连画一条路径
- 语法：ctx.closePath()

##### lineWidth
- 作用：设置描边宽度
- 语法：ctx.lineWidth = 数值

##### rect
- 作用：画矩形路径
- 语法：ctx.rect(x, y, width, height)

##### strokeRect
- 作用：绘制描边矩形，不会产生路径
- 语法：ctx.strokeRect(x, y, width, height)

##### fillRect
- 作用：绘制填充矩形，不会产生路径
- 语法：ctx.fillRect(x, y, width, height)

##### lineCap
- 作用：设置线头两端的样式
- 语法：ctx.lineCap = 'butt' || 'round' || 'square'

##### lineJoin
- 作用：设置线交点样式
- 语法：ctx.lineJoin = 'miter' || 'round' || 'bevel'

##### setLineDash
- 作用：设置虚线样式
- 语法：ctx.setLineDash([任意长度])

##### getLineDash
- 作用：获取虚线样式
- 语法：ctx.getLineDash()

##### arc
- 作用：画弧路径
- 特点：会自动从当前路径结束点到弧的起点连一条路径，再绘制弧
- 语法：ctx.arc(oX, oY, r, 起始弧度，结束弧度，是否逆时针画(可选值，默认false))
