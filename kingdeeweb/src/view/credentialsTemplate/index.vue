<template>
  <Card shadow style="height: 100%; overflow:auto;" class="mu_card">
    <Row type="flex">
      <Button type="success" style="margin: 0 10px 10px 0;" @click="setTemplate('add', null, '新增')">新增模式凭证</Button>
      <Button style="margin: 0 10px 10px 0;" @click="load">刷新</Button>
    </Row>

    <div class="mu_c">
      <Table ref="userTable" :columns="columns" :data="templateList" border style="width: 100%">
        <template slot-scope="{ row }" slot="index">
          <p class="temP" v-for="(v, i) in row.child" :key="i">{{i + 1}}</p>
        </template>

        <template slot-scope="{ row }" slot="abstract">
          <p class="temP" v-for="(v, i) in row.child" :key="i">{{v.abstract}}</p>
        </template>

        <template slot-scope="{ row }" slot="subjectCode">
          <p class="temP" v-for="(v, i) in row.child" :key="i" style="text-align: left">{{v.subjectCode}}</p>
        </template>

        <template slot-scope="{ row }" slot="subject">
          <p class="temP" v-for="(v, i) in row.child" :key="i" style="text-align: left">{{v.subject}}</p>
        </template>

        <template slot-scope="{ row }" slot="currency">
          <p class="temP" v-for="(v, i) in row.child" :key="i" style="text-align: left">{{v.currency}}</p>
        </template>

        <template slot-scope="{ row }" slot="currencyAmount">
          <p class="temP" v-for="(v, i) in row.child" :key="i" style="text-align: right">
            {{v.currencyAmount && currencyList.length ? formatMoney(v.currencyAmount, '', currencyList.find(c => c.name === v.currency).float) : ''}}
          </p>
        </template>

        <template slot-scope="{ row }" slot="borrower">
          <p class="temP" v-for="(v, i) in row.child" :key="i" style="text-align: right">
            {{formatMoney(v.borrower || 0, '', 2)}}
          </p>
        </template>

        <template slot-scope="{ row }" slot="lender">
          <p class="temP" v-for="(v, i) in row.child" :key="i" style="text-align: right">
            {{formatMoney(v.lender || 0, '', 2)}}
          </p>
        </template>

        <template slot-scope="{ row }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="setTemplate('edit', row, '修改')">修改</Button>
          <Button type="error" size="small" @click="setTemplate('delete', row, '删除')">删除</Button>
        </template>
      </Table>
    </div>

    <voucherTemplate ref="voucherTemplate" :currencyList="currencyList" @load="load" />
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import voucherTemplate from './form'
import { formatMoney } from 'accounting'
import { currencyQuery } from '../../api/currency'
import {
  queryCredentialsTemplate,
  deleteCredentialsTemplate
} from '../../api/credentialsTemplate'
export default {
  name: 'voucherTemplateIndex',
  components: {
    voucherTemplate
  },
  data () {
    return {
      columns: [
        {
          title: '名称',
          key: 'name',
          width: 100
        },
        {
          title: '分录号',
          slot: 'index',
          width: 80
        },
        {
          title: '摘要',
          slot: 'abstract',
          align: 'center'
        },
        {
          title: '科目编码',
          slot: 'subjectCode',
          align: 'center'
        },
        {
          title: '科目名称',
          slot: 'subject',
          align: 'center'
        },
        {
          title: '币别',
          slot: 'currency',
          align: 'center'
        },
        {
          title: '原币金额',
          slot: 'currencyAmount',
          align: 'center'
        },
        {
          title: '借方',
          slot: 'borrower',
          align: 'center'
        },
        {
          title: '贷方',
          slot: 'lender',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 130,
          align: 'center'
        }
      ],
      templateList: [],
      currencyList: []
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
    load () {
      queryCredentialsTemplate({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('queryCredentialsTemplate', res.data)
        this.templateList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '模式凭证',
          desc: err.message
        })
      })
    },
    setTemplate (type, item, title) {
      if (!this.judge(title)) return
      let formData = item ? Object.assign({}, item) : {
        accountSetId: this.accountSet._id
      }
      switch (type) {
        case 'add':
          this.$refs.voucherTemplate.show('新建', null, this.templateList, formData)
          break
        case 'edit':
          this.$refs.voucherTemplate.show('修改', formData, this.templateList)
          break
        case 'delete':
          this.$Modal.confirm({
            title: '删除模式凭证',
            content: `是否删除模式凭证：${item.name}`,
            onOk: () => {
              deleteCredentialsTemplate({
                id: item._id
              }).then(res => {
                this.$Notice.success({
                  title: '模式凭证',
                  desc: `成功删除模式凭证：${item.name}`
                })
                this.load()
              }).catch(err => {
                this.$Notice.error({
                  title: '模式凭证',
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
