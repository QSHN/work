<template>
	<view>
		<!-- part1 -->
		<view class="goods-list">
			<view class="product-list  pt20-im">
				<view class="product">
					<view class="name border-bottom">预约号:{{product.number}}</view>
					<view class="name">服务项目:{{product.name}}</view>
					<view class="name">服务机构:{{product.org}}</view>
					<view class="name">预约时间:{{product.time}}</view>
					<view class="info">
						<view class="price">收入:{{product.price}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- part2 -->
		<view class="goods-list">
			<view class="product-list ">
				<view class="product">
					<view class="uni-flex uni-row flex-box justify-content-space border-bottom padding-20">
							<label class="left-icon">服务对象信息</label>
							<view class="flex-item inline-block pl20 color6e8cfa">距离{{product.long}}{{product.longUnit}}</view>
					</view>
					<view class="name">服务对象:{{product.serveName}}</view>
					<view class="name uni-flex uni-row flex-box justify-content-space">
							<view class="flex-item inline-block">服务地址:{{product.addr}}</view>
					</view>
					<view class="name">联系人:{{product.contactName}}</view>
					<view @tap.stop.prevent="contactServerObj" class="flex-item positionA inline-block pl40 color6e8cfa recieveBtn1 text-alignC"
					 style="font-size:26upx;left:35vw;bottom:25upx;"><text class="iconfont">&#xe70c;</text>联系服务对象</view>
					
				</view>
			</view>
			<button class="width80p bgc-6e8cfa color-fff padding-0-20" type="default" @tap="toVisLog">查看就诊信息详情</button>
		</view>
		
		<!-- part3 -->
		<view class="goods-list">
			<view class="product-list pt20-im">
				<view class="product padding-20 overflow-h">
					<label class="left-icon">就医证明</label>
					
					<view class="uni-flex uni-row justify-content-center margin-20 overflow-h">
						<view v-for="(item,index) in srcArr" :key="index">
							<view class="uni-item showimgRow" @tap="previewImg1(index)" style="overflow: hidden;">
								<image mode='aspectFill' style="height:300upx;width:100%" class="margin-20" :src="item.src"></image>
							</view>
						</view>
					</view>
							<button @tap="toReceive" class="bgc-6e8cfa color-fff padding-0-40  " type="default">确认接单</button>
							<button @tap="toRefuse" class="bgc-fff color6e8cfa padding-0-40 mt20 borderC-6e8cfa" type="default">拒绝接单</button>

					<view class="agree-box text-alignC padding-20">
						<checkbox class="inline-block" value="agree" checked />
						<view class="inline-block">我同意</view>
						<view class="fc-normal inline-block" @tap="toWordInfo">《优佳护接单服务协议》</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- part4 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="padding-20">
					<view class="uni-column padding-20 fontSizeListText mt20">
						<view>接单服务流程介绍</view>
						<view>1.点击“确认接单”，进入预约界面显示待服务的单号</view>
						<view>2.尽早在预约界面点击“申请领取耗材包”，并收货</view>
						<view>3.提前2-3小时联系患者，确认患者是否在家或是否需要变更上门服务的时间</view>
						<view>4.确认无误后，携带所需物品，选择合适的时间和交通工具，前往服务地址</view>
						<view>5.出门时，在待服务界面点击“出门领取保单”按钮。获取XX保险保单</view>
						<view>7.接着在待服务界面点击“到达，评估患者状况”将向患者或家属了解、评估患者的目前状况记录下来</view>
						<view>8.开展指定的上门服务项目</view>
						<view>9.服务结束后，在待服务界面点击“服务结束，上传护理记录”里记录患者目前的状态必要时上传图片资料和语音资料。</view>
						<view>10.最后，整理好相关医疗垃圾并投递到指定地点。</view>
					</view>
				</view>
			</view>
		</view>
	
	</view>
</template>
<script>
var _self;
export default {
	data() {
		return {
			//猜你喜欢列表
			product:{ number:'',contactName:"",serveName:"",linkmanPhone:'', org:'',time:'',addr: '9号',name: '', price: '', slogan:'接单' },
			categoryHeight: '150px',
			currentPageindex: 0,
			headerPosition:"fixed",
			loadingText:"正在加载...",
			staffId:'',
			taskId:'',
			custId:'',
			billId:"",
			srcArr:[
				
			]//就医证明图片数组
		};
	},
	onReady() {
		
	}, 
	onPageScroll(e){
	},
	onPullDownRefresh() {
    },
	onReachBottom(){
	},
	onLoad(options) {
		console.log("options",options)
		_self = this;
		this.init(options.taskId,options.assignId,options.distance,options.longUnit)
	},
	methods: {
		async init(taskId,assignId,distance,longUnit){
			uni.showLoading({})
			let res_detail_BytaskId=await this.$apio.billtaskBytaskId(taskId)
			let res_info=await this.$apip.getPersonalInfo()
			uni.hideLoading()
			//渲染数据
			let record=res_detail_BytaskId.data.data
			
			//就医证明
			uni.showLoading({})
			let res_billcerts=await this.$apio.billcerts(record.billId)
			uni.hideLoading()
			console.log("就医证明res_billcerts",res_billcerts.data.data)
			let res_res_billcerts_data=res_billcerts.data.data
			res_res_billcerts_data.forEach((item,index)=>{
				this.srcArr.push({src:''})
				this.srcArr[index].src=res_res_billcerts_data[index].certImgPath
			})
			//测试。模拟多图片
			/* res_res_billcerts_data.forEach((item,index)=>{
				this.srcArr.push({src:''})
				this.srcArr[index].src=res_res_billcerts_data[index].certImgPath
			}) */
			this.staffId=res_info.data.data.staffId
			this.taskId=taskId
			this.assignId=assignId
			this.product.long=distance
			this.product.longUnit=longUnit
			
			this.custId=record.custId//就诊记录
			this.product.taskId=record.taskId
			this.product.number=record.taskId
			this.product.org=record.orgName
			this.product.time=record.reserveDate+' '+record.reserveTime1+":00"+'~'+record.reserveTime2+":00"
			this.product.addr=record.custAddress
			this.product.name=record.serviceLabel
			this.product.price="￥"+record.staffAmt
			this.product.serveName=record.custName
			this.$store.state.custName=record.custName
			this.product.contactName=record.linkman
			this.product.linkmanPhone=record.linkmanPhone
			
		},
		//toReceive
		async toReceive(){
			uni.showLoading({
				
			})
			let res_putOrder=await this.$apio.confirmAcceptTask(this.staffId,this.taskId,this.assignId)//确认接单
			uni.hideLoading()
			this.$store.state.homeRefresh++ //首页状态刷新
		},
		toRefuse(){
			uni.navigateTo({
				url:"refuse?taskId="+ this.taskId+'&assignId='+this.assignId
			})
		},
		previewImg1(index){
			let img=_self.srcArr[index].src
			uni.previewImage({
				urls:[img]
			});
		},
		previewImg2 : function(){
			uni.previewImage({
				urls:['http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//tar-nursing3.2.jpg']
			});
		},
		async toVisLog(){
			console.log("this.custId",this.custId)
		
			uni.navigateTo({
				url:'../VisLog/index?custId='+this.custId
			})
		},
		contactServerObj(){
			uni.makePhoneCall({//打给服务对象
				phoneNumber: this.product.linkmanPhone
			});
		},
		toWordInfo(){
			uni.navigateTo({
				url:'../../packageA/WordInfo/receiveInfo'
			})
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
	background-color: #6e8cfa;
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
		position: relative;
		width: 95%;
		padding: 0 2.5% 2.5vw 2.5%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.product{
			width: 100%;
			border-radius: 20upx;
			background-color: #fff;
			// margin: 0 0 15upx 0;
			image{
				width: 100%;
				border-radius: 20upx 20upx 0 0;
			}
			.name{
				width: 92%;
				padding: 8upx 4%;
				display: -webkit-box;
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
				padding: 10upx 4% 10upx 4%;
				
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
.uni-flex {
	display: flex;
	flex-direction: row;
}
.recieveBtn{
	position:absolute;
	bottom:70upx;
	right:40upx;
	width:32vw;
	padding:0 10upx;
}
.recieveBtn1{
	position:absolute;
	bottom:30upx;
	right:10upx;
	width:32vw;
	padding:0 10upx;
}
.showimgRow{
	width:300upx;
	height:auto;
}
</style>