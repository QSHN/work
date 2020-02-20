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
    <basic-container title="疾病管理">
      <avue-crud ref="crud"
                 v-model="diseaseData"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @on-load="getList"
                 @refresh-change="refreshChange"
                 @search-change="handleFilter"
                 @search-reset="handleReset"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @row-del="rowDel"
                 fixed>
        <template slot="search">
          <el-form-item class="search-panel">
            <el-input v-model="search.value"
                      class="input-with-select"
                      size="small"
                      placeholder="请输入内容">
              <el-select v-model="search.key"
                         slot="prepend"
                         placeholder="请选择">
                <el-option v-for="item in searchKeys"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="handleAdd"
                       v-if="permissions.oms_disease_add"
                       size="mini">新 增
            </el-button>
          </el-form-item>
        </template>
        <template slot-scope="scope"
                  slot="menu">

          <el-tooltip content="查看" placement="bottom-end" v-if="permissions.oms_disease_view">
            <span><i class="icon-ry-chakan iconBtn" @click="handleView(scope.row,scope.index)"></i></span>
          </el-tooltip>

          <el-tooltip content="编辑" placement="bottom-end" v-if="permissions.oms_disease_edit">
            <span><i class="icon-ry-bianji iconBtn" @click="handleEdit(scope.row,scope.index)"></i></span>
          </el-tooltip>

          <el-tooltip content="删除" placement="bottom-end" v-if="permissions.oms_disease_delete">
            <span><i class="icon-ry-shanchu iconBtn" @click="handleDel(scope.row,scope.index)"></i></span>
          </el-tooltip>


          <!--<el-button type="text"-->
                     <!--icon="el-icon-check"-->
                     <!--size="small"-->
                     <!--plain-->
                     <!--@click="handleEdit(scope.row,scope.index)">编辑-->
          <!--</el-button>-->
          <!--<el-button type="text"-->
                     <!--icon="el-icon-delete"-->
                     <!--size="small"-->
                     <!--plain-->
                     <!--@click="handleDel(scope.row,scope.index)">删除-->
          <!--</el-button>-->
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
  import {fetchList, getObj, addObj, putObj, delObj} from '@/api/nursing/disease/disease'
  import {tableOption} from '@/const/crud/nursing/disease/disease'
  import {mapGetters} from 'vuex'

  export default {
    name: 'disease',
    data() {
      return {
        diseaseData: {},
        tableData: [],
        tableLoading: false,
        tableOption: tableOption,
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        search: {
          key: 'disease_code',
          value: ''
        },
        searchKeys: [
          {
            value: 'disease_code',
            label: '疾病代码'
          }, {
            value: 'disease_name',
            label: '疾病名称'
          }
        ],
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
        fetchList(Object.assign({
          current: page.currentPage,
          size: page.pageSize
        }, params)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.page.currentPage = response.data.data.current
          this.page.pageSize = response.data.data.size
          this.tableLoading = false
        })
      },
      handleFilter(param) {
        this.page.currentPage = 1
        this.getList(this.page, Object.assign(param, this.search));
      },
      handleReset() {
        this.search = {
          key: 'disease_name',
          value: ''
        };
      },
      /**
       * @title 打开新增窗口
       * @detail 调用crud的handleadd方法即可
       *
       **/
      handleAdd: function () {
        this.$refs.crud.rowAdd()
      },
      handleView(row, index) {
        this.$refs.crud.rowView(row, index)
      },
      handleEdit(row, index) {
        this.$refs.crud.rowEdit(row, index)
      },
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      rowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为' + row.diseaseId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.diseaseId)
        }).then(data => {
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getList(this.page)
        }).catch(function (err) {
        })
      },
      /**
       * @title 数据更新
       * @param row 为当前的数据
       * @param index 为当前更新数据的行数
       * @param done 为表单关闭函数
       *
       **/
      handleUpdate: function (row, index, done) {
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
       * @title 数据添加
       * @param row 为当前的数据
       * @param done 为表单关闭函数
       *
       **/
      handleSave: function (row, done) {
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
      },
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
