<template>
	<view>
		<view class="uni-grid" :class="{'uni-grid-no-border':!showBorder,'uni-grid-no-out-border':showBorder && !showOutBorder}">
			<view class="">
				<view class="uni-grid__flex padding-20" v-for="(items,i) in gridGroup" :key="i">
					<view class="iconSize" v-for="(item,index) in items" :key="index">
							<image class="imgServeIcon" :src="item.iconUrl"></image>
					</view>
					<view class="width100p">
						<view v-for="(item,index) in items" :key="index" @tap="onClick(i,index)">
								<view class="justify-content-space uni-flex mb10">
									<text class="uni-grid-item-text uni-item active">{{item.text}}</text>
									<checkbox :checked="item.checked == 1 ?true:false" class="uni-item mr20 checkboxSIze"></checkbox>
								</view>
								<text class="uni-grid-item-text">{{item.guide}}</text>	
						</view>
					</view>	
				</view>
			</view>
			<view style="width: 100%; height:200upx"></view><!-- 占位 -->
		</view>
		<view class="bottomSelect">
			<view class="btn-area flex-box uni-row justify-content-flexstart">
				<button  class="bgc-fff borderC-6e8cfa color6e8cfa uni-item buttonStyle" @tap="allHours">全选</button>
				<button  class="bgc-fff borderC-6e8cfa color6e8cfa uni-item buttonStyle" @tap="zeroHours">清除</button>
			</view>
			<view class="">
				<view @tap="backToIndex" class="btn-save bgc-6e8cfa text-alignC color-fff">保存</view>
			</view>
		</view>
		
	</view>	
</template>

<script>
	export default {
		name: "uni-grid",
		props: {
			options: Array,
			res_all_data:Array,
			type: { //布局格式，长方形oblong，正方形square
				type: String,
				default: 'oblong'
			},
			columnNum: { //每一行有多少个
				type: [Number, String],
				default: 1
			},
			showOutBorder: { //显示外边框
				type: [Boolean, String],
				default: false
			},
			showBorder: { //是否显示border，如果为false，showOutBorder无效
				type: [Boolean, String],
				default: false
			},
			clickCountIndex:0
		},
		data() {
			return {
				serviceIdArr:[],//所选id Array
			}
		},
		created() {
			this.columnNumber = 2
		},
		onLoad() {
			
		},
		computed: {
			gridGroup() {
				let group = []
				let groupItem = []
					this.options && this.options.forEach((item, index) => {
						this.clickCountIndex=0
						groupItem.push(item)
						if (index % this.columnNum === this.columnNum - 1) {
							group.push(groupItem)
							groupItem = []
						}
					})
				
				if (groupItem.length > 0) {
					group.push(groupItem)
				}
				groupItem = null
				console.log("group",group)
				return group
			}
		},
		methods: {
			onClick(row, line) {
				if(this.gridGroup[row][line].checked==1){
					this.gridGroup[row][line].checked=0
					this.clickCountIndex=(row*4)+(line+1);
				}else{//未设置或为0时
					this.gridGroup[row][line].checked=1
					this.clickCountIndex=(row*4)+(line+1)+100;//二次点击
				}
				console.log(this.gridGroup)
				console.log(this.clickCountIndex)
				this.serviceIdArr=[]
				this.gridGroup.forEach((item,index)=>{
					item.forEach((childItem,childIndex)=>{
						if(childItem.checked==1){
							this.serviceIdArr.push(childItem.serviceId)
						}
					})
				})
				console.log("serviceIdArr",this.serviceIdArr)
			},
			allHours(){
				this.gridGroup.forEach((item,index)=>{
					item.forEach((i,i_index)=>{
						i.checked=1
					})
				})
				this.clickCountIndex=25;
				this.serviceIdArr=[]
				this.gridGroup.forEach((item,index)=>{
					item.forEach((childItem,childIndex)=>{
						if(childItem.checked==1){
							this.serviceIdArr.push(childItem.serviceId)
						}
					})
				})
				console.log("serviceIdArr",this.serviceIdArr)
			},
			zeroHours(){
				this.gridGroup.forEach((item,index)=>{
					item.forEach((i,i_index)=>{
						i.checked=0
					})
				})
				this.clickCountIndex=26;
				this.serviceIdArr=[]
				this.gridGroup.forEach((item,index)=>{
					item.forEach((childItem,childIndex)=>{
						if(childItem.checked==1){
							this.serviceIdArr.push(childItem.serviceId)
						}
					})
				})
				console.log("serviceIdArr",this.serviceIdArr)
			},
			async backToIndex(){
				let submitArr=[]
				this.serviceIdArr.forEach((item,index)=>{
					this.res_all_data.forEach((item_res,index_res)=>{
						if(item_res.serviceId==item){
							submitArr.push(item_res)
						}
					})
				})
				console.log(submitArr)
				uni.showLoading({})
				let res=await this.$apip.saveGoodatServe(submitArr)
				uni.hideLoading()
				uni.navigateBack({
					url:'index'
				})
			},
		}
	}
