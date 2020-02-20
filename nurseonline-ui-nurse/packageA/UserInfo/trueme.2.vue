<template>
	<view style="background:#fff;">
		<view class="grace-idcard-main uni-padding-wrap uni-common-mt">
			<view class="color6e8cfa bgc-fff border-bottom-8 padding-10-0 pl45">
				#当前页只可查看，不可修改
			</view>
			<view class="wraperView"><!-- wraper开始 -->
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom"  v-for="(item,itemIndex) in SelectArr" :key="itemIndex">
				<view class="uni-title uni-common-pl">{{item.name}}</view>
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-db color999">
							<picker disabled="true" @change="IndexChange(itemIndex,$event)"  :value="item.initIndex" :range="item.array">
								<view class="uni-input inline-block">{{item.array[item.initIndex]}}</view>
								<!-- <text class="iconfont">&#xe6f8;</text> -->
							</picker>
						</view>
					</view>
				</view>
			</view>
			
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom">
				<view class="flex-item">{{InputList[0].name}}</view>
				<view class="width80p"><input disabled='true' class="flex-item uni-input" v-model="InputList[0].value" name="type.name" :placeholder="InputList[0].placeholder" placeholder-class="holder"/></view>
			</view>
			
			<!-- <view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom">
				<view class="uni-title uni-common-pl">{{workYear.name}}</view>
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-db color999">
							<picker @change="IndexChange1(3,$event)"  :value="workYear.initIndex" :range="workYear.array">
								<view class="uni-input inline-block">{{workYear.array[workYear.initIndex]}}</view>
								<text class="iconfont">&#xe6f8;</text>
							</picker>
						</view>
					</view>
				</view>
			</view> -->
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom">
				<view class="flex-item">{{workYear.name}}</view>
				<view><input class="flex-item uni-input" v-model="workYear.value" name="type.name" :placeholder="workYear.placeholder" placeholder-class="holder"/></view> 年
			</view>
			
			<!-- textarea -->
			<view>
				<view class="uni-textarea">
					</view>
					<view class="uni-title uni-common-pl padding"><view class="left-icon">特长</view></view>
					<view class="uni-textarea padding pt0-im pb0-im">
						<textarea disabled="true" placeholder-style="color:rgb(188,188,188)" class="color666" v-model="speciality" placeholder="擅长专业的描述"/>
					</view>
			</view>
			
			<view>
				<view class="uni-textarea">
					</view>
					<view class="uni-title uni-common-pl padding"><view class="left-icon">专业</view></view>
					<view class="uni-textarea padding pt0-im pb0-im">
						<textarea disabled="true" placeholder-style="color:rgb(188,188,188)" class="color666" v-model="professionalIntro" placeholder="请输入专业介绍"/>
					</view>
			</view>
			
		<view style="margin-top:38upx;padding-bottom: 18px;">
			<button type="primary color6d8bf9" @tap="backToIndex">返回</button>
		</view>
		
			
			</view><!-- wraper结束 -->
		</view>
	</view>
</template>

