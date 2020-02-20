<template>
	<view>
		<view class="padding-20 bg-white bottom-20">
			<text class="font-blue"># 您的预约已经提交成功！</text>
		</view>
		<view class="padding-20 bg-white justify-between">
			<view class="content-left">
				<view class="">订单号：1902270001</view>
				<view class="">服务机构：湛江市附属医院</view>
				<view class="">服务项目：上门换药</view>
				<view class="">服务对象：王燕</view>
			</view>
			<view class="flex-column justify-between content-right tr">
				<text class="font-blue"><text class="iconfont">&#xe835;</text>待服务</text>
				<view class="button-area">
					<button>查看预约详情</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {}
	}
}
</script>

<style lang="scss">
	.content-right{
		.iconfont{
			margin-right: 6rpx;
		}
		.button-area{
			button{
				width: 200rpx;
				height: 50rpx;
				line-height: 50rpx;
				font-size: 24rpx;
				border-radius: 6rpx;
				margin-bottom: 10rpx;
			}
		}
	}
</style>
