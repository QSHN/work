<template>
  <Card shadow style="height: calc(100% - 60px); overflow:auto">
    <Row style="margin-bottom: 10px;">
      <Button type="success" @click="$refs.modalForm.show('新建')">新建用户</Button>
    </Row>

    <Table border :columns="tableTemp" :data="userList" class="table_expand">
      <template slot-scope="{ row }" slot="action">
        <Button size="small" style="margin-right: 5px;" @click="$refs.modalForm.show('修改', row)">修改</Button>
        <Button v-if="row.accountStatus === '正常'" size="small" type="error" style="margin-right: 5px;" @click="edit('禁用', '禁用', row)">禁用</Button>
        <Button v-else size="small" @click="edit('启用', '正常', row)">启用</Button>
      </template>
    </Table>

    <modalForm ref="modalForm" @load="load"></modalForm>
  </Card>
</template>

<script>
import modalForm from './modalForm'
import { register } from '../../api/user'
import { queryAccountSet } from '../../api/accountSet'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'index',
  components: {
    modalForm
  },
  data () {
    return {
      tableTemp: [
        {
          title: '账号',
          key: 'account'
        },
        {
          title: '用户名',
          key: 'name'
        },
        {
          title: '账号状态',
          key: 'accountStatus'
        },
        {
          title: '最近使用账套',
          render: (h, params) => {
            let fData = this.accountSetList.find(f => f._id === params.row.useAccountSet)
            return h('div', fData ? fData.accountSetName : '')
          }
        },
        {
          title: '最近登录时间',
          render: (h, params) => {
            return h('div', params.row.loginTime ? moment(params.row.loginTime).format('YYYY-MM-DD HH:mm:ss') : '')
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 280,
          align: 'center'
        }
      ],
      accountSetList: []
    }
  },
  computed: {
    ...mapGetters([
      'myUser',
      'updateUser',
      'userList'
    ])
  },
  watch: {
    myUser: {
      handler () {
        if (this.myUser && this.myUser.companyId) {
          this.loadAccount()
          this.load()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    load () {
      this.$store.dispatch('getUserList', { companyId: this.myUser.companyId })
    },
    loadAccount () {
      queryAccountSet({
        companyId: this.myUser.companyId,
        userId: this.myUser._id
      }).then(res => {
        this.accountSetList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '账套管理',
          desc: err.message
        })
      })
    },
    editAccountSet (status, data) {
      let formData = {
        _id: data._id,
        accountStatus: status,
        account: data.account,
        companyId: data.companyId,
        name: data.name,
        isChangeStatus: true
      }
      register(formData).then(res => {
        this.load()
      }).catch(err => {
        this.$Notice.error({
          title: '用户管理',
          desc: err.message
        })
      })
    },
    edit (operation, status, data) {
      this.$Modal.confirm({
        title: '用户管理',
        content: `您确定${operation}该用户吗？`,
        onOk: () => {
          this.editAccountSet(status, data)
        }
      })
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
