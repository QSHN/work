<template>
	<view>
		<view class="tab-area bg-white flex">
			<view class="tab-item tc" v-for="(tab,tIdx) in tabList" :key="tIdx" :class="{'isActive': tabIndex === tIdx}" @tap="changeTab(tIdx)">{{tab}}</view>
		</view>
		<view class="tab-content">
			<template v-if="tabIndex === 0">
				<view class="input-area">
					<view class="flex-msg padding-20 border-01">
						<text>真实姓名</text>
						<input type="text" placeholder="请填写服务对象的姓名" class="tr" v-model="cust.custName"/>
					</view>
					<view class="flex-msg padding-20 border-01">
						<text>身份证号</text>
						<!-- <input type="text" placeholder="请输入服务对象的身份证号" class="tr" v-model="cust.idNo"/> -->
						<text class="font-grey">{{cust.idNo}}</text>
					</view>
					<view class="flex-msg padding-20 border-01">
						<text>性别</text>
						<picker :range="sexColumn" @change="selectChange" :value="cust.sex" range-key="label">
							<view>{{sexColumn[cust.sex].label}}</view>
						</picker>
					</view>
					<view class="flex-msg padding-20 border-01">
						<text>年龄</text>
						<input type="text" placeholder="请填写服务对象的年龄" class="tr" v-model="cust.age"/>
					</view>
					<!-- <view class="flex-msg padding-20 border-01">
						<text>所在区域</text>
						<input type="text" placeholder="请输入所在区域" class="tr" v-model="cust.address"/>
					</view> -->
					<view class="flex-msg padding-20 border-01">
						<text>家庭住址</text>
						<input type="text" placeholder="请输入地址" class="tr" v-model="cust.address"/>
					</view>
					<view class="flex-msg padding-20 border-01">
						<text>联系电话</text>
						<input type="text" placeholder="请输入联系电话" class="tr" v-model="cust.phone"/>
					</view>
				</view>
			</template>
			<template v-if="tabIndex === 1">
				<view class="input-area">
					<view class="flex-msg padding-20 border-01">
						<text>民族</text>
						<!-- <input type="text" placeholder="请填写您的民族" class="tr" v-model="cust.nation"/> -->
						<picker :range="nationColumn" @change="nationChange" range-key="itemName">
							<view :class="{'font-grey': !cust.nation}">{{cust.nation || '选择民族'}}</view>
						</picker>
					</view>
					<view class="flex-msg padding-20 border-01">
						<text>出生日期</text>
						<picker mode="date" @change="dateChange" :value="cust.birthDate">
							<view>{{cust.birthDate}}</view>
						</picker>
					</view>
					<view class="flex-msg padding-20 border-01">
						<text>婚姻状况</text>
						<picker :range="typeColumn" @change="maritalChange" :value="cust.maritalStatus" range-key="label">
							<view>{{typeColumn[cust.maritalStatus].label}}</view>
						</picker>
					</view>
					<view class="flex-msg padding-20 border-01">
						<text>联系人</text>
						<input type="text" placeholder="请输入联系人" class="tr" v-model="cust.linkman"/>
					</view>
					<view class="flex-msg padding-20 border-01">
						<text>联系人电话</text>
						<input type="text" placeholder="请输入联系人电话" class="tr" v-model="cust.linkmanPhone"/>
					</view>
					<!-- <view class="flex-msg padding-20 border-01">
						<text>疾病</text>
						<input type="text" placeholder="请输入疾病类型" class="tr" />
					</view> -->
				</view>
			</template>
			<template v-else-if="tabIndex === 2">
				<view class="input-area">
					<title-card title="上传证件照">
						<template slot="content">
							<view class="flex-column align-center pic-box" v-for="(item,index) in certs" :key="index">
								<!-- <view @tap="upLoadImg(index)" class="image-area bottom-10 flex-center">
									<image :src="item.certImgPath" mode="widthFix" v-if="item.certImgPath"/>
									<text class="iconfont upload-icon" v-else>&#xe6b3;</text>
								</view>
								<text>{{item.certTypeName}}</text> -->
								<view class="image-area bottom-10 flex-msg padding-20">
									<view class="flex-column flex-center tip-area" @tap="upLoadImg(index)">
										<text class="iconfont upload-icon">&#xe664;</text>
										<text>拍摄或选择照片</text>
									</view>
									<view class="flex-center tip-img" @tap="preview(index)">
										<image :src="item.certImgPath ? item.certImgPath : imgs[index]" mode="widthFix" class="tip-img"/>
										<!-- <image :src="imgs[index]" mode="widthFix" v-else/> -->
									</view>
								</view>
								<text>{{item.certTypeName}}</text>
							</view>
						</template>
					</title-card>
				</view>
			</template>
			<template v-else-if="tabIndex === 3">
				<view class="input-area">
					<view class="flex-msg padding-20 border-01">
						<text>身高（cm）</text>
						<input type="text" placeholder="请填写您的身高" class="tr" v-model="detail.height"/>
					</view>
					<view class="flex-msg padding-20 border-01">
						<text>体重（kg）</text>
						<input type="text" placeholder="请填写您的体重" class="tr" v-model="detail.weight"/>
					</view>
					<view class="flex-msg padding-20 border-01">
						<text>血型</text>
						<picker :range="bloodColumn" @change="bloodChange" :value="detail.bloodType" range-key="label">
							<view>{{bloodColumn[detail.bloodType].label}}</view>
						</picker>
					</view>
					<view class="flex-msg padding-20 border-01" @tap="toFamily">
						<text>个人及家庭情况</text>
						<text class="iconfont">&#xe6f8;</text>
					</view>
					<view class="flex-msg padding-20 border-01">
						<text>家族遗传史</text>
						<input type="text" placeholder="请填写家族遗传史" class="tr" v-model="detail.geneticHistory"/>
					</view>
					<view class="flex-msg padding-20 border-01">
						<text>既往病史</text>
						<input type="text" placeholder="请填写既往病史" class="tr" v-model="detail.medicalHistory"/>
					</view>
				</view>
			</template>
			<template v-else-if="tabIndex === 4">
				<view class="record-box">
					<view class="flex-msg bottom-01 record-area padding-20 bg-white" @tap="editRecord(item)" v-for="(item,index) in treatrecs" :key="index">
						<view class="">
							<view class="font-deep">主要诊断：{{item.mainDiagnosis}}</view>
							<view>治疗日期：{{item.treatDate}}</view>
							<view>医院名称：{{item.orgName}}</view>
						</view>
						<text class="iconfont">&#xe6f8;</text>
					</view>
					<view class="bottom-box">
						<navigator class="add-btn align-center" :url="'./recordCreate?custName=' + cust.custName + '&custId=' + cust.custId">
							<text class="iconfont font-blue">&#xe6f1;</text>添加就诊记录
						</navigator>
					</view>
				</view>
			</template>
			<view class="button-area tc" v-if="tabIndex !== 4">
				<template v-if="tabIndex === 2">
					<button @tap="save" :disabled="checkUpload">保存</button>
					<text class="font-red" v-if="checkUpload">请检查所有的资质文件是否都已上传</text>
				</template>
				<template v-else>
					<button @tap="save">保存</button>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
