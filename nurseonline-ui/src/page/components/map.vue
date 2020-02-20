<template>
	<div class="v-map">
		<div id="echart-map"></div>
	</div>
</template>

<script>
	import echarts from "echarts";
	import zhanjiang from "./zhanjiang.json";
	import pin from "./pin.js";
	console.log("pin", pin);

	// console.log("zhanjiange", zhanjiang);
	let mapData = {};
	zhanjiang.features.forEach((item) => {
		mapData[item.properties.name] = item.properties.center || [];
	});
	// console.log("mapData", mapData);
	echarts.registerMap("zhanjiang", zhanjiang);
	let convertData = (data) => {
		let res = [];
		for (let i = 0; i < data.length; i++) {
			let geoCoord = mapData[data[i].name];
			if (geoCoord) {
				res.push({
					name: data[i].name,
					value: geoCoord.concat(data[i].value)
				});
			}
		}
		return res;
	};

	let option = {
		tooltip: {
			trigger: "item",
			formatter: function (params) {
				return params.name + " : " + params.value[2];
			}
		},
		legend: {
			orient: "vertical",
			y: "bottom",
			x: "right",
			data:[
				{name: "待接单", icon: pin},
				{name: "待服务", icon: pin},
				{name: "正在服务", icon: pin}
			],
			textStyle: {
				color: "#FFF"
			}
		},
		geo: {
			map: "zhanjiang",
			label: {
			},
			itemStyle: {
				normal: {
					areaColor: "#063178",
					borderColor: "#00fbff",
					borderWidth: 2
				},
				emphasis: {
					areaColor: "#abcff7"
				}
			},
			zoom: 1.2
		},
		series: [
			{
				name: "待接单",
				type: "scatter",
				coordinateSystem: "geo",
				data: convertData([
					{name: "雷州市", value: 9, label: {show: true}},
					{name: "廉江市", value: 12, label: {show: true}},
					{name: "吴川市", value: 12, label: {show: true}}
				]),
				symbolSize: 40,
				symbol: "pin",
				symbolKeepAspect: true,
				itemStyle: {
					color: "#FFF",
					opacity: 1,
					borderColor: "#e59b02",
					borderWidth: 4
				},
				label: {
					show: true,
					formatter: "{@[2]}",
					offset: [0, 0],
					color: "#333"
				}
			},
			{
				name: "待服务",
				type: "scatter",
				coordinateSystem: "geo",
				data: convertData([
					{name: "坡头区", value: 12, label: {show: true}},
					{name: "赤坎区", value: 12},
					{name: "麻章区", value: 12}
				]),
				symbolSize: 32,
				symbol: "pin",
				symbolKeepAspect: true,
				itemStyle: {
					color: "#FFF",
					borderColor: "#ff907f",
					borderWidth: 3,
					opacity: 1
				},
				label: {
					show: true,
					formatter: "{@[2]}",
					offset: [0, 0],
					color: "#333"
				}
			},
			{
				name: "正在服务",
				type: "scatter",
				coordinateSystem: "geo",
				data: convertData([
					{name: "徐闻县", value: 9},
					{name: "遂溪县", value: 9},
					{name: "霞山区", value: 12}
				]),
				symbolSize: 22,
				symbol: "pin",
				symbolKeepAspect: true,
				itemStyle: {
					color: "#FFF",
					borderColor: "#22ac39",
					borderWidth: 3,
					opacity: 1
				}
			}
		]
	}

	export default {
		name: "vMap",
		data(){
			return{}
		},
		mounted(){
			this.initMap();
		},
		methods: {
			initMap(){
				setTimeout(() => {
					let map = echarts.init(document.getElementById("echart-map"));
					map.setOption(option);
				});
			}
		}
	}
</script>

<style>
	.v-map #echart-map{
		width: 90%;
		height: 600px;
	}
</style>
