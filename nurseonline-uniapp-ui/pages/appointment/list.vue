<template>
	<view style="overflow: hidden;height: 100%;">
		<view class="top">
			<view class="bg-white search-area flex padding-20">
				<view class="search-box align-center">
					<text class="iconfont">&#xe741;</text>
					<input type="text" v-model="params.taskId" placeholder="预约单号"/>
				</view>
				<view class="button-area">
					<button @tap="changeTab(0)">搜索</button>
				</view>
			</view>
			<view class="padding-20 flex-msg order-box">
				<view class="order-area">
					<view>订单号：<text class="font-deep">{{bill.billId}}</text></view>
					<view>服务机构：{{bill.orgName}}</view>
					<!-- <view class="">预约单金额：{{bill.paymentAmt}}</view> -->
					<view>总预约次数：{{bill.qty}}次</view>
					<view>已完成次数：<text class="font-blue">{{bill.qtyFinished}}</text>次</view>
					<view>已锁定次数：<text class="font-blue">{{bill.qtyLocked}}</text>次</view>
				</view>
				<view class="button-area align-center" v-if="bill.billState == 2 && count > 0">
					<button @tap="submitBillTask">+ 预约（{{count}}次）</button>
				</view>
			</view>
			<view class="tab-area bg-white flex">
				<view class="tab-item tc" v-for="(tab,tIdx) in tabList" :key="tIdx" :class="{'isActive': tabIndex === tIdx}" @tap="changeTab(tIdx)">{{tab}}</view>
			</view>
		</view>
		<view class="appointment-area">
			<template v-if="appointments.length > 0">
				<scroll-view class="appointment-box" :scroll-y="true" :scroll-top="scrollTop" @scrolltolower="loadMore">
					<navigator class="appointment-item bg-white bottom-10" :url="'./detail?taskId=' + item.taskId" v-for="(item,index) in appointments" :key="index">
						<view class="padding-20 justify-between item-top border-01">
							<text>预约时间：{{item.reserveDate + ' ' + item.reserveTime1 + ':00-' + item.reserveTime2 + ':00'}}</text>
							<text class="font-blue"><text class="iconfont">&#xe835;</text>{{item.taskState | taskState}}</text>
						</view>
						<view class="padding-20">
							<view class="flex-msg bottom-10">
								<view class="item-left">
									<!-- <view class="">任务单号：{{item.taskId}}</view> -->
									<!-- <view class="">服务机构：广东医科大学附属医院</view> -->
									<view class="">预约单号：{{item.taskId}}</view>
									<!-- <view class="">首诊时间：2019年2月28日 13:30-14:00</view> -->
									<view class="">服务项目：{{item.serviceLabel}}</view>
									<view class="">金额：¥{{item.itemAmt + item.premiumAmt + item.visitAmt + item.kitAmt | priceFormat}}</view>
									<!-- <view class="">待预约次数：<text class="font-blue">9</text>次</view> -->
								</view>
								<view class="button-area item-right">
									<button v-if="(item.taskState === 0 || item.taskState === 1 || item.taskState === 2) && item.executeState === 0 && item.kitReceiveState === 0"
											@tap.stop.prevent="taskCancel(item.taskId)">取消预约</button>
									<button v-if="item.taskState === 4 && item.executeState === 4"
											@tap.stop.prevent="taskConfirm(item.taskId)">确认服务</button>						
								</view>
							</view>
							<view class="contact-box flex-msg" v-if="item.staffId !== 0 && (item.taskState === 2 || item.taskState === 3 || item.taskState === 4)">
								<text class="font-grey">服务人员：{{item.staffName}}</text>
								<text class="contact" @tap.stop.prevent="contact(item.staffPhone)"><text class="iconfont">&#xe61a;</text>联系服务人员</text>
							</view>
						</view>
					</navigator>
					<view class="tc font-grey bottom-20">{{searchTip}}</view>
				</scroll-view>
			</template>
			<template v-else>
				<view class="empty-tip flex-column flex-center bg-white">
					<image src="http://file.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//yjh_appointment.png" mode="widthFix" class="bottom-20"/>
					<view class="">未找到符合条件的预约工单</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
