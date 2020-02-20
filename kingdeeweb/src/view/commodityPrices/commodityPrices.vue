<template>
  <div>
    <div style="display: flex; align-items: center; margin-bottom: 10px;">
      <Select v-model="whichSearchType" style="width: 100px; margin-right: 10px;">
        <Option v-for="(item, index) in searchList" :value="item.title" :key="index">{{ item.title }}</Option>
      </Select>
      <Input v-model="search.searchVal" :placeholder="searchList.find(f => f.title === whichSearchType).placeholder" style="width: 300px; margin-right: 20px;" />
    </div>

    <Row type="flex" style="margin-bottom: 10px;">
      <Button type="primary" style="margin-right: 10px;" @click="save">保存</Button>
      <Button style="margin-right: 10px;" @click="loadCommodityPrices">刷新</Button>
      <Button style="margin-right: 10px;" @click="loadCommodityPrices">查询</Button>
      <Button style="margin-right: 10px;" :disabled="true">批量调价</Button>
      <Button style="margin-right: 10px;" @click="calculatePurchase">反算采购价</Button>
    </Row>

    <CheckboxGroup v-model="showList" style="margin-bottom: 10px;">
      <Checkbox label="auxiliary">
        <span>展示辅助属性价格资料</span>
      </Checkbox>
      <Checkbox label="unit">
        <span>展示多单位价格资料</span>
      </Checkbox>
      <Checkbox label="inventory" :disabled="true">
        <span>展示可用库存</span>
      </Checkbox>
      <Checkbox label="purchase" :disabled="true">
        <span>展示最近采购价</span>
      </Checkbox>
    </CheckboxGroup>

    <Table :width="getTableWidth"
           :height="getTableHeight"
           border
           :columns="commodityPricesColumns"
           :data="tableInfo"
           :loading="loading"
           class="input_table"
           :span-method="handleSpan"
           @on-row-click="rowClick"
           :row-class-name="rowClassName"
           @on-selection-change="selectTable">
      <template slot-scope="{ row }" slot="pic">
        <div style="padding-top: 5px; zoom: 0.8;">
          <upload-pic v-model="row.picFiles.mainImage" :multiple="1" :disabled="true"/>
        </div>
      </template>
      <template slot-scope="{ row }" slot="action">
        <Button size="small" @click="clearVal(row)">清零</Button>
      </template>
      <template slot-scope="{ row }" slot="wholesale">
        <div class="text">{{ getVal(row, 'sales.wholesale') }}</div>
        <div class="hover_layer">
          <InputNumber :min="0" :step="0.1" :value="getVal(row, 'sales.wholesale')" @on-change="changeVal($event, row, 'sales.wholesale')"/>
        </div>
      </template>
      <template slot-scope="{ row }" slot="retail">
        <div class="text">{{ getVal(row, 'sales.retail') }}</div>
        <div class="hover_layer">
          <InputNumber :min="0" :step="0.1" :value="getVal(row, 'sales.retail')" @on-change="changeVal($event, row, 'sales.retail')"/>
        </div>
      </template>
      <template slot-scope="{ row }" slot="cost">
        <div class="text">{{ getVal(row, 'sales.cost') }}</div>
        <div class="hover_layer">
          <InputNumber :min="0" :step="0.1" :value="getVal(row, 'sales.cost')" @on-change="changeVal($event, row, 'sales.cost')"/>
        </div>
      </template>
      <template slot-scope="{ row }" slot="lowest">
        <div class="text">{{ getVal(row, 'sales.lowest') }}</div>
        <div class="hover_layer">
          <InputNumber :min="0" :step="0.1" :value="getVal(row, 'sales.lowest')" @on-change="changeVal($event, row, 'sales.lowest')"/>
        </div>
      </template>
      <template slot-scope="{ row }" slot="discount">
        <div class="text">{{ getVal(row, 'purchase.discount') }}</div>
        <div class="hover_layer">
          <InputNumber :min="0" :step="0.1" :value="getVal(row, 'purchase.discount')" @on-change="changeVal($event, row, 'purchase.discount')"/>
        </div>
      </template>
      <template slot-scope="{ row }" slot="purchasing">
        <div class="text">{{ getVal(row, 'purchase.purchasing') }}</div>
        <div class="hover_layer">
          <InputNumber :min="0" :step="0.1" :value="getVal(row, 'purchase.purchasing')" @on-change="changeVal($event, row, 'purchase.purchasing')"/>
        </div>
      </template>
      <template slot-scope="{ row }" slot="discountP">
        <div class="text">{{ getVal(row, 'purchase.discountP') }}</div>
        <div class="hover_layer">
          <InputNumber :min="0" :step="0.1" :value="getVal(row, 'purchase.discountP')" @on-change="changeVal($event, row, 'purchase.discountP')"/>
        </div>
      </template>
      <template slot-scope="{ row }" slot="highest">
        <div class="text">{{ getVal(row, 'purchase.highest') }}</div>
        <div class="hover_layer">
          <InputNumber :min="0" :step="0.1" :value="getVal(row, 'purchase.highest')" @on-change="changeVal($event, row, 'purchase.highest')"/>
        </div>
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
import UploadPic from '../../components/upload/upload-pic'
import NP from 'number-precision'
import {
  commodityPricesQuery,
  commodityPricesUpdate
} from '../../api/commodityPrices'
export default {
  name: 'index',
  components: {
    UploadPic
  },
  data () {
    return {
      currentRow: null,
      total: 0,
      pageSizeOpts: [5, 10, 20],
      whichSearchType: '快捷查询',
      searchList: [
        {
          title: '快捷查询',
          placeholder: '按名称/代码/条形码/简称/规格型号',
          formula: ['name', 'code', 'barcode', 'abbreviation', 'basicInfo.specifications']
        },
        {
          title: '商品代码',
          placeholder: '请输入商品代码',
          formula: ['code']
        },
        {
          title: '商品名称',
          placeholder: '请输入商品名称',
          formula: ['name']
        },
        {
          title: '商品条码',
          placeholder: '请输入商品条码',
          formula: ['barcode']
        },
        {
          title: '规格型号',
          placeholder: '请输入规格型号',
          formula: ['basicInfo.specifications']
        }
      ],
      search: {
        searchVal: '',
        filter: {
          accountSetId: null,
          status: '启用'
        },
        pageInfo: {
          limit: 10,
          page: 1
        }
      },
      selectList: [],
      loading: true,
      commodityPricesColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left',
          resizable: true
        },
        {
          title: '图片',
          slot: 'pic',
          width: 80,
          align: 'center',
          fixed: 'left',
          resizable: true
        },
        {
          title: '商品代码',
          key: 'code',
          width: 120,
          fixed: 'left',
          resizable: true
        },
        {
          title: '商品名称',
          key: 'name',
          width: 196,
          fixed: 'left',
          resizable: true
        },
        {
          title: '单位',
          key: 'unit',
          width: 80,
          fixed: 'left',
          resizable: true
        },
        {
          title: '销售价格资料',
          align: 'center',
          children: [
            {
              title: '批发价',
              slot: 'wholesale',
              align: 'center',
              width: 150
            },
            {
              title: '零售价',
              slot: 'retail',
              align: 'center',
              width: 150
            },
            {
              title: '配货价',
              slot: 'cost',
              align: 'center',
              width: 150
            },
            {
              title: '最低售价',
              slot: 'lowest',
              align: 'center',
              width: 150
            }
          ]
        },
        {
          title: '采购价格资料',
          align: 'center',
          children: [
            {
              title: '反算折扣(0-10折)',
              slot: 'discount',
              align: 'center',
              width: 150
            },
            {
              title: '采购单价',
              slot: 'purchasing',
              align: 'center',
              width: 150
            },
            {
              title: '采购折扣',
              slot: 'discountP',
              align: 'center',
              width: 150
            },
            {
              title: '最高进价',
              slot: 'highest',
              align: 'center',
              width: 150
            }
          ]
        },
        {
          title: '操作',
          slot: 'action',
          width: 80,
          align: 'center',
          fixed: 'right',
          resizable: true
        }
      ],
      commodityPricesList: [],
      commodityInfoList: [],
      showList: [],
      tableInfo: []
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
      return window.innerHeight - 285
    },
    getTableWidth () {
      return window.innerWidth - 100
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadCommodityPrices()
        }
      },
      immediate: true,
      deep: true
    },
    showList () {
      this.updateTableInfo()
    }
  },
  methods: {
    moment,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '商品价格资料') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}商品价格资料的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadCommodityPrices () {
      this.loading = true
      let search = JSON.parse(JSON.stringify(this.search))
      let filter = {
        accountSetId: this.accountSet._id,
        status: this.search.filter.status
      }
      if (search.searchVal) {
        let formula = this.searchList.find(f => f.title === this.whichSearchType).formula
        this.$set(filter, '$or', [])
        formula.forEach(f => {
          let obj = {}
          this.$set(obj, f, { $regex: search.searchVal })
          filter['$or'].push(obj)
        })
      }
      search.filter = filter
      delete search.searchVal
      commodityPricesQuery(search).then(res => {
        this.commodityPricesList = res.data.priceList
        this.commodityInfoList = res.data.list.map((m, i) => {
          return Object.assign({ rowIndex: i }, m)
        })
        this.updateTableInfo()
        this.total = res.data.total
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '商品',
          desc: err.message
        })
      })
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    updateTableInfo () {
      let addIndex = 4
      if (this.showList.includes('auxiliary')) {
        if (this.commodityPricesColumns[addIndex].title !== '辅助属性') {
          this.commodityPricesColumns.splice(addIndex, 0, {
            title: '辅助属性',
            key: 'auxiliary',
            width: 100,
            fixed: 'left',
            resizable: true
          })
        }
      } else {
        if (this.commodityPricesColumns[addIndex].title === '辅助属性') {
          this.commodityPricesColumns.splice(addIndex, 1)
        }
      }

      let list = []
      this.commodityInfoList.forEach((f, i) => {
        let cIndex = 0
        let addList = []
        if (this.showList.includes('auxiliary')) {
          if (f.character.auxiliary && f.character.auxiliaryData.content && f.character.auxiliaryData.content.length) {
            f.character.auxiliaryData.content.forEach(c => {
              cIndex++
              let obj = Object.assign({}, f)
              obj.auxiliary = c.auxiliary
              obj.rowIndex = i + '-' + cIndex
              addList.push(obj)
            })
          } else {
            addList.unshift(Object.assign({}, f))
          }
        }
        if (this.showList.includes('unit')) {
          if (f.measureUnit.conversion && f.measureUnit.conversion.length) {
            f.measureUnit.conversion.forEach((c, ccIndex) => {
              if (ccIndex > 0) {
                if (addList.length) {
                  addList.forEach(a => {
                    cIndex++
                    let obj = Object.assign({}, a)
                    obj.unit = c.name
                    obj.rowIndex = i + '-' + cIndex
                    addList.push(obj)
                  })
                } else {
                  cIndex++
                  let obj = Object.assign({}, f)
                  obj.unit = c.name
                  obj.rowIndex = i + '-' + cIndex
                  addList.push(obj)
                }
              } else {
                if (!addList.length) {
                  addList.unshift(Object.assign({}, f))
                }
              }
            })
          }
        }
        if (addList.length === 0) addList.unshift(Object.assign({}, f))
        list = list.concat(addList)
      })
      if (this.selectList.length) {
        list.forEach(f => {
          if (this.selectList.includes(f._id)) {
            f._checked = true
          }
        })
      }
      this.tableInfo = list
      this.updatePricesList()
    },
    updatePricesList () {
      this.tableInfo.forEach(f => {
        const auxiliary = f.auxiliary || (
          f.character.auxiliary && f.character.auxiliaryData.content && f.character.auxiliaryData.content.length
            ? f.character.auxiliaryData.content[0].auxiliary || null
            : null
        )
        let isAdd = true
        this.commodityPricesList.forEach(c => {
          if (c.commodityId === f._id) {
            isAdd = false
            let fData = c.prices.find(p => p.unit === f.unit && p.auxiliary === auxiliary)
            let copy = c.prices.find(p => p.unit === f.unit) || c.prices[0]
            if (!fData) {
              c.prices.push({
                auxiliary: auxiliary,
                unit: f.unit,
                sales: Object.assign({}, copy.sales),
                purchase: Object.assign({}, copy.purchase)
              })
            }
          }
        })
        if (isAdd) {
          this.commodityPricesList.push({
            commodityId: f._id,
            prices: [{
              auxiliary: auxiliary,
              unit: f.unit,
              sales: {
                wholesale: 0,
                retail: 0,
                cost: 0,
                lowest: 0
              },
              purchase: {
                discount: 0,
                purchasing: 0,
                discountP: 0,
                latest: 0,
                highest: 0
              }
            }]
          })
        }
      })
      // console.log(this.commodityPricesList)
    },
    getVal (row, type) {
      let val = null
      let pData = this.commodityPricesList.find(f => f.commodityId === row._id)
      const auxiliary = row.auxiliary || (
        row.character.auxiliary && row.character.auxiliaryData.content && row.character.auxiliaryData.content.length
          ? row.character.auxiliaryData.content[0].auxiliary || null
          : null
      )
      let fData = pData.prices.find(p => p.unit === row.unit && p.auxiliary === auxiliary)
      if (fData) {
        const t = type.split('.')
        val = fData[t[0]][t[1]] || null
      }
      return val
    },
    changeVal (e, row, type) {
      // console.log(e)
      const auxiliary = row.auxiliary || (
        row.character.auxiliary && row.character.auxiliaryData.content && row.character.auxiliaryData.content.length
          ? row.character.auxiliaryData.content[0].auxiliary || null
          : null
      )
      const t = type.split('.')
      this.commodityPricesList.forEach((c, i) => {
        if (c.commodityId === row._id) {
          c.prices.forEach((p, pI) => {
            if (p.unit === row.unit && p.auxiliary === auxiliary) {
              this.$set(this.commodityPricesList[i].prices[pI][t[0]], t[1], e)
            }
          })
        }
      })
    },
    clearVal (row) {
      const auxiliary = row.auxiliary || (
        row.character.auxiliary && row.character.auxiliaryData.content && row.character.auxiliaryData.content.length
          ? row.character.auxiliaryData.content[0].auxiliary || null
          : null
      )
      this.commodityPricesList.forEach((c, i) => {
        if (c.commodityId === row._id) {
          c.prices.forEach((p, pI) => {
            if (p.unit === row.unit && p.auxiliary === auxiliary) {
              this.$set(this.commodityPricesList[i].prices[pI], 'sales', {
                wholesale: 0,
                retail: 0,
                cost: 0,
                lowest: 0
              })
              this.$set(this.commodityPricesList[i].prices[pI], 'purchase', {
                discount: 0,
                purchasing: 0,
                discountP: 0,
                latest: 0,
                highest: 0
              })
            }
          })
        }
      })
    },
    handleSpan ({ row, column, rowIndex, columnIndex }) {
      // [0, 0]
      // {
      //   rowspan: 0,
      //     colspan: 0
      // }
      if (
        column.title === '图片' ||
        column.title === '商品代码' ||
        column.title === '商品名称'
      ) {
        if (rowIndex === this.tableInfo.findIndex((f, i) => f._id === row._id)) {
          let num = this.tableInfo.filter(v => v._id === row._id).length
          if (num > 1) {
            return {
              rowspan: num,
              colspan: 1
            }
          }
        } else {
          let num = this.tableInfo.filter(v => v._id === row._id).length
          if (num > 1) {
            return [0, 0]
          }
        }
      }
      if (
        column.title === '单位'
      ) {
        if (rowIndex === this.tableInfo.findIndex((f, i) => f._id === row._id && f.unit === row.unit)) {
          let num = this.tableInfo.filter(v => v._id === row._id && v.unit === row.unit).length
          if (num > 1) {
            return {
              rowspan: num,
              colspan: 1
            }
          }
        } else {
          let num = this.tableInfo.filter(v => v._id === row._id && v.unit === row.unit).length
          if (num > 1) {
            return [0, 0]
          }
        }
      }
      // console.log(row, column)
    },
    rowClassName (row, index) {
      return index === this.currentRow ? 'active' : ''
    },
    rowClick (row, index) {
      this.currentRow = index
    },
    calculatePurchase () {
      this.commodityPricesList.forEach((c, i) => {
        c.prices.forEach((p, pI) => {
          if (p.sales.wholesale && p.purchase.discount) {
            this.$set(this.commodityPricesList[i].prices[pI].purchase, 'purchasing', NP.times(p.sales.wholesale, NP.divide(p.purchase.discount, 10)))
          }
        })
      })
      this.$Message.success('计算完毕')
    },
    save () {
      if (!this.judge('修改')) return
      commodityPricesUpdate({
        accountSetId: this.accountSet._id,
        ids: this.commodityPricesList
      }).then(res => {
        this.loadCommodityPrices()
        this.$Message.success('保存完毕')
      }).catch(err => {
        this.$Notice.error({
          title: '商品价格',
          desc: err.message
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .measure_c {
    display: flex;
    flex-grow: 1;
    background: #fff;
    padding: 10px;
    overflow: hidden;
  }
</style>

<style lang="less">
  .input_table {
    .text {
      padding-left: 8px;
    }
    .hover_layer {
      display: none;
    }

    .ivu-table-row:hover,
    .ivu-table-row.active {
      .text {
        display: none;
      }
      .hover_layer {
        display: block;
      }
    }
  }
</style>
