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
           style="margin-top: 10px;">
      <template slot-scope="{ row }" slot="thisPay">
          <InputNumber
            v-model="tableData[row._index].thisPay"
            :max="row.unPayed"
            :min="0"
            :step="0.01"
            style="width: 110px"/>
      </template>

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
      <Button type="success" @click="sure" v-if="!formData._id">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { queryReceivablePayments } from '../../api/receivablePayments'
import NP from 'number-precision'
import { formatMoney } from 'accounting'
export default {
  name: 'orderList',
  props: {
    hasList: Array,
    formData: Object
  },
  data () {
    return {
      selectList: [],
      loading: true,
      columns: [
        {
          title: '本次核销金额',
          slot: 'thisPay',
          width: 150
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
          title: ' '
        }
      ],
      modal: false,
      receivablePayments: []
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
      if (this.hasList.length) {
        list = this.hasList
      } else if (this.receivablePayments.length) {
        this.receivablePayments.forEach(f => {
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
            thisPay: null,
            payDes: null
          })
        })
      }
      return list
    }
  },
  methods: {
    moment,
    formatMoney,
    show (customerId) {
      this.load(customerId)
      this.modal = true
    },
    cancel () {
      this.modal = false
    },
    sure () {
      let error = ''
      this.tableData.forEach((f, i) => {
        if (f.thisPay > f.unPayed) {
          error += `<p>第${i + 1}条本次核销金额大于源单未核销金额</p>`
        }
      })
      if (error) {
        this.$Message.error(error)
      } else {
        this.$emit('selectReceivable', this.tableData.filter(f => f.thisPay))
        this.cancel()
      }
    },
    load (customerId) {
      this.loading = true
      queryReceivablePayments({
        filter: {
          accountSetId: this.accountSet._id,
          customerId: customerId,
          audit: '已审核',
          status: { $ne: '全部核销' }
        },
        pageInfo: {
          limit: 99999999999,
          page: 1
        }
      }).then(res => {
        this.loading = false
        this.receivablePayments = res.data.list
      }).catch(err => {
        this.$Message.error(err.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
