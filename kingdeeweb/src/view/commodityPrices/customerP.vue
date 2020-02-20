<template>
  <Modal
    v-model="modal"
    title="设置客户价格策略"
    :mask-closable="false"
    width="1300"
    @on-cancel="cancel">
    <template v-if="customerData._id">
      <Row>
        <span>客户分组：</span>
        <RadioGroup v-model="whichG" type="button">
          <Radio v-for="(v, i) in customerData.useUser" :key="i" :label="v.index">{{v.name}}</Radio>
        </RadioGroup>
        <span style="margin: 0 10px 0 30px">分类：</span>
        <RadioGroup v-model="whichType" type="button">
          <Radio label="commodity">商品</Radio>
          <Radio label="category" :disabled="true">商品类别</Radio>
        </RadioGroup>
      </Row>

      <Row>
        <Button style="margin-top: 10px;" @click="addCommodity(false)">导入</Button>
        <Button style="margin-top: 10px; margin-left: 10px;" :disabled="!selectList.length">删除</Button>
      </Row>

      <Table :width="1268"
             :height="500"
             border
             :columns="columns"
             :data="customerData.prices.commodity"
             @on-selection-change="selectTable"
             class="input_table"
             @on-row-click="rowClick"
             :row-class-name="rowClassName"
             style="margin-top: 10px">
        <template slot-scope="{ row }" slot="groupId">
          {{ groupList.find(f => f._id === row.groupId) ? groupList.find(f => f._id === row.groupId).name : ''}}
        </template>

        <template slot-scope="{ row }" slot="unit">
          <div class="text">{{ row.unit || '' }}</div>
          <div class="hover_layer">
            <Button style="width: 110px; text-align: left" @click="selectUnit(row._index)">{{ row.unit || '' }}</Button>
          </div>
        </template>

        <template slot-scope="{ row }" slot="salesFrom">
          <div class="text">{{ row.salesFrom || '' }}</div>
          <div class="hover_layer">
            <InputNumber :min="0" :step="0.1" v-model="customerData.prices.commodity[row._index].salesFrom" style="width: 110px;"/>
          </div>
        </template>

        <template slot-scope="{ row }" slot="salesTo">
          <div class="text">{{ row.salesTo || '' }}</div>
          <div class="hover_layer">
            <InputNumber :min="0" :step="0.1" v-model="customerData.prices.commodity[row._index].salesTo" style="width: 110px;"/>
          </div>
        </template>

        <template slot-scope="{ row }" slot="salesPrice">
          <div class="text">{{ row.salesPrice || '' }}</div>
          <div class="hover_layer">
            <InputNumber :min="0" :step="0.1" v-model="customerData.prices.commodity[row._index].salesPrice" style="width: 110px;"/>
          </div>
        </template>

        <template slot-scope="{ row }" slot="discount">
          <div class="text">{{ row.discount || '' }}</div>
          <div class="hover_layer">
            <InputNumber :min="0" :step="0.1" v-model="customerData.prices.commodity[row._index].discount" style="width: 110px;"/>
          </div>
        </template>
      </Table>
    </template>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">保存</Button>
    </div>

    <commodityModal ref="commodityModal" @addCommodity="addCommodity" />
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { customerPricesUpdate } from '../../api/commodityPrices'
import commodityModal from '../../components/commodity/index'
import { queryCommodityInfoGroup } from '../../api/commodityInfo'
export default {
  name: 'currency',
  components: {
    commodityModal
  },
  data () {
    return {
      currentRow: null,
      modal: false,
      whichG: null,
      whichType: 'commodity',
      customerData: {},
      selectList: [],
      groupList: [],
      columns: [
        {
          type: 'selection',
          width: 60,
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
          title: '辅助属性',
          key: 'auxiliary',
          width: 100,
          fixed: 'left',
          resizable: true
        },
        {
          title: 'SKU代码',
          key: 'sku',
          width: 100
        },
        {
          title: '条形码',
          key: 'barcode',
          width: 100
        },
        {
          title: '规格型号',
          key: 'specifications',
          width: 100
        },
        {
          title: '商品类别',
          slot: 'groupId',
          width: 100
        },
        {
          title: '单位',
          slot: 'unit',
          width: 150
        },
        {
          title: '销量（从）',
          slot: 'salesFrom',
          width: 150
        },
        {
          title: '销量（到）',
          slot: 'salesTo',
          width: 150
        },
        {
          title: '销售价格',
          slot: 'salesPrice',
          width: 150
        },
        {
          title: '折扣',
          slot: 'discount',
          width: 150
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ])
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadGroup()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    show (data) {
      this.modal = true
      this.whichG = data.useUser[0].index
      this.customerData = data
      if (this.selectList.length && this.customerData.prices && this.customerData.prices.commodity) {
        this.customerData.prices.commodity.forEach(f => {
          if (this.selectList.includes(f._id)) {
            f._checked = true
          }
        })
      }
    },
    cancel () {
      this.modal = false
    },
    sure () {
      let commodity = this.customerData.prices.commodity
      let isSave = true
      for (let i = 0; i < commodity.length; i++) {
        let item = commodity[i]
        if (item.salesFrom === 0 || item.salesTo === 0) {
          this.$Message.error(`第${i + 1}条销量不能为0`)
          isSave = false
          return
        }
        if (!item.salesPrice || (item.salesPrice && item.salesPrice <= 0)) {
          this.$Message.error(`第${i + 1}条销售价格应该大于0`)
          isSave = false
          return
        }
      }
      if (isSave) {
        customerPricesUpdate(this.customerData).then(res => {
          this.$Message.success('保存成功')
          this.$emit('load')
          this.cancel()
        }).catch(err => {
          this.$Message.error(err.message)
        })
      }
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    rowClassName (row, index) {
      return index === this.currentRow ? 'active' : ''
    },
    rowClick (row, index) {
      this.currentRow = index
    },
    addCommodity (bool, list, priceList) {
      if (bool) {
        this.customerData.prices.commodity = this.customerData.prices.commodity.concat(list.map(v => {
          let unitList = v.measureUnit.conversion.map(m => {
            let pricesData = priceList.find(f => f.commodityId === v._id)
            let fData = pricesData ? pricesData.prices.find(f => f.auxiliary === v.auxiliary && f.unit === m.name) : null
            console.log(fData)
            return {
              unit: m.name,
              salesPrice: fData ? fData.sales.wholesale : null,
              discount: fData ? fData.purchase.discountP : null
            }
          })
          console.log(unitList)
          return {
            gIndex: this.whichG,
            code: v.code,
            name: v.name,
            sku: v.sku,
            auxiliary: v.auxiliary,
            barcode: v.barcode,
            specifications: v.basicInfo.specifications,
            groupId: v.groupId,
            unit: v.unit,
            unitList,
            salesFrom: null,
            salesTo: null,
            salesPrice: unitList.find(f => f.unit === v.unit).salesPrice,
            discount: unitList.find(f => f.unit === v.unit).discount
          }
        }))
      } else {
        this.$refs.commodityModal.show()
      }
    },
    loadGroup () {
      queryCommodityInfoGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.groupList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '商品组',
          desc: err.message
        })
      })
    },
    selectUnit (index) {
      let data = this.customerData.prices.commodity[index]
      let val = data.unit
      this.$Modal.confirm({
        render: (h) => {
          return h('Select', {
            props: {
              value: data.unit
            },
            on: {
              'on-change': (value) => {
                val = value
              }
            }
          },
          data.unitList.map((item) => {
            return h('Option', {
              props: { value: item.unit }
            }, item.unit)
          })
          )
        },
        onOk: () => {
          let fData = data.unitList.find(f => f.unit === val)
          this.$set(this.customerData.prices.commodity[index], 'unit', val)
          this.$set(this.customerData.prices.commodity[index], 'salesPrice', fData.salesPrice)
          this.$set(this.customerData.prices.commodity[index], 'discount', fData.discount)
        }
      })
    }
  }
}
</script>

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
