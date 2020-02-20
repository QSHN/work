<template>
  <div>
    <Card class="info_con">
      <span>今日收入：{{info.debitAmount}} 元 </span>
      <span>今日支出：{{info.creditAmount}} 元 </span>
      <span>今日自定义：{{info.customAmount}} 元 </span>
      <span>今日收支结余：{{info.curBalance}} 元 </span>
      <span>总账结余：{{info.totalAmt}} 元 </span>
      <span>总账自定义：{{info.totalCustomAmt}} 元 </span>
    </Card>
    <Card>
      <div class="search-con search-con-top">
        <Select v-model="searchCode" class="search-col">
          <Option v-for="item in codeTypes" :value="item.code" :key="`search-col-${item.code}`">
            {{ item.name }}
          </Option>
        </Select>
        <DatePicker type="daterange" class="search-col" split-panels placeholder="选择日期范围" style="width: 200px"
                    v-model="searchDate"></DatePicker>
        <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
        <Button @click="SearchModal.show=true; SearchModal.loading=true" class="search-btn" type="info">高级搜索</Button>
        <Button @click="handleClear" class="search-btn">清除条件</Button>
      </div>
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
          <!--<Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看</Button>-->
          <!--<Button type="error" size="small" @click="remove(index)">删除</Button>-->
        </template>
      </Table>
      <div class="page_con">
        <Page :current="page.current" :page-size="page.pageSize" @on-change="selectPage"
              @on-page-size-change="size=>this.page.pageSize=size" :total="page.total" show-elevator show-total/>
      </div>
    </Card>
    <Modal
      v-model="SearchModal.show"
      title="历史支出详细搜索"
      :loading="SearchModal.loading"
      @on-ok="handleAdvancedSearch">
      <TransactionSearchForm ref="searchForm" :reference="searchForm" :defaultCodeTypes="['Z','S','YS','YF','GZ']"></TransactionSearchForm>
    </Modal>
  </div>
</template>
<style scoped lang="less">
  @import "./index.less";
</style>
<script>
import expandRow from '../components/table-expand.vue'
import { getBalance, postBasesearch } from '../../../api/finance'
import { mapGetters, mapActions } from 'vuex'
import TransactionSearchForm from '../components/TransactionSearchForm'
import { deepCopy } from '../../../libs/util'
import moment from 'moment'
export default {
  name: 'Balance',
  components: {
    TransactionSearchForm
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
        }
        // ,
        // {
        //   title: '操作',
        //   align: 'center',
        //   slot: 'action',
        //   minWidth: 150
        // }
      ],
      tableData: [],
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
      searchCode: '*',
      searchDate: [],
      params: {},
      codeTypes: [
        { code: 'DEBIT', name: '收入' },
        { code: 'CREDIT', name: '支出' },
        { code: 'CUSTOM', name: '记账' }
      ],
      page: {
        total: 100,
        current: 1,
        pageSize: 20
      },
      info: {
        debitAmount: 0,
        creditAmount: 0,
        customAmount: 0,
        curBalance: 0,
        totalAmt: 0,
        totalCustomAmt: 0
      },
      SearchModal: {
        show: false,
        loading: true
      }
    }
  },
  computed: {
    ...mapGetters([
      'who',
      'contacts'
    ])
  },
  methods: {
    ...mapActions([
      'getContacts'
    ]),
    getName (id) {
      const u = this.who(id)
      return u ? u.name : ''
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
    typeName (codeType) {
      const arr = this.codeTypes.filter(item => item.code === codeType)
      if (arr.length) {
        return arr[0].name
      } else {
        return ''
      }
    },
    showName (uid) {
      return this.who(uid)
    },
    handleClear (e) {
      this.params = {}
      this.searchCode = '*'
      this.searchDate = []
      this.selectPage(1)
    },
    handleSearch () {
      this.params = {}
      if (this.searchCode !== '*') {
        this.params.dcFlags = [this.searchCode]
      }
      if (this.searchDate.length && this.searchDate[0] && this.searchDate[1]) {
        this.params.startDate = moment(this.searchDate[0]).format('YYYY-MM-DD')
        this.params.endDate = moment(this.searchDate[1]).format('YYYY-MM-DD')
      }
      this.selectPage(1)
    },
    selectPage (page) {
      this.page.current = page
      postBasesearch({ pageSize: this.page.pageSize, pageNum: this.page.current, ...this.params }).then(res => {
        this.tableData = res.data.list.map(item => item.billInfo)
        this.page.total = res.data.pages
      })
    },
    getInfo () {
      getBalance().then((info) => {
        this.info = info.data
      })
    },
    handleAdvancedSearch () {
      this.SearchModal.show = false
      this.SearchModal.loading = false
      let data = deepCopy(this.$refs.searchForm.formItem)

      if (data.bizDate.length && data.bizDate[0] && data.bizDate[1]) {
        let date = {
          startDate: data.bizDate[0],
          endDate: data.bizDate[1]
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
    }
  },
  mounted () {
    this.getInfo()
    if (this.contacts.length) {
      this.selectPage(1)
    } else {
      this.getContacts().then(res => {
        this.selectPage(1)
      })
    }
  }
}
</script>
