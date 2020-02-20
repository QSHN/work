<template>
  <div>
    <Table border :columns="columns" :data="tableData">
      <template slot-scope="{ row }" slot="bizType">
        <strong>{{ typeName(row.bizType) }}</strong>
      </template>
      <template slot-scope="{ row }" slot="operatorId">
        <strong>{{ getName(row.operatorId) }}</strong>
      </template>
      <template slot-scope="{ row }" slot="listerId">
        <strong>{{ getName(row.listerId) }}</strong>
      </template>
      <template slot-scope="{ row }" slot="auditorId">
        <strong>{{ getName(row.auditorId) }}</strong>
        <p>{{ getStatus(getProcess(row, 'AUDITOR').processResult) }}</p>
      </template>
      <template slot-scope="{ row }" slot="approverId">
        <strong>{{ getName(row.approverId) }}</strong>
        <p>{{ getStatus(getProcess(row, 'APPROVER').processResult) }}</p>
      </template>
      <template slot-scope="{ row }" slot="cashierId">
        <strong>{{ getName(row.cashierId) }}</strong>
        <p>{{ getStatus(getProcess(row, 'CASHIER').processResult) }}</p>
      </template>
      <template slot-scope="{ row }" slot="status">
        <strong>{{getStatus(row.status)}}</strong>
        <strong v-if="row.status=='PASSED'" style="color: #01b38b">{{getStatus(row.status)}}</strong>
        <strong v-else style="color: #ff715a">{{getStatus(row.status)}}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <!--<Button type="primary" size="small" style="margin-right: 5px" @click="show(row)">查看</Button>-->
        <Button v-if="type == 'audit_un'&&row.status!='PASSED'" @click="auditPass(row)" type="primary" size="small" style="margin-right: 5px">通过</Button>
        <Button v-if="type == 'audit_un'&&row.status!='PASSED'" @click="auditReject(row)" type="primary" size="small" style="margin-right: 5px">拒绝</Button>
        <Button v-if="type == 'my_un'&&row.status!='PASSED'" type="primary" size="small" style="margin-right: 5px" @click="editStatus(row,'CANCELED')">撤回</Button>
        <Button v-if="(type == 'my_un'||type == 'my_ok')&&row.status=='CANCELED'" type="primary" size="small" style="margin-right: 5px" @click="edit(row)">编辑</Button>
        <!--<Button type="error" size="small" @click="remove(row)">删除</Button>-->
      </template>
    </Table>
    <div class="page_con">
      <Page :current="page.current" :page-size="page.pageSize" @on-change="selectPage"
            @on-page-size-change="size=>this.page.pageSize=size" :total="page.total" show-elevator show-total/>
    </div>
    <Modal
      key="editModal"
      v-model="editModal.show"
      title="修改记录"
      :loading="editModal.loading"
      @on-ok="editInput">
      <TransactionInputForm ref="editForm" model="edit" :defaultCodeTypes="editModal.defaultCodeTypes" :reference="editModal.formData"></TransactionInputForm>
    </Modal>
  </div>
</template>
<style scoped>
  .page_con{
    width: 100%;
    text-align: right;
    padding-top: 10px;
    padding-bottom: 2px;
  }
</style>
<script>
import { mapGetters, mapActions } from 'vuex'
import expandRow from '../components/table-expand.vue'
import TransactionInputForm from '../components/TransactionInputForm'
import { getMyApprove, getMyLaunch, postProcess, postBill } from '../../../api/finance'

