/**
 * @name 封装下拉
 * @params getList 刷新数据的函数
 * @params listData 存放数据的变量名
 * @params page 页数变量名
 */
import Vue from 'vue'
let vm=new Vue({
	
})
export default({getList="getList",listData="listData",page="page",initIndex="initIndex",modelData="modelData"})=> {
	var startPoint={}
	var endPoint={}
	return {
		data(){
			return {
				[listData]:[],
				[page]:1,
				[initIndex]:0,
				[modelData]:[
					{label:"全部"},
					{label:"待审核"},
					{label:"配送中"},
					{label:"已签收"},
				]
			}
		},
		onPullDownRefresh() {
			console.log("onPullDownRefresh")
			this.refresh();
		},
		onReachBottom() {
			this[getList].call(this, this[page], this.__pulldone);
		},
		methods:{
			refresh(){
				this[page]=1;
				this[getList].call(this, this[page], this.__pulldone);
			},
			__pulldone(data){
				var db = data || [];
				if (this[page] == 1) {
				  this[listData] = db;
				} else {
				  this[listData] = (this[listData] || []).concat(db);
				}
				uni.stopPullDownRefresh();
				this[page]++;
			},
			
			/**
			 * @name 动态开启或关闭pulldown
			 * @params {boolean} isOpen
			 */
			setPullDown(isOpen){
				// #ifdef APP-PLUS
				const pages = getCurrentPages();  
				const page = pages[pages.length - 1]; 
				var currentWebview = page.$getAppWebview();
				currentWebview.setStyle({//设置当前webview的style
					pullToRefresh: {
						support: isOpen ,
						style: plus.os.name === 'Android' ? 'circle' : 'default'  
					}
				});
				// #endif
			},
			
			/**
			 * @name 开始滑动
			 */
			touchstart(e){
				startPoint={
					pageX:e.pageX||e.changedTouches[0].pageX,
					pageY:e.pageY||e.changedTouches[0].pageY,
				}
			},
			
			/**
			 * @name 滑动结束
			 */
			touchend(e){
				endPoint={
					pageX:e.mp.changedTouches[0].pageX,
					pageY:e.mp.changedTouches[0].pageY,
				}
				// // 判断是左滑动还是右滑动 当横向位移大于10，纵向位移大于100，则判定为滑动事件
				// var disX=endPoint.pageX-startPoint.pageX;//计算移动的位移差
				// var disY=endPoint.pageY-startPoint.pageY;
				// if(Math.abs(disX)>10||Math.abs(disY)>100){
				// 	if(Math.abs(disX)>Math.abs(disY)){//判断是横向滑动还是纵向滑动
				// 	    if(disX>10){
				// 	        this.swiperight()//右滑
				// 	    };
				// 	    if(disX<-10){
				// 	        this.swipeleft()//左滑
				// 	    };
				// 	}
				// }
			},
			
			/**
			 * @name 向左滑动
			 */
			swipeleft(){
				if(this[initIndex]<this[modelData].length-1)this[initIndex]++
				console.log("左滑");
			
				vm.$store.commit('orderTabStateAdd')
				console.log(vm.$store.state.orderTabState)
			},
			
			/**
			 * @name 监听右滑
			 */
			swiperight(){
				if(this[initIndex]>0)this[initIndex]--
				console.log("右滑");
				vm.$store.commit('orderTabStateReduce')
				console.log(vm.$store.state.orderTabState)
			},
		}
	}
}