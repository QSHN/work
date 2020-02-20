<template>
	<view class="content">
		<view class="bg-white padding-20 border-01 register-box">
			<text>请输入{{phone | phoneValid}}收到的短信验证码</text>
		</view>
		<view class="bg-white padding-20 border-01 register-box flex-msg">
			<input type="text"
				   name="code" 
				   v-model="code"
				   placeholder="请输入短信验证码"/>
			<text class="code tc" @tap="getCode">{{codeTip}}</text>
		</view>
		<view class="btn-area tc">
			<button open-type="getUserInfo" @getuserinfo="formSubmit" :disabled="canSubmit">{{ wxBind ? '解除绑定' : '确认绑定' }}</button>
		</view>
	</view>
</template>

<script>
import { utilToast,successBack,toFormData } from '@/common/utils/util'
import { getUserInfo,getBindWechatCode,bindWechat,getUnbindWechatCode,unBindWechat } from '../../common/api/user'
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
			codeTip: '获取验证码',
			codeTimer: null,
			codeTime: 0,
			phone: '',
			code: '',
			wxBind: false,
			wxData: '',
			from: ''
		}
	},
	computed: {
		...mapGetters(['codeDate']),
		canSubmit() {
			return this.code === ''
		}
	},
	watch: {
		wxBind(value) {
			uni.setNavigationBarTitle({
				title: value ? '微信解绑' : '微信绑定'
			})
		}
	},
	filters: {
		phoneValid: function(value) {
			let re = /(\d{3})\d{4}(\d{4})/
			let phone = value.replace(re,'$1****$2')
			return phone
		}
	},
	onLoad(e) {
		if(e.sysUser){
			// let sysUser = JSON.parse(e.sysUser)
			let sysUser = JSON.parse(decodeURIComponent(e.sysUser))
			this.from = e.from
			this.phone = sysUser.phone
			this.wxBind = sysUser.wxOpenid ? true : false
		}
		else{
			getUserInfo().then(({data}) => {
				if(data.msg === 'success'){
					this.phone = data.data.sysUser.phone
					this.wxBind = data.data.sysUser.wxOpenid ? true : false
				}
			})
		}
	},
	onShow() {
		this.calculateCodeTime()
	},
	methods: {
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
		async getCode() {
			let phone = this.phone
			if(phone){
				let checkMobile = /^1[345789]\d{9}$/
				if(checkMobile.test(phone)){
					if(this.codeTip === '获取验证码'){
						this.$store.commit('SET_CODEDATE', new Date())
						this.codeCountDown()
						
						let {data} = this.wxBind ? await getUnbindWechatCode() : await getBindWechatCode()
						if(data.msg === 'success'){
							utilToast('验证码已发送，请注意查收！')
						}
					}
				}
				else{
					utilToast('请输入正确的手机号码')
				}
			}
			else{
				utilToast('手机号码不能为空')
			}
		},
		async formSubmit(e) {
			let { encryptedData,iv } = e.detail
			let [ loginError,loginResult ] = await uni.login()
			if(loginResult.errMsg === 'login:ok'){
				let params = {
					clientId: "0",
					code: this.code,
					wechatCode: loginResult.code,
					encryptedData: encryptedData,
					iv: iv
				}
				
				let {data} = this.wxBind ? await unBindWechat(params) : await bindWechat(params)
				
				if(data.msg === 'success'){
					utilToast(this.wxBind ? '解绑成功' : '绑定成功')
					if(this.from === 'account'){
						setTimeout(() => {
							uni.navigateBack({
								delta: -1
							})
						},800)
					}
					else{
						setTimeout(() => {
							uni.switchTab({
								url: "../tab/home"
							})
						},800)
					}
				}
			}
		}
	},
}
</script>

<style lang="scss" scoped>
	page{	
		min-height: 100%;
	}
	.content{
		height: 100%;
		padding: 20rpx;
		background-color: #fff;
		.register-box {
			input{
				flex: auto;
			}
			.code {
				padding-left: 10rpx;
				border-left: 4rpx solid #6e8cfa;
				font-size: 24rpx;
				width: 150rpx;
			}
		}
		.btn-area {
			margin-top: 50rpx;
			button {
				width: 500rpx;
			}
			button[disabled]{
				background-color: #949494;
				color: #fff;
			}
		}
	}
	.border-01 {
		border-bottom: 1px solid #eeeff3;
	}
</style>