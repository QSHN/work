<template>
	<view style="background:#fff;">
		<view class="grace-idcard-main uni-padding-wrap uni-common-mt">
			<view class="wraperView"><!-- wraper开始 -->
			<!-- textarea -->
			<view>
				<view class="uni-textarea">
					</view>
					<view class="uni-title uni-common-pl padding"><view class="left-icon">拒单理由</view></view>
					<view class="uni-textarea padding">
						<textarea placeholder-style="color:rgb(188,188,188)" v-model="reason" placeholder="请输入拒单理由"/>
					</view>
			</view>
			
			<view style="margin-top:38upx;padding-bottom: 18px;">
				<button type="primary color6d8bf9" @tap="refuseConfirm">确认拒单</button>
			</view>
			
			</view><!-- wraper结束 -->
		</view>
	</view>
</template>

<script>
	export default {
        components: {
         
        },
		data() {
            return {
				taskId:'',
				assignId:'',
				reason:""
			}
		},
		onLoad(options) {
			console.log("options")
			this.taskId=options.taskId
			this.assignId=options.assignId
			// if(options.type==1){//撤销预约单 暂时保留
			// 	uni.showModal({
			// 		title:'温馨提示',
			// 		content:'您现在拒单会罚款50元！请确认您已知晓',
			// 		success: function (res) {
			// 			if (res.confirm) {
			// 				console.log('用户点击确定');
			// 			} else if (res.cancel) {
			// 				console.log('用户点击取消');
			// 					uni.switchTab({
			// 					url:'../../pages/Order/index'
			// 				})
			// 			}
			// 		}
			// 	})
			// }
		},
        computed: {
        },
		methods: {
			async refuseConfirm(){
				uni.showLoading({})
				let res_info=await this.$apip.getPersonalInfo()
				let staffId=res_info.data.data.staffId
				let reason=this.reason
				let res_reject=await this.$apio.refuseOeder(staffId,this.taskId,reason,this.assignId)//拒单
				uni.hideLoading()
				uni.navigateTo({
					url:'refuseSuccess'
				})
			}
		}
	}
</script>

<style lang="scss">
	.content{
		background-color: $uni-bg-color;
	}
	
	.part{
		background: $uni-bg-color;
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		margin-bottom: 20upx;
	}

	.padding {
		padding: 25upx 40upx;
	}

	.flexRow{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
	}

    .tj{
		margin-bottom: 0;
		padding-bottom: 0;
		.tjTitle{
			display: flex;
			flex-direction: row;
			border-bottom: 1upx solid #ebedf0;
			padding: 40upx 0;
            .left{
				flex: 1;
				text-align: left;
				font-size: $uni-font-size-base;
				font-weight: bold;
			}
			.right{
				flex: 1;
				text-align: right;
				color: $uni-text-color-grey;
			}
		}
		.tjBody{
			justify-content: flex-start;
			border-bottom: 1upx solid #f5f5f5;
		}
	}
.list{
	width:100%;border-bottom:solid 26upx #f1f1f1;
	.li{
		width:92%;height:100upx;padding:0 4%;border-bottom:solid 1upx #e7e7e7;display:flex;align-items:center;
	&.noborder{border-bottom:0}
		.icon{
			flex-shrink:0;width:50upx;height:50upx;
			image{width:50upx;height:50upx}
		}
		.text{padding-left:20upx;width:100%;color:#666}
		.to{flex-shrink:0;width:40upx;height:40upx}
	}
}
.uni-textarea textarea{
	width:auto;
	height:80px;
	background-color: #eeeff3;
}
.inline-block{
	display: inline-block
}
.to{flex-shrink:0;width:40upx;height:28upx}
input{
	text-align: right;
}
</style>
