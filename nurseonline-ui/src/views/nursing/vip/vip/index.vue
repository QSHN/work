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
    <basic-container title="会员管理">
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @on-load="getList"
                 @refresh-change="refreshChange"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @search-change="search"
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
        <template slot-scope="scope"
                  slot="menu">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text"
                       v-if="permissions.oms_adminVip_edit"
                       icon="el-icon-edit-outline"
                       size="small"
                       plain
                       @click="handleEdit(scope.row,scope.index,'admin')">
            </el-button>
          </el-tooltip>&nbsp;
          <el-tooltip class="item" effect="dark" content="地址详情" placement="top">
            <el-button type="text"
                       icon="el-icon-location"
                       size="small"
                       plain
                       @click="handleAddress(scope.row)">
            </el-button>
          </el-tooltip>&nbsp;
          <el-tooltip class="item" effect="dark" content="资质详情" placement="top">
            <el-button type="text"
                       icon="el-icon-document"
                       size="small"
                       plain
                       @click="handleCert(scope.row)">
            </el-button>
          </el-tooltip>&nbsp;
          <el-tooltip class="item" effect="dark" content="服务对象" placement="top">
            <el-button type="text"
                       icon="icon-ry-bangdingyonghu"
                       size="small"
                       plain
                       v-if="permissions.oms_vipCust_search"
                       @click="handleVipCust(scope.row)">
            </el-button>
          </el-tooltip>&nbsp;
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="text"
                       v-if="permissions.oms_vip_del"
                       icon="el-icon-delete"
                       size="small"
                       plain
                       @click="handleDel(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
        </template>
      </avue-crud>

      <el-dialog
        title="会员地址"
        :visible.sync="showAddress">
        <el-table :data="currentAddress" stripe style="width: 100%">
          <el-table-column prop="label" label="标签" width="100">
            <template slot-scope="scope" >
              <el-tag  v-if="scope.row.isDefault==1" close-transition>{{scope.row.label}}</el-tag>
              <div v-else>{{scope.row.label}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="linkman" label="联系人">
          </el-table-column>
          <el-table-column prop="phone" label="电话" width="125">
          </el-table-column>
          <el-table-column prop="zipcode" label="邮政编码">
          </el-table-column>
          <el-table-column prop="zoneLabel" label="地区" width="250">
          </el-table-column>
          <el-table-column prop="address" label="地址" width="400">
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog
        title="会员资质"
        :visible.sync="showCert">
        <vipcert :vipId=vipId ref="vipcert"></vipcert>
      </el-dialog>

      <el-dialog
        title="关联服务对象"
        :visible.sync="showVipCust">
        <el-table :data="vipCustData" stripe style="width: 100%">
          <el-table-column prop="custName" label="客户姓名"></el-table-column>
          <el-table-column prop="phone" label="手机号码"></el-table-column>
          <el-table-column prop="idNo" label="身份证号"></el-table-column>
        </el-table>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import {fetchList, getObj, putObj, managerPutObj, adminPutObj, delObj, getCustList} from '@/api/nursing/vip/vip'
  import {addVipaddress, getVipaddress, getAddressForVip} from '@/api/nursing/vip/vipaddress'
  import {tableOption} from '@/const/crud/nursing/vip/vip'
  import vipcert from '@/views/nursing/vip/vipcert'
  import {mapGetters} from 'vuex'
  import Vipcert from "../vipcert/index";

  export default {
    name: 'vip',
    components: {Vipcert},
    data() {
      return {
        searchOptions: [{
          value: 'vipCode',
          label: '会员代码'
        }, {
          value: 'vipName',
          label: '会员名称'
        }, {
          value: 'idNo',
          label: '身份证号'
        }, {
          value: 'phone',
          label: '手机号'
        }],
        searchForm: {},
        searchParam: {key: "vipName", value: ""},
        showAddress: false,
        showCert: false,
        showVipCust: false,
        currentAddress: [],
        tableData: [],
        vipCustData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        editType: '',
        tableOption: tableOption,
        vipId: -1
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
      search() {
        let params = {}
        params[this.searchParam.key] = this.searchParam.value
        this.page = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        }
        this.getList(this.page, params)
      },
      searchReset() {
        this.searchParam.value = ""
      },
      /**
       * @title 打开新增窗口
       * @detail 调用crud的handleadd方法即可
       *
       **/
      handleAdd: function () {
        this.$refs.crud.rowAdd()
      },
      handleEdit(row, index, editType) {
        this.editType = editType
        this.$refs.crud.rowEdit(row, index)
      },
      handleAddress(row) {
        this.currentAddress = []
        this.showAddress = true
        getAddressForVip(row.vipId).then(response => {
          this.currentAddress = response.data.data
        })
      },
      handleVipCust(row){
        getCustList(Object.assign({},{
          vipId: row.vipId
        })).then(response => {
          this.vipCustData = response.data.data
          this.showVipCust = true
        }).catch(function (err) {
        })
      },
      handleCert(row) {
        this.vipId = row.vipId
        this.showCert = true
      },
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      rowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除用户：' + row.userName + ' ( 用户名 )，' + row.vipName + ' ( 会员名称 ) 的账户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.vipId)
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
        switch (this.editType) {
          case 'public':
            putObj(row).then(data => {
              this.tableData.splice(index, 1, Object.assign({}, row))
              this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success'
              })
              done()
            })
            break
          case 'manager':
            managerPutObj(row).then(data => {
              this.tableData.splice(index, 1, Object.assign({}, row))
              this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success'
              })
              done()
            })
            break
          case 'admin':
            adminPutObj(row).then(data => {
              this.tableData.splice(index, 1, Object.assign({}, row))
              this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success'
              })
              done()
            })
            break
        }

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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-tag{
    position: absolute;
    top: 1px;
    left: 3px;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #f2f2f2 !important;
    color: #161616 !important;
  }
</style>
