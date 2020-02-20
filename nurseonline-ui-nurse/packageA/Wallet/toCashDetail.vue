<template>
	<view style="background:#fff;">
		<view class="grace-idcard-main uni-padding-wrap uni-common-mt">
			
			<view class="wraperView"><!-- wraper开始 -->
			<!-- select option -->
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom"  v-for="(item,itemIndex) in SelectArr" :key="itemIndex">
				<view class="uni-title uni-common-pl">{{item.name}}</view>
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-db color999">
							<picker disabled="true" @change="IndexChange(itemIndex,$event)"  :value="item.initIndex" :range="item.array">
								<view class="uni-input inline-block">{{item.array[item.initIndex]}}</view>
								<text class="iconfont">&#xe6f8;</text>
							</picker>
						</view>
					</view>
				</view>
			</view>
			
			<!-- input -->
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(type,typeIndex) in InputList" :key="typeIndex">
				<view class="flex-item">{{type.name}}</view>
				<view>
					<view><input class="flex-item uni-input" v-model="type.value" name="type.name" :placeholder="type.placeholder" placeholder-class="holder"/></view>
					<view class="color-red text-alignR">{{type.reason}}</view>
				</view>
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
				   placeholder:"",
				   value:""
				  },
				  {name:"账户",
				   placeholder:"",
				   value:""
				  },
				  {name:"提现金额",
				   placeholder:"",
				   value:""
				  },
				   {name:"提现时间",
				   placeholder:"",
				   value:""
				  },
				  {name:"处理状态",
				   placeholder:"",
				   value:"",
				   reason:''
				  },
			  ],
			title: 'picker',
			SelectArr:[
			{name:"账户类型",IndexChange:"occupationIndexChange",array: ["支付宝","微信支付",'银行卡'],initIndex:0},
			],
			initNextPage:true,
			speciality:"",
			professionalIntro:"",
			res_data:Object//所接收对象
			}
		},
		onLoad(options) {
			this.$store.state.stepCurrent=0;
			console.log("options",options.data);
			this.res_data=JSON.parse(options.data);
			this.init();
		},
        computed: {
        },
		methods: {
			async init(){
				uni.showLoading({
				});
				this.InputList[0].value=this.res_data.accountName
				this.InputList[1].value=
				this.InputList[2].value=this.res_data.amt.toFixed(2)
				this.InputList[3].value=this.res_data.submitTime
				let stateLable
				if(this.res_data.state==0){
					stateLable="处理中"
				}else if(this.res_data.state==1){
					stateLable="处理完毕"
				}else if(this.res_data.state==2){
					stateLable="处理异常"
				}
				// else if(this.res_data.state==3){//处理状态变化 柏成190523
				// 	stateLable="处理异常"
				// }
				this.InputList[4].value=stateLable
				this.InputList[4].reason=this.res_data.reason
				this.SelectArr[0].initIndex=this.res_data.accountType
				uni.hideLoading()
			},
			async nextStepto2(){

				uni.navigateTo({
					url:'step2',
				})
			},
			IndexChange: function(itemIndex,e) {
				console.log('picker select数组为',itemIndex,'携带值为',e.target.value)
				console.log(e)
				this.SelectArr[itemIndex].initIndex = e.target.value
			},
			bindTextAreaBlur: function (e) {
            console.log(e.detail.value)
			},
			toToCashRecord(){
				uni.navigateTo({
					url:'toCashRecord'
				})
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
