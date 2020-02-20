<template>
  <Modal
    v-model="modal"
    title="试算借贷平衡"
    :mask-closable="false"
    width="700"
    @on-cancel="cancel">
    <Table :columns="columns" :data="data" border  style="width: 100%">
      <template slot-scope="{ row }" slot="borrow">
        <div style="text-align: right">{{row.borrow}}</div>
      </template>
      <template slot-scope="{ row }" slot="lender">
        <div style="text-align: right">{{row.lender}}</div>
      </template>
      <template slot-scope="{ row }" slot="difference">
        <div style="text-align: right">{{row.difference}}</div>
      </template>
    </Table>

    <div slot="footer" style="display: flex; justify-content: space-between;">
      <p :style="{color: trialResult ? 'black' : 'red', lineHeight: '32px'}">试算结果{{trialResult ? '平衡' : '不平衡'}}</p>
      <Button type="text" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { querySubject } from '../../api/subject'
import NP from 'number-precision'
import { formatMoney } from 'accounting'
import { queryCashFlowTable } from '../../api/cashFlowTable'
export default {
  name: 'theTrial',
  props: ['subjectData'],
  data () {
    return {
      modal: false,
      data: [],
      columns: [
        {
          title: '试算项',
          align: 'center',
          key: 'theTrial'
        },
        {
          title: '借方',
          align: 'center',
          slot: 'borrow'
        },
        {
          title: '贷方',
          align: 'center',
          slot: 'lender'
        },
        {
          title: '差额',
          align: 'center',
          slot: 'difference'
        }
      ],
      trialResult: true
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ])
  },
  methods: {
    show () {
      this.loadSubject(null)
      this.modal = true
    },
    cancel () {
      this.modal = false
    },
    loadSubject (cb) {
      let success = (list) => {
        let yearBorrow = list.reduce((total, v) => (NP.plus(total, v.parentId.length === 0 ? v.yearBorrow || 0 : 0)), 0)
        let yearCredit = list.reduce((total, v) => (NP.plus(total, v.parentId.length === 0 ? v.yearCredit || 0 : 0)), 0)
        let borrow = list.reduce((total, v) => (NP.plus(total, (v.balance === '借方' && v.parentId.length === 0 ? v.beginningBalance || 0 : 0))), 0)
        let lender = list.reduce((total, v) => (NP.plus(total, (v.balance === '贷方' && v.parentId.length === 0 ? v.beginningBalance || 0 : 0))), 0)
        this.data = [
          {
            theTrial: '期初余额',
            borrow: formatMoney(borrow || 0, '', 2),
            lender: formatMoney(lender || 0, '', 2),
            difference: formatMoney(NP.minus(borrow, lender), '', 2)
          },
          {
            theTrial: '本年累计',
            borrow: formatMoney(yearBorrow || 0, '', 2),
            lender: formatMoney(yearCredit || 0, '', 2),
            difference: formatMoney(NP.minus(yearBorrow, yearCredit), '', 2)
          }
        ]
        this.trialResult = yearBorrow === yearCredit && borrow === lender
        if (cb) {
          if (yearBorrow !== yearCredit || borrow !== lender) {
            this.$Notice.error({
              title: '科目',
              desc: '科目借贷不平衡，无法结束初始化'
            })
            this.modal = true
          } else {
            queryCashFlowTable({ accountSetId: this.accountSet._id }).then(res => {
              let cashFlowTable = res.data.table
              let m1 = cashFlowTable.find(v => v.index === 10).money || 0
              let m2 = cashFlowTable.find(v => v.index === 52).money || 0
              let m3 = cashFlowTable.find(v => v.index === 35).money || 0
              let m4 = cashFlowTable.find(v => v.index === 60).money || 0
              if (m1 !== m2) {
                this.$Notice.error({
                  title: '现金流量初始余额数据效验不通过',
                  desc: '主表“经营活动产生的现金流量净额” != 附表“经营活动产生的现金流量净额”'
                })
              } else if (m3 !== m4) {
                this.$Notice.error({
                  title: '现金流量初始余额数据效验不通过',
                  desc: '主表“现金及现金等价物的净增加额” != 附表“现金及现金等价物的净增加额”'
                })
              } else {
                cb()
              }
            }).catch(err => {
              this.$Notice.error({
                title: '现金流量表',
                desc: err.message
              })
            })
          }
        }
      }
      if (this.subjectData) {
        success(this.subjectData)
      } else {
        querySubject({ accountSetId: this.accountSet._id }).then(res => {
          success(res.data)
        }).catch(err => {
          this.$Notice.error({
            title: '科目',
            desc: err.message
          })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
