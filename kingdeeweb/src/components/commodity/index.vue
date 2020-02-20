<template>
  <Modal
    v-model="modal"
    title="选择商品"
    :mask-closable="false"
    width="1000"
    class="commodityModal"
    @on-cancel="cancel">
    <div class="commodity_layer">
      <div class="left_layer">
        <RadioGroup v-model="whichType" style="border-bottom: 1px solid #e6e6e6; padding: 10px;">
          <Radio label="商品类别" style="margin: 0 30px 5px 0">商品类别</Radio>
          <Radio label="商品品牌" style="margin: 0 0 5px 0">商品品牌</Radio>
          <Radio label="商品类型">商品类型</Radio>
        </RadioGroup>

        <GeminiScrollbar
          class="scroll_layer"
          :autoshow="true"
          :forceGemini="true"
          :minThumbSize="20">
          <div style="padding: 0 10px;">
            <template v-if="whichType === '商品品牌'">
              <CheckboxGroup v-model="selectGroupList" style="padding-top: 5px;">
                <Checkbox v-for="(v, i) in brandList" :key="i" :label="v._id" style="display: block; margin: 5px 0;">{{ v.name }}</Checkbox>
              </CheckboxGroup>
            </template>
            <template v-else>
              <Tree :data="getGroupList" :render="renderContent"></Tree>
            </template>
          </div>
        </GeminiScrollbar>
      </div>

      <div class="right_layer">
        <div style="display: flex; align-items: center; margin: 10px;">
          <Select v-model="whichSearchType" style="width: 100px; margin-right: 10px;">
            <Option v-for="(item, index) in searchList" :value="item.title" :key="index">{{ item.title }}</Option>
          </Select>
          <Input v-model="search.searchVal" :placeholder="searchList.find(f => f.title === whichSearchType).placeholder" style="width: 400px; margin-right: 20px;" />
          <Button @click="loadCommodityInfo">查询</Button>
        </div>

        <Table :width="770"
               :height="420"
               border
               :columns="commodityInfoColumns"
               :data="commodityInfoList"
               :loading="loading"
               @on-selection-change="selectTable"
               style="margin-left: 10px;">
          <template v-if="!isMoreSelect" slot-scope="{ row }" slot="check">
            <Button size="small" @click="sure(row)">选择</Button>
          </template>
          <template slot-scope="{ row }" slot="groupId">
            {{row.groupId && groupList.length ? groupList.find(f => f._id === row.groupId).name : ''}}
          </template>
          <template slot-scope="{ row }" slot="brand">
            {{row.basicInfo.brand && brandList.length ? brandList.find(f => f._id === row.basicInfo.brand).name : ''}}
          </template>
          <template slot-scope="{ row }" slot="specifications">
            {{row.basicInfo.specifications || ''}}
          </template>
        </Table>

        <Row type="flex" justify="end" style="margin-top: 10px;">
          <Page :current.sync="search.pageInfo.page" :total="total" :page-size="search.pageInfo.limit" :page-size-opts="pageSizeOpts" size="small" show-elevator show-sizer />
        </Row>
      </div>
    </div>
    <div slot="footer">
      <Button @click="createCommodity">创建</Button>
      <Button type="text" @click="cancel">取消</Button>
      <Button v-if="isMoreSelect" type="success" @click="sure">保存</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryCommodityBrand } from '../../api/commodityBrand'
