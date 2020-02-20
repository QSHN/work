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
          <Row type="flex" justify="space-between" style="margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
              <span>凭证模板</span>
            </div>
            <div>
              <Button style="margin-right: 10px;" :disabled="!selectGroup.includes('-')" @click="setCredentialsOrder('新增')">新增</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchCredentialsOrder('删除', selectList)">删除</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchCredentialsOrder('启用', selectList)">启用</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchCredentialsOrder('禁用', selectList)">禁用</Button>
              <Button @click="loadCredentialsOrder()">刷新</Button>
            </div>
          </Row>

          <Table :width="getTableWidth" :height="getTableHeight" border :columns="columns" :data="tableData" :loading="loading" @on-selection-change="selectTable">
            <template slot-scope="{ row }" slot="code">
              <div style="color: #2d8cf0" @click="setCredentialsOrder('修改', row)">
                {{ row.code }}
              </div>
            </template>

            <template slot-scope="{ row }" slot="proofWordId">
              {{ wordsList.find(f => f._id === row.proofWordId) && wordsList.find(f => f._id === row.proofWordId).name }}
            </template>

            <template slot-scope="{ row }" slot="updateAt">
              {{ moment(row.updateAt).format('YYYY-MM-DD') }}
            </template>

            <template slot-scope="{ row }" slot="creator">
              {{ userList.find(f => f._id === row.creator) && userList.find(f => f._id === row.creator).name }}
            </template>

            <template slot-scope="{ row }" slot="status">
              <div @click="batchCredentialsOrder(row.status ? '禁用' : '启用', [row._id])" style="position: relative;">
                <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
                <i-switch size="small" :value="row.status" />
              </div>
            </template>

            <template slot-scope="{ row }" slot="isDefault">
              <div @click="batchCredentialsOrder(row.isDefault ? '取消默认' : '默认', [row._id])" style="position: relative;">
                <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
                <i-switch size="small" :value="row.isDefault" />
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>

    <credentialsOrderForm ref="credentialsOrderForm" @load="loadCredentialsOrder" :credentialsOrderList="credentialsOrderList" :wordsList="wordsList"></credentialsOrderForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import credentialsOrderForm from './form'
