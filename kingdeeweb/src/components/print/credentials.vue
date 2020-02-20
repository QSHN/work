<template>
  <div style="padding-left: 50px;">
    <div class="c_title" style="
        width: 100%;
        font-size: 18px;
        text-align: center;">
      记账凭证
    </div>

    <div class="c_info" style="
        padding: 0 3px;
        display: flex;
        font-size: 12px;">
      <p style="width: 30%; margin-bottom: 5px;">公司名称：{{accountSet && accountSet.organization}}</p>
      <p style="flex-grow: 1; margin-bottom: 5px; text-align: center;">{{moment(printData.time).format('YYYY-MM-DD')}}</p>
      <p style="width: 30%; margin-bottom: 5px; text-align: right; position: relative;">
        凭证编号：
        {{printData.proofWords}} - {{printData.certificateNumber}}

        <span style="margin-left: 3px;">{{page + 1}} / {{total}}</span>

        <span style="position: absolute; right: 0; top: -18px;">附单据 {{printData.files}} 张</span>
      </p>
    </div>

    <div>
      <template v-if="printData.child.filter(f => f.number).length">
        <table style="width: 100%; line-height: 30px; font-size: 12px; border-collapse:collapse" cellpadding="0" cellspacing="0">
          <thead>
            <td style="border: 1px solid #ccc; border-right: none; text-align: center; width: 16%;">摘要</td>
            <td style="border: 1px solid #ccc; border-right: none; text-align: center; width: 30%;">科目</td>
            <td style="border: 1px solid #ccc; text-align: center; width: 10%;">
              <div style="border-bottom: 1px solid #ccc;">币别</div>
              <div>单位</div>
            </td>
            <td style="border: 1px solid #ccc; text-align: center; width: 10%;">
              <div style="border-bottom: 1px solid #ccc;">汇率</div>
              <div>单价</div>
            </td>
            <td style="border: 1px solid #ccc; text-align: center; width: 10%;">
              <div style="border-bottom: 1px solid #ccc;">原币金额</div>
              <div>数量</div>
            </td>
            <td style="border: 1px solid #ccc; border-right: none; text-align: center; width: 12%;">借方</td>
            <td style="border: 1px solid #ccc; text-align: center; width: 12%;">贷方</td>
          </thead>
          <tbody>
            <tr v-for="(v, i) in 5" :key="i">
              <td :style="{
                    border: '1px solid #ccc',
                    borderRight: 'none',
                    borderTop: 'none',
                    paddingLeft: '3px',
                    width: '16%',
                    height: '45px'
                }">
                <template v-if="printData.child.length > i + (page * 5)">
                  {{printData.child[i + (page * 5)].abstract}}
                </template>
                <div v-else style="opacity: 0">透明</div>
              </td>
              <td style="border: 1px solid #ccc; border-top: none; border-right: none; text-align: left; width: 30%; padding-right: 3px; line-height: 18px;">
                <template v-if="printData.child.length > i + (page * 5) && subjectList.length">
                  {{printData.child[i + (page * 5)].subjectCode}} {{getAllName(printData.child[i + (page * 5)].subjectCode)}}
                </template>
                <div v-else style="opacity: 0">透明</div>
              </td>
              <td style="border: 1px solid #ccc; text-align: center; width: 10%;">
                <div style="border-bottom: 1px solid #ccc;">
                  <template  v-if="printData.child.length > i + (page * 5) && printData.child[i + (page * 5)].currency">
                    {{printData.child[i + (page * 5)].currency}}
                  </template>
                  <div v-else style="opacity: 0">透明</div>
                </div>
                <div>
                  <template  v-if="printData.child.length > i + (page * 5) && printData.child[i + (page * 5)].unit">
                    {{printData.child[i + (page * 5)].unit}}
                  </template>
                  <div v-else style="opacity: 0">透明</div>
                </div>
              </td>
              <td style="border: 1px solid #ccc; text-align: center; width: 10%;">
                <div style="border-bottom: 1px solid #ccc;">
                  <template  v-if="printData.child.length > i + (page * 5) && printData.child[i + (page * 5)].rate">
                   {{printData.child[i + (page * 5)].rate}}
                  </template>
                  <div v-else style="opacity: 0">透明</div>
                </div>
                <div>
                  <template  v-if="printData.child.length > i + (page * 5) && printData.child[i + (page * 5)].price">
                    {{printData.child[i + (page * 5)].price}}
                  </template>
                  <div v-else style="opacity: 0">透明</div>
                </div>
              </td>
              <td style="border: 1px solid #ccc; text-align: center; width: 10%;">
                <div style="border-bottom: 1px solid #ccc;">
                  <template  v-if="printData.child.length > i + (page * 5) && printData.child[i + (page * 5)].currencyAmount">
                    {{parseFloat(printData.child[i + (page * 5)].currencyAmount) !== 0 ? formatMoney(printData.child[i + (page * 5)].currencyAmount, '', 2) : ''}}
                  </template>
                  <div v-else style="opacity: 0">透明</div>
                </div>
                <div>
                  <template  v-if="printData.child.length > i + (page * 5) && printData.child[i + (page * 5)].number">
                    {{printData.child[i + (page * 5)].number}}
                  </template>
                  <div v-else style="opacity: 0">透明</div>
                </div>
              </td>
              <td style="border: 1px solid #ccc; border-top: none; border-right: none; text-align: right; width: 12%; padding-right: 3px;">
                <template v-if="printData.child.length > i + (page * 5)">
                  {{parseFloat(printData.child[i + (page * 5)].borrower) !== 0 ? formatMoney(printData.child[i + (page * 5)].borrower, '', 2) : ''}}
                </template>
                <div v-else style="opacity: 0">透明</div>
              </td>
              <td style="border: 1px solid #ccc; border-top: none; text-align: right; width: 12%; padding-right: 3px;">
                <template v-if="printData.child.length > i + (page * 5)">
                  {{parseFloat(printData.child[i + (page * 5)].lender) !== 0 ? formatMoney(printData.child[i + (page * 5)].lender, '', 2) : ''}}
                </template>
                <div v-else style="opacity: 0">透明</div>
              </td>
            </tr>

            <tr>
              <td :style="{
                    border: '1px solid #ccc',
                    borderRight: 'none',
                    borderTop: 'none',
                    paddingLeft: '3px',
                    width: '16%'
                }">
                合计
              </td>
              <td style="border: 1px solid #ccc; border-top: none; border-right: none; text-align: left; width: 30%; padding-right: 3px;">
                {{chineseTotal}}
              </td>
              <td style="border-bottom: 1px solid #ccc; text-align: center; width: 10%;">
              </td>
              <td style="border-bottom: 1px solid #ccc; text-align: center; width: 10%;">
              </td>
              <td style="border-bottom: 1px solid #ccc; text-align: center; width: 10%;">
              </td>
              <td style="border: 1px solid #ccc; border-top: none; border-right: none; text-align: right; width: 12%; padding-right: 3px;">
                {{borrower}}
              </td>
              <td style="border: 1px solid #ccc; border-top: none; text-align: right; width: 12%; padding-right: 3px;">
                {{lender}}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-else>
        <table style="width: 100%; line-height: 30px; font-size: 12px; border-collapse:collapse" cellpadding="0" cellspacing="0">
          <thead>
          <td style="border: 1px solid #ccc; border-right: none; text-align: center; width: 20%;">摘要</td>
          <td style="border: 1px solid #ccc; border-right: none; text-align: center; width: 50%;">科目</td>
          <td style="border: 1px solid #ccc; border-right: none; text-align: center; width: 15%;">借方</td>
          <td style="border: 1px solid #ccc; text-align: center; width: 15%;">贷方</td>
          </thead>
          <tbody>
          <tr v-for="(v, i) in 5" :key="i">
            <td :style="{
                  border: '1px solid #ccc',
                  borderRight: 'none',
                  borderTop: 'none',
                  paddingLeft: '3px',
                  width: '20%',
                  height: '60px'
              }">
              <template v-if="printData.child.length > i + (page * 5)">
                {{printData.child[i + (page * 5)].abstract}}
              </template>
              <div v-else style="opacity: 0">透明</div>
            </td>
            <td style="border: 1px solid #ccc; border-top: none; border-right: none; text-align: left; width: 50%; padding-right: 3px; line-height: 18px;">
              <template v-if="printData.child.length > i + (page * 5) && subjectList.length">
                {{printData.child[i + (page * 5)].subjectCode}} {{getAllName(printData.child[i + (page * 5)].subjectCode)}}
              </template>
              <div v-else style="opacity: 0">透明</div>
            </td>
            <td style="border: 1px solid #ccc; border-top: none; border-right: none; text-align: right; width: 15%; padding-right: 3px;">
              <template v-if="printData.child.length > i + (page * 5)">
                {{parseFloat(printData.child[i + (page * 5)].borrower) !== 0 ? formatMoney(printData.child[i + (page * 5)].borrower, '', 2) : ''}}
              </template>
              <div v-else style="opacity: 0">透明</div>
            </td>
            <td style="border: 1px solid #ccc; border-top: none; text-align: right; width: 15%; padding-right: 3px;">
              <template v-if="printData.child.length > i + (page * 5)">
                {{parseFloat(printData.child[i + (page * 5)].lender) !== 0 ? formatMoney(printData.child[i + (page * 5)].lender, '', 2) : ''}}
              </template>
              <div v-else style="opacity: 0">透明</div>
            </td>
          </tr>

          <tr>
            <td :style="{
                  border: '1px solid #ccc',
                  borderRight: 'none',
                  borderTop: 'none',
                  paddingLeft: '3px',
                  width: '20%'
              }">
              合计
            </td>
            <td style="border: 1px solid #ccc; border-top: none; border-right: none; text-align: left; width: 50%; padding-right: 3px;">
              {{chineseTotal}}
            </td>
            <td style="border: 1px solid #ccc; border-top: none; border-right: none; text-align: right; width: 15%; padding-right: 3px;">
              {{borrower}}
            </td>
            <td style="border: 1px solid #ccc; border-top: none; text-align: right; width: 15%; padding-right: 3px;">
              {{lender}}
            </td>
          </tr>
          </tbody>
        </table>
      </template>
    </div>

    <div class="c_user" style="
        padding: 0 3px;
        display: flex;
        font-size: 12px;">
      <p style="width: 20%; margin: 0; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;">审核：{{getUserName(printData.audit)}}</p>
      <p style="width: 20%; margin: 0; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;">核准：{{getUserName(printData.examine)}}</p>
      <p style="width: 20%; margin: 0; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;">过账：{{getUserName(printData.post)}}</p>
      <p style="width: 20%; margin: 0; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;">出纳：{{getUserName(printData.cashier)}}</p>
      <p style="width: 20%; margin: 0; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;">制单：{{getUserName(printData.voucher)}}</p>
      <!--<p style="flex-grow: 1; margin: 0;">经办：{{printData.handle}}</p>-->
    </div>
  </div>
