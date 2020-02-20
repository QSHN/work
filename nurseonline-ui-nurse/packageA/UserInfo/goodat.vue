<template>
	<view class="uni-flex justify-content-space">
		<view class="uni-item positionF">
			<view v-for="(item,index) in serveType" :key="index" class="padding-20 width100p" :class="item.select==true?'bgcwhite':''" @tap='selectServeType(index)'>
				{{item.name}}
			</view>
		</view>
		<view class="uni-item">
			
		</view>
		<view class="wraperView uni-item width78p min-height100vh" v-if="initShow">
			<uni-grid :options="hourList" :res_all_data='res_all_data' column-num="1"></uni-grid>
		</view>	<!-- wraperView结束 -->
		
	</view>
</template>

<script>
import uniGrid from "@/components/uni-grid/uni-grid-goodat.vue"
export default {
	 components: {
		 uniGrid
	 },
	data() {
		return {
			//分类
			AdressLabel:"常用地址",
			AdressPlaceholder:"未添加",
			dateList: [
			],
			categoryHeight: '',
			currentPageindex: 0,
			headerPosition:"fixed",
			loadingText:"正在加载...",
			
			//排班
			direction:"",//滑动方向
			
			//二十四小时维度
			hourList:[
				// {text:'口腔护理'},
			],
			res_all_data:[],
			initShow:false,
			serveType:[
				{name:"基础护理",select:true},
				{name:"医疗护理",select:false},
				{name:"康复护理",select:false},
				{name:"中医护理",select:false},
				{name:"母婴护理",select:false}],
		};
	},
	onReady() {
			
	}, 
	computed:{
	
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

	},
	methods: {
		//初始化
		async init(){
			this.selectServeType(0)
		},
		async selectServeType(index){
			this.serveType.forEach((item,indexType)=>{//高亮Tab
				if(indexType==index){
					item.select=true
				}else{
					item.select=false
				}
			})
			uni.showLoading({})
			let res_all=await this.$apid.allService(100,1,index*1+1)//所有擅长服务项
			let res=await this.$apip.getGoodatServe()//所选擅长服务项
			let res_all_data=res_all.data.data.records
			let res_data=res.data.data.records
			
			this.res_all_data=res_all_data//传向子组件
			
			this.hourList=[]
			let checkedVal
			for ( var i = 0; i < res_all_data.length; i++ ) {
				for ( var e = 0; e < res_data.length; e++ ) {
					if ( res_all_data[i].serviceId === res_data[e].serviceId ) res_all_data[i].checked=1//勾选
				}
			}
			console.log("res_all_data",res_all_data)
			this.hourList=res_all_data.map(item=>({
					text:item.serviceName,
					serviceId:item.serviceId,
					checked:item.checked,
					iconUrl:item.imgUrl,
					guide:item.guide
				})	
			);
			this.initShow=true
			uni.hideLoading()
		}
	}
};
</script>
<style lang="scss">
.bgcwhite{
	background-color: white
}
.wraperView{
	padding: 0upx;
}
.width78p{
	width: 78%;
}
</style>