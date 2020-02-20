<template>
	<view>
		<checkbox-group class="invoice-box" @change="billSelect" v-if="bills.length > 0">
			<view class="align-center padding-20 bg-white border-01 invoice-item" v-for="(item,index) in bills" :key="index">
				<label class="checkbox">
					<checkbox :value="index" :checked="item.checked"/>
				</label>
				<view class="item-right">
					<view>单号：{{item.billId}}</view>
					<view class="justify-between">
						<view class="">日期：{{item.createTime}}</view>
						<view class="">金额：<text class="font-blue">{{item.paymentAmt}}元</text></view>
					</view>
				</view>
			</view>
		</checkbox-group>
		<view class="padding-20 tc" v-else>
			暂无可开票的订单
		</view>
		<view class="invoice-bottom justify-between">
			<view class="padding-10 bottom-left">
				<checkbox-group @change="selectChange">
					<label class="checkbox">
						<checkbox value="0" :checked="checkedAll"/>全选
					</label>
				</checkbox-group>
				<view class=""><text class="font-blue">{{count}}</text>个订单，共<text class="font-blue">{{total}}</text>元（满500元包邮）</view>
			</view>
			<button class="next-button bg-normal tc" @tap="issue" :disabled="nxtBtn">下一步</button>
		</view>
	</view>
</template>

<script>
import { getNoInvoiceBills } from '@/common/api/invoice/invoice'
export default {
	data() {
		return {
			bills: []
		}
	},
	onShow() {
		getNoInvoiceBills().then(response => {
			let bills = response.data.data
			bills.map((value,index) => {
				bills[index] = Object.assign({},value,{checked: false})
			})
			this.bills = bills
		})
	},
	computed: {
		checkedAll() {
			let bills = this.bills
			let checked = bills.find(value => {
				return value.checked === false
			})
			
			return checked === undefined
		},
		billChecked() {
			let bills = this.bills
			let billChecked = bills.filter(value => {
				return value.checked === true
			})
			return billChecked
		},
		billIds() {
			let billIds = []
			this.billChecked.map(value => {
				billIds.push(value.billId)
			})
			return billIds
		},
		total() {
			let total = 0
			
			this.billChecked.map(value => {
				total += value.paymentAmt
			})
			return total
		},
		count() {
			return this.billChecked.length
		},
		nxtBtn() {
			return this.billIds.length <= 0
		}
	},
	methods: {
		billSelect(e) {
			let idxArr = e.detail.value
			let bills = this.bills
			
			for(let i=0; i<bills.length; i++){
				bills[i].checked = false
				for(let j=0; j<idxArr.length; j++){
					if(i == idxArr[j]){
						bills[i].checked = true
					}
				}
			}
			
			this.bills = bills
		},
		selectChange(e) {
			let bills = this.bills
			let selectAll = e.detail.value.length > 0
			bills.map((value,index) => {
				bills[index].checked = selectAll
			})
			
			this.bills = bills
		},
		issue() {
			uni.navigateTo({
				url: './issue?billIds=' + JSON.stringify(this.billIds) + '&total=' + this.total
			})
		}
	},
}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.invoice-box{
		.invoice-item{
			.checkbox{
				width: 50rpx;
				checkbox .wx-checkbox-input{
					border-radius: 50%;
				}
			}
			.item-right{
				margin-left: 10rpx;
				flex: auto;
				line-height: 50rpx;
			}
		}
	}
	.invoice-bottom{
		width: 100%;
		height: 130rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		.bottom-left{
			flex: auto;
			border-top: 1px solid #eeeff3;
			line-height: 50rpx;
			checkbox{
				margin-right: 10rpx;
				.wx-checkbox-input{
					margin-top: -8rpx;
					border-radius: 50%;
				}
			}
		}
		.next-button{
			color: #fff;
			line-height: 130rpx;
			width: 200rpx;
			border-radius: 0;
			&[disabled]{
				color: #fff;
			}
		}
	}
</style>