</template>

<script>
import { formatMoney } from 'accounting'
import NP from 'number-precision'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'credentials',
  props: {
    printData: {
      type: Object,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      required: true
    },
    subjectList: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'userList'
    ]),
    borrower () {
      let borrower = this.printData.child.reduce((total, v) => (total = NP.plus(total, v.borrower ? Number(v.borrower) : 0)), 0)
      return borrower ? this.formatMoney(borrower, '', 2) : ''
    },
    lender () {
      let lender = this.printData.child.reduce((total, v) => (total = NP.plus(total, v.lender ? Number(v.lender) : 0)), 0)
      return lender ? this.formatMoney(lender, '', 2) : ''
    },
    chineseTotal () {
      let money = this.borrower
      if (money === '') { return '' }
      // 汉字的数字
      const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
      // 基本单位
      const cnIntRadice = ['', '拾', '佰', '仟']
      // 对应整数部分扩展单位
      const cnIntUnits = ['', '万', '亿', '兆']
      // 对应小数部分单位
      const cnDecUnits = ['角', '分', '毫', '厘']
      // 整数金额时后面跟的字符
      const cnInteger = '整'
      // 整型完以后的单位
      const cnIntLast = '元'
      // 最大处理的数字
      let maxNum = 999999999999999.9999
      // 金额整数部分
      let integerNum
      // 金额小数部分
      let decimalNum
      // 输出的中文金额字符串
      let chineseStr = ''
      // 分离金额后用的数组，预定义
      let parts

      money = parseFloat(money)
      if (money >= maxNum) {
        // 超出最大处理数字
        return ''
      }
      if (money === 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger
        return chineseStr
      }
      // 转换为字符串
      money = money.toString()
      if (money.indexOf('.') === -1) {
        integerNum = money
        decimalNum = ''
      } else {
        parts = money.split('.')
        integerNum = parts[0]
        decimalNum = parts[1].substr(0, 4)
      }
      // 获取整型部分转换
      if (parseInt(integerNum, 10) > 0) {
        let zeroCount = 0
        let IntLen = integerNum.length
        for (let i = 0; i < IntLen; i++) {
          let n = integerNum.substr(i, 1)
          let p = IntLen - i - 1
          let q = p / 4
          let m = p % 4
          if (n === '0') {
            zeroCount++
          } else {
            if (zeroCount > 0) {
              chineseStr += cnNums[0]
            }
            // 归零
            zeroCount = 0
            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
          }
          if (m === 0 && zeroCount < 4) {
            chineseStr += cnIntUnits[q]
          }
        }
        chineseStr += cnIntLast
      }
      // 小数部分
      if (decimalNum !== '') {
        let decLen = decimalNum.length
        for (let i = 0; i < decLen; i++) {
          let n = decimalNum.substr(i, 1)
          if (n !== '0') {
            chineseStr += cnNums[Number(n)] + cnDecUnits[i]
          }
        }
      }
      if (chineseStr === '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger
      } else if (decimalNum === '') {
        chineseStr += cnInteger
      }
      return chineseStr
    }
  },
  methods: {
    moment,
    formatMoney,
    getFinancial (val) {
      if (val !== null) {
        let money = this.formatMoney(val).replace(/[$,.]/g, '')
        return money.split('')
      } else {
        return []
      }
    },
    getUserName (id) {
      if (!id) return ''
      let info = this.userList.find(v => v._id === id)
      return info ? info.name : ''
    },
    getAllName (code) {
      let item = this.subjectList.find(v => v.code === code)
      if (!item) return ''
      let name = ''
      if (item.parentId.length) {
        item.parentId.forEach(f => {
          name += (name ? '_' : '') + this.subjectList.find(v => v._id === f).name
        })
      }
      name = (name ? name + '_' : '') + item.name
      return name
    }
  }
}
</script>