// import { getAppointments } from '@/common/mock/appointment.js'
import { utilToast } from '@/common/utils/util'
import { getBillDetail,getBillTaskList,cancelBillTask,confirmBillTask } from '@/common/api/bill/bill'
let appointments = []
export default {
	data() {
		return {
			scrollTop: 0,
			searchTip: '上拉加载更多',
			tabIndex: 0,
			tabList: ['全部订单','待接单','待服务','服务中','待确认'],
			appointments: [],
			bill: {},
			page: {
				current: 1,
				size: 5
			},
			params: {
				taskState: '',
				taskId: '',
				executeState: ''
			}
		}
	},
	onLoad(e) {
		this.bill = Object.assign({},JSON.parse(e.bill))
		// this.fetchData()
	},
	onPullDownRefresh() {
		this.changeTab(this.tabIndex)
	},
	onShow() {
		this.getBill()
		if(this.bill && this.bill.billId){
			this.params = Object.assign({},{
				taskState: '',
				taskId: '',
				executeState: ''
			})
			this.changeTab(this.tabIndex)
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
		count() {
			let bill = this.bill
			return bill.qty - bill.qtyFinished - bill.qtyLocked
		}
	},
	methods: {
		fetchData() {
			this.searchTip = '加载中...'
			getBillTaskList(Object.assign({},this.params,this.page,{
				billId: this.bill.billId
			})).then(({data}) => {
				if(data.msg === 'success'){
					let appointments = this.appointments
					appointments = appointments.concat(data.data.records)
					this.appointments = appointments
					
					let total = this.page.current * this.page.size
					if(total < data.data.total){
						this.searchTip = '上拉加载更多'
					}
					else{
						this.searchTip = '没有更多了'
					}
				}
			})
		},
		changeTab(idx) {
			this.page.current = 1;
			this.appointments = [];
			this.tabIndex = idx;
			
			switch(idx) {
				case 0:
					this.params.taskState = '';
					this.params.executeState = '';
					break;
				case 1:
					this.params.taskState = 1;
					this.params.executeState = 0;
					break;
				case 2:
					this.params.taskState = 2;
					this.params.executeState = 0;
					break;
				case 3:
					this.params.taskState = 3;
					this.params.executeState = [1,2,3].join();
					break;
				case 4:
					this.params.taskState = 4;
					this.params.executeState = 4;
					break;
			}
			this.fetchData();
		},
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
				let { data } = await cancelBillTask(id)
				if(data.msg === 'success'){
					await utilToast('取消成功')
					await setTimeout(() => {
						this.appointments = []
						this.page.current = 1
						this.fetchData()
						this.getBill()
					},800) 
				}
			}
		},
		submitBillTask() {
			uni.navigateTo({
				url: './confirm?bill=' + JSON.stringify(this.bill)
			})
		},
		contact(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			})
		},
		async taskConfirm(id) {
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
				let { data } = await confirmBillTask(id)
				if(data.msg === 'success'){
					await utilToast('确认成功')
					await setTimeout(() => {
						this.appointments = []
						this.page.current = 1
						this.fetchData()
						this.getBill()
					},800) 
				}
			}
		},
		getBill() {
			getBillDetail(this.bill.billId).then(({data}) => {
				if(data.msg === 'success'){
					this.bill = Object.assign({},this.bill,data.data)
				}
			})
		},
		loadMore() {
			if(this.searchTip = '上拉加载更多'){
				this.page.current += 1
				this.fetchData()
			}
		}
	}
}
</script>

<style lang="scss">
	.top{
		width: 100%;
		// height: 310rpx;
		position: fixed;
		top: 0;
		left: 0;
	}
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
	.appointment-area{
		margin-top: 420rpx;
		width: 100%;
		height: 100%;
		overflow: hidden;
		.appointment-box{
			height: calc(100% - 420rpx);
		}
	}
	.order-box{
		.order-area{
			.font-deep{
				font-weight: 600;;
			}
		}
		.button-area{
			button{
				width: 180rpx;
				height: 50rpx;
				line-height: 50rpx;
				font-size: 24rpx;
				border-radius: 6rpx;
				padding: 0;
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
	.appointment-item{
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
			}
		}
		.contact{
			color: #54bfef;
		}
	}
	.empty-tip{
		width: 100%;
		height: calc(100% - 420rpx);
		image{
			width: 100rpx;
		}
	}
</style>