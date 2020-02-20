<template>
	<view>
		<view class="flex-msg history-item bottom-20 padding-20 bg-white" v-if="invoice.billState === 2">
			<view class="item-left">
				<view>发票已开</view>
				<view class="font-grey">{{invoice.createTime}}</view>
			</view>
			<view class="item-right align-center" @tap="preview">
				<text>查看</text>
				<text class="iconfont font-grey">&#xe6f8;</text>
			</view>
		</view>
		<view class="bottom-20 bg-white">
			<title-card title="发票信息">
				<template slot="content">
					<view class="padding-0-20">
						<view class="align-center padding-20-0 detail-item border-01">
							<text class="label font-grey">发票抬头</text>
							<view>{{invoice.invoiceTitle}}</view>
						</view>
						<view class="align-center padding-20-0 detail-item border-01">
							<text class="label font-grey">税号</text>
							<view>{{invoice.invoiceTaxNo}}</view>
						</view>
						<view class="align-center padding-20-0 detail-item border-01">
							<text class="label font-grey">发票内容</text>
							<view>{{invoice.invoiceContent}}</view>
						</view>
						<view class="align-center padding-20-0 detail-item border-01">
							<text class="label font-grey">发票金额</text>
							<view><text class="font-blue">{{invoice.invoiceAmt}}</text>元</view>
						</view>
						<view class="align-center padding-20-0 detail-item border-01">
							<text class="label font-grey">申请时间</text>
							<view>{{invoice.submitTime}}</view>
						</view>
					</view>
				</template>
			</title-card>
		</view>
		<view class="flex-msg history-item bottom-20 padding-20 bg-white">
			<view class="item-left">
				<view>1张发票，含{{bills.length}}个订单</view>
				<view class="font-grey">{{invoice.submitTime}}</view>
			</view>
			<view class="item-right align-center" @tap="toOrders">
				<text>查看</text>
				<text class="iconfont font-grey">&#xe6f8;</text>
			</view>
		</view>
	</view>
</template>

<script>
import { getInvoiceBills } from '@/common/api/invoice/invoice'
export default {
	data() {
		return {
			invoice: {},
			bills: []
		}
	},
	onLoad(e) {
		this.invoice = Object.assign({},JSON.parse(decodeURIComponent(e.invoice)))
		this.fetchData()
	},
	methods: {
		fetchData() {
			getInvoiceBills(this.invoice.invoiceId).then(response => {
				let data = response.data
				if(data.msg === 'success'){
					this.bills = data.data
				}
			})
		},
		toOrders() {
			uni.navigateTo({
				url: './orders?bills=' + JSON.stringify(this.bills)
			})
		},
		preview() {
			uni.previewImage({
				urls: [ this.invoice.fileUrl ]
			})
		}
	},
}
</script>

<style lang="scss">
	.history-item{
		.item-left{
			line-height: 60rpx;
			.font-grey{
				font-size: 24rpx;
			}
		}
		.item-right{
			.iconfont{
				font-size: 50rpx;
			}
		}
	}
	.detail-item{
		.label{
			width: 150rpx;
		}
	}
	
</style>