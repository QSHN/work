<template>
	<view class="phone-box">
		<view class="padding-20 bg-white">
			<view class="blue">当前服务位置</view>
			<view>{{address}}</view>
		</view>
		<view class="map-area">
			<map :latitude="latitude" :longitude="longitude" scale="18" :markers="markers"></map>
		</view>
		<view class="phone-area">
			<view class="bg-white flex-center phone-item" v-for="(list,index) in lists" :key="index" @tap="phone(list)">
				<!-- <button v-if="index === 2" open-type="contact" class="bgc-fff width120 wx-contact"></button> -->
				<text class="iconfont font-blue z-index9999" :class="{'font-large': index === 0}">
					<template v-if="index === 0">
						&#xe64f;
					</template>
					<template v-else-if="index === 1">
						&#xe850;
					</template>
<!-- 					<template v-else-if="index === 2">
						
					</template> -->
				</text>
				<text class="tip z-index9999">{{list.text}}</text>
			</view>
			<button  open-type="contact" class="bgc-fff width120 wx-contact uni-flex">
				<text  class="iconfont">&#xe7b0;</text>
				<view class="ml-10 color666 fonttext">24小时客服</view>
			</button>
		</view>
	</view>
</template>

<script>
import amap from '../../common/utils/amap-wx.js'
import { sendMessage } from '@/common/api/account/account'
export default {
	data() {
		return {
			amapPlugin: null,   
            key: '9e47e3566d3ae729652171562dabe658',
			city: '',
			address: '',
			latitude: '0',
			longitude: '0',
			markers: [],
			lists: [
				{
					text: '公安报警110',
					num: '110',
					code: '1'
				},
				{
					text: '急救中心120',
					num: '120',
					code: '2'
				},
				// {
				// 	text: '24小时客服',
				// 	num: '17707599741',
				// 	code: '3'
				// }
			]
		}
	},
	onLoad() {
		this.amapPlugin = new amap.AMapWX({  
            key: this.key  
        })
		
		this.amapPlugin.getRegeo({
			success: res => {
				this.city = res[0].regeocodeData.addressComponent
				this.address = res[0].name
			}
		})
		uni.getLocation({
			success: res => {
				this.latitude = res.latitude
				this.longitude = res.longitude
				this.markers = [
					{
						id: 0,
						latitude: res.latitude,
						longitude: res.longitude,
						iconPath: '../../static/Local.png',
						width: '30px',
						height: '30px'
					}
				]
			}
		})
	},
	onShow() {
		uni.authorize({
			scope: 'scope.userLocation',
			success: () => {
				uni.getLocation()
			}
		})
	},
	methods: {
		phone(list) {
			if(list.code==3){
				return false;
			}
			let form = {
				alarmType: list.code,
				userType: 0,
				zoneId: 0,
				zoneName: this.city.province + this.city.city + this.city.district,
				position: this.longitude + ',' + this.latitude,
				address: this.address
			}
			uni.makePhoneCall({
				phoneNumber: list.num,
				success: res => {
					console.log(res)
				}
			})
			// sendMessage(form).then(response => {
			// 	console.log(response);
			// })
		}
	}
}
</script>

<style lang="scss">
	.phone-box {
		.blue {
			color: #6e8cfa;
		}
		.map-area {
			height: 350rpx;
			map {
				height: 100%;
				width: 100%;
			}
		}
		.phone-item {
			height: 120rpx;
			margin-bottom: 6rpx;
			.tip {
				height: 72rpx;
				line-height: 72rpx;
				font-size:18px;
				font-weight:600;
			}
			.iconfont{
				font-size: 60rpx;
				vertical-align: middle;
				margin-right: 20rpx;
			}
			.font-large{
				font-size: 70rpx;
			}
		}
		.wx-contact{
			position: absolute;
			width: 100%!important;
			height: 122rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			text{
				font-size: 60rpx;
				color: #6e8cfa;
				margin-left: 10rpx;
				margin-right: 20rpx;
			
			}
			view{
				color: #666;
				font-size:36rpx;
				font-weight:600;
			}
		}
		.width120{
			width: 120rpx;
		}
		.bgc-fff{
			background-color:#fff;
		}
		.z-index9999{
			z-index: 9999;
		}
	}
</style>