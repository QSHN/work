<template>
	<view>
		<view class="padding-20 justify-between detail-top bg-white bottom-20">
			<view class="">
				<view class="">单号：<text class="font-blue">{{bill.fupBillId}}</text></view>
				<view class="">服务机构：{{bill.orgName}}</view>
				<view class="">创建时间：{{bill.createTime}}</view>
				<!-- <view class="">待预约次数：<text class="font-blue">9</text>次</view> -->
			</view>
			<view class="flex-column justify-between">
				<text class="font-red"><text class="iconfont">&#xe835;</text>{{billStates[bill.fupBillState]}}</text>
				<!-- <view class="button-area">
					<button class="grey" v-if="bill.billState == 0">撤销订单</button>
					<button v-else-if="bill.billState == 1">查看预约</button>
				</view> -->
				<template v-if="bill.fupBillState !== 6">
					
					<view class="button-area">
						<template v-if="bill.payState === 0">
							<button @tap="billCancel">撤销订单</button>	
						</template>
						<template v-else>
							<button v-if="bill.fupBillState === 3" @tap="billConfirm">确认订单</button>
							<!-- <template v-if="bill.fupBillState === 5"> -->
								<!-- <button @tap="toRate" v-if="bill.reviewFlag === -1">订单评价</button> -->
								<!-- <button @tap="toRate" v-else-if="bill.reviewFlag > 0">查看评价</button> -->
							<!-- </template> -->
							<!-- <button @tap="appoint" v-if="bill.fupBillState >= 2">查看预约</button> -->
						</template>
					</view>
				</template>
			</view>
		</view>
		<view class="bg-white bottom-20 pay-area">
			<title-card title="支付信息">
				<template slot="content">
					<view class="padding">
						<view>{{bill.payState == 0 ? '待付金额' : '已付金额'}}：<text class="font-blue">¥{{bill.paymentAmt}}</text></view>
						<view class="bottom-20" v-if="bill.fupBillType !== 1">支付状态：{{bill.payState == 0 ? '未支付' : '已支付'}}</view>
						<view class="" v-if="bill.fupBillType == 1">支付状态：无需支付</view>
						<template v-if="bill.payState == 0 && bill.fupBillState < 2">
							<!-- <view class="bottom-20">剩余时间：<text class="font-red">{{ minutes | timeFormat }} : {{ seconds | timeFormat }}</text></view> -->
							<view class="button-area flex-center">
								<!-- <button type="primary" @tap="wxPay">微信支付 ( 剩余：{{ minutes | timeFormat }} : {{ seconds | timeFormat }} )</button> -->
								<view class="button-box flex-center"  @tap="wxPay">
									微信支付<text class="font-small"> ( 剩余：{{ minutes | timeFormat }} : {{ seconds | timeFormat }} )</text>
								</view>
							</view>
						</template>
					</view>
				</template>
			</title-card>
		</view>
		<view class="bg-white bottom-20">
			<title-card title="服务对象信息">
				<template slot="content">
					<view class="padding">
						<view class="">服务对象：{{bill.custName}}</view>
						<view class="" v-if="bill.fupBillType == 0">服务地址：{{bill.custAddress}}</view>
						<view class="">联系人：{{bill.linkman}}</view>
						<view class="">联系电话：{{bill.linkmanPhone}}</view>
					</view>
				</template>
			</title-card>
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
		<view class="bg-white bottom-20" v-if="bill.diseaseDesc">
			<title-card title="疾病描述">
				<template slot="content">
					<view class="padding">{{bill.diseaseDesc}}</view>
				</template>
			</title-card>
		</view>
		<view class="bg-white bottom-20">
			<title-card title="发票信息">
				<template slot="content">
					<view class="padding">发票状态：未开发票</view>
				</template>
			</title-card>
		</view>
		<view class="bg-white bottom-20">
			<title-card title="详细信息">
				<template slot="content">
					<view class="padding">
						<view class="bottom-20 tl">
							<view>{{bill.fupBillType == 1 ? '电话服务' : '上门服务'}}：1次</view>
							<view v-if="bill.fupBillType == 0">
								<view>订单金额：¥{{bill.paymentAmt | priceFormat}}</view>
								<view class="total font-deep" style="text-align:right;">应付金额：<text class="font-blue">¥{{bill.paymentAmt | priceFormat}}</text></view>
							</view>
						</view>
					</view>
				</template>
			</title-card>
		</view>
		<view class="bg-white bottom-20">
			<title-card title="就医证明">
				<template v-slot:content>
					<template v-if="billCerts.length > 0">
						<view class="flex image-box padding-20">
							<view class="image-area flex-center" v-for="(item,index) in billCerts" :key="index" @tap="previewImg(item.certImgPath)">
								<image :src="item.certImgPath" mode="widthFix" />
							</view>
						</view>
					</template>
					<template v-else>
						<view class="padding-20 tc font-grey">
							暂未找到当前订单的就医证明
						</view>
					</template>
				</template>
			</title-card>
		</view>
		<view class="bg-white bottom-20">
			<title-card title="温馨提示">
				<template slot="content">
					<view class="padding">
						<view class="">1.剩余时间内不支付，订单自动撤销关闭</view>
						<view class="">2.订单有效期为1年，需在1年内使用完所有服务（自订单提交时间算起）</view>
					</view>
				</template>
			</title-card>
		</view>
	</view>
