<template>
	<view class="flex-column justify-between address-box">
		<view>
			<view class="error-tip padding-20 tc" v-if="errorZipcode">邮政编码格式错误</view>
			<view class="flex-msg border-01 padding-20 bg-white">
				<text>姓名</text>
				<input class="tr" type="text" v-model="form.linkman" placeholder="请输入联系人姓名" placeholder-class="font-grey"/>
			</view>
			<view class="flex-msg bottom-20 padding-20 bg-white">
				<text>电话</text>
				<input class="tr" type="text" v-model="form.phone" placeholder="请输入您的电话" placeholder-class="font-grey"/>
			</view>
			
			<view class="flex-msg border-01 padding-20 bg-white">
				<text>所在区域</text>
				<picker mode="region" :value="form.zoneLabel" @change="bindRegionChange" :custom-item="customItem">
					<view v-if="form.zoneLabel">{{form.zoneLabel}}</view>
					<view class="font-grey" v-else>省市区县、乡镇等</view>
				</picker>
			</view>
			<view class="flex-msg border-01 padding-20 bg-white">
				<text>详细地址</text>
				<input class="tr" type="text" v-model="form.address" placeholder="请填写详细地址" placeholder-class="font-grey"/>
			</view>
			<view class="flex-msg bottom-20 padding-20 bg-white" :class="{'font-red': errorIdo}">
				<text>邮政编码</text>
				<input class="tr" type="text" v-model="form.zipcode" placeholder="请输入邮政编码" placeholder-class="font-grey" @blur="checkCode"/>
			</view>
			
			<view class="flex-msg border-01 padding-20 label-item bg-white">
				<text>标签</text>
				<view class="label-box">
					<view class="tr">
						<text class="label-text"
							  v-for="(label,idx) in labels"
							  :key="idx"
							  :class="{'isActive': label === form.label || idx === labelIdx}"
							  @tap="selectLabel(idx)">
							  {{label}}
						</text>
					</view>
					<view class="label-add tr">
						<template v-if="isEdit">
							<view class="label-self">
								<view class="input-area align-center" v-if="isFocus">
									<input type="text" v-model="newLabel" class="tl" placeholder="请输入标签名称" placeholder-class="font-grey"/>
									<button :disabled="isDisabled" @tap="saveLabel">保存</button>
								</view>
								<view class="label-edit align-center" :class="{'isSelected': labelIdx === 3}" v-else>
									<view class="tc label" @tap="selectLabel(3)">{{newLabel}}</view>
									<button @tap="editLabel">编辑</button>
								</view>
							</view>
						</template>
						<template v-else>
							<text class="label-text" v-if="!isEdit" @tap="addLabel">添加 +</text>
						</template>			
					</view>
				</view>
			</view>
				
			<view class="padding-20 default-box bg-white bottom-20">
				<checkbox-group @change="changeDefault">
					<checkbox value="1" :checked="form.isDefault === '0'? false: true" />
					<text>设置默认地址</text>
				</checkbox-group>
			</view>
			
			<view class="bottom-20 padding-20 bg-white" v-if="editAddress" @tap="delAddress">
				<text class="font-red">删除地址</text>
			</view>
		</view>
		<view class="button-area">
			<button @tap="saveAddress" :disabled="canSubmit">保存</button>
		</view>
	</view>
</template>

