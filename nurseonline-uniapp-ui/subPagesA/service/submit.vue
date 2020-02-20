<template>
	<view class="submit-content" :class="dialogVisible == true ? 'popup-parent--hidden' : ''">
		<view>
			<navigator :url="'/pages/address/list?addressId=' + address.addressId"
						class="a-address flex-msg border-01 bg-white bottom-20"
						:key="index"
						v-if="hasAddress">
				<view class="left-text">
					<view class="name-tel">
						{{address.linkman + ' ' + address.phone}}
					</view>
					<view class="address-box align-center">
						<text class="default label-box" v-if="address.isDefault === '1'">默认</text>
						<text class="label label-box">{{address.label}}</text>
						<text>{{address.zoneLabel | addressFilter}}{{address.address}}</text>
					</view>
				</view>
				<view class="right-edit">
					<text class="iconfont">&#xe6f8;</text>
				</view>
			</navigator>
			<navigator url="/pages/address/list?addressId=-1" class="flex-msg border-01 padding-20 bg-white bottom-20" v-else>
				<text><text class="font-red">*</text>服务地址<text class="font-red">（必填）</text></text>
				<view>
					<text class="icon iconfont">&#xe6f8;</text>
				</view>	
			</navigator>
			
			<view class="bg-white bottom-20">
				<navigator url="../custs/list?isSelected=true" class="flex-msg border-01 padding-20">
					<text><text class="font-red">*</text>服务对象<text class="font-red">（必填）</text></text>
					<view>
						<text v-if="patients.custName">{{patients.custName}}</text>
						<text class="icon iconfont" v-else>&#xe6f8;</text>
					</view>	
				</navigator>
				<!-- <view class="flex-msg border-01 padding-20">
					<text>服务人员</text>
					<radio-group @change="radioChange" class="radio-area">
						<label v-for="(item,index) in radioList" :key="index">
							<radio :value="item.value" :checked="index === current" color="#6E8CFA"/>
							<text>{{item.name}}</text>
						</label>
					</radio-group>
				</view> -->
				<navigator url="/pages/date/list" class="flex-msg border-01 padding-20">
					<text><text class="font-red">*</text>服务时间<text class="font-red">（必填）</text></text>
					<view>
						<text v-if="serviceTime.reserveDate" class="font-grey">
							{{serviceTime.reserveDate + ' ' + serviceTime.reserveTime1 + '-' + serviceTime.reserveTime2}}
						</text>
						<text class="icon iconfont" v-else>&#xe6f8;</text>
					</view>	
				</navigator>
				<view class="flex-msg border-01 padding-20">
					<text><text class="font-red">*</text>购买数量<text class="font-red">（必填）</text></text>
					<!-- <picker :range="totalList" @change="totalChange" :value="totalIndex">
						<view>{{totalList[totalIndex]}}</view>
					</picker> -->
					<!-- <view>1</view> -->
					<input type="text" placeholder="请输入购买数量" class="tr" v-model="qty"/>
				</view>
			</view>
			
			<view class="bg-white bottom-20">
				<!-- <view class="flex-msg border-01 padding-20">
					<text>病情描述</text>
					<input type="text" placeholder="请输入病情描述" class="tr" v-model="diseaseDesc"/>
				</view> -->
				<view class="border-01 padding-20">
					<text>病情描述</text>
					<!-- <input type="text" placeholder="请输入病情描述" class="tr" v-model="diseaseDesc"/> -->
					<textarea v-model="diseaseDesc" placeholder="请输入病情描述" class="diseaseDesc" v-show="!dialogVisible" />
					<view class="simulate-textarea" v-show="dialogVisible">
						<rich-text :nodes="diseaseDescText"></rich-text>
					</view>
				</view>
				<navigator url="./upload" class="flex-msg border-01 padding-20">
					<text><text class="font-red">*</text>就医证明<text class="font-red">（必填）</text></text>
					<view>
						<text v-if="billCertList.length > 0" class="font-grey">共{{billCertList.length}}张图片</text>
						<text class="icon iconfont" v-else>&#xe6f8;</text>
					</view>	
				</navigator>
				<!-- <title-card title="上传就医证明资料">
					<template slot="content">
						<view class="padding-20 justify-between bottom-20">
							<view class="tc" @tap="uploadPicture(0)">
								<view class="upload-area flex-center">
									<image :src="firstImg" mode="widthFix"></image>
								</view>
								<view class="flex-center upload-area" v-if="firstImg == ''">
									<text class="iconfont">&#xe6df;</text>
								</view>
								<view class="upload-area" v-else>
									<image :src="firstImg" mode="aspectFill"></image>
								</view>
								<text>上传处方</text>
							</view>
							<view class="tc" @tap="uploadPicture(1)">
								<view class="upload-area flex-center">
									<image :src="secondImg" mode="widthFix"></image>
								</view>
								<view class="flex-center upload-area" v-if="secondImg == ''">
									<text class="iconfont">&#xe6df;</text>
								</view>
								<view class="upload-area" v-else>
									<image :src="secondImg" mode="aspectFill"></image>
								</view>
								<text>上传药品</text>
							</view>
						</view>
					</template>
				</title-card> -->
			</view>
			<view class="image-area" @tap="showTip">
				<image src="/static/submit_tip.jpg" mode="widthFix"/>
			</view>
			<view class="bg-white bottom-20 tr price-area padding-20">
				<view class="flex-msg">
					<text>{{service.serviceLabel}}：</text>
					<!-- <text>¥ {{service.price + ' x ' + qty + service.unit}}</text> -->
					<text>¥ {{service_Single}}x{{qty}}次</text>
				</view>
				<!-- <view class="flex-msg" v-if="service.kitGoodsLabel">
					<text>{{service.kitGoodsLabel}}</text>
					<text>¥ {{service.kitPrice + ' x ' + service.kitQty + ' x ' + qty + service.unit}}</text>
				</view>
				<view class="flex-msg">
					<text>上门费</text>
					<text>¥ {{visitPrice}} x {{qty}}{{service.unit}}</text>
				</view>
				<view class="flex-msg">
					<text>保险费</text>
					<text>¥ {{premiumPrice}} x {{qty}}{{service.unit}}</text>
				</view> -->
				<view class="flex-msg">
					<text>总金额：</text>
					<text class="font-blue total">¥ {{total}}</text>
				</view>
			</view>
			
			<view class="button-area bottom-20">
				<button @tap="orderPay" :disabled="canSubmit">立即提交</button>
			</view>
			<view class="tc bottom-20">
				<view class="checkbox justify-center">
					<checkbox-group @change="checkboxChange">
						<label class="checkbox justify-center">
							<checkbox value="cb" :value="1" :checked="readRule" />
							<view>已阅读并同意<text class="font-blue" @tap.stop="handleOpenDialog">《知情告知书》</text></view>
						</label>
					</checkbox-group>
				</view>
			</view>
			<view class="tip-area flex-center" v-if="tipShow">
				<view class="tip-bg" @tap="hideTip"></view>
				<view class="tip-box padding-20 bg-white">
					<view class="bottom-20">
						<view>1，平台将为患者和医护人员提供医责险、意外险和第三者责任险共三种保险，全力保障您的生命财产安全。</view>
						<view>2，私下联系工作人员上门，造成任何损失，平台不负责。</view>
						<view>3，上门服务对象需满三岁，三岁以下儿童及病危患紧急者建议到医院就诊。</view>
					</view>
					<view class="button-area">
						<button @tap="hideTip">我知道了</button>
					</view>
				</view>
			</view>
			<chunLei-modal v-model="dialogVisible" :type="popupOptions.type" :mData="popupOptions" navMask>
				<view v-if="popupOptions.content == ''">
					<p>&nbsp;</p>
					<p>
						居家护理具有一定的危险性，为确保医疗安全，建议您尽量到医疗机构接受护理。因患者本人或家属坚决要求在家中进行护理，请签订此知情同意书。由此产生的一切医疗意外，由患者及家属承担相应的责任。&ensp;
					</p>
					<p>一、医务人员职责：&ensp;</p>
					<p>1、告知您在家中进行治疗的风险。&ensp;</p>
					<p>2、按时为您提供治疗。如遇特殊情况，将事先通知您并与您协商治疗时间。&ensp;</p>
					<p>3、严格遵守操作规程及查对制度。&ensp;</p>
					<p>4、向您或家属交待该项治疗的护理及注意事项。&ensp;</p>
					<p>5、操作完医护人员密切观察，无异常后方可离去，并如实记录。&ensp;</p>
					<p>6、抗生素、生物制品（如脂肪乳）、化疗药品、各种疫苗、血液制品、及其他需作皮试的药物不在家中使用。&ensp;</p>
					<p>二、患者及家属职责：&ensp;</p>
					<p>1、按预约治疗时间提前做好准备工作。如：擦拭桌面、地面、保护患者不受凉的情况下，开窗通风、准备好护士操作用的台面等。&ensp;</p>
					<p>2、家属需全程看护患者，听从医护人员安排；发现患者出现寒战、憋气、呼吸困难、心慌等异常情况，应立即通知医护人员，并呼叫120急救进行处理；&ensp;</p>
					<p>3、治疗操作结束30分钟内，应避免患者体位的突然变化。&ensp;</p>
					<p>4、按要求妥善保管治疗所需的药品。&ensp;</p>
					<p>5、您使用的耗材为平台指定提供,一些日常生活物品可自行提供。若没有对应的耗材，医护人员有权利拒绝提供服务。</p>
					<p>三、因环境限制、患者个体差异和病情变化，治疗期间有可能发生以下意外及并发症：&ensp;</p>
					<p>1.上门因检查设备限制，容易出现漏诊、误诊等风险。&ensp;</p>
					<p>2.治疗期间可能发生原发疾病复发，如休克、高血压、心脑血管意外、心律失常、循环衰竭、心搏骤停等。&ensp;</p>
					<p>
						3．插/更换胃管时容易出现恶心、呕吐、流泪、呛咳等刺激性反应，首次留置胃管时，不配合患者易损伤食道出现出血，昏迷患者更换胃管时可能会误入气管，造成窒息、心律失常等风险。&ensp;
					</p>
					<p>
						4．插/更换尿管时因部分患者尿道狭窄容易损伤尿道或者导尿不成功（老年男性更为常见），导尿后出现血尿或不能完成导尿，更换尿管后也会出现漏尿、慢性渗血等，长时间留置尿管后容易出现尿路感染、尿液混浊导尿管不通等。&ensp;
					</p>
					<p>5.压疮换药后容易出现感染、迁延性愈合等不可预知的风险。&ensp;</p>
					<p>6．康复治疗过程中因患者体质原因（原发基础疾病、骨质疏松等）出现晕针、心脑血管意外、骨折等；艾灸、敷药过程中会出现烫伤、皮肤过敏等；&ensp;</p>
					<p>7．因不可抗拒因素出现的其他医疗意外风险。</p>
					<ol start="8">
						<li>您点击勾选后，认为您清楚阅读本同意书，同意以上内容条款，并承担相应责任。</li>
					</ol>
				</view>
				<view v-else>
					<rich-text :nodes="popupOptions.content"></rich-text>
				</view>
			</chunLei-modal>
		</view>
	</view>
