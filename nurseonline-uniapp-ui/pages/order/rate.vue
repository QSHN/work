<template>
	<view>
		<title-card title="本次服务满意度">
			<template slot="content">
				<view class="padding-20 rate-title align-center">
					<text class="title">请为本次服务评分</text>
					<uni-rate :value="form.starRating" @change="rateChange" :disabled="canRate"></uni-rate>
					<text class="font-grey rate-text">{{rateText}}</text>
				</view>
			</template>
		</title-card>
		<view class="bottom-20 padding-20 input-area">
			<textarea v-model="form.reviewText" placeholder="说说您对本次服务的体验,帮助我们为您提供更好的服务" :disabled="canRate"/>
		</view>
		<view class="button-area" v-if="!canRate">
			<button @tap="submit">发布</button>
		</view>
	</view>
</template>

<script>
let rateArr = ['非常不满意','不满意','一般','满意','非常满意']
import uniRate from "@/components/uni-rate/uni-rate.vue"
import { getBillRate,submitBillRate } from '@/common/api/bill/bill'
export default{
	data() {
		return {
			rateText: '非常满意',
			form: {
				reviewText: '',
				starRating: 5
			},
			canRate: false
		}
	},
	components: {uniRate},
	onLoad(e) {
		let bill = JSON.parse(e.bill)
		
		this.form = Object.assign({},this.form,{
			billId: bill.billId,
			custId: bill.custId
		})
		
		if(bill.reviewFlag == -1){
			this.canRate = false
		}
		else if(bill.reviewFlag > 0	){
			this.canRate = true
			this.fetchData()
		}
	},
	methods: {
		rateChange(e) {
			let idx = Number(e.value)
			// console.log(idx)
			this.rateText = rateArr[idx - 1]
			this.form.starRating = idx
		},
		submit() {
			// console.log(this.form)
			submitBillRate(this.form).then(response => {
				let data = response.data
				if(data.code === 0){
					uni.showToast({
						title: '评价成功！',
						complete: () => {
							setTimeout(() => {
								uni.navigateBack({
									delta: -1
								})
							},500)
						}
					})
				}
			})
		},
		fetchData(){
			getBillRate(this.form.billId).then(response => {
				let data = response.data
				if(data.msg === 'success'){
					this.form = Object.assign({},this.form,data.data[0])
				}
			})
		}
	}
}
</script>
<style lang="scss">
	page{
		background-color: #fff;
	}
	.rate-title{
		.title{
			margin-right: 20rpx;
		}
		.rate-text{
			font-size: 24rpx;
			margin-left: 10rpx;
		}
	}
	.input-area{
		textarea{
			width: 100%;
			border: 1px solid #c6c6c6;
		}
	}
</style>