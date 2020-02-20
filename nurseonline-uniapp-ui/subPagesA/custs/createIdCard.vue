<template>
    <view :class="{'hidden': selectImg}">
        <view class="scroll-top">
            <create-step-line :active="0"></create-step-line>
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
				<button @tap="vipCertSubmit" :disabled="checkSubmit" class="bottom-10">下一步</button>
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
import CreateStepLine from '@/components/CreateStepLine'
import { simpleUploadImg } from '@/common/uploadFile/upload'
import { getCheckrule,submitVipCert,updateUserInfo } from '@/common/api/account/account'
import { validatenull } from '@/common/utils/util'

export default {
    components: {
        CreateStepLine
    },
	data() {
		return {
			obj: {
				certImgPath:  [
					'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard1.png?tdsourcetag=s_pcqq_aiomsg',
					'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard2.png?tdsourcetag=s_pcqq_aiomsg',
					'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard3.jpg?tdsourcetag=s_pcqq_aiomsg'
				],
				certType: 0,
				certNo: '',
				fromDate: '1900-01-01 00:00:00',
				validDate: '2200-01-01 00:00:00',
				certDesc: '',
				vipName: ''
			},
			tips: ['身份证正面照','身份证国徽照','手持身份证照'],
			continueBol: false,
			selectImg: false,
			imgIndex: 0,
		}
    },
    onLoad:function(){
		this.init();
	},
	computed: {
		fileImgs() {
			let params = this.obj.certImgPath
			let imgs = []
			params.map(value => {
				imgs.push({
					img: value
				})
			})
			
			return imgs
		},
		checkSubmit() {
			let certImgPath = this.obj.certImgPath
			return certImgPath.includes('http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard1.png?tdsourcetag=s_pcqq_aiomsg') || !this.continueBol
		}
	},
	methods: {
        init() {
		    this.$store.commit('REMOVE_SCAN_USER_INFO')
        },
		vipCertSubmit() {
			if (!this.continueBol) {
                uni.showToast({title:"请选择正确的身份证照片", icon:"none"});
                return false
            }
            uni.navigateTo({
				url: 'create'
			})
		},
		async upLoadImg(idx) {

            // let imgData = simpleUploadImg('/nursing-admin/file/upload/link',{
            //     resType: 'VipCert'
            // })

            // this.$set(this.obj.certImgPath, idx, JSON.parse(imgData.data).data)

            let [ err,res ] = await uni.chooseImage()
            let _self = this
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
                    url: this.$baseUrl + '/nursing-admin/oms/verify/idcard',
                    header: {
                        "Authorization": 'Bearer ' + uni.getStorageSync('access_token')
                    },
                    filePath: res.tempFilePaths[0],
                    fileType: 'image',
                    name: 'idcard',
                    success: function (uploadFileRes) {
                        let resData = JSON.parse(uploadFileRes.data)
                        uni.hideLoading();
                        if (resData.data) {
                            let data = resData.data
                            _self.$store.commit('SET_SCAN_USER_INFO', data)
                            _self.continueBol = true
                        } else {
                            uni.showToast({title:"无法扫描该照片", icon:"none"});
                            _self.continueBol = false
                        }
                    },
                });
            }
		},
		hideSelect() {
			this.selectImg = false
		},
		preview(idx) {
			uni.previewImage({
				urls: [ this.obj.certImgPath[idx] ]
			})
		},
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