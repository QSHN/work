<template>
	<view>
		<text>直播</text>
		<!-- <view class="justify-center">
			<live-pusher id="pusher"
						 style="width: 300px; height: 225px;"
						 :url="pushUrl"
						 :waiting-image='loadImg'
						 mode="RTC"
						 autopush
						 enable-camera
						 @statechange="statechange"
						 @netstatus="netstatus"
						 @error="error"/>
		</view>
		<view class="btn-area">
			<button @tap="bindStart" type="primary">播放推流</button>
			<button @tap="bindPause" type="primary">暂停推流</button>
			<button @tap="bindStop" type="primary">停止推流</button>
			<button @tap="bindResume" type="primary">恢复推流</button>
			<button @tap="bindSwitchCamera" type="primary">切换前后摄像头</button>
		</view> -->
		
		<!-- <view class="justify-center mt">
			<live-player id="player"
						 style="width: 300px; height: 225px;"
						 :src="liveUrl"
						 autoplay
						 @statechange="liveStatechange"
						 @netstatus="liveNetstatus"
						 @fullscreenchange="liveFullscreenchange" />
		</view>
		<view class="btn-area">
			<button @tap="livePlay" type="primary">播放</button>
			<button @tap="livePause" type="primary">暂停</button>
			<button @tap="liveStop" type="primary">停止</button>
			<button @tap="liveResume" type="primary">恢复</button>
			<button @tap="liveMute" type="primary">静音</button>
		</view> -->
		<!-- <input type="text" v-model="roomNo" /> -->
		<button type="primary" open-type="contact" @contact="contact">客服</button>
		<button type="primary" @tap="login">登录</button>
		<button type="primary" open-type="getPhoneNumber" @getphonenumber="getphonenumber">创建房间</button>
	</view>
</template>

<script>
import Global from './test'
import { getUserInfo } from '../../common/api/user'
export default {
	data() {
		return {
			pushUrl: 'rtmp://54046.livepush.myqcloud.com/live/pushTest?txSecret=ac86fe05251f63a7d9ca356138be8b7c&txTime=5D14E7FF',
			liveUrl: 'rtmp://liveplay.youjiahu.cn/LivePlay/PlayTest',
			ctx: '',
			loadImg: 'http://file.ry600.com/snapshot//files/di/di70684438lrfavs/2019-06-26/6chvaxkx2nu2y9mm.png',
			cxk: '',
			roomNo: '',
			Global
		}
	},
	onReady() {
		console.log(this.Global)
		// this.ctx = wx.createLivePusherContext('pusher')
		// this.cxk = wx.createLivePlayerContext('player')
		// console.log(this.cxk)
	},
	methods:{
        statechange(e){
            console.log('live-pusher statechange code:', e.detail.code)
        },
		netstatus(e){
			console.log('live-pusher netstatus info:', e.detail.info)
		},
        error(e){
            console.error('live-pusher error:', e.detail.errMsg)
        },
		bindStart(e){
			this.ctx.start({
				success: res => {
					console.log('start success')
				},
				fail: () => {
					console.log('start fail')
				}
			})
		},
		bindPause(e){
			this.ctx.pause({
				success: res => {
					console.log('pause success')
				},
				fail: () => {
					console.log('pause fail')
				}
			})
		},
		bindStop(e){
			this.ctx.stop({
				success: res => {
					console.log('stop success')
				},
				fail: () => {
					console.log('stop fail')
				}
			})
		},
		bindResume(e){
			this.ctx.resume({
				success: res => {
					console.log('resume success')
				},
				fail: () => {
					console.log('resume fail')
				}
			})
		},
		bindSwitchCamera(e){
			this.ctx.switchCamera({
				success: res => {
					console.log('switchCamera success')
				},
				fail: () => {
					console.log('switchCamera fail')
				}
			})
		},
		liveStatechange(e){
			 console.log('live-liver statechange code:', e.detail.code)
		},
		liveNetstatus(e){
			console.log('live-liver netstatus info:', e.detail.info)
		},
		liveFullscreenchange(e){
			console.log('live-liver fullscreenchange direction:', e.detail.direction)
			console.log('live-liver fullscreenchange fullScreen:', e.detail.fullScreen)
		},
		livePlay(e){
			this.cxk.play({
				success: res => {
					console.log('play success')
				},
				fail: () => {
					console.log('play fail')
				}
			})
		},
		livePause(){
			this.cxk.pause({
				success: res => {
					console.log('pause success')
				},
				fail: () => {
					console.log('pause fail')
				}
			})
		},
		liveStop(){
			this.cxk.stop({
				success: res => {
					console.log('stop success')
				},
				fail: () => {
					console.log('stop fail')
				}
			})
		},
		liveResume(){
			this.cxk.resume({
				success: res => {
					console.log('resume success')
				},
				fail: () => {
					console.log('resume fail')
				}
			})
		},
		liveMute(){
			this.cxk.mute({
				success: res => {
					console.log('mute success')
				},
				fail: () => {
					console.log('mute fail')
				}
			})
		},
		toRoom(){
			uni.navigateTo({
				url: './room?roomNo=' + this.roomNo
			})
		},
		getphonenumber(e){
			console.log(e)
		},
		async login(){
			// uni.login({
			// 	success: res => {
			// 		console.log(res)
			// 	}
			// })
			let res = await getUserInfo()
			console.log(res)
		},
		contact(e){
			console.log(e)
		}
    }
}
</script>

<style lang="scss">
	.btn-area{
		margin-top: 40rpx;
		button{
			margin-bottom: 20rpx;
		}
	}
	.mt{
		margin-top: 60rpx;
	}
</style>