<template>
  <div>
    <Row type="flex" justify="space-between">
      <Button style="width: 80px; margin-left: 10px;" @click="isExpend = !isExpend">{{ isExpend ? '收起' : '展开' }}筛选</Button>
      <ButtonGroup>
        <Button style="width: 80px; margin-left: 10px;" @click="load">查询</Button>
        <Button style="width: 80px; margin-left: 10px;" :disabled="true">导出</Button>
        <Button style="width: 80px; margin-left: 10px;" :disabled="true">列设置</Button>
        <Button style="width: 80px; margin-left: 10px;" @click="$refs.printModal.show()">打印</Button>
      </ButtonGroup>
    </Row>

    <Card style="margin-top: 10px;" v-if="isExpend">
      <Form label-position="top">
        <Row type="flex" style="margin-bottom: 10px;">
          <FormItem label="日期" style="margin: 0 30px 0 0;">
            <DatePicker type="daterange" split-panels v-model="search.time" style="width: 200px" :clearable="false"></DatePicker>
          </FormItem>
          <FormItem label="供应商" style="margin: 0 30px 0 0;">
            <Select v-model="search.supplierId" style="width:200px">
              <Option v-for="item in supplierList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="部门" style="margin: 0 30px 0 0;">
            <Select v-model="search.departmentId" style="width:200px">
              <Option v-for="item in departmentList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="业务员" style="margin: 0 30px 0 0;">
            <Select v-model="search.clerkId" style="width:200px">
              <Option v-for="item in clerkList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
        </Row>

        <Row type="flex" style="margin-top: 15px;">
          <Checkbox v-model="search.audit" style="margin-top: 7px;"></Checkbox>
          <span style="margin-right: 30px; line-height: 30px;">包括未审核</span>
          <Checkbox v-model="search.isOther" style="margin-top: 7px;"></Checkbox>
          <span style="line-height: 30px;">包括其他应付</span>
        </Row>

        <Row type="flex" style="margin-top: 10px;">
          <Button style="width: 80px; margin-right: 10px;" @click="resetSearch">重置</Button>
        </Row>
      </Form>
    </Card>

    <Table :width="getTableWidth" :height="getTableHeight" border :columns="columns" :data="tableData" style="margin-top: 10px;">
      <template slot-scope="{ row }" slot="dateTime">
        {{ row.dateTime && (row.orderType !== '小计' && row.orderType !== '期初余额' && row.orderType !== '合计') ? moment(row.dateTime).format('YYYY-MM-DD') : '' }}
      </template>
      <template slot-scope="{ row }" slot="payable">
        {{ row.payable ? formatMoney(row.payable, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="orderPayable">
        {{ row.orderPayable ? formatMoney(row.orderPayable, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="otherPayable">
        {{ row.otherPayable ? formatMoney(row.otherPayable, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="totalPayable">
        {{ row.totalPayable ? formatMoney(row.totalPayable, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="orderAmount">
        {{ row.orderAmount ? formatMoney(row.orderAmount, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="otherAmount">
        {{ row.otherAmount ? formatMoney(row.otherAmount, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="totalAmount">
        {{ row.totalAmount ? formatMoney(row.totalAmount, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="payableBalance">
        {{ row.payableBalance ? formatMoney(row.payableBalance, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="orderBalance">
        {{ row.orderBalance ? formatMoney(row.orderBalance, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="otherBalance">
        {{ row.otherBalance ? formatMoney(row.otherBalance, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="balance">
        {{ row.balance ? formatMoney(row.balance, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="balance">
        {{ row.balance ? formatMoney(row.balance, '', 2) : '' }}
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
      <template slot-scope="{ row }" slot="supplierCode">
        {{ supplierList.find(f => f._id === row.supplierId) && supplierList.find(f => f._id === row.supplierId).code }}
      </template>
      <template slot-scope="{ row }" slot="departmentCode">
        {{ departmentList.find(f => f._id === row.departmentId) && departmentList.find(f => f._id === row.departmentId).code }}
      </template>
      <template slot-scope="{ row }" slot="clerkCode">
        {{ clerkList.find(f => f._id === row.clerkId) && clerkList.find(f => f._id === row.clerkId).code }}
      </template>
      <template slot-scope="{ row }" slot="des">
        {{ (row.orderType !== '小计' && row.orderType !== '期初余额' && row.orderType !== '合计') ? row.des : ''}}
      </template>
      <template slot-scope="{ row }" slot="code">
        <router-link v-if="row.orderType !== '小计' && row.orderType !== '期初余额' && row.orderType !== '合计'" :to="{
          name: row.routerName,
          query: { id: row._id }
        }">{{ row.code }}</router-link>
      </template>
      <template slot-scope="{ row }" slot="orderType">
        {{ row.orderType }}
      </template>
    </Table>

    <printModal
      ref="printModal"
      :printList="tableData"
      :printType="'payableReportDetail'"
      :supplierList="supplierList"
      :departmentList="departmentList"
      :clerkList="clerkList"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { querySupplier } from '../../api/supplier'
import { queryClerk } from '../../api/clerk'
import { queryDepartment } from '../../api/department'
import { queryAllPayableReport } from '../../api/payableReport'
import { formatMoney } from 'accounting'
import moment from 'moment'
import printModal from '../../components/print/index'
export default {
  name: 'payableReportDetail',
  components: {
    printModal
  },
  data () {
    return {
      isExpend: true,
      search: {
        accountSetId: null,
        time: [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')],
        supplierId: null,
        clerkId: null,
        departmentId: null,
        audit: false,
        isOther: true
      },
      columns: [
        {
          title: '供应商编号',
          slot: 'supplierCode',
          width: 150,
          resizable: true
        },
        {
          title: '供应商名称',
          slot: 'supplierId',
          width: 150,
          resizable: true
        },
        {
          title: '日期',
          slot: 'dateTime',
          width: 150,
          resizable: true
        },
        {
          title: '单据类型',
          slot: 'orderType',
          width: 150,
          resizable: true
        },
        {
          title: '单据编号',
          slot: 'code',
          width: 200,
          resizable: true
        },
        {
          title: '备注',
          slot: 'des',
          width: 150,
          resizable: true
        },
        {
          title: '预付',
          align: 'right',
          children: [
            {
              title: '预付金额',
              slot: 'payable',
              width: 150,
              resizable: true,
              align: 'right'
            }
          ]
        },
        {
          title: '应付',
          align: 'center',
          children: [
            {
              title: '销售应付金额',
              slot: 'orderPayable',
              width: 150,
              resizable: true,
              align: 'right'
            },
            {
              title: '其他应付金额',
              slot: 'otherPayable',
              width: 150,
              resizable: true,
              align: 'right'
            },
            {
              title: '应付合计金额',
              slot: 'totalPayable',
              width: 150,
              resizable: true,
              align: 'right'
            }
          ]
        },
        {
          title: '付款',
          align: 'center',
          children: [
            {
              title: '付销售款金额',
              slot: 'orderAmount',
              width: 150,
              resizable: true,
              align: 'right'
            },
            {
              title: '付其他应付款金额',
              slot: 'otherAmount',
              width: 150,
              resizable: true,
              align: 'right'
            },
            {
              title: '付款合计金额',
              slot: 'totalAmount',
              width: 150,
              resizable: true,
              align: 'right'
            }
          ]
        },
        {
          title: '余额',
          align: 'center',
          children: [
            {
              title: '预付余额',
              slot: 'payableBalance',
              width: 150,
              resizable: true,
              align: 'right'
            },
            {
              title: '销售应付余额',
              slot: 'orderBalance',
              width: 150,
              resizable: true,
              align: 'right'
            },
            {
              title: '其他应付余额',
              slot: 'otherBalance',
              width: 150,
              resizable: true,
              align: 'right'
            },
            {
              title: '余额',
              slot: 'balance',
              width: 150,
              resizable: true,
              align: 'right'
            }
          ]
        },
        {
          title: '部门编号',
          slot: 'departmentCode',
          width: 150,
          resizable: true
        },
        {
          title: '部门',
          slot: 'departmentId',
          width: 150,
          resizable: true
        },
        {
          title: '业务员编号',
          slot: 'clerkCode',
          width: 150,
          resizable: true
        },
        {
          title: '业务员',
          slot: 'clerkId',
          width: 150,
          resizable: true
        }
      ],
      supplierList: [],
      departmentList: [],
      clerkList: [],
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myUser',
      'myPermission'
    ]),
    getTableWidth () {
      return window.innerWidth - 100
    },
    getTableHeight () {
      return window.innerHeight - (this.isExpend ? 380 : 180)
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadSupplier()
          this.loadClerk()
          this.loadDepartment()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    formatMoney,
    resetSearch () {
      this.search = {
        accountSetId: null,
        time: [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')],
        supplierId: null,
        clerkId: null,
        departmentId: null,
        audit: '已审核',
        isOther: true
      }
    },
    load () {
      let obj = JSON.parse(JSON.stringify(this.search))
      obj.accountSetId = this.accountSet._id
      obj.time[0] = moment(obj.time[0]).format('YYYY-MM-DD') + ' 00:00:00.000'
      obj.time[1] = moment(obj.time[1]).format('YYYY-MM-DD') + ' 23:59:59.999'
      obj.audit = obj.audit ? null : '已审核'
      for (let key in obj) {
        if (!obj[key]) delete obj[key]
      }
      queryAllPayableReport(obj).then(res => {
        this.tableData = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '应付明细表',
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
    }
  }
}
</script>

<style scoped>

</style>
