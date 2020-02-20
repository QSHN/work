<template>
	<view class="content flex-column align-center">
		<view class="login-area">
			<view class="login-box">
				<view class="font-size26 color666"><text>您当前正在进行 </text><text class="font-weight600">{{stateValue}}</text><text> 操作</text></view>
				<template v-if="mobileLogin">
					<view class="uni-flex justify-content-space mt20">
						<input type="text" v-model="mobile.code" placeholder="请输入验证码" placeholder-class="holder"/>
						<text v-if="showClearPhone" @tap='clearPhone' class="iconfont mr20">&#xe63e;</text> <!-- 一键清除 -->
					</view>	
				</template>
			</view>
		</view>
		<view class="btn-area"  @tap="confirmChange">
			<button open-type="getUserInfo"  type="primary bgc-6e8cfa" :class="loginDisabled?'bgc999':'bgc6e8cfa'" :disabled="loginDisabled">确认</button>
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
				checkCode:false,
				//显示是否清除input
				
				weixinCode: '',
				validateCode:'',
				byUserNamePhone:false,//true:手机密码登录 false:用户名密码登录
				stateValue:'',
				userPhone:''
			}
		},
		onLoad(option) {
			this.init()
		},
		computed:{
			code_input(){
				return this.mobile.code
			},
		},
		watch:{
			code_input(){
				if(this.code_input!=''){
					this.checkCode=true
				}else{this.checkCode=false}
				if(this.checkCode){
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
			init(){
				if(this.$store.state.wechatLoginCodeType==0){
					this.stateValue=' 绑定微信 '
				}else{
					this.stateValue=' 解绑微信 '
				}
				this.userPhone=this.$store.state.userPhone
			},
			async confirmChange(){//绑定微信和用户
					uni.showLoading({})
					var me=this
					let encryptedData;
					let iv;
					let dataSubmit;
					uni.login({
					  provider: 'weixin',
					  success: async (loginRes) =>{
						// 获取用户信息
						let getUserInfoCode_pro=new Promise((resolve,reject)=>{
							uni.getUserInfo({
							  provider: 'weixin',
							  success: (infoRes) =>{
								console.log(infoRes);
								encryptedData=infoRes.encryptedData
								iv=infoRes.iv
								resolve(true)
							  }
							})
						}).then(async(val)=>{
							this.$store.state.wechatCode=loginRes.code;
							this.$store.state.wechatEncryptedData=encryptedData;
							this.$store.state.wechatIv=iv;
							dataSubmit={
								"wechatCode":loginRes.code,
								"code":this.mobile.code,
								"clientId":1,
								"encryptedData":encryptedData,
								"iv":iv
							}
							let msg;
							let confirmtext;
							let res;
							let backDelta;
							try{
								if(this.$store.state.wechatLoginCodeType==0){
									res =await this.$api.wechatBind(dataSubmit);
									msg=res.data.msg
									if(res.data.msg=='success'){
										msg='绑定成功'
									}
									backDelta=2
								}else if(this.$store.state.wechatLoginCodeType==1){
									res =await this.$api.unWechatBind(dataSubmit);
									msg=res.data.msg
									if(res.data.msg=='success'){
										msg='解绑成功'
									}
									backDelta=1
								}
								uni.showModal({
									title: '提示',
									content: ''+msg,
									showCancel: true,
									cancelText: '取消',
									confirmText: '确定',
									success: res => {
										if (res.confirm) {
												this.$store.state.settingRefresh++;
												uni.navigateBack({
													delta: backDelta
												});
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
									content: '错误信息：'+msg,
									showCancel: false,
									cancelText: '',
									confirmText: '确定',
									success: res => {},
									fail: () => {},
									complete: () => {}
								});
							}
						})
						uni.hideLoading();
					  }
					});
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
			margin-top: 60upx;
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