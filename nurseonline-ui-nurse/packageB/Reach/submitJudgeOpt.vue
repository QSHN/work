<template>
	<view style="background:#fff;">
		<view v-if='ReadRecOnly'class="grace-idcard-alL color6e8cfa bgc-fff border-bottom-8 padding-10-0 pl45">
			#当前页只可查看，不可修改
		</view>
		<view v-else class="grace-idcard-alL color6e8cfa bgc-fff border-bottom-8 padding-10-0 pl45">
			#下面信息视护理项目酌情评估
		</view>
		<view class="grace-idcard-main uni-padding-wrap uni-common-mt">
			
			<view class="wraperView"><!-- wraper开始 -->
			<view class="uni-title uni-common-pl padding"><view class="left-icon">护理评估</view></view>
			
			<!-- select option -->
			<view class="bottom-01 bg-white padding  border-bottom"  v-for="(item,itemIndex) in SelectArr" :key="itemIndex">
				<view class="flex-box horizontal-between vertical-center">
					<view class="uni-title uni-common-pl">{{item.name}}</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-db color999">
								<picker  :disabled="ReadRecOnly" @change="IndexChange($event,itemIndex,item.key)"  :value="item.initIndex" :range="item.array">
									<view class="uni-input inline-block">{{item.initIndex}}</view>
									<text class="iconfont">&#xe6f8;</text>
								</picker>
							</view>
						</view>
					</view>
				</view>
				
				<view v-if="item.showElse" class="uni-flex justify-content-space mt20">
					<view class="border-bottom"><input  :disabled="ReadRecOnly" class="flex-item uni-input" v-model="elseInput"    placeholder-class="holder"/></view>
					<view>{{item.elseLabel}}</view>
				</view>
			</view>
			
			<view style="margin-top:38upx;padding-bottom: 18px;">
				<button v-if='!ReadRecOnly' type="primary color6d8bf9" @tap="toServeDone">确认提交</button>
				<button v-if='ReadRecOnly' type="primary color6d8bf9" @tap="toServeDoneNext">下一步</button>	
				<button type="primary color6d8bf9" class="see-btn-step mt20" @tap="backtoSubmitJudgeMust">上一步</button>
			</view>
			
			</view><!-- wraper结束 -->
		</view>
	</view>
</template>

