<template>
	<view>
		<view class="uni-title uni-common-pl padding uni-flex justify-content-space">
			<view class="left-icon">入驻历史记录</view>
		</view>
		<view class="color666 text-alignC width100p title" v-if="showNoOrgHistory">当前入驻历史为空</view>
		<form @submit="formSubmit" v-if="!showNoOrgHistory">
		  <view class="wraperView">
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(user,propIndex) in userInfo" :key="propIndex">
				<view>
					<view>{{user.hospital}}</view> 
				</view>
				<view>
					<view class="text-alignR"><text v-if="user.state=='驳回'" class="iconfont mr10" style="color:#e85454;">&#xe626;</text>{{user.state}}</view>
					<view  class="color-red text-alignR text-ellipsis"> <text @longpress="longTap" :id="user.reqId">{{user.reason}}</text></view>
				</view>
			</view>
		 </view>
		</form>
	</view>
</template>

<script>
let res_joinedOrg_data;	
export default {
	data() {
		return {
			sexIdx: "0",
			date: '1949-10-01',
			userInfo: [
			],
			showNoOrgHistory:false,
			longTapTrue:true,
			
		}
	},
	onLoad() {
		this.init()
	},
	computed:{
		orgUnJoinedRefresh(){
			return this.$store.state.orgUnJoinedRefresh
		},
	},
	watch:{
		orgUnJoinedRefresh(){
			console.log("我监听到了orgUnJoinedRefresh状态的变化",this.$store.state.orgUnJoinedRefresh)
			this.init()
			setTimeout(function () {
			    uni.stopPullDownRefresh();
			}, 1000);
		},
	},
	onPullDownRefresh() {
		this.init()
		setTimeout(function () {
		    uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		async init(){
			this.userInfo=[]
			uni.showLoading({})
			let res_joinedOrg=await this.$api.joinedOrg()
			uni.hideLoading()
			res_joinedOrg_data=res_joinedOrg.data.data
			
			if(res_joinedOrg_data.length<1){ //没有入驻历史
				this.showNoOrgHistory=true
				return false;
			}else{
				this.showNoOrgHistory=false
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
					reqId:item.reqId,
					label: item.createTime,
					hospital:item.orgName,
					prop: 'height',
					type: 'text',
					placeholder: '',
					state:state,
					reason:item.reason
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
		backToIndex(){
			this.$store.state.orgRefresh++;
			uni.navigateBack({
				url:'index'
			})
		},
		longTap: (e)=>{
			console.log("long tap",e.target.id)
			let msgErr=' '
			res_joinedOrg_data.forEach((item,index)=>{
				if(item.reqId==e.target.id){
					msgErr=item.reason
				}
			})
			wx.showModal({
			  title: '',
			  content: msgErr,
			  showCancel: false
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.text-ellipsis{
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 300rpx;
		-webkit-line-clamp: 1;
		display: -webkit-box;
		-webkit-box-orient: vertical;
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