<script>
	var reciveInfo//获取Info
	export default {
        components: {
        
        },
		data() {
            return {
              type: 'month',
			  InputList:[
				   {name:"工作单位",
				   placeholder:"请输入工作单位",
				   value:""
				  },
			  ],
			title: 'picker',
			SelectArr:[
			{name:"学历",IndexChange:"recordScIndexChange",array: [],indexList:[],initIndex:0,},	
			{name:"职业",IndexChange:"occupationIndexChange",array: [],indexList:[],initIndex:0},
			{name:"职称",IndexChange:"professorIndexChange",array: [],indexList:[],initIndex:0},
			],
			workYear:{
				name:"工作年限",
				placeholder:"请输入工作年限",
				value: '',
			},
			// workYear:{name:"工作年限",IndexChange:"workyerarIndexChange",array:["1年","2年","3年","4年","5年及以上"],initIndex:0},
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
				professionalIntro:"",
				userId:"",
				phone:Number,
				userName:''
				}
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
				uni.showLoading({
					title:'加载中'
				})
			//数据字典准备	
				//staff_type、education、professional_title
			    let res_staff_type = await this.$apid.staffType("staff_type");
				let res_education = await this.$apid.staffType("education");
				let res_professional_title = await this.$apid.staffType("professional_title");
				
				res_staff_type.data.data.forEach((item,index)=>{
					this.SelectArr[1].array[index]=item.itemName
					this.SelectArr[1].indexList[index]=item.itemId
				})
				res_education.data.data.forEach((item,index)=>{
					this.SelectArr[0].array[index]=item.itemName
					this.SelectArr[0].indexList[index]=item.itemId
				})
				res_professional_title.data.data.forEach((item,index)=>{
					this.SelectArr[2].array[index]=item.itemName
					this.SelectArr[2].indexList[index]=item.itemId
				})
				console.log("this.SelectArr",this.SelectArr)	
			//初始化数据 getInfo
				let getInfo = await this.$api.getInfo();
				uni.hideLoading()
				reciveInfo=getInfo.data.data
				console.log("getInfo",getInfo.data)
				this.saveArr.staffId=reciveInfo.staffId
				this.saveArr.versionNo=reciveInfo.versionNo
				this.saveArr.userId=reciveInfo.userId
				this.saveArr.userName=reciveInfo.userName
				//初始显示
				// this.InputList[0].value=reciveInfo.staffName
				// this.InputList[1].value=this.$targb.getDAesString(reciveInfo.idNo)//身份证解密
				this.SelectArr[1].initIndex=this.SelectArr[1].indexList.indexOf(parseInt(reciveInfo.staffType))
				this.SelectArr[0].initIndex=this.SelectArr[0].indexList.indexOf(parseInt(reciveInfo.education))
				this.SelectArr[2].initIndex=this.SelectArr[2].indexList.indexOf(parseInt(reciveInfo.professionalTitle))
				// this.SelectArr[3].initIndex=reciveInfo.serviceYears
				
				this.InputList[0].value=reciveInfo.jobOrg//工作单位
				
				// this.workYear.initIndex=parseInt(reciveInfo.serviceYears)-1
				this.workYear.value = reciveInfo.serviceYears

				this.speciality=reciveInfo.speciality
				this.professionalIntro=reciveInfo.professionalIntro
			//获取phone
				this.saveArr.phone=this.$store.state.myPhone
			//判断资质认证的类型 init staff_Type
				this.$store.state.staffType=6//临时
			},
			async nextStepto2(){
				if (!(/^((?!0)\d{1,2})$/.test(this.workYear.value))) {
					uni.showToast({
						title: '工作年限输入不合法',
						icon: 'none'
					})
					return false
				}
				//字典的数据和值
				let initIndex0=this.SelectArr[0].initIndex
				this.saveArr.staffType=this.SelectArr[0].indexList[initIndex0]
				let initIndex1=this.SelectArr[1].initIndex
				this.saveArr.education=this.SelectArr[1].indexList[initIndex1]
				let initIndex2=this.SelectArr[2].initIndex
				this.saveArr.professionalTitle=this.SelectArr[2].indexList[initIndex2]
				//其它字段
				// this.saveArr.serviceYears=(parseInt(this.SelectArr[3].initIndex))
				this.saveArr.serviceYears = parseInt(this.workYear.value)
				this.saveArr.staffName=this.InputList[0].value
				this.saveArr.idNo=this.$targb.getAesString(this.InputList[1].value)
				
				console.log(this.InputList[1].value)
				
				this.saveArr.speciality=this.speciality
				this.saveArr.professionalIntro=this.professionalIntro
				uni.showLoading({
					title: '保存中'
				})
				let res = await this.$api.confirmStep1(this.saveArr);
				uni.hideLoading();
			},
			IndexChange: function(itemIndex,e) {
				console.log('携带值为',e.target.value)
				this.SelectArr[itemIndex].initIndex = e.target.value//当前value
				
				//staffType
				this.$store.state.staffType=this.SelectArr[0].initIndex
				console.log("staffType",this.$store.state.staffType)
			},
			backToIndex(){
				uni.navigateBack({
					url:'trueme'
				})
			},
			IndexChange1: function(itemIndex,e) {
				console.log('携带值为',e.target.value)
				this.workYear.initIndex = e.target.value//当前value
			},
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
