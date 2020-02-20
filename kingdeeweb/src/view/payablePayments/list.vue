<template>
  <div>
    <Row type="flex" justify="space-between">
      <Row>
        <div style="display: flex; align-items: center;">
          <Select v-model="whichSearchType" style="width: 100px; margin-right: 10px;">
            <Option v-for="(item, index) in searchList" :value="item.title" :key="index">{{ item.title }}</Option>
          </Select>
          <Input v-model="search.searchVal" :placeholder="searchList.find(f => f.title === whichSearchType).placeholder" style="width: 300px;" />
          <Button style="margin-left: 10px;" @click="load">搜索</Button>
        </div>
      </Row>

      <ButtonGroup>
        <Button style="width: 80px; margin-left: 10px;" @click="$router.push({
          name: 'payablePayments'
        })">新增</Button>
        <Button style="width: 80px; margin-left: 10px;" @click="load">刷新</Button>
      </ButtonGroup>
    </Row>

    <Row type="flex" style="margin-top: 10px;">
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun('audit', '审核', '已审核')">审核</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun('audit', '反审核', '未审核')">反审核</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun(null, '删除')">删除</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="pwFun">退款</Button>
      <!--<Button style="margin-right: 10px;" :disabled="true">打印</Button>-->
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="tracking">全流程跟踪</Button>
    </Row>

    <Table :width="getTableWidth"
           :height="getTableHeight"
           border
           :columns="columns"
           :loading="loading"
           :data="tableData"
           :span-method="handleSpan"
           @on-selection-change="selectTable"
           style="margin-top: 10px;">
      <template slot-scope="{ row }" slot="code">
        <router-link :to="{
          name: 'payablePayments',
          query: { id: row._id }
        }">{{ row.code }}</router-link>
      </template>
      <template slot-scope="{ row }" slot="dateTime">
        {{ row.dateTime ? moment(row.dateTime).format('YYYY-MM-DD') : ''}}
      </template>
      <template slot-scope="{ row }" slot="audit">
        <Tag color="green" v-if="row.audit === '已审核'">已审核</Tag>
        <Tag color="red" v-else>未审核</Tag>
      </template>
      <template slot-scope="{ row }" slot="supplierId">
        {{ supplierList.find(f => f._id === row.supplierId) && supplierList.find(f => f._id === row.supplierId).name }}
      </template>
      <template slot-scope="{ row }" slot="departmentId">
        {{ departmentList.find(f => f._id === row.departmentId) && departmentList.find(f => f._id === row.departmentId).name }}
      </template>
      <template slot-scope="{ row }" slot="clerkId">
        {{ clerkList.find(f => f._id === row.clerkId) && clerkList.find(f => f._id === row.clerkId).name }}
      </template>
      <template slot-scope="{ row }" slot="orderTotal">
        {{ row.orderTotal && formatMoney(row.orderTotal, '', 2) }}
      </template>
      <template slot-scope="{ row }" slot="des">
        {{ row.des }}
      </template>
      <template slot-scope="{ row }" slot="orderAdvanceAccountId">
        {{ bankAccountList.find(f => f._id === row.orderAdvanceAccountId) && bankAccountList.find(f => f._id === row.orderAdvanceAccountId).name }}
      </template>
      <template slot-scope="{ row }" slot="orderAdvanceType">
        {{ clearList.find(f => f._id === row.orderAdvanceType) && clearList.find(f => f._id === row.orderAdvanceType).name }}
      </template>
      <template slot-scope="{ row }" slot="orderAdvanceMoney">
        {{ row.orderAdvanceMoney && formatMoney(row.orderAdvanceMoney, '', 2) }}
      </template>
      <template slot-scope="{ row }" slot="orderTransactionNo">
        {{ row.orderTransactionNo }}
      </template>
      <template slot-scope="{ row }" slot="orderDes">
        {{ row.orderDes }}
      </template>
      <template slot-scope="{ row }" slot="payList">
        <a href="javascript: void(0)" @click="goDetail(row)">{{ row.payTotal > 0 ? row.payTotal === row.orderTotal ? '全部核销' : '部分核销' : '未核销' }}</a>
      </template>
      <template slot-scope="{ row }" slot="payTotal">
        {{ row.payTotal && formatMoney(row.payTotal, '', 2) }}
      </template>
      <template slot-scope="{ row }" slot="creator">
        {{ userList.find(f => f._id === row.creator) && userList.find(f => f._id === row.creator).name }}
      </template>
      <template slot-scope="{ row }" slot="cAt">
        {{ row.cAt ? moment(row.cAt).format('YYYY-MM-DD') : ''}}
      </template>
      <template slot-scope="{ row }" slot="editor">
        {{ userList.find(f => f._id === row.editor) && userList.find(f => f._id === row.editor).name }}
      </template>
      <template slot-scope="{ row }" slot="eAt">
        {{ row.eAt ? moment(row.eAt).format('YYYY-MM-DD') : ''}}
      </template>
      <template slot-scope="{ row }" slot="auditor">
        {{ userList.find(f => f._id === row.auditor) && userList.find(f => f._id === row.auditor).name }}
      </template>
      <template slot-scope="{ row }" slot="aAt">
        {{ row.aAt ? moment(row.aAt).format('YYYY-MM-DD') : ''}}
      </template>
    </Table>

    <Row type="flex" justify="end" style="margin-top: 10px;">
      <Page :current.sync="search.pageInfo.page" :total="total" :page-size="search.pageInfo.limit" :page-size-opts="pageSizeOpts" size="small" show-elevator show-sizer />
    </Row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { queryPayablePayments, batchPayablePayments } from '../../api/payablePayments'
