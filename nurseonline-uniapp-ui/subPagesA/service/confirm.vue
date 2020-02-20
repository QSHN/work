<template>
	<view>
		<view class="flex align-center hospital-box padding-20 bottom-20">
			<text>选择服务机构：</text>
			<view class="bg-white padding-20 pick-box">
				<picker :range="hospital" @change="hospitalChange" :value="hospitalIdx" range-key="label">
					<view>{{hospital[hospitalIdx].label}}</view>
				</picker>
			</view>
		</view>
		<view class="padding-20 bg-white bottom-20">
			<view class="bottom-20 label-box" v-if="selectedList.length > 0">
				<text class="tc" v-for="(label,index) in selectedList" :key="index">{{label}}</text>
			</view>
			<view class="tc">总服务费：<text class="font-blue">{{total}}元</text></view>
		</view>
		<view class="button-area">
			<button @tap="pay">立即购买</button>
		</view>
		<title-card title="推荐方案">
			<template slot="content">
				<!-- <checkbox-group>
					<view class="flex-msg padding-20 package-box bottom-20">
						<view class="align-center">
							<view class="image-area">
								<image src="../../static/service_02.png" mode="widthFix"/>
							</view>	
							<view class="flex flex-column message-content">
								<text class="title">口腔护理</text>
								<text>长期卧病、口腔疾病、生活不能自理患者</text>
								<text>服务费：<text class="price">100元</text></text>
							</view>
						</view>					
						<checkbox value="cb"/>
					</view>
				</checkbox-group> -->
				<view class="align-center padding-20 package-box bottom-20">
					<view class="image-area">
						<image src="../../static/service_02.png" mode="widthFix"/>
					</view>	
					<view class="flex flex-column message-content">
						<text class="title">口腔护理</text>
						<text>长期卧病、口腔疾病、生活不能自理患者</text>
						<text>服务费：<text class="price">100元</text></text>
					</view>
				</view>
			</template>
		</title-card>
		
		<title-card title="服务列表">
			<template slot="content">
				<view class="search-box padding-20 align-center">
					<view class="input-area padding-20 align-center">
						<text class="icon iconfont">&#xe741;</text>
						<input type="text" value="" />
					</view>
					
					<button class="search-btn">搜索</button>
				</view>
				<checkbox-group @change="checkboxChange">
					<view class="flex-msg padding-20 package-box border-20" v-for="(service,index) in serviceList" :key="index">
						<view class="align-center">
							<view class="image-area">
								<image src="../../static/service_02.png" mode="widthFix"/>
							</view>						
							<view class="flex flex-column message-content">
								<text class="title">{{service.text}}</text>
								<text>{{service.introduce}}</text>
								<text>服务费：<text class="price">{{service.price}}元</text></text>
							</view>
						</view>
						<checkbox :value="index"/>
					</view>
				</checkbox-group>
			</template>
		</title-card>
	</view>
</template>
<script>
export default {
	data() {
		return {
			selectedList: [],
			hospitalIdx: 0,
			hospital: [
				{
					value: '0',
					label: '湛江市某某某医院'
				},
				{
					value: '1',
					label: '湛江市某某某护理服务中心'
				}
			],
			serviceList: [
				{
					text: '口腔护理',
					introduce: '口腔清洁，防止口腔并发症',
					price: '100'
				},
				{
					text: '灌肠护理',
					introduce: '用导管自肛门经直肠插入结肠灌注液体，已达到通便排气的治疗方法',
					price: '200'
				},
				{
					text: '压疮护理',
					introduce: '护士上门提供压疮护理服务，包活对压疮部位的清洁、消毒、更换敷料等',
					price: '200'
				},
				{
					text: '留置导尿',
					introduce: '护士上门提供导尿护理服务，包括对留置尿管的更换、日常护理及指导',
					price: '250'
				},
				{
					text: 'PICC换药',
					introduce: '护士上门提供PICC换药服务，包括对PICC置管的换药和维护服务，并指导患者自我维护及健康指导等',
					price: '300'
				}
			],
			total: 0
		}
	},
	methods: {
		hospitalChange(e) {
			this.hospitalIdx = e.detail.value
		},
		pay() {
			uni.redirectTo({
				url: './pay'
			})
		},
		checkboxChange(e) {
			// console.log(e.detail.value)
			this.selectedList = []
			let total = 0
			let values = e.detail.value
			let services = this.serviceList
			
			services.map((s,sIdx) => {
				values.map((m,mIdx) => {
					if(sIdx == m){
						this.selectedList.push(s.text)
						total += Number(s.price)
					}
				})
			})
			this.total = total
		}
	},
}
</script>

<style lang="scss">
	.hospital-box {
		text {
			flex: 1;
		}
		.pick-box {
			flex: 2;
		}
	}
	.label-box {
		text{
			display: inline-block;
			background-color: #6e8cfa;
			color: #fff;
			border-radius: 8rpx;
			font-size: 24rpx;
			width: 120rpx;
			height: 50rpx;
			line-height: 50rpx;
			margin-right: 10rpx;
			margin-bottom: 10rpx;
		}
	}
	.package-box {
		.image-area{
			width: 120rpx;
			image {
				width: 100%;
			}
		}
		
		.message-content {
			width: 510rpx;
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
	.search-box {
		height: 70rpx;
		.input-area {
			height: 66rpx;
			border: 2rpx solid #c6c6c6;
			border-radius: 8rpx;
			box-sizing: border-box;
			flex: 2.5;
			.icon {
				font-size: 40rpx;
				color: #c6c6c6;
				margin-right: 10rpx;
			}
		}
		button {
			height: 70rpx;
			line-height: 70rpx;
			flex: 1;
			margin-left: 10rpx;
		}
	}
</style>