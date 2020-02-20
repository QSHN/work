<template>
	<view class="container bg-white">
		<view class="address-list" v-if="addressList.length > 0">
			<view class="a-address flex-msg border-01" v-for="(item,index) in addressList" :key="index" @tap="selectAddress(item)">
				<view class="left-text align-center">
					<view class="selected-box" v-if="item.addressId == selectId">
						<text class="iconfont font-blue">&#xe63b;</text>
					</view>
					<view>
						<view class="name-tel">
							{{item.linkman}} {{item.phone}}
						</view>
						<view class="address-box align-center">
							<text class="default label-box" v-if="item.isDefault === '1'">默认</text>
							<text class="label label-box">{{item.label}}</text>
							<text>{{item.zoneLabel | addressFilter}}{{item.address}}</text>
						</view>
					</view>
				</view>
				<view class="right-edit" @tap.stop="editAddess(item)">
					<text class="iconfont font-blue">&#xe639;</text>
				</view>
			</view>
		</view>
		<navigator class="tip align-center flex-column" url="./add" v-else>
			<image src="http://file.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//yjh_address.png" mode="widthFix" class="bottom-20"/>
			<text class="font-blue">暂时没有服务地址，先去增加一个吧</text>		
		</navigator>
		<navigator class="bottom-box" url="./add">
			<view class="add-btn align-center"><text class="iconfont font-blue">&#xe6f1;</text>新建常用地址</view>
		</navigator>
	</view>
</template>

<script>
import { getAddress } from '@/common/api/account/account'
import { mapMutations } from 'vuex'
export default {
	data() {
		return {
			addressList: [],
			selectId: ''
		}
	},
	onShow() {
		this.fetchAddress()
	},
	onPullDownRefresh() {
		this.fetchAddress()
	},
	onLoad(e) {
		this.selectId = e.addressId ? e.addressId : ''
	},
	filters: {
		addressFilter: function(value) {
			return value.replace(/-/g,'')
		}
	},
	methods: {
		fetchAddress() {
			getAddress().then(({data}) => {
				if(data.msg === 'success'){
					this.addressList = data.data
					if(data.data.length <= 0){
						this.$store.commit('INIT_ADDRESS')
					}
				}
			})
		},
		editAddess(item) {
			uni.navigateTo({
				url:'edit?addressItem=' + JSON.stringify(item)
			})
		},
		selectAddress(item) {
			if(this.selectId){
				this.$store.commit('SET_ADDRESS',item)
				uni.navigateBack({
					delta: -1
				})
			}
		}
	}
}
</script>

<style lang="scss">
	.container,.tip{
		min-height: 100%;
	}
	.container{
		padding-bottom: 100rpx;
	}
	.tip{
		padding-top: 150rpx;
		box-sizing: border-box;
		image{
			width: 100rpx;
		}
	}
	.address-list{
		.a-address {
			padding: 30rpx 20rpx;
			
			.selected-box{
				margin-right: 20rpx;
				.iconfont{
					font-size: 40rpx;
				}
			}
			
			.name-tel {
				margin-bottom: 20rpx;
			}
			
			.address-box {
				font-size: 24rpx;
				color: #888;
				line-height: 36rpx;
				.label-box{
					color: #fff;
					margin-right: 10rpx;
					border-radius: 8rpx;
					padding: 2rpx 10rpx;
				}
				.default{
					background-color: #ed5560;
				}
				.label{
					background-color: #6e8cfa;
				}
			}
			
			.right-edit {
				.iconfont{
					font-size: 40rpx;
					font-weight: 600;
				}		
			}	
		}
	}
	.bottom-box {
		position: fixed;
		width: 100%;
		bottom: 0;
		font-size: 28rpx;
		color: #000;
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