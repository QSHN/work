<template>
  <div>
    <Card>
      <Row>
        <Col span="4">
          <div class="add-con">
            <Button @click="add" class="search-btn">
              <Icon type="ios-add" />
              添加
            </Button>
          </div>
        </Col>
        <Col span="20">
          <div class="search-con search-con-top">
            <Select v-if="codeTypesSelect.length > 1" v-model="searchCode" class="search-col" clearable>
              <Option v-for="item in codeTypesSelect" :value="item.code" :key="`search-col-${item.code}`">
                {{ item.name }}
              </Option>
            </Select>
            <DatePicker type="daterange" class="search-col" split-panels placeholder="选择日期范围" style="width: 200px"
                        v-model="searchDate"></DatePicker>
            <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
            <Button @click="searchModal.show=true; searchModal.loading=true" class="search-btn" type="info">高级搜索</Button>
            <Button @click="handleClear" class="search-btn">清除条件</Button>
          </div>
        </Col>
      </Row>
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
        </template>
        <template slot-scope="{ row }" slot="approverId">
          <strong>{{ getName(row.approverId) }}</strong>
        </template>
        <template slot-scope="{ row }" slot="cashierId">
          <strong>{{ getName(row.cashierId) }}</strong>
        </template>
        <template slot-scope="{ row }" slot="status">
          <strong v-if="row.status=='PASSED'" style="color: #01b38b">已完成</strong>
          <strong v-else-if="row.status=='UNDERWAY'" style="color: #ff715a">进行中</strong>
          <strong v-else-if="row.status=='CALLBACK'" style="color: #ff715a">已撤回</strong>
          <strong v-else-if="row.status=='APPROVING'" style="color: #ff715a">待审批</strong>
          <strong v-else-if="row.status=='CONFIRMING'" style="color: #ff715a">确认中</strong>
          <strong v-else-if="row.status=='CANCELED'" style="color: #ff715a">已撤回</strong>
          <strong v-else-if="row.status=='REJECTED'" style="color: #ff715a">已驳回</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <!--<Button type="primary" size="small" style="margin-right: 5px" @click="show(row)">查看</Button>-->
          <Button v-if="isRecall(row)" type="primary" size="small" style="margin-right: 5px" @click="editStatus(row,'撤回中')">撤回</Button>
          <Button v-if="isEdit(row)" type="primary" size="small" style="margin-right: 5px" @click="edit(row)">编辑</Button>
          <!--<Button type="error" size="small" @click="remove(row)">删除</Button>-->
        </template>
      </Table>
      <div class="page_con">
        <Page :current="page.current" :page-size="page.pageSize" @on-change="selectPage"
              @on-page-size-change="size=>this.page.pageSize=size" :total="page.total" show-elevator show-total/>
      </div>
    </Card>
    <Modal
      v-model="searchModal.show"
      title="历史支出详细搜索"
      :loading="searchModal.loading"
      @on-ok="handleAdvancedSearch">
      <TransactionSearchForm v-if="searchModal.show" ref="searchForm" :defaultCodeTypes="defaultCodeTypes" :reference="searchForm"></TransactionSearchForm>
    </Modal>
    <Modal
      key="addModal"
      v-model="addModal.show"
      title="添加新记录"
      :loading="addModal.loading"
      @on-ok="addInput">
      <TransactionInputForm v-if="addModal.show" ref="addForm" model="add" :defaultCodeTypes="defaultCodeTypes"></TransactionInputForm>
    </Modal>
    <Modal
      key="editModal"
      v-model="editModal.show"
      title="修改记录"
      :loading="editModal.loading"
      @on-ok="editInput">
      <TransactionInputForm v-if="editModal.show" ref="editForm" model="edit" :defaultCodeTypes="defaultCodeTypes" :reference="editModal.formData"></TransactionInputForm>
    </Modal>
  </div>
</template>
<style scoped lang="less">
  @import "./index.less";
