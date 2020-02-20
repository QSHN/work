<template>
  <div>
    <div style="display: flex; align-items: center; margin-bottom: 10px;">
      <Input v-model="search" placeholder="按策略名称/备注查找" style="width: 255px; margin-right: 20px;" />
    </div>

    <Row type="flex" style="margin-bottom: 10px;">
      <Button style="margin-right: 10px;" @click="loadCustomerPrices">刷新</Button>
      <Button style="margin-right: 10px;" @click="loadCustomerPrices">查询</Button>
      <Button type="primary" style="margin-right: 10px;" @click="setFun('add', null, '新增')">新增</Button>
      <Button style="margin-right: 10px;" @click="batchFun('删除', selectList)">删除</Button>
    </Row>

    <Table :width="getTableWidth"
           :height="getTableHeight"
           border
           :columns="commodityPricesColumns"
           :data="commodityPrices"
           :loading="loading"
           @on-selection-change="selectTable">
      <template slot-scope="{ row }" slot="status">
        <div @click="batchFun(row.status === '启用' ? '禁用' : '启用', [row._id])" style="position: relative;">
          <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
          <i-switch size="small" :value="row.status === '启用'" />
        </div>
      </template>
      <template slot-scope="{ row }" slot="action">
        <Button size="small" type="primary" style="margin-right: 5px;" @click="setFun('c', row, '适用客户')">适用客户</Button>
        <Button size="small" type="primary"  style="margin-right: 5px;" @click="setFun('p', row, '价格策略')">价格策略</Button>
        <Button size="small" style="margin-right: 5px;" @click="setFun('edit', row, '修改')">修改</Button>
        <Button size="small" style="margin-right: 5px;" @click="setFun('copy', row, '复制')">复制</Button>
        <Button size="small" @click="batchFun('删除', [row._id])">删除</Button>
      </template>
    </Table>

    <Row type="flex" justify="end" style="margin-top: 10px;">
      <Page :current.sync="pageInfo.page" :total="total" :page-size="pageInfo.limit" :page-size-opts="pageSizeOpts" size="small" show-elevator show-sizer />
    </Row>

    <customerForm ref="customerForm" @load="loadCustomerPrices" />
    <customerG ref="customerG" @load="loadCustomerPrices" :customerList="customerList" />
    <customerP ref="customerP" @load="loadCustomerPrices" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  customerPricesQuery,
  batchCustomerPrices
} from '../../api/commodityPrices'
import { queryCustomer } from '../../api/customer'
import customerForm from './customer'
import customerG from './customerG'
import customerP from './customerP'
import moment from 'moment'
export default {
  name: 'customerPrices',
  components: {
    customerForm,
    customerG,
    customerP
  },
  data () {
    return {
      total: 0,
      search: '',
      pageInfo: {
        limit: 10,
        page: 1
      },
      pageSizeOpts: [5, 10, 20],
      loading: false,
      selectList: [],
      commodityPrices: [],
      customerList: [],
      commodityPricesColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '价格策略代码',
          key: 'code',
          width: 150
        },
        {
          title: '价格策略名称',
          key: 'name',
          width: 300
        },
        {
          title: '设置方式',
          key: 'type',
          width: 150
        },
        {
          title: '生效时间',
          key: 'startTime',
          width: 150,
          render: (h, params) => {
            return h('div', params.row.startTime ? moment(params.row.startTime).format('YYYY-MM-DD') : null)
          }
        },
        {
          title: '失效时间',
          key: 'endTime',
          width: 150,
          render: (h, params) => {
            return h('div', params.row.endTime ? moment(params.row.endTime).format('YYYY-MM-DD') : null)
          }
        },
        {
          title: '备注',
          key: 'des'
        },
        {
          title: '状态',
          slot: 'status',
          width: 150,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 350,
          align: 'center'
        }
      ]
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
          this.loadCustomerPrices()
          this.loadCustomer()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '客户价格资料') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}客户价格资料的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadCustomerPrices () {
      this.loading = true
      let filter = {
        accountSetId: this.accountSet._id
      }
      if (this.search) {
        this.filter.name = { $regex: this.search }
        this.filter.des = { $regex: this.search }
      }
      customerPricesQuery({
        filter,
        pageInfo: this.pageInfo
      }).then(res => {
        this.total = res.data.total
        this.commodityPrices = res.data.list
        if (this.selectList.length) {
          this.commodityPrices.forEach(f => {
            if (this.selectList.includes(f._id)) {
              f._checked = true
            }
          })
        }
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '客户价格策略',
          desc: err.message
        })
      })
    },
    setFun (type, item, title) {
      if (!this.judge(title)) return
      let formData = item ? Object.assign({}, item) : {
        accountSetId: this.accountSet._id,
        creator: this.myUser._id
      }
      switch (type) {
        case 'add':
          this.$refs.customerForm.show('新建', null, this.commodityPrices, formData)
          break
        case 'edit':
          this.$refs.customerForm.show('修改', formData, this.commodityPrices)
          break
        case 'copy':
          delete formData._id
          formData.status = '禁用'
          formData.code = null
          formData.name = null
          formData.endTime = null
          formData.startTime = null
          formData.creator = this.myUser._id
          this.$refs.customerForm.show('复制', formData, this.commodityPrices)
          break
        case 'c':
          this.$refs.customerG.show(formData)
          break
        case 'p':
          if (item.useUser.length) {
            this.$refs.customerP.show(formData)
          } else {
            this.$Message.error('请先设置适用客户')
          }
          break
      }
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchFun (action, list) {
      if (!this.judge(action)) return
      this.$Modal.confirm({
        title: `${action}客户价格策略`,
        content: `是否${action}所选客户价格策略`,
        onOk: () => {
          batchCustomerPrices({
            ids: list,
            action: action
          }).then(res => {
            this.$Message.success(`成功${action}所选客户价格策略`)
            this.loadCustomerPrices()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
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
    }
  }
}
</script>

<style scoped>

</style>
