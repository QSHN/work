<template>
    <f7-page>
        <f7-navbar title="录凭证" back-link>
        </f7-navbar>

        <div class="page_layer">
            <div class="p_content">
                <div class="list-item">
                    <label>凭证字</label>
                    <input class="item-input"
                           type="text"
                           @click="selectProof"
                           readonly
                           v-model="formData.proofWords" />
                </div>
                <div class="list-item">
                    <label>凭证号</label>
                    <input class="item-input"
                           type="number"
                           v-model.number="formData.certificateNumber" />
                </div>
                <div class="list-item">
                    <label>日期</label>
                    <div>
                        <date-picker v-model="formData.time"
                                     type="date"
                                     :editable="false"
                                     class="date-picker"
                                     width="100px"
                                     :confirm="true"
                                     :confirm-text="'确定'"
                                     :not-before="options"
                                     placeholder=""
                                     format="YYYY-MM-DD"
                                     :minute-step="1">
                        </date-picker>
                    </div>
                </div>
                <div class="list-item">
                    <label>附件</label>
                    <input class="item-input"
                           type="number"
                           v-model.number="formData.files" />
                </div>

                <div class="cre_list" v-for="(v, i) in formData.child">
                    <div class="list_t">
                        <div class="icon">
                         <span :class="{active: v.borrower !== null }">
                            {{v.borrower !== null ? '借' : '贷'}}
                         </span>

                            <!--                        {{formatMoney(v.borrower || v.lender || 0, '', 2)}}-->
                        </div>
                        <div class="delete_btn" @click="deleteFun(i)">删除</div>
                    </div>

                    <div class="list_c">
                        <ul class="list_li">
                            <li>
                                摘要
                                <input type="text" placeholder="请输入摘要" v-model="v.abstract" />
                                <div class="select_btn" @click="selectFun(abstractList, i, 'abstract', '摘要')">摘要库</div>
                            </li>
                            <li>
                                科目
                                <input type="text" placeholder="请选择科目" :value="v.subject" readonly @click="selectSubject(i)" />
                            </li>
                            <li v-for="(v1, i1) in v.accountItem" :key="i1">
                                {{v1.type}}
                                <input type="text" :placeholder="`请选择${v1.type}`" :value="v1.name" readonly @click="selectAccountItem(v1.type, i, i1)" />
                            </li>
                            <template  v-if="v.isAllC">
                                <li>
                                    币别
                                    <input type="text" placeholder="请选择币别" :value="v.currency" readonly @click="selectFun(currencyList, i, 'currency', '选择币别', null, true)" />
                                </li>
                                <li>
                                    汇率类型
                                    <input type="text" v-model.number="v.rateType" readonly @click="selectFun(rateTypeList, i, 'rateType', '选择汇率类型', null, true)" />
                                </li>
                                <li>
                                    汇率
                                    <input type="number" v-model.number="v.rate" :readonly="v.currency === '人民币'" @blur="changeRate(i, 'rate')" />
                                </li>
                                <li>
                                    原币金额
                                    <input type="number" v-model.number="v.currencyAmount" :readonly="v.currency === '人民币'" @blur="changeRate(i, 'currencyAmount')" />
                                </li>
                            </template>
                            <template  v-if="v.unit">
                                <li>
                                    单位：
                                    <input type="text" placeholder="请选择币别" :value="v.unit" readonly @click="selectFun(getUnitList(v.unit), i, 'unit', '选择单位')"  />
                                </li>
                                <li>
                                    单价
                                    <input type="number" v-model.number="v.price" :readonly="!v.unit" @blur="changePrice(i, 'price')" />
                                </li>
                                <li>
                                    数量
                                    <input type="number" v-model.number="v.number" :readonly="!v.unit" @blur="changePrice(i, 'number')" />
                                </li>
                            </template>
                            <li>
                                金额
                                <input type="number" :value="v.borrower || v.lender || null" @input="changeMoney($event, i)" />
                                <div class="btn_group">
                                    <div class="btn" @click="changeDirection(i, 'borrower', 'lender', v.borrower || v.lender || 0)">
                                        <span :class="{active: v.borrower !== null }">借</span>
                                    </div>
                                    <div class="btn" @click="changeDirection(i, 'lender', 'borrower', v.borrower || v.lender || 0)">
                                        <span :class="{active: v.lender !== null }">贷</span>
                                    </div>
                                    <p @click="getEqual(i)">平衡</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="other_list">
                    合计
                    <p>借：{{formatMoney(borrower || 0, '', 2)}}</p>
                    <p>贷：{{formatMoney(lender || 0, '', 2)}}</p>
                </div>

                <div class="add_btn" @click="addFun">新增分录</div>
            </div>

            <div class="submit-button" @click="save">保存凭证</div>
        </div>

    </f7-page>
