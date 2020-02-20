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
          <FormItem label="汇总依据" style="margin: 0 30px 0 0;">
            <Select v-model="search.summary" style="width:200px">
              <Option v-for="(item, i) in ['客户', '商品类别', '仓库', '商品']" :value="item" :key="i">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="客户" style="margin: 0 30px 0 0;">
            <Select v-model="search.customerId" style="width:200px">
              <Option v-for="item in customerList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
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
          <FormItem label="单据编号" style="margin: 0 30px 0 0;">
            <Input v-model="search.code" style="width: 200px" />
          </FormItem>
        </Row>

        <Row type="flex" style="margin-bottom: 10px;">
          <FormItem label="单据类型" style="margin: 0 30px 0 0;">
            <Select v-model="search.type" style="width:200px">
              <Option v-for="(item, i) in ['全部', '销售出库', '销售退货']" :value="item" :key="i">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="审核状态" style="margin: 0 30px 0 0;">
            <Select v-model="search.audit" style="width:200px">
              <Option v-for="(item, i) in ['全部', '已审核', '未审核']" :value="item" :key="i">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="商品" style="margin: 0 30px 0 0;">
            <div @click="addCommodity(true)">
              <Input :value="search.commodity.map(v => v.name).join('、')" readonly style="width: 200px" />
            </div>
          </FormItem>
          <FormItem label="仓库" style="margin: 0 30px 0 0;">
            <Select v-model="search.warehouseId" style="width:200px">
              <Option v-for="item in warehouseList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="商品类别" style="margin: 0 30px 0 0;">
            <Select v-model="search.groupId" style="width:200px">
              <Option v-for="item in commodityGroup" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="商品行备注" style="margin: 0 30px 0 0;">
            <Input v-model="search.des" style="width: 200px" />
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
      :printType="'salesReportRanking'"
    />
    <commodityModal ref="commodityModal" @addCommodity="addCommodity" :isOne="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryCustomer } from '../../api/customer'
