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
      <avue-detail v-model="tableData" :option="detailOption" v-loading="tableLoading"></avue-detail>
    </basic-container>
  </div>
</template>

<script>
  import {fetchList, getObj, addObj, putObj, delObj} from '@/api/nursing/cust/detail'
  import {getSysModels, getSysFields} from '@/api/nursing/sys/sys'
  import {tableOption, detailOption} from '@/const/crud/nursing/cust/detail'
  import {mapGetters} from 'vuex'

  export default {
    name: 'CustDetail',
    props: {
      currcust: {
        type: Object,
        default: () => {
        }
      }
    },
    data() {
      return {
        tableData: {},
        tableLoading: false,
        detailOption: {},
        baseDetailOption: detailOption,
        sysFields:[],
      }
    },
    created() {
      getSysFields().then(res => {
        this.sysFields=[];
        for(let index in res.data.data){
          let item = res.data.data[index]
          this.sysFields[item.fieldCode] = item.fieldName
        }
        this.getDetail();
      }).catch(function(err){
        this.$message.error('获取字段类型失败！「get SysField fail：'+err+'」');
      })
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      getDetail() {
        this.tableLoading = true
        this.detailOption = JSON.parse(JSON.stringify(this.baseDetailOption))
        getObj(this.currcust.custId).then(response => {
          let detail = response.data.data
          if (response.data.data && response.data.data != null) {
            let paf = JSON.parse(response.data.data.personalAndFamily)
            for (let key in paf) {
              this.detailOption.group[1].column.push({label: this.sysFields[key]?this.sysFields[key]:key, prop: key})
              detail[key] = paf[key]!=''?paf[key]:'-'
            }
          }else{
            this.$message.error('该服务对象暂无健康档案！');
          }
          this.tableData = detail
          this.tableLoading = false
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