<script>
import { successBack } from '@/common/utils/util'
import { createAddress,deleteAddress,updateAddress } from '@/common/api/account/account'
export default {
	name: 'Address',
	props: {
		editAddress: {
			type: Boolean,
			default: false
		},
		addressItem: {
			type: Object
		}
	},
	data() {
		return {
			labelIdx: -1,
			isEdit: false,
			isFocus: true,
			labels: ['家','公司','学校'],
			customItem: '全部',
			newLabel: '',
			form: {
				linkman: '',
				phone: '',
				zoneLabel: '',
				address: '',
				label: '',
				zipcode: '',
				isDefault: '0'
			},
			errorZipcode: false
		}
	},
	created() {
		// if(this.editAddress){
		// 	this.form = Object.assign({},this.form,this.addressItem)
		// }
	},
	mounted() {
		if(this.editAddress){
			this.form = Object.assign({},this.form,this.addressItem)
		}
	},
	computed: {
		isDisabled() {
			return this.newLabel === '' ? true : false 
		},
		canSubmit() {
			let form = this.form
			return !form.linkman || !form.phone || !form.zoneLabel || !form.address || !form.zipcode || this.errorZipcode  
		}
	},
	methods: {
		bindRegionChange(e) {
			let zone = e.detail.value
			this.form.zoneLabel = zone.join('-')
		},
		saveAddress() {
			if(this.editAddress){
				updateAddress(this.form).then(response => {
					successBack(response,'修改成功')
				})
			}
			else{
				createAddress(this.form).then(response => {
					successBack(response,'新增成功')
				})
			}
			
		},
		addLabel() {
			this.isEdit = true
		},
		saveLabel() {
			this.isFocus = false
			this.labelIdx = 3
			this.form.label = this.newLabel
		},
		editLabel() {
			this.isFocus = true
		},
		selectLabel(idx) {
			if(this.labelIdx === idx){
				this.labelIdx = -1
				this.form.label = ''
			}
			else{
				this.labelIdx = idx
				if(idx === 3){
					this.form.label = this.newLabel
				}
				else{
					this.form.label = this.labels[idx]
				}
			}
		},
		changeDefault(e) {
			let checks = e.detail.value
			this.form.isDefault = checks.length.toString()
		},
		async delAddress() {
			let [ msg,res ] = await uni.showModal({
				title: '提示',
				content: '是否删除当前地址？'
			})
			if(res.confirm){
				await deleteAddress(this.form.addressId).then(response => {
					successBack(response,'删除成功')
				})	
			}
		},
		checkCode(e) {
			let code = e.detail.value
			let reg = /^[0-9]{6}$/
			this.errorZipcode = !reg.test(code)
		}
	}
}
</script>

<style lang="scss">
	.error-tip{
		width: 100%;
		color: #fff;
		background-color: #CE3C39;
	}
	.address-box{
		height: 100%;
		.label-item{
			height: 150rpx;
		}
		
		.label-box{
			.label-text{
				height: 50rpx;
				line-height: 50rpx;
				padding: 0 10rpx;
				border: 1px solid #6e8cfa;
				color: #6e8cfa;
				border-radius: 8rpx;
				margin-left: 10rpx;
				&.isActive{
					background-color: #6e8cfa;
					color: #fff;
				}
			}
			
			.label-add {
				margin-top: 20rpx;
				
				button{
					height: 50rpx;
					line-height: 50rpx;
					width: 90rpx;
					background-color: #6E8CFA;
					color: #fff;
					border-radius:0;
					font-size: 26rpx;
					padding: 0 8rpx;
					margin-right: -2rpx;
					border-top-right-radius: 8rpx;
					border-bottom-right-radius: 8rpx;
				}
				
				.input-area{
					border: 1px solid #6E8CFA;
					height: 50rpx;
					box-sizing: border-box;
					border-radius: 8rpx;
					padding-left: 20rpx;
					input{
						width: 220rpx;
						font-size: 24rpx;
					}	
				}
				
				.label-edit{
					height: 50rpx;
					.label{
						position: relative;
						box-sizing: border-box;
						flex: auto;
						height: 50rpx;
						line-height: 50rpx;
						color: #6E8CFA;
						border: 1px solid #6E8CFA;
						border-right: 0;
						font-size: 26rpx;
						border-top-left-radius: 8rpx;
						border-bottom-left-radius: 8rpx;
						padding: 0 8rpx;
					}
					button{
						flex: auto;
						background-color: #949494;
					}
					
					&.isSelected{
						.label{
							background-color: #6E8CFA;
							color: #fff;
							&::after{
								content: '';
								position: absolute;
								width: 1px;
								height: 30rpx;
								background-color: #fff;
								top: 10rpx;
								right: 0;
							}
						}
						
						button{
							background-color: #6E8CFA;
						}
					}
				}
			}
		}
		
		.default-box{
			checkbox{
				margin-right: 20rpx;
				.wx-checkbox-input{
					margin-top: -8rpx;
				}
			}
		}
		.button-area{
			margin-bottom: 40rpx;
		}
	}
</style>