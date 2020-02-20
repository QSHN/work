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
    <basic-container title="科室管理">
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="handleAdd" size="small">新 增</el-button>
          <br />
          <br />
        </template>
        <template slot-scope="scope" slot="menu">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              type="text"
              size="small"
              icon="icon-ry-bianji"
              plain
              @click="handleEdit(scope.row,scope.index)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="添加护士" placement="top">
            <el-button icon="icon-ry-assign" type="text" @click="handleAddNurse(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="已加护士列表" placement="top">
            <el-button
              icon="icon-ry-bangdingyonghu"
              type="text"
              @click="handleDeleteNurse(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              type="text"
              size="small"
              icon="icon-ry-shanchu"
              plain
              @click="handleDel(scope.row,scope.index)"
            ></el-button>
          </el-tooltip>
        </template>
      </avue-crud>
      <el-dialog width="85%" title="添加护士" :visible.sync="showStaffDialog">
        <add-nurse v-if="showStaffDialog" :office-id="officeId" />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="showStaffDialog = false">关闭</el-button>
        </span>
      </el-dialog>
      <el-dialog width="85%" title="已加护士列表" :visible.sync="showStaffListDialog">
        <nurse-list v-if="showStaffListDialog" :office-id="officeId" />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="showStaffListDialog = false">关闭</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import AddNurse from './components/AddNurse'
import NurseList from './components/NurseList'
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj
} from '@/api/nursing/orgoffice/orgoffice'
import { tableOption } from '@/const/crud/nursing/orgoffice/orgoffice'
import { mapGetters } from 'vuex'
export default {
  name: 'orgoffice',
  components: {
    AddNurse,
    NurseList,
  },
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
      showStaffDialog: false,
      showStaffListDialog: false,
      officeId: 0,
    }
  },
  created() {},
  mounted: function() {},
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params
        )
      ).then(response => {
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
    handleAdd: function() {
      this.$refs.crud.rowAdd()
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    handleAddNurse(row) {
      this.officeId = row.officeId
      this.showStaffDialog = true
    },
    handleDeleteNurse(row) {
      this.officeId = row.officeId
      this.showStaffListDialog = true
    },
    rowDel: function(row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.officeId, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delObj(row.officeId)
        })
        .then(data => {
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getList(this.page)
        })
        .catch(function(err) {})
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
