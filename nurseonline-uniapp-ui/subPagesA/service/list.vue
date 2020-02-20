<template>
	<view>
		<template v-if="hospitalList.length > 0">	
			<view class="flex align-center hospital-box padding-20">
				<text>选择服务机构：</text>
				<view class="bg-white padding-20 pick-box">
					<picker :range="hospitalList" @change="hospitalChange" :value="hospitalIndex" range-key="orgName">
						<view>{{hospitalList[hospitalIndex].orgName}}</view>
					</picker>
				</view>
			</view>
			
			<template v-if="serviceList.length > 0">
				<title-card title="护理服务">
					<template slot="content">
						<swiper class="swiper" :indicator-dots="true" :autoplay="false" :duration="1000" indicator-active-color="#6e8cfa">
							<swiper-item v-for="(item,index) in serviceList" :key="index">
								<view class="service-box flex">
									<view v-for="(service,serviceIndex) in item"
											   :key="serviceIndex"
											   class="flex-column flex-center service-item"
											   :class="{'no-right': (serviceIndex + 1) % 4 == 0,'no-bottom': serviceIndex > 7}"
											   @tap="toDetail(service)">
										<!-- <view class="icon-01 icons kq"></view> -->
										<!-- <view class="icon-area" :style="{backgroundImage: 'url(' + (service.iconUrl ? service.iconUrl : defaultIcon) + ')'}"> -->
										<view class="icon-area">
											<image :src="service.iconUrl" v-if="service.iconUrl" mode="widthFix"/>
											<image src="/static/service_default.jpg" mode="widthFix" v-else/>
										</view>
										<text class="tc">{{service.serviceLabel}}</text>
									</view>
								</view>
							</swiper-item>
						</swiper>
					</template>
				</title-card>
			</template>
			<template v-else>
				<title-card title="护理服务">
					<template slot="content">
						<view class="padding-20 tc font-blue">当前机构暂无相关的护理服务</view>
					</template>
				</title-card>
			</template>
			
			<!-- <view class="padding-20">
				<navigator class="bg-white custom-box flex-column flex-center" url="./userDefined">
					<view class="add-icon icon-01"></view>
					<view class="grey">自定义护理套餐</view>
				</navigator>
			</view> -->
			
			<template v-if="packageList.length > 0">
				<title-card title="护理套餐">
					<template slot="content">
						<view class="align-center padding-20 package-box border-20" 
							  :url="'./detail?serviceId=' + item.serviceId + '&orgServiceId=' + item.orgServiceId"
							  @tap="toDetail(item)"
							  v-for="(item,index) in packageList"
							  :key="index">
							<view>
								<image :src="item.iconUrl" v-if="item.iconUrl" mode="widthFix"/>
								<image src="/static/service_default_02.png" mode="widthFix" v-else/>
							</view>
							<view class="flex flex-column message-content">
								<text class="title">{{item.serviceLabel}}</text>
								<text>{{item.serviceCaption}}</text>
								<text>金额：<text class="price">{{item.priceAdjust}}元</text></text>
							</view>
						</view>
					</template>
				</title-card>
			</template>
			
		</template>
		
		<template v-else>
			<view class="padding-20 tc font-blue">当前城市暂无服务机构可以提供该服务。</view>
		</template>
		
		<uni-login ref="uniLogin" />
	</view>
