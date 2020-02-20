<template>
  <div style="width: 100%; height: 100%;  display: flex; flex-direction: column;">
    <Row type="flex" justify="space-between" v-if="$route.name === 'costIndex'">
      <Button type="success" style="margin: 0 10px 10px 0;" @click="setCost('add', null)">新增费用</Button>
    </Row>

    <div class="mu_c" ref="costLayer">
      <Table border :columns="costColumns" :data="costList" :height="$refs.costLayer && $refs.costLayer.offsetHeight" style="width: 100%">
        <template slot-scope="{ row }" slot="action">
          <template v-if="!row.audit">
            <template v-if="row.status === '启用'">
              <Button type="primary" size="small" style="margin-right: 5px" @click="setCost('edit', row)">修改</Button>
              <Button type="success" size="small" style="margin-right: 5px"  @click="setCost('audit', row)">审核</Button>
              <Button type="warning" size="small" style="margin-right: 5px"  @click="setCost('stop', row)">禁用</Button>
            </template>
            <template v-else>
              <Button type="success" size="small" style="margin-right: 5px" @click="setCost('unstop', row)">启用</Button>
              <Button type="error" size="small" @click="setCost('delete', row)">删除</Button>
            </template>
          </template>
          <Button type="error" size="small" style="margin-right: 5px" v-else @click="setCost('unAudit', row)">反审核</Button>
        </template>
      </Table>
    </div>

    <costForm ref="costForm" @load="load"></costForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import costForm from './form'
import moment from 'moment'
import {
  updateCost,
  queryCost,
  deleteCost
} from '../../api/cost'
export default {
  name: 'index',
  components: {
    costForm
  },
  data () {
    return {
      costColumns: [
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
          title: '费用类型',
          key: 'costType',
          width: 200,
          align: 'center'
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
      costList: []
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
      queryCost({ accountSetId: this.accountSet._id }).then(res => {
        console.log('queryCost', res.data)
        this.costList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '费用',
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
      //       title: `公共资料-费用`,
      //       desc: '您只有查看权，没有管理权，请联系管理员'
      //     })
      //     bool = false
      //   }
      // }
      return true
    },
    setCost (type, item) {
      if (!this.judge()) return
      let formData = item ? Object.assign({}, item) : {}
      switch (type) {
        case 'add':
          formData = {
            accountSetId: this.accountSet._id,
            creator: this.myUser._id
          }
          this.$refs.costForm.show('新建', null, this.costList, formData)
          break
        case 'edit':
          formData.editor = this.myUser._id
          formData.editTime = new Date()
          this.$refs.costForm.show('修改', formData, this.costList)
          break
        case 'audit':
        case 'unAudit':
          this.$Modal.confirm({
            title: '费用',
            content: `是否${type === 'audit' ? '审核' : '反审核'}${item.name}`,
            onOk: () => {
              formData.audit = type === 'audit' ? this.myUser._id : null
              this.update(formData)
            }
          })
          break
        case 'stop':
        case 'unstop':
          let status = type === 'stop' ? '禁用' : '启用'
          this.$Modal.confirm({
            title: '费用',
            content: `是否${status}${item.name}`,
            onOk: () => {
              formData.status = status
              formData.statusId = this.myUser._id
              formData.statusTime = new Date()
              this.update(formData)
            }
          })
          break
        case 'delete':
          this.$Modal.confirm({
            title: '删除费用',
            content: `确定是否删除费用：${item.name}`,
            onOk: () => {
              deleteCost({
                id: item._id
              }).then(res => {
                this.$Notice.success({
                  title: '费用',
                  desc: `成功删除费用：${item.name}`
                })
                this.load()
              }).catch(err => {
                this.$Notice.error({
                  title: '费用',
                  desc: err.message
                })
              })
            }
          })
          break
      }
    },
    update (formData) {
      updateCost(formData).then(res => {
        this.load()
      }).catch(err => {
        this.$Notice.error({
          title: '费用',
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
