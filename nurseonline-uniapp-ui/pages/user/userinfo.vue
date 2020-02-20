<template>
	<view class="info-box">
		<form @submit="formSubmit">
			<view class="bg-white padding-20 flex-msg bottom-01">
				<view class="font-grey">头像</view>
				<view class="tr align-center">
					<view class="avatar-box" @tap="uploadAvatar">
						<!-- <image :src="userInfo.sysUser.avatar || '../../static/logo.png'" mode="widthFix" v-if="userInfo.sysUser"/> -->
						<image :src="userInfo.avatar || '../../static/logo.png'" mode="widthFix"></image>
					</view>
					<text class="iconfont">&#xe6f8;</text>
				</view>
			</view>
			<view class="bottom-01 bg-white padding-20 flex-msg">
				<view class="font-grey">登录账号</view>
				<text>{{userInfo.username || ''}}</text>
				<!-- <input class="tr" name="userName" v-model="vipInfo.userName" disabled/> -->
			</view>
			<view class="bottom-01 bg-white padding-20 flex-msg">
				<view class="font-grey">绑定手机</view>
				<text>{{userInfo.phone || ''}}</text>
			</view>
		</form>
	</view>
</template>

<script>
import { upLoadImg } from '@/common/uploadFile/upload'
import { updateAvatar } from '@/common/api/account/account'
import { getUserInfo } from '@/common/api/user.js'
export default {
	data() {
		return {
			userInfo: {}
		}
	},
	created() {
		getUserInfo().then(response => {
			let data = response.data
			if(data.msg === 'success'){
				// this.avatar = data.data.sysUser.avatar
				// this.phone = data.data.sysUser.phone
				this.userInfo = data.data.sysUser
			}
		})
	},
	methods: {
		uploadAvatar() {
			uni.chooseImage({
				success: img => {
					let files = img.tempFiles
					this.avatar = files[0].path
					upLoadImg('/nursing-upms/file/upload',files[0].path).then(res => {
						let data = JSON.parse(res.data)
						updateAvatar({
							username: this.vipInfo.userName,
							avatar: data.data.fileName
						})
					})
				}
			})
		}
	}
}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
	.info-box {
		padding: 40rpx;
		input{
			width: 400rpx;
		}
		.iconfont {
			vertical-align: middle;
		}
	}
	.avatar-box{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		overflow: hidden;
		border:1px solid #ccc;
		margin-right: 20rpx;
		image{
			width: 100%;
		}
	}
	.btn-area{
		margin: 40rpx 0;
		button{
			width: 90%;
			border-radius: 10rpx;
		}
	}
	.bottom-01 {
		border-bottom: 1px solid #c6c6c6;
	}
</style>
