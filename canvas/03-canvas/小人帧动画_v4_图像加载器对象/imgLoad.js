/*
* 该对象专门用来加载图像资源，
* 当所有的图像资源加载完毕时，会触发一个imgAllLoaded事件，
* 同时会把加载好的图像传递给对应的事件回调。
* */


/*
* @constrctor { Function } 加载图片的类
* @param { srcs: Object } 要加载的图像资源地址
* */
function ImgLoad(srcs) {
    this.srcs = srcs;

    // 借用E构造函数，给我的实例添加属性
    E.call(this);
}

// 把E原型上方法copy过来，同时进行独有的扩展
util.extend(ImgLoad.prototype, E.prototype,  {

    // 根据src地址，加载对应的资源，当所有的资源加载完毕，触发imgAllLoaded事件
    load: function() {
        /*
        * 1、求要加载的资源总数
        * 2、一个资源对应创建一个img对象
        * 3、然后要有一个对象用来存储这些创建好的img对象
        * 4、监听所有img对象的onload事件，当所有的onload事件触发时，触发imgAllLoaded
        * */
        var self = this,
            imgTotal = 0, imgLoadedTotal = 0,
            tempImg, imgs = {}, key;

        // 遍历所有的地址
        for(key in this.srcs) {

            // 求总数
            imgTotal++;

            // 一个资源创建一个img对象，然后统一存储
            tempImg = new Image();
            tempImg.src = this.srcs[key];
            imgs[key] = tempImg;

            // 确保所有的图片都加载完毕后，触发imgAllLoaded事件，把所有的图片传递给事件回调
            tempImg.onload = function() {

                // 已加载总数大于等于要加载的总数，那么就证明所有的图片都加载完毕了
                if(++imgLoadedTotal >= imgTotal) {
                    self.trigger('imgAllLoaded', imgs);
                }
            }
        }
    }
});

// 使用范例
/*
var imgLoad = new ImgLoad();
imgLoad.load();
imgLoad.on('imgAllLoaded', function(imgAll) {
    console.log('接收到的图像是全部已经加载好的')
});
*/
