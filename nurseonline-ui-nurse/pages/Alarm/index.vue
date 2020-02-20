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
			<view class="bg-white flex-center phone-item" v-for="(list,index) in lists" :key="index" @tap="phone(list.num,index)">
				<text v-if="index==0" class="iconfont  font-size60-im color6e8cfa ">&#xe630;</text>
				<text v-if="index==1" class="iconfont  font-size60-im color6e8cfa">&#xe603;</text>
				<button v-if="index==2" open-type="contact" class="bgc-fff width120 wx-contact"></button>
				<text v-if="index==2" class="iconfont  font-size60-im color6e8cfa mr10">&#xe601;</text>
				<text :class="index==2?'ml-10':'noclass'">{{list.text}}</text>
			</view>
			<button  open-type="contact" class="bgc-fff width120 wx-contact uni-flex">
				<text  class="iconfont  font-size60-im color6e8cfa mr20 ml10 uni-item">&#xe601;</text>
				<view class="ml-10 color666 fonttext uni-item">24小时客服</view>
			</button>
		</view>
	</view>
</template>

<script>
import amap from '@/static/common/map/amap-wx.js'
export default {
	data() {
		return {
			amapPlugin: null,   
            key: '9e47e3566d3ae729652171562dabe658',
			address: '',
			latitude: '0',
			longitude: '0',
			markers: [],
			lists: [
				{
					icon: 'police',
					text: '公安报警110',
					num: '110'
				},
				{
					icon: 'hospital',
					text: '急救中心120',
					num: '120'
				},
				// {
				// 	icon: 'servive',
				// 	text: '24 小时客服',
				// 	num: ''
				// }
			]
		}
	},
	onLoad() {
		let phoneNumber=this.$store.state.servePhone//转wx-contact 
		// this.lists[2].num=phoneNumber
		
		this.amapPlugin = new amap.AMapWX({  
            key: this.key  
        })
		
		this.amapPlugin.getRegeo({
			success: res => {
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
						iconPath: '../../static/img/addr/local.png',
						width: '30px',
						height: '30px'
					}
				]
			}
		})
	},
	//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
	// onPullDownRefresh() {
	//     setTimeout(function () {
	//         uni.stopPullDownRefresh();
	//     }, 1000);
	// },
	methods: {
		 phone(num,index) {
			if(index==2){
				return false;//不呼起，转接微信客服
			}
			let alarmType =index + 1
			let userType  =1//服务人员
			let zoneId =0;//暂时为0 190523
			let zoneName =this.address;
			let position =this.longitude+','+this.latitude;
			let address =this.address;
			let data={alarmType:alarmType,userType:userType,zoneId:zoneId,zoneName:zoneName,position:position,address:address}
			uni.showModal({
				title: '提示',
				content: '您确定要拨打'+this.lists[index].text+'电话吗？',
				success: async (res)=>{
					if (res.confirm) {
						console.log('用户点击确定');
						uni.makePhoneCall({
							phoneNumber: num,
							success: async (res1) => {
								console.log(res1)
								let res=await this.$api.addAlarmLog(data)
							}
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
			
		},
		
	}
}
</script>

<style lang="scss">
	.ml-10{
		// margin-left:-10upx;
	}
	.icon {
	   width: 1em; height: 1em;
	   vertical-align: -0.15em;
	   fill: currentColor;
	   overflow: hidden;
	}
	.phone-box {
		.blue {
			color: #6e8cfa;
		}
		.map-area {
			height: 350upx;
			map {
				height: 100%;
				width: 100%;
			}
		}
		.phone-item {
			height: 120upx;
			margin-bottom: 6upx;
			text {
				height: 72upx;
				line-height: 72upx;
				padding-left:30upx;
				font-size:18px;
				font-weight:500;
				background-size:250px;
				z-index: 9999;
				&.police {
					line-height:80upx;
					background-position:0 93.6%;
				}
				&.hospital {			
					background-position:-1% 95.9%;
				}
				&.servive {
					background-position:-3% 98.5%;
				}
			}
		}
		.wx-contact{
			position: absolute;
			width: 100%;
			height: 122rpx;
			line-height: 122rpx;
		    justify-content: center;
			align-items: center;
		}
		.fonttext{
			font-size:36rpx;
			margin-left: 5rpx;
			margin-bottom: 10rpx;
			
		}
	}
</style>