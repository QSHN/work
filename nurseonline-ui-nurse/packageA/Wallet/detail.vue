<template>
	<view>
		<form @submit="formSubmit">
		  <view class="wraperView">
			 <view class="left-icon">收支明细</view>
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(user,propIndex) in banlanceInfo" :key="propIndex">
				<view>
					<view>{{user.label}}</view>
					<view class="mt5">{{user.date}}</view>
				</view>
				<view>
					{{user.hospital}}
				</view>
			</view>
		 </view>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			banlanceInfo: [	
			],
		}
	},
	onLoad() {
		this.init()
	},
	onPullDownRefresh() {
		console.log('refresh');
		this.init()
		setTimeout(function () {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		async init(){
			this.banlanceInfo=[];//刷新清空
			uni.showLoading()
			let res=await this.$apip.getBalanceDetail()
			let res_data=res.data.data.records
			console.log("res_data",res_data)
			res_data.forEach((item,index)=>{
				this.banlanceInfo.push({
						label: '退款',
						hospital:"+100",
						prop: 'weight',
						date:'2019-04-9',
						type: 'text',
						placeholder: ''
				})
				this.banlanceInfo[index].label=item.recTypeValue
				this.banlanceInfo[index].date=item.createTime
				this.banlanceInfo[index].hospital=item.amt.toFixed(2)	
			})
			uni.hideLoading()
		},
		toBasicInfo(){
			uni.navigateTo({
				url: 'basicInfo',
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
		settingTo(propIndex){
			console.log(propIndex)
			uni.navigateTo({
				url:'visLogDetail'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.padding{
		padding: 20upx;
	}
	.bottom-20{
		margin-bottom: 20upx;
	}
	.bottom-01{
		margin-bottom: 2upx;
	}
	.avatar-box{
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		overflow: hidden;
		border:1px solid #ccc;
		padding:20rpx;
		image{
			width: 100%;
		}
	}
	.btn-area{
		margin-top: 40upx;
		button{
			width: 90%;
			background-color: #00b28e;
			border-color: #75d4c0;
			color: #fff;
			border-radius: 10upx;
		}
	}
</style>
