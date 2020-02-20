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
		<basic-container :title="org ? '机构预约单查询' : '服务预约单管理'">
			<avue-crud ref="crud"
				:page="page"
				:data="tableData"
				:table-loading="tableLoading"
				:option="tableOption"
				@on-load="getList"
        @search-change="handleFilter"
        @search-reset="handleReset"
				@refresh-change="refreshChange"
				@row-update="handleUpdate"
			>
				<template slot="date">
					<el-form-item label="创建时间">
						<el-date-picker v-model="search.slot" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
					</el-form-item>
				</template>
				<template slot="menu" slot-scope="scope">
					<el-tooltip content="详情" placement="top"><el-button icon="icon-ry-chakan" type="text" @click="menuClick('info', scope.row)"></el-button></el-tooltip>
					<template v-if="scope.row.taskState == 0 && !org">
						<el-tooltip content="分派人员" placement="top"><el-button icon="icon-ry-assign" type="text" @click="menuClick('assign', scope.row)"></el-button></el-tooltip>
					</template>
					<el-tooltip content="分派情况" placement="top"><el-button icon="icon-ry-structure" type="text" @click="menuClick('assignDetail', scope.row)"></el-button></el-tooltip>
					<el-tooltip content="处理过程" placement="top"><el-button icon="icon-ry-timeline" type="text" @click="menuClick('process', scope.row)"></el-button></el-tooltip>
				</template>
			</avue-crud>
		</basic-container>
		<bill-info v-model="info.show" :row="currRow" @refresh="refreshChange"></bill-info>
		<bill-assign v-model="assign.show" :task-id="currRow.taskId" :row="currRow"></bill-assign>
		<bill-assign-detail v-model="assignDetail.show" :task-id="currRow.taskId"></bill-assign-detail>
		<bill-process v-model="process.show" :task-id="currRow.taskId"></bill-process>
	</div>
</template>

<script>
	import { fetchList, pageByOrg, getObj, addObj, putObj, delObj, currentOrg } from '@/api/nursing/bill/billtask'
	import { tableOption } from '@/const/crud/nursing/bill/billtask'
	import { mapGetters } from 'vuex'
	import billInfo from "./components/info.vue"
	import billAssign from "./components/assign.vue"
	import billAssignDetail from "./components/assign-detail.vue"
	import billProcess from "../bill/components/process.vue"
	export default {
		name: 'billtask',
		data() {
			return {
				tableData: [],
				search: {},
				param: {},
				page: {
					total: 0, // 总页数
					currentPage: 1, // 当前页数
					pageSize: 20 // 每页显示多少条
				},
				tableLoading: false,
				tableOption: tableOption,
				currRow: {},
				info: {
					show: false
				},
				assign: {
					show: false
				},
				assignDetail: {
					show: false
				},
				process: {
					show: false
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
		components: {billInfo, billAssign, billAssignDetail, billProcess},
		watch: {
			orgId(val){
				this.getList(this.page, this.param);
				console.log("watch", val);
			}
		},
		// mounted(){
		// 	currentOrg().then(res => {
		// 		console.log("");
		// 	});
		// },
		methods: {
			getList(page, params) {
				if(this.org && (!this.orgId || this.orgId <= 0)) return;
				this.tableLoading = true;
				let method = this.org ? pageByOrg : fetchList;
				method(Object.assign({
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
					done()
					this.getList(this.page)
				})
			},
			/**
			 * 刷新回调
			 */
			refreshChange() {
				this.getList(this.page)
			},
			handleFilter(param) {
				console.log("onload", param);
				this.page.currentPage = 1;
				if(!param.createTime || (param.createTime && !param.createTime.length)){
					param.createTime = [];
        }
        if(!param.reserveTime || (param.reserveTime && !param.reserveTime.length)){
					param.reserveTime = [];
        }
				param.startDate = param.createTime[0];
        param.endDate = param.createTime[1];
        param.startReserveDate = param.reserveTime[0];
        param.endReserveDate = param.reserveTime[1];

				let paramTemp = {...param};
        delete paramTemp.createTime;
        delete paramTemp.reserveTime;
				this.param = {...paramTemp};
				this.getList(this.page, paramTemp);
			},
      handleReset() {
        this.param = {};
        this.page.currentPage = 1;
        this.getList(this.page)
      },
			menuClick(menuName, row, scope){
				// console.log("scopt", tableOption.column[35].dicData = )
				this.currRow = row;
				this[menuName].show = true;
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
