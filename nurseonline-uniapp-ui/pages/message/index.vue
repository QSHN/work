<template>
	<view>
		<view class="all-read tr padding">
			<text>全部已读</text>
		</view>
		<view class="bottom-01 padding bg-white align-center">
			<view class="message-icon icon-02 read"></view>
			<view class="flex flex-column message-content">
				<text class="type">普通消息</text>
				<text class="date grey">02-26</text>
				<text class="msg">附近有103名专业护士恭候着您呢，</text>
				<text class="msg">请您在30分钟内完成支付。</text>
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
	.padding{
		padding: 20rpx;
	}
	
	.message-icon {
		width: 75rpx;
		height: 75rpx;
		margin-right: 20rpx;
		background-size:300px;
		background-position:2px 91.8%;
		&.read {
			background-position:2px 89.7%;
		}
	}
	
	.message-content{
		margin-left: 20rpx;
		.type{
			color: #3e3a39;
			font-size:30rpx;
			font-weight:600;
		}
		.grey {
			color: #b5b5b6;
			font-size: 24rpx;
		}
		.msg {
			font-size: 26rpx;
		}
	}
</style>