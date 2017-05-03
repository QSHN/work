/*
* 1、第一根管道起始x轴坐标要有一定距离
* 2、管道高度随机生成，随机生成上管道高度，下管道也就有了
* 3、管道上下有间距
* 4、管道左右有间距
* 5、管道是一对对出现的，所以他们的x轴坐标是共享的，y轴坐标是独有的
* 6、一对管道走出画布，右边拼接时，高度需要再次随机生成
* 7、需要计算上下管道加起来的可视高度，然后基于这个高度计算管道最大与最小高。
*
*
* 需要的准备工作：
* 1、先在util工具对象中实现一个获取随机数方法，要求该方法可以指定随机数的最小值与最大值。
* 2、需要让管道实例创建者传入一个除去大地的画布高度，基于这个高度我们计算管道最大与最小值。
* 3、创建的管道x轴坐标，我们根据已创建的实例数量动态计算
* */

/*
* @管道类
* @param { options: Object } 可配参数
* @param { options.ctx: Context } 绘图上下文
* @param { options.img: Object } 所需图片 ==> { pipeDown: xx, pipeUp: xx }
* @param { options.speed: number } 速度
* @param { options.initSpace: number } 第一根管道距离画布的初始间距
* @param { options.TBSpace: number } 上下管道间距
* @param { options.LRSpace: number } 左右管道间距
* @param { options.pipeViewHeight: number } 上下管道以及上下间距总高度
* */
function Pipe(options) {
    this.ctx = options.ctx;
    this.img = options.img;
    this.speed = options.speed || 2;
    this.initSpace = options.initSpace || 200;
    this.TBSpace = options.TBSpace || 80;
    this.LRSpace = options.LRSpace || 80;
    this.pipeViewHeight = options.pipeViewHeight;

    // 计算一个管道图片的宽与高
    this.width = this.img.pipeUp.width;
    this.height = this.img.pipeUp.height;

    // 根据管道实例的数量计算不同管道的x轴坐标
    this.x = (this.width + this.LRSpace) * Pipe.len++ + this.initSpace;

    // 计算管道的最大与最小高度，最大与最小的高度比为4比1
    this.minHeight = (this.pipeViewHeight - this.TBSpace) / 5;
    this.maxHeight = this.minHeight * 4;

    // 加速度
    this.speedPlus = 0.001;

    // 第一次先随机生成一下Y坐标
    this.initY();
}

// 记录管道对象创建的数量
Pipe.len = 0;

Pipe.prototype = {

    // 随机生成高度，转换为上下管道对应的y轴坐标
    initY: function() {
        this.upViewHeight = util.getRandom(this.minHeight, this.maxHeight);
        this.upY = this.upViewHeight - this.height;
        this.downY = this.upViewHeight + this.TBSpace;
    },

    // 绘制上下管道 及 对应的路径
    draw: function() {
        this.ctx.drawImage(this.img.pipeDown, this.x, this.upY);
        this.ctx.drawImage(this.img.pipeUp, this.x, this.downY);
        this.ctx.rect(this.x, this.upY, this.width, this.height);
        this.ctx.rect(this.x, this.downY, this.width, this.height);
    },

    // 更新下一帧数据
    update: function() {
        this.x -= this.speed;
        this.speed += this.speedPlus;

        // 管道走出画布，向右拼接，需要重新计算高度与y坐标
        if(this.x < -this.width) {
            this.x += (this.width + this.LRSpace) * Pipe.len;
            this.initY();
        }
    }
}
