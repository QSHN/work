<template>
	<view class="content">
		<form @submit="formSubmit">
			<template v-for="(item,index) in register">
				<view class="bg-white padding-20 border-01 register-box flex-msg" :key="index">					
					<input type="password"
						   :name="item.name" 
						   :value="form[item.name]"
						   :placeholder="item.placeholder"
						   @focus="clearTip(index)"
						   @blur="checkTip(index,item.name)"
						   @input="setFormData(item.name,$event)"
						   v-if="item.type === 'password'"/>
					<input type="text" 
						   :name="item.name" 
						   :placeholder="item.placeholder"
						   :value="form[item.name]"
						   @focus="clearTip(index,item.name)"
						   @blur="checkTip(index,item.name)"
						   @input="setFormData(item.name,$event)"
						   v-else/>
					<text class="font-red" v-if="item.type!=='code'">{{item.tip}}</text>
					<text class="code tc" @tap="getCode" v-if="item.type=='code'">{{codeTip}}</text>
				</view>
			</template>
			<view class="btn-area tc">
				<button formType="submit" :disabled="checkDisabled">注册</button>
			</view>
		</form>
		<view class="agree-box flex-center">
			<checkbox value="agree" checked />
			<navigator url="../login/agreement">我同意 <text class="fc-normal">《优佳护用户服务协议》</text></navigator>
		</view>
	</view>
</template>

<script>
import { getRegisterCode,userRegister,checkUserName,checkPhone } from '../../common/api/user.js'
import { mapState,mapMutations, mapGetters } from 'vuex'
export default {
	data() {
		return {
			sendCode: false,
			codeTip: '获取验证码',
			codeTimer: null,
			codeTime: 0,
			form: {
				userName: '',
				password: '',
				passwordConfirm: '',
				phone: '',
				code: '',
				wechatBindAble: 0
			},
			register: [
				{
					name: 'userName',
					placeholder: '请输入用户名',
					type: 'text',
					tip: '',
					tipName: '用户名'
				},
				{
					name: 'password',
					placeholder: '设置密码（6-16位字符/字母+数字）',
					type: 'password',
					tip: '',
					tipName: '密码'
				},
				{
					name: 'passwordConfirm',
					placeholder: '确认密码',
					type: 'password',
					tip: '',
					tipName: '密码'
				},
				{
					name: 'phone',
					placeholder: '请输入手机号',
					type: 'text',
					tip: '',
					tipName: '手机号'
				},
				{
					name: 'code',
					placeholder: '请输入验证码',
					type: 'code',
					tip: '',
					tipName: ''
				}
			],
			to: ''
		}
	},
	computed: {
		...mapGetters(['codeDate']),
		checkDisabled() {
			return !this.form.userName || !this.form.password || !this.form.passwordConfirm || !this.form.phone || !this.form.code
		}
	},
	onLoad(e) {
		this.to = e.to || ''
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
		getCode() {		
			if(this.form.userName!='' && this.form.password!='' && this.form.passwordConfirm!='' && this.form.phone!=''){			
				if(this.sendCode){
					if(this.codeTip === '获取验证码'){
						this.$store.commit('SET_CODEDATE', new Date())
						this.codeCountDown()
						getRegisterCode(this.form).then(response => {
							console.log(response)
						})
					}
				}
				else{
					uni.showToast({
						title: '请检查手机号码是否有误！',
						icon: 'none',
						mask: true
					})
				}
			}
			else{
				uni.showToast({
					title: '请检查所有资料是否已填写',
					icon: 'none',
					mask: true
				})
			}
		},
		clearTip(idx,name) {
			this.register[idx].tip = ''
		},
		checkTip(idx,name) {
			if(this.form[name] == ''){
				this.register[idx].tip = this.register[idx].tipName + '不能为空'
			}
			else if(name === 'password'){
				let check = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![^\w]+$).{8,20}$/
				if(!check.test(this.form.password)){
					this.register[1].tip = '密码必须为8-20位的数字字母组合'
				}
			}
			else if(name === 'passwordConfirm' && this.form.passwordConfirm != this.form.password){
				this.register[2].tip = '两次输入的密码不一致'
			}
			else if(name === 'userName'){
				let userName = this.form.userName
				checkUserName(userName).then(response => {
					let data = response.data
					if(data.data){
						this.register[0].tip = '该用户名已被注册'
					}
					else{
						let checkFirst = /^[A-Za-z]/
						let checkName = /^[A-Za-z][A-Za-z0-9_]{3,19}$/
						if(!checkFirst.test(userName)){
							this.register[0].tip = '用户名第一位必须为首字母'
						}
						else if(!checkName.test(userName)){
							this.register[0].tip = '用户名必须为4-20位的数字字母组合'
						}
					}
				})
			}
			else if(name === 'phone'){
				let checkMobile = /^1[345789]\d{9}$/
				if(checkMobile.test(this.form.phone)){
					checkPhone(this.form.phone).then(response => {
						let data = response.data
						if(data.data){
							this.sendCode = false
							this.register[3].tip = '该手机号码已被注册'
						}
						else{
							this.sendCode = true
						}
					})
				}
				else{
					this.sendCode = false
					this.register[3].tip = '请输入正确的手机号码'
				}
			}
		},
		formSubmit() {
			userRegister(this.form).then(response => {
				let data = response.data
				if(data.data && data.msg === 'success'){
					this.$store.dispatch('LoginByPhone',`?mobile=SMS@${this.form.phone}&code=${this.form.code}&grant_type=mobile`).then(res => {
						if(this.to === 'wxBind'){
							uni.redirectTo({
								url: '../user/wxbind'
							})
						}
						else{
							// uni.switchTab({
							// 	url: "../tab/home"
							// })
							uni.showModal({
								title: '提示',
								content: '您当前未验证身份，请前往验证',
								success: function (res) {
									if (res.confirm) {
										uni.reLaunch({
											url:'../user/identity?to=home'
										})
									} else if (res.cancel) {
										uni.switchTab({
											url: "../tab/home"
										})
									}
								}
							})
						}
					})
				}
			})
		},
		setFormData(item,val) {
			this.$set(this.form,item,val.detail.value)
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