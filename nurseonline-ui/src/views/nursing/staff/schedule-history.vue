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
      <div>
        <el-date-picker
          v-model="selectWeekStart"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="选择周"
          @change="doChangeDate">
        </el-date-picker>
        周日：{{weekDate.data1}}<br>
        周一：{{weekDate.data2}}<br>
        周二：{{weekDate.data3}}<br>
        周三：{{weekDate.data4}}<br>
        周四：{{weekDate.data5}}<br>
        周五：{{weekDate.data6}}<br>
        周六：{{weekDate.data7}}
      </div>
    </basic-container>
  </div>
</template>

<script>
  import {fetchList, getObj, addObj, putObj, delObj, getWeek} from '@/api/nursing/staff/schedule-history'
  import {tableOption} from '@/const/crud/nursing/staff/schedule-history'
  import { mapGetters } from 'vuex'
  export default {
    name: 'StaffScheduleHisitory',
    props: {
      currstaff: {
        type: Object,
        default: () => {
        }
      }
    },
    data() {
      return {
        selectWeekStart: '2019-03-21',
        startDate: '',
        endDate: '',
        weekDate:{},
        showDefaultDate: true,
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
      rowDel: function(row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为' + row.scheduleId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
            return delObj(row.scheduleId)
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
      },

      doChangeDate: function (date) {
        let dd = '';
        dd += date.getFullYear() + "-";
        dd += (date.getMonth()+1) > 10 ? (date.getMonth()+1) : '0' + (date.getMonth()+1);
        dd += "-" + (date.getDate() > 10 ? date.getDate() : '0' + date.getDate());
        let params = {
          staffId: this.currstaff.staffId,
          anyDate: dd
        }
        getWeek(params).then(response => {
          this.weekDate = response.data.data
        }).catch(data=>{
          this.weekDate = {};
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
