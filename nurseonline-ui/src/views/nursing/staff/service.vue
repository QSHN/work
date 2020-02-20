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
  <!--<div class="execution">-->
    <!--<basic-container>-->
      <el-dialog
        width="50%"
        title="服务人员技能维护"
        :show-close="false"
        :visible="showService">
        <div style="text-align: center">
          <el-transfer ref="serviceTransfer"
                       v-model="staffServiceKeys"
                       style="text-align: left; display: inline-block"
                       v-if="showService"
                       :filterable=true
                       :titles="['技能表', '已有技能']"
                       :button-texts="['删除技能', '添加技能']"
                       :props="{key: 'serviceId',label: 'serviceName'}"
                       :data="baseServiceData"
                       @change="handlCheckChange">
          </el-transfer>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleStaffService" v-if="permissions.oms_staff_service_edit || permissions.scms_orgstaff_service_edit">保存</el-button>
          <el-button @click="showService = false">关闭</el-button>
        </span>
      </el-dialog>
    <!--</basic-container>-->
  <!--</div>-->
</template>

<script>
  import {fetchList, saveStaffService} from '@/api/nursing/staff/service'
  import {fetchList as getBaseServiceData} from '@/api/nursing/service/service'
  import {tableOption} from '@/const/crud/nursing/staff/service'
  import {mapGetters} from 'vuex'

  export default {
    name: 'StaffService',
    props: {},
    data() {
      return {
        currStaff: {},
        tableData: [],
        baseServiceData: [],
        staffServiceKeys: [],
        staffServiceData: [],
        showService: false,
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
      getList(params) {
        // params = Object.assign(params, this.currStaff);
        this.showService = true;
        this.currStaff = params;
        this.staffServiceKeys = [];
        this.staffServiceData = [];
        this.handleBaseService();
        fetchList(params).then(response => {
          for (let index in response.data.data) {
            this.staffServiceKeys.push(response.data.data[index]['serviceId']);
            this.staffServiceData.push({
              staffId: this.currStaff.staffId,
              serviceId: response.data.data[index]['serviceId'],
              serviceName: response.data.data[index]['serviceName']
            })
          }
        })
      },
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList(this.page)
      },
      /**
       * 获取所有技能（服务项）
       */
      handleBaseService() {
        getBaseServiceData({current: 1, size: 99999}).then(
          response => {
            this.baseServiceData = response.data.data.records;
          }
        )
      }
      ,
      handlCheckChange(obj, operate, arr) {
        this.staffServiceData = [];
        for (let key in obj) {
          let service = this.baseServiceData.filter(({serviceId}) => serviceId == obj[key])[0];
          this.staffServiceData.push({
            staffId: this.currStaff.staffId,
            serviceId: service.serviceId,
            serviceName: service.serviceName
          });
        }
      }
      ,
      handleStaffService() {
        saveStaffService(this.currStaff.staffId, this.staffServiceData).then(response => {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