import { queryCommodityInfoGroup, queryCommodityInfoAndDetail } from '../../api/commodityInfo'
export default {
  name: 'index',
  props: {
    isOne: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modal: false,
      whichType: '商品类别',
      selectGroup: null,
      selectGroupList: [],
      brandList: [],
      groupList: [],
      selectList: [],
      goodsTypeList: [
        {
          _id: 1,
          name: '普通',
          parentIds: []
        },
        {
          _id: 2,
          name: '组装',
          parentIds: []
        },
        {
          _id: 3,
          name: '套装',
          parentIds: []
        },
        {
          _id: 4,
          name: '服务',
          parentIds: []
        }
      ],
      total: 0,
      pageSizeOpts: [50, 100],
      whichSearchType: '快捷查询',
      searchList: [
        {
          title: '快捷查询',
          placeholder: '按名称/代码/条形码/简称/规格型号/备注/描述/计量单位查找',
          formula: ['name', 'code', 'barcode', 'abbreviation', 'basicInfo.specifications', 'basicInfo.des', 'basicInfo.describe', 'unit']
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
          limit: 50,
          page: 1
        }
      },
      commodityInfoList: [],
      commodityPriceList: [],
      loading: true,
      commodityInfoColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '商品代码',
          key: 'code',
          width: 100
        },
        {
          title: '商品名称',
          key: 'name',
          width: 100
        },
        {
          title: 'SKU代码',
          key: 'sku',
          width: 100
        },
        {
          title: '辅助属性',
          key: 'auxiliary',
          width: 100
        },
        {
          title: '商品品牌',
          slot: 'brand',
          width: 100
        },
        {
          title: '商品类别',
          slot: 'groupId',
          width: 100
        },
        {
          title: '规格型号',
          slot: 'specifications',
          width: 100
        },
        {
          title: '单位',
          key: 'unit',
          width: 100
        }
      ],
      isMoreSelect: true
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getGroupList () {
      let groupList = this.whichType === '商品类别' ? this.groupList : this.goodsTypeList
      // console.log(this.groupList)
      let result = [
        {
          _id: null,
          name: '全部',
          expand: true,
          children: []
        }
      ]
      let add = (list, child) => {
        list.forEach(v => {
          let subList = groupList.filter(g => g.parentIds.length && g.parentIds[g.parentIds.length - 1] === v._id)
          let children = []
          if (subList.length) add(subList, children)
          child.push({
            _id: v._id,
            name: v.name,
            parentIds: v.parentIds,
            expand: true,
            children: children
          })
        })
      }
      add(groupList.filter(f => f.parentIds.length === 0), result[0].children)
      return result
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.load()
        }
      },
      immediate: true,
      deep: true
    },
    selectGroup () {
      this.loadCommodityInfo()
    },
    selectGroupList () {
      this.loadCommodityInfo()
    },
    whichType () {
      this.selectGroup = null
      this.loadCommodityInfo()
    }
  },
  methods: {
    show (isMoreSelect = true) {
      this.modal = true
      this.selectList = []
      this.loadCommodityInfo()
      if (isMoreSelect) {
        this.commodityInfoColumns.splice(0, 1, {
          type: 'selection',
          width: 60,
          align: 'center'
        })
      } else {
        this.commodityInfoColumns.splice(0, 1, {
          title: '操作',
          slot: 'check',
          width: 80,
          align: 'center'
        })
      }
      this.isMoreSelect = isMoreSelect
    },
    cancel () {
      this.modal = false
    },
    sure (row) {
      if (!this.isMoreSelect && row) {
        this.$emit(
          'addCommodity',
          true,
          [row]
        )
        this.cancel()
      } else {
        if (this.selectList.length) {
          this.$emit(
            'addCommodity',
            true,
            this.commodityInfoList.filter(v => this.selectList.find(f => f._id === v._id && f.auxiliary === v.auxiliary)),
            this.commodityPriceList.filter(v => this.selectList.find(f => f._id === v.commodityId))
          )
          this.cancel()
        } else {
          this.$Message.error('请选择要导入的商品')
        }
      }
    },
    renderContent (h, { root, node, data }) {
      return h('div', {
        style: {
          display: 'inline-block'
        }
      }, [
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center'
          }
        }, [
          h('span', {
            style: {
              maxWidth: '100px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              display: 'block',
              height: '24px',
              lineHeight: '24px',
              cursor: 'pointer',
              padding: '0 5px',
              background: data._id === this.selectGroup ? '#5cadff' : '',
              color: data._id === this.selectGroup ? '#fff' : ''
            },
            on: {
              click: () => {
                this.selectGroup = data._id
              }
            }
          }, data.name)
        ])
      ])
    },
    load () {
      queryCommodityBrand({ accountSetId: this.accountSet._id }).then(res => {
        this.brandList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryCommodityInfoGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.groupList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    selectTable (list) {
      this.selectList = list.map((v, i) => {
        return {
          auxiliary: v.auxiliary,
          _id: v._id
        }
      })
    },
    loadCommodityInfo () {
      this.loading = true
      let search = JSON.parse(JSON.stringify(this.search))
      let filter = {
        accountSetId: this.accountSet._id,
        status: this.search.filter.status,
        isOne: this.isOne
      }
      switch (this.whichType) {
        case '商品类别':
          if (this.selectGroup) {
            let list = this.groupList.filter(f => f.parentIds.includes(this.selectGroup)).map(f => f._id)
            list.unshift(this.selectGroup)
            filter.groupId = { $in: list }
          }
          break
        case '商品品牌':
          if (this.selectGroupList.length) filter['basicInfo.brand'] = { $in: this.selectGroupList }
          break
        case '商品类型':
          if (this.selectGroup) filter.goodsType = this.goodsTypeList.find(f => f._id === this.selectGroup).name
          break
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
      queryCommodityInfoAndDetail(search).then(res => {
        this.commodityInfoList = res.data.list
        this.total = res.data.total
        this.commodityPriceList = res.data.priceList
        this.loading = false
        if (this.selectList.length) {
          this.commodityInfoList.forEach(f => {
            if (this.selectList.find(s => s._id === f._id && s.auxiliary === f.auxiliary)) {
              f._checked = true
            }
          })
        }
      }).catch(err => {
        this.$Notice.error({
          title: '商品',
          desc: err.message
        })
      })
    },
    createCommodity () {
      this.$router.push({
        name: 'commodityInfoIndex'
      })
      this.cancel()
    }
  }
}
</script>

<style lang="less">
.commodityModal {
  .ivu-modal-body {
    padding: 0;
  }

  .commodity_layer {
    display: flex;
    height: 520px;
  }

  .left_layer {
    width: 200px;
    border-right: 1px solid #e6e6e6;

    .scroll_layer {
      height: 455px;
      overflow: hidden;
    }
  }

  .right_layer {

  }
}
</style>
