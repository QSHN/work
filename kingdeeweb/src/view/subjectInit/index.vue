<template>
  <div>
    <Row type="flex"  justify="space-between" style="margin-bottom: 10px;">
      <div>
        <span>类别</span>
        <RadioGroup v-model="whichType" type="button" style="margin-left: 5px;">
          <Radio v-for="(v, i) in subject" :key="i" :label="v._id">{{ v.name }}</Radio>
        </RadioGroup>
        <span style="margin-left: 20px;">币别：</span>
        <Select v-model="currency" @on-change="selectCurrency" filterable style="width: 100px;">
          <Option v-for="(item, index) in currencyList" :value="item.name" :key="index">{{ item.name }}</Option>
        </Select>
        <span style="margin-left: 20px;">汇率：</span>
        <InputNumber v-model="rate"
                     :min="0"
                     :step="0.1"
                     :readonly="accountSet && (currency === accountSet.unit || accountSet.generalLedger)"
                     style="width: 100px" />
      </div>
      <div>
        <Button type="primary" style="margin-left: 20px;" @click="$refs.theTrial.show()">试算平衡</Button>
        <Button type="success" style="margin-left: 20px;" @click="save" v-if="accountSet && !accountSet.generalLedger">保存数据</Button>
      </div>
    </Row>

    <Table border
           :width="getTableWidth"
           :height="getTableHeight"
           :columns="getColumns"
           :data="tableData"
           @on-row-click="rowClick"
           :row-class-name="rowClassName"
           class="input_table">
      <template slot-scope="{ row }" slot="name">
        <div style="position: relative">
          <span :style="{ paddingLeft: row.parentId.length * 10 + 'px'}">{{ row.name }}</span>
          <span style="position: absolute; width: 20px; height: 20px; right: -10px; cursor: pointer;" v-if="row.accountItem.length && !data.filter(v => v.parentId.includes(row._id)).length">
            <img v-if="row._id === row.parentId[row.parentId.length - 1]" @click="deleteAccounting(row._id, row.code, row.name)" src="../../assets/images/icon/close.svg" title="删除" style="width: 20px; height: 20px;">
            <img v-else @click="addAccounting(row)" src="../../assets/images/icon/add.svg" title="增加明细" style="width: 20px; height: 20px;">
          </span>
        </div>
      </template>

      <template slot-scope="{ row }" slot="balance">
        {{ row.balance.substr(0, 1) }}
      </template>

      <template slot-scope="{ row }" slot="initYBRate">
        <div class="text">{{ row.initYearBorrow ? formatMoney(row.initYearBorrow, '', 2) : '' }}</div>
        <div class="hover_layer">
          <template v-if="
              data.filter(v => v.parentId.includes(row._id)).length
              || ((row.accountItem.length && !(row._id === row.parentId[row.parentId.length - 1])))
              || (accountSet && accountSet.generalLedger)">
            <div style="text-align: left; padding-left: 8px;">
              {{row.initYearBorrow ? formatMoney(row.initYearBorrow, '', 2) : ''}}
            </div>
          </template>
          <template v-else>
            <InputNumber v-model="row.initYearBorrow"
                         :min="0"
                         :step="0.1"
                         @on-blur="ChangeRate('initYearBorrow', row, 'initYBRate', 'yearBorrow')"
                         style="width: 100%" />
          </template>
        </div>
      </template>

      <template slot-scope="{ row }" slot="yearBorrow">
        <div class="text">{{row.yearBorrow ? formatMoney(row.yearBorrow, '', 2) : ''}}</div>
        <div class="hover_layer">
          <template v-if="
              data.filter(v => v.parentId.includes(row._id)).length
              || ((row.accountItem.length && !(row._id === row.parentId[row.parentId.length - 1])))
              || (accountSet && (currency !== accountSet.unit || accountSet.generalLedger))">
            <div style="text-align: left; padding-left: 8px;">
              {{row.yearBorrow ? formatMoney(row.yearBorrow, '', 2) : ''}}
            </div>
          </template>
          <template v-else>
            <InputNumber v-model="row.yearBorrow"
                         :min="0"
                         :step="0.1"
                         @on-blur="calculate('yearBorrow', row)"
                         style="width: 100%" />
          </template>
        </div>
      </template>

      <template slot-scope="{ row }" slot="initYCRate">
        <div class="text">{{row.initYearCredit ? formatMoney(row.initYearCredit, '', 2) : ''}}</div>
        <div class="hover_layer">
          <template v-if="
              data.filter(v => v.parentId.includes(row._id)).length
              || ((row.accountItem.length && !(row._id === row.parentId[row.parentId.length - 1])))
              || (accountSet &&  accountSet.generalLedger)">
            <div style="text-align: left; padding-left: 8px;">
              {{row.initYearCredit ? formatMoney(row.initYearCredit, '', 2) : ''}}
            </div>
          </template>
          <template v-else>
            <InputNumber v-model="row.initYearCredit"
                         :min="0"
                         :step="0.1"
                         @on-blur="ChangeRate('initYearCredit', row, 'initYCRate', 'yearCredit')"
                         style="width: 100%" />
          </template>
        </div>
      </template>

      <template slot-scope="{ row }" slot="yearCredit">
        <div class="text">{{row.yearCredit ? formatMoney(row.yearCredit, '', 2) : ''}}</div>
        <div class="hover_layer">
          <template v-if="
              data.filter(v => v.parentId.includes(row._id)).length
              || ((row.accountItem.length && !(row._id === row.parentId[row.parentId.length - 1])))
              || (accountSet && (currency !== accountSet.unit || accountSet.generalLedger))">
            <div style="text-align: left; padding-left: 8px;">
              {{row.yearCredit ? formatMoney(row.yearCredit, '', 2) : ''}}
            </div>
          </template>
          <template v-else>
            <InputNumber v-model="row.yearCredit"
                         :min="0"
                         :step="0.1"
                         @on-blur="calculate('yearCredit', row)"
                         style="width: 100%" />
          </template>
        </div>
      </template>

      <template slot-scope="{ row }" slot="initBRate">
        <div class="text">{{row.initBeginningBalance ? formatMoney(row.initBeginningBalance, '', 2) : ''}}</div>
        <div class="hover_layer">
          <template v-if="
              data.filter(v => v.parentId.includes(row._id)).length
              || ((row.accountItem.length && !(row._id === row.parentId[row.parentId.length - 1])))
              || (accountSet && accountSet.generalLedger)">
            <div style="text-align: left; padding-left: 8px;">
              {{row.initBeginningBalance ? formatMoney(row.initBeginningBalance, '', 2) : ''}}
            </div>
          </template>
          <template v-else>
            <InputNumber v-model="row.initBeginningBalance"
                         :min="0"
                         :step="0.1"
                         @on-blur="ChangeRate('initBeginningBalance', row, 'initBRate', 'beginningBalance')"
                         style="width: 100%" />
          </template>
        </div>
      </template>

      <template slot-scope="{ row }" slot="beginningBalance">
        <div class="text">{{row.beginningBalance ? formatMoney(row.beginningBalance, '', 2) : ''}}</div>
        <div class="hover_layer">
          <template v-if="
              data.filter(v => v.parentId.includes(row._id)).length
              || ((row.accountItem.length && !(row._id === row.parentId[row.parentId.length - 1])))
              || (accountSet && (currency !== accountSet.unit || accountSet.generalLedger))">
            <div style="text-align: left; padding-left: 8px;">
              {{row.beginningBalance ? formatMoney(row.beginningBalance, '', 2) : ''}}
            </div>
          </template>
          <template v-else>
            <InputNumber v-model="row.beginningBalance"
                         :min="0"
                         :step="0.1"
                         @on-blur="calculate('beginningBalance', row)"
                         style="width: 100%" />
          </template>
        </div>
      </template>
    </Table>

    <theTrial ref="theTrial" :subjectData="data" />
    <accountingModal ref="accountingModal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { querySubject, saveSubject, querySubjectType } from '../../api/subject'
