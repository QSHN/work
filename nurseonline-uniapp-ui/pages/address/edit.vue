<template>
	<view style="height: 100%;">
		<my-address :editAddress="editAddress" :addressItem="addressItem"/>
	</view>
</template>
<script>
import MyAddress from '../../components/MyAddress.vue'
export default {
	data() {
		return {
			editAddress: true,
			addressItem: {}
		}
	},
	components: { MyAddress },
	onLoad(e) {
		console.log(this.addressItem)
		this.addressItem = Object.assign({},this.addressItem,JSON.parse(e.addressItem))
		console.log("this.addressItem",this.addressItem)
	}
}
</script>