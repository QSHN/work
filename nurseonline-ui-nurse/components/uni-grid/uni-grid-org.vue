<template>
	<view class="uni-grid" :class="{'uni-grid-no-border':!showBorder,'uni-grid-no-out-border':showBorder && !showOutBorder}">
		<view class="uni-grid__flex" v-for="(items,i) in gridGroup" :key="i">
			<view style="overflow:hidden;" class="uni-grid-item max-width46-5p" hover-class="uni-grid-item-hover"
			 :hover-start-time="20" :hover-stay-time="70" v-for="(item,index) in items" :key="index"
			 :class="[index == columnNum ? 'uni-grid-item-last' : '','uni-grid-item-' + type,item.checked == 1 ?'activeBorder':'']" @tap="onClick(i,index)">
					<view class="uni-grid-item__content positionR">
						<text class="uni-grid-item-text positionA max-width92p" :class="[item.checked == 1 ?'active':'unActive']">{{item.text}}</text>
					</view>
			</view>
		</view>
		
		<view class="btn-area pt10">
			<button formType="submit" @tap="orgSubmit" class="bgc-6e8cfa">提交</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		name: "uni-grid",
		props: {
			options: Array,
			resRaw:Array,//所有请求到的数组
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
			clickCountIndex:0,
			
		},
		data() {
			return {
				resSubArr:[]//提交申请入驻的机构
			}
		},
		created() {
			if(this.options.length>0){
				this.columnNumber = this.gridGroup[0].length
			}
			
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
					return group
			}
		},
		methods: {
			async onClick(row, line) {
				if(this.gridGroup[row][line].checked==1){
					this.gridGroup[row][line].checked=0
					this.clickCountIndex=(row*4)+(line+1);
				}else{//未设置或为0时
					this.gridGroup[row][line].checked=1
					this.clickCountIndex=(row*4)+(line+1)+100;//二次点击
				}
				console.log("this.resRaw-uni-grid",this.resRaw)
				//console.log(this.gridGroup)
				let selectOrgIdArr=[]
				this.gridGroup.forEach((item,index)=>{
					item.forEach((childItem,childIndex)=>{
						if(childItem.checked==1){
							selectOrgIdArr.push(childItem.orgId)
						}
					})
				})
				console.log(selectOrgIdArr)//[1,2]orgId集合
				let res_info=await this.$apip.getPersonalInfo()
				let res_info_data=res_info.data.data
				let resSubArr=[]
				this.resRaw.find(value => {
					selectOrgIdArr.forEach((item,index)=>{
						if(value.orgId===item){
							value.versionNo=0
							value.staffId=res_info_data.staffId
							value.staffName=res_info_data.staffName
							resSubArr.push(value)
						}
					})
				})
				console.log(resSubArr)
				this.resSubArr=resSubArr
			},
			async orgSubmit(){
				console.log("this.resSubArr",this.resSubArr)
				if(this.resSubArr.length<1){
					uni.showModal({
						title: '提示',
						content: '尚未选择入驻机构，请点击选择您要入驻的服务机构',
						showCancel: false,
						cancelText: '',
						confirmText: '确定',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
					return false;
				}
				uni.showLoading({
					title:'提交申请中...'
				})
				let res_orgSubmit= await this.$api.postOrgList(this.resSubArr)
				uni.hideLoading()
			}
		}
	}
</script>

<style>
	@charset "UTF-8";
	.active{
		color:#333!important
	}
	.unActive{
		color:#999!important
	}
	.activeBorder{
		border-color:#6E8CFA!important
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
		height:150upx;
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
		font-size: 32upx;
		color: #b5b5b6;
		margin-top: 0upx;
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
		/* margin-left: 12upx */
	}
	.buttonStyle {
		color:#fff;
		width:29%;
		font-size:20rpx;
		/* border:none; */
		margin:0px 0px 0px 10px
	}
</style>