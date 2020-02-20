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
    <basic-container title="服务人员提现管理">
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @on-load="getList"
                 @refresh-change="refreshChange"
                 @search-change="handleFilter"
                 @search-reset="handleReset">

        <template slot="date">
          <el-form-item label="创建日期">
            <el-date-picker v-model="search.slot" type="daterange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期" :clearable="false"></el-date-picker>
          </el-form-item>
        </template>

        <template slot="search">
          <el-form-item class="search-panel" size="small">
            <el-input v-model="searchParams.queryValue" class="input-with-select" placeholder="请输入内容">
              <el-select v-model="searchParams.queryKey" slot="prepend" placeholder="请选择">
                <el-option v-for="item in searchKeys" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </template>

        <template slot-scope="scope"
                  slot="menu">
          <el-tooltip class="item" v-if="permissions.oms_staff_req_check_view" effect="dark" content="查看" placement="top">
            <el-button type="text"
                       icon="icon-ry-chakan"
                       size="small"
                       plain
                       @click="handleView(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.state == 0 && permissions.oms_staff_req_check_success" class="item" effect="dark" content="处理成功" placement="top">
            <el-button type="text"
                       icon="icon-ry-tongguo"
                       size="small"
                       plain
                       @click="processFinish(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.state == 0 && permissions.oms_staff_req_check_fail" class="item" effect="dark" content="处理异常" placement="top">
            <el-button type="text"
                       icon="icon-ry-butongguo"
                       size="small"
                       plain
                       @click="processException(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
        </template>

      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
  import {
    processFinish,
    processException,
    fetchList,
    fetchAllList,
    getObj,
    addObj,
    putObj,
    delObj
  } from '@/api/nursing/staff/staffwithdrawalreq'
  import {tableOption} from '@/const/crud/nursing/staff/staffwithdrawalreq'
  import {mapGetters} from 'vuex'

  export default {
    name: 'staffWithdrawalReqCheck',
    data() {
      return {
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption,
        search: {},
        searchParams: {
          queryKey: 'staff_name',
          state: 0
        },
        searchKeys: [
          {
            value: 'staff_name',
            label: '服务人员名称'
          }, {
            value: 'checker_name',
            label: '审核人姓名'
          }
        ],
        option: {
          labelWidth: 110,
          column: [{
            label: "日期范围",
            prop: "daterange",
            type: "daterange",
            startPlaceholder: '日期开始范围自定义',
            endPlaceholder: '日期结束范围自定义',
          }]
        },
        daterange: {
          startTime: '',
          endTime: ''
        },
      }
    },
    created() {
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      getList(page, params) {
        this.tableLoading = true
        let param = {
          current: page === true ? 1 : page.currentPage,
          size: page === true ? this.page.pageSize : page.pageSize
        }
        for (let i in this.searchParams) {
          param[i] = this.searchParams[i]
        }
        fetchAllList(param).then(response => {
          let dt = response.data.data;
          //匹配item表的类型
          dt.records.forEach(i => {
            if (i.bankCode)
              i.bankCode = Number(i.bankCode)
          });
          this.tableData = dt.records;
          this.page.total = dt.total;
          this.page.currentPage = dt.current;
          if (dt.pages < param.current) {
            this.page.currentPage = dt.pages;
          }
          this.tableLoading = false;
        });
      },
      handleView(row, index) {
        this.$refs.crud.rowView(row, index)
      },
      processFinish(row, index) {
        this.$prompt('请输入支付流水号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[^ ]+/,
          inputErrorMessage: '流水号不能为空'
        }).then(({value}) => {
          processFinish(row.reqId, value).then(data => {
            this.$message({
              showClose: true,
              message: '处理成功，流水号是：' + value,
              type: 'success'
            })
            this.getList(this.page)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      processException(row, index) {
        this.$prompt('请输入异常原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[^ ]+/,
          inputErrorMessage: '流水号不能为空'
        }).then(({value}) => {
          processException(row.reqId, value).then(data => {
            this.$message({
              showClose: true,
              message: '处理成功',
              type: 'success'
            })
            this.getList(this.page)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      // 过滤搜索
      handleFilter(param) {
        this.page = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        };
        if (param.submitTime) {
          this.searchParams.startDate = param.submitTime[0];
          this.searchParams.endDate = param.submitTime[1];
        } else {
          delete this.searchParams.startDate;
          delete this.searchParams.endDate;
        }
        this.searchParams.state = param.state;
        this.getList(true);
      },
      // 点击清空
      handleReset() {
        this.searchParams = {
          queryKey: 'staff_name',
          state: 0
        };
        this.getList(this.page)
      },
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList(this.page)
      }
    }
  }
</script>

<style lang="scss" scoped>

  /deep/ .search-panel .el-select .el-input {
    width: 130px;
  }

  /deep/ .search-panel .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

</style>
