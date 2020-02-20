<!--
	-    Copyright (c) 2018-2025, lengleng All rights reserved.
	-
	- Redistribution and use in source and binary forms, with or without
	- modification, are permitted provided that the following conditions are met:
	-
	- Redistributions of source code must retain the above copyright notice,
	- this list of conditions and the following disclaimer.
	- Redistributions in binary form must reproduce the above copyright
	- notice, this list of conditions and the following disclaimer in the
	- documentation and/or other materials provided with the distribution.
	- Neither the name of the pig4cloud.com developer nor the names of its
	- contributors may be used to endorse or promote products derived from
	- this software without specific prior written permission.
	- Author: lengleng (wangiegie@gmail.com)
	-->

<template>
	<div class="execution">
		<basic-container :title="org ? '机构服务订单查询' : '服务订单管理'">
			<avue-crud ref="crud"
				:page="page"
				:data="tableData"
				:table-loading="tableLoading"
				:option="tableOption"
				@on-load="getList"
        @search-change="handleFilter"
				@refresh-change="refreshChange"
        @search-reset="handleReset"
				@row-update="handleUpdate"
			>
				<template slot="search">
					<el-form-item label="订单状态">
						<el-select v-model="search.billState" placeholder="订单状态" size="small" multiple clearable>
							<el-option v-for="(item, key) in dics.bill_state" :key="key" :value="key" :label="item">{{item}}</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="支付状态">
						<el-select v-model="search.payState" placeholder="支付状态" size="small" multiple clearable>
							<el-option v-for="(item, key) in dics.pay_state" :key="key" :value="key" :label="item">{{item}}</el-option>
						</el-select>
					</el-form-item>
				</template>
				<template slot="date">
					<el-form-item label="创建时间">
						<el-date-picker v-model="search.slot" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
					</el-form-item>
				</template>
				<template slot="menu" slot-scope="scope">
					<el-tooltip content="详情" placement="top"><el-button icon="icon-ry-chakan" type="text" @click="menuClick('info', scope.row)"></el-button></el-tooltip>
					<el-tooltip content="评价" placement="top"><el-button icon="icon-ry-valuate" type="text" @click="menuClick('valuate', scope.row)"></el-button></el-tooltip>
					<el-tooltip content="处理过程" placement="top"><el-button icon="icon-ry-timeline" type="text" @click="menuClick('process', scope.row)"></el-button></el-tooltip>
				</template>
			</avue-crud>
		</basic-container>
		<bill-info v-model="info.show" :org="org" :row="currRow" @refresh="refreshChange"></bill-info>
		<bill-valuate v-model="valuate.show" :bill-id="currRow.billId"></bill-valuate>
		<bill-process v-model="process.show" :bill-id="currRow.billId"></bill-process>
	</div>
</template>

<script>
	import { fetchList, getObj, addObj, putObj, delObj } from '@/api/nursing/bill/bill'
	import { tableOption } from '@/const/crud/nursing/bill/bill'
	import { mapGetters } from 'vuex'
	import billInfo from "./components/info.vue"
	import billValuate from "./components/valuate.vue"
	import billProcess from "./components/process.vue"
	import { fetchTreeByItemClassCode } from '@/api/nursing/aid/itemclass'
	export default {
		name: 'bill',
		data() {
			return {
				tableData: [],
				page: {
					total: 0, // 总页数
					currentPage: 1, // 当前页数
					pageSize: 20 // 每页显示多少条
				},
				tableLoading: false,
				tableOption: tableOption,
				info: {
					show: false
				},
				search: {
					billState: [],
					payState: []
				},
				currRow: {},
				param: {},
				valuate: {
					show: false
				},
				process: {
					show: false
				},
				dicsData: {
					billState: "bill_state",
					payState: "pay_state"
				},
				dics: {
					pay_state: {},
					bill_state: {}
				}
			}
		},
		props: {
			org: {
				type: Boolean,
				default: false
			},
			orgId: [Number, String]
		},
		computed: {
			...mapGetters(['permissions'])
		},
		components: {billInfo, billValuate, billProcess},
		watch: {
			orgId(val){
				this.getList(this.page, this.param);
				console.log("watch", val);
			}
		},
		mounted(){
			this.getCodes();
		},
		methods: {
			getCodes(){
				for(let key in this.dics){
					fetchTreeByItemClassCode(key).then(res => {
						if(res.data && res.data.data){
							let obj = {};
							res.data.data.forEach(item => {
								obj[item.itemId] = item.itemName;
							});
							this.dics[key] = obj;
						}
					}).catch();
				}
			},
			getList(page, params) {
				if(this.org && (!this.orgId || this.orgId <= 0)) return;
				this.tableLoading = true;
				fetchList(Object.assign({
					current: page.currentPage,
					size: page.pageSize,
					orgId: this.orgId || null
				},this.param, params)).then(response => {
					this.tableData = response.data.data.records;
					this.page.total = response.data.data.total;
          this.page.currentPage = response.data.data.current
          this.page.pageSize = response.data.data.size
					this.tableLoading = false;
				}).catch(err => {
					this.tableLoading = false;
				});
			},
			/**
			 * @title 数据更新
			 * @param row 为当前的数据
			 * @param index 为当前更新数据的行数
			 * @param done 为表单关闭函数
			 *
			 **/
			handleUpdate: function(row, index, done) {
				putObj(row).then(data => {
					this.tableData.splice(index, 1, Object.assign({}, row))
					this.$message({
						showClose: true,
						message: '修改成功',
						type: 'success'
					})
					done();
					this.getList(this.page);
				});
			},
			/**
			 * 刷新回调
			 */
			refreshChange() {
				this.getList(this.page, this.param);
			},
      handleReset() {
        this.param = {};
        this.search.billState = [];
        this.search.payState = [];
        this.page.currentPage = 1;
        this.getList(this.page)
      },
			handleFilter(param) {
				console.log("onload", param, this.search);
        this.page.currentPage = 1
        if(param.billDate){
          param.startDate = param.billDate[0];
          param.endDate = param.billDate[1];
        }
				param.billState = this.search.billState.join(",");
				param.payState = this.search.payState.join(",");
				let paramTemp = {...param};
				delete paramTemp.billDate;
				this.param = {...paramTemp};
				this.getList(this.page, paramTemp);
			},
			menuClick(menuName, row){
				this.currRow = row;
				this[menuName].show = true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .el-select__tags{
		overflow: hidden;
		&>span{
			display: block;
			white-space: nowrap;
		}
		.el-tag{
			display: inline-block;
		}
	}
</style>
