<template>
	<view style="background:#fff;">
		<view v-if='ReadRecOnly'class="grace-idcard-alL color6e8cfa bgc-fff border-bottom-8 padding-10-0 pl45">
			#当前页只可查看，不可修改
		</view>
		<view class="grace-idcard-main uni-padding-wrap uni-common-mt">
			
			<view class="wraperView"><!-- wraper开始 -->
			
			<!-- textarea -->
			<view>
				<view class="uni-textarea">
					</view>
					<view class="uni-title uni-common-pl padding"><view class="left-icon">使用材料</view></view>
					<view class="uni-textarea padding pt0-im pb0-im">
						<textarea :disabled="ReadRecOnly" placeholder-style="color:rgb(188,188,188)" class="color666" v-model="saveArr.consumables" placeholder="请填写使用材料"/>
					</view>
			</view>
			
			<view>
				<view class="uni-textarea">
					</view>
					<view class="uni-title uni-common-pl padding"><view class="left-icon">描述</view></view>
					<view class="uni-textarea padding pt0-im pb0-im">
						<textarea :disabled="ReadRecOnly" placeholder-style="color:rgb(188,188,188)" class="color666" v-model="saveArr.finished_record" placeholder="请填写描述"/>
					</view>
			</view>
			
			<view class="uni-title uni-common-pl padding"><view class="left-icon">图片</view></view>
			
			<view class="uni-flex uni-row" v-if='!ReadRecOnly'>
				<view class="grace-idcard-text grace-idcard-alc color666 font-size24">
					请上传服务相关图片。（支持多选,至少上传一张。最多上传6张）
				</view>
				<view class="grace-idcard-uper-btn" @tap="selectImg2">
					<view class="img"><text class='iconfont font-size80'>&#xe602;</text></view>
				</view>
			</view>
			
			<view class="border-dash uni-flex uni-row mt20" v-if='selectPic'>
				<view v-for="(item,index) in picCount" v-if="index<=2" :key='index' class="pic-multi">
					<view class="pic">
						<image :src="idCard[index]" @tap="previewImg2(index)"  mode="widthFix" />
					</view>	
				</view>

			</view>
			<view class="grace-idcard-items border-dash" v-if="picCount>3">
				<view v-for="(item,index) in picCount" v-if="index>2" :key='index' class="pic-multi uni-flex uni-row">
					<view  class="uni-item pic">
						<image :src="idCard[index]" @tap="previewImg2(index)"  mode="widthFix" />
					</view>	
				</view>
			</view>
			
			<!-- 图片陈列显示 -->
			<view v-if="ReadRecOnly">
				<view v-if="receiveImgs.length<1||receiveImgs==''" class="width100p text-alignC">
					<text class="width100p text-alignC">当前暂无图片</text>
				</view>
				<view v-else>
					<view class="grace-idcard-items border-dash" >
						<view v-for="(itemImg,index) in receiveImgs" :key='index' v-if="index<=2">
							<view  class="uni-item pic uni-flex uni-row">
								<image class="ml20 mr20" :src="itemImg" @tap="previewImg_r(index)"  mode="widthFix" />
							</view>	
						</view>
					</view>
					<view class="grace-idcard-items border-dash" v-if="receiveImgs.length>3">
						<view v-for="(itemImg,index) in receiveImgs" :key='index' v-if="index>2">
							<view  class="uni-item pic uni-flex uni-row">
								<image class="ml20 mr20" :src="itemImg" @tap="previewImg_r(index)"  mode="widthFix" />
							</view>	
						</view>
					</view>
				</view>	
				
			</view>
			
			<view style="margin-top:38upx;padding-bottom: 18px;">
				<button v-if='!ReadRecOnly' type="primary color6d8bf9" @tap="toHomePage">确认服务完成</button>
				<button v-else type="primary color6d8bf9" @tap="backToDetail">返回预约详情</button>	
			</view>
			
			</view><!-- wraper结束 -->
		</view>
	</view>
</template>

