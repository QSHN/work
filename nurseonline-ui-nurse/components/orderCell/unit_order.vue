<template>
    <view  >

	<view  class="my-unit" v-for="(orderItem,orderIndex) in orderList_computer" :key="orderIndex" @tap="toOrderDetail(orderIndex)" >
		<view v-if="orderItem.show">
			<view class="unit-head">
				<text>预约号：{{orderItem.num}}</text><text class="fr color-red">{{orderItem.state}}</text>
			</view>
			<view class="unit-body positionR">
				<text>服务订单号:{{orderItem.billId}}</text>
				<text v-for="(item,index) in orderItem.ele" :key="index" >
					{{item.label}}：<text v-if="item.isMoney" :class="item.class">￥</text>
					<text :class="item.class">{{item.text}}</text>
					<text v-if="item.isMoney" :class="item.class"> 元</text>
				</text>
				<view v-if="orderItem.stateValue==2" class="positionA r10">
					<button v-if="orderItem.kitGoodsId!=0&&(orderItem.kitReceiveState==0||orderItem.kitReceiveState==3)" @tap.stop.prevent="toConsumptive(orderItem.taskId)" class="width100p bgc-6e8cfa color-fff  font-size22 mt20" type="default">领取耗材</button>
					<button v-if="orderItem.executeState==0"  @tap.stop.prevent="toGoOut(orderItem.taskId)" class="width100p bgc-6e8cfa color-fff   font-size22 mt20" type="default">出门&投保</button>
					<button v-if="orderItem.executeState==0" @tap.stop.prevent="toRefuse(1,orderItem.taskId)" class="width100p bgc-6e8cfa color-fff   font-size22 mt20" type="default">撤销预约单</button>
				</view>
				<view v-else-if="orderItem.stateValue==3" class="positionA r10">
					<button v-if="orderItem.executeState==1" @tap.stop.prevent="toArrived(orderItem.taskId)" class="width100p bgc-6e8cfa color-fff   font-size22 mt20" type="default">确认到达</button>
					<button v-if="orderItem.executeState==2" @tap.stop.prevent="toGoServer(orderItem.taskId)" class="width100p bgc-6e8cfa color-fff   font-size22 mt20" type="default">开始评估</button>
					<button v-if="orderItem.executeState==3" @tap.stop.prevent="toServeDone(orderItem.taskId)" class="width100p bgc-6e8cfa color-fff   font-size22 mt20" type="default">确认服务完成</button>
					<button v-if="orderItem.executeState==4" @tap.stop.prevent="uploadServeDone(orderItem.taskId)" class="width100p bgc-6e8cfa color-fff   font-size22 mt20" type="default">上传服务记录</button>
				</view>
				<view v-else-if="" class="positionA r10">
				</view>
				<view @tap.stop.prevent="contactServerObj(orderItem.linkmanPhone)" class="flex-item positionA inline-block pl40 color6e8cfa recieveBtn1 text-alignC"
				 style="font-size:26upx;left:30vw;bottom:18upx;"><text class="iconfont">&#xe70c;</text>联系服务对象</view>
			</view>
		</view>
	</view>
		
    </view>
</template>
	
