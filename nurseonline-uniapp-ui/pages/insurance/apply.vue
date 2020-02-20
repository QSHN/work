<template>
	<view>
		<view class="image-area">
			<image src="../../static/banner.jpg" mode="widthFix" />
		</view>
		<title-card title="申请流程">
			<template slot="content">
				<view class="flow-area">
					<image src="../../static/flow.png" mode="widthFix" />
				</view>
			</template>
		</title-card>
		<title-card title="申请条件">
			<template slot="content">
				<view style="height: 100px;"></view>
			</template>
		</title-card>
		<title-card title="报销标准">
			<template slot="content">
				<view style="height: 100px;"></view>
			</template>
		</title-card>
		<view class="button-area">
			<button @tap="toApply">申请</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {}
	},
	methods: {
		toApply() {
			uni.redirectTo({
				url: './people'
			})
		}
	}
}
</script>

<style lang="scss">
.image-area {
	width: 100%;
	image {
		width: 100%;
	}
}
.flow-area {
	padding: 10rpx;
	image {
		width: 80%;
	}
}
.button-area {
	margin-top: 30rpx;
}
</style>