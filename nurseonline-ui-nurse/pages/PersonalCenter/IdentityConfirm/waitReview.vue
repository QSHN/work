<template>
	<view class="">
		<view class="width100p text-alignC mt200-im"><text class="iconfont color6e8cfa font-size180 font-weight600">&#xe69d;</text></view>
		<view class="grace-idcard-text grace-idcard-alc color666 mt100p  padding-20">
							审核中···
		</view>
		<view class="grace-idcard-text grace-idcard-alc color666 mt100p  padding-20 textCenter">
							工作人员会根据您提交的信息进行审核，审核周期大概3个工作日，请耐心等待...
		</view>
		
		<view style="margin-top:38upx;">
			<button type="primary color6d8bf9" @tap="refresh">状态刷新</button>
		</view>
	</view>
</template>
	
<script>
	var myBaseUrl
	export default {
		data(){
			return{
				staffState:Number,
			}
		},
		onLoad() {
			this.reviewTrue()
			this.init()
			//uni.startPullDownRefresh();
		},
		
		async onPullDownRefresh() {
			console.log('refresh');
			let res_info=await this.$apip.getPersonalInfo()
			console.log(res_info.data.data.staffState)
			let value=res_info.data.data.staffState
			if(value==0){
				uni.showModal({
					title: '提示',
					content: '您当前未验证身份，请前往验证',
					success: function (res) {
						if (res.confirm) {
							uni.redirectTo({
								url:'../../PersonalCenter/IdentityConfirm/index'
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				}); 
			}else if(value==1){//跳转到正在审核
					//当前页不变
			}else if(value==2){//审核通过
				uni.reLaunch({
					url:'reviewPass'
				})
			}else if(value==3){//跳转到审核不通过
				uni.reLaunch({
					url:'reviewFail'
				})
			}
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			init(){
				//1.获取access_token、Info、myBaseUrl
				try {
					this.access_token= uni.getStorageSync('access_token');
					const Info = uni.getStorageSync('Info');
					if (Info) {
						this.staffState=Info.staffState
						console.log("当前审核状态",this.staffState)
					}
				} catch (e) {
					console.log(e)
				}
				myBaseUrl=this.$store.state.myBaseUrl	
				//2.
				
			},
			async refresh(){
				uni.showLoading({
				})
				console.log('refresh');
				let res_info=await this.$apip.getPersonalInfo()
				console.log(res_info.data.data.staffState)
				let value=res_info.data.data.staffState
				uni.hideLoading()
				if(value==0){
					uni.showModal({
						title: '提示',
						content: '您当前未验证身份，请前往验证',
						success: function (res) {
							if (res.confirm) {
								uni.redirectTo({
									url:'../../PersonalCenter/IdentityConfirm/index'
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					}); 
				}else if(value==1){//跳转到正在审核
						//当前页不变
				}else if(value==2){//审核通过
					uni.reLaunch({
						url:'reviewPass'
					})
				}else if(value==3){//跳转到审核不通过
					uni.reLaunch({
						url:'reviewFail'
					})
				}
			},
			reviewTrue:function(){
			},
			reviewFalse:function(){
				uni.redirectTo({
					url:'reviewFail'
				})
			}
		}
	}
</script>

<style>
	.textCenter{
		width: 80%;
		margin:0 auto;
	}
	page{
		overflow: hidden;
	}
</style>
