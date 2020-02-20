<template>
  <div>
    <div style="display: flex">
      <div :class="{left_expand: true, active: !isExpand}">
        <div class="le_c">
          <div class="le_m">
            <GeminiScrollbar
              class="scroll_layer"
              :autoshow="true"
              :forceGemini="true"
              :minThumbSize="20">
              <div style="padding: 0 10px;">
                <Tree :data="groupList" :render="renderContent"></Tree>
              </div>
            </GeminiScrollbar>
          </div>
        </div>

        <div :class="{expand_btn: true, active: !isExpand}" @click="isExpand = !isExpand">
          <img src="../../assets/images/icon/left.svg" :title="isExpand ? '收起' : '展开'" />
        </div>
      </div>

      <div class="measure_c">
        <div>
          <Row type="flex" style="margin-bottom: 10px;">
            <div style="display: flex; align-items: center; margin-right: 10px;">
              业务单据时间范围：
              <DatePicker type="daterange" split-panels v-model="search.filter.time" style="width: 200px"></DatePicker>
            </div>
            <Button style="margin-right: 10px;" @click="load">查询</Button>
            <Button style="margin-right: 10px;" :disabled="!selectList.length || loading" @click="createFun">生成凭证</Button>
          </Row>

          <Table
              class="input_table"
              :width="getTableWidth"
              :height="getTableHeight"
              border
              :columns="columns"
              :data="pageContent"
              :loading="loading"
              @on-selection-change="selectTable"
              @on-row-click="rowClick"
              :row-class-name="rowClassName">
            <template slot-scope="{ row }" slot="code">
              <router-link :to="{
                name: row.routerName,
                query: { id: row._id }
              }">{{ row.code }}</router-link>
            </template>

            <template slot-scope="{ row }" slot="templateId">
              <div class="text">{{ credentialsOrderList.find(f => f._id === row.templateId) && credentialsOrderList.find(f => f._id === row.templateId).name }}</div>
              <div class="hover_layer">
                <Select v-model="pageContent[row._index].templateId">
                  <Option v-for="(item, index) in credentialsOrderList.filter(f => f.orderType === row.orderType)" :value="item._id" :key="index">{{ item.name }}</Option>
                </Select>
              </div>
            </template>
          </Table>

          <Row type="flex" justify="end" style="margin-top: 10px;">
            <Page :current.sync="search.pageInfo.page" :total="tableData.length" :page-size="search.pageInfo.limit" :page-size-opts="pageSizeOpts" size="small" show-elevator show-sizer />
          </Row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { queryPurchaseWarehouse } from '../../api/purchaseWarehouse'
