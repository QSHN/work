<template>
	<view>
		<text class="font-blue">{{testTxt}}</text>
	</view>
</template>

<script>
export default {
	name: 'Grid',
	data() {
		return {
			
		}
	},
	props: {
		testTxt: {
			type: String,
			default: '' 
		},
	},
}
</script>

<style lang="scss">

</style>