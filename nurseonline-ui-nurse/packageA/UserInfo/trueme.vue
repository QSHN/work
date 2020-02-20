<template>
	<view>
		
		<form @submit="formSubmit">
		  <view class="wraperView positionR">
			<view class="title-right color6e8cfa" @tap="toConfirmAgain">变更认证</view>
			<view class="mt50"></view><!-- 占位 -->
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(user,propIndex) in userInfo" :key="propIndex" @tap="settingTo(propIndex)">
				<view>{{user.label}}</view>
				<view>
					{{user.state}}<text class="iconfont">&#xe6f8;</text>
				</view>
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
			userInfo: [
				{
					label: '身份信息',
					prop: 'height',
					type: 'text',
					state:"已完善",
					placeholder: ''
				},
				{
					label: '基本信息',
					prop: 'weight',
					type: 'text',
					state:"已完善",
					placeholder: ''
				},
				{
					label: '执业信息',
					prop: 'username',
					type: 'text',
					state:"已完善",
					placeholder: ''
				},
			],
		}
	},
	methods: {
		toBasicInfo(){
			uni.navigateTo({
				url: 'basicInfo',
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
		settingTo(propIndex){
			console.log(propIndex)
			if(propIndex==0){
				uni.navigateTo({
					url: 'trueme.1',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
			if(propIndex==1){
				uni.navigateTo({
					url: 'trueme.2',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
			if(propIndex==2){
				uni.navigateTo({
					url: 'trueme.3',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		toConfirmAgain(){
			uni.showModal({
				title:'提示',
				content:'请确认是否前往重新认证？',
				success: function (res) {
					if (res.confirm) {
						uni.navigateTo({
							url:'../../pages/PersonalCenter/IdentityConfirm/index'
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
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
	.title-right{
		position: absolute;
		top:20upx;
		right:45upx;
	}
</style>
