<template>
	<view>
		<view class="width100p text-alignC mt200-im"><text class="iconfont color6e8cfa font-size180">&#xe60e;</text></view>
		<view class="grace-idcard-text grace-idcard-alc color666 mt100p  padding-20">
							
		</view>
		<view class="grace-idcard-text grace-idcard-alc color666 mt100p  padding-20 textCenter">
							恭喜您,接单成功！
		</view>
		<view class="grace-idcard-text grace-idcard-alc color666 mt100p  padding-20 textCenter">
							请尽快前往 <text @tap="toOrderDetail" class="color6e8cfa">预约详情</text> 领取服务耗材包
		</view>  
	</view>
</template>
	
<script>
	export default {
		data(){
			return{
				orderList:
					{	state:"服务中",//e.g.
						taskId:'',
						stateValue:1,
						executeState:'',
						tabShow:3,
						show:true,
						num:'1234578098',
						ele:[
							{prop:"",label:"服务项目",text:'普通伤口护理'},
							{prop:"",label:"服务机构",text:"广东医科大学附属医院"},
							{prop:"",label:"预约时间",text:'2019年4月16日 10:00-11:00'},
							{prop:"",label:"收入",text:'90',isMoney:true},
							{prop:"",label:"服务对象",text:'张小宝'},
						],
						linkmanPhone:''
					},
					taskId:'',
					billId:''
			}
		},
		onLoad(options) {
			this.taskId=options.taskId
		},
		methods: {
			async toOrderDetail(){
				let taskId=this.taskId
				let res=await this.$apio.billtaskBytaskId(taskId)
				
				let res_data=res.data.data
				this.billId=res_data.billId
				console.log(res_data)
	
				let num=res_data.taskId
				let state//state label
				let stateValue=res_data.taskState
				switch (stateValue)
					{
					case 0:
					  state="待分派";
					  break;
					case 1:
					  state="分派中";
					  break;
					case 2:
					   state="待服务";
					  break;
					case 3:
					  state="服务中";
					  break;
					case 4:
					  state="待会员确认";
					  break;
					case 5:
					  state="会员已确认";
					  break;
					case 7:
					  state="已成功关闭";
					  break;
					case 10:
					   state="待机构退款";
					   break; 
					case 11:
					   state="待会员确认收款";
					   break; 
				    case 13:
					   state="已撤销关闭";
					   break; 
					}
				let executeState=res_data.executeState

				let proj=res_data.serviceLabel//项目
				let orgName=res_data.orgName//机构
				let time=res_data.reserveDate+' '+res_data.reserveTime1+":00"+'~'+res_data.reserveTime2+":00"//时间
				let money=res_data.staffAmt//钱
				let user=res_data.custName//人名
				let kitReceiveState=res_data.kitReceiveState//kitReceiveState
				let kitGoodsId=res_data.kitGoodsId//kitGoodsId
				
				uni.navigateTo({//预约详情页
					url:'../../packageB/OrderDetail/index?num='+num
					+'&taskId='+this.taskId
					+'&billId='+this.billId
					+'&state='+state
					+'&stateValue='+stateValue
					+'&kitReceiveState='+kitReceiveState
					+'&kitGoodsId='+kitGoodsId
					+'&executeState='+executeState
					+'&proj='+proj
					+'&orgName='+orgName
					+'&time='+time
					+'&money='+money
					+'&user='+user
				})
			}
		}
	}
</script>

<style>
	.textCenter{
		width: 75%;
		margin:0 auto;
	}	
	page{
		overflow: hidden;
	}
</style>
