<template>
	<view>
		<!-- part1 -->
		<view class="goods-list positionR">
			<view class="product-list  pt20-im positionR">
				<view class="product">
					<view class="name border-bottom"><text>预约号:{{item.num}}</text><text class="fr color-red">{{item.state}}</text></view>
					<view class="name">服务订单号:{{item.billId}}</view>
					<view class="name">服务项目:{{item.ele[0].text}}</view>
					<view class="name">服务机构:{{item.ele[1].text}}</view>
					<view class="name">预约时间:{{item.ele[2].text}}</view>
					<view class="info">
						<view class="price">收入:{{item.ele[3].text}}</view>
					</view>
				</view>
				
				<view v-if="item.stateValue==2" class="positionA r30 t70">
					<button v-if="item.kitGoodsId!=0&&(item.kitReceiveState==0||item.kitReceiveState==3)" @tap.stop.prevent="toConsumptive(item.taskId)" class="width100p bgc-6e8cfa color-fff  font-size22 mt10" type="default">领取耗材</button>
					<button v-if="item.executeState==0"  @tap.stop.prevent="toGoOut(item.taskId)" class="width100p bgc-6e8cfa color-fff   font-size22 mt10" type="default">出门&投保</button>
					<button v-if="item.executeState==0"  @tap.stop.prevent="toRefuse(1,item.taskId)" class="width100p bgc-6e8cfa color-fff   font-size22 mt10" type="default">撤销预约单</button>
				</view>
				<view v-else-if="item.stateValue==3" class="positionA r30 t70">
					<button v-if="item.executeState==1" @tap.stop.prevent="toArrived(item.taskId)" class="width100p bgc-6e8cfa color-fff   font-size22 mt10" type="default">确认到达</button>
					<button v-if="item.executeState==2" @tap.stop.prevent="toGoServer(item.taskId)" class="width100p bgc-6e8cfa color-fff   font-size22 mt10" type="default">开始评估</button>
					<button v-if="item.executeState==3" @tap.stop.prevent="toServeDone(item.taskId)" class="width100p bgc-6e8cfa color-fff   font-size22 mt10" type="default">确认服务完成</button>
					<button v-if="item.executeState==4" @tap.stop.prevent="uploadServeDone(item.taskId)" class="width100p bgc-6e8cfa color-fff   font-size22 mt10" type="default">上传服务记录</button>
				</view>
				<view v-else-if="" class="positionA r30 t70">
					
				</view>
			</view>

		</view>
		<!-- part2 -->
		<view class="goods-list">
			<view class="product-list ">
				<view class="product">
					
						<view class="uni-flex uni-row flex-box justify-content-space border-bottom padding-20">
								<label class="left-icon">任务跟踪信息</label>
						</view>
						<view v-for="(item,index) in trackArr" :key="index" class="padding-10-20">
							{{item.createTime}} {{item.action}}
						</view>
				</view>
			</view>
		</view>
		
		<!-- part3 -->
		<view class="goods-list">
			<view class="product-list ">
				<view class="product">
					<view class="uni-flex uni-row flex-box justify-content-space border-bottom padding-20">
							<label class="left-icon">服务对象信息</label>
							<!-- <view class="flex-item inline-block pl20 color6e8cfa">距离{{detailServe.long}}km</view> -->
					</view>
					<view class="name">服务对象:{{detailServe.custName}}</view>
					<view class="name uni-flex uni-row flex-box justify-content-space">
							<view class="flex-item inline-block">服务地址:{{detailServe.address}}</view>
					</view>
					<view class="name">联系人:{{detailServe.linkman}}</view>
					
					<view @tap.stop.prevent="contactServerObj" class="flex-item inline-block pl20 color6e8cfa recieveBtn1 text-alignC" style="font-size:26upx;" :style="contactBg"><text class="iconfont">&#xe70c;</text>联系服务对象</view>

				</view>
				
			</view>
		<button @tap="toReceive" class="bgc-6e8cfa color-fff padding-0-40 "  type="default">查看就诊详情</button>
		</view>
		
		
		<!-- part3 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product padding-20 mt20">
					<label class="left-icon">就医证明</label>
					
					<view class="uni-flex uni-row justify-content-center">
						<view v-for="(item,index) in srcArr" :key="index">
							<view class="uni-item showimgRow margin-20" @tap="previewImg1(index)" style="overflow: hidden;">
								<image style="height:300upx;width:100%" :src="item.src"></image>
							</view>
						</view>
					</view>
							
							
				</view>
			</view>
		</view>
		
		<!-- part3 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product padding-20 uni-flex uni-row justify-content-space" @tap='toReadRec'>
					<label class="">护理记录</label>
					<text class="iconfont">&#xe6f8;</text>
				</view>
			</view>
		</view>
		
	</view>
