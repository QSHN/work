<template>
	<view class="border-20">
		<view class="align-center padding-20 package-box bottom-20 bg-white">
			<view>
				<image :src="service.imgUrl" mode="widthFix" v-if="service.imgUrl"/>
				<image src="/static/service_default.jpg" mode="widthFix" v-else/>
			</view>
			<view class="flex flex-column message-content">
				<text class="title">{{service.serviceLabel || ''}}</text>
				<text>{{service.serviceCaption || ''}}</text>
            	<text>金额：<text class="price">{{priceAdjust || 0}}元/{{service.unit || ''}}</text></text>
			</view>
		</view>
		
		<view class="button-area bottom-20">
			<button @click="orderSubmit">立即购买</button>
		</view>
		
		<template v-if="detailList.length > 0">
			<title-card title="服务项目介绍">
				<template slot="content">
					<view class="padding-20 message-box">
						<view v-for="(item,index) in detailList" :key="index">
							<text>{{item.serviceLabel}}：{{item.serviceCaption}}</text>
						</view>
					</view>
				</template>
			</title-card>
		</template>
		
		<template v-if="detailList.length > 0 || (detail && detail.guide)">
			<title-card title="服务提示">
				<template slot="content">
					<view class="padding-20 message-box">
						<template v-if="detailList.length > 0">
							<view v-for="(item,index) in detailList" :key="index" class="bottom-20">
								<view>{{item.serviceLabel}}：</view>
								<view>
									<text>{{item.guide}}</text>
								</view>
							</view>
						</template>
						<template>
							<text>{{detail.guide}}</text>
						</template>
					</view>
				</template>
			</title-card>
		</template>
		
		<template v-if="detailList.length > 0 || (detail && detail.caution)">
			<title-card title="温馨提示">
				<template slot="content">
					<view class="padding-20 message-box">
						<template v-if="detailList.length > 0">
							<view v-for="(item,index) in detailList" :key="index" class="bottom-20">
								<view>{{item.serviceLabel}}：</view>
								<view>
									<text>{{item.caution}}</text>
								</view>
							</view>
						</template>
						<template>
							<text>{{detail.caution}}</text>
						</template>
					</view>
				</template>
			</title-card>
		</template>
		
		<title-card title="平台优势">
			<template slot="content">
				<view class="justify-around">
					<view class="flex-column flex-center server-box" v-for="(item,index) in list" :key="index">
						<!-- <image src="../../static/service_02.png" mode="widthFix" /> -->
						<image :src="'/static/introduce_0' + (index + 1) + '.jpg'" mode="widthFix" />
						<text>{{item.text}}</text>
						<text>{{item.desc}}</text>
					</view>
				</view>
			</template>
		</title-card>
		
		<title-card title="退约或修改">
			<template slot="content">
				<view class="padding-20 message-box">
					<view>1. 预约成功后个人原因取消订单，将收取30%的服务费</view>
					<view>2. 如需修改请提前3小时通知护士，护士出发后取消订单，将收取70%的服务费。</view>
				</view>
			</template>
		</title-card>
			
	</view>
</template>

<script>
import { getVipCert } from '@/common/api/account/account'
import { validatenull } from '@/common/utils/util'
import { getOrgServiceDetail,getServiceDetail,getPackageDetail } from '@/common/api/service/service'
export default {
	data() {
		return {
			list: [
				{
					text: '执业护士',
					desc: '专业服务'
				},
				{
					text: '医患投保',
					desc: '全程安心'
				},
				{
					text: '专业团队',
					desc: '随时售后'
				}
			],
			detail: {},
			service: {},
			testTxt: '',
			detailList: [],
			priceAdjust:0,
		}
	},
	onLoad(e) {
		let service = JSON.parse(decodeURIComponent(e.service))
		this.service = Object.assign({},service)
		this.priceAdjust=e.priceAdjust
		console.log('service',service)
		console.log("this.priceAdjust",this.priceAdjust)
		uni.setNavigationBarTitle({
			title: service.serviceLabel
		})

		if(service.itemFlag === '1'){
			getPackageDetail(service.orgServiceId).then(response => {
				this.detailList = response.data.data
			})
		}
		else{
			getServiceDetail(service.serviceId).then(response => {
				this.detail = Object.assign({},response.data.data)
			})
		}

	},
	onShow() {
		if(!validatenull(this.service)){
			getOrgServiceDetail(this.service.orgServiceId).then(({data}) => {
				if(data.code === 0){
					this.service = Object.assign({},this.service,data.data)
				}
			})
		}
	},
	methods: {
		orderSubmit() {
			getVipCert().then(({data}) => {
				if((data.msg === 'success' && data.data) || this.service.exclusive == '1'){
					uni.navigateTo({
						url: './submit?service=' + encodeURIComponent(JSON.stringify(this.service))
					})
				}
				else{
					uni.showModal({
						// showCancel: false,
						title: '提示',
						content: '您还未认证，需要认证才可以下单',
						confirmColor: '#6E8CFA',
						success: res => {
							if(res.confirm){
								uni.navigateTo({
									url: '/pages/user/identity'
								})
							}
						}
					})
				}
			})
			
		}
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
	.message-box {
		line-height: 50rpx;
	}
</style>