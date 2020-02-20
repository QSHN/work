<template>
  <div>
    <Row style="margin-bottom: 10px;">
      <span>仓库：</span>
      <Select v-model="search.filter.warehouseId" filterable style="width: 150px;">
        <Option v-for="(item, index) in warehouseList" :value="item._id" :key="index">{{ item.name }}</Option>
      </Select>
      <span style="margin: 0 0 0 20px;">商品：</span>
      <Button style="width: 150px; text-align: left" @click="addCommodity(false)">{{ search.filter.commodityName || '' }}</Button>
      <span style="margin: 0 0 0 20px;" >商品类别：</span>
      <Select v-model="search.filter.groupId" filterable style="width: 150px; margin-right: 10px;">
        <Option v-for="(item, index) in groupList" :value="item._id" :key="index">{{ item.name }}</Option>
      </Select>
      <Button style="margin-right: 10px;" @click="loadBeginning">查询</Button>
      <template v-if="accountSet && !accountSet.generalLedger">
        <Button type="primary" style="margin-right: 10px;" @click="save">保存</Button>
        <Button style="margin-right: 10px;" @click="addCommodity(true)">导入商品</Button>
        <Button style="margin-right: 10px;" :disabled="!selectList.length">删除</Button>
      </template>
    </Row>

    <Table :height="getTableHeight"
           border
           :columns="columns"
           :data="tableData"
           :loading="loading"
           class="input_table"
           @on-row-click="rowClick"
           :row-class-name="rowClassName"
           @on-selection-change="selectTable">
      <template slot-scope="{ row }" slot="warehouseId">
        <div class="text">{{ warehouseList.find(f => f._id === row.warehouseId) ? warehouseList.find(f => f._id === row.warehouseId).name : '' }}</div>
        <div class="hover_layer">
          <Select v-model="tableData[row._index].warehouseId">
            <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('warehouse', loadWarehouse)" style="font-size: 20px; opacity: 0.6" />
            <Option v-for="item in warehouseList" :value="item._id" :key="item._id">
              {{ item.name }}
            </Option>
          </Select>
        </div>
      </template>
      <template slot-scope="{ row }" slot="groupId">
        {{ groupList.find(f => f._id === row.groupId) ? groupList.find(f => f._id === row.groupId).name : ''}}
      </template>
      <template slot-scope="{ row }" slot="unit">
        <div class="text">{{ row.unit || '' }}</div>
        <div class="hover_layer">
          <Button style="width: 110px; text-align: left;" @click="selectFun(row._index, 'unit', row.unitList)">
            {{ row.unit || '' }}
          </Button>
        </div>
      </template>
      <template slot-scope="{ row }" slot="registration">
        <div class="text">{{ row.registration || '' }}</div>
        <div class="hover_layer">
          <Input v-model="tableData[row._index].registration" style="width: 110px;"/>
        </div>
      </template>
      <template slot-scope="{ row }" slot="production">
        <div class="text">{{ row.production || '' }}</div>
        <div class="hover_layer">
          <Input v-model="tableData[row._index].production" style="width: 110px;"/>
        </div>
      </template>
      <template slot-scope="{ row }" slot="beginning">
        <div class="text">{{ row.beginning ?  row.beginning.toFixed(4) : '' }}</div>
        <div class="hover_layer">
          <InputNumber :min="1" :precision="4" v-model="tableData[row._index].beginning" style="width: 110px;"/>
        </div>
      </template>
    </Table>

    <Row type="flex" justify="end" style="margin-top: 10px;">
      <Page :current.sync="search.pageInfo.page" :total="total" :page-size="search.pageInfo.limit" :page-size-opts="pageSizeOpts" size="small" show-elevator show-sizer />
    </Row>

    <commodityModal ref="commodityModal" @addCommodity="addCommodity" />
    <selectInfoModel ref="selectInfoModel" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryCommodityInventory, batchCommodityInventory } from '../../api/commodityInventory'
