<template>
	<view>
		<view class="logo">
			<image src="../../static/logo.png" mode="widthFix"></image>
			<text>优佳护</text>
			<text>优质护理 · 触手可及</text>
		</view>
		<button v-if="islogin == 0" class="wx-login" :style="loading ? 'background-color: #1B9A17;' : ''" @getphonenumber="getphonenumber" open-type="getPhoneNumber" :loading="loading">
			<text class="iconfont" v-if="!loading">&#xe638;</text>
			<text>微信账号一键登录</text>
		</button>
		<button v-if="islogin == 1" class="wx-login" :style="loading ? 'background-color: #1B9A17;' : ''" @tap="getWxUserInfo" :loading="loading">
			<text class="iconfont" v-if="!loading">&#xe638;</text>
			<text>微信账号一键登录</text>
		</button>
		<button class="phone-login" @click="phoneLogin">输入手机号登录/注册</button>
		<view class="agree-box">
			<checkbox value="agree" checked />
			<navigator url="./agreement">已阅读并同意 <text class="fc-normal">《优佳护用户服务协议》</text></navigator>
		</view>
		<view class="advisory">登录遇到问题？请<button class="btn-text fc-normal" open-type="contact">咨询客服</button></view>
	</view>
</template>

<script>
	import { toFormData, utilToast } from '@/common/utils/util'
	import { empowerAsVip, userRegister, bindWechat,getUserInfo } from '../../common/api/user'
	import { loginPhone } from '../../common/api/login'
	export default {
		data() {
			return {
				loading:false,
				wxData:{},
				islogin:0,
			}
		},
		onLoad({islogin}){
			this.islogin = islogin;
		},
		methods:{
			//已注册用户登录
			getWxUserInfo(params) {
				this.$store.dispatch('GetUserInfo').then(response => {
					if(response.isLock === 1){
						uni.showModal({
							title: '提示',
							content: '登录失败，您的账号已被冻结，有疑问请联系客服'
						})
					}
					else{
						if(response.isVip){
							uni.switchTab({
								url: "/pages/tab/home"
							})	
						}
						else{
							uni.showModal({
								title: '提示',
								content: '登录失败。您的账号未注册为会员，是否现在注册会员身份？',
								success: res => {
									if(res.confirm){
										empowerAsVip().then(({data}) => {
											if(data.msg === 'success'){
												utilToast('注册成功！')
												setTimeout(() => {
													// uni.switchTab({
													// 	url: "/pages/tab/home"
													// })
													uni.showModal({
														title: '提示',
														content: '您当前未验证身份，请前往验证',
														success: function (res) {
															if (res.confirm) {
																uni.reLaunch({
																	url:'/pages/user/identity?to=home'
																})
															} else if (res.cancel) {
																uni.switchTab({
																	url: "/pages/tab/home"
																})
															}
														}
													})
												},800)
											}
										})
									}
								}
							})
						}
					}
				})
			},
			//未注册用户手机登录
			getphonenumber(e){
				this.loading = true;
				let { encryptedData,iv } = e.detail;
				if(encryptedData){
					uni.login({
						success: res => {
							let params = {
								code: res.code,
								encryptedData: encryptedData,
								iv: iv
							}
							this.loginPhone(params)
						}
					})
				}else{
					this.loading = false;
				}
			},
			phoneLogin(){
				uni.navigateTo({
				    url: '/pages/login/login'
				});
			},
			loginPhone(params) {
				loginPhone(params).then(res => {
					if(res.code == 0){
						let loginCode = uni.getStorageSync('loginPhone');
						let phone = res.data.phoneNumber;
						//获取随机字符串
						function randomStr(len){
							let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
							let maxPros = chars.length
							let str = ''
							
							for(let i=0; i<len; i++){
								str += chars.charAt(Math.floor(Math.random()*maxPros))
							}
							
							return str
						}
						let password = randomStr(12);
						let userName = 'yjh' + randomStr(9);
						let userRegisterObj = {
							phone:phone,
							userName: userName,
							password: password,
							passwordConfirm: password
						}
						this.wxData = {
							phone:phone,
							userName: userName,
							password: password,
							passwordConfirm: password,
							clientId: "0",
							// code: this.mobile.code,
							// wechatCode: loginCode.code,
							encryptedData: loginCode.encryptedData,
							iv: loginCode.iv,
						}
						let params = ['LoginByPhone',toFormData(Object.assign({},userRegisterObj,{
							mobile: 'SMS@' + phone,
							grant_type: 'mobile'
						}))]
						userRegister(userRegisterObj).then(({data}) => {
							if(data.msg === 'success') {
								this.wechatBind(data.data.userName)
							}
						}).catch(({data}) => {
							if(data.code == 1){
								this.wechatBind(data.data.userName)
							}else{
								this.loading = false;
							}
						})
					}
				}).catch(({data}) => {
					this.loading = false;
				})
			},
			wechatBind(userName) {
				uni.login({
					success: res => {
						this.wxData.wechatCode = res.code;
						this.wxData.userName = userName;
						bindWechat(this.wxData).then(({data}) => {
							utilToast('绑定成功！')
							this.getEncryptedData(this.wxData);
							// setTimeout(() => {
							// 	uni.switchTab({
							// 		url: "../tab/home"
							// 	})
							// },800)
						}).catch(({data}) => {
							this.loading = false;
						})
					}
				})
			},
			//绑定成功后，登录获取token及用户信息
			getEncryptedData(data){
				let { encryptedData,iv } = data
				if(encryptedData){
					uni.login({
						success: res => {
							// this.$refs.popup.close();
							let params = {
								code: res.code,
								encryptedData: encryptedData,
								iv: iv
							}
							this.switchToHome(['LoginByWechat',params])
						}
					})
				}
			},
			switchToHome(params) {
				this.$store.dispatch(...params).then(response => {
					this.$store.dispatch('GetUserInfo').then(response => {
						if(response.isLock === 1){
							uni.showModal({
								title: '提示',
								content: '登录失败，您的账号已被冻结，有疑问请联系客服'
							})
						}
						else{
							if(response.isVip){
								uni.switchTab({
									url: "/pages/tab/home"
								})
							}
							else{
								uni.showModal({
									title: '提示',
									content: '登录失败。您的账号未注册为会员，是否现在注册会员身份？',
									success: res => {
										if(res.confirm){
											empowerAsVip().then(({data}) => {
												if(data.msg === 'success'){
													utilToast('注册成功！')
													setTimeout(() => {
														uni.showModal({
															title: '提示',
															content: '您当前未验证身份，请前往验证',
															success: function (res) {
																if (res.confirm) {
																	uni.reLaunch({
																		url:'/pages/user/identity?to=home'
																	})
																} else if (res.cancel) {
																	uni.switchTab({
																		url: "/pages/tab/home"
																	})
																}
															}
														})
													},800)
												}
											})
										}
									}
								})
							}
						}
					})
				}).catch(({data}) => {
					if(Boolean(data) == false){
						this.repeatNum++;
						if(this.repeatNum <= 1){
						  uni.getUserInfo({
							provider: 'weixin',
							success: (infoRes) => {
							  this.getEncryptedData({encryptedData:infoRes.encryptedData, iv:infoRes.iv});
							}
						  });
						}
					}else if(data.msg === '用户不存在'){
						uni.setStorage({
							key:'loginPhone',
							data:params[1],
						})
						uni.navigateTo({
							url: '/pages/login/index'
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		min-height: 100%;
		background-color: #FFF;
	}
	.logo{
		margin: 120rpx 0 150rpx 0;
		text-align:center;
		image{
			width: 110rpx;
			height: 124rpx;
		}
		text{
			display: block;
			color: #6E8CFA;
		}
		text:nth-child(2){
			display: block;
			font-size: 50rpx;
			font-weight: bold;
		}
		text:nth-child(3){
			font-size: 20rpx;
		}
	}
	.wx-login,.phone-login{
		width: 600rpx;
		height: 94rpx;
		border-radius:47rpx;
		font-size: 36rpx;
	}
	.wx-login{
		background-color: #1DAC1A;
		color: #fff;
		.iconfont{
			margin-right: 16rpx;
		}
	}
	.phone-login{
		margin:30rpx auto;
		background-color: #fff;
		box-sizing: border-box;
		color: #666;
		border:2rpx solid rgba(5,5,5,0.08);
	}
	.agree-box{
		checkbox{
			position: relative;
			top: -5rpx;
			margin-right: 5rpx;
			color:#09BB07;
			transform:scale(0.7)
		}
		color: #888888;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
	}
	.advisory{
		position: absolute;
		text-align: center;
		left: 0;
		right: 0;
		bottom: 50rpx;
		color: #888888;
		font-size: 26rpx;
		display: flex;
		justify-content: center;
		.btn-text{
			font-size: 26rpx;
			width: inherit;
			line-height: normal;
			margin:0;
			padding:0;
			background:inherit;
			box-sizing: inherit;
			font-size: inherit;
		}
		.btn-text:after{
			content: none;
		}
	}
</style>