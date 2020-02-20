<template>
	<view>
		<view class="wraperView">
			<view @tap="toHomePage" class="width100p text-alignR"><text class="iconfont color6e8cfa mr10">&#xe62b;</text>首页</view>
			<view class="flex-box uni-row justify-content-space border-bottom padding-20" @tap="toAddress">
				<view>{{AdressLabel}}</view>
				<view class="uni-item tr disabled">{{AdressPlaceholder}}<text class="iconfont">&#xe6f8;</text></view>
			</view>
			
			<view class="flex-box uni-row justify-content-space mt20">
				<view class="uni-item " @tap="before7days"><text class="iconfont color6e8cfa ml20" style="">&#xe637;</text></view>
				<view class="uni-item">{{firstD}}~{{lastD}}<text class="ml10">排班表</text></view>
				<view class="uni-item" @tap="after7days"><text class="iconfont color6e8cfa mr20" style="">&#xe635;</text></view>
			</view>
			<!-- 日期滑动 -->
			<view class="category border-bottom">
				<view class="box">
						<view class="swiper" duration="300" :style="{ height: categoryHeight }" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"
						 @touchcancel="touchEnd" @change="categoryChange">
						 
								<view class="category-list">
									<view class="icon" v-for="(oneday,onedayIndex)  in dataList_Computer" :class="{activeDay: oneday.isDay}" :key="onedayIndex" @tap="toCategory(onedayIndex)">
										<view :class="{activeFontColor: oneday.isDay}">{{ dateLabel[onedayIndex] }}</view>
										<view :class="{activeFontColor: oneday.isDay}" class="pb10">{{ oneday.date }}</view>
									</view>
								</view>

						</view>
				</view>	
			</view>
			<!-- uni-grid -->
			<uni-grid :options="hourList" :indexDay="indexDay" :initArr="calendar_Computer" :res_calendar_data="res_calendar_data" column-num="4"></uni-grid>

		</view>	<!-- wraperView结束 -->
	</view>
</template>

