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
			<view class="uni-title uni-common-pl padding"><view class="left-icon">即往史</view></view>

			<!-- input -->
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(type,typeIndex) in InputList" :key="typeIndex">
				<view class="flex-item">{{type.name}}</view>
				<view><input class="flex-item uni-input" v-model="type.value" name="type.name" :placeholder="type.placeholder" placeholder-class="holder"/></view>
			</view>
			
			<!-- select option -->
			<view class="bottom-01 bg-white padding  border-bottom"  v-for="(item,itemIndex) in SelectArr" :key="itemIndex">
				<view class="flex-box horizontal-between vertical-center">
					<view class="uni-title uni-common-pl">{{item.name}}</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-db color999">
								<picker :disabled="ReadRecOnly" @change="IndexChange(itemIndex,$event)"  :value="item.initIndex" :range="item.array">
									<view class="uni-input inline-block">{{item.initIndex}}</view>
									<text class="iconfont">&#xe6f8;</text>
								</picker>
							</view>
						</view>
					</view>
				</view>	
				<view v-if="showElse" class="uni-flex justify-content-space mt20">
					<view class="border-bottom"><input :disabled="ReadRecOnly" class="flex-item uni-input" v-model="elseInput" placeholder-class="holder"/></view>
					<view>(请输入既往史)</view>
				</view>
			</view>
			<view style="margin-top:38upx;padding-bottom: 18px;">
				<button  type="primary color6d8bf9" @tap="toSubmitJudgeMust">下一步</button>
							
				<button type="primary color6d8bf9" class="see-btn-step mt20" @tap="backtoJudgeFamily">上一步</button>
			</view>
			
			</view><!-- wraper结束 -->
		</view>
	</view>
</template>

<script>
	let diseaseHistory
	export default {
        components: {
        },
		data() {
            return {
              type: 'month',
			  InputList:[
				 
			  ],
			title: 'picker',
			SelectArr:[
			{name:"既往史",IndexChange:"occupationIndexChange",array: ["有","无"],initIndex:'无'},
			],
			initNextPage:true,
			speciality:"",
			professionalIntro:"",
			showElse:false,
			elseInput:'',
			disease_history:'',//既往史提交
			ReadRecOnly:false
            }

		},
		onLoad() {
			this.$store.state.stepCurrent=0
			this.init()
		},
        computed: {
        },
		methods: {
			async init(){
				//是否只读
				this.ReadRecOnly=this.$store.state.ReadRecOnly
				let res=this.$store.state.rec
				diseaseHistory=res.diseaseHistory
				if(diseaseHistory==null){
					this.SelectArr[0].initIndex='无'
					this.showElse=false
				}else{
					if(diseaseHistory.indexOf("{") == -1){
						this.SelectArr[0].initIndex='无'
						this.showElse=false
					}else{
						this.SelectArr[0].initIndex='有'
						this.elseInput=JSON.parse(diseaseHistory).disease_history
						this.showElse=true
					}
				}
			},
			IndexChange: function(itemIndex,e) {
				console.log(e.target.value)
				let label=this.SelectArr[itemIndex].array[e.target.value]
				if(label=='有'){
					this.showElse=true
				}else{
					this.showElse=false
				}
				this.SelectArr[itemIndex].initIndex = label
			},
			backtoJudgeFamily(){
				uni.navigateBack({
					url:'judgeFamily'
				})
			},
			toSubmitJudgeMust(){
				if(this.SelectArr[0].initIndex=='无'){
					this.$store.state.rec.diseaseHistory='无'
				}else{
					this.$store.state.rec.diseaseHistory=JSON.stringify({"disease_history":this.elseInput})
				}
				console.log('this.$store.state.rec.diseaseHistory',this.$store.state.rec.diseaseHistory)
				uni.navigateTo({
					url:'submitJudgeMust'
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
		padding: 25upx 30upx;
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