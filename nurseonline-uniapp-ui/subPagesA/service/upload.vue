<template>
	<view class="bg-white content">
		<text>请上传就医证明，住院用户请上传床头卡，以便订单审核（为您保密）</text>
		<view class="upload-area justify-between">
			<template v-for="(item,index) in imgList">
				<template v-if="item.certImgPath">
					<view class="upload-box" @tap.stop="previewImg(item.certImgPath)" :key="index">
						<view class="flex-center tip">
							<image :src="item.certImgPath" mode="aspectFit" />
						</view>
						<view class="close-area flex-center bg-white" @tap.stop="removeImg(index)">
							<text class="iconfont">&#xe615;</text>
						</view>
					</view>
				</template>
			</template>
			<template v-if="imgList.length < 6">
				<view class="upload-box" @tap.stop="uploadImg">
					<view class="flex-column flex-center tip" >
						<text class="iconfont upload-icon">&#xe6b3;</text>
						<text>上传照片</text>
					</view>
				</view>
			</template>
		</view>
		<view class="bottom-box bg-white">
			<text class="padding-20 font-small">建议上传相关证明（例如处方，病例，病灶状况等），请最少上传1张清晰的图片，最多6张</text>
			<button @tap="getImgs">确定</button>
		</view>
	</view>
</template>

<script>
import { simpleUploadImg } from '@/common/uploadFile/upload'
import { mapGetters,mapMutations } from 'vuex'
export default {
	data() {
		return {
			imgList: []
		}
	},
	computed: {
		...mapGetters(['billCertList']),
	},
	onShow() {
		if(this.billCertList.length > 0){
			this.imgList = this.billCertList
		}
	},
	methods: {
		uploadImg() {
			simpleUploadImg('/nursing-admin/file/upload/link',{
				resType: 'billCert'
			}).then(response => {
				let data = JSON.parse(response.data)
				this.imgList.push({
					certImgPath: data.data
				})
			}).catch(e => {
				console.log('用户取消上传或上传失败')
			})
		},
		getImgs() {
			this.$store.commit('SET_BILL_CERT_LIST',this.imgList)
			uni.navigateBack({
				delta: -1
			})
		},
		previewImg(img) {
			uni.previewImage({
				urls: [ img ]
			})
		},
		removeImg(idx) {
			this.imgList.splice(idx,1)
		}
	},
}
</script>

<style lang="scss">
	.content{
		min-height: 100%;
		padding: 20rpx 50rpx 210rpx;
		box-sizing: border-box;
	}
	.upload-area{
		flex-wrap: wrap;
		margin-top: 30rpx;
		.upload-box{
			width: 45%;
			height: 330rpx;
			margin-bottom: 20rpx;
			border: 1px dashed #595757;
			border-radius: 8rpx;
			position: relative;
			.tip{
				height: 100%;
				overflow: hidden;
			}
			.close-area{
				position: absolute;
				border: 1px solid;
				border-radius: 50%;
				padding: 4rpx;
				right: -14rpx;
				top: -14rpx;
				width: 36rpx;
				height: 36rpx;
				.iconfont{
					font-size: 38rpx;
				}
			}
			.upload-icon{
				font-size: 70rpx;
			}
			image{
				width: 100%;
			}
		}
	}
	.bottom-box{
		position: fixed;
		bottom: 0;
		left: 0;
		height: 200rpx;
		border-top: 1px solid #eee;
		z-index: 99;
		.font-small{
			display:block;
			font-size: 24rpx;
		}
	}
</style>