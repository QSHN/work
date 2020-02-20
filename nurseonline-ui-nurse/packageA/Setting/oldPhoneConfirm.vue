<template>
	<view class="content flex-column align-center">
		<view class="login-area">
			<view class="uni-flex justify-content-space">
				<view class="uni-item width70p">
					<view class="login-box">
						<template v-if="mobileLogin">
							<view class="uni-flex justify-content-space">
								<text class="font-size26 flex-alignC width120">旧手机号:</text>
								<input type="number" v-model="mobile.oldPhone" placeholder="请输入旧手机号" placeholder-class="holder"/>
								<text v-if="showClearPhone" @tap='clearPhone' class="iconfont mr20">&#xe63e;</text> <!-- 一键清除 -->
							</view>	
						</template>
					</view>
					<view class="login-box">
						<template v-if="mobileLogin">
							<view class="uni-flex justify-content-space">
								<text class="font-size26 flex-alignC width120">新手机号:</text>
								<input type="number" v-model="mobile.newPhone" placeholder="请输入新手机号" placeholder-class="holder"/>
								<text v-if="showClearPhone" @tap='clearPhone' class="iconfont mr20">&#xe63e;</text> <!-- 一键清除 -->
							</view>	
						</template>
					</view>
				</view>
				<view class="uni-item" style="display:flex;flex-direction:column-reverse">
					<template v-if="mobileLogin">
						<text class="code tc border-left" @tap="getCode">{{codeTip}}</text><!-- 获取验证码 -->
					</template>
				</view>
			</view>
			<view class="login-box mt10">
				<template v-if="mobileLogin">
					<view class="uni-flex justify-content-space padding-15-0">
						<text class="font-size26 flex-alignC">旧手机验证码:</text>
						<input class="width66p" type="number" v-model="mobile.oldPhoneCode" placeholder="请输入旧手机号验证码" placeholder-class="holder"/>
						<text v-if="showClearPhone" @tap='clearPhone' class="iconfont mr20">&#xe63e;</text> <!-- 一键清除 -->
					</view>	
				</template>
			</view>
			<view class="login-box">
				<template v-if="mobileLogin">
					<view class="uni-flex justify-content-space padding-15-0">
						<text class="font-size26 flex-alignC">新手机验证码:</text>
						<input class="width66p" type="number" v-model="mobile.newPhoneCode" placeholder="请输入新手机号验证码" placeholder-class="holder"/>
						<text v-if="showClearPhone" @tap='clearPhone' class="iconfont mr20">&#xe63e;</text> <!-- 一键清除 -->
					</view>	
				</template>
			</view>
			<view class="flex-msg mt30">
			</view>
		</view>
		<view class="btn-area"  @tap="confirmChange">
			<button  type="primary bgc-6e8cfa" :class="loginDisabled?'bgc999':'bgc6e8cfa'" :disabled="loginDisabled">确认</button>
		</view>
		
	</view>
</template>

