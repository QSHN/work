<template>
	<view>
		<!-- 状态栏 -->
		<view class="status" :style="{position:headerPosition}"></view>
		<!-- 漂浮头部 -->
		<!-- 占位 -->
		<!-- 轮播图 -->
		<view class="swiper-view positionR mt5">
			<swiper class="swiper" indicator-dots="true" autoplay="true" circular="true" indicator-active-color="#ffffff">
				<swiper-item v-for="swiper in swiperList" :key="swiper.sid" @tap="toSwiper(swiper)">
					<image mode="aspectFill" :src="swiper.img"></image>
				</swiper-item>
			</swiper>
			<view class="menu positionA" @tap.stop.prevent="toInfo" style="top:20upx;right:20upx;z-index:999">
			
			</view>
		</view>
		<!-- 接单列表 -->
		<view class="goods-list">
			<view class="title">— 接单列表 —</view>
			<view class="color666 text-alignC width100p title" v-if="showNoOrder">{{showNoOrderText}}</view>
			<view class="color666 text-alignC width100p title" v-if="showNoCert">{{showNoCertText}}<text class="color6e8cfa" @tap="toCert(noOrderReasonIndex)">{{noOrderReason}}</text></view>
			<view class="product-list">
				<view class="product" v-for="product in productList" :key="product.goods_id" @tap="toGoods(product)">
					<view class="name  border-bottom uni-flex uni-row justify-content-space">
						<view class="flex-item inline-block">预约号:{{product.number}}</view>
						<view class="flex-item inline-block pl20 color6e8cfa">距离{{product.long}}{{product.longUnit}}</view>
						</view>
					<view class="name">服务项目:{{product.name}}</view>
					<view class="name">服务机构:{{product.org}}</view>
					<view class="name">预约时间:{{product.time}}</view>
					<view class="name">服务地址:{{product.addr}}</view>
					<view class="info">
						<view class="price">收入:{{product.price}}</view>
					</view>
					<button class="width30p bgc-6e8cfa color-fff padding-0-40 recieveBtn" type="default">{{product.slogan}}</button>
				</view>
			</view>
			<view class="loading-text">{{loadingText}}</view>
		</view>
	</view>
