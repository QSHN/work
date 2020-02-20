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
                     @click="handleAdd"
                     v-if="permissions.oms_staff_address_add || permissions.scms_orgstaff_address_add"
                     size="small">新 增
          </el-button>
          <br/><br/>
        </template>

        <template slot-scope="scope" slot="position">
          <el-button type="primary" size="mini" @click="handleShowMap(scope.row, scope.index)">查看</el-button>
        </template>


        <template slot-scope="scope"
                  slot="menu">
          <el-tooltip content="编辑" placement="bottom-end"
                      v-if="permissions.oms_staff_address_edit || permissions.scms_orgstaff_address_edit">
            <span><i class="icon-ry-bianji iconBtn" @click="handleEdit(scope.row,scope.index)"></i></span>
          </el-tooltip>
          <el-tooltip content="删除" placement="bottom-end"
                      v-if="permissions.oms_staff_address_del || permissions.scms_orgstaff_address_del">
            <span><i class="icon-ry-shanchu iconBtn" @click="handleDel(scope.row,scope.index)"></i></span>
          </el-tooltip>
          <!--<el-button type="text"-->
                     <!--icon="el-icon-check"-->
                     <!--size="small"-->
                     <!--plain-->
                     <!--@click="handleMap(scope.row,scope.index)">地图定位-->
          <!--</el-button>-->
        </template>
      </avue-crud>


      <el-dialog title="地图坐标" :visible="showMap" :show-close="false" append-to-body>
        <el-amap v-if="showMap" class="amap-box" :zoom="zoom" :center="center">
          <el-amap-marker ref="marker"
                          :raiseOnDrag="marker.raiseOnDrag"
                          :position="marker.position"
                          :visible="marker.visible"
                          :draggable="marker.draggable"></el-amap-marker>
        </el-amap>
        <span slot="footer" class="dialog-footer">
          <span v-if="showSavePositionBtn" style="font-size:12px;margin-right:10px;">
            <span>tips：可拖动标点到目标位置！</span>
            <el-button type="primary" @click="savePosition">保存</el-button>
          </span>
          <el-button @click="showMap = false;showSavePositionBtn = false">关闭</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import {fetchList, getObj, addObj, putObj, delObj} from '@/api/nursing/staff/address'
  import {tableOption} from '@/const/crud/nursing/staff/address'
  import {mapGetters} from 'vuex'

  // GPS坐标分隔符
  const positionSplit = ',';

  export default {
    name: 'StaffAddress',
    props: {
      currstaff: {
        type: Object,
        default: () => {
        }
      }
    },
    data() {
      return {
        zoom: 20,
        currAddress:{},
        center: [],
        marker: {
          position: [],
          visible: true,
          draggable: false,
          raiseOnDrag: true,
        },
        tableData: [],
        showMap: false,
        showSavePositionBtn: false,
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption,
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
          size: page.pageSize,
          staffId: this.currstaff.staffId
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
        this.$confirm('是否确认删除ID为' + row.addressId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.addressId)
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
        }).catch(function (err) {
          console.log(done)
        })
      },
      /**
       * @title 数据添加
       * @param row 为当前的数据
       * @param done 为表单关闭函数
       *
       **/
      handleSave: function (row, done) {
        row = Object.assign({}, row, {staffId: this.currstaff.staffId});
        addObj(row).then(data => {
          this.tableData.push(Object.assign({}, row, {staffId: this.currstaff.staffId}))
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
          done()
          this.getList(this.page)
        }).catch(function (err) {
        })
      },
      /**
       * 刷新回调
       */
      refreshChange: function () {
        this.getList(this.page)
      },
      handleShowMap: function (row, index) {
        this.currAddress = row;
        if (row.position) {
          // let position = row.position.split(positionSplit);
          let position = row.position.substring(6, (row.position.length-1)).replace(" ", ",").split(',')

          this.marker.position = position;
          this.center = position;
        }
        this.showMap = true;
      },
      // 地图定位
      handleMap: function (row, index) {
        // <!-- 废弃 有BUG -->
        return ;

        this.currAddress = row;
        if (row.position) {
          var position = row.position.split(positionSplit);
          this.marker.position = position;
          this.marker.draggable = true;
          this.center = position;
        }
        this.showSavePositionBtn = true;
        this.showMap = true;
      },
      savePosition: function () {
        // <!-- 废弃 有BUG -->
        return ;

        let position = this.$refs.marker.$$getPosition();
        this.currAddress.position = position[0]+positionSplit+position[1];
        putObj(this.currAddress).then(data => {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
          this.getList(this.page)
          this.showMap = false;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .amap-box {
    height: 400px;
  }

  /deep/ .avue-crud__menu {
    right: 35px;
    top: 16px !important;
  }

</style>
