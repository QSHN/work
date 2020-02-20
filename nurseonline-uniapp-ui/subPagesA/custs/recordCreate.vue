<template>
	<view>
		<record :isEdit="false" :custName="custName" :custId="custId"></record>
	</view>
</template>

<script>
import Record from './components/record'
export default { 
	data() {
		return {
			custName: '',
			custId: ''
		}
	},
	components: {
		Record
	},
	onLoad(e) {
		this.custName = e.custName
		this.custId = e.custId
	}
}
</script>

<style lang="scss">
</style>
