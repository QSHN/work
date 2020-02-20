<template>
	<view class="content">
		<form @submit="regFormSubmit">
			<view v-for="(user,index) in register" :key="index">
				<view class="bg-white padding-20 border-01 register-box" :class="{'flex-msg': user.type=='code'}">
					
					<view v-if="user.type=='password'" class="uni-flex justify-content-space">
						<input class="width80p"  @blur="blurPsw(index)" v-if="user.showPsw" type='password' password  v-model="user.value" :name="user.name" :placeholder="user.placeholder"/>
						<input class="width80p"  @blur="blurPsw(index)" v-else type='text'  v-model="user.value" :name="user.name" :placeholder="user.placeholder"/>
							<text @tap="changeShowPsw(index)" v-if="user.showPsw" class="iconfont">&#xe634;</text> <!-- 默认隐藏 -->
							<text @tap="changeShowPsw(index)" v-else class="iconfont">&#xe633;</text>
					</view>
					<view v-else class="uni-flex justify-content-space">
						<input v-model="user.value" @blur="blurName(index)" :name="user.name" :placeholder="user.placeholder"/>
						<text v-if="user.valid" class="color-red font-size24">{{user.validInfo}}</text>
						<text v-if="user.bingoInput" class="iconfont color6e8cfa font-size50">&#xe721;</text>
					</view>
					<text class="code tc" @tap="regGetCode" v-if="user.type=='code'">{{codeTip}}</text>
				</view>
			</view>
			<view class="btn-area tc">
				<button formType="submit" type="primary bgc-6e8cfa" :disabled="disabledReg" :class="disabledReg?'bgc999':'bgc6e8cfa'">注册</button>
			</view>
		</form>
		<view class="width100p text-alignC color666 font-size24 mt40">注册成功后将自动登录</view>
		<view class="agree-box text-alignC">
			<checkbox class="inline-block" value="agree" :checked="checked" @tap="clickSelect" />
			<view class="inline-block">我同意</view>
			<view class="fc-normal inline-block" @tap="toWordInfo">《优佳护用户服务协议》</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			loading: false,
			res:'',
			codeTip: '获取验证码',
			codeTime: 0,
			codeTimer: null,
			register: [
				{
					id: 0,
					value: '',
					name: 'userName',
					placeholder: '请输入用户名',
					type: 'text',
					valid:false,
					validInfo:"用户名已被注册",
					bingoInput:false
				},
				{
					id: 1,
					value: '',
					name: 'password',
					placeholder: '设置密码（8-20位数字和字母组合）',
					type: 'password',
					showPsw:true
				},
				{
					id: 2,
					value: '',
					name: 'passwordConfirm',
					placeholder: '确认密码',
					type: 'password',
					showPsw:true,
				},
				{
					id: 3,
					value: '',
					name: 'phone',
					placeholder: '请输入手机号',
					type: 'text',
					valid:false,
					validInfo:"手机号不可用或已被注册",
					bingoInput:false
				},
				{
					id: 4,
					value: '',
					name: 'code',
					placeholder: '请输入验证码',
					type: 'code',
					bingoInput:false
				}
			],
			backMsg:'',
			disabledReg:true,
			check1:false,//状态：校验用户名
			check2:false,//状态：校验密码
			check3:false,//状态：校验确认密码
			check4:false,//状态：校验手机号
			check5:false,//状态：校验验证码 //暂不校验190510
			checked:true,
		}
	},
	onLoad() {
		
	},
	onShow() {
		this.calculateCodeTime()
	},
	computed:{
		regCheck(){
			let checked=''
			checked=this.check1&&this.check2&&this.check3&&this.check4
			console.log("当前是否校验通过",checked)
			return checked//为true则通过所有校验
		},
		username_input(){
			return this.register[0].value
		},
		phone_input(){
			return this.register[3].value
		},
	},
	watch:{
		regCheck(val){
			this.disabledReg=!this.regCheck
		},
		username_input(){
			let username_validate=this.$validate.v_username(this.register[0].value).then((val)=>{
				this.register[0].validInfo=val
				if(val=='用户名可用于注册'){
					this.register[0].valid=false
					this.register[0].bingoInput=true
					this.check1=true
				}else{
					this.register[0].valid=true
					this.register[0].bingoInput=false
					this.check1=false
				}
			})
		},
		phone_input(){
			let phone_validate=this.$validate.v_phone(this.register[3].value).then((val)=>{
				this.register[3].validInfo=val
				if(val=='手机号可用于注册'){
					this.register[3].valid=false
					this.register[3].bingoInput=true
					this.check4=true
				}else{
					this.register[3].valid=true
					this.register[3].bingoInput=false
					this.check4=false
				}
			})
		}
	},
	methods: {
		async blurName(index){//除密码的input框验证
		},
		blurPsw(index){//密码框验证
			if(index==1){
				let psw_validate=this.$validate.v_psw(this.register[1].value)
				if(psw_validate!='密码格式正确'){
					uni.showToast({
						title:'密码需要是8-20位数字和字母组合',
						icon:'none',
						mask:false,
					})
					this.check2=false
				}else{
					this.check2=true
				}
			}
			if(index==2){
				if (this.register[1].value!=this.register[2].value&&this.register[2].value!='') {
					uni.showToast({
						title:'密码和确认密码不一致',
						icon:'none',
						mask:false,
					})
					this.check3=false
					return false; 
				}else{
					this.check3=true
				}
			}
		},
		calculateCodeTime() {
			var codeTime = this.$store.state.codeTime
			console.log(codeTime)
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
		async regGetCode() {//获取验证码
			if(this.codeTip != '获取验证码'){
				return false
			}//拒绝再次请求
			let phone_validate=this.$validate.v_phone(this.register[3].value).then(async(val)=>{
				if(val=='手机号可用于注册'){
					this.$store.state.codeTime = new Date()
					this.codeCountDown()
					uni.showLoading({
						title: '请求中'
					})
					let res = await this.$api.regGetCode({phone: this.register[3].value});
					uni.hideLoading();
					let backData=JSON.parse(res["data"]).data
				}else{
					uni.showToast({
						title:val,
						icon:'none',
						mask:false
					})
				}
			})
        },
		async regFormSubmit(e) {//提交注册
				uni.showLoading({
					title: '正在注册'
				})
				let res = await this.$api.regFormSubmit(e.detail.value);
				uni.hideLoading();	
        },
		changeShowPsw(index){//密码明文密文
			this.register[index].showPsw=!this.register[index].showPsw
		},
		clickSelect(){//勾选协议
			this.checked=!this.checked
		},
		toWordInfo(){//协议跳转
			uni.navigateTo({
				url:'../../../packageA/WordInfo/index'
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
		padding: 20upx;
		background-color: #fff;
		.register-box {
			.code {
				padding-left: 10upx;
				border-left: 4upx solid #6e8cfa;
				font-size: 24upx;
				width: 150upx;
			}
		}
		.btn-area {
			margin-top: 50upx;
			button {
				width: 500upx;
			}
		}
	}
	.border-01 {
		border-bottom: 1px solid #eeeff3;
	}
	.agree-box {
		margin-top: 200upx;
		checkbox {
			margin-right: 20upx;
		}
	}
</style>