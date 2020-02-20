<template>
	<view class="content flex-column align-center">
		<view class="login-area">
			<view class="login-box">
				<template v-if="mobileLogin">
					<view class="uni-flex justify-content-space">
						<input type="text" v-model="mobile.mobile" placeholder="请输入用户名/手机号" placeholder-class="holder"/>
						<text v-if="showClearPhone" @tap='clearPhone' class="iconfont mr20">&#xe63e;</text> <!-- 一键清除 -->
					</view>	
				</template>
			</view>
			<view class="login-box flex-msg">
				<template v-if="mobileLogin">
					<input type="number" v-model="mobile.code" placeholder="请输入验证码" placeholder-class="holder"/>
					<text class="code tc" @tap="getPswCode">{{codeTip}}</text>
				</template>
			</view>
			<view class="login-box flex-msg mt30">
				<template v-if="mobileLogin">
					<input type="text" class="width80p" @blur="blurPsw(index)" v-model="mobile.newpsw" placeholder="设置新密码（8-20位数字和字母组合）" placeholder-class="holder"/>
				</template>
			</view>
		</view>
		<view class="btn-area"  @tap="confirmChange">
			<button  type="primary bgc-6e8cfa" :class="loginDisabled?'bgc999':'bgc6e8cfa'" :disabled="loginDisabled">确认</button>
		</view>
		
	</view>
</template>

