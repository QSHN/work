<template>
	<view>
		<!-- <view class="padding-20 bg-white font-blue"># 我们将会通过5个问题与您确定所需服务项目</view> -->
		<view class="padding-20 bg-white font-blue"># 我们将会为您推荐更适合您的服务</view>
		<title-card :title="title">
			<template slot="content">
				<!-- <view class="problem-box flex bottom-20" :class="{'flex-column': column}"> -->
				<view class="problem-box flex bottom-20">
					<view class="flex-column flex-center problem-item" 
						  v-for="(problem,index) in problems" 
						  :key="index">
						<view class="icon-01 icons" :class="problem.icon"></view>
						<text>{{problem.text}}</text>
					</view>
				</view>
			</template>
		</title-card>
		<view class="button-area">
			<button @tap="confirm">推荐方案（免费获得）</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			page: 1,
			column: false,
			row: 4,
			title: '服务对象属于以下哪种疾病',
			problems:[
				{
					text: '口腔疾病',
					icon: 'kq'
				},
				{
					text: '糖尿病',
					icon: 'ng'
				},
				{
					text: '高血糖',
					icon: 'xb'
				},
				{
					text: '膀胱疾病',
					icon: 'bs'
				},
				{
					text: 'PICC置管',
					icon: 'picc'
				},
				{
					text: '需雾化患者',
					icon: 'qg'
				},
				{
					text: '脊髓损伤',
					icon: 'jm'
				},
				{
					text: '卒中后',
					icon: 'xt'
				}
			]
		}
	},
	methods: {
		addProblems(num) {
			this.problems = []
			for(let i=0; i<num; i++) {
				this.problems.push({
					id: i,
					text: '口腔疾病'
				})
			}
		},
// 		classObject(idx) {
// 			let noRight = idx % this.row === 0
// 			let line = this.problems % this.row
// 			let noBootom = line > 0 ? (idx > this.problems.length - line - 1) : (idx > this.problems.length - this.row - 1)
// 			console.log(idx,noRight,noBootom)
// 			return {
// 				'no-right': noRight,
// 				'no-bottom': noBootom
// 			}
// 		},
		confirm() {
			// console.log(this.problems)
			uni.redirectTo({
				url: './confirm'
			})
		}
	},
}
</script>

<style lang="scss">
@import "@/common/css/icon.scss";
.problem-box {
	flex-wrap: wrap;
	.problem-item {
		width: 25%;
		height: 190rpx;
		border-right: 1px solid #c6c6c6;
		border-bottom: 1px solid #C6C6C6;
		box-sizing: border-box;
		.ic0 {
			width:40px;
			height:50px;
			background-position:3px 36.1%;
			background-size:70px;
		}
		&.no-right {
			border-right: 0;
		}
		&.no-bottom {
			border-bottom: 0;
		}
	}
}
</style>