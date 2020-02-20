<template>
	<view>
		<view class="grace-idcard-main">
			<view class="scroll-top" >
				<time-filter :type="month"></time-filter>
			</view>
			<view class="width100p text-alignC bgc-fff pt20 color666" v-if='mention.length>0'>{{mention}}</view>
			<view class="wraperView"><!-- wraper开始 --> 
				<view v-for="(item,index) in imgArr" :key='index' >
					<view v-if="index==0" class="left-icon ">上传证件照</view>
					<view v-if="index==1" class="left-icon mt40">您的执业如有延期注册或变更注册，请补充相关照片</view>
					<view class="border-dash margin-20 boder-radius10">
						<view class="grace-idcard-text grace-idcard-alc color666">
							{{item.label}}
						</view>
						<view class="grace-idcard-items">
							<view class="grace-idcard-uper-btn" @tap="selectImg(index)">
								<view class="img"><text class='iconfont font-size80'>&#xe602;</text></view>
								<view class="text">拍摄或选择照片</view>
							</view>
							<view class="grace-idcard-preview positionR">
								<image :src="item.idCard"  @tap="previewImg(index)" mode="widthFix"></image>
								<view v-if="item.idCard_del" class="iconfont font-size50 positionA t0 r0 color6e8cfa" @tap="delImg(index)">&#xe626;</view>
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
				</view>
					
				<view style="margin-top:38upx;">
					<button type="primary color6d8bf9" @tap="submitConfirm">提交</button>
				</view>
				<view style="margin-top:38upx;padding-bottom: 18px;">
					<button type="primary color6d8bf9" class="see-btn-step" @tap="nextStepBack2">上一步</button>
				</view>
			</view><!-- wraper结束 -->
		</view>
	</view>
