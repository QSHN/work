<template>
	<view style="background:#fff;">
		<view class="grace-idcard-main uni-padding-wrap uni-common-mt">
			<view class="bgc-6e8cfa color-fff uni-flex justify-content-space padding-20 ">
				<view class="ml20">可提现余额：</view><view class="">{{balance}}</view><view @tap="toToCashRecord" class="mr10">提现记录</view>
			</view>
			<view class="wraperView"><!-- wraper开始 -->
			<!-- select option -->
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom"  v-for="(item,itemIndex) in SelectArr" :key="itemIndex">
				<view class="uni-title uni-common-pl">{{item.name}}</view>
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-db color999">
							<picker @change="IndexChange(itemIndex,$event)"  :value="item.array[item.initIndex].value" :range="item.array" range-key="name">
								<view class="uni-input inline-block">{{item.array[item.initIndex].name}}</view>
								<text class="iconfont">&#xe6f8;</text>
							</picker>
						</view>
					</view>
				</view>
			</view>
			
			<!-- input -->
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(type,typeIndex) in InputList" :key="typeIndex">
				<view class="flex-item">{{type.name}}</view>
				<view><input class="flex-item uni-input" v-model="type.value" name="type.name" :placeholder="type.placeholder" placeholder-class="holder"/></view>
			</view>
			
			<!-- bankList -->
			<view v-if="SelectArr[0].initIndex==2" class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(type,typeIndex) in bankList" :key="typeIndex">
				<view class="flex-item">{{type.name}}</view>
				<view><input class="flex-item uni-input" v-model="type.value" name="type.name" :placeholder="type.placeholder" placeholder-class="holder"/></view>
			</view>
			
			<view style="margin-top:38upx;padding-bottom: 18px;">
				<button type="primary bgc-6e8cfa" :class="toCashDisabled?'bgc999':'bgc6e8cfa'" :disabled="toCashDisabled" @tap="toCashRecord">提现</button>
			</view>
			
			<!-- text -->
			<view class="goods-list">
				<view class="product-list">
					<view class="padding-20">
						<view class="uni-column padding-20 fontSizeListText mt20">
							<view>提现说明</view>
							<view>1、运营机构会在3个工作日内处理提现申请，提现结果可在提现记录查看</view>
							<view>2、有任何疑问，请联系客服400-5625-5859</view>
						</view>
					</view>
				</view>
			</view>
			
			</view><!-- wraper结束 -->
			
		</view>
	</view>
</template>

<script>
	export default {
        components: {
         
        },
		data() {
            return {
              type: 'month',
			  InputList:[
				  {name:"账户姓名",
				   placeholder:"请输入账户姓名，如提现人姓名",
				   value:""
				  },
				  {name:"账户",
				   placeholder:"请输入支付宝账户/微信账户/银行卡",
				   value:""
				  },
				  {name:"提现金额",
				   placeholder:"请输入提现金额",
				   value:""
				  },
			 ],
			  bankList:[
				{name:"银行卡代码",
				   placeholder:"",
				   value:""
				},
				  {name:"银行名称",
				   placeholder:"",
				   value:""
				},
			  ],
			title: 'picker',
			SelectArr:[
			{name:"账户类型",IndexChange:"occupationIndexChange",
			array: [
				{value:0,name:'支付宝'},
				{value:1,name:'微信支付'},
				{value:2,name:'银行卡'},
			],
			initIndex:0},
			],
			saveArr:{
				accountType:0,//账户类型，0-支付宝（默认），1-微信支付，2-银行卡
				accountName:'',//账户名称
				accountNo:'',//账户，比如银行卡号
				bankCode:'',//银行代码，参见item_class_code='bank’定义
				bankName:'',//银行名称
				amt:'',//提现金额
				},
			balance:'',
			toCashDisabled:true 
            }
			
		},
		onLoad() {
			this.$store.state.stepCurrent=0
			this.init()
		},
        computed: {
			InputList_c(){
				return this.InputList[2].value
			}
        },
		watch:{
			InputList_c(val){
				console.log(this.InputList[2].value)
				if(this.InputList[2].value.toString().indexOf('.')!=-1){
					if(this.InputList[2].value.toString().split(".")[1].length>2){
						console.log(this.InputList[2].value.toString().split(".")[1].length)
						uni.showToast({
							title:'请保留小数点后两位',
							icon:'none',
							mask:false
						})
						return false
						this.toCashDisabled=true
					}
				}
				if(this.InputList[2].value!=''&&this.InputList[2].value<=parseInt(this.balance)){
					this.toCashDisabled=false
				}else{
					uni.showToast({
						title:'提现金额不能为空或超过账户余额',
						icon:'none',
						mask:false
					})
					this.toCashDisabled=true
				}
			}
		},
		methods: {
			async init(){
				uni.showLoading({})
				let res=await this.$apip.getBalance()
				this.balance=res.data.data.toFixed(2)
				uni.hideLoading()
			},
			async toCashRecord(){
				this.saveArr.accountName=this.InputList[0].value
				this.saveArr.accountNo=this.InputList[1].value
				this.saveArr.amt=this.InputList[2].value
				
				this.saveArr.bankCode=this.bankList[0].value
				this.saveArr.bankName=this.bankList[1].value
				console.log(this.saveArr)
				uni.showLoading({
					
				})
				let res=await this.$apip.toCash(this.saveArr)
				uni.hideLoading()
				uni.navigateTo({
					url:'toCashRecord',
				})
			},
			IndexChange: function(itemIndex,e) {
				this.saveArr.accountType=this.SelectArr[itemIndex].array[e.detail.value].value
				console.log("this.saveArr.accountType",this.saveArr.accountType)
				this.SelectArr[itemIndex].initIndex  = e.detail.value
			},
			bindTextAreaBlur: function (e) {
            console.log(e.detail.value)
			},
			toToCashRecord(){//提现记录
				uni.navigateTo({
					url:'toCashRecord'
				})
			}
		}
	}
</script>

<style lang="scss">
	.bgc999{
		background-color: #999!important
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
</style>
