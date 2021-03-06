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
          name: 'salesOrder'
        })">新增</Button>
        <Button style="width: 80px; margin-left: 10px;" @click="load">刷新</Button>
      </ButtonGroup>
    </Row>

    <Row type="flex" style="margin-top: 10px;">
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun('audit', '审核', '已审核')">审核</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun('audit', '反审核', '未审核')">反审核</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun(null, '删除')">删除</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun('close', '启用', '未关闭')">启用</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun('close', '关闭', '手动关闭')">关闭</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length || selectList.length > 1" @click="pwFun">出库</Button>
      <Button style="margin-right: 10px;" :disabled="selectList.length <= 1" @click="pwFun">合并出库</Button>
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
          name: 'salesOrder',
          query: { id: row._id }
        }">{{ row.code }}</router-link>
      </template>
      <template slot-scope="{ row }" slot="dateTime">
        {{ row.dateTime ? moment(row.dateTime).format('YYYY-MM-DD') : ''}}
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
      <template slot-scope="{ row }" slot="audit">
        <Tag color="green" v-if="row.audit === '已审核'">已审核</Tag>
        <Tag color="red" v-else>未审核</Tag>
      </template>
      <template slot-scope="{ row }" slot="close">
        <Tag color="blue" v-if="row.close === '手动关闭'">手动关闭</Tag>
        <Tag color="green" v-else-if="row.close === '已关闭'">已关闭</Tag>
        <Tag color="red" v-else>未关闭</Tag>
      </template>
      <template slot-scope="{ row }" slot="storage">
        <Tag color="blue" v-if="row.storage === '部分出库'">部分出库</Tag>
        <Tag color="green" v-else-if="row.storage === '全部出库'">全部出库</Tag>
        <Tag color="red" v-else>未出库</Tag>
      </template>
      <template slot-scope="{ row }" slot="commodityWarehouse">
        {{ warehouseList.find(f => f._id === row.commodityWarehouse) && warehouseList.find(f => f._id === row.commodityWarehouse).name }}
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
import { querySalesOrder, batchSalesOrder } from '../../api/salesOrder'
import { queryCustomer } from '../../api/customer'
import { queryClerk } from '../../api/clerk'
import { queryDepartment } from '../../api/department'
import { queryWarehouse } from '../../api/warehouse'
export default {
  name: 'salesOrderList',
  data () {
    return {
      total: 0,
      pageSizeOpts: [10, 20, 50],
      whichSearchType: '快捷查询',
      searchList: [
        {
          title: '快捷查询',
          placeholder: '按单据编号/客户/商品名称',
          formula: ['code', 'customer', 'list.name']
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
        },
        {
          title: '商品名称',
          placeholder: '请输入商品名称',
          formula: ['list.name']
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
          title: '审核状态',
          width: 100,
          align: 'center',
          slot: 'audit',
          resizable: true
        },
        {
          title: '关闭状态',
          width: 100,
          align: 'center',
          slot: 'close',
          resizable: true
        },
        {
          title: '出库状态',
          width: 100,
          align: 'center',
          slot: 'storage',
          resizable: true
        },
        {
          title: '商品编码',
          width: 150,
          key: 'commodityCode',
          resizable: true
        },
        {
          title: '商品名称',
          width: 150,
          key: 'commodityName',
          resizable: true
        },
        {
          title: '仓库',
          width: 150,
          slot: 'commodityWarehouse',
          resizable: true
        },
        {
          title: '单位',
          width: 150,
          key: 'commodityUnit',
          resizable: true
        },
        {
          title: '数量',
          width: 150,
          key: 'commodityNumber',
          resizable: true
        },
        {
          title: '单价',
          width: 150,
          key: 'commodityPrice',
          resizable: true
        },
        {
          title: '含税单价',
          width: 150,
          key: 'commodityUnitPrice',
          resizable: true
        },
        {
          title: '增值税率%',
          width: 150,
          key: 'commodityTaxRate',
          resizable: true
        },
        {
          title: '税额',
          width: 150,
          key: 'commodityPayable',
          resizable: true
        },
        {
          title: '价税合计',
          width: 150,
          key: 'commodityPayableTotal',
          resizable: true
        },
        {
          title: '商品行备注',
          width: 150,
          key: 'commodityDes',
          resizable: true
        }
      ],
      tableData: [],
      customerList: [],
      departmentList: [],
      clerkList: [],
      warehouseList: [],
      salesOrder: []
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
          this.loadWarehouse()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '销售订单') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}销售订单的权力，请联系管理员`)
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
    loadWarehouse () {
      queryWarehouse({ accountSetId: this.accountSet._id }).then(res => {
        this.warehouseList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
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
      querySalesOrder(search).then(res => {
        let list = []
        res.data.list.forEach(f => {
          f.list.forEach(fl => {
            list.push({
              _id: f._id,
              code: f.code,
              dateTime: f.dateTime,
              customerId: f.customerId,
              departmentId: f.departmentId,
              clerkId: f.clerkId,
              audit: f.audit,
              close: f.close,
              storage: f.storage,
              commodityCode: fl.code,
              commodityName: fl.name,
              commodityWarehouse: fl.warehouseId,
              commodityUnit: fl.unit,
              commodityNumber: fl.number,
              commodityPrice: fl.price,
              commodityUnitPrice: fl.unitPrice,
              commodityTaxRate: fl.taxRate,
              commodityPayable: fl.payable,
              commodityPayableTotal: fl.payableTotal,
              commodityDes: fl.commodityDes
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
        this.salesOrder = res.data.list
        this.loading = false
        this.$store.commit('setListNav', {
          type: 'salesOrder',
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
        column.slot === 'close' ||
        column.slot === 'storage'
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
        let fData = this.salesOrder.find(f => f._id === id)
        if (title === '删除') {
          if (fData.audit === '已审核') {
            errorList.push({
              code: fData.code,
              val: '已审核'
            })
          } else if (fData.close !== '未关闭') {
            errorList.push({
              code: fData.code,
              val: fData.close
            })
          } else if (fData.storage !== '未出库') {
            errorList.push({
              code: fData.code,
              val: fData.storage
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
          } else if (fData.close !== '未关闭') {
            errorList.push({
              code: fData.code,
              val: fData.close
            })
          } else if (fData.storage !== '未出库') {
            errorList.push({
              code: fData.code,
              val: fData.storage
            })
          } else {
            canList.push({
              code: fData.code,
              id: id
            })
          }
        } else if (title === '启用') {
          if (fData.close === '未关闭') {
            errorList.push({
              code: fData.code,
              val: fData.close
            })
          } else {
            canList.push({
              code: fData.code,
              id: id
            })
          }
        } else if (title === '关闭') {
          if (fData.close !== '未关闭') {
            errorList.push({
              code: fData.code,
              val: fData.close
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
        title: `${title}销售订单`,
        content: content,
        onOk: () => {
          if (canList.length) {
            let action = {}
            if (title === '删除') {
              action = '删除'
            } else {
              action[type] = val
            }
            batchSalesOrder({
              action: action,
              ids: canList.map(m => m.id)
            }).then(res => {
              this.$Message.success(`成功${title}销售订单`)
              this.load()
            }).catch(err => {
              this.$Message.error(err.message)
            })
          }
        }
      })
    },
    pwFun () {
      if (!this.judge('出库')) return
      let error = ''
      let selectList = Array.from(new Set(this.selectList))
      selectList.forEach(id => {
        let fData = this.salesOrder.find(f => f._id === id)
        if (fData.audit === '未审核') {
          error += `<P>${fData.code}未审核，无法出库</P>`
        }
      })
      if (error) {
        this.$Modal.error({
          title: '出库申请',
          content: error
        })
      } else {
        this.$router.push({
          name: 'salesWarehouse',
          query: {
            pId: this.selectList.join(',')
          }
        })
      }
    },
    tracking () {
      this.$router.push({
        name: 'processTrackingIndex',
        query: {
          type: '销售订单',
          ids: this.selectList.join(',')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
