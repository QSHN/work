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
          <FormItem label="审核状态" style="margin: 0 30px 0 0;">
            <Select v-model="search.audit" style="width:200px">
              <Option v-for="(item, i) in ['全部', '已审核', '未审核']" :value="item" :key="i">{{ item }}</Option>
            </Select>
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
          <FormItem label="商品类别" style="margin: 0 30px 0 0;">
            <Select v-model="search.groupId" style="width:200px">
              <Option v-for="item in commodityGroup" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
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
    </Table>

    <printModal
      ref="printModal"
      :printList="tableData"
      :printType="'salesReportPSummary'"
    />
    <commodityModal ref="commodityModal" @addCommodity="addCommodity" :isOne="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PSummarySalesReport } from '../../api/salesReport'
import { queryWarehouse } from '../../api/warehouse'
import { queryCommodityInfoGroup } from '../../api/commodityInfo'
import { formatMoney } from 'accounting'
import moment from 'moment'
import NP from 'number-precision'
import printModal from '../../components/print/index'
import commodityModal from '../../components/commodity/index'
export default {
  name: 'salesReportPSummary',
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
        audit: '全部',
        commodity: [],
        warehouseId: null,
        groupId: null
      },
      columns: [
        {
          title: '商品编码',
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
          title: '商品类别',
          width: 200,
          key: 'groupId',
          resizable: true
        },
        {
          title: '单位',
          width: 200,
          key: 'unit',
          resizable: true
        },
        {
          title: '采购',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '采购数量',
              width: 200,
              key: 'purchaseNumber',
              resizable: true
            },
            {
              title: '采购金额',
              width: 200,
              key: 'purchaseMoney',
              resizable: true
            },
            {
              title: '退货数量',
              width: 200,
              key: 'purchaseReNumber',
              resizable: true
            },
            {
              title: '退货金额',
              width: 200,
              key: 'purchaseReMoney',
              resizable: true
            },
            {
              title: '采购费用',
              width: 200,
              key: 'purchaseExpense',
              resizable: true
            },
            {
              title: '进货均价',
              width: 200,
              key: 'purchasePrice',
              resizable: true
            }
          ]
        },
        {
          title: '销售',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '销售数量',
              width: 200,
              key: 'salesNumber',
              resizable: true
            },
            {
              title: '销售金额',
              width: 200,
              key: 'salesMoney',
              resizable: true
            },
            {
              title: '退货数量',
              width: 200,
              key: 'salesReNumber',
              resizable: true
            },
            {
              title: '退货金额',
              width: 200,
              key: 'salesReMoney',
              resizable: true
            },
            {
              title: '销售费用',
              width: 200,
              key: 'salesExpense',
              resizable: true
            },
            {
              title: '销售均价',
              width: 200,
              key: 'salesPrice',
              resizable: true
            },
            {
              title: '进销差价',
              width: 200,
              key: 'diffPrice',
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
        audit: '全部',
        name: null,
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
        }
      }
      if (search.audit !== '全部') obj.audit = search.audit

      let listObj = {}
      if (search.commodity && search.commodity.length) listObj.commodityId = { $in: search.commodity.map(v => v._id) }
      if (search.warehouseId) listObj.warehouseId = search.warehouseId
      if (search.groupId) listObj.groupId = search.groupId
      if (Object.keys(listObj).length) obj.list = { $elemMatch: listObj }
      this.loading = true
      PSummarySalesReport(obj).then(res => {
        this.loading = false
        let list = []
        res.data.forEach(f => {
          f.list.forEach(fl => {
            let index = list.findIndex(fi => fi.code === fl.code && fi.name === fl.name)
            let isP = f.orderType.includes('采购')
            let isR = f.orderType.includes('退货')
            let obj = {
              code: fl.code,
              name: fl.name,
              groupId: this.commodityGroup.find(fc => fc._id === fl.groupId).name,
              unit: fl.unit,
              purchaseNumber: isP ? isR ? 0 : fl.inStorage || 0 : 0,
              purchaseMoney: this.formatMoney(isP ? isR ? 0 : f.orderMoney || 0 : 0, '', 2),
              purchaseReNumber: isP ? isR ? fl.reStorage || 0 : 0 : 0,
              purchaseReMoney: this.formatMoney(isP ? isR ? f.orderMoney || 0 : 0 : 0, '', 2),
              purchaseExpense: this.formatMoney(isP ? isR ? 0 : f.purchaseExpense ? f.purchaseExpense.reduce((total, v) => (
                total = NP.plus(total, v.money || 0)
              ), 0) : 0 : 0, '', 2),
              purchasePrice: null,
              salesNumber: !isP ? isR ? 0 : fl.outStorage || 0 : 0,
              salesMoney: this.formatMoney(!isP ? isR ? 0 : f.orderMoney || 0 : 0, '', 2),
              salesReNumber: !isP ? isR ? fl.reStorage || 0 : 0 : 0,
              salesReMoney: this.formatMoney(!isP ? isR ? f.orderMoney || 0 : 0 : 0, '', 2),
              salesExpense: this.formatMoney(!isP ? isR ? 0 : f.salesExpense ? f.salesExpense.reduce((total, v) => (
                total = NP.plus(total, v.money || 0)
              ), 0) : 0 : 0, '', 2),
              salesPrice: null,
              diffPrice: null
            }
            if (index > -1) {
              list[index].purchaseNumber = this.formatMoney(NP.plus(list[index].purchaseNumber, obj.purchaseNumber), '', 2)
              list[index].purchaseMoney = this.formatMoney(NP.plus(list[index].purchaseMoney, obj.purchaseMoney), '', 2)
              list[index].purchaseReNumber = this.formatMoney(NP.plus(list[index].purchaseReNumber, obj.purchaseReNumber), '', 2)
              list[index].purchaseReMoney = this.formatMoney(NP.plus(list[index].purchaseReMoney, obj.purchaseReMoney), '', 2)
              list[index].purchaseExpense = this.formatMoney(NP.plus(list[index].purchaseExpense, obj.purchaseExpense), '', 2)

              list[index].salesNumber = this.formatMoney(NP.plus(list[index].salesNumber, obj.salesNumber), '', 2)
              list[index].salesMoney = this.formatMoney(NP.plus(list[index].salesMoney, obj.salesMoney), '', 2)
              list[index].salesReNumber = this.formatMoney(NP.plus(list[index].salesReNumber, obj.salesReNumber), '', 2)
              list[index].salesReMoney = this.formatMoney(NP.plus(list[index].salesReMoney, obj.salesReMoney), '', 2)
              list[index].salesExpense = this.formatMoney(NP.plus(list[index].salesExpense, obj.salesExpense), '', 2)

              list[index].purchasePrice = this.formatMoney(NP.divide(list[index].purchaseMoney, list[index].purchaseNumber || 1), '', 2)
              list[index].salesPrice = this.formatMoney(NP.divide(list[index].salesMoney, list[index].salesNumber || 1), '', 2)
              list[index].diffPrice = this.formatMoney(NP.minus(list[index].salesPrice, list[index].purchasePrice), '', 2)
            } else {
              obj.purchasePrice = this.formatMoney(NP.divide(obj.purchaseMoney, obj.purchaseNumber || 1), '', 2)
              obj.salesPrice = this.formatMoney(NP.divide(obj.salesMoney, obj.salesNumber || 1), '', 2)
              obj.diffPrice = this.formatMoney(NP.minus(obj.salesPrice, obj.purchasePrice), '', 2)
              list.push(obj)
            }
          })
        })
        this.tableData = list
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '采购销售汇总表',
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
        if ((key !== 'code') && !values.every(value => isNaN(value))) {
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
            value: this.formatMoney(v, '', 2)
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