</template>

<script>
import { validatenull } from '@/common/utils/util'
import { getAddress } from '@/common/api/account/account'
import { submitBill,getPrice } from '@/common/api/bill/bill'
import { getOrgServiceDetail, getInformedContent } from '@/common/api/service/service'
import { mapGetters,mapMutations } from 'vuex'
import ChunLeiModal from '@/components/chunLei-modal/chunLei-modal.vue'

export default {
	components: {
		ChunLeiModal,
	},
	data() {
		return {
			firstImg: 'http://file.ry600.com/snapshot//files/di/di70684438lrfavs/2019-04-13/3gut5wqyasvbz69o.jpg',
			secondImg: 'http://file.ry600.com/snapshot//files/di/di70684438lrfavs/2019-04-13/5a93gp3e5vao7kak.jpg',
			totalIndex: 2,
			totalList: [0,1,2,3],
			current: 1,
			packageShow: false,
			// radioList: [
			// 	{
			// 		value: '0',
			// 		name: '是'
			// 	},
			// 	{
			// 		value: '1',
			// 		name: '否'
			// 	}
			// ],
			hasAddress: false,
			service: {},
			diseaseDesc: '',
			visitPrice: 0,
			premiumPrice: 0,
			tipShow: false,
			qty: 1,
			popupOptions: {
				type: 'rich-text',
				title: '知情告知书',
				content: '',
			},
			dialogVisible: false,
			readRule: false,
		}
	},
	filters: {
		addressFilter: function(value) {
			return value ? value.replace(/-/g,'') : ''
		}
	},
	computed: {
		...mapGetters(['serviceTime','address','patients','billCertList']),
		total() {
			let total = this.service.price * 100 + (this.service.kitPrice * this.service.kitQty) * 100 + this.visitPrice * 100 + this.premiumPrice * 100
			total = total * this.qty
			// return (total / 100).toFixed(2)
			return total / 100
		},
		service_Single(){//服务单次价格
			let total = this.service.price * 100 + (this.service.kitPrice * this.service.kitQty) * 100 + this.visitPrice * 100 + this.premiumPrice * 100
			return total / 100
		},
		canSubmit() {
			return validatenull(this.address) || validatenull(this.patients) || validatenull(this.serviceTime) || validatenull(this.qty) ||validatenull(this.billCertList)|| this.qty <= 0 || !this.readRule
		},
		diseaseDescText() {
			let result = this.diseaseDesc
			if (this.diseaseDesc == '') {
				result = '请输入病情描述'
			}
			return result
		}
		
	},
	onShow() {
		if(validatenull(this.address)){
			getAddress().then(({data}) => {
				if(data.msg === 'success'){
					let addressList = data.data
					if(addressList.length > 0){
						this.hasAddress = true
						let defaultAddress = addressList.find(value => {
							return value.isDefault === '1'
						})
						this.$store.commit('SET_ADDRESS',defaultAddress || addressList[0])
					}
					else{
						this.hasAddress = false
					}
				}
			})
		}
		else{
			this.hasAddress = true
		}
		getOrgServiceDetail(this.service.orgServiceId).then(({data}) => {
			if(data.code === 0){
				this.service = Object.assign({},this.service,data.data)
			}
		})
	},
	onLoad(e) {
		if(e.service){
			this.service = Object.assign({},JSON.parse(decodeURIComponent(e.service)))
			uni.setNavigationBarTitle({
				title: this.service.serviceLabel
			})
			getPrice(this.service.orgId).then(response => {
				let data = response.data
				if(data.msg === 'success'){
					this.visitPrice = data.data.visit_price
					this.premiumPrice = data.data.premium_price
				}
			})
		}
	},
	methods: {
		// radioChange(evt) {
		// 	for (let i = 0; i < this.items.length; i++) {
		// 			if (this.radioList[i].value === evt.target.value) {
		// 					this.current = i;
		// 					break;
		// 			}
		// 	}
		// },
		// totalChange(e) {
		// 	this.totalIndex = e.detail.value
		// 	let num = e.detail.value
		// 	if(Number(num) > 0){
		// 		this.packageShow = true
		// 	}
		// 	else{
		// 		this.packageShow = false
		// 	}
		// },
		uploadPicture(idx) {
			uni.chooseImage({
				success:res => {
					uni.getImageInfo({
						src: res.tempFilePaths[0],
						success:image => {
							if(idx == 0)
								this.firstImg = image.path
							else
								this.secondImg = image.path
						}
					})
				}
			})
		},
		async orderPay() {
			let { data } = await getOrgServiceDetail(this.service.orgServiceId)
			if(data.code === 0){
				this.service = Object.assign({},this.service,data.data)
				let billInfo = {
					price: this.service.price,
					billType: 0,
					custAddress: this.address.zoneLabel + this.address.address,
					custId: this.patients.custId,
					custName: this.patients.custName,
					custPosition: this.address.position,
					custZoneId: this.patients.zoneId,
					discountAmt: 0,
					kitAmt: this.service.kitPrice || 0,
					kitScale: this.service.kitQty || 0,
					kitGoodsId: this.service.kitGoodsId || 0,
					kitGoodsLabel: this.service.kitGoodsLabel || '',
					kitPrice: this.service.kitPrice || 0,
					linkman: this.address.linkman,
					linkmanPhone: this.address.phone,
					orgId: this.service.orgId,
					orgName: this.service.orgName,
					orgServiceId: this.service.orgServiceId,
					paymentAmt: this.total,
					premiumPrice: this.premiumPrice,
					qty: this.qty,
					reserveDate: this.serviceTime.reserveDate,
					reserveTime1: this.serviceTime.reserveTime1.replace(':00',''),
					reserveTime2: this.serviceTime.reserveTime2.replace(':00',''),
					serviceId: this.service.serviceId,
					serviceLabel: this.service.serviceLabel,
					unit: this.service.unit,
					// vipId: vipInfo.vipId,
					// vipName: vipInfo.vipName,
					// visitAmt: this.visitPrice,
					visitPrice: this.visitPrice,
					diseaseDesc: this.diseaseDesc
				}
				
				await submitBill({
					billCertList: this.billCertList,
					billInfo: billInfo
				}).then(response => {
					let data = response.data
					if(data.msg === 'success'){
						this.$store.commit('INIT_STORE')
						uni.showToast({
							title: '提交成功！',
							icon: 'none',
							mask: true
						})
						setTimeout(() => {
							this.$store.commit('SET_TAB_SELECT', 1)
							uni.switchTab({
								url: '/pages/tab/order'
							})
						},500)
					}
				})
			}
		},
		showTip() {
			this.tipShow = true
		},
		hideTip() {
			this.tipShow = false
		},
		handleOpenDialog() {
			getInformedContent(this.service.serviceId).then(res => {
				let resData = res.data
				if (resData.data) {
					this.popupOptions.content = resData.data.content
				}
			})
			this.dialogVisible = true
		},
		checkboxChange(event) {
			let values = event.detail.value
			let readRule = false
			if (values.indexOf('1') > -1) {
				readRule = true
			}
			this.readRule = readRule
		}
	}
}
</script>

