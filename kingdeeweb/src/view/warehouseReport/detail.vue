<template>
  <div>
    <Row type="flex" justify="space-between">
      <Button style="width: 80px;" @click="isExpend = !isExpend">{{ isExpend ? '收起' : '展开' }}筛选</Button>
      <Row>
        <Button type="primary" style="width: 80px; margin-left: 10px;" @click="load">查询</Button>
        <Button style="width: 80px; margin-left: 10px;">导出</Button>
        <Button type="default" style="width: 80px; margin-left: 10px;">列设置</Button>
        <Button @click="$refs.printModal.show()" style="width: 80px; margin-left: 10px;">打印</Button>
      </Row>
    </Row>

    <Card style="margin-top: 10px;" v-if="isExpend">
      <Form label-position="top">
        <Row type="flex" style="margin-bottom: 10px;">
          <FormItem label="日期" style="margin: 0 30px 0 0;">
            <DatePicker type="daterange" split-panels v-model="search.time" style="width: 200px" :clearable="false"></DatePicker>
          </FormItem>
          <FormItem label="仓库" style="margin: 0 30px 0 0;">
            <Select v-model="search.warehouseId" style="width:200px">
              <Option v-for="item in warehouseList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="商品" style="margin: 0 30px 0 0;">
            <div @click="addCommodity(true)">
              <Input :value="search.commodity.map(v => v.name).join('、')" readonly style="width: 200px" />
            </div>
          </FormItem>
          <FormItem label="审核状态" style="margin: 0 30px 0 0;">
            <Select v-model="search.audit" style="width:200px">
              <Option v-for="(item, i) in ['全部', '已审核', '未审核']" :value="item" :key="i">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="商品类别" style="margin: 0 30px 0 0;">
            <Select v-model="search.groupId" style="width:200px">
              <Option v-for="item in commodityGroup" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
        </Row>

        <Row type="flex" style="margin-bottom: 10px;">
          <FormItem label="单据类型" style="margin: 0 30px 0 0;">
            <Select multiple v-model="search.type" style="width:500px">
              <Option v-for="(item, i) in [
              '采购入库', '采购退货', '销售入库', '销售退货', '其他入库', '其他出库', '调拨出库', '调拨入库', '盘盈单', '盘亏单', '移仓单'
              ]" :value="item" :key="i">{{ item }}</Option>
            </Select>
          </FormItem>
        </Row>

        <Row type="flex" style="margin-top: 20px;">
          <Button style="width: 80px; margin-right: 10px;" @click="resetSearch">重置</Button>
        </Row>
      </Form>
    </Card>

    <Table
      :width="getTableWidth"
      :height="getTableHeight"
      border
      :columns="columns"
      :data="tableData"
      :loading="loading"
      show-summary
      :summary-method="handleSummary"
      style="margin-top: 10px;">
      <template slot-scope="{ row }" slot="orderCode">
        <router-link :to="{
          name: row.routerName,
          query: { id: row.orderId }
        }">{{ row.orderCode }}</router-link>
      </template>
    </Table>

    <printModal
      ref="printModal"
      :printList="tableData"
      :printType="'warehouseReportDetail'"
    />
    <commodityModal ref="commodityModal" @addCommodity="addCommodity" :isOne="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { detailWarehouseReport } from '../../api/warehouseReport'
