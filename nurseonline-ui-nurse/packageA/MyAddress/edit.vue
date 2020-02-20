<template>
	<view class="flex-column justify-between address-box">
		<view>
			<view class="flex-msg border-01 padding-20 bg-white">
				<text>姓名</text>
				<input class="tr" type="text" v-model="form.linkman" placeholder="请输入联系人姓名" placeholder-class="font-grey"/>
			</view>
			<view class="flex-msg bottom-20 padding-20 bg-white">
				<text>电话(+86)</text>
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
			<view class="flex-msg bottom-20 padding-20 bg-white">
				<text>邮政编码</text>
				<input class="tr" type="text" v-model="form.zipcode" placeholder="请输入邮政编码" placeholder-class="font-grey"/>
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
					<checkbox value="1" :checked="form.isDefault === 0? false: true" />
					<text>设置默认地址</text>
				</checkbox-group>
			</view>
			
			<view class="bottom-20 padding-20 bg-white" @tap="delAddr">
				<text class="font-red"  >删除地址</text>
			</view>
		</view>
		<view class="button-area">
			<button @tap="saveAddress">保存</button>
		</view>
	</view>
</template>

<script>
export default {
	name: 'Address',
	props: {
		editAddress: {
			type: Boolean,
			default: false
		}
	},
	onLoad() {
		this.init()
	},
	data() {
		return {
			labelIdx: -1,
			isEdit: false,
			isFocus: true,
			labels: ['家','公司','医院','学校'],
			customItem: '全部',
			newLabel: '',
			form: {
				addressId:'',
				linkman: '',
				phone: '',
				zoneLabel: '',
				address: '',
				label: '',
				zipcode: '',
				isDefault: '1',
				zoneId:"-1",
				staffId:'',
				position: "0 0", 
			}
		}
	},
	computed: {
		isDisabled() {
			return this.newLabel === '' ? true : false 
		}
	},
	methods: {
		async init(){
			console.log("this.$store.state.editAddr",this.$store.state.editAddr)
			let item=this.$store.state.editAddr
			this.form.addressId=item.id
			this.form.linkman=item.linkMan
			this.form.phone=item.mobile
			this.form.address=item.address
			this.form.isDefault=item.isDefault
			this.form.label=item.label
			this.form.zipcode=item.zipcode
			this.form.zoneLabel=item.zoneLabel
			this.form.versionNo=item.versionNo
		},
		bindRegionChange(e) {
			let zone = e.detail.value
			this.form.zoneLabel = zone.join('-')
		},
		async saveAddress() {
			console.log(this.form)
			let res_info=await this.$apip.getPersonalInfo()
			this.form.staffId=res_info.data.data.staffId
			let submitArr=this.form
			submitArr.phone="86-"+this.form.phone
			let res_submitAddr=await this.$apip.saveAddr(submitArr)
			uni.navigateTo({
				url:"index"
			})
		},
		async delAddr(){
			uni.showLoading({
				
			})
			let res=await this.$apip.delAddr(this.form.addressId)
			uni.hideLoading()
			uni.navigateTo({
				url:"index"
			})
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
		}
	}
}
</script>

<style lang="scss">
	.address-box{
		height: 100%;
		.label-item{
			height: 150upx;
		}
		
		.label-box{
			.label-text{
				height: 50upx;
				line-height: 50upx;
				padding: 0 10upx;
				border: 1px solid #6e8cfa;
				color: #6e8cfa;
				border-radius: 8upx;
				margin-left: 10upx;
				&.isActive{
					background-color: #6e8cfa;
					color: #fff;
				}
			}
			
			.label-add {
				margin-top: 20upx;
				
				button{
					height: 50upx;
					line-height: 50upx;
					width: 90upx;
					background-color: #6E8CFA;
					color: #fff;
					border-radius:0;
					font-size: 26upx;
					padding: 0 8upx;
					margin-top: -2upx;
					margin-right: -2upx;
					border-top-right-radius: 8upx;
					border-bottom-right-radius: 8upx;
				}
				
				button[disabled]{
					background-color: #949494;
				}
				
				.input-area{
					border: 1px solid #6E8CFA;
					height: 50upx;
					box-sizing: border-box;
					border-radius: 8upx;
					padding-left: 20upx;
					input{
						width: 220upx;
						font-size: 24upx;
					}	
				}
				
				.label-edit{
					height: 50upx;
					.label{
						position: relative;
						box-sizing: border-box;
						flex: auto;
						height: 50upx;
						line-height: 50upx;
						color: #6E8CFA;
						border: 1px solid #6E8CFA;
						border-right: 0;
						font-size: 26upx;
						border-top-left-radius: 8upx;
						border-bottom-left-radius: 8upx;
						padding: 0 8upx;
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
								height: 30upx;
								background-color: #fff;
								top: 10upx;
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
				margin-right: 20upx;
				.wx-checkbox-input{
					margin-top: -8upx;
				}
			}
		}
		.button-area{
			margin-bottom: 40upx;
		}
	}
</style>