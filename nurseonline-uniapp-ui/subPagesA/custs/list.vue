<template>
	<view :class="{'height100': custList.length <= 0}">
		<view v-if="custList.length > 0" class="list-area">
			<view class="bg-white padding-20 list-item" v-for="(item,index) in custList" :key="index" @tap="selectItem(item)">
				<view class="list-title bottom-10">{{item.custName}}</view>
				<!-- <view>手机号码：18012947513</view> -->
				<view class="bottom-10">{{item.address}}</view>
				<view class="flex list-down">
					<view class="font-blue tc" @tap.stop.prevent="toDetail(item)">查看</view>
					<view class="font-red tc del" @tap.stop.prevent="custUnbind(item)">解绑</view>
				</view>
			</view>
		</view>
		<navigator class="tip bg-white flex-column align-center" url="./create" v-else>
			<text class="iconfont font-blue bottom-20">&#xe600;</text>
			<text class="font-blue">暂时没有服务对象，先去增加一个吧</text>		
		</navigator>
		<navigator class="bottom-box" url="./create" v-if="custList.length < 5">
			<view class="add-btn align-center">
				<text class="iconfont font-blue">&#xe6f1;</text>添加服务对象
			</view>
		</navigator>
	</view>
</template>

<script>
import { getCustList,unbindCust } from '@/common/api/cust/cust'
import { mapMutations } from 'vuex'
export default {
	data () {
		return {
			custList: [],
			isSelected: false,
			sexColumn: [
				{
					label: '默认',
					value: '0'
				},
				{
					label: '男',
					value: '1'
				},
				{
					label: '女',
					value: '2'
				}
			]
		}
	},
	onLoad(e) {
		if(e.isSelected === 'true'){
			this.isSelected = true
		}
	},
	onShow() {
		this.fetchData()
	},
	onPullDownRefresh() {
		this.fetchData()
	},
	methods: {
		selectItem(item) {
			if(this.isSelected){
				this.$store.commit('SET_PATIENTS',item)
				uni.navigateBack({
					delta: -1
				})
			}
		},
		fetchData() {
			getCustList().then(response => {
				// console.log(response)
				let data = response.data
				if(data.data){
					this.custList = response.data.data
				}
			})
		},
		toDetail(item) {
			uni.navigateTo({
				url: './detail?cust=' + JSON.stringify(item)
			})
		},
		custUnbind(item) {
			uni.showModal({
				title: '提示',
				content: '是否与当前服务对象解除绑定？',
				success: res => {
					if(res.confirm){
						unbindCust(item).then(response => {
							let data = response.data
							if(data.msg === 'success'){
								setTimeout(() => {
									uni.showToast({
										title: '解绑成功！'
									})
									this.fetchData()
								},500)
								
							}
						})
					}
				}
			})
		}
	},
}
</script>

<style lang="scss" scoped>
.height100{
	height: 100%;
}
.list-item{
	margin-bottom: 4rpx;
	.list-title{
		font-size: 32rpx;
		color: #000;
		.font-small{
			font-size: 24rpx;
		}
	}
	.list-down{
		border-top: 1px solid #f1f1f1;
		padding-top: 20rpx;
		view{
			flex: 1;
		}
		.del{
			border-left: 1px solid #ccc;
		}
	}
}
.tip{
	height: 100%;
	padding-top: 150rpx;
	box-sizing: border-box;
	.iconfont{
		font-size: 100rpx;
	}
}
.list-area{
	margin-bottom: 100rpx;
}
.avatar-box{
	width: 80rpx;
	height: 80rpx;
	border-radius: 8rpx;
	overflow: hidden;
	border: 2rpx solid #ccc;
	padding:20rpx;
	image{
		width: 100%;
	}
}
.info{
	margin-left: 40rpx;
	.user-name{
		font-size: 32rpx;
		font-weight: 600;
	}
}
// .tip {
// 	.iconfont {
// 		font-size: 36rpx;
// 		margin-left: 10rpx;
// 	}
// }
.bottom-box {
		position: fixed;
		width: 100%;
		bottom: 0;
		font-size: 28rpx;
		border-top: 1rpx solid #eee;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #fff;
		box-shadow:0 -1px 3px 1px #f1f1f1;
		.add-btn {
			margin-left: 30rpx;
			.iconfont{
				margin-right: 10rpx;
			}				
		}
	}
</style>
