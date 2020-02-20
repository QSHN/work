<template>
  <Form :model="formItem" :label-width="80">
    <Row>
      <Col span="12">
        <FormItem label="编号">
          <Input v-model="formItem.bizNo"></Input>
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
  </Form>
</template>

<script>
import { mapGetters } from 'vuex'
import Selector from '../../../components/employees/selector'
import { getAllEmployee } from '@/api/employee'
export default {
  name: 'TransactionForm',
  props: {
    reference: Object, // 传过来的数据
    defaultCodeTypes: Array
  },
  components: {
    Selector
  },
  data () {
    return {
      formItem: {
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
  computed: {
    ...mapGetters([
      'personnel',
      'who'
    ]),
    codeTypesSelect () {
      return this.codeTypes.filter(item => this.defaultCodeTypes.filter(code => item.code === code).length !== 0)
    }
  },
  mounted () {
    if (this.reference) {
      Object.keys(this.reference).forEach((k) => {
        this.formItem[k] = this.reference[k]
      })
    }
    getAllEmployee().then(res => {
      this.personnel = res.data
    })
  }
}
</script>

<style scoped>

</style>
