<template>
	<view>
		<view class="flex-column flex-center userInfo">
			<!-- <navigator class="avatar-box" url="../user/userinfo"> -->
			<navigator class="avatar-box" url="../user/account">
				<image :src="avatar || '../../static/logo.png'" mode="widthFix" />
			</navigator>
			<text class="user-name">{{vipName || ''}}</text>
			<!-- <navigator class="message-icon icon-02" url="../message/index"></navigator> -->
		</view>
		<view class="keep-out"></view>

		<view class="nav-area">
			<view @tap="goIdentity" class="bg-white nav-list flex-msg bottom-20">
				<text>实名认证<text class="id-card" :class="{'has-id': hasIdentity}">{{hasIdentity ? '已认证' : '未认证'}}</text></text>
				<text class="iconfont">&#xe6f8;</text>
			</view>
			<navigator :url="item.url" class="bg-white nav-list flex-msg bottom-20" v-for="(item,index) in navList" :key="index">
				<text>{{item.text}}</text>
				<text class="iconfont">&#xe6f8;</text>
			</navigator>
			<view @tap="noDetail" class="bg-white nav-list flex-msg bottom-20">
				<text>长护险</text>
				<text class="iconfont">&#xe6f8;</text>
			</view>
			<view class="button-area">
				<button @tap="logOut" v-if="access_token">退出当前用户</button>
				<!-- <button @tap="onLogin" v-else>登录</button> -->
			</view>
		</view>
		<uni-login ref="uniLogin" />
	</view>
</template>

<script>
	// import { mapGetters } from 'vuex'
	import { getVipInfo, getUserInfo } from '@/common/api/user'
	import { getVipCert } from '@/common/api/account/account'
	import uniLogin from "@/components/uni-login/uni-login"

	export default {
		data() {
			return {
				access_token: '',
				avatar: '',
				vipName: '',
				hasIdentity: false,
				navList: [
					// {
					// 	url: '../user/identity',
					// 	text: '实名认证'
					// },
					{
						url: '../address/list',
						text: '我的地址'
					},
					{
						url: '../invoice/list',
						text: '开具发票'
					},
					{
						url: '../invoice/history',
						text: '开票历史'
					},
					{
						url: '/subPagesA/custs/list',
						text: '服务对象'
					},
					// {
					// 	url: '../insurance/list',
					// 	text: '我的长护险'
					// },
					// 				{
					// 					id: 5,
					// 					url: '#',
					// 					text: '绑定管理'
					// 				}
				]
			}
		},
		// computed: {
		// 	...mapGetters(['userInfo','vipInfo'])
		// },
		onShow(){
			this.access_token = uni.getStorageSync('access_token')
			if (!this.access_token == "") {
				this.$refs.uniLogin.onPopup(false)
				getUserInfo().then(response => {
					let data = response.data
					if (data.msg === 'success') {
						this.avatar = data.data.sysUser.avatar
					}
			
				})
			
				getVipInfo().then(response => {
					let data = response.data
					if (data.msg === 'success') {
						this.vipName = data.data.vipName
					}
			
				})
			
				getVipCert().then(response => {
					let data = response.data
					if (data.msg === 'success') {
						this.hasIdentity = data.data
					}
				})
			}
		},
		mounted() {
			if (this.access_token == "") {
				this.$refs.uniLogin.onPopup(true)
			}
		},
		components: {
			uniLogin,
		},
		methods: {
			toService() {
				uni.showModal({
					title: "提示",
					content: "点击确认拨打电话给人工客服",
					success: res => {
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber: "17665459508",
								success: res => {
									console.log(res)
								}
							})
						}
					}
				})
			},
			goIdentity() {
				let url = "../user/identity"
				if (this.hasIdentity) {
					url = '../user/identityDetail'
				}
				uni.navigateTo({
					url: url
				})
			},
			noDetail() {
				uni.showToast({
					title: '未发布',
					icon: 'none',
					mask: true
				})
			},
			logOut() {
				uni.showModal({
					title: '提示',
					content: '是否退出当前账户？',
					success: res => {
						if (res.confirm) {
							uni.removeStorageSync('access_token')
							uni.removeStorageSync('vip_info')
							uni.removeStorageSync('user_info')

							uni.reLaunch({
								url: '../tab/home'
							})
						}
					}
				})
			},
			onLogin() {
				this.$refs.uniLogin.onPopup(true)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.padding {
		padding: 20rpx;
	}

	.id-card {
		display: inline-block;
		margin-left: 10rpx;
		color: #fff;
		width: 90rpx;
		height: 35rpx;
		line-height: 35rpx;
		text-align: center;
		background-color: #9FA1A0;
		border-radius: 6rpx;
		font-size: 22rpx;

		&.has-id {
			background-color: #6E8CFA;
		}
	}

	.userInfo {
		background-color: #6e8cfa;
		position: relative;

		.avatar-box {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			overflow: hidden;
			border: 1px solid #ccc;
			background-color: #fff;

			image {
				width: 100%;
			}
		}

		.user-name {
			color: #fff;
			font-size: 32rpx;
			margin-top: 10rpx;
		}
	}

	.keep-out {
		background-color: #6e8cfa;
		width: 120%;
		height: 170rpx;
		border-radius: 0 0 100% 100%;
		margin-top: -130rpx;
		padding: 0 0 4% 0;
		margin-left: -10%;
	}

	.message-icon {
		width: 70rpx;
		height: 50rpx;
		background-size: 750rpx;
		background-position: 1.5px 76.6%;
		position: absolute;
		top: 20rpx;
		right: 20px;
	}

	.nav-area {
		padding: 40rpx 80rpx;

		.nav-list {
			padding: 20rpx 0;
			font-size: 30rpx;
			border-bottom: 1px solid #c6c6c6;

			.iconfont {
				font-size: 36rpx;
			}
		}

		button {
			margin-top: 80rpx;
			width: 90%;
			background-color: #fff;
			color: #6E8CFA;
			border: 1px solid #6E8CFA;
		}
	}

</style>
