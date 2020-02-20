<template>
	<view>
		<view class="wraperView" v-if="initShow">
			
			<uni-grid  :options="hourList" :res_all_data='res_all_data' :staffId="staffId"  column-num="4"></uni-grid>

		</view>	<!-- wraperView结束 -->
	</view>
</template>

<script>
import uniGrid from "@/components/uni-grid/uni-grid-prof.vue"
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
				{text:'伤口造口'},
				{text:'心理专科'},
				{text:'静脉治疗'},
				{text:'糖尿病专科'},
				{text:'老年专科'},
				{text:'中医专科'},
				{text:'肾病专科'},
				{text:'产科专科'},
				{text:'肿瘤专科'},
				{text:'肝病专科'},
				{text:'呼吸专科'},
				{text:'心血管专科'},
				{text:'乳腺专科'},
				{text:'淋巴水肿治疗专科'},
				{text:'营养专科'},
				{text:'社区专科'},
			],
			staffId:'',
			initShow:false
		};
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

	},
	methods: {
		//初始化
		async init(){
			uni.showLoading({})
			let res_all=await this.$apid.staffType("specialist")
			let res=await this.$apip.getGoodatProf()
			let res_all_data=res_all.data.data
			let res_data=res.data.data
			if(res_data.length<1){//没数据
				
			}else{
				this.staffId=res_data[0].staffId
			}
			
			this.res_all_data=res_all_data//传向子组件
			console.log("res_data",res_all_data)
			this.hourList=[]
			res_all_data.forEach((item,index)=>{
				if(item.itemId!=-1){//删除"未分类"
					this.hourList.push({text:'',checked:0,itemId:''})
					this.hourList[index].text=item.itemName
					this.hourList[index].itemId=item.itemId
					res_data.forEach((childItem,childIndex)=>{
						if(childItem.specialistName==item.itemName){
							this.hourList[index].checked=1
						}
					})
				}
			})
			this.initShow=true
			uni.hideLoading()
		},
	}
};
</script>
<style lang="scss">

</style>