import { queryCommodityInfoGroup } from '../../api/commodityInfo'
import { queryWarehouse } from '../../api/warehouse'
import commodityModal from '../../components/commodity/index'
import selectInfoModel from '../../components/selectInfo/model'
export default {
  name: 'index',
  components: {
    commodityModal,
    selectInfoModel
  },
  data () {
    return {
      currentRow: null,
      total: 0,
      pageSizeOpts: [20, 50, 100],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '商品',
          key: 'name',
          width: 200
        },
        {
          title: '仓库',
          slot: 'warehouseId',
          width: 150
        },
        {
          title: '商品类别',
          slot: 'groupId',
          width: 150
        },
        {
          title: '属性',
          key: 'auxiliary',
          width: 150
        },
        {
          title: '基本单位',
          slot: 'unit',
          width: 150
        },
        {
          title: '注册证号',
          slot: 'registration',
          width: 150
        },
        {
          title: '生产许可证',
          slot: 'production',
          width: 150
        },
        {
          title: '期初数量',
          slot: 'beginning',
          width: 150
        },
        {
          title: ' '
        }
      ],
      tableData: [],
      selectList: [],
      search: {
        filter: {
          accountSetId: null,
          groupId: null,
          commodityId: null,
          commodityName: null,
          warehouseId: null
        },
        pageInfo: {
          limit: 20,
          page: 1
        }
      },
      loading: true,
      groupList: [],
      warehouseList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList'
    ]),
    getTableHeight () {
      return window.innerHeight - 210
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadBeginning()
          this.loadGroup()
          this.loadWarehouse()
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
          if (f.title === '计量单位') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}计量单位的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadBeginning () {
      this.loading = true
      let search = JSON.parse(JSON.stringify(this.search))
      search.filter.accountSetId = this.accountSet._id
      if (search.filter.groupId) {
        let list = this.groupList.filter(f => f.parentIds.includes(search.filter.groupId)).map(f => f._id)
        list.unshift(search.filter.groupId)
        search.filter.groupId = { $in: list }
      } else {
        delete search.filter.groupId
      }
      if (!search.filter.commodityId) delete search.filter.commodityId
      if (!search.filter.warehouseId) delete search.filter.warehouseId
      delete search.filter.commodityName
      queryCommodityInventory(search).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.loading = false
        if (this.selectList.length) {
          this.tableData.forEach(f => {
            if (this.selectList.includes(f._id)) {
              f._checked = true
            }
          })
        }
      }).catch(err => {
        this.$Message.error(err.message)
      })
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
    loadWarehouse () {
      queryWarehouse({ accountSetId: this.accountSet._id }).then(res => {
        this.warehouseList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
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
    selectFun (index, type, list) {
      let data = this.tableData[index]
      let val = data[type]
      this.$Modal.confirm({
        render: (h) => {
          return h('Select', {
            props: {
              value: data.name
            },
            on: {
              'on-change': (value) => {
                val = value
              }
            }
          },
          list.map((item) => {
            return h('Option', {
              props: { value: type === 'unit' ? item.name : item._id }
            }, item.name)
          })
          )
        },
        onOk: () => {
          this.$set(this.tableData[index], type, val)
        }
      })
    },
    addCommodity (bool, list = [], price = null) {
      if (bool && list.length) {
        if (!price) {
          this.search.filter.commodityId = list[0]._id
          this.search.filter.commodityName = list[0].name
        } else {
          this.tableData = this.tableData.concat(list.map(v => {
            return {
              commodityId: v._id,
              code: v.code,
              name: v.name,
              auxiliary: v.auxiliary,
              groupId: v.groupId,
              unit: v.unit,
              unitList: v.measureUnit.conversion,
              warehouseId: null,
              registration: null,
              production: null,
              beginning: 1,
              inventory: 1
            }
          }))
        }
      } else {
        this.$refs.commodityModal.show(bool)
      }
    },
    save () {
      if (!this.judge('修改')) return
      let isSave = true
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i]
        if (!item.commodityId) {
          this.$Message.error(`第${i + 1}条商品不能为空`)
          isSave = false
        } else if (!item.unit) {
          this.$Message.error(`第${i + 1}条单位不能为空`)
          isSave = false
        } else if (!item.warehouseId) {
          this.$Message.error(`第${i + 1}条仓库不能为空`)
          isSave = false
        } else if (!item.unit) {
          this.$Message.error(`第${i + 1}条单位不能为空`)
          isSave = false
        } else if (!item.beginning) {
          this.$Message.error(`第${i + 1}条期初数量应该大于0`)
          isSave = false
        } else {
          this.$set(this.tableData[i], 'inventory', item.beginning)
        }
        if (!isSave) return
      }
      if (isSave) {
        batchCommodityInventory({
          accountSetId: this.accountSet._id,
          ids: this.tableData
        }).then(res => {
          this.$Message.success('保存成功')
          this.loadBeginning()
        }).catch(err => {
          this.$Message.error(err.message)
        })
      }
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
