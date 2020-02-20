<template>
	<view>
		<view class="header" v-bind:class="{'status':isH5Plus}">
			<view class="flex-box uni-row justify-content-flexend width100p">
				<view class="userinfo m0a uni-item mr-2vw">
					<view class="m0a">
							<view class="face m0a" v-if='showAvartar' @tap='previewImage' >
								<image :src="userinfo.face"></image>
							</view>
						<view class="info positionR">
							<view class="username">
								{{userinfo.username}}
							</view>
							<view class="edit inline-block ml10 positionA" @tap="toUserInfo_userInfo"><text class="iconfont color-fff" style="font-size:40upx;">&#xe639;</text></view>
						</view>
					</view>
				</view>
				<view class="setting inline-block uni-item mr20"><text  @tap="toSetting" class="iconfont color-fff" style="font-size:60upx;">&#xe728;</text></view>
			</view>
		</view>
		
			<view class="orders">
			</view>
			
			<view class="" v-for="(IconItem,IconIndex) in orderTypeLise" :key="IconIndex">
				<view class="orders1">
					<view class="box">
							<view class="label" v-for="(row,row_index) in IconItem" :key="row_index.name" hover-class="hover"  @tap="toOrderType(IconIndex,row_index)">
								<view class="icon flex-item displayB">
									<view class="badge" v-if="row.badge>0">{{row.badge}}</view>
								<text v-if='IconIndex==0&&row_index==0' class="iconfont color6e8cfa font-size60">&#xe66d;</text>
								<text v-if='IconIndex==0&&row_index==1' class="iconfont color6e8cfa font-size60">&#xe623;</text>
								<text v-if='IconIndex==0&&row_index==2' class="iconfont color6e8cfa font-size60">&#xe708;</text>
								<text v-if='IconIndex==0&&row_index==3' class="iconfont color6e8cfa font-size60">&#xe60b;</text>
								
								<text v-if='IconIndex==1&&row_index==0' class="iconfont color6e8cfa font-size60">&#xe613;</text>
								<text v-if='IconIndex==1&&row_index==1' class="iconfont color6e8cfa font-size60">&#xe600;</text>
								<text v-if='IconIndex==1&&row_index==2' class="iconfont color6e8cfa font-size60">&#xe62a;</text>
								<text v-if='IconIndex==1&&row_index==3' class="iconfont color6e8cfa font-size60">&#xe65a;</text>
								</view>
								<view class="displayB text-alignC pt10">{{row.name}}</view>
							</view>
					</view>	

				</view>
			</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				//#ifdef APP-PLUS
				isH5Plus:true,
				//#endif
				//#ifndef APP-PLUS
				isH5Plus:false,
				//#endif
				userinfo:{},
				orderTypeLise:[
					[{name:'余额',icon:'',badge:0},
					{name:'排班设置',icon:'',badge:0},
					{name:'学习',icon:'',badge:0},
					{name:'考核',icon:'',badge:0}
					],
					
					[
					{name:'账户信息',icon:'',badge:0},
					{name:'客服',icon:'',badge:0},
					{name:'入驻机构',icon:'',badge:0},
					{name:'领取单',icon:'',badge:0},
					],
				],
				isExamined:"",//是否考核通过
				showAvartar:true
			};
		},
		onShow(){
			this.init();//refresh
		},
		onLoad() {
			//加载
			// this.init();
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    setTimeout(function () {
		        uni.stopPullDownRefresh();
		    }, 1000);
		},
		methods: {
			async init() {
				let res_info=await this.$apip.getPersonalInfo()
				let res_info_data=res_info.data.data
				console.log("res_info_data",res_info.data.data)
				//用户信息
				this.userinfo={
					face:'',
					username:res_info_data.staffName,
					integral:"湛江市某某某医院/内科"
				}
				
				//头像	
				if(this.$store.state.avatar==''||this.$store.state.avatarRefresh==true){
					let userinfo=await this.$apip.userinfo()
					console.log(userinfo.data.data.sysUser.avatar)
					let avatar=userinfo.data.data.sysUser.avatar
					if(avatar==null||avatar==''){
						this.userinfo.face='../../static/img/logo.png'
						// this.showAvartar=true
					}else{
						this.userinfo.face=avatar
						// this.showAvartar=true
					}	
					this.$store.state.avatar=this.userinfo.face
					this.$store.state.avatarRefresh=false
				}else{
					this.userinfo.face=this.$store.state.avatar
				}
				
			},
			//用户点击订单类型
			async toOrderType(IconIndex,row_index){
				//第一行
				if(IconIndex==0&&row_index==0){
					uni.navigateTo({
						url: '../../packageA/Wallet/index'
					})
				}
				if(IconIndex==0&&row_index==1){
					uni.navigateTo({
						url: '../../packageA/Calendar/index'
					})
				}
				if(IconIndex==0&&row_index==2){
// 					uni.navigateTo({
// 						url: '../../packageA/Study/index'
// 					})
					uni.showToast({
						title:"未发布",
						icon:"none"
					})
				}
				if(IconIndex==0&&row_index==3){//判断跳转到考试状态页面或者考试页面
					uni.showLoading({})
					let res_info=await this.$apip.getPersonalInfo()
					uni.hideLoading()
					this.isExamined=res_info.data.data.isExamined
					if(this.isExamined==1){ 
						uni.navigateTo({
							url:'../../packageA/Exam/examPass'
						})
					}else if(this.isExamined==0){
						uni.navigateTo({
							url: '../../packageA/Exam/index'
						})
					}
					
				}
				//第二行
				if(IconIndex==1&&row_index==0){
					uni.navigateTo({
						url: '../../packageA/UserInfo/index'
					})
					// uni.showToast({
					// 	title:"未发布",
					// 	icon:"none"
					// })
				}
				if(IconIndex==1&&row_index==1){
					let phoneNumber=this.$store.state.servePhone//转wx-contact
					uni.makePhoneCall({
						phoneNumber: phoneNumber 
					});
				}
				if(IconIndex==1&&row_index==2){
						uni.navigateTo({
						url: '../../packageA/MyOrg/index'
					})
				}
				if(IconIndex==1&&row_index==3){
						uni.navigateTo({
							url: '../../packageB/Consumptive/index'
						})
				}
			},
			toUserInfo(){//护士信息 对应info接口
				uni.navigateTo({
					url: '../../packageA/UserInfo/index'
				})
			},
			toUserInfo_userInfo(){//用户信息 对应userinfo接口
				uni.navigateTo({
					url: '../../packageA/UserInfo/userInfo'
				})
			},
			toSetting(){
				uni.navigateTo({
					url: '../../packageA/Setting/index'
				})
			},
			previewImage(){
				uni.previewImage({
					urls: [this.userinfo.face],
					longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function (res) {
							console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						},
						fail: function (res) {
							console.log(res.errMsg);
						}    
					}
				});
			}
			
        // });
		}
	}
