<template>
	<view>
		<view class="bgc-6e8cfa text-alignR color-fff">
			<view @tap="toDetail" class="padding-20 positionA-r1">账单</view>
		</view>
		<view class="header" v-bind:class="{'status':isH5Plus}">
					<view class="m0a mt50">
						<view class="info">
							<view class="username color-fff">
								账户余额（元）
							</view>
						</view>
					</view>
			<view class="padding-20 color-fff">{{balance}}</view>
		</view>
			<view class="wraperView">
				<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(user,propIndex) in userInfo" :key="propIndex" @tap="settingTo(propIndex)">
					<view>{{user.label}}</view>
					<view>
						<text class="iconfont">&#xe6f8;</text>
					</view>
				</view>
			</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				//#ifdef APP-PLUS
				isH5Plus:true,
				//#endif
				//#ifndef APP-PLUS
				isH5Plus:false,
				//#endif
				userinfo:{},
				orderTypeLise:[
					[{name:'余额',icon:'l1.png',badge:0},
					{name:'积分',icon:'l2.png',badge:0},
					{name:'排班设置',icon:'l3.png',badge:0}],
					
					[{name:'考核',icon:'l4.png',badge:0},
					{name:'帮助说明',icon:'l5.png',badge:0},
					{name:'客服',icon:'l6.png',badge:0}],
				],
				userInfo: [
					{
						label: '充值',
						prop: 'height',
						type: 'text',
						placeholder: ''
					},
					{
						label: '提现',
						prop: 'weight',
						type: 'text',
						placeholder: ''
					},
				],
				balance:'',
			};
		},
		onLoad() {
			//加载
			this.init();
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.init()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			async init() {
				uni.showLoading({
					
				})
				let res=await this.$apip.getBalance()
				this.balance=res.data.data.toFixed(2)
				uni.hideLoading()
				//用户信息
				this.userinfo={
					face:'../../static/HM-PersonalCenter/avatar.jpg',
					username:"陈小云",
					integral:"湛江市某某某医院/内科"
				}		
			},
			//用户点击订单类型
			settingTo(propIndex){
				console.log(propIndex)
				if(propIndex==0){
					uni.showToast({
						title:'未发布',
						icon:"none"
					})
				}
				if(propIndex==1){
					if(this.balance==0){
						uni.showToast({
							title:'当前账户余额为0，无法提现',
							icon:'none',
							mask:false
						})
						return false
					}
					uni.navigateTo({
						url: 'toCash'
					})
				}
			},
			
			toDetail(){//明细
				uni.navigateTo({
					url: 'detail',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style lang="scss">
page{background-color:#fff}
.header{
	&.status{padding-top:var(--status-bar-height);}
	background-color:#6e8cfa;width:92%;height:35vw;padding:0 4%;display:flex;flex-wrap:wrap;flex-direction:column;justify-content:flex-start;align-items:center;align-content:center;
	.edit{
		flex-shrink:0;width:4vw;height:4vw;
		image{width:100%;height:100%}
	}
}
.setting{
	flex-shrink:0;width:6vw;height:6vw;
	image{width:100%;height:100%}
}
.hover{background-color:#eee}
.orders{
	background-color:#6e8cfa;width:92%;height:39vw;padding:0 4%;display:flex;align-items:flex-start;border-radius:0 0 100% 100%;margin-top: -155upx;
	.box{
		width:98%;padding:0 1%;height:22vw;background-color:#fefefe;margin-bottom:40upx;display:flex;align-items:center;justify-content:center;margin-top:200upx;
		.label{
			display:flex;align-items:center;justify-content:center;flex-flow:wrap;width:100%;height:16vw;color:#666666;font-size:26upx;
			.icon{
				position:relative;width:7vw;height:7vw;margin:0 1vw;
				.badge{position:absolute;width:4vw;height:4vw;background-color:#ec6d2c;top:-1vw;right:-1vw;border-radius:100%;font-size:20upx;color:#fff;display:flex;align-items:center;justify-content:center;z-index: 10;}
				image{width:6vw;height:6vw;z-index: 9;}
			}
		}
	}
}
.orders1{
	width:92%;height:11vw;padding:0 4%;margin-bottom:calc(11vw + 40upx);display:flex;align-items:flex-start;border-radius:0 0 100% 100%;margin-top: -1upx;
	.box{
		width:98%;padding:0 1%;height:22vw;background-color:#fefefe;margin-bottom:40upx;display:flex;align-items:center;justify-content:center;
		.label{
			display:flex;align-items:center;justify-content:center;flex-flow:wrap;width:100%;height:16vw;color:#666666;font-size:26upx;
			.icon{
				position:relative;width:7vw;height:7vw;margin:0 1vw;
				.badge{position:absolute;width:4vw;height:4vw;background-color:#ec6d2c;top:-1vw;right:-1vw;border-radius:100%;font-size:20upx;color:#fff;display:flex;align-items:center;justify-content:center;z-index: 10;}
				image{width:10vw;height:10vw;z-index: 9;}
			}
		}
	}
}
.list{
	width:100%;border-bottom:solid 26upx #f1f1f1;
	.li{
		width:92%;height:100upx;padding:0 4%;border-bottom:solid 1upx #e7e7e7;display:flex;align-items:center;
	&.noborder{border-bottom:0}
		.icon{
			flex-shrink:0;width:50upx;height:50upx;
			image{width:50upx;height:50upx}
		}
		.text{padding-left:20upx;width:100%;color:#666}
		.to{flex-shrink:0;width:40upx;height:40upx}
	}
}
.padding{
		padding: 20upx;
	}
.bottom-20{
	margin-bottom: 20upx;
}
.bottom-01{
	margin-bottom: 2upx;
}
.avatar-box{
	width: 80upx;
	height: 80upx;
	border-radius: 50%;
	overflow: hidden;
	border:1px solid #ccc;
	padding:20rpx;
	image{
		width: 100%;
	}
}
.btn-area{
	margin-top: 40upx;
	button{
		width: 90%;
		background-color: #00b28e;
		border-color: #75d4c0;
		color: #fff;
		border-radius: 10upx;
	}
}
.to{flex-shrink:0;width:40upx;height:28upx}
</style>
