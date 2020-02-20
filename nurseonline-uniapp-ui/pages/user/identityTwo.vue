<template>
	<view :class="{'hidden': selectImg}">
		<view class="scroll-top">
            <identity-step-line :active="1"></identity-step-line>
        </view>
		<view class="bg-white pic-area">
			<title-card title="上传证件照">
				<template slot="content">
					<view class="flex-column align-center pic-box" v-for="(item,index) in 1" :key="index">
						<!-- <view @tap="upLoadImg(index)" class="image-area bottom-10 flex-center">
							<image :src="obj.certImgPath[index]" mode="widthFix" v-if="obj.certImgPath[index]"/>
							<text class="iconfont upload-icon" v-else>&#xe6b3;</text>
						</view> -->
						<view class='pt20'><text>{{tips[index]}}</text></view>
						<view class="image-area bottom-10 flex-msg padding-20">
							<!-- <image :src="obj.certImgPath[index]" mode="widthFix" v-if="obj.certImgPath[index]"/> -->
							<view class="flex-column flex-center tip-area" @tap="upLoadImg(index)">
								<text class="iconfont upload-icon">&#xe664;</text>
								<text>拍摄或选择照片</text>
							</view>
							<view class="flex-center tip-img" @tap="preview(index)">
								<image :src="obj.certImgPath[index]" mode="widthFix" class="tip-img"/>
							</view>
						</view>
					</view>
				</template>
			</title-card>
			<view class="btn-area tc">
				<button @tap="vipCertSubmit" class="bottom-10">提交</button>
			</view>
		</view>
		<view class="select-box flex-center" v-if="selectImg">
			<view class="select-bg" @tap.stop.prevent="hideSelect"></view>
			<view class="select-area bg-white">
				<view class="padding-20 border-01 tc" @tap="preview">预览图片</view>
				<view class="padding-20 tc" @tap="upload">上传图片</view>
			</view>
		</view>
	</view>
</template>

<script>
import { simpleUploadImg } from '@/common/uploadFile/upload'
import { getCheckrule,submitVipCert,updateUserInfo } from '@/common/api/account/account'
import { getVipInfo } from '@/common/api/user'
import { IdentityStepLine } from '@/components/StepLine/IdentityStepLine'
import { mapGetters } from 'vuex'
import { validatenull } from '@/common/utils/util'

