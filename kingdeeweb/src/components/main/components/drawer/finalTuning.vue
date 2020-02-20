<template>
  <Modal
    v-model="modal"
    title="期末调汇"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="700"
    @on-cancel="cancel">
    <div v-if="isFirst">
      <Form :label-width="100">
        <Row type="flex">
          <FormItem label="汇率类型" style="margin-bottom: 15px;">
            <Select v-model="formData.rateTypeId" @on-change="selectRate"  style="width:100px">
              <Option v-for="item in rateTypeList" :value="item._id" :key="item.code">{{ item.name }}</Option>
            </Select>
            <Button type="primary" style="margin-left: 10px;" @click="setRate">设置</Button>
            <Button type="success" style="margin-left: 10px;" @click="isCustom = !isCustom">{{!isCustom ? '自定义' : '默认'}}</Button>
          </FormItem>

          <FormItem label="调汇日期" style="margin-bottom: 15px;">
            <DatePicker type="date" v-model="formData.businessDate" style="width: 200px"></DatePicker>
          </FormItem>
        </Row>
      </Form>

      <Table border ref="userTable" :columns="isCustom ? rateCustom : rateColumns" :data="currencyList">
        <template slot-scope="{ row }" slot="rate">
          <InputNumber :min="0" :step="0.1"
                       v-model="currencyList[row._index].rate"
                       style="width: 100px"></InputNumber>
        </template>
      </Table>
    </div>
    <div v-else>
      <Form :label-width="100">
        <FormItem label="汇兑损益科目">
          <Input v-model="formData.subjectCode" style="width: 400px" readonly />
          <Button type="default" style="margin-left: 10px;" @click="selectSubject">选择</Button>
        </FormItem>

        <FormItem>
          <Checkbox v-model="formData.isGenerate" style="margin-right: 30px;">生成转账凭证</Checkbox>
          <Checkbox v-model="formData.isSubject">按其科目方向调汇</Checkbox>
        </FormItem>

        <FormItem  label="生成凭证分类">
          <RadioGroup v-model="formData.category">
            <Radio label="汇兑收益" style="margin-right: 30px;"></Radio>
            <Radio label="汇兑损失" style="margin-right: 30px;"></Radio>
            <Radio label="汇兑损益"></Radio>
          </RadioGroup>
        </FormItem>

        <FormItem  label="凭证日期">
          <DatePicker type="date" v-model="formData.time" :clearable="false" style="width: 400px;"></DatePicker>
        </FormItem>

        <FormItem  label="凭证字">
          <Select v-model="formData.proofWords" @on-change="selectProof" style="width: 400px">
            <Option v-for="(v, i) in proof" :value="v.name" :key="i">{{v.name}}</Option>
          </Select>
        </FormItem>

        <FormItem  label="凭证摘要">
          <Input v-model="formData.abstract" style="width: 400px;"></Input>
        </FormItem>
      </Form>
    </div>

    <div slot="footer">
      <Button type="text" @click="last">{{isFirst ? '取消' : '上一步'}}</Button>
      <Button type="success" @click="next">{{!isFirst ? '确定' : '下一步'}}</Button>
    </div>

    <subject ref="subject" :isReturnObj="true" :isLimitAccounting="true" />
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryExchangeRate, queryExchangeRateType } from '../../../../api/exchangeRate'
import moment from 'moment'
import { currencyQuery } from '../../../../api/currency'
import { finalTuning, queryLastCredentials } from '../../../../api/credentials'
import subject from '../../../../components/subject/index'
export default {
  name: 'finalTuning',
  components: {
    subject
  },
  data () {
    return {
      modal: false,
      isFirst: true,
      isCustom: false,
      formData: {
        rateType: '',
        rateTypeId: null,
        businessDate: null,
        subjectCode: '6603.03',
        subject: '汇兑损益',
        isGenerate: true,
        isSubject: false,
        category: '汇兑损益',
        time: null,
        proofWordId: null,
        proofWords: null,
        abstract: '结转汇兑损益',
        certificateNumber: null,
        voucher: null,
        serialNumber: null
      },
      lastData: null,
      rateTypeList: [],
      rateList: [],
      currencyList: [],
      proof: [],
      rateColumns: [
        {
          title: '币别编码',
          align: 'center',
          key: 'code'
        },
        {
          title: '币别名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '汇率',
          align: 'center',
          render: (h, params) => {
            let rate = this.selectRateList.find(v => v.currencyId === params.row._id)
            return h('div', rate ? rate.rate.toFixed(this.precision) : '已失效/未设置')
          }
        },
        {
          title: '生效日期',
          align: 'center',
          render: (h, params) => {
            let rate = this.selectRateList.find(v => v.currencyId === params.row._id)
            return h('div', rate ? moment(rate.effectiveDate).format('YYYY-MM-DD') : '已失效/未设置')
          }
        },
        {
          title: '失效日期',
          align: 'center',
          render: (h, params) => {
            let rate = this.selectRateList.find(v => v.currencyId === params.row._id)
            return h('div', rate ? moment(rate.expiryDate).format('YYYY-MM-DD') : '已失效/未设置')
          }
        }
      ],
      rateCustom: [
        {
          title: '币别编码',
          align: 'center',
          key: 'code'
        },
        {
          title: '币别名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '汇率',
          align: 'center',
          slot: 'rate'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myUser',
      'myPermission'
    ]),
    selectRateList () {
      let list = this.rateList.filter(v => v.typeId === this.formData.rateTypeId)
      return list
    },
    precision () {
      let precision = this.rateTypeList.find(v => v._id === this.formData.rateTypeId)
      return precision ? precision.rate : 2
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          let accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
          this.formData.businessDate = this.lastData = this.formData.time = moment(new Date(accountingPeriod)).endOf('month').format('YYYY-MM-DD')
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    show () {
      this.isFirst = true
      this.modal = true
      this.isCustom = false
      this.load()
    },
    cancel () {
      this.modal = false
    },
    last () {
      if (this.isFirst) {
        this.cancel()
      } else {
        this.isFirst = true
      }
    },
    next () {
      let data = Object.assign({
        accountSetId: this.accountSet._id,
        isFirst: this.isFirst,
        lastData: this.lastData,
        isCustom: this.isCustom
      }, this.formData)
      let isDo = true
      if (this.isCustom) {
        let list = []
        this.currencyList.forEach(v => {
          if (v.rate > 0) {
            list.push({
              currencyId: v._id,
              rate: v.rate
            })
          } else {
            isDo = false
          }
        })
        if (isDo) {
          data.rateCustomList = list
        } else {
          this.$Notice.error({
            title: '期末调汇',
            desc: '自定义汇率数据不正确'
          })
          return
        }
      }
      finalTuning(data).then(res => {
        if (this.isFirst) {
          this.isFirst = false
        } else {
          this.$Modal.success({
            title: '期末调汇',
            content: `<p>已经生成一张调汇转账凭证，</p><p>凭证字号为：${this.formData.proofWords}-${this.formData.certificateNumber}</p>`
          })
          this.cancel()
        }
      }).catch(err => {
        this.$Notice.error({
          title: '期末调汇',
          desc: err.message
        })
      })
    },
    load () {
      queryExchangeRateType({ accountSetId: this.accountSet._id }).then(res => {
        this.rateTypeList = res.data
        if (res.data.length) {
          this.formData.rateTypeId = res.data[0]._id
          this.formData.rateType = res.data[0].name
        }
      }).catch(err => {
        this.$Notice.error({
          title: '汇率类型',
          desc: err.message
        })
      })
      queryExchangeRate({ accountSetId: this.accountSet._id }).then(res => {
        this.rateList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '汇率',
          desc: err.message
        })
      })
      currencyQuery({
        accountSetId: this.accountSet._id
      }).then(res => {
        this.currencyList = res.data.filter(r => r.name !== '人民币')
      }).catch(err => {
        this.$Notice.error({
          title: '币别',
          desc: err.message
        })
      })
      queryLastCredentials({
        accountSetId: this.accountSet._id
      }).then(res => {
        if (res.data) {
          let defaultProof = res.data.proof.find(v => v.name === '调')
          this.formData.proofWordId = defaultProof ? defaultProof._id : null
          this.formData.proofWords = defaultProof ? defaultProof.name : null
          this.formData.certificateNumber = defaultProof ? defaultProof.total : null
          this.formData.voucher = this.myUser._id
          this.proof = res.data.proof
          this.formData.serialNumber = res.data.serialNumber
        }
      }).catch(err => {
        this.$Notice.error({
          title: '获取凭证信息',
          desc: err.message
        })
      })
    },
    setRate () {
      this.cancel()
      if (this.$route.name === 'exchangeRateIndex') return
      const { href } = this.$router.resolve({
        name: 'exchangeRateIndex'
      })
      window.open(href, '_blank')
    },
    selectSubject () {
      this.$refs.subject.show(obj => {
        this.formData.subjectCode = obj.code
        this.formData.subject = obj.name
      })
    },
    selectProof (val) {
      let data = this.proof.find(v => v.name === val)
      if (data) {
        this.formData.proofWordId = data._id
        this.formData.certificateNumber = data.total
      }
    },
    selectRate (val) {
      let data = this.rateTypeList.find(v => v._id === val)
      if (data) {
        this.formData.rateType = data.name
      }
    }
  }
}
</script>

<style scoped>

</style>
