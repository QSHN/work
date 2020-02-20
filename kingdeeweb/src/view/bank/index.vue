<template>
  <Card shadow style="height: 100%; overflow:hidden;" class="mu_card">
    <Row>
      <Button type="success" style="margin: 0 0 10px;" @click="setBank('add')">新增银行关联号</Button>
    </Row>

    <div class="mu_c">
      <Split v-model="splitLeft">
        <div slot="left" style="height: 100%; display: flex; flex-direction: column;">
          <div style="background: #f8f8f9; height: 40px; line-height: 40px; padding-left: 10px;">
            银行联行号
          </div>
          <div style="flex-grow: 1; overflow: auto;">
            <div style="padding: 0 0 20px 5px; overflow: hidden;">
              <Tree :data="groupData" :render="groupContent"></Tree>
            </div>
          </div>
        </div>

        <div slot="right" style="width: 100%; height: 100%; padding: 0 0 0 2px; display: flex;" ref="bankLayer">
          <Table border ref="userTable" :columns="bankColumns" :data="tableData" :height="$refs.bankLayer && $refs.bankLayer.offsetHeight" style="width: 100%">
            <template slot-scope="{ row }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="setBank('edit', row)">修改</Button>
                <Button type="warning" size="small" style="margin-right: 5px" v-if="row.status === '启用'" @click="setBank('stop', row)">禁用</Button>
                <Button type="success" size="small" style="margin-right: 5px" v-else @click="setBank('unstop', row)">启用</Button>
                <Button type="error" size="small" v-if="row.status === '禁用'"   @click="setBank('delete', row)">删除</Button>
            </template>
          </Table>
        </div>
      </Split>
    </div>

    <bankForm ref="bankForm" @load="loadBank"></bankForm>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import bankForm from './form'
import { bankGroup } from '../../libs/bank'
import {
  updateBank,
  queryBank,
  deleteBank
} from '../../api/bank'
export default {
  name: 'index',
  components: {
    bankForm
  },
  data () {
    return {
      splitLeft: 0.2,
      groupList: [],
      selectGroup: '0',
      groupData: [{
        name: '银行联行号',
        expand: true,
        id: '0',
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
                background: this.selectGroup === data.id ? '#d5e8fc' : 'none'
              },
              on: {
                click: () => { this.selectGroup = data.id }
              }
            }, data.name)
          ])
        },
        children: []
      }],
      bankColumns: [
        {
          title: '联行号',
          key: 'linkNumber'
        },
        {
          title: '开户行',
          key: 'bankDeposit'
        },
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '银行',
          key: 'bank'
        },
        {
          title: '省',
          key: 'province'
        },
        {
          title: '县/市',
          key: 'city'
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
      bankList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList'
    ]),
    tableData () {
      let list
      if (this.selectGroup === '0') {
        list = this.bankList
      } else {
        list = this.bankList.filter(v => v.bankId === this.selectGroup)
      }
      return list
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadGroup()
          this.loadBank()
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
            background: this.selectGroup === data.id ? '#d5e8fc' : 'none'
          },
          on: {
            click: () => {
              this.selectGroup = data.id
            }
          }
        }, data.id + '（' + data.name + '）')
      ])
    },
    loadGroup () {
      this.groupData[0].children = bankGroup
      this.groupList = bankGroup
    },
    judge () {
      // let bool = true
      // if (this.myUser.role === 'accountSet' && !this.adminList.includes(this.myUser._id)) {
      //   let pData = this.myPermission.feature.find(v => v.title === '基础资料')
      //   if (pData.children.filter(v => v.title === '管理权' && !v.checked).length) {
      //     this.$Notice.error({
      //       title: `公共资料-银行关联号`,
      //       desc: '您只有查看权，没有管理权，请联系管理员'
      //     })
      //     bool = false
      //   }
      // }
      return true
    },
    loadBank () {
      queryBank({ accountSetId: this.accountSet._id }).then(res => {
        console.log('queryBank', res.data)
        this.bankList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '银行关联号',
          desc: err.message
        })
      })
    },
    setBank (type, item) {
      if (!this.judge()) return
      let formData = item ? Object.assign({}, item) : {
        accountSetId: this.accountSet._id
      }
      switch (type) {
        case 'add':
          this.$refs.bankForm.show('新建', null, this.bankList, formData)
          break
        case 'edit':
          this.$refs.bankForm.show('修改', formData, this.bankList)
          break
        case 'stop':
        case 'unstop':
          let status = type === 'stop' ? '禁用' : '启用'
          this.$Modal.confirm({
            title: '银行关联号',
            content: `是否${status}${item.bankDeposit}`,
            onOk: () => {
              formData.status = status
              this.updateBank(formData)
            }
          })
          break
        case 'delete':
          this.$Modal.confirm({
            title: '删除银行关联号',
            content: `是否删除银行关联号：${item.bankDeposit}`,
            onOk: () => {
              deleteBank({
                id: item._id
              }).then(res => {
                this.$Notice.success({
                  title: '银行关联号',
                  desc: `成功删除银行关联号：${item.bankDeposit}`
                })
                this.loadBank()
              }).catch(err => {
                this.$Notice.error({
                  title: '银行关联号',
                  desc: err.message
                })
              })
            }
          })
          break
      }
    },
    updateBank (formData) {
      updateBank(formData).then(res => {
        this.loadBank()
      }).catch(err => {
        this.$Notice.error({
          title: '银行关联号',
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
