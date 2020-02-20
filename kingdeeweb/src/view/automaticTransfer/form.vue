<template>
  <Modal
    v-model="modal"
    :title="`${type}自动转账模板`"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="1600"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :label-width="120" style="margin-top: 10px;">
      <Row type="flex" justify="space-between">
        <Col span="6">
          <FormItem label="名称">
            <Input v-model="formData.name" style="width: 200px" />
          </FormItem>
        </Col>

        <Col span="6">
          <FormItem label="机制凭证">
            <Select v-model="formData.mechanism" style="width: 200px">
              <Option v-for="(v, i) in ['否', '期末调汇', '结转损益', '自动转账']" :key="i" :value="v">{{v}}</Option>
            </Select>
          </FormItem>
        </Col>

        <Col span="6">
          <FormItem label="转账期间">
            <Select v-model="formData.period" multiple :max-tag-count="2" style="width: 200px">
              <Option v-for="(v, i) in [1,2,3,4,5,6,7,8,9,10,11,12]" :key="i" :value="v">{{v}}</Option>
            </Select>
          </FormItem>
        </Col>

        <Col span="6">
          <FormItem label="凭证字">
            <Select v-model="formData.proofWords" @on-change="selectProof" style="width: 200px">
              <Option v-for="(v, i) in wordsList" :key="i" :value="v.name">{{v.name}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <div class="c_table">
      <div class="t_h">
        <div class="tb tb_1"></div>
        <div class="tb tb2">摘要</div>
        <div class="tb tb2">科目</div>
        <div class="tb">币别</div>
        <div class="tb">汇率类型</div>
        <div class="tb">方向</div>
        <div class="tb tb2">转账方式</div>
        <div class="tb">转账比例%</div>
        <div class="tb">核算项目</div>
        <div class="tb tb2">包含本期未过账凭证</div>
        <div class="tb">公式方法</div>
        <div class="tb">公式定义</div>
        <div class="tb tb2">不参与多栏账汇总</div>
      </div>
      <ul class="t_m">
        <li v-for="(v, i) in formData.child" :key="i">
          <div class="tb tb_1">
            <div class="add" @click="updateFormData('add', i)"><Icon type="md-add-circle" /></div>
            <div class="delete" @click="updateFormData('delete', i)"><Icon type="md-close-circle" /></div>
          </div>
          <div class="tb tb2">
            <Input v-model="v.abstract"></Input>
          </div>
          <div class="tb tb2" @click="selectSubject(i)">
            <template v-if="v.subjectCode">
              {{v.subjectCode + ' — ' +v.subject}}
            </template>
          </div>
          <div class="tb">{{v.subjectCode ? v.currency : ''}}</div>
          <div class="tb">
            <template v-if="v.subjectCode">
              <Select v-model="v.rateType">
                <Option v-for="(item, itemIndex) in rateTypeList" :value="item.name" :key="itemIndex">{{item.name}}</Option>
              </Select>
            </template>
          </div>
          <div class="tb">{{v.subjectCode ? '自动判定' : ''}}</div>
          <div class="tb tb2">
            <template v-if="v.subjectCode">
              <Select v-model="v.mode">
                <Option v-for="(item, itemIndex) in ['转入', '按比例转出余额', '按比例转出借方发生额', '按比例转出贷方发生额']" :value="item" :key="itemIndex">{{item}}</Option>
              </Select>
            </template>
          </div>
          <div class="tb">{{v.subjectCode ? '100%' : ''}}</div>
          <div class="tb">
            <template v-for="(item, itemIndex) in v.accountingItem">
              {{item.type}}：{{item.name}}{{itemIndex > 0 ? '/' : ''}}
            </template>
            <template v-if="v.accountingItem && v.accountingItem.length === 0 && v.subjectCode">无</template>
          </div>
          <div class="tb tb2">
            <Checkbox v-model="v.isPost" v-if="v.subjectCode"></Checkbox>
          </div>
          <div class="tb">{{v.subjectCode ? '无' : ''}}</div>
          <div class="tb">{{v.subjectCode ? '无' : ''}}</div>
          <div class="tb tb2"></div>
        </li>
      </ul>
    </div>

    <subject ref="subject" :isReturnObj="true" :isLimitAccounting="true" />
    <accountingModal ref="accountingModal" />

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import subject from '../../components/subject/index'
import accountingModal from '../credentials/accounting'
import { updateTemplate } from '../../api/automaticTransfer'
export default {
  name: 'index',
  components: {
    subject,
    accountingModal
  },
  props: {
    currencyList: {
      type: Array,
      required: true
    },
    wordsList: {
      type: Array,
      required: true
    },
    rateTypeList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      type: '新增',
      formData: {
        accountSetId: null
      },
      childObj: {
        abstract: '',
        subjectCode: '',
        subject: '',
        currency: null,
        rateType: null,
        mode: null,
        isPost: false,
        accountingItem: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ])
  },
  methods: {
    selectProof (val) {
      let data = this.wordsList.find(v => v.name === val)
      if (data) {
        this.formData.proofWordId = data._id
      }
    },
    show (type, formData) {
      this.modal = true
      this.type = type
      let defaultProof = this.wordsList.find(v => v.defaultValue === '是') || (this.wordsList.length ? this.wordsList[0] : null)
      this.formData = formData ? Object.assign({}, formData) : {
        accountSetId: this.accountSet._id,
        name: '',
        mechanism: '否',
        period: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        proofWords: defaultProof ? defaultProof.name : null,
        proofWordId: defaultProof ? defaultProof._id : null,
        child: [Object.assign({}, this.childObj), Object.assign({}, this.childObj)]
      }
    },
    cancel () {
      this.modal = false
    },
    selectSubject (index) {
      this.$refs.subject.show(obj => {
        let currency = obj.currency === '所有币别' || obj.currency === '不核算' ? '人民币' : obj.currency
        let cData = this.formData.child[index]
        cData.subjectCode = obj.code
        cData.subject = obj.name
        cData.currency = currency
        cData.rateType = '公司汇率'
        cData.mode = '转入'
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
            cData.accountingItem = list
            this.$forceUpdate()
          })
        }
      })
    },
    updateFormData (type, index) {
      if (type === 'add') {
        this.formData.child.splice(index, 0, Object.assign({}, this.childObj))
      } else {
        if (this.formData.child.length === 2) {
          this.$Notice.error({
            title: '自动转账模板',
            desc: '至少两条凭证内容'
          })
        } else {
          this.formData.child.splice(index, 1)
        }
      }
    },
    errorFun (err) {
      this.$Notice.error({
        title: '自动转账模板',
        desc: err
      })
    },
    sure () {
      if (!this.formData.name) {
        this.errorFun('名称必填')
      } else if (!this.formData.mechanism) {
        this.errorFun('机制凭证必填')
      } else if (!this.formData.period.length) {
        this.errorFun('转账期间必填')
      } else if (!this.formData.proofWords) {
        this.errorFun('凭证字必填')
      } else {
        let bNumber = 0
        let lNUmber = 0
        for (let i = 0; i < this.formData.child.length; i++) {
          let item = this.formData.child[i]
          if (!item.abstract && i === 0) {
            this.errorFun('第一条摘要必填')
            return
          }
          if (!item.subjectCode) {
            this.errorFun('科目必填')
            return
          }
          if (item.mode === '转入') {
            bNumber++
          } else {
            lNUmber++
          }
        }

        if (bNumber === 0) {
          this.errorFun('必须要有一条转入的转账方式，无法自动转账')
          return
        }
        if (lNUmber === 0) {
          this.errorFun('至少要有一条转出的转账方式，无法自动转账')
          return
        }

        updateTemplate(this.formData).then(res => {
          this.$emit('load')
          this.cancel()
        }).catch(err => {
          this.$Notice.error({
            title: '自动转账模板',
            desc: err.message
          })
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.c_table {
  height: 500px;
  border: 1px solid #dcdee2;
  overflow: auto;

  .tb {
    width: 100px;
    display: table-cell;
    border-left: 1px solid #dcdee2;
    font-size: 14px;
  }
  .tb2 { width: 200px; }
  .tb_1 {
    position: relative;
    width: 20px;
    border: none;

    .add,
    .delete {
      position: absolute;
      left: 0;
      width: 100%;
      height: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: #4d8afa;
      }
    }
    .delete {
      top: 50%;
    }
  }

  .t_h {
    position: relative;
    width: 1720px;
    height: 37px;
    line-height: 36px;
    background: #f8f8f9;
    text-align: center;
    border-bottom: 1px solid #dcdee2;
  }

  .t_m {
    width: 1720px;
    list-style: none;
    padding: 0;

    & > li {
      width: 100%;
      cursor: pointer;
      border-bottom: 1px solid #dcdee2;

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
