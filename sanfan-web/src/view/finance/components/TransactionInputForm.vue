<template>
  <Form :model="formItem" :label-width="80" :rules="ruleValidate" ref="form">
    <Row v-if="model=='edit'">
      <Col span="12">
        <FormItem label="编号">
          <Input v-model="formItem.bizNo" :readonly="model=='edit'"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="金额" prop="amount">
          <Input v-model="formItem.amount" number></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="支付方式" prop="payType">
          <Input v-model="formItem.payType"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="单价">
          <Input v-model="formItem.price"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="数量">
          <Input v-model="formItem.num"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="凭证字">
          <Input v-model="formItem.voucherWord"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="凭证号">
          <Input v-model="formItem.voucherNo"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="11">
        <FormItem label="类型">
          <Input v-model="formItem.category"></Input>
        </FormItem>
      </Col>
      <Col span="13">
        <FormItem label="业务日期" prop="date">
          <DatePicker type="date" class="search-col" split-panels v-model="formItem.bizDate"></DatePicker>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="来往业务">
          <Input v-model="formItem.dealing"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="记账方式">
          <Input v-model="formItem.chargeType"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="关键词">
          <Input v-model="formItem.keyword"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="商家">
          <Input v-model="formItem.customer"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="账款类型" prop="bizType">
          <Select v-model="formItem.bizType" filterable>
            <Option v-for="item in codeTypesSelect" :value="item.code" :key="item.code">{{  item.name }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="经办人">
          <Selector v-model="formItem.operatorId" :list="personnel"></Selector>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="制表人" prop="listerId">
          <Selector v-model="formItem.listerId" :list="personnel"></Selector>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="审核人" prop="auditorId">
          <Selector v-model="formItem.auditorId" :list="personnel"></Selector>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="审批人" prop="approverId">
          <Selector v-model="formItem.approverId" :list="personnel"></Selector>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="出纳人" prop="cashierId">
          <Selector v-model="formItem.cashierId" :list="personnel"></Selector>
        </FormItem>
      </Col>
      <Col span="12">
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <FormItem label="摘要(用途)">
          <Input type="textarea" v-model="formItem.remark"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <FormItem label="科目">
          <Input type="textarea" v-model="formItem.subject"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <FormItem label="相片">
          <UploadPhoto v-model="formItem.photos"></UploadPhoto>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
import { mapGetters } from 'vuex'
import { selectAndUpload } from '../../../libs/aliyun'
import UploadPhoto from '../../../components/upload/upload-pic'
import Selector from '../../../components/employees/selector'
import { getAllEmployee } from '@/api/employee'

export default {
  name: 'TransactionForm',
  components: {
    UploadPhoto,
    Selector
  },
  props: {
    reference: Object, // 传过来的数据
    model: String, // 传过来的数据
    defaultCodeTypes: Array
  },
  data () {
    return {
      formItem: {
        amount: 1000.01,
        approverId: '',
        auditorId: '',
        billProcessDTOList: [
          {
            processStage: 'LISTER',
            processorId: ''
          },
          {
            processStage: 'OPERATOR',
            processorId: ''
          },
          {
            processStage: 'AUDITOR',
            processorId: ''
          },
          {
            processStage: 'APPROVER',
            processorId: ''
          },
          {
            processStage: 'CASHIER',
            processorId: ''
          }
        ],
        bizDate: '2019-04-03 12:10:21',
        bizType: 'YS',
        cashierId: '',
        category: '出货',
        chargeType: '记账方式1',
        customer: '深圳某品牌',
        dealing: 'xx往来',
        keyword: '出货收款',
        listerId: '402880086950ab4c016950b1a4460002',
        num: 200,
        operatorId: '402880086950ab4c016950b1a4460002',
        payType: '微信支付',
        photos: [],
        price: 20,
        remark: '我的应收',
        subject: '科目xx',
        title: '',
        voucherNo: 'xx00000',
        voucherWord: '凭证字11'
      },
      ruleValidate: {
        bizType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '必填项', trigger: 'blur', type: 'number' }
        ],
        payType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        bizDate: [
          { required: true, message: '必填项', trigger: 'blur', type: 'date' }
        ],
        listerId: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        auditorId: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        approverId: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        cashierId: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
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
      personnel: []
    }
  },
  watch: {
    reference (val, oldVal) {
      this.updateData()
    },
    defaultCodeTypes (val, oldVal) {
      if (this.defaultCodeTypes.length === 1 && !this.formItem.bizType) {
        this.formItem.bizType = this.defaultCodeTypes[0] // 默认选择第一个
      }
    }
  },
  computed: {
    ...mapGetters([
      'who'
    ]),
    codeTypesSelect () {
      if (!this.defaultCodeTypes.length) return this.codeTypes
      return this.codeTypes.filter(item => this.defaultCodeTypes.filter(code => item.code === code).length !== 0)
    }
  },
  mounted () {
    this.updateData()
    getAllEmployee().then(res => {
      this.personnel = res.data
    })
  },
  methods: {
    updateData () {
      if (this.reference) {
        Object.keys(this.reference).forEach((k) => {
          this.formItem[k] = this.reference[k]
        })
      }
      if (this.defaultCodeTypes.length === 1 && !this.formItem.codeTypes) {
        this.formItem.bizType = this.defaultCodeTypes[0] // 默认选择第一个
      }
      if (!this.formItem.bizDate && this.model === 'add') {
        this.formItem.bizDate = new Date()
      }
      if (this.formItem.bizDate && typeof this.formItem.bizDate === 'string') {
        this.formItem.bizDate = new Date(this.formItem.bizDate)
      }
    },
    validate (callback) {
      return this.$refs.form.validate(callback)
    },
    uploadPhoto () {
      selectAndUpload(file => {
        console.log(file)
      }, url => {
        console.log(url)
      })
    }
  }
}
</script>

<style scoped>

</style>