<script>
	import amap from '@/static/common/map/amap-wx.js'
	let _self=this;
    export default{
		props:{
			orderList:{
				type:Array
			},
			request_data:{},
			request_data_search:''
		},
        data() {
            return {
				amapPlugin: null,   
				key: '9e47e3566d3ae729652171562dabe658',
				latitude:'',//维度
				longitude:'',//经度
				address:'',//当前地址,
				staffId:"",
            }
        },
		onLoad(){
			this.init()
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
			listenstage() {
				return this.$store.state.orderTabState;
			},
			orderList_computer(){
				this.orderList=[]//初始化;
				console.log("computer_res_order",this.$store.state.res_order)
				this.$store.state.res_order.forEach((item,index)=>{
					this.orderList[index]=
						{	state:"服务中",//e.g.
							taskId:'',
							stateValue:1,
							executeState:'',
							kitReceiveState:'',
							kitGoodsId:'',
							tabShow:3,
							show:true,
							num:'1234578098',
							billId:'',
							ele:[
								{prop:"",label:"服务项目",text:'普通伤口护理'},
								{prop:"",label:"服务机构",text:"广东医科大学附属医院"},
								{prop:"",label:"预约时间",text:'2019年4月16日 10:00-11:00'},
								{prop:"",label:"收入",text:'90',isMoney:true},
								{prop:"",label:"服务对象",text:'张小宝'},
							],
							linkmanPhone:'',
							stock_bill:''
						}
					let stateLable=""
					let item_state=item.taskState
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
					this.orderList[index].state	=stateLable
					this.orderList[index].stateValue=item.taskState
					this.orderList[index].executeState=item.executeState
					this.orderList[index].kitReceiveState=item.kitReceiveState
					this.orderList[index].kitGoodsId=item.kitGoodsId
					
					this.orderList[index].taskId=item.taskId
					this.orderList[index].billId=item.billId
					this.orderList[index].num=item.taskId//task_id 预约号、bill_i 订单号
					this.orderList[index].show=true
					this.orderList[index].ele[0].text=item.serviceLabel
					this.orderList[index].ele[1].text=item.orgName//应该是orgName
					this.orderList[index].ele[2].text=item.reserveDate+' '+item.reserveTime1+":00"+'~'+item.reserveTime2+":00"
					this.orderList[index].ele[3].text=item.staffAmt
					this.orderList[index].ele[4].text=item.custName
					this.orderList[index].linkmanPhone=item.linkmanPhone
					this.orderList[index].linkmanPhone=item.linkmanPhone
				})
				return this.orderList
			}
		},
		watch:{
			listenstage: async function(ov,nv){//切换tab
			  this.$store.state.res_order=[]//初始化
			  this.request_data.current=1//点击搜索，第一页数据
			  console.log('watch start……');
			  if(this.$store.state.orderTabState){
		            //业务处理
					let state=this.$store.state.orderTabState
					uni.showLoading({})
					if(state==1){//全部taskState=0
						this.request_data.taskState=0
					}else if(state==2){//待服务taskState=2
						this.request_data.taskState=2
					}else if(state==3){//服务中taskState=3
						this.request_data.taskState=3
					}else if(state==4){//成功服务taskState=7
						this.request_data.taskState=7
					}
					
					let searchText;//输入框数字时
					let searchServer='';//输入为服务项目时
					if(this.request_data_search.length<1){//空字符串时
						searchText=0
					}else if(/^\d+$/.test(this.request_data_search)!=true){//为汉字
						searchText=''
						searchServer=this.request_data_search
					}
					else{
						searchText=this.request_data_search
						searchServer=''
					}
					let data='staffId='+this.request_data.staffId+
							'&billId='+searchText+
							'&taskId='+searchText+
							'&taskState='+this.request_data.taskState+
							'&orgId='+this.request_data.orgId+
							'&searchCount='+this.request_data.searchCount+
							'&current='+this.request_data.current+
							'&size='+this.request_data.size+
							'&taskDateOrder=desc'+
							'&serviceName='+searchServer
					let res_order=await this.$apio.getOrderInfo(data)
					this.$store.state.res_order=res_order.data.data.records
					uni.hideLoading()
				}
				console.log('watch stop……');	
			  } 
		},
        methods:{
			async init(){
				console.log("start init")
				uni.showLoading()
				let res_info=await this.$apip.getPersonalInfo()
				this.staffId=res_info.data.data.staffId
				uni.hideLoading()
			},
			doDel(){
				this.$store.commit("switch_loading")
			},
			
			/*接单后流程状态*/
			toConsumptive(taskId){
				uni.navigateTo({
					url:'../../packageB/OrderDetail/consumptive?taskId='+taskId
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
											url:'../../packageB/Reach/index?staffId='+staffId+'&taskId='+taskId+'&fromWhere=order'
							})
							this.$store.state.toArrived_from=1
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
							this.$store.state.toGoServer_from=1
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
					content:'您确认要撤销预约单吗？',
					success: async (res)=> {
						if (res.confirm) {
							console.log('用户点击确定');
							
							let reason='有急事要处理'
							let res_cancel=await this.$apio.cancelOrder(this.staffId,taskId,reason)
							//执行撤销预约单接口
						} else if (res.cancel) {
							console.log('用户点击取消');
							// uni.switchTab({
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
				this.$store.state.uploadServeDone_from=1
				this.$store.state.ReadRecOnly=false
				uni.navigateTo({
					url:'../../packageB/OrderDetail/serveDone?taskId='+taskId,
				})
			},
			/*接单后流程状态结束*/
			
			toOrderDetail(orderIndex){
				let taskId=this.orderList[orderIndex].taskId
				let billId=this.orderList[orderIndex].billId
				let num=this.orderList[orderIndex].num
				let state=this.orderList[orderIndex].state
				let stateValue=this.orderList[orderIndex].stateValue
				let executeState=this.orderList[orderIndex].executeState
				let kitReceiveState=this.orderList[orderIndex].kitReceiveState
				let kitGoodsId=this.orderList[orderIndex].kitGoodsId
				
				let proj=this.orderList[orderIndex].ele[0].text//项目
				let org=this.orderList[orderIndex].ele[1].text//机构
				let time=this.orderList[orderIndex].ele[2].text//时间
				let money=this.orderList[orderIndex].ele[3].text//钱
				let user=this.orderList[orderIndex].ele[4].text//人名
				
				uni.navigateTo({//预约详情页
					url:'../../packageB/OrderDetail/index?num='+num
					+'&taskId='+taskId
					+'&billId='+billId
					+'&state='+state
					+'&stateValue='+stateValue
					+'&executeState='+executeState
					+'&kitReceiveState='+kitReceiveState
					+'&kitGoodsId='+kitGoodsId
					+'&proj='+proj
					+'&orgName='+org
					+'&time='+time
					+'&money='+money
					+'&user='+user
				})
			},
			contactServerObj(phoneNum){
				uni.makePhoneCall({//打给服务对象
					phoneNumber: phoneNum 
				});
			}
			
        },
		created() {
			
		},
    }
</script>
<style lang='scss'>
    .my-unit{
		margin: 20upx 0;
		background-color: #ffffff;
		font-size: 28upx;
		transform: all 1s;
		margin:20rpx;
		border-radius:20rpx;
		
		.unit-head{
			padding: 20upx;
			height: 80upx;
			box-sizing: border-box;
			border-bottom: 2upx solid #f5f5f5;
		}
		.unit-body{
			padding: 20upx;
			display: flex;
			flex-wrap: wrap;
			
			text{
				width: 100%;
				font-size: 28upx;
				line-height: 46upx;
			}
		}
		.unit-foot{
			height: 88upx;
			padding: 0 20upx;
			border-top: 2upx solid #f5f5f5;
			border-bottom: none;
			line-height: 88upx;
			
			.btn{
				height: 60upx;
				font-size: 28upx;
				line-height: 60upx;
				margin: 14upx 0;
			}
		}
	}
</style>