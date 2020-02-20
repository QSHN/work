<template>
	<view class="container">
		<view v-if="showNoAddr" class="width100p text-alignC mt40">暂无地址可用，请添加</view>
		<view v-else class="address-list">
			<view class="a-address positionR" v-for="(item,index) in addressList" :key="index">
				<view class="left-text" @tap="selectTap(item.id)">
					<text v-if="item.isDefault==1" class="iconfont color6e8cfa font-size60 positionA l3 t45">&#xe607;</text>
					<view class="name-tel">
						{{item.linkMan}} {{item.mobile}}
					</view>
					<view class="address-box flex-box justify-content-flexstart">
						<view class="bgc-6e8cfa color-fff p-0-10 mr10 boder-radius10">{{item.label}}</view>
						<view>{{item.zoneLabel}}{{item.address}}</view>
					</view>
				</view>
				<view class="" @tap="editAddess(item.id)"><text class="iconfont color6e8cfa font-size40 positionA r25 t55">&#xe63b;</text></view>
			</view>
		</view>
		<view class="bottom-box">
			<view class="add-btn" @tap="addAddess"><text class="iconfont color6e8cfa font-size50 positionA l5">&#xe6e0;</text><text>新建常用地址</text></view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList: [
					
				],
				showNoAddr:false
			}
		},
		onLoad() {
			this.init()
		},
		onPullDownRefresh() {
			console.log("下拉刷新")
			let refresh=true
			this.init(refresh);//下拉刷新初始化
			setTimeout(function () {
			    uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			async init(refresh){
				//初始渲染列表
				
				console.log("this.$store.state.addrArrindex",this.$store.state.addrArrindex)
				let res_addrApi = await this.$apip.getAddrListApi()
				let res_addr_data=res_addrApi.data.data
				let len=res_addrApi.data.data.length
				if(refresh){//刷新不追加
					
				}else{
					for(var i=0;i<len;i++){
						this.addressList.push({id: '',
								linkMan: '',
								mobile: '',
								address: '',
								zoneLabel:'',
								isDefault:1,
								label:''})
					}
				}
				//显示
				if(res_addr_data.length<=0){
					this.showNoAddr=true
					return ;
				}
				this.showNoAddr=false
				res_addr_data.forEach((item,index)=>{
					this.addressList[index].id=item.addressId
					this.addressList[index].linkMan=item.linkman
					this.addressList[index].mobile=item.phone.replace("86-","")
					this.addressList[index].address=item.address
					this.addressList[index].isDefault=item.isDefault
					this.addressList[index].label=item.label
					this.addressList[index].zipcode=item.zipcode
					this.addressList[index].zoneLabel=item.zoneLabel
					this.addressList[index].versionNo=item.versionNo
					this.addressList[index].position=item.position
				})
				console.log("this.addressList",this.addressList)
			},
			//设置默认地址
			async selectTap(id) {
				let res_info=await this.$apip.getPersonalInfo()
				let staffId=res_info.data.data.staffId
				let defaultAddressInfo={
					addressId:"",
					linkman:"",
					phone:"",
					address:"",
					isDefault:"",
					label:"",
					zoneLabel:"",
					zoneId:"-1",
					staffId:staffId,
					versionNo:"",
					position: "0 0", 
				}//设置当前默认地址
				
				this.addressList.forEach((item,index)=>{
					if(item.id==id){
						item.isDefault=1
						this.$store.state.defaultAddr=item.zoneLabel+'-'+item.address
						this.$store.state.addrArrindex=id
						this.$store.state.position=item.position
						console.log("id",id)
						console.log("defaultAddr",this.$store.state.defaultAddr)
						defaultAddressInfo.addressId=item.id
						defaultAddressInfo.linkman=item.linkMan
						defaultAddressInfo.phone=item.phone
						defaultAddressInfo.address=item.address
						defaultAddressInfo.isDefault=item.isDefault
						defaultAddressInfo.label=item.label
						defaultAddressInfo.zoneLabel=item.zoneLabel
						defaultAddressInfo.versionNo=item.versionNo
						defaultAddressInfo.position=item.position
					}else{
						item.isDefault=0
					}
				})
				uni.showLoading({})
				//保存default
				let res_addrDefault=await this.$apip.saveAddr(defaultAddressInfo)
				uni.hideLoading()
				uni.navigateTo({
					url:'../Calendar/index'
				})
			},
			//跳转到编辑地址
			editAddess(id) {
				console.log("edit item id:" + id);
				this.addressList.forEach((item,index)=>{
					if(item.id==id){
						this.$store.state.editAddr=item
					}
				})
				uni.navigateTo({
					url:'edit'
				})
			},
			addAddess() {
				uni.navigateTo({
					url:'add'
				})
			}
		}
	}
</script>

<style>
	.container {
		background-color: #F2f2f2;
	}

	.address-list {
		width: 100%;
		background-color: #fff;
		/* margin-top: 20upx; */
		/* padding-bottom: 100upx; */
	}

	.address-list .a-address {
		width: 100vw;
		/* margin-left: 30upx; */
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30upx 0;
		border-bottom: 10upx solid #eee;
	}

	.a-address .left-text {
		width: 610upx;
		box-sizing: border-box;
		padding-left: 70upx;
	}

	.a-address .left-text .name-tel {
		margin-bottom: 20upx;
	}

	.a-address .left-text .address-box {
		font-size: 24upx;
		color: #888888;
		line-height: 36upx;
	}

	.bottom-box {
		position: fixed;
		width: 100%;
		bottom: 0;
		font-size: 28upx;
		color: #000000;
		border-top: 1upx solid #eee;
		height: 100upx;
		line-height: 100upx;
		background: #fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAYCAYAAADzoH0MAAAAAXNSR0IArs4c6QAAAj1JREFUOBGVVE1LHEEQ7e4EkRBjiBL9AQqCQmB32d3xEMgxp6CCssEFFUMiBA+e9pKTgeBBBRGChEBCPAghISgiiEhu87Gzq/4Df4Yf292+Wulx2llXbRiq+1W9N9VVNcMYltaau2741fOqU3S+zxIUDOIKzAdIfXPdygRhd10ChCUQPxIBmQjO2XcIFu8sANox51wbAokA++H74VuDNbOcnAieRhnWLslRuORcjOfzqY0IabCpCxBOb1SK/cT2YSxOCsEKuVzmdwyztpEAob5fGdKabSCTllhUjTE+5jjpvzEs2loChLpu9TVjioJbTRQKe45nFJn8M5ixCQFyeF74CjXZRDEfR4EQEYKPZLPpLYORbShADt+vOlqrHVypnc600K0zNGwYmWxfIk0EKCAMw1StxnYh0mEIoJziGXKc1A5hN2ZgCEFw2C+l3Md1nhsM9gQ1eZPPZ3broxxzJLZayy6Qn1xzoNWijbCmAkFQfYmWUtGijmBPA1bEgP0hgfjQ0DlaQXAwKKWiYj0yIIqocOvJ+HQ2zKBcPswqJVGkeBvpe+HvQP5lBMkmiuh5lTTwPaT+1ATSx4aizeRy6TWDGWtlgN6/ABFtuyJTIMizjcjkiwTK5aMBDM4esGfkMAvTNwfyqjlft3UBDEyflOdIm3XaAaIE8rKN2acHnnfQq5T+D3K37RKfMG1fbCx5ErhvD2DrzbjzPMifk+FJpN4FFK8AoXU8Aj+QBXwspWToLQh+Ju/xV1q8JSzhvgCBx9kzUoIj2gAAAABJRU5ErkJggg==) no-repeat 705upx center;
		background-size: 15upx auto;
	}

	.bottom-box .add-btn {
		margin-left: 30upx;
		padding-left: 40upx;
	}
</style>
