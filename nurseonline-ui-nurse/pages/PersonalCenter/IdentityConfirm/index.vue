<template>
	<view>
		<view class="grace-idcard-main">
			<view class="scroll-top">
				<time-filter :type="month"></time-filter>
			</view>
			<view class="wraperView"><!-- wraper开始 --> 
				<view class="grace-idcard-text">
					<view class="left-icon">上传证件照</view>
				</view>
				
				<view v-for="(item,index) in imgArr" :key='index' class="border-dash margin-20 boder-radius10">
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
				</view>
				
				<view class="grace-idcard-text grace-idcard-alc">
					#您必选上传一张手持身份证照用来确认您的身份
				</view>
				
				<view style="margin-top:38upx;padding-bottom: 18px;">
					<button type="primary color6d8bf9" @tap="nextStepto3">下一步</button>
				</view>
				
				<!-- <view style="padding-bottom: 18px;">
					<button type="primary color6d8bf9" class="see-btn-step" @tap="nextStepBack1">上一步</button>
				</view> -->
			</view><!-- wraper结束 -->
			
		</view>
	</view>
</template>
<script>
import timeFilter from '../../../components/stepline/stepline.vue'
import { validatenull } from '@/static/js/utils'

var _self;
var myBaseUrl;
var devUrl;
var res_info;
var fileUrl;
let confirmRuleLenght;
export default {
	components: {
	  timeFilter,
	},
	data() {
		return {
			access_token:"",
			imgArr:[],//资质校验数组 数据初始
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
			continueBol: true,
		};
	},
	onLoad:function(){
		_self = this;
		this.$store.state.stepCurrent=0;
		this.$store.state.saveArr_s3 = []
		this.$store.state.scanUserInfo = {}
		this.init();
	},
	methods: {
		async init(){
			//1.获取access_token、Info、myBaseUrl
			uni.showLoading({})
			this.access_token= uni.getStorageSync('access_token');//缓存图片所需
			res_info =await this.$apip.getPersonalInfo();
			if(res_info){
				this.saveArr.staffId=res_info.data.data.staffId
				this.saveArr.versionNo=res_info.data.data.versionNo
			}
			myBaseUrl=this.$store.state.myBaseUrl
			devUrl=	this.$store.state.devUrl
			fileUrl=this.$store.state.fileUrl
			
			//2.获取staff targetType 根据type得到不同的审核内容 	//测试  当前(4.16)只维护了staffType=1-护士
			let confirmRule=await this.$api.confirmRule(1);
			console.log("confirmRule",confirmRule.data.data)//验证内容
			let beforeSorNo=0;
			confirmRuleLenght=confirmRule.data.data.length
			confirmRule.data.data.forEach((item,index)=>{
				if(item.groupCode=='idCard'){
					let idcard_default;
					switch(item.sortNo){
						case 1:
						idcard_default='http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard1.png'
						break;
						case 2:
						idcard_default='http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard2.png'
						break;
						case 3:
						idcard_default='http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard3.jpg'
						break;
					}
					if(item.sortNo>beforeSorNo){
						this.imgArr.push({
							idCard: idcard_default,
							label:item.certTag,
							certTag:item.certTag,//后加20190825
							idCard_del:false,
							certType:item.certType,
							sortNo:item.sortNo,
							ruleId:item.ruleId
						})
					}else{
						this.imgArr.unshift({
							idCard: idcard_default,
							label:item.certTag,
							certTag:item.certTag,//后加20190825
							idCard_del:false,
							certType:item.certType,
							sortNo:item.sortNo,
							ruleId:item.ruleId
						})
					}
					let arr = []
					arr=JSON.parse(JSON.stringify(this.tempImgArrObj))//提交数据
					arr.certType=item.certType
					arr.ruleId=item.ruleId //唯一标识
					arr.certTypeName=item.certName
					arr.certTag=item.certTag //将step2和step3数组saveArr_s2，saveArr_s3合并成saveArr_s3 190723
					arr.groupCode=item.groupCode
					this.$store.state.saveArr_s3.push(arr)
				}
				// this.$store.state.saveArr_s3[index]=JSON.parse(JSON.stringify(this.tempImgArrObj))//提交数据
				// this.$store.state.saveArr_s3[index].certType=item.certType
				// this.$store.state.saveArr_s3[index].ruleId=item.ruleId //唯一标识
				// this.$store.state.saveArr_s3[index].certTypeName=item.certName
				// this.$store.state.saveArr_s3[index].certTag=item.certTag //将step2和step3数组saveArr_s2，saveArr_s3合并成saveArr_s3 190723
				// this.$store.state.saveArr_s3[index].groupCode=item.groupCode
			})
			//3. 0424：当前页面：身份证正面、身份证反面、手持身份证照(必填) 0708：身份证相关图是必填，所以对于不同身份无差异
			this.initImgUrl()

			uni.hideLoading()
		},
		initImgUrl(){//初始化显示图片
			// console.log("res_info.data.data.staffCerts",res_info.data.data.staffCerts)
			// console.log("this.imgArr",this.imgArr)
			let reciveInfo=res_info.data.data;
			this.imgArr.forEach((item,index)=>{//this.imgArr 校验数据初始数组,按照此页面index数组顺序
				reciveInfo.staffCerts.forEach((itemChild,indexChild)=>{
					if(item.certType==itemChild.certType&&item.certTag==itemChild.certTag){
						console.log('test')
						item.idCard=itemChild.imgUrl
						item.idCard_del=true
					}
				})
			})
			
			this.$store.state.saveArr_s3.forEach((item,index)=>{//this.$store.state.saveArr_s3 校验数据提交数组，按照ruleId匹配
				if(item.groupCode=='idCard'){//身份证的资质照片
					reciveInfo.staffCerts.forEach((itemChild,indexChild)=>{
						if(item.certType==itemChild.certType&&item.certTag==itemChild.certTag){
							item.imgUrl=itemChild.imgUrl
							item.staffCertId=itemChild.staffCertId
						}
					})
				}		
			})
		},
		selectImg: function(index) {
			if (index == 0) {
				_self.selectIdCardImg(index)
				return false
			}
			uni.chooseImage({
				count:1,
				success:function(res){
					_self.imgArr[index].idCard=res.tempFilePaths[0];
					console.log("res.tempFilePaths[0]",res.tempFilePaths[0])
					_self.imgArr[index].idCard_del=true;
					uni.showLoading({title:"图片缓存中",mask:true});

					if (index == 0) {
						uni.uploadFile({
							url: myBaseUrl + devUrl + '/oms/verify/idcard',
							header:{"Authorization":"Bearer " + _self.access_token,"Content-Type":"multipart/form-data"},
							filePath: _self.imgArr[index].idCard,
							fileType: 'image',
							name: 'idcard',
							success: function (uploadFileRes) {
								if (uploadFileRes.data) {
									_self.$store.state.scanUserInfo = JSON.parse(uploadFileRes.data).data
								}
							},
						});
					}
					

					var uploadTask1 = uni.uploadFile({
						url:myBaseUrl+devUrl+'/scs/authentication/upload',
						header:{"Authorization":"Bearer " + _self.access_token,"Content-Type":"multipart/form-data"},
						filePath: _self.imgArr[index].idCard,
						fileType: 'image',
						name: 'file',
						success: function (uploadFileRes) {
							// 上传成功后返回服务器端保存的路径
							_self.$store.state.saveArr_s3.forEach((item_c,index_c)=>{
								if(item_c.certType==_self.imgArr[index].certType&&item_c.certTag==_self.imgArr[index].certTag){
									item_c.imgUrl=JSON.parse(uploadFileRes.data).data
									console.log("item_citem_c",item_c)
								}
							})
							console.log("_self.$store.state.saveArr_s3上传完图片",_self.$store.state.saveArr_s3)
							uni.hideLoading();
						},
					});

					// uni.uploadFile({
					// 	url:myBaseUrl+devUrl+'/scs/authentication/upload',
					// 	header:{"Authorization":"Bearer " + _self.access_token,"Content-Type":"multipart/form-data"},
					// 	filePath: _self.imgArr[index].idCard,
					// 	fileType: 'image',
					// 	name: 'file',
					// 	success: function (uploadFileRes) {
					// 		// 上传成功后返回服务器端保存的路径
					// 		_self.$store.state.saveArr_s3.forEach((item_c,index_c)=>{
					// 			if(item_c.certType==_self.imgArr[index].certType&&item_c.certTag==_self.imgArr[index].certTag){
					// 				item_c.imgUrl=JSON.parse(uploadFileRes.data).data
					// 				console.log("item_citem_c",item_c)
					// 			}
					// 		})
					// 		console.log("_self.$store.state.saveArr_s3上传完图片",_self.$store.state.saveArr_s3)
					// 		uni.hideLoading();
					// 	},
					// });
					
				}
			})
		},
		async selectIdCardImg(index) {
			let [ err,res ] = await uni.chooseImage({ count: 1 })
            if(!validatenull(res) && res.errMsg === 'chooseImage:ok'){
				_self.imgArr[index].idCard=res.tempFilePaths[0];
				_self.imgArr[index].idCard_del=true;
				uni.showLoading({title:"图片缓存中",mask:true});

				let [ error, imgData ] = await uni.uploadFile({
					url:myBaseUrl+devUrl+'/scs/authentication/upload',
					header:{"Authorization":"Bearer " + _self.access_token,"Content-Type":"multipart/form-data"},
					filePath: _self.imgArr[index].idCard,
					fileType: 'image',
					name: 'file',
				})

				_self.$store.state.saveArr_s3.forEach((item_c,index_c)=>{
					if(item_c.certType==_self.imgArr[index].certType&&item_c.certTag==_self.imgArr[index].certTag){
						item_c.imgUrl=JSON.parse(imgData.data).data
					}
				})

				uni.uploadFile({
					url: myBaseUrl + devUrl + '/oms/verify/idcard',
					header:{"Authorization":"Bearer " + _self.access_token,"Content-Type":"multipart/form-data"},
					filePath: _self.imgArr[index].idCard,
					fileType: 'image',
					name: 'idcard',
					success: function (uploadFileRes) {
						uni.hideLoading()
						let resData = JSON.parse(uploadFileRes.data)
						if (resData.data) {
							_self.$store.state.scanUserInfo = resData.data
							_self.continueBol = true
						} else {
							uni.showToast({title:"无法识别该照片", icon:"none"})
							_self.continueBol = false
						}
					},
				})
			}
		},
		previewImg: function(index){
			uni.previewImage({
				urls:[_self.imgArr[index].idCard]
			});
		},
		delImg : function(index){
			if(index==0){
				_self.imgArr[0].idCard='http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard1.png'
				_self.imgArr[0].idCard_del=false
			}else if(index==1){
				_self.imgArr[1].idCard='http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard2.png'
				_self.imgArr[1].idCard_del=false
			}else if(index==2){
				_self.imgArr[2].idCard='http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard3.jpg'
				_self.imgArr[2].idCard_del=false
			}
		},
		async nextStepto3(){
			if(_self.imgArr[0].idCard == 'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard1.png' || _self.imgArr[1].idCard == 'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard2.png'||_self.imgArr[2].idCard== 'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard3.jpg'){
				uni.showToast({title:"请选择对应照片", icon:"none"});
				return;
			}

			if (!this.continueBol) {
                uni.showToast({title:"请上传正确的身份证照片", icon:"none"});
                return false
            }

			console.log("this.$store.state.saveArr_s3提交页面2图片",_self.$store.state.saveArr_s3)
			uni.navigateTo({//跳转到step2，本页不做保存请求
				url:'step2'
			})
		},
		nextStepBack1:function(){
			uni.navigateBack({
				url:'index'
			})
		}
	},
}
</script>
<style>
view{font-size:28upx;}
.grace-idcard-main{margin:0;}
.grace-idcard-desc{line-height:2em; background:#FFFFFF; padding:20upx; border-radius:10upx;}
.grace-idcard-text{line-height:2em; margin-top:10upx;}
.grace-idcard-items{background:#FFFFFF;display:flex; margin:30upx 0; border-radius:10upx; align-items: flex-start;}
.grace-idcard-uper-btn{width:276upx; margin:0 60upx; background:#F1F1F1; padding-bottom:10upx; border-radius:10upx; text-align:center;}
.grace-idcard-uper-btn .img{width:100upx; height:100upx; margin:0 auto; margin-top:30upx;}
.grace-idcard-uper-btn .img image{width:100upx; height:100upx;}
.grace-idcard-uper-btn .text{width:100%; margin-top:4upx; text-align:center; line-height:1.5em;}
.grace-idcard-preview{width:50%; margin:0 30upx;}
.grace-idcard-preview image{width:100%;}
</style>