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
			<view class="uni-title uni-common-pl padding"><view class="left-icon">护理评估（必填）</view></view>
			
			<view class="nurse-form-base" v-if="isDefault">
				<!-- input -->
				<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(type,typeIndex) in InputList" :key="typeIndex">
					<view class="flex-item">{{type.name}}</view>
					<view><input :disabled="ReadRecOnly" class="flex-item uni-input" v-model="type.value" name="type.name" :placeholder="type.placeholder" placeholder-class="holder"/></view>{{type.unit}}
				</view>
				
				<!-- select option -->
				<view class="bottom-01 bg-white padding border-bottom"  v-for="(item,itemIndex) in SelectArr" :key="itemIndex">
					<view class="flex-box horizontal-between vertical-center">
						<view class="uni-title uni-common-pl">{{item.name}}</view>
						<view class="uni-list">
							<view class="uni-list-cell">
								<view class="uni-list-cell-db color999">
									<picker :disabled="ReadRecOnly" @change="IndexChange(itemIndex,$event,item.key)"  :value="item.initIndex" :range="item.array">
										<view class="uni-input inline-block">{{item.initIndex}}</view>
										<text class="iconfont">&#xe6f8;</text>
									</picker>
								</view>
							</view>
						</view>
					</view>	
					<view v-if="item.showElse" class="uni-flex justify-content-space mt20">
						<view class="border-bottom"><input :disabled="ReadRecOnly" class="flex-item uni-input" v-model="elseInput" placeholder-class="holder"/></view>
						<view>{{item.elseLabel}}</view>
					</view>
				</view>
			</view>

			<assessment-form v-else :index="formIndex"></assessment-form>
			
			<view style="margin-top:38upx;padding-bottom: 18px;">
				<button  type="primary color6d8bf9" @tap="toSubmitJudgeOpt">下一步</button>
							
				<button type="primary color6d8bf9" class="see-btn-step mt20" @tap="backtoJudgeHistory">上一步</button>
			</view>
			
			</view><!-- wraper结束 -->
		</view>
	</view>
</template>

