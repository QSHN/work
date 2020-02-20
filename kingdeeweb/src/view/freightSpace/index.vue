<template>
  <Card shadow style="height: 100%; overflow:hidden;" class="mu_card">
    <Row type="flex" justify="space-between">
      <Button type="success" style="margin: 0 10px 10px 0;" @click="setGroup('add', null)">新建仓位组</Button>
      <Button type="success" style="margin: 0 0 10px;" v-show="selectGroup !== '0'" @click="setGroup('addFreight')">新建仓位</Button>
    </Row>

    <div class="mu_c">
      <Split v-model="splitLeft">
        <div slot="left" style="height: 100%; display: flex; flex-direction: column;">
          <div style="background: #f8f8f9; height: 40px; line-height: 40px; padding-left: 10px;">
            新建仓位组
          </div>
          <div style="flex-grow: 1; overflow: auto;">
            <div style="padding: 0 0 20px 5px; overflow: hidden;">
              <Tree :data="groupData" :render="groupContent" style="margin-left: 5px;"></Tree>
            </div>
          </div>
        </div>

        <div slot="right" style="width: 100%; height: 100%; padding: 0 0 0 2px; display: flex;" ref="freightLayer">
          <Table border ref="userTable" :columns="selectGroup === '0' ? groupColumns : freightColumns" :data="tableData" :height="$refs.freightLayer && $refs.freightLayer.offsetHeight" style="width: 100%">
            <template slot-scope="{ row }" slot="action">
              <template v-if="selectGroup === '0'">
                <Button type="success" size="small" style="margin-right: 5px" @click="setGroup('addFreight', row)">添加仓位</Button>
                <Button type="primary" size="small" style="margin-right: 5px" @click="setGroup('edit', row)">修改</Button>
                <Button type="error" size="small" style="margin-right: 5px" @click="setGroup('delete', row)">删除</Button>
              </template>

              <template v-else>
                <Button type="primary" size="small" style="margin-right: 5px" @click="setFreight('edit', row)">修改</Button>
                <Button type="success" size="small" v-if="row.status === '已删除'" @click="setFreight('recover', row)">恢复</Button>
                <template v-else>
                  <Button type="warning" size="small" style="margin-right: 5px" v-if="row.status === '启用'" @click="setFreight('stop', row)">禁用</Button>
                  <Button type="success" size="small" style="margin-right: 5px" v-else @click="setFreight('unstop', row)">启用</Button>
                  <Button type="error" size="small" v-if="row.status === '禁用'" @click="setFreight('delete', row)">删除</Button>
                </template>
              </template>
            </template>
          </Table>
        </div>
      </Split>
    </div>

    <freightForm ref="freightForm" @load="loadFreight"></freightForm>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import freightForm from './form'
