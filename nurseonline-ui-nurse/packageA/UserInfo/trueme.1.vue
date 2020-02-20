<template>
	<view>
		<view class="grace-idcard-main">
			<view class="color6e8cfa bgc-fff border-bottom-8 padding-10-0 pl45">
				#当前页只可查看，不可修改
			</view>
			<form @submit="formSubmit">
			 <view class="wraperView">	
				<view>
					<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(user,propIndex) in userInfo" :key="propIndex">
						<view>{{user.label}}</view>
						<view v-if="user.type === 'select'">
							<picker :range="user.column" @change="sexChange" :value="sexIdx">
								<view>{{user.column[sexIdx]}}</view>
							</picker>
						</view>
						<view v-else>
							<input disabled="true" class="uni-input tr" name="input" :value="user.value" :placeholder="user.placeholder" />
						</view>
					</view>
				</view>
			</view>	
			</form>
			
			<view class="wraperView"><!-- wraper开始 --> 

				<view class="grace-idcard-items border-dash uni-flex justify-content-space">
					<view class="ml20">身份证正面照</view>
					<view class="grace-idcard-preview">
						<image :src="idCard1"  @tap="previewImg1" mode="widthFix"></image>
					</view>
				</view>
			
				<view class="grace-idcard-items border-dash uni-flex justify-content-space">
					<view class="ml20">身份证反面照</view>
					<view class="grace-idcard-preview">
						<image :src="idCard2" @tap="previewImg2" mode="widthFix" />
					</view>
				</view>
				
				<view class="grace-idcard-items border-dash uni-flex justify-content-space">
					<view  class="ml20">手持身份证照</view>
					<view class="grace-idcard-preview">
						<image :src="idCard3" @tap="previewImg3" mode="widthFix" />
					</view>
				</view>

				<view style="margin-top:38upx;padding-bottom: 18px;">
					<button type="primary color6d8bf9" @tap="backToIndex">返回</button>
				</view>
			
			</view><!-- wraper结束 -->
			
		</view>
	</view>
</template>
<!-- 当前页不可编辑 -->	<!-- disabled="true" -->
<script>
var _self;
var reciveInfo;
var myBaseUrl;
var devUrl;
export default {
	components: {
	},
	data() {
		return {
			idCard1 : 'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard1.png',
			idCard2 : 'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard2.png',
			idCard3 : 'http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//idcard3.jpg',
			sexIdx: "",
			userInfo: [
				{
					label: '姓名',
					prop: 'nickname',
					type: 'text',
					value:"",
					placeholder: '请填写您的真实姓名'
				},
				
				{
					label: '身份证号',
					prop: 'username',
					type: 'text',
					value:'',
					placeholder: '请填写您的身份证号'
				},				
			],
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
				phone:Number
				}
		};
	},
	onLoad:function(){
		_self = this;
		this.$store.state.stepCurrent=1;
		this.init()
	},
	methods: {
		async init(){
			uni.showLoading({
				title:'加载中'
			})
			//初始化信息
			let getInfo = await this.$api.getInfo();
			reciveInfo=getInfo.data.data
			this.userInfo[0].value=reciveInfo.staffName

			console.log(reciveInfo.idNo)
			this.userInfo[1].value=this.$targb.getDAesString(reciveInfo.idNo)
			
			try {
				this.access_token= uni.getStorageSync('access_token');
				const res_info =await this.$apip.getPersonalInfo();
				
				if(res_info){
					this.saveArr.staffId=res_info.data.data.staffId
					this.saveArr.versionNo=res_info.data.data.versionNo
				}
				if (res_info.data.data.staffCerts.length>1) {
					let staffCerts = res_info.data.data.staffCerts
					this.idCard1=this.getImageObj(staffCerts, '身份证正面').imgUrl
					this.idCard2=this.getImageObj(staffCerts, '身份证反面').imgUrl
					this.idCard3=this.getImageObj(staffCerts, '手持身份证照').imgUrl
				}
			} catch (e) {
				console.log(e)
			}
			uni.hideLoading()
			myBaseUrl=this.$store.state.myBaseUrl
			devUrl=	this.$store.state.devUrl
		},
		getImageObj(arr, type) {
			let result = arr.filter(item => {
				return item.certTag == type || item.certTypeName == type
			})
			return result[0]
		},
		sexChange(e) {
			this.sexIdx = e.detail.value
		},
		previewImg1 : function(){
			uni.previewImage({
				urls:[_self.idCard1]
			});
		},
		previewImg2 : function(){
			uni.previewImage({
				urls:[_self.idCard2]
			});
		},
		previewImg3 : function(){
			uni.previewImage({
				urls:[_self.idCard3]
			});
		},
		async backToIndex(){
			uni.navigateBack({
				url:'trueme'
			})
		},
	},
}
</script>
<style lang="scss">
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
	.padding{
		padding: 20upx;
	}
	.bottom-20{
		margin-bottom: 20upx;
	}
	.bottom-01{
		margin-bottom: 2upx;
	}
	.avatar-box{
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		overflow: hidden;
		border:1px solid #ccc;
		padding:20rpx;
		image{
			width: 100%;
		}
	}
	.btn-area{
		margin-top: 40upx;
		button{
			width: 90%;
			background-color: #00b28e;
			border-color: #75d4c0;
			color: #fff;
			border-radius: 10upx;
		}
	}
</style>