<!--<style lang="less" scoped>-->
  <!--.c_title {-->
    <!--width: 1260px;-->
    <!--font-size: 30px;-->
    <!--text-align: center;-->
  <!--}-->

  <!--.c_info {-->
    <!--width: 1260px;-->
    <!--margin: 25px 0 15px 0;-->
    <!--display: flex;-->
    <!--font-size: 16px;-->

    <!--p {-->
      <!--flex-grow: 1;-->

      <!--&:nth-child(2) {-->
        <!--text-align: center;-->
      <!--}-->

      <!--&:nth-child(3) {-->
        <!--text-align: right;-->
      <!--}-->
    <!--}-->
  <!--}-->

  <!--.c_user {-->
    <!--width: 1260px;-->
    <!--margin: 10px 0 0 0;-->
    <!--display: flex;-->
    <!--font-size: 16px;-->

    <!--p {-->
      <!--flex-grow: 1;-->
    <!--}-->
  <!--}-->

  <!--.c_table {-->
    <!--width: 1260px;-->
    <!--border: 1px solid #ccc;-->
    <!--overflow: hidden;-->
    <!--display: table;-->
    <!--font-size: 16px;-->

    <!--.t_h,-->
    <!--.t_l,-->
    <!--.t_b {-->
      <!--height: 52px;-->
      <!--min-height: 52px;-->
      <!--border-bottom: 1px solid #ccc;-->
      <!--display: table;-->

      <!--& > div {-->
        <!--display: table-cell;-->
        <!--height: 52px;-->
        <!--text-align: center;-->
        <!--vertical-align: middle;-->
        <!--border-right: 1px solid #ccc;-->

        <!--p {-->
          <!--height: 26px;-->
          <!--line-height: 26px;-->
          <!--vertical-align: middle;-->

          <!--&:nth-child(1) {-->
            <!--border-bottom: 1px solid #ccc;-->
          <!--}-->
        <!--}-->

        <!--&.t1 {-->
          <!--width: 200px;-->
        <!--}-->
        <!--&.t2 {-->
          <!--width: 360px;-->
        <!--}-->
        <!--&.t3 {-->
          <!--width: 100px;-->
        <!--}-->
        <!--&.t4 {-->
          <!--width: 100px;-->
        <!--}-->
        <!--&.t5 {-->
          <!--width: 100px;-->
        <!--}-->
        <!--&.t6 {-->
          <!--width: 200px;-->
          <!--div { font-size: 14px; }-->
        <!--}-->
        <!--&.t7 {-->
          <!--width: 200px;-->
          <!--border-right: none;-->
          <!--div { font-size: 14px; }-->
        <!--}-->
        <!--&.t8 {-->
          <!--width: 660px;-->
        <!--}-->
      <!--}-->
    <!--}-->

    <!--.t_l {-->
      <!--.t1,-->
      <!--.t2 {-->
        <!--text-align: left;-->
        <!--/*vertical-align: top;*/-->
        <!--padding: 1px 3px;-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</style>-->
