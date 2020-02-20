<template>
	<view class="padding-20">
		<view class="padding-20 border-01 align-center">
			<text class="label">账号</text>
			<input type="text" v-model="username" placeholder="请输入用户名/手机号码" placeholder-class="font-grey"/>
		</view>
		<view class="button-area">
			<button @tap="toSendCode">下一步</button>
		</view>
	</view>
</template>

<script>
import { getChangePswCode,changePsw,checkUserName } from '../../common/api/user'
export default {
	data() {
		return {
			username: ''
		}
	},
	methods: {
		toSendCode() {
			let username = this.username
			let checkMobile = /^1[345789]\d{9}$/
			if(checkMobile.test(username)){
				uni.navigateTo({
					url: './sendcode?username=' + this.username
				})
			}
			else{
				checkUserName(this.username).then(({data}) => {
					if(data.msg === 'success'){
						if(data.data){
							uni.navigateTo({
								url: './sendcode?username=' + this.username
							})
						}
						else{
							uni.showToast({
								title: '用户不存在',
								icon: 'none',
								mask: true
							})
						}
					}
				})
			}
			
		}
	}
}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.button-area{
		margin-top: 40rpx;
	}
	.label{
		margin-right: 20rpx;
	}
</style>
