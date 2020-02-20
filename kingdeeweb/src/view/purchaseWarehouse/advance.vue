<template>
  <Modal
      v-model="modal"
      title="费用明细"
      :mask-closable="false"
      width="830"
      @on-cancel="cancel">
    <Table :width="800"
           border
           :columns="columns"
           :data="list"
           @on-row-click="rowClick"
           :row-class-name="rowClassName"
           class="input_table">
      <template slot-scope="{ row }" slot="action">
        <Button size="small" style="margin-right: 5px;" @click="setList(true)">增加</Button>
        <Button size="small" @click="setList(false, row._index)">删除</Button>
      </template>

      <template slot-scope="{ row }" slot="supplierId">
        <div class="text">{{ supplierList.find(f => f._id === row.supplierId) && supplierList.find(f => f._id === row.supplierId).name }}</div>
        <div class="hover_layer">
          <Select v-model="list[row._index].supplierId" style="width:200px">
            <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('supplier', loadSupplier)" style="font-size: 20px; opacity: 0.6" />
            <Option v-for="item in supplierList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
          </Select>
        </div>
      </template>

      <template slot-scope="{ row }" slot="spendingId">
        <div class="text">{{ spendingList.find(f => f._id === row.spendingId) && spendingList.find(f => f._id === row.spendingId).name }}</div>
        <div class="hover_layer">
          <Select v-model="list[row._index].spendingId">
            <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('spendingCategory', loadSpendingCategory)" style="font-size: 20px; opacity: 0.6" />
            <Option v-for="item in spendingList" :value="item._id" :key="item._id">{{ item.name }}</Option>
          </Select>
        </div>
      </template>

      <template slot-scope="{ row }" slot="money">
        <div class="text">{{ row.money }}</div>
        <div class="hover_layer">
          <InputNumber
            v-model="list[row._index].money"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\ \s?|(,*)/g, '')"
            style="width: 160px" />
        </div>
      </template>

      <template slot-scope="{ row }" slot="des">
        <div class="text">{{ row.des }}</div>
        <div class="hover_layer">
          <Input v-model="list[row._index].des" />
        </div>
      </template>
    </Table>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>

    <selectInfoModel ref="selectInfoModel" />
  </Modal>
</template>

<script>
import selectInfoModel from '../../components/selectInfo/model'
export default {
  name: 'purchaseOrder',
  components: {
    selectInfoModel
  },
  props: {
    supplierList: Array,
    spendingList: Array
  },
  data () {
    return {
      currentRow: null,
      modal: false,
      list: [],
      columns: [
        {
          title: '操作',
          slot: 'action',
          width: 125
        },
        {
          title: '供应商',
          slot: 'supplierId',
          width: 150
        },
        {
          title: '支出类别',
          slot: 'spendingId',
          width: 150
        },
        {
          title: '金额',
          slot: 'money',
          width: 195
        },
        {
          title: '备注',
          slot: 'des',
          width: 200
        }
      ]
    }
  },
  methods: {
    show (list, supplierId) {
      this.list = JSON.parse(JSON.stringify(list))
      if (list.length < 3) {
        let add = {
          supplierId: supplierId,
          spendingId: null,
          money: null,
          des: null
        }
        for (let i = list.length; i < 1; i++) {
          this.list.push(Object.assign({}, add))
        }
      }
      this.modal = true
    },
    cancel () {
      this.modal = false
    },
    sure () {
      this.$emit('purchaseExpense', this.list)
      this.cancel()
    },
    setList (isAdd, index) {
      if (isAdd) {
        this.list.push({
          supplierId: this.list[this.list.length - 1].supplierId,
          spendingId: null,
          money: null,
          des: null
        })
      } else {
        this.list.splice(index, 1)
      }
    },
    rowClassName (row, index) {
      return index === this.currentRow ? 'active' : ''
    },
    rowClick (row, index) {
      this.currentRow = index
    },
    loadSpendingCategory () {
      this.$emit('loadSpendingCategory')
    },
    loadSupplier () {
      this.$emit('loadSupplier')
    }
  }
}
</script>

<style lang="less">
  .input_table {
    .text {
      padding-left: 8px;
    }
    .hover_layer {
      display: none;
    }

    .ivu-table-row:hover,
    .ivu-table-row.active {
      .text {
        display: none;
      }
      .hover_layer {
        display: block;
      }
    }
  }
</style>
