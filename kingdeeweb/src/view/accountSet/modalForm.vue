<template>
  <Modal
    v-model="modal"
    :title="`${type}账套`"
    :mask-closable="false"
    width="500"
    height="1200"
    @on-cancel="cancel">

    <Tabs type="card" v-model="step">
      <TabPane label="账套">
        <Form ref="accountSet" :model="accountSet" :rules="accountSetRule" :label-width="100" style="margin-top: 10px;">
          <FormItem label="账套号" prop="accountSetId">
            <Input v-model="accountSet.accountSetId" readonly style="width: 250px" />
          </FormItem>
          <FormItem label="账套名称" prop="accountSetName">
            <Input v-model="accountSet.accountSetName" style="width: 250px" />
          </FormItem>
          <FormItem label="账套类型" prop="accountSetType">
            <Select v-model="accountSet.accountSetType" style="width: 250px">
              <Option v-for="(v, i) in aType" :key="i" :value="v">{{v}}</Option>
            </Select>
          </FormItem>
        </Form>
        <p>
          账套类型：<br/>
          1. 标准供应链解决方案（适用于工业、工商一体化的企业供应链、生产制造、人力资源和标准财务管理）<br/>
          2. 商业企业通用解决方案（适用于商业企业供应链、人力资源和标准财务管理）<br/>
          3. 标准财务解决方案（适用于除合并账务系统、合并报表系统之外的纯财务业务）<br/>
          4. 集团财务解决方案（适用于纯财务业务）<br/>
          5. 2017年行政事业管理解决方案（适用于行政、事业单位纯财务业务）<br/>
          6. 战略人力资源解决方案（适用于人力资源业务）<br/>
          7. 医药制造行业解决方案（适用于工业医药企业供应链、生产制造、GMP和标准财务管理）<br/>
          8. 医药流通行业解决方案（适用于商业医药企业供应链、GSP和标准财务管理）<br/>
        </p>
      </TabPane>

      <TabPane label="系统">
        <Form ref="system" :model="system" :rules="systemRule" :label-width="100" style="margin-top: 10px;">
          <FormItem label="机构名称" prop="organization">
            <Input v-model="system.organization" style="width: 250px" />
          </FormItem>
          <FormItem label="地址">
            <Input v-model="system.address" style="width: 250px" />
          </FormItem>
          <FormItem label="电话">
            <Input v-model="system.tel" style="width: 250px" />
          </FormItem>
          <FormItem label="公司图标">
            <upload-pic v-model="system.logo" :multiple="1" />
          </FormItem>
        </Form>
      </TabPane>

      <TabPane label="总账">
        <Form ref="general" :model="general" :rules="generalRule" :label-width="120" style="margin-top: 10px;">
          <FormItem label="记账本位币编码" prop="code">
            <Input v-model="general.code" style="width: 250px" :disabled="true" />
          </FormItem>
          <FormItem label="名称" prop="unit">
            <Input v-model="general.unit" style="width: 250px" :disabled="true" />
          </FormItem>
          <FormItem label="小数点位数">
            <InputNumber v-model="general.float" :min="0" style="width: 250px" :disabled="true" />
          </FormItem>
          <FormItem label="凭证过账前必需审核">
            <Checkbox v-model="general.approve"></Checkbox>
          </FormItem>
          <FormItem label="启用标准成本体系">
            <Checkbox v-model="general.cost" @on-change="tip"></Checkbox>
          </FormItem>
        </Form>
      </TabPane>

      <TabPane label="会计期间">
        <Form ref="accountant" :model="accountant">
          <Row>
            <Col span="12">
              <FormItem label="启用会计年度">
                <InputNumber v-model="accountant.accountingYear" :editable="false" :disabled="!!accountSet._id"></InputNumber>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="启用会计期间">
                <InputNumber v-model="accountant.accountingPeriod" :editable="false" :min="1" :max="accountant.accountingNumber" :disabled="!!accountSet._id"></InputNumber>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="7">
              <p>会计年度</p>
              <ul class="accountant">
                <li v-for="(v, i) in 50"
                    :key="i"
                    :class="{active: accountant.accountingYear + i === checkYear}"
                    @click="checkYear = accountant.accountingYear + i">
                  {{accountant.accountingYear + i}}
                </li>
              </ul>
            </Col>
            <Col span="17" style="padding-left: 26px">
              <Row>
                <span style="margin-right: 5px;">自然年度会计期间</span>
                <Checkbox v-model="accountant.nature" :disabled="!!accountSet._id"></Checkbox>
                <span  style="margin: 0 5px 0 10px;">会计期间数</span>
                <RadioGroup v-model="accountant.accountingNumber">
                  <Radio :label="12" :disabled="accountant.nature">
                    <span>12</span>
                  </Radio>
                  <Radio :label="13" :disabled="accountant.nature">
                    <span>13</span>
                  </Radio>
                </RadioGroup>
              </Row>
              <ul class="accountant_table">
                <li>
                  <span>会计期间</span>
                  <span>开始时间</span>
                </li>
                <li v-for="(v, i) in accountant.accountingNumber" :key="i">
                  <span>{{v}}</span>
                  <span>{{checkYear}}-{{v >= 10 ? v : '0' + v}}-01</span>
                </li>
              </ul>
            </Col>
          </Row>
        </Form>
      </TabPane>
    </Tabs>

    <div slot="footer">
      <template v-if="type !== '查看'">
        <Button type="text" @click="last">{{step === 0 ? '取消' : '上一步'}}</Button>
        <Button type="success" @click="next">{{step === 3 ? '确定' : '下一步'}}</Button>
      </template>
      <Button type="text" v-else @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
