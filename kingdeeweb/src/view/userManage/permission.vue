<template>
    <Modal
      v-model="modal"
      title="权限"
      :mask-closable="false"
      width="1200"
      @on-cancel="cancel">

      <Table border :width="1160" :height="500" :columns="columns" :data="permission">
        <template slot-scope="{ row }" slot="query">
          <Checkbox v-if="row.operation.find(f => f.action === '查询')"
                    :value="row.operation.find(f => f.action === '查询').val"
                    :disabled="row.operation.find(f => f.action === '查询').disabled"
                    @on-change="change($event, row.title, '查询')"></Checkbox>
        </template>
        <template slot-scope="{ row }" slot="add">
          <Checkbox v-if="row.operation.find(f => f.action === '新增')"
                    :value="row.operation.find(f => f.action === '新增').val"
                    :disabled="row.operation.find(f => f.action === '新增').disabled"
                    @on-change="change($event, row.title, '新增')"></Checkbox>
        </template>
        <template slot-scope="{ row }" slot="edit">
          <Checkbox v-if="row.operation.find(f => f.action === '修改')"
                    :value="row.operation.find(f => f.action === '修改').val"
                    :disabled="row.operation.find(f => f.action === '修改').disabled"
                    @on-change="change($event, row.title, '修改')"></Checkbox>
        </template>
        <template slot-scope="{ row }" slot="delete">
          <Checkbox v-if="row.operation.find(f => f.action === '删除')"
                    :value="row.operation.find(f => f.action === '删除').val"
                    :disabled="row.operation.find(f => f.action === '删除').disabled"
                    @on-change="change($event, row.title, '删除')"></Checkbox>
        </template>
        <template slot-scope="{ row }" slot="export">
          <Checkbox v-if="row.operation.find(f => f.action === '导出')"
                    :value="row.operation.find(f => f.action === '导出').val"
                    :disabled="row.operation.find(f => f.action === '导出').disabled"
                    @on-change="change($event, row.title, '导出')"></Checkbox>
        </template>
        <template slot-scope="{ row }" slot="print">
          <Checkbox v-if="row.operation.find(f => f.action === '打印')"
                    :value="row.operation.find(f => f.action === '打印').val"
                    :disabled="row.operation.find(f => f.action === '打印').disabled"
                    @on-change="change($event, row.title, '打印')"></Checkbox>
        </template>
        <template slot-scope="{ row }" slot="other">
          <template v-for="(v, i) in row.operation.filter(f => !['查询', '新增', '修改', '删除', '导出', '打印'].includes(f.action))">
            <Checkbox :key="row._index + '-' + i"
                      :value="v.val"
                      :disabled="v.disabled"
                      @on-change="change($event, row.title, v.action)"
            >{{ v.action }}</Checkbox>
          </template>
        </template>
      </Table>

      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="success" @click="sure">确定</Button>
      </div>
    </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryUserPermission, updateUserPermission } from '../../api/userManage'
