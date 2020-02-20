<template>
  <div class="items" v-loading="loading">
    <el-table :data="items" style="width: 100%" v-loading="loading" highlight-current-row>
      <el-table-column type="index" label="序号" width="80px"></el-table-column>
      <el-table-column prop="billId" label="订单id" :width=defaultWidht></el-table-column>
      <el-table-column prop="billDate" label="订单日期" :width=defaultWidht></el-table-column>
      <el-table-column prop="billAmt" label="订单金额" :width=defaultWidht></el-table-column>
      <el-table-column prop="billDesc" label="订单描述" width="300px"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getItems} from '@/api/nursing/invoice/invoice'

  export default {
    name: "itemsDetail",
    data() {
      return {
        items: [],
        show: false,
        loading: false,
        defaultWidht: "130px",
      }
    },
    props: {
      invoiceId: {
        type: Number
      }
    },
    created() {
      console.log(this.invoiceId)
      this.loading = true;
      getItems(this.invoiceId).then(res => {
        if (res.data && res.data.data) {
          this.items = res.data.data || [];
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      });
      console.log(this.items)
    },
    methods: {}
  }
</script>

