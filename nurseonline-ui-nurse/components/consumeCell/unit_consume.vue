<template>
    <view  >

	<view  class="my-unit" v-for="(orderItem,orderIndex) in orderList_computer" :key="orderIndex" @tap="toOrderDetail(orderIndex)" >
		<view v-if="orderItem.show">
			<view class="unit-head">
				<text>领取日期：{{orderItem.num}}</text><text class="fr color-red">{{orderItem.state}}</text>
			</view>
			<view class="unit-body positionR">
				<text v-for="(item,index) in orderItem.ele" :key="index" >
					{{item.label}}：<text v-if="item.isMoney" :class="item.class">￥</text>
					<text :class="item.class">{{item.text}}</text>
					<text v-if="item.isMoney" :class="item.class"> 元</text>
				</text>
				<view class="positionA" style="right:30upx;top:80upx">
				 	<button v-if="orderItem.billState==2&&orderItem.shipmentState==1"  @tap.stop.prevent="goDeal(orderIndex)" class="width100p bgc-6e8cfa color-fff  font-size22 mt20" type="default">确认签收</button>
				 </view>
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
				linkman:'',
				phone:''
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
				return this.$store.state.consumeTabState;
			},
			orderList_computer(){
				this.orderList=[]//初始化;
				console.log("computer_res_consume",this.$store.state.res_consume)
				this.$store.state.res_consume.forEach((item,index)=>{
					this.orderList[index]=
						{	state:"服务中",//e.g.
							taskId:'',
							executeState:'',
							tabShow:3,
							show:true,
							num:'1234578098',
							billState:'',
							shipmentState:'',
							ele:[
								{prop:"",label:"领取单号",text:''},
								{prop:"",label:"服务机构",text:""},
								{prop:"",label:"耗材总金额",text:''},
							],
							phone:'',
							linkman:'',
							address:'',
						}
					let stateLable=""
					let stateLable_billState=""
					let stateLable_shipmentState=""
					
						let item_state_billState=item.billState
						switch (item_state_billState)
							{
							case 0:
							  stateLable_billState="草稿";
							  break;	
							case 1:
							  stateLable_billState="待审核";
							  break;
							case 2:
							  stateLable_billState="已审核";
							  break;
							case 3:
							   stateLable_billState="已取消";
							  break;
							}
					
						let item_state_shipmentState=item.shipmentState
						switch (item_state_shipmentState)
							{
							case 0:
							  stateLable_shipmentState="待取件";
							  break;
							case 1:
							  stateLable_shipmentState="配送中";
							  break;
							case 2:
							  stateLable_shipmentState="已签收";
							  break;
							}
					
					stateLable=stateLable_billState+'-'+stateLable_shipmentState
					this.orderList[index].state	=stateLable
					this.orderList[index].executeState=item.executeState
					this.orderList[index].billState=item.billState //billState
					this.orderList[index].shipmentState=item.shipmentState //shipmentState
					
					this.orderList[index].taskId=item.taskId
					this.orderList[index].num=item.createTime
					this.orderList[index].show=true
					this.orderList[index].ele[0].text=item.billId
					this.orderList[index].ele[1].text=item.sellOrgName
					this.orderList[index].ele[2].text=item.amt
						this.orderList[index].address=item.address
						this.orderList[index].linkman=item.linkman
						this.orderList[index].phone=item.phone
						this.orderList[index].billState=item.billState
						this.orderList[index].shipmentState=item.shipmentState
				})
				return this.orderList
			}
		},
		watch:{
			listenstage: async function(ov,nv){
			  console.log("this.$store.state.consumeTabState",this.$store.state.consumeTabState)
			  uni.showLoading({});
			  let str='?state='+parseInt(this.$store.state.consumeTabState-2)+'&billId='+this.request_data_search
			  let res_order=await this.$apip.getConsumeList(str)
			  this.$store.state.res_consume=res_order.data.data.records
			  uni.hideLoading()
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
			toConsumptive(){
				
				uni.navigateTo({
					url:'../../packageB/OrderDetail/consumptive'
				})
			},
			
			/*接单后流程状态*/
			
			
			
			toOrderDetail(orderIndex){
				let billId=this.orderList[orderIndex].ele[0].text
				let orgName=this.orderList[orderIndex].ele[1].text
				let creatTime=this.orderList[orderIndex].num
				let amt=this.orderList[orderIndex].ele[2].text
				let address=this.orderList[orderIndex].address
				let linkman=this.orderList[orderIndex].linkman
				let phone=this.orderList[orderIndex].phone
				let billState=this.orderList[orderIndex].billState
				let shipmentState=this.orderList[orderIndex].shipmentState
				
				uni.navigateTo({//预约详情页
					url:'detail?billId='+billId
					+'&orgName='+orgName
					+'&creatTime='+creatTime
					+'&amt='+amt
					+'&address='+address
					+'&linkman='+linkman
					+'&phone='+phone
					+'&billState='+billState
					+'&shipmentState='+shipmentState
				})
			},
			contactServerObj(phoneNum){
				uni.makePhoneCall({//打给服务对象
					phoneNumber: phoneNum 
				});
			},
			/*确认签收*/
			goDeal(orderIndex){//出门开始服务
				let billId=this.orderList[orderIndex].ele[0].text
				uni.showModal({
					title: '提示',
					content: '请确认是否签收?',
					success: async (res)=> {
						if (res.confirm) {
							let res=await this.$apip.goDeal(billId)
							if(res.data.code==0){
								this.$store.state.consumeRefresh++;
							}else{
								uni.showToast({
									title: res.data.msg,
									icon:'none'
								});
							}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			
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