export default {
    components: {
        IdentityStepLine
    },
	data() {
		return {
			obj: {
				certImgPath:  [
					'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard3.jpg?tdsourcetag=s_pcqq_aiomsg'
				],
				certType: 0,
				certNo: '',
				fromDate: '1900-01-01 00:00:00',
				validDate: '2200-01-01 00:00:00',
				certDesc: '',
				vipName: ''
			},
			tips: ['手持身份证照或人脸照片'],
			errorIdNo: false,
			selectImg: false,
			imgIndex: 0,
			continueBol: false,
			toRoute: '',
		}
	},
	onLoad(options) {
		this.toRoute = options.to || ''
	},
	created() {
		getVipInfo().then(({data}) => {
			if(data.msg === 'success'){
				this.obj = Object.assign({},this.obj,{
					vipName: data.data.vipName,
					certNo: data.data.idNo
				})
			}
		})
	},
	computed: {
		...mapGetters(['identityInfo']),
	},
	methods: {
		async vipCertSubmit() {
			if (!this.continueBol) {
				uni.showToast({title:"验证失败，请重新上传", icon:"none"})
				return false
			}

			// const reg = this.$env === 'dev' ? /site(\S*)\?/ : /cn(\S*)\?/
			const reg = this.$env === 'dev' ? /site(\S*)\?/ : /cn(\S*)\?/
			
			let obj = JSON.parse(JSON.stringify(this.obj));

			obj.certImgPath.forEach((value,index) => {
				return obj.certImgPath[index] = value.match(reg)[1];
			})

			let identityInfo = Object.assign({}, this.identityInfo)

			identityInfo.certImgPath.forEach((value,index) => {
				return identityInfo.certImgPath[index] = value.match(reg)[1]
			})
			
			let certImgPath1 = {
				"15": identityInfo.certImgPath[0],
				"16": identityInfo.certImgPath[1]
			};
			let certImgPath2 = {
				"17": obj.certImgPath[0]
			};
			
			let certType0 = await submitVipCert(Object.assign({},identityInfo,{ certImgPath: certImgPath1 }))
			let certType2 = await submitVipCert(Object.assign({},identityInfo,{ certType: 1,certImgPath: certImgPath2 }))
			let { data } = await updateUserInfo({ vipName: this.identityInfo.vipName,idNo: this.identityInfo.certNo })
				
			if(certType0.data.msg === 'success' && certType2.data.msg === 'success'){
				uni.showToast({
					title: '提交成功',
					icon: 'none',
					mask: true
				})
				setTimeout(() => {
					if (this.toRoute != '') {
						uni.switchTab({
							url: "../tab/home"
						})
					} else {
						uni.navigateBack({
							delta: 2
						})
					}
				},500)
			}
		},
		async upLoadImg(idx) {
			// simpleUploadImg('/nursing-admin/file/upload/link',{
			// 	resType: 'VipCert'
			// }).then(response => {
			// 	let data = JSON.parse(response.data)
			// 	this.$set(this.obj.certImgPath,idx,data.data)
			// }).catch(e => {
			// 	console.log('用户取消上传或上传失败')
			// })

			let _self = this
			let [ err,res ] = await uni.chooseImage({ sizeType: ['compressed'] })
			
            if(!validatenull(res) && res.errMsg === 'chooseImage:ok'){
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
                this.$set(this.obj.certImgPath, idx, JSON.parse(imgData.data).data)

                uni.uploadFile({
                    url: this.$baseUrl + '/nursing-admin/oms/verify/face',
                    header: {
                        "Authorization": 'Bearer ' + uni.getStorageSync('access_token')
                    },
                    filePath: res.tempFilePaths[0],
                    fileType: 'image',
					name: 'photo',
					formData: {
						id: this.identityInfo.certNo,
						name: this.identityInfo.vipName
					},
                    success: function (uploadFileRes) {
						let resData = JSON.parse(uploadFileRes.data)
						console.log('res', resData)
                        uni.hideLoading();
                        if (resData.data) {
							uni.showToast({title:"验证成功", icon:"none"})
                            _self.continueBol = true
                        } else {
                            uni.showToast({title:"验证失败，请重新上传", icon:"none"})
                            _self.continueBol = false
                        }
                    },
                });
            }
		},
		idNoCheck(e) {
			let idNo = e.detail.value
			let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
			this.errorIdNo = !reg.test(idNo)
		},
		hideSelect() {
			this.selectImg = false
		},
		preview(idx) {
			console.log(this.obj.certImgPath[idx])
			uni.previewImage({
				urls: [ this.obj.certImgPath[idx] ]
			})
		},
		upload() {
			simpleUploadImg('/nursing-admin/file/upload/link',{
				resType: 'VipCert'
			}).then(response => {
				let data = JSON.parse(response.data)
				this.$set(this.obj.certImgPath,this.imgIndex,data.data)
			}).catch(e => {
				console.log('用户取消上传或上传失败')
			})
		}
	},
}
</script>

<style lang="scss">
	.pt20{
		padding-top:20rpx;
	}
	.hidden{
		height: 100%;
		overflow: hidden;
	}
	.tip{
		color:#6e8cfa;
	}
	.error-tip{
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		color: #fff;
		background-color: #CE3C39;
	}
	.msg-box {
		padding: 0 20rpx 20rpx;
		.bottom-01 {
			border-bottom: 1px solid #c6c6c6;
		}
	}
	.pic-area {
		.pic-box {
			border: 1px dashed;
			border-radius: 8rpx;
			overflow: hidden;
			margin: 40rpx;
			.image-area{
				// width: 400rpx;
				width: 100%;
				height:300rpx;
				// border:1px dashed;
				// border-radius:8rpx;
				// overflow: hidden;
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
	}
	.btn-area{
		padding: 40rpx 0;
		button[disabled]{
			color: #fff;
		}
	}
	.select-box{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 9;
		.select-bg{
			position: absolute;
			width: 100%;
			height: 100%;
			background-color: rgba(0,0,0,0.4);
			z-index: 99;
		}
		.select-area{
			width: 60%;
			z-index: 101;
			border-radius: 8rpx;
		}
	}
</style>
