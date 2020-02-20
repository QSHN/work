<template>
	<view>
		<view class="width100p text-alignC mt200-im">
			<text v-if="info=='考核已通过'" class="iconfont color6e8cfa font-size180">&#xe604;</text>
			<text v-if="info=='考核未通过'" class="iconfont color6e8cfa font-size180">&#xe605;</text>
		</view>
		<view class="grace-idcard-text grace-idcard-alc color666 mt100p  padding-20">
							{{info}}
		</view>
		<view class="grace-idcard-text grace-idcard-alc color666 mt100p  padding-20 textCenter">
							{{info_else}}
		</view>
	
		<view style="margin-top:38upx;">
			<button type="primary color6d8bf9" @tap="reviewTrue">返回</button>
			<button type="primary" class="mt20 bgc-6e8cfa" @tap="reTest">重新考核</button>
		</view>
	
	</view>
</template>
	
<script>
	var _self
	export default {
		data(){
			return{
				info:'',
				info_else:''
			}
		},
		onLoad(){
			_self=this
			this.init()
		},
		methods: {
			async init(){
				uni.showLoading({
				})
				let res_info=await this.$apip.getPersonalInfo()
				
				let examOk=parseInt(res_info.data.data.isExamined)
				console.log("examOk",examOk)
				switch(parseInt(examOk)){
					case 0:
					_self.info="考核未通过"
					_self.info_else="请重新考核，或者先去学习一下把！"
					break;
					case 1:
					_self.info="考核已通过"
					_self.info_else="恭喜你已经通过考核，棒棒哒！"
					break;
				}
				uni.hideLoading()
			},
			reviewTrue(){
					uni.switchTab({
						url:'../../pages/PersonalCenter/index'
					})
			},
			reTest(){
					uni.redirectTo({
						url:'index'
					})
			}
		}
	}
</script>

<style>
	.textCenter{
		width: 75%;
		margin:0 auto;
	}	
	page{
		overflow: hidden;
	}
</style>
