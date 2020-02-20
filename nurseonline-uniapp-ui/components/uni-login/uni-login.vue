<template name="uni-login">
	<view>
	<uni-popup ref="popup" type="center" :maskClick="false">
		<view class="popup">
			<view class="content">
				<text class="text">提示</text>
				<text class="text">未登录,点击确定去登录</text>
			</view>
			<view class="footer">
				<text class="text" @tap="closePopup">取消</text>
				<button class="btn-text" @getuserinfo="confirmPopup" open-type="getUserInfo">确定</button>
			</view>
		</view>
	</uni-popup>
	</view>
</template>

<script>
	import { utilToast } from '@/common/utils/util'
	import { empowerAsVip } from '@/common/api/user'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	
	export default{
		name: "uni-login",
		data(){
			return{
				autoRegLogin: false,
				repeatNum:0,
			}
		},
		components: {
			uniPopup,
		},
		methods:{
			onPopup(bool){
				if(bool){
					this.$refs.popup.open()
				}else{
					this.$refs.popup.close()
				}
			},
			closePopup() {
				let pages = getCurrentPages();
				let pagesLen = pages.length;
				let route = pages[pagesLen-1].route;
				console.log(route)
				if(route == 'pages/tab/home'){
					this.onPopup(false)
				}else{
					uni.switchTab({
						url: '/pages/tab/home'
					})
				}
			},
			//获取微信用户信息
			confirmPopup(e){
				if(e.detail.userInfo){
					this.getEncryptedData(e.detail);
				}
			},
			getEncryptedData(data){
				let { encryptedData,iv } = data
				if(encryptedData){
					uni.login({
						success: res => {
							this.$refs.popup.close();
							let params = {
								code: res.code,
								encryptedData: encryptedData,
								iv: iv
							}
							this.switchToHome(['LoginByWechat',params])
						}
					})
				}
			},
			switchToHome(params) {
				this.$store.dispatch(...params).then(response => {
					if(response.access_token){
						uni.setStorage({
							key:'loginPhone',
							data:params[1],
						})
						uni.navigateTo({
							url: '/pages/login/index?islogin=1'
						})
					}
				}).catch(({data}) => {
					if(Boolean(data) == false){
						this.repeatNum++;
						if(this.repeatNum <= 1){
						  uni.getUserInfo({
							provider: 'weixin',
							success: (infoRes) => {
							  this.getEncryptedData({encryptedData:infoRes.encryptedData, iv:infoRes.iv});
							}
						  });
						}
					}else if(data.msg === '用户不存在'){
						uni.setStorage({
							key:'loginPhone',
							data:params[1],
						})
						uni.navigateTo({
							url: '/pages/login/index'
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.popup {
		background-color: #fff;
		border-radius: 10rpx;
	
		.content {
			padding: 50rpx 100rpx;
	
			.text {
				text-align: center;
				display: block;
			}
	
			.text:nth-child(1) {
				font-size: 38rpx;
				color: #222222;
			}
	
			.text:nth-child(2) {
				margin-top: 30rpx;
				font-size: 35rpx;
				color: #999999;
			}
		}
	
		.footer {
			border-top: 1px solid #EBEBEB;
			display: flex;
			.text {
				color: #000000;
				padding: 30rpx 0;
				display: block;
				flex: 1;
				font-size: 42rpx;
				text-align: center;
				border-right: 1px solid #EBEBEB;
			}
			.btn-text{
				flex: 1;
				color: #576B95;
				width: inherit;
				line-height: normal;
				margin:0;
				padding:30rpx 0;
				background:inherit;
				box-sizing: inherit;
				font-size: 42rpx;
			}
			.btn-text:after{
				content: none;
			}
		}
	}
</style>