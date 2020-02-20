<template>
	<view>
		<form @submit="formSubmit">
		  <view class="wraperView">
			<view class="bottom-20 bg-white padding flex-box horizontal-between vertical-center border-bottom" @tap="toBasicInfo">
				<view>基本信息</view>
					<view >
					<text class="iconfont">&#xe6f8;</text></image>
					</view>
			</view>
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(user,propIndex) in userInfo" :key="propIndex" @tap="settingTo(propIndex)">
				<view>{{user.label}}</view>
				<view>
					<text class="iconfont">&#xe6f8;</text>
				</view>
			</view>
		 </view>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			sexIdx: "0",
			date: '1949-10-01',
			userInfo: [
				{
					label: '身份认证',
					prop: 'height',
					type: 'text',
					placeholder: ''
				},
				{
					label: '擅长服务',
					prop: 'weight',
					type: 'text',
					placeholder: ''
				},
				{
					label: '专科方向',
					prop: 'username',
					type: 'text',
					placeholder: ''
				},
			],
		}
	},
	onLoad() {
		this.init()
	},
	methods: {
		async init(){
			
		},
		toBasicInfo(){
			uni.navigateTo({
				url: 'basicInfo',
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
		settingTo(propIndex){
			console.log(propIndex)
			if(propIndex==0){
				uni.navigateTo({
					url: 'trueme',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
			if(propIndex==1){
				uni.navigateTo({
					url: 'goodat',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
			if(propIndex==2){
				uni.navigateTo({
					url: 'professDirection',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
}
</script>

<style lang="scss" scoped>
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
</style>