</template>
<script>
import timeFilter from '../../../components/stepline/stepline.vue'
var _self;
var myBaseUrl;
var devUrl;
var reciveInfo;
var fileUrl;
let confirmRuleLenght;
export default {
	components: {
	  timeFilter,
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
			mention:'',
			confirmRule: [],
			reciveInfo: [],
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
			this.reciveInfo = reciveInfo

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
			this.confirmRule = confirmRule.data.data
			confirmRuleLenght=confirmRule.data.data.length
			let beforeSorNo=0;
			this.imgArr=[];
			if(confirmRule.data.data.length<1){
				return;
			}
			
			let imgInfoArr = []
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
							idCard: 'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//yjhrz1.jpg',
							label:item.certTag,
							certTag:item.certTag,//后加20190825
							idCard_del:false,
							certType:item.certType,
							option:option,
							showOption:showOption,
							sortNo:item.sortNo,
							ruleId:item.ruleId
						})
					}else{
						this.imgArr.unshift({
							idCard: 'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//yjhrz1.jpg',
							label:item.certTag,
							certTag:item.certTag,//后加20190825
							idCard_del:false,
							certType:item.certType,
							option:option,
							showOption:showOption,
							sortNo:item.sortNo,
							ruleId:item.ruleId
						})
					}
					console.log(this.imgArr)
					
					let saveObj = {}
					saveObj = JSON.parse(JSON.stringify(this.tempImgArrObj))//提交数据
					saveObj.certType = item.certType
					saveObj.ruleId = item.ruleId //唯一标识
					saveObj.certTypeName = item.certName
					saveObj.certTag = item.certTag //将step2和step3数组saveArr_s2，saveArr_s3合并成saveArr_s3 190723
					saveObj.groupCode = item.groupCode
					imgInfoArr.push(saveObj)
				}
				beforeSorNo=item.sortNo
			})

			// if (this.$store.state.saveArr_s3.length != confirmRuleLenght) {
			// 	for(var i = imgInfoArr.length - 1; i > 0; i--) {
			// 		this.$store.state.saveArr_s3.unshift(imgInfoArr[i])
			// 	}
			// }
			
			this.initElement()
			console.log('this.$store.state.saveArr_s3', this.$store.state.saveArr_s3)
		},
		//渲染数据
		initElement(){
			if(this.imgArr.length<1){//this.imgArr=[]
				this.mention='该职业身份无需相关资质审核的要求,请直接提交吧!'
				return;
			}
			this.imgArr.forEach((item,index)=>{//this.imgArr 校验数据初始数组,按照此页面index数组顺序
				reciveInfo.staffCerts.forEach((itemChild,indexChild)=>{
					if(item.certType==itemChild.certType&&item.certTag==itemChild.certTag){
						item.idCard=itemChild.imgUrl
						item.idCard_del=true
					}
				})
			})
			this.$store.state.saveArr_s3.forEach((item,index)=>{//this.$store.state.saveArr_s3 校验数据提交数组，按照ruleId匹配
				if(item.groupCode!='idCard'){//非身份证的资质照片
					reciveInfo.staffCerts.forEach((itemChild,indexChild)=>{
						if(item.certType==itemChild.certType&&item.certTag==itemChild.certTag){
							item.imgUrl=itemChild.imgUrl
							item.staffCertId=itemChild.staffCertId
						}
					})
				}		
			})
				//资质编号、起止时间
				this.actOccuVal=reciveInfo.staffCerts[0].certNo
				this.dateInit=reciveInfo.staffCerts[0].fromDate
				this.dateEnd=reciveInfo.staffCerts[0].validDate
			// }
		},
		selectImg : function(index) {//选择图片
			uni.chooseImage({
				count:1,
				success:function(res){
					_self.imgArr[index].idCard= res.tempFilePaths[0];
					console.log("res.tempFilePaths[0]",res.tempFilePaths[0])
					_self.imgArr[index].idCard_del=true;
					uni.showLoading({title:"图片缓存中",mask:true});

					if (_self.$store.state.staffType === 1 && index === 0) {
						_self.identifyContent(_self.imgArr[index].idCard)
					}

					var uploadTask2 = uni.uploadFile({
						url:myBaseUrl+devUrl+'/scs/authentication/upload',
						header:{"Authorization":"Bearer " + _self.access_token},
						filePath: _self.imgArr[index].idCard,
						fileType: 'image',
						name: 'file',
						success: function (uploadFileRes) {
							_self.imgArr[index].idCard = JSON.parse(uploadFileRes.data).data
							_self.$store.state.saveArr_s3.forEach((item_c,index_c)=>{
								if(item_c.certType==_self.imgArr[index].certType&&item_c.certTag==_self.imgArr[index].certTag){
									item_c.imgUrl=JSON.parse(uploadFileRes.data).data
								}
							})
							uni.hideLoading();
						}
					 });
				}
			})
		},
		identifyContent(path) {
			uni.uploadFile({
				url: myBaseUrl + devUrl + '/oms/verify/license',
				header:{"Authorization":"Bearer " + this.access_token,"Content-Type":"multipart/form-data"},
				filePath: path,
				fileType: 'image',
				name: 'license',
				success: (uploadFileRes) => {
					let resData = JSON.parse(uploadFileRes.data).data
					let scanUserInfo = this.$store.state.scanUserInfo
					if (resData.idNumber == scanUserInfo.idNumber || resData.idNumber == scanUserInfo.idCradNo) {
						this.actOccuVal = resData.licenseId
					}
				}
			});
		},
		previewImg : function(index){
			uni.previewImage({
				urls:[_self.imgArr[index].idCard]
			});
		},
		delImg : function(index){
				let defaultImg='http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//yjhrz1.jpg'
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
			
			if(this.imgArr[0]&&this.imgArr[0].idCard == 'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//yjhrz1.jpg'){
				uni.showToast({title:"请选择对应照片", icon:"none"});
				return;
			}
			uni.showLoading({title:"上传中"});
			let imgInfoArr = []
			this.confirmRule.forEach((item,index)=>{
				if(item.groupCode!='idCard'){//非身份证的资质照片都放在这个页面 20190717
					
					let saveObj = {}
					saveObj = JSON.parse(JSON.stringify(this.tempImgArrObj))//提交数据
					saveObj.certType = item.certType
					saveObj.ruleId = item.ruleId //唯一标识
					saveObj.certTypeName = item.certName
					saveObj.certTag = item.certTag //将step2和step3数组saveArr_s2，saveArr_s3合并成saveArr_s3 190723
					saveObj.groupCode = item.groupCode
					imgInfoArr.push(saveObj)
				}
			})
			if (this.$store.state.saveArr_s3.length != this.confirmRule.length) {
				for(var i = imgInfoArr.length - 1; i >= 0; i--) {
					this.$store.state.saveArr_s3.unshift(imgInfoArr[i])
				}
			}

			this.$store.state.saveArr_s3.forEach((item,index)=>{//this.$store.state.saveArr_s3 校验数据提交数组，按照ruleId匹配
				if(item.groupCode!='idCard'){//非身份证的资质照片
					this.imgArr.forEach((itemChild,indexChild)=>{
						if(item.certType==itemChild.certType&&item.certTag==itemChild.certTag){
							item.imgUrl=itemChild.idCard
							// item.staffCertId=itemChild.staffCertId
						}
					})
				}
			})
			
			this.$store.state.saveArr_s3[0].fromDate=this.dateInit
			this.$store.state.saveArr_s3[0].validDate=this.dateEnd
			this.$store.state.saveArr_s3[0].certNo=this.actOccuVal
			console.log(this.actOccuVal)
			
			console.log("this.$store.state.saveArr_s3",this.$store.state.saveArr_s3)
			let staffCertsNoCheck=[]
			let staffCerts=[]
			staffCertsNoCheck=this.$store.state.saveArr_s3
			staffCertsNoCheck.forEach((item,index)=>{//把删除的图片从数组移除
				if(item.imgUrl!='http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//yjhrz1.jpg'&&item.imgUrl!=''){
					staffCerts.push(item)
				}
			})
			console.log("资质图片数组",staffCerts)
			//提交保存
			let submitArr={}
			submitArr=this.$store.state.saveArr_s1
			submitArr.staffCerts=staffCerts
			console.log("提交数据",submitArr)
			let res= await this.$api.confirmStep3(submitArr);//提交
			uni.hideLoading()
			
			
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
view{font-size:28upx;}
.grace-idcard-main{margin:0;}
.grace-idcard-desc{line-height:2em; background:#FFFFFF; padding:20upx; border-radius:10upx;}
.grace-idcard-text{line-height:2em;}
.grace-idcard-items{background:#FFFFFF; display:flex; margin:30upx 0; border-radius:10upx; align-items: flex-start;}
.grace-idcard-uper-btn{width:276upx; margin:0 60upx; background:#F1F1F1; padding-bottom:10upx; border-radius:10upx; text-align:center;}
.grace-idcard-uper-btn .img{width:100upx; height:100upx; margin:0 auto; margin-top:30upx;}
.grace-idcard-uper-btn .img image{width:100upx; height:100upx;}
.grace-idcard-uper-btn .text{width:100%; margin-top:10upx; text-align:center; line-height:2em;}
.grace-idcard-preview{width:50%; margin:0 30upx;}
.grace-idcard-preview image{width:100%;}
.line-height72{line-height: 72upx;}
</style>