<template>
	<view class="padding-20">
		<view class="tc msg-area">
			<view class="avatar-box">
				<image src="../../static/logo.png" mode="widthFix"></image>
			</view>
			<view>{{user}}</view>
			<view>验证码已发送到绑定手机号</view>
			<view>{{phone}}</view>
		</view>
		<view class="input-area flex-column align-center">
			<view class="border-01 flex-msg padding-20-0 input-box">
				<input type="text" v-model="form.code" placeholder="请输入验证码" placeholder-class="font-grey"/>
				<text class="code tc" @tap="getCode">{{codeTip}}</text>
			</view>
			<view class="padding-20-0 border-01 input-box flex-msg">
				<input type="password" v-model="form.newpassword1" placeholder="请输入新的密码" placeholder-class="font-grey" @blur="pswCheck" @focus="clearTip"/>
				<text class="font-red" v-if="errorPsw">密码必须为8-20位的数字字母组合</text>
			</view>
		</view>
		
		<view class="button-area">
			<button @tap="change" :disabled="canSubmit">确认</button>
		</view>
	</view>
</template>

<script>
import { getValidateCode,getChangePswCode,changePsw } from '../../common/api/user'
import { mapGetters } from 'vuex'

export default {
	data() {
		return {
			username: '',
			user: '',
			phone: '',
			validateCode: '',
			form: {
				code: '',
				newpassword1: ''
			},
			codeTip: '获取验证码',
			codeTimer: null,
			codeTime: 0,
			errorPsw: false
		}
	},
	onLoad(e) {
		this.username = e.username
		this.getCode()
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
				
				let username = this.username
				let checkMobile = /^1[345789]\d{9}$/
				if(checkMobile.test(username)){
					getChangePswCode(username).then(({data}) => {
						this.phone = data.data.phone
						this.user = data.data.userName
						this.validateCode = data.data.validateCode
					})
				}
				else{
					getValidateCode(username).then(({data}) => {
						this.phone = data.data.phone
						this.user = data.data.userName
						this.validateCode = data.data.validateCode
					})
				}
			}
		},
		clearTip() {
			this.errorPsw = false
		},
		pswCheck(e) {
			let check = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![^\w]+$).{8,20}$/
			if(check.test(e.detail.value)){
				this.errorPsw = false
			}
			else{
				this.errorPsw = true
			}
		},
		change() {
			changePsw(Object.assign({},this.form,{
				validateCode: this.validateCode
			})).then(({data}) => {
				if(data.data && data.msg === 'success'){
					uni.showToast({
						title: '修改成功',
						mask: true,
						icon: 'none'
					})
					setTimeout(() => {
						uni.reLaunch({
							url: '../login/index'
						})
					},800)
				}
			})
		}
	}
}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.msg-area{
		margin-top: 20rpx;
		line-height: 60rpx;
		.avatar-box{
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			overflow: hidden;
			border:1px solid #ccc;
			margin: 0 auto;
			image{
				width: 100%;
			}
		}
	}
	.input-area{
		margin-top: 20rpx;
		.code{
			padding-left: 10rpx;
			border-left: 4rpx solid #6e8cfa;
			font-size: 24rpx;
			width: 150rpx;
		}
		.input-box{
			width: 550rpx;
		}
	}
	.button-area{
		margin-top: 50rpx;
		button{
			width: 550rpx;
		}
	}
</style>
