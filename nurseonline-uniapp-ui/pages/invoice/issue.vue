<template>
	<view class="invoice" :class="{'noScroll': dialogShow}">
		<view class="bottom-20">
			<title-card title="请选择发票介质">
				<template slot="content">
					<view class="padding-0-20 select-box">
						<view class="justify-between bottom-10">
							<view class="select-item tc"
								  :class="{'isSelected': form.invoiceMedia === index}"
								  v-for="(item,index) in types"
								  :key="index"
								  @tap="selectType(index)">
								  {{item}}
							</view>
						</view>
						<view class="font-grey tip">电子发票与纸质发票具有同等法律效力，可支持报销入账</view>
					</view>
				</template>
			</title-card>
		</view>
		<view class="bottom-20">
			<title-card title="发票详情">
				<template slot="content">
					<view class="padding-0-20 invoice-detail">
						<view class="align-center padding-20-0 border-01 detail-item">
							<text class="label">抬头类型</text>
							<radio-group @change="radioChange">
								<label class="radio"><radio value="0" checked="true" color="#6e8cfa"/>企业单位</label>
								<label class="radio"><radio value="1" color="#6e8cfa"/>个人/非企业单位</label>
							</radio-group>
						</view>
						<view class="align-center padding-20-0 border-01 detail-item">
							<text class="label">发票抬头</text>
							<view class="">
								<input type="text" v-model="form.invoiceTitle" placeholder="请填写发票抬头"/>
							</view>
						</view>
						<view class="align-center padding-20-0 border-01 detail-item">
							<text class="label">税号</text>
							<view class="">
								<input type="text" v-model="form.invoiceTaxNo" placeholder="请填写纳税人识别号"/>
							</view>
						</view>
						<view class="align-center padding-20-0 border-01 detail-item">
							<text class="label">发票内容</text>
							<view class="">
								<input type="text" v-model="form.invoiceContent" placeholder="请填写发票内容"/>
							</view>
						</view>
						<view class="align-center padding-20-0 border-01 detail-item">
							<text class="label">发票金额</text>
							<view class="">
								<text class="font-blue">{{form.invoiceAmt}}</text>元
							</view>
						</view>
						<view class="flex-msg padding-20-0 border-01 detail-item">
							<text class="label">更多信息</text>
							<view class="font-grey" @tap="getMoreMessage">
								填写备注、地址等（非必填）
								<text class="iconfont" v-if="moreMessage">&#xe74a;</text>
								<text class="iconfont" v-else>&#xe6f8;</text>
							</view>
						</view>
						<view v-if="moreMessage">
							<view class="align-center padding-20-0 border-01 detail-item">
								<text class="label">地址</text>
								<view class="">
									<input type="text" v-model="form.invoiceAddress" placeholder="请输入地址"/>
								</view>
							</view>
							<view class="align-center padding-20-0 border-01 detail-item">
								<text class="label">电话</text>
								<view class="">
									<input type="text" v-model="form.invoicePhone" placeholder="请输入电话"/>
								</view>
							</view>
							<view class="align-center padding-20-0 border-01 detail-item">
								<text class="label">开户银行</text>
								<view class="">
									<input type="text" v-model="form.invoiceBank" placeholder="请输入开户银行"/>
								</view>
							</view>
							<view class="align-center padding-20-0 border-01 detail-item">
								<text class="label">开户账号</text>
								<view class="">
									<input type="text" v-model="form.invoiceBankAcc" placeholder="请输入开户银行卡账号"/>
								</view>
							</view>
						</view>
					</view>
				</template>
			</title-card>
		</view>
		<template v-if="form.invoiceMedia === 0">
			<title-card title="接收方式">
				<template slot="content">
					<view class="padding-0-20 invoice-detail">
						<view class="align-center padding-20-0 border-01 detail-item">
							<text class="label">电子邮箱</text>
							<view class="">
								<input type="text" v-model="form.email" placeholder="用于向您发送电子发票和行程"/>
							</view>
						</view>
						<view class="align-center padding-20-0 border-01 detail-item">
							<text class="label">手机号码</text>
							<view class="">
								<input type="text" v-model="form.mobile" placeholder="用于向您发送发票信息"/>
							</view>
						</view>
					</view>
				</template>
			</title-card>
		</template>
		<template v-else-if="form.invoiceMedia === 1">
			<title-card title="接收方式">
				<template slot="content">
					<view class="padding-0-20 invoice-detail">
						<view class="align-center padding-20-0 border-01 detail-item">
							<text class="label">收件人</text>
							<view class="">
								<input type="text" v-model="form.linkman" placeholder="请填写收件人"/>
							</view>
						</view>
						<view class="align-center padding-20-0 border-01 detail-item">
							<text class="label">手机号码</text>
							<view class="">
								<input type="text" v-model="form.mobile" placeholder="用于向您发送发票信息"/>
							</view>
						</view>
						<view class="align-center padding-20-0 border-01 detail-item">
							<text class="label">所在地区</text>
							<view class="">
								<input type="text" value="" placeholder="请填写联系电话"/>
							</view>
						</view>
						<view class="align-center padding-20-0 border-01 detail-item">
							<text class="label">详细地址</text>
							<view class="">
								<input type="text" v-model="form.address" placeholder="请填写详细地址"/>
							</view>
						</view>
						<view class="align-center padding-20-0 detail-item border-01">
							<text class="label">电子邮箱</text>
							<view class="">
								<input type="text" v-model="form.email" placeholder="请填写电子邮箱"/>
							</view>
						</view>
					</view>
				</template>
			</title-card>
		</template>
		<view class="button-area bottom-20">
			<button @tap="openDialog">提交</button>
		</view>
		<view class="tip-box invoice-detail" v-if="dialogShow">
			<view class="bg-white tip-area">
				<view class="padding-20 border-01 tc title-box">			
					<text class="tip-title font-deep">开具电子发票</text>
					<text class="iconfont" @tap="closeDialog">&#xe615;</text>
				</view>
				<view class="padding-0-20">
					<view class="align-center padding-20-0 detail-item border-01">
						<text class="label font-grey">发票类型</text>
						<view class="">{{types[form.invoiceMedia]}}</view>
					</view>
					<view class="align-center padding-20-0 detail-item border-01">
						<text class="label font-grey">发票抬头</text>
						<view class="">{{form.invoiceTitle}}</view>
					</view>
					<view class="align-center padding-20-0 detail-item border-01">
						<text class="label font-grey">税号</text>
						<view class="">{{form.invoiceTaxNo}}</view>
					</view>
					<template v-if="form.invoiceMedia === 0">
						<view class="align-center padding-20-0 detail-item border-01">
							<text class="label font-grey">电子邮箱</text>
							<view class="">{{form.email}}</view>
						</view>
						<view class="align-center padding-20-0 detail-item border-01">
							<text class="label font-grey">手机</text>
							<view class="">{{form.mobile}}</view>
						</view>
					</template>
					<template v-else-if="form.invoiceMedia === 1">
						<view class="align-center padding-20-0 detail-item border-01">
							<text class="label font-grey">收件人</text>
							<view class="">{{form.linkman}}</view>
						</view>
						<view class="align-center padding-20-0 detail-item border-01">
							<text class="label font-grey">联系电话</text>
							<view class="">{{form.mobile}}</view>
						</view>
						<view class="align-center padding-20-0 detail-item border-01">
							<text class="label font-grey">所在地区</text>
							<view class="">广东省广州市天河区</view>
						</view>
						<view class="align-center padding-20-0 detail-item border-01">
							<text class="label font-grey">详细地址</text>
							<view class="">{{form.address}}</view>
						</view>
						<view class="align-center padding-20-0 detail-item border-01">
							<text class="label font-grey">电子邮箱</text>
							<view class="">{{form.email}}</view>
						</view>
					</template>
					<view class="button-area bottom-20">
						<button @tap="submit">确认提交</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { createInvoice,submitInvoice } from '@/common/api/invoice/invoice'
