<template>
	<view>
		<view v-if='ReadRecOnly'class="grace-idcard-alL color6e8cfa bgc-fff border-bottom-8 padding-10-0 pl45">
			#当前页只可查看，不可修改
		</view>
		<view v-else class="grace-idcard-alL color6e8cfa bgc-fff border-bottom-8 padding-10-0 pl45">
			#如果信息与评估不一致，请修改!
		</view>
		<form @submit="formSubmit">
		  <view class="wraperView">
			<view class="uni-flex justify-content-space">
			<view class="uni-title uni-common-pl padding"><view class="left-icon">主要诊断</view></view>
			
			<view><input :disabled="ReadRecOnly" class="flex-item uni-input border-bottom" v-model="mainInfo.value" name="type.name" :placeholder="mainInfo.placeholder" placeholder-class="holder"/></view>
			</view>
			<!-- <view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom justify-content-space"  @tap="tojudgeMain1()">
					<view>{{info.label}}</view>
				<view>
					{{info.hospital}}<text class="iconfont">&#xe6f8;</text>
				</view>
			</view> -->
			<view class="uni-flex justify-content-space"> 
			<view class="uni-title uni-common-pl padding"><view class="left-icon">目前症状</view></view>
			
			<view><input :disabled="ReadRecOnly" class="flex-item uni-input border-bottom" v-model="mainInfo1.value" name="type.name" :placeholder="mainInfo1.placeholder" placeholder-class="holder"/></view>
			</view>
			<!-- <view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom justify-content-space"  @tap="tojudgeMain2()">
					<view>{{info1.label}}</view>
				<view>
					{{info1.hospital}}<text class="iconfont">&#xe6f8;</text>
				</view>
			</view> -->
			
			<view style="margin-top:38upx;padding-bottom: 18px;">
				<button type="primary color6d8bf9" @tap="toJudgeContent">下一步</button>
				<button type="primary color6d8bf9" class="see-btn-step mt20" @tap="backToBeginJudge">上一步</button>
			</view>
			
		 </view>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			sexIdx: "0",
			date: '1949-10-01',
			info: {
					label: '主要诊断',
					hospital:"伤口愈合不良",
					prop: 'height',
					type: 'text',
					placeholder: ''
				},
			info1: {
					label: '目前症状',
					hospital:"伤口红肿，伤口愈合不良",
					prop: 'height',
					type: 'text',
					placeholder: ''
				},
			mainInfo:{
				value:'',
				placeholder:'请输入主要诊断'
			},
			mainInfo1:{
				value:'',
				placeholder:'请输入目前症状'
			},
			ReadRecOnly:false
		}
	},
	onLoad() {
		this.init()
	},
	methods: {
		async init(){
			//是否只读
			this.ReadRecOnly=this.$store.state.ReadRecOnly
			
			let res=this.$store.state.rec
			this.mainInfo.value=res.mainDiagnosis
			this.mainInfo1.value=res.mainSymptom
		},
		tojudgeMain1(){
			uni.navigateTo({
				url: 'judgeMain1',
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
		tojudgeMain2(){
			uni.navigateTo({
				url:'judgeMain2'
			})
		},
		toJudgeContent(){
			this.$store.state.rec.mainDiagnosis=this.mainInfo.value
			this.$store.state.rec.mainSymptom =this.mainInfo1.value
			uni.navigateTo({
				url:'judgeContent'
			})
		},
		backToBeginJudge(){
			uni.navigateBack({
				url:'beginJudge'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.padding{
		padding: 20upx;
	}
	.bottom-20{
		margin-bottom: 20upx;
	}
	.bottom-01{
		margin-bottom: 2upx;
	}
	.avatar-box{
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		overflow: hidden;
		border:1px solid #ccc;
		padding:20rpx;
		image{
			width: 100%;
		}
	}
	.btn-area{
		margin-top: 40upx;
		button{
			width: 90%;
			background-color: #00b28e;
			border-color: #75d4c0;
			color: #fff;
			border-radius: 10upx;
		}
	}
</style>