</template>
<script>
import amap from '../../common/utils/amap-wx.js'
import { getAllOrg,getOrgList,getServiceList,getZoneOrg } from '@/common/api/service/service'
import { mapGetters } from 'vuex'
import { getPrice } from '@/common/api/bill/bill'
import uniLogin from "@/components/uni-login/uni-login"
export default {
	data() {
		return {
			access_token:'',
			id: '',
			hospitalIndex: 0,
			hospitalList: [],
			serviceList: [],
			packageList: [],
			defaultIcon: 'http://file.ry600.com/snapshot//files/di/di70684438lrfavs/2019-05-24/2bu5gnxv83uclaub.png',
			visitPrice:0,//出诊费
			premiumPrice:0,//保险费
			priceAdjust:0,//priceAdjust=服务费+上门费+保险费+耗材费X耗材数量
			currentOrgId:0,
			latitude: '',
			longitude: '',
			amapPlugin: null,
			key: '9e47e3566d3ae729652171562dabe658',
			address: {
				province: '',
				city: '',
				district: '',
			},
		}
	},
	computed: {
		...mapGetters(['city'])
	},
	components: {
		uniLogin,
	},
	onShow(){
		this.access_token = uni.getStorageSync('access_token')
	},
	async onLoad(e){
		await this.getLocation()
		// getOrgList(this.city.zoneCode).then(response => {
		this.access_token=uni.getStorageSync('access_token')
        if(!this.access_token==""){
			this.$refs.uniLogin.onPopup(false)
			uni.setNavigationBarTitle({
				title: e.title
			})
			this.id = e.id;
			// let { data } = await getOrgList(4408)
			// if(data.data && data.data.length > 0){
			// 	let hospitalList = data.data.filter(({isService}) => {
			// 		return isService === '1'
			// 	})
			// 	this.hospitalList = hospitalList
			// 	
			// 	await this.fetchService(hospitalList[0].orgId)
			// }
			let { data } = await getZoneOrg(this.address)
			console.log('getZoneOrg',data)
			if(data.code === 0){
				if(data.data.length > 0){
					this.hospitalList = data.data
					this.fetchHospital(this.hospitalList[0].orgId)
				}
			}
		}
	},
	mounted() {
		if (this.access_token == "") {
			this.$refs.uniLogin.onPopup(true)
		}
	},
	methods: {
		
		getLocation() {
			this.amapPlugin = new amap.AMapWX({  
				key: this.key  
			})
			
			uni.getLocation({
				success: res => {
					this.latitude = res.latitude
					this.longitude = res.longitude
				}
			})
		
			let p = new Promise((resolve, reject) => {
				this.amapPlugin.getRegeo({
					success: res => {
						console.log(res)
						let addressComponent = res[0].regeocodeData.addressComponent
						this.address = {
							province: addressComponent.province,
							city: addressComponent.city,
							district: addressComponent.district,
						}
						resolve()
					},
					fail: () => {
						resolve()
					}
				})
			})
			// let locationRes = await uni.getLocation()
			// console.log('locationRes', locationRes)
			// let res = await this.amapPlugin.getRegeo()
			// console.log('res', res)
			return p
		},
		fetchHospital(orgId) {
			getPrice(orgId).then(response => {//不同金额
				let data = response.data
				if(data.msg === 'success'){
					this.visitPrice = data.data.visit_price
					this.premiumPrice= data.data.premium_price
				}
			})
			this.fetchService(orgId)
		},
		hospitalChange(e) {
			this.hospitalIndex = e.detail.value
			this.currentOrgId=this.hospitalList[e.detail.value].orgId
			getPrice(this.currentOrgId).then(response => {//不同金额
				let data = response.data
				if(data.msg === 'success'){
					this.visitPrice = data.data.visit_price
					this.premiumPrice= data.data.premium_price
				}
			})
			this.fetchService(this.hospitalList[e.detail.value].orgId)
		},
		fetchService(orgId) {
			getServiceList({
				itemFlag: 0,
				orgId: orgId,
				treeType: this.id,
				pageSize: 100
			}).then(response => {
				let serviceList = response.data.data.records
				if(serviceList.length > 0){
					this.sliceList(serviceList)
				}
				else{
					this.serviceList = serviceList
				}
			})
			
			getServiceList({
				itemFlag: 1,
				orgId: orgId,
				treeType: this.id,
				pageSize: 100
			}).then(response => {
				this.packageList = response.data.data.records
				for(let i=0,len=this.packageList.length;i<len;i++){
					if(this.packageList[i].kitPrice==null){
						this.packageList[i].kitPrice=0
					}
					if(this.packageList[i].kitQty==null){
						this.packageList[i].kitQty=0
					}
					this.packageList[i].priceAdjust=(parseFloat(this.packageList[i].price)+parseFloat(this.visitPrice)
					+parseFloat(this.premiumPrice)+parseFloat(this.packageList[i].kitPrice)*parseFloat(this.packageList[i].kitQty)).toFixed(2)
				}
				console.log(this.packageList)
			})
		},
		sliceList(list) {
			let swiperList = new Array()
			let swiperCount = Math.ceil(list.length/12)
			for(let i=0; i<swiperCount; i++){
				swiperList[i] = new Array()
				swiperList[i] = list.slice(12*i,12*i+12)
			}
			this.serviceList = swiperList
		},
		toDetail(item) {
			let service = Object.assign({},item,{ orgName: this.hospitalList[this.hospitalIndex].orgName })
			console.log("service",service)
			if(service.kitPrice==null){
				service.kitPrice=0
				
			}
			if(service.kitQty==null){
				service.kitQty=0
			}
			let priceAdjust=(parseFloat(service.price)+parseFloat(this.visitPrice)
					+parseFloat(this.premiumPrice)+parseFloat(service.kitPrice)*parseFloat(service.kitQty)).toFixed(2)
			uni.navigateTo({
				url: './detail?service=' + encodeURIComponent(JSON.stringify(service))+'&priceAdjust='+priceAdjust
			})
		}
	}
}
</script>
<style lang="scss">
	@import "@/common/css/icon.scss";
	.hospital-box {
		text {
			flex: 1;
		}
		.pick-box {
			flex: 2;
		}
	}
	.custom-box {
		height: 180rpx;
		border: 1px dashed #c6c6c6;
		.add-icon {
			width: 60rpx;
			height: 80rpx;
			background-position: 0 99.9%;
			background-size: 120rpx;
		}
		.grey {
			color: #b5b5b6;
			font-size: 30rpx;
		}
	}
	.swiper{
		height: 570rpx;
	}
	.service-box {
		flex-wrap: wrap;
		.service-item {
			width: 25%;
			height: 190rpx;
			border-right: 1px solid #c6c6c6;
			border-bottom: 1px solid #C6C6C6;
			box-sizing: border-box;
			.icon-area{
				width: 90rpx;
				height: 90rpx;
				overflow: hidden;
				image{
					width: 100%;
				}
			}
			text{
				display:inline-block;
				width:90%;
				overflow:hidden;
				text-overflow:ellipsis;
				white-space:nowrap;
			}
			.ic0 {
				width:40px;
				height:50px;
				background-position:3px 36.1%;
				background-size:70px;
			}
			&.no-right {
				border-right: 0;
			}
			&.no-bottom {
				border-bottom: 0;
			}
		}
		
	}
	.package-box {
		image {
			width: 80rpx;
		}
		.message-content {
			margin-left: 20rpx;
			line-height: 45rpx;
			.title {
				color: #3e3a39;
				font-weight: 600;
			}
			.price {
				color: #6E8CFA;
				font-size: 32rpx;
				font-weight: 600;
			}
		}
	}
</style>