<script>
	let assessmentOption;
	import amap from '@/static/common/map/amap-wx.js'
	export default {
        components: {
        },
		data() {
            return {
              type: 'month',
			  InputList:[
				  {name:"家庭住址",
				   placeholder:"请输入家庭住址",
				   value:"湛江市开发区龙平南路9号"
				  },
				  {name:"电话",
				   placeholder:"请输入电话",
				   value:""
				  },
			  ],
			  elseInput: '',
			title: 'picker',
			SelectArr:[
			{key:'psychological_status',name:"心理状况",IndexChange:"",array: ["未评估","平静","开朗","焦虑","抑郁","其他"],initIndex:' ',showElse:false},
			{key:'sleep_state',name:"睡眠状态",IndexChange:"",array: ["未评估","正常","入睡困难","易醒","多梦","失眠","服务安眠药"],initIndex:' ',showElse:false},
			{key:'sleep_time',name:"睡眠时间",IndexChange:"",array: ["小于7小时","7小时","8小时","大于8小时"],initIndex:" ",showElse:false},
			{key:'sleep_position',name:"睡眠体位",IndexChange:"",array:["平卧","半坐卧","端坐卧位"],initIndex:" ",showElse:false},
			{key:'move_by',name:"移动",IndexChange:"",array:["独立","轻度依赖","中度依赖","完全依赖"],initIndex:" ",showElse:false},
			{key:'activities_of_daily_living',name:"ADL",IndexChange:"",array:["独立","轻度依赖","中度依赖","完全依赖"],initIndex:" ",showElse:false,elseLabel:'支/天'},
			{key:'balance_and_gait',name:"平衡和步态",IndexChange:"",array:["未评估","平稳","不平稳"],initIndex:" ",showElse:false,elseLabel:'两/天'},
			{key:'muscle_strength',name:"肢体肌力情况",IndexChange:"",array:["1级","2级","3级","4级","5级"],initIndex:"",showElse:false},
			{key:'body_type',name:"体型",IndexChange:"",array:["正常","肥胖","消瘦","恶液质"],initIndex:""},
			{key:'blood_glucose_time',name:"血糖值",IndexChange:"occupationIndexChange",array: ["空腹","餐前","餐后"],initIndex:'',showElse:true,elseLabel:'mmol/L'},
			{key:'eating_problem',name:"进食苦难",IndexChange:"",array:["无","有","管饲"],initIndex:"",showElse:false},
			{key:'special_diet',name:"特殊饮食",IndexChange:"",array:["无","避免"],initIndex:"",showElse:false,elseLabel:'(请输入过敏原)'},
			{key:'defecating',name:"排便情况",IndexChange:"",array:["正常","便秘","腹泻","失禁","造口"],initIndex:"",showElse:false},
			{key:'urination_color',name:"小便颜色",IndexChange:"",array:["澄清","黄色","血尿","茶色","浑浊","其他"],initIndex:"",showElse:false,elseLabel:'两/天'},
			{key:'defecating_fecal',name:"小便沉淀物",IndexChange:"",array:["有","无","经常"],initIndex:"",showElse:false},
			{key:'urination_sediment',name:"使用导尿管/尿套",IndexChange:"",array:["有","无"],initIndex:""},
			{key:'skin_integrity',name:"皮肤完整性",IndexChange:"",array:["完整","伤口"],initIndex:"",showElse:false},
			{key:'medication_compliance',name:"服用药物",IndexChange:"",array:["有",'无'],initIndex:'',showElse:false,elseLabel:'(请输入药物名称)'},
			{key:'medication',name:"服药依从性",IndexChange:"",array:["不适用","规律服药","不规律服药","不服药"],initIndex:"",showElse:false}
			],
			initNextPage:true,
			speciality:"",
			professionalIntro:"",
			saveArr:{
				elevator:'有',//电梯
				education:'大专',//教育程度
				info_source:'本人',//资源来源
				language:'普通话',//常用语言
				diet:'清淡',//饮食
				smoking:'无',//吸烟
				drinking:'无',//嗜酒
				movement:'有',//运动
				family_support:'积极',//家庭支持
				caregiver:'自我照顾',//日常照顾者
				allergic_history:'未发现',//过敏史
				payment_method:'自费',//医疗费用支付方式
			},
			smokingEvery:'',
			ReadRecOnly:false,
			amapPlugin: null,   
			key: '9e47e3566d3ae729652171562dabe658',
			latitude:'',//维度
			longitude:'',//经度
			assessment_option:{
					"psychological_status": "平静",
					"sleep_state": "正常",
					"sleep_time": "8",
					"sleep_position": "平卧",
					"move_by": "使用辅助行走器械",
					"walking_aids": "四脚架",
					"activities_of_daily_living": "独立",
					"balance_and_gait": "未评估",
					"muscle_strength": "0级部位",
					"body_type": "正常",
					blood_glucose_value: '',
					"blood_glucose_time": "空腹",
					"eating_problem": "无",
					"special_diet": "无",
					"avoid_foods": "",
					"defecating": "造口",
					"urination_stoma": "回肠代膀胱",
					"defecating_habit": "3",
					"defecating_fecal": "正常硬",
					"defecating_fecal": "正常",
					"urination_color": "澄清",
					"urination_sediment": "无",
					"urination_catheter": "号数3更换日期2019-05-10",
					"skin_integrity": "完整",
					"medication": "无",
					"medication_compliance": "不服药"
				}	
            }
		},
		onLoad() {
			this.$store.state.stepCurrent=0
			this.init()
			this.amapPlugin = new amap.AMapWX({  
			    key: this.key  
			})
			this.amapPlugin.getRegeo({
				success: res => {
					this.address = res[0].name
					console.log("当前定位地址",this.address)
				}
			})
			uni.getLocation({
				success: res => {
					this.latitude = res.latitude
					this.longitude = res.longitude
					console.log("this.latitude",this.latitude)
					console.log("this.longitude",this.longitude)
				}
			})
		},
        computed: {
        },
		methods: {
			async init(){
				//是否只读
				this.ReadRecOnly=this.$store.state.ReadRecOnly
				let res=this.$store.state.rec
				if(res.assessmentOption==null){
					console.log('初始null')
					assessmentOption='{}'
					assessmentOption=JSON.parse(assessmentOption)
				}else{
					if(res.assessmentOption .indexOf("{") != -1){//存在{}
						console.log('字符串对象为{}正确格式')
						assessmentOption=JSON.parse(res.assessmentOption)
						this.SelectArr.forEach((item,index)=>{
							item.initIndex=assessmentOption[item.key]
						})
						this.elseInput = assessmentOption.blood_glucose_value
					}else{
						console.log('字符串对象格式错误')
						assessmentOption='{}'
						assessmentOption=JSON.parse(assessmentOption)
						this.SelectArr.forEach((item,index)=>{
							assessmentOption[item.key]=item.initIndex
						})
						this.elseInput = assessmentOption.blood_glucose_value
					}
				}
			},
			async nextStepto2(){
				uni.navigateTo({
					url:'step2',
				})
			},
			IndexChange: function(e,itemIndex) {
				let label=this.SelectArr[itemIndex].array[e.target.value]
				this.SelectArr[itemIndex].initIndex = label
				
				let labelArr=[]
				switch(itemIndex)
				{
					case 0:
					this.saveArr.elevator=label
					break;
					case 1:
					this.saveArr.education=label
					break;
					case 2:
					this.saveArr.info_source=label
					break;
					case 3:
					this.saveArr.language=label
					break;
					case 4:
					this.saveArr.diet=label
					break;
					case 5:
					if(e.target.value==0){//吸烟
						this.SelectArr[itemIndex].showElse=true
					}else{
						this.SelectArr[itemIndex].showElse=false
					}
					this.saveArr.smoking=label
					break;
					case 6:
					if(e.target.value==0){//喝酒
						this.SelectArr[itemIndex].showElse=true
					}else{
						this.SelectArr[itemIndex].showElse=false
					}
					this.saveArr.drinking=label
					break;
					case 7:
					this.saveArr.movement=label
					break;
					case 8:
					this.saveArr.family_support=label
					break;
					case 9:
					this.saveArr.caregiver=label
					break;
					case 10:
					if(e.target.value==1){//有过敏史
						this.SelectArr[itemIndex].showElse=true
					}else{
						this.SelectArr[itemIndex].showElse=false
					}
					this.saveArr.allergic_history=label
					break;
					case 11:
					this.saveArr.payment_method=label
					break;
				}
			},
			bindTextAreaBlur: function (e) {
            console.log(e.detail.value)
			},
			backtoSubmitJudgeMust(){
				uni.navigateBack({
					url:'submitJudgeMust'
				})
			},
			async toServeDone(){
				this.SelectArr.forEach((item,index)=>{
					assessmentOption[item.key]=item.initIndex
				})
				assessmentOption.blood_glucose_value = this.elseInput
				this.$store.state.rec.assessmentOption=JSON.stringify(assessmentOption)
				console.log('this.$store.state.rec.assessmentOption',this.$store.state.rec.assessmentOption)
				uni.showLoading({})
				let data={recId:'',
				custName:this.$store.state.rec.custName,
				sex:this.$store.state.rec.sex,
				age:this.$store.state.rec.age,
				idNo:this.$store.state.rec.idNo,
				serviceContent:this.$store.state.rec.serviceContent,
				diseaseHistory:this.$store.state.rec.diseaseHistory,
				assessmentRequired:this.$store.state.rec.assessmentRequired,
				assessmentOption :this.$store.state.rec.assessmentOption,
				personalAndFamily:this.$store.state.rec.personalAndFamily,
				mainDiagnosis:this.$store.state.rec.mainDiagnosis,
				mainSymptom :this.$store.state.rec.mainSymptom,
				}
				data.recId=this.$store.state.recId
				let str='record='+true+'&position='+this.longitude+','+this.latitude//record挂在url上
				let res_data=await this.$apio.goNurseRec(data,str)
				uni.hideLoading()
				this.$store.state.orderRefresh++;//刷新order状态
				if(this.$store.state.toGoServer_from==0){
					// console.log('返回预约单详情页')
					// uni.navigateBack({
					// 	delta: 8//返回预约详情页
					// })
					console.log('返回预约单列表页')//20190716
					uni.switchTab({
						url:'../../pages/Order/index'
					})
				}else if(this.$store.state.toGoServer_from==1){
					console.log('返回预约单列表页')
					uni.switchTab({
						url:'../../pages/Order/index'
					})
				}
			},
			toServeDoneNext(){//查看上传服务
				uni.navigateTo({
					url:'../OrderDetail/serveDone' 
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