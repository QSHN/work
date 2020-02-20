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
    <basic-container title="长护险管理">
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 v-model="cust"
                 @on-load="getList"
                 @refresh-change="refreshChange"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @row-del="rowDel">

        <template slot="menuLeft">
          <el-button type="primary"
                     @click="handleAdd"
                     size="small">新 增</el-button>
          <br /><br />
        </template>
        <template slot-scope="scope"
                  slot="menu">
          <el-button type="text"
                     icon="el-icon-check"
                     size="small"
                     plain
                     @click="handleSelect(scope.row,scope.index)">资质</el-button>
          <el-button type="text"
                     icon="el-icon-check"
                     size="small"
                     plain
                     @click="handleTestSelect(scope.row,scope.index)">测试结果</el-button>
          <el-button type="text"
                     icon="el-icon-check"
                     size="small"
                     plain
                     @click="handleEdit(scope.row,scope.index)">编辑</el-button>
          <el-button type="text"
                     icon="el-icon-check"
                     size="small"
                     plain
                     @click="handleAction(scope.row,scope.index, 2)">提交</el-button>
          <el-button type="text"
                     icon="el-icon-check"
                     size="small"
                     plain
                     @click="handleAction(scope.row,scope.index, 3)">初审</el-button>
          <el-button type="text"
                     icon="el-icon-check"
                     size="small"
                     plain
                     @click="handleAction(scope.row,scope.index, 7)">审核通过</el-button>
          <el-button type="text"
                     icon="el-icon-check"
                     size="small"
                     plain
                     @click="handleAction(scope.row,scope.index, 9)">驳回</el-button>
          <el-button type="text"
                     icon="el-icon-check"
                     size="small"
                     plain
                     @click="handleAction(scope.row,scope.index, 8)">撤销</el-button>
          <el-button type="text"
                     icon="el-icon-delete"
                     size="small"
                     plain
                     @click="handleDel(scope.row,scope.index)">删除</el-button>
        </template>

        <template slot-scope="scope" slot="custIdForm">
          <el-button @click="showCusts = true;">
            <span v-if="scope.value">{{cust.selCustName}}（客户ID：{{cust.custId}}）</span>
            <span class="grey" v-else>请点击选择客户</span>
          </el-button>
        </template>

      </avue-crud>

      <el-dialog
        title="长护险资质"
        :visible.sync="showLtciInfo">
        <ltci  v-if="showLtciInfo" :callback="handelAfterSelect" :ltciFormId=this.ltciFormId></ltci>
      </el-dialog>
      <el-dialog
        title="长护险测试"
        :visible.sync="showLtciTest">
        <ltciTest  v-if="showLtciTest" :callback="handelAfterSelect" :ltciFormId=this.ltciFormId></ltciTest>
      </el-dialog>

    </basic-container>
    <custs v-model="showCusts" @change="custChange"></custs>
  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj, stateAction } from '@/api/nursing/vip/ltci/vipltciform'
  import { tableOption } from '@/const/crud/nursing/vip/ltci/vipltciform'
  import ltci from '@/views/nursing/vip/ltci/ltci'
  import ltciTest from '@/views/nursing/vip/ltci/ltciTest'
  import custs from "./custs.vue"
  import { mapGetters } from 'vuex'
  export default {
    name: 'vipltciform',
    components: {ltci, ltciTest, custs},
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
        showLtciInfo: false,
        showLtciTest: false,
        ltciFormId: "",
        showCusts: false,
        cust: {
          custId: "",
          selCustName: ""
        }
      }
    },
    created() {
    },
    mounted: function() { },
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
          this.page.currentPage = response.data.data.current;
          this.tableLoading = false
        })
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
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      handleAction: function(row, index, actionCode) {
        stateAction(row,actionCode).then(data => {
          this.tableData.splice(index, 1, Object.assign({}, row))
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          })
         this.getList(this.page)
        })
      },
      rowDel: function(row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为' + row.formId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
            return delObj(row.formId)
          }).then(data => {
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getList(this.page)
        }).catch(function(err) { })
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
      } ,
      custChange(e){
        this.cust.custId = e.custId;
        this.cust.selCustName = e.custName;
      },
      handelAfterSelect(ids, nodes){
        fetchTreeByItemClassCode('org_category');
      },handleSelect(row, index){
        this.ltciFormId = row.formId
        this.showLtciInfo = true
      },handleTestSelect(row, index){
        this.ltciFormId = row.formId
        this.showLtciTest = true
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
