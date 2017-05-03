function Pipe() {

}

Pipe.prototype = {
    draw: function() {
        console.log('绘制管道');
    },

    update: function() {
        console.log('更新管道');
    }
}