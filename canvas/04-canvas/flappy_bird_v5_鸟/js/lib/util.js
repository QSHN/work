
// 把所有通用的一些方法，集中在这里编写
var util = {

    /*
    * @获取一个绘图上下文
    * @param { width } 预设画布的宽度
    * @param { height } 预设画布的高度
    * @param { container } 画布的容器
    * @return { Context } 绘图上下文
    * */
    getCtx: function(width, height, container) {
        var cvs = document.createElement('canvas');
        var ctx = cvs.getContext('2d');
        cvs.width = width;
        cvs.height = height;
        cvs.style.border = '1px solid red';

        // 如果传入了容器，那么就先获取容器，然后把画布添加进去
        container && (document.querySelector(container).appendChild(cvs));

        return ctx;
    },

    angleToRdian: function() {

    },

    // 把后面对象的属性copy到第一个对象
    extend: function() {
        var arg = arguments, i = 1, key, len = arg.length;

        // 遍历后面的对象
        for(; i < len; i++) {

            // 再遍历这些对象的属性，然后copy这些对象自己的属性给target
            for(key in arg[i]) {
                if(arg[i].hasOwnProperty(key)) {
                    arg[0][key] = arg[i][key];
                }
            }
        }
    }
};