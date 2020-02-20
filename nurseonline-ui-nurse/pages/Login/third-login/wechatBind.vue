<template>
	<view class="content flex-column align-center">
		<view class="login-area">
			<view class="login-box">
				<template v-if="mobileLogin">
					<view class="uni-flex justify-content-space">
						<input type="number" v-model="mobile.mobile" placeholder="请输入手机号" placeholder-class="holder"/>
						<text v-if="showClearPhone" @tap='clearPhone' class="iconfont mr20">&#xe63e;</text> <!-- 一键清除 -->
					</view>	
				</template>
			</view>
			<view class="login-box flex-msg">
				<template v-if="mobileLogin">
					<input type="number" v-model="mobile.code" placeholder="请输入验证码" placeholder-class="holder"/>
					<text class="code tc" @tap="getCode">{{codeTip}}</text><!-- 获取验证码 -->
				</template>
			</view>
		</view>
		<view class="btn-area"  @tap="login">
			<button  type="primary bgc-6e8cfa" :class="loginDisabled?'bgc999':'bgc6e8cfa'" :disabled="loginDisabled">绑定</button>
		</view>
		<view class="agree-box">
			<checkbox class="inline-block" value="agree" :checked="checked" @tap="clickSelect" />
			<view class="inline-block">我同意</view>
			<view class="fc-normal inline-block" @tap.stop.prevent="toWordInfo">《优佳护用户服务协议》</view>
		</view>
	</view>
</template>

