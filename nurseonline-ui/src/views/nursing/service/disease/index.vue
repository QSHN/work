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
  <div class="execution inner-dialog">
    <basic-container>
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @on-load="getList"
                 @refresh-change="refreshChange"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @row-del="rowDel">
        <template slot="menuLeft">
          <el-button type="primary"
                     @click="handleAdds"
                     size="small">新 增
          </el-button>
          <br/><br/>
        </template>
        <template slot-scope="scope"
                  slot="menu">
          <!--<el-button type="text"-->
                     <!--icon="el-icon-check"-->
                     <!--size="small"-->
                     <!--plain-->
                     <!--@click="handleEdit(scope.row,scope.index)">编辑-->
          <!--</el-button>-->
          <el-button type="text"
                     icon="el-icon-delete"
                     size="small"
                     plain
                     @click="handleDel(scope.row,scope.index)">删除
          </el-button>
        </template>
      </avue-crud>
      <!-- 适用疾病添加的嵌套页 -->
      <el-dialog append-to-body
                 width="80%"
                 title="添加适用疾病"
                 :visible.sync="showAddDisease">
        <disease v-if="showAddDisease"
               :serviceId="serviceId"
               v-bind:showAddDisease="showAddDisease"
               v-on:pageClose="receiveChange($event)"
        />
        <!--<span slot="footer" class="dialog-footer">-->
          <!--<el-button type="primary" @click="showAddDisease = false, getList(this.page)">关闭</el-button>-->
        <!--</span>-->
      </el-dialog>

    </basic-container>
  </div>
</template>

<script>
  import disease from '@/views/nursing/service/disease/disease'
  import {fetchList, getObj, addObj, putObj, delObj} from '@/api/nursing/service/service-disease'
  import {tableOption} from '@/const/crud/nursing/service/service-disease'
  import {mapGetters} from 'vuex'

  export default {
    name: 'servicedisease',
    components: {
      disease
    },
    props: {
      currService: {
        type: Object,
        default: () => {
        }
      }
    },
    data() {
      return {
        tableData: [],
        serviceId: 0,
        showAddDisease: false,
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption
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
      getList(page) {
        this.tableLoading = true
        let param = {
          current: page.currentPage,
          size: page.pageSize,
          serviceId: this.currService.serviceId
        }
        for (let i in this.searchParams) {
          param[i] = this.searchParams[i]
        }
        fetchList(param).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.page.currentPage = response.data.data.current
          this.page.pageSize = response.data.data.size
          this.tableLoading = false
        })
      },

      // 新增适用疾病按钮
      handleAdds(row, index) {
        this.serviceId = this.currService.serviceId;
        this.showAddDisease = true;
      },

      /**
       * @title 打开新增窗口
       * @detail 调用crud的handleadd方法即可
       *
       **/
      handleEdit(row, index) {
        this.$refs.crud.rowEdit(row, index)
      },
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      rowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除相关疾病ID为' + row.diseaseId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          let param = {
            serviceId: row.serviceId,
            diseaseId: row.diseaseId
          }
          return delObj(param)
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

      // 接受子组件通信的函数
      receiveChange(msg) {
        this.showAddDisease = msg;
        this.getList(this.page);
      },


    }
  }
</script>

<style lang="scss" scoped>
</style>
