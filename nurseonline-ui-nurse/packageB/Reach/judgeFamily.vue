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
			<view class="uni-title uni-common-pl padding"><view class="left-icon">个人及家庭情况</view></view>
			
			<!-- input -->
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(type,typeIndex) in InputList" :key="typeIndex">
				<view class="flex-item">{{type.name}}</view>
				<view class="width80p"><input :disabled="ReadRecOnly" class="flex-item uni-input" v-model="type.value" name="type.name" :placeholder="type.placeholder" placeholder-class="holder"/></view>
			</view>
			
			<!-- select option -->
			<view class="bottom-01 bg-white padding  border-bottom"  v-for="(item,itemIndex) in SelectArr" :key="itemIndex">
				<view class="flex-box horizontal-between vertical-center">
					<view class="uni-title uni-common-pl">{{item.name}}</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-db color999">
								<picker :disabled="ReadRecOnly" @change="IndexChange($event,itemIndex,item.key)"  :value="item.initIndex" :range="item.array">
									<view class="uni-input inline-block">{{item.initIndex}}</view>
									<text class="iconfont">&#xe6f8;</text>
								</picker>
							</view>
						</view>
					</view>
				</view>
				
				<view v-if="item.showElse" class="uni-flex justify-content-space mt20">
					<view class="title font-size22">{{item.elseLabel}}</view>
					<view v-if="item.showElse1" class="border-bottom"><input :disabled="ReadRecOnly" class="flex-item uni-input text-alignC color999" v-model="item.text1"    placeholder-class="holder"/></view>
					
					<view class="title font-size22">{{item.elseLabel2}}</view>
					<view v-if="item.showElse2"  class="border-bottom"><input :disabled="ReadRecOnly" class="flex-item uni-input text-alignC color999" v-model="item.text2"    placeholder-class="holder"/></view>
				
				</view>
			</view>
			
			<view style="margin-top:38upx;padding-bottom: 18px;">
				<button  type="primary color6d8bf9" @tap="toJudgeHistory">下一步</button>
							
				<button type="primary color6d8bf9" class="see-btn-step mt20" @tap="backtoJudgeContent">上一步</button>
			</view>
			
			</view><!-- wraper结束 -->
		</view>
	</view>
</template>

