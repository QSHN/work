<template>
	<view style="height: 100%;">
		<my-address :editAddress="editAddress"/>
	</view>
</template>
<script>
import MyAddress from '../../components/MyAddress.vue'
export default {
	data() {
		return {
			editAddress: false
		}
	},
	components: { MyAddress }
}
</script>