import UploadPic from '../../components/upload/upload-pic'
import { updateAccountSet } from '../../api/accountSet'
import { mapGetters } from 'vuex'
export default {
  name: 'modalForm',
  components: {
    UploadPic
  },
  data () {
    return {
      modal: false,
      type: '新建',
      step: 0,
      aType: ['标准供应链解决方案', '商业企业通用解决方案', '标准财务解决方案', '集团财务解决方案', '2017年行政事业管理解决方案', '医药制造行业解决方案', '医药流通行业解决方案', '战略人力资源解决方案'],
      accountSet: {
        accountSetId: '',
        accountSetName: '',
        accountSetType: '',
        status: '已启用'
      },
      accountSetRule: {
        accountSetId: [
          { required: true }
        ],
        accountSetName: [
          { required: true, message: '账套名称必填', trigger: 'blur' }
        ],
        accountSetType: [
          { required: true }
        ]
      },
      system: {
        organization: '',
        address: '',
        tel: '',
        logo: []
      },
      systemRule: {
        organization: [
          { required: true, message: '机构名称必填', trigger: 'blur' }
        ]
      },
      general: {
        code: '',
        unit: '',
        float: 0,
        approve: false,
        cost: false
      },
      generalRule: {
        code: [
          { required: true, message: '记账本位币编码必填', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '名称必填', trigger: 'blur' }
        ]
      },
      accountant: {
        accountingYear: null,
        accountingPeriod: 1,
        nature: true,
        accountingNumber: 12
      },
      checkYear: ''
    }
  },
  computed: {
    ...mapGetters([
      'myUser'
    ])
  },
  watch: {
    'general.float' () {
      if (this.general.float === null) {
        this.$nextTick(() => {
          this.general.float = 0
        })
      }
    },
    'accountant.nature' () {
      if (this.accountant.nature) {
        this.accountant.accountingNumber = 12
      }
    },
    'accountant.accountingNumber' () {
      if (this.accountant.accountingPeriod === 13) this.accountant.accountingPeriod = 12
    },
    'accountant.accountingYear' () {
      this.checkYear = this.accountant.accountingYear
    }
  },
  methods: {
    show (type, data = {}) {
      this.type = type
      this.modal = true
      this.accountSet = {
        companyId: this.myUser.companyId,
        userList: data.userList && data.userList.length ? data.userList : [this.myUser._id],
        accountSetId: data.accountSetId || `ZT${Date.parse(new Date())}${Math.floor(Math.random() * 900) + 100}`,
        accountSetName: data.accountSetName || '',
        accountSetType: data.accountSetType || '标准供应链解决方案',
        status: data.status || '已启用'
      }
      this.system = {
        organization: data.organization || '',
        address: data.address || '',
        tel: data.tel || '',
        logo: data.logo ? [data.logo] : []
      }
      this.general = {
        code: data.code || 'RMB',
        unit: data.unit || '人民币',
        float: data.float || 2,
        approve: data.approve || false,
        cost: data.cost || false
      }
      this.accountant = {
        accountingYear: data.accountingYear || parseInt(new Date().getFullYear()),
        accountingPeriod: data.accountingPeriod || 1,
        nature: data.nature || true,
        accountingNumber: data.accountingNumber || 12
      }
      if (type === '新建' && data._id) {
        this.accountSet.accountSetName = ''
        this.accountSet.accountSetId = `ZT${Date.parse(new Date())}${Math.floor(Math.random() * 900) + 100}`
        this.accountSet.isCopy = true
        this.system.organization = ''
      }
      if (data._id) this.accountSet._id = data._id
    },
    cancel () {
      this.modal = false
      this.type = ''
      this.step = 0
      this.$refs.accountSet.resetFields()
      this.$refs.system.resetFields()
      this.$refs.general.resetFields()
    },
    last () {
      if (this.step > 0) {
        this.step--
      } else {
        this.cancel()
      }
    },
    validateFun (name, cb, error) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          cb()
        } else {
          if (error) error()
        }
      })
    },
    next () {
      switch (this.step) {
        case 0:
          this.validateFun('accountSet', () => {
            this.step++
          })
          break
        case 1:
          this.validateFun('system', () => {
            this.step++
          })
          break
        case 2:
          this.validateFun('general', () => {
            this.step++
          })
          break
        case 3:
          this.validateFun('accountSet', () => {
            this.validateFun('system', () => {
              this.validateFun('general', () => {
                let formData = Object.assign({}, this.accountSet, this.system, this.general, this.accountant)
                if (formData.logo.length) {
                  formData.logo = formData.logo[0]
                } else {
                  formData.logo = ''
                }
                updateAccountSet(formData).then(res => {
                  this.cancel()
                  this.$emit('load')
                }).catch(err => {
                  this.$Notice.error({
                    title: '账套管理',
                    desc: err.message
                  })
                })
              }, () => {
                this.step = 2
              })
            }, () => {
              this.step = 1
            })
          }, () => {
            this.step = 0
          })
          break
      }
    },
    tip (bool) {
      if (bool) {
        this.$Modal.confirm({
          title: '启用标准成本体系',
          content: `<p>选择启用标准成本体系参数,供应链、标准成本等模块将执行标准成本体系流程:<br/>
          物料的计价方法为“标准成本法”；<br/>
          供应链实仓出入库单据单价为标准成本单价入库发票与单据金额不一致时将产生差异单据;供应链实仓出入库单据、发票分开生成凭证,不做冲回处理;支持即时入库核算及凭证生成；<br/>
          物料标准成本按设置的成本BOM和成本工艺路线卷算支持多套成本类型的标准成本计算和分析;提供标准成本生效流程；<br/>
          标准成本模块提供实际成本归集、简单分配,如果您需要较复杂的费用分配、原材料成本差异还原、产品成本差异还原功能,则需要启用作业成本模块,且每会计期间末执行出库核算、差异还原等程序。<br/>
          此参数对核算模式的影响重大,一旦选择,不能取消,请谨慎选择。</p>`,
          onOk: () => {
            this.general.cost = true
          },
          onCancel: () => {
            this.general.cost = false
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.accountant,
.accountant_table {
  height: 280px;
  overflow: auto;
  border: 1px solid #ccc;
  margin-top: 10px;
  list-style: none;

  li {
    height: 26px;
    line-height: 26px;
    line-height: 26px;
    padding-left: 10px;
    cursor: pointer;

    &:hover {
      background: #f8f8f8;
    }
    &.active {
      color: #2d8cf0;
    }
  }
}
.accountant_table {
  li {
    display: flex;
    flex-direction: row;
    padding-left: 0;

    &:nth-child(1) {
      background: #f8f8f8;
    }
    &:hover {
      background: none;
    }

    span {
      text-align: center;

      &:nth-child(1) {
        width: 40%;
        background: #f8f8f8;
      }
      &:nth-child(2) {
        flex-grow: 1;
      }
    }
  }
}
</style>