</template>
<script>
import amap from '@/static/common/map/amap-wx.js'
var _self;
export default {
	components: {},
	data() {
		return {
			//轮播
			swiperList:[
				{sid:0,src:'src0',img:'../../static/img/swiper/0.png'},
				{sid:1,src:'src1',img:'../../static/img/swiper/1.png'},
			],
			orderTypeLise:{badge:1},
			productList:[//待接单列表展示
				
			],
			productListPull:[
				{ goods_id: 5,number:1752663, org:'湛江市某某某医院',time:'2019年2月29日 13:30-14:00','addr': '湛江市中山三路133号',name: '上门换药', price: '￥266',long:"4.5",slogan:'接单' },
				{ goods_id: 6,number:1752664, org:'湛江市某某某护理服务中心',time:'2019年3月12日 15:00-16:00','addr': '湛江市赤坎区跃进路35号',name: '直抬腿高训练', price: '￥275',long:"2.5", slogan:'接单' },
			],
			categoryHeight: '150px',
			currentPageindex: 0,
			headerPosition:"fixed",
			showNoOrder:false,//是否显示无订单提示
			showNoOrderText:'暂无可接单的预约，请耐心等待......',
			showNoCert:false,
			showNoCertText:'您当前暂时不能接单，原因是：',
			noOrderReason:'',
			noOrderReasonIndex:'',
			amapPlugin: null,   
			key: '9e47e3566d3ae729652171562dabe658',
			latitude:'',//维度
			longitude:'',//经度
		};
	},
	onTabItemTap(){
		uni.startPullDownRefresh();
		 setTimeout(function () {
		    uni.stopPullDownRefresh();
		}, 1000);
	},
	onReady() {
		
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
		console.log("下拉刷新")
		this.init();//下拉刷新初始化
        setTimeout(function () {
            uni.stopPullDownRefresh();
        }, 1000);
    },
	//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
	onReachBottom(){
		uni.showToast({
			title: '更多订单',
			icon:"none"
			});
		let len = this.productList.length;
		if(len>=7){
			this.loadingText="到底了";
			return false;
		}
		let lenPull=this.productListPull.length
	},
	computed:{
		homeRefresh(){
			return this.$store.state.homeRefresh
		}
	},
	watch:{
		homeRefresh(){
			console.log("我监听到了homeRefresh状态的变化",this.$store.state.homeRefresh)
			this.init()//进行刷新 预约单相关状态刷新
		}
	},
	onLoad() {
		_self=this
		this.init()
		this.amapPlugin = new amap.AMapWX({  
		    key: this.key  
		})
		this.amapPlugin.getRegeo({
			success: res => {
				this.address = res[0].name
				console.log("当前定位地址",this.address)
			}
		})
		uni.getLocation({
			success: res => {
				this.latitude = res.latitude
				this.longitude = res.longitude
				console.log("this.latitude",this.latitude)
				console.log("this.longitude",this.longitude)
			},
			fail: (res) => {
				console.log("获取位置失败",res)
			}
		})
	},
	methods: {
		async init(){
			this.showNoCert=false//提示init
			//获取基本ingo
			uni.showLoading({})
			let res_info=await this.$apip.getPersonalInfo()
			let res_org=await this.$api.joinedOkOrg()////是否成功入驻机构
			let res_isSchedule=await this.$apip.hasStaffScheduleAfterCurrWeek()//是否排班
			let res_isAddress=await this.$apip.getDefAddr()//是否设地址
			let res_info_data=res_info.data.data
			console.log("res_info_data",res_info_data)
			uni.hideLoading()
			//判断是否需要认证、考核、机构、排班、地址、 的相关操作 
			let isCertificated=res_info_data.isCertificated
			let isExamined=res_info_data.isExamined
			let isOrgd_len=res_org.data.data.length
			let isSchedule=res_isSchedule.data.data
			let isAddress=res_isAddress.data.data
			if(isCertificated==0){
				uni.showModal({
					title:'提示',
					content:'只有完成身份认证，才可以接单，请前往身份认证',
					success: function (res) {
						if (res.confirm) {
							uni.navigateTo({
								url:'../PersonalCenter/IdentityConfirm/index'
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
							_self.showNoCert=true
							_self.noOrderReason="未认证身份或身份已失效"
							_self.noOrderReasonIndex=1
						}
					}
				})
				return;
			}
			if(isExamined==0){
				uni.showModal({
					title:'提示',
					content:'只有完成护理考核，才可以接单，请前往参考考核',
					success: function (res) {
						if (res.confirm) {
							uni.navigateTo({
								url:'../../packageA/Exam/index'
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
							_self.showNoCert=true
							_self.noOrderReason="未完成护理考核或考核成绩已失效"
							_self.noOrderReasonIndex=2
						}
					}
				})
				return;
			}
			if(isOrgd_len<=0){
				uni.showModal({
					title:'提示',
					content:'只有完成机构入驻，才可以接单，请前往机构入驻',
					success: function (res) {
						if (res.confirm) {
							uni.navigateTo({
								url:'../../packageA/MyOrg/index'
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
							_self.showNoCert=true
							_self.noOrderReason="未成功入驻机构"
							_self.noOrderReasonIndex=3
						}
					}
				})
				return;
			}
			if(isSchedule==false){
				uni.showModal({
					title:'提示',
					content:'只有完成排班表设置，才可以接单，请前往排班表设置',
					success: function (res) {
						if (res.confirm) {
							uni.navigateTo({
								url:'../../packageA/Calendar/index'
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
							_self.showNoCert=true
							_self.noOrderReason="未设置排班表"
							_self.noOrderReasonIndex=4
						}
					}
				})
				return;
			}
			if(isAddress==null){
				uni.showModal({
					title:'提示',
					content:'只有完成地址设置，才可以接单，请前往地址设置',
					success: function (res) {
						if (res.confirm) {
							uni.navigateTo({
								url:'../../packageA/MyAddress/add'
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
							_self.showNoCert=true
							_self.noOrderReason="未设置默认地址"
							_self.noOrderReasonIndex=5
						}
					}
				})
				return;
			}
			//获取订单列表 (可接单)
			uni.showLoading({})
			let res_remain_order=await this.$apio.getBillAssignViewPageByStaff('staffId='+res_info_data.staffId+'&position='+this.longitude+','+this.latitude)
			if(res_remain_order.data.data.data.records.length<=0){//无订单时，显示文本提示
				this.showNoOrder=true
			}else{
				this.showNoOrder=false
			}
			//根据taskId进行请求数据 数据渲染
			this.productList=[];//productList-init
			res_remain_order.data.data.data.records.forEach((item,index)=>{
				this.productList.push({assignId:'',taskId:'',number:'', org:'',time:'','addr': '',name: '', price: '', long:"",slogan:'接单' })
				this.productList[index].taskId=item.taskId
				this.productList[index].assignId=item.assignId
				
				this.productList[index].number=item.taskId//task_id 预约号、bill_i 订单号
				this.productList[index].org=item.orgName
				this.productList[index].time=item.reserveDate+' '+item.reserveTime1+":00"+'~'+item.reserveTime2+":00"
				this.productList[index].addr=item.custAddress
				this.productList[index].name=item.serviceLabel
				
				let distance_len=item.distance.toString().length
				if(distance_len>3){
					this.productList[index].long=(Math.round(item.distance/100)/10).toFixed(1)
					this.productList[index].longUnit='km'
				}else{
					this.productList[index].long=item.distance
					this.productList[index].longUnit='m'
				}

				this.productList[index].price="￥"+item.staffAmt
			})
			uni.hideLoading()
		},
		//判断是否能获取单信息
		judgeCanOrNot(isCertificated,isExamined,isOrgd,isSchedule,isAddress){
			
		},
		//扫一扫
		scan(){
			uni.scanCode({
				success:(res)=>{
					uni.showToast({title: '条码内容：' + res.result});
				}
			});
		},
		//搜索跳转
		toSearch(){
			uni.showToast({title: "请输入定位地址"});
		},
		//轮播图跳转
		toSwiper(e){
			// uni.showToast({
			// 	title: e.src,
			// 	icon:'none'
			// });
		},
		//分类跳转
		toCategory(e){
			uni.showToast({title: e.title});
		},
		//推荐商品跳转
		toPick(e){
			// uni.showToast({title: '推荐商品'+e.goods_id});
		},
		//待接单跳转至详情
		toGoods(e){
			uni.navigateTo({
				url:'../../packageB/ReceiveOrder/index?taskId='+e.taskId+"&assignId="+e.assignId+'&distance='+e.long+'&longUnit='+e.longUnit
			})
		},
		//更新分类指示器
		categoryChange(event) {
			this.currentPageindex = event.detail.current;
		},
		//分类图片加载完毕
		categoryImgLoad(e){
			this.categoryImg = this.categoryImg?this.categoryImg+1:1;
			//完成加载11个分类图片开始计算分类高度，若分类图片不足10个则修改此处的10。
			if(this.categoryImg==10){
				this.getCategoryHeight();
			}
		},
		//更新分类高度
		getCategoryHeight() {
			let view = uni.createSelectorQuery().select('.category-list');
			view.fields(
				{
					size: true
				},
				data => {
					this.categoryHeight = data.height + 'px';
				}
			).exec();
		},
		//信息中心
		toInfo(){
			uni.navigateTo({
				url:'../../packageA/Msg/index'
			})
		},
		toCert(noOrderReasonIndex){
			switch(parseInt(noOrderReasonIndex)){
				case 1:
				uni.navigateTo({
					url:'../PersonalCenter/IdentityConfirm/index'
				})
				break;
				case 2:
				uni.navigateTo({
					url:'../../packageA/Exam/index'
				})
				break;
				case 3:
				uni.navigateTo({
					url:'../../packageA/MyOrg/index'
				})
				break;
				case 4:
				uni.navigateTo({
					url:'../../packageA/Calendar/index'
				})
				break;
				case 5:
				uni.navigateTo({
					url:'../../packageA/MyAddress/add'
				})
				break;
			}
		}
	}
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
	background-color: #f4f4f4;
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
						color: #6c8efa;
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
						color: #6c8efa;
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
			position: relative;
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
				padding: 8upx 4%;
				display: flex;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				text-align: justify;
				overflow: hidden;
				font-size: 26upx;
			}
			.info{
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				width: 92%;
				padding: 10upx 4% 20upx 4%;
				
				.price{
					color: #6c8efa;
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
.badge{
position:absolute;
width:3vw;
height:3vw;
background-color:#ec6d2c;
top:-8rpx;
right:-8rpx;
border-radius:100%;
font-size:20rpx;
color:#fff;
display:-webkit-box;
display:-webkit-flex;
display:-ms-flexbox;
display:flex;
-webkit-box-align:center;
-webkit-align-items:center;
-ms-flex-align:center;
align-items:center;
-webkit-box-pack:center;
-webkit-justify-content:center;
-ms-flex-pack:center;
justify-content:center;
z-index:10;
}
.addr image{width:6vw;height:6vw}
.recieveBtn{position:absolute;bottom:15upx;right:20rpx;font-size: 20upx;width:25%;}
</style>
