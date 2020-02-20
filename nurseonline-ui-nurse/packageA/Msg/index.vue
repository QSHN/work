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
				<text class="msg">附近有103名需要医护帮助的用户，</text>
				<text class="msg">快去接单吧。</text>
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
		padding: 20upx;
	}
	
	.message-icon {
		width: 75upx;
		height: 75upx;
		margin-right: 20upx;
		background-size:300px;
		background-position:2px 91.8%;
		&.read {
			background-position:2px 89.7%;
		}
	}
	
	.message-content{
		margin-left: 20upx;
		.type{
			color: #3e3a39;
			font-size:30rpx;
			font-weight:600;
		}
		.grey {
			color: #b5b5b6;
			font-size: 24upx;
		}
		.msg {
			font-size: 26upx;
		}
	}
</style>
/*拖欠工资快半年了20190709*/