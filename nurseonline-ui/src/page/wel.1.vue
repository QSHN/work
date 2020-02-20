<template>
	<div class="home-wrapper">
		<div class="h-cnt">
			<div class="h-header">湛江市某某医院互联网护理监控平台</div>
			<el-row class="h-body">
				<el-col :span="10">
					<div class="h-map">
						<v-map></v-map>
					</div>
				</el-col>
				<el-col :span="14">
					<div class="h-time">
						{{t.yy || "----"}}年{{t.MM || "--"}}月{{t.dd || "--"}}日　
						{{t.hh || "00"}}:{{t.mm || "00"}}:{{t.ss || "00"}}
					</div>
					<div class="h-tb h-tb-1">
						<el-table :data="tbData1">
							<el-table-column label="注册护士数" prop="col1"></el-table-column>
							<el-table-column label="服务护士数" prop="col2"></el-table-column>
							<el-table-column label="待接订单数" prop="col3"></el-table-column>
							<el-table-column label="服务订单总数" prop="col4"></el-table-column>
						</el-table>
					</div>
					<div class="h-column h-box">
						<div class="box-title">一周的接单情况</div>
						<div id="echart-column" style="width:100%;height:230px"></div>
					</div>
					<div class="h-tb h-tb-2 h-box">
						<div class="box-title">当天服务的排名和数量</div>
						<el-table :data="tbData2">
							<el-table-column label="排名" prop="col1" align="center"></el-table-column>
							<el-table-column label="服务项目" prop="col2" align="center"></el-table-column>
							<el-table-column label="订单数" prop="col3" align="center"></el-table-column>
							<el-table-column label="用户平均评分" prop="col4" align="center"></el-table-column>
						</el-table>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import echarts from "echarts";
	import vMap from "./components/map.vue";

	const formatTime = (str) => {
		str = parseInt(str);
		if(str < 10){
			str = "0" + str;
		}
		return str;
	};

	const setTime = () => {
		let t = new Date();
		let yy = t.getFullYear();
		let MM = t.getMonth() + 1;
		let dd = t.getDate();
		let hh = formatTime(t.getHours());
		let mm = formatTime(t.getMinutes());
		let ss = formatTime(t.getSeconds());
		return {yy, MM, dd, hh, mm, ss};
	};

	let opColumn =  {
		
	};

	export default {
		name: "wel",
		data() {
			return {
				t: {
					yy: "",
					MM: "",
					dd: "",
					hh: "",
					mm: "",
					ss: ""
				},
				tbData1: [{
					col1: "65,000",
					col2: "15,000",
					col3: "1,000",
					col4: "66"
				}],
				tbData2: [
					{
						col1: "NO.1",
						col2: "肠胀气护理",
						col3: "5670",
						col4: "9.5"
					},{
						col1: "NO.2",
						col2: "便秘护理",
						col3: "4512",
						col4: "9.8"
					},{
						col1: "NO.3",
						col2: "鼻饲",
						col3: "2130",
						col4: "9.8"
					},{
						col1: "NO.4",
						col2: "造口护理",
						col3: "1158",
						col4: "9.6"
					},{
						col1: "NO.5",
						col2: "压疮伤口换药",
						col3: "1008",
						col4: "10"
					}
				]
			}
		},
		components: {vMap},
		mounted(){
			this.initTime();
			this.initEchartColumn();
		},
		methods: {
			initTime(){
				this.t = setTime();
				let intervalTemp = setInterval(() => {this.t = setTime()}, 500);
			},
			initEchartColumn(){
				let ec = echarts.init(document.getElementById("echart-column"));
				ec.setOption({
					color: ["#18669d", "#58e9d5", "#abcff7", "#e5323e"],
					tooltip: {
						trigger: "axis",
						axisPointer: {
							type: "shadow"
						}
					},
					grid:{
						x: 50,
						y: 50,
						x2: 10,
						y2: 30
					},
					legend: {
						data: ["下单数", "接单数", "服务数"],
						icon: "rect",
						itemWidth: 11,
						itemHeight: 10,
						itemGap: 25,
						textStyle: {color: "#FFF"},
						right: 0,
						top: 14
					},
					// toolbox: {
					// 	show: true,
					// 	orient: "vertical",
					// 	left: "right",
					// 	top: "center",
					// 	feature: {
					// 		mark: {show: true},
					// 		dataView: {show: true, readOnly: false},
					// 		magicType: {show: true, type: ["line", "bar", "stack", "tiled"]},
					// 		restore: {show: true},
					// 		saveAsImage: {show: true}
					// 	}
					// },
					// calculable: true,
					xAxis: [
						{
							type: "category",
							axisTick: {show: false},
							data: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
							axisLine: {
								lineStyle: {color: "#292e48"}
							},
							axisLabel: {color: "#FFF"}
						}
					],
					yAxis: [
						{
							type: "value",
							name: "订单数量（单）",
							nameTextStyle: {
								color: "#FFF"
							},
							axisLine: {
								lineStyle: {color: "#353f59"}
							},
							axisLabel: {color: "#FFF"},
							splitLine: {
								lineStyle: {color: "#292e48"}
							}
						}
					],
					series: [
						{
							name: "下单数",
							type: "bar",
							barGap: 0,
							// label: labelOption,
							data: [320, 332, 301, 334, 390, 334, 220],
							barGap: "14%"
						},
						{
							name: "接单数",
							type: "bar",
							// label: labelOption,
							data: [220, 182, 191, 234, 290, 204, 190]
						},
						{
							name: "服务数",
							type: "bar",
							// label: labelOption,
							data: [150, 232, 201, 154, 190, 334, 290]
						}
					]
				});
				// ec.clear();
				// this.$nextTick(() => {
				// 	// let analysisEl = this.$refs.analysisEl;
				// 	// this.echartH = analysisEl.offsetHeight;
				// 	setTimeout(() => {
				// 		ec.resize();
				// 		ec.setOption(opColumn, true);
				// 	}, 500);
				// 	window.addEventListener("resize", () => {
				// 		// this.echartH = analysisEl.offsetHeight;
				// 		ec.resize();
				// 	});
				// });
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	$bgColor: #10132A;
	$headerS: 32px;
	$borderColor: #3355a7;
	.home-wrapper{
		background: $bgColor;
		height: 100%;
		padding: 40px 20px 20px;
		color: #FFF;
		overflow-x: hidden;
		overflow-y: auto;
		.h-cnt{
			border: 1px solid $borderColor;
			// height: 100%;
			position: relative;
			padding: 35px 35px 20px;
			box-sizing: border-box;
		}
		.h-header{
			color: #FFF;
			height: $headerS;
			line-height: $headerS;
			font-size: $headerS;
			position: absolute;
			top: -20px;
			width: 640px;
			left: 50%;
			margin-left: -320px;
			background: $bgColor;
			text-align: center;
			font-weight: 600;
			@mixin box{
				content: "";
				width: 10px;
				height: $headerS;
				border: 1.5px solid $borderColor;
				position: absolute;
				top: 4px;
				box-sizing: border-box;
			}
			&::before{
				@include box;
				left: 0;
			}
			&::after{
				@include box;
				right: 0;
			}
		}
		.h-time{
			border: 1px solid #3355a7;
			width: 223px;
			line-height: 25px;
			border-radius: 3px;
			padding-left: 25px;
		}
		.h-tb{
			/deep/ .el-table{
				th,td{
					border: none;
					border-right: 1px solid #2a5199;
					&:last-child{
						border-right: none;
					}
				}
				th{
					background: #2656cd;
					color: #FFF;
					font-weight: normal;
					padding: 3px 0;
					.cell{
						height: 26px;
						line-height: 26px;
					}
				}
				td{
					background: #1c347a;
					color: #e1f56a;
					border-bottom: 1px solid #2a5199;
				}
				tr:last-child{
					td{
						border-bottom: none;
					}
				}
				&::before{
					display: none;
				}
			}
			&.h-tb-1{
				margin: 10px 0;
				/deep/ .el-table{
					td{
						font-size: 20px;
						font-weight: 600;
						.cell{
							height: 36px;
							line-height: 36px;
						}
					}
				}
			}
			&.h-tb-2{
				padding: 24px 20px;
				/deep/ .el-table{
					td{
						background: #12265a;
						&:nth-of-type(even){
							background: #1c347a;
						}
					}
					tr:nth-child(n+3){
						td{
							color: #FFF;
						}
					}
				}
			}
		}
		.h-box{
			border: 1px solid #141c41;
			margin: 24px 0;
			padding: 6px;
			position: relative;
			@mixin temp{
				content: "";
				position: absolute;
				width: 15px;
				height: 15px;
			}
			$border: 2px solid #FFF;
			&:before{
				@include temp;
				top: -1px;
				left: -1px;
				border-top: $border;
				border-left: $border;
			}
			&:after{
				@include temp;
				right: -1px;
				bottom: -1px;
				border-bottom: $border;
				border-right: $border;
			}
			@mixin linear-bg{
				background: -webkit-linear-gradient(#0c102e, #063178); /* Safari 5.1 - 6.0 */
				background: -o-linear-gradient(#0c102e, #063178); /* Opera 11.1 - 12.0 */
				background: -moz-linear-gradient(#0c102e, #063178); /* Firefox 3.6 - 15 */
				background: linear-gradient(#0c102e, #063178); /* 标准的语法（必须放在最后） */
			}
			.box-title{
				height: 30px;
				line-height: 30px;
				font-size: 15px;
				color: #FFF;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				padding: 0 30px;
				top: -15px;
				@include linear-bg;
			}
		}
	}
</style>
