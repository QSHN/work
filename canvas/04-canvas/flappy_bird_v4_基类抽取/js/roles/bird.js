function Bird() {

}

Bird.prototype = {
    
    draw: function() {
        console.log('绘制小鸟');
    },

    update: function() {
        console.log('更新小鸟');
    }
}