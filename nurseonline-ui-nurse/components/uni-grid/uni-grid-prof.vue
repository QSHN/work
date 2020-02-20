<template>
	<view class="uni-grid" :class="{'uni-grid-no-border':!showBorder,'uni-grid-no-out-border':showBorder && !showOutBorder}">
		<view class="uni-grid__flex" v-for="(items,i) in gridGroup" :key="i">
			<view class="uni-grid-item max-w-23p" hover-class="uni-grid-item-hover" 
			:hover-start-time="20" :hover-stay-time="70" v-for="(item,index) in items" :key="index" 
			:class="[index == columnNum ? 'uni-grid-item-last' : '','uni-grid-item-' + type]" @tap="onClick(i,index)">
				<view class="uni-grid-item__content" >
					<text class="uni-grid-item-text" :class="[item.checked == 1 ?'active':'unActive']">{{item.text}}</text>
				</view>
			</view>
		</view>
		<view class="btn-area flex-box uni-row justify-content-flexstart">
			<button  class="bgc-fff borderC-6e8cfa color6e8cfa uni-item buttonStyle" @tap="allHours">全选</button>
			<button  class="bgc-fff borderC-6e8cfa color6e8cfa uni-item buttonStyle" @tap="zeroHours">清除</button>
		</view>
		
		<view class="btn-area pt10">
			<button formType="submit" @tap="backToIndex" class="bgc-6e8cfa">保存</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		name: "uni-grid",
		props: {
			options: Array,
			res_all_data:Array,
			staffId:'',
			type: { //布局格式，长方形oblong，正方形square
				type: String,
				default: 'oblong'
			},
			columnNum: { //每一行有多少个
				type: [Number, String],
				default: 3
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
				idArr:[]//所选id Array
			}
		},
		created() {
			this.columnNumber = this.gridGroup[0].length
		},
		onLoad() {
			this.init()
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
				return group
			}
		},
		methods: {
			init(){

			},
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
				this.idArr=[]
				this.gridGroup.forEach((item,index)=>{
					item.forEach((childItem,childIndex)=>{
						if(childItem.checked==1){
							this.idArr.push(childItem.itemId)
						}
					})
				})
				console.log("idArr",this.idArr)
			},
			allHours(){
				this.gridGroup.forEach((item,index)=>{
					item.forEach((i,i_index)=>{
						i.checked=1
					})
				})
				this.clickCountIndex=25;
				this.idArr=[]
				this.gridGroup.forEach((item,index)=>{
					item.forEach((childItem,childIndex)=>{
						if(childItem.checked==1){
							this.idArr.push(childItem.itemId)
						}
					})
				})
				console.log("idArr",this.idArr)
			},
			zeroHours(){
				this.gridGroup.forEach((item,index)=>{
					item.forEach((i,i_index)=>{
						i.checked=0
					})
				})
				this.clickCountIndex=26;
				this.idArr=[]
				this.gridGroup.forEach((item,index)=>{
					item.forEach((childItem,childIndex)=>{
						if(childItem.checked==1){
							this.idArr.push(childItem.itemId)
						}
					})
				})
				console.log("idArr",this.idArr)
			},
			async backToIndex(){
				let submitArr=[]
				this.idArr.forEach((item,index)=>{
					this.res_all_data.forEach((item_res,index_res)=>{
						if(item_res.itemId==item){
							// submitArr.push(item_res) //报错0530
							submitArr.push({staffId:this.staffId,specialist:item_res.itemId,specialistName:item_res.itemName})
						}
					})
				})
				console.log("submitArr",submitArr)
				uni.showLoading({})
				let res=await this.$apip.saveGoodatProf(submitArr)
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
		flex-direction: row
	}

	.uni-grid-item {
		display: flex;
		position: relative;
		flex-direction: column;
		flex: 1;
		margin:20upx 10upx;
		border:1px solid #b5b5b6;
		border-radius:10upx;
		height:60rpx;
		overflow: hidden;
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