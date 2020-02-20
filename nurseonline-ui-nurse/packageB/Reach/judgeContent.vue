<template>
	<view style="background:#fff;">
		<view v-if='ReadRecOnly'class="grace-idcard-alL color6e8cfa bgc-fff border-bottom-8 padding-10-0 pl45">
			#当前页只可查看，不可修改
		</view>
		<view v-else class="grace-idcard-alL color6e8cfa bgc-fff border-bottom-8 padding-10-0 pl45">
			#如果信息与评估不一致，请修改!
		</view>
		<view class="grace-idcard-main uni-padding-wrap uni-common-mt">
			<view class="wraperView"><!-- wraper开始 -->
			<!-- textarea -->
			<view>
				<view class="uni-textarea">
					</view>
					<view class="uni-title uni-common-pl padding"><view class="left-icon">服务内容</view></view>
				
					<view class="uni-textarea padding">
						<textarea :disabled="ReadRecOnly" placeholder-style="color:rgb(188,188,188)" class="color666" v-model="textarea" placeholder="请输入拒单理由"/>
					</view>
			</view>
			
			<view style="margin-top:38upx;padding-bottom: 18px;">
				<button  type="primary color6d8bf9" @tap="toJudgeFamily">下一步</button>
			
				<button type="primary color6d8bf9" class="see-btn-step mt20" @tap="backtoJudgeMain">上一步</button>
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
				textarea:"",
				ReadRecOnly:false
			}
		},
		onLoad() {
			this.init()
		},
        computed: {
        },
		methods: {
			async init(){
				//是否只读
				this.ReadRecOnly=this.$store.state.ReadRecOnly
				
				let res=this.$store.state.rec
				this.textarea=res.serviceContent
			},
			backtoJudgeMain(){
				uni.navigateBack({
					url:'judgeMain'
				})
			},
			toJudgeFamily(){
				this.$store.state.rec.serviceContent=this.textarea
				uni.navigateTo({
					url:'judgeFamily'
				})
			},
			ReadRecOnly:false
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