<script>
	let username_validInfo;
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
					code: '',
					newpsw:''
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
				checkNewPsw:false,
				//显示是否清除input
				
				weixinCode: '',
				validateCode:'',
				byUserNamePhone:false,//true:手机密码登录 false:用户名密码登录
			}
		},
		onLoad(option) {
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
			newpsw_input(){
				return this.mobile.newpsw
			}
		},
		watch:{
			mobile_input(){
				if(!/^[a-zA-Z]+$/.test(this.mobile_input.substr(0,1))){	//首位不是字母，则默认为手机号密码登录
					this.byUserNamePhone=true
					let usernamePhone_valid=this.$validate.v_phone(this.mobile_input).then((val)=>{
						console.log(val)
						username_validInfo=val
						if(val=='手机号不能为空'){
							this.checkMobile=false
						}else{
							this.checkMobile=true
						}
						if(this.checkMobile&&this.checkCode&&this.checkNewPsw){
							this.loginDisabled=false
						}else{
							this.loginDisabled=true
						}
					})
				}else{														//首位是字母，则默认为用户名密码登录
					this.byUserNamePhone=false
					let username_valid=this.$validate.v_username(this.mobile_input).then((val)=>{
						console.log(val)
						username_validInfo=val
						if(val=='用户名不能为空'){
							this.checkMobile=false
						}else{
							this.checkMobile=true
						}
						if(this.checkMobile&&this.checkCode&&this.checkNewPsw){
							this.loginDisabled=false
						}else{
							this.loginDisabled=true
						}
					})
				}
			},
			code_input(){
				if(this.code_input!=''){
					this.checkCode=true
				}else{this.checkCode=false}
				if(this.checkMobile&&this.checkCode&&this.checkNewPsw){
					this.loginDisabled=false
				}else{
					this.loginDisabled=true
				}
			},
			newpsw_input(){
				if(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/.test(this.newpsw_input)){
					this.checkNewPsw=true
				}else{this.checkNewPsw=false}
				if(this.checkMobile&&this.checkCode&&this.checkNewPsw){
					this.loginDisabled=false
				}else{
					this.loginDisabled=true
				}
			},
			loginDisabled(){
				console.log('loginDisabled-change')
			}
		},
		methods:{
			weixinLogin(){
				var me=this
				uni.login({
				  provider: 'weixin',
				  success: function (loginRes) {
					console.log(loginRes.code);
					var code=loginRes.code
					// 获取用户信息
					uni.getUserInfo({
					  provider: 'weixin',
					  success: function (infoRes) {
						console.log(infoRes.userInfo);
					  }
					});
				  }
				});
			},
			changePwd(){
				uni.navigateTo({
					url:'../change-pwd/index'
				})
			},
			init(){
				
			},
			blurPsw(index){
					if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,20}$/.test(this.mobile.newpsw)&&this.mobile.newpsw!='') {
						uni.showToast({
							title:'密码需要是8-20位数字和字母组合',
							icon:'none',
							mask:false,
						})
						return true; 
					}
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
			async getPswCode() {
				if(this.codeTip != '获取验证码'){
					return false
				}//拒绝再次请求
				if(this.byUserNamePhone){//校验所输入手机号能否用于登录
						if(username_validInfo!='手机号已被注册'){
							if(username_validInfo=='手机号可用于注册'){
								uni.showToast({
									title: '该手机号未注册',
									icon:'none'
								});
							}else{
								uni.showToast({
									title: username_validInfo,
									icon:'none'
								});
							}
							return
						}	
					}else{//校验所输入用户名能否用于登录
						if(username_validInfo!='用户名已被注册'){
							if(username_validInfo=='用户名可用于注册'){
								uni.showToast({
									title: '该用户名未注册',
									icon:'none'
								});
							}else{
								uni.showToast({
									title: username_validInfo,
									icon:'none'
								});
							}
							return
						}
					}
					this.$store.state.codeTime = new Date()
					this.codeCountDown()
					let res;
					let msg;
					let phoneEncode='';
					try{
						if(!/^[a-zA-Z]+$/.test(this.mobile.mobile.substr(0,1))){//首字母不为字母，则默认输入手机
							 res = await this.$api.getchangepswcodebyphone(this.mobile.mobile);
						}else{
							 res = await this.$api.getchangepswcodebyname(this.mobile.mobile);
							 phoneEncode=res.data.data.phone;
						}
						msg=res.data.msg
						this.validateCode=res.data.data.validateCode
					}catch(e){
						//TODO handle the exception
						msg=e.data.msg
					}
					if(msg=='success'){
						if(phoneEncode!=''){
							uni.showToast({
								title: '已成功的向您手机'+phoneEncode+'发送验证码，请注意查收',
								icon:'none',
								duration:2500
							});
						}else{
							uni.showToast({
								title: '发送成功，请注意查收',
								icon:'none'
							});
						}
					}else{
						uni.showToast({
							title: msg,
							icon:'none'
						});
					}
			},
			async confirmChange(){
				//手机号全局
				this.$store.state.myPhone=this.mobile.mobile
					if(!this.mobile.mobile||!this.mobile.code){
						uni.showToast({
							title:'请正确填写登录信息',
							icon:'none'
						})
						return;
					}
					uni.showLoading({})
					let data={
						"code":this.mobile.code,
						"newpassword1":this.mobile.newpsw,
						'validateCode':this.validateCode
					}
					let msg;
					let confirmtext;
					try{
						let res =await this.$api.changePsw(data);
						msg=res.data.msg
						if(res.data.msg=='success'){
							msg='重置成功'
						}
						if(this.$store.state.resetPsw==0){
							confirmtext='返回登录'
						}else{
							confirmtext='确认'
						}
						uni.showModal({
							title: '提示',
							content: msg,
							showCancel: true,
							cancelText: '取消',
							confirmText: confirmtext,
							success: res => {
								if (res.confirm) {
									uni.removeStorageSync('psw');
									uni.removeStorageSync('userName');
									if(confirmtext=='返回登录'){
										uni.reLaunch({
											url:'../login/login?mobileLogin=true'
										})
									}else{
										uni.navigateBack({
											delta:1
										})
									}
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							},
							fail: () => {},
							complete: () => {}
						});
					}catch(e){
						//TODO handle the exception
						console.log(e)
						msg=e.data.msg
						uni.showModal({
							title: '提示',
							content: msg,
							showCancel: false,
							cancelText: '',
							confirmText: '确定',
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					}
					uni.hideLoading();
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
			margin-top: 100upx;
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