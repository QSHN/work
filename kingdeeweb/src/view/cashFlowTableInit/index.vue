<template>
  <Card shadow style="height: 100%; overflow:hidden;" class="mu_card">
    <div style="height: 100%; display: flex; flex-direction: column; width: 1000px;">
      <Row type="flex"  justify="space-between" style="margin-bottom: 15px;">
        <div>现金流量初始余额录入</div>
        <div>
          <span style="margin-left: 100px;">币别：{{currency}}</span>
          <span style="margin-left: 20px;">汇率：1</span>
          <span style="margin-left: 20px; margin-right: 5px;">记账本位币</span>
          <Button type="success" style="margin-left: 20px;" @click="save" v-if="accountSet && !accountSet.generalLedger">保存数据</Button>
        </div>
      </Row>

      <div style="flex-grow: 1" ref="cashFlowTable">
        <Table  :columns="columns" :data="cashFlowTable" border :height="$refs.cashFlowTable ? $refs.cashFlowTable.offsetHeight : 500" style="width: 100%">
          <template slot-scope="{ row }" slot="title">
            <div :style="{'text-align': 'left', 'padding-left': row.isParent ? 0 : '23px'}">{{row.title}}</div>
          </template>
          <template slot-scope="{ row }" slot="money">
            <template v-if="accountSet && !accountSet.generalLedger">
              <template v-if="row.isParent || row.add || row.minus">
                <div style="text-align: left; padding-left: 8px;">
                  {{ getValue(row)}}
                </div>
              </template>
              <template v-else>
                <InputNumber v-model="row.money"
                             :min="0"
                             :step="0.1"
                             @on-blur="changeMoney(row)"
                             style="width: 100%" />
              </template>
            </template>
            <div v-else :style="{'text-align': 'center', color: row.add || row.minus ? '#5cadff' : '#000'}">
              {{row.money ? row.money.toFixed(2) : ''}}
            </div>
          </template>
        </Table>
      </div>
    </div>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryCashFlowTable, updateCashFlowTable } from '../../api/cashFlowTable'
export default {
  name: 'index',
  data () {
    return {
      currency: {},
      cashFlowTable: [],
      columns: [
        {
          title: '项目',
          align: 'center',
          slot: 'title'
        },
        {
          title: '行次',
          align: 'center',
          key: 'index',
          width: 100
        },
        {
          title: '金额',
          align: 'center',
          slot: 'money',
          width: 300
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission'
    ])
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.currency = this.accountSet.unit
          this.loadCashFlowTable()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '现金流量初始数据') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}现金流量初始数据的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadCashFlowTable () {
      queryCashFlowTable({ accountSetId: this.accountSet._id }).then(res => {
        this.cashFlowTable = res.data.table
      }).catch(err => {
        this.$Notice.error({
          title: '现金流量表',
          desc: err.message
        })
      })
    },
    save () {
      if (!this.judge('修改')) return
      this.$Modal.confirm({
        title: '现金流量初始余额录入',
        content: `请确定是否保存本次录入的数据`,
        onOk: () => {
          updateCashFlowTable({
            accountSetId: this.accountSet._id,
            table: this.cashFlowTable
          }).then(res => {
            this.$Notice.success({
              title: '现金流量初始余额录入',
              desc: `本次录入的数据保存成功`
            })
          }).catch(err => {
            this.$Notice.error({
              title: '现金流量初始余额录入',
              desc: err.message
            })
          })
        }
      })
    },
    getValue (row) {
      let value = 0
      if (row.add) {
        value = row.add.reduce((total, v) => (total += (this.cashFlowTable.find(c => c.index === v).money || 0)), value)
      }
      if (row.minus) {
        value = row.minus.reduce((total, v) => (total -= (this.cashFlowTable.find(c => c.index === v).money || 0)), value)
      }
      row.money = value
      if (row.add || row.minus) this.changeMoney(row)
      return value !== 0 ? value.toFixed(2) : ''
    },
    changeMoney (row) {
      this.cashFlowTable.forEach(v => {
        if (v.index === row.index) v.money = row.money
      })
    }
  }
}
</script>

<style lang="less">
  .mu_card  .ivu-card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
