<template>
	<view class="content">
		<form @submit="formSubmit">
			<view class="bg-white padding-20 border-01 register-box flex-msg">
				<input type="password"
					   name="password" 
					   v-model="form.password"
					   placeholder="设置密码（8-20位字母+数字）" />
			</view>
            <view class="bg-white padding-20 border-01 register-box flex-msg">
				<input type="password"
					   name="password" 
					   v-model="form.passwordConfirm"
					   placeholder="确认密码" />
			</view>
            <view class="pass-hit">密码必须为8-20位的数字、字母组合（不能是纯数字）</view>
			<view class="btn-area tc">
				<button formType="submit">确认</button>
			</view>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				password: '',
				passwordConfirm: '',
			},
		}
	},
	methods: {
		formSubmit() {
            let tips = ''
            let check = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![^\w]+$).{8,20}$/
            if(!check.test(this.form.password)){
                tips = '密码必须为8-20位的数字、字母组合'
            } else if(this.form.passwordConfirm != this.form.password){
				tips = '两次输入的密码不一致'
            }

            if (tips !== '') {
                uni.showToast({
					title: tips,
                    icon: 'none',
                    mask: true
                })
                return false
            }

		}
	},
}
</script>

<style lang="scss" scoped>
	page{	
		min-height: 100%;
	}
	.content{
		height: 100%;
		padding: 20rpx;
		background-color: #fff;
		.register-box {
			input{
				flex: auto;
			}
			.code {
				padding-left: 10rpx;
				border-left: 4rpx solid #6e8cfa;
				font-size: 24rpx;
				width: 150rpx;
			}
		}
		.btn-area {
			margin-top: 50rpx;
			button {
				width: 500rpx;
			}
			button[disabled]{
				background-color: #949494;
				color: #fff;
			}
		}
		.agree-box {
			margin-top: 200rpx;
			checkbox {
				margin-right: 20rpx;
				margin-top: -15rpx;
			}
		}
	}
	.border-01 {
		border-bottom: 1px solid #eeeff3;
    }
    .pass-hit {
        padding-top: 20rpx;
        color: #949494;
    }
</style>