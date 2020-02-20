<template>
	<view class="content">
					 <view class="page positionR">
						<view class="positionA" style="right:20upx;top:20upx;color:#666;font-size:30upx;">{{countSecond}}s<view class="inline-block" @tap="toLogin">跳过</view></view>
						<view class="image-list">
								<view class="image-content" @tap="toLogin">
									<image style="width:545upx;height:772upx;background-color: #ffffff;margin-top: 15vw;" src="../static/img/launchbg.png"
										@error="imageError"></image>
								</view>
						</view>
					</view>
					<view class="swiper-text">
						<view class="swiper-text-cn" style="color:#595757">全国互联网医疗试点单位</view>
					</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				countSecond:3,
			}
		},
		onLoad(){
			this.loadExecution()
		},
		methods: {
			toLogin(){
				uni.redirectTo({
					url:'Login/login/login',
				})
				this.countSecond=0
			},
			loadExecution: function(){
				let countTime=setInterval(()=>{
					if(this.countSecond<=0){
						uni.redirectTo({
							url:'Login/login/login'
						})
						clearInterval(countTime)
					}else{
						this.countSecond--
					}
				},1000)

				/**
				 * 获取本地存储中launchFlag的值
				 * 若存在，说明不是首次启动，直接进入首页；
				 * 若不存在，说明是首次启动，进入引导页；
				 */
				// #ifdef APP-PLUS
				try {
				    const value = uni.getStorageSync('launchFlag');
				    if (value) {
				        if (value == true) {
				            uni.switchTab({
				                url: '/pages/tabbar/tabbar-1/tabbar-1'
				            });
				        } else {
				            uni.redirectTo({
				                url: '/pages/index/guide'
				            });
				        }
				    } else {
				        uni.setStorage({
				            key: 'launchFlag',
				            data: true,
				            success: function() {
								console.log('存储launchFlag');
							}
				        });
				        uni.redirectTo({
				            url: '/pages/index/guide'
				        });
				    }
				} catch(e) { 
					// error 
					uni.setStorage({ 
						key: 'launchFlag', 
						data: true, 
						success: function () {
							console.log('error时存储launchFlag');
						} 
					}); 
					uni.redirectTo({ url: '/pages/index/guide' }); 
				}
				return;
				// #endif
// 				uni.switchTab({
// 				    url: '/pages/tabbar/tabbar-1/tabbar-1'
// 				});
			}
		}
	}
</script>
<style>
page,
	.image-content{
		text-align: center;
	}	
	.content{
		width: 100%;
		height: 100%;
		background-size: 100% auto ;
		padding: 0;
		background: #fff;
	}
	.swiper{
		width: 100%;
		height: 100%;
	}
	.swiper-item {
		display: block;
		width: 100%;
		height: 100%;
		text-align: center;
		position: relative;
	}
	.swiper-item-img {
		width: 100%;
		height: 100%;
		margin: 0 auto;
	}
	.swiper-item-img image{
		width: 100%;
		height: 100%;
	}
	.swiper-item-text {
		padding-top: 40upx;
		width: 430upx;
		height: 130upx;
		margin: 0 auto;
	}
	.swiper-item-text image{
		width: 100%;
		height: 100%;
	}
	.swiper-text{
		width: 100%;
		position: absolute;
		bottom: 110upx;
	}
	.swiper-text view{
		width: 100%;
		text-align: center;
		color: #FFF;
	}
	.swiper-text-cn{
		font-size: 28upx;
	}
	.swiper-text-us{
		font-size: 28upx;
	}
	.jump-over{
		position: absolute;
		height: 60upx;
		line-height: 60upx;
		padding: 0 40upx;
		border-radius: 30upx;
		font-size: 32upx;
		right: 45upx;
		top: 125upx;
		color: #37393b;
		background: #918984;
		z-index: 999;
	}
	.experience-now{
		position: absolute;
		width: 200upx;
		height: 60upx;
		line-height: 60upx;
		padding:5upx 40upx;
		border-radius: 35upx;
		font-size: 32upx;
		left: 50%;
		margin-left: -140upx;
		bottom: 220upx;
		color: #37393b;
		background: #918984;
		z-index: 9999;
	}	
</style>
