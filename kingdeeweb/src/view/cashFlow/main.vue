<template>
  <div style="width: 100%; height: 100%;  display: flex; flex-direction: column;">
    <Row type="flex" justify="space-between" v-if="$route.name === 'cashFlowIndex'">
      <Button type="success" style="margin: 0 10px 10px 0;" @click="setCash('add', null)">新增现金流量</Button>
    </Row>

    <div class="mu_c">
      <Split v-model="splitLeft">
        <div slot="left" style="height: 100%; display: flex; flex-direction: column;">
          <div style="background: #f8f8f9; height: 40px; line-height: 40px; padding-left: 10px;">
            现金流量项目
          </div>
          <div style="flex-grow: 1; overflow: auto;">
            <div style="padding: 0 0 20px 5px; overflow: hidden;">
              <Tree :data="groupData" :render="groupContent" style="margin-left: 5px;"></Tree>
            </div>
          </div>
        </div>

        <div slot="right" style="width: 100%; height: 100%; padding: 0 0 0 2px; display: flex;" ref="cashLayer">
          <Table border ref="userTable" :columns="cashColumns" :data="tableData" :height="$refs.cashLayer && $refs.cashLayer.offsetHeight" style="width: 100%">
            <template slot-scope="{ row }" slot="action">
              <template v-if="!row.audit">
                <template v-if="row.status === '启用'">
                  <Button type="primary" size="small" style="margin-right: 5px" @click="setCash('edit', row)">修改</Button>
                  <Button type="success" size="small" style="margin-right: 5px"  @click="setCash('audit', row)">审核</Button>
                  <Button type="warning" size="small" style="margin-right: 5px"  @click="setCash('stop', row)">禁用</Button>
                </template>
                <template v-else>
                  <Button type="success" size="small" style="margin-right: 5px" @click="setCash('unstop', row)">启用</Button>
                  <Button type="error" size="small" @click="setCash('delete', row)">删除</Button>
                </template>
              </template>
              <Button type="error" size="small" style="margin-right: 5px" v-else @click="setCash('unAudit', row)">反审核</Button>
            </template>
          </Table>
        </div>
      </Split>
    </div>

    <cashForm ref="cashForm" @load="load"></cashForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cashForm from './form'
