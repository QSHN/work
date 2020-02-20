<template>
  <Modal
    v-model="modal"
    title="选择源单"
    :mask-closable="false"
    width="1200"
    :styles="{top: '20px'}"
    @on-cancel="cancel">

    <Table :width="1170"
           :height="500"
           border
           :columns="columns"
           :loading="loading"
           :data="tableData"
           @on-selection-change="selectTable"
           style="margin-top: 10px;">
      <template slot-scope="{ row }" slot="dateTime">
        {{ row.dateTime ? moment(row.dateTime).format('YYYY-MM-DD') : '' }}
      </template>

      <template slot-scope="{ row }" slot="orderType">
        {{ row.orderType }}
      </template>

      <template slot-scope="{ row }" slot="code">
        {{ row.code }}
      </template>

      <template slot-scope="{ row }" slot="des">
        {{ row.des }}
      </template>

      <template slot-scope="{ row }" slot="money">
        {{ row.money ? formatMoney(row.money, '', 2) : '' }}
      </template>

      <template slot-scope="{ row }" slot="payed">
        {{ row.payed ? formatMoney(row.payed, '', 2) : '' }}
      </template>

      <template slot-scope="{ row }" slot="unPayed">
        {{ row.unPayed ? formatMoney(row.unPayed, '', 2) : '' }}
      </template>
    </Table>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { queryPayablePayments } from '../../api/payablePayments'
import NP from 'number-precision'
import { formatMoney } from 'accounting'
export default {
  name: 'orderList',
  props: {
    hasList: Array
  },
  data () {
    return {
      selectList: [],
      loading: true,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          resizable: true
        },
        {
          title: '源单日期',
          slot: 'dateTime',
          width: 150
        },
        {
          title: '源单类型',
          slot: 'orderType',
          width: 200
        },
        {
          title: '源单单号',
          slot: 'code',
          width: 200
        },
        {
          title: '源单备注',
          slot: 'des',
          width: 200
        },
        {
          title: '源单金额',
          slot: 'money',
          width: 150
        },
        {
          title: '源单已核销金额',
          slot: 'payed',
          width: 150
        },
        {
          title: '源单未核销金额',
          slot: 'unPayed',
          width: 150
        },
        {
          title: ' '
        }
      ],
      modal: false,
      payablePayments: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList',
      'userList'
    ]),
    tableData () {
      let list = []
      if (this.payablePayments.length) {
        this.payablePayments.forEach(f => {
          let unPayed = NP.minus(f.main.total || 0, f.main.payTotal || 0)
          list.push({
            orderId: f._id,
            orderType: '预付款单',
            code: f.code,
            dateTime: f.dateTime,
            des: f.des,
            money: f.main.total || 0,
            payed: f.main.payTotal || 0,
            unPayed: unPayed,
            thisPay: unPayed,
            payDes: null
          })
        })
      }
      if (this.selectList.length) {
        list.forEach(f => {
          if (this.selectList.includes(f._id)) {
            f._checked = true
          }
        })
      }
      return list.filter(f => !this.hasList.find(v => v.orderId === f.orderId))
    }
  },
  methods: {
    moment,
    formatMoney,
    show (supplierId) {
      this.load(supplierId)
      this.modal = true
    },
    cancel () {
      this.modal = false
    },
    sure () {
      this.$emit('selectOrder', this.tableData.filter(f => this.selectList.includes(f._id)))
      this.cancel()
    },
    load (supplierId) {
      this.loading = true
      queryPayablePayments({
        filter: {
          accountSetId: this.accountSet._id,
          supplierId: supplierId,
          audit: '已审核',
          status: { $ne: '全部核销' }
        },
        pageInfo: {
          limit: 99999999999,
          page: 1
        }
      }).then(res => {
        this.loading = false
        this.payablePayments = res.data.list
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    }
  }
}
</script>

<style scoped>

</style>