</template>
<script>
import amap from '@/static/common/map/amap-wx.js'	
var _self;
export default {
	data() {
		return {
			//猜你喜欢列表
			product:{ goods_id: 0,number:1231231,contactName:"王强",serveName:"王大爷", org:'湛江市某某某医院',time:'2019年2月29日 13:30-14:00','addr': '湛江市中山三路158号',name: '上门换药', price: '￥168', slogan:'接单' },
			categoryHeight: '150px',
			currentPageindex: 0,
			headerPosition:"fixed",
			loadingText:"正在加载...",
			item:{
				num:'',
				state:"",
				taskId:'',
				billId:'',
				stateValue:Number,//no button
				executeState:'',
				kitReceiveState:'',//耗材状态
				kitGoodsId:'',
				tabShow:1,
				show:true,
				ele:[
					{prop:"",label:"服务项目",text:''},
					{prop:"",label:"服务机构",text:""},
					{prop:"",label:"预约时间",text:'',isMoney:false},
					{prop:"",label:"收入",text:'',isMoney:true},
					{prop:"",label:"服务对象",text:''},
				]
			},
			detailServe:{
				long:'',
				custName:'',
				address:'',
				linkman:'',
				linkmanPhone:''
			},
			custId:{},
			billId:"",
			srcArr:[
			],//就医证明图片数组
			trackArr:[],//跟踪记录数组
			amapPlugin: null,   
			key: '9e47e3566d3ae729652171562dabe658',
			latitude:'',//维度
			longitude:'',//经度
			address:'',//当前地址,
			staffId:"",
		};
	},
	onReady() {
	}, 
	onPageScroll(e){
	},
	onPullDownRefresh() {
    },
	onReachBottom(){
	},
	onLoad(option) {
		_self = this;
		console.log(option)
		this.item.taskId=option.taskId;
		this.item.num=option.num;
		this.item.billId=option.billId;
		this.item.kitReceiveState=option.kitReceiveState;
		this.item.kitGoodsId=option.kitGoodsId;
		// this.item.state=option.state;
		// this.item.stateValue=option.stateValue;
		// this.item.executeState=option.executeState;
		this.item.ele[0].text=option.proj;
		this.item.ele[1].text=option.orgName;
		this.item.ele[2].text=option.time
		this.item.ele[3].text=option.money
		this.item.ele[4].text=option.user
		this.init();
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
	computed:{
		orderRefresh(){
			return this.$store.state.orderRefresh
		}
	},
	watch:{
		orderRefresh(){
			console.log("我监听到了orderRefresh状态的变化",this.$store.state.orderRefresh)
			this.init()//进行刷新
		}
	},
	onPullDownRefresh(){
		console.log("refresh")
		this.init()
		setTimeout(function () {
		    uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		async init(){
			this.trackArr=[]
			//basicInfo
			uni.showLoading()
			let res_info=await this.$apip.getPersonalInfo()
			this.staffId=res_info.data.data.staffId
			uni.hideLoading()
			
			uni.showLoading({})
			let res_billtask_taskId=await this.$apio.billtaskBytaskId(this.item.taskId)
			let res_data=res_billtask_taskId.data.data
			
			let stateLable=""
			let item_state=res_data.taskState
			switch (item_state)
				{
				case 0:
				  stateLable="待分派";
				  break;
				case 1:
				  stateLable="分派中";
				  break;
				case 2:
				   stateLable="待服务";
				  break;
				case 3:
				  stateLable="服务中";
				  break;
				case 4:
				  stateLable="待会员确认";
				  break;
				case 5:
				  stateLable="会员已确认";
				  break;
				case 7:
				  stateLable="已成功关闭";
				  break;
				case 10:
				   stateLable="待机构退款";
				   break; 
				case 11:
				   stateLable="待会员确认收款";
				   break; 
			    case 13:
				   stateLable="已撤销关闭";
				   break; 
				}
			this.item.state=stateLable;
			
			this.item.stateValue=res_data.taskState;
			
			this.item.executeState=res_data.executeState;
			
			this.detailServe.long=res_data.distance
			this.detailServe.custName=res_data.custName
			this.$store.state.custName=res_data.custName
			this.detailServe.address=res_data.custAddress
			this.detailServe.linkman=res_data.linkman
			this.detailServe.linkmanPhone=res_data.linkmanPhone
			this.custId=res_data.custId//就诊记录
			uni.hideLoading()
			
			//就医证明
			uni.showLoading({})
			this.srcArr=[]//初始化
			let res_billcerts=await this.$apio.billcerts(res_data.billId)
			console.log("就医证明res_billcerts",res_billcerts.data.data)
			let res_res_billcerts_data=res_billcerts.data.data
			res_res_billcerts_data.forEach((item,index)=>{
				this.srcArr.push({src:''})
				this.srcArr[index].src=res_res_billcerts_data[index].certImgPath
			})
			uni.hideLoading()
			
			//任务跟踪信息
			uni.showLoading({})
			let res_billtrack=await this.$apio.billtrack(this.item.taskId)
			uni.hideLoading()
			console.log("跟踪记录billtrack",res_billtrack.data.data)
			let res_billtrack_data=res_billtrack.data.data
			// let trackArr=[]
			res_billtrack_data.forEach((item,index)=>{
				// let actionLable=''
				// switch(parseInt(item.action)){
				// 	case 1:
				// 	actionLable='会员提交订单'
				// 	break;
				// 	case 2:
				// 	actionLable='优佳护已审核订单'
				// 	break;
				// 	case 3:
				// 	actionLable='会员提交预约单'
				// 	break;
				// 	case 4:
				// 	actionLable='优佳护已分派服务人员'
				// 	break;
				// 	case 5:
				// 	actionLable='服务人员已接单'
				// 	break;
				// 	case 6:
				// 	actionLable='服务人员已出门'
				// 	break;
				// 	case 7:
				// 	actionLable='服务人员已到达服务地址'
				// 	break;
				// 	case 8:
				// 	actionLable='服务人员已服务完成'
				// 	break;
				// 	case 9:
				// 	actionLable='会员已确认预约单'
				// 	break;
				// 	case 10:
				// 	actionLable='预约单成功关闭'
				// 	break;
				// 	case 11:
				// 	actionLable='优佳护已退款'
				// 	break;
				// 	case 12:
				// 	actionLable='会员撤销预约单'
				// 	break;
				// 	case 13:
				// 	actionLable='服务人员撤销预约单'
				// 	break;
				// 	case 14:
				// 	actionLable='预约单撤销关闭'
				// 	break;
				// 	case 15:
				// 	actionLable='会员撤销订单'
				// 	break;
				// 	case 16:
				// 	actionLable='优佳护撤销订单'
				// 	break;
				// 	case 17:
				// 	actionLable='服务订单撤销关闭'
				// 	break;
				// 	case 18:
				// 	actionLable='服务订单成功关闭'
				// 	break;
				// 	case 19:
				// 	actionLable='服务订单已完成待会员确认'
				// 	break;
				// 	case 20:
				// 	actionLable='会员已确认服务订单'
				// 	break;
				// 	case 21:
				// 	actionLable='服务人员开始评估'
				// 	break;
				// }
				this.trackArr.push({
					createTime:item.createTime,
					action:item.actionName,
				})
			})
			uni.hideLoading()
			
		},
		async toReadRec(){
			this.$store.state.ReadRecOnly=true
			let res_rec=await this.$apio.getNurseRec(this.item.taskId)//创建护理记录单
		
			// uni.navigateTo({
			// 	url: '../Reach/beginJudge',
			// 	success: res => {},
			// 	fail: () => {},
			// 	complete: () => {}
			// });
		},
		//toReceive
		toReceive(){
			uni.navigateTo({
				url:"../VisLog/index?custId="+this.custId
			})
		},
		toRefuse(){
			uni.navigateTo({
				url:"refuse" 
			})
		},
		previewImg1(index){
			let img=_self.srcArr[index].src
			uni.previewImage({
				urls:[img]
			});
			// uni.previewImage({
			// 	urls:["http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//tar-nursing3.1.jpg"]
			// });
		},
		previewImg2 : function(){
			uni.previewImage({
				urls:["http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//tar-nursing3.2jpg"]
			});
		},
		/*接单后流程状态*/
		toConsumptive(taskId){
			uni.navigateTo({
				url:'consumptive?taskId='+taskId
			})
		},
		toGoOut(taskId){//出门开始服务
			console.log("taskId",taskId)
			uni.showModal({
				title: '是否确认出发前往服务地址？',
				content: '你当前的位置是:'+this.address
				+'（温馨提示：1、出发前请联系服务对象，确认他是否在家或是否需要变更上门服务的时间。2、出发前请带上所需物品）',
				// +'——优佳护已为您购买了意外伤残身故险，保单详情已短信发送给您！',
				success: async (res)=> {
					if (res.confirm) {
						console.log('用户点击确定');
						// this.$store.state.orderRefresh++;
						let staffId=this.staffId
						let actionId=6//服务人员已出门
						let position=this.longitude+","+this.latitude
						let imgUrl=''
						let res_goOut=await this.$apio.startServe(staffId,taskId,actionId,position,imgUrl)
						if(res_goOut.data.code==0){//投保成功刷新
							this.$store.state.orderRefresh++;
						}else{
							uni.showToast({
								title: res_goOut.data.msg,
								icon:'none'
							});
						}
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		
		toArrived(taskId){//确认到达
		
			uni.showModal({
				title: '是否确认已到达服务地点？',
				content: '',
				success: async (res)=> {
					if (res.confirm) {
						console.log('用户点击确定');
						let staffId=this.staffId
						uni.navigateTo({
										url:'../../packageB/Reach/index?staffId='+staffId+'&taskId='+taskId
						})
						this.$store.state.toArrived_from=0
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		
		},
		
		toGoServer(taskId){//开始评估
			uni.showModal({
				title: '是否确认开始评估？',
				content: '',
				success: async (res)=> {
					if (res.confirm) {
						console.log('用户点击确定');
						this.$store.state.toGoServer_from=0
						let staffId=this.staffId
						let res_rec=await this.$apio.putNurseRec(staffId,taskId)//创建护理记录单
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		
		toRefuse(value,taskId){//撤销操作 //撤销预约单 罚款
			uni.showModal({
				title:'温馨提示',
				content:'您确认要撤销预约单吗',
				success: async (res)=> {
					if (res.confirm) {
						console.log('用户点击确定');
						
						let reason='有急事要处理'
						let res_cancel=await this.$apio.cancelOrder(this.staffId,taskId,reason)
						//执行撤销预约单接口
					} else if (res.cancel) {
						console.log('用户点击取消');
						// 	uni.switchTab({
						// 	url:'../../pages/Order/index'
						// })
					}
				}
			})
		},
		
		toServeDone(taskId){//确认服务完成
			uni.showModal({
				title: '提示',
				content: '确认当前服务已完成',
				success: async (res)=> {
					if (res.confirm) {
						console.log('用户点击确定');
						this.$store.state.orderRefresh++;
						let staffId=this.staffId
						let actionId=8//服务人员已服务完成
						let position=this.longitude+","+this.latitude
						let imgUrl=''
						let res_goOut=await this.$apio.startServe(staffId,taskId,actionId,position,imgUrl)
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		
		uploadServeDone(taskId){//上传服务记录
			this.$store.state.uploadServeDone_from=0
			this.$store.state.ReadRecOnly=false
			uni.navigateTo({
				url:'../../packageB/OrderDetail/serveDone?taskId='+taskId,
			})
		},
		/*接单后流程状态结束*/
		
		contactServerObj(){
			uni.makePhoneCall({//打给服务对象
				phoneNumber: this.detailServe.linkmanPhone
			});
		},
	}
};
</script>
<style lang="scss">
@font-face {font-family:"HMfont-home";src:url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAP8AAsAAAAACFwAAAOwAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqEEINSATYCJAMQCwoABCAFhG0HTxtLBxHVmzvJfhS4scOeC1v4zNNRK/hO5b0IHqg/8838ye5XsIDanmAkhZ1NSZygm4SsbYYkp17ICsOUxIP/ZZm9xejtQAD8zzX10geY387mEtXapUd7A5xF6oAi2pJoE8YNY1dexGkIwCSZQoiq1es2RUdhTBKA6N2jWwf0lAlVky3QEYSUrFSIOTjQ5VR5GZjt/168obDQQeLQMGY27FqtMxWf5z5fpgWCgdYugng8B8DWgQYUAhSI7qWujmhhqBAaptJfURzQ0ZEwVkfB58uCQSTZi0o3//JAItBAhGBk2gAURUrtxMQ2BQnPC1IQ8HyZmpvE1XgdMIDtwHVEJt4qkThsZwFPVHiEFTHKtWBBYGGUe/HmsZu6TluCStw+fXGMY9GyUb4b133Xrze9etV77VqzxcuXbYq8bF6/7rtxo5lY6A1cLcuCQJS3oXHswOYKUSaI71xkXr3ayZy2SIix0YumRS6AwEnLmr58WS9z2pKlYcJCCGzcXOU81Xuhp1osIWbBiUQWehda7lTvaNeCJX0WbYgksMA0hdlLo6zDp1PEomIdVu7YE4wN7nH7uGPdHXz2R3uHnX68tcP6SPE5ZSdObNpN/9dybtfmr6tHoy6+rN+DqdvnW9lUbkHTdcUWfKp1yzVr5Ag5HCqGU0Hca3jpAt2GiWFRwxYvdpYFo2b3tN/HvLeFd+BAr5Bu7CXnzKFlJb8dtP3ucx1djc+589Pep+W7X706stfvml+7i8fsWunxp7/f/uzsrgzj9Sv3p+6T7yqwvrfdy3nk/J6eZ84fnHp2lSvf/m/7H7569dDvuY/fTX+Mwdog+QVAGyB/IHmGyK8/exQrX13Maucu+y23rrbi5tQ1T3yTor3oj4kV8a8VtyxSqtQwKyXLbJF2kaI5DgAkYGICPzQG4dwfQxPVOhMEOlExSEJJAg2dTFSRhcCBRVEIQacCmBSkxnqLCAaiIZQBFGAiAIGH3SBxcRo0PFxBFXkPHETzDkLwCA1MfCJiR4tswStWxeEccIPlAbXSxS1rYEH2G0U8ZpeU+sw/Oq+80JR1NjrghW6MOT6JNgQO3NEJPTgPj4PAONK4hlKGYLqq4mVvKlc6M0YVh3PADZYH1EoXd8sHlvv+G0U8ZldDq/D+0XnVPTRl3QIdVFcr2rX090m0IXA8jjs6oYcOPMwQgSkfpnENpewRMF2FSvG2qnJ+zfmE6wATY6YSUmhCCQehg9V8advwun0+nHuJ0VP0kYrcz/Qox5hl') format('woff2');}
.icon {
	font-family:"HMfont-home" !important;
	font-size:60upx;
	font-style:normal;
	color:#ffffff;
	&.scan {
		&:before{content:"\e69a";}
	}
	&.menu {
		&:before{content:"\e62b";}
	}
	&.search {
		&:before{content:"\e628";}
	}
}
page {
	background-color: #fff;
}
.status {
	width: 100%;
	height: 0;
	/*  #ifdef  APP-PLUS  */
	height: var(--status-bar-height);
	/*  #endif  */
	background-color: #6e8cfa;
	position: fixed;
	top: 0;
	z-index: 999;
}
.place{
	/*  #ifdef  APP-PLUS  */
	margin-top: var(--status-bar-height);
	/*  #endif  */
	background-color: #6e8cfa;
	height: 100upx;
}

.goods-list{
	background-color: #f4f4f4;
	.title{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
	.loading-text{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
	.product-list{
		position: relative;
		width: 95%;
		padding: 0 2.5% 2.5vw 2.5%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.product{
			width: 100%;
			border-radius: 20upx;
			background-color: #fff;
			// margin: 0 0 15upx 0;
			image{
				// width: 100%;
				border-radius: 20upx 20upx 0 0;
			}
			.name{
				width: 92%;
				padding: 8upx 4%;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				text-align: justify;
				overflow: hidden;
				font-size: 26upx;
			}
			.info{
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				width: 92%;
				padding: 10upx 4% 10upx 4%;
				
				.price{
					color: #6c8efa;
					font-size: 30upx;
					font-weight: 600;
				}
				.slogan{
					color: #807c87;
					font-size: 24upx;
				}
			}
		}
		
	}
}
.uni-flex {
	display: flex;
	flex-direction: row;
}
.recieveBtn{
	position:absolute;
	bottom:70upx;
	right:40upx;
	width:32vw;
	padding:0 10upx;
}
.recieveBtn1{
	position:absolute;
	bottom:30upx;
	right:10upx;
	width:32vw;
	padding:0 10upx;
}
.showimgRow{
	width:300upx;
	height:300upx;
}
</style>