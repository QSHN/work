<template>
	<view>
		<view class="width100p text-alignC mt200-im"><text class="iconfont color6e8cfa font-size180 ml50">&#xe616;</text></view>
		<view class="grace-idcard-text grace-idcard-alc color666 mt100p  padding-20">
							拒单成功
		</view>
		
		<view style="margin-top:38upx;">
			<button type="primary color6d8bf9" @tap="reviewTrue">返回首页</button>
		</view>
	</view>
</template>
	
<script>
	export default {
		methods: {
			reviewTrue:function(){
				this.$store.state.homeRefresh++ //首页状态刷新
				uni.switchTab({
					url:'../../pages/HomePage/index'
				})
			},
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
