/*
 * @大地类
 * @param { options: Object } 可配参数
 * @param { options.ctx: Context } 绘图上下文
 * @param { options.img: Image } 大地图
 * @param { options.speed: speed } 速度
 * */
function Land(options) {
    this.ctx = options.ctx;
    this.img = options.img;
    this.speed = options.speed || 2;

    // 根据Land的数量动态计算x轴坐标
    this.width = this.img.width;
    this.height = this.img.height;
    this.x = this.width * Land.len++;
    this.y = this.ctx.canvas.height - this.height;
}

// 用来记录已创建的实例个数
Land.len = 0;

Land.prototype = {

    // 根据实例的属性值绘制
    draw: function() {
        this.ctx.drawImage(this.img, this.x, this.y);
    },

    // 更新下一帧绘制数据
    update: function() {
        this.x -= this.speed;

        // 走出画布，向右拼接
        if(this.x < -this.width) {
            this.x += this.width * Land.len;
        }
    }
}