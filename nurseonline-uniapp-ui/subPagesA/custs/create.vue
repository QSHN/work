<template>
	<view class="create-area flex-column">
		<!-- <view class="scroll-top">
            <create-step-line :active="1"></create-step-line>
        </view> -->
		<view class="create-box">
			<view class="error-tip padding-20 tc" v-if="errorIdNo">身份证格式错误</view>
			<view class="flex-msg create-item border-01">
				<text>姓名</text>
				<input type="text" v-model="form.custName" placeholder="请输入真实姓名" class="tr" placeholder-class="font-grey"/>
			</view>
			<view class="flex-msg create-item border-01" :class="{'font-red': errorIdNo}">
				<text>身份证号</text>
				<input type="text" v-model="form.idNo" placeholder="请输入身份证号" class="tr" placeholder-class="font-grey" @blur="checkIdNo"/>
			</view>
			<view class="flex-msg create-item border-01">
				<text>性别</text>
				<picker :range="sexColumn" @change="selectChange" :value="form.sex" range-key="label">
					<view>{{sexColumn[form.sex].label}}</view>
				</picker>
			</view>
			
			<view class="flex-msg create-item border-01">
				<text>联系电话</text>
				<input type="text" v-model="form.phone" placeholder="请输入联系电话" class="tr" placeholder-class="font-grey"/>
			</view>
			<view class="flex-msg create-item border-01">
				<text>所在区域</text>
				<!-- <input type="text" placeholder="请填写所在区域" class="tr"/> -->
				<picker mode="region" @change="selectZone" :value="form.zoneLabel">
					<text :class="{'font-grey': !form.zoneLabel}">{{form.zoneLabel || '省市区县、乡镇等'}}</text>
				</picker>
			</view>
			<view class="flex-msg create-item border-01">
				<text>家庭住址</text>
				<input style="width: 240rpx;" type="text" v-model="form.address" placeholder="请输入地址" class="tr" placeholder-class="font-grey"/>
			</view>
			<view class="flex-msg create-item border-01">
				<text>关系</text>
				<picker :range="relationTypes" @change="relationChange" :value="index" range-key="itemName">
					<view :class="{'font-grey': !relationTypes[index].itemName}">{{relationTypes[index].itemName || '请选择你和服务对象的关系'}}</view>
				</picker>
			</view>
		</view>
		<view class="button-area">
			<button @tap="saveCust" :disabled="canSubmit">保存</button>
		</view>
	</view>
</template>

<script>
import CreateStepLine from '@/components/CreateStepLine'
import { createCust,getRelationTypes } from '@/common/api/cust/cust'
import { mapGetters } from 'vuex'
import { switchTime, calculateAge } from '@/common/utils/util'

export default {
	components: {
		CreateStepLine
	},
	data() {
		return {
			sexIndex: 0,
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
				}
			],
			form: {
				custName: '',
				idNo: '',
				sex: '0',
				birthDate: '',
				age: '',
				address: '',
				phone: '',
				zoneLabel: '',
				relationType: ''
			},
			relationTypes: [],
			index: 0,
			errorIdNo: false
		}
	},
	created() {
		this.init()
		getRelationTypes().then(response => {
			let data = response.data
			if(data.msg === 'success'){
				this.relationTypes = data.data
				this.form.relationType = data.data[0].itemId
			}
		})
	},
	computed: {
		...mapGetters(['scanUserInfo']),
		canSubmit() {
			return this.errorIdNo
		}
	},
	methods: {
		init() {
			let userinfo = this.scanUserInfo
			this.form.custName = userinfo.name
			this.form.idNo = userinfo.idNumber
			this.form.birthDate = switchTime(userinfo.birthday, 'YYYY-MM-DD')
			this.form.age = calculateAge(this.form.birthDate)
			this.form.address = userinfo.address || '';

			// 获取性别
			for (let item of this.sexColumn) {
				if (item.label == userinfo.gender) {
					this.form.sex = item.value
					break
				}
			}
		},
		selectChange(e) {
			this.form.sex = e.detail.value
		},
		relationChange(e) {
			this.index = e.detail.value
			this.form.relationType = this.relationTypes[e.detail.value].itemId
		},
		selectZone(e) {
			let zone = e.detail.value
			// console.log(zone.join(''))
			this.form.zoneLabel = zone.join('')
		},
		selectDate(e) {
			this.form.birthDate = e.detail.value
		},
		saveCust() {
			if(!this.form.custName){
				uni.showToast({
					title: '请填写真实姓名',
					icon: 'none',
					mask: true
				})
				return false;
			}
			createCust(Object.assign({},this.form,{
				address: this.form.zoneLabel + this.form.address
			})).then(response => {
				let data = response.data
				if(data.msg === 'success'){
					if(data.data.length > 0){
						uni.navigateTo({
							url: './bind?phoneList=' + JSON.stringify(data.data) + '&cust=' + JSON.stringify(this.form)
						})
					}
					else{
						uni.showToast({
							title: '创建成功！',
							icon: 'none',
							mask: true
						})
						setTimeout(() => {
							uni.navigateBack()
						},800)
					}
				}
			})
		},
		checkIdNo(e) {
			let idNo = e.detail.value
			let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
			this.errorIdNo = !reg.test(idNo)
		}
	}
}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.error-tip{
		width: 100%;
		color: #fff;
		background-color: #CE3C39;
	}
	.create-area{
		min-height: 100%;
		.create-box {
			margin-top: 30rpx;
		}
		.create-item{
			padding: 20rpx;
		}
		.button-area {
			margin-bottom: 40rpx;
			margin-top: 100rpx;
		}
	}
</style>
