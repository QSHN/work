<template>
  <div>
    <Row type="flex" justify="space-between">
      <Button type="success" style="margin: 0 10px 10px 0;" @click="setWords('add', '新增')">新增凭证字</Button>
    </Row>

    <div>
      <Table border ref="userTable" :columns="columns" :data="wordsList" :width="702">
        <template slot-scope="{ row }" slot="action">
          <Button size="small" style="margin-right: 5px" @click="setWords('edit', row, '修改')">修改</Button>
          <Button size="small" @click="setWords('delete', row, '删除')">删除</Button>
        </template>
      </Table>
    </div>

    <wordForm ref="wordForm" @load="load" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import wordForm from './form'
import {
  queryProofWords,
  deleteProofWords
} from '../../api/proofWords'
export default {
  name: 'index',
  components: {
    wordForm
  },
  data () {
    return {
      columns: [
        {
          title: '名称',
          key: 'name',
          width: 200
        },
        {
          title: '打印标题',
          key: 'printTitle',
          width: 200
        },
        {
          title: '是否默认',
          key: 'defaultValue',
          align: 'center',
          width: 150
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 150
        }
      ],
      wordsList: []
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
          if (f.title === '凭证字') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}凭证字的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    load () {
      queryProofWords({ accountSetId: this.accountSet._id }).then(res => {
        console.log('queryProofWords', res.data)
        this.wordsList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '凭证字',
          desc: err.message
        })
      })
    },
    setWords (type, item, title) {
      if (!this.judge(title)) return
      let formData = item ? Object.assign({}, item) : {
        accountSetId: this.accountSet._id
      }
      switch (type) {
        case 'add':
          this.$refs.wordForm.show('新建', null, this.wordsList, formData)
          break
        case 'edit':
          this.$refs.wordForm.show('修改', formData, this.wordsList)
          break
        case 'delete':
          this.$Modal.confirm({
            title: '删除凭证字',
            content: `是否删除凭证字：${item.name}`,
            onOk: () => {
              deleteProofWords({
                id: item._id
              }).then(res => {
                this.$Notice.success({
                  title: '凭证字',
                  desc: `成功删除凭证字：${item.name}`
                })
                this.loadUnit()
              }).catch(err => {
                this.$Notice.error({
                  title: '凭证字',
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