import {
  updateFreightSpace,
  queryFreightSpace,
  updateFreightSpaceGroup,
  queryFreightSpaceGroup,
  deleteFreightSpaceGroup
} from '../../api/freightSpace'
export default {
  name: 'index',
  components: {
    freightForm
  },
  data () {
    return {
      splitLeft: 0.2,
      groupList: [],
      selectGroup: '0',
      groupData: [{
        name: '仓位组',
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
                  content: '新建仓位组',
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
                    click: () => { this.setGroup('add', data) }
                  }
                })
              ])
            ])
          ])
        },
        children: []
      }],
      groupColumns: [
        {
          title: '仓位组编码',
          key: 'code'
        },
        {
          title: '仓位组名称',
          key: 'name'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      freightColumns: [
        {
          title: '仓位编码',
          key: 'code'
        },
        {
          title: '仓位名称',
          key: 'name'
        },
        {
          title: '全名',
          render: (h, params) => {
            let name = this.groupList.find(v => v._id === params.row.groupId).name + '_' + params.row.name
            return h('div', name)
          }
        },
        {
          title: '备注',
          key: 'des'
        },
        {
          title: '默认仓位',
          render: (h, params) => {
            return h('div', params.row.isDefault ? '是' : '')
          }
        },
        {
          title: '包含子仓位',
          render: (h, params) => {
            return h('div', params.row.isChild ? '是' : '')
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
      freightList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList'
    ]),
    tableData () {
      let list
      if (this.selectGroup === '0') {
        list = this.groupList
      } else {
        list = this.freightList.filter(v => v.groupId === this.selectGroup)
      }
      return list
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadGroup()
          this.loadFreight()
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
            background: this.selectGroup === data._id ? '#d5e8fc' : 'none'
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
              content: '新建仓位',
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
                click: () => { this.setGroup('addFreight', data) }
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
                click: () => { this.setGroup('edit', data) }
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
                click: () => { this.setGroup('delete', data) }
              }
            })
          ])
        ])
      ])
    },
    loadGroup () {
      queryFreightSpaceGroup({ accountSetId: this.accountSet._id }).then(res => {
        console.log('queryFreightSpaceGroup', res.data)
        this.groupData[0].children = res.data
        this.groupList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '仓位组',
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
      //       title: `公共资料-仓位`,
      //       desc: '您只有查看权，没有管理权，请联系管理员'
      //     })
      //     bool = false
      //   }
      // }
      return true
    },
    setGroup (type, item) {
      if (!this.judge()) return
      let formData
      let edit = (title, info) => {
        let newObj = Object.assign({}, info)
        this.$Modal.confirm({
          title: `${title}仓位组`,
          render: (h) => {
            return h('div', [
              h('Input', {
                props: {
                  value: newObj.code,
                  autofocus: true,
                  placeholder: '输入仓位组编码'
                },
                style: {
                  marginTop: '10px'
                },
                on: {
                  input: (val) => {
                    newObj.code = val
                  }
                }
              }),
              h('Input', {
                props: {
                  value: newObj.name,
                  placeholder: '输入仓位组名称'
                },
                style: {
                  marginTop: '20px'
                },
                on: {
                  input: (val) => {
                    newObj.name = val
                  }
                }
              })
            ])
          },
          onOk: () => {
            if (newObj.code && newObj.name) {
              if (newObj.code !== formData.code && this.groupList.filter(v => v.code.trim() === newObj.code.trim()).length) {
                this.$Notice.error({
                  title: `${title}仓位组`,
                  desc: `已存在该仓位组编码，无法${title}`
                })
              } else if (newObj.name !== formData.name && this.groupList.filter(v => v.name.trim() === newObj.name.trim()).length) {
                this.$Notice.error({
                  title: `${title}仓位组`,
                  desc: `已存在该仓位组名称，无法${title}`
                })
              } else {
                formData = newObj
                updateFreightSpaceGroup(formData).then(res => {
                  this.$Notice.success({
                    title: '仓位组',
                    desc: `成功${title}仓位组：${formData.name}`
                  })
                  this.loadGroup()
                }).catch(err => {
                  this.$Notice.error({
                    title: '仓位组',
                    desc: err.message
                  })
                })
              }
            } else {
              this.$Notice.error({
                title: `${title}仓位组`,
                desc: '仓位组编码和仓位组名称都是必填'
              })
            }
          }
        })
      }
      switch (type) {
        case 'add':
          formData = {
            accountSetId: this.accountSet._id,
            code: '',
            name: ''
          }
          edit('新增', formData)
          break
        case 'addFreight':
          formData = {
            accountSetId: this.accountSet._id,
            groupId: item ? item._id : this.selectGroup
          }
          this.setFreight('add', formData)
          break
        case 'edit':
          formData = Object.assign({}, item)
          edit('修改', formData)
          break
        case 'delete':
          this.$Modal.confirm({
            title: '删除仓位组',
            content: `是否删除仓位组：${item.name}`,
            onOk: () => {
              if (this.freightList.filter(v => v.groupId === item._id).length) {
                this.$Notice.error({
                  title: '删除仓位组',
                  desc: '该仓位组包含明细仓位，不能删除。'
                })
              } else {
                deleteFreightSpaceGroup({
                  id: item._id
                }).then(res => {
                  this.$Notice.success({
                    title: '仓位组',
                    desc: `成功删除仓位组：${item.name}`
                  })
                  this.loadGroup()
                }).catch(err => {
                  this.$Notice.error({
                    title: '仓位组',
                    desc: err.message
                  })
                })
              }
            }
          })
          break
      }
    },
    loadFreight () {
      queryFreightSpace({ accountSetId: this.accountSet._id }).then(res => {
        console.log('queryFreightSpace', res.data)
        this.freightList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '仓位',
          desc: err.message
        })
      })
    },
    setFreight (type, item) {
      if (!this.judge()) return
      let formData = Object.assign({}, item)
      let groupName = this.groupList.find(v => v._id === item.groupId).name
      switch (type) {
        case 'add':
          this.$refs.freightForm.show('新建', null, this.freightList, groupName, formData)
          break
        case 'edit':
          this.$refs.freightForm.show('修改', formData, this.freightList, groupName)
          break
        case 'stop':
        case 'unstop':
        case 'delete':
        case 'recover':
          let title
          let status
          if (type === 'stop') {
            title = status = '禁用'
          } else if (type === 'unstop') {
            title = status = '启用'
          } else if (type === 'delete') {
            title = '删除'
            status = '已删除'
          } else if (type === 'recover') {
            title = '恢复'
            status = '启用'
          }
          if (item.isDefault) {
            this.$Notice.error({
              title: '仓位',
              desc: `该仓库是默认仓库，无法${title}`
            })
          } else {
            this.$Modal.confirm({
              title: '仓位',
              content: `确认是否${title}${item.name}`,
              onOk: () => {
                formData.status = status
                this.updateFreight(formData)
              }
            })
          }
          break
      }
    },
    updateFreight (formData) {
      updateFreightSpace(formData).then(res => {
        this.loadFreight()
      }).catch(err => {
        this.$Notice.error({
          title: '仓位',
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