export default {
	data() {
		return {
			types: ["电子发票","纸质发票"],
			typeIndex: 0,
			moreMessage: false,
			dialogShow: false,
			form: {
				invoiceMedia: 0,
				invoiceTitleType: '0',
				invoiceTitle: '',
				invoiceTaxNo: '',
				invoiceContent: '服务费',
				invoiceAmt: 0,
				invoiceAddress: '',
				invoicePhone: '',
				invoiceBank: '',
				invoiceBankAcc: '',
				email: '',
				mobile: '',
				linkman: '',
				address: ''
			},
			billIds: []
		}
	},
	onLoad(e) {
		this.form.invoiceAmt = e.total
		this.billIds = JSON.parse(e.billIds)
	},
	methods: { 
		selectType(idx) {
			this.form.invoiceMedia = idx
		},
		getMoreMessage() {
			this.moreMessage = !this.moreMessage
		},
		openDialog() {
			this.dialogShow = true
		},
		closeDialog() {
			this.dialogShow = false
		},
		submit() {
			let billIds = this.billIds
			let params = ''
			billIds.map((value,index) => {
				if(index > 0){
					params += '&billIds=' + value
				}
				else{
					params += '?billIds=' + value
				}
			})
			// console.log(params)
			createInvoice(this.form,params).then(response => {
				let data = response.data
				if(data.code === 0){
					uni.showToast({
						title: '开具成功！',
						complete: () => {
							setTimeout(() =>{
								uni.navigateBack({
									delta: -1
								})
							},500)
						}
					})
				}
			})
		},
		radioChange(e) {
			this.form.invoiceTitleType = e.detail.value
		}
	}
}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.invoice{
		height: 100%;
		&.noScroll{
			overflow: hidden;
		}
	}
	.select-box{
		.select-item{
			width: 280rpx;
			height: 90rpx;
			line-height: 90rpx;
			border: 1px solid #b5b5b6;
			color: #b5b5b6;
			border-radius: 8rpx;
			&.isSelected{
				color: #6e8cfa;
				border: 1px solid #6e8cfa;
			}
		}
		.tip{
			font-size: 24rpx;
		}
	}
	.invoice-detail{
		.detail-item{
			.label{
				width: 150rpx;
			}
			input{
				width: 400rpx;
			}
			.radio{
				margin-right: 30rpx;
				radio .wx-radio-input{
					margin-top: -8rpx;
					width: 30rpx;
					height: 30rpx;
				}
			}
			.font-small{
				font-size: 24rpx;
			}
		}
	}
	.tip-box{
		background-color: rgba(0,0,0,0.5);
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 99;
		.title-box{
			position: relative;
			.tip-title{
				font-size: 32rpx;
			}
			.iconfont{
				position: absolute;
				top: 22rpx;
				left: 20rpx;
				font-size: 40rpx;
			}
		}
		.tip-area{
			position: absolute;
			width: 100%;
			bottom: 0;
			left: 0;
			z-index: 999;
		}
	}
	.button-area{
		margin-top: 40rpx;
	}
</style>
