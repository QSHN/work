<template>
	<view class="record-area">
		<view class="flex-msg record-item border-01">
			<text>姓名</text>
			<!-- <input type="text" placeholder="请填写您的姓名" class="tr"/> -->
			<text>{{custName}}</text>
		</view>
		<view class="flex-msg record-item border-01">
			<text>诊疗日期</text>
			<picker mode="date" @change="dateChange" :value="date">
				<view :class="{'font-grey': !form.treatDate}">{{form.treatDate || '请选择诊疗日期'}}</view>
			</picker>
		</view>
		<view class="flex-msg record-item border-01">
			<text>医院名称</text>
			<view class="align-center">
				<input type="text" placeholder="请输入医院名称" class="tr" v-model="form.orgName" placeholder-class="font-grey"/>
				<picker :range="orgList" @change="orgChange" range-key="orgName">
					<text class="iconfont">&#xe616;</text>
				</picker>
			</view>
		</view>
		<view class="flex-msg record-item border-01">
			<text>科室</text>
			<view class="align-center">
				<input type="text" placeholder="请输入科室" class="tr" v-model="form.deptName" placeholder-class="font-grey"/>
				<picker :range="deptList" @change="deptChange" range-key="deptName">
					<text class="iconfont">&#xe616;</text>
				</picker>
			</view>
		</view>
		<view class="flex-msg record-item border-01">
			<text>主要诊断</text>
			<input type="text" placeholder="请输入主要诊断结果" class="tr" v-model="form.mainDiagnosis" placeholder-class="font-grey"/>
		</view>
		<view class="flex-msg record-item border-01">
			<text>主要症状</text>
			<input type="text" placeholder="请输入主要症状" class="tr" v-model="form.mainSymptom" placeholder-class="font-grey"/>
		</view>
		<title-card title="出院小结">
			<template slot="content">
				<view class="tc">
					<view class="bottom-20" v-for="(item,index) in imgList" :key="index">
						<template v-if="item || index < 6">
							<view class="flex-center upload-area" @tap="uploadImg(index)">
								<image :src="item" mode="widthFix" v-if="item"></image>
								<text class="iconfont" v-else>&#xe6df;</text>
							</view>					
							<view class="tc font-grey">
								<text v-if="item" @tap="previewImg(item)">预览</text>
								<text v-else>上传出院小结（支持多张）</text>
							</view>
						</template>
					</view>
				</view>
			</template>
		</title-card>
		<view class="button-area">
			<button @tap="submit">保存</button>
		</view>
	</view>
</template>

<script>
import { simpleUploadImg } from '@/common/uploadFile/upload'
import { getHospitalList,getDeptList,createCustTreatrec,editCustTreatrec } from '@/common/api/cust/cust'
export default {
	props: {
		isEdit: {
			type: Boolean,
			default: false
		},
		custName: String,
		record: Object,
		custId: String
	},
	data() {
		return {
			form: {
				treatDate: '',
				orgName: '',
				deptName: '',
				mainDiagnosis: '',
				mainSymptom: '',
				imgUrl: ''
			},
			imgList: [''],
			orgList: [],
			orgIndex: 0,
			deptList: [],
			deptIndex: 0
		}
	},
	created(){
		
		if(this.isEdit){
			this.form = Object.assign({},this.form,this.record)
			let imgUrl = this.form.imgUrl
			this.imgList = imgUrl.split(';')
		}
		
		getHospitalList().then(response => {
			let data = response.data
			if(data.msg === 'success'){
				this.orgList = data.data.records
			}
		})
	},
	methods: {
		dateChange(e) {
			this.form.treatDate = e.detail.value
		},
		submit() {
			// console.log(this.form)
			let imgList = this.imgList
			imgList = imgList.filter(value => {
				return value !== ''
			})
			let form = JSON.parse(JSON.stringify(this.form))
			if(this.orgList.length > 0){
				form.orgId = form.orgName === this.orgList[this.orgIndex].orgName ? this.orgList[this.orgIndex].orgId : -1
			}
			else{
				form.orgId = -1
			}
			if(this.deptList.length > 0){
				form.deptId = form.deptName === this.deptList[this.deptIndex].deptName ? this.deptList[this.deptIndex].deptId : -1
			}
			else{
				form.deptId = -1
			}
			
			form.imgUrl = imgList.join(';') + ';'
			form.custId = this.custId
			if(this.isEdit){
				editCustTreatrec(form).then(response => {
					this.backTo(response)
				})
			}
			else{
				createCustTreatrec(form).then(response => {
					this.backTo(response)
				})
			}
		},
		previewImg(img) {
			uni.previewImage({
				urls: [img],
				success: res => {
					// console.log(res)
				}
			})
		},
		uploadImg(idx) {
			simpleUploadImg('/nursing-admin/file/upload/link',{
				resType: 'custTreatRec'
			}).then(res => {
				let data = JSON.parse(res.data)
				if(data.msg === 'success'){
					if(!this.imgList[idx] && idx < 5){
						this.imgList.push('')
					}
					this.$set(this.imgList,idx,data.data)
				}
			}).catch(e => {
				console.log('用户取消上传或上传失败')
			})
		},
		orgChange(e) {
			let idx = Number(e.detail.value)
			this.orgIndex = idx
			this.form.orgName = this.orgList[idx].orgName
			this.deptListGet(this.orgList[idx].orgId)
		},
		deptChange(e) {
			let idx = Number(e.detail.value)
			this.deptIndex = idx
			this.form.deptName = this.deptList[idx].deptName
		},
		deptListGet(id) {
			getDeptList(id).then(response => {
				let data = response.data
				if(data.msg === 'success'){
					this.deptList = data.data.records
				}
			})
		},
		backTo(res){
			let data = res.data
			if(data.msg === 'success'){
				uni.showToast({
					title: '保存成功',
					icon: 'none',
					mask: true
				})
				setTimeout(() => {
					uni.navigateBack({
						delta: -1
					})
				},500)
			}
		}
	}
}
</script>

<style lang="scss">
	.font-grey {
		color: #b5b5b6;
	}
	page{
		background-color: #fff;
	}
	.record-area{
		padding: 0 20rpx;
		.record-item{
			padding: 20rpx 0;
		}
		.upload-area{
			width: 100%;
			height: 500rpx;
			border: 1px dashed #b7b7b7;
			border-radius: 4rpx;
			margin-bottom: 10rpx;
			overflow: hidden;
			image{
				width: 100%;
			}
			.iconfont{
				font-size: 80rpx;
				color: #b7b7b7;
			}
		}
		.button-area{
			margin: 40rpx 0;
		}
	}
	.iconfont{
		font-size: 40rpx;
		vertical-align: middle;
	}
</style>