export default {
  name: 'permission',
  data () {
    return {
      modal: false,
      isAllQ: false,
      isAllA: false,
      isAllE: false,
      isAllD: false,
      isAllEx: false,
      isAllP: false,
      columns: [
        {
          title: '功能',
          key: 'title',
          width: 160
        },
        {
          title: '查询',
          renderHeader: (h, params) => {
            return h('Checkbox', {
              props: {
                value: this.isAllQ
              },
              on: {
                'on-change': (val) => {
                  this.isAllQ = val
                  this.updatePermission('查询', val)
                }
              }
            }, '查询')
          },
          slot: 'query',
          width: 90
        },
        {
          title: '新增',
          renderHeader: (h, params) => {
            return h('Checkbox', {
              props: {
                value: this.isAllA
              },
              on: {
                'on-change': (val) => {
                  this.isAllA = val
                  this.updatePermission('新增', val)
                }
              }
            }, '新增')
          },
          slot: 'add',
          width: 90
        },
        {
          title: '修改',
          renderHeader: (h, params) => {
            return h('Checkbox', {
              props: {
                value: this.isAllE
              },
              on: {
                'on-change': (val) => {
                  this.isAllE = val
                  this.updatePermission('修改', val)
                }
              }
            }, '修改')
          },
          slot: 'edit',
          width: 90
        },
        {
          title: '删除',
          renderHeader: (h, params) => {
            return h('Checkbox', {
              props: {
                value: this.isAllD
              },
              on: {
                'on-change': (val) => {
                  this.isAllD = val
                  this.updatePermission('删除', val)
                }
              }
            }, '删除')
          },
          slot: 'delete',
          width: 90
        },
        {
          title: '导出',
          renderHeader: (h, params) => {
            return h('Checkbox', {
              props: {
                value: this.isAllEx
              },
              on: {
                'on-change': (val) => {
                  this.isAllEx = val
                  this.updatePermission('导出', val)
                }
              }
            }, '导出')
          },
          slot: 'export',
          width: 90
        },
        {
          title: '打印',
          renderHeader: (h, params) => {
            return h('Checkbox', {
              props: {
                value: this.isAllP
              },
              on: {
                'on-change': (val) => {
                  this.isAllP = val
                  this.updatePermission('打印', val)
                }
              }
            }, '打印')
          },
          slot: 'print',
          width: 90
        },
        {
          title: '其他',
          slot: 'other'
        }
      ],
      permission: [],
      formData: {},
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'myUser',
      'accountSet'
    ])
  },
  methods: {
    show (obj) {
      this.formData = Object.assign({
        accountSetId: this.accountSet._id
      }, obj)
      this.loading = true
      queryUserPermission(this.formData).then(res => {
        this.permission = res.data
        let isAllQ = true
        let isAllA = true
        let isAllE = true
        let isAllD = true
        let isAllEx = true
        let isAllP = true
        this.permission.forEach(f => {
          f.operation.forEach(o => {
            if (o.action === '查询' && !o.val) isAllQ = false
            if (o.action === '新增' && !o.val) isAllA = false
            if (o.action === '修改' && !o.val) isAllE = false
            if (o.action === '删除' && !o.val) isAllD = false
            if (o.action === '导出' && !o.val) isAllEx = false
            if (o.action === '打印' && !o.val) isAllP = false
          })
        })
        this.isAllQ = isAllQ
        this.isAllA = isAllA
        this.isAllE = isAllE
        this.isAllD = isAllD
        this.isAllEx = isAllEx
        this.isAllP = isAllP
        this.loading = false
      }).catch(err => {
        this.$Message.error(err.message)
      })
      this.modal = true
    },
    cancel () {
      this.formData = {}
      this.permission = []
      this.isAllQ = false
      this.isAllA = false
      this.isAllE = false
      this.isAllD = false
      this.isAllEx = false
      this.isAllP = false
      this.modal = false
    },
    updatePermission (type, val) {
      this.permission.forEach(f => {
        f.operation.forEach(o => {
          if (o.action === type && !o.disabled) o.val = val
        })
      })
    },
    change (val, title, action) {
      this.permission.forEach(f => {
        if (f.title === title) {
          f.operation.forEach(o => {
            if (o.action === action && !o.disabled) o.val = val
          })
        }
      })
    },
    sure () {
      this.$Modal.confirm({
        title: '权限管理',
        content: `确定是否更新权限`,
        onOk: () => {
          let list = this.permission.map(m => {
            return {
              title: m.title,
              operation: m.operation.map(o => {
                return {
                  action: o.action,
                  val: o.disabled ? false : o.val
                }
              })
            }
          })
          this.formData.permission = list
          updateUserPermission(this.formData).then(res => {
            this.$Message.success('权限已更新')
            if (this.formData.userId && this.formData.userId === this.myUser._id) {
              location.reload()
            } else {
              this.cancel()
            }
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
