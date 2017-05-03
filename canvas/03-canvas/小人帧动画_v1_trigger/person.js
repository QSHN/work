
/*
 * @construcotr { Function } 小人类
 * @param { options: Object } 可选参数
 * @param { options.ctx: Context } 绘制上下文
 * @param { options.img: Image } 图像
 * @param { options.x: Image } 图像绘制x位置
 * @param { options.y: Image } 图像绘制y位置
 * @param { options.widthFrame: Image } 整张图横向有多少张
 * @param { options.heightFrame: Image } 整张图纵向有多少张
 * */
function Person(options) {
    this.ctx = options.ctx;
    this.img = options.img;
    this.x = options.x || 10;
    this.y = options.y || 10;
    this.widthFrame = options.widthFrame || 1;
    this.heightFrame = options.heightFrame || 1;

    // 计算图中一个小人的宽度和高度
    this.width = this.img.width / this.widthFrame;
    this.height = this.img.height / this.heightFrame;

    // index小人某方向的第几个动作，
    // direction小人当前的方向
    this.index = 0;
    this.direction = 0;

    // 小人行走的速度
    this.speed = options.speed || 2;

    // 小人走出画布时，要执行的所有回调
    this.fns = options.fns;
}

// 扩展原型
Person.prototype = {

    // 通用的用来触发回调的函数
    trigger: function(type, direction) {

        // 遍历所有回调，依次执行
        this.fns[type].forEach(function(fn) {
            fn(direction);
        });
    },

    // 按照实例当前的属性绘制小人
    draw: function() {
        this.ctx.drawImage(this.img,
            this.width * this.index, this.height * this.direction, this.width, this.height,
            this.x, this.y, this.width, this.height);

        // 小人绘制完毕后，判断有没有走出画布，走出指定对应的回调 ==> 左、上、右、下
        if(this.x < -this.width) {
            this.trigger('out', '左');
        }else if(this.y < -this.height) {
            this.trigger('out', '上');
        }else if(this.x > this.ctx.canvas.width) {
            this.trigger('out', '右');
        }else if(this.y > this.ctx.canvas.height) {
            this.trigger('out', '下');
        }

        // 小人走进牢笼(x100,y100,w100,h100)，自杀
        if(this.x > 100 && (this.x + this.width) < 100 + 100
            && this.y > 100 && (this.y + this.height) < 100 + 100) {
            this.trigger('die', '下');
        }
    },

    // 刷新小人数据
    // 1、更新小人的动作
    // 2、根据小人方向更新位置，当发现小人走出画布时，触发回调
    update: function() {

        // 更新小人的动作
        this.index = ++this.index % this.widthFrame;

        // 根据方向行走(依次为左、上、右、下)
        if(this.direction == 1) {
            this.x -= this.speed;
        }else if(this.direction == 3) {
            this.y -= this.speed;
        }else if(this.direction == 2) {
            this.x += this.speed;
        }else if(this.direction == 0) {
            this.y += this.speed;
        }
    },

    // 根据keyCode修改小人的行走方向
    changeDirection: function(keyCode) {
        if(keyCode === 37) {
            this.direction = 1;
        }else if(keyCode === 38) {
            this.direction = 3;
        }else if(keyCode === 39) {
            this.direction = 2;
        }else if(keyCode === 40) {
            this.direction = 0;
        }
    }
};