<script>
	let username_validInfo;
	let token;
	import CryptoJS from 'crypto-js'
	export default {
		data() {
			return {
				mobileLogin: true,
				codeTip: '获取验证码',
				codeTimer: null,
				codeTime: 0,
				mobile: {
					oldPhone: '',
					newPhone: '',
					oldPhoneCode:'',
					newPhoneCode:''
				},
				user: {
					username: '',
					password: ''
				},
				checked:true,
				checkPsw:true,
				showPsw:true,
				changePsw:true,
				passwordOrText:"password",
				rememberPsw:true,//显示切换密码可见
				loginDisabled:true,
				checkOldPhone:false,
				checkNewPhone:false,
				
				weixinCode: '',
				validateCode:'',
				byUserNamePhone:false,//true:手机密码登录 false:用户名密码登录
			}
		},
		onLoad(option) {
			this.init()
		},
		onShow() {
			this.calculateCodeTime()
		},
		computed:{
			oldPhone_input(){
				return this.mobile.oldPhone
			},
			newPhone_input(){
				return this.mobile.newPhone
			},
			oldPhoneCode_input(){
				return this.mobile.oldPhoneCode
			},
			newPhoneCode_input(){
				return this.mobile.newPhoneCode
			}
			
		},
		watch:{
			oldPhone_input(){
				let phone_valid=this.$validate.v_phone(this.mobile.oldPhone).then((val)=>{
					console.log(val)
					if(val!='手机号格式错误'){//格式正确
						this.checkOldPhone=true
					}else{
						this.checkOldPhone=false
					}
					if(val=='手机号可用于注册'){
						uni.showToast({
							title: '该手机号未绑定用户，请确认输入',
							icon:'none',
							duration:2000
						});
					}
					if(this.checkOldPhone==true&&this.checkNewPhone==true&&this.mobile.oldPhoneCode!=' '&&this.mobile.newPhoneCode!=' '){
						this.loginDisabled=false
					}else{
						this.loginDisabled=true
					}
				})
			},
			newPhone_input(){
				let phone_valid=this.$validate.v_phone(this.mobile.newPhone).then((val)=>{
					console.log(val)
					if(val!='手机号格式错误'){//格式正确
						this.checkNewPhone=true
					}else{
						this.checkNewPhone=false
					}
					if(val=='手机号已被注册'){
						uni.showToast({
							title: '该手机号已绑定用户，请确认输入',
							icon:'none',
							duration:2000
						});
					}
					if(this.checkOldPhone==true&&this.checkNewPhone==true&&this.mobile.oldPhoneCode!=' '&&this.mobile.newPhoneCode!=' '){
						this.loginDisabled=false
					}else{
						this.loginDisabled=true
					}
				})
			},
			loginDisabled(){
				console.log('loginDisabled-change')
			}
		},
		methods:{
			async init(){
				let userinfo=await this.$apip.userinfo()
				console.log(userinfo.data.data)
				this.mobile.oldPhone=userinfo.data.data.sysUser.phone
			},
			calculateCodeTime() {
				var codeTime = this.$store.state.codeTime
				if (codeTime) {
					var now = new Date()
					var time = Math.floor((now - codeTime) / 1000)
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
				if(this.codeTip != '获取验证码'){
					return false
				}//拒绝再次请求
				console.log(this.checkOldPhone,this.checkNewPhone)
					if(this.checkOldPhone==false||this.checkNewPhone==false){
						uni.showToast({
							title: '请填写正确的手机格式',
							icon:'none'
						});
						return false
					}
					this.$store.state.codeTime = new Date()
					this.codeCountDown()
					let phone={
						"oldphone":this.mobile.oldPhone,
						"newphone":this.mobile.newPhone 
					}
					let res;
					let msg;
					try{
						res = await this.$api.sendChangePhoneCode(phone);
						msg=res.data.msg
						token=res.data.data
					}catch(e){
						//TODO handle the exception
						msg=e.data.msg
					}
					if(msg=='success'){
							uni.showToast({
								title: '发送成功，请注意查收',
								icon:'none'
							});
					}else{
						uni.showToast({
							title: ' '+msg,
							icon:'none'
						});
					}
			},
			async confirmChange(){
				let data={
					"token":token,
					"code":this.mobile.oldPhoneCode,
					"codeForNew":this.mobile.newPhoneCode
					}
				try{
					let res=await this.$api.changePhoneConfirm(data)
					uni.showModal({
						title: '提示',
						content: '修改成功',
						showCancel: false,
						cancelText: '',
						confirmText: '返回',
						success: res => {
							if(res.confirm){
								uni.navigateBack({
									delta:1
								});
							}
						},
						fail: () => {},
						complete: () => {}
					});
				}catch(e){
					//TODO handle the exception
					uni.showToast({
						title:" "+e.data.msg,
						icon:'none',
						duration:2500
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.width70p{
		width:70%;
	}
	.width66p{
		width:66%
	}
	.flex-alignC{
		align-items: center;
		display: flex;
	}
	.width120{
		width:120rpx;
	}
	.border-left{
		border-left:6rpx solid #6e8cfa;
		padding-left:15rpx;
		width:140rpx;
	}
	.padding-15-0{
		padding:15rpx 0rpx;;
	}
	page {
		min-height: 100%;
		background-color: #FFF;
	}
	.content {
		.logo {
			margin: 50upx 0;
			image {
				width: 120upx;
			}
		}
		.login-select {
			color: #3e3a39;
			view{
				padding-bottom: 5upx;
				&:first-child {
					margin-right: 40upx;
				}
				&.selected {
					color: #6E8CFA;
					border-bottom: 5upx solid #6e8cfa;
				}
			}
		}
		.login-area {
			width: 645upx;
			margin-top: 50upx;
			.login-box {
				padding-bottom: 10upx;
				border-bottom: 1px solid #c0c0c0;
				&:first-child {
					margin-bottom: 30upx;
				}
				.code{
					padding-left: 10upx;
					border-left: 4upx solid #6e8cfa;
					font-size: 24upx;
					width: 150upx;
				}
			}
		}
		.register-box {
			height: 40upx;
			margin-top: 10upx;
			.register-area{
				width: 500upx;
			}
		}
		.btn-area {
			width: 500upx;
			margin-top: 50upx;
			button {
				width: 100%;
			}
		}
		.agree-box {
			margin-top: 100upx;
			checkbox {
				margin-right: 20upx;
			}
		}
	}
</style>