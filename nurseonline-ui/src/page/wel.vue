<template>
	<div class="home-wrapper">
		<div class="h-cnt">
			优佳护
		</div>
		<div class="h-desc">优质护理·触手可及</div>
	</div>
</template>

<script>
	export default {
		name: 'wel'
	}
</script>

<style scoped="scoped" lang="scss">
	$bgColor: #10132A;
	$headerS: 32px;
	$borderColor: #3355a7;
	.home-wrapper{
		background: #FFF;
		color: #6e8cfa;
		text-align: center;
		height: 100%;
		.h-cnt{
			padding-top: 200px;
			font-size: 100px;
			font-weight: 600;
		}
		.h-desc{
			letter-spacing: 10px;
			text-indent: 30px;
		}
	}
</style>