<script>
	let username_validInfo;
	let phone_validInfo;
	import CryptoJS from 'crypto-js'
	export default {
		data() {
			return {
				mobileLogin: true,
				codeTip: '获取验证码',
				codeTimer: null,
				codeTime: 0,
				mobile: {
					mobile: '',
					code: ''
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
				checkMobile:false,
				checkCode:false,
				checkUsername:false,
				checkPassword:false,
				//显示是否清除input
				showClearUserName:false,
				showClearPsw:false,
				showClearPhone:false,
				weixinCode: '',
				byUserNamePhone:false,//true:手机密码登录 false:用户名密码登录
				versionNumber:''//版本号
			}
		},
		onLoad(option) {
			if(option.mobileLogin){
				this.mobileLogin = !this.mobileLogin
			}
			this.user.username=option.name
			// this.init() //只允许手机验证码校验190722
		},
		onShow() {
			this.calculateCodeTime()
		},
		computed:{
			mobile_input(){
				return this.mobile.mobile
			},
			code_input(){
				return this.mobile.code
			},
		},
		watch:{
			mobileLogin(){//登录方式切换
				if(this.mobileLogin==true){//手机验证码登录
					this.loginDisabled=true //初始不可编辑
				}else{//账户名密码登录
					let pswCode=uni.getStorageSync('psw')
					if(this.user.username!=''&&this.user.password!=''){
						this.loginDisabled=false
					}else{
						this.loginDisabled=true
					}
				}
			},
			mobile_input(){//手机号输入框
				let phone_valid=this.$validate.v_phone(this.mobile.mobile).then((val)=>{
					console.log(val)
					phone_validInfo=val
					if(val=='手机号不能为空'){
						this.showClearPhone=false
						this.checkMobile=false
					}else{
						if(val!='手机号格式错误'){//格式正确
							this.showClearPhone=true
							this.checkMobile=true
						}
					}
					if(this.checkCode==true&&this.checkMobile==true){
						this.loginDisabled=false
					}else{
						this.loginDisabled=true
					}
				})
			},
			code_input(){//验证码输入框
				if(this.code_input.length<1){
					this.checkCode=false
				}else{
					this.checkCode=true
				}
				if(this.checkCode==true&&this.checkMobile==true){
					this.loginDisabled=false
				}else{
					this.loginDisabled=true
				}
			},
			username_input(){ //用户名或手机号输入框
				if(!/^[a-zA-Z]+$/.test(this.user.username.substr(0,1))){	//首位不是字母，则默认为手机号密码登录
					this.byUserNamePhone=true
					let usernamePhone_valid=this.$validate.v_phone(this.user.username).then((val)=>{
						console.log(val)
						username_validInfo=val
						if(val=='手机号不能为空'){
							this.showClearUserName=false
							this.checkUsername=false
						}else{
							this.showClearUserName=true
							this.checkUsername=true
						}
						if(this.checkPassword==true&&this.checkUsername==true){
							this.loginDisabled=false
						}else{
							this.loginDisabled=true
						}
					})
				}else{														//首位是字母，则默认为用户名密码登录
					this.byUserNamePhone=false
					let username_valid=this.$validate.v_username(this.user.username).then((val)=>{
						console.log(val)
						username_validInfo=val
						if(val=='用户名不能为空'){
							this.showClearUserName=false
							this.checkUsername=false
						}else{
							this.showClearUserName=true
							this.checkUsername=true
						}
						if(this.checkPassword==true&&this.checkUsername==true){
							this.loginDisabled=false
						}else{
							this.loginDisabled=true
						}
					})
				}
			},
			password_input(){//密码输入框
					if(this.user.password==''){
						this.showClearPsw=false
					}else{
						this.showClearPsw=true
					}
					
					let pswCode=uni.getStorageSync('psw')
					if(pswCode!=this.user.password){//存在记住密码缓存
						this.changePsw=false
					}
					if(this.password_input.length<1){
						this.checkPassword=false
					}else{
						this.checkPassword=true
					}
					if(this.checkPassword==true&&this.checkUsername==true){
						this.loginDisabled=false
					}else{
						this.loginDisabled=true
					}
			}
		},
		methods:{
			init(){
				this.versionNumber=this.$store.state.versionNumber
				let pswCode=uni.getStorageSync('psw')
				if(pswCode!=''){//存在记住密码缓存
					this.rememberPsw=false
					this.mobileLogin=false
				}
				this.user.password=pswCode
				let userName=uni.getStorageSync('userName')
				this.user.username=userName
			},
			changeShowPsw(){
				this.showPsw=!this.showPsw
			},
			clickSelect(){
				this.checked=!this.checked
			},
			checkPswSelect(){
				this.checkPsw=!this.checkPsw
			},
			changeLogin() {
				this.mobileLogin = !this.mobileLogin
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
					let phone_valid=await this.$validate.v_phone(this.mobile.mobile).then((val)=>{
						if(val=='手机号已被注册'){
							return true
						}else if(val=='手机号可用于注册'){
							return new Promise((resolve,reject)=>{
								 uni.showModal({
									title: '提示',
									content: '当前手机号未注册，您可以选择“自主注册”（自定义用户名密码）或“一键注册”（随机生成用户名和密码）',
									showCancel: true,
									cancelText: '自主注册',
									confirmText: '一键注册',
									success: res => {
										if(res.cancel){
											uni.navigateTo({
												url: '../reg/index',
												success: res => {},
												fail: () => {},
												complete: () => {}
											});
										}else{
											resolve(true);
										}
									},
									fail: () => {},
									complete: () => {}
								});
							})
						}
						else{
							uni.showToast({
								title:val,
								icon:'none',
								mask:false
							})
							return false
						}
					})
					if(!phone_valid){
						return;
					}
					this.$store.state.codeTime = new Date()
					this.codeCountDown()
					uni.showLoading({
						title: '请求中'
					})
			        let res = await this.$api.loginAndBindWechatGet(this.mobile.mobile);
					uni.hideLoading();
					// let backData=JSON.parse(res["data"]).data
			},
			async login(){
				this.$store.state.wechatBindRes=true//跳转到微信绑定验证码校验页面
				if(!this.checked){
					uni.showToast({
						title:'请阅读并勾选服务协议',
						icon:'none'
					})
					return;
				}
				//手机号全局
				this.$store.state.myPhone=this.mobile.mobile
				if(this.mobileLogin){/*正在使用手机验证码登录*/
					uni.showLoading({
						title: '登录验证'
					})
					this.$store.state.loginAndBindWechatCode=this.mobile.code
					let res =await this.$api.mobileLogin(this.mobile.mobile,this.mobile.code);
					uni.hideLoading();
					// this.wechatBindGetCodeFuc(res)//微信绑定用户
				}
				// else{/*账号密码或手机密码登录*/
				// 	this.$store.state.checkPsw=this.checkPsw
				// 	console.log("是否记住密码？",this.$store.state.checkPsw)
				// 	if(this.byUserNamePhone){//校验所输入手机号能否用于登录
				// 		if(username_validInfo!='手机号已被注册'){
				// 			if(username_validInfo=='手机号可用于注册'){
				// 				uni.showToast({
				// 					title: '该手机号未注册',
				// 					icon:'none'
				// 				});
				// 			}else{
				// 				uni.showToast({
				// 					title: username_validInfo,
				// 					icon:'none'
				// 				});
				// 			}
				// 			return
				// 		}	
				// 	}else{//校验所输入用户名能否用于登录
				// 		if(username_validInfo!='用户名已被注册'){
				// 			if(username_validInfo=='用户名可用于注册'){
				// 				uni.showToast({
				// 					title: '该用户名未注册',
				// 					icon:'none'
				// 				});
				// 			}else{
				// 				uni.showToast({
				// 					title: username_validInfo,
				// 					icon:'none'
				// 				});
				// 			}
				// 			return
				// 		}
				// 	}
				// 	uni.showLoading({
				// 		title: '登录验证'
				// 	})
				// 	let userInfo=this.user
				// 	let pswEncode=this.$store.state.pswEncode
				// 	const user = this.$targb.encryption({
				// 		data: userInfo,
				// 		key: pswEncode,
				// 		param: ['password']
				// 		})
				// 	let pswCode=uni.getStorageSync('psw')
				// 	let password
				// 	if(pswCode!=''&&pswCode==this.user.password){//存在记住密码缓存且输入框密码与缓存一致
				// 		 password = pswCode 
				// 	}else{
				// 		 password = encodeURIComponent(user.password)
				// 	}
				// 	let resLogin;
				// 	if(this.byUserNamePhone){/*正在使用手机号密码登录*/
				// 		resLogin = await this.$api.phonePswLogin(user.username,password)
				// 	}else{/*正在使用用户名密码登录*/
				// 		resLogin = await this.$api.passwordLogin('?username='+user.username+'&password='+password+'&grant_type=password&scope=server');
				// 	}
				// 	//缓存账号密码
				// 	if(resLogin.statusCode==200){//登录成功
				// 		if(this.$store.state.checkPsw){
				// 			uni.setStorageSync('psw',password)
				// 			uni.setStorageSync('userName',user.username)
				// 		}else{
				// 			uni.removeStorageSync('psw');
				// 			uni.removeStorageSync('userName');
				// 		}
				// 	}
				// 	uni.hideLoading();
				// }
			},
			// async wechatBindGetCodeFuc(res){
			// 	// if(res.statusCode==200){
			// 	// 		let res = await this.$api.wechatBindGetCode()
			// 	// }
			// },
			reg(){
				uni.navigateTo({
					url:'../reg/index'
				})
			},
			toWordInfo(){
				uni.navigateTo({
					url:'../../../packageA/WordInfo/index'
				})
			},
			clearPsw(){
				this.user.password=''
			},
			clearUserName(){
				this.user.username=''
			},
			clearPhone(){
				this.mobile.mobile=''
			},
			async weixinLogin(){
				var me=this
				let encryptedData;
				let iv;
				// 获取用户信息
				uni.getUserInfo({
				  provider: 'weixin',
				  success: function (infoRes) {
					console.log(infoRes);
					encryptedData=infoRes.encryptedData
					iv=infoRes.iv
				  }
				});
				uni.login({
				  provider: 'weixin',
				  success: async (loginRes) =>{
					console.log(loginRes.code);
					let data={
						code:loginRes.code,
						encryptedData:encryptedData,
						iv:iv
					}
					try{
						let res=await this.$api.wechatLogin(data)
					}catch(e){
						//TODO handle the exception
						console.log(e.data.code)
						if(e.data.code==1){
							uni.showModal({
								title: '提示',
								content: '该微信号未绑定用户',
								showCancel: true,
								cancelText: '取消',
								confirmText: '前往绑定',
								success: res => {
									if(res.confirm){
										uni.navigateTo({
											url: '../third-login/wechatBind',
											success: res => {},
											fail: () => {},
											complete: () => {}
										});
									}
								},
								fail: () => {},
								complete: () => {}
							});
						}
					}
				  }
				});
			},
			changePwd(){
				this.$store.state.resetPsw=0;
				uni.navigateTo({
					url:'../change-pwd/index'
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
	button::after{
	  border: none;
	}
	.wechatLoginBtn{
		// sposition: inherit;
		width: 100rpx;
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
			width: 500upx;
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