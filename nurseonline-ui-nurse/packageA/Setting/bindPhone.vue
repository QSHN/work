<template>
	<view>
		<form @submit="formSubmit">
			<view class="wraperView">
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
					label: '更改绑定手机号',
					prop: 'height',
					type: 'text',
					placeholder: ''
				},
				// {
				// 	label: '取消绑定手机号',
				// 	prop: 'height',
				// 	type: 'text',
				// 	placeholder: ''
				// }
			],
		}
	},
	methods: {
		sexChange(e) {
			this.sexIdx = e.detail.value
			
		},
		dateChange(e) {
			this.date = e.detail.value
		},
		async settingTo(propIndex){
			if(propIndex==0){
				this.$store.state.resetPsw=1
				uni.navigateTo({
					url:'oldPhoneConfirm'
				})
			}
			if(propIndex==1){
				uni.showToast({
					title: '未发布',
					icon:'none'
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
	.to{flex-shrink:0;width:40upx;height:28upx}
</style>

