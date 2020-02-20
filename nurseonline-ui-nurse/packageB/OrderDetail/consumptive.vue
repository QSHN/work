<template>
	<view style="background:#fff;">
		<view class="grace-idcard-main uni-padding-wrap uni-common-mt">
			
			<view class="wraperView"><!-- wraper开始 -->
			<view class="uni-title uni-common-pl padding"><view class="left-icon">订单所需耗材</view></view>
			<view class="padding">{{kitGoodsLabel}}</view>
			<view class="padding">耗材费金额：￥{{price}}*{{kitScale}}*{{qty_a}}=￥{{kitAmt}}</view>
			<view class="uni-title uni-common-pl padding"><view class="left-icon">收货地址</view></view>
			
			<!-- input -->
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(type,typeIndex) in InputList" :key="typeIndex">
				<view v-if='typeIndex!=1' class="uni-flex justify-content-space width100p">
					<view class="flex-item">{{type.name}}</view>
					<view><input class="flex-item uni-input" v-model="type.value" name="type.name" :placeholder="type.placeholder" placeholder-class="holder"/></view>
				</view>
				<view v-else class="uni-flex justify-content-space width100p">
					<view class="flex-item">{{type.name}}</view>
					<view>
						<picker mode="region" :value="type.value" @change="bindRegionChange" :custom-item="customItem">
							<view v-if="type.value">{{type.value}}</view>
							<view class="font-grey" v-else>省市区县、乡镇等</view>
						</picker>
					</view>
				</view>
			</view>

			<view style="margin-top:38upx;padding-bottom: 18px;">
				<button type="primary color6d8bf9" @tap="consumptiveSubmit">提交</button>
			</view>
			
			</view><!-- wraper结束 -->
		</view>
	</view>
</template>

<script>
	let res_data;
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
				stockBillItems:{}
				},
			kitGoodsLabel:'',
			price:'',
			qty_a:'',
			qty:'',
			kitAmt:'',
			kitScale:'',
			amt_submit:'',
			kty_submit:''
            }
			
		},
		onLoad(options) {
			this.$store.state.stepCurrent=0
			this.init(options.taskId)
		},
        computed: {
        },
		methods: {
			async init(taskId){
				let res=await this.$apio.billtaskBytaskId(taskId)
				res_data=res.data.data
				this.saveArr=res_data
				this.kitGoodsLabel=res_data.kitGoodsLabel
				this.price=res_data.kitAmt/res_data.kitScale
				this.qty_a=res_data.qty//显示
				this.kitAmt=res_data.kitAmt
				this.kitScale=res_data.kitScale
			},
			async consumptiveSubmit(){
				uni.showLoading({})
				this.saveArr.linkman=this.InputList[0].value
				this.saveArr.phone=this.InputList[3].value
				this.saveArr.address=this.InputList[1].value+this.InputList[2].value
				
				console.log("res_data.kitGoodsId",res_data.kitGoodsId)
				let keyId=res_data.kitGoodsId
				this.saveArr.stockBillItems={}
				this.saveArr.stockBillItems[keyId]=res_data.qty*res_data.kitScale//所提交的qty数据
				this.saveArr.relBillId=res_data.billId;
				this.saveArr.sellOrgId=res_data.orgId;
				this.saveArr.relBillType=res_data.billType;
				this.saveArr.relTaskId=res_data.taskId;
				this.saveArr.linkman=res_data.linkman;
				this.saveArr.phone=res_data.phone;
				this.saveArr.address=res_data.address;
				
				// this.saveArr.kitGoodsId=this.kitGoodsId;
				// this.saveArr.qty=this.qty;
				// let data={
				// 		"billNo" : "2",
				// 		"billType" : 0,
				// 		"shipmentType" : 1,
				// 		"sellOrgId" : 0,
				// 		"sellOrgName" : "c",
				// 		"buyOrgId" : 1,
				// 		"buyOrgName" : "b",
				// 		"relBillId" : 1,
				// 		"relBillType" : 0,
				// 		"relTaskId" : 5,
				// 		"amt" : 28.65,
				// 		"linkman" : "李四",
				// 		"phone" : "135456814",
				// 		"zoneId" : 51,
				// 		"address" : "广东省广州市天河区华普广场2303",
				// 		"stockBillItems" : [
				// 			{	
				// 			}]
				// }
				let res=await this.$apio.consumptive(this.saveArr)
				console.log("res领取耗材包",res)
				let billId_c=res.data.data.billId
				let res_commit=await this.$apio.commit_consumptive(billId_c)//更改提交状态 190523
				uni.hideLoading()
				if(res.data.code==0){
					this.$store.state.orderRefresh++
					uni.switchTab({
							url:'../../pages/Order/index',
					})
				}else{
					uni.showToast({
						title:'领取失败'+res.data.msg,
						icon:'none'
					})
				}
				
			},
			IndexChange: function(itemIndex,e) {
				console.log('picker select数组为',itemIndex,'携带值为',e.target.value)
				console.log(e)
				this.SelectArr[itemIndex].initIndex = e.target.value
			},
			bindTextAreaBlur: function (e) {
            console.log(e.detail.value)
			},
			bindRegionChange(e) {
				let zone = e.detail.value
				this.InputList[1].value = zone.join('-')
			},
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
</style>
