<template>
	<view>
		<view class="grace-idcard-main">
			<view class="color6e8cfa bgc-fff border-bottom-8 padding-10-0 pl45">
				#当前页只可查看，不可修改
			</view>	
			<view class="width100p text-alignC bgc-fff pt20 color666">{{mention}}</view>
			<view class="wraperView"><!-- wraper开始 --> 
				<view v-for="(item,index) in imgArr" :key='index'>
					<view class="grace-idcard-items border-dash uni-flex justify-content-space lineSpace">
						<view class="ml20">
							<view class="text width280">{{item.label}}</view>
						</view>
						<view class="grace-idcard-preview positionR">
							<image :src="item.idCard"  @tap="previewImg(index)" mode="widthFix"></image>
						</view>
					</view>

					<view v-if="item.showOption"><!-- 由option字段决定 -->
						<view  class="bottom-01 bg-white  flex-box horizontal-between vertical-center border-bottom padding-20">
							<view class="flex-item">{{item.option.certNo.fieldName}}
								<text v-if="item.option.certNo.isRequired==0">(选填)</text>
								<text v-if="item.option.certNo.isRequired==1">(必填)</text>
							</view>
							<view><input class="flex-item uni-input text-alignR" name="" v-model="actOccuVal" :placeholder="actOccu" placeholder-class="holder"/></view>
						</view>
						<view  class="uni-list-cell-db uni-flex justify-content-space padding-20 border-bottom">
							<view>{{item.option.fromDate.fieldName}}</view>
							<picker mode="date" :value="dateInit" :start="startDate" :end="endDate" @change="bindDateChange">
								<view class="uni-input">{{dateInit}}</view>
							</picker>
						</view>
						<view  class="uni-list-cell-db uni-flex justify-content-space padding-20 border-bottom">
							<view>{{item.option.validDate.fieldName}}</view>
							<picker mode="date" :value="dateEnd" :start="startDate" :end="endDate" @change="bindDateChange1">
								<view class="uni-input">{{dateEnd}}</view>
							</picker>
						</view>
					</view>	
					
				</view>
					
				<view style="margin-top:38upx;">
					<button type="primary color6d8bf9" @tap="submitConfirm">返回</button>
				</view>
			</view><!-- wraper结束 -->
		</view>
	</view>