import { queryWarehouse } from '../../api/warehouse'
import { queryCommodityInfoGroup } from '../../api/commodityInfo'
import { formatMoney } from 'accounting'
import moment from 'moment'
import NP from 'number-precision'
import printModal from '../../components/print/index'
import commodityModal from '../../components/commodity/index'
export default {
  name: 'warehouseReportDetail',
  components: {
    printModal,
    commodityModal
  },
  data () {
    return {
      isExpend: true,
      loading: false,
      search: {
        accountSetId: null,
        time: [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')],
        commodity: [],
        audit: '全部',
        type: [],
        warehouseId: null,
        groupId: null
      },
      columns: [
        {
          title: '商品编号',
          width: 200,
          resizable: true,
          key: 'code'
        },
        {
          title: '商品名称',
          width: 200,
          key: 'name',
          resizable: true
        },
        {
          title: '单据类型',
          width: 200,
          key: 'orderType',
          resizable: true
        },
        {
          title: '单据编号',
          width: 200,
          slot: 'orderCode',
          resizable: true
        },
        {
          title: '单据日期',
          width: 200,
          key: 'dateTime',
          resizable: true
        },
        {
          title: '审批状态',
          width: 200,
          key: 'audit',
          resizable: true
        },
        {
          title: '仓库',
          width: 200,
          key: 'warehouse',
          resizable: true
        },
        {
          title: '入库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '基本单位',
              width: 200,
              key: 'iUnitD',
              resizable: true
            },
            {
              title: '基本单位数量',
              width: 200,
              key: 'iNumberD',
              resizable: true
            },
            {
              title: '单位',
              width: 200,
              key: 'iUnit',
              resizable: true
            },
            {
              title: '数量',
              width: 200,
              key: 'iNumber',
              resizable: true
            },
            {
              title: '单位成本',
              width: 200,
              key: 'iPrice',
              resizable: true
            },
            {
              title: '成本',
              width: 200,
              key: 'iTotal',
              resizable: true
            }
          ]
        },
        {
          title: '出库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '基本单位',
              width: 200,
              key: 'oUnitD',
              resizable: true
            },
            {
              title: '基本单位数量',
              width: 200,
              key: 'oNumberD',
              resizable: true
            },
            {
              title: '单位',
              width: 200,
              key: 'oUnit',
              resizable: true
            },
            {
              title: '数量',
              width: 200,
              key: 'oNumber',
              resizable: true
            },
            {
              title: '单位成本',
              width: 200,
              key: 'oPrice',
              resizable: true
            },
            {
              title: '成本',
              width: 200,
              key: 'oTotal',
              resizable: true
            }
          ]
        },
        {
          title: ' '
        }
      ],
      tableData: [],
      warehouseList: [],
      commodityGroup: []
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
      return window.innerHeight - (this.isExpend ? 440 : 220)
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadWarehouse()
          this.loadCommodityGroup()
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
        name: null,
        audit: '全部',
        type: [],
        warehouseId: null,
        groupId: null
      }
    },
    load () {
      let search = this.search
      let obj = {
        accountSetId: this.accountSet._id,
        dateTime: {
          $gte: moment(search.time[0]).format('YYYY-MM-DD') + ' 00:00:00.000',
          $lte: moment(search.time[1]).format('YYYY-MM-DD') + ' 23:59:59.999'
        },
        type: search.type
      }
      if (search.audit !== '全部') obj.audit = search.audit

      let listObj = {}
      if (search.commodity && search.commodity.length) listObj.commodityId = { $in: search.commodity.map(v => v._id) }
      if (search.warehouseId) listObj.warehouseId = search.warehouseId
      if (search.groupId) listObj.groupId = search.groupId
      if (Object.keys(listObj).length) obj.list = { $elemMatch: listObj }
      this.loading = true
      detailWarehouseReport(obj).then(res => {
        this.loading = false
        let list = []
        res.data.forEach(f => {
          list.push({
            code: f.code,
            name: f.name,
            orderCode: f.orderCode,
            dateTime: this.moment(f.dateTime).format('YYYY-MM-DD'),
            audit: f.audit,
            warehouse: this.warehouseList.find(v => v._id === f.warehouseId).name,
            iUnitD: f.isIN ? f.unitDefault : null,
            iNumberD: f.isIN ? NP.times(f.number, f.equation) : null,
            iUnit: f.isIN ? f.unit : null,
            iNumber: f.isIN ? f.number : null,
            iPrice: f.isIN ? f.price : null,
            iTotal: f.isIN ? f.total : null,
            oUnitD: !f.isIN ? f.unitDefault : null,
            oNumberD: !f.isIN ? NP.times(f.number, f.equation) : null,
            oUnit: !f.isIN ? f.unit : null,
            oNumber: !f.isIN ? f.number : null,
            oPrice: !f.isIN ? f.price : null,
            oTotal: !f.isIN ? f.total : null,
            routerName: f.routerName,
            orderType: f.orderType
          })
        })
        this.tableData = list
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '商品收发明细表',
          desc: err.message
        })
      })
    },
    loadWarehouse () {
      queryWarehouse({ accountSetId: this.accountSet._id }).then(res => {
        this.warehouseList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '仓库',
          desc: err.message
        })
      })
    },
    loadCommodityGroup () {
      queryCommodityInfoGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.commodityGroup = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '商品类别',
          desc: err.message
        })
      })
    },
    handleSummary ({ columns, data }) {
      const sums = {}
      columns.forEach((column, index) => {
        const key = column.key
        if (index === 1) {
          sums[key] = {
            key,
            value: '合计'
          }
          return
        }
        const values = data.map(item => item[key])
        if ((
          key !== 'code' &&
          key !== 'iUnitD' &&
          key !== 'iUnit' &&
          key !== 'oUnit' &&
          key !== 'oUnitD'
        ) && !values.every(value => isNaN(value))) {
          const v = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[key] = {
            key,
            value: key.includes('Number') ? v : this.formatMoney(v, '', 2)
          }
        } else {
          sums[key] = {
            key,
            value: ' '
          }
        }
      })
      return sums
    },
    addCommodity (bool, list = []) {
      if (bool && list.length) {
        this.search.commodity = this.search.commodity.concat(list.map(v => {
          return {
            _id: v._id,
            name: v.name
          }
        }))
      } else {
        this.$refs.commodityModal.show(bool)
      }
    }
  }
}
</script>

<style scoped>

</style>
