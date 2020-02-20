<template>
	<view>
		<form @submit="formSubmit">
			<view class="wraperView">
				<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(user,propIndex) in userInfo" :key="propIndex" @tap="settingTo(propIndex)">
					
					<view>
						{{user.label}}
						<text v-if="propIndex==2&&bindOrUnbind" class="color6e8cfa">（未绑定）</text>
						<text v-else-if="propIndex==2&&!bindOrUnbind" class="color6e8cfa">（已绑定）</text>
					</view>
					<view>
						<text v-if="propIndex==2&&bindOrUnbind" class="color-fff bgc-6e8cfa boder-radius10 padding-0-10">绑定微信</text>
						<text v-else-if="propIndex==2&&!bindOrUnbind" class="color-fff bgc-6e8cfa boder-radius10 padding-0-10">解绑微信</text>
						<text v-if="propIndex!=2" class="iconfont">&#xe6f8;</text>
					</view>
				</view>
			</view>
			<view class="btn-area">
				<button formType="submit" @tap="logOut" class="bgc-6e8cfa">退出登录</button>
			</view>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			sexIdx: "0",
			date: '1949-10-01',
			userInfo: [
				{
					label: '修改密码',
					prop: 'height',
					type: 'text',
					placeholder: ''
				},
				{
					label: '手机号绑定',
					prop: 'height',
					type: 'text',
					placeholder: ''
				},
				{
					label: '微信号绑定',
					prop: 'height',
					type: 'text',
					placeholder: ''
				},
				{
					label: '用户服务协议',
					prop: 'weight',
					type: 'text',
					placeholder: ''
				},
				{
					label: '关于我们',
					prop: 'username',
					type: 'text',
					placeholder: ''
				},
			],
			wxOpenId:'',
			bindOrUnbind:true,//true:去绑定；false:去解绑
		}
	},
	onLoad(option) {
		this.init()
	},
	computed:{
		settingRefresh(){
			return this.$store.state.settingRefresh
		}
	},
	watch:{
		settingRefresh(){
			console.log("我监听到了settingRefresh状态的变化",this.$store.state.settingRefresh)
			this.init()//进行刷新 预约单相关状态刷新
		}
	},
	methods: {
		async init(){
			uni.showLoading({});
			try{
				let userinfo=await this.$apip.userinfo()
				this.wxOpenid=userinfo.data.data.sysUser.wxOpenid
				this.$store.state.userPhone=userinfo.data.data.sysUser.phone
				console.log(userinfo.data.data.sysUser.wxOpenid)
				if(this.wxOpenid==null||this.wxOpenid.length<1){
					this.bindOrUnbind=true//去绑定
				}else{
					this.bindOrUnbind=false//去解绑
				}
			}catch(e){
				//TODO handle the exception
				uni.showToast({
					title: '错误信息'+e,
					icon:'none'
				});
			}
			uni.hideLoading()
		},
		sexChange(e) {
			this.sexIdx = e.detail.value
		},
		dateChange(e) {
			this.date = e.detail.value
		},
		async settingTo(propIndex){
			if(propIndex==0){
				this.$store.state.resetPsw=1
				uni.navigateTo({
					url:'../../pages/Login/change-pwd/index'
				})
			}
			if(propIndex==1){
				this.$store.state.resetPsw=1
				uni.navigateTo({
					url:'oldPhoneConfirm'
				})
			}
			if(propIndex==2){
				if(this.bindOrUnbind){//去绑定
					console.log('去绑定')
					try{
						let res=await this.$api.wechatBindGetCode()
						this.$store.state.wechatLoginCodeType=0
						uni.navigateTo({
							url:'../../pages/Login/third-login/bindCode'
						})
					}catch(e){
						//TODO handle the exception
						uni.showToast({
							title:e.data.msg,
							icon:'none'
						});
					}
				}else{//去解绑
					console.log('去解绑')
					try{
						let res=await this.$api.unWechatBindGetCode()
						this.$store.state.wechatLoginCodeType=1
						uni.navigateTo({
							url:'../../pages/Login/third-login/bindCode'
						})
					}catch(e){
						//TODO handle the exception
						uni.showToast({
							title:e.data.msg,
							icon:'none'
						});
					}
				}	
			}
			if(propIndex==3){
				uni.navigateTo({
					url:'../WordInfo/index'
				})
			}
			if(propIndex==4){
				uni.showToast({
					title:'未发布',
					icon:'none'
				})
				// uni.navigateTo({
				//  	url:'../WordInfo/aboutUs'
				// })
			}
		},
		async logOut(){
			let res=await this.$api.logOut()
			if(res.data.code==0){
				uni.reLaunch({
					url:'../../pages/launch'
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.padding{
		padding: 20upx;
	}
	.bottom-20{
		margin-bottom: 20upx;
	}
	.bottom-01{
		margin-bottom: 2upx;
	}
	.avatar-box{
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		overflow: hidden;
		border:1px solid #ccc;
		padding:20rpx;
		image{
			width: 100%;
		}
	}
	.btn-area{
		margin-top: 40upx;
		button{
			width: 90%;
			background-color: #00b28e;
			border-color: #75d4c0;
			color: #fff;
			border-radius: 10upx;
		}
	}
	.to{flex-shrink:0;width:40upx;height:28upx}
</style>
