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
    <basic-container title="区域管理">
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @on-load="getList"
                 @refresh-change="refreshChange"
                 @search-change="searchChange"
                 @search-reset="searchReset"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @row-del="rowDel">
        <template slot="search">
          <el-form-item label="查询">
            <el-select v-model="searchParam.key" clearable placeholder="请选择" size="small">
              <el-option
                v-for="item in searchOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键字为">
            <el-input v-model="searchParam.value" placeholder="请输入关键词" size="small"/>
          </el-form-item>
        </template>
        <template slot="menuLeft">
          <el-tooltip class="item" effect="dark" content="新 增" placement="top">
            <el-button
              @click="handleAdd"
              size="mini"
              circle
              icon="el-icon-plus"
              v-if="permissions.oms_zone_add">
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="更新缓存" placement="top">
            <el-button
              icon="el-icon-upload"
              @click="handleRefresh"
              circle
              size="mini">
            </el-button>
          </el-tooltip>
          <br/><br/>
        </template>
        <template slot-scope="scope"
                  slot="menu">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text"
                       v-if="permissions.oms_zone_edit"
                       icon="el-icon-edit-outline"
                       size="small"
                       plain
                       @click="handleEdit(scope.row,scope.index)">
            </el-button>
          </el-tooltip>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="text"
                       v-if="permissions.oms_zone_del"
                       icon="el-icon-delete"
                       size="small"
                       plain
                       @click="handleDel(scope.row,scope.index)">
            </el-button>
          </el-tooltip>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-tooltip class="item" effect="dark" content="管理树" placement="top">
            <el-button type="text"
                       icon="el-icon-rank"
                       size="small"
                       plain
                       @click="handeSelect(scope.row)">
            </el-button>
          </el-tooltip>
        </template>
      </avue-crud>
      <el-dialog
        title="区域管理"
        :visible.sync="showTree">
        <tree v-if="showTree" :callback="handelAfterSelect" :rootCode="rootCode"
              :searchingString="searchingString"></tree>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import {fetchList, refreshTree, getRootTree, getObj, addObj, putObj, delObj} from '@/api/nursing/zone/zone'
  import {tableOption} from '@/const/crud/nursing/zone/zone'
  import tree from '@/views/nursing/components/zonetree'
  import {mapGetters} from 'vuex'

  export default {
    name: 'zone',
    components: {tree},
    data() {
      return {
        searchOptions: [{
          value: 'zoneCode',
          label: '区域代码'
        }, {
          value: 'zoneName',
          label: '区域名称'
        }],
        searchParam: {key: "zoneName", value: ""},
        tableData: [],
        tableLoading: false,
        tableOption: tableOption,
        showTree: false,
        rootCode: '',
        searchingString: '',
        searchingForm: {},
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        rootId: 0
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
          this.tableLoading = false
        })
      },
      /**
       * @title 打开新增窗口
       * @detail 调用crud的handleadd方法即可
       *
       **/
      handleAdd: function () {
        this.$refs.crud.rowAdd()
      },
      handleEdit(row, index) {
        this.$refs.crud.rowEdit(row, index)
      },
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      rowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除区域：' + row.zoneName + '(' + row.zoneCode + ')', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.zoneId)
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
          this.tableData.push(Object.assign({'parentId': -1}, row))
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
      handeSelect(row) {
        this.rootCode = row.zoneCode
        this.rootId = row.zoneId
        this.showTree = true
      },
      handelAfterSelect(row) {
        // this.rootCode = row.zoneCode
        // this.showTree = true
      },
      handleRefresh() {
        refreshTree().then(response => {
          if (response.status == 200) {
            this.$message({
              showClose: true,
              message: response.data.data,
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: '刷新失败',
              type: 'error'
            })
          }
          this.getList(this.page)
          done()
        })
      },
      searchReset() {
        this.searchParam.value = ""
      },
      searchChange(form) {
        this.searchingForm = form
        this.page = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        }
        let params = {}
        params[this.searchParam.key] = this.searchParam.value
        this.searchingString = this.searchParam.value
        if (this.searchParam.value==null||this.searchParam.value==""){
          this.getList(this.page)
        } else {
          this.getList(this.page, params)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
