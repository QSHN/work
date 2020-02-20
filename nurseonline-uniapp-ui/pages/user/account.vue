<template>
	<view>
		<navigator class="padding-20 bg-white flex-msg bottom-01" url="./userinfo">
			<view class="align-center">
				<view class="avatar-box">
					<image :src="sysUser.avatar || '../../static/logo.png'" mode="widthFix"></image>
				</view>
				<view class="name-box">
					<view class="user-name">{{vipInfo.vipName || ''}}</view>
					<view class="font-grey">登录账号：{{vipInfo.userName || ''}}</view>
				</view>
			</view>
			<view class="">
				<text class="iconfont">&#xe6f8;</text>
			</view>
		</navigator>
		<navigator url="./vipinfo" class="padding-20 bg-white flex-msg bottom-01">
			<text>会员信息</text>
			<text class="iconfont">&#xe6f8;</text>
		</navigator>
		<navigator url="./phone" class="padding-20 bg-white flex-msg bottom-01">
			<text>修改手机</text>
			<text class="iconfont">&#xe6f8;</text>
		</navigator>
		<navigator url="../login/password" class="padding-20 bg-white flex-msg bottom-01">
			<text>修改密码</text>
			<text class="iconfont">&#xe6f8;</text>
		</navigator>
		<view class="padding-20 bg-white flex-msg" @tap="wxBind">
			<text>微信绑定：{{ sysUser.wxOpenid ? '已绑定' : '未绑定'}}</text>
			
			<text class="bind-tip">{{ sysUser.wxOpenid ? '微信解绑' : '微信绑定'}}</text>
		</view>
	</view>
</template>

<script>
import { getVipInfo,getUserInfo } from '@/common/api/user.js'
export default {
	data() {
		return {
			vipInfo: {},
			sysUser: {}
		}
	},
	onShow() {
		getUserInfo().then(({data}) => {
			if(data.msg === 'success'){
				this.sysUser = Object.assign({},data.data.sysUser)
			}
		})
		
		getVipInfo().then(({data}) => {
			if(data.msg === 'success'){
				this.vipInfo = Object.assign({},data.data)
			}
		})
	},
	methods: {
		wxBind() {
			uni.navigateTo({
				url: './wxbind?sysUser=' + encodeURIComponent(JSON.stringify(this.sysUser)) + '&from=account'
			})
		}
	},
}
</script>

<style lang="scss">
	.avatar-box{
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		overflow: hidden;
		border:1px solid #ccc;
		image{
			width: 100%;
		}
	}
	.name-box{
		margin-left: 30rpx;
		line-height: 50rpx;
		.font-grey{
			font-size: 24rpx;
		}
	}
	.bind-tip{
		width: 75px;
		height: 20px;
		line-height: 20px;
		background-color: #6E8CFA;
		color: #fff;
		border-radius: 4px;
		text-align: center;
		font-size: 12px;
	}
</style>
