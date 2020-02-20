<template>
	<view>
		<title-card title="个人及家庭情况">
			<template v-slot:content>
				<view class="padding-20">
					<view class="flex-msg padding-20-0 border-01">
						<text>家庭住址</text>
						<input type="text" v-model="form.home_address" class="tr font-999" placeholder-class="font-grey" placeholder="请输入家庭住址"/>
					</view>
					<view class="flex-msg padding-20-0 border-01">
						<text>联系电话</text>
						<input type="text" v-model="form.phone" class="tr font-999" placeholder-class="font-grey" placeholder="请输入联系电话"/>
					</view>
					<template v-for="(item,index) in pickerList">
						<view class="flex-msg padding-20-0 border-01" :key="item.key">
							<text>{{item.name}}</text>
							<picker :range="item.array" @change="selectChange($event,index,item)">
								<view class="font-999">
									<!-- {{item.array[item.arrIdx]}} -->
									{{form[item.key]}}
									<text class="iconfont">
										<template v-if="item.more">
											&#xe74a;
										</template>
										<template v-else>
											&#xe6f8;
										</template>
									</text>
								</view>
							</picker>
						</view>
						<template v-if="item.more">
							<view class="border-01" :key="item.key">
								<view class="flex-msg padding-20-0 font-small" v-for="(i,idx) in item.inputList" :key="idx">
									<text>{{i.name}}</text>
									<input type="text" class="tr border-01 font-999" placeholder-class="font-grey" :value="form[i.key]" @input="saveInput($event,i.key)"/>
								</view>
							</view>
						</template>
					</template>
				</view>
				<view class="button-area">
					<button @tap="submit">保存</button>
				</view>
			</template>
		</title-card>
	</view>
