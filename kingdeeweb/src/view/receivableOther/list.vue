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
          name: 'receivableOther'
        })">新增</Button>
        <Button style="width: 80px; margin-left: 10px;" @click="load">刷新</Button>
      </ButtonGroup>
    </Row>

    <Row type="flex" style="margin-top: 10px;">
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun('audit', '审核', '已审核')">审核</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun('audit', '反审核', '未审核')">反审核</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun(null, '删除')">删除</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="pwFun">收款</Button>
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
          name: 'receivableOther',
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
      <template slot-scope="{ row }" slot="orderType">
        <Tag color="green" v-if="row.orderType === '收款'">收款</Tag>
        <Tag color="red" v-else>退款</Tag>
      </template>
      <template slot-scope="{ row }" slot="customerId">
        {{ customerList.find(f => f._id === row.customerId) && customerList.find(f => f._id === row.customerId).name }}
      </template>
      <template slot-scope="{ row }" slot="departmentId">
        {{ departmentList.find(f => f._id === row.departmentId) && departmentList.find(f => f._id === row.departmentId).name }}
      </template>
      <template slot-scope="{ row }" slot="clerkId">
        {{ clerkList.find(f => f._id === row.clerkId) && clerkList.find(f => f._id === row.clerkId).name }}
      </template>
      <template slot-scope="{ row }" slot="orderTotal">
        {{ formatMoney( row.orderType === '退款' ? -row.orderTotal : row.orderTotal, '', 2) }}
      </template>
      <template slot-scope="{ row }" slot="des">
        {{ row.des }}
      </template>
      <template slot-scope="{ row }" slot="orderAdvanceAccountId">
        {{ incomeList.find(f => f._id === row.orderAdvanceAccountId) && incomeList.find(f => f._id === row.orderAdvanceAccountId).name }}
      </template>
      <template slot-scope="{ row }" slot="orderAdvanceMoney">
        {{ formatMoney( row.orderType === '退款' ? -row.orderAdvanceMoney : row.orderAdvanceMoney, '', 2) }}
      </template>
      <template slot-scope="{ row }" slot="orderDes">
        {{ row.orderDes }}
      </template>
      <template slot-scope="{ row }" slot="thisPay">
        {{ row.thisPay && formatMoney(row.thisPay, '', 2) }}
      </template>
      <template slot-scope="{ row }" slot="mainTotal">
        {{ row.mainTotal && formatMoney(row.mainTotal, '', 2) }}
      </template>
      <template slot-scope="{ row }" slot="preferential">
        {{ row.preferential && formatMoney(row.preferential, '', 2) }}
      </template>
      <template slot-scope="{ row }" slot="allTotal">
        {{ row.allTotal && formatMoney(row.allTotal, '', 2) }}
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
import { queryReceivableOther, batchReceivableOther } from '../../api/receivableOther'
import { queryCustomer } from '../../api/customer'
import { queryClerk } from '../../api/clerk'
import { queryDepartment } from '../../api/department'
import { queryIncomeCategory } from '../../api/incomeCategory'
import { formatMoney } from 'accounting'
import NP from 'number-precision'
export default {
  name: 'receivableOtherList',
  data () {
    return {
      total: 0,
      pageSizeOpts: [10, 20, 50],
      whichSearchType: '快捷查询',
      searchList: [
        {
          title: '快捷查询',
          placeholder: '按单据编号/客户名称',
          formula: ['code', 'customer']
        },
        {
          title: '按单据编号',
          placeholder: '请输入按单据编号',
          formula: ['code']
        },
        {
          title: '客户',
          placeholder: '请输入客户',
          formula: ['customer']
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
          title: '收款类型',
          width: 100,
          slot: 'orderType',
          align: 'center',
          resizable: true
        },
        {
          title: '客户',
          width: 150,
          slot: 'customerId',
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
          title: '应收金额合计',
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
          title: '应收信息',
          align: 'center',
          children: [
            {
              title: '收入名称',
              width: 200,
              slot: 'orderAdvanceAccountId',
              resizable: true
            },
            {
              title: '应收金额',
              width: 150,
              slot: 'orderAdvanceMoney',
              resizable: true
            },
            {
              title: '应收备注',
              width: 150,
              slot: 'orderDes',
              resizable: true
            },
            {
              title: '本次核销金额',
              width: 150,
              slot: 'thisPay',
              resizable: true
            }
          ]
        },
        {
          title: '收款合计',
          width: 150,
          align: 'right',
          slot: 'mainTotal',
          resizable: true
        },
        {
          title: '优惠金额',
          width: 150,
          align: 'right',
          slot: 'preferential',
          resizable: true
        },
        {
          title: '本次收款总金额',
          width: 150,
          align: 'right',
          slot: 'allTotal',
          resizable: true
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
      customerList: [],
      departmentList: [],
      clerkList: [],
      receivableOther: [],
      incomeList: []
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
          this.loadCustomer()
          this.loadClerk()
          this.loadDepartment()
          this.loadIncomeCategory()
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
          if (f.title === '其他应收') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}其他应收的权力，请联系管理员`)
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
    loadCustomer () {
      queryCustomer({ accountSetId: this.accountSet._id }).then(res => {
        this.customerList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '客户',
          desc: err.message
        })
      })
    },
    loadIncomeCategory () {
      queryIncomeCategory({ accountSetId: this.accountSet._id }).then(res => {
        this.incomeList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '收入类别',
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
          if (f === 'customer') {
            let list = this.customerList.filter(f => f.name.includes(search.searchVal)).map(v => v._id)
            if (list.length) {
              this.$set(obj, 'customerId', { $in: list })
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
      queryReceivableOther(search).then(res => {
        let list = []
        res.data.list.forEach(f => {
          let payTotal = f.order.payTotal || 0
          f.order.list.forEach(fl => {
            let thisPay = 0
            if (payTotal > 0) {
              if (payTotal >= fl.advanceMoney) {
                payTotal = NP.minus(payTotal, fl.advanceMoney || 0)
                thisPay = fl.advanceMoney
              } else {
                thisPay = payTotal
                payTotal = 0
              }
            }
            list.push({
              _id: f._id,
              code: f.code,
              dateTime: f.dateTime,
              customerId: f.customerId,
              departmentId: f.departmentId,
              clerkId: f.clerkId,
              audit: f.audit,
              orderType: f.orderType,
              des: f.des,
              orderTotal: f.order.total,
              orderAdvanceAccountId: fl.advanceAccountId,
              orderAdvanceMoney: fl.advanceMoney,
              orderDes: fl.des,
              thisPay: thisPay,
              mainTotal: NP.minus(f.main.total || 0, f.main.preferential || 0),
              preferential: f.main.preferential || 0,
              allTotal: f.main.total || 0,
              payTotal: f.order.payTotal,
              payList: f.order.payList,
              creator: f.creator,
              auditor: f.auditor,
              editor: f.editor,
              cAt: f.cAt,
              aAt: f.aAt,
              eAt: f.eAt
            })
          })
        })
        if (this.selectList.length) {
          list.forEach(f => {
            if (this.selectList.includes(f._id)) {
              f._checked = true
            }
          })
        }
        this.tableData = list
        this.total = res.data.total
        this.receivableOther = res.data.list
        this.loading = false
        this.$store.commit('setListNav', {
          type: 'receivableOther',
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
        column.slot === 'customerId' ||
        column.slot === 'departmentId' ||
        column.slot === 'clerkId' ||
        column.slot === 'audit' ||
        column.slot === 'orderType' ||
        column.slot === 'orderTotal' ||
        column.slot === 'mainTotal' ||
        column.slot === 'des' ||
        column.slot === 'preferential' ||
        column.slot === 'allTotal' ||
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
      if (!this.judge(isAdd ? '新增' : '修改')) return
      let errorList = []
      let canList = []
      let selectList = Array.from(new Set(this.selectList))
      selectList.forEach(id => {
        let fData = this.receivableOther.find(f => f._id === id)
        if (title === '删除') {
          if (fData.audit === '已审核') {
            errorList.push({
              code: fData.code,
              val: '已审核'
            })
          } else if (fData.order.payTotal) {
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
          } else if (fData.order.payTotal) {
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
        title: `${title}其他应收单`,
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
            batchReceivableOther({
              action: action,
              ids: canList.map(m => m.id)
            }).then(res => {
              this.$Message.success(`成功${title}其他应收单`)
              this.load()
            }).catch(err => {
              this.$Message.error(err.message)
            })
          }
        }
      })
    },
    pwFun () {
      if (!this.judge('收款')) return
      let error = ''
      let selectList = Array.from(new Set(this.selectList))
      let customerId = null
      selectList.forEach(id => {
        let fData = this.receivableOther.find(f => f._id === id)
        if (fData.audit === '未审核') {
          error += `<P>${fData.code}未审核，无法收款</P>`
        }
        if (fData.order.payTotal >= fData.order.total) {
          error += `<P>${fData.code}应收金额已全部核销</P>`
        }
        if (customerId) {
          if (customerId !== fData.customerId) error += `<P>${fData.code}收款只能是同一个客户</P>`
        } else {
          customerId = fData.customerId
        }
      })
      if (error) {
        this.$Modal.error({
          title: '收款',
          content: error
        })
      } else {
        this.$router.push({
          name: 'receivableCollection',
          query: {
            pId: this.selectList.join(','),
            type: 'receivableOther',
            customerId: customerId
          }
        })
      }
    },
    goDetail (row) {
      let text = ''
      if (row.preferential) text += `<p>本单优惠金额：${row.preferential}</p>`
      row.payList.forEach(f => {
        text += `<p>${f.orderId ? f.orderType + '（单号：' + f.orderCode + '）' : '本单核销金额'}：${f.orderMoney}</p>`
      })
      this.$Modal.success({
        title: '核销详情',
        content: text
      })
    },
    tracking () {
      this.$router.push({
        name: 'processTrackingIndex',
        query: {
          type: '其他应收单',
          ids: this.selectList.join(',')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