import { querySupplier } from '../../api/supplier'
import { queryClerk } from '../../api/clerk'
import { queryDepartment } from '../../api/department'
import { queryBankAccount } from '../../api/bankAccount'
import { queryClearingForm } from '../../api/clearingForm'
import { formatMoney } from 'accounting'
// import NP from 'number-precision'
export default {
  name: 'payablePaymentsList',
  data () {
    return {
      total: 0,
      pageSizeOpts: [10, 20, 50],
      whichSearchType: '快捷查询',
      searchList: [
        {
          title: '快捷查询',
          placeholder: '按单据编号/供应商名称',
          formula: ['code', 'supplier']
        },
        {
          title: '按单据编号',
          placeholder: '请输入按单据编号',
          formula: ['code']
        },
        {
          title: '供应商',
          placeholder: '请输入供应商',
          formula: ['supplier']
        }
      ],
      search: {
        searchVal: '',
        filter: {
          accountSetId: null
        },
        pageInfo: {
          limit: 10,
          page: 1
        }
      },
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
          title: '单据编号',
          width: 200,
          slot: 'code',
          resizable: true
        },
        {
          title: '单据日期',
          width: 150,
          slot: 'dateTime',
          resizable: true
        },
        {
          title: '审核状态',
          width: 100,
          align: 'center',
          slot: 'audit',
          resizable: true
        },
        {
          title: '供应商',
          width: 150,
          slot: 'supplierId',
          resizable: true
        },
        {
          title: '部门',
          width: 150,
          slot: 'departmentId',
          resizable: true
        },
        {
          title: '业务员',
          width: 150,
          slot: 'clerkId',
          resizable: true
        },
        {
          title: '付款金额合计',
          width: 150,
          align: 'right',
          slot: 'orderTotal',
          resizable: true
        },
        {
          title: '单据备注',
          width: 100,
          slot: 'des',
          resizable: true
        },
        {
          title: '应付信息',
          align: 'center',
          children: [
            {
              title: '付款账户',
              width: 200,
              slot: 'orderAdvanceAccountId',
              resizable: true
            },
            {
              title: '付款方式',
              width: 200,
              slot: 'orderAdvanceType',
              resizable: true
            },
            {
              title: '付款金额',
              width: 150,
              slot: 'orderAdvanceMoney',
              resizable: true
            },
            {
              title: '交易号/票据号',
              width: 150,
              slot: 'orderTransactionNo',
              resizable: true
            },
            {
              title: '付款备注',
              width: 150,
              slot: 'orderDes',
              resizable: true
            }
          ]
        },
        {
          title: '单据核销状态',
          width: 150,
          align: 'center',
          slot: 'payList',
          resizable: true
        },
        {
          title: '已核销总金额',
          width: 150,
          align: 'right',
          slot: 'payTotal',
          resizable: true
        },
        {
          title: '制单人',
          width: 150,
          slot: 'creator',
          resizable: true
        },
        {
          title: '创建时间',
          width: 150,
          slot: 'cAt',
          resizable: true
        },
        {
          title: '修改人',
          width: 150,
          slot: 'editor',
          resizable: true
        },
        {
          title: '修改时间',
          width: 150,
          slot: 'eAt',
          resizable: true
        },
        {
          title: '审核人',
          width: 150,
          slot: 'auditor',
          resizable: true
        },
        {
          title: '审核时间',
          width: 150,
          slot: 'aAt',
          resizable: true
        }
      ],
      tableData: [],
      supplierList: [],
      departmentList: [],
      clerkList: [],
      bankAccountList: [],
      clearList: []
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
    getTableHeight () {
      return window.innerHeight - 250
    },
    getTableWidth () {
      return window.innerWidth - 100
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.load()
          this.loadSupplier()
          this.loadClerk()
          this.loadDepartment()
          this.loadBank()
          this.loadClearingForm()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    formatMoney,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '预付款') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}预付款的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadClerk () {
      queryClerk({ accountSetId: this.accountSet._id }).then(res => {
        this.clerkList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '职员',
          desc: err.message
        })
      })
    },
    loadDepartment () {
      queryDepartment({ accountSetId: this.accountSet._id }).then(res => {
        this.departmentList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '部门',
          desc: err.message
        })
      })
    },
    loadSupplier () {
      querySupplier({ accountSetId: this.accountSet._id }).then(res => {
        this.supplierList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '供应商',
          desc: err.message
        })
      })
    },
    loadBank () {
      queryBankAccount({ accountSetId: this.accountSet._id }).then(res => {
        this.bankAccountList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '银行账号',
          desc: err.message
        })
      })
    },
    loadClearingForm () {
      queryClearingForm({ accountSetId: this.accountSet._id }).then(res => {
        this.clearList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '结算方式',
          desc: err.message
        })
      })
    },
    load () {
      this.loading = true
      let search = JSON.parse(JSON.stringify(this.search))
      let filter = {
        accountSetId: this.accountSet._id
      }
      if (search.searchVal) {
        let formula = this.searchList.find(f => f.title === this.whichSearchType).formula
        this.$set(filter, '$or', [])
        formula.forEach(f => {
          let obj = {}
          if (f === 'supplier') {
            let list = this.supplierList.filter(f => f.name.includes(search.searchVal)).map(v => v._id)
            if (list.length) {
              this.$set(obj, 'supplierId', { $in: list })
              filter['$or'].push(obj)
            }
          } else if (f.includes('.')) {
            let c = f.split('.')
            let o = {}
            o[c[1]] = { $regex: search.searchVal }
            this.$set(obj, c[0], { $elemMatch: o })
            filter['$or'].push(obj)
          } else {
            this.$set(obj, f, { $regex: search.searchVal })
            filter['$or'].push(obj)
          }
        })
      }
      search.filter = filter
      delete search.searchVal
      queryPayablePayments(search).then(res => {
        let list = []
        res.data.list.forEach(f => {
          f.main.list.forEach(fl => {
            list.push({
              _id: f._id,
              code: f.code,
              dateTime: f.dateTime,
              supplierId: f.supplierId,
              departmentId: f.departmentId,
              clerkId: f.clerkId,
              audit: f.audit,
              des: f.des,
              orderTotal: f.main.total,
              orderAdvanceAccountId: fl.advanceAccountId,
              orderAdvanceType: fl.advanceType,
              orderAdvanceMoney: fl.advanceMoney,
              orderTransactionNo: fl.transactionNo,
              orderDes: fl.des,
              payTotal: f.main.payTotal,
              payList: f.main.payList,
              creator: f.creator,
              auditor: f.auditor,
              editor: f.editor,
              cAt: f.cAt,
              aAt: f.aAt,
              eAt: f.eAt
            })
          })
        })
        this.tableData = list
        this.total = res.data.total
        this.payablePayments = res.data.list
        if (this.selectList.length) {
          this.tableData.forEach(f => {
            if (this.selectList.includes(f._id)) {
              f._checked = true
            }
          })
        }
        this.loading = false
        this.$store.commit('setListNav', {
          type: 'payablePayments',
          list: list.map(v => v._id)
        })
      }).catch(err => {
        this.$Notice.error({
          title: '商品',
          desc: err.message
        })
      })
    },
    handleSpan ({ row, column, rowIndex, columnIndex }) {
      if (
        column.type === 'selection' ||
        column.slot === 'code' ||
        column.slot === 'dateTime' ||
        column.slot === 'supplierId' ||
        column.slot === 'departmentId' ||
        column.slot === 'clerkId' ||
        column.slot === 'audit' ||
        column.slot === 'orderTotal' ||
        column.slot === 'des' ||
        column.slot === 'payTotal' ||
        column.slot === 'payList' ||
        column.slot === 'creator' ||
        column.slot === 'auditor' ||
        column.slot === 'editor' ||
        column.slot === 'cAt' ||
        column.slot === 'aAt' ||
        column.slot === 'eAt'
      ) {
        if (rowIndex === this.tableData.findIndex((f, i) => f._id === row._id)) {
          let num = this.tableData.filter(v => v._id === row._id).length
          if (num > 1) {
            return {
              rowspan: num,
              colspan: 1
            }
          }
        } else {
          let num = this.tableData.filter(v => v._id === row._id).length
          if (num > 1) {
            return [0, 0]
          }
        }
      }
      // console.log(row, column)
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchFun (type, title, val = null) {
      if (!this.judge(title)) return
      let errorList = []
      let canList = []
      let selectList = Array.from(new Set(this.selectList))
      selectList.forEach(id => {
        let fData = this.payablePayments.find(f => f._id === id)
        if (title === '删除') {
          if (fData.audit === '已审核') {
            errorList.push({
              code: fData.code,
              val: '已审核'
            })
          } else if (fData.main.payTotal) {
            errorList.push({
              code: fData.code,
              val: '已有核销金额'
            })
          } else {
            canList.push({
              code: fData.code,
              id: id
            })
          }
        } else if (title === '审核') {
          if (fData.audit === '已审核') {
            errorList.push({
              code: fData.code,
              val: '已审核'
            })
          } else {
            canList.push({
              code: fData.code,
              id: id
            })
          }
        } else if (title === '反审核') {
          if (fData.audit === '未审核') {
            errorList.push({
              code: fData.code,
              val: '未审核'
            })
          } else if (fData.main.payTotal) {
            errorList.push({
              code: fData.code,
              val: '已有核销金额'
            })
          } else if (fData.credentialsId) {
            errorList.push({
              code: fData.code,
              val: '存在财务凭证'
            })
          } else if (fData.credentialsCaseId) {
            errorList.push({
              code: fData.code,
              val: '存在暂存业务凭证'
            })
          } else {
            canList.push({
              code: fData.code,
              id: id
            })
          }
        }
      })
      let content = ''
      if (errorList.length) {
        content += `<p>无法${title}以下单据：</p>`
        errorList.forEach(f => {
          content += `<p>单据编号: ${f.code} - ${f.val}</p>`
        })
      }
      if (canList.length) {
        content += `<p>确定是否${title}以下单据：</p>`
        canList.forEach(f => {
          content += `<p>单据编号: ${f.code}</p>`
        })
      } else {
        content += `<p>您没有符合${title}条件的单据</p>`
      }
      this.$Modal.confirm({
        title: `${title}预付款单`,
        content: content,
        onOk: () => {
          if (canList.length) {
            let action = {}
            if (title === '删除') {
              action = '删除'
            } else {
              action[type] = val
              action.auditor = val === '已审核' ? this.myUser._id : null
              action.aAt = val === '已审核' ? new Date() : null
            }
            batchPayablePayments({
              action: action,
              ids: canList.map(m => m.id)
            }).then(res => {
              this.$Message.success(`成功${title}预付款单`)
              this.load()
            }).catch(err => {
              this.$Message.error(err.message)
            })
          }
        }
      })
    },
    pwFun () {
      if (!this.judge('退款')) return
      let error = ''
      let selectList = Array.from(new Set(this.selectList))
      let supplierId = null
      selectList.forEach(id => {
        let fData = this.payablePayments.find(f => f._id === id)
        if (fData.audit === '未审核') {
          error += `<P>${fData.code}未审核，无法退款</P>`
        }
        if (fData.main.payTotal >= fData.main.total) {
          error += `<P>${fData.code}预付金额已全部核销</P>`
        }
        if (supplierId) {
          if (supplierId !== fData.supplierId) error += `<P>${fData.code}退款只能是同一个供应商</P>`
        } else {
          supplierId = fData.supplierId
        }
      })
      if (error) {
        this.$Modal.error({
          title: '退款',
          content: error
        })
      } else {
        this.$router.push({
          name: 'payableRefund',
          query: {
            pId: this.selectList.join(','),
            type: 'payablePayments',
            supplierId: supplierId
          }
        })
      }
    },
    goDetail (row) {
      let text = ''
      row.payList.forEach(f => {
        text += `<p>${f.orderId ? f.orderType + '（单号：' + f.orderCode + '）' : '本单核销金额'}：${f.orderMoney}</p>`
      })
      this.$Modal.success({
        title: '核销详情',
        content: text || '未查到核销金额'
      })
    },
    tracking () {
      this.$router.push({
        name: 'processTrackingIndex',
        query: {
          type: '预付款单',
          ids: this.selectList.join(',')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