<style lang="scss">
	// page {
	// 	background-color: #fff;
	// }
	.image-area{
		image{
			width: 100%;
		}
	}
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
	.radio-area{
		radio{
			margin-right: 5rpx;
			.wx-radio-input{
				border-radius: 8rpx;
				height: 26rpx;
				width: 26rpx;
				margin-top: -6rpx;
			}
		}
		
		label:last-child{
			margin-left: 30rpx;
		}
	}
	.upload-area{
		width: 180rpx;
		height: 180rpx;
		border: 1px dashed #919191;
		border-radius: 8rpx;
		margin-bottom: 10rpx;
		overflow:hidden;
		.iconfont{
			color: #919191;
			font-size: 90rpx;
			font-weight: 400;
		}
		image{
			width: 100%;
		}
	}
	.price-area{
		line-height: 60rpx;
		.total{
			font-size: 36rpx;
			font-weight: 600;
		}
	}
	.checkbox {
		checkbox{
			margin-right: 10rpx;
			.wx-checkbox-input{
				border-radius: 4rpx;
				height: 26rpx;
				width: 26rpx;
				margin-top: -6rpx;
			}
		}
	}
	.tip-area{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9;
		.tip-bg{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0,0,0,0.5);
			z-index: 99;
		}
		.tip-box{
			width: 70%;
			z-index: 999;
			border-radius: 8rpx;
		}
	}
	.diseaseDesc{
		margin-top: 10rpx;
		height: 180rpx;
		width: 100%;
		box-sizing: border-box;
		border: 1px solid #eee;
		padding: 20rpx;
		border-radius: 8rpx;
	}
	.popup-parent--hidden {
		overflow: hidden;
	}
	.submit-content {
		width: 100%;
		height: 100%;
		cursor: default;
		user-select: none;
		overflow-x: hidden;
	}
	.simulate-textarea {
		margin-top: 10rpx;
		height: 180rpx;
		width: 100%;
		box-sizing: border-box;
		border: 1px solid #eee;
		padding: 20rpx;
		border-radius: 8rpx;
		display: block;
		position: relative;
	}
</style>