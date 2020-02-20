<template>
	<view>
		<view class="padding-20 justify-between detail-top bg-white bottom-20">
			<view class="">
				<view class="">预约单号：<text class="font-blue">{{obj.taskId}}</text></view>
				<view class="">服务机构：{{obj.orgName}}</view>
				<view class="">创建时间：{{obj.createTime}}</view>
				<view class="">预约时间：{{obj.reserveDate + ' ' + obj.reserveTime1 + ':00-' + obj.reserveTime2 + ':00'}}</view>
				<!-- <view class="">待预约次数：<text class="font-blue">9</text>次</view> -->
			</view>
			<view class="flex-column justify-between">
				<text class="font-red"><text class="iconfont">&#xe835;</text>{{obj.taskState | taskState}}</text>
				<view class="button-area">
					<!-- <button>评价</button> -->
					<button v-if="(obj.taskState === 0 || obj.taskState === 1 || obj.taskState === 2) && obj.executeState === 0 && obj.kitReceiveState === 0"
							class="grey"
							@tap="taskCancel">取消预约</button>
					<button v-if="obj.taskState === 4 && obj.executeState === 4"
							@tap="taskConfirm">确认服务</button>
				</view>
			</view>
		</view>
		<view class="bg-white bottom-20" v-if="tracks.length > 0">
			<title-card title="任务跟踪信息">
				<template slot="content">
					<view class="padding">
						<view v-for="(item,index) in tracks" :key="index">{{item.createTime}} {{item.actionName || ''}}</view>
					</view>
				</template>
			</title-card>
		</view>
		<view class="bg-white bottom-20">
			<title-card title="服务对象信息">
				<template slot="content">
					<view class="padding">
						<view class="">服务对象姓名：{{obj.custName || ''}}</view>
						<view class="">上门服务地址：{{obj.custAddress || ''}}</view>
						<view class="">联系人：{{obj.linkman}}</view>
						<view class="">联系人电话：{{obj.linkmanPhone}}</view>
					</view>
				</template>
			</title-card>
		</view>
		<view class="bg-white bottom-20" v-if="obj.staffId != 0 && (obj.taskState === 2 || obj.taskState === 3 || obj.taskState === 4)">
			<title-card title="服务人员信息">
				<template slot="content">
					<view class="padding flex-msg">
						<text>服务人员：{{obj.staffName || ''}}</text>
						<text class="font-blue" @tap="contact(obj.staffPhone)">
							<text class="iconfont">&#xe61a;</text>联系服务人员
						</text>
					</view>
				</template>
			</title-card>
		</view>
		<!-- <view class="bg-white bottom-20">
			<title-card title="发票信息">
				<template slot="content">
					<view class="padding">发票状态：未开发票</view>
				</template>
			</title-card>
		</view> -->
		<view class="bg-white bottom-20">
			<title-card title="详细信息">
				<template slot="content">
					<view class="padding">
						<!-- <view class="bottom-20">
							<view>{{obj.serviceLabel}}</view>
							<view>服务费：¥{{obj.itemAmt | priceFormat}} x {{obj.qty}}{{obj.unit}} = ¥{{obj.itemAmt * obj.qty | priceFormat}}</view>
						</view>
						<view class="bottom-20" v-if="obj.kitGoodsLabel">
							<view>{{obj.kitGoodsLabel}}</view>
							<view>耗材费：¥{{obj.kitAmt | priceFormat}} x {{obj.qty}}{{obj.unit}} = ¥{{obj.kitAmt * obj.kitScale * obj.qty | priceFormat}}</view>
						</view>
						<view class="bottom-20">
							<view>上门费：¥{{obj.visitAmt | priceFormat}} x {{obj.qty}}{{obj.unit}} = ¥{{obj.visitAmt * obj.qty | priceFormat}}</view>
						</view>
						<view class="bottom-20">
							<view>保险费：¥{{obj.premiumAmt | priceFormat}}</view>
						</view> -->
						<!-- <view class="bottom-20">
							<view class="">耗材包/工具包名称</view>
							<view class="">耗材费金额：¥5.00*10次 共¥50</view>
						</view> -->
						<view class="bottom-20 tl">
							<view>{{serviceLabel}}：¥{{priceAdjust}}x{{qty}}次</view>
							<!-- <view class="">优惠金额：¥{{obj.itemAmt | priceFormat}}</view> -->
							<view class="">应付总金额：¥{{total}}</view>
							<!-- <view class="">已付金额（礼券金额）：¥3760</view> -->
							<view class="total font-deep" style="text-align:right;">总金额：<text class="font-blue">¥{{total}}</text></view>
						</view>
					</view>
				</template>
			</title-card>
		</view>
		<view class="bg-white bottom-20">
			<title-card title="温馨提示">
				<template slot="content">
					<view class="padding">
						<view class="">1.剩余时间内不支付，订单自动撤销关闭</view>
						<view class="">2.预约套餐服务有效期为1年（自订单提交时间算起）</view>
					</view>
				</template>
			</title-card>
		</view>
	</view>
