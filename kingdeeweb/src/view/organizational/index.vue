<template>
  <Card shadow style="height: 100%; overflow:hidden;" class="mu_card">
    <Row type="flex" justify="space-between" v-if="$route.name === 'organizationalIndex'">
      <Button type="success" style="margin: 0 10px 10px 0;" @click="setDepartment('add', null)">新增部门</Button>
      <Button type="success" style="margin: 0 10px 10px 0;" @click="setClerk('add', null)">新增职员</Button>
    </Row>

    <div class="mu_c">
      <Split v-model="splitLeft">
        <div slot="left" style="height: 100%; display: flex; flex-direction: column;">
          <div style="background: #f8f8f9; height: 40px; line-height: 40px; padding-left: 10px;">
            部门
          </div>
          <div style="flex-grow: 1; overflow: auto;">
            <div style="padding: 0 0 20px 5px; overflow: hidden;">
              <Tree :data="groupData" :render="groupContent" :load-data="loadTreeData" style="margin-left: 5px;"></Tree>
            </div>
          </div>
        </div>

        <div slot="right" style="width: 100%; height: 100%; padding: 0 0 0 2px; display: flex;" ref="clerkLayer">
          <Table border ref="userTable" :columns="clerkColumns" :data="tableData" :height="$refs.clerkLayer && $refs.clerkLayer.offsetHeight" style="width: 100%">
            <template slot-scope="{ row }" slot="action">
              <template v-if="!row.audit">
                <template v-if="row.status === '启用'">
                  <Button type="primary" size="small" style="margin-right: 5px" @click="setClerk('edit', row)">修改</Button>
                  <Button type="success" size="small" style="margin-right: 5px"  @click="setClerk('audit', row)">审核</Button>
                  <Button type="warning" size="small" style="margin-right: 5px"  @click="setClerk('stop', row)">禁用</Button>
                </template>
                <template v-else>
                  <Button type="success" size="small" style="margin-right: 5px" @click="setClerk('unstop', row)">启用</Button>
                  <Button type="error" size="small" @click="setClerk('delete', row)">删除</Button>
                </template>
              </template>
              <Button type="error" size="small" style="margin-right: 5px" v-else @click="setClerk('unAudit', row)">反审核</Button>
            </template>
          </Table>
        </div>
      </Split>
    </div>

    <clerkForm ref="clerkForm" @load="loadClerk"></clerkForm>
    <departmentForm ref="departmentForm" @load="loadDepartment"></departmentForm>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import clerkForm from '../clerk/form'
