<template>
	<view>
		<view class="padding-20 border-20">
			<view class="">订单号：{{bill.billId}}</view>
			<view class="">服务机构：{{bill.orgName}}</view>
			<view class="">服务项目：{{bill.serviceLabel}}</view>
			<view class="">服务对象：{{bill.custName || ''}}</view>
		</view>
		<view class="padding-20">
			<!-- <view class="border-01 padding flex-msg">
				<text>是否选择特定服务人员</text>
				<radio-group @change="radioChange" class="radio-area">
					<label v-for="(item,index) in selectColumn" :key="index">
						<radio :value="item.value" :checked="index === current" color="#6E8CFA"/>
						<text>{{item.label}}</text>
					</label>
				</radio-group>
			</view> -->
			<navigator url="../date/list" class="border-01 padding flex-msg">
				<text>服务预约时间</text>
				<view>
					<text v-if="serviceTime.reserveDate" class="font-grey">
						{{serviceTime.reserveDate + ' ' + serviceTime.reserveTime1 + '-' + serviceTime.reserveTime2}}
					</text>
					<text class="icon iconfont" v-else>&#xe6f8;</text>
				</view>	
			</navigator>
			<view class="border-01 padding flex-msg">
				<text>联系人</text>
				<input type="text" v-model="link.linkman" placeholder="请输入联系人" class="tr"/>
			</view>
			<view class="border-01 padding flex-msg">
				<text>联系电话</text>
				<input type="text" v-model="link.linkmanPhone" placeholder="请输入联系电话" class="tr"/>
			</view>
			<view class="button-area">
				<button @tap="billTaskSubmit" :disabled="canSubmit">确认预约</button>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters,mapMutations } from 'vuex'
import { submitBillTask } from '@/common/api/bill/bill'
import { toFormData,successBack,validatenull } from '@/common/utils/util'
export default {
	data() {
		return {
			current: 0,
			bill: {},
			selectColumn: [
				{
					label: '是',
					value: '0'
				},
				{
					label: '否',
					value: '1'
				}
			],
			link: {
				linkman: '',
				linkmanPhone: ''
			}
		}
	},
	computed: {
		...mapGetters(['serviceTime']),
		canSubmit() {
			return validatenull(this.serviceTime)
		}
	},
	onLoad(e) {
		this.bill = Object.assign({},JSON.parse(e.bill))
	},
	methods: {
		radioChange(evt) {
			console.log(evt)
		},
		billTaskSubmit() {
			let serviceTime = JSON.parse(JSON.stringify(this.serviceTime))
			let paramer = Object.assign({},this.link,{
				billId: this.bill.billId,
				reserveDate: serviceTime.reserveDate,
				reserveTime1: serviceTime.reserveTime1.replace(':00',''),
				reserveTime2: serviceTime.reserveTime2.replace(':00','')
			})
			submitBillTask(toFormData(paramer)).then(response => {
				this.$store.commit('INIT_STORE')
				successBack(response,'预约成功')
			})
		}
	}
}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.border-20{
		border-bottom: 20rpx solid #eeeff3;
	}
	.padding{
		padding: 20rpx 0;
	}
	.radio-area{
		radio{
			margin-right: 5rpx;
			.wx-radio-input{
				border-radius: 8rpx;
				height: 26rpx;
				width: 26rpx;
				margin-top: -6rpx;
			}
		}
		
		label:last-child{
			margin-left: 30rpx;
		}
	}
	.button-area{
		margin-top: 40rpx;
	}
</style>