<template>
	<view>
		<form @submit="formSubmit">
		  <view class="wraperView">
			<view class="color666 text-alignC width100p title" v-if="showMention">当前无就诊记录</view>
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(user,propIndex) in userInfo" :key="propIndex" @tap="settingTo(propIndex)">
				<view>
					<view>资料日期:{{user.label}}</view>
					<view>医院名称：{{user.hospital}}</view>
				</view>
				<view>
					<text class="iconfont">&#xe6f8;</text>
				</view>
			</view>
		 </view>
		</form>
	</view>
</template>

<script>
var res_data;
export default {
	data() {
		return {
			sexIdx: "0",
			date: '1949-10-01',
			userInfo: [
				// {
				// 	label: '2018.10.09',
				// 	hospital:"湛江市某某某医院",
				// 	prop: 'height',
				// 	type: 'text',
				// 	placeholder: ''
				// },
				// {
				// 	label: '2018.10.09',
				// 	hospital:"湛江市某某某医院",
				// 	prop: 'weight',
				// 	type: 'text',
				// 	placeholder: ''
				// },
			],
			showMention:false
		}
	},
	onLoad(options) {
		let custId=options.custId
		this.init(custId)
	},
	methods: {
		async init(custId){
			uni.showLoading({})
			let res=await this.$apio.treatrec(custId)
			res_data=res.data.data.records
			console.log("res_data",res_data)
			if(res_data.length<=0){
				uni.showToast({
					title:'当前无就诊记录',
					icon:'none'
				})
				this.showMention=true
				return false;
			}
			this.showMention=false
			res_data.forEach((item,index)=>{
				this.userInfo.push(
					{
						label: '',
						hospital:"湛江市某某某医院",
						prop: 'height',
						type: 'text',
						placeholder: ''
					}
				)
				this.userInfo[index].label=item.treatDate
				this.userInfo[index].hospital=item.orgName
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
			console.log("res_data",propIndex,res_data[propIndex])
			// let data=JSON.stringify(res_data[propIndex])
			this.$store.state.detailObj=res_data[propIndex]
			uni.navigateTo({
				url:'visLogDetail'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.title{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
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