</template>
<script>
var _self;
var myBaseUrl;
var devUrl;
var reciveInfo;
var fileUrl;
let confirmRuleLenght;
export default {
	components: {
	
	},
	data() {
		return {
			imgArr:[],//资质校验数组 数据初始
			actOccu:"请输入执业编号",
			actOccuVal:"",
			dateInit: '2012-12-12',
			dateEnd: '2012-12-12',
			saveArr : {
				
			},
			tempImgArrObj:{
				certNo:"",
				certState:"",//Number
				certType:"",//Number
				certTypeName:"",
				createTime:"",
				delFlag:"",
				fromDate:"",
				imgUrl:"",
				remark:"",
				staffCertId:"",//Number
				staffId:"",//Number
				updateTime:"",
				validDate:"",
			},
			mention:''
		};
	},
	onLoad:function(option){
		_self = this;
		this.$store.state.stepCurrent=2;
		this.init();
	},
	methods: {
		async init(){
			uni.showLoading({})
			//初始化数据 getInfo
			let getInfo = await this.$api.getInfo();
			reciveInfo=getInfo.data.data
			this.$store.state.staffType=getInfo.data.data.staffType
			myBaseUrl=this.$store.state.myBaseUrl	
			devUrl=this.$store.state.devUrl
			fileUrl=this.$store.state.fileUrl
			
			//1.获取access_token、Info、myBaseUrl
			try {
				this.access_token= uni.getStorageSync('access_token');
			} catch (e) {
				console.log(e)
			}
			//4.24：执业证编号和首次注册页（必填）；另外（选填）
			//0708 根据不同类型staffType，进行不同规则的校验
			console.log("this.$store.state.staffType",this.$store.state.staffType)
			let confirmRule=await this.$api.confirmRule(this.$store.state.staffType);
			uni.hideLoading()

			if(confirmRule.data.data.length<1){
				uni.showModal({
					title: '提示',
					content: '当前资质检测未维护：staffType='+this.$store.state.staffType,
					confirmText:'联系客服',
					success: (res)=> {
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber:this.$store.state.servePhone
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				return false;
			}
			console.log("confirmRule",confirmRule.data.data)//验证内容
			confirmRuleLenght=confirmRule.data.data.length
			let beforeSorNo=0;
			this.imgArr=[];
			if(confirmRule.data.data.length<1){
				return;
			}
			confirmRule.data.data.forEach((item,index)=>{
				if(item.groupCode!='idCard'){//非身份证的资质照片都放在这个页面 20190717
					let option;
					let showOption;
					if(item.option.length>1){
						option=JSON.parse(item.option)
					}
					if(typeof(option)=='undefined'){
						showOption=false
					}else{
						showOption=true
					}
					if(item.sortNo>beforeSorNo){
						this.imgArr.push({
							idCard: 'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//tar-nursing4.jpg',
							label:item.certName,
							idCard_del:false,
							certType:item.certType,
							option:option,
							showOption:showOption,
							sortNo:item.sortNo
						})
					}else{
						this.imgArr.unshift({
							idCard: 'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//tar-nursing4.jpg',
							label:item.certName,
							idCard_del:false,
							certType:item.certType,
							option:option,
							showOption:showOption,
							sortNo:item.sortNo
						})
					}
					console.log(this.imgArr)
				}
				this.$store.state.saveArr_s3[index]=JSON.parse(JSON.stringify(this.tempImgArrObj))//提交数据
				this.$store.state.saveArr_s3[index].certType=item.certType
				this.$store.state.saveArr_s3[index].certTypeName=item.certName
				beforeSorNo=item.sortNo
			})
			this.initElement()
			
		},
		//渲染数据
		initElement(){
			if(this.imgArr.length<1){//this.imgArr=[]
				this.mention='该职业身份无需相关资质审核的要求,请直接提交吧!'
				return;
			}
			if (reciveInfo.staffCerts.length>1) {//存在图片
				if(typeof(reciveInfo.staffCerts[0])=='undefined'){
					return;
				}
				// this.imgArr[0].idCard=reciveInfo.staffCerts[0].imgUrl
				// this.$store.state.saveArr_s3[0].imgUrl=reciveInfo.staffCerts[0].imgUrl
				// this.$store.state.saveArr_s3[0].staffCertId=reciveInfo.staffCerts[0].staffCertId
				// this.imgArr[0].idCard_del=true;
				
				//显示选填图片
				reciveInfo.staffCerts.forEach((item,index)=>{
					// if(index>=4){
						this.imgArr.forEach((itemChild,indexChild)=>{//this.imgArr 校验数据初始数组
							if(item.certType==itemChild.certType){
								itemChild.idCard=item.imgUrl
								itemChild.idCard_del=true
								if (item.certTag == '护士执业证' || item.certTypeName == '护士执业证' || item.certType == 4) {
									this.actOccuVal=item.certNo
									this.dateInit=item.fromDate
									this.dateEnd=item.validDate
								}
							}
						})
						this.$store.state.saveArr_s3.forEach((item_c,index_c)=>{//this.$store.state.saveArr_s3 校验数据提交数组
							if(item.certType==item_c.certType){
								item_c.imgUrl=item.imgUrl
								item_c.staffCertId=item.staffCertId
							}
						})
					// }
				})
				//资质编号、起止时间
				// this.actOccuVal=reciveInfo.staffCerts[0].certNo
				// this.dateInit=reciveInfo.staffCerts[0].fromDate
				// this.dateEnd=reciveInfo.staffCerts[0].validDate
			}
		},

		previewImg : function(index){
			uni.previewImage({
				urls:[_self.imgArr[index].idCard]
			});
		},
		delImg : function(index){
				let defaultImg='http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//tar-nursing4.jpg'
				_self.imgArr[index].idCard=defaultImg//显示图片
				_self.$store.state.saveArr_s3[index].imgUrl=defaultImg//传递数据
				_self.imgArr[index].idCard_del=false
		},
		nextStepBack2:function(){
			uni.navigateBack({
				url:'step2'
			})
		},
		async submitConfirm(){
			uni.navigateBack({
				url:'trueme'
			})		
		},
		bindDateChange: function(e) {
            this.dateInit = e.target.value
        },
		bindDateChange1: function(e) {
		    this.dateEnd = e.target.value
		},
	},
}
</script>
<style>
.lineSpace{align-items: center!important;}	
.width280{width:280rpx!important;text-align: center;}
view{font-size:28upx;}
.grace-idcard-main{margin:0;}
.grace-idcard-desc{line-height:2em; background:#FFFFFF; padding:20upx; border-radius:10upx;}
.grace-idcard-text{line-height:2em;}
.grace-idcard-items{background:#FFFFFF; padding:30upx 0; display:flex; margin:30upx 0; border-radius:10upx; align-items: flex-start;}
.grace-idcard-uper-btn{width:276upx; margin:0 60upx; background:#F1F1F1; padding-bottom:10upx; border-radius:10upx; text-align:center;}
.grace-idcard-uper-btn .img{width:100upx; height:100upx; margin:0 auto; margin-top:30upx;}
.grace-idcard-uper-btn .img image{width:100upx; height:100upx;}
.grace-idcard-uper-btn .text{width:100%; margin-top:10upx; text-align:center; line-height:2em;}
.grace-idcard-preview{width:50%; margin:0 30upx;}
.grace-idcard-preview image{width:100%;}
.line-height72{line-height: 72upx;}
</style>