</template>
<script>
import { createCustDetail,editCustDetail } from '@/common/api/cust/cust'
export default{
	data(){
		return {
			form: {
				home_address: '',
				phone: '',
				elevator: '无',
				education: '文盲',
				info_source: '本人',
				language: '普通话',
				diet: '清淡',
				smoking: '无',
				smoking_times: '',
				smoking_years: '',
				drinking: '无',
				drinking_times: '',
				movement: '无',
				movement_type: '',
				family_support: '积极',
				caregiver: '自我照顾',
				allergic_history: '未发现',
				allergic_history_drug: '',
				allergic_history_food: '',
				payment_method: '自费'
			},
			pickerList: [
				{
					key: 'elevator',
					name: '电梯',
					array: ['无','有'],
					arrIdx: 0,
					more: false
				},
				{
					key: 'education',
					name: '教育程度',
					array: ["文盲","小学","中学","中专","大专及以上"],
					arrIdx: 0,
					more: false
				},
				{
					key: 'info_source',
					name: '资料来源',
					array: ["本人","家属","朋友","其他"],
					arrIdx: 0,
					more: false
				},
				{
					key: 'language',
					name: '常用语种',
					array: ["普通话","粤语","雷话","其它"],
					arrIdx: 0,
					more: false
				},
				{
					key: 'diet',
					name: '饮食',
					array: ["清淡","偏咸","偏甜","偏油腻"],
					arrIdx: 0,
					more: false
				},
				{
					key: 'smoking',
					name: '吸烟',
					array: ["有","无","已戒"],
					arrIdx: 1,
					more: false,
					inputList: [
						{
							key: 'smoking_times',
							name: '根/天',
							value: ''
						},
						{
							key: 'smoking_years',
							name: '年（烟龄）',
							value: ''
						}
					]
				},
				{
					key: 'drinking',
					name: '嗜酒',
					array: ["有","无","已戒"],
					arrIdx: 1,
					more: false,
					inputList: [
						{
							key: 'drinking_times',
							name: '两/天',
							value: ''
						}
					]
				},
				{
					key: 'movement',
					name: '运动频率',
					array: ["经常","无","偶尔"],
					arrIdx: 1,
					more: false,
					inputList: [
						{
							key: 'movement_type',
							name: '运动类型',
							value: ''
						}
					]
				},
				{
					key: 'family_support',
					name: '家庭支持',
					array: ["积极","一般","无"],
					arrIdx: 0,
					more: false
				},
				{
					key: 'caregiver',
					name: '日常照顾者',
					array: ["自我照顾","夫/妻","父母","子女","亲戚","朋友","保姆","其他"],
					arrIdx: 0,
					more: false
				},
				{
					key: 'allergic_history',
					name: '过敏史',
					array: ["有","未发现","不明确"],
					arrIdx: 1,
					more: false,
					inputList: [
						{
							key: 'allergic_history_drug',
							name: '过敏史(药物)',
							value: ''
						},
						{
							key: 'allergic_history_food',
							name: '过敏史(食物)',
							value: ''
						}
					]
				},
				{
					key: 'payment_method',
					name: '医疗费用支付方式',
					array: ["自费","公费","其他"],
					arrIdx: 0,
					more: false
				}
			],
			id: '',
			hasDetail: '',
			detail: {}
		}
	},
	onLoad(e) {
		this.id = e.custId
		this.hasDetail = e.hasDetail === 'true'
		this.detail = Object.assign({},this.detail,JSON.parse(e.detail))
		if(this.hasDetail){
			let str = this.detail.personalAndFamily
			try{
				let obj = JSON.parse(str)
				if(obj instanceof Object){
					this.form = Object.assign({},this.form,obj)
					Object.keys(this.form).map(value => {
						// if(value === ('smoking' || 'drinking' || 'movement' || 'allergic_history')){
						if(['smoking','drinking','movement','allergic_history'].includes(value)){
							// if(this.form[value] === ('有' || '经常')){
							if(['有','经常'].includes(this.form[value])){
								let idx = this.pickerList.findIndex(picker => {
									return picker.key === value
								})
								this.pickerList[idx].more = true
							}
						}
					})
				}
			}catch(e){
				//TODO handle the exception
				console.log('Is not a json String!')
			}
		}
	},
	methods: {
		selectChange(e,idx,item) {
			let arrIdx = Number(e.detail.value)
			this.pickerList[idx].more = false
			
			// if(item.key === ('smoking' || 'drinking' || 'movement' || 'allergic_history')){
			if(['smoking','drinking','movement','allergic_history'].includes(item.key)){
				if(arrIdx === 0){
					this.pickerList[idx].more = true
				}
				else{
					let inputList = this.pickerList[idx].inputList
					inputList.forEach(value => {
						this.$set(this.form,value.key,'')
					})
				}
			}
			
			this.pickerList[idx].arrIdx = arrIdx
			this.$set(this.form,item.key,this.pickerList[idx].array[arrIdx])
		},
		saveInput(e,key){
			this.$set(this.form,key,e.detail.value)
		},
		submit() {
			// let form = {
			// 	'家庭住址': this.form.home_address,
			// 	'联系电话': this.form.phone
			// }
			// let data = JSON.parse(JSON.stringify(this.pickerList))
			// data.forEach(picker => {
			// 	form[picker.key] = picker.array[picker.arrIdx]
			// 	
			// 	if(picker.more){
			// 		if(picker.key === 'smoking' || picker.key === 'drinking'){
			// 			form[picker.key] += '(' + picker.inputList.map(input => {
			// 				return input.value + input.name
			// 			}).join() + ')'
			// 		}
			// 		else if(picker.key === 'movement'){
			// 			form[picker.key] += '(' + picker.inputList.map(input => {
			// 				return input.value
			// 			}).join() + ')'
			// 		}
			// 		else if(picker.key === 'allergic_history'){
			// 			picker.inputList.forEach(input => {
			// 				form[input.key] = input.value
			// 			})
			// 		}
			// 	}
			// })
			let detail = Object.assign({},this.detail,{
				personalAndFamily: JSON.stringify(this.form),
				custId: this.id
			})
			if(this.hasDetail){
				editCustDetail(detail).then(response => {
					this.backTo(response)
				})
			}
			else{
				createCustDetail(detail).then(response => {
					this.backTo(response)
				})
			}
		},
		backTo(res){
			let data = res.data
			if(data.msg === 'success'){
				uni.showToast({
					title: '保存成功',
					icon: 'none',
					mask: true
				})
				setTimeout(() => {
					uni.navigateBack({
						delta: - 1
					})
				},500)
			}
		}
	}
}
</script>
<style lang="scss">
	page{
		background-color: #fff;
	}
	.font-999{
		color: #8a8a8a;
	}
	.font-small{
		font-size: 24rpx;
	}
	.iconfont{
		margin-left: 8rpx;
		vertical-align: middle;
		font-size: 40rpx;
	}
	.button-area{
		margin: 40rpx 0;
	}
</style>