<script>
	import AssessmentForm from '@/components/AssessmentForm/AssessmentForm'
	let assessmentRequired;
	export default {
        components: {
			AssessmentForm
        },
		data() {
            return {
              type: 'month',
			  InputList:[
				  {name:"T(体温)",
				   placeholder:"请输入",
				   value:"",
				   unit:"℃"
				  },
				  {name:"P（脉搏）",
				   placeholder:"请输入",
				   value:"",
				   unit:"次/分"
				  },
				  {name:"R（呼吸）",
				   placeholder:"请输入",
				   value:"",
				   unit:"次/分"
				  },
				   {name:"BP（血压）",
				   placeholder:"请输入",
				   value:"",
				   unit:"mmHg"
				  },
			  ],
			title: 'picker',
			SelectArr:[
			// {key:'blood_glucose_time',name:"血糖值",IndexChange:"occupationIndexChange",array: ["空腹","餐前","餐后"],initIndex:'',showElse:true,elseLabel:'mmol/L'},
			{key:'mind',name:"神志",IndexChange:"occupationIndexChange",array: ["未评估","清醒","嗜睡","躁动","昏迷"],initIndex:'',showElse:false,elseLabel:''},
			{key:'complexion',name:"皮肤颜色",IndexChange:"occupationIndexChange",array: ["正常","苍白","潮红","紫绀","黄疸","其他"],initIndex:'',showElse:false,elseLabel:'（请输入具体皮肤颜色）'},
			{key:'language_expression',name:"语言表达",IndexChange:"occupationIndexChange",array: ["未评估","清楚","含糊","失语"],initIndex:'',showElse:false,elseLabel:''},
			],
			initNextPage:true,
			speciality:"",
			professionalIntro:"",
			saveArr:{
				temperature:'',
				pulse:'',
				respiratory :'',
				blood_pressure:'',
				
				blood_glucose_value:'',
				mind:'',
				complexion:"",
				language_expression:'',
			},
			ReadRecOnly:false,
			assessmentRequired:{
					"temperature": "37",
					"pulse": "60",
					"respiratory": "52",
					"blood_pressure": "52",
					"blood_glucose_value": "85",
					"blood_glucose_time": "空腹",
					"mind": "清醒",
					"complexion": "正常",
					"language_expression": "清楚"
				},
			elseInput:'',
			isDefault: true,
			formIndex: '',
            }
			
			
		},
		onLoad(options) {
			this.$store.state.stepCurrent=0
			this.init()
		},
        computed: {
        },
		methods: {
			async init(){
				this.$store.state.assessmentData = []
				//是否只读
				this.ReadRecOnly=this.$store.state.ReadRecOnly
				let res=this.$store.state.rec
				if(res.assessmentRequired==null){
					console.log('初始null')
					assessmentRequired='{}'
					assessmentRequired=JSON.parse(assessmentRequired)
				}else{
					if(res.assessmentRequired.indexOf("{") != -1){//存在{}
						console.log('字符串对象为{}正确格式')
						assessmentRequired=JSON.parse(res.assessmentRequired)
						this.InputList[0].value=assessmentRequired.temperature
						this.InputList[1].value=assessmentRequired.pulse
						this.InputList[2].value=assessmentRequired.respiratory
						this.InputList[3].value=assessmentRequired.blood_pressure
						this.elseInput=assessmentRequired.blood_glucose_value
						
						// this.SelectArr[0].initIndex=assessmentRequired.blood_glucose_time
						this.SelectArr[0].initIndex=assessmentRequired.mind
						this.SelectArr[1].initIndex=assessmentRequired.complexion
						this.SelectArr[2].initIndex=assessmentRequired.language_expression
						this.$store.state.assessmentData = assessmentRequired.otherData || []
					}else{
						console.log('字符串对象格式错误')
						assessmentRequired='{}'
						assessmentRequired=JSON.parse(assessmentRequired)
					}
				}

				let assessment = await this.$apio.getAssessment(res.taskId)
				let assessmentId = assessment.data.data
				if (assessmentId || this.$store.state.assessmentData.length > 0) {
					this.isDefault = false
					this.formIndex = assessmentId.toString()
				}
			},
			async nextStepto2(){
				uni.navigateTo({
					url:'step2',
				})
			},
			IndexChange: function(itemIndex,e,key) {
				let label=this.SelectArr[itemIndex].array[e.target.value]
				this.SelectArr[itemIndex].initIndex = label
				assessmentRequired[key]=label
				console.log("itemIndex",this.SelectArr[itemIndex].array[e.target.value])
				let labelArr=[]
				switch(itemIndex){
					case 0:
					
					break;
					case 1:
						if(e.target.value==5){//皮肤颜色为其它
							this.SelectArr[itemIndex].showElse=true
						}else{
							this.SelectArr[itemIndex].showElse=false
						}
					
					break;
					case 2:
					
					break;
					case 3:
					
					break;
				}
			},
			bindTextAreaBlur: function (e) {
            console.log(e.detail.value)
			},
			backtoJudgeHistory(){
				uni.navigateBack({
					url:'judgeHistory'
				})
			},
			toSubmitJudgeOpt(){
				console.log(assessmentRequired)
				assessmentRequired.temperature=this.InputList[0].value
				assessmentRequired.pulse=this.InputList[1].value
				assessmentRequired.respiratory=this.InputList[2].value
				assessmentRequired.blood_pressure=this.InputList[3].value
				assessmentRequired.blood_glucose_value=this.elseInput
				
				// assessmentRequired.blood_glucose_time=this.SelectArr[0].initIndex
				assessmentRequired.mind=this.SelectArr[0].initIndex
				assessmentRequired.complexion=this.SelectArr[1].initIndex
				assessmentRequired.language_expression=this.SelectArr[2].initIndex

				let state = this.$store.state

				if (state.assessmentData.length > 0) {
					assessmentRequired.otherData = state.assessmentData
				}
				state.rec.assessmentRequired = JSON.stringify(assessmentRequired)

				uni.navigateTo({
					url:'submitJudgeOpt'
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