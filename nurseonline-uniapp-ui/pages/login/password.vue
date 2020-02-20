<template>
	<view class="content">
		<form @submit="formSubmit">
			<view class="bg-white padding-20 border-01 register-box">
				<text>{{phone}}</text>
			</view>
			<view class="bg-white padding-20 border-01 register-box flex-msg">
				<input type="text"
					   name="code" 
					   v-model="form.code"
					   placeholder="请输入验证码"/>
				<text class="code tc" @tap="getCode">{{codeTip}}</text>
			</view>
			<view class="bg-white padding-20 border-01 register-box flex-msg">
				<input type="password"
					   name="password" 
					   v-model="form.newpassword1"
					   placeholder="设置新密码（6-16位字符/字母+数字）"
					   @focus="clearTip"
					   @blur="checkPsw"/>
				<text class="font-red" v-if="errorPsw">密码必须为8-20位的数字字母组合</text>
			</view>
			<view class="btn-area tc">
				<button formType="submit" :disabled="canSubmit">确认</button>
			</view>
		</form>
	</view>
</template>

<script>
import { successBack } from '@/common/utils/util'
import { getUserInfo,getChangePswCode,changePsw } from '../../common/api/user'
import { mapGetters } from 'vuex'

export default {
	data() {
		return {
			phone: '',
			codeTip: '获取验证码',
			codeTimer: null,
			codeTime: 0,
			form: {
				newpassword1: '',
				phone: '',
				code: ''
			},
			errorPsw: false,
			validateCode: ''
		}
	},
	onShow() {
		this.calculateCodeTime()
	},
	computed: {
		...mapGetters(['codeDate']),
		canSubmit() {
			return this.form.code === '' || this.form.newpassword1 === '' || this.errorPsw
		}
	},
	created() {
		getUserInfo().then(({data}) => {
			if(data.msg === 'success'){
				let phone = data.data.sysUser.phone
				let re = /(\d{3})\d{4}(\d{4})/
				
				this.form.phone = phone
				this.phone = phone.replace(re,'$1****$2')
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
			if(this.codeTip === '获取验证码'){
				this.$store.commit('SET_CODEDATE', new Date())
				this.codeCountDown()
				
				getChangePswCode(this.form.phone).then(({data}) => {
					this.validateCode = data.data.validateCode
				})
			}
		},
		clearTip() {
			this.errorPsw = false
		},
		checkPsw() {
			let check = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![^\w]+$).{8,20}$/
			if(check.test(this.form.newpassword1)){
				this.errorPsw = false
			}
			else{
				this.errorPsw = true
			}
		},
		formSubmit() {
			changePsw(Object.assign({},this.form,{
				validateCode: this.validateCode
			})).then(response => {
				successBack(response,'修改成功')
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