</script>

<style lang="scss">
page{background-color:#fff}
.header{
	&.status{padding-top:var(--status-bar-height);}
	background-color:#6e8cfa;width:92%;height:35vw;padding:0 4%;display:flex;align-items:center;
	.userinfo{
		width:83%;display:flex;
		.face{flex-shrink:0;width:16vw;height:16vw;
			image{width:100%;height:100%;border-radius:10%;background:#efefef;}
		}
		.info{
			display:flex;flex-flow:wrap;text-align:center;padding-top:20upx;
			.username{width:100%;color:#fff;font-size:40upx}
			.integral{display:flex;align-items:center;padding:0 20upx;height:40upx;color:#fff;background-color:rgba(0,0,0,0.1);border-radius:20upx;font-size:24upx}
		}
	}
	.edit{
		flex-shrink:0;top:28upx;right:-60upx;
		image{width:100%;height:100%}
	}
}
.setting{
	flex-shrink:0;width:6vw;height:6vw;
	image{width:100%;height:100%}
}
.hover{}
.orders{
	background-color:#6e8cfa;width:92%;height:35vw;padding:0 4%;display:flex;align-items:flex-start;border-radius:0 0 100% 100%;margin-top: -145upx;
	.box{
		width:98%;padding:0 1%;height:22vw;background-color:#fefefe;margin-bottom:40upx;margin-top:200upx;
		.label{
			width:100%;height:16vw;color:#666666;font-size:26upx;
			.icon{
				position:relative;width:7vw;height:7vw;margin:0 1vw;
				.badge{position:absolute;width:4vw;height:4vw;background-color:#ec6d2c;top:-1vw;right:-1vw;border-radius:100%;font-size:20upx;color:#fff;display:flex;align-items:center;justify-content:center;z-index: 10;}
				image{width:6vw;height:6vw;z-index: 9;}
			}
		}
	}
}
.orders1{
	width:92%;height:11vw;padding:0 4%;margin-bottom:calc(11vw + 40upx);display:flex;align-items:flex-start;border-radius:0 0 100% 100%; margin-top:40upx;
	.box{
		width:98%;padding:0 1%;height:22vw;background-color:#fefefe;margin-bottom:40upx;display:flex;align-items:center;justify-content:center;
		.label{
			flex-flow:wrap;width:100%;height:16vw;color:#666666;font-size:26upx;
			.icon{
				position:relative;margin:0 1vw; text-align: center;
				.badge{position:absolute;width:4vw;height:4vw;background-color:#ec6d2c;top:-1vw;right:-1vw;border-radius:100%;font-size:20upx;color:#fff;display:flex;align-items:center;justify-content:center;z-index: 10;}
				image{width:10vw;height:10vw;z-index: 9;}
			}
		}
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
</style>
