<template>
	<view>
		<view class="uni-title uni-common-pl padding uni-flex justify-content-space">
			<view class="left-icon">成功入驻</view>
			<view @tap="toHomePage"><text class="iconfont color6e8cfa mr10">&#xe62b;</text>首页</view>
		</view>
		<view class="color666 text-alignC width100p title" v-if="showNoOrg">您当前还未成功入驻机构</view>
		<form @submit="formSubmit" v-if="!showNoOrg">
		  <view class="wraperView">
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(user,propIndex) in userInfo" :key="propIndex">
				<view>
					<view>{{user.hospital}}</view> 
				</view>
			</view>
		 </view>
		</form>
		<view style="margin-top:58upx;padding-bottom: 18px;">
			<button type="primary color6d8bf9" @tap="toNewOrg">申请入驻新机构</button>
		</view>
		<view class="width100p mt20"></view>
		<!-- <org-log></org-log> -->
	</view>
</template>

<script>
import orgLog from '@/packageA/MyOrg/orgLog.vue'	
export default {
	data() {
		return {
			sexIdx: "0",
			date: '1949-10-01',
			userInfo: [
			],
			showNoOrg:false
		}
	},
	components: {
		orgLog
	},
	onLoad() {
		this.init()
	},
	onPullDownRefresh() {
		this.init()
		 setTimeout(function () {
		    uni.stopPullDownRefresh();
		}, 1000);
	},
	computed:{
		orgRefresh(){
			return this.$store.state.orgRefresh
		}
	},
	watch:{
		orgRefresh(){
			console.log("我监听到了orgRefresh状态的变化",this.$store.state.orgRefresh)
			this.init()//进行刷新 预约单相关状态刷新
		}
	},
	methods: {
		async init(){
			this.userInfo=[]
			uni.showLoading({})
			let res_joinedOrg=await this.$api.joinedOkOrg()
			let res_joinedOrg_data=res_joinedOrg.data.data
			uni.hideLoading()
			if(res_joinedOrg_data.length<1){ //没有成功入驻
				this.showNoOrg=true
				return false;
			}else{
				this.showNoOrg=false
			}
			res_joinedOrg_data.forEach((item,index)=>{
				let state
				if(item.state==0){
					state="已提交"
				}else if(item.state==1){
					state="审核通过"
				}else if(item.state==2){
					state="驳回"
				}
				this.userInfo.push({
					label: item.createTime,
					hospital:item.orgName,
					prop: 'height',
					type: 'text',
					placeholder: '',
					state:state
				})
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
			console.log(propIndex)
			uni.navigateTo({
				url:'visLogDetail'
			})
		},
		toHomePage(){
			this.$store.state.homeRefresh++
			uni.switchTab({
				url:'../../pages/HomePage/index'
			})
		},
		toNewOrg(){
			uni.navigateTo({
				url:'orgUnjoined'
			})
		},
		toOrgLog(){//历史记录
			uni.navigateTo({
				url:'orgLog'
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
