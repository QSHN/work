<template>
  <Modal
    v-model="modal"
    :title="`${type}模式凭证`"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="1600"
    @on-cancel="cancel">
    <div>
      <Button style="margin: 0 10px 10px 0;" @click="$emit('loadTemp')">刷新</Button>
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
          <Button type="primary" size="small" v-if="type === '保存'" @click="save(row._id, row.name)">覆盖</Button>
          <Button type="success" size="small" v-else @click="selectFun(row.child)">选择</Button>
        </template>
      </Table>
    </div>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="save(null, null)" v-if="type === '保存'">另存为新模板</Button>
      <Button type="success" @click="addTemp" v-else>新增模板</Button>
    </div>

    <voucherTemplate ref="voucherTemplate" :currencyList="currencyList" @load="$emit('loadTemp')" />
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatMoney } from 'accounting'
import { updateCredentialsTemplate } from '../../api/credentialsTemplate'
import voucherTemplate from '../credentialsTemplate/form'
export default {
  name: 'index',
  components: { voucherTemplate },
  props: {
    templateList: {
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
      modal: false,
      type: '',
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
          width: 100,
          align: 'center'
        }
      ],
      newData: {}
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ])
  },
  methods: {
    formatMoney,
    cancel () {
      this.modal = false
      this.type = ''
      this.newData = []
    },
    show (type, newData) {
      this.modal = true
      this.type = type
      this.newData = newData
    },
    save (id, name) {
      let data = Object.assign({}, this.newData)
      if (id) {
        data._id = id
        data.name = name
      } else {
        data.name = ''
      }
      let update = () => {
        updateCredentialsTemplate(data).then(res => {
          this.$Notice.success({
            title: '模式凭证',
            desc: '成功保存模式凭证:' + data.name
          })
          this.$emit('loadTemp')
          this.cancel()
        }).catch(err => {
          this.$Notice.error({
            title: '模式凭证',
            desc: err.message
          })
        })
      }
      if (!data.name) {
        this.$Modal.confirm({
          title: `新增模式凭证`,
          render: (h) => {
            return h('div', [
              h('Input', {
                props: {
                  value: data.name,
                  autofocus: true,
                  placeholder: '输入模式凭证名称'
                },
                style: {
                  marginTop: '10px'
                },
                on: {
                  input: (val) => {
                    data.name = val
                  }
                }
              })
            ])
          },
          onOk: () => {
            if (data.name.length) {
              if (this.templateList.filter(v => v.name === data.name).length) {
                this.$Notice.error({
                  title: `新增模式凭证`,
                  desc: '已存在该模式凭证'
                })
              } else {
                update()
              }
            } else {
              this.$Notice.error({
                title: `新增模式凭证`,
                desc: '模式凭证名称必填'
              })
            }
          }
        })
      } else {
        update()
      }
    },
    selectFun (list) {
      this.$emit('selectTemp', JSON.parse(JSON.stringify(list)))
      this.cancel()
    },
    addTemp () {
      this.$refs.voucherTemplate.show('新建', null, this.templateList, { accountSetId: this.accountSet._id })
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