</style>
<script>
import expandRow from '../components/table-expand.vue'
import { postBillListByBiztype, postBill, postSearch, postProcess } from '../../../api/finance'
import TransactionSearchForm from '../components/TransactionSearchForm'
import TransactionInputForm from '../components/TransactionInputForm'
import { deepCopy } from '../../../libs/util'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'Viewer',
  components: {
    TransactionSearchForm,
    TransactionInputForm
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
        {
          title: '摘要（用途）',
          align: 'center',
          key: 'remark',
          minWidth: 120
        },
        {
          title: '科目',
          align: 'center',
          key: 'subject',
          minWidth: 100
        },
        {
          title: '操作',
          align: 'center',
          slot: 'action',
          minWidth: 160
        }
      ],
      tableData: [],
      searchCode: '',
      searchForm: {
        amount: '',
        approverId: '',
        auditorId: '',
        bizDate: '',
        bizType: '',
        cashierId: '',
        category: '',
        chargeType: '',
        customer: '',
        dealing: '',
        keyword: '',
        listerId: '',
        num: '',
        operatorId: '',
        payType: '',
        price: '',
        remark: '',
        subject: '',
        title: '',
        voucherNo: '',
        voucherWord: ''
      },
      defaultCodeTypes: [],
      searchDate: [],
      searchMode: false,
      params: {},
      codeTypes: [
        { code: 'YF', name: '应付账款' },
        { code: 'YS', name: '应收账款' },
        { code: 'LS', name: '收入账款' },
        { code: 'LC', name: '支出账款' },
        { code: 'LO', name: '自定义账款' },
        { code: 'GZ', name: '固定支出' },
        { code: 'BX', name: '费用报销' }
      ],
      page: {
        total: 100,
        current: 1,
        pageSize: 2
      },
      searchModal: {
        show: false,
        loading: true
      },
      addModal: {
        show: false,
        loading: true
      },
      editModal: {
        show: false,
        loading: true,
        formData: {}
      }
    }
  },
  watch: {
    financeItem (val) {
      const index = this.tableData.findIndex(item => item._id === val._id)
      this.tableData.splice(index, 1, val)
    }
  },
  computed: {
    ...mapGetters([
      'who',
      'myUserId',
      'financeItem',
      'financeAdd',
      'contacts'
    ]),
    codeTypesSelect () {
      return this.codeTypes.filter(item => this.defaultCodeTypes.filter(code => item.code === code).length !== 0)
    }
  },
  methods: {
    ...mapActions([
      'financeItemChange',
      'financeNewChange',
      'getContacts'
    ]),
    getName (id) {
      const u = this.who(id)
      return u ? u.name : ''
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
    show (index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      })
    },
    remove (index) {
      this.data6.splice(index, 1)
    },
    showName (uid) {
      return this.who(uid)
    },
    typeName (codeType) {
      const arr = this.codeTypes.filter(item => item.code === codeType)
      if (arr.length) {
        return arr[0].name
      } else {
        return ''
      }
    },
    handleClear (e) {
      this.searchMode = false
      this.params = {}
      this.searchDate = []
      this.searchCode = ''
      this.selectPage(1)
    },
    handleSearch () {
      this.searchMode = true
      this.params = {}
      if (this.searchDate.length && this.searchDate[0] && this.searchDate[1]) {
        this.params.date = {
          from: this.searchDate[0],
          to: this.searchDate[1]
        }
      }
      if (this.searchCode) {
        this.params.biztype = this.searchCode
      }
      this.selectPage(1)
    },
    selectPage (page) {
      this.page.current = page || this.page.current
      let data = { ...this.params }
      data.pageSize = this.page.pageSize
      data.pageNum = this.page.current
      if (this.searchMode) {
        postSearch(data).then(res => {
          this.tableData = res.data.list
          this.page.total = res.data.pages
        })
      } else {
        data.biztype = data.biztype || this.defaultCodeTypes
        postBillListByBiztype({
          pageSize: this.page.pageSize,
          pageNum: this.page.current,
          biztype: data.biztype
        }).then(res => {
          this.tableData = res.data.list
          this.page.total = res.data.pages
        })
      }
    },
    handleAdvancedSearch () {
      this.searchMode = true
      this.searchModal.show = false
      this.searchModal.loading = false
      let data = deepCopy(this.$refs.searchForm.formItem)
      if (data.bizDate.length && data.bizDate[0] && data.bizDate[1]) {
        this.searchDate = data.date
        let date = {
          from: data.bizDate[0],
          to: data.bizDate[1]
        }
        data.date = date
      } else {
        delete data.date
      }
      Object.keys(data).forEach(k => {
        if (data[k] === '') {
          delete data[k]
        }
      })
      this.params = data
      this.selectPage(1)
    },
    add () {
      this.addModal.loading = true
      this.addModal.show = true
    },
    edit (item) {
      this.editModal.formData = item
      this.editModal.loading = true
      this.editModal.show = true
    },
    editStatus (item, status, note) {
      postProcess({ billId: item.id, approveAction: status, approveId: this.myUserId, note }).then(res => {
        this.selectPage()
      })
    },
    addHide (loading) {
      if (!loading) this.addModal.loading = false
      this.addModal.show = false
      this.$nextTick(r => {
        this.addModal.loading = true
      })
    },
    addInput () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let data = deepCopy(this.$refs.addForm.formItem)
          console.log(data)
          data.bizDate = moment(data.bizDate).format('YYYY-MM-DD')
          data.billProcessDTOList = [
            {
              'processStage': 'LISTER',
              'processorId': data.listerId
            },
            {
              'processStage': 'OPERATOR',
              'processorId': data.operatorId
            },
            {
              'processStage': 'AUDITOR',
              'processorId': data.auditorId
            },
            {
              'processStage': 'APPROVER',
              'processorId': data.approverId
            },
            {
              'processStage': 'CASHIER',
              'processorId': data.cashierId
            }
          ]
          console.log(data)
          postBill(data).then(res => {
            this.addHide()
            this.$Message.success('添加成功')
            this.selectPage()
            this.financeNewChange(res.data)
          }).catch(err => {
            console.log(err)
            this.$Message.error('添加失败')
          })
        } else {
          this.editHide(true)
          this.$Message.error('请填写正确数据~！')
        }
      })
    },
    editHide (loading) {
      if (!loading) this.editModal.show = false
      this.editModal.loading = false
      this.$nextTick(r => {
        this.editModal.loading = true
      })
    },
    editInput () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let data = deepCopy(this.$refs.editForm.formItem)
          console.log(data)
          data.bizDate = moment(data.bizDate).format('YYYY-MM-DD')
          postBill(data).then(res => {
            this.editHide()
            this.$Message.success('修改成功')
            this.selectPage()
            this.financeItemChange(res.data)
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
  },
  mounted () {
    if (this.contacts.length) {
      this.defaultCodeTypes = this.$route.meta.codeTypes
      this.selectPage(1)
    } else {
      this.getContacts().then(res => {
        this.defaultCodeTypes = this.$route.meta.codeTypes
        this.selectPage(1)
      })
    }
  }
}
</script>
