<template>
	<view class="wraperView" v-if='frameShow'>
		<view class="color-c25087">{{point}}</view>
		<view class="examContent">
			<view>{{subjArr[itemindex].index}}.<text class="color-red" v-if="subjArr[itemindex].isManySelect">（多选）</text> <text v-else>（单选）</text>
			{{subjArr[itemindex].title}}</view>
			
			 <radio-group @change="checkboxChange">
				<view v-for="(item,index) in subjArr[itemindex].items" :key="index">
					<view class="itemPd">
						<radio color="#6C8EFA" @change="changeCheck(e)" class="check-mr" :value="item.no" :checked="subjArr[itemindex].trueItem==index" />
						{{item.no}}.{{item.content}}
					</view>
				</view>
			</radio-group>
              
			<view class="btm-index">{{subjArr[itemindex].index}}/{{subjTotal}}</view>
		</view>
		
		<view>
			<view v-if="(itemindex+1)!=subjTotal">
				<button type="primary" @tap="nextItem" class="bgc-6e8cfa mt20">下一题</button>
			</view>
			<view v-else>
				<button type="primary" @tap="submitTest" class="bgc-6e8cfa mt20">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				itemindex:0,
				subjTotal:0,
				subjArr:[//e.g
					{
						index:1,
						type:"",
						isManySelect:false,
						title:"",
						trueItem:0,//正确选项
						items:[					
							
							],
						score:1,
						trueItems:""
					},
					
				],
				saveArr:{},
				nowItemValue:'',//当前题目的所选值
				staffId:'',
				isExamined:'',//是否通过考试
				point:'',
				frameShow:false
			}
		},
		onLoad(){
			this.init()
		},
		methods:{
			async init(){
				uni.showLoading({})
				let res_info=await this.$apip.getPersonalInfo()
				uni.hideLoading()
				this.staffId=res_info.data.data.staffId
				this.isExamined=res_info.data.data.isExamined

					let orgId=1
					let id=1
					let level=0//难度
					uni.showLoading({
						title:'题目加载中...'
					})
					this.point='以下题目为单选或多选题，多选、错选或漏选均需要重新考核，每人三次考试资格，请认真作答'
					this.frameShow=true
					let res_exam=await this.$apip.getExamItem(orgId,id,level)
					let res_exam_data=res_exam.data.data
					this.subjTotal=res_exam_data.length
					this.subjArr=res_exam_data
					uni.hideLoading()
			},
			nextItem(){
				this.itemindex++
				console.log("this.nowItemValue",this.nowItemValue)
				this.saveArr[this.itemindex]=this.nowItemValue
				console.log(this.saveArr)
			},
			async submitTest(){
				console.log("this.nowItemValue",this.nowItemValue)
				this.saveArr[parseInt(this.itemindex+1)]=this.nowItemValue
				console.log(this.saveArr)
				let saveArr=JSON.stringify(this.saveArr)
				let data={resultData:saveArr}
				let res_submitTest=await this.$apip.submitTest(data,this.staffId)
				uni.navigateTo({
					url:'examPass'
				})
			},
			changeCheck(e){
				console.log(e)
			},
			checkboxChange (e) {
				console.log(e.detail.value)
				let nowItemValue=[]
				// nowItemValue=e.detail.value.join('')
				nowItemValue=e.detail.value
				console.log("nowItemValue",nowItemValue)
				this.nowItemValue=nowItemValue
			}
		}
	}
</script>

<style>
	.examContent{
		border:1px solid #666;
		padding:20upx;
		margin-top: 50upx;
	}
	.itemPd{
		padding:20upx 10upx
	}
	.check-mr{
		margin-right: 20upx;
	}
	.btm-index{
		width: 100%;
		text-align: center;
	}
</style>
