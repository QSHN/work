<template>
  <div>
    <div style="display: flex">
      <leftExpand ref="leftExpand"
                  :title="'商品类别'"
                  :groupList="groupList"
                  :list="commodityInfoList"
                  :selectGroup="selectGroup"
                  :updateFun="updateCommodityInfoGroup"
                  :deleteFun="deleteCommodityInfoGroup"
                  @load="loadGroup"
                  @selectGroup="(id) => { selectGroup = id }"
                  @updateExpand="(bool) => { isExpand = bool }"/>

      <div class="measure_c">
        <div>
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <Select v-model="whichSearchType" style="width: 100px; margin-right: 10px;">
              <Option v-for="(item, index) in searchList" :value="item.title" :key="index">{{ item.title }}</Option>
            </Select>
            <Input v-model="search.searchVal" :placeholder="searchList.find(f => f.title === whichSearchType).placeholder" style="width: 400px; margin-right: 20px;" />
            <span style="margin-right: 10px;">商品状态</span>
            <Select v-model="search.filter.status" style="width:80px">
              <Option v-for="item in ['启用', '禁用']" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </div>

          <Row type="flex" style="margin-bottom: 10px;">
            <Button style="margin-right: 10px;" @click="setCommodityInfo('add', {groupId: selectGroup, accountSetId: accountSet._id}, '新增')">新增</Button>
            <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchCommodityInfo('删除', selectList)">删除</Button>
            <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchCommodityInfo('启用', selectList)">启用</Button>
            <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchCommodityInfo('禁用', selectList)">禁用</Button>
            <Button style="margin-right: 10px;" @click="loadGroup(), loadCommodityInfo()">刷新</Button>
            <Button style="margin-right: 10px;" @click="loadCommodityInfo">查询</Button>
          </Row>

          <Table :width="getTableWidth" :height="getTableHeight" border :columns="commodityInfoColumns" :data="commodityInfoList" :loading="loading" @on-selection-change="selectTable">
            <template slot-scope="{ row }" slot="action">
              <Button size="small" style="margin-right: 5px;" @click="setCommodityInfo('edit', row, '修改')">修改</Button>
              <Button size="small" @click="batchCommodityInfo('删除', [row._id])">删除</Button>
            </template>
            <template slot-scope="{ row }" slot="pic">
              <div style="padding-top: 5px;">
                <upload-pic v-model="row.picFiles.mainImage" :multiple="1" :disabled="true"/>
              </div>
            </template>
            <template slot-scope="{ row }" slot="unitGroup">
              {{row.unitGroup && measureUnitGroupList.length ? measureUnitGroupList.find(f => f._id === row.unitGroup).name : ''}}
            </template>
            <template slot-scope="{ row }" slot="groupId">
              {{row.groupId && groupList.length ? groupList.find(f => f._id === row.groupId).name : ''}}
            </template>
            <template slot-scope="{ row }" slot="brand">
              {{row.basicInfo.brand && brandList.length ? brandList.find(f => f._id === row.basicInfo.brand).name : ''}}
            </template>
            <template slot-scope="{ row }" slot="status">
              <div @click="batchCommodityInfo(row.status === '启用' ? '禁用' : '启用', [row._id])" style="position: relative;">
                <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
                <i-switch size="small" :value="row.status === '启用'" />
              </div>
            </template>
          </Table>

          <Row type="flex" justify="end" style="margin-top: 10px;">
            <Page :current.sync="search.pageInfo.page" :total="total" :page-size="search.pageInfo.limit" :page-size-opts="pageSizeOpts" size="small" show-elevator show-sizer />
          </Row>
        </div>
      </div>
    </div>

    <commodityInfoForm ref="commodityInfoForm"
                       @load="loadCommodityInfo"
                       :customerList="commodityInfoList"
                       :groupList="groupList"
                       :clerkList="clerkList"
                       :supplierList="supplierList"
                       :measureUnitList="measureUnitList"
                       :measureUnitGroupList="measureUnitGroupList"
                       :brandList="brandList"
                       :auxiliaryList="auxiliaryList"
                       :auxiliaryGroupList="auxiliaryGroupList"
                       :warehouseList="warehouseList"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import commodityInfoForm from './form'
