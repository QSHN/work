<template>
	<view>
		<form @submit="formSubmit">
		  <view class="wraperView">
			 <view class="left-icon">提现记录</view>
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(user,propIndex) in banlanceInfo" :key="propIndex" @tap="settingTo(propIndex)">
				<view>
					<view>{{user.label}}<text>提现{{user.cashMoney}}元</text></view>
					<view class="mt5">{{user.date}}</view>
				</view>
				<view class="">
					<view class="text-alignR">{{user.state}}</view>
					<view class="color-red text-alignR">{{user.reason}}</view>
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
			res_data:[]//所接收数据
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
			this.banlanceInfo=[]//init
			uni.showLoading()
			let res=await this.$apip.getToCashDetail()
			let res_data=res.data.data.records
			this.res_data=res_data
			console.log("res_data",res_data)
			uni.hideLoading()
			res_data.forEach((item,index)=>{
				this.banlanceInfo.push({
						label: '',
						cashMoney:"",
						prop: 'weight',
						date:'2019-04-9',
						type: 'text',
						placeholder: '',
						state:'',
						reason:''
				})
				this.banlanceInfo[index].label=item.accountName
				this.banlanceInfo[index].date=item.createTime
				this.banlanceInfo[index].cashMoney=item.amt
				this.banlanceInfo[index].reason=item.reason
				if(item.state==0){
					this.banlanceInfo[index].state="处理中"
				}else if(item.state==1){
						this.banlanceInfo[index].state="处理完毕"
				}else if(item.state==2){
						this.banlanceInfo[index].state="处理异常"
				}
				//else if(item.state==3){//处理状态变化 柏成190523
				// 		this.banlanceInfo[index].state="处理异常"
				// }
				
			})
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
			console.log("所传数据：",this.res_data[propIndex])
			let data=JSON.stringify(this.res_data[propIndex])
			uni.navigateTo({
				url:'toCashDetail?data='+data
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
