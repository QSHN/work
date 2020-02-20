<template>
  <Modal
    v-model="modal"
    title="结转损益"
    :mask-closable="false"
    width="700"
    @on-cancel="cancel">
    <div v-if="step === 1">
      <p>期末时，应将以前年度损益调整科目的余额转入《利润分配》科目，其他各损益类科目的月转入《本年利润》科目，以反映企业在一个会计期间内实现的利润或亏损总额。本指南将帮助你自动完成对损益类科目的结转，并生成一张或者多张自动转账凭证</p>
    </div>
    <div v-else-if="step === 2">
      <p>除《以前年度损益调整》科目对应利润分配科目外，其他损益类科目对应《本年利润》科目</p>
      <Table border :columns="columns" :data="subjectList" :height="500"></Table>
    </div>
    <div v-else>
      <Form :label-width="100">
        <FormItem  label="凭证日期:">
          <DatePicker type="date" v-model="formData.time" :clearable="false" style="width: 400px;"></DatePicker>
        </FormItem>

        <FormItem  label="凭证字:">
          <Select v-model="formData.proofWords" @on-change="selectProof" style="width: 400px">
            <Option v-for="(v, i) in proof" :value="v.name" :key="i">{{v.name}}</Option>
          </Select>
        </FormItem>

        <FormItem  label="凭证摘要:">
          <Input v-model="formData.abstract" style="width: 400px;"></Input>
        </FormItem>

        <FormItem label="凭证类型:">
          <Checkbox style="margin-right: 30px;" disabled>收益</Checkbox>
          <Checkbox style="margin-right: 30px;" disabled>损失</Checkbox>
          <Checkbox disabled :value="true">损益</Checkbox>
        </FormItem>

        <FormItem  label="凭证生成方式:">
          <RadioGroup :value="'按核算项目类别结转'">
            <Radio label="按普通方式结转" style="margin-right: 30px;" disabled></Radio>
            <Radio label="按损益科目类别结转" style="margin-right: 30px;" disabled></Radio>
            <Radio label="按核算项目类别结转" disabled></Radio>
          </RadioGroup>
        </FormItem>

        <FormItem>
          <p>在开始结转本期损益之前，应当将所有的凭证过账，否则可能会出现不正确的结果</p>
        </FormItem>
      </Form>
    </div>

    <div slot="footer">
      <Button type="text" @click="last">{{step === 1 ? '取消' : '上一步'}}</Button>
      <Button type="success" @click="next">{{step === 3 ? '确定' : '下一步'}}</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { querySubject } from '../../../../api/subject'
import moment from 'moment'
import { carrForward, queryLastCredentials } from '../../../../api/credentials'
export default {
  name: 'finalTuning',
  data () {
    return {
      modal: false,
      step: 1,
      formData: {
        accountSetId: null,
        time: null,
        proofWordId: null,
        proofWords: null,
        abstract: '结转本期损益',
        certificateNumber: null,
        voucher: null,
        serialNumber: null
      },
      proof: [],
      subjectList: [],
      columns: [
        {
          title: '',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '编码',
          key: 'code'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '结转科目',
          render: (h, params) => {
            let result = params.row.code !== '6901' ? '4103' : '4104.01'
            return h('div', result)
          }
        },
        {
          title: '结转科目名称',
          render: (h, params) => {
            let result = params.row.code !== '6901' ? '本年利润' : '提取法定盈余公积'
            return h('div', result)
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myUser',
      'myPermission'
    ])
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          let accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
          this.formData.accountSetId = this.accountSet._id
          this.formData.time = moment(new Date(accountingPeriod)).endOf('month').format('YYYY-MM-DD')
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    show () {
      this.step = 1
      this.modal = true
      this.load()
    },
    cancel () {
      this.modal = false
    },
    last () {
      if (this.step === 1) {
        this.cancel()
      } else {
        this.step--
      }
    },
    next () {
      if (this.step === 1) {
        this.step++
      } else if (this.step === 2) {
        this.step++
      } else {
        carrForward(this.formData).then(res => {
          this.$Modal.success({
            title: '结转损益',
            content: `<p>已经生成一张调汇转账凭证，</p><p>凭证字号为：${this.formData.proofWords}-${this.formData.certificateNumber}</p>`
          })
          this.cancel()
        }).catch(err => {
          this.$Notice.error({
            title: '结转损益',
            desc: err.message
          })
        })
      }
    },
    load () {
      querySubject({
        accountSetId: this.accountSet._id,
        profitLoss: true
      }).then(res => {
        this.subjectList = res.data.filter(v => !res.data.filter(f => f.parentId.includes(v._id)).length)
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
      queryLastCredentials({
        accountSetId: this.accountSet._id
      }).then(res => {
        if (res.data) {
          let defaultProof = res.data.proof.find(v => v.name === '记')
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
    selectProof (val) {
      let data = this.proof.find(v => v.name === val)
      if (data) {
        this.formData.proofWordId = data._id
        this.formData.certificateNumber = data.total
      }
    }
  }
}
</script>

<style scoped>

</style>