<script>
import moment from 'moment'
import uniGrid from "@/components/uni-grid/uni-grid.vue"
export default {
	 components: {
		 uniGrid
	 },
	data() {
		return {
			//分类
			AdressLabel:"常用地址",
			AdressPlaceholder:"未添加",
			dateList:Array,//日期（周）数组
			tapIsDay:0,
			dateLabel:["周一","周二","周三","周四","周五","周六","周日"],
			categoryHeight: '',
			currentPageindex: 0,
			headerPosition:"fixed",
			loadingText:"正在加载...",
			//排班
			direction:"",//滑动方向
			//二十四小时维度
			hourList:[{text:'00:00'},{text:'01:00'},{text:'02:00'},{text:'03:00'},{text:'04:00'},{text:'05:00'},
				{text:'06:00'},{text:'07:00'},{text:'08:00'},{text:'09:00'},{text:'10:00'},{text:'11:00'},
				{text:'12:00'},{text:'13:00'},{text:'14:00'},{text:'15:00'},{text:'16:00'},{text:'17:00'},
				{text:'18:00'},{text:'19:00'},{text:'20:00'},{text:'21:00'},{text:'22:00'},{text:'23:00'}],
			//当前天：数组（七天）中的哪一个
			indexDay:Number,
			initArrIndex:[//传给uni-grid的值
			],
			initArrIndexInit:[//初始化的值
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
			],
			initArrIndexArr_c:[],//从后台获取的值
			firstD:"",
			lastD:"",
			res_calendar_data:{}//初始获取当周排班信息
		};
	},
	computed:{
		dataList_Computer(){
			let group=[]
			this.dateList && this.dateList.forEach((item, index) => {
				
			})
			this.tapIsDay=0
			group=this.dateList
			return group
		},
		calendar_Computer(){
			if(this.initArrIndexArr_c.length<1){//后台无值传回
				this.initArrIndex=this.initArrIndexInit
			}else{
				this.initArrIndex=this.initArrIndexArr_c
			}
			return  this.initArrIndex;    
		},
		watchAddr() {
			return this.$store.state.defaultAddr;
		},
		watchPosition() {
			return this.$store.state.position;
		}
	},
	watch: {
		watchAddr(val) {
			this.AdressPlaceholder=this.$store.state.defaultAddr
		},
		watchPosition(){
			console.log("position",this.$store.state.position)
		}
	},
	onReady() {
		
	}, 
	onPageScroll(e){
		//兼容iOS端下拉时顶部漂移
		if(e.scrollTop>=0){
			this.headerPosition = "fixed";
		}else{
			this.headerPosition = "absolute";
		}
	},
	onLoad() {
		this.init()
	},
	created() {
		this.startX = 0
		this.startY = 0
		this.btnGroupWidth = 0
		this.isMoving = false
	},
    onPullDownRefresh() {
        console.log('refresh');
		this.init()//刷新-初始
		setTimeout(function () {
		    uni.stopPullDownRefresh();
		}, 1000);
    },
	methods: {
		//init
		async init(){
			//当前日序号
			var myDate = new Date();
			var year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
			var month = (myDate.getMonth() + 1) < 10 ? '0' + (myDate.getMonth() + 1) : (myDate.getMonth() + 1);       //获取当前月份(1-12)
			var day = myDate.getDate() + '' < 10 ? '0' + myDate.getDate() + '' : myDate.getDate() + ''//获取当前日(1-31)
			//获取完整年月日
			var newDay = year + "-" + month + "-" + day;
			var weekDay = new Date(Date.parse(newDay.replace(/\-/g,"/")));

			this.indexDay=(weekDay.getDay()-1)//当前天的序号：有周一至周日
			if(this.indexDay==-1){//考虑如果是周日的情况
				this.indexDay=6
			}
			this.dateList=this.getDaies()//获取当前日对应周
			console.log("this.dateList",this.dateList)
			
			//获取今天日期格式
			var date = new Date();
			var seperator1 = "-";
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			//获取当周排班表
			var currentdate = year + seperator1 + month + seperator1 + strDate;
			this.$store.state.beginDate=currentdate
			console.log("currentdate",currentdate)
			this.initCalendar(currentdate);
			
			//地址
			let res_addrApi = await this.$apip.getAddrListApi()
			let res_addr_data=res_addrApi.data.data
			console.log("res_addr_data",res_addrApi.data.data)
			res_addr_data.forEach((item,index)=>{
				if(item.isDefault==1){
					this.$store.state.defaultAddr=item.zoneLabel+'-'+item.address
					this.$store.state.addrArrindex=item.addressId
					this.$store.state.position=item.position
				}
			})
			if(res_addr_data.length<=0){
				this.AdressPlaceholder="未添加"
			}else{
				this.AdressPlaceholder=this.$store.state.defaultAddr
			}
			
		},
		//根据某一天的日期初始化获取排班表
		async initCalendar(valueDate){
			let res_calendar = await this.$apip.getCalendarInit(valueDate);
			this.res_calendar_data=res_calendar.data.data //传给 uni-grid
			console.log("this.res_calendar_data",this.res_calendar_data)
			//返回得到的排班数组
			let initArrIndexArr=[];
			let initArrIndexArr_c=[];
			let len=7
			if(this.res_calendar_data==null){
				this.initArrIndexArr_c=[]
			}else{
				for (var i=0;i<len;i++) {
					initArrIndexArr_c[i]=[]
					initArrIndexArr[i]=this.res_calendar_data["data"+(i+1)]
					initArrIndexArr_c[i]=(initArrIndexArr[i].split('').map(function(item) {return +item;}))
				}
					this.initArrIndexArr_c=initArrIndexArr_c
			}
			
		
			console.log("initArrIndexArr_c:从后台获取",initArrIndexArr_c)
			
			//判断保存排班是新增还是修改
			if(this.res_calendar_data){
				console.log("exists:当前已设置排班表")//进行修改
				this.$store.state.addrPostOrPut="PUT"
			}else{
				console.log("unexists：当前没有设置排班表")//进行新增
				this.$store.state.addrPostOrPut="POST"
			}
		},
		//根据datas 生成每一周对应的日期
		getDaies (date) {
		   let vm = this,
		   arr = []
		   let weekOfDate = Number(moment(date).format('E'))
		   let weeks = [ '一', '二', '三', '四', '五', '六','日']
		   let today = moment()
		   let defaultDay = moment(vm.defaultDate)
		   for (var i = 0; i < 7; i++) {
			   let _theDate
			   let weekWhichDay = new Date().getDay();
			  
			   if(weekWhichDay == 0){//考虑当天时周日的情况
				   weekWhichDay=7
			   }
			   // console.log("weekWhichDay",weekWhichDay)
			   // if(weekWhichDay == 0){
				  //  // weekOfDate=0
				  //  _theDate = moment(date).subtract(weekOfDatep-i, 'd')//当周：这里注意周日位置问题 //待周日测试
				  //  console.log("_theDate",_theDate)
			   // }else{
				   _theDate = moment(date).subtract(weekOfDate - i -1, 'd')
				// console.log("_theDate",_theDate)
			   // }
			   
		   let theDate=_theDate.format('YYYY-MM-DD')
		   let theDateFormSub=theDate.substr(5,theDate.length-4)
		   arr.push({
			 date: theDateFormSub,
			 dateWhole:theDate,
			 week: weeks[i],
			 // isToday: _theDate.format('YYYY-MM-DD') === today.format('YYYY-MM-DD'),
			 // isDay: _theDate.format('E') === defaultDay.format('E')
			 isDay:_theDate.format('YYYY-MM-DD') === today.format('YYYY-MM-DD')
			})
		   }
		   arr.forEach((item,index)=>{
			   if(index==0){
				   this.firstD=item.dateWhole
			   }
			   if(index==6){
				   this.lastD=item.dateWhole
			   }
		   })
		   return arr
		},
		//选择本周日期
		toCategory(onedayIndex){
			
			this.dateList.forEach((item,index)=>{//更新样式
				item.isDay=false
				if(index==onedayIndex){
					item.isDay=true
				}
			})
			this.indexDay=onedayIndex
			this.$store.state.beginDate=this.dataList_Computer[onedayIndex].dateWhole
			console.log("beginDate",this.$store.state.beginDate)
		},
		//更新分类指示器
		categoryChange(event) {
			console.log(event.detail.current)	

		},
		//更新分类高度
		getCategoryHeight() {
			let view = uni.createSelectorQuery().select('.category-list');
			view.fields(
				{
					size: true
				},
				data => {
					this.categoryHeight = data.height + 'px';
				}
			).exec();
		},
		//touch事件
			touchStart(event) {
				if(event.currentTarget.dataset.disabled === true){
					return;
				}
				this.startX = event.touches[0].pageX;
				this.startY = event.touches[0].pageY;
				console.log("touchStart")
			},
			touchMove(event) {
				if (this.direction === 'Y' || event.currentTarget.dataset.disabled === true) {
					this.direction = '';
					return;
				}
				var moveY = event.touches[0].pageY - this.startY,
						moveX = event.touches[0].pageX - this.startX;
				// if (!this.isMoving && Math.abs(moveY) > Math.abs(moveX)) { //纵向滑动
				// 	console.log("directionY")
				// 	this.direction = 'Y';
				// 	return;
				// }
				this.direction = moveX > 0 ? 'right' : 'left';
				
				this.messageIndex = moveX < 0 ? event.currentTarget.dataset.index : -1;
				this.isMoving = true;
			},
			touchEnd(event) {
				//touch结束，滑动方向
				this.isMoving = false;
				if (this.direction !== 'right' && this.direction !== 'left') {
					this.direction = '';
					return;
				}
				if (this.direction == 'right') {
					this.messageIndex = -1;
				} 
				this.endMove(event)
			},
			endMove(event) {
				console.log("endMove")
				//滑动结束后触发相对应的请求
				if(this.direction =="right"){
					console.log("directionRight")//横向向右
					this.before7days()
					
				}else{
					console.log("directionLeft")//横向向左
					this.after7days()
				}
				if (this.direction === 'Y' || event.currentTarget.dataset.disabled === true) {
					this.direction = '';
					return;
				}
				if (this.messageIndex !== -1) {
					this.transformX = `translateX(${-this.btnGroupWidth}px)`;
					this.$emit('opened');
				} else {
					this.transformX = 'translateX(0px)';
					this.$emit('closed');
				}
				this.direction = '';
			},
			//跳转到地址页面
			toAddress(){
				if(this.AdressPlaceholder=="未添加"){
					uni.navigateTo({
						url:'../MyAddress/add'
					})
				}else{
					uni.navigateTo({
						url:'../MyAddress/index'
					})
				}
			},
			async after7days(){//之后七天
				let formatDate=this.lastD.replace(/\-/g, "/") //.replace(/\-/g, "/")//兼容ios日期格式
				let year=this.lastD.substr(0,4)
				console.log("formatDate",formatDate)
				let nextWeek=this.getAfterIndexDate(new Date(formatDate))
				console.log("nextWeek",nextWeek)
				//更改当前周
				this.dateList.forEach((item,index)=>{
					item.date=nextWeek[index]
					item.dateWhole=(year+'-'+nextWeek[index])
				})
				//更改firstD、lastDate
				this.firstD=this.dateList[0].dateWhole
				this.lastD=this.dateList[6].dateWhole
				console.log("this.dateList",this.dateList)
				//更改this.$store.state.beginDate
				this.dateList.forEach((item,index)=>{
						if(item.isDay==true){
							this.$store.state.beginDate=item.dateWhole
						}
				})
				console.log("beginDate",this.$store.state.beginDate)
				uni.showToast({
					title:"请求后七天数据",
					icon:"none"
				})
				this.initCalendar(this.$store.state.beginDate)

			},
			before7days(){//之前七天
				let formatDate=this.firstD.replace(/\-/g, "/")
				let year=this.firstD.substr(0,4)
				let preWeek=this.getPreIndexDate(new Date(formatDate))

				//更改当前周
				this.dateList.forEach((item,index)=>{
					item.date=preWeek[index]
					item.dateWhole=year+'-'+preWeek[index]
				})
				//更改firstD、lastDate
				this.firstD=this.dateList[0].dateWhole
				this.lastD=this.dateList[6].dateWhole
				//更改this.$store.state.beginDate
				this.dateList.forEach((item,index)=>{
						if(item.isDay==true){
							this.$store.state.beginDate=item.dateWhole
						}
				})
				console.log("beginDate",this.$store.state.beginDate)
				uni.showToast({
					title:"请求前七天数据",
					icon:"none"
				})
				this.initCalendar(this.$store.state.beginDate)
			},
			getPreIndexDate(otParam){//获取前七天的日期
			  var ot = otParam.getTime(),
			  da = [],
			  nd,
			  month,
			  day;
			  for(var i=7;i>0;i--){
				  nd = ot - i*24*60*60*1000;
				  month = new Date(nd).getMonth()+1,
				  day = new Date(nd).getDate();
				  if (month >= 1 && month <= 9) {
				  	month = "0" + month;
				  }
				  if (day >= 0 && day <= 9) {
				  	day = "0" + day;
				  }
				  da.push(month+'-'+day);
			  }
			  return da;
			},
			getAfterIndexDate(otParam){//获取后七天时间
			  var ot = otParam.getTime(),
			  da = [],
			  nd,
			  month,
			  day;
			  for(var i=1;i<8;i++){
				  nd = ot + i*24*60*60*1000;
				  month = new Date(nd).getMonth()+1,
				  day = new Date(nd).getDate();
				  if (month >= 1 && month <= 9) {
				  	month = "0" + month;
				  }
				  if (day >= 0 && day <= 9) {
				  	day = "0" + day;
				  }
				  da.push(month+'-'+day);
			  }
			  return da;
		  },
		  toHomePage(){
			this.$store.state.homeRefresh++
		  	uni.switchTab({
		  		url:'../../pages/HomePage/index'
		  	})
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
	background-color: #fff;
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
.header {
	width: 100%;
	height: 100upx;
	background-color: #6e8cfa;
	display: flex;
	position: fixed;
	top: 0;
	/*  #ifdef  APP-PLUS  */
	top: var(--status-bar-height);
	/*  #endif  */
	
	z-index: 996;
	.scan {
		width: 100upx;
		height: 100upx;
		flex-shrink: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.input {
		width: calc(100% - 200upx);
		display: flex;
		justify-content: center;
		align-items: center;
		position:relative;
		input {
			width: calc(100% - 60upx);
			height: 60upx;
			background-color: #ffffff;
			border-radius: 60upx;
			padding-left: 60upx;
			font-size: 30upx;
			
		}
		.icon{
			width: 60upx;
			height: 60upx;
			position: absolute;
			color: #a18090;
			z-index: 996;
			top: 20upx;
			left: 0;
			font-size: 40upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	.menu {
		width: 100upx;
		height: 100upx;
		flex-shrink: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		image{
			width: 60upx;
			height: 60upx;
			border-radius: 60upx;
		}
	}
}
.place{
	/*  #ifdef  APP-PLUS  */
	margin-top: var(--status-bar-height);
	/*  #endif  */
	background-color: #6e8cfa;
	height: 100upx;
}
.swiper-view {
	.swiper {
		width: 100%;
		height: 280upx;
		image {
			width: 100%;
			height: 280upx;
		}
	}
	.keep-out {
		width: 100%;
		height: 30upx;
		border-radius: 100% 100% 0 0;
		background-color: #6e8cfa;
		margin-top: -15upx;
		position: absolute;
	}
}
.category {
	width: 95%;
	padding: 2.5vw 2.5vw;
	// background-color:#6e8cfa;
	.box {
		width: 100%;
		border-radius: 20upx;
		background-color: #ffffff;
		.dots {
			display: flex;
			justify-content: center;
			height: 15upx;
			width: 100%;
			view{
				width: 30upx;
				height: 5upx;
				background-color: rgba(0, 0, 0, 0.2);
				&.active {
					background-color: #6e8cfa;
				}
			}
		}
		.swiper {
			width: 100%;
			padding: 10upx 0;
			.uni-swiper-dot {
				width: 20upx;
			}
			.category-list {
				width: 100%;
				height: auto;
				display: flex;
				justify-content: flex-start;
				padding: 10upx 0;
				flex-flow: wrap;
				.icon {
					width: 14%;
					display: flex;
					flex-flow: wrap;
					justify-content: center;
					font-size: 22upx;
					color: #666;
					image {
						width: 70%;
						height: 13.3vw;
					}
					view{
						width: 100%;
						display: flex;
						justify-content: center;
					}
				}
			}
		}
	}
}
.pick{
	width: 95%;
	padding: 0 2.5vw 2.5vw 2.5vw;
	background: linear-gradient(to bottom, #6e8cfa 0%,#ffffff 105%);
	.box{
		width: 100%;
		border-radius: 20upx;
		background-color: #ffffff;
		.title{
			display: flex;
			justify-content: flex-start;
			align-items: flex-end;
			height: 60upx;
			border-bottom: solid 1upx #eee;
			padding-bottom: 10upx;
			.big{
				font-size: 34upx;
				padding-left: 20upx;
				color: #46434f;
			}
			.small{
				font-size: 24upx;
				padding-left: 20upx;
				color: #827f8b;
			}
		}
		.product-list{
			padding: 15upx 20upx 15upx 20upx;
			column-count: 2;
			column-width: 50%;
			column-gap: 10upx;
			>view{
				display: flex;
				background-color: #f8f8f8;
				position:relative;
				&:nth-child(1){
					.price{
						color: #e65339;
						font-size: 30upx;
						position: absolute;
						bottom: 8upx;
						left: 8upx;
					}
					.slogan{
						color: #807c87;
						font-size: 30upx;
						position: absolute;
						bottom: 8upx;
						right: 8upx;
					}
					image{
						width: 100%;
						height: 0;
					}
				}
				&:nth-child(2),&:nth-child(3){
					image{
						width: calc(50% - 5upx);
						height: 0;
					}
					.price{
						position: absolute;
						top: 25%;
						left: 55%;
						color: #e65339;
						font-size: 30upx;
					}
					.slogan{
						position: absolute;
						top: 60%;
						left: 55%;
						color: #807c87;
						font-size: 20upx;
					}
				}
				&:nth-child(2){
					margin-bottom: 10upx;
				}
			}
		}
	}
}
.banner{
	image{
		width: 100%;
	}
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
		width: 95%;
		padding: 0 2.5% 2.5vw 2.5%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.product{
			width: 48.75%;
			border-radius: 20upx;
			background-color: #fff;
			margin: 0 0 15upx 0;
			image{
				width: 100%;
				border-radius: 20upx 20upx 0 0;
			}
			.name{
				width: 92%;
				padding: 10upx 4%;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				text-align: justify;
				overflow: hidden;
				font-size: 30upx;
			}
			.info{
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				width: 92%;
				padding: 10upx 4% 10upx 4%;
				
				.price{
					color: #e65339;
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
.to{flex-shrink:0;width:40upx;height:28upx}
</style>