<template>
	<view>
		<view class="swiper-view">
			<swiper class="swiper" indicator-dots="true" autoplay="true" circular="true" indicator-active-color="#6e8cfa">
				<swiper-item v-for="swiper in swiperList" :key="swiper.sid" @tap="toSwiper(swiper)">
					<image mode="widthFix" :src="swiper.img"></image>
				</swiper-item>
			</swiper>
			<!-- <navigator class="city" :url="'../city/list?city=' + city.zoneName">{{city.zoneName || '湛江市'}}<text class="iconfont">&#xe74a;</text></navigator> -->
		</view>
		
		<view class="justify-between server-box-up">
			<navigator class="flex-column flex-center bg-white box-left" url="/subPagesA/service/list?id=1&title=母婴护理">
				<view class="msg">
					<view class="title">母婴护理</view>
					<view class="tip">执业护士上门为您服务</view>
				</view>
				<image src="../../static/images/home-proj/proj1.png" mode="widthFix"/>
			</navigator>
			<view class="flex-column justify-between area-right">
				<navigator class="flex-msg bg-white box-right" url="/subPagesA/service/list?id=2&title=导管护理">
					<view class="msg">
						<view class="title">导管护理</view>
						<view class="tip">执业护士上门为您服务</view>
					</view>
					<image src="../../static/images/home-proj/proj2.png" mode="widthFix"/>
				</navigator>
				<navigator class="flex-msg bg-white box-right" url="/subPagesA/service/list?id=3&title=皮肤护理">
					<view class="msg">
						<view class="title">皮肤护理</view>
						<view class="tip">执业护士上门为您服务</view>
					</view>
					<image src="../../static/images/home-proj/proj3.png" mode="widthFix"/>
				</navigator>
			</view>
		</view>
		
		
		
		<!-- 分类轮播 -->
		<view class="category">
				<view class="box">
					<swiper	class="swiper" duration="300" :style="{ height: categoryHeight }" @change="categoryChange">
						<swiper-item v-for="(page, pageindex) in categoryList" :key="pageindex" >
							<view class="category-list">
								<view class="icon" v-for="category in page" :key="category.cat_id" @tap="toCategory(category)">
									<image mode="widthFix" :src="category.src" @load="categoryImgLoad"></image>
									<view>{{ category.title }}</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
					<view class="dots">
						<view v-for="(page, pageindex) in categoryList" :key="pageindex" :class="{ active: pageindex == currentPageindex }"></view>
					</view>
				</view>
		</view>
		
		<uni-login ref="uniLogin" />
	</view>
</template>

<script>
import amap from '../../common/utils/amap-wx.js'
import { mapGetters,mapMutations } from 'vuex'
import { getVipCert } from '@/common/api/account/account'
import uniLogin from "@/components/uni-login/uni-login"