<script>
	import amap from '@/static/common/map/amap-wx.js'
	var _self;
	var res_info;
	var myBaseUrl;
	var devUrl;
	export default {
        components: {
        },
		data() {
            return {
			text1:"伤口换药护理包(大)",
				text2:"患者伤口红肿消退,无渗液,无感染迹象",
              type: 'month',
			  InputList:[
				  {name:"姓名",
				   placeholder:"请输入用户名",
				   value:""
				  },
				  {name:"身份证",
				   placeholder:"请输入身份证号",
				   value:""
				  },
			  ],
			title: 'picker',
			initNextPage:true,
			saveArr:{
				staffId:'',
				versionNo:'',
				finished_record:"",
				consumables:"",
				imgUrl:[
				]
				},
			idCard:[
				'../../static/img/addr/idcard3.jpg',
				'../../static/img/addr/idcard3.jpg',
				'../../static/img/addr/idcard3.jpg',
				'../../static/img/addr/idcard3.jpg',
				'../../static/img/addr/idcard3.jpg',
				'../../static/img/addr/idcard3.jpg',
			],
			picCount:1,
			selectPic:false,
			LoadArr:[],//图片缓存完成的数组集合
			ReadRecOnly:false,
			receiveImgs:[]
            }
			
			
		},
		onLoad(options) {
			this.$store.state.stepCurrent=0
			_self=this
			this.init(options.taskId)
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
			async init(taskId){
				this.ReadRecOnly=this.$store.state.ReadRecOnly
				let res=this.$store.state.rec
				if(this.ReadRecOnly){//只读
					console.log('当前只读')
					this.saveArr.consumables=res.consumables
					this.saveArr.finished_record=res.finishedRecord
					this.receiveImgs=res.imgUrl.split(';')
					console.log("this.receiveImgs",this.receiveImgs)
					return false
				}
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
				//获取recId
				let res_getNurseRec=await this.$apio.getNurseRec_single(taskId)
				this.$store.state.recId=res_getNurseRec.data.data.recId
				uni.hideLoading()
			},
			selectImg2 : function(index) {
				uni.chooseImage({
					count:6,
					success:function(res){
					
						_self.saveArr.imgUrl=[]	//初始化imgUrl
						_self.picCount=res.tempFilePaths.length
						if(_self.picCount>6){
							uni.showToast({
								title:'所选图片不能超过6张',
								icon:'none'
							})
							return false;
						}
						_self.idCard=res.tempFilePaths
						_self.selectPic=true//显示图片
						console.log('res.tempFilePaths',res.tempFilePaths)
						
						_self.LoadArr=[];
						_self.saveArr.imgUrl=[];
							for(let i=0;i<_self.picCount;i++){
									uni.showLoading({title:"图片"+(i+1)+"缓存中"});
									var uploadTask2 = uni.uploadFile({
										url:myBaseUrl+devUrl+'/scs/authentication/upload',
										header:{"Authorization":"Bearer " + _self.access_token},
										filePath: _self.idCard[i],
										fileType: 'image',
										name: 'file',
										success: function (uploadFileRes) {
											_self.saveArr.imgUrl[i]=JSON.parse(uploadFileRes.data).data
											console.log('加载成功'+i)
											_self.LoadArr.push(i)
											if(_self.LoadArr.length==_self.picCount){
												uni.hideLoading()
											}
										}
									 });
								}	 
						
						console.log("_self.saveArr.imgUrl",_self.saveArr.imgUrl)
					}
				})
			},
			previewImg2 : function(index){
				uni.previewImage({
					urls:[_self.idCard[index]]
				});
			},
			previewImg_r : function(index){
				uni.previewImage({
					urls:[_self.receiveImgs[index]]
				});
			},
			async toHomePage(){	
				if(this.saveArr.consumables.length<1){
					uni.showToast({
						title:'请填写使用材料',
						icon:'none'
					})
					return false
				}
				if(this.saveArr.finished_record.length<1){
					uni.showToast({
						title:'请填写描述',
						icon:'none'
					})
					return false
				}
				if(this.saveArr.imgUrl.length<1){
					uni.showToast({
						title:'请添加图片',
						icon:'none'
					})
					return false
				}
				console.log("this.saveArr",this.saveArr)
				uni.showLoading({})
				let data={recId:'',finishedRecord:'',consumables:'',imgUrl:''}
				data.recId=this.$store.state.recId
				data.finishedRecord=this.saveArr.finished_record
				data.consumables=this.saveArr.consumables
				data.imgUrl=this.saveArr.imgUrl.join(';')
				console.log("this.saveArr.imgUrl",this.saveArr.imgUrl)
				console.log("data.imgUrl",data.imgUrl)
				let str='submit='+true+'&position='+this.longitude+','+this.latitude//submit挂在url上
				
				let res_data=await this.$apio.goNurseRec(data,str)
				uni.hideLoading()
				this.$store.state.orderRefresh++;//刷新状态
				if(this.$store.state.uploadServeDone_from==0){
					console.log('返回预约单详情页')
					uni.navigateBack({
						delta: 1//返回预约详情页
					})
				}else if(this.$store.state.uploadServeDone_from==1){
					console.log('返回预约单列表页')
					uni.switchTab({
						url:'../../pages/Order/index'
					})
				}
				
			},
			backToDetail(){
				uni.navigateBack({
					delta:8
				})
			},
		}
	}
</script>

<style lang="scss">
	image{
		width: 200upx;
		height:200upx;
		max-width: 200upx!important;
		max-height:200upx!important;
	}
	.pic-multi{
		// min-width:50%
		padding: 20upx;
		.pic{
			
			
		}
	}
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
view{font-size:28upx;}
.grace-idcard-main{margin:0;}
.grace-idcard-desc{line-height:2em; background:#FFFFFF; padding:20upx; border-radius:10upx;}
.grace-idcard-text{line-height:2em; margin-top:30upx;}
.grace-idcard-items{background:#FFFFFF; padding:30upx 0; display:flex; margin:30upx 0; border-radius:10upx; align-items: flex-start;}
.grace-idcard-uper-btn{width:276upx; margin:0 60upx; background:#F1F1F1; padding-bottom:10upx; border-radius:10upx; text-align:center;}
.grace-idcard-uper-btn .img{width:100upx; height:100upx; margin:0 auto; margin-top:30upx;}
.grace-idcard-uper-btn .img image{width:100upx; height:100upx;}
.grace-idcard-uper-btn .text{width:100%; margin-top:10upx; text-align:center; line-height:2em;}
.grace-idcard-preview{width:50%; margin:0 30upx;}
.grace-idcard-preview image{width:100%;}
</style>