import { currencyQuery } from '../../api/currency'
import theTrial from './theTrial'
import accountingModal from '../credentials/accounting'
import NP from 'number-precision'
import { formatMoney } from 'accounting'
import { subject } from '../../libs/subject'
export default {
  name: 'index',
  components: {
    theTrial,
    accountingModal
  },
  data () {
    return {
      subject,
      currentRow: null,
      whichType: 1,
      currency: '',
      rate: 1,
      data: [],
      currencyList: [],
      groupList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission'
    ]),
    tableData () {
      let list = this.data.filter(v => (
        (v.currency === '所有币别' || v.currency === '不核算') &&
        this.accountSet &&
        this.currency === this.accountSet.unit
      ) || v.currency === this.currency)
      list = this.data.filter(v => list.find(f => f._id === v._id || f.parentId.includes(v._id)))
      const g = this.groupList.filter(v => v.type === this.whichType)
      list = list.filter(v => g.filter(i => v.typeId === i._id).length)
      let fList = JSON.parse(JSON.stringify(list))
      let addNum = 1
      fList.forEach((v, i) => {
        if (v.accountItem.length && v.child.length) {
          v.child.forEach(f => {
            let obj = JSON.parse(JSON.stringify(f))
            obj = Object.assign(obj, {
              _id: v._id,
              code: v.code + '_' + f.code,
              name: v.name + '_' + f.name,
              accountItem: v.accountItem,
              parentId: v.parentId.concat([v._id]),
              currency: v.currency,
              balance: v.balance
            })
            list.splice(i + addNum, 0, obj)
            addNum++
          })
        }
      })
      return list
    },
    getColumns () {
      let list = [
        {
          title: '科目编码',
          key: 'code',
          width: 300
        },
        {
          title: '科目名称',
          slot: 'name',
          width: 400
        },
        {
          title: '方向',
          width: 65,
          align: 'center',
          slot: 'balance',
          key: 'balance'
        }
      ]
      if (this.accountSet) {
        if (this.accountSet.accountingPeriod === 1) {
          let children = [
            {
              title: '原币',
              slot: 'beginningBalance',
              width: 150,
              align: 'center'
            }
          ]
          if (this.currency !== this.accountSet.unit) {
            children.splice(0, 0, {
              title: '原币',
              slot: 'initBRate',
              width: 150,
              align: 'center'
            })
            children[1].title = '本位币'
          }
          list.push({
            title: '期初余额',
            align: 'center',
            children
          })
        } else {
          let add = [
            {
              title: '期初余额',
              align: 'center',
              children: [
                {
                  title: '原币',
                  slot: 'beginningBalance',
                  width: 150,
                  align: 'center'
                }
              ]
            },
            {
              title: '本年累计借方',
              align: 'center',
              children: [
                {
                  title: '原币',
                  slot: 'yearBorrow',
                  width: 150,
                  align: 'center'
                }
              ]
            },
            {
              title: '本年累计贷方',
              align: 'center',
              children: [
                {
                  title: '原币',
                  slot: 'yearCredit',
                  width: 150,
                  align: 'center'
                }
              ]
            }
          ]
          if (this.currency !== this.accountSet.unit) {
            add[1].children = [
              {
                title: '原币',
                slot: 'initYBRate',
                width: 150,
                align: 'center'
              },
              {
                title: '本位币',
                slot: 'yearBorrow',
                width: 150,
                align: 'center'
              }
            ]
            add[2].children = [
              {
                title: '原币',
                slot: 'initYCRate',
                width: 150,
                align: 'center'
              },
              {
                title: '本位币',
                slot: 'yearCredit',
                width: 150,
                align: 'center'
              }
            ]
            add[0].children.splice(0, 0, {
              title: '原币',
              slot: 'initBRate',
              width: 150,
              align: 'center'
            })
            add[0].children[1].title = '本位币'
          }
          list = list.concat(add)
        }
        list.push({
          title: ' '
        })
      }
      return list
    },
    getTableHeight () {
      return window.innerHeight - 175
    },
    getTableWidth () {
      return window.innerWidth - 100
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.currency = this.accountSet.unit
          this.loadGroup()
          this.loadCurrency()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    formatMoney,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '财务初始余额') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}财务初始余额的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadGroup () {
      querySubjectType({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('querySubjectType', res.data)
        this.groupList = res.data
        this.loadSubject()
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
    },
    loadSubject () {
      querySubject({ accountSetId: this.accountSet._id }).then(res => {
        let list = res.data
        list.forEach(v => {
          if (!v.yearBorrow) v.yearBorrow = null
          if (!v.yearCredit) v.yearCredit = null
          if (!v.beginningBalance) v.beginningBalance = null
        })
        this.data = list.map(v => {
          if (v.balance === '贷方') {
            return Object.assign({
              cellClassName: {
                balance: 'active_tb_cell'
              }
            }, v)
          } else {
            return v
          }
        })
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
    },
    loadCurrency () {
      currencyQuery({
        accountSetId: this.accountSet._id
      }).then(res => {
        this.currencyList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '币别',
          desc: err.message
        })
      })
    },
    calculate (type, row) {
      let oldValue = this.data.find(v => v._id === row._id)[type]
      if (row._id === row.parentId[row.parentId.length - 1]) {
        let pData = this.data.find(v => v._id === row._id)
        oldValue = pData.child.find(f => (
          pData.code + '_' + f.code === row.code &&
          pData.name + '_' + f.name === row.name
        ))[type]
      }
      let updateA = (v, isC) => {
        if (type === 'beginningBalance') {
          if (v.balance === row.balance) {
            v[type] = NP.plus(v[type] || 0, NP.minus(row[type] || 0, oldValue || 0))
          } else {
            v[type] = NP.minus(v[type] || 0, NP.minus(row[type] || 0, oldValue || 0))
          }
        } else {
          v[type] = NP.plus(v[type] || 0, NP.minus(row[type] || 0, oldValue || 0))
        }
        v.child.forEach(f => {
          if (
            row.code.includes(f.code) &&
            row.name.includes(f.name)
          ) {
            if (isC) {
              f[type] = row[type]
            } else {
              if (type === 'beginningBalance') {
                if (v.balance === row.balance) {
                  f[type] = NP.plus(f[type] || 0, NP.minus(row[type] || 0, oldValue || 0))
                } else {
                  f[type] = NP.minus(f[type] || 0, NP.minus(row[type] || 0, oldValue || 0))
                }
              } else {
                f[type] = NP.plus(f[type] || 0, NP.minus(row[type] || 0, oldValue || 0))
              }
            }
          }
        })
      }
      this.data.forEach(v => {
        if (v.accountItem.length) {
          if (v._id === row._id) {
            updateA(v, true)
          }
          if (row.parentId.includes(v._id) && v._id !== row.parentId[row.parentId.length - 1]) {
            updateA(v, false)
          }
        } else {
          if (v._id === row._id) v[type] = row[type]
          if (row.parentId.includes(v._id)) {
            if (type === 'beginningBalance') {
              if (v.balance === row.balance) {
                v[type] = NP.plus(v[type] || 0, NP.minus(row[type] || 0, oldValue || 0))
              } else {
                v[type] = NP.minus(v[type] || 0, NP.minus(row[type] || 0, oldValue || 0))
              }
            } else {
              v[type] = NP.plus(v[type] || 0, NP.minus(row[type] || 0, oldValue || 0))
            }
          }
        }
      })
    },
    ChangeRate (type, row, rate, type1) {
      let fData = this.data.find(v => v._id === row._id)
      if (row._id === row.parentId[row.parentId.length - 1]) {
        let pData = this.data.find(v => v._id === row._id)
        fData = pData.child.find(f => (
          pData.code + '_' + f.code === row.code &&
          pData.name + '_' + f.name === row.name
        ))
      }
      row[type1] = NP.times(this.rate, row[type] || 0)
      let updateA = (v, isC) => {
        if (type === 'InitBeginningBalance') {
          if (v.balance === row.balance) {
            v[type] = NP.plus(v[type] || 0, NP.minus(row[type] || 0, fData[type] || 0))
            v[type1] = NP.plus(v[type1] || 0, NP.minus(row[type1] || 0, fData[type1] || 0))
          } else {
            v[type] = NP.minus(v[type] || 0, NP.minus(row[type] || 0, fData[type] || 0))
            v[type1] = NP.minus(v[type1] || 0, NP.minus(row[type1] || 0, fData[type1] || 0))
          }
        } else {
          v[type] = NP.plus(v[type] || 0, NP.minus(row[type] || 0, fData[type] || 0))
          v[type1] = NP.plus(v[type1] || 0, NP.minus(row[type1] || 0, fData[type1] || 0))
        }
        v.child.forEach(f => {
          if (
            row.code.includes(f.code) &&
            row.name.includes(f.name)
          ) {
            if (isC) {
              f[type] = row[type]
              f[rate] = this.rate
              f[type1] = NP.times(this.rate, row[type] || 0)
            } else {
              if (type === 'InitBeginningBalance') {
                if (v.balance === row.balance) {
                  f[type] = NP.plus(f[type] || 0, NP.minus(row[type] || 0, fData[type] || 0))
                  f[type1] = NP.plus(f[type1] || 0, NP.minus(row[type1] || 0, fData[type1] || 0))
                } else {
                  f[type] = NP.minus(f[type] || 0, NP.minus(row[type] || 0, fData[type] || 0))
                  f[type1] = NP.minus(f[type1] || 0, NP.minus(row[type1] || 0, fData[type1] || 0))
                }
              } else {
                f[type] = NP.plus(f[type] || 0, NP.minus(row[type] || 0, fData[type] || 0))
                f[type1] = NP.plus(f[type1] || 0, NP.minus(row[type1] || 0, fData[type1] || 0))
              }
            }
          }
        })
      }
      this.data.forEach(v => {
        if (v.accountItem.length) {
          if (v._id === row._id) {
            updateA(v, true)
          }
          if (row.parentId.includes(v._id) && v._id !== row.parentId[row.parentId.length - 1]) {
            updateA(v, false)
          }
        } else {
          if (v._id === row._id) {
            v[type] = row[type]
            v[rate] = this.rate
            v[type1] = NP.times(this.rate, row[type] || 0)
          }
          if (row.parentId.includes(v._id)) {
            if (type === 'InitBeginningBalance') {
              if (v.balance === row.balance) {
                v[type] = NP.plus(v[type] || 0, NP.minus(row[type] || 0, fData[type] || 0))
                v[type1] = NP.plus(v[type1] || 0, NP.minus(row[type1] || 0, fData[type1] || 0))
              } else {
                v[type] = NP.minus(v[type] || 0, NP.minus(row[type] || 0, fData[type] || 0))
                v[type1] = NP.minus(v[type1] || 0, NP.minus(row[type1] || 0, fData[type1] || 0))
              }
            } else {
              v[type] = NP.plus(v[type] || 0, NP.minus(row[type] || 0, fData[type] || 0))
              v[type1] = NP.plus(v[type1] || 0, NP.minus(row[type1] || 0, fData[type1] || 0))
            }
          }
        }
      })
    },
    save () {
      if (!this.judge('修改')) return
      this.$Modal.confirm({
        title: '初始余额录入',
        content: `请确定是否保存本次录入的数据`,
        onOk: () => {
          this.$Spin.show()
          let accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
          let year = this.accountSet.accountingYear
          let subjectList = this.data.map(f => {
            return {
              _id: f._id,
              yearBorrow: f.yearBorrow || null,
              yearCredit: f.yearCredit || null,
              beginningBalance: f.beginningBalance || null,
              initYearBorrow: f.initYearBorrow || null,
              initYearCredit: f.initYearCredit || null,
              initBeginningBalance: f.initBeginningBalance || null,
              initBRate: f.initBRate || 1,
              initYBRate: f.initYBRate || 1,
              initYCRate: f.initYCRate || 1,
              eachBalance: [{
                time: accountingPeriod,
                borrower: 0,
                lender: 0,
                beginningBalance: f.beginningBalance || null
              }],
              eachYearBalance: [{
                time: year,
                borrower: 0,
                lender: 0,
                beginningBalance: f.beginningBalance || null
              }],
              child: f.child.map(m => {
                let cData = Object.assign({}, m)
                cData.eachBalance = [{
                  time: accountingPeriod,
                  borrower: 0,
                  lender: 0,
                  beginningBalance: m.beginningBalance || null
                }]
                cData.eachYearBalance = [{
                  time: year,
                  borrower: 0,
                  lender: 0,
                  beginningBalance: m.beginningBalance || null
                }]
                return cData
              })
            }
          })
          saveSubject({ subjectList }).then(res => {
            this.$Spin.hide()
            this.$Notice.success({
              title: '初始余额录入',
              desc: `本次录入的数据保存成功`
            })
            this.loadSubject()
          }).catch(err => {
            this.$Spin.hide()
            this.$Notice.error({
              title: '初始余额录入',
              desc: err.message
            })
          })
        }
      })
    },
    selectCurrency (val) {
      let data = this.currencyList.find(v => v.name === val)
      if (data) {
        this.rate = data.rate
      }
    },
    rowClassName (row, index) {
      return index === this.currentRow ? 'active' : ''
    },
    rowClick (row, index) {
      this.currentRow = index
    },
    addAccounting (row) {
      let accountingItem = row.accountItem.map(a => {
        return {
          type: a,
          code: null,
          name: null,
          _id: null
        }
      })
      this.$refs.accountingModal.show(accountingItem, (list) => {
        if (!list) return
        let code = list.map(m => m.code).join('_')
        let name = list.map(m => m.name).join('_')
        if (row.child.find(f => f.name === name && f.code === code)) {
          this.$Message.error('已存在该明细')
        } else {
          this.data.forEach(f => {
            if (
              f._id === row._id ||
              (
                row.parentId.includes(f._id) &&
                !f.child.find(f => f.name === name && f.code === code)
              )
            ) {
              f.child.push({
                code,
                name,
                type: list.map(m => m.type).join('_'),
                yearBorrow: null,
                yearCredit: null,
                beginningBalance: null,
                initYearBorrow: null,
                initYearCredit: null,
                initBeginningBalance: null,
                initBRate: null,
                initYBRate: null,
                initYCRate: null,
                eachBalance: null,
                eachYearBalance: null
              })
            }
          })
        }
      })
    },
    deleteAccounting (id, code, name) {
      let updateFun = (cf, id, parentId) => {
        let {
          yearBorrow,
          yearCredit,
          beginningBalance,
          initYearBorrow,
          initYearCredit,
          initBeginningBalance
        } = cf
        this.data.forEach((f, i) => {
          if (f._id === id || parentId.includes(f._id)) {
            f.yearBorrow = NP.minus(f.yearBorrow || 0, yearBorrow || 0)
            f.yearCredit = NP.minus(f.yearCredit || 0, yearCredit || 0)
            f.beginningBalance = NP.minus(f.beginningBalance || 0, beginningBalance || 0)
            f.initYearBorrow = NP.minus(f.initYearBorrow || 0, initYearBorrow || 0)
            f.initYearCredit = NP.minus(f.initYearCredit || 0, initYearCredit || 0)
            f.initBeginningBalance = NP.minus(f.initBeginningBalance || 0, initBeginningBalance || 0)
            if (parentId.includes(f._id)) {
              f.child.forEach(fcf => {
                if (fcf.code === cf.code && fcf.name === cf.name) {
                  fcf.yearBorrow = NP.minus(fcf.yearBorrow || 0, yearBorrow || 0)
                  fcf.yearCredit = NP.minus(fcf.yearCredit || 0, yearCredit || 0)
                  fcf.beginningBalance = NP.minus(fcf.beginningBalance || 0, beginningBalance || 0)
                  fcf.initYearBorrow = NP.minus(fcf.initYearBorrow || 0, initYearBorrow || 0)
                  fcf.initYearCredit = NP.minus(fcf.initYearCredit || 0, initYearCredit || 0)
                  fcf.initBeginningBalance = NP.minus(fcf.initBeginningBalance || 0, initBeginningBalance || 0)
                }
              })
            }
          }
        })
      }
      this.data.forEach((f, i) => {
        if (f._id === id) {
          f.child.forEach((cf, cfi) => {
            if (
              f.code + '_' + cf.code === code &&
              f.name + '_' + cf.name === name
            ) {
              updateFun(cf, f._id, f.parentId)
              this.data[i].child.splice(cfi, 1)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
  .input_table {
    .text {
      padding-left: 8px;
      text-align: left;
    }
    .hover_layer {
      display: none;
    }

    .ivu-table-row:hover,
    .ivu-table-row.active {
      .text {
        display: none;
      }
      .hover_layer {
        display: block;
      }
    }
  }
  .active_tb_cell {
    background-color: #ff6600 !important;
    color: #fff;
  }
</style>
