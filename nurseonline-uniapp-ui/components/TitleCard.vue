<template>
	<view>
		<view class="title-box">			
			<view class="title-area ">
				<slot name="header"><text>{{title}}</text></slot>
			</view>		
		</view>
		<view class="bg-white">
			<slot name="content"></slot>
		</view>
	</view>
</template>

<script>
export default {
	name: 'TitleCard',
	data() {
		return {}
	},
	props: {
		title: {
			type: String,
			default: ''
		},
	},
}
</script>

<style lang="scss" scoped="">
	.title-box {
		padding: 20rpx;
		.title-area {
			padding-left: 20rpx;
			border-left: 8rpx solid #6e8cfa;
			font-size: 30rpx;
			font-weight: 600;
			color: #3e3a39;
		}
	}
</style>
