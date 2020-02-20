<template>
	<view>
		<title-card title="参保人信息">
			<template slot="content">
				<view class="flex-msg padding-20 bottom-20">
					<text>参保人</text>
					<text class="font-blue">请选择 ></text>
				</view>
			</template>
		</title-card>
		
		<title-card>
			<template slot="header">
				<text>联系信息<text class="font-blue font-small">（申请提交后，将指派护士上门评估，请填写真实的联系信息）</text></text>
			</template>
			<template slot="content">
				<view class="flex-msg padding-20 bottom-20">
					<view>
						<view class="contact">
							<text>联系人：王强</text>
							<text class="phone">联系电话：1581244554</text>
						</view>
						<view class="address">联系地址：湛江市徐文区中山六路234号</view>
					</view>
					<view class="arrow"></view>
				</view>
			</template>
		</title-card>
		
		<title-card>
			<template slot="header">
				<text>代理人信息<text class="font-blue font-small">（如果您帮他人申请，请填写以下信息）</text></text>
			</template>
			<template slot="content">
				<view class="">
					<view class="flex-msg padding-20 border-01">
						<view>联系人</view>
						<input class="tr" name="input" placeholder="请输入联系人" />
					</view>
					<view class="flex-msg padding-20 border-01">
						<view>关系</view>
						<input class="tr" name="input" placeholder="请输入和参保人的关系" />
					</view>
					<view class="flex-msg padding-20 border-01">
						<view>联系电话</view>
						<input class="tr" name="input" placeholder="请输入联系电话" />
					</view>
					<view class="flex-msg padding-20 border-01">
						<view>长护险通知告知书领取方式</view>
						<picker :range="wayColumn" @change="wayChange" :value="wayIdx" range-key="label">
							<view>{{wayColumn[wayIdx].label}}</view>
						</picker>
					</view>
				</view>
			</template>
		</title-card>
		
		<view class="button-area">
			<button>提交申请</button>
			<button class="saveBtn">保存草稿</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			wayIdx: 0,
			wayColumn: [
				{
					label: '邮寄',
					value: '0'
				},
				{
					label: '自取',
					value: '1'
				}
			]
		}
	},
	methods: {
		wayChange(e) {
			this.wayIdx = e.detail.value
		}
	},
}
</script>

<style lang="scss" scoped>
.font-small {
	font-size: 20rpx;
}
.phone {
	margin-left: 40rpx;
}
.address {
	margin-top: 10rpx;
}
.arrow {
	width: 30rpx;
	height: 30rpx;
	background-size: 30rpx;
}
.button-area {
	margin-top: 40rpx;
	.saveBtn {
		margin-top: 20rpx;
		background-color: #eeeff3;
		color: #6e8cfa;
		border: 1px solid #6e8cfa;
	}
}
</style>