export default {
  name: 'audit',
  components: {
    TransactionInputForm
  },
  props: {
    type: String
  },
  watch: {
    type (val) {
      this.selectPage()
    },
    auditRefresh () {
      this.selectPage()
    }
  },
  data () {
    return {
      columns: [
        {
          title: '',
          type: 'expand',
          minWidth: 60,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '编号',
          align: 'center',
          key: 'bizNo',
          minWidth: 125
        },
        {
          title: '金额',
          align: 'center',
          key: 'amount',
          minWidth: 120
        },
        {
          title: '记帐方式',
          align: 'center',
          key: 'payType',
          minWidth: 120
        },
        {
          title: '单价',
          align: 'center',
          key: 'price',
          minWidth: 100
        },
        {
          title: '数量',
          align: 'center',
          key: 'num',
          minWidth: 80
        },
        // {
        //   title: '凭证字',
        //   align: 'center',
        //   key: 'docWord'
        // },
        // {
        //   title: '凭证号',
        //   align: 'center',
        //   key: 'docNumber'
        // },
        // {
        //   title: '类别',
        //   align: 'center',
        //   key: 'category'
        // },
        {
          title: '业务日期',
          align: 'center',
          key: 'bizDate',
          minWidth: 100
        },
        // {
        //   title: '往来业务',
        //   align: 'center',
        //   key: 'business'
        // },
        // {
        //   title: '记账方式',
        //   align: 'center',
        //   key: 'bookkeeping'
        // },
        // {
        //   title: '关键词',
        //   align: 'center',
        //   key: 'keyword'
        // },
        // {
        //   title: '相片',
        // align: 'center',
        //   key: 'photo'
        // },
        // {
        //   title: '商家',
        //   align: 'center',
        //   key: 'merchant'
        // },
        {
          title: '账单类型',
          align: 'center',
          slot: 'bizType',
          minWidth: 80
        },
        {
          title: '经办人',
          align: 'center',
          slot: 'operatorId',
          minWidth: 80
        },
        {
          title: '制表人',
          align: 'center',
          slot: 'listerId',
          minWidth: 80
        },
        {
          title: '审核人',
          align: 'center',
          slot: 'auditorId',
          minWidth: 80
        },
        {
          title: '审批人',
          align: 'center',
          slot: 'approverId',
          minWidth: 80
        },
        {
          title: '出纳人',
          align: 'center',
          slot: 'cashierId',
          minWidth: 80
        },
        {
          title: '状态',
          align: 'center',
          slot: 'status',
          minWidth: 80
        },
        // {
        //   title: '摘要（用途）',
        //   align: 'center',
        //   key: 'remark',
        //   minWidth: 120
        // },
        // {
        //   title: '科目',
        //   align: 'center',
        //   key: 'subject',
        //   minWidth: 100
        // },
        {
          title: '操作',
          align: 'center',
          slot: 'action',
          minWidth: 180
        }
      ],
      tableData: [],
      page: {
        total: 100,
        current: 1,
        pageSize: 20
      },
      codeTypes: [
        { code: 'YF', name: '应付账款' },
        { code: 'YS', name: '应收账款' },
        { code: 'LS', name: '收入账款' },
        { code: 'LC', name: '支出账款' },
        { code: 'LO', name: '自定义账款' },
        { code: 'GZ', name: '固定支出' },
        { code: 'BX', name: '费用报销' }
      ],
      editModal: {
        show: false,
        loading: true,
        defaultCodeTypes: [],
        formData: {}
      }
    }
  },
  computed: {
    ...mapGetters([
      'who',
      'myUserId',
      'contacts',
      'auditRefresh'
    ])
  },
  mounted () {
    if (this.contacts.length) {
      this.selectPage(1)
    } else {
      this.getContacts().then(res => {
        this.selectPage(1)
      })
    }
  },
  methods: {
    ...mapActions([
      'getContacts',
      'handlerAuditRefresh'
    ]),
    getName (id) {
      const u = this.who(id)
      return u ? u.name : ''
    },
    getProcess (item, key) {
      let p
      item.billProcessDTOList.forEach(b => {
        if (b.processStage === key) p = b
      })
      return p
    },
    getStatus (key) {
      if (key === 'UNAPPROVED') return '未审批'
      if (key === 'APPROVING') return '待审批'
      if (key === 'APPROVED') return '已审批'
      if (key === 'REJECTED') return '已驳回'
      if (key === 'CANCELED') return '已撤回'
      return ''
    },
    getAudit (item) {
      if (item.reviewer === this.myUserId && item.status === '待审核') {
        return { pass: '已审核', reject: '审核驳回' }
      }
      if (item.approver === this.myUserId && item.status === '已审核') {
        return { pass: '已审批', reject: '审批驳回' }
      }
      if (item.bookkeeper === this.myUserId && item.status === '已审批') {
        return { pass: '已完成', reject: '收付驳回' }
      }
      return null
    },
    isRecall (row) {
      if (row.lister === this.myUserId && (row.status === '待审核' || row.status === '已审核' || row.status === '已审批')) {
        return true
      } else {
        return false
      }
    },
    isEdit (row) {
      if (row.lister === this.myUserId && (row.status === '撤回中' || row.status === '审核驳回' || row.status === '审批驳回' || row.status === '收付驳回')) {
        return true
      } else {
        return false
      }
    },
    showSataus (status) {
      if (status === '已审核') return '待审批'
      if (status === '已审批') return '待确认'
      if (status === '驳回中') return '驳回修改'
      if (status === '撤回中') return '已撤回'
      return status
    },
    auditPass (item) {
      this.$Modal.confirm({ title: '注意',
        content: '您确定要通过吗?',
        onOk: () => {
          postProcess({ billId: item.id, approveAction: 'PASSED', approveId: this.myUserId }).then(res => {
            this.handlerAuditRefresh()
          })
        }
      })
    },
    auditReject (item) {
      let objection = ''
      let self = this
      this.$Modal.error({
        title: '拒绝该账款',
        render (h) {
          return h('Input', {
            props: {
              // value: this.value,
              autofocus: true,
              placeholder: `请填写拒绝的理由`
            },
            on: {
              input: (val) => {
                objection = val
              }
            }
          })
        },
        onOk () {
          if (objection.length) {
            postProcess({
              billId: item.id,
              approveAction: 'REJECTED',
              approveId: this.myUserId,
              note: objection
            }).then(res => {
              this.handlerAuditRefresh()
            })
          } else {
            self.$Notice.error({
              title: '错误提示',
              desc: '拒绝失败，请填写错误理由'
            })
          }
        },
        onCancel: () => {}
      })
    },
    typeName (codeType) {
      const arr = this.codeTypes.filter(item => item.code === codeType)
      if (arr.length) {
        return arr[0].name
      } else {
        return ''
      }
    },
    selectPage (page) {
      if (page) this.page.current = page
      if (this.type === 'audit_un' || this.type === 'audit_ok') {
        getMyApprove({
          isProcessing: (this.type === 'audit_un'),
          pageSize: this.page.pageSize,
          pageNum: this.page.current
        }).then(res => {
          this.tableData = res.data.list
          this.page.total = res.data.count
        })
      } else if (this.type === 'my_un' || this.type === 'my_ok') {
        getMyLaunch({
          isProcessing: (this.type === 'my_un'),
          pageSize: this.page.pageSize,
          pageNum: this.page.current
        }).then(res => {
          this.tableData = res.data.list
          this.page.total = res.data.count
        })
      }
    },
    edit (item) {
      this.editModal.defaultCodeTypes = [item.bizType]
      this.editModal.formData = item
      this.editModal.loading = true
      this.editModal.show = true
    },
    editHide (loading) {
      if (!loading) this.editModal.show = false
      this.editModal.loading = false
      this.$nextTick(r => {
        this.editModal.loading = true
      })
    },
    editStatus (item, status, note) {
      postProcess({ billId: item.id, approveAction: status, approveId: this.myUserId, note }).then(res => {
        this.handlerAuditRefresh()
      })
    },
    editInput () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let data = Object.assign({}, this.$refs.editForm.formItem)
          data.date = new Date(data.date).toHawkDateString()
          postBill(data).then(res => {
            this.editHide()
            this.$Message.success('修改成功')
            this.handlerAuditRefresh()
          }).catch(err => {
            console.log(err)
            this.$Message.error('修改失败')
          })
        } else {
          this.editHide(true)
          this.$Message.error('请填写正确数据~！')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