import { queryClerk } from '../../api/clerk'
import { queryDepartment } from '../../api/department'
import { rankingSalesReport } from '../../api/salesReport'
import { queryWarehouse } from '../../api/warehouse'
import { queryCommodityInfoGroup } from '../../api/commodityInfo'
import { formatMoney } from 'accounting'
import moment from 'moment'
import NP from 'number-precision'
import printModal from '../../components/print/index'
import commodityModal from '../../components/commodity/index'
export default {
  name: 'salesReportRanking',
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
        customerId: null,
        clerkId: null,
        departmentId: null,
        commodity: [],
        audit: '全部',
        code: null,
        type: '全部',
        warehouseId: null,
        des: null,
        groupId: null,
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
          title: '销售数量',
          width: 200,
          key: 'number',
          resizable: true
        },
        {
          title: '折扣（折）',
          width: 200,
          key: 'discount',
          resizable: true
        },
        {
          title: '价税合计',
          width: 200,
          key: 'payableTotal',
          resizable: true
        },
        {
          title: '销售占比（%）',
          width: 200,
          key: 'salesAccounted',
          resizable: true
        },
        {
          title: '累计占比（%）',
          width: 200,
          key: 'accounted',
          resizable: true
        },
        {
          title: ' '
        }
      ],
      customerList: [],
      departmentList: [],
      clerkList: [],
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
      return window.innerHeight - (this.isExpend ? 440 : 225)
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadCustomer()
          this.loadClerk()
          this.loadDepartment()
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
        customerId: null,
        clerkId: null,
        departmentId: null,
        name: null,
        audit: '全部',
        code: null,
        type: '全部',
        warehouseId: null,
        des: null,
        groupId: null,
        summary: '客户'
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
      if (search.customerId) obj.customerId = search.customerId
      if (search.clerkId) obj.clerkId = search.clerkId
      if (search.departmentId) obj.departmentId = search.departmentId
      if (search.audit !== '全部') obj.audit = search.audit
      if (search.code) obj.code = { $regex: search.code }

      let listObj = {}
      if (search.commodity && search.commodity.length) listObj.commodityId = { $in: search.commodity.map(v => v._id) }
      if (search.warehouseId) listObj.warehouseId = search.warehouseId
      if (search.groupId) listObj.groupId = search.groupId
      if (search.des) listObj.des = { $regex: search.des }
      if (Object.keys(listObj).length) obj.list = { $elemMatch: listObj }
      this.loading = true

      rankingSalesReport(obj).then(res => {
        this.loading = false
        let list = []
        let total = 0
        res.data.forEach(f => {
          let fData = null
          let add = (obj) => {
            let index = list.findIndex(fi => fi.code === obj.code && fi.name === obj.name)
            if (index > -1) {
              list[index].number = NP.plus(list[index].number, obj.number)
              list[index].discount = this.formatMoney(NP.plus(list[index].discount, obj.discount), '', 2)
              list[index].payableTotal = this.formatMoney(NP.plus(list[index].payableTotal, obj.payableTotal), '', 2)
            } else {
              list.push(obj)
            }
          }
          let discount = NP.times(f.discount || 0, f.list.length)
          f.list.forEach(fl => {
            total = NP.plus(total, fl.payableTotal)
            let number = NP.times(f.orderType === '销售退货单' ? fl.reStorage : fl.inStorage || 0, fl.unitList.find(v => v.name === fl.unit).equation || 1)
            let obj = {
              unit: fl.unitList[0].name,
              number: number,
              discount: this.formatMoney(discount, '', 2),
              payableTotal: this.formatMoney(fl.payableTotal, '', 2),
              salesAccounted: null,
              accounted: null
            }
            switch (this.search.summary) {
              case '客户':
                fData = this.customerList.find(v => v._id === f.customerId)
                break
              case '商品类别' :
                fData = this.commodityGroup.find(v => v._id === fl.groupId)
                break
              case '仓库' :
                fData = this.warehouseList.find(v => v._id === fl.warehouseId)
                add(Object.assign({
                  code: fData.code,
                  name: fData.name
                }, obj))
                break
            }
            if (fData) {
              add(Object.assign({
                code: fData.code,
                name: fData.name
              }, obj))
            } else {
              add(Object.assign({
                code: fl.code,
                name: fl.name
              }, obj))
            }
          })
        })
        if (this.search.summary === '商品') {
          if (this.columns[2].title !== '基本单位') {
            this.columns.splice(2, 0, {
              title: '销售数量',
              width: 200,
              key: 'number',
              resizable: true
            })
            this.columns.splice(2, 0, {
              title: '基本单位',
              width: 200,
              key: 'unit',
              resizable: true
            })
          }
        } else {
          if (this.columns[2].title === '基本单位') {
            this.columns.splice(2, 2)
          }
        }
        switch (this.search.summary) {
          case '客户':
            this.$set(this.columns[0], 'title', '客户编号')
            this.$set(this.columns[1], 'title', '客户名称')
            break
          case '商品类别' :
            this.$set(this.columns[0], 'title', '商品类别编号')
            this.$set(this.columns[1], 'title', '商品类别名称')
            break
          case '仓库' :
            this.$set(this.columns[0], 'title', '仓库编号')
            this.$set(this.columns[0], 'title', '仓库名称')
            break
          case '商品' :
            this.$set(this.columns[0], 'title', '商品编号')
            this.$set(this.columns[1], 'title', '商品名称')
            break
        }
        let accounted = 0
        list.forEach(f => {
          f.salesAccounted = NP.times(NP.divide(f.payableTotal, total), 100)
          accounted = NP.plus(accounted, f.salesAccounted)
          f.accounted = accounted
        })
        this.tableData = list.sort((a, b) => {
          if (a.number > b.number) {
            return -1
          } else if (a.number < b.number) {
            return 1
          } else {
            return 0
          }
        })
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '销售汇总表',
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
        if (key === 'salesAccounted' || key === 'accounted') {
          sums[key] = {
            key,
            value: 100
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
