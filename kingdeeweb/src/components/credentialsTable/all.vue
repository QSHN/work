<template>
  <div class="c_table">
    <div class="t_h">
      <div class="tb">日期</div>
      <div class="tb">会计期间</div>
      <div class="tb">凭证字号</div>
      <div class="tb">分录号</div>
      <div class="tb tb2">摘要</div>
      <div class="tb">科目编码</div>
      <div class="tb tb4">科目名称</div>
      <div class="tb">币别</div>
      <div class="tb">原币金额</div>
      <div class="tb">借方</div>
      <div class="tb">贷方</div>
      <div class="tb">制单</div>
      <div class="tb">审核</div>
      <div class="tb">过账</div>
      <div class="tb">核准</div>
      <div class="tb">出纳</div>
      <div class="tb">经办</div>
      <div class="tb">批注</div>
      <div class="tb">结算方式</div>
      <div class="tb">结算号</div>
      <div class="tb">数量</div>
      <div class="tb">单价</div>
      <div class="tb">参考信息</div>
      <div class="tb">业务日期</div>
      <div class="tb">往来业务</div>
      <div class="tb">附件数</div>
      <div class="tb">序号</div>
      <div class="tb">系统模块</div>
      <div class="tb">业务描述</div>
    </div>

    <div class="t_c">
      <ul v-for="(v, i) in tableData" :key="i" :style="{background: v.post ? '#afd5fc' : v.invalid ? '#fcafaf' : '#fff'}">
        <li v-for="(v1, i1) in v.child" :key="i1"  @click="which = [i, i1]" @dblclick="goDetail(v._id)" :class="{active: i === which[0] && i1 === which[1]}">
          <div class="tb">{{i1 !== 0 ? '' : moment(v.time).format('YYYY-MM-DD')}}</div>
          <div class="tb">{{i1 !== 0 ? '' : v.accountingPeriod}}</div>
          <div class="tb">{{i1 !== 0 ? '' : v.proofWords + ' - ' + v.certificateNumber}}</div>
          <div class="tb">{{i1 + 1}} </div>
          <div class="tb tb2" style="text-align: center">{{v1.abstract}}</div>
          <div class="tb">{{v1.subjectCode }}</div>
          <div class="tb tb4">
            {{v1.subject}}
            <template v-for="(item) in v1.accountingItem">
              / {{item.type}}：{{item.name}}（{{item.code}}）
            </template>
          </div>
          <div class="tb">{{v1.currency}}</div>
          <div class="tb" style="text-align: right;">{{v1.currencyAmount && currencyList.length ? formatMoney(v1.currencyAmount, '', currencyList.find(c => c.name === v1.currency).float) : ''}}</div>
          <div class="tb" style="text-align: right;">{{formatMoney(v1.borrower || 0, '', 2)}}</div>
          <div class="tb" style="text-align: right;">{{formatMoney(v1.lender || 0, '', 2)}}</div>
          <div class="tb">{{i1 !== 0 ? '' : getUserName(v.voucher)}}</div>
          <div class="tb">{{i1 !== 0 ? '' : getUserName(v.audit)}}</div>
          <div class="tb">{{i1 !== 0 ? '' : getUserName(v.post)}}</div>
          <div class="tb">{{i1 !== 0 ? '' : getUserName(v.examine)}}</div>
          <div class="tb">{{i1 !== 0 ? '' : getUserName(v.cashier)}}</div>
          <div class="tb">{{i1 !== 0 ? '' : v.handle}}</div>
          <div class="tb">{{i1 !== 0 ? '' : v.des}}</div>
          <div class="tb">{{i1 !== 0 ? '' : v.paymentMode}}</div>
          <div class="tb">{{i1 !== 0 ? '' : v.paymentNo}}</div>
          <div class="tb" style="text-align: right;">{{v1.number || 0}}</div>
          <div class="tb" style="text-align: right;">{{v1.price || 0}} </div>
          <div class="tb">{{i1 !== 0 ? '' : v.referenceInfo}}</div>
          <div class="tb">{{i1 !== 0 ? '' : moment(v.businessDate).format('YYYY-MM-DD')}}</div>
          <div class="tb">{{1 !== 0 ? '' : v.currentBusiness}}</div>
          <div class="tb">{{i1 !== 0 ? '' : v.files || 0}}</div>
          <div class="tb">{{i1 !== 0 ? '' : v.serialNumber}}</div>
          <div class="tb">{{i1 !== 0 ? '' : v.systemModule}}</div>
          <div class="tb">{{i1 !== 0 ? '' : v.description}}</div>
        </li>
      </ul>

      <ul style="background: #fdf2bd">
        <li >
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb tb2" style="text-align: center">合计</div>
          <div class="tb"></div>
          <div class="tb tb4"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb" style="text-align: right;">{{getBorrower}}</div>
          <div class="tb" style="text-align: right;">{{getLender}}</div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
          <div class="tb"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { formatMoney } from 'accounting'
import NP from 'number-precision'
export default {
  name: 'all',
  props: {
    tableData: {
      type: Array,
      required: true
    },
    currencyList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      which: [-1, -1]
    }
  },
  computed: {
    ...mapGetters([
      'userList'
    ]),
    getBorrower () {
      let borrower = this.tableData.reduce((total, v) => (
        total = NP.plus(total, v.child.reduce((t, c) => (
          t = NP.plus(t, Number(c.borrower || 0))
        ), 0))
      ), 0)
      return this.formatMoney(borrower || 0, '', 2)
    },
    getLender () {
      let lender = this.tableData.reduce((total, v) => (
        total = NP.plus(total, v.child.reduce((t, c) => (
          t = NP.plus(t, Number(c.lender || 0))
        ), 0))
      ), 0)
      return this.formatMoney(lender || 0, '', 2)
    }
  },
  methods: {
    formatMoney,
    moment,
    getUserName (id) {
      if (!id) return ''
      let info = this.userList.find(v => v._id === id)
      return info ? info.name : ''
    },
    goDetail (id) {
      this.$router.push({
        name: 'voucherInputIndex',
        query: {
          id,
          type: 'look'
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.c_table {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  border: 1px solid #dcdee2;

  .tb {
    width: 100px;
    display: table-cell;
    border-left: 1px solid #dcdee2;
    font-size: 14px;
  }
  .tb2 {
    width: 200px;
  }
  .tb4 {
    width: 400px;
  }

  .t_h {
    position: relative;
    width: 3302px;
    height: 37px;
    line-height: 36px;
    background: #f8f8f9;
    text-align: center;
    border-bottom: 1px solid #dcdee2;
  }

  .t_c {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .t_h, li {
    .tb:nth-child(1) {
      border: none;
    }
  }

  ul {
    width: 3302px;
    list-style: none;
    border-bottom: 1px solid #dcdee2;
    padding: 0;

    li {
      width: 100%;
      cursor: pointer;

      &.active {
        background: #000;
        color: #fff;
      }

      .tb {
        font-size: 12px;
        padding: 3px 5px;
      }
    }
  }
}
</style>
