<template>
	<div class="basic-container" :class="{'basic-container--block':block, 'has-basic-header': title}">
		<el-card>
			<div class="basic-header" v-if="title">
				<span>{{title}}</span>
			</div>
			<div class="basic-body"><slot></slot></div>
		</el-card>
	</div>
</template>

<script>
export default {
	name: "basicContainer",
	props: {
		block: {
			type: Boolean,
			default: false,
		},
		title: String
	}
};
</script>

<style lang="scss">
	// .basic-container {
	// 	padding: 8px 10px;
	// 	border-radius: 10px;
	// 	box-sizing: border-box;
	// 	.el-card {
	// 		width: 100%;
	// 		.el-card__body{
	// 			padding: 5px;
	// 			.basic-header{
	// 				padding: 0 10px 8px;
	// 				border-bottom: 1px solid #E8E8E8;
	// 				font-size: 15px;
	// 			}
	// 			.basic-body{
	// 				padding-top: 8px;
	// 			}
	// 		}
	// 		&:first-child {
	// 			padding-top: 0;
	// 		}
	// 		&--block {
	// 			height: 100%;
	// 			.el-card {
	// 				height: 100%;
	// 			}
	// 		}
	// 	}
	// }
</style>
