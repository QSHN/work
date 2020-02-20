<template>
	<view>
		<!-- part1 -->
		<view class="goods-list positionR">
			<view class="product-list  pt20-im positionR">
				<view class="product">
					<view class="name border-bottom"><text>领取单号:{{item.num}}</text><text class="fr color-red">{{item.state}}</text></view>
					<view class="name">服务机构:{{item.ele[0].text}}</view>
					<view class="name">领取时间:{{item.ele[1].text}}</view>
					<view class="name">金额:{{item.ele[2].text}}</view>
				</view>
				
				<view class="positionA"  style="right:30upx;top:100upx">
					<button v-if="item.billState==2&&item.shipmentState==1&&refreshBtn"  @tap.stop.prevent="goDeal" class="width100p bgc-6e8cfa color-fff  font-size22 mt20" type="default">确认签收</button>
				</view>
				
			</view>

		</view>
		
		<!-- part2 -->
		<view class="goods-list">
			<view class="product-list ">
				<view class="product">
					<view class="uni-flex uni-row flex-box justify-content-space border-bottom padding-20">
							<label class="left-icon">服务对象信息</label>
							<view class="flex-item inline-block pl20 color6e8cfa"></view>
					</view>
					<view class="name">收货人:{{detailServe.custName}}</view>
					<view class="name uni-flex uni-row flex-box justify-content-space">
							<view class="flex-item inline-block">收货地址:{{detailServe.address}}</view>
					</view>
					<view class="name">联系电话:{{detailServe.linkmanPhone}}</view>
				</view>
				
			</view>
		</view>
		
		
		<!-- part3 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product padding-20 mt20">
					<label class="left-icon">耗材信息</label>
					
					<view v-for="(item,index) in consume" :key="index">
						<view class="uni-flex uni-row mt20">
							<view>{{item.goodsLabel}}</view>
							<view>{{item.price}}</view>
						</view>
						<view class="uni-flex uni-row mt20">
							<text>耗材费金额:</text>
							<view>￥{{item.price}}</view><view>* {{item.qty}}{{item.unit}}</view><view>=￥{{item.amt}}</view>
						</view>
					</view>
							
							
				</view>
			</view>
		</view>
		
	</view>
</template>
<script>
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
				stateValue:Number,//no button
				executeState:'',
				tabShow:1,
				show:true,
				ele:[
					{prop:"",label:"领取单号",text:''},
					{prop:"",label:"服务机构",text:""},
					{prop:"",label:"领取时间",text:'',isMoney:false},
					{prop:"",label:"金额",text:'',isMoney:true},
				],
				billState:'',
				shipmentState:''
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
			consume:[//耗材数组

			],
			options:{},
			refreshBtn:true
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
	onLoad(options) {
		_self = this;
		this.options=options
		this.init(options);
		console.log("options",options)
	},
	methods: {
		async init(options){
			uni.showLoading({})
			let res_billtask_taskId=await this.$apip.getConsumeDetail(options.billId)
			let res_data=res_billtask_taskId.data.data
			uni.hideLoading()
			//基本
			this.item.num=res_data[0].billId
			
			this.item.billState=options.billState
			this.item.shipmentState=options.shipmentState
			console.log(options.billState,options.shipmentState)
			this.item.ele[0].text=options.orgName
			this.item.ele[1].text=options.creatTime
			this.item.ele[2].text=options.amt
			this.detailServe.custName=options.linkman
			this.detailServe.address=options.address
			this.detailServe.linkman=options.linkman
			this.detailServe.linkmanPhone=options.phone
			//耗材
			res_data.forEach((item,index)=>{
				this.consume.push({
					goodsLabel:'消毒水1',//商品名称
					spec:'1瓶/盒',//规格
					unit:'盒',//单位
					price:'11',//单价
					qty:'10',//数量单位
					amt:'22',//金额
				})
				this.consume[index].goodsLabel=item.goodsLabel
				this.consume[index].spec=item.spec
				this.consume[index].unit=item.unit
				this.consume[index].price=item.price
				this.consume[index].qty=item.qty
				this.consume[index].amt=item.amt
			})
			
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
		previewImg1 : function(){
			uni.previewImage({
				urls:["http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//tar-nursing3.1.jpg"]
			});
		},
		previewImg2 : function(){
			uni.previewImage({
				urls:["http://bh.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//tar-nursing3.2jpg"]
			});
		},
		toConsumptive(){
			uni.navigateTo({
				url:'consumptive'
			})
		},

		/*确认签收*/
		goDeal(){//出门开始服务
			let billId=this.item.num
			uni.showModal({
				title: '提示',
				content: '请确认是否签收?',
				success: async (res)=> {
					if (res.confirm) {
						let res=await this.$apip.goDeal(this.item.num)
						if(res.data.code==0){
							this.$store.state.consumeRefresh++;
							this.refreshBtn=false
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
	background-color: rgb(244, 244, 244);
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