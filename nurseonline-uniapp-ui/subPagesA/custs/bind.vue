<template>
	<view>
		<view class="padding-20">
			<view class="bottom-20">
				<title-card title="温馨提示">
					<template v-slot:content>
						<view class="padding-10-0">身份证号{{cust.idNo}}已被其他人绑定，需通过授权绑定验证才可绑定。</view>
					</template>
				</title-card>
			</view>
			
			<view class="flex-msg padding-10-0">
				<text class="label">手机号码</text>
				<picker @change="bindPickerChange" :value="index" :range="array" range-key="phone">
					<view :class="{'font-grey': !array[index].phone}">{{array[index].phone || '请选择要发送验证码的手机号码'}} <text class="iconfont">&#xe74a;</text></view>
				</picker>
			</view>
			<view class="flex-msg padding-10-0">
				<text class="label">验证码</text>
				<view class="login-box flex-msg">
					<input type="text" v-model="code" placeholder="请输入验证码"/>
					<text class="code tc" @tap="getCode">{{codeTip}}</text>
				</view>
			</view>
			<view class="button-area">
				<button @tap="submit">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
import { sendOwnerCode,bindCust } from '@/common/api/cust/cust'
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
			index: 0,
			array: [],
			code: '',
			codeTip: '获取验证码',
			codeTimer: null,
			codeTime: 0,
			cust: {},
			vipId: ''
		}
	},
	onLoad(e) {
		this.cust = Object.assign({},JSON.parse(e.cust))
		this.array = JSON.parse(e.phoneList)
		this.vipId = this.array[0].vipId
	},
	onShow() {
		this.calculateCodeTime()
	},
	computed: {
		...mapGetters(['codeDate']),
	},
	methods: {
		bindPickerChange(e) {
			this.index = e.detail.value
			this.vipId = this.array[this.index].vipId
		},
		calculateCodeTime() {
			var codeDate = this.codeDate
			if (codeDate) {
				var now = new Date()
				var time = Math.floor((now - codeDate) / 1000)
				time = 60 - time
				if (time > 0) {
					this.codeTimer && clearInterval(this.codeTimer)
					this.codeCountDown(time)
				}
			}
		},
		codeCountDown(time) {
			this.codeTime = time || 60 //验证码倒计时
			this.codeTip = this.codeTime + 's'
			this.codeTimer = setInterval(() => {
				this.codeTime--
				if(this.codeTime > 0){
					this.codeTip = this.codeTime + 's'
				}
				else{
					this.codeTip = '获取验证码'
					clearInterval(this.codeTimer)
					this.codeTimer = null
				}
			},1000)
		},
		getCode() {
			if(this.codeTip === '获取验证码'){
				this.$store.commit('SET_CODEDATE', new Date())
				this.codeCountDown()
				sendOwnerCode(this.vipId).then(response => {
					// console.log(response)
					let data = response.data
					if(data.msg === 'success'){
						uni.showToast({
							title: '验证码已发送，请注意查收！',
							icon: 'none',
							mask: true
						})
					}
				})
			}
		},
		submit() {
			// console.log(this.cust);
			bindCust({
				code: this.code,
				custOwnerId: this.vipId,
				idNo: this.cust.idNo,
				relationType: this.cust.relationType
			}).then(response => {
				let data = response.data
				if(data.msg === 'success'){
					uni.showToast({
						title: '绑定成功！',
						icon: 'none',
						mask: true,
						complete: () => {
							setTimeout(() => {
								uni.navigateBack({
									delta: 3
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
	page{
		background-color: #fff;
	}
	.label{
		width: 150rpx;
		padding-right: 20rpx;
	}
	.login-box {
		padding-bottom: 5rpx;
		border-bottom: 1px solid #c0c0c0;
		&:first-child {
			margin-bottom: 30rpx;
		}
		.code{
			padding-left: 10rpx;
			border-left: 4rpx solid #6e8cfa;
			font-size: 24rpx;
			width: 150rpx;
		}
	}
	.button-area{
		margin-top: 40rpx;
	}
</style>
