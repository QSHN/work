<template>
  <Card shadow style="height: 100%; overflow:auto;" class="mu_card">
    <Row type="flex" justify="space-between">
      <Button type="success" style="margin: 0 10px 10px 0;" @click="setTemplate('add', '新增')">新增转账模板</Button>
    </Row>

    <div class="mu_c">
      <Table ref="userTable" :columns="columns" :data="templateList" border style="width: 100%">
        <template slot-scope="{ row }" slot="period">
          <div>{{getPeriod(row.period)}}</div>
        </template>

        <template slot-scope="{ row }" slot="lastMode">
          <div>{{row.lastMode}}</div>
        </template>

        <template slot-scope="{ row }" slot="lastTime">
          <div>{{row.lastTime && moment(row.lastTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
        </template>

        <template slot-scope="{ row }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="setTemplate('edit', row, '修改')">修改</Button>
          <Button type="success" size="small" @click="setTemplate('post', row, '转账')">转账</Button>
        </template>
      </Table>
    </div>

    <autoTemplate ref="autoTemplate" :currencyList="currencyList" :wordsList="wordsList" :rateTypeList="rateTypeList" @load="load" />
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import autoTemplate from './form'
import { currencyQuery } from '../../api/currency'
import { queryProofWords } from '../../api/proofWords'
import { queryExchangeRateType } from '../../api/exchangeRate'
import { queryTemplate } from '../../api/automaticTransfer'
import { automaticTransfer } from '../../api/credentials'
import moment from 'moment'
export default {
  name: 'automaticTransferIndex',
  components: {
    autoTemplate
  },
  data () {
    return {
      columns: [
        {
          title: '期间',
          slot: 'period'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '最近一次转账方式',
          slot: 'lastMode'
        },
        {
          title: '最近一次转时间',
          slot: 'lastTime'
        },
        {
          title: '操作',
          slot: 'action',
          width: 130,
          align: 'center'
        }
      ],
      templateList: [],
      currencyList: [],
      wordsList: [],
      rateTypeList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList'
    ])
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.load()
          this.loadCurrency()
          this.loadProof()
          this.loadRateType()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '自动转账') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有自动转账-${action}的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    load () {
      queryTemplate({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('queryTemplate', res.data)
        this.templateList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '自动转账',
          desc: err.message
        })
      })
    },
    setTemplate (type, item, title) {
      if (!this.judge(title)) return
      switch (type) {
        case 'add':
          this.$refs.autoTemplate.show('新建', null)
          break
        case 'edit':
          this.$refs.autoTemplate.show('修改', item)
          break
        case 'post':
          this.$Modal.confirm({
            title: '自动转账',
            content: `确定是否按照${item.name}模板自动转账`,
            onOk: () => {
              automaticTransfer(item).then(res => {
                setTimeout(() => {
                  this.$Modal.success({
                    title: '自动转账',
                    content: `<p>已经生成一张自动转账凭证，</p><p>凭证字号为：${res.data}</p>`
                  })
                }, 500)
                this.load()
              }).catch(err => {
                this.$Notice.error({
                  title: '自动转账',
                  desc: err.message
                })
              })
            }
          })
          break
      }
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
    },
    loadProof () {
      queryProofWords({ accountSetId: this.accountSet._id }).then(res => {
        this.wordsList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '凭证字',
          desc: err.message
        })
      })
    },
    getPeriod (period) {
      let val = 1
      let lastVal = 1
      let last = ''
      period.forEach((v, i) => {
        lastVal = period[i - 1]
        if (i === 0) {
          val = v
        } else if (i === period.length - 1) {
          if (v - lastVal !== 1) {
            val += ' - ' + lastVal + '，' + v
          } else {
            if (last !== lastVal.toString()) {
              val += ' - ' + v
            }
          }
        } else {
          if (last === '，') {
            val += v
            last = v
          } else {
            if (v - lastVal !== 1) {
              if (last.toString() === lastVal.toString()) {
                val += '，' + v
                last = v
              } else {
                val += ' - ' + lastVal + '，' + v
                last = v
              }
            }
          }
        }
      })
      return val
    }
  }
}
</script>

<style lang="less" scoped>
  .temP {
    width: 100%;
    height: 18px !important;
    line-height: 18px;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: normal;
    overflow: hidden;
    display: block;
  }
</style>
