<template>
	<view class="uni-grid" :class="{'uni-grid-no-border':!showBorder,'uni-grid-no-out-border':showBorder && !showOutBorder}">
		<view class="uni-grid__flex" v-for="(items,i) in gridGroup" :key="i">
			<view class="uni-grid-item" hover-class="uni-grid-item-hover" :hover-start-time="20" :hover-stay-time="70" v-for="(item,index) in items" :key="index" :class="[index == columnNum ? 'uni-grid-item-last' : '','uni-grid-item-' + type]" @tap="onClick(i,index)">
				<view class="uni-grid-item__content">
					<text class="uni-grid-item-text" :class="[item.checked == 0 ?'active':'unActive']">{{item.text}}</text><!-- 0-空闲，1-勿扰（个人级别），2-勿扰（系统级别） -->
				</view>
			</view>
		</view>
		<view class="btn-area flex-box uni-row justify-content-flexstart">
			<button  class="bgc-fff borderC-6e8cfa color6e8cfa uni-item buttonStyle" @tap="allHours">全天接单</button>
			<button  class="bgc-fff borderC-6e8cfa color6e8cfa uni-item buttonStyle" @tap="zeroHours">全天不接单</button>
			<button  class="bgc-fff borderC-6e8cfa color6e8cfa uni-item buttonStyle" @tap="defaultHours">引用默认排班表</button>
		</view>
		
		<view class="uni-column border-bottom padding-20 fontSizeListText mt20 ml20">
			<view>护士排班说明</view>
			<view>1.根据您设置的可接单时间以及常在地点，更优的为您分派订单</view>
			<view>2.可以设置本周以及本周后4周的可接单时间</view>
			<view>3.请注意及时设置排班时间，否则将无法收到转约订单</view>
			<view>4.选择时间，如选中7：00，则视为7：00~7:59您可以接单</view>
		</view>
		<view class="flex-box justify-content-center padding-20 color6e8cfa" @tap="setDefaultHours">设置为默认排班表</view>
		
		<view class="btn-area">
			<button formType="submit" @tap="saveArrange" class="bgc-6e8cfa">保存</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		name: "uni-grid",
		props: {
			options: Array,
			//timePlan_Arry_temp:Array,//当前所选天的排班表
			indexDay:Number,//当前天 index
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
			timePlan_Arry:[],//当前 0,1是否勾选数组 1维数组
			//七天排班
			initArr:Array,
			res_calendar_data:{}//初始获取到的当周的排班信息
		},
		data() {
			return {
				submitObj:{
					  addressId: 0,
					  addressPosition:"string",
					  addressZoneId: 0,
					  data1:"string",
					  data2:"string",
					  data3:"string",
					  data4:"string",
					  data5:"string",
					  data6:"string",
					  data7:"string",
					  label:"string",
					  orgId: 0,
					  scheduleId:'',
					  staffId: 0,
					  versionNo: 0,
					  beginDate:"",
					  addressId:""
				},//要提交的对象
			}
		},
		created() {
			this.columnNumber = this.gridGroup[0].length;
		},
		onLoad() {
		},
		computed: {
			gridGroup() {
				if(typeof(this.initArr)=="undefined"){
					this.initArr=this.initArr
				}
				let old = this.initArr
				let newArr=old.concat()
				console.log("this.indexDay",this.indexDay)
				let newsigleArr=newArr[this.indexDay]
				console.log("newsigleArr",newsigleArr)
				let group = []
				let groupItem = []
				this.options && this.options.forEach((item, index) => {
					this.clickCountIndex=0
					//将当前数组赋值给当前页的check状态
					item.checked=newsigleArr[index]
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
			onClick(row, line) {//选择
				if(this.gridGroup[row][line].checked==0){
					this.gridGroup[row][line].checked=1
					this.clickCountIndex=(row*4)+(line+1);
				}else{//未设置或为1时 //默认为1不选中 190510
					this.gridGroup[row][line].checked=0
					this.clickCountIndex=(row*4)+(line+1)+100;//二次点击
				}
				let timePlan_Arry=[]
				this.gridGroup.forEach((item,index)=>{
					item.forEach((childItem,childIndex)=>{
						if(childItem.checked==0){
							timePlan_Arry.push(0)
						}else{
							timePlan_Arry.push(1)
						}
					})
				})
				this.timePlan_Arry=timePlan_Arry
				this.initArr[this.indexDay]=this.timePlan_Arry
				console.log("this.initArr",this.initArr)
				
			},
			allHours(){//全选
				this.gridGroup.forEach((item,index)=>{
					item.forEach((i,i_index)=>{
						i.checked=0
					})
				})
				this.clickCountIndex=25;
				let timePlan_Arry=[]
				this.gridGroup.forEach((item,index)=>{
					item.forEach((childItem,childIndex)=>{
						if(childItem.checked==0){
							timePlan_Arry.push(0)
						}else{
							timePlan_Arry.push(1)
						}
					})
				})
				this.timePlan_Arry=timePlan_Arry
				this.initArr[this.indexDay]=this.timePlan_Arry
				console.log("this.initArr",this.initArr)
			},
			zeroHours(){//清除
				this.gridGroup.forEach((item,index)=>{
					item.forEach((i,i_index)=>{
						i.checked=1
					})
				})
				this.clickCountIndex=26;
				let timePlan_Arry=[]
				this.gridGroup.forEach((item,index)=>{
					item.forEach((childItem,childIndex)=>{
						if(childItem.checked==0){
							timePlan_Arry.push(0)
						}else{
							timePlan_Arry.push(1)
						}
					})
				})
				this.timePlan_Arry=timePlan_Arry
				this.initArr[this.indexDay]=this.timePlan_Arry
				console.log("this.initArr",this.initArr)
			},
			async defaultHours(){//引用默认排班表
				uni.showLoading({
					title:"引用默认排班..."
				})
				let res= await this.$apip.getDefaultModel(this.$store.state.beginDate);
				uni.hideLoading()
				
				let res_defaultAddr
				let initArrIndexArr=[];
				let initArrIndexArr_c=[];
				let len=7
				console.log(res.data.data.length)
				if(res.data.data.length>0){
					res_defaultAddr=res.data.data[0]
					for (var i=0;i<len;i++) {
						initArrIndexArr_c[i]=[]
						initArrIndexArr[i]=res_defaultAddr["data"+(i+1)]
						initArrIndexArr_c[i]=(initArrIndexArr[i].split('').map(function(item) {return +item;}))
					}
					this.initArr=initArrIndexArr_c
					console.log("默认排班的数组：当前天",this.initArr)
				}else{
					uni.showToast({
						title:'暂无排班表',
						icon:'none'
					})
				}
				
			},
			async setDefaultHours(){//设置默认排班表
			   
				let res= await this.$apip.getDefaultModel(this.$store.state.beginDate);
				let res_defaultAddr=res.data.data[0]
				let setDefault={}
				console.log(res.data.data)
				//getPersonalInfo 个人信息
				let res_info= await this.$apip.getPersonalInfo()
				let res_info_data=res_info.data.data
				setDefault.data1=this.initArr[0].join('')
				setDefault.data2=this.initArr[1].join('')
				setDefault.data3=this.initArr[2].join('')
				setDefault.data4=this.initArr[3].join('')
				setDefault.data5=this.initArr[4].join('')
				setDefault.data6=this.initArr[5].join('')
				setDefault.data7=this.initArr[6].join('')
				setDefault.staffId=res_info_data.staffId
				setDefault.addressId=this.$store.state.addrArrindex//addressId
				setDefault.addressPosition=this.$store.state.position//position
				//判断是新增操作还是修改操作
				if(res_defaultAddr!=null||res_defaultAddr==''){//修改默认排班 PUT
					setDefault.versionNo=res_defaultAddr.versionNo
					setDefault.orgId=res_defaultAddr.orgId
					setDefault.scheduleId=res_defaultAddr.scheduleId
					setDefault.label=0
					setDefault.addressZoneId=0
					let res= await this.$apip.changeDefaultModel(setDefault);
				}else{//新增默认排班 POST
					setDefault.versionNo=1
					setDefault.orgId=0
					setDefault.label=0
					setDefault.addressZoneId=0
					let res= await this.$apip.addDefaultModel(setDefault);
				}
			},
			async saveArrange(){//保存排班表
				let res_info= await this.$apip.getPersonalInfo()
				let res_info_data=res_info.data.data
				
				this.submitObj.data1=this.initArr[0].join('')
				this.submitObj.data2=this.initArr[1].join('')
				this.submitObj.data3=this.initArr[2].join('')
				this.submitObj.data4=this.initArr[3].join('')
				this.submitObj.data5=this.initArr[4].join('')
				this.submitObj.data6=this.initArr[5].join('')
				this.submitObj.data7=this.initArr[6].join('')
				this.submitObj.staffId=res_info_data.staffId
				//如果初始排班表不为空，则获取其versionNo，否则赋值1
				if(this.res_calendar_data!=null){//versionNo
					this.submitObj.versionNo=this.res_calendar_data.versionNo
					this.submitObj.scheduleId=this.res_calendar_data.scheduleId//scheduleId
				}else{
					this.submitObj.versionNo=1
				}
				this.submitObj.addressId=this.$store.state.addrArrindex//addressId
				
				this.submitObj.addressPosition=this.$store.state.position//position
				this.submitObj.beginDate=this.$store.state.beginDate//beginDate
				
				console.log("this.submitObj",this.submitObj)
				uni.showLoading({
					title:"保存中..."
				})
				console.log("this.$store.state.addrPostOrPut",this.$store.state.addrPostOrPut)
				if(this.$store.state.addrPostOrPut=="POST"){//新增地址
					console.log("add address")
					let res= await this.$apip.addCalendar(this.submitObj);
					uni.hideLoading()
					if(res.data.code==0){
						uni.showModal({
							title: '提示',
							content: '保存成功！快去接单吧！',
							showCancel: true,
							cancelText: '取消',
							confirmText: '确认',
							success: res => {
								if (res.confirm) {
										uni.switchTab({
											url:'../../pages/PersonalCenter/index'
										})
									} else if (res.cancel) {
										console.log('用户点击取消');
								}
							},
							fail: () => {},
							complete: () => {}
						});
					}
				}else if(this.$store.state.addrPostOrPut=="PUT"){//修改地址
					console.log("change address")
					let res= await this.$apip.changeCalendar(this.submitObj);
					uni.hideLoading()
					if(res.data.code==0){
						uni.showModal({
							title: '提示',
							content: '保存成功！快去接单吧！',
							showCancel: true,
							cancelText: '取消',
							confirmText: '确认',
							success: res => {
								if (res.confirm) {
										uni.switchTab({
											url:'../../pages/PersonalCenter/index'
										})
									} else if (res.cancel) {
										console.log('用户点击取消');
								}
							},
							fail: () => {},
							complete: () => {}
						});
					}
				}
			}
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
		align-items: center
	}

	.uni-grid-item-text {
		font-size: 32upx;
		color: #b5b5b6;
		margin-top: 12upx
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