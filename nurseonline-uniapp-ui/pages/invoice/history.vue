<template>
	<view>
		<template v-if="invoiceList.length > 0">
			<view class="flex-msg history-item border-10 padding-20" @tap="toDetail(item)" v-for="(item,index) in invoiceList" :key="index">
				<view class="item-left">
					<view class="">{{item.createTime}}</view>
					<view class="">{{invoiceType[item.invoiceMedia]}}<text class="font-blue">{{item.invoiceAmt}}元</text></view>
				</view>
				<view class="item-right align-center">
					<text>{{invoiceState[item.billState]}}</text>
					<text class="iconfont font-grey">&#xe6f8;</text>
				</view>
			</view>
		</template>
		<template v-else>
			<view class="tc padding-20">
				亲，你还没开过发票哟，返回到开票界面去开发票吧！
			</view>
		</template>
		
	</view>
</template>

<script>
import { getInvoiceList } from '@/common/api/invoice/invoice'
export default {
	data() {
		return {
			invoiceList: [],
			invoiceType: ['电子发票','纸质发票'],
			invoiceState: ['草稿','审核中','已开具','已拒绝']
		}
	},
	created() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			getInvoiceList().then(response => {
				let data = response.data
				if(data.msg === 'success'){
					this.invoiceList = data.data
				}
			})
		},
		toDetail(item) {
			uni.navigateTo({
				url: './detail?invoice=' + encodeURIComponent(JSON.stringify(item))
			})
		}
	},
}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.history-item{
		.item-left{
			line-height: 60rpx;
			.font-blue{
				margin-left: 40rpx;
			}
		}
		.item-right{
			.iconfont{
				font-size: 50rpx;
			}
		}
	}
</style>