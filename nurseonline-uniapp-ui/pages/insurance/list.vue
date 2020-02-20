<template>
	<view>
		<view class="bg-white bottom-20">
			<view class="search-area flex padding-20">
				<view class="search-box align-center">
					<text class="iconfont">&#xe741;</text>
					<input type="text" value="" placeholder="参保人"/>
				</view>
				<view class="button-area">
					<button>搜索</button>
				</view>
			</view>
			<view class="tab-area bg-white flex">
				<view class="tab-item tc" v-for="(tab,tIdx) in tabList" :key="tIdx" :class="{'isActive': tabIndex === tIdx}" @tap="changeTab(tIdx)">{{tab}}</view>
			</view>
		</view>
		<view class="bottom-01 padding-20 bg-white">
			<view class="justify-between apply-top">
				<text class="font-deep">申请时间：2019年2月28日 13:30</text>
				<text class="font-red"><text class="iconfont">&#xe835;</text>待审核</text>
			</view>
			<view class="flex-msg apply-bottom">
				<view>
					<view>参保人：王伯伯</view>
					<view>身份证号：450805xxxxxxx4545</view>
				</view>
				<view class="button-area">
					<button class="transparent">撤销</button>
					<button>提交</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabIndex: 0,
			tabList: ['全部','待提交','待审核','审核通过','审核不通过']
		}
	},
	methods: {
		changeTab(idx) {
			this.tabIndex = idx
		}
	},
}
</script>

<style lang="scss">
	.search-area{
		.search-box{
			box-sizing: border-box;
			height: 70rpx;
			border: 1px solid #b7b7b7;
			border-radius: 8rpx;
			flex: 2.5;
			padding-left: 10rpx;
			input {
				margin-left: 10rpx;
				width: 88%;
			}
		}
		.button-area{
			flex: 1;
			box-sizing: border-box;
			height: 70rpx;
			button {
				height: 70rpx;
				line-height: 70rpx;
			}
		}
	}
	.tab-area{
		margin-bottom: 10rpx;
		.tab-item{
			flex: 1;
			padding: 16rpx 0;
			&.isActive{
				border-bottom: 4rpx solid #6E8CFA;
			}
		}
	}
	.apply-top{
		border-bottom: 1px solid #ccc;
		padding-bottom: 10rpx;
		.iconfont{
			margin-right: 10rpx;
		}
	}
	.apply-bottom{
		padding-top: 20rpx;
		line-height: 60rpx;
		.button-area{
			button{
				width: 120rpx;
				height: 50rpx;
				line-height: 50rpx;
				font-size: 24rpx;
				border-radius: 6rpx;
				margin-bottom: 10rpx;
			}
		}
	}
</style>