import { queryPurchaseReturn } from '../../api/purchaseReturn'
import { querySalesWarehouse } from '../../api/salesWarehouse'
import { querySalesReturn } from '../../api/salesReturn'
import { queryWarehouseIn } from '../../api/warehouseIn'
import { queryWarehouseOut } from '../../api/warehouseOut'
import { queryWarehouseAllocatingIn } from '../../api/warehouseAllocatingIn'
import { queryWarehouseAllocatingOut } from '../../api/warehouseAllocatingOut'
import { queryWarehouseDiskSurplus } from '../../api/warehouseDiskSurplus'
import { queryWarehouseDiskDeficient } from '../../api/warehouseDiskDeficient'
import { queryReceivableCollection } from '../../api/receivableCollection'
import { queryReceivablePayments } from '../../api/receivablePayments'
import { queryReceivableRefund } from '../../api/receivableRefund'
import { queryReceivableOther } from '../../api/receivableOther'
import { queryReceivableVerification } from '../../api/receivableVerification'
import { queryPayableCollection } from '../../api/payableCollection'
import { queryPayablePayments } from '../../api/payablePayments'
import { queryPayableRefund } from '../../api/payableRefund'
import { queryPayableOther } from '../../api/payableOther'
import { queryCredentialsOrder } from '../../api/credentialsOrder'
import { updateCredentialsCache } from '../../api/credentialsCache'
// import NP from 'number-precision'
export default {
  name: 'credentialsCreate',
  data () {
    return {
      currentRow: null,
      isExpand: true,
      selectGroup: '',
      hoverId: null,
      groupList: [{
        _id: '',
        name: '单据列表',
        expand: true,
        children: [
          {
            _id: '1',
            name: '采购管理',
            expand: true,
            children: [
              {
                _id: '1-1',
                name: '采购入库单'
              },
              {
                _id: '1-2',
                name: '采购退货单'
              }
            ]
          },
          {
            _id: '2',
            name: '销售管理',
            expand: true,
            children: [
              {
                _id: '2-1',
                name: '销售出库单'
              },
              {
                _id: '2-2',
                name: '销售退货单'
              }
            ]
          },
          {
            _id: '3',
            name: '库存管理',
            expand: true,
            children: [
              {
                _id: '3-1',
                name: '盘盈单'
              },
              {
                _id: '3-2',
                name: '盘亏单'
              },
              {
                _id: '3-3',
                name: '其他入库单'
              },
              {
                _id: '3-4',
                name: '其他出库单'
              },
              {
                _id: '3-5',
                name: '调拨入库单'
              },
              {
                _id: '3-6',
                name: '调拨出库单'
              }
            ]
          },
          {
            _id: '4',
            name: '应收应付',
            expand: true,
            children: [
              {
                _id: '4-1',
                name: '收款单'
              },
              {
                _id: '4-2',
                name: '付款单'
              },
              {
                _id: '4-3',
                name: '预收款单'
              },
              {
                _id: '4-4',
                name: '预付款单'
              },
              {
                _id: '4-5',
                name: '预收退款单'
              },
              {
                _id: '4-6',
                name: '预付退款单'
              },
              {
                _id: '4-7',
                name: '其他应收单'
              },
              {
                _id: '4-8',
                name: '其他应付单'
              },
              {
                _id: '4-9',
                name: '核销单'
              }
            ]
          }
        ]
      }],
      selectList: [],
      loading: true,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '日期',
          width: 200,
          resizable: true,
          key: 'dateTime'
        },
        {
          title: '单据编号',
          width: 300,
          resizable: true,
          slot: 'code'
        },
        {
          title: '凭证模板',
          width: 200,
          resizable: true,
          slot: 'templateId'
        },
        {
          title: '单据类型',
          width: 200,
          resizable: true,
          key: 'orderType'
        },
        {
          title: ' '
        }
      ],
      pageSizeOpts: [10, 20, 50],
      search: {
        filter: {
          accountSetId: null,
          time: [null, null],
          credentialsId: null
        },
        pageInfo: {
          limit: 10,
          page: 1
        }
      },
      purchaseWarehouse: [],
      purchaseReturn: [],
      salesWarehouse: [],
      salesReturn: [],
      warehouseIn: [],
      warehouseOut: [],
      warehouseAllocatingIn: [],
      warehouseAllocatingOut: [],
      warehouseDiskSurplus: [],
      warehouseDiskDeficient: [],
      receivableCollection: [],
      receivablePayments: [],
      receivableRefund: [],
      receivableOther: [],
      receivableVerification: [],
      payableCollection: [],
      payablePayments: [],
      payableRefund: [],
      payableOther: [],
      credentialsOrderList: [],
      pageContent: []
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
      return window.innerHeight - 230
    },
    getTableWidth () {
      return window.innerWidth - 110 - (this.isExpand ? 230 : 10)
    },
    tableData () {
      let list = []
      list = list.concat(this.updateList('purchaseWarehouse', '采购管理', '采购入库单'))
      list = list.concat(this.updateList('purchaseReturn', '采购管理', '采购退货单'))
      list = list.concat(this.updateList('salesWarehouse', '销售管理', '销售出库单'))
      list = list.concat(this.updateList('salesReturn', '销售管理', '销售退货单'))
      list = list.concat(this.updateList('warehouseIn', '库存管理', '其他入库单'))
      list = list.concat(this.updateList('warehouseOut', '库存管理', '其他出库单'))
      list = list.concat(this.updateList('warehouseAllocatingIn', '库存管理', '调拨入库单'))
      list = list.concat(this.updateList('warehouseAllocatingOut', '库存管理', '调拨出库单'))
      list = list.concat(this.updateList('warehouseDiskSurplus', '库存管理', '盘盈单'))
      list = list.concat(this.updateList('warehouseDiskDeficient', '库存管理', '盘亏单'))
      list = list.concat(this.updateList('receivableCollection', '应收应付', '收款单'))
      list = list.concat(this.updateList('receivablePayments', '应收应付', '预收款单'))
      list = list.concat(this.updateList('receivableRefund', '应收应付', '预收退款单'))
      list = list.concat(this.updateList('receivableOther', '应收应付', '其他应收单'))
      list = list.concat(this.updateList('receivableVerification', '应收应付', '核销单'))
      list = list.concat(this.updateList('payableCollection', '应收应付', '付款单'))
      list = list.concat(this.updateList('payablePayments', '应收应付', '预付款单'))
      list = list.concat(this.updateList('payableRefund', '应收应付', '预付退款单'))
      list = list.concat(this.updateList('payableOther', '应收应付', '其他应付单'))
      if (this.selectGroup.includes('-')) {
        let group = this.selectGroup.split('-')
        list = list.filter(f => f.orderType === this.groupList[0].children[group[0] - 1].children[group[1] - 1].name)
      } else if (this.selectGroup.length) {
        list = list.filter(f => f.category === this.groupList[0].children[this.selectGroup - 1].name)
      }
      if (this.selectList.length) {
        list.forEach(f => {
          if (this.selectList.includes(f._id)) {
            f._checked = true
          }
        })
      }
      return list
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
    tableData () {
      this.pageContent = this.tableData.slice((this.search.pageInfo.page - 1) * this.search.pageInfo.limit, this.search.pageInfo.page * this.search.pageInfo.limit)
    }
  },
  methods: {
    moment,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '生成凭证') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}生成凭证的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    renderContent (h, { root, node, data }) {
      return h('div', {
        style: {
          display: 'inline-block'
        },
        on: {
          'mouseenter': () => {
            this.hoverId = data._id
          },
          'mouseleave': () => {
            this.hoverId = null
          }
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
              background: data._id === this.selectGroup || data._id === this.hoverId ? '#5cadff' : '',
              color: data._id === this.selectGroup || data._id === this.hoverId ? '#fff' : ''
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
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    load () {
      this.loading = true
      let number = 20
      let ajaxData = {
        filter: {
          accountSetId: this.accountSet._id,
          credentialsId: null,
          audit: '已审核'
        },
        pageInfo: {
          limit: 999999999999,
          page: 1
        }
      }
      if (this.search.filter.time.length && this.search.filter.time[0]) {
        ajaxData.filter.dateTime = {
          $gte: this.moment(this.search.filter.time[0]).format('YYYY-MM-DD') + ' 00:00:00.000',
          $lte: this.moment(this.search.filter.time[1]).format('YYYY-MM-DD') + ' 23:59:59.999'
        }
      }
      let setLoad = () => {
        number--
        if (number <= 0) this.loading = false
      }
      queryPurchaseWarehouse(ajaxData).then(res => {
        this.purchaseWarehouse = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryPurchaseReturn(ajaxData).then(res => {
        this.purchaseReturn = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      querySalesWarehouse(ajaxData).then(res => {
        this.salesWarehouse = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      querySalesReturn(ajaxData).then(res => {
        this.salesReturn = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryWarehouseIn(ajaxData).then(res => {
        this.warehouseIn = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryWarehouseOut(ajaxData).then(res => {
        this.warehouseOut = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryWarehouseAllocatingIn(ajaxData).then(res => {
        this.warehouseAllocatingIn = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryWarehouseAllocatingOut(ajaxData).then(res => {
        this.warehouseAllocatingOut = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryWarehouseDiskSurplus(ajaxData).then(res => {
        this.warehouseDiskSurplus = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryWarehouseDiskDeficient(ajaxData).then(res => {
        this.warehouseDiskDeficient = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryReceivableCollection(ajaxData).then(res => {
        this.receivableCollection = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryReceivablePayments(ajaxData).then(res => {
        this.receivablePayments = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryReceivableRefund(ajaxData).then(res => {
        this.receivableRefund = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryReceivableOther(ajaxData).then(res => {
        this.receivableOther = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryReceivableVerification(ajaxData).then(res => {
        this.receivableVerification = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryPayableCollection(ajaxData).then(res => {
        this.payableCollection = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryPayablePayments(ajaxData).then(res => {
        this.payablePayments = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryPayableRefund(ajaxData).then(res => {
        this.payableRefund = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryPayableOther(ajaxData).then(res => {
        this.payableOther = res.data.list
        setLoad()
      }).catch(err => {
        this.$Message.error(err.message)
      })
      queryCredentialsOrder({
        accountSetId: this.accountSet._id,
        status: true
      }).then(res => {
        this.credentialsOrderList = res.data
        setLoad()
      }).catch(err => {
        this.$Notice.error({
          title: '业务凭证模板',
          desc: err.message
        })
      })
    },
    updateList (type, category, orderType) {
      return this[type].map(v => {
        let list = this.credentialsOrderList.filter(f => f.orderType === orderType)
        let fData = list.find(f => f.isDefault)
        let obj = Object.assign({
          templateId: fData ? fData._id : list.length ? list[0]._id : null,
          category,
          orderType,
          routerName: type,
          _disabled: !fData && list.length === 0
        }, v)
        obj.dateTime = this.moment(v.dateTime).format('YYYY-MM-DD')
        return obj
      })
    },
    createFun () {
      let list = this.tableData.filter(f => this.selectList.includes(f._id))
      let accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
      this.loading = true
      updateCredentialsCache({
        accountSetId: this.accountSet._id,
        accountingPeriod,
        list: list.map(v => {
          return {
            _id: v._id,
            orderType: v.orderType,
            templateId: v.templateId
          }
        })
      }).then(res => {
        this.loading = false
        if (res.data) {
          this.$Modal.confirm({
            title: '生成业务凭证',
            content: `成功生成凭证${res.data.success}张，失败${res.data.fail}张，是否前往查看生成的业务凭证`,
            onOk: () => {
              this.$router.push({
                name: 'credentialsCache'
              })
            }
          })
        }
      }).catch(err => {
        this.$Notice.error({
          title: '生成业务凭证',
          desc: err.message
        })
      })
    },
    rowClassName (row, index) {
      return index === this.currentRow ? 'active' : ''
    },
    rowClick (row, index) {
      this.currentRow = index
    }
  }
}
</script>

<style lang="less" scoped>
  .left_expand {
    position: relative;
    width: 210px;
    height: ~"calc(100vh - 132px)";
    margin-right: 10px;
    background: #fff;
    transition: 300ms;

    .expand_btn {
      position: absolute;
      right: 0;
      top: 50%;
      z-index: 1;
      width: 20px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #c5c8ce;
      margin-top: -15px;
      cursor: pointer;
      transition: 300ms;

      img {
        width: 10px;
      }

      &:hover {
        opacity: .8;
      }
    }

    &.active {
      width: 0;
      margin-right: 0;

      .expand_btn {
        right: -20px;
        transform: rotateY(180deg);
      }
    }

    .le_c {
      width: 100%;
      height: 100%;
      overflow: hidden;

      .le_m {
        width: 210px;
        height: 100%;

        .title {
          width: 100%;
          height: 36px;
          min-height: 36px;
          border-bottom: 1px solid #dcdee2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;

          .add_btn {
            width: 18px;
            height: 18px;
            cursor: pointer;

            img {
              width: 100%;
              height: 100%;
              filter: grayscale(100%)
            }
          }
        }

        .search {
          padding: 8px 10px;
        }

        .scroll_layer {
          height: ~"calc(100% - 10px)";
          overflow: hidden;
        }
      }
    }
  }
  .measure_c {
    display: flex;
    flex-grow: 1;
    background: #fff;
    padding: 10px;
    overflow: hidden;
  }
</style>
