<template>
  <Modal
    v-model="modal"
    :title="`${type}模式凭证`"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="1600"
    @on-cancel="cancel">
    <Row type="flex" justify="space-between">
      <div>
        名字:
        <Input v-model="formData.name" style="width: 150px; margin-right: 5px;"></Input>
      </div>
      <div>
        <Button style="width: 100px;" @click="isC = !isC">外币</Button>
      </div>
    </Row>

    <div class="c_table">
      <div class="t_h">
        <div class="t1"></div>
        <div class="t2">摘要</div>
        <div :class="{'t3': true, 'active': !isC}">科目</div>
        <template v-if="isC">
          <div class="t4">
            <p>币别</p>
            <p>单位</p>
          </div>
          <div class="t5">
            <p>
              <span>汇率类型</span>
              <span>汇率</span>
            </p>
            <p>单价</p>
          </div>
          <div class="t6">
            <p>原币金额</p>
            <p>数量</p>
          </div>
        </template>
        <div class="t7">
          <p>借方</p>
          <div>
            <financialLine :value="['亿','千','百','十','万','千','百','十','元','角','分']" />
          </div>
        </div>
        <div class="t8">
          <p>贷方</p>
          <div>
            <financialLine :value="['亿','千','百','十','万','千','百','十','元','角','分']" />
          </div>
        </div>
        <!--<div class="t9"></div>-->
      </div>
      <div class="t_m">
        <div class="t_l" v-for="(v, i) in formData.child" :key="i">
          <div class="t1">
            <div class="btn_group">
              <div class="add" @click="updateFormData('add', i)"><Icon type="md-add-circle" /></div>
              <div class="delete" @click="updateFormData('delete', i)"><Icon type="md-close-circle" /></div>
            </div>
            <div style="position: relative; z-index: 3; width: 100%; height: 100%; background: #f8f8f9;">
              {{i + 1}}
            </div>
          </div>
          <div class="t2">
            <div style="height: 100%">
              <div v-if="which !== 'abstract' + i" @click="select(i >= formData.child.length, 'abstract' + i)" style="height: 100%">
                {{i >= formData.child.length ? '' : formData.child[i].abstract}}
              </div>
              <template v-else>
                    <textarea :ref="'abstract' + i" v-model="formData.child[i].abstract"
                              @input="copyAbstract($event, i)"
                              @blur="blurDelay('abstract')"
                              @dblclick="setAbstract(i)"
                              @keydown.enter.prevent.stop="enterUl('abstract', i)"
                              @keydown.tab.prevent.stop="enterUl('abstract', i)"
                              @keydown.up.prevent.stop="upOrDown('up', getAbstractList(formData.child[i].abstract))"
                              @keydown.down.prevent.stop="upOrDown('down', getAbstractList(formData.child[i].abstract))" >
                    </textarea>
                <ul class="abstract_list">
                  <li v-for="(item, index) in getAbstractList(formData.child[i].abstract)"
                      @click="formData.child[i].abstract = item.name, which = ''"
                      :class="{active: selectUl === index}"
                      :key="index">
                    {{item.code}} - {{item.name}}
                  </li>
                </ul>
              </template>
            </div>
          </div>

          <div :class="{'t3': true, 'active': !isC}" style="height: 100%">
            <div v-if="which !== 'subject' + i" @click="select(i >= formData.child.length || (i === 0 && !formData.child[i].abstract), 'subject' + i)" style="height: 100%">
              <template v-if="i < formData.child.length && formData.child[i].subjectCode && formData.child[i].subject">
                {{formData.child[i].subjectCode + ' — ' + formData.child[i].subject}}
                <template v-for="(item) in formData.child[i].accountingItem">
                  / {{item.type}}：{{item.name}}（{{item.code}}）
                </template>
              </template>
            </div>
            <template v-else>
                  <textarea :ref="'subject' + i" v-model="formData.child[i].subjectCode"
                            @input="inputSubject($event, i)"
                            @blur="blurDelay('subject')"
                            @dblclick="selectSubject(i)"
                            @keydown.enter.prevent.stop="enterUl('subjectCode', i)"
                            @keydown.tab.prevent.stop="enterUl('subjectCode', i)"
                            @keydown.up.prevent.stop="upOrDown('up', getSubjectList(formData.child[i].subjectCode))"
                            @keydown.down.prevent.stop="upOrDown('down', getSubjectList(formData.child[i].subjectCode))" >
                  </textarea>
              <ul class="abstract_list">
                <li v-for="(item, index) in getSubjectList(formData.child[i].subjectCode)"
                    @click="checkedSubject(item, i)"
                    :class="{active: selectUl === index}"
                    :key="index">
                  {{item.code}} - {{item.name}}
                </li>
              </ul>
            </template>
          </div>

          <template v-if="isC">
            <div class="t4">
              <div class="t_top">
                <div v-if="!isC || i >= formData.child.length" style="height: 100%">
                  {{i >= formData.child.length ? '' : formData.child[i].currency}}
                </div>
                <div v-else-if="!formData.child[i].subject || !formData.child[i].isAllC" style="height: 100%">
                  {{formData.child[i].currency}}
                </div>
                <select v-else
                        v-model="formData.child[i].currency"
                        @change="changeRate(i, 'currency')"
                        style="width: 100%; height: 100%;">
                  <option v-for="(v, i) in currencyList" :value="v.name" :key="i">{{v.name}}</option>
                </select>
              </div>
              <div class="t_bottom">
                <div v-if="!isC || i >= formData.child.length || !formData.child[i].unit" style="height: 100%"></div>
                <select v-else
                        v-model="formData.child[i].unit"
                        style="width: 100%; height: 100%;">
                  <option v-for="(v1, i1) in getUnitList(formData.child[i].unit)" :value="v1.name" :key="i1">{{v1.name}}</option>
                </select>
              </div>
            </div>

            <div class="t5">
              <div class="t_top">
                <div class="t_left">
                  <div v-if="!isC || i >= formData.child.length" style="height: 100%">
                    {{i >= formData.child.length ? '' : formData.child[i].rateType}}
                  </div>
                  <div v-else-if="!formData.child[i].subject || formData.child[i].currency === '人民币'" style="height: 100%">
                    {{formData.child[i].rateType}}
                  </div>
                  <select v-else v-model="formData.child[i].rateType"
                          style="width: 100%; height: 100%;">
                    <option v-for="(v, i) in rateTypeList" :value="v.name" :key="i">{{v.name}}</option>
                  </select>
                </div>
                <div class="t_right">
                  <div v-if="!isC || i >= formData.child.length" style="height: 100%">
                    {{i >= formData.child.length ? '' : formData.child[i].rate}}
                  </div>
                  <div v-else-if="!formData.child[i].subject || formData.child[i].currency === '人民币'"
                       style="height: 100%">
                    {{formData.child[i].rate}}
                  </div>
                  <div style="height: 100%" v-else>
                    <div v-if="which !== 'rate' + i"
                         @click="select(false, 'rate' + i)"
                         style="height: 100%">
                      {{formData.child[i].rate}}
                    </div>
                    <input v-else :ref="'rate' + i"
                           type="number"
                           v-model.number="formData.child[i].rate"
                           @blur="changeRate(i, 'rate')">
                    </input>
                  </div>
                </div>
              </div>
              <div class="t_bottom">
                <div v-if="!isC || i >= formData.child.length || !formData.child[i].unit" style="height: 100%"></div>
                <div style="height: 100%" v-else>
                  <div v-if="which !== 'price' + i"
                       @click="select(false, 'price' + i)"
                       style="height: 100%">
                    {{formData.child[i].price}}
                  </div>
                  <input v-else :ref="'price' + i"
                         type="number"
                         v-model.number="formData.child[i].price"
                         @blur="changePrice(i, 'price')">
                  </input>
                </div>
              </div>
            </div>

            <div class="t6">
              <div class="t_top">
                <div v-if="!isC || i >= formData.child.length" style="height: 100%">
                  {{i >= formData.child.length ? '' : formData.child[i].currencyAmount}}
                </div>
                <div v-else-if="!formData.child[i].subject || formData.child[i].currency === '人民币' || formData.child[i].unit"
                     style="height: 100%">
                  {{formData.child[i].currencyAmount && formatMoney(formData.child[i].currencyAmount, '', currencyList.find(v => v.name === formData.child[i].currency).float)}}
                </div>
                <div style="height: 100%" v-else>
                  <div v-if="which !== 'currencyAmount' + i"
                       @click="select(!formData.child[i].rate, 'currencyAmount' + i)"
                       style="height: 100%">
                    {{formatMoney(formData.child[i].currencyAmount, '', currencyList.find(v => v.name === formData.child[i].currency).float)}}
                  </div>
                  <template v-else>
                    <Poptip trigger="hover">
                      <input :ref="'currencyAmount' + i"
                             v-model.number="formData.child[i].currencyAmount"
                             type="number"
                             @blur="changeRate(i, 'currencyAmount')"
                             style="width: 198px; height: 25px; display: block;">
                      </input>
                      <div slot="content" style="width: 298px; height: 60px; font-size: 40px; text-align: center; line-height: 60px">
                        {{formatMoney(formData.child[i].currencyAmount, '', currencyList.find(v => v.name === formData.child[i].currency).float)}}
                      </div>
                    </Poptip>
                  </template>
                </div>
              </div>
              <div class="t_bottom">
                <div v-if="!isC || i >= formData.child.length || !formData.child[i].unit" style="height: 100%"></div>
                <div style="height: 100%" v-else>
                  <div v-if="which !== 'number' + i"
                       @click="select(false, 'number' + i)"
                       style="height: 100%">
                    {{formData.child[i].number}}
                  </div>
                  <input v-else :ref="'number' + i"
                         type="number"
                         v-model.number="formData.child[i].number"
                         @blur="changePrice(i, 'number')">
                  </input>
                </div>
              </div>
            </div>
          </template>

          <div class="t7">
            <div v-if="which !== 'borrower' + i"
                 @click="select(i >= formData.child.length || !formData.child[i].subject || !formData.child[i].rate, 'borrower' + i)"
                 style="height: 100%">
              <financialLine :value="i >= formData.child.length ? [] : getFinancial(formData.child[i].borrower)" />
            </div>
            <template v-else>
              <Poptip trigger="hover">
                <input :ref="'borrower' + i"
                       v-model.number="formData.child[i].borrower"
                       type="number"
                       @keypress="keypressFun($event, i, 'borrower', 'lender')"
                       @keyup.187="getEqual(i, 'borrower', 'lender')"
                       @keyup.109.189="which = '', formData.child[i].borrower = -formData.child[i].borrower"
                       @blur="getCurrencyAmount(i, 'borrower')"
                       style="width: 298px; height: 52px; font-size: 20px; display: block;">
                </input>
                <div slot="content" style="width: 298px; height: 60px; font-size: 40px; text-align: center; line-height: 60px">
                  {{formatMoney(formData.child[i].borrower, '￥')}}
                </div>
              </Poptip>
            </template>
          </div>
          <div class="t8">
            <div v-if="which !== 'lender' + i"
                 @click="select(i >= formData.child.length || !formData.child[i].subject || !formData.child[i].rate, 'lender' + i)"
                 style="height: 100%">
              <financialLine :value="i >= formData.child.length ? [] : getFinancial(formData.child[i].lender)" />
            </div>
            <template v-else>
              <Poptip trigger="hover">
                <input :ref="'lender' + i"
                       v-model.number="formData.child[i].lender"
                       type="number"
                       @keypress="keypressFun($event, i, 'lender', 'borrower')"
                       @keyup.187="getEqual(i, 'lender', 'borrower')"
                       @keyup.109.189="which = '', formData.child[i].lender = -formData.child[i].lender"
                       @blur="getCurrencyAmount(i, 'lender')"
                       style="width: 298px; height: 52px; font-size: 20px; display: block;">
                </input>
                <div slot="content" style="width: 298px; height: 60px; font-size: 40px; text-align: center; line-height: 60px">
                  {{formatMoney(formData.child[i].lender, '￥')}}
                </div>
              </Poptip>
            </template>
          </div>
        </div>
      </div>
      <div class="t_b">
        <div></div>
        <div></div>
        <div>
          <financialLine :value="borrower" />
        </div>
        <div>
          <financialLine :value="lender" />
        </div>
        <!--<div></div>-->
      </div>
    </div>

    <subject ref="subject" :isReturnObj="true" :isLimitAccounting="true" />
    <accountingModal ref="accountingModal" />
    <abstractForm ref="abstractForm" :abstractList="abstractList" @load="loadAbstract" />

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="saveVoucher">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateCredentialsTemplate, queryCredentialsTemplate } from '../../api/credentialsTemplate'
import moment from 'moment'
import financialLine from '../../components/financial_line/index'
import { formatMoney } from 'accounting'
import subject from '../../components/subject/index'
import { queryExchangeRateType, queryExchangeRate } from '../../api/exchangeRate'
import { queryMeasureUnit } from '../../api/measureUnit'
import { querySubject } from '../../api/subject'
import { queryAbstract } from '../../api/abstract'
import NP from 'number-precision'
import accountingModal from '../credentials/accounting'
import abstractForm from '../credentials/abstractForm'
export default {
  name: 'index',
  components: {
    financialLine,
    subject,
    accountingModal,
    abstractForm
  },
  props: {
    currencyList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      type: '',
      which: '',
      oldName: '',
      isC: false,
      rateTypeList: [],
      unitList: [],
      borrower: [0, 0, 0],
      lender: [0, 0, 0],
      childObj: {
        abstract: '',
        subjectCode: '',
        subject: '',
        currency: '',
        rateType: '',
        rate: null,
        currencyAmount: null,
        unit: '',
        number: null,
        price: null,
        borrower: null,
        lender: null,
        isAllC: false
      },
      formData: {
        accountSetId: null,
        name: '',
        child: []
      },
      templateList: [],
      abstractList: [],
      subjectList: [],
      rateList: [],
      selectUl: -1
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'userList',
      'myPermission',
      'myUser',
      'adminList'
    ])
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.formData.accountSetId = this.accountSet._id
          this.loadRateType()
          this.loadUnit()
          this.loadTemp()
          this.loadSubject()
          this.loadAbstract()
        }
      },
      immediate: true,
      deep: true
    },
    'formData.child': {
      handler () {
        let borrower = this.formData.child.reduce((total, v) => (total = NP.plus(total, Number(v.borrower))), 0)
        let lender = this.formData.child.reduce((total, v) => (total = NP.plus(total, Number(v.lender))), 0)
        this.borrower = borrower ? this.formatMoney(borrower).replace(/[$,.]/g, '').split('') : [0, 0, 0]
        this.lender = lender ? this.formatMoney(lender).replace(/[$,.]/g, '').split('') : [0, 0, 0]
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    moment,
    formatMoney,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '模式凭证') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}模式凭证的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    errorFun (isPush = false, isCheck, isSave = false, isError = true) {
      let isDo = true
      let turn = (i, type, err) => {
        if (isDo) {
          isDo = false
          if (isError) {
            this.$Notice.error({
              title: '模式凭证',
              desc: err
            })
          }
          this.select(false, type + i)
        }
      }
      this.formData.child.forEach((v, i) => {
        if (i === this.formData.child.length - 1 && isPush) {
          if (v.subject && (v.borrower || v.lender)) {
            this.formData.child.push(Object.assign({}, this.childObj))
            this.select(false, 'abstract' + (i + 1))
          }
        }
        if (isCheck) {
          if (i >= 2 && !v.abstract && !v.subject && !v.rate && !v.borrower && !v.lender) {
            // 保存时候，最后一条不录入不检查
          } else {
            if (i === 0 && !v.abstract) {
              turn(i, 'abstract', '第1条凭证摘要必填')
            } else if (!v.subject || !v.subjectCode) {
              turn(i, 'subject', `第${i + 1}条请选择科目`)
            } else if (this.isC && (!v.rate)) {
              turn(i, 'rate', `第${i + 1}条请输入汇率`)
            } else if (this.isC && (!v.currencyAmount)) {
              turn(i, 'currencyAmount', `第${i + 1}条请输入原币金额`)
            } else if (this.isC && v.unit && (!v.price)) {
              turn(i, 'rate', `第${i + 1}条请输入单价`)
            } else if (this.isC && v.unit && (!v.number)) {
              turn(i, 'rate', `第${i + 1}条请输入数量`)
            } else if (!v.borrower && !v.lender) {
              turn(i, 'borrower', `第${i + 1}条请输入借方或贷方`)
            }
          }
        }
      })
      if (isSave && isDo) {
        if (this.borrower.join(',') !== this.lender.join(',')) {
          isDo = false
          this.$Notice.error({
            title: '模式凭证',
            desc: '借贷不平，无法保存'
          })
        }
      }
      return isDo
    },
    select (isCan, which) {
      if (this.isReadOnly) return
      // this.errorFun(true, isCan)
      // if (isCan) return
      this.which = which
      let interval = setInterval(() => {
        if (this.$refs[which] && this.$refs[which][0]) {
          this.$refs[which][0].focus()
          clearInterval(interval)
        }
      }, 100)
    },
    selectSubject (index) {
      this.$refs.subject.show(obj => {
        let currency = obj.currency === '所有币别' || obj.currency === '不核算' ? '人民币' : obj.currency
        let cData = this.formData.child[index]
        cData.subjectCode = obj.code
        cData.subject = obj.name
        cData.currency = currency
        cData.rateType = '公司汇率'
        let rType = this.rateTypeList.find(f => f.name === '公司汇率')
        let rList = rType ? this.rateList.filter(f => f.typeId === rType._id) : []
        let currencyId = this.currencyList.find(f => f.name === currency)._id
        let rData = rList.find(f => f.currencyId === currencyId)
        cData.rate = currency === '人民币' ? 1 : rData ? rData.rate : null
        if (currency !== '人民币') this.isC = true
        cData.isAllC = obj.currency === '所有币别'
        cData.currencyAmount = cData.rate ? NP.divide((cData.borrower || cData.lender || 0), cData.rate) : null
        cData.unit = obj.unit
        if (obj.unit) this.isC = true
        if (obj.accountItem && obj.accountItem.length) {
          let accountingItem = obj.accountItem.map(a => {
            return {
              type: a,
              code: null,
              name: null,
              _id: null
            }
          })
          this.$refs.accountingModal.show(accountingItem, (list) => {
            if (list) {
              cData.accountingItem = list
            } else {
              cData.subjectCode = ''
              cData.subject = ''
            }
            this.$forceUpdate()
          })
        }
        // this.errorFun(true, false)
      })
    },
    checkedSubject (obj, index, isBlur = true) {
      let cData = this.formData.child[index]
      if (obj.controlledSystem) {
        this.$Notice.error({
          title: '选择科目',
          desc: `该科目受控于${obj.controlledSystem}, 无法选择`
        })
        cData.subjectCode = ''
        cData.subject = ''
        return
      } else if (this.subjectList.filter(v => v.parentId.includes(obj._id)).length) {
        this.$Notice.error({
          title: '选择科目',
          desc: `请选择明细科目`
        })
        cData.subjectCode = ''
        cData.subject = ''
        return
      }
      let currency = obj.currency === '所有币别' || obj.currency === '不核算' ? '人民币' : obj.currency
      cData.subjectCode = obj.code
      cData.subject = obj.name
      cData.currency = currency
      cData.rateType = '公司汇率'
      let rType = this.rateTypeList.find(f => f.name === '公司汇率')
      let rList = rType ? this.rateList.filter(f => f.typeId === rType._id) : []
      let currencyId = this.currencyList.find(f => f.name === currency)._id
      let rData = rList.find(f => f.currencyId === currencyId)
      cData.rate = currency === '人民币' ? 1 : rData ? rData.rate : null
      if (currency !== '人民币') this.isC = true
      cData.isAllC = obj.currency === '所有币别'
      cData.currencyAmount = cData.rate ? NP.divide((cData.borrower || cData.lender || 0), cData.rate) : null
      cData.unit = obj.unit
      if (obj.unit) this.isC = true
      if (obj.accountItem && obj.accountItem.length) {
        let accountingItem = obj.accountItem.map(a => {
          return {
            type: a,
            code: null,
            name: null,
            _id: null
          }
        })
        this.$refs.accountingModal.show(accountingItem, (list) => {
          if (list) {
            cData.accountingItem = list
          } else {
            cData.subjectCode = ''
            cData.subject = ''
          }
          this.$forceUpdate()
        })
      }
      // this.errorFun(true, false)
      if (isBlur) this.which = ''
    },
    getFinancial (val) {
      if (val !== null && val !== 0) {
        let money = this.formatMoney(val).replace(/[$,.]/g, '')
        return money.split('')
      } else {
        return []
      }
    },
    loadRateType () {
      queryExchangeRateType({
        accountSetId: this.accountSet._id
      }).then(res => {
        this.rateTypeList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '汇率类型',
          desc: err.message
        })
      })
      queryExchangeRate({
        accountSetId: this.accountSet._id
      }).then(res => {
        this.rateList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '汇率',
          desc: err.message
        })
      })
    },
    loadUnit () {
      queryMeasureUnit({ accountSetId: this.accountSet._id }).then(res => {
        this.unitList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '计量单位',
          desc: err.message
        })
      })
    },
    loadTemp () {
      queryCredentialsTemplate({ accountSetId: this.accountSet._id }).then(res => {
        this.templateList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '模式凭证',
          desc: err.message
        })
      })
    },
    loadSubject () {
      querySubject({ accountSetId: this.accountSet._id }).then(res => {
        this.subjectList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
    },
    loadAbstract () {
      queryAbstract({
        accountSetId: this.accountSet._id
      }).then(res => {
        this.abstractList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: `摘要库`,
          desc: err.message
        })
      })
    },
    keypressFun (e, i, type, type1) {
      if (e.key === '-') e.preventDefault()
      let cData = this.formData.child[i]
      if (cData[type1]) {
        if (e.code === 'Space') {
          cData[type] = cData[type1]
          cData[type1] = null
          this.which = ''
        } else {
          e.preventDefault()
        }
      } else {
        if (e.code === 'Space') {
          cData[type1] = cData[type]
          cData[type] = null
          this.which = ''
        } else if (cData.unit) {
          e.preventDefault()
          this.$Notice.error({
            title: '凭证录入',
            desc: `第${i + 1}条请输入单价或数量`
          })
        }
      }
    },
    getEqual (i, type, type1) {
      let cData = this.formData.child[i]
      if (!cData[type1]) {
        let all = this.formData.child.reduce((total, v) => (total = NP.plus(total, Number(v[type1]))), 0)
        this.formData.child[i][type] = this.formData.child.reduce((total, v, index) => (total = NP.minus(total, (index !== i ? Number(v[type]) : 0))), all)
      }
      this.which = ''
    },
    getCurrencyAmount (i, type) {
      if (this.which.includes(type)) this.which = ''
      this.errorFun(true, false)
      if (this.formData.child[i][type]) {
        if (this.formData.child[i].rate) {
          this.formData.child[i].currencyAmount = this.formData.child[i].rate ? NP.divide(this.formData.child[i][type], this.formData.child[i].rate) : null
        } else {
          if (this.formData.child[i].subject) {
            this.$Notice.error({
              title: '凭证录入',
              desc: `第${i + 1}条请输入汇率`
            })
          }
        }
      }
    },
    changeRate (i, type) {
      if (this.which.includes(type)) this.which = ''
      let cData = this.formData.child[i]
      if (type === 'currency') {
        if (cData.currency === '人民币') {
          cData.rate = 1
        } else {
          let rType = this.rateTypeList.find(f => f.name === cData.rateType)
          let rList = rType ? this.rateList.filter(f => f.typeId === rType._id) : []
          let currencyId = this.currencyList.find(f => f.name === cData.currency)._id
          let rData = rList.find(f => f.currencyId === currencyId)
          cData.rate = rData ? rData.rate : null
        }
        cData.currencyAmount = cData.rate ? NP.divide((cData.borrower || cData.lender || 0), cData.rate) : null
      } else if (type === 'rate') {
        cData.currencyAmount = cData.rate ? NP.divide((cData.borrower || cData.lender || 0), cData.rate) : null
      } else {
        cData.borrower = cData.borrower || !cData.lender ? cData.rate ? NP.times(cData.currencyAmount, cData.rate) : null : null
        cData.lender = cData.lender ? cData.rate ? NP.times(cData.currencyAmount, cData.rate) : null : null
      }
    },
    getUnitList (unit) {
      let groupId = this.unitList.find(v => v.name === unit).groupId
      return this.unitList.filter(v => v.groupId === groupId)
    },
    changePrice (i, type) {
      if (this.which.includes(type)) this.which = ''
      let cData = this.formData.child[i]
      if (cData.price && cData.number) {
        cData.borrower = cData.borrower || !cData.lender ? NP.times(cData.price, cData.number) : null
        cData.lender = cData.lender ? NP.times(cData.price, cData.number) : null
        cData.currencyAmount = NP.divide((cData.borrower || cData.lender || 0), cData.rate) || null
      }
    },
    updateFormData (type, index) {
      if (type === 'add') {
        let cData = this.formData.child[index]
        if (
          ((index === 0 && cData.abstract) || index !== 0) &&
          cData.subject && cData.subjectCode && cData.rate &&
          ((cData.unit && cData.price && cData.number) || !cData.unit) &&
          (cData.borrower || cData.lender)
        ) {
          this.formData.child.splice(index + 1, 0, Object.assign({}, this.childObj))
        } else {
          this.errorFun(false, true)
        }
      } else {
        if (index === this.formData.child.length - 1) {
          this.formData.child[index].abstract = ''
          this.formData.child[index].subjectCode = ''
          this.formData.child[index].subject = ''
          this.formData.child[index].currency = ''
          this.formData.child[index].rateType = ''
          this.formData.child[index].rate = null
          this.formData.child[index].currencyAmount = null
          this.formData.child[index].unit = ''
          this.formData.child[index].number = null
          this.formData.child[index].price = null
          this.formData.child[index].borrower = null
          this.formData.child[index].lender = null
          this.formData.child[index].isAllC = false
        } else {
          this.formData.child.splice(index, 1)
        }
      }
      this.$forceUpdate()
    },
    copyAbstract (e, i) {
      this.selectUl = -1
      if (e.target.value) {
        let fData = this.abstractList.find(v => v.code === e.target.value.trim())
        if (fData) this.formData.child[i].abstract = fData.name
      }
      if (i === 0) return
      if (e.target.value === '..') {
        this.formData.child[i].abstract = this.formData.child[i - 1].abstract
      } else if (e.target.value === '//') {
        this.formData.child[i].abstract = this.formData.child[0].abstract
      }
    },
    getAbstractList (search) {
      let list = []
      if (search) {
        list = this.abstractList.filter(v => v.code.includes(search) || v.name.includes(search))
      }
      return list
    },
    saveVoucher () {
      if (!this.judge('修改')) return
      if (!this.formData.name) {
        this.$Notice.error({
          title: '模式凭证',
          desc: '名字不能为空'
        })
        return
      }
      if (
        this.oldName === this.formData.name ||
        (this.oldName !== this.formData.name &&
        this.templateList.filter(v => v.name === this.formData.name).length === 0)) {
        if (this.errorFun(false, true, true)) {
          let data = JSON.parse(JSON.stringify(this.formData))
          data.child = data.child.filter(v => v.subject && v.rate && (v.borrower || v.lender))
          updateCredentialsTemplate(data).then(res => {
            this.$Notice.success({
              title: '模式凭证',
              desc: '成功保存模式凭证'
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '模式凭证',
              desc: err.message
            })
          })
        }
      } else {
        this.$Notice.error({
          title: '模式凭证',
          desc: '已存在该模式凭证'
        })
      }
    },
    cancel () {
      this.modal = false
      this.type = ''
      this.oldName = ''
    },
    show (type, data, templateList, addObj) {
      this.modal = true
      this.type = type
      this.formData = data ? JSON.parse(JSON.stringify(data)) : Object.assign({
        name: '',
        child: []
      }, addObj)
      console.log(this.formData)
      if (this.formData.child.length < 4) {
        for (let i = this.formData.child.length; i < 4; i++) {
          this.formData.child.push(Object.assign({}, this.childObj))
        }
      }
      if (data) this.oldName = data.name
      this.templateList = templateList
      this.$forceUpdate()
    },
    tempFun (type) {
      if (type === 'select') {
        this.$refs.tempForm.show('选择', {})
      } else {
        if (this.errorFun(false, true, true)) {
          let list = JSON.parse(JSON.stringify(this.formData)).child
          list = list.filter(v => v.subject && v.rate && (v.borrower || v.lender))
          let data = {
            accountSetId: this.formData.accountSetId,
            child: list
          }
          this.$refs.tempForm.show('保存', data)
        }
      }
    },
    selectTemp (child) {
      this.formData.child = []
      this.$nextTick(() => {
        this.formData.child = child
      })
    },
    setAbstract (i) {
      this.$refs.abstractForm.show((name) => {
        this.formData.child[i].abstract = name
      })
    },
    blurDelay (which) {
      setTimeout(() => {
        if (this.which.includes(which)) this.which = ''
      }, 500)
    },
    inputSubject (e, i) {
      this.selectUl = -1
      if (e.target.value) {
        let fData = this.subjectList.find(v => v.code === e.target.value.trim())
        if (fData) {
          if (!this.subjectList.filter(f => f.parentId.includes(fData._id)).length) {
            this.checkedSubject(fData, i, false)
          }
        }
      }
    },
    getSubjectList (search) {
      let list = []
      if (search) {
        list = this.subjectList.filter(v => v.code.includes(search) || v.name.includes(search))
        list = this.subjectList.filter(v => list.find(f => v._id === f._id || v.parentId.includes(f._id)))
        list = list.filter(v => !this.subjectList.filter(f => f.parentId.includes(v._id)).length)
      }
      return list
    },
    upOrDown (type, list) {
      if (type === 'up') {
        if (this.selectUl > 0) this.selectUl--
      } else {
        if (this.selectUl < list.length - 1) this.selectUl++
      }
    },
    enterUl (type, index) {
      if (this.selectUl !== -1) {
        if (type === 'abstract') {
          this.formData.child[index].abstract = this.getAbstractList(this.formData.child[index].abstract)[this.selectUl].name
          this.selectUl = -1
        } else {
          let fData = this.getSubjectList(this.formData.child[index].subjectCode)[this.selectUl]
          this.checkedSubject(fData, index, false)
          this.selectUl = -1
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.c_table {
  margin-top: 10px;
  border: 1px solid #dcdee2;
  /*overflow: hidden;*/

  .t_h,
  .t_l {
    display: flex;
    flex-direction: row;
    height: 55px;
    min-height: 55px;
    border-bottom: 1px solid #dcdee2;

    & > div {
      border-right: 1px solid #dcdee2;
      &.t1 {
        width: 20px;
        min-width: 20px;
        line-height: 54px;
        text-align: center;
        background: #f8f8f9;
      }

      &.t2 {
        flex-grow: 1;
      }

      &.t3 {
        width: 200px;
        min-width: 200px;

        &.active {
          width: 450px;
          min-width: 450px;
        }
      }

      &.t4 {
        width: 100px;
        min-width: 100px;
      }

      &.t5 {
        width: 200px;
        min-width: 200px;
      }

      &.t6 {
        width: 200px;
        min-width: 200px;
      }

      &.t7, &.t8 {
        width: 300px;
        min-width: 300px;
        display: flex;
        flex-direction: column;
      }

      &.t7 {
        border-color: #000;
      }

      &.t9 {
        width: 17px;
        min-width: 17px;
      }
    }
  }

  .t_h {
    /*overflow-y: scroll;*/
    & > div {
      &.t2, &.t3, &.t4, &.t5, &.t6 {
        background: #f8f8f9;
        line-height: 54px;
        text-align: center;
      }

      &.t4, &.t5, &.t6 {
        display: flex;
        flex-direction: column;
        text-align: center;
        font-size: 12px;

        p:nth-child(1) {
          line-height: 26px;
          border-bottom: 1px solid #dcdee2;
        }
        p:nth-child(2) {
          line-height: 26px;
        }
      }

      &.t5 p:nth-child(1) {
        display: flex;
        flex-direction: row;
        overflow: hidden;

        span {
          width: 100px;
          &:nth-child(1) {
            border-right: 1px solid #dcdee2;
          }
        }
      }

      &.t7, &.t8 {
        p {
          text-align: center;
          background: #f8f8f9;
          line-height: 26px;
          border-bottom: 1px solid #dcdee2;
          margin-bottom: 0;
          font-size: 12px;
        }
        & > div {
          flex-grow: 1;
        }
      }
    }
  }

  .t_m {
    margin-left: -20px;
    padding-left: 20px;

    .t_l {
      cursor: pointer;

      .t1 {
        position: relative;
      }

      .btn_group {
        position: absolute;
        left: -17px;
        top: 0;
        width: 16px;
        height: 54px;
        transition: 300ms;
        border: none;
        z-index: 1;
        opacity: 0;

        .add,
        .delete {
          width: 100%;
          height: 27px;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            color: #4d8afa;
          }
        }
      }

      &:hover .btn_group {
        opacity: 1;
      }

      &.active {
        cursor: not-allowed;

        .btn_group {
          display: none;
        }
      }

      textarea,
      .t2, .t3 {
        padding: 0 2px;
        font-size: 12px;
        line-height: 16px;
      }
      textarea {
        width: 100%;
        height: 100%;
        resize: none;
        display: block;
      }

      input {
        width: 100%;
        height: 100%;
        padding: 0 10px;
        display: block;
      }
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
      }
      input{
        -moz-appearance:textfield;
      }

      .t2, .t3 {
        position: relative;

        .abstract_list {
          position: absolute;
          z-index: 10;
          max-height: 100px;
          overflow: auto;
          list-style: none;
          border: 1px solid #dcdee2;

          li {
            height: 30px;
            line-height: 30px;
            padding: 0 10px;
            background: #f7f7f7;
            cursor: pointer;
            overflow: hidden;

            &:hover,
            &.active {
              background: #fff;
            }
          }
        }
      }

      .t4, .t5, .t6 {
        display: flex;
        flex-direction: column;
        text-align: center;
        font-size: 12px;

        .t_top {
          height: 27px;
          line-height: 26px;
          border-bottom: 1px solid #dcdee2;
        }
        .t_bottom {
          height: 26px;
          line-height: 26px;
        }
      }

      .t5 .t_top {
        display: flex;
        flex-direction: row;
        overflow: hidden;

        .t_left {
          width: 100px;
          border-right: 1px solid #dcdee2;
        }

        .t_right {
          width: 100px;
        }
      }
    }
  }

  .t_b {
    display: flex;
    flex-direction: row;
    height: 54px;
    min-height: 54px;
    border-top: 1px solid #dcdee2;
    /*box-shadow: inset 2px 2px 2px rgba(0, 0, 0, 0.1);*/
    /*-webkit-box-shadow: inset 2px 2px 2px rgba(0, 0, 0, 0.1);*/
    /*overflow-y: scroll;*/

    & > div {
      border-right: 1px solid #dcdee2;
      &:nth-child(1) {
        width: 20px;
        min-width: 20px;
        background: #f8f8f9;
      }

      &:nth-child(2) {
        flex-grow: 1;
      }

      &:nth-child(3), &:nth-child(4) {
        width: 300px;
        min-width: 300px;
        display: flex;
        flex-direction: column;
      }

      &:nth-child(3) {
        border-color: #000;
      }

      &:nth-child(5) {
        width: 17px;
        min-width: 17px;
      }
    }
  }
}
</style>

<style lang="less">
  .mu_card  .ivu-card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
