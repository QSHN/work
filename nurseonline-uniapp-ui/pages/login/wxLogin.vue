<template>
	<view class="content flex-column align-center">
		<view class="bottom-20 tip-area">
			<text class="font-blue">请输入已注册验证的手机号码</text>
		</view>
		<view class="login-area">
			<view class="login-box">
				<input type="text" v-model="mobile.mobile" placeholder="请输入手机号" placeholder-class="holder"/>
			</view>
			<view class="login-box flex-msg">
				<input type="text" v-model="mobile.code" placeholder="请输入验证码" placeholder-class="holder"/>
				<text class="code tc" @tap="getCode">{{codeTip}}</text>
			</view>
		</view>
		
		<view class="btn-area">
			<button open-type="getUserInfo" @getuserinfo="loginTo" :disabled="checkDisabled" class="bottom-20">绑定微信</button>
			<view class="font-grey tc tip" v-if="tabIndex === 0">未注册手机验证后自动注册</view>
		</view>
	</view>
</template>

<script>
import { toFormData,utilToast } from '@/common/utils/util'
import { getLoginCode,userAutoRegister,userRegister,empowerAsVip,getUserInfo,bindWechat } from '../../common/api/user'
import { mapState,mapMutations, mapGetters } from 'vuex'
export default {
	data() {
		return {
			tabIndex: 0,
			codeTip: '获取验证码',
			codeTimer: null,
			codeTime: 0,
			loginList: ['快捷登录','密码登录'],
			mobile: {
				mobile: '',
				code: ''
			},
			user: {
				username: '',
				password: ''
			},
			close: {
				mobile: false,
				username: false,
				password: false
			},
			autoRegLogin: false,
			autoRegData: {},
			wxData: {}
		}
	},
	onShow() {
		this.calculateCodeTime()
	},
	computed: {
		...mapGetters(['codeDate']),
		checkDisabled() {
			return this.mobile.mobile=='' || this.mobile.code==''
		}
	},
	methods:{
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
						
						getLoginCode(this.mobile.mobile + '?wechatBindAble=1').then(response => {
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
									wechatBindAble: 1
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
		async loginTo(e) {
			let { encryptedData,iv } = e.detail
			let [ loginError,loginResult ] = await uni.login()
			
			if(loginResult.errMsg === 'login:ok'){
				let params = ['LoginByPhone',toFormData(Object.assign({},this.mobile,{
					mobile: 'SMS@' + this.mobile.mobile,
					grant_type: 'mobile'
				}))]
				
				this.wxData = {
					clientId: "0",
					code: this.mobile.code,
					wechatCode: loginResult.code,
					encryptedData: encryptedData,
					iv: iv
				}
				
				if(this.autoRegLogin) {
					userRegister(Object.assign({},this.autoRegData,{code: this.mobile.code})).then(({data}) => {
						if(data.msg === 'success') {
							this.switchToHome(params)
						}
					})
				}
				else{
					this.switchToHome(params)
				}
			}
			else{
				utilToast('获取微信授权失败')
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
							getUserInfo().then(({data}) => {
								if(data.msg === 'success'){
									if(data.data.sysUser.wxOpenid){
										utilToast('当前会员账号已绑定过其他微信号')
									}
									else{
										this.wechatBind()
									}
								}
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
												this.wechatBind()
											}
										})
									}
								}
							})
						}
					}
				})
			})
		},
		inputFocus(param) {
			this.close[param] = true
		},
		inpuBlur(param) {
			this.close[param] = this.user[param] !== ''
		},
		inputClear(param) {
			this.user[param] = ''
		},
		wechatBind() {
			bindWechat(this.wxData).then(({data}) => {
				utilToast('绑定成功！')
				setTimeout(() => {
					uni.switchTab({
						url: "../tab/home"
					})
				},800)
			})
		}
	}
}
</script>

<style lang="scss">
	page {
		min-height: 100%;
		background-color: #FFF;
	}
	.content {
		position: relative;
		.tip-area{
			width: 500rpx;
			margin-top: 40px;
			font-size: 15px;
		}
		.login-area {
			width: 500rpx;
			height: 150rpx;
			.login-box {
				padding-bottom: 5rpx;
				border-bottom: 1px solid #c0c0c0;
				z-index: 1;
				&:first-child {
					margin-bottom: 30rpx;
				}
				.code{
					padding-left: 10rpx;
					border-left: 4rpx solid #6e8cfa;
					font-size: 24rpx;
					width: 150rpx;
				}
			}
		}
		.register-box {
			width: 500rpx;
			height: 40rpx;
			margin-top: 10rpx;
		}
		.btn-area {
			width: 500rpx;
			height: 140rpx;
			margin-top: 20px;
			button {
				width: 100%;
			}
			button[disabled]{
				background-color: #949494;
				color: #fff;
			}
			.tip{
				font-size: 24rpx;
			}
		}
	}
	
	
</style>