import moment from 'moment'
import leftExpand from '../../components/leftExpand/index_sub_code'
import UploadPic from '../../components/upload/upload-pic'
import {
  queryCommodityInfo,
  batchCommodityInfo,
  updateCommodityInfoGroup,
  queryCommodityInfoGroup,
  deleteCommodityInfoGroup
} from '../../api/commodityInfo'
import { queryClerk } from '../../api/clerk'
import { querySupplier } from '../../api/supplier'
import { queryMeasureUnitGroup, queryMeasureUnit } from '../../api/measureUnit'
import { queryCommodityBrand } from '../../api/commodityBrand'
import { queryAuxiliaryAttributesGroup, queryAuxiliaryAttributes } from '../../api/auxiliaryAttributes'
import { queryWarehouse } from '../../api/warehouse'
export default {
  name: 'index',
  components: {
    leftExpand,
    commodityInfoForm,
    UploadPic
  },
  data () {
    return {
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
      isExpand: true,
      selectGroup: null,
      groupList: [],
      selectList: [],
      loading: true,
      commodityInfoColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center',
          fixed: 'right'
        },
        {
          title: '图片',
          slot: 'pic',
          width: 100,
          align: 'center'
        },
        {
          title: '商品代码',
          key: 'code',
          width: 150
        },
        {
          title: '商品名称',
          key: 'name',
          width: 200
        },
        {
          title: '计量单位组',
          slot: 'unitGroup',
          width: 150
        },
        {
          title: '计量单位',
          key: 'unit',
          width: 150
        },
        {
          title: '商品类别',
          slot: 'groupId',
          width: 150
        },
        {
          title: '商品类型',
          key: 'goodsType',
          width: 150
        },
        {
          title: '简称',
          key: 'abbreviation',
          width: 150
        },
        {
          title: '条形码',
          key: 'barcode',
          width: 150
        },
        {
          title: '商品品牌',
          slot: 'brand',
          width: 150
        },
        {
          title: '状态',
          slot: 'status',
          width: 80,
          align: 'center'
        }
      ],
      commodityInfoList: [],
      clerkList: [],
      supplierList: [],
      measureUnitList: [],
      measureUnitGroupList: [],
      brandList: [],
      auxiliaryList: [],
      auxiliaryGroupList: [],
      warehouseList: []
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
      return window.innerHeight - 270
    },
    getTableWidth () {
      return window.innerWidth - 110 - (this.isExpand ? 230 : 10)
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadGroup()
          this.loadCommodityInfo()
          this.loadClerk()
          this.loadSupplier()
          this.loadUnit()
          this.loadBrand()
          this.loadAuxiliary()
          this.loadWarehouse()
        }
      },
      immediate: true,
      deep: true
    },
    selectGroup () {
      this.loadCommodityInfo()
    }
  },
  methods: {
    moment,
    updateCommodityInfoGroup,
    deleteCommodityInfoGroup,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '商品信息') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}商品信息的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
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
    loadCommodityInfo () {
      this.loading = true
      let search = JSON.parse(JSON.stringify(this.search))
      let filter = {
        accountSetId: this.accountSet._id,
        status: this.search.filter.status
      }
      if (this.selectGroup) {
        let list = this.groupList.filter(f => f.parentIds.includes(this.selectGroup)).map(f => f._id)
        list.unshift(this.selectGroup)
        filter.groupId = { $in: list }
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
      queryCommodityInfo(search).then(res => {
        this.commodityInfoList = res.data.list
        this.total = res.data.total
        if (this.selectList.length) {
          this.commodityInfoList.forEach(f => {
            if (this.selectList.includes(f._id)) {
              f._checked = true
            }
          })
        }
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '商品',
          desc: err.message
        })
      })
    },
    setCommodityInfo (type, item, title) {
      if (!this.judge(title)) return
      let formData = item ? Object.assign({}, item) : {}
      switch (type) {
        case 'add':
          formData = {
            accountSetId: this.accountSet._id,
            creator: this.myUser._id,
            groupId: item ? item.groupId : this.selectGroup
          }
          this.$refs.commodityInfoForm.show('新建', null, formData)
          break
        case 'edit':
          this.$refs.commodityInfoForm.show('修改', formData)
          break
      }
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchCommodityInfo (action, list) {
      if (!this.judge(action)) return
      this.$Modal.confirm({
        title: `${action}商品`,
        content: `是否${action}所选商品`,
        onOk: () => {
          batchCommodityInfo({
            ids: list,
            action: action
          }).then(res => {
            this.$Message.success(`成功${action}所选商品`)
            this.loadCommodityInfo()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    },
    loadClerk () {
      queryClerk({ accountSetId: this.accountSet._id }).then(res => {
        this.clerkList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    loadSupplier () {
      querySupplier({ accountSetId: this.accountSet._id }).then(res => {
        this.supplierList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    loadUnit () {
      queryMeasureUnit({ accountSetId: this.accountSet._id }).then(res => {
        this.measureUnitList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryMeasureUnitGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.measureUnitGroupList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    loadBrand () {
      queryCommodityBrand({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('queryCommodityBrand', res.data)
        this.brandList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    loadAuxiliary () {
      queryAuxiliaryAttributes({ accountSetId: this.accountSet._id }).then(res => {
        this.auxiliaryList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryAuxiliaryAttributesGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.auxiliaryGroupList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    loadWarehouse () {
      queryWarehouse({ accountSetId: this.accountSet._id }).then(res => {
        this.warehouseList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
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