import { simpleUploadImg } from '@/common/uploadFile/upload'
import * as custHttp from '@/common/api/cust/cust'
export default {
	data() {
		return {
			imgs: [
				'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard1.png?tdsourcetag=s_pcqq_aiomsg',
				'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard2.png?tdsourcetag=s_pcqq_aiomsg',
				'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard3.jpg?tdsourcetag=s_pcqq_aiomsg'
			],
			cust: {},
			tabIndex: 0,
			selectIdx: 0,
			date: '1953-10-31',
			tabList: ['基本信息','详细信息','资质信息','健康信息','就诊信息'],
			sexColumn: [
				{
					label: '保密',
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
			],
			typeColumn: [
				{
					label: '未知',
					value: '0'
				},
				{
					label: '未婚',
					value: '1'
				},
				{
					label: '已婚',
					value: '2'
				},
				{
					label: '离婚',
					value: '3'
				}
			],
			bloodColumn: [
				{
					label: '其他',
					value: '0'
				},
				{
					label: 'A型',
					value: '1'
				},
				{
					label: 'B型',
					value: '2'
				},
				{
					label: 'AB型',
					value: '3'
				},
				{
					label: 'O型',
					value: '4'
				}
			],
			nationColumn: [],
			detail: {
				height: '',
				weight: '',
				bloodType: 0,
				geneticHistory: '',
				medicalHistory: ''
			},
			hasDetail: false,
			certs: [],
			hasCerts: false,
			treatrecs: []
		}
	},
	onLoad(e) {
		this.cust = Object.assign({},JSON.parse(e.cust))
		custHttp.getCustCertType().then(response => {
			// console.log(response)
			let data = response.data
			if(data.msg === 'success'){
				let certs = data.data
				this.certs = certs.map(value => {
					return Object.assign({},value,{
						certImgPath: '',
						certNo: '',
						custCertId: '',
						custId: this.cust.custId,
						certTypeName: value.certTag,
					})
				})
				// certs.map(value => {
				// 	this.certs.push({
				// 		certImgPath: '',
				// 		certNo: '',
				// 		certType: value.certType,
				// 		certTypeName: value.certName,
				// 		custCertId: '',
				// 		custId: this.cust.custId
				// 	})
				// })
			}
		})
		custHttp.getNationList().then(response => {
			let data = response.data
			if(data.msg === 'success'){
				let nation = data.data
				this.nationColumn = nation.filter(({id}) => {
					return id !== -1
				})
			}
		})
	},
	onShow() {
		if(this.tabIndex === 4){
			this.getTreatrec()
		}
		else if(this.tabIndex === 3){
			this.getDetail()
		}
	},
	computed: {
		checkUpload() {
			let certs = JSON.parse(JSON.stringify(this.certs))
			let idx = -1
			if(certs.length > 0){
				idx = certs.findIndex(value => {
					if(value.hasOwnProperty('certImgPath'))
						return value.certImgPath == ''
				})
			}
			return idx !== -1
		}
	},
	methods: {
		changeTab(idx) {
			this.tabIndex = idx
			this.selectIdx = 0
			if(idx === 3){
				this.getDetail()
			}
			else if(idx === 2){
				custHttp.getCustCert(this.cust.custId).then(response => {
					this.hasCerts = false
					let data = response.data
					if(data.msg === 'success' && data.data.length > 0){
						this.certs = data.data
						this.hasCerts = true
					}
				})
			}
			else if(idx === 4){
				this.getTreatrec()
			}
		},
		getTreatrec() {
			custHttp.getCustTreatrec(this.cust.custId).then(response => {
				let data = response.data
				if(data.msg === 'success'){
					this.treatrecs = data.data
				}
			})
		},
		getDetail() {
			custHttp.getCustDetail(this.cust.custId).then(response => {
				this.hasDetail = false
				let data = response.data
				if(data.msg === 'success' && data.data){
					this.detail = Object.assign({},this.detail,data.data)
					this.hasDetail = true
				}
			})
		},
		selectChange(e) {
			this.cust.sex = e.detail.value
		},
		maritalChange(e) {
			this.cust.maritalStatus = e.detail.value
		},
		bloodChange(e) {
			this.detail.bloodType = e.detail.value
		},
		dateChange(e) {
			this.cust.birthDate = e.detail.value
		},
		nationChange(e) {
			this.cust.nation = this.nationColumn[e.detail.value].itemName
		},
		save(){
			if(this.tabIndex === 0 || this.tabIndex === 1){
				custHttp.editCustBasic(this.cust).then(response => {
					this.backTo(response)
				})
			}
			else if(this.tabIndex === 2){
				if(this.hasCerts){
					custHttp.editCustCert(this.certs).then(response => {
						this.backTo(response)
					})
				}
				else{
					custHttp.createCustCert(this.certs).then(response => {
						this.backTo(response)
					})
				}
			}
			else if(this.tabIndex === 3){
				let params = Object.assign({},this.detail,{
					custId: this.cust.custId
				})
				if(this.hasDetail){
					custHttp.editCustDetail(params).then(response => {
						this.backTo(response)
					})
				}
				else{
					custHttp.createCustDetail(params).then(response => {
						this.backTo(response)
					})
				}
				// console.log(this.detail)
			}
		},
		backTo(response) {
			let data = response.data
			if(data.msg === 'success'){
				uni.showToast({
					title: '修改成功！',
					icon: 'none',
					mask: true
				})
			}
		},
		upLoadImg(idx) {
			simpleUploadImg('/nursing-admin/vcs/vip/cust/cert/upload').then(res => {
				let data = JSON.parse(res.data)
				if(data.msg === 'success'){
					this.$set(this.certs,idx,Object.assign({},this.certs[idx],{
						certImgPath: data.data
					}))
				}
			}).catch(e => {
				console.log('用户取消上传或上传失败')
			})
		},
		preview(idx) {
			if(this.certs[idx].certImgPath){
				uni.previewImage({
					urls: [ this.certs[idx].certImgPath ]
				})
			}
		},
		editRecord(item) {
			uni.navigateTo({
				url: './recordEdit?custName=' + this.cust.custName + '&custId=' + this.cust.custId + '&record=' + encodeURIComponent(JSON.stringify(item))
			})
		},
		toFamily() {
			uni.navigateTo({
				url: './family?custId=' + this.cust.custId + '&detail=' + JSON.stringify(this.detail) + '&hasDetail=' + this.hasDetail
			})
		}
	},
}
</script>

<style lang="scss">
	.tab-area{
		margin-bottom: 10rpx;
		.tab-item{
			flex: 1;
			padding: 16rpx 0;
			&.isActive{
				border-bottom: 4rpx solid #6E8CFA;
			}
		}
	}
	.tab-content{
		.input-area{
			// height: 700rpx;
			margin-bottom: 40rpx;
			background-color: #fff;
			padding: 0 20rpx;
			input{
				flex: auto;
			}
		}
		.button-area{
			height: 150rpx;
		}
		
		// .pic-box {
		// 	padding: 20rpx 0;
		// 	.image-area{
		// 		width: 400rpx;
		// 		height:400rpx;
		// 		border:1px dotted;
		// 		border-radius:8rpx;
		// 		overflow: hidden;
		// 		image{
		// 			width: 100%;
		// 		}
		// 		.upload-icon{
		// 			font-size: 80rpx;
		// 		}
		// 	}
		// }
		.pic-box {
			padding: 20rpx;
			.image-area{
				// width: 400rpx;
				width: 100%;
				height:300rpx;
				border:1px dashed;
				border-radius:8rpx;
				overflow: hidden;
				box-sizing: border-box;
				.tip-area{
					width: 40%;
					background-color: #f1f1f1;
					height: 210rpx;
					padding: 20rpx;
					box-sizing: border-box;
					line-height: 80rpx;
				}
				.tip-img{
					width: 50%;
					height: 210rpx;
					overflow: hidden;
					image{
						width: 100%;
					}
				}
				.upload-icon{
					font-size: 80rpx;
				}
			}
		}
		
		.record-box{
			margin-bottom: 120rpx;
			.record-area{
				line-height: 48rpx;
				.iconfont {
					font-size: 48rpx;
					color: #c6c6c6;
				}
			}
		}
		
	}
	.bottom-box {
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
		font-size: 28rpx;
		color: #000;
		border-top: 1rpx solid #eee;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #fff;
		.add-btn {
			margin-left: 30rpx;
			.iconfont{
				margin-right: 10rpx;
			}				
		}
	}
</style>