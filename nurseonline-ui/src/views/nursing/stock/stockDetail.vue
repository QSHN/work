<template>
  <div class="items" v-loading="loading">
    <el-table :data="items" style="width: 100%" v-loading="loading" highlight-current-row>
      <el-table-column type="index" label="序号" width="80px"></el-table-column>
      <el-table-column prop="goodsLabel" label="商品名称" width="110px"></el-table-column>
      <el-table-column prop="spec" label="规格" :width=defaultWidht></el-table-column>
      <el-table-column prop="model" label="型号" :width=defaultWidht></el-table-column>
      <el-table-column prop="unit" label="计量单位" :width=defaultWidht></el-table-column>
      <el-table-column prop="price" label="单价" :width=defaultWidht></el-table-column>
      <el-table-column prop="qty" label="数量" :width=defaultWidht></el-table-column>
      <el-table-column prop="amt" label="金额" :width=defaultWidht></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getStockDetail} from '@/api/nursing/stock/stockbill'

  export default {
    name: "stockDetail",
    data() {
      return {
        items: [],
        show: false,
        loading: false,
        defaultWidht: "100px",
      }
    },
    props: {
      billId: {
        type: Number
      }
    },
    created() {
      this.loading = true;
      getStockDetail(this.billId).then(res => {
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