</template>

<script>
import { successBack } from '@/common/utils/util'
import { getBillTaskDetail,getTrackLists,cancelBillTask,confirmBillTask } from '@/common/api/bill/bill'
export default {
	data() {
		return {
			obj: {},
			tracks: [],
			priceAdjust:0,
			serviceLabel:'',
			qty:0,
		}
	},
	filters: {
		taskState(val) {
			let taskState = '';
			switch(val) {
				case 0:
				case 1:
					taskState = '待接单';
					break;
				case 2:
					taskState = '待服务';
					break;
				case 3:
					taskState = '服务中';
					break;
				case 4:
					taskState = '待会员确认';
					break;
				case 5:
					taskState = '会员已确认';
					break;
				case 7:
					taskState = '已成功关闭';
					break;
				case 10:
					taskState = '待机构退款';
					break;
				case 11:
					taskState = '待会员确认退款';
					break;
				case 13:
					taskState = '已撤销关闭';
					break;
			}
			return taskState;
		}
	},
	computed: {
		total() {
			let total = this.obj.itemAmt * 100 + this.obj.kitAmt * 100 + this.obj.visitAmt * 100 + this.obj.premiumAmt * 100
			return (total / 100).toFixed(2)
		}
	},
	onLoad(e) {
		getBillTaskDetail(e.taskId).then(response => {
			// console.log(response)
			let data = response.data
			if(data.msg === 'success'){
				this.obj = Object.assign({},data.data)
			}
			let res_data= response.data.data
			this.serviceLabel=res_data.serviceLabel
			this.qty=res_data.qty
			if(res_data.kitPrice==null){
				res_data.kitPrice=0
			}
			console.log("res_data",res_data)
			if(res_data.kitAmt===null){
				res_data.kitAmt=0
			}
			if(res_data.kitScale===null){
				res_data.kitScale=0
			}
			this.priceAdjust=(parseFloat(res_data.price)+parseFloat(res_data.visitAmt)
					+parseFloat(res_data.premiumAmt)+parseFloat(res_data.kitAmt)).toFixed(2)
		})
		
		
		getTrackLists(e.taskId).then(response => {
			// console.log(response)
			let data = response.data
			if(data.msg === 'success'){
				this.tracks = data.data
			}
		})
	},
	methods: {
		async taskCancel(id) {
			let res = await new Promise((resolve,reject) => {
				uni.showModal({
					title: '提示',
					content: '是否取消此次预约？',
					success: res => {
						resolve(res)
					},
					fail: () => {
						reject()
					}
				})
			})
			
			if(res.confirm){
				let response = await cancelBillTask(this.obj.taskId)
				await successBack(response,'取消预约成功')
			}
		},
		contact(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			})
		},
		async taskConfirm() {
			let res = await new Promise((resolve,reject) => {
				uni.showModal({
					title: '提示',
					content: '是否确认已完成服务？',
					success: res => {
						resolve(res)
					},
					fail: () => {
						reject()
					}
				})
			})
			
			if(res.confirm){
				let response = await confirmBillTask(this.obj.taskId)
				await successBack(response,'确认成功')
			}
		}
	}
}
</script>

<style lang="scss">
	.padding{
		padding: 0 20rpx 20rpx;
		view{
			line-height: 50rpx;
		}
	}
	.detail-top{
		.iconfont{
			margin-right: 6rpx;
		}
		.button-area{
			button{
				width: 160rpx;
				height: 50rpx;
				line-height: 50rpx;
				font-size: 24rpx;
				border-radius: 6rpx;
				margin-bottom: 10rpx;		
				color: #fff;
				&.grey{
					background-color: #9fa1a0;
				}
			}
		}
	}
	.total{
		font-size: 36rpx;
		text{
			font-weight: 600;
		}
	}
	.upload-area{
		width: 180rpx;
		height: 180rpx;
		border: 1px dashed #919191;
		border-radius: 8rpx;
		margin-bottom: 10rpx;
		overflow:hidden;
		.iconfont{
			color: #919191;
			font-size: 90rpx;
			font-weight: 400;
		}
		image{
			width: 100%;
		}
	}
</style>