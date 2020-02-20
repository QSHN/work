<template>
	<view>
		<view class="padding-20 bg-white order-item border-01" v-for="(item,index) in bills" :key="index">
			<view>订单号：{{item.billId}}</view>
			<view class="justify-between">
				<text>订单日期：{{item.billDate}}</text>
				<text>开票金额：<text class="font-blue">{{item.billAmt}}</text>元</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			bills: []
		}
	},
	onLoad(e) {
		this.bills = JSON.parse(e.bills)
	}
}
</script>

<style lang="scss">
	.order-item{
		line-height: 60rpx;
	}
</style>
