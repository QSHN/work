<template>
	<view style="background:#fff;">
		<view class="grace-idcard-alc color6e8cfa bgc-fff border-bottom-8 padding-10-0">
			#请上传一张目的地图片，用于有危险时及时找到你！
		</view>
		
		<view class="grace-idcard-main uni-padding-wrap uni-common-mt">
			
			<view class="wraperView"><!-- wraper开始 -->
			<view class="uni-title uni-common-pl padding"><view class="left-icon">目的地图片</view></view>
			
			<view class="grace-idcard-items border-dash">
				<view class="grace-idcard-uper-btn" @tap="selectImg2">
					<view class="img"><text class='iconfont font-size80'>&#xe602;</text></view>
					<view class="text">拍摄或选择照片</view>
				</view>
				<view class="grace-idcard-preview">
					<image :src="imgSrc"  @tap="previewImg2" mode="widthFix" />
				</view>
			</view>
			<view class="grace-idcard-text grace-idcard-alc color666">
				如果您已到达目的地，请上传一张目的地图片。
			</view>
			<view style="margin-top:38upx;padding-bottom: 18px;">
				<button type="primary color6d8bf9" @tap="toBeginJudge">确认上传</button>
			</view>
			
			</view><!-- wraper结束 -->
		</view>
	</view>
</template>

<script>
	import amap from '@/static/common/map/amap-wx.js'
	var _self
	var myBaseUrl
	var devUrl
	export default {
        components: {
          
        },
		data() {
            return {
              type: 'month',
			  InputList:[
				  {name:"收货人",
				   placeholder:"请输入收货人",
				   value:""
				  },
				  {name:"收货城市",
				   placeholder:"请输入收货城市",
				   value:""
				  },
				  {name:"详细地址",
				   placeholder:"请输入详细地址",
				   value:""
				  },
				  {name:"联系电话",
				   placeholder:"请输入联系电话",
				   value:""
				  },
			  ],
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
				},
			tempImg:'',
			staffId:"",
			taskId:'',
			imgSrc:'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//yjh_rz4.jpg',
			amapPlugin: null,   
			key: '9e47e3566d3ae729652171562dabe658',
			latitude:'',//维度
			longitude:'',//经度
			address:'',//当前地址,
            }
		},
		onLoad(options) {
			_self=this
			this.$store.state.stepCurrent=0
			this.init(options.staffId,options.taskId)
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
			async init(staffId,taskId){
				this.staffId=staffId
				this.taskId=taskId
				uni.showLoading({})
				this.access_token= uni.getStorageSync('access_token');//缓存图片所需
				// res_info =await this.$apip.getPersonalInfo();
				myBaseUrl=this.$store.state.myBaseUrl
				devUrl=	this.$store.state.devUrl
				uni.hideLoading()
			},
			IndexChange: function(itemIndex,e) {
				console.log('picker select数组为',itemIndex,'携带值为',e.target.value)
				console.log(e)
				this.SelectArr[itemIndex].initIndex = e.target.value
			},
			bindTextAreaBlur: function (e) {
            console.log(e.detail.value)
			},
			selectImg2 : function() {
				uni.chooseImage({
					count:1,
					success:function(res){
						_self.imgSrc = res.tempFilePaths[0];
						//因底层限制一次上传一个
						uni.showLoading({title:"图片缓存中"});
						// 上传背面
						var uploadTask2 = uni.uploadFile({
							url:myBaseUrl+devUrl+'/scs/authentication/upload',
							header:{"Authorization":"Bearer " + _self.access_token},
							filePath: _self.imgSrc,
							fileType: 'image',
							name: 'file',
							success: function (uploadFileRes) {
								// 上传成功后返回服务器端保存的路径
								console.log("JSON.parse(uploadFileRes.data).data",JSON.parse(uploadFileRes.data).data)
								_self.tempImg=JSON.parse(uploadFileRes.data).data
								// 至此2张照片上传完毕
								uni.hideLoading();
							}
						 });
					}
				})
			},
			async toBeginJudge(){
				//
				if(this.imgSrc=='http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//yjh_rz4.jpg'){
					uni.showToast({
						title: '请上传图片',
						icon:'none'
					});
					return false
				}
				let staffId=this.staffId
				let taskId=this.taskId
				let actionId=7//服务人员已到达
				let position=this.longitude+","+this.latitude
				//let imgUrl=
				
				// this.tempImg.substring(this.tempImg.indexOf('?'),this.tempImg)
				
				let imgUrl=this.tempImg.split("?")[0]//上传图片路径太长，先传个空
				
				let res_goOut=await this.$apio.startServe(staffId,taskId,actionId,position,imgUrl)
				this.$store.state.orderRefresh++;//刷新order状态 
				
				if(this.$store.state.toArrived_from==0){
					console.log('返回预约单详情页')
					uni.navigateBack({
						delta: 1//返回预约详情页
					})
				}else if(this.$store.state.toArrived_from==1){
					console.log('返回预约单列表页')
					uni.switchTab({
						url:'../../pages/Order/index'
					})
				}
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
		padding:25upx 40upx;
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