</script>

<style>
	@charset "UTF-8";
	.iconSize{
		margin-right: 20upx;
	}
	.checkboxSIze{
		/* width:100upx;
		height:100upx;
		font-size: 100upx; */
		transform: scale(1.2);
	}
	.imgServeIcon{
		width:100upx;
		height: 100upx;
		display: auto;
	}
	.guideText{
		height:auto;
		width: 100%;
		color: #999999;
		padding:5upx;
	}
	.btn-save{
		width: 50%;
		border-radius:10upx;
		margin-bottom: 10upx;
		margin-top: 20upx;
		margin-left:50rpx;
		padding:10rpx;

	}
	.bottomSelect{
		position: fixed;
		bottom:0upx;
		width:107%;
		background:white;
		padding:10rpx 0rpx;
		z-index: 9999;
	}
	.active{
		color:black!important
	}
	.unActive{
		color:#b5b5b6!important
	}
	.uni-grid {
		position: relative;
		display: flex;
		flex-direction: column
	}

	.uni-grid__flex {
		display: flex;
		flex-direction: row;
		border-bottom:1upx dashed #999;
	}

	.uni-grid-item {
		display: flex;
		position: relative;
		flex-direction: column;
		flex: 1;
		margin:10upx;
		border:1px solid #b5b5b6;
		border-radius:10upx;
		height:60rpx;
		overflow: hidden;
		padding: 5upx;
	}
	.uni-grid-item:before {
		display: block;
		content: " ";
		padding-bottom: 100%
	}

	.uni-grid-item:after {
		content: '';
		position: absolute;
		z-index: 1;
		transform-origin: center;
		box-sizing: border-box;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
		border-color: #c8c7cc;
		border-style: solid;
		border-width: 1px;
		-webkit-transform: scale(.5);
		transform: scale(.5);
		border-top-width: 0;
		border-left-width: 0
	}

	.uni-grid-item__content {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.uni-grid-item-text {
		font-size: 25upx;
		color: #b5b5b6;
		margin-top: 12upx;
		
	}

	.uni-grid-item-hover {
		background-color: #f1f1f1
	}

	.uni-grid-item-image {
		width: 80upx;
		height: 80upx
	}

	.uni-grid .uni-grid__flex:first-child .uni-grid-item:after {
		border-top-width: 1px
	}

	.uni-grid .uni-grid__flex .uni-grid-item:first-child:after {
		border-left-width: 1px
	}

	.uni-grid.uni-grid-no-out-border .uni-grid__flex:first-child .uni-grid-item:after {
		border-top-width: 0
	}

	.uni-grid.uni-grid-no-out-border .uni-grid__flex:last-child .uni-grid-item:after {
		border-bottom-width: 0
	}

	.uni-grid.uni-grid-no-out-border .uni-grid__flex .uni-grid-item:first-child:after {
		border-left-width: 0
	}

	.uni-grid.uni-grid-no-out-border .uni-grid__flex .uni-grid-item:last-child:after {
		border-right-width: 0
	}

	.uni-grid.uni-grid-no-border .uni-grid-item:after {
		border-width: 0
	}

	.uni-grid.uni-grid-no-border .uni-grid__flex:first-child .uni-grid-item:after {
		border-top-width: 0
	}

	.uni-grid.uni-grid-no-border .uni-grid__flex .uni-grid-item:first-child:after {
		border-left-width: 0
	}

	.uni-grid-item-oblong.uni-grid-item:before {
		padding-bottom: 60%
	}

	.uni-grid-item-oblong .uni-grid-item__content {
		flex-direction: row
	}

	.uni-grid-item-oblong .uni-grid-item-image {
		width: 52upx;
		height: 52upx
	}

	.uni-grid-item-oblong .uni-grid-item-text {
		margin-top: 0;
		margin-left: 12upx
	}
	.buttonStyle {
		color:#fff;
		width:29%;
		font-size:20rpx;
		/* border:none; */
		margin:0px 0px 0px 10px
	}
</style>