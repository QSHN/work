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
          <FormItem label="仓库" style="margin: 0 30px 0 0;">
            <Select v-model="search.warehouseId" style="width:200px">
              <Option v-for="item in warehouseList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
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
      :printType="'warehouseReportAvailable'"
    />
    <commodityModal ref="commodityModal" @addCommodity="addCommodity" :isOne="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { availableWarehouseReport } from '../../api/warehouseReport'
import { queryWarehouse } from '../../api/warehouse'
import { queryCommodityInfoGroup } from '../../api/commodityInfo'
import { formatMoney } from 'accounting'
import moment from 'moment'
import NP from 'number-precision'
import printModal from '../../components/print/index'
import commodityModal from '../../components/commodity/index'
export default {
  name: 'warehouseReportAvailable',
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
        commodity: [],
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
          resizable: true,
          key: 'name'
        },
        {
          title: '商品类别',
          width: 200,
          resizable: true,
          key: 'groupId'
        },
        {
          title: '辅助属性',
          width: 200,
          resizable: true,
          key: 'auxiliary'
        },
        {
          title: '仓库名称',
          width: 200,
          resizable: true,
          key: 'warehouse'
        },
        {
          title: '基本单位',
          width: 200,
          resizable: true,
          key: 'unit'
        },
        {
          title: '即时库存',
          width: 200,
          resizable: true,
          key: 'inventory'
        },
        {
          title: '可用库存',
          width: 200,
          resizable: true,
          key: 'can'
        },
        {
          title: '采购在途',
          width: 200,
          resizable: true,
          key: 'purchase'
        },
        {
          title: '调拨在途',
          width: 200,
          resizable: true,
          key: 'allocating'
        },
        {
          title: '销售占用',
          width: 200,
          resizable: true,
          key: 'sales'
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
      return window.innerHeight - (this.isExpend ? 435 : 220)
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
        name: null,
        warehouseId: null,
        groupId: null
      }
    },
    load () {
      let search = this.search
      let obj = {
        accountSetId: this.accountSet._id
      }
      let listObj = {}
      if (search.commodity && search.commodity.length) listObj.commodityId = { $in: search.commodity.map(v => v._id) }
      if (search.warehouseId) listObj.warehouseId = search.warehouseId
      if (search.groupId) listObj.groupId = search.groupId
      if (Object.keys(listObj).length) obj.list = { $elemMatch: listObj }
      this.loading = true
      availableWarehouseReport(obj).then(res => {
        this.loading = false
        let { wList, wAOList, sList, pList, cList } = res.data
        let list = []
        wList.forEach(f => {
          f.inventoryList.forEach(fl => {
            let commodity = cList.find(fc => fc._id === fl.commodityId)
            list.push({
              commodityId: fl.commodityId,
              code: commodity.code,
              name: commodity.name,
              groupId: this.commodityGroup.find(f => f._id === commodity.groupId).name,
              auxiliary: fl.auxiliary,
              warehouse: f.name,
              warehouseId: f._id,
              unit: commodity.unit,
              inventory: fl.inventory || 0,
              can: fl.inventory || 0,
              allocating: 0,
              purchase: 0,
              sales: 0
            })
          })
        })
        wAOList.forEach(f => {
          f.list.forEach(fl => {
            let fIndex = list.findIndex(v => fl.warehouseIdIn === v.warehouseId && fl.commodityId === v.commodityId && fl.auxiliary === v.auxiliary)
            let equation = fl.unitList.find(v => v.name === fl.unit).equation
            let number = NP.times(NP.minus(fl.number || 0, fl.inNumber || 0), equation || 1)
            if (fIndex > -1) {
              list[fIndex].can = NP.plus(list[fIndex].can, number)
              list[fIndex].allocating = NP.plus(list[fIndex].allocating, number)
            } else {
              list.push({
                commodityId: fl.commodityId,
                code: fl.code,
                name: fl.name,
                groupId: this.commodityGroup.find(f => f._id === fl.groupId).name,
                auxiliary: fl.auxiliary,
                warehouse: this.warehouseList.find(f => f._id === fl.warehouseId).name,
                warehouseId: fl.warehouseId,
                unit: fl.unit,
                inventory: 0,
                can: number,
                allocating: number,
                purchase: 0,
                sales: 0
              })
            }
          })
        })
        sList.forEach(f => {
          f.list.forEach(fl => {
            if (fl.warehouseId) {
              let fIndex = list.findIndex(v => fl.warehouseId === v.warehouseId && fl.commodityId === v.commodityId && fl.auxiliary === v.auxiliary)
              let equation = fl.unitList.find(v => v.name === fl.unit).equation
              let number = NP.times(!isNaN(fl.unStorage) ? fl.unStorage : fl.number || 0, equation || 1)
              if (fIndex > -1) {
                list[fIndex].sales = NP.plus(list[fIndex].sales, number)
              } else {
                list.push({
                  commodityId: fl.commodityId,
                  code: fl.code,
                  name: fl.name,
                  groupId: this.commodityGroup.find(f => f._id === fl.groupId).name,
                  auxiliary: fl.auxiliary,
                  warehouse: this.warehouseList.find(f => f._id === fl.warehouseId).name,
                  warehouseId: fl.warehouseId,
                  unit: fl.unit,
                  inventory: 0,
                  can: 0,
                  allocating: 0,
                  purchase: 0,
                  sales: number
                })
              }
            }
          })
        })
        pList.forEach(f => {
          f.list.forEach(fl => {
            if (fl.warehouseId) {
              let fIndex = list.findIndex(v => fl.warehouseId === v.warehouseId && fl.commodityId === v.commodityId && fl.auxiliary === v.auxiliary)
              let equation = fl.unitList.find(v => v.name === fl.unit).equation
              let number = NP.times(!isNaN(fl.unStorage) ? fl.unStorage : fl.number || 0, equation || 1)
              if (fIndex > -1) {
                list[fIndex].purchase = NP.plus(list[fIndex].purchase, number)
              } else {
                list.push({
                  commodityId: fl.commodityId,
                  code: fl.code,
                  name: fl.name,
                  groupId: this.commodityGroup.find(f => f._id === fl.groupId).name,
                  auxiliary: fl.auxiliary,
                  warehouse: this.warehouseList.find(f => f._id === fl.warehouseId).name,
                  warehouseId: fl.warehouseId,
                  unit: fl.unit,
                  inventory: 0,
                  can: 0,
                  allocating: 0,
                  purchase: number,
                  sales: 0
                })
              }
            }
          })
        })
        this.tableData = list
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '预计可用库存表',
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
        if ((key === 'inventory' || key === 'can') && !values.every(value => isNaN(value))) {
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
            value: v
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
