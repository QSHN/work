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
    <basic-container title="机构随访服务订单管理">
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
        <template slot-scope="scope" slot="menu">
          <el-tooltip content="详情" placement="top">
            <el-button icon="icon-ry-chakan" type="text" @click="menuClick('info', scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="处理过程" placement="top">
            <el-button icon="icon-ry-timeline" type="text" @click="menuClick('process', scope.row)"></el-button>
          </el-tooltip>
        </template>
      </avue-crud>
    </basic-container>
    <bill-info v-model="info.show" :row="currRow" @refresh="refreshChange"></bill-info>
    <bill-process v-model="process.show" :task-id="currRow.fupBillId"></bill-process>
  </div>
</template>

<script>
import BillProcess from './components/process'
import BillInfo from './components/info'
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj
} from '@/api/nursing/fupbill/fupbill'
import { tableOption } from '@/const/crud/nursing/fupbill/fupbill'
import { mapGetters } from 'vuex'
export default {
  name: 'fupbill',
  components: {
    BillProcess,
    BillInfo
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
      currRow: {},
      info: {
        show: false
      },
      process: {
        show: false
      }
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
        let resData = response.data.data
        resData.records.forEach(item => {
          let type = '电话随访'
          if (item.fupBillType === 0) {
            type = '上门随访'
          }
          item.fupBillType = type

          let payway = '未支付'
          if (item.payState === 1) {
            payway = '已支付'
          }
          item.payState = payway

          let proveImgPath = item.proveImgPath
          proveImgPath = proveImgPath.split(';')
          proveImgPath = proveImgPath.map((item, key) => {
            return { certImgPath: item }
          })
          item.proveImgPath = proveImgPath
        })
        this.tableData = resData.records
        this.page.total = resData.total
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
    menuClick(menuName, row, scope) {
      this.currRow = row
      this[menuName].show = true
    },
    rowDel: function(row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.fupBillId, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delObj(row.fupBillId)
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
