<template>
	<view>
		<view class="hint">
			<text>实名认证</text>
			<text>应国家法律法规要求，为了保障服务安全，您需要进行实名验证。您上传身份信息仅用于公安系统进行比对验真，不作其他用途，请确保为本人操作。</text>
		</view>
		<view class="form">
			<view class="li">
				<text>姓名</text>
				<input type="text" placeholder="填写真实姓名" v-model="obj.vipName"/>
			</view>
			<view class="li">
				<text>身份证</text>
				<input type="idcard" placeholder="填写身份证号" v-model="obj.certNo" />
			</view>
		</view>
		<view class="photo-box">
			<view class="h3">拍摄人脸正面照</view>
			<view class="h4">请在光线充足环境下拍摄人脸正面照</view>
			<view class="img-box">
				<view class="add-img" @tap="upLoadImg">
					<text class="iconfont">&#xe664;</text>
				</view>
				<view class="add-img" @tap="preview">
					<image :src="obj.photo || '../../static/identity.png'" mode="widthFix"/>
				</view>
			</view>
		</view>
		<button class="btn" @tap="onSubmit">提交</button>
	</view>
</template>

<script>
import { simpleUploadImg } from '@/common/uploadFile/upload'
import { identification,getCheckrule,submitVipCert,updateUserInfo } from '@/common/api/account/account'
import { getVipInfo } from '@/common/api/user'
import { validatenull } from '@/common/utils/util'

export default {
	data() {
		return {
			obj: {
				certNo: '445281199409263137',
				vipName: '刘楚平',
				photo:'',
			},
			continueBol:false,
			toRoute:''
		}
	},
	created() {
		this.$store.commit('REMOVE_IDENTITY_INFO')
		getVipInfo().then(({data}) => {
			console.log(data)
			if(data.msg === 'success'){
				this.obj = Object.assign({},this.obj,{
					vipName: data.data.vipName,
					certNo: data.data.idNo
				})
			}
		})
	},
	onLoad(options) {
		this.toRoute = options.to || ''
	},
	methods: {
		async upLoadImg() {
			if (!this.obj.vipName) {
				uni.showToast({
					title: '请填写姓名',
					icon: 'none',
				})
				return false
			}
			
			let idNo = this.obj.certNo;
			let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
			if (!reg.test(idNo)) {
				uni.showToast({
					title: '请填写正确的身份证号',
					icon: 'none',
				})
				return false
			}
			
			let _self = this
			let [ err,res ] = await uni.chooseImage({ count:1,sizeType: ['compressed'] })
			
			if(res.tempFiles[0].size > 1048576){
				uni.showToast({
					title: '图片大小不能超过1M',
					icon: 'none',
				})
				return false
			}
			
			
			if(!validatenull(res) && res.errMsg === 'chooseImage:ok'){
				setTimeout(async ()=>{
					uni.showLoading({
					    title: '正在扫描...'
					})
					
					let [ error, imgData ] = await uni.uploadFile({
					    url: this.$baseUrl + '/nursing-admin/file/upload/link',
					    filePath: res.tempFilePaths[0],
					    name: 'file',
					    header: {
					        "Authorization": 'Bearer ' + uni.getStorageSync('access_token')
					    },
					    formData: {
					        resType: 'VipCert'
					    },
					})
					
					uni.uploadFile({
					    url: this.$baseUrl + '/nursing-admin/oms/verify/face',
					    header: {
					        "Authorization": 'Bearer ' + uni.getStorageSync('access_token')
					    },
					    filePath: res.tempFilePaths[0],
					    fileType: 'image',
						name: 'photo',
						formData: {
							id: this.obj.certNo,
							name: this.obj.vipName
						},
					    success: function (uploadFileRes) {
							let resData = JSON.parse(uploadFileRes.data)
							setTimeout(()=>{
								uni.hideLoading();
								if (resData.data) {
									uni.showToast({title:"验证成功", icon:"none"})
									_self.obj.photo = JSON.parse(imgData.data).data;
								    _self.continueBol = true
								} else {
								    uni.showToast({title:"验证失败，请核对姓名和身份证号再重新上传", icon:"none",duration:2000})
								    _self.continueBol = false
								}
							},1000)
					    },
					});
				},350)
			}
		},
		preview() {
			let img = require('../../static/identity.png');
			console.log(img)
			uni.previewImage({
				current:0,
				urls: [ this.obj.photo || img ]
			})
		},
		async onSubmit() {
			if (!this.obj.photo) {
				uni.showToast({
					title: '请拍摄人脸正面照',
					icon: 'none',
				})
				return false
			}
			
			if (!this.continueBol) {
				uni.showToast({title:"验证失败，请重新上传", icon:"none"})
				return false
			}
			
			const reg = /temp(\S*)\?/;
			
			let certImgPath2 = {
				"17": '/temp' + this.obj.photo.match(reg)[1]
			};
			
			let certObj = { 
				certType: 1,
				certImgPath: certImgPath2,
				vipName: this.obj.vipName,
				certNo: this.obj.certNo,
				fromDate: '1900-01-01 00:00:00',
				validDate: '2200-01-01 00:00:00',
			}
			let certType = await submitVipCert(certObj)
			let { data } = await updateUserInfo({ vipName: this.obj.vipName,idNo: this.obj.certNo })
				
			if(certType.data.msg === 'success'){
				uni.showToast({
					title: '认证成功',
					icon: 'none',
					mask: true,
					success:()=>{
						console.log('验证成功数据', certType)
						return false
						if (this.toRoute != '') {
							uni.switchTab({
								url: "../tab/home"
							})
						} else {
							uni.navigateBack({
								delta: 2
							})
						}
					}
				})
			}
		},
	},
}
</script>

<style lang="scss">
	page{
		background-color: #F7F7F7;
	}
	.hint{
		padding:30rpx;
		text{
			display: block;
		}
		text:nth-child(1){
			font-size: 38rpx;
			font-weight: bold;
			color: #333;
		}
		text:nth-child(2){
			margin-top: 10rpx;
			line-height: 40rpx;
			font-size: 26rpx;
			color: #666666;
		}
	}
	.form{
		margin-bottom: 18rpx;
		background-color: #fff;
		border-radius: 18rpx;
		.li{
			padding:34rpx 30rpx;
			display: flex;
			font-size: 32rpx;
			text{
				color: #333333;
			}
			input{
				flex:1;
				text-align: right;
			}
		}
		.li:last-child{
			border-top: 1px solid #F7F7F7;
		}
	}
	.photo-box{
		background-color: #fff;
		padding:42rpx 30rpx;
		border-radius: 18rpx;
		.h3{
			font-size: 32rpx;
			color: #333333;
			font-weight: bold;
		}
		.h4{
			font-size: 28rpx;
			color: #999999;
			margin:16rpx 0 42rpx 0;
		}
		.img-box{
			display: flex;
			.add-img{
				overflow: hidden;
				width: 144rpx;
				height: 144rpx;
				border-radius: 15rpx;
				// border: 1px dashed #888888;
				background-color: #F4F4F4;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 28rpx;
				.iconfont{
					font-size: 60rpx;
					color: #999;
				}
				image{
					position: relative;
					z-index: 11;
				}
			}
			.add-img:last-child{
				background-color: #fff;
			}
		}
	}
	.btn{
		line-height: 100rpx;
		width: 690rpx;
		height: 100rpx;
		margin-top: 60rpx;
	}
</style>