import moment from 'moment'
import {
  updateCashFlow,
  queryCashFlow,
  deleteCashFlow
} from '../../api/cashFlow'
export default {
  name: 'index',
  components: {
    cashForm
  },
  data () {
    return {
      splitLeft: 0.2,
      selectGroup: '0',
      groupData: [{
        name: '现金流量项目',
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
                background: this.selectGroup === data._id ? '#d5e8fc' : 'none'
              },
              on: {
                click: () => { this.selectGroup = data._id }
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
                  content: '新增现金流量',
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
                    click: () => { this.setCash('add', null) }
                  }
                })
              ])
            ])
          ])
        },
        children: []
      }],
      cashColumns: [
        {
          title: '编码',
          key: 'code',
          width: 100,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '名称',
          key: 'name',
          width: 200,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '全名',
          width: 300,
          align: 'center',
          render: (h, params) => {
            let name = params.row.name
            if (params.row.pSecondId) {
              name = this.cashList.find(v => v._id === params.row.pSecondId).name + '_' + name
            }
            if (params.row.pFirstId) {
              name = this.cashList.find(v => v._id === params.row.pFirstId).name + '_' + name
            }
            return h('div', name)
          }
        },
        {
          title: '审核人',
          width: 180,
          align: 'center',
          render: (h, params) => {
            let info = params.row.audit ? this.userList.find(v => v._id === params.row.audit) : {}
            return h('div', info.name || '')
          }
        },
        {
          title: '创建时间',
          width: 180,
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.createdAt && moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'))
          }
        },
        {
          title: '创建人',
          width: 180,
          align: 'center',
          render: (h, params) => {
            let info = params.row.creator ? this.userList.find(v => v._id === params.row.creator) : {}
            return h('div', info.name || '')
          }
        },
        {
          title: '修改时间',
          width: 180,
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.editTime && moment(params.row.editTime).format('YYYY-MM-DD HH:mm:ss'))
          }
        },
        {
          title: '修改人',
          width: 180,
          align: 'center',
          render: (h, params) => {
            let info = params.row.editor ? this.userList.find(v => v._id === params.row.editor) : {}
            return h('div', info.name || '')
          }
        },
        {
          title: '禁用(启用)时间',
          width: 180,
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.statusTime && moment(params.row.statusTime).format('YYYY-MM-DD HH:mm:ss'))
          }
        },
        {
          title: '禁用(启用)人',
          width: 180,
          align: 'center',
          render: (h, params) => {
            let info = params.row.statusId ? this.userList.find(v => v._id === params.row.statusId) : {}
            return h('div', info.name || '')
          }
        },
        {
          title: '状态',
          key: 'status',
          width: 80,
          align: 'center',
          fixed: 'right'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center',
          fixed: 'right'
        }
      ],
      cashList: []
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
      if (this.selectGroup === '0') {
        list = this.cashList.filter(v => !v.pFirstId && !v.pSecondId)
      } else {
        let fData = this.cashList.find(v => v._id === this.selectGroup)
        if (!fData.pFirstId && !fData.pSecondId) {
          list = this.cashList.filter(v => v.pFirstId === fData._id && !v.pSecondId)
        } else if (fData.pFirstId && !fData.pSecondId) {
          list = this.cashList.filter(v => v.pSecondId === fData._id)
        }
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
    }
  },
  methods: {
    groupContent (h, { root, node, data }) {
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
            background: this.selectGroup === data._id ? '#d5e8fc' : 'none',
            maxWidth: '50%',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: data.children ? '' : 'hidden'
          },
          on: {
            click: () => {
              this.selectGroup = data._id
            }
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
              content: '新增现金流量',
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
                click: () => { this.setCash('add', data) }
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
                click: () => { this.setCash('edit', data) }
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
                click: () => { this.setCash('delete', data) }
              }
            })
          ])
        ])
      ])
    },
    load () {
      queryCashFlow({ accountSetId: this.accountSet._id }).then(res => {
        console.log('queryCashFlow', res.data)
        let list = []
        res.data.forEach(v => {
          if (!v.pFirstId && !v.pSecondId) {
            let cData = Object.assign({}, v)
            cData.children = res.data.filter(r => r.pFirstId === v._id && !r.pSecondId)
            cData.expand = true
            list.push(cData)
          }
        })
        this.groupData[0].children = list
        this.cashList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '现金流量项目',
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
      //       title: `公共资料-现金流量项目`,
      //       desc: '您只有查看权，没有管理权，请联系管理员'
      //     })
      //     bool = false
      //   }
      // }
      return true
    },
    setCash (type, item) {
      if (!this.judge()) return
      let formData = item ? Object.assign({}, item) : {}
      let name = ''
      switch (type) {
        case 'add':
          formData = {
            accountSetId: this.accountSet._id,
            creator: this.myUser._id
          }
          if (item) {
            if (item.pFirstId) {
              formData.pFirstId = item.pFirstId
              formData.pSecondId = item._id
              name = `${this.cashList.find(v => v._id === item.pFirstId).name}_${item.name}_`
            } else {
              formData.pFirstId = item._id
              name = `${item.name}_`
            }
          }
          this.$refs.cashForm.show('新建', null, this.cashList, name, formData)
          break
        case 'edit':
          formData.editor = this.myUser._id
          formData.editTime = new Date()
          if (formData.pFirstId) name = `${this.cashList.find(v => v._id === formData.pFirstId).name}_`
          if (formData.pSecondId) name += `${this.cashList.find(v => v._id === formData.pSecondId).name}_`
          this.$refs.cashForm.show('修改', formData, this.cashList, name)
          break
        case 'audit':
        case 'unAudit':
          this.$Modal.confirm({
            title: '现金流量项目',
            content: `是否${type === 'audit' ? '审核' : '反审核'}${item.name}${type === 'audit' ? '，审核后该现金流量项目的所有直接上级项目都会被自动审核，是否继续？' : ''}`,
            onOk: () => {
              formData.audit = type === 'audit' ? this.myUser._id : null
              this.update(formData)
            }
          })
          break
        case 'stop':
        case 'unstop':
        case 'delete':
          let title = type === 'delete' ? '删除' : type === 'stop' ? '禁用' : '启用'
          if (item && item.audit) {
            this.$Notice.error({
              title: '现金流量项目',
              desc: `该现金流量项目已审核，无法${title}`
            })
          } else if (item && !item.isEdit) {
            this.$Notice.error({
              title: '现金流量项目',
              desc: `系统预设现金流量项目无法${title}`
            })
          } else {
            let fList = this.cashList.filter(v => v.pFirstId === item._id)
            let sList = this.cashList.filter(v => v.pSecondId === item._id)
            if (fList.length || sList.length) {
              this.$Notice.error({
                title: '现金流量项目',
                desc: `该现金流量项目包含其他明细，无法${title}`
              })
            } else {
              if (type === 'delete') {
                this.$Modal.confirm({
                  title: '删除现金流量项目',
                  content: `确定是否删除现金流量项目：${item.name}`,
                  onOk: () => {
                    deleteCashFlow({
                      id: item._id
                    }).then(res => {
                      this.$Notice.success({
                        title: '现金流量项目',
                        desc: `成功删除现金流量项目：${item.name}`
                      })
                      this.load()
                    }).catch(err => {
                      this.$Notice.error({
                        title: '现金流量项目',
                        desc: err.message
                      })
                    })
                  }
                })
              } else {
                this.$Modal.confirm({
                  title: '现金流量项目',
                  content: `是否${title}${item.name}`,
                  onOk: () => {
                    formData.status = title
                    formData.statusId = this.myUser._id
                    formData.statusTime = new Date()
                    this.update(formData)
                  }
                })
              }
            }
          }
          break
      }
    },
    update (formData) {
      updateCashFlow(formData).then(res => {
        this.load()
      }).catch(err => {
        this.$Notice.error({
          title: '现金流量项目',
          desc: err.message
        })
      })
    }
  }
}
</script>
