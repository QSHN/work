<template>
	<view>
		<record :isEdit="true" :custName="custName" :custId="custId" :record="record"></record>
	</view>
</template>

<script>
import Record from './components/record'
export default { 
	data() {
		return {
			custName: '',
			record: {},
			custId: ''
		}
	},
	components: {
		Record
	},
	onLoad(e) {
		this.custName = e.custName
		this.custId = e.custId
		// console.log('接：',e.record)
		// console.log(decodeURIComponent(e.record))
		// console.log(JSON.parse(e.record))
		this.record = Object.assign({},JSON.parse(decodeURIComponent(e.record)))
	}
}
</script>

<style lang="scss">
</style>