</template>

<script>
// import { getBillDetail,billPay,cancelBill,confirmBill,getBillCerts,getTime } from '@/common/api/bill/bill'
import { cancelFollowUpBill, confirmFollowUpBill, getFollowUpDetail, followUpBillPay, getTime, getTrackLists } from '@/common/api/follow'

export default {
	data() {
		return {
			bill: {},
			billStates: ['草稿','已提交','已审核（待服务）','已服务（待确认）','（会员）已确认','交易成功关闭','交易撤销关闭','交易成功关闭'],
			billId: '',
			tracks: [],
			billCerts: [],
			countTime: 600,
			minutes: '',
			seconds: '',
			priceAdjust:0,
		}
	},
	onLoad(e) {
		this.billId = e.billId
		this.fetchData()
		// getBillCerts(this.billId).then(response => {
		// 	let data = response.data
		// 	if(data.msg === 'success'){
		// 		this.billCerts = data.data
		// 	}
		// })
		getTrackLists(this.billId).then(response => {
			// console.log(response)
			let data = response.data
			if(data.msg === 'success'){
				this.tracks = data.data
			}
		})
	},
	filters: {
		timeFormat: function(value) {
			let n = value.toString()
			return n[1] ? n : '0' + n
		}
	},
	methods: {
		fetchData() {
			getFollowUpDetail(this.billId).then(({data}) => {
				let res_data;
				if(data.msg === 'success'){
					this.bill = Object.assign({},data.data)
					res_data=data.data
					this.getCloseTime()
				}
				if(res_data.kitPrice==null){
					res_data.kitPrice=0
				}
				console.log("res_data",res_data)
				if(res_data.kitPrice===null){
					res_data.kitPrice=0
				}
				if(res_data.kitScale===null){
					res_data.kitScale=0
				}
				this.billCerts.push({certImgPath:res_data.proveImgPath})
				this.priceAdjust=(parseFloat(res_data.price)+parseFloat(res_data.visitPrice)
						+parseFloat(res_data.premiumPrice)+parseFloat(res_data.kitPrice)*parseFloat(res_data.kitScale)).toFixed(2)
			})
		},
		wxPay() {
			(async () => {
				
				let loginData = await new Promise((resolve,reject) => {
					uni.login({
						success: response => {
							resolve(response)
						},
						fail: () => {
							reject()
						}
					})
				})
				let payData = await new Promise((resolve,reject) => {
					followUpBillPay({
						body: '服务工单支付',
						billId: this.bill.fupBillId,
						code: loginData.code
					}).then(response => {
						resolve(response.data)
					})
				})
							
				let wxPay = await new Promise((resolve,reject) => {
					let params = JSON.parse(payData.data)
					uni.requestPayment({
						provider: 'wxpay',
						...params,
						success: response => {
							console.log(response)
							uni.showToast({
								title: '支付成功！',
								icon: 'success',
								mask: true
							})
							setTimeout(() => {
								this.fetchData()
							},500)
						}
					})
				})
			})();
		},
		appoint() {
			uni.navigateTo({
				// url: '../appointment/list?billId=' + id + '&billState=' + state
				url: '../appointment/list?bill=' + JSON.stringify(this.bill)
			})
		},
		toRate() {
			uni.navigateTo({
				url: '../order/rate?bill=' + JSON.stringify(this.bill)
			})
		},
		billCancel() {
			uni.showModal({
				title: '提示',
				content: '确认要取消当前订单吗？',
				success: res => {
					if(res.confirm){
						cancelFollowUpBill(this.bill.fupBillId).then(response => {
							let data = response.data
							if(data.msg === 'success'){
								uni.showToast({
									title: '订单取消成功！',
									icon: 'none',
									mask: true,
									complete: () => {
										setTimeout(() => {
											uni.navigateBack({
												delta: -1
											})
										},800)
									}
								})
							}
						})
					}
				}
			})
		},
		billConfirm(){
			uni.showModal({
				title: '提示',
				content: '是否要确认当前订单？',
				success: res => {
					if(res.confirm){
						confirmFollowUpBill(this.bill.fupBillId).then(response => {
							let data = response.data
							if(data.msg === 'success'){
								uni.showToast({
									title: '订单确认成功！',
									icon: 'none',
									mask: true,
									complete: () => {
										setTimeout(() => {
											uni.navigateBack({
												delta: -1
											})
										},800)
									}
								})
							}
						})
					}
				}
			})
		},
		previewImg(img){
			uni.previewImage({
				urls: [ img ]
			})
		},
		getCloseTime(){
			let createTime = new Date(this.bill.createTime).getTime()
			let nowTime = new Date().getTime()
			getTime(this.billId).then(({data}) => {
				if(nowTime - createTime <= (data * 60 * 1000)){
					let startTime = (data * 60 * 1000) - nowTime + createTime
					startTime = startTime / 1000
					this.minutes = Math.floor(startTime / 60)
					this.seconds = Math.floor(startTime % 60)
					
					let closeTime = setInterval(() => {
						startTime -= 1
						if(startTime > 0){
							this.minutes = Math.floor(startTime / 60)
							this.seconds = Math.floor(startTime % 60)
							// this.minutes = minutes.toString()[1] ? minutes : '0' + minutes
						}
						else{
							this.fetchData()
							clearInterval(closeTime)
						}
					},1000)
				}
			})
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
	.pay-area{
		.button-area{
			.button-box{
				width: 85%;
				height: 70rpx;
				background-color: #179B16;
				// color: rgba(255,255,255,0.6);
				color: #fff;
				font-size: 30rpx;
				padding: 0 30rpx;
				// box-sizing: border-box;
				border-radius: 8rpx;
				.font-small{
					font-size: 24rpx;
					margin-left: 20rpx;
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
	.image-box{
		width: 100%;
		flex-wrap: wrap;
		box-sizing:border-box;
		.image-area{
			width: 155rpx;
			height: 155rpx;
			margin-right: 30rpx;
			margin-bottom: 30rpx;
			border:1px dashed #ccc;
			box-sizing:border-box;
			overflow: hidden;
			border-radius: 8rpx;
			&:nth-child(4n){
				margin-right: 0;
			}
			image{
				width: 100%;
			}
		}
	}
</style>