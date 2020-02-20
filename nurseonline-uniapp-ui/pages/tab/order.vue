<template>
	<view style="overflow: hidden;height: 100%;" @click="statusChange">
		<view class="bg-white bottom-10 search-top">
			<view class="search-area justify-center padding-20">
				<view class="search-box align-center">
					<text class="iconfont">&#xe741;</text>
					<input type="text" v-model="searchContent" placeholder="服务订单号/服务机构/服务名称"/>
				</view>
				<view class="button-area">
					<button @tap="changeTab(0)">搜索</button>
				</view>
			</view>
			<view style="position: relative;">
				<view class="tab-area bg-white flex">
					<view class="tab-item tc" v-for="(tab,tIdx) in tabList" :key="tIdx" :class="{'isActive': tabIndex === tIdx}" @tap="changeTab(tIdx, 'select')">
						<view v-if="tIdx == 0" :id="'tab-order-select'" class="select-wrp" @click="changeSelect">
							{{tab}}
						</view>
						<view v-else>
							{{tab}}
						</view>
					</view>
					
				</view>
				<view class="tab-select-container">
					<view class="tab-select-wrp" :class="{'active': showSelect}">
						<view class="tab-select-item" @click="selectType(1)">推荐订单</view>
						<view class="tab-select-item" @click="selectType(2)">随访订单</view>
					</view>
				</view>
			</view>
		</view>
		<view class="list-area">
			<scroll-view class="order-box" :scroll-y="true" :scroll-top="scrollTop" @scrolltolower="loadMore">
				<template v-if="tabSelect == 1">
					<template v-if="orders.length > 0">
						<navigator class="order-item bg-white bottom-10" :url="'../order/detail?billId=' + item.billId" v-for="(item,index) in orders" :key="index">
							<view class="padding-20 justify-between item-top border-01">
								<text>{{item.createTime}}</text>
								<text class="font-red">
									<text class="iconfont">&#xe835;</text>
									{{billStates[item.billState]}}
								</text>
							</view>
							<view class="flex-msg padding-20">
								<view class="item-left">
									<view class="">服务项目：{{item.serviceLabel}}</view>
									<view class="">服务机构：{{item.orgName || ''}}</view>
									<view class="">服务单号：{{item.billId}}</view>
									<view class="">首诊时间：{{item.reserveDate + ' ' + item.reserveTime1 + ':00-' + item.reserveTime2 + ':00'}}</view>
									<view class="">总金额：¥{{item.paymentAmt | priceFormat}}</view>
									<!-- <view class="">待预约次数：<text class="font-blue">9</text>次</view> -->
								</view>
								
								<template v-if="item.billState !== 6">
									<view class="button-area item-right">
										<template v-if="item.payState === 0">
											<button @tap.stop.prevent="orderPay(item.billId,item.paymentAmt, item)" v-if="item.billState < 2" :disabled="item.codeTip">{{ item.codeTip ? item.codeTip : '支付订单' }}</button>
											<button class="transparent" @tap.stop="billCancel(item.billId)">撤销订单</button>	
										</template>
										<template v-else>
											<button v-if="item.billState === 3" @tap.stop.prevent="billConfirm(item.billId)">确认订单</button>
											<template v-if="item.billState === 5">
												<button @tap.stop.prevent="toRate(item)" v-if="item.reviewFlag === -1">订单评价</button>
												<button @tap.stop.prevent="toRate(item)" v-else-if="item.reviewFlag > 0">查看评价</button>
											</template>
											<button class="transparent" @tap.stop.prevent="appoint(item)" v-if="item.billState >= 2">查看预约</button>
											
											<!-- <template v-if="item.billState === 2">
												<button>提交预约</button>
												<button class="transparent" @tap.stop.prevent="appoint(item)">查看预约</button>
											</template>
											<template v-else>
												<template v-if="item.billState === 3">
													<button>确认订单</button>
													<button class="transparent" @tap.stop.prevent="appoint(item)">查看预约</button>
												</template>
												<template v-else-if="item.billState === 4">
													<button class="transparent" @tap.stop.prevent="appoint(item)">查看预约</button>
												</template>
												<template v-else-if="item.billState === 5">
													<button @tap.stop="toRate(item)">订单评价</button>
													<button class="transparent" @tap.stop.prevent="appoint(item)">查看预约</button>
												</template>
											</template> -->
										</template>
									</view>
								</template>
							</view>
						</navigator>
						<view class="tc font-grey bottom-20">{{searchTip}}</view>
					</template>
					<template v-else>
						<view class="empty-tip flex-column flex-center bg-white">
							<image src="http://file.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//yjh_appointment.png" mode="widthFix" class="bottom-20"/>
							<view class="">未找到符合条件的服务订单</view>
						</view>
					</template>
				</template>
				<template v-else>
					<template v-if="orders.length > 0">
						<navigator class="order-item bg-white bottom-10" :url="'../followUp/detail?billId=' + item.fupBillId" v-for="(item,index) in orders" :key="index">
							<view class="padding-20 justify-between item-top border-01">
								<text>{{item.createTime}}</text>
								<text class="font-red">
									<text class="iconfont">&#xe835;</text>
									{{billStates[item.fupBillState]}}
								</text>
							</view>
							<view class="flex-msg padding-20">
								<view class="item-left">
									<view class="">服务项目：{{item.fupBillType == 1 ? '电话服务' : '上门服务'}}</view>
									<view class="">服务机构：{{item.orgName || ''}}</view>
									<view class="">服务单号：{{item.fupBillId}}</view>
									<view v-if="item.fupBillType == 0">
										<view class="">首诊时间：{{item.reserveDate + ' ' + item.reserveTime1 + ':00-' + item.reserveTime2 + ':00'}}</view>
										<view class="">总金额：¥{{item.paymentAmt | priceFormat}}</view>
									</view>
									<!-- <view class="">待预约次数：<text class="font-blue">9</text>次</view> -->
								</view>
								
								<template v-if="item.fupBillState !== 6">
									<view class="button-area item-right">
										<template v-if="item.payState === 0">
											<button @tap.stop.prevent="orderPay(item.fupBillId,item.paymentAmt, item)" v-if="item.fupBillState < 2 && item.fupBillType !== 1" :disabled="item.codeTip">{{ item.codeTip ? item.codeTip : '支付订单' }}</button>
											<button class="transparent" @tap.stop="billCancel(item.fupBillId)">撤销订单</button>	
										</template>
										<template v-else>
											<button v-if="item.fupBillState === 3" @tap.stop.prevent="billConfirm(item.fupBillId)">确认订单</button>
											<!-- <template v-if="item.billState === 5">
												<button @tap.stop.prevent="toRate(item)" v-if="item.reviewFlag === -1">订单评价</button>
												<button @tap.stop.prevent="toRate(item)" v-else-if="item.reviewFlag > 0">查看评价</button>
											</template> -->
											<!-- <button class="transparent" @tap.stop.prevent="appoint(item)" v-if="item.billState >= 2">查看预约</button> -->
										</template>
									</view>
								</template>
							</view>
						</navigator>
						<view class="tc font-grey bottom-20">{{searchTip}}</view>
					</template>
					<template v-else>
						<view class="empty-tip flex-column flex-center bg-white">
							<image src="http://file.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//yjh_appointment.png" mode="widthFix" class="bottom-20"/>
							<view class="">未找到符合条件的服务订单</view>
						</view>
					</template>
				</template>
			</scroll-view>
		</view>
		
		<uni-login ref="uniLogin" />
	</view>
</template>

<script>
import { getBillList,cancelBill,confirmBill } from '@/common/api/bill/bill'
import { getFollowUpBillList, cancelFollowUpBill, confirmFollowUpBill } from '@/common/api/follow'
import { mapGetters,  } from 'vuex'
import uniLogin from "@/components/uni-login/uni-login"

let orders = []
export default {
	data() {
		return {
			access_token:'',
			scrollTop: 0,
			tabIndex: 0,
			windowHeight: 0,
			tabList: ['推荐订单','待付款','待服务','待确认','已完成'],
			orders: [],
			page: {
				current: 1,
				size: 5
			},
			billStates: ['草稿','已提交','已审核（待服务）','已服务（待确认）','（会员）已确认','交易成功关闭','交易撤销关闭','交易成功关闭'],
			searchTip: '上拉加载更多',
			params: {
				billId: '',
				billState: '',
				payState: '',
				orgName: '',
				multiName: ''
			},
			searchContent: '',
			showSelect: false,
		}
	},
	computed: {
		scrollHeight() {
			return (this.windowHeight - 90) + 'px'
		},
		...mapGetters(['tabSelect']),
	},
	components: {
		uniLogin,
	},
	onPullDownRefresh() {
		this.changeTab(this.tabIndex)
	},
	watch: {
		searchContent(val) {
			if(Number(val) !== NaN && Number.isInteger(Number(val))){
				this.params.billId = val
				// this.params.orgName = ''
				this.params.multiName = ''
				this.params.serviceName = ''
			}
			else{
				this.params.billId = ''
				// this.params.orgName = val
				this.params.multiName = val
				this.params.serviceName = val
			}
		}
	},
	onShow() {
		// this.params = Object.assign({},{
		// 	billId: '',
		// 	billState: '',
		// 	payState: '',
		// 	orgName: ''
		// })
		this.access_token=uni.getStorageSync('access_token')
		this.changeTab(this.tabIndex)
	},
	onLoad() {
		let result = '推荐订单'
		if (this.tabSelect == 2) {
			result = '随访订单'
		}
		this.tabList[0] = result
	},
	mounted() {
		if (this.access_token == "") {
			setTimeout(()=>{
				this.$refs.uniLogin.onPopup(true)
			},0)
		}
	},
	methods: {
		fetchData() {
			this.searchTip = '加载中...'
			if(!this.access_token==""){
				this.$refs.uniLogin.onPopup(false)
				let getData = getBillList
				if (this.tabSelect != 1) {
					getData = getFollowUpBillList
				}
				getData(Object.assign({},this.params,this.page)).then(response => {
					let data = response.data
					if(data.msg === 'success'){
						let orders = this.orders
						orders = orders.concat(data.data.records)
						this.orders = orders
						let total = this.page.current * this.page.size
						if(total < data.data.total){
							this.searchTip = '上拉加载更多'
						}
						else{
							this.searchTip = '没有更多了'
						}
					}
					else{
						this.searchTip = '加载错误，请检查网络是否正常'
					}
				})
			}
		},
		changeTab(idx, type) {
			let tabIndex = this.tabIndex
			if (tabIndex == 0 && idx == 0 && type == 'select') {
				return
			}

			this.page.current = 1;
			this.orders = [];
			this.tabIndex = idx;
			switch (idx) {
				case 0:
					this.params.payState = '';
					this.params.billState = '';
					break;
				case 1:
					this.params.payState = 0;
					this.params.billState = [0,1,2,3,4,5].join();
					break;
				case 2:
					this.params.payState = 1;
					this.params.billState = [0,1,2].join();
					break;
				case 3:
					this.params.payState = 1;
					this.params.billState = 3;
					break;
				case 4:
					this.params.payState = '';
					this.params.billState = [5,6].join();
					break;
			}
			this.fetchData();
		},
		appoint(bill) {
			uni.navigateTo({
				// url: '../appointment/list?billId=' + id + '&billState=' + state
				url: '../appointment/list?bill=' + JSON.stringify(bill)
			})
		},
		toRate(item) {
			uni.navigateTo({
				url: '../order/rate?bill=' + JSON.stringify(item)
			})
		},
		billCancel(id) {
			uni.showModal({
				title: '提示',
				content: '确认要取消当前订单吗？',
				success: res => {
					if(res.confirm){
						let cancelRequest = cancelBill
						if (this.tabSelect !== 1) {
							cancelRequest = cancelFollowUpBill
						}
						cancelRequest(id).then(response => {
							let data = response.data
							if(data.msg === 'success'){
								uni.showToast({
									title: '订单取消成功！',
									icon: 'none',
									mask: true,
									complete: () => {
										setTimeout(() => {
											this.orders = []
											this.page.current = 1
											this.fetchData()
										},500)
									}
								})
							}
						})
					}
				}
			})
		},
		// searchEvent() {
		// 	this.changeTab(0)
		// },
		billConfirm(id){
			uni.showModal({
				title: '提示',
				content: '是否要确认当前订单？',
				success: res => {
					if(res.confirm){
						let confirmRequest = confirmBill
						if (this.tabSelect !== 1) {
							confirmRequest = confirmFollowUpBill
						}
						confirmRequest(id).then(response => {
							let data = response.data
							if(data.msg === 'success'){
								uni.showToast({
									title: '订单确认成功！',
									icon: 'none',
									mask: true,
									complete: () => {
										setTimeout(() => {
											this.orders = []
											this.page.current = 1
											this.fetchData()
										},500)
									}
								})
							}
						})
					}
				}
			})
		},
		loadMore(){
			if(this.searchTip = '上拉加载更多'){
				this.page.current += 1
				this.fetchData()
			}
		},
		orderPay(billId,paymentAmt, item) {
			if (!item.codeTip) {
				let time = 10
				this.$set(item, 'codeTip', time + 's')
				let timer = setInterval(() => {
					time--
					if(time > 0){
						this.$set(item, 'codeTip', time + 's')
					}
					else{
						this.$set(item, 'codeTip', null)
						clearInterval(timer)
					}
				}, 1000)
				
				let url = '/subPagesA/service/pay'
				if (this.tabSelect == 2) {
					url = '/subPagesA/service/payFollowUp'
				}
				uni.navigateTo({
					url: url + '?billId=' + billId + '&paymentAmt=' + paymentAmt
				})
			}
		},
		selectType(type) {
			let result = '推荐订单'
			if (type == 2) {
				result = '随访订单'
			}
			// this.$store.state.tabSelect = type
			this.$store.commit('SET_TAB_SELECT', type)
			this.tabList[0] = result
			this.changeTab(this.tabIndex)
		},
		changeSelect() {
			this.showSelect = !this.showSelect
		},
		statusChange(event) {
			let target = event.target
			if (target.id != 'tab-order-select') {
				this.showSelect = false
			}
		},
	}
}
</script>

<style lang="scss">
	.search-top{
		width: 100%;
		height: 180rpx;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
	}
	.list-area{
		width: 100%;
		height: 100%;
		overflow: hidden;
		margin-top: 190rpx;
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
	.order-box{
		height: calc(100% - 190rpx);
	}
	.order-item{
		font-size: 24rpx;
		line-height: 40rpx;
		.item-top{
			.iconfont{
				margin-right: 6rpx;
			}
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
	}
	.empty-tip{
		width: 100%;
		height: 100%;
		image{
			width: 100rpx;
		}
	}
	.tab-select-container {
		position: fixed;
		z-index: 200;
		min-width: 100%;
	}
	.tab-select-wrp {
		position: absolute;
		top: 0rpx;
		left: 10rpx;
		z-index: 20;
		background: #f8f8f8;
		display: none;
		.tab-select-item {
			padding: 20rpx;
			border: 1px solid #3682FF;
			border-top: none;
		}
		&.active {
			display: block;
		}
	}
</style>