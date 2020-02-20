<template>
	<view :class="{'hidden': selectImg}">
		<view class="bottom-20 msg-box bg-white">
			<view class="bottom-01 padding-20-0 flex-msg">
				<view>真实姓名</view>
                <view class="tr">{{ obj.vipName }}</view>
			</view>
			<view class="padding-20-0 flex-msg" :class="{'font-red': errorIdNo}">
				<view>身份证号</view>
                <view class="tr font-grey">{{ obj.certNo }}</view>
			</view>
		</view>
            
        <view class="btn-area tc">
            <button @tap="regianConfirm" class="bottom-10">重新认证</button>
        </view>
	</view>
</template>

<script>
import { getVipInfo } from '@/common/api/user'
import { plusStars } from '@/common/utils/util'

export default {
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
		}
	},
	onLoad() {
		getVipInfo().then(({data}) => {
			if(data.msg === 'success'){
                let certNo = plusStars(data.data.idNo, 5, 4)
				this.obj = Object.assign({},this.obj,{
					vipName: data.data.vipName,
					certNo: certNo
				})
			}
		})
	},
	methods: {
		regianConfirm() {
            uni.redirectTo({
                url: './identity'
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
