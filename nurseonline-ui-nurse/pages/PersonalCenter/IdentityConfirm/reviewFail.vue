<template>
	<view>
		<view class="width100p text-alignC mt200-im"><text class="iconfont color6e8cfa font-size180">&#xe61c;</text></view>
		<view class="grace-idcard-text grace-idcard-alc color666 mt100p  padding-20">
							审核不通过
		</view>
		<view class="grace-idcard-text grace-idcard-alc color-red mt100p  padding-20" v-if="rejectErrorText != ''">
			驳回理由：{{ rejectErrorText }}
		</view>
		<view class="grace-idcard-text grace-idcard-alc color666 mt100p  padding-20 textCenter">
							抱歉，您未通过优佳护的职业认证。
		</view>
		<view class="grace-idcard-text grace-idcard-alc color666 mt100p  padding-20 textCenter">
							<!-- 原因：在护士注册网中查不到你的相关信息。 -->
		</view>
		
		<view style="margin-top:38upx;">
			<button type="primary color6d8bf9" @tap="reviewTrue">重新验证身份</button>
		</view>
		<view style="margin-top:38upx;">
			<button open-type="contact" type="primary color6d8bf9" class="see-btn">联系客服</button>
		</view>
	</view>
</template>
	
<script>
	export default {
		data(){
			return{
				phoneNumber_g:'',
				rejectErrorText: ''
			}
		},
		onLoad(){
			this.init()
		},
		methods: {
			async init(){
				this.phoneNumber_g=this.$store.state.servePhone//转wx-contact
				let userInfo = uni.getStorageSync('Info_init')
				let res = await this.$api.getFeedbackMessage(userInfo.staffId)
				let resjectList = res.data.data
				let resjecError = ''
				for (const item of resjectList) {
					if (item.reason) {
						if (resjecError != '') {
							resjecError += '，'
						}
						resjecError += item.reason
					}
				}
				
				this.rejectErrorText = resjecError
			},
			reviewTrue:function(){
				uni.redirectTo({
					url:'index'
				})
			},
			reviewFalse:function(){
				uni.makePhoneCall({
					phoneNumber: this.phoneNumber_g 
				});
			}
		}
	}
</script>

<style>
	.textCenter{
		width: 75%;
		margin:0 auto;
	}	
	page{
		overflow: hidden;
	}
</style>
