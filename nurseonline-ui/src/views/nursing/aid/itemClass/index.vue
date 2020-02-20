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
    <basic-container title="辅助资料管理">
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @on-load="getList"
                 @refresh-change="refreshChange"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @search-change="searchChange"
                 @search-reset="searchReset"
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
          <el-button type="primary"
                     @click="handleAdd"
                     size="small"
                     v-if="permissions.aid_itemclass_add"
          >新 增
          </el-button>
          <br/><br/>
        </template>
        <template slot-scope="scope"
                  slot="menu">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text"
                       v-if="permissions.aid_itemclass_edit"
                       icon="el-icon-edit-outline"
                       size="small"
                       plain
                       @click="handleEdit(scope.row,scope.index)">
            </el-button>
          </el-tooltip>&nbsp;
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="text"
                       v-if="permissions.aid_itemclass_del"
                       icon="el-icon-delete"
                       size="small"
                       plain
                       @click="handleDel(scope.row,scope.index)">
            </el-button>
          </el-tooltip>&nbsp;
          <el-tooltip class="item" effect="dark" content="显示树" placement="top">
            <el-button type="text"
                       icon="el-icon-rank"
                       size="small"
                       plain
                       @click="handelSelect(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
        </template>
      </avue-crud>

      <el-dialog
        title="辅助资料管理"
        :visible.sync="showTree">
        <tree v-if="showTree" :callback="handelAfterSelect" :itemClassCode="itemClassCode"
              :itemClassId=itemClassId></tree>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import {fetchList, fetchTreeByItemClassCode, getObj, addObj, putObj, delObj} from '@/api/nursing/aid/itemclass'
  import {tableOption} from '@/const/crud/nursing/aid/itemclass'
  import tree from '@/views/nursing/components/tree'
  import {mapGetters} from 'vuex'

  export default {
    name: 'itemclass',
    components: {tree},
    data() {
      return {
        searchOptions: [{
          value: 'itemClassCode',
          label: '辅助资料类别代码'
        }, {
          value: 'itemClassName',
          label: '辅助资料类别名称'
        }],
        searchParam: {key: "itemClassName", value: ""},
        showTree: false,
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption,
        itemClassCode: "",
        itemClassId: 0,
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
          this.page.currentPage = page.currentPage
          this.page.pageSize = page.pageSize
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
        this.getList(this.page)
      },
      handleEdit(row, index) {
        this.$refs.crud.rowEdit(row, index)
      },
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      rowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除代号为 ' + row.itemClassCode + ' ( ' + row.itemClassName + ' ) 的辅助资料？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.itemClassId)
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
          this.tableData.push(Object.assign({}, row))
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
          done()
        })
      },
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList(this.page, this.tableData)
      }
      , handelAfterSelect(ids, nodes) {
        fetchTreeByItemClassCode('org_category');
      }
      , handelSelect(row, index) {
        this.itemClassCode = row.itemClassCode
        this.itemClassId = row.itemClassId
        this.showTree = true
      },
      searchReset() {
        this.searchParam.value = ""
      },
      searchChange(form) {
        this.page = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        }

        let params = {}
        params[this.searchParam.key] = this.searchParam.value
        if (this.searchParam.value == null || this.searchParam.value == "") {
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
