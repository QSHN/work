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
    <basic-container :title="text">

      <template slot="menuLeft">

        <el-tooltip class="item" effect="dark" content="申 请" placement="top">
          <el-button type="primary"
                     @click="handleAdd"
                     icon="icon-ry-xinshenqing"
                     size="small"></el-button>
        </el-tooltip>
      </template>

      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @on-load="getList"
                 @search-change="handleFilter"
                 @refresh-change="refreshChange"
                 @search-reset="handleReset"
                 @row-save="handleSave">

        <template slot="date">
          <el-form-item label="创建日期">
            <el-date-picker v-model="search.slot" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
          </el-form-item>
        </template>

        <template slot="search">
          <el-form-item class="search-panel" size="small">
            <el-input v-model="searchParams.queryValue" class="input-with-select" placeholder="请输入内容">
              <el-select v-model="searchParams.queryKey" slot="prepend" placeholder="请选择">
                <el-option v-for="item in searchKeys" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </template>

        <template slot="menuLeft">
          <el-tooltip class="item" v-if="permissions.oms_org_req_add" effect="dark" content="申 请" placement="top">
          <el-button type="primary"
                     @click="handleAdd"
                     icon="icon-ry-xinshenqing"
                     size="small"></el-button>
          </el-tooltip>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/nursing/org/withdrawalreq'
  import { currentOrg } from '@/api/nursing/org/org'
  import { tableOption } from '@/const/crud/nursing/org/withdrawalreq'
  import { mapGetters } from 'vuex'
  export default {
    name: 'orgwithdrawalreq',
    data() {
      return {
        tableData: [],
        text: '',
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        search: {
        },
        searchParams: {
          queryKey: 'account_name',
          state: 0
        },
        searchKeys: [
          {
            value: 'account_name',
            label: '账户名称'
          }, {
            value: 'account_no',
            label: '账户'
          }
        ],
        tableLoading: false,
        tableOption: tableOption,
        form: {
          datetime: '1398250549123'//时间戳例子
        },
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
      currentOrg().then(res => {
        this.text = "机构提现管理　　　　　　账户余额：" + res.data.data.balance;
      });
      tableOption.menu = false;
    },
    mounted: function() { },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      getList(page, params) {
        this.tableLoading = true;
        let param = {
          current: page === true ? 1 : page.currentPage,
          size:  page === true ? this.page.pageSize : page.pageSize
        };
        for (let i in this.searchParams) {
          param[i] = this.searchParams[i]
        }
        fetchList(param).then(response => {
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
      // 过滤搜索
      handleFilter(param) {
        this.page = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        };
        if (param.createTime) {
          this.searchParams.startDate = param.createTime[0];
          this.searchParams.endDate = param.createTime[1];
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
          queryKey: 'account_name',
          state: 0
        };
        this.getList(this.page)
      },
      /**
       * @title 打开新增窗口
       * @detail 调用crud的handleadd方法即可
       *
       **/
      handleAdd: function() {
        this.$refs.crud.rowAdd()
      },
      handleEdit(row, index) {
        this.$refs.crud.rowEdit(row, index)
      },
      /**
       * @title 数据添加
       * @param row 为当前的数据
       * @param done 为表单关闭函数
       *
       **/
      handleSave: function(row, done) {
        addObj(row).then(data => {
          this.tableData.push(Object.assign({}, row))
          this.$message({
            showClose: true,
            message: '添加成功',
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
