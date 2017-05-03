/*
* @construcotr { Function } 自定义事件类
* @param {} 
* */
function E() {
    this.events = {};
}

E.prototype = {

    // 按照指定的类型添加回调
    on: function(type, fn) {

        // 如果之前没有定义该类型的数组，那么就定义一下
        // this.fns[type] = this.fns[type] || [];
        // this.fns[type].push(fn);

        // 相当于上面两行代码
        (this.events[type] || (this.events[type] = [])).push(fn);
    },

    // 通用的用来触发回调的函数
    trigger: function(type, data) {

        // 遍历所有回调，依次执行
        this.events[type] && this.events[type].forEach(function(fn) {
            fn(data);
        });
    },
}
