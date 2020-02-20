<template>
	<view class="content">
		<form @submit="formSubmit">
			<view class="bg-white padding-20 border-01 register-box">
				<text>旧手机号: {{phone.oldphone | phoneValid}}</text>
			</view>
			<view class="bg-white padding-20 border-01 register-box flex-msg">
				<view class="align-center">
					<text>新手机号：</text>
					<input type="text"
						   name="code" 
						   v-model="phone.newphone"
						   placeholder="请输入新手机号"/>
				</view>
				<text class="code tc" @tap="getCode">{{codeTip}}</text>
			</view>
			<view class="bg-white padding-20 border-01 register-box align-center">
				<text>旧手机验证码：</text>
				<input type="text"
					   name="code" 
					   v-model="code.code"
					   placeholder="请输入旧手机号验证码"/>
			</view>
			<view class="bg-white padding-20 border-01 register-box align-center">
				<text>新手机验证码：</text>
				<input type="text"
					   name="code" 
					   v-model="code.codeForNew"
					   placeholder="请输入新手机号验证码"/>
			</view>
			<view class="btn-area tc">
				<button formType="submit" :disabled="canSubmit">确认</button>
			</view>
		</form>
	</view>
</template>

<script>
import { utilToast,successBack,toFormData } from '@/common/utils/util'
import { getUserInfo,getChangePhoneCode,changePhoneConfirm } from '../../common/api/user'
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
			codeTip: '获取验证码',
			codeTimer: null,
			codeTime: 0,
			phone: {
				newphone: '',
				oldphone: ''
			},
			code: {
				code: '',
				codeForNew: '',
				token: ''
			}
		}
	},
	onShow() {
		this.calculateCodeTime()
	},
	computed: {
		...mapGetters(['codeDate']),
		canSubmit() {
			// return this.form.code === '' || this.form.newpassword1 === '' || this.errorPsw
			return false
		}
	},
	filters: {
		phoneValid: function(value) {
			let re = /(\d{3})\d{4}(\d{4})/
			let phone = value.replace(re,'$1****$2')
			return phone
		}
	},
	created() {
		getUserInfo().then(({data}) => {
			if(data.msg === 'success'){
				this.phone.oldphone = data.data.sysUser.phone
			}
		})
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
		getCode() {
			let phone = this.phone.newphone
			if(phone){
				let checkMobile = /^1[345789]\d{9}$/
				if(checkMobile.test(phone)){
					if(this.codeTip === '获取验证码'){
						this.$store.commit('SET_CODEDATE', new Date())
						this.codeCountDown()
						
						getChangePhoneCode(this.phone).then(({data}) => {
							if(data.msg === 'success'){
								this.code.token = data.data
								utilToast('发送成功！')
							}
						})
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
		formSubmit() {
			changePhoneConfirm(this.code).then(res => {
				successBack(res,'修改成功')
			})
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
		.agree-box {
			margin-top: 200rpx;
			checkbox {
				margin-right: 20rpx;
				margin-top: -15rpx;
			}
		}
	}
	.border-01 {
		border-bottom: 1px solid #eeeff3;
	}
</style>