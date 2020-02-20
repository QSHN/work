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
    <basic-container title="服务人员入驻审核">
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
                 @row-save="handleSave"
                 @row-del="rowDel">
        <template slot-scope="scope" slot="menu">

          <el-tooltip content="查看" placement="bottom-end" v-if="permissions.scms_orgstaff_joinrequest_view">
            <span><i class="icon-ry-chakan iconBtn" @click="handleView(scope.row,scope.index)"></i></span>
          </el-tooltip>

          <el-tooltip content="查看拒绝原因" placement="bottom-end" v-if="scope.row.state==2 && permissions.scms_orgstaff_joinrequest_reason">
            <span><i class="icon-ry-fankui iconBtn" @click="handleReason(scope.row,scope.index)"></i></span>
          </el-tooltip>

          <el-tooltip :content="scope.row.state==0?'审核服务人员':'资质'" placement="bottom-end">
            <span><i class="icon-ry-shenhe iconBtn" @click="handleShowStaff(scope.row,scope.index)"></i></span>
          </el-tooltip>

          <!--<el-button type="text"-->
                     <!--icon="el-icon-check"-->
                     <!--size="small"-->
                     <!--plain-->
                     <!--@click="handleShowStaff(scope.row,scope.index)">-->
            <!--<template v-if="scope.row.state==0">-->
              <!--审核服务人员-->
            <!--</template>-->
            <!--<template v-else>-->
              <!--资质-->
            <!--</template>-->
          <!--</el-button>-->
        </template>
      </avue-crud>

      <el-dialog width="80%"
                 title="服务人员详情"
                 :visible.sync="showStaff">
        <!--选项卡-->
        <el-tabs v-loading="loadStaff">
          <!--服务人员详情卡槽-->
          <el-tab-pane label="基本信息">
            <avue-detail :option="staffTabOpt" v-model="selectedStaff"></avue-detail>
          </el-tab-pane>
          <!--资质卡槽-->
          <el-tab-pane label="资质信息">
            <StaffCert v-if="showStaff" :currstaff="currJoinReq"/>
          </el-tab-pane>
        </el-tabs>
        <!--dialog 关闭按钮 -->
        <span slot="footer" class="dialog-footer">
          <template v-if="currJoinReq.state==0 && permissions.scms_orgstaff_joinrequest_audit">
            <el-button type="primary"
                       icon="el-icon-check"
                       @click="handlePass">审核通过
            </el-button>
            <el-button type="danger"
                       icon="el-icon-close"
                       @click="handleReject">审核不通过
            </el-button>
          </template>
          <el-button @click="showStaff = false">关闭</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>

  import StaffCert from '@/views/nursing/staff/cert'
  import {getObj as getStaff} from '@/api/nursing/staff/staff'
  import {fetchList, getObj, addObj, putObj, delObj, pass, reject} from '@/api/nursing/relation/joinrequest'
  import {tableOption} from '@/const/crud/nursing/relation/joinrequest'
  import {detailOption as staffTabOpt} from '@/const/crud/nursing/staff/staff'
  import {mapGetters} from 'vuex'

  export default {
    name: 'staffjoinreq',
    components: {StaffCert},
    data() {
      return {
        selectedStaff: {},
        currJoinReq: {},
        tableData: [],
        showCert: false,
        showStaff: false,
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        loadStaff: false,
        tableOption: tableOption,
        staffTabOpt: staffTabOpt,
        searchParams:{
          state: 0,
        }
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
        }, params, this.searchParams)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.page.currentPage = response.data.data.current
          this.page.pageSize = response.data.data.size
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
      }
      ,
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
        this.$confirm('是否确认删除ID为' + row.reqId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.reqId)
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

      handleFilter(param) {
        this.searchParams = Object.assign({}, param)
        this.page.currentPage = 1
        this.getList(this.page, Object.assign(param, this.search))
      },
      handleReset() {
        this.searchParams = {
          state : 0,
        }
        this.getList(this.page)
      },

      handleShowStaff: function (row, index, done) {
        this.currJoinReq = row
        this.loadStaff = true
        this.showStaff = true
        getStaff(row.staffId).then(res => {
          this.selectedStaff = res.data.data
          this.loadStaff = false
        })
      },
      handleReason: function (row, index, done) {
        this.$alert(row.reason, '拒绝原因', {
          confirmButtonText: '确定',
        });
      },

      /******** 审核 ********/
      handlePass: function () {
        let _this = this
        this.$confirm('是否确认审核通过？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return pass(_this.currJoinReq)
        }).then(() => {
          _this.$message({
            showClose: true,
            message: '审核成功',
            type: 'success'
          })
          _this.showStaff = false
          this.getList(this.page)
        }).catch(function (err) {
        })
      },
      handleReject: function () {
        let _this = this
        this.$prompt('是否审核不通过？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showInput: true,
          type: 'warning',
          inputPlaceholder:'请填写原因',
          inputPattern: /.+/,
          inputErrorMessage: '请填写原因'
        }).then(({ value }) => {
          _this.currJoinReq.reason = value
          return reject(_this.currJoinReq)
        }).then(() => {
          _this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          })
          _this.showStaff = false
          _this.getList(this.page)
        }).catch(function (err) {
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
