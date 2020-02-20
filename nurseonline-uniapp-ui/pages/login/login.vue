<template>
	<view>
		<view class="login-box">
			<text class="iconyhj">&#xe658;</text>
			<input type="number" v-model="mobile.mobile" placeholder="输入手机号"/>
		</view>
		<view class="login-box">
			<text class="iconyhj">&#xe65a;</text>
			<input type="number" v-model="mobile.code" placeholder="输入验证码"/>
			<text class="code" @tap="getCode">{{codeTip}}</text>
		</view>
		<button class="btn" :loading="loading" @tap="loginTo" :disabled="checkDisabled">登录</button>
		<view class="hint">
			<text>未注册的手机号将自动注册优佳护账号，且表示已阅读并同意 </text>
			<text class="fc-normal" @tap="jump">《优佳护用户服务协议》</text>
		</view>
	</view>
</template>

<script>
import { toFormData,utilToast } from '@/common/utils/util'
import { getLoginCode,userAutoRegister,userRegister,empowerAsVip } from '../../common/api/user.js'
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			loading:false,
			codeTip: '获取验证码',
			codeTimer: null,
			codeTime: 0,
			mobile: {
				mobile: '',
				code: ''
			},
			autoRegLogin: false,
			autoRegData: {},
		}
	},
	computed: {
		...mapGetters(['codeDate']),
		checkDisabled() {
			return this.mobile.mobile=='' || this.mobile.code==''
		}
	},
	onShow() {
		this.calculateCodeTime()
	},
	methods:{
		jump(){
			uni.navigateTo({
			    url: './agreement'
			});
		},
		calculateCodeTime() {
			var codeDate = this.codeDate
			if (codeDate) {
				var now = new Date()
				var time = Math.floor((now - codeDate) / 1000)
				time = 60 - time
				if (time > 0) {
					this.codeTimer && clearInterval(this.codeTimer)
					this.codeCountDown(time)
				}
			}
		},
		codeCountDown(time) {
			this.codeTime = time || 60 //验证码倒计时
			this.codeTip = this.codeTime + 's'
			this.codeTimer = setInterval(() => {
				this.codeTime--
				if(this.codeTime > 0){
					this.codeTip = this.codeTime + 's'
				}
				else{
					this.codeTip = '获取验证码'
					clearInterval(this.codeTimer)
					this.codeTimer = null
				}
			},1000)
		},
		getCode() {
			if(this.mobile.mobile){
				let checkMobile = /^1[345789]\d{9}$/
				if(checkMobile.test(this.mobile.mobile)){
					if(this.codeTip === '获取验证码'){
						this.$store.commit('SET_CODEDATE', new Date())
						this.codeCountDown()
						
						getLoginCode(this.mobile.mobile).then(response => {
							let data = response.data
							if(data.data){
								this.autoRegLogin = false
								uni.showToast({
									title: '验证码已发送，请注意查收！',
									icon: 'none',
									mask: true
								})
							}
							else{
								this.autoRegLogin = true
								userAutoRegister({
									phone: this.mobile.mobile,
								}).then(obj => {
									this.autoRegData = Object.assign({},this.autoRegData,obj)
									uni.showToast({
										title: '验证码已发送，请注意查收！',
										icon: 'none',
										mask: true
									})
								})
							}
						})
					}
				}
				else{
					uni.showToast({
						title: '请输入正确的手机号码！',
						icon: 'none',
						mask: true
					})
				}
			}
			else{
				uni.showToast({
					title: '手机号码不能为空！',
					icon: 'none',
					mask: true
				})
			}
		},
		loginTo() {
			this.loading = true;
			let params = ['LoginByPhone',toFormData(Object.assign({},this.mobile,{
				mobile: 'SMS@' + this.mobile.mobile,
				grant_type: 'mobile'
			}))]
			if(this.autoRegLogin) {
				userRegister(Object.assign({},this.autoRegData,{code: this.mobile.code})).then(({data}) => {
					if(data.msg === 'success') {
						this.switchToHome(params)
					}else{
						this.loading = false;
					}
				}).catch(() => {
					this.loading = false;
				})
			}
			else {
				this.switchToHome(params)
			}
		},
		switchToHome(params) {
			this.$store.dispatch(...params).then(response => {
				this.$store.dispatch('GetUserInfo').then(response => {
					this.loading = false;
					if(response.isLock === 1){
						uni.showModal({
							title: '提示',
							content: '登录失败，您的账号已被冻结，有疑问请联系客服'
						})
					}
					else{
						if(response.isVip){
							if (this.autoRegLogin) {
								uni.showModal({
									title: '提示',
									content: '您当前未验证身份，请前往验证',
									cancelText:'去往验证',
									confirmText:'去首页',
									success: function (res) {
										if (res.confirm) {
											uni.switchTab({
												url: "../tab/home"
											})
										} else if (res.cancel) {
											uni.reLaunch({
												url:'../user/identity?to=home'
											})
										}
									}
								})
							} else {
								uni.switchTab({
									url: "../tab/home"
								})	
							}
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
													// 	url: "../tab/home"
													// })
													uni.showModal({
														title: '提示',
														content: '您当前未验证身份，请前往验证',
														cancelText:'去往验证',
														confirmText:'去首页',
														success: function (res) {
															if (res.confirm) {
																uni.switchTab({
																	url: "../tab/home"
																})
															} else if (res.cancel) {
																uni.reLaunch({
																	url:'../user/identity?to=home'
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
				}).catch(() => {
					this.loading = false;
				})
			}).catch((data) => {
				this.loading = false;
				if(data.msg === '用户不存在'){
					uni.showModal({
						title: '提示',
						confirmText: '前往绑定',
						content: '当前微信暂未绑定任何账户，是否前往绑定？',
						success: res => {
							if(res.confirm){
								uni.navigateTo({
									url: './wxLogin'
								})
							}
						}
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
		padding:30rpx 40rpx;
		box-sizing: border-box;
	}
	.login-box{
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #DDDDDD;
		padding:30rpx 0;
		.iconyhj{
			font-size: 32rpx;
			color: #777777;
			margin-right: 50rpx;
		}
		input{
			flex:1;
			font-size: 32rpx;
		}
		.code{
			font-size: 32rpx;
			color: #6D8CFA;
		}
	}
	.btn{
		margin:60rpx auto 30rpx auto;
	}
	.hint{
		padding:0 35rpx;
		text-align: center;
		font-size: 26rpx;
	}
</style>