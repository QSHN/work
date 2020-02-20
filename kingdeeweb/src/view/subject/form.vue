<template>
  <Modal
    v-model="modal"
    :title="`${type}${subject.find(f => f._id === this.whichType).name}类科目`"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="700"
    height="1200"
    @on-cancel="cancel">
    <Tabs type="card" v-model="step">
      <TabPane label="科目设置">
        <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
          <FormItem label="科目编码" prop="code">
            <Input v-model="formData.code" style="width: 420px" :disabled="!!formData._id"/>
          </FormItem>

          <FormItem label="科目名称" prop="name">
            <Input v-model="formData.name" style="width: 420px" />
          </FormItem>

          <FormItem label="上级科目">
            <Input disabled style="width: 420px" :value="getSuperiorSub.name || '无上级科目'" />
          </FormItem>

          <Row>
            <Col span="13">
              <FormItem label="科目类别" prop="typeId">
                <Select v-model="formData.typeId" style="width: 200px" @on-change="selectType"  :disabled="!!(formData.parentId && formData.parentId.length > 0 || formData._id)">
                  <Option v-for="(v, i) in gList" :key="i" :value="v._id">{{ v.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="11">
              <span style="margin: 0 5px 0 10px;">余额方向</span>
              <Select v-model="formData.balance" style="width: 115px" :disabled="!!(formData.parentId && formData.parentId.length > 0 || formData._id)">
                <Option v-for="(v, i) in balanceList" :key="i" :value="v">{{v}}</Option>
              </Select>
            </Col>
          </Row>

          <Row>
            <Col span="13">
              <FormItem label="外币核算">
                <Select v-model="formData.currency" style="width: 200px">
                  <Option v-for="(v, i) in currencyList" :key="i" :value="v">{{v}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="11" style="line-height: 32px;">
              <Checkbox style="margin: 0 5px 0 10px;" v-model="formData.finalTuning" :disabled="formData.currency === '不核算'">期末调汇</Checkbox>
            </Col>
          </Row>

          <Row style="line-height: 32px;">
            <Col span="13">
              <Checkbox style="margin: 0 5px 0 120px; display: block;" v-model="formData.currentAccount" :disabled="!formData.isCA">往来业务核算</Checkbox>
              <Checkbox style="margin: 0 5px 0 120px; display: block;" v-model="formData.numberUnit" :disabled="!formData.isNU">数量金额辅助核算</Checkbox>
              <Checkbox style="margin: 0 5px 0 120px; display: block;" v-model="formData.cashAccount" :disabled="formData.parentId && formData.parentId.length > 0">现金科目</Checkbox>
              <Checkbox style="margin: 0 5px 0 120px; display: block;" v-model="formData.subjectBank" :disabled="formData.parentId && formData.parentId.length > 0">银行科目</Checkbox>
              <Checkbox style="margin: 0 5px 0 120px; display: block;" v-model="formData.journal" :disabled="formData.parentId && formData.parentId.length > 0">出日记账</Checkbox>
              <Checkbox style="margin: 0 5px 0 120px; display: block;" v-model="formData.cashEquivalents" :disabled="formData.parentId && formData.parentId.length > 0">现金等价物</Checkbox>
              <Checkbox style="margin: 0 5px 0 120px; display: block;" v-model="formData.budgetItems" :disabled="formData.parentId && formData.parentId.length > 0">预算科目</Checkbox>
            </Col>
            <Col span="11" style="padding-left: 10px;">
              <div>计量单位</div>
              <div style="margin-bottom: 10px;">
                <span style="margin-right: 41px;">单位组：</span>
                <Select v-model="formData.unitGroup" style="width: 80px" :disabled="!formData.numberUnit">
                  <Option v-for="(v, i) in measureUnitGroup" :key="i" :value="v.name">{{v.name}}</Option>
                </Select>
                <Button type="default" style="margin-left: 28px;" @click="addUnitGroup" :disabled="!formData.numberUnit">新增单位组</Button>
              </div>
              <div>
                <span style="margin-right: 29px;">缺省单位：</span>
                <Select v-model="formData.unit" style="width: 80px" :disabled="!formData.numberUnit">
                  <Option v-for="(v, i) in unitList" :key="i" :value="v.name">{{v.name}}</Option>
                </Select>
                <Button type="default" style="margin-left: 28px;"  @click="addUnit" :disabled="!formData.unitGroup">新增单位</Button>
              </div>
              <Checkbox style="margin: 4px 5px 4px 0; display: block;" v-model="formData.subjectDraw" :disabled="!formData.isSD">科目计息</Checkbox>
              <div style="margin-bottom: 10px;">
                <span style="margin-right: 41px;">日利率：</span>
                <InputNumber v-model="formData.draw" :step="0.1" style="width: 80px" :disabled="!formData.subjectDraw" />
                <span style="margin: 0 10px 0 5px;">‰</span>
                <Button type="default">科目预算</Button>
              </div>
              <div>
                <span style="margin-right: 5px;">科目受控系统：</span>
                <Select v-model="formData.controlledSystem" style="width: 80px">
                  <Option v-for="(v, i) in ['应收应付']" :key="i" :value="v">{{v}}</Option>
                </Select>
              </div>
            </Col>
          </Row>

          <div style="margin: 20px 30px 10px 10px">预设现金流量项目</div>
          <FormItem label="主表项目">
            <Select v-model="mainP" style="width: 420px" :disabled="!formData.isP || formData.cashAccount || formData.subjectBank || formData.cashEquivalents">
              <Option v-for="(v, i) in cashList" :key="i" :value="v.name">{{v.code}}（{{v.name}}）</Option>
            </Select>
          </FormItem>
          <FormItem label="附表项目">
            <Select v-model="scheduleP" style="width: 420px" :disabled="!formData.isP || formData.cashAccount || formData.subjectBank || formData.cashEquivalents">
              <Option v-for="(v, i) in cashList" :key="i" :value="v.name">{{v.code}}（{{v.name}}）</Option>
            </Select>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="核算项目">
        <Table border ref="selection" :columns="columns" :data="accountItem" :height="650" @on-select="selectAccountItem" @on-select-cancel="selectAccountItem"></Table>
      </TabPane>
    </Tabs>
    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>

    <unitForm ref="unitForm" @load="loadUnit" />
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateSubject } from '../../api/subject'
import { currencyQuery } from '../../api/currency'
import { queryMeasureUnitGroup, queryMeasureUnit, updateMeasureUnitGroup } from '../../api/measureUnit'
import { queryCashFlow } from '../../api/cashFlow'
import { accountingProgram } from '../../libs/accountingProgram'
import unitForm from '../measureUnit/unitForm'
import { subject } from '../../libs/subject'
export default {
  name: 'currency',
  props: {
    subjectList: Array,
    whichType: Number
  },
  components: {
    unitForm
  },
  data () {
    return {
      subject,
      gList: [],
      accountItem: [],
      modal: false,
      type: '',
      step: 0,
      balanceList: ['借方', '贷方'],
      currencyList: [],
      measureUnitGroup: [],
      measureUnit: [],
      unitList: [],
      cashList: [],
      mainP: '',
      scheduleP: '',
      oldData: {},
      formData: {},
      formDataRule: {
        code: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let index = value.toString().lastIndexOf('.')
              let fData = index > -1 ? this.subjectList.find(f => f.code === value.substr(0, index)) : null
              if (!value) {
                callback(new Error('科目编码不能为空'))
              } else if (!/^([0-9]{4,})+(.[0-9]{2})*?$/.test(value)) {
                callback(new Error('非法科目编码，请遵循4-2-2规则，如1001.01.01'))
              } else if (this.oldData.code !== value && this.subjectList.find(f => f.code === value)) {
                callback(new Error('已存在该科目编码'))
              } else if (index > -1 && (!fData || !this.gList.find(f => f._id === fData.typeId))) {
                callback(new Error('您输入的编码为明细科目编码，在当前类别找不到其上级科目'))
              } else {
                if (fData) {
                  fData.parentId.push(fData._id)
                  this.formData.parentId = fData.parentId
                  this.formData.typeId = fData.typeId
                  this.formData.type = fData.type
                } else {
                  this.formData.parentId = []
                }
                callback()
              }
            }
          }
        ],
        name: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('科目名称不能为空'))
              } else if (this.oldData.name !== value && this.subjectList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该科目名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        typeId: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('科目类别不能为空'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '类别编码',
          key: 'code'
        },
        {
          title: '类别名称',
          key: 'title'
        }
      ],
      isCanCode: true
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getSuperiorSub () {
      let obj = {}
      if (this.formData.parentId && this.formData.parentId.length) {
        obj = this.subjectList.find(f => f._id === this.formData.parentId[this.formData.parentId.length - 1])
      }
      return obj
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadCurrency()
          this.loadUnit()
          this.loadUnitGroup()
          this.loadCash()
        }
      },
      immediate: true,
      deep: true
    },
    'formData.code': {
      handler (val, oldVal) {
        if (val && !this.isCanCode && this.getSuperiorSub.code) {
          if (
            val.substr(0, this.getSuperiorSub.code.length + 1) !== this.getSuperiorSub.code + '.' ||
            val.length > this.getSuperiorSub.code.length + 3
          ) {
            this.$nextTick(() => {
              this.formData.code = oldVal
            })
          }
        }
      },
      deep: true
    },
    'formData.unitGroup': {
      handler () {
        if (this.formData.unitGroup) {
          let g = this.measureUnitGroup.find(v => v.name === this.formData.unitGroup)
          let list = this.measureUnit.filter(v => v.groupId === g._id)
          this.unitList = list
          if (g.defaultValue) {
            this.formData.unit = list.find(v => v._id === g.defaultValue).name
          }
        }
      },
      deep: true
    },
    'formData.cashAccount': {
      handler () {
        if (this.formData.cashAccount) {
          this.formData.journal = true
          this.formData.subjectBank = false
          this.formData.cashEquivalents = false
        }
      },
      deep: true
    },
    'formData.subjectBank': {
      handler () {
        if (this.formData.subjectBank) {
          this.formData.journal = true
          this.formData.cashAccount = false
          this.formData.cashEquivalents = false
        }
      },
      deep: true
    },
    'formData.cashEquivalents': {
      handler () {
        if (this.formData.cashEquivalents) {
          this.formData.cashAccount = false
          this.formData.subjectBank = false
        }
      },
      deep: true
    },
    mainP () {
      let info = this.cashList.find(v => v.name === this.mainP)
      if (info) {
        this.formData.mainProjectCode = info.code
        this.formData.mainProject = info.name
      }
    },
    scheduleP () {
      let info = this.cashList.find(v => v.name === this.scheduleP)
      if (info) {
        this.formData.scheduleProjectCode = info.code
        this.formData.scheduleProject = info.name
      }
    }
  },
  methods: {
    show (type, data, subjectList, unitAddObj = null, gList = []) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        mnemonic: '',
        name: '',
        finalTuning: false,
        currentAccount: false,
        numberUnit: false,
        unitGroup: '',
        unit: '',
        cashAccount: false,
        subjectBank: false,
        journal: false,
        cashEquivalents: false,
        budgetItems: false,
        subjectDraw: false,
        draw: 0,
        controlledSystem: '',
        mainProjectCode: '',
        mainProject: '',
        scheduleProjectCode: '',
        scheduleProject: '',
        accountItem: [],
        isCA: true,
        isNU: true,
        isSD: true,
        isP: true
      }, unitAddObj)
      if (data) this.oldData = data
      this.subjectList = subjectList
      this.accountItem = []
      accountingProgram.forEach(v => {
        let obj = Object.assign({}, v)
        this.formData.accountItem.forEach(title => {
          if (title === v.title) obj._checked = true
        })
        this.accountItem.push(obj)
      })
      this.gList = gList
      if (this.formData.code) this.isCanCode = false
      if (!this.formData.typeId && this.gList.length) {
        this.formData.typeId = this.gList[0]._id
        this.formData.type = this.gList[0].name
      }
      this.$forceUpdate()
    },
    cancel () {
      this.modal = false
      this.type = ''
      this.oldData = {}
      this.step = 0
      this.mainP = ''
      this.scheduleP = ''
      this.$refs.selection.selectAll(false)
      this.$refs.formData.resetFields()
    },
    sure () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.formData.numberUnit && (
            !this.formData.unitGroup ||
            !this.formData.unit
          )) {
            this.$Notice.error({
              title: '科目',
              desc: '选择数量金额辅助核算后，单位组和单位必填'
            })
          } else {
            updateSubject(this.formData).then(res => {
              this.$Notice.success({
                title: '科目',
                desc: `成功${this.type}科目`
              })
              this.$emit('load')
              this.cancel()
            }).catch(err => {
              this.$Notice.error({
                title: '科目',
                desc: err.message
              })
            })
          }
        }
      })
    },
    loadCurrency () {
      currencyQuery({
        accountSetId: this.accountSet._id
      }).then(res => {
        let list = res.data.map(v => v.name)
        list.unshift('不核算')
        list.push('所有币别')
        this.currencyList = list
      }).catch(err => {
        this.$Notice.error({
          title: '币别',
          desc: err.message
        })
      })
    },
    loadUnitGroup () {
      queryMeasureUnitGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.measureUnitGroup = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '计量单位组',
          desc: err.message
        })
      })
    },
    loadUnit () {
      queryMeasureUnit({ accountSetId: this.accountSet._id }).then(res => {
        this.measureUnit = res.data
        if (this.formData.unitGroup) {
          let g = this.measureUnitGroup.find(v => v.name === this.formData.unitGroup)
          let list = this.measureUnit.filter(v => v.groupId === g._id)
          this.unitList = list
        }
      }).catch(err => {
        this.$Notice.error({
          title: '计量单位',
          desc: err.message
        })
      })
    },
    loadCash () {
      queryCashFlow({ accountSetId: this.accountSet._id }).then(res => {
        this.cashList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '现金流量项目',
          desc: err.message
        })
      })
    },
    selectAccountItem (items) {
      this.formData.accountItem = items.map(v => v.title)
    },
    addUnitGroup () {
      let formData = {
        accountSetId: this.accountSet._id,
        name: ''
      }
      this.$Modal.confirm({
        title: `新增计量单位组`,
        render: (h) => {
          return h('Input', {
            props: {
              value: formData.name,
              autofocus: true,
              placeholder: '输入计量单位组名称'
            },
            on: {
              input: (val) => {
                formData.name = val
              }
            }
          })
        },
        onOk: () => {
          if (formData.name) {
            if (this.measureUnitGroup.filter(v => v.name.trim() === formData.name.trim()).length) {
              this.$Notice.error({
                title: `新增计量单位组`,
                desc: `已存在该计量单位组，无法新增`
              })
            } else {
              updateMeasureUnitGroup(formData).then(res => {
                this.$Notice.success({
                  title: '计量单位组',
                  desc: `成功新增计量单位组：${formData.name}`
                })
                this.loadUnitGroup()
              }).catch(err => {
                this.$Notice.error({
                  title: '计量单位组',
                  desc: err.message
                })
              })
            }
          } else {
            this.$Notice.error({
              title: `新增计量单位组`,
              desc: '计量单位组名称必填'
            })
          }
        }
      })
    },
    addUnit () {
      if (this.formData.unitGroup) {
        let group = this.measureUnitGroup.find(v => v.name === this.formData.unitGroup)
        if (group) {
          let formData = {
            accountSetId: this.accountSet._id,
            groupId: group._id
          }
          this.$refs.unitForm.show('新建', null, this.measureUnit, formData)
        } else {
          this.$Notice.error({
            title: `新增计量单位`,
            desc: '数据出错，找不到该单位组，请刷新在尝试'
          })
        }
      } else {
        this.$Notice.error({
          title: `新增计量单位`,
          desc: '请先选择单位组'
        })
      }
    },
    selectType (id) {
      if (id) this.formData.type = this.gList.find(f => f._id === id).name
    }
  }
}
</script>

<style lang="less">

</style>
