<template>
  <div style="position: relative;" class="um_main">
    <div class="group_layer">
      <div class="left">
        <Tree :data="userTree" :render="renderContent"></Tree>
      </div>

      <div class="right">
        <Table border :columns="userColumns" :data="userTableList" :height="getTableHeight">
          <template slot-scope="{ row }" slot="group">
            <div v-if="whichUserTable !== 'group' + row._id" @click.stop="whichUserTable = 'group' + row._id" style="cursor: pointer">{{getGroupName(row.group)}}</div>
            <Select v-else multiple :value="getGroupId(row.group)" :max-tag-count="2" @on-open-change="isSaveUserGroup" @on-change="selectUserGroup($event, row)">
              <Option v-for="item in groupList" :value="item._id" :key="item._id" :disabled="item.name === '用户组'">{{ item.name }}</Option>
            </Select>
          </template>

          <template slot-scope="{ row }" slot="permission">
            <Button size="small" @click="permission({ userId: row._id })">权限</Button>
          </template>
        </Table>
      </div>
    </div>
    <permissionModal ref="permissionModal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateUserGroup, deleteUserGroup } from '../../api/userManage'
import { updateUser } from '../../api/user'
import permissionModal from './permission'
export default {
  name: 'index',
  components: { permissionModal },
  data () {
    return {
      userColumns: [
        {
          title: '权限',
          slot: 'permission',
          width: 200,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '账户',
          key: 'account'
        },
        {
          title: '用户组',
          slot: 'group',
          width: 250,
          align: 'center',
          ellipsis: true
        }
      ],
      userTreeId: null,
      whichUserTable: null,
      isChangeUser: false
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'groupList',
      'accountSetUserList',
      'myUser',
      'myPermission'
    ]),
    userTableList () {
      return this.accountSetUserList.filter(f => !this.userTreeId || (this.userTreeId && f.group.includes(this.userTreeId)))
    },
    userTree () {
      let group = this.groupList.map(f => {
        return Object.assign({}, f)
      })
      return [
        {
          name: '用户组管理',
          expand: true,
          children: group
        }
      ]
    },
    getTableHeight () {
      return window.innerHeight - 140 + 'px'
    }
  },
  watch: {
  },
  methods: {
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '用户授权') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}用户授权的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    renderContent (h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span',
          {
            class: `tree_title${this.userTreeId === (data._id || null) ? ' active' : ''}`
          },
          [
            h('span',
              {
                class: 'tree_name',
                on: {
                  click: () => {
                    this.userTreeId = (data._id || null)
                  }
                }
              },
              data.name),
            h('span', {
              class: 'tree_hover'
            }, data._id ? [
              h('img', {
                domProps: {
                  title: '修改',
                  src: require('../../assets/images/icon/edit.svg')
                },
                on: {
                  click: () => {
                    this.setGroup('修改', data)
                  }
                }
              }, '修改'),
              h('img', {
                domProps: {
                  title: '权限',
                  src: require('../../assets/images/icon/set.svg')
                },
                on: {
                  click: () => {
                    this.permission({ groupId: data._id })
                  }
                }
              }, '权限'),
              h('img', {
                domProps: {
                  title: '删除',
                  src: require('../../assets/images/icon/close.svg')
                },
                on: {
                  click: () => {
                    this.setGroup('删除', data)
                  }
                }
              }, '删除')
            ] : [
              h('img', {
                domProps: {
                  title: '新增',
                  src: require('../../assets/images/icon/add.svg')
                },
                on: {
                  click: () => {
                    this.setGroup('新增', data)
                  }
                }
              }, '新增')
            ])
          ]
        )
      ])
    },
    setGroup (type, row) {
      if (!this.judge(type)) return
      if (row.isDelete !== undefined && !row.isDelete) {
        this.$Notice.error({
          title: '用户组管理',
          desc: '系统预设组无法修改/删除'
        })
      } else {
        if (type === '删除') {
          this.$Modal.confirm({
            title: '用户组',
            content: `确定删除${row.name}吗`,
            onOk: () => {
              deleteUserGroup({ id: row._id }).then(res => {
                this.$store.dispatch('getGroupList', { accountSetId: this.accountSet._id })
              }).catch(err => {
                this.$Notice.error({
                  title: `用户组`,
                  desc: err.message()
                })
              })
            }
          })
        } else {
          let isAdd = type === '新增'
          let formData = isAdd ? {
            accountSetId: this.accountSet._id,
            name: '',
            isDelete: true
          } : Object.assign({}, row)
          this.$Modal.confirm({
            title: `用户组`,
            render: (h) => {
              return h('Input', {
                props: {
                  value: formData.name,
                  autofocus: true,
                  placeholder: '输入组名称',
                  maxlength: 5
                },
                on: {
                  input: (val) => {
                    formData.name = val
                  }
                }
              })
            },
            onOk: () => {
              if (formData.name) {
                updateUserGroup(formData).then(res => {
                  this.$store.dispatch('getGroupList', { accountSetId: this.accountSet._id })
                }).catch(err => {
                  this.$Notice.error({
                    title: `用户组`,
                    desc: err.message()
                  })
                })
              } else {
                this.$Notice.error({
                  title: `用户组`,
                  desc: '用户组名称必填'
                })
              }
            }
          })
        }
      }
    },
    getGroupName (ids) {
      let val = ''
      this.groupList.forEach(f => {
        if (ids.includes(f._id)) val += (val ? '，' : '') + f.name
      })
      return val
    },
    getGroupId (ids) {
      return this.groupList.filter(f => ids.includes(f._id)).map(m => m._id)
    },
    selectUserGroup (ids, row) {
      if (!this.isChangeUser) return
      console.log(ids, row)
      let form = JSON.parse(JSON.stringify(row))
      let groupIds = this.groupList.map(m => m._id)
      form.group = form.group.filter(id => !groupIds.includes(id))
      form.group = form.group.concat(ids.filter(id => !form.group.includes(id)))
      this.whichUserTable = null
      this.isChangeUser = false
      updateUser({
        _id: form._id,
        group: form.group
      }).then(res => {
        this.$store.dispatch('getUserList', { companyId: this.myUser.companyId })
        this.$Message.success('更新成功')
      }).catch(err => {
        this.$Notice.error({
          title: `用户`,
          desc: err.message()
        })
      })
    },
    isSaveUserGroup (val) {
      this.isChangeUser = val
    },
    permission (obj) {
      if (!this.judge('用户授权')) return
      this.$refs.permissionModal.show(obj)
    }
  }
}
</script>

<style lang="less" scoped>
.um_main {
  .group_layer {
    display: flex;
    height: ~"calc(100vh - 140px)";

    .left {
      width: 200px;
      min-width: 200px;
      height: 100%;
      border: 1px solid #dcdee2;
      margin-right: 10px;
      background: #fff;
      padding: 10px;
    }

    .right {
      flex-grow: 1;
    }
  }
}
</style>

<style lang="less">
  .um_main {
    .left {
      .tree_title {
        width: 100px;
        display: flex;
        align-items: center;
        cursor: pointer;

        .tree_hover {
          display: flex;
          align-items: center;
          margin-left: 5px;
          opacity: 0;

          img {
            width: 14px;
            height: 14px;
            margin-left: 2px;
          }
        }

        &.active {
          background: fade(#5cadff, 20%);

          .tree_hover { opacity: 1; }
        }

        &:hover {
          .tree_name { text-decoration: underline; }
          .tree_hover { opacity: 1; }
        }
      }
    }
  }
</style>
