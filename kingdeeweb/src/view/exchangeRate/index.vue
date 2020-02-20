<template>
  <Card shadow style="height: 100%; overflow:hidden;" class="mu_card">
    <Row type="flex" justify="space-between">
      <Button type="success" style="margin: 0 10px 10px 0;" @click="setType('add', null)">新建汇率类型</Button>
      <Button type="success" style="margin: 0 0 10px;" v-show="selectType !== '0'" @click="setType('addRate')">新建汇率</Button>
    </Row>

    <div class="mu_c">
      <Split v-model="splitLeft">
        <div slot="left" style="height: 100%; display: flex; flex-direction: column;">
          <div style="background: #f8f8f9; height: 40px; line-height: 40px; padding-left: 10px;">
            汇率类型
          </div>
          <div style="flex-grow: 1; overflow: auto;">
            <div style="padding: 0 0 20px 5px; overflow: hidden;">
              <Tree :data="typeData" :render="typeContent" style="margin-left: 5px;"></Tree>
            </div>
          </div>
        </div>

        <div slot="right" style="width: 100%; height: 100%; padding: 0 0 0 2px; display: flex;" ref="rateLayer">
          <Table border ref="userTable" :columns="selectType === '0' ? typeColumns : rateColumns" :data="tableData" :height="$refs.rateLayer && $refs.rateLayer.offsetHeight" style="width: 100%">
            <template slot-scope="{ row }" slot="action">
              <template v-if="selectType === '0'">
                <Button type="success" size="small" style="margin-right: 5px" @click="setType('addRate', row)">新建汇率</Button>
                <Button type="primary" size="small" style="margin-right: 5px" @click="setType('edit', row)">修改</Button>
                <Button type="error" size="small" style="margin-right: 5px" @click="setType('delete', row)">删除</Button>
              </template>

              <template v-else>
                <template v-if="!row.auditId">
                  <template v-if="row.status === '启用'">
                    <Button type="primary" size="small" style="margin-right: 5px" @click="setRate('edit', row)">修改</Button>
                    <Button type="success" size="small" style="margin-right: 5px"  @click="setRate('audit', row)">审核</Button>
                    <Button type="warning" size="small" style="margin-right: 5px"  @click="setRate('stop', row)">禁用</Button>
                  </template>
                  <template v-else>
                    <Button type="success" size="small" style="margin-right: 5px" @click="setRate('unstop', row)">启用</Button>
                    <Button type="error" size="small" @click="setRate('delete', row)">删除</Button>
                  </template>
                </template>
                <Button type="error" size="small" style="margin-right: 5px" v-else @click="setRate('unAudit', row)">反审核</Button>
              </template>
            </template>
          </Table>
        </div>
      </Split>
    </div>

    <rateForm ref="rateForm" @load="loadRate" :rateList="rateList"></rateForm>
    <typeForm ref="typeForm" @load="loadType"></typeForm>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import rateForm from './rateForm'
