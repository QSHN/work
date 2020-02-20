<template>
	<view class="wraperView">
		<view class="color-c25087">以下题目为单选或多选题，多选、错选或漏选均需要重新考核，每人三次考试资格，请认真作答</view>
		<view class="examContent">
			<view>{{subjArr[itemindex].index}}.{{subjArr[itemindex].type}}{{subjArr[itemindex].subj}}</view>
			<view v-for="(item,itemindex) in subjArr[itemindex].content" :key="itemindex">
				<view class="itemPd"><checkbox class="check-mr" value="cb" checked="true" />{{item}}</view>
			</view>
			<view class="btm-index">{{subjArr[itemindex].index}}/{{subjTotal}}</view>
		</view>
		
		<view v-if="(itemindex+1)!=subjTotal">
			<button type="primary" @tap="nextItem" class="bgc-6e8cfa mt20">下一题</button>
		</view>
		<view v-else>
			<button type="primary" @tap="submitTest" class="bgc-6e8cfa mt20">提交</button>
		</view>
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				itemindex:0,
				subjTotal:3,
				subjArr:[
					{
						index:1,
						type:"单选",
						subj:"护士首次联系用户时，需要和用户确认哪些内容",
						trueItem:0,//正确选项
						content:[
							"A、核实药品、处方、工具是否齐全，确认上门时间和地点",
							"B、核实药品、处方、工具是否齐全",
							"C、确认上门时间和地点",
						]
					},
					{
						index:2,
						type:"单选",
						subj:"以下哪个不是常居菌",
						trueItem:1,//正确选项
						content:[
							"A、棒状杆菌类",
							"B、沙门氏菌",
							"C、丙酸菌属",
							"D、不动杆菌属",
						]
					},
					{
						index:3,
						type:"单选",
						subj:"为预防局麻药毒性反应，常用的术前药是",
						trueItem:0,//正确选项
						content:[
							"A、巴比妥类药物 ",
							"B、吗啡",
							"C、哌替啶",
							"D、阿托品",
							"E、氯丙嗪 "
						]
					}
				],

			}
		},
		methods:{
			nextItem(){
				this.itemindex++
			},
			submitTest(){
				uni.switchTab({
					url:'../../pages/PersonalCenter/index'
				})
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
