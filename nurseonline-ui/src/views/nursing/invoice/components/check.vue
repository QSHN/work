<template>
  <div class="check">
    <el-dialog title="审核" :visible.sync="show" width="980px">
      <el-form :model="currCheckInvoice" class="demo-form-inline">
        <el-form-item label="发票号码">
          <el-input v-model="currCheckInvoice.invoiceNo" placeholder="请输入发票号码"></el-input>
        </el-form-item>

        <el-form-item label="发票类别">
          <el-select v-model="currCheckInvoice.invoiceType" filterable  placeholder="请选择">
            <el-option v-for="item in invoiceTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发票介质">
          <el-select v-model="currCheckInvoice.invoiceMedia" placeholder="请选择发票介质">
            <el-option label="电子发票" value="0"></el-option>
            <el-option label="纸质发票" value="1"></el-option>
          </el-select>
        </el-form-item>


      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {vips} from '@/api/nursing/invoice/invoice'
  import {fetchTreeByItemClassCode} from '@/api/nursing/aid/itemclass'

  export default {
    name: "check",
    data() {
      return {
        show: false,
        checkLoading: false,
        formInline: {
          user: '',
          region: ''
        },
        invoiceTypeOptions:[],
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      currCheckInvoice: {}
    },
    watch: {
      show(val) {
        this.fetchInvoiceType();
        if (val === false) {
          this.$emit("input", val);
        }
      },
      value(val){
        this.show = val;
      },
    },
    methods: {
      fetchInvoiceType() {
        fetchTreeByItemClassCode("invoice_type").then(res => {
          res.data.data.forEach(i => {
            this.invoiceTypeOptions.push({
              value: i.itemId,
              label: i.itemName
            });
          });
        });
      },
      onSubmit() {
        console.log('submit!');
      },
      fSubmit() {
        if (e && e.vipId) {
          this.$emit("change", e);
          this.$emit("input", false);
        } else {
          this.$message.warning("请先点击选择会员");
        }
      }
    }
  }
</script>

<style>

</style>
