<template>
	<view style="background:#fff;">
		<view class="grace-idcard-main uni-padding-wrap uni-common-mt">
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(type,typeIndex) in InputList" :key="typeIndex">
				<view class="flex-item">{{type.name}}</view>
				<view>
					<label class="flex-item uni-input" name="type.name">{{type.value}}</label>
				</view>
			</view>
			<view class="uni-title uni-common-pl padding"><view class="left-icon">出院小结</view></view>
			<view v-for="(item,index) in srcArr" :key='index'>
				<view class="m0a width100p text-alignC" @tap="prePic(index)">
					<image  mode="aspectFit" :src="item"></image>
				</view>
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
              type: 'month',
			  InputList:[
				  {name:"姓名",
				   placeholder:"张小宝",
				   value:""
				  },
				  {name:"治疗日期",
				   placeholder:"2018年3月19日",
				   value:""
				  },
				  {name:"医院名称",
				   placeholder:"广东医科大学附属医院",
				   value:""
				  },
				  {name:"科室",
				   placeholder:"内分泌科",
				   value:""
				  },
				  {name:"主要诊断",
				   placeholder:"伤口愈合不良",
				   value:""
				  },
				  {name:"主要症状",
				   placeholder:"伤口红肿",
				   value:""
				  },
			  ],
			src:'',//就诊图片 
			srcArr:[],//就诊图片数组 
			title: 'picker',
			SelectArr:[
			{name:"职业",IndexChange:"occupationIndexChange",array: ["护士","医生","康复师","催乳师","护工","其他"],initIndex:0},
			{name:"学历",IndexChange:"recordScIndexChange",array: ["大专","本科","硕士","博士及以上"],initIndex:0},
			{name:"职称",IndexChange:"professorIndexChange",array: ["护士","护师","主管护师","主任护师"],initIndex:0},
			{name:"工作年限",IndexChange:"workyerarIndexChange",array:["1年","2年","3年","4年","5年及以上"],initIndex:0},
			],
			initNextPage:true,
			speciality:"",
			professionalIntro:"",
			saveArr:{
				staffId:"",
				staffName:"",
				staffType:"",
				idNo:"",
				phone:"",
				education:"",
				professionalTitle:"",
				serviceYears:"",
				versionNo:"",
				speciality:"",
				professionalIntro:""
				}
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
				let dataObj=this.$store.state.detailObj
				this.InputList[0].value=this.$store.state.custName
				this.InputList[1].value=dataObj.treatDate
				this.InputList[2].value=dataObj.orgName
				this.InputList[3].value=dataObj.deptName
				this.InputList[4].value=dataObj.mainDiagnosis
				this.InputList[5].value=dataObj.mainSymptom
				
				let recImgArr=dataObj.imgUrl.split(';')
				console.log("recImgArr",recImgArr)
				recImgArr.forEach((item,index)=>{
					if(item!=''){
						this.srcArr[index]=item
					}
				})
				
			},
			
			async consumptiveSubmit(){
				this.$store.state.orderRefresh++
				console.log(1)
				uni.switchTab({
						url:'../../pages/Order/index',
				})
			},
			IndexChange: function(itemIndex,e) {
				console.log('picker select数组为',itemIndex,'携带值为',e.target.value)
				console.log(e)
				this.SelectArr[itemIndex].initIndex = e.target.value
			},
			bindTextAreaBlur: function (e) {
            console.log(e.detail.value)
			},
			prePic(index){
				let src=this.srcArr[index]
				uni.previewImage({
					urls: [src]
				});
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
