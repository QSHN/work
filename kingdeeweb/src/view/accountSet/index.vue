<template>
  <Card shadow style="height: calc(100% - 60px); overflow:auto">
    <Row style="margin-bottom: 10px;">
      <Button type="success" @click="$refs.modalForm.show('新建')">新建账套</Button>
    </Row>

    <Table border :columns="tableTemp" :data="tableData" class="table_expand">
      <template slot-scope="{ row }" slot="action">
        <Button size="small" type="primary" style="margin-right: 5px;" @click="go(row._id, row.userList)">进入使用</Button>
        <Button size="small" style="margin-right: 5px;" @click="$refs.modalForm.show('修改', row)">修改</Button>
        <Button v-if="row.status === '已启用'" size="small" type="error" style="margin-right: 5px;" @click="edit('禁用', '已禁用', row)">禁用</Button>
        <Button v-else size="small" @click="edit('启用', '已启用', row)">启用</Button>
      </template>
    </Table>

    <modalForm ref="modalForm" @load="load"></modalForm>
  </Card>
</template>

<script>
import modalForm from './modalForm'
import { queryAccountSet, updateAccountSet } from '../../api/accountSet'
import { mapGetters, mapMutations } from 'vuex'
import expandRow from './expand'
export default {
  name: 'index',
  components: {
    modalForm,
    expandRow
  },
  data () {
    return {
      tableTemp: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row,
                load: this.load,
                update: updateAccountSet
              }
            })
          }
        },
        {
          title: '账套名称',
          key: 'accountSetName'
        },
        {
          title: '账套类型',
          key: 'accountSetType'
        },
        {
          title: '机构名称',
          key: 'organization'
        },
        {
          title: '记账单位',
          key: 'unit'
        },
        {
          title: '账套状态',
          key: 'status'
        },
        {
          title: '操作',
          slot: 'action',
          width: 280,
          align: 'center'
        }
      ],
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'myUser',
      'updateUser'
    ])
  },
  watch: {
    myUser: {
      handler () {
        if (this.myUser && this.myUser.companyId) this.load()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapMutations([
      'clearAllTag'
    ]),
    load () {
      queryAccountSet({
        companyId: this.myUser.companyId,
        userId: this.myUser.role === 'admin' ? null : this.myUser._id
      }).then(res => {
        if (res.data.length) {
          this.tableData = res.data.map(v => {
            return Object.assign({ _expanded: true }, v)
          })
        } else {
          this.$Modal.confirm({
            title: '账套管理',
            content: `您还没有账套，请创建账套`,
            onOk: () => {
              this.$refs.modalForm.show('新建')
            },
            onCancel: () => {
              this.$refs.modalForm.show('新建')
            }
          })
        }
      }).catch(err => {
        this.$Notice.error({
          title: '账套管理',
          desc: err.message
        })
      })
    },
    editAccountSet (status, data) {
      let formData = Object.assign({}, data)
      formData.status = status
      updateAccountSet(formData).then(res => {
        this.load()
      }).catch(err => {
        this.$Notice.error({
          title: '账套管理',
          desc: err.message
        })
      })
    },
    edit (operation, status, data) {
      this.$Modal.confirm({
        title: '账套管理',
        content: `您确定${operation}该账套吗？`,
        onOk: () => {
          this.editAccountSet(status, data)
        }
      })
    },
    go (id, userList) {
      if (userList.includes(this.myUser._id)) {
        this.$store.dispatch('updateUser', {
          user: {
            _id: this.myUser._id,
            useAccountSet: id
          }
        }).then(res => {
          this.clearAllTag()
          this.$store.dispatch('getUser')
          this.$store.dispatch('getUserPermission', {
            accountSetId: id,
            userId: this.myUser._id
          })
          this.$store.dispatch('getGroupList', { accountSetId: id })
          this.$router.push({
            name: 'home'
          })
        }).catch(err => {
          this.$Notice.error({
            title: '更新个人信息失败',
            desc: err.message
          })
        })
      } else {
        this.$Notice.error({
          title: '账套管理',
          desc: '你没有进入该账套的权限，请授权'
        })
      }
    }
  }
}
</script>

<style lang="less">
.table_expand {
  .ivu-table-expanded-cell {
    padding: 10px 50px 0;
  }
}
</style>