import typeForm from './typeForm'
import moment from 'moment'
import {
  updateExchangeRate,
  queryExchangeRate,
  deleteExchangeRate,
  queryExchangeRateType,
  deleteExchangeRateType
} from '../../api/exchangeRate'
import { currencyQuery } from '../../api/currency'
export default {
  name: 'index',
  components: {
    rateForm,
    typeForm
  },
  data () {
    return {
      splitLeft: 0.2,
      currencyList: [],
      typeList: [],
      selectType: '0',
      typeData: [{
        name: '汇率体系',
        expand: true,
        _id: '0',
        render: (h, { root, node, data }) => {
          return h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            }
          }, [
            h('span', {
              style: {
                display: 'inline-block',
                lineHeight: '24px',
                padding: '0 5px',
                cursor: 'pointer',
                background: this.selectType === data._id ? '#d5e8fc' : 'none'
              },
              on: {
                click: () => { this.selectType = data._id }
              }
            }, data.name),
            h('span', {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
              }
            }, [
              h('Tooltip', {
                props: {
                  content: '新建汇率类型',
                  placement: 'bottom'
                }
              }, [
                h('Button', {
                  props: {
                    size: 'small',
                    icon: 'ios-add',
                    type: 'primary'
                  },
                  style: {
                    width: '100px'
                  },
                  on: {
                    click: () => { this.setType('add', data) }
                  }
                })
              ])
            ])
          ])
        },
        children: []
      }],
      typeColumns: [
        {
          title: '编码',
          key: 'code'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '汇率精度',
          key: 'rate'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      rateColumns: [
        {
          title: '币别编码',
          render: (h, params) => {
            let code = this.currencyList.find(v => v._id === params.row.currencyId).code
            return h('div', code)
          }
        },
        {
          title: '币别名称',
          render: (h, params) => {
            let name = this.currencyList.find(v => v._id === params.row.currencyId).name
            return h('div', name)
          }
        },
        {
          title: '汇率',
          key: 'rate'
        },
        {
          title: '生效日期',
          render: (h, params) => {
            return h('div', moment(params.row.effectiveDate).format('YYYY-MM-DD'))
          }
        },
        {
          title: '失效日期',
          render: (h, params) => {
            return h('div', moment(params.row.expiryDate).format('YYYY-MM-DD'))
          }
        },
        {
          title: '审批人',
          render: (h, params) => {
            let info = params.row.auditId ? this.userList.find(v => v._id === params.row.auditId) : {}
            return h('div', info.name || '')
          }
        },
        {
          title: '状态',
          key: 'status'
        },
        {
          title: '操作',
          slot: 'action',
          width: 300
        }
      ],
      rateList: []
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
      let list
      if (this.selectType === '0') {
        list = this.typeList
      } else {
        list = this.rateList.filter(v => v.typeId === this.selectType)
      }
      return list
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadType()
          this.loadRate()
          this.loadCurrency()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    typeContent (h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span', {
          style: {
            display: 'inline-block',
            lineHeight: '24px',
            padding: '0 5px',
            cursor: 'pointer',
            background: this.selectType === data._id ? '#d5e8fc' : 'none'
          },
          on: {
            click: () => {
              this.selectType = data._id
            }
          }
        }, `${data.code}（${data.name}）`),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px'
          }
        }, [
          h('Tooltip', {
            props: {
              content: '新建汇率',
              placement: 'top'
            }
          }, [
            h('Button', {
              props: {
                type: 'default',
                size: 'small',
                icon: 'ios-add'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => { this.setType('addRate', data) }
              }
            })
          ]),
          h('Tooltip', {
            props: {
              content: '修改',
              placement: 'top'
            }
          }, [
            h('Button', {
              props: {
                type: 'default',
                size: 'small',
                icon: 'md-settings'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => { this.setType('edit', data) }
              }
            })
          ]),
          h('Tooltip', {
            props: {
              content: '删除',
              placement: 'top'
            }
          }, [
            h('Button', {
              props: {
                type: 'default',
                size: 'small',
                icon: 'ios-remove'
              },
              on: {
                click: () => { this.setType('delete', data) }
              }
            })
          ])
        ])
      ])
    },
    loadType () {
      queryExchangeRateType({ accountSetId: this.accountSet._id }).then(res => {
        console.log('queryExchangeRateType', res.data)
        this.typeData[0].children = res.data
        this.typeList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '汇率类型',
          desc: err.message
        })
      })
    },
    judge () {
      // let bool = true
      // if (this.myUser.role === 'accountSet' && !this.adminList.includes(this.myUser._id)) {
      //   let pData = this.myPermission.feature.find(v => v.title === '基础资料')
      //   if (pData.children.filter(v => v.title === '管理权' && !v.checked).length) {
      //     this.$Notice.error({
      //       title: `公共资料-汇率体系`,
      //       desc: '您只有查看权，没有管理权，请联系管理员'
      //     })
      //     bool = false
      //   }
      // }
      return true
    },
    setType (type, item) {
      if (!this.judge()) return
      let formData
      switch (type) {
        case 'add':
          formData = {
            accountSetId: this.accountSet._id
          }
          this.$refs.typeForm.show('新建', null, this.typeList, formData)
          break
        case 'addRate':
          formData = {
            accountSetId: this.accountSet._id,
            typeId: item ? item._id : this.selectType
          }
          this.setRate('add', formData)
          break
        case 'edit':
          formData = Object.assign({}, item)
          this.$refs.typeForm.show('修改', formData, this.typeList)
          break
        case 'delete':
          this.$Modal.confirm({
            title: '删除汇率类型',
            content: `是否删除汇率类型：${item.name}`,
            onOk: () => {
              if (this.rateList.filter(v => v.typeId === item._id).length) {
                this.$Notice.error({
                  title: '删除汇率类型',
                  desc: '该汇率类型包含明细汇率，不能删除。'
                })
              } else {
                deleteExchangeRateType({
                  id: item._id
                }).then(res => {
                  this.$Notice.success({
                    title: '汇率类型',
                    desc: `成功删除汇率类型：${item.name}`
                  })
                  this.loadType()
                }).catch(err => {
                  this.$Notice.error({
                    title: '汇率类型',
                    desc: err.message
                  })
                })
              }
            }
          })
          break
      }
    },
    loadRate () {
      queryExchangeRate({ accountSetId: this.accountSet._id }).then(res => {
        console.log('queryExchangeRate', res.data)
        this.rateList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '汇率',
          desc: err.message
        })
      })
    },
    setRate (type, item) {
      if (!this.judge()) return
      let formData = Object.assign({}, item)
      let currency = this.currencyList.find(v => v._id === formData.currencyId)
      switch (type) {
        case 'add':
          this.$refs.rateForm.show('新建', null, this.typeList.find(v => v._id === item.typeId).rate, this.currencyList, formData)
          break
        case 'edit':
          formData.code = currency.code
          this.$refs.rateForm.show('修改', formData, this.typeList.find(v => v._id === item.typeId).rate, this.currencyList, null)
          break
        case 'audit':
        case 'unAudit':
          this.$Modal.confirm({
            title: '汇率',
            content: `通过${type === 'audit' ? '审核' : '反审核'}`,
            onOk: () => {
              formData.auditId = type === 'audit' ? this.myUser._id : null
              this.updateRate(formData)
            }
          })
          break
        case 'stop':
        case 'unstop':
          let status = type === 'stop' ? '禁用' : '启用'
          this.$Modal.confirm({
            title: '汇率',
            content: `是否${status}${currency.name}`,
            onOk: () => {
              formData.status = status
              this.updateRate(formData)
            }
          })
          break
        case 'delete':
          this.$Modal.confirm({
            title: '删除汇率',
            content: `是否删除汇率：${currency.name}`,
            onOk: () => {
              deleteExchangeRate({
                id: item._id
              }).then(res => {
                this.$Notice.success({
                  title: '汇率',
                  desc: `成功删除汇率：${currency.name}`
                })
                this.loadRate()
              }).catch(err => {
                this.$Notice.error({
                  title: '汇率',
                  desc: err.message
                })
              })
            }
          })
          break
      }
    },
    updateRate (formData) {
      updateExchangeRate(formData).then(res => {
        this.loadRate()
      }).catch(err => {
        this.$Notice.error({
          title: '汇率',
          desc: err.message
        })
      })
    },
    loadCurrency () {
      currencyQuery({
        accountSetId: this.accountSet._id
      }).then(res => {
        this.currencyList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '币别',
          desc: err.message
        })
      })
    }
  }
}
</script>

<style lang="less">
  .mu_card  .ivu-card-body {
    display: flex;
    flex-direction: column;
    height: 100%;

    .mu_c {
      flex-grow: 1;
      position: relative;
      border: 1px solid #ccc;
    }

    .ivu-split-wrapper {
      position: absolute;
    }

    .ivu-split-horizontal {
      height: 100%;
    }

    .ivu-split-trigger-con {
      width: 6px;
      height: 100%;
    }
  }
</style>
