<template>
	<view class="info-box">
		<form @submit="formSubmit">
			<view class="bottom-01 bg-white padding-20 flex-msg">
				<view class="font-grey">性别</view>
				<picker :range="sexColumn" @change="sexChange" :value="vipInfo.sex" range-key="label">
					<view>{{sexColumn[vipInfo.sex].label}}<text class="iconfont">&#xe6f8;</text></view>
				</picker>
			</view>
			<view class="bottom-01 bg-white padding-20 flex-msg">
				<view class="font-grey">出生日期</view>
				<picker mode="date" @change="dateChange" :value="vipInfo.birthDate">
					<view>{{vipInfo.birthDate || '未设置'}}<text class="iconfont">&#xe6f8;</text></view>
				</picker>
			</view>
			<view class="bottom-01 bg-white padding-20 flex-msg">
				<view class="font-grey">手机号码</view>
				<!-- <text>{{vipInfo.phone}}</text> -->
				<!-- <input class="tr" name="phone" placeholder="请填写您的手机号码" v-model="vipInfo.phone"/> -->
				<view class="tr align-center">
					<input class="tr" name="phone" placeholder="请填写您的手机号码" v-model="vipInfo.phone"/>
					<text class="iconfont">&#xe6f8;</text>
				</view>
			</view>
			<view class="bottom-01 bg-white padding-20 flex-msg">
				<view class="font-grey">电子邮箱</view>
				<view class="tr align-center">
					<input class="tr" name="email" placeholder="请填写您的电子邮箱" v-model="vipInfo.email"/>
					<text class="iconfont">&#xe6f8;</text>
				</view>
			</view>
			<view class="bottom-01 bg-white padding-20 flex-msg">
				<view class="font-grey">真实姓名</view>
				<view class="tr align-center">
					<input class="tr" name="vipName" placeholder="请填写您的真实姓名" v-model="vipInfo.vipName"/>
					<text class="iconfont">&#xe6f8;</text>
				</view>
			</view>
			<view class="bottom-01 bg-white padding-20 flex-msg">
				<view class="font-grey">身份证号</view>
				<view class="tr align-center">
					<input class="tr" name="idNo" placeholder="请填写您的电子邮箱" v-model="vipInfo.idNo"/>
					<text class="iconfont">&#xe6f8;</text>
				</view>
			</view>
			<view class="btn-area">
				<button formType="submit">保存</button>
			</view>
		</form>
	</view>
</template>

<script>
import { updateUserInfo } from '@/common/api/account/account'
import { getVipInfo } from '@/common/api/user'
export default {
	data() {
		return {
			vipInfo: {},
			sexColumn: [
				{
					label: '未知',
					value: '0'
				},
				{
					label: '男',
					value: '1'
				},
				{
					label: '女',
					value: '2'
				},
				{
					label: '保密',
					value: '3'
				}
			]
		}
	},
	created() {
		getVipInfo().then(response => {
			let data = response.data
			if(data.msg === 'success'){
				this.vipInfo = Object.assign({},data.data)
			}
		})
	},
	methods: {
		sexChange(e) {
			this.vipInfo.sex = e.detail.value
		},
		dateChange(e) {
			this.vipInfo.birthDate = e.detail.value
		},
		formSubmit() {
			updateUserInfo(this.vipInfo).then(response => {
				let data = response.data
				if(data.msg === 'success'){
					uni.setStorageSync('vip_info',this.vipInfo)
					uni.showToast({
						title: '修改成功',
						icon: 'none',
						mask: true,
						complete: () => {
							setTimeout(() => {
								uni.navigateBack({
									delta: -1
								})
							},500)
						}
					})
				}
			})
		}
	}
}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
	.info-box {
		padding: 40rpx;
		input{
			width: 400rpx;
		}
		.iconfont {
			vertical-align: middle;
		}
	}
	.avatar-box{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		overflow: hidden;
		border:1px solid #ccc;
		image{
			width: 100%;
		}
	}
	.btn-area{
		margin: 40rpx 0;
		button{
			width: 90%;
			border-radius: 10rpx;
		}
	}
	.bottom-01 {
		border-bottom: 1px solid #c6c6c6;
	}
</style>