</template>

<script>
  import { mapGetters } from 'vuex'
  import axios from 'axios'
  import DatePicker from 'vue2-datepicker'
  import moment from 'moment'
  import NP from 'number-precision'
  import { formatMoney } from 'accounting'
  export default {
    name: "credentialsInput",
    props: ['accountSet', 'credentialsChild', 'credentialsData'],
    components: {
      DatePicker
    },
    data () {
      return {
        currencyList: [],
        rateTypeList: [],
        rateList: [],
        unitList: [],
        templateList: [],
        subjectList: [],
        abstractList: [],
        accountingItem: [],
        customerList: [],
        departmentList: [],
        clerkList: [],
        supplierList: [],
        bankAccountList: [],
        costList: [],
        cashList: [],
        borrower: 0,
        lender: 0,
        options: null,
        oldData: {},
        proof: [],
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
          isAllC: false,
          accountItem: []
        },
        formData: {
          accountSetId: null,
          time: null,
          accountingPeriod: '',
          proofWordId: null,
          proofWords: null,
          certificateNumber: null,
          child: [],
          referenceInfo: '',
          businessDate: null,
          voucher: null,
          audit: null,
          post: null,
          examine: null,
          cashier: null,
          handle: '',
          des: '',
          paymentMode: '',
          paymentNo: '',
          currentBusiness: '',
          files: 0,
          serialNumber: 0,
          systemModule: '',
          description: '',
          invalid: false
        }
      }
    },
    computed: {
      ...mapGetters([
        'myProfile'
      ])
    },
    watch: {
      'formData.time' () {
        if (this.formData.time) this.formData.businessDate = this.formData.time
      },
      'formData.child': {
        handler () {
          this.borrower = this.formData.child.reduce((total, v) => (total = NP.plus(total, v.borrower ? Number(v.borrower) : 0)), 0)
          this.lender = this.formData.child.reduce((total, v) => (total = NP.plus(total, v.lender ? Number(v.lender) : 0)), 0)
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      moment,
      formatMoney,
      loadCurrency () {
        axios.post(CONFIG.server.tradeApiUrl + 'currency/query', {
          accountSetId: this.accountSet._id
        }).then(res => {
          this.currencyList = res.data
        }).catch(err => {
          $alert(err.message)
        })
      },
      loadRateType () {
        axios.post(CONFIG.server.tradeApiUrl + 'exchangeRate/type/query', {
          accountSetId: this.accountSet._id
        }).then(res => {
          this.rateTypeList = res.data
        }).catch(err => {
          $alert(err.message)
        })
        axios.post(CONFIG.server.tradeApiUrl + 'exchangeRate/rate/query', {
            accountSetId: this.accountSet._id
        }).then(res => {
          this.rateList = res.data
        }).catch(err => {
          $alert(err.message)
        })
      },
      loadUnit () {
        axios.post(CONFIG.server.tradeApiUrl + 'measureUnit/unit/query', {
          accountSetId: this.accountSet._id
        }).then(res => {
          this.unitList = res.data
        }).catch(err => {
          $alert(err.message)
        })
      },
      loadTemp () {
        axios.post(CONFIG.server.tradeApiUrl + 'credentialsTemplate/query', {
          accountSetId: this.accountSet._id
        }).then(res => {
          this.templateList = res.data
        }).catch(err => {
          $alert(err.message)
        })
      },
      loadSubject () {
        axios.post(CONFIG.server.tradeApiUrl + 'subject/subject/query', {
          accountSetId: this.accountSet._id
        }).then(res => {
          this.subjectList = res.data
        }).catch(err => {
          $alert(err.message)
        })
      },
      loadAbstract () {
        axios.post(CONFIG.server.tradeApiUrl + 'abstract/query', {
          accountSetId: this.accountSet._id
        }).then(res => {
          this.abstractList = res.data
        }).catch(err => {
          $alert(err.message)
        })
      },
      load () {
        axios.post(CONFIG.server.tradeApiUrl + 'credentials/queryLastInfo', {
          accountSetId: this.accountSet._id
        }).then(res => {
          if (this.credentialsData) {
            this.formData = JSON.parse(JSON.stringify(this.credentialsData))
            this.formData.time = moment(this.credentialsData.time).format('YYYY-MM-DD')
            this.formData.businessDate = moment(this.credentialsData.businessDate).format('YYYY-MM-DD')
            this.oldData = JSON.parse(JSON.stringify(this.credentialsData.child))
            this.proof = res.data.proof
          } else if (res.data) {
            let time = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
            if (time === res.data.accountingPeriod) {
              this.formData.time = res.data.time ? moment(res.data.time).format('YYYY-MM-DD') : moment(new Date(time + '-1')).format('YYYY-MM-DD')
              this.formData.accountingPeriod = res.data.accountingPeriod || time
              this.formData.businessDate = res.data.time ? moment(res.data.time).format('YYYY-MM-DD') : moment(new Date(time + '-1')).format('YYYY-MM-DD')
            } else {
              this.formData.time = moment(new Date(time + '-1')).format('YYYY-MM-DD')
              this.formData.accountingPeriod = time
              this.formData.businessDate = moment(new Date(time + '-1')).format('YYYY-MM-DD')
            }
            let defaultProof = res.data.proof.find(v => v.defaultValue === '是') || (res.data.proof.length ? res.data.proof[0] : null)
            this.formData.proofWordId = defaultProof ? defaultProof._id : null
            this.formData.proofWords = defaultProof ? defaultProof.name : null
            this.formData.certificateNumber = defaultProof ? defaultProof.total : null
            this.formData.voucher = this.userList.find(v => v.phone === this.myProfile.phone).userId
            this.proof = res.data.proof
            this.formData.serialNumber = res.data.serialNumber
            this.options = moment(new Date(time + '-1')).valueOf()

            if (this.credentialsChild && this.credentialsChild.length) {
              this.formData.child = JSON.parse(JSON.stringify(this.credentialsChild))
            } else {
              let add1 = Object.assign({}, this.childObj)
              add1.borrower = 0
              let add2 = Object.assign({}, this.childObj)
              add2.lender = 0
              this.formData.child.push(add1)
              this.formData.child.push(add2)
            }
          }
          $preloader.hide()
        }).catch(err => {
          $alert(err.message)
          $preloader.hide()
        })
      },
      getUserName (id) {
        if (!id) return ''
        let info = this.userList.find(v => v.userId === id)
        return info ? info.name : ''
      },
      selectProof () {
        let buttons = []
        this.proof.forEach(v => {
          buttons.push({
            text: v.name,
            onClick: () => {
              this.formData.proofWords = v.name
              this.formData.proofWordId = v._id
              this.formData.certificateNumber = v.total
            }
          })
        })
        buttons.push({
          text: '取消'
        })
        $dialog.create({
          title: '选择凭证字',
          buttons: buttons,
          verticalButtons: true,
        }).open();
      },
      changeMoney (e, i) {
        let cData = this.formData.child[i]
        let type = cData.lender !== null ? 'lender' : 'borrower'
        this.$set(this.formData.child[i], type, e.target.value)
        if (cData.rate) {
          this.$set(this.formData.child[i], 'currencyAmount', NP.divide(e.target.value, cData.rate))
        }
      },
      selectFun (list, index, which, title, index1, isChange) {
        let buttons = []
        list.forEach(v => {
          buttons.push({
            text: v.name,
            onClick: () => {
              if (index1 !== undefined && index1 !== null) {
                this.$set(this.formData.child[index][which][index1], 'code' , v.code)
                this.$set(this.formData.child[index][which][index1], 'name' , v.name)
                this.$set(this.formData.child[index][which][index1], '_id' , v._id)
              } else {
                this.$set(this.formData.child[index], which, v.name)
                if (isChange) this.changeRate(index, which)
              }
            }
          })
        })
        buttons.push({
          text: '取消'
        })
        $dialog.create({
          title: title,
          buttons: buttons,
          verticalButtons: true,
        }).open();
      },
      selectSubject (index) {
        this.$f7router.navigate('/selectSubject', {
          props: {
            accountSet: this.accountSet,
            subjectList: this.subjectList,
            go: (obj) => {
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
              if (obj.accountItem && obj.accountItem.length) {
                let accountItem = obj.accountItem.map(a => {
                  return {
                    type: a,
                    code: null,
                    name: null,
                    _id: null
                  }
                })
                cData.accountItem = accountItem
              }
              this.$forceUpdate()
              this.$f7router.back()
            }
          }
        })
      },
      loadCustomer (i, i1) {
        $preloader.show()
        axios.post(CONFIG.server.tradeApiUrl + 'customer/query', {
          accountSetId: this.accountSet._id
        }).then(res => {
          this.customerList = res.data
          if (this.customerList.length) {
            this.selectFun(this.customerList, i, 'accountItem', '选择客户', i1)
          } else {
            $alert('请前往财务系统创建客户')
          }
          $preloader.hide()
        }).catch(err => {
          $alert(err.message)
          $preloader.hide()
        })
      },
      loadDepartment (i, i1) {
        $preloader.show()
        axios.post(CONFIG.server.tradeApiUrl + 'department/query', {
          accountSetId: this.accountSet._id
        }).then(res => {
          this.departmentList = res.data
          if (this.departmentList.length) {
            this.selectFun(this.departmentList, i, 'accountItem', '选择部门', i1)
          } else {
            $alert('请前往财务系统创建部门')
          }
          $preloader.hide()
        }).catch(err => {
          $alert(err.message)
          $preloader.hide()
        })
      },
      loadClerk (i, i1) {
        $preloader.show()
        axios.post(CONFIG.server.tradeApiUrl + 'clerk/query', {
          accountSetId: this.accountSet._id
        }).then(res => {
          this.clerkList = res.data
          if (this.clerkList.length) {
            this.selectFun(this.clerkList, i, 'accountItem', '选择职员', i1)
          } else {
            $alert('请前往财务系统创建职员')
          }
          $preloader.hide()
        }).catch(err => {
          $alert(err.message)
          $preloader.hide()
        })
      },
      loadSupplier (i, i1) {
        $preloader.show()
        axios.post(CONFIG.server.tradeApiUrl + 'supplier/query', {
          accountSetId: this.accountSet._id
        }).then(res => {
          this.supplierList = res.data
          if (this.supplierList.length) {
            this.selectFun(this.supplierList, i, 'accountItem', '选择供应商', i1)
          } else {
            $alert('请前往财务系统创建供应商')
          }
          $preloader.hide()
        }).catch(err => {
          $alert(err.message)
          $preloader.hide()
        })
      },
      loadCost (i, i1) {
        $preloader.show()
        axios.post(CONFIG.server.tradeApiUrl + 'cost/query', {
          accountSetId: this.accountSet._id
        }).then(res => {
          this.costList = res.data
          if (this.costList.length) {
            this.selectFun(this.costList, i, 'accountItem', '选择费用', i1)
          } else {
            $alert('请前往财务系统创建费用')
          }
          $preloader.hide()
        }).catch(err => {
          $alert(err.message)
          $preloader.hide()
        })
      },
      loadBank (i, i1) {
        $preloader.show()
        axios.post(CONFIG.server.tradeApiUrl + 'bankAccount/query', {
          accountSetId: this.accountSet._id
        }).then(res => {
          this.bankAccountList = res.data
          if (this.bankAccountList.length) {
            this.selectFun(this.bankAccountList, i, 'accountItem', '选择银行账户', i1)
          } else {
            $alert('请前往财务系统创建银行账户')
          }
          $preloader.hide()
        }).catch(err => {
          $alert(err.message)
          $preloader.hide()
        })
      },
      loadCash (i, i1) {
        $preloader.show()
        axios.post(CONFIG.server.tradeApiUrl + 'cashFlow/query', {
          accountSetId: this.accountSet._id
        }).then(res => {
          this.cashList = res.data
          if (this.cashList.length) {
            this.selectFun(this.cashList, i, 'accountItem', '选择现金流量项目', i1)
          } else {
            $alert('请前往财务系统创建现金流量项目')
          }
          $preloader.hide()
        }).catch(err => {
          $alert(err.message)
          $preloader.hide()
        })
      },
      selectAccountItem (type, i, i1) {
        let list = []
        if (type === '客户') {
          list = this.customerList
          if (!list.length) this.loadCustomer(i, i1)
        } else if (type === '部门') {
          list = this.departmentList
          if (!list.length) this.loadDepartment(i, i1)
        } else if (type === '职员') {
          list = this.clerkList
          if (!list.length) this.loadClerk(i, i1)
        } else if (type === '供应商') {
          list = this.supplierList
          if (!list.length) this.loadSupplier(i, i1)
        } else if (type === '费用') {
          list = this.costList
          if (!list.length) this.loadCost(i, i1)
        } else if (type === '银行账户') {
          list = this.bankAccountList
          if (!list.length) this.loadBank(i, i1)
        } else if (type === '现金流量项目') {
          list = this.cashList
          if (!list.length) this.loadCash(i, i1)
        }
        if (list.length) this.selectFun(list, i, 'accountItem', '选择' + type, i1)
      },
      changeRate (i, type) {
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
        let cData = this.formData.child[i]
        if (cData.price && cData.number) {
          cData.borrower = cData.borrower || !cData.lender ? NP.times(cData.price, cData.number) : null
          cData.lender = cData.lender ? NP.times(cData.price, cData.number) : null
          cData.currencyAmount = NP.divide((cData.borrower || cData.lender || 0), cData.rate) || null
        }
      },
      changeDirection (index, which, which1, money) {
        this.$set(this.formData.child[index], which1, null)
        this.$set(this.formData.child[index], which, money)
      },
      getEqual (i) {
        let cData = this.formData.child[i]
        let type = cData.lender !== null ? 'lender' : 'borrower'
        let type1 = cData.lender !== null ? 'borrower' : 'lender'
        let all = this.formData.child.reduce((total, v) => (total = NP.plus(total, Number(v[type1]))), 0)
        this.formData.child[i][type] = this.formData.child.reduce((total, v, index) => (total = NP.minus(total, (index !== i ? Number(v[type]) : 0))), all)
      },
      deleteFun (i) {
        this.formData.child.splice(i, 1)
      },
      addFun () {
        let add = Object.assign({}, this.childObj)
        add.borrower = 0
        this.formData.child.push(add)
      },
      save () {
        $preloader.show()
        let isSave = true
        let error = (err) => {
          $preloader.hide()
          isSave = false
          $alert(err)
          return
        }
        this.formData.child.forEach((v, i) => {
          if (i === 0 && !v.abstract) {
            error('第1条凭证摘要必填')
          } else if (!v.subject || !v.subjectCode) {
            error(`第${i + 1}条请选择科目`)
          } else if (this.isC && (!v.rate)) {
            error(`第${i + 1}条请输入汇率`)
          } else if (this.isC && (!v.currencyAmount)) {
            error(`第${i + 1}条请输入原币金额`)
          } else if (this.isC && v.unit && (!v.price)) {
            error(`第${i + 1}条请输入单价`)
          } else if (this.isC && v.unit && (!v.number)) {
            error(`第${i + 1}条请输入数量`)
          } else if (!v.borrower && !v.lender) {
            error(`第${i + 1}条请输入借方或贷方`)
          }
        })
        if (this.borrower !== this.lender) {
          error(`借贷不平，无法保存`)
        }
        if (isSave) {
          let data = JSON.parse(JSON.stringify(this.formData))
          data.accountSetId = this.accountSet._id
          axios.post(CONFIG.server.tradeApiUrl + 'credentials/update', data).then(res => {
            $alert('成功保存凭证')
            if (res.data) {
              this.oldData = JSON.parse(JSON.stringify(res.data.child))
              this.formData._id = res.data._id
            }
            $preloader.hide()
          }).catch(err => {
            $preloader.hide()
            $alert(err.message)
          })
        }
      }
    },
    mounted () {
      if (this.accountSet) {
        $preloader.show()
        this.loadCurrency()
        this.loadRateType()
        this.loadUnit()
        this.loadTemp()
        this.loadSubject()
        this.loadAbstract()
        axios.post(CONFIG.server.tradeApiUrl + 'userManage/userInfoQuery', {
          accountSetId: this.accountSet._id,
          companyId:  this.myProfile.bClientId
        }).then(res => {
          this.userList = res.data
          this.load()
        }).catch(err => {
          $alert('查询用户列表失败')
          $preloader.hide()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
    .list-item{
        background: #FFFFFF;
        /*width: 100%;*/
        height: 46px;
        font-size: 14px;
        line-height: 46px;
        border-bottom: 1px solid #f8f8f8;
        margin: 0;
        padding: 0 0 0 20px;
        display: flex;
        justify-content: space-between;
    }

    .list-type div{
        width: 50%;
        text-align: right;
        margin-right: 10px;
        color: darkgray;
    }
    .list-item .item-input{
        width: 50%;
        background:none;
        outline:none;
        border:0px;
        float: right;
        text-align: right;
        font-size: 14px;
        line-height: 46px;
        padding-right: 15px;
        box-sizing: border-box;
        color: #333;
    }

    .page_layer {
        height: 100%;
        position: relative;
        overflow: hidden;

        .submit-button{
            position: absolute;
            bottom: 0;
            width:100%;
            height:45px;
            line-height: 45px;
            font-size:16px;
            color: #FFFFFF;
            text-align: center;
            background:#3385FF;
        }
    }

    .p_content {
        position: relative;
        height: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;

        .cre_list {
            padding: 0 20px 20px;
            border-bottom: 1px solid #eee;
            background: #fff;

            &:nth-child(5) { margin-top: 10px; }

            .list_t {
                height: 36px;
                line-height: 36px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .icon {
                    display: flex;
                    align-items: center;

                    span {
                        width: 20px;
                        height: 20px;
                        border-radius: 20px;
                        font-size: 12px;
                        line-height: 20px;
                        text-align: center;
                        margin-right: 10px;
                        display: block;
                        color: red;
                        background: #fee1e1;

                        &.active {
                            color: blue;
                            background: #c9dffa;
                        }
                    }
                }

                .delete_btn {
                    color: red;
                }
            }

            .list_c {
                background: #f7f7f8;
                margin: 0;

                .list_li {
                    margin: 0;
                    padding: 0 10px;
                    list-style: none;
                    p { margin: 0; }
                    li {
                        display: flex;
                        align-items: center;
                        height: 36px;
                        line-height: 36px;
                        border-bottom: 1px solid #eee;

                        &:last-child{ border: none; }

                        input {
                            display: flex;
                            flex-grow: 1;
                            margin: 0 10px;
                            height: 100%;
                        }
                    }

                    .btn_group {
                        display: flex;
                        align-items: center;

                        .btn {
                            width: 20px;
                            height: 20px;
                            border-radius: 20px;
                            font-size: 12px;
                            line-height: 20px;
                            text-align: center;
                            display: block;
                            margin-right: 10px;
                            overflow: hidden;

                            span {
                                color: #fff;
                                background: #ccc;
                                display: block;
                                width: 100%;
                                height: 100%;
                            }

                            &:nth-child(1) .active {
                                color: blue;
                                background: #c9dffa;
                            }

                            &:nth-child(2) .active {
                                color: red;
                                background: #fee1e1;
                            }
                        }
                    }
                }
            }
        }

        .other_list {
            padding: 0 20px;
            height: 36px;
            line-height: 36px;
            border-top: 1px solid #f8f8f8;
            background: #fff;
            display: flex;
            justify-content: space-between;

            p {
                text-align: center;
                margin: 0;
                &:nth-child(1) {
                    color: #3385FF;
                }
                &:nth-child(2) {
                    color: red;
                }
            }
        }

        .add_btn {
            width: 100%;
            height: 36px;
            line-height: 36px;
            text-align: center;
            background: #fff;
            border-radius: 5px;
            margin: 10px 0 60px;
            color: #3385FF;
        }
    }
</style>