import moment from 'moment'
// import NP from 'number-precision'
import {
  queryCredentialsOrder,
  batchCredentialsOrder
} from '../../api/credentialsOrder'
import { queryProofWords } from '../../api/proofWords'
export default {
  name: 'credentialsOrder',
  components: {
    credentialsOrderForm
  },
  data () {
    return {
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
                name: '采购入库单',
                en: 'CGRKD',
                obj: {
                  filesType: '业务单据数',
                  category: '采购管理',
                  orderType: '采购入库单',
                  subjectForm: [
                    '模板自定义科目',
                    '供应商.对应科目',
                    '商品.库存对应科目',
                    '商品.收入对应科目',
                    '商品.成本对应科目',
                    '部门.对应科目',
                    '费用.对应科目',
                    '折扣.对应科目'
                  ],
                  money: [
                    '入库成本',
                    '本单付款合计',
                    '整单折扣额',
                    '采购费用',
                    '税额'
                  ]
                }
              },
              {
                _id: '1-2',
                name: '采购退货单',
                en: 'CGTHD',
                obj: {
                  filesType: '业务单据数',
                  category: '采购管理',
                  orderType: '采购退货单',
                  subjectForm: [
                    '模板自定义科目',
                    '供应商.对应科目',
                    '商品.库存对应科目',
                    '商品.收入对应科目',
                    '商品.成本对应科目',
                    '部门.对应科目',
                    '费用.对应科目',
                    '折扣.对应科目'
                  ],
                  money: [
                    '实际不含税金额',
                    '税额',
                    '整单折扣额',
                    '本单应退账款'
                  ]
                }
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
                name: '销售出库单',
                en: 'XSCKD',
                obj: {
                  filesType: '业务单据数',
                  category: '销售管理',
                  orderType: '销售出库单',
                  subjectForm: [
                    '模板自定义科目',
                    '客户.对应科目',
                    '商品.库存对应科目',
                    '商品.收入对应科目',
                    '商品.成本对应科目',
                    '部门.对应科目',
                    '费用.对应科目',
                    '折扣.对应科目'
                  ],
                  money: [
                    '出库成本',
                    '税额',
                    '整单折扣额',
                    '本单收款合计',
                    '销售费用'
                  ]
                }
              },
              {
                _id: '2-2',
                name: '销售退货单',
                en: 'XSTHD',
                obj: {
                  filesType: '业务单据数',
                  category: '销售管理',
                  orderType: '销售退货单',
                  subjectForm: [
                    '模板自定义科目',
                    '客户.对应科目',
                    '商品.库存对应科目',
                    '商品.收入对应科目',
                    '商品.成本对应科目',
                    '部门.对应科目',
                    '费用.对应科目',
                    '折扣.对应科目'
                  ],
                  money: [
                    '实际不含税金额',
                    '税额',
                    '整单折扣额',
                    '本单应退账款'
                  ]
                }
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
                name: '盘盈单',
                en: 'PYD',
                obj: {
                  filesType: '单据附件数',
                  category: '库存管理',
                  orderType: '盘盈单',
                  subjectForm: [
                    '模板自定义科目',
                    '商品.库存对应科目',
                    '商品.收入对应科目',
                    '商品.成本对应科目'
                  ],
                  money: [
                    '入库成本'
                  ]
                }
              },
              {
                _id: '3-2',
                name: '盘亏单',
                en: 'PKD',
                obj: {
                  filesType: '单据附件数',
                  category: '库存管理',
                  orderType: '盘亏单',
                  subjectForm: [
                    '模板自定义科目',
                    '商品.库存对应科目',
                    '商品.收入对应科目',
                    '商品.成本对应科目'
                  ],
                  money: [
                    '出库成本'
                  ]
                }
              },
              {
                _id: '3-3',
                name: '其他入库单',
                en: 'QTRKD',
                obj: {
                  filesType: '单据附件数',
                  category: '库存管理',
                  orderType: '其他入库单',
                  subjectForm: [
                    '模板自定义科目',
                    '商品.库存对应科目',
                    '商品.收入对应科目',
                    '商品.成本对应科目',
                    '供应商.对应科目',
                    '客户.对应科目',
                    '部门.对应科目'
                  ],
                  money: [
                    '入库成本'
                  ]
                }
              },
              {
                _id: '3-4',
                name: '其他出库单',
                en: 'QTCKD',
                obj: {
                  filesType: '单据附件数',
                  category: '库存管理',
                  orderType: '其他出库单',
                  subjectForm: [
                    '模板自定义科目',
                    '商品.库存对应科目',
                    '商品.收入对应科目',
                    '商品.成本对应科目',
                    '供应商.对应科目',
                    '客户.对应科目',
                    '部门.对应科目'
                  ],
                  money: [
                    '出库成本'
                  ]
                }
              },
              {
                _id: '3-5',
                name: '调拨入库单',
                en: 'DBRKD',
                obj: {
                  filesType: '单据附件数',
                  category: '库存管理',
                  orderType: '调拨入库单',
                  subjectForm: [
                    '模板自定义科目',
                    '商品.库存对应科目',
                    '商品.收入对应科目',
                    '商品.成本对应科目',
                    '供应商.对应科目',
                    '客户.对应科目',
                    '部门.对应科目'
                  ],
                  money: [
                    '调入成本'
                  ]
                }
              },
              {
                _id: '3-6',
                name: '调拨出库单',
                en: 'DBCKD',
                obj: {
                  filesType: '单据附件数',
                  category: '库存管理',
                  orderType: '调拨出库单',
                  subjectForm: [
                    '模板自定义科目',
                    '商品.库存对应科目',
                    '商品.收入对应科目',
                    '商品.成本对应科目',
                    '供应商.对应科目',
                    '客户.对应科目',
                    '部门.对应科目'
                  ],
                  money: [
                    '调出成本'
                  ]
                }
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
                name: '收款单',
                en: 'SKD',
                obj: {
                  filesType: '单据附件数',
                  category: '应收应付',
                  orderType: '收款单',
                  subjectForm: [
                    '模板自定义科目',
                    '客户.对应科目',
                    '部门.对应科目',
                    '银行账号.对应科目',
                    '收入类别.对应科目'
                  ],
                  money: [
                    '收款金额合计',
                    '优惠金额',
                    '实际收款金额合计'
                  ]
                }
              },
              {
                _id: '4-2',
                name: '付款单',
                en: 'FKD',
                obj: {
                  filesType: '单据附件数',
                  category: '应收应付',
                  orderType: '付款单',
                  subjectForm: [
                    '模板自定义科目',
                    '供应商.对应科目',
                    '部门.对应科目',
                    '银行账号.对应科目',
                    '支出类别.对应科目'
                  ],
                  money: [
                    '付款金额合计',
                    '优惠金额',
                    '实际付款金额合计'
                  ]
                }
              },
              {
                _id: '4-3',
                name: '预收款单',
                en: 'YSKD',
                obj: {
                  filesType: '单据附件数',
                  category: '应收应付',
                  orderType: '预收款单',
                  subjectForm: [
                    '模板自定义科目',
                    '客户.对应科目',
                    '部门.对应科目',
                    '银行账号.对应科目',
                    '收入类别.对应科目'
                  ],
                  money: [
                    '收款金额合计'
                  ]
                }
              },
              {
                _id: '4-4',
                name: '预付款单',
                en: 'YFKD',
                obj: {
                  filesType: '单据附件数',
                  category: '应收应付',
                  orderType: '预付款单',
                  subjectForm: [
                    '模板自定义科目',
                    '供应商.对应科目',
                    '部门.对应科目',
                    '银行账号.对应科目',
                    '支出类别.对应科目'
                  ],
                  money: [
                    '付款金额合计'
                  ]
                }
              },
              {
                _id: '4-5',
                name: '预收退款单',
                en: 'YSTKD',
                obj: {
                  filesType: '单据附件数',
                  category: '应收应付',
                  orderType: '预收退款单',
                  subjectForm: [
                    '模板自定义科目',
                    '客户.对应科目',
                    '部门.对应科目',
                    '银行账号.对应科目',
                    '收入类别.对应科目'
                  ],
                  money: [
                    '退款金额合计'
                  ]
                }
              },
              {
                _id: '4-6',
                name: '预付退款单',
                en: 'YFTKD',
                obj: {
                  filesType: '单据附件数',
                  category: '应收应付',
                  orderType: '预付退款单',
                  subjectForm: [
                    '模板自定义科目',
                    '供应商.对应科目',
                    '部门.对应科目',
                    '银行账号.对应科目',
                    '支出类别.对应科目'
                  ],
                  money: [
                    '退款金额合计'
                  ]
                }
              },
              {
                _id: '4-7',
                name: '其他应收单',
                en: 'QTYSD',
                obj: {
                  filesType: '单据附件数',
                  category: '应收应付',
                  orderType: '其他应收单',
                  subjectForm: [
                    '模板自定义科目',
                    '客户.对应科目',
                    '部门.对应科目',
                    '银行账号.对应科目',
                    '收入类别.对应科目'
                  ],
                  money: [
                    '应收金额合计',
                    '优惠金额',
                    '实际收款金额合计'
                  ]
                }
              },
              {
                _id: '4-8',
                name: '其他应付单',
                en: 'QTYFD',
                obj: {
                  filesType: '单据附件数',
                  category: '应收应付',
                  orderType: '其他应付单',
                  subjectForm: [
                    '模板自定义科目',
                    '供应商.对应科目',
                    '部门.对应科目',
                    '银行账号.对应科目',
                    '支出类别.对应科目'
                  ],
                  money: [
                    '应付金额合计',
                    '优惠金额',
                    '实际付款金额合计'
                  ]
                }
              },
              {
                _id: '4-9',
                name: '核销单',
                en: 'HXD',
                obj: {
                  filesType: '单据附件数',
                  category: '应收应付',
                  orderType: '核销单',
                  subjectForm: [
                    '模板自定义科目',
                    '客户.对应科目',
                    '供应商.对应科目',
                    '部门.对应科目'
                  ],
                  money: [
                    '本次核销金额合计'
                  ]
                }
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
          title: '编号',
          width: 150,
          slot: 'code',
          resizable: true
        },
        {
          title: '名称',
          width: 150,
          key: 'name',
          resizable: true
        },
        {
          title: '凭证字',
          width: 150,
          slot: 'proofWordId',
          resizable: true
        },
        {
          title: '业务单元',
          width: 150,
          key: 'category',
          resizable: true
        },
        {
          title: '单据来源',
          width: 150,
          key: 'orderType',
          resizable: true
        },
        {
          title: '更新日期',
          width: 150,
          slot: 'updateAt',
          resizable: true
        },
        {
          title: '创建人',
          width: 150,
          slot: 'creator',
          resizable: true
        },
        {
          title: '状态',
          width: 150,
          slot: 'status',
          resizable: true
        },
        {
          title: '是否默认',
          width: 150,
          slot: 'isDefault',
          resizable: true
        },
        {
          title: ' '
        }
      ],
      credentialsOrderList: [],
      wordsList: []
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
    tableData () {
      let list = this.credentialsOrderList
      if (this.selectGroup.includes('-')) {
        let group = this.selectGroup.split('-')
        list = this.credentialsOrderList.filter(f => f.orderType === this.groupList[0].children[group[0] - 1].children[group[1] - 1].name)
      } else if (this.selectGroup.length) {
        list = this.credentialsOrderList.filter(f => f.category === this.groupList[0].children[this.selectGroup - 1].name)
      }
      if (this.selectList.length) {
        list.forEach(f => {
          if (this.selectList.includes(f._id)) {
            f._checked = true
          }
        })
      }
      return list
    },
    getTableHeight () {
      return window.innerHeight - 200
    },
    getTableWidth () {
      return window.innerWidth - 110 - (this.isExpand ? 230 : 10)
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadCredentialsOrder()
          this.loadProofWords()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '业务凭证模板') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}业务凭证模板的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadCredentialsOrder () {
      this.loading = true
      queryCredentialsOrder({ accountSetId: this.accountSet._id }).then(res => {
        this.credentialsOrderList = res.data
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '业务凭证模板',
          desc: err.message
        })
      })
    },
    loadProofWords () {
      queryProofWords({ accountSetId: this.accountSet._id }).then(res => {
        this.wordsList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '凭证字',
          desc: err.message
        })
      })
    },
    setCredentialsOrder (title, item) {
      if (!this.judge(title)) return
      let formData = item ? Object.assign({}, item) : {}
      let group = null
      let fData = null
      if (item) {
        group = this.groupList[0].children.find(f => f.name === item.category)
        fData = group.children.find(f => f.name === item.orderType)
      } else {
        group = this.selectGroup.split('-')
        fData = this.groupList[0].children[group[0] - 1].children[group[1] - 1]
      }
      if (title === '新增') {
        let codeSort = this.credentialsOrderList.filter(f => f.orderType === fData.name).sort((a, b) => a.code.split('-')[1] - b.code.split('-')[1])
        let number = codeSort.length ? codeSort[codeSort.length - 1].code.split('-')[1] + 1 : 1
        let pad = '0000'
        number = pad.substring(0, pad.length - number.toString().length) + number
        let defaultProof = this.wordsList.find(v => v.defaultValue === '是') || (this.wordsList.length ? this.wordsList[0] : null)
        let list = fData.obj.money.map(v => {
          return {
            subjectForm: '模板自定义科目',
            subjectCode: null,
            balance: '借',
            number: '无',
            price: '无',
            rate: 1,
            money: v
          }
        })
        if (list.length === 1) list = list.concat(list)
        formData = {
          accountSetId: this.accountSet._id,
          code: fData.en + '-' + number,
          name: fData.name,
          proofWordId: defaultProof._id,
          dateTime: '单据日期',
          filesType: fData.obj.filesType,
          des: null,
          orderType: fData.obj.orderType,
          list: list,
          category: fData.obj.category,
          creator: this.myUser._id,
          status: true,
          isDefault: false
        }
      }
      this.$refs.credentialsOrderForm.show(title, formData, fData.obj)
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchCredentialsOrder (action, list) {
      if (!this.judge(action === '取消默认' ? '默认' : action)) return
      this.$Modal.confirm({
        title: `${action}业务凭证模板`,
        content: `是否${action}所选业务凭证模板`,
        onOk: () => {
          batchCredentialsOrder({
            ids: list,
            action: action
          }).then(res => {
            this.$Message.success(`成功${action}所选业务凭证模板`)
            this.loadCredentialsOrder()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
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
