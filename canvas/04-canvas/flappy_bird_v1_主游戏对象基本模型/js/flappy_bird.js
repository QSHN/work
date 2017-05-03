/*
* 该对象负责直接调度几个角色对象，并提供如下几个方法：
*
* run: 对外开放的游戏开始方法
*
* draw: 绘制游戏画面
*
* start: 开始运行游戏
*
* end: 结束游戏
*
* pause：暂停继续游戏
*
* restart: 重新开始游戏
*
* */

/*
* @constructor { Function }  游戏主对象
* @param { container: string } 容器选择器
* */
function FlappyBird(container) {
    /*
    * 1、调用util里的getCtx方法，动态创建画布与绘制上下文
    * 2、利用imgLoad对象加载游戏所需的图像资源
    * 3、当图像资源加载完毕后，创建所有的角色对象
    * 4、创建好之后，就可以start了。
    * */
    this.ctx = util.getCtx(800, 600, container);

    var self = this;
    new ImgLoad({
        bird: './imgs/bird.png',
        land: './imgs/land.png',
        pipeDown: './imgs/pipe_down.png',
        pipeUp: './imgs/pipe_up.png',
        sky: './imgs/sky.png'
    }).load().on('imgAllLoaded', function(imgs) {
        self.initRoles(imgs);
        self.start();
    });
}

FlappyBird.prototype = {

    /*
    * @创建游戏所需的角色
    * @param { imgs: Object } 所有已加载完毕的图像资源
    * */
    initRoles: function(imgs) {
        this.bird = new Bird({
            ctx: this.ctx,
            img: imgs.bird
        });
        this.land = new Land({
            ctx: this.ctx,
            img: imgs.land
        });
        this.pipe = new Pipe({
            ctx: this.ctx,
            img: {
                pipeDown: imgs.pipeDown,
                pipeUp: imgs.pipeUp
            }
        });
        this.sky = new Sky({
            ctx: this.ctx,
            img: imgs.sky
        });
        this.timer = new Timer({
            ctx: this.ctx
        });
    },

    run: function() {

    },

    draw: function() {

    },

    // 开始游戏
    start: function() {
        this.bird.draw();
        this.land.draw();
        this.pipe.draw();
        this.sky.draw();
        this.timer.draw();
    },

    pause: function() {

    },

    end: function() {

    },

    restart: function() {

    }
}
