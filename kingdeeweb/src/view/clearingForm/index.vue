<template>
  <div>
    <Row type="flex" justify="space-between">
      <Button type="success" style="margin: 0 10px 10px 0;" @click="setClear('add', null, '新增')">新增结算方式</Button>
    </Row>

    <div class="mu_c">
      <Table border ref="userTable" :width="452" :columns="columns" :data="clearList">
        <template slot-scope="{ row }" slot="action">
          <Button size="small" style="margin-right: 5px" @click="setClear('edit', row, '修改')">修改</Button>
          <Button size="small" @click="setClear('delete', row, '删除')">删除</Button>
        </template>
      </Table>
    </div>

    <ClearingForm ref="ClearingForm" @load="load" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ClearingForm from './form'
import {
  queryClearingForm,
  deleteClearingForm
} from '../../api/clearingForm'
export default {
  name: 'index',
  components: {
    ClearingForm
  },
  data () {
    return {
      columns: [
        {
          title: '名称',
          key: 'name',
          width: 300
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 150
        }
      ],
      clearList: []
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
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '结算方式') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}结算方式的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    load () {
      queryClearingForm({ accountSetId: this.accountSet._id }).then(res => {
        console.log('queryClearingForm', res.data)
        this.clearList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '结算方式',
          desc: err.message
        })
      })
    },
    setClear (type, item, title) {
      if (!this.judge(title)) return
      let formData = item ? Object.assign({}, item) : {
        accountSetId: this.accountSet._id
      }
      switch (type) {
        case 'add':
          this.$refs.ClearingForm.show('新建', null, this.clearList, formData)
          break
        case 'edit':
          this.$refs.ClearingForm.show('修改', formData, this.clearList)
          break
        case 'delete':
          this.$Modal.confirm({
            title: '删除结算方式',
            content: `是否删除结算方式：${item.name}`,
            onOk: () => {
              deleteClearingForm({
                id: item._id
              }).then(res => {
                this.$Notice.success({
                  title: '结算方式',
                  desc: `成功删除结算方式：${item.name}`
                })
                this.loadUnit()
              }).catch(err => {
                this.$Notice.error({
                  title: '结算方式',
                  desc: err.message
                })
              })
            }
          })
          break
      }
    }
  }
}
</script>

<style lang="less">
</style>
