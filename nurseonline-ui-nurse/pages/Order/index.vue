<template>
	<view>
		<!-- 状态栏 -->
		<view class="status" :style="{position:headerPosition}"></view>
		<!-- 漂浮头部 -->
		<view class="header" :style="{position:headerPosition}">
			<view class="scan">
			
			</view>
			<view class="input">
				<view class="icon search"></view>
				<input placeholder="预约号/服务项目" v-model="request_data_search"/>
			</view>
			<view class="menu" @tap="toSearch">
				<view class="color-fff">搜索</view>
			</view>
			
		</view>
		
		<!-- 占位 -->
		<view class="place"></view>
		
		<my-tabs @change="tapChange" :modelData="modelData" :initIndex="initIndex"></my-tabs>
		<view class='purchase-list mt80'>
			<scroll-view class="purchase-body" scroll-y="true" @scrolltolower="scrolltolower" @scrolltoupper="scrolltoupper" @scroll="scroll" @touchstart="touchstart" @touchend="touchend">
				<my-unit :orderList="orderList" :request_data="request_data" :request_data_search='request_data_search'></my-unit>
			</scroll-view>
		</view>
	</view>
</template>
<script>
let _self;
import myTabs from '@/components/orderCell/tabs_order.vue'
import myUnit from '@/components/orderCell/unit_order.vue'
import myPull from '@/components/orderCell/pull_order.js'
export default {
	components:{myTabs,myUnit},
	data() {
		return {
			request_data:{//请求data
				staffId:'',
				billId:'',//关联订单id 
				taskId:'0',//任务id
				taskState:'0',//任务状态
				orgId:'0',
				searchCount:true,
				total:'',
				pages:'',//总页数
				current:1,//当前current页 初始就回触发getList()
				size:5,//每页预约单数
			},
			request_data_search:'',
			res_order:{},//res
			orderList:[
				
			],
			inputSearchNum:'',
		};
	},
	onLoad() {
		this.init();
		_self=this;
	},
	onReady() {
		
	}, 
	onShow(){
		
	},
	onTabItemTap(){
		uni.startPullDownRefresh();
		 setTimeout(function () {
		    uni.stopPullDownRefresh();
		}, 1000);
	},
	computed:{
		orderRefresh(){
			return this.$store.state.orderRefresh
		}
	},
	watch:{
		orderRefresh(){
			console.log("我监听到了orderRefresh状态的变化",this.$store.state.orderRefresh)
			this.init()//进行刷新
		}
	},
	onPageScroll(e){
		//兼容iOS端下拉时顶部漂移
		if(e.scrollTop>=0){
			this.headerPosition = "fixed";
		}else{
			this.headerPosition = "absolute";
		}
	},
	//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
	onPullDownRefresh() {
		this.init()
        setTimeout(function () {
            uni.stopPullDownRefresh();
        }, 1000);
    },
	//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
	onReachBottom(){
		console.log('触底啦')
		this.getCurrent(this.request_data.current)
	},
	methods: {
		async init(){
			this.request_data_search=''//输入框初始化
			this.$store.state.res_order=[]//初始化
			this.request_data.current=1//点击搜索，第一页数据
			
			uni.showLoading({})
			let res_info=await this.$apip.getPersonalInfo()
			this.request_data.staffId=res_info.data.data.staffId //复制staffId
			this.getOrder('init')
			uni.hideLoading()
		},
		//搜索跳转
		async toSearch(){
			this.$store.state.res_order=[]//初始化
			this.request_data.current=1//点击搜索，第一页数据
			this.getOrder('init')
		},
		//getOrder
		async getOrder(type){
			uni.showLoading({})
			let searchText;//输入框数字时
			let searchServer='';//输入为服务项目时
			if(this.request_data_search.length<1){//空字符串时
				searchText=0
			}else if(/^\d+$/.test(this.request_data_search)!=true){//为汉字
				searchText=''
				searchServer=this.request_data_search
			}
			else{
				searchText=this.request_data_search
				searchServer=''
			}
			let data='staffId='+this.request_data.staffId+
					'&billId='+searchText+
					'&taskId='+searchText+
					'&taskState='+this.request_data.taskState+
					'&orgId='+this.request_data.orgId+
					'&searchCount='+this.request_data.searchCount+
					'&current='+this.request_data.current+
					'&size='+this.request_data.size+
					'&taskDateOrder=desc'+
					'&serviceName='+searchServer
			let res_order=await this.$apio.getOrderInfo(data)

			if(res_order.data.data.records<1){//当前请求返回数据为空
				uni.showToast({
					title:'没有更多订单辣',
					icon:'none'
				})
				return false
			}
			if(type=='init'){
				this.$store.state.res_order=res_order.data.data.records
			}else if(type=='concat'){
				this.$store.state.res_order=this.$store.state.res_order.concat(res_order.data.data.records)
			}
			uni.hideLoading()
		},
		getCurrent(){//获取当前页面是第几页
			this.request_data.current++;
			this.getOrder('concat');
		},
		/**
		 * @name 获取列表
		 */
		getList(current){
			// this.request_data.current++;
			// console.log(`current页面`,this.request_data.current);
			// this.getOrder('concat');
		},
		/**
		 * @name 触底加载
		 */
		scrolltolower(event){
			// console.log('我触底了。。。')
			// this.getList(this.request_data.current)
		},
		
		scroll(e){
			// 重新设置pulldown
			this.setPullDown(e.detail.scrollTop<10)
		},
		
		scrolltoupper(){
			
		},
		
		
		/**
		 * @name 改变tab
		 * @param val 索引
		 */
		tapChange(val){
			this.initIndex=val
		},	
	},
	mixins:[myPull({})],
};
</script>
<style lang="scss">
@font-face {font-family:"HMfont-home";src:url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAP8AAsAAAAACFwAAAOwAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqEEINSATYCJAMQCwoABCAFhG0HTxtLBxHVmzvJfhS4scOeC1v4zNNRK/hO5b0IHqg/8838ye5XsIDanmAkhZ1NSZygm4SsbYYkp17ICsOUxIP/ZZm9xejtQAD8zzX10geY387mEtXapUd7A5xF6oAi2pJoE8YNY1dexGkIwCSZQoiq1es2RUdhTBKA6N2jWwf0lAlVky3QEYSUrFSIOTjQ5VR5GZjt/168obDQQeLQMGY27FqtMxWf5z5fpgWCgdYugng8B8DWgQYUAhSI7qWujmhhqBAaptJfURzQ0ZEwVkfB58uCQSTZi0o3//JAItBAhGBk2gAURUrtxMQ2BQnPC1IQ8HyZmpvE1XgdMIDtwHVEJt4qkThsZwFPVHiEFTHKtWBBYGGUe/HmsZu6TluCStw+fXGMY9GyUb4b133Xrze9etV77VqzxcuXbYq8bF6/7rtxo5lY6A1cLcuCQJS3oXHswOYKUSaI71xkXr3ayZy2SIix0YumRS6AwEnLmr58WS9z2pKlYcJCCGzcXOU81Xuhp1osIWbBiUQWehda7lTvaNeCJX0WbYgksMA0hdlLo6zDp1PEomIdVu7YE4wN7nH7uGPdHXz2R3uHnX68tcP6SPE5ZSdObNpN/9dybtfmr6tHoy6+rN+DqdvnW9lUbkHTdcUWfKp1yzVr5Ag5HCqGU0Hca3jpAt2GiWFRwxYvdpYFo2b3tN/HvLeFd+BAr5Bu7CXnzKFlJb8dtP3ucx1djc+589Pep+W7X706stfvml+7i8fsWunxp7/f/uzsrgzj9Sv3p+6T7yqwvrfdy3nk/J6eZ84fnHp2lSvf/m/7H7569dDvuY/fTX+Mwdog+QVAGyB/IHmGyK8/exQrX13Maucu+y23rrbi5tQ1T3yTor3oj4kV8a8VtyxSqtQwKyXLbJF2kaI5DgAkYGICPzQG4dwfQxPVOhMEOlExSEJJAg2dTFSRhcCBRVEIQacCmBSkxnqLCAaiIZQBFGAiAIGH3SBxcRo0PFxBFXkPHETzDkLwCA1MfCJiR4tswStWxeEccIPlAbXSxS1rYEH2G0U8ZpeU+sw/Oq+80JR1NjrghW6MOT6JNgQO3NEJPTgPj4PAONK4hlKGYLqq4mVvKlc6M0YVh3PADZYH1EoXd8sHlvv+G0U8ZldDq/D+0XnVPTRl3QIdVFcr2rX090m0IXA8jjs6oYcOPMwQgSkfpnENpewRMF2FSvG2qnJ+zfmE6wATY6YSUmhCCQehg9V8advwun0+nHuJ0VP0kYrcz/Qox5hl') format('woff2');}
.icon {
	font-family:"HMfont-home" !important;
	font-size:60upx;
	font-style:normal;
	color:#ffffff;
	&.scan {
		&:before{content:"\e69a";}
	}
	&.menu {
		&:before{content:"\e62b";}
	}
	&.search {
		&:before{content:"\e628";}
	}
}
page {
	background-color: #fff;
}
.status {
	width: 100%;
	height: 0;
	/*  #ifdef  APP-PLUS  */
	height: var(--status-bar-height);
	/*  #endif  */
	background-color: #6e8cfa;
	position: fixed;
	top: 0;
	z-index: 999;
}
.header {
	width: 100%;
	height: 100upx;
	background-color: #6e8cfa;
	display: flex;
	position: fixed;
	top: 0;
	/*  #ifdef  APP-PLUS  */
	top: var(--status-bar-height);
	/*  #endif  */
	
	z-index: 996;
	.scan {
		width: 100upx;
		height: 100upx;
		flex-shrink: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.input {
		width: calc(100% - 200upx);
		display: flex;
		justify-content: center;
		align-items: center;
		position:relative;
		input {
			width: calc(100% - 60upx);
			height: 60upx;
			background-color: #ffffff;
			border-radius: 60upx;
			padding-left: 60upx;
			font-size: 30upx;
			
		}
		.icon{
			width: 60upx;
			height: 60upx;
			position: absolute;
			color: #a18090;
			z-index: 996;
			top: 20upx;
			left: 0;
			font-size: 40upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	.menu {
		width: 100upx;
		height: 100upx;
		flex-shrink: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		image{
			width: 60upx;
			height: 60upx;
			border-radius: 60upx;
		}
	}
}
.place{
	/*  #ifdef  APP-PLUS  */
	margin-top: var(--status-bar-height);
	/*  #endif  */
	background-color: #fff;
	height: 100upx;
}
.placeIndex{
	/*  #ifdef  APP-PLUS  */
	margin-top: var(--status-bar-height);
	/*  #endif  */
	height: 88upx;
}
.swiper-view {
	.swiper {
		width: 100%;
		height: 280upx;
		image {
			width: 100%;
			height: 280upx;
		}
	}
	.keep-out {
		width: 100%;
		height: 30upx;
		border-radius: 100% 100% 0 0;
		background-color: #6e8cfa;
		margin-top: -15upx;
		position: absolute;
	}
}
.category {
	width: 95%;
	padding: 2.5vw 2.5vw;
	background-color:#6e8cfa;
	.box {
		width: 100%;
		border-radius: 20upx;
		background-color: #ffffff;
		.dots {
			display: flex;
			justify-content: center;
			height: 15upx;
			width: 100%;
			view{
				width: 30upx;
				height: 5upx;
				background-color: rgba(0, 0, 0, 0.2);
				&.active {
					background-color: #6e8cfa;
				}
			}
		}
		.swiper {
			width: 100%;
			padding: 10upx 0;
			.uni-swiper-dot {
				width: 20upx;
			}
			.category-list {
				width: 100%;
				height: auto;
				display: flex;
				justify-content: flex-start;
				padding: 10upx 0;
				flex-flow: wrap;
				.icon {
					width: 20%;
					display: flex;
					flex-flow: wrap;
					justify-content: center;
					font-size: 22upx;
					color: #666;
					image {
						width: 70%;
						height: 13.3vw;
					}
					view{
						width: 100%;
						display: flex;
						justify-content: center;
					}
				}
			}
		}
	}
}
.pick{
	width: 95%;
	padding: 0 2.5vw 2.5vw 2.5vw;
	background: linear-gradient(to bottom, #6e8cfa 0%,#ffffff 105%);
	.box{
		width: 100%;
		border-radius: 20upx;
		background-color: #ffffff;
		.title{
			display: flex;
			justify-content: flex-start;
			align-items: flex-end;
			height: 60upx;
			border-bottom: solid 1upx #eee;
			padding-bottom: 10upx;
			.big{
				font-size: 34upx;
				padding-left: 20upx;
				color: #46434f;
			}
			.small{
				font-size: 24upx;
				padding-left: 20upx;
				color: #827f8b;
			}
		}
		.product-list{
			padding: 15upx 20upx 15upx 20upx;
			column-count: 2;
			column-width: 50%;
			column-gap: 10upx;
			>view{
				display: flex;
				background-color: #f8f8f8;
				position:relative;
				&:nth-child(1){
					.price{
						color: #e65339;
						font-size: 30upx;
						position: absolute;
						bottom: 8upx;
						left: 8upx;
					}
					.slogan{
						color: #807c87;
						font-size: 30upx;
						position: absolute;
						bottom: 8upx;
						right: 8upx;
					}
					image{
						width: 100%;
						height: 0;
					}
				}
				&:nth-child(2),&:nth-child(3){
					image{
						width: calc(50% - 5upx);
						height: 0;
					}
					.price{
						position: absolute;
						top: 25%;
						left: 55%;
						color: #e65339;
						font-size: 30upx;
					}
					.slogan{
						position: absolute;
						top: 60%;
						left: 55%;
						color: #807c87;
						font-size: 20upx;
					}
				}
				&:nth-child(2){
					margin-bottom: 10upx;
				}
			}
		}
	}
}
.banner{
	image{
		width: 100%;
	}
}
.goods-list{
	background-color: #f4f4f4;
	.title{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
	.loading-text{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
	.product-list{
		width: 95%;
		padding: 0 2.5% 2.5vw 2.5%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.product{
			width: 100%;
			border-radius: 20upx;
			background-color: #fff;
			margin: 0 0 15upx 0;
			image{
				width: 100%;
				border-radius: 20upx 20upx 0 0;
			}
			.name{
				width: 92%;
				padding: 10upx 4%;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				text-align: justify;
				overflow: hidden;
				font-size: 30upx;
			}
			.info{
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				width: 92%;
				padding: 10upx 4% 10upx 4%;
				
				.price{
					color: #e65339;
					font-size: 30upx;
					font-weight: 600;
				}
				.slogan{
					color: #807c87;
					font-size: 24upx;
				}
			}
		}
		
	}
}
.badge{position:absolute;width:4vw;height:4vw;background-color:#ec6d2c;top:0vw;right:1vw;border-radius:100%;font-size:20upx;color:#fff;display:flex;align-items:center;justify-content:center;z-index: 10;}
.addr image{width:6vw;height:6vw}
.purchase-list {
		background-color: #f5f5f5;
		height: 100%;
		overflow: hidden;
		
		.purchase-body{
			height: calc(100% - 88upx);
			overflow: auto
		}
	}
</style>