<template>
  <div>
    <Row type="flex" justify="space-between" v-if="$route.name === 'bankAccountIndex'">
      <Button type="success" style="margin: 0 10px 10px 0;" @click="setBankAccount('add', null, '新增')">新增银行账号</Button>
    </Row>

    <div class="mu_c" ref="bankAccountLayer">
      <Table border :columns="bankAccountColumns" :data="bankAccountList" :width="1552">
        <template slot-scope="{ row }" slot="action">
          <Button size="small" style="margin-right: 5px" @click="setBankAccount('edit', row, '修改')">修改</Button>
          <Button size="small" @click="batchBankAccount('删除', [row._id])">删除</Button>
        </template>

        <template slot-scope="{ row }" slot="status">
          <div @click="batchBankAccount(row.status === '启用' ? '禁用' : '启用', [row._id])" style="position: relative;">
            <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
            <i-switch size="small" :value="row.status === '启用'" />
          </div>
        </template>
      </Table>
    </div>

    <bankAccountForm ref="bankAccountForm" @load="load"></bankAccountForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bankAccountForm from './form'
import {
  queryBankAccount,
  batchBankAccount
} from '../../api/bankAccount'
export default {
  name: 'index',
  components: {
    bankAccountForm
  },
  data () {
    return {
      bankAccountColumns: [
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        },
        {
          title: '账户编码',
          key: 'code',
          width: 100
        },
        {
          title: '账户名称',
          key: 'name',
          width: 200
        },
        {
          title: '开户名',
          key: 'accountName',
          width: 200
        },
        {
          title: '银行账号',
          key: 'bankAccount',
          width: 200
        },
        {
          title: '币别',
          key: 'currency',
          width: 200
        },
        {
          title: '开户行',
          key: 'openingBank',
          width: 200
        },
        {
          title: '备注',
          key: 'des',
          width: 200
        },
        {
          title: '状态',
          slot: 'status',
          width: 100,
          align: 'center'
        }
      ],
      bankAccountList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList',
      'userList'
    ])
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
    load () {
      queryBankAccount({ accountSetId: this.accountSet._id }).then(res => {
        console.log('queryBankAccount', res.data)
        this.bankAccountList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '银行账号',
          desc: err.message
        })
      })
    },
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '银行账户') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}银行账户的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    setBankAccount (type, item, title) {
      if (!this.judge(title)) return
      let formData = item ? Object.assign({}, item) : {}
      switch (type) {
        case 'add':
          formData = {
            accountSetId: this.accountSet._id,
            creator: this.myUser._id
          }
          this.$refs.bankAccountForm.show('新建', null, this.bankAccountList, formData)
          break
        case 'edit':
          formData.editor = this.myUser._id
          formData.editTime = new Date()
          this.$refs.bankAccountForm.show('修改', formData, this.bankAccountList)
          break
      }
    },
    batchBankAccount (action, list) {
      if (!this.judge(action)) return
      this.$Modal.confirm({
        title: `${action}银行账号`,
        content: `是否${action}该银行账号`,
        onOk: () => {
          batchBankAccount({
            ids: list,
            action: action
          }).then(res => {
            this.$Message.success(`成功${action}该银行账号`)
            this.load()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    }
  }
}
</script>