export default {
	data() {
		return {
			amapPlugin: null,   
			key: '9e47e3566d3ae729652171562dabe658',
			//轮播
			swiperList:[
				{sid:0,src:'自定义src0',img:'../../static/images/swiper-img/0.jpg'},
				{sid:1,src:'自定义src1',img:'../../static/images/swiper-img/1.jpg'}
			],
			centerServive: [
				{
					id: 0,
					text: '常用医疗护理',
					img: '',
					url: '../service/list?id=4'
				},
				{
					id: 1,
					text: '常用中医护理',
					img: '',
					url: '../service/list?id=5'
				},
// 				{
// 					id: 2,
// 					text: '长护险',
// 					img: '',
// 					url: '../insurance/apply'
// 				}
			],
			currentPageindex: 0,
			categoryHeight:'20vh',
			//分类
			categoryList: [
				[//第一页
					{ cat_id: 4,src:'../../static/images/home-proj/proj4.png',title: '造口护理' },
					{ cat_id: 5,src:'../../static/images/home-proj/proj5.png', title: '中医护理' },
					{ cat_id: 6,src:'../../static/images/home-proj/proj6.png', title: '给药护理' },
				],
				[//第二页
					{ cat_id: 7,src:'../../static/images/home-proj/proj7.png',title: '康复护理' },
					{ cat_id: 8,src:'../../static/images/home-proj/proj8.png',title: '呼吸护理' },
					{ cat_id: 9,src:'../../static/images/home-proj/proj9.png',title: '基础护理' },
				],
				[//第三页
					{ cat_id: 10,src:'../../static/images/home-proj/proj10.png',title: '排泄护理' },
					{ cat_id: 11,src:'../../static/images/home-proj/proj11.png',title: '静疗护理' },
				]
			],	
		}
	},
	// created() {
	// 	if(!this.city.hasOwnProperty('zoneName')){
	// 		this.amapPlugin = new amap.AMapWX({  
	// 		    key: this.key  
	// 		})
	// 		
	// 		this.amapPlugin.getRegeo({
	// 			success: res => {
	// 				let addressComponent = res[0].regeocodeData.addressComponent
	// 				// this.city = res[0].regeocodeData.addressComponent.city
	// 				this.$store.commit('SET_CITY',{
	// 					zoneCode: addressComponent.adcode.substring(0,4),
	// 					zoneName: addressComponent.city
	// 				})
	// 			}
	// 		})
	// 	}
	// },
	// onShow() {
	// 	uni.authorize({
	// 		scope: 'scope.userLocation',
	// 		success: () => {
	// 			uni.getLocation()
	// 		}
	// 	})
	// },
	onShow(){
		this.access_token = uni.getStorageSync('access_token')
	},
	onLoad() {
		if(!this.access_token==""){
			this.init()
		}
		
	},
	components: {
		uniLogin,
	},
	computed: {
		...mapGetters(['city'])
	},
	methods: {
		init() {
			getVipCert().then(response => {
				let data = response.data
				if(data.msg === 'success'){
					if (!data.data) {
						uni.showModal({
							title:'提示',
							content:'账户没认证，是否立即进行认证',
							success: function (res) {
								if (res.confirm) {
									uni.navigateTo({
										url:'../user/identity'
									})
								} else if (res.cancel) {
								}
							}
						})
					}
				}
			})
		},
		toSwiper() {
			console.log(111)
		},
		noDetail() {
			// uni.showToast({
			// 	title: '未发布',
			// 	icon: 'none',
			// 	mask: true
			// })
			uni.showModal({
				title: '提示',
				content: '私人定制项目请联系客服人员',
				success: res => {
					if(res.confirm){
						uni.makePhoneCall({
							phoneNumber: '17707599741'
						})
					}
				}
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
		toCategory(category){
			if (this.access_token == "") {
				this.$refs.uniLogin.onPopup(true)
				return false
			}
			console.log("category",category)
			uni.navigateTo({
				url: '../../subPagesA/service/list?id='+category.cat_id+'&title='+category.title,
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
		selectService(){
			if(!this.access_token==""){
				this.$refs.uniLogin.onPopup(false)
				uni.showActionSheet({
					itemList: ['电话随访', '上门随访'],
					success: function (res) {
						if(res.tapIndex==0){
								uni.navigateTo({
									url: '../../subPagesA/service/phoneVisit' 
							})
						}else if(res.tapIndex==1){
							uni.navigateTo({
								    url: '../../subPagesA/service/doorVisit'
							})
						}
						},
					fail: function (res) {
						console.log(res.errMsg);
						}
				});
			}else {
				setTimeout(()=>{
					this.$refs.uniLogin.onPopup(true)
				},0)
					
			}

		}
	}
}
</script>

<style lang="scss">
	page{
		background-color: #edf1f4!important
	}
	.swiper-view {
		margin-bottom: 10rpx;
		position: relative;
		.swiper {
			width: 100%;
			height: 280rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.city{
			// color: #fff;
			position: absolute;
			top: 20rpx;
			left: 20rpx;
			.iconfont{
				margin-left: 10rpx;
				margin-top: 4rpx;
			}
		}
	}
	.server-box-up {
		// margin-bottom: 10rpx;
		height: 340rpx;
		.msg {
			.title{
				font-size: 30rpx;
			}
			.tip {
				color: #b5b5b6;
				font-size: 24rpx;
			}
		}
		.box-left {
			width: 40%;
			image {
				width: 250rpx;
			}
		}
		.area-right {
			width: 59%;
			.box-right {
				height: 49%;
				padding: 20rpx;
				box-sizing: border-box;
			}
			image {
				width: 130rpx;
			}
		}
	}
	.server-box-center {
		.server-box{
			width: 32%;
			padding: 10rpx;
			box-sizing: border-box;
			image {
				width: 130rpx;
			}
		}
	}
	.server-box-bottom {
		.box-area {
			flex: 1;
			padding: 10rpx 0;
			box-sizing: border-box;
			.icon-box {
				width: 90rpx;
				height: 90rpx;
				background-size: 120rpx;
				&.ic0 {
					background-position: 3px 26.5%;
				}
				&.ic1 {
					background-position: 2px 28.7%;
				}
				&.ic2 {
					background-position: 4px 31.3%;
				}
				&.ic3 {
					background-position: 5px 33.7%;
				}
			}
		}
	}
	.package-box {
		image {
			width: 120rpx;
		}
		.message-content {
			margin-left: 20rpx;
			line-height: 45rpx;
			.title {
				color: #3e3a39;
				font-weight: 600;
			}
			.price {
				color: #6E8CFA;
				font-size: 32rpx;
				font-weight: 600;
			}
			.introduce {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}
	}
/*
* 商城swiper 之前迁移，可能有冗余
*/	
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
	background-color: #ff570a;
	position: fixed;
	top: 0;
	z-index: 999;
}
.header {
	width: 100%;
	height: 100upx;
	background-color: #ff570a;
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
	background-color: #ff570a;
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
		background-color: #ff570a;
		margin-top: -15upx;
		position: absolute;
	}
}
.category {
	width: 100%;
	background-color: #edf1f4!important;
	// padding: 2.5vw 2.5vw;
	.box {
		width: 100%;
		// border-radius: 20upx;
		// background-color: #ffffff;
		.dots {
			display: flex;
			justify-content: center;
			height: 15upx;
			width: 100%;
			// background-color: #edf1f4!important;
			view{
				width: 10upx;
				height: 10upx;
				background-color: rgba(0, 0, 0, 0.2);
				border-radius:50%;
				margin: 0 10rpx;
				&.active {
					background-color: #6c8efa;
				}
			}
		}
		.swiper {
			width: 100%;
			padding-bottom: 10upx;
			.uni-swiper-dot {
				width: 20upx;
			}
			.category-list {
				width: 100%;
				height: 200rpx;
				display: flex;
				justify-content: flex-start;
				padding: 6upx 0;
				flex-flow: wrap;
				.icon {
					width: 28%;
					display: flex;
					flex-flow: wrap;
					justify-content: center;
					font-size: 22upx;
					color: #666;
					background-color: #fff;
					margin: 10rpx;
					padding: 10rpx;
					image {
						width: 130rpx;
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
	background: linear-gradient(to bottom, #ff570a 0%,#ffffff 105%);
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
			width: 48.75%;
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
</style>