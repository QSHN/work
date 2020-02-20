<template>
	<view>
		<view class="bottom-20">
			<view class="flex-msg padding-20 bg-white bottom-01">
				<text>订单金额</text>
				<text>¥ {{paymentAmt}}</text>
			</view>
			<view class="tr bg-white padding-20">
				<text>应付金额：<text class="font-red">¥ {{paymentAmt}}</text></text>
			</view>
		</view>
		<view class="flex-msg bg-white padding-20">
			<view class="pay-area align-center">
				<text class="iconfont">&#xe607;</text>
				<text>微信支付</text>
			</view>
			<text class="iconfont">&#xe63a;</text>
		</view>
		<view class="button-area">
			<button @tap="pay">立即支付 ¥ {{paymentAmt}}</button>
		</view>
	</view>
</template>
<script>
import { followUpBillPay } from '@/common/api/follow'

export default {
	data() {
		return {
			billId: '',
			paymentAmt: 0.00
		}
	},
	onLoad(e) {
		this.billId = e.billId
		this.paymentAmt = e.paymentAmt
	},
	methods: {
		pay() {
			(async () => {
				let loginData = await new Promise((resolve,reject) => {
					uni.login({
						success: response => {
							resolve(response)
						},
						fail: () => {
							reject()
						}
					})
				})
				
				let payData = await new Promise((resolve,reject) => {
					followUpBillPay({
						body: '服务工单支付',
						billId: this.billId,
						code: loginData.code
					}).then(response => {
						resolve(response.data)
					})
				})
				
				let wxPay = await new Promise((resolve,reject) => {
					let params = JSON.parse(payData.data)
					uni.requestPayment({
						provider: 'wxpay',
						...params,
						success: response => {
							uni.showToast({
								title: '支付成功！',
								icon: 'success',
								mask: true
							})
							setTimeout(() => {
								uni.redirectTo({
									url: '../../pages/followUp/detail?billId=' + this.billId
								})
							},500)
						}
					})
				})
			})();
		}
	}
}
</script>
<style lang="scss">
	.iconfont{
		color: #09BB07;
		font-size: 42rpx;
	}
	.pay-area{
		.iconfont{
			margin-right: 20rpx;
		}
	}
	.button-area{
		margin-top: 40rpx;
	}
</style>