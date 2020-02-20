<template>
	<view>
		<view class="width100p text-alignC mt200-im"><text class="iconfont color6e8cfa font-size180">&#xe61a;</text></view>
		<view class="grace-idcard-text grace-idcard-alc color666 mt100p  padding-20">
							审核通过
		</view>
		<view class="grace-idcard-text grace-idcard-alc color666 mt100p  padding-20 textCenter">
							恭喜您已通过了优佳护的职业认证
		</view>
		<view class="grace-idcard-text grace-idcard-alc color666 mt100p  padding-20 textCenter">
							只要入驻优佳护服务机构您就可以在优佳护平台为万千患者服务啦！
		</view>
		
		<view style="margin-top:38upx;">
			<button type="primary color6d8bf9" @tap="reviewTrue">去看看</button>
		</view>
	</view>
</template>
	
<script>
	export default {
		methods: {
			reviewTrue(){
					uni.switchTab({
						url:'../../../pages/HomePage/index'
					})
			},
			reviewFalse(){
				uni.navigateTo({
					url:'./../../packageA/MyOrg/orgUnjoined'
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
