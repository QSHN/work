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
            <DatePicker type="daterange" split-panels v-model="search.times" style="width: 200px" :clearable="false"></DatePicker>
          </FormItem>
          <FormItem label="汇总依据" style="margin: 0 30px 0 0;">
            <Select v-model="search.summary" style="width:200px">
              <Option v-for="(item, i) in ['商品', '商品类别', '仓库']" :value="item" :key="i">{{ item }}</Option>
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
          <FormItem label="审核状态" style="margin: 0 30px 0 0;">
            <Select v-model="search.audit" style="width:200px">
              <Option v-for="(item, i) in ['全部', '已审核', '未审核']" :value="item" :key="i">{{ item }}</Option>
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
      :printType="'warehouseReportSummary'"
    />
    <commodityModal ref="commodityModal" @addCommodity="addCommodity" :isOne="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { summaryWarehouseReport } from '../../api/warehouseReport'
import { queryWarehouse } from '../../api/warehouse'
import { queryCommodityInfoGroup } from '../../api/commodityInfo'
import { formatMoney } from 'accounting'
import moment from 'moment'
import NP from 'number-precision'
import printModal from '../../components/print/index'
import commodityModal from '../../components/commodity/index'
export default {
  name: 'warehouseReportSummary',
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
        times: [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')],
        commodity: [],
        audit: '全部',
        warehouseId: null,
        summary: '商品'
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
          title: '基本单位',
          width: 200,
          key: 'unit',
          resizable: true
        },
        {
          title: '采购入库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 200,
              key: 'pwNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 200,
              key: 'pwTotal',
              resizable: true
            }
          ]
        },
        {
          title: '销售退货',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 200,
              key: 'srNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 200,
              key: 'srTotal',
              resizable: true
            }
          ]
        },
        {
          title: '盘盈',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 200,
              key: 'ddNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 200,
              key: 'ddTotal',
              resizable: true
            }
          ]
        },
        {
          title: '调拨入库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 200,
              key: 'aiNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 200,
              key: 'aiTotal',
              resizable: true
            }
          ]
        },
        {
          title: '其他入库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 200,
              key: 'iiNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 200,
              key: 'iiTotal',
              resizable: true
            }
          ]
        },
        {
          title: '入库合计',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 200,
              key: 'iNumber',
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
          title: '采购退货',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 200,
              key: 'prNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 200,
              key: 'prTotal',
              resizable: true
            }
          ]
        },
        {
          title: '销售出库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 200,
              key: 'swNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 200,
              key: 'swTotal',
              resizable: true
            }
          ]
        },
        {
          title: '盘亏',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 200,
              key: 'dsNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 200,
              key: 'dsTotal',
              resizable: true
            }
          ]
        },
        {
          title: '调拨出库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 200,
              key: 'aoNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 200,
              key: 'aoTotal',
              resizable: true
            }
          ]
        },
        {
          title: '其他出库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 200,
              key: 'ooNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 200,
              key: 'ooTotal',
              resizable: true
            }
          ]
        },
        {
          title: '出库合计',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 200,
              key: 'oNumber',
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
        times: [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')],
        name: null,
        audit: '全部',
        warehouseId: null,
        summary: '商品'
      }
    },
    load () {
      let search = this.search
      let obj = {
        accountSetId: this.accountSet._id,
        dateTime: {
          $gte: moment(search.times[0]).format('YYYY-MM-DD') + ' 00:00:00.000',
          $lte: moment(search.times[1]).format('YYYY-MM-DD') + ' 23:59:59.999'
        }
      }
      if (search.audit !== '全部') obj.audit = search.audit

      let listObj = {}
      if (search.commodity && search.commodity.length) listObj.commodityId = { $in: search.commodity.map(v => v._id) }
      if (search.warehouseId) listObj.warehouseId = search.warehouseId
      if (Object.keys(listObj).length) obj.list = { $elemMatch: listObj }
      this.loading = true
      summaryWarehouseReport(obj).then(res => {
        this.loading = false
        let list = []
        res.data.forEach(f => {
          let summaryCode = null
          let summaryName = null
          if (this.search.summary === '商品类别') {
            summaryCode = this.commodityGroup.find(v => v._id === f.groupId).code
            summaryName = this.commodityGroup.find(v => v._id === f.groupId).name
          } else if (this.search.summary === '仓库') {
            summaryCode = this.warehouseList.find(v => v._id === f.warehouseId).code
            summaryName = this.warehouseList.find(v => v._id === f.warehouseId).name
          }
          let index = list.findIndex(fi => fi.code === f.code && fi.name === f.name && fi.summaryCode === summaryCode && fi.summaryName === summaryName)
          let obj = {
            summaryCode,
            summaryName,
            code: f.code,
            name: f.name,
            unit: f.unitDefault,
            pwNumber: f.orderType === '采购入库' ? NP.times(f.number || 0, f.equation) : null,
            pwTotal: f.orderType === '采购入库' ? this.formatMoney(f.total, '', 2) : null,
            srNumber: f.orderType === '销售退货' ? NP.times(f.number || 0, f.equation) : null,
            srTotal: f.orderType === '销售退货' ? this.formatMoney(f.total, '', 2) : null,
            ddNumber: f.orderType === '盘亏单' ? NP.times(f.number || 0, f.equation) : null,
            ddTotal: f.orderType === '盘亏单' ? this.formatMoney(f.total, '', 2) : null,
            aiNumber: f.orderType === '调拨入库' ? NP.times(f.number || 0, f.equation) : null,
            aiTotal: f.orderType === '调拨入库' ? this.formatMoney(f.total, '', 2) : null,
            iiNumber: f.orderType === '其他入库' ? NP.times(f.number || 0, f.equation) : null,
            iiTotal: f.orderType === '其他入库' ? this.formatMoney(f.total, '', 2) : null,
            iNumber: 0,
            iTotal: 0,
            prNumber: f.orderType === '采购退货' ? NP.times(f.number || 0, f.equation) : null,
            prTotal: f.orderType === '采购退货' ? this.formatMoney(f.total, '', 2) : null,
            swNumber: f.orderType === '销售出库' ? NP.times(f.number || 0, f.equation) : null,
            swTotal: f.orderType === '销售出库' ? this.formatMoney(f.total, '', 2) : null,
            dsNumber: f.orderType === '盘盈单' ? NP.times(f.number || 0, f.equation) : null,
            dsTotal: f.orderType === '盘盈单' ? this.formatMoney(f.total, '', 2) : null,
            aoNumber: f.orderType === '调拨出库' ? NP.times(f.number || 0, f.equation) : null,
            aoTotal: f.orderType === '调拨出库' ? this.formatMoney(f.total, '', 2) : null,
            ooNumber: f.orderType === '其他出库' ? NP.times(f.number || 0, f.equation) : null,
            ooTotal: f.orderType === '其他出库' ? this.formatMoney(f.total, '', 2) : null,
            oNumber: 0,
            oTotal: 0
          }

          if (index > -1) {
            obj.pwNumber = NP.plus(obj.pwNumber || 0, list[index].pwNumber || 0) || null
            obj.pwTotal = NP.plus(obj.pwTotal || 0, list[index].pwTotal || 0) || null
            obj.srNumber = NP.plus(obj.srNumber || 0, list[index].srNumber || 0) || null
            obj.srTotal = NP.plus(obj.srTotal || 0, list[index].srTotal || 0) || null
            obj.ddNumber = NP.plus(obj.ddNumber || 0, list[index].ddNumber || 0) || null
            obj.ddTotal = NP.plus(obj.ddTotal || 0, list[index].ddTotal || 0) || null
            obj.aiNumber = NP.plus(obj.aiNumber || 0, list[index].aiNumber || 0) || null
            obj.aiTotal = NP.plus(obj.aiTotal || 0, list[index].aiTotal || 0) || null
            obj.iiNumber = NP.plus(obj.iiNumber || 0, list[index].iiNumber || 0) || null
            obj.iiTotal = NP.plus(obj.iiTotal || 0, list[index].iiTotal || 0) || null

            obj.prNumber = NP.plus(obj.prNumber || 0, list[index].prNumber || 0) || null
            obj.prTotal = NP.plus(obj.prTotal || 0, list[index].prTotal || 0) || null
            obj.swNumber = NP.plus(obj.swNumber || 0, list[index].swNumber || 0) || null
            obj.swTotal = NP.plus(obj.swTotal || 0, list[index].swTotal || 0) || null
            obj.dsNumber = NP.plus(obj.dsNumber || 0, list[index].dsNumber || 0) || null
            obj.dsTotal = NP.plus(obj.dsTotal || 0, list[index].dsTotal || 0) || null
            obj.aoNumber = NP.plus(obj.aoNumber || 0, list[index].aoNumber || 0) || null
            obj.aoTotal = NP.plus(obj.aoTotal || 0, list[index].aoTotal || 0) || null
            obj.ooNumber = NP.plus(obj.ooNumber || 0, list[index].ooNumber || 0) || null
            obj.ooTotal = NP.plus(obj.ooTotal || 0, list[index].ooTotal || 0) || null

            obj.iNumber = NP.plus(NP.plus(NP.plus(NP.plus(obj.pwNumber || 0, obj.srNumber || 0), obj.ddNumber || 0), obj.aiNumber || 0), obj.iiNumber || 0) || null
            obj.iTotal = NP.plus(NP.plus(NP.plus(NP.plus(obj.pwTotal || 0, obj.srTotal || 0), obj.ddTotal || 0), obj.aiTotal || 0), obj.iiTotal || 0) || null
            obj.oNumber = NP.plus(NP.plus(NP.plus(NP.plus(obj.prNumber || 0, obj.swNumber || 0), obj.dsNumber || 0), obj.aoNumber || 0), obj.ooNumber || 0) || null
            obj.oTotal = NP.plus(NP.plus(NP.plus(NP.plus(obj.prTotal || 0, obj.swTotal || 0), obj.dsTotal || 0), obj.aoTotal || 0), obj.ooTotal || 0) || null

            for (let key in obj) {
              if (key.includes('Total')) {
                if (obj[key]) obj[key] = this.formatMoney(obj[key], '', 2)
              }
            }
            list[index] = obj
          } else {
            obj.iNumber = NP.plus(NP.plus(NP.plus(NP.plus(obj.pwNumber || 0, obj.srNumber || 0), obj.ddNumber || 0), obj.aiNumber || 0), obj.iiNumber || 0) || null
            obj.iTotal = NP.plus(NP.plus(NP.plus(NP.plus(obj.pwTotal || 0, obj.srTotal || 0), obj.ddTotal || 0), obj.aiTotal || 0), obj.iiTotal || 0) || null
            obj.oNumber = NP.plus(NP.plus(NP.plus(NP.plus(obj.prNumber || 0, obj.swNumber || 0), obj.dsNumber || 0), obj.aoNumber || 0), obj.ooNumber || 0) || null
            obj.oTotal = NP.plus(NP.plus(NP.plus(NP.plus(obj.prTotal || 0, obj.swTotal || 0), obj.dsTotal || 0), obj.aoTotal || 0), obj.ooTotal || 0) || null
            for (let key in obj) {
              if (key.includes('Total')) {
                if (obj[key]) obj[key] = this.formatMoney(obj[key], '', 2)
              }
            }
            list.push(obj)
          }
        })
        switch (this.search.summary) {
          case '商品' :
            if (this.columns[0].title !== '商品编号') {
              this.columns.splice(0, 2)
            }
            break
          case '商品类别' :
            if (this.columns[0].title !== '商品编号') {
              this.$set(this.columns[0], 'title', '商品类别编号')
              this.$set(this.columns[1], 'title', '商品类别名称')
            } else {
              this.columns.unshift({
                title: '商品类别名称',
                width: 200,
                key: 'summaryName',
                resizable: true
              })
              this.columns.unshift({
                title: '商品类别编号',
                width: 200,
                key: 'summaryCode',
                resizable: true
              })
            }
            break
          case '仓库' :
            if (this.columns[0].title !== '商品编号') {
              this.$set(this.columns[0], 'title', '仓库编号')
              this.$set(this.columns[1], 'title', '仓库名称')
            } else {
              this.columns.unshift({
                title: '仓库名称',
                width: 200,
                key: 'summaryName',
                resizable: true
              })
              this.columns.unshift({
                title: '仓库编号',
                width: 200,
                key: 'summaryCode',
                resizable: true
              })
            }
            break
        }
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
          key !== 'code'
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
            value: v !== 0 ? key.includes('Number') ? v : this.formatMoney(v, '', 2) : null
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