import departmentForm from '../department/form'
import {
  updateClerk,
  queryClerk,
  deleteClerk,
  queryClerkGroup
} from '../../api/clerk'
import {
  updateDepartment,
  queryDepartment,
  deleteDepartment
} from '../../api/department'
export default {
  name: 'index',
  components: {
    clerkForm,
    departmentForm
  },
  data () {
    return {
      splitLeft: 0.2,
      selectGroup: '0',
      departmentList: [],
      groupList: [],
      groupData: [{
        name: '部门',
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
                  content: '新增部门',
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
                    click: () => { this.setDepartment('add', null) }
                  }
                })
              ])
            ])
          ])
        },
        children: []
      }],
      clerkColumns: [
        {
          title: '职员编码',
          key: 'code'
        },
        {
          title: '职员名称',
          key: 'name'
        },
        {
          title: '岗位名称',
          key: 'jobs'
        },
        {
          title: '部门主管',
          render: (h, params) => {
            let result = this.departmentList.filter(v => v.adminId === params.row._id).length ? '是' : '否'
            return h('div', result)
          }
        },
        {
          title: '状态',
          key: 'status'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200
        }
      ],
      clerkList: []
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
      let list = this.clerkList
      if (this.selectGroup !== '0') {
        list = this.clerkList.filter(v => v.departmentId === this.selectGroup)
      }
      return list
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadDepartment()
          this.loadGroup()
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
              content: '新增部门',
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
                click: () => { this.setDepartment('add', data) }
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
                click: () => { this.setDepartment('edit', data) }
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
                click: () => { this.setDepartment('delete', data) }
              }
            })
          ])
        ])
      ])
    },
    judge () {
      // let bool = true
      // if (this.myUser.role === 'accountSet' && !this.adminList.includes(this.myUser._id)) {
      //   let pData = this.myPermission.feature.find(v => v.title === '基础资料')
      //   if (pData.children.filter(v => v.title === '管理权' && !v.checked).length) {
      //     this.$Notice.error({
      //       title: `公共资料-组织架构`,
      //       desc: '您只有查看权，没有管理权，请联系管理员'
      //     })
      //     bool = false
      //   }
      // }
      return true
    },
    loadGroup () {
      queryClerkGroup({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('queryClerkGroup', res.data)
        this.groupList = res.data
        this.loadClerk()
      }).catch(err => {
        this.$Notice.error({
          title: '职员组',
          desc: err.message
        })
      })
    },
    loadDepartment () {
      queryDepartment({ accountSetId: this.accountSet._id }).then(res => {
        console.log('queryDepartment', res.data)
        let list = []
        res.data.forEach(v => {
          if (v.parentIds.length === 0) {
            let obj = Object.assign({}, v)
            if (res.data.filter(d => d.parentIds.includes(v._id)).length) {
              obj.loading = false
              obj.children = []
            }
            list.push(obj)
          }
        })
        this.groupData[0].children = list
        this.departmentList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '部门',
          desc: err.message
        })
      })
    },
    loadTreeData (item, callback) {
      let list = []
      this.departmentList.forEach(v => {
        if (v.parentIds.length && v.parentIds[v.parentIds.length - 1] === item._id) {
          let obj = Object.assign({}, v)
          if (this.departmentList.filter(d => d.parentIds.includes(v._id)).length) {
            obj.loading = false
            obj.children = []
          }
          list.push(obj)
        }
      })
      callback(list)
    },
    setDepartment (type, item) {
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
            let num = this.departmentList.filter(v => v.parentIds.includes(item._id)).length + 1
            let pIds = Object.assign([], item.parentIds)
            pIds.push(item._id)
            formData.parentIds = pIds
            formData.code = item.code + '.' + (num > 10 ? num.toString() : '0' + num)
            name = pIds.reduce((total, id) => (
              total + this.departmentList.find(v => v._id === id).name + '_'
            ), '') + name
          } else {
            let num = this.departmentList.length + 1
            formData.code = num > 10 ? num.toString() : '0' + num
          }
          this.$refs.departmentForm.show('新建', null, this.departmentList, name, formData)
          break
        case 'edit':
          formData.editor = this.myUser._id
          formData.editTime = new Date()
          if (formData.parentIds.length) {
            name = formData.parentIds.reduce((total, id) => (
              total + this.departmentList.find(v => v._id === id).name + '_'
            ), '') + name
          }
          this.$refs.departmentForm.show('修改', formData, this.departmentList, name)
          break
        case 'audit':
        case 'unAudit':
          this.$Modal.confirm({
            title: '部门',
            content: `是否${type === 'audit' ? '审核' : '反审核'}${item.name}${type === 'audit' ? '，审核后该部门的所有直接上级部门都会被自动审核，是否继续？' : ''}`,
            onOk: () => {
              formData.audit = type === 'audit' ? this.myUser._id : null
              this.updateD(formData)
            }
          })
          break
        case 'stop':
        case 'unstop':
        case 'delete':
          let title = type === 'delete' ? '删除' : type === 'stop' ? '禁用' : '启用'
          if (item && item.audit) {
            this.$Notice.error({
              title: '部门',
              desc: `该部门已审核，无法${title}`
            })
          } else {
            if (type === 'delete') {
              let dList = this.departmentList.filter(v => v.parentIds.includes(item._id))
              if (dList.length) {
                this.$Notice.error({
                  title: '部门',
                  desc: `该部门包含其他子部门，无法直接${title}`
                })
              } else {
                this.$Modal.confirm({
                  title: '删除部门',
                  content: `确定是否删除部门：${item.name}`,
                  onOk: () => {
                    deleteDepartment({
                      id: item._id
                    }).then(res => {
                      this.$Notice.success({
                        title: '部门',
                        desc: `成功删除部门：${item.name}`
                      })
                      this.loadDepartment()
                    }).catch(err => {
                      this.$Notice.error({
                        title: '部门',
                        desc: err.message
                      })
                    })
                  }
                })
              }
            } else {
              this.$Modal.confirm({
                title: '部门',
                content: `是否${title}${item.name}`,
                onOk: () => {
                  formData.status = title
                  formData.statusId = this.myUser._id
                  formData.statusTime = new Date()
                  this.updateD(formData)
                }
              })
            }
          }
          break
      }
    },
    updateD (formData) {
      updateDepartment(formData).then(res => {
        this.load()
      }).catch(err => {
        this.$Notice.error({
          title: '部门',
          desc: err.message
        })
      })
    },
    loadClerk () {
      queryClerk({ accountSetId: this.accountSet._id }).then(res => {
        console.log('queryClerk', res.data)
        this.clerkList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '职员',
          desc: err.message
        })
      })
    },
    setClerk (type, item) {
      if (!this.judge()) return
      let formData = item ? Object.assign({}, item) : {}
      let name = ''
      switch (type) {
        case 'add':
          let num = this.clerkList.length + 1
          formData = {
            accountSetId: this.accountSet._id,
            creator: this.myUser._id,
            groupId: item ? item.groupId : this.selectGroup === '0' ? null : this.selectGroup,
            code: num > 10 ? num.toString() : '0' + num
          }
          if (this.selectGroup !== '0') {
            let parentIds = this.groupList.find(v => v._id === this.selectGroup).parentIds
            parentIds.push(this.selectGroup)
            name = parentIds.reduce((total, id) => (
              total + this.groupList.find(v => v._id === id).name + '_'
            ), '')
          }
          this.$refs.clerkForm.show('新建', null, this.clerkList, name, formData)
          break
        case 'edit':
          formData.editor = this.myUser._id
          formData.editTime = new Date()
          if (item && item.groupId) {
            let parentIds = this.groupList.find(v => v._id === item.groupId).parentIds
            parentIds.push(item.groupId)
            name = parentIds.reduce((total, id) => (
              total + this.groupList.find(v => v._id === id).name + '_'
            ), '')
          }
          this.$refs.clerkForm.show('修改', formData, this.clerkList, name)
          break
        case 'audit':
        case 'unAudit':
          this.$Modal.confirm({
            title: '职员',
            content: `是否${type === 'audit' ? '审核' : '反审核'}${item.name}`,
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
              title: '职员',
              desc: `该职员已审核，无法${title}`
            })
          } else {
            if (type === 'delete') {
              this.$Modal.confirm({
                title: '删除职员',
                content: `确定是否删除职员：${item.name}`,
                onOk: () => {
                  deleteClerk({
                    id: item._id
                  }).then(res => {
                    this.$Notice.success({
                      title: '职员',
                      desc: `成功删除职员：${item.name}`
                    })
                    this.loadClerk()
                  }).catch(err => {
                    this.$Notice.error({
                      title: '职员',
                      desc: err.message
                    })
                  })
                }
              })
            } else {
              this.$Modal.confirm({
                title: '职员',
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
          break
      }
    },
    update (formData) {
      updateClerk(formData).then(res => {
        this.loadClerk()
      }).catch(err => {
        this.$Notice.error({
          title: '职员',
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
