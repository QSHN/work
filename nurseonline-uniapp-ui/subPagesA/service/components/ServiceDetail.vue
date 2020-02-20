<template>
	<view>
		<view class="align-center padding-20 package-box bottom-20 bg-white">
			<view>
				<image src="../../static/service_02.png" mode="widthFix"/>
			</view>
			<view class="flex flex-column message-content">
				<text class="title">口腔护理</text>
				<text>长期卧病、口腔疾病、生活不能自理患者</text>
				<text>服务费：<text class="price">100元/次</text></text>
			</view>
		</view>
		<view class="button-area bottom-20">
			<button @click="pay">立即购买</button>
		</view>
		<title-card title="服务项目介绍">
			<template slot="content">
				<view class="padding-20">
					<view class="">静脉采血：提供静脉采血服务</view>
					<view class="">普通换药：提供换药服务，包括检查伤口、清洗伤口等</view>
					<view class="">口腔护理：提供静脉采血服务</view>
				</view>
			</template>
		</title-card>
		
		<title-card title="服务提示">
			<template slot="content">
				<view class="padding-20">
					<view class="">用户必须具备正规医疗机构开具的处方、药品及病历</view>
					<view class="">用户必须具备正规医疗机构开具的处方、药品及病历</view>
				</view>
			</template>
		</title-card>
		
		<title-card title="温馨提示">
			<template slot="content">
				<view class="padding-20">
					<view class="">用户必须具备正规医疗机构开具的处方、药品及病历</view>
					<view class="">用户必须具备正规医疗机构开具的处方、药品及病历</view>
				</view>
			</template>
		</title-card>
		
		<title-card title="平台优势">
			<template slot="content">
				<view class="justify-around">
					<view class="flex-column flex-center server-box" v-for="(item,index) in list" :key="index">
						<image src="../../static/service_02.png" mode="widthFix" />
						<text>{{item.text}}</text>
						<text>{{item.desc}}</text>
					</view>
				</view>
			</template>
		</title-card>
		
		<title-card title="退约或修改">
			<template slot="content">
				<view class="padding-20">
					<view class="">用户必须具备正规医疗机构开具的处方、药品及病历</view>
					<view class="">用户必须具备正规医疗机构开具的处方、药品及病历</view>
				</view>
			</template>
		</title-card>
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
	.package-box {
		image {
			width: 120rpx;
		}
		.message-content {
			margin-left: 20rpx;
			line-height: 45rpx;
			.title {
				color: #3e3a39;
				font-weight: 600;
			}
			.price {
				color: #6E8CFA;
				font-size: 32rpx;
				font-weight: 600;
			}
		}
	}
	.server-box{
		width: 32%;
		padding: 10rpx;
		box-sizing: border-box;
		image {
			width: 130rpx;
		}
	}
</style>