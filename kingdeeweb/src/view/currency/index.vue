<template>
  <div>
    <Row style="margin-bottom: 10px;">
      <Button type="success" @click="updateFun('新建', null)">新建币别</Button>
    </Row>

    <Table border :columns="tableTemp" :data="tableData">
      <template slot-scope="{ row, index }" slot="action">
        <Button size="small" style="margin-right: 5px" @click="updateFun('修改', row)">修改</Button>
        <Button size="small" @click="batchCurrency('删除', [row._id])">删除</Button>
      </template>

      <template slot-scope="{ row }" slot="status">
        <div @click="batchCurrency(row.status === '启用' ? '禁用' : '启用', [row._id])" style="position: relative;">
          <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
          <i-switch size="small" :value="row.status === '启用'" />
        </div>
      </template>
    </Table>

    <modalForm ref="modalForm" @load="load"></modalForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { currencyQuery, batchCurrency } from '../../api/currency'
import modalForm from './modalForm'
export default {
  name: 'index',
  components: {
    modalForm
  },
  data () {
    return {
      tableTemp: [
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        },
        {
          title: '编码',
          key: 'code'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '汇率',
          key: 'rate'
        },
        {
          title: '小数位数',
          key: 'float'
        },
        {
          title: '使用状态',
          slot: 'status',
          width: 100,
          align: 'center'
        }
      ],
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList'
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
      currencyQuery({
        accountSetId: this.accountSet._id
      }).then(res => {
        this.tableData = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '币别',
          desc: err.message
        })
      })
    },
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '币别') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}币别的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    updateFun (type, row) {
      if (!this.judge(type)) return
      this.$refs.modalForm.show(type, row, this.tableData, this.accountSet._id)
    },
    batchCurrency (action, list) {
      if (!this.judge(action)) return
      this.$Modal.confirm({
        title: `${action}币别`,
        content: `是否${action}该币别`,
        onOk: () => {
          batchCurrency({
            ids: list,
            action: action
          }).then(res => {
            this.$Message.success(`成功${action}该币别`)
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

<style scoped>

</style>