<script>
	let personalAndFamily='';
	export default {
        components: {
        },
		data() {
            return {
              type: 'month',
			  InputList:[
				  {name:"家庭住址",
				   placeholder:"请输入家庭住址",
				   value:""
				  },
				  {name:"电话",
				   placeholder:"请输入电话",
				   value:""
				  },
			  ],
			title: 'picker',
			SelectArr:[
				{key:'elevator',name:"电梯",array: ["有","无"],initIndex:"",showElse:false},
				{key:'education',name:"教育程度",array: ["大专","本科","硕士","博士及以上"],initIndex:"",showElse:false},
				{key:'info_source',name:"资源来源",array: ["本人","家属","朋友","其他"],initIndex:"",showElse:false},
				{key:'language',name:"常用语言",array:["普通话","粤语","雷话","其它"],initIndex:"",showElse:false},
				{key:'diet',name:"饮食",array:["清淡","偏咸","偏甜","偏油腻"],initIndex:"",showElse:false},
				{key:'smoking',name:"吸烟",array:["有","无","已戒"],initIndex:"",
							showElse:false,
							showElse1:false,elseLabel:'根/天',
							showElse2:false,elseLabel2:'年（烟龄）',
							text1:'',text2:''},
				{key:'drinking',name:"嗜酒",array:["有","无","已戒"],initIndex:"",showElse:false,elseLabel:'两/天'},
				{key:'movement',name:"运动",array:["有","无","经常"],initIndex:"",showElse:false,elseLabel:'运动形式'},
				{key:'family_support',name:"家庭支持",array:["积极","一般","无"],initIndex:""},
				{key:'caregiver',key:'elevator',name:"日常照顾者",array:["自我照顾","夫/妻","父母","子女","亲戚","朋友","保姆","其他"],initIndex:"",showElse:false},
				{key:'allergic_history',name:"过敏史",array:["未发现","有","不明确"],initIndex:"",
						showElse:false,
						showElse1:false,elseLabel:'过敏药品',
						showElse2:false,elseLabel2:'过敏食物',
						text1:'',text2:''},
				{key:'payment_method',name:"医疗费用支付方式",array:["自费","公费","其他"],initIndex:"",showElse:false},
			],
			initNextPage:true,
			speciality:"",
			professionalIntro:"",
			smokingEvery:'',
			ReadRecOnly:false,
			// personalAndFamily:{
			// 		"home_address": "广州市天河区华明路13号2303室",
			// 		"phone": "15818151271",
			// 		"elevator": "有",
			// 		"education": "大专及以上",
			// 		"info_source": "本人",
			// 		"language": "普通话",
			// 		"diet": "清淡",
			// 		"smoking": "无",
			// 		"drinking": "无",
			// 		"movement": "偶尔",
			// 		"movement_type": "散步",
			// 		"family_support": "积极",
			// 		"caregiver": "自我照顾",
			// 		"allergic_history": "有",
			// 		"allergic_history_drug": "青霉素",
			// 		"allergic_history_food": "鱼",
			// 		"payment_method": "自费"
			// 	}//个人及家庭情况
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
					//设置地址和电话
				let taskId=res.taskId
				let res_billtask=await this.$apio.billtaskBytaskId(taskId)
				this.InputList[0].value=res_billtask.data.data.custAddress
				this.InputList[1].value=res_billtask.data.data.linkmanPhone
				
				if(res.personalAndFamily.indexOf("{") != -1){//存在{}
					console.log('字符串对象为{}正确格式')
					personalAndFamily=JSON.parse(res.personalAndFamily)
					this.InputList[0].value=personalAndFamily.home_address
					this.InputList[1].value=personalAndFamily.phone
					this.SelectArr[0].initIndex=personalAndFamily.elevator
					this.SelectArr[1].initIndex=personalAndFamily.education
					this.SelectArr[2].initIndex=personalAndFamily.info_source
					this.SelectArr[3].initIndex=personalAndFamily.language
					this.SelectArr[4].initIndex=personalAndFamily.diet
					this.SelectArr[5].initIndex=personalAndFamily.smoking
					if(personalAndFamily.smoking=='有'){
						this.SelectArr[5].showElse=true
						if(personalAndFamily.smoking_times!=''){
							this.SelectArr[5].showElse1=true
							this.SelectArr[5].text1=personalAndFamily.smoking_times
						}
						if(personalAndFamily.smoking_years!=''){
							this.SelectArr[5].showElse2=true
							this.SelectArr[5].text2=personalAndFamily.smoking_years
						}
					}
					this.SelectArr[6].initIndex=personalAndFamily.drinking
					this.SelectArr[7].initIndex=personalAndFamily.movement
					if(personalAndFamily.movement!='无'){
						this.SelectArr[7].showElse=true
						if(personalAndFamily.movement_type!=''){
							this.SelectArr[7].showElse1=true
							this.SelectArr[7].text1=personalAndFamily.movement_type
						}
					}
					this.SelectArr[8].initIndex=personalAndFamily.family_support
					this.SelectArr[9].initIndex=personalAndFamily.caregiver
					this.SelectArr[10].initIndex=personalAndFamily.allergic_history
					if(personalAndFamily.allergic_history=='有'){
						this.SelectArr[10].showElse=true
						if(personalAndFamily.allergic_history_drug!=''){
							this.SelectArr[10].showElse1=true
							this.SelectArr[10].text1=personalAndFamily.allergic_history_drug
						}
						if(personalAndFamily.allergic_history_food!=''){
							this.SelectArr[10].showElse2=true
							this.SelectArr[10].text2=personalAndFamily.allergic_history_food
						}
					}
					this.SelectArr[11].initIndex=personalAndFamily.payment_method
				}else{//不存在{}
					console.log('字符串对象格式错误/初始创建')
					personalAndFamily='{}'
					personalAndFamily=JSON.parse(personalAndFamily)
				}
				
				
				
				
			},
			IndexChange: function(e,itemIndex,key) {
				this.SelectArr[itemIndex].initIndex =this.SelectArr[itemIndex].array[e.target.value]
				console.log("所选项",itemIndex,this.SelectArr[itemIndex].array[e.target.value])
				let label=this.SelectArr[itemIndex].array[e.target.value]
				console.log("key",key)
				personalAndFamily[key]=label
				let labelArr=[]
				switch(itemIndex)
				{
					case 0:
					
					break;
					case 1:
					
					break;
					case 2:
					
					break;
					case 3:
					
					break;
					case 4:
					
					break;
					case 5:
					if(e.target.value==0){//吸烟
						this.SelectArr[itemIndex].showElse=true
						this.SelectArr[itemIndex].showElse2=true
					}else{
						this.SelectArr[itemIndex].showElse=false
						this.SelectArr[itemIndex].showElse2=false
					}
					
					break;
					case 6:
					if(e.target.value==0){//喝酒
						this.SelectArr[itemIndex].showElse=true
					}else{
						this.SelectArr[itemIndex].showElse=false
					}
					
					break;
					case 7:
					if(e.target.value!=1){//运动
						this.SelectArr[itemIndex].showElse=true
					}else{
						this.SelectArr[itemIndex].showElse=false
					}
				
					break;
					case 8:
					
					break;
					case 9:
					
					break;
					case 10:
					if(e.target.value==1){//有过敏史
						this.SelectArr[itemIndex].showElse=true
					}else{
						this.SelectArr[itemIndex].showElse=false
					}
				
					break;
					case 11:
					
					break;
				}
			},
			
			
			bindTextAreaBlur: function (e) {
            console.log(e.detail.value)
			},
			backtoJudgeContent(){
				uni.navigateBack({
					url:'judgeContent'
				})
			},
			toJudgeHistory(){
				personalAndFamily.home_address=this.InputList[0].value
				personalAndFamily.phone=this.InputList[1].value
				personalAndFamily.elevator=this.SelectArr[0].initIndex
				personalAndFamily.education=this.SelectArr[1].initIndex
				personalAndFamily.info_source=this.SelectArr[2].initIndex
				personalAndFamily.language=this.SelectArr[3].initIndex
				personalAndFamily.diet=this.SelectArr[4].initIndex
				personalAndFamily.smoking=this.SelectArr[5].initIndex
				personalAndFamily.drinking=this.SelectArr[6].initIndex
				personalAndFamily.movement=this.SelectArr[7].initIndex
				personalAndFamily.family_support=this.SelectArr[8].initIndex
				personalAndFamily.caregiver=this.SelectArr[9].initIndex
				personalAndFamily.allergic_history=this.SelectArr[10].initIndex
				
				personalAndFamily.smoking_times=this.SelectArr[5].text1
				personalAndFamily.smoking_years=this.SelectArr[5].text2
				personalAndFamily.movement_type=this.SelectArr[7].text1
				personalAndFamily.allergic_history_drug=this.SelectArr[10].text1
				personalAndFamily.allergic_history_food=this.SelectArr[10].text2
				
				this.$store.state.rec.personalAndFamily=JSON.stringify(personalAndFamily)
				console.log('this.$store.state.rec.personalAndFamily',this.$store.state.rec.personalAndFamily)
				uni.navigateTo({
					url:'judgeHistory'
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