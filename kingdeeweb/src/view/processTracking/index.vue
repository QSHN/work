<template>
  <div class="processTracking">
    <div v-for="(v, i) in trackList" :key="i">
      <div class="title">{{v.type}}（{{v.code}}）跟踪情况</div>
      <Table border
             :columns="columns"
             :data="v.child"
             :width="getTableWidth"
             style="width: 100%">
        <template slot-scope="{ row }" slot="code">
          <span style="color: #2d8cf0; text-decoration: underline;" @click="goOrder(row)">
            {{ row.code }}
          </span>
        </template>
        <template slot-scope="{ row }" slot="orderType">
          {{ row.orderType }}
        </template>
        <template slot-scope="{ row }" slot="dateTime">
          {{ moment(row.dateTime).format('YYYY-MM-DD') }}
        </template>
        <template slot-scope="{ row }" slot="audit">
          <Tag color="green" v-if="row.audit === '已审核'">已审核</Tag>
          <Tag color="red" v-else>未审核</Tag>
        </template>
        <template slot-scope="{ row }" slot="status">
          <div v-html="getStatus(row)"></div>
        </template>
        <template slot-scope="{ row }" slot="warehouseId">
          <div v-html="getWarehouse(row)"></div>
        </template>
        <template slot-scope="{ row }" slot="unit">
          <div v-html="getUnit(row)"></div>
        </template>
        <template slot-scope="{ row }" slot="number">
          <div v-html="getNumber(row)"></div>
        </template>
        <template slot-scope="{ row }" slot="money">
          {{getMoney(row)}}
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { processTracking } from '../../api/processTracking'
import { queryWarehouse } from '../../api/warehouse'
import moment from 'moment'
import { formatMoney } from 'accounting'
export default {
  name: 'processTracking',
  data () {
    return {
      trackList: [],
      columns: [
        {
          title: '单据编码',
          slot: 'code',
          resizable: true
        },
        {
          title: '单据类型',
          slot: 'orderType',
          resizable: true
        },
        {
          title: '单据日期',
          slot: 'dateTime',
          resizable: true
        },
        {
          title: '审批状态',
          slot: 'audit',
          resizable: true
        },
        {
          title: '其他状态',
          slot: 'status',
          resizable: true
        },
        {
          title: '仓库',
          slot: 'warehouseId',
          resizable: true
        },
        {
          title: '单位',
          slot: 'unit',
          resizable: true
        },
        {
          title: '数量',
          slot: 'number',
          resizable: true
        },
        {
          title: '单据金额',
          slot: 'money',
          resizable: true
        }
      ],
      warehouseList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getTableWidth () {
      return window.innerWidth - 100
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.load()
          this.loadWarehouse()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    moment,
    formatMoney,
    load () {
      processTracking({
        accountSetId: this.accountSet._id,
        type: this.$route.query.type,
        ids: this.$route.query.ids.split(',')
      }).then(res => {
        this.trackList = res.data
      })
    },
    goOrder (row) {
      let routerName = ''
      switch (row.orderType) {
        case '采购订单':
          routerName = 'purchaseOrder'
          break
        case '采购入库单':
          routerName = 'purchaseWarehouse'
          break
        case '采购退货单':
          routerName = 'purchaseReturn'
          break
        case '销售订单':
          routerName = 'salesOrder'
          break
        case '销售出库单':
          routerName = 'salesWarehouse'
          break
        case '销售退货单':
          routerName = 'salesReturn'
          break
        case '其他入库单':
          routerName = 'warehouseIn'
          break
        case '其他出库单':
          routerName = 'warehouseOut'
          break
        case '调拨入库单':
          routerName = 'warehouseAllocatingIn'
          break
        case '调拨出库单':
          routerName = 'warehouseAllocatingOut'
          break
        case '盘盈单 ':
          routerName = 'warehouseDiskSurplus'
          break
        case '盘亏单':
          routerName = 'warehouseDiskDeficient'
          break
        case '盘点单':
          routerName = 'warehouseDiskPoint'
          break
        case '收款单':
          routerName = 'receivableCollection'
          break
        case '付款单':
          routerName = 'payableCollection'
          break
        case '预收款单':
          routerName = 'receivablePayments'
          break
        case '预付款单':
          routerName = 'payablePayments'
          break
        case '预收退款单':
          routerName = 'receivableRefund'
          break
        case '预付退款单':
          routerName = 'payableRefund'
          break
        case '其他应收单':
          routerName = 'receivableOther'
          break
        case '其他应付单':
          routerName = 'payableOther'
          break
        case '核销单':
          routerName = 'receivableVerification'
          break
      }
      this.$router.push({
        name: routerName,
        query: {
          id: row._id
        }
      })
    },
    getStatus (row) {
      let val = ''
      switch (row.orderType) {
        case '采购订单':
          if (row.close !== '未关闭') {
            val = `<div class="ivu-tag ivu-tag-size-default ivu-tag-green ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.close}</span>
                  </div>`
          } else {
            val = `<div class="ivu-tag ivu-tag-size-default ivu-tag-red ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.close}</span>
                  </div>`
          }
          if (row.storage === '全部入库') {
            val += `<div class="ivu-tag ivu-tag-size-default ivu-tag-green ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.storage}</span>
                  </div>`
          } else {
            val += `<div class="ivu-tag ivu-tag-size-default ivu-tag-red ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.storage}</span>
                  </div>`
          }
          break
        case '采购入库单':
          if (row.paymentStatus === '全部付款') {
            val = `<div class="ivu-tag ivu-tag-size-default ivu-tag-green ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.paymentStatus}</span>
                  </div>`
          } else {
            val = `<div class="ivu-tag ivu-tag-size-default ivu-tag-red ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.paymentStatus}</span>
                  </div>`
          }
          break
        case '销售退货单':
        case '采购退货单':
          if (row.refundStatus === '全部退款') {
            val = `<div class="ivu-tag ivu-tag-size-default ivu-tag-green ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.refundStatus}</span>
                  </div>`
          } else {
            val = `<div class="ivu-tag ivu-tag-size-default ivu-tag-red ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.refundStatus}</span>
                  </div>`
          }
          break
        case '销售订单':
          if (row.close !== '未关闭') {
            val = `<div class="ivu-tag ivu-tag-size-default ivu-tag-green ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.close}</span>
                  </div>`
          } else {
            val = `<div class="ivu-tag ivu-tag-size-default ivu-tag-red ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.close}</span>
                  </div>`
          }
          if (row.storage === '全部出库') {
            val += `<div class="ivu-tag ivu-tag-size-default ivu-tag-green ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.storage}</span>
                  </div>`
          } else {
            val += `<div class="ivu-tag ivu-tag-size-default ivu-tag-red ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.storage}</span>
                  </div>`
          }
          break
        case '销售出库单':
          if (row.paymentStatus === '全部收款') {
            val = `<div class="ivu-tag ivu-tag-size-default ivu-tag-green ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.paymentStatus}</span>
                  </div>`
          } else {
            val = `<div class="ivu-tag ivu-tag-size-default ivu-tag-red ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.paymentStatus}</span>
                  </div>`
          }
          break
        case '盘点单':
          if (row.result === '已盘点') {
            val = `<div class="ivu-tag ivu-tag-size-default ivu-tag-green ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.result}</span>
                  </div>`
          } else {
            val = `<div class="ivu-tag ivu-tag-size-default ivu-tag-red ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.result}</span>
                  </div>`
          }
          break
        case '预收款单':
        case '预付款单':
        case '其他应收单':
        case '其他应付单':
          if (row.status === '全部核销') {
            val = `<div class="ivu-tag ivu-tag-size-default ivu-tag-green ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.status}</span>
                  </div>`
          } else {
            val = `<div class="ivu-tag ivu-tag-size-default ivu-tag-red ivu-tag-checked">
                    <span class="ivu-tag-text ivu-tag-color-white">${row.status}</span>
                  </div>`
          }
          break
      }
      return val
    },
    loadWarehouse () {
      queryWarehouse({ accountSetId: this.accountSet._id }).then(res => {
        this.warehouseList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    getWarehouse (row) {
      if (row.list && row.list.length) {
        let val = row.list.reduce((total, r) => (
          total += (r.warehouseId ? `<div>${this.warehouseList.find(f => f._id === r.warehouseId).name}</div>` : '')
        ), '')
        return val
      } else {
        return ''
      }
    },
    getUnit (row) {
      if (row.list && row.list.length) {
        let val = row.list.reduce((total, r) => (
          total += (r.unit ? `<div>${r.unit}</div>` : '')
        ), '')
        return val
      } else {
        return ''
      }
    },
    getNumber (row) {
      if (row.list && row.list.length) {
        const val = row.list.reduce((total, r) => {
          let number = null
          if (row.orderType.includes('退货')) {
            number = r.reStorage
          } else if (row.orderType === '采购入库单') {
            number = r.inStorage
          } else if (row.orderType === '销售出库单') {
            number = r.outStorage
          } else {
            number = r.number
          }
          total += (number ? `<div>${number}</div>` : '')
          return total
        }, '')
        return val
      } else {
        return ''
      }
    },
    getMoney (row) {
      let val = ''
      switch (row.orderType) {
        case '采购订单':
        case '销售订单':
          val = this.formatMoney(row.payable || 0, '', 2)
          break
        case '采购入库单':
        case '采购退货单':
        case '销售出库单':
        case '销售退货单':
          val = this.formatMoney(row.orderMoney || 0, '', 2)
          break
        case '其他入库单':
        case '其他出库单':
        case '调拨入库单':
        case '调拨出库单':
        case '盘盈单 ':
        case '盘亏单':
        case '盘点单':
          val = this.formatMoney(row.deliveryCost || 0, '', 2)
          break
        case '收款单':
        case '付款单':
        case '预收款单':
        case '预付款单':
        case '预收退款单':
        case '预付退款单':
        case '其他应收单':
        case '其他应付单':
        case '核销单':
          val = this.formatMoney(row.main.total || 0, '', 2)
          break
      }
      return val
    }
  }
}
</script>

<style lang="less" scoped>
.processTracking {
  .title {
    font-size: 14px;
  }
}
</style>
