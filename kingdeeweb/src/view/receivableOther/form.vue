<template>
  <div>
    <Row type="flex" justify="space-between">
      <div style="display: flex; align-items: center;">
        <template v-if="$route.query.id">
          审核状态：
          <span :style="{marginRight: '20px', color: formData.audit === '未审核' ? '#ed4014' : '#19be6b'}">
            {{ formData.audit }}
          </span>
          核销状态：
          <span :style="{marginRight: '20px', color: formData.status !== '全部核销' ? '#ed4014' : '#19be6b'}">
            {{ formData.status }}
          </span>
        </template>
      </div>
      <div>
        <Button type="primary" style="margin-right: 10px;" @click="save(false)" :disabled="!isCanEdit">保存</Button>
        <Button style="margin-right: 10px;" @click="save(true)" >新增</Button>
        <Button style="margin-right: 10px;" v-if="formData.audit === '未审核'" :disabled="!$route.query.id" @click="batchFun('审核', $route.query.id, '已审核')">审核</Button>
        <Button style="margin-right: 10px;" v-if="formData.audit === '已审核'" :disabled="!$route.query.id" @click="batchFun('反审核', $route.query.id, '未审核')">反审核</Button>
        <Button style="margin-right: 10px;" @click="$router.push({
          name: 'receivableOtherList'
        })">历史单据</Button>
         <ButtonGroup>
          <Button icon="ios-skip-backward" :disabled="!$route.query.id" @click="goNav('D')" style="width: 40px; display: flex; align-items: center; justify-content: center;"></Button>
          <Button style="width: 40px; display: flex; align-items: center; justify-content: center;" :disabled="!$route.query.id" @click="goNav('L')">
            <Icon type="ios-rewind" />
          </Button>
          <Button style="width: 40px; display: flex; align-items: center; justify-content: center;" :disabled="!$route.query.id" @click="goNav('N')">
            <Icon type="ios-rewind" style="transform: rotate(180deg)" />
          </Button>
          <Button icon="ios-skip-forward" :disabled="!$route.query.id" @click="goNav('Z')" style="width: 40px; display: flex; align-items: center; justify-content: center;"></Button>
        </ButtonGroup>
      </div>
    </Row>

    <Card style="margin-top: 10px;">
      <p slot="title">基本信息</p>
      <Form ref="formData" :model="formData" :rules="formDataRule" label-position="top" style="margin-bottom: 8px;">
        <Row type="flex">
          <span style="margin: 0 30px 0 0;">收款类型</span>
          <RadioGroup v-model="formData.orderType">
            <Radio label="收款" style="margin-right: 30px;"></Radio>
            <Radio label="退款"></Radio>
          </RadioGroup>
        </Row>
        <Row type="flex" style="margin-top: 15px">
          <FormItem label="单据编号" style="margin: 0 30px 0 0;" prop="code">
            <Input style="width: 200px" v-model="formData.code" />
          </FormItem>
          <FormItem label="单据日期" style="margin: 0 30px 0 0;" prop="dateTime">
            <DatePicker type="date" style="width: 200px" v-model="formData.dateTime" :clearable="false" format="yyyy-MM-dd" />
          </FormItem>
          <FormItem label="客户" style="margin: 0 30px 0 0;" prop="customerId">
            <Select v-model="formData.customerId" style="width:200px" @on-change="loadBalance">
              <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('customer', loadCustomer)" style="font-size: 20px; opacity: 0.6" />
              <Option v-for="item in customerList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="部门" style="margin: 0 30px 0 0;">
            <Select v-model="formData.departmentId" style="width:200px">
              <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('department', loadDepartment)" style="font-size: 20px; opacity: 0.6" />
              <Option v-for="item in departmentList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="业务员" style="margin: 0 30px 0 0;">
            <Select v-model="formData.clerkId" style="width:200px">
              <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('clerk', loadClerk)" style="font-size: 20px; opacity: 0.6" />
              <Option v-for="item in clerkList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="单据备注" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" v-model="formData.des" />
          </FormItem>
        </Row>

        <Row type="flex" style="margin-top: 15px">
          <FormItem label="应收款余额" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" v-model="formData.balance" :disabled="true" />
          </FormItem>
        </Row>
      </Form>
    </Card>

    <Card style="margin-top: 10px;">
      <div slot="title">
        应收信息
      </div>

      <Table :width="getTableWidth"
             border
             :columns="orderColumns"
             :data="formData.order.list"
             @on-row-click="rowClick"
             :row-class-name="rowClassName"
             show-summary
             :summary-method="handleSummary"
             class="input_table">
        <template slot-scope="{ row }" slot="action">
          <Button size="small" style="margin-right: 5px;" @click="setList(true, row._index, 'order')">增加</Button>
          <Button size="small" @click="setList(false, row._index, 'order')">删除</Button>
        </template>

        <template slot-scope="{ row }" slot="advanceAccountId">
          <div class="text">{{ incomeList.find(f => f._id === row.advanceAccountId) && incomeList.find(f => f._id === row.advanceAccountId).name }}</div>
          <div class="hover_layer">

            <Select v-model="formData.order.list[row._index].advanceAccountId">
              <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('incomeCategory', loadIncomeCategory)" style="font-size: 20px; opacity: 0.6" />
              <Option v-for="item in incomeList" :value="item._id" :key="item._id">{{ item.name }}</Option>
            </Select>
          </div>
        </template>

        <template slot-scope="{ row }" slot="advanceMoney">
          <div class="text">{{ row.advanceMoney }}</div>
          <div class="hover_layer">
            <InputNumber
              v-model="formData.order.list[row._index].advanceMoney"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\ \s?|(,*)/g, '')"
              style="width: 160px" />
          </div>
        </template>

        <template slot-scope="{ row }" slot="des">
          <div class="text">{{ row.des }}</div>
          <div class="hover_layer">
            <Input v-model="formData.order.list[row._index].des" />
          </div>
        </template>
      </Table>
    </Card>

    <Card style="margin-top: 10px;">
      <div slot="title" style="display: flex; align-items: center">
        立即付款信息
        <span style="font-size: 12px; margin-left: 30px;">优惠金额</span>
        <InputNumber style="width: 100px; margin-left: 10px;" v-model="formData.main.preferential" />
      </div>

      <Table :width="getTableWidth"
             border
             :columns="mainColumns"
             :data="formData.main.list"
             @on-row-click="rowClick"
             :row-class-name="rowClassName"
             show-summary
             :summary-method="handleSummary"
             class="input_table">
        <template slot-scope="{ row }" slot="action">
          <Button size="small" style="margin-right: 5px;" @click="setList(true, row._index, 'main')">增加</Button>
          <Button size="small" @click="setList(false, row._index, 'main')">删除</Button>
        </template>

        <template slot-scope="{ row }" slot="advanceAccountId">
          <div class="text">{{ bankAccountList.find(f => f._id === row.advanceAccountId) && bankAccountList.find(f => f._id === row.advanceAccountId).name }}</div>
          <div class="hover_layer">
            <Select v-model="formData.main.list[row._index].advanceAccountId">
              <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('bankAccount', loadBank)" style="font-size: 20px; opacity: 0.6" />
              <Option v-for="item in bankAccountList" :value="item._id" :key="item._id">{{ item.name }}</Option>
            </Select>
          </div>
        </template>

        <template slot-scope="{ row }" slot="advanceType">
          <div class="text">{{ clearList.find(f => f._id === row.advanceType) && clearList.find(f => f._id === row.advanceType).name }}</div>
          <div class="hover_layer">
            <Select v-model="formData.main.list[row._index].advanceType">
              <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('clearingForm', loadClearingForm)" style="font-size: 20px; opacity: 0.6" />
              <Option v-for="item in clearList" :value="item._id" :key="item._id">{{ item.name }}</Option>
            </Select>
          </div>
        </template>

        <template slot-scope="{ row }" slot="advanceMoney">
          <div class="text">{{ row.advanceMoney }}</div>
          <div class="hover_layer">
            <InputNumber
              v-model="formData.main.list[row._index].advanceMoney"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\ \s?|(,*)/g, '')"
              style="width: 160px" />
          </div>
        </template>

        <template slot-scope="{ row }" slot="transactionNo">
          <div class="text">{{ row.transactionNo }}</div>
          <div class="hover_layer">
            <Input v-model="formData.main.list[row._index].transactionNo" />
          </div>
        </template>

        <template slot-scope="{ row }" slot="des">
          <div class="text">{{ row.des }}</div>
          <div class="hover_layer">
            <Input v-model="formData.main.list[row._index].des" />
          </div>
        </template>
      </Table>

      <Row type="flex" justify="end" align="middle" style="margin-top: 10px;">
        <span>本次付款总金额</span>
        <Input style="width: 100px; margin-left: 10px;" :value="formatMoney(formData.main.total, '', 2)" readonly />
      </Row>
    </Card>

    <selectInfoModel ref="selectInfoModel" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  parameterReceivableOther,
  updateReceivableOther,
  queryReceivableOther,
  batchReceivableOther
} from '../../api/receivableOther'
import { queryCustomer } from '../../api/customer'
import { queryClerk } from '../../api/clerk'
import { queryDepartment } from '../../api/department'
import { queryIncomeCategory } from '../../api/incomeCategory'
import { queryBankAccount } from '../../api/bankAccount'
import { queryClearingForm } from '../../api/clearingForm'
import { queryReceivableReport } from '../../api/receivableReport'
import moment from 'moment'
import NP from 'number-precision'
import { formatMoney } from 'accounting'
import selectInfoModel from '../../components/selectInfo/model'
export default {
  name: 'receivableOther',
  components: {
    selectInfoModel
  },
  data () {
    return {
      isCanEdit: true,
      currentRow: null,
      formData: {
        accountSetId: null,
        code: null,
        dateTime: null,
        orderType: '收款',
        customerId: null,
        clerkId: null,
        departmentId: null,
        des: null,
        balance: null,
        main: {
          preferential: null,
          list: [{
            advanceAccountId: null,
            advanceType: null,
            advanceMoney: null,
            transactionNo: null,
            des: null
          }],
          total: null
        },
        order: {
          list: [{
            advanceAccountId: null,
            advanceMoney: null,
            des: null
          }],
          total: null,
          payList: [],
          payTotal: null
        },
        audit: '未审核',
        status: '未核销',
        creator: null,
        auditor: null,
        editor: null,
        cAt: null,
        aAt: null,
        eAt: null,
        custom: null
      },
      formDataRule: {
        code: [
          { required: true, message: '单据编号不能为空', trigger: 'blur' }
        ],
        dateTime: [
          { required: true, message: '单据日期不能为空', type: 'date', trigger: 'change' }
        ],
        customerId: [
          { required: true, message: '客户不能为空', trigger: 'change' }
        ]
      },
      orderColumns: [
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 125
        },
        {
          title: '收入名称',
          slot: 'advanceAccountId',
          width: 150,
          renderHeader: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#ed3f14',
                  fontSize: '14px',
                  fontWeight: 'bolder'
                }
              }, '*'),
              h('span', params.column.title)
            ])
          }
        },
        {
          title: '应收金额',
          slot: 'advanceMoney',
          width: 200,
          key: 'advanceMoney',
          renderHeader: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#ed3f14',
                  fontSize: '14px',
                  fontWeight: 'bolder'
                }
              }, '*'),
              h('span', params.column.title)
            ])
          }
        },
        {
          title: '应收备注',
          slot: 'des',
          width: 300
        },
        {
          title: ' '
        }
      ],
      mainColumns: [
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 125
        },
        {
          title: '收款账户',
          slot: 'advanceAccountId',
          width: 150
        },
        {
          title: '收款方式',
          slot: 'advanceType',
          width: 150
        },
        {
          title: '收款金额',
          slot: 'advanceMoney',
          width: 200,
          key: 'advanceMoney'
        },
        {
          title: '交易号',
          slot: 'transactionNo',
          width: 200
        },
        {
          title: '应收备注',
          slot: 'des',
          width: 300
        },
        {
          title: ' '
        }
      ],
      departmentList: [],
      clerkList: [],
      customerList: [],
      incomeList: [],
      bankAccountList: [],
      clearList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myUser',
      'myPermission',
      'receivableOther'
    ]),
    getTableWidth () {
      return window.innerWidth - 150
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          if (this.$route.query.id) {
            this.loadReceivableOther()
          } else {
            this.loadParameter()
          }
          this.loadCustomer()
          this.loadClerk()
          this.loadDepartment()
          this.loadIncomeCategory()
          this.loadBank()
          this.loadClearingForm()
        }
      },
      immediate: true,
      deep: true
    },
    '$route': {
      handler () {
        if (this.$route.name !== 'receivableOther') return
        if (this.accountSet) {
          if (this.$route.query.id && this.$route.query.id !== this.formData._id) {
            this.loadReceivableOther()
          }
          this.loadCustomer()
          this.loadClerk()
          this.loadDepartment()
          this.loadIncomeCategory()
          this.loadBank()
          this.loadClearingForm()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    moment,
    formatMoney,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '其他应收') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}其他应收的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadParameter () {
      let time = this.moment().format('YYYY-MM-DD')
      parameterReceivableOther({
        accountSetId: this.accountSet._id,
        dateTime: {
          $gte: new Date(time + ' 00:00:00'),
          $lte: new Date(time + ' 23:59:59.999')
        }
      }).then(res => {
        let total = res.data.total + 1
        let pad = '0000'
        total = pad.substring(0, pad.length - total.toString().length) + total
        this.formData = {
          accountSetId: this.accountSet._id,
          code: `QTYSD-${time.split('-').join('')}-${total}`,
          dateTime: new Date(),
          orderType: '收款',
          customerId: null,
          clerkId: null,
          departmentId: null,
          des: null,
          balance: null,
          main: {
            preferential: null,
            list: [{
              advanceAccountId: null,
              advanceType: null,
              advanceMoney: null,
              transactionNo: null,
              des: null
            }],
            total: null
          },
          order: {
            list: [{
              advanceAccountId: null,
              advanceMoney: null,
              des: null
            }],
            total: null,
            payList: [],
            payTotal: null
          },
          audit: '未审核',
          status: '未核销',
          creator: null,
          auditor: null,
          editor: null,
          cAt: null,
          aAt: null,
          eAt: null,
          custom: null
        }
      }).catch(() => {
        this.$Message.error('获取单据参数出错')
      })
    },
    loadCustomer () {
      queryCustomer({ accountSetId: this.accountSet._id }).then(res => {
        this.customerList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '客户',
          desc: err.message
        })
      })
    },
    loadClerk () {
      queryClerk({ accountSetId: this.accountSet._id }).then(res => {
        this.clerkList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '职员',
          desc: err.message
        })
      })
    },
    loadDepartment () {
      queryDepartment({ accountSetId: this.accountSet._id }).then(res => {
        this.departmentList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '部门',
          desc: err.message
        })
      })
    },
    loadIncomeCategory () {
      queryIncomeCategory({ accountSetId: this.accountSet._id }).then(res => {
        this.incomeList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '收入类别',
          desc: err.message
        })
      })
    },
    loadBank () {
      queryBankAccount({ accountSetId: this.accountSet._id }).then(res => {
        this.bankAccountList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '银行账号',
          desc: err.message
        })
      })
    },
    loadClearingForm () {
      queryClearingForm({ accountSetId: this.accountSet._id }).then(res => {
        this.clearList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '结算方式',
          desc: err.message
        })
      })
    },
    loadReceivableOther () {
      queryReceivableOther({
        filter: {
          accountSetId: this.accountSet._id,
          _id: this.$route.query.id
        },
        isOne: true
      }).then(res => {
        this.formData = res.data
        this.formData.dateTime = new Date(res.data.dateTime)
        this.isCanEdit = res.data.audit === '未审核'
      }).catch(err => {
        this.$Notice.error({
          title: '其他应收单',
          desc: err.message
        })
      })
    },
    loadBalance (id) {
      if (id) {
        queryReceivableReport({
          accountSetId: this.accountSet._id,
          customerId: id
        }).then(res => {
          this.formData.balance = res.data.balance
        }).catch(err => {
          this.$Notice.error({
            title: '客户余额',
            desc: err.message
          })
        })
      }
    },
    save (isAdd) {
      if (!this.judge(isAdd ? '新增' : '修改')) return
      if (isAdd) {
        if (this.$route.query.id) {
          this.$router.replace({
            name: this.$route.name
          })
        } else {
          location.reload()
        }
        return
      }
      this.$refs.formData.validate((valid) => {
        if (valid) {
          let error = ''
          if (this.formData.order.list.length === 0) {
            error = '应收信息必填且至少一条'
          } else {
            this.formData.order.list.forEach((v, i) => {
              if (!v.advanceAccountId || !v.advanceMoney) {
                error = `应收信息第${i + 1}条收入名称和应收金额必填`
              }
            })
          }
          if (error) {
            this.$Message.error(error)
          } else {
            let addList = this.formData.main.list.filter(f => f.advanceAccountId || f.advanceMoney || f.advanceType)
            if (addList.length) {
              this.formData.main.list.forEach((v, i) => {
                if (!v.advanceAccountId || !v.advanceMoney || !v.advanceType) {
                  error = `立即收款金额第${i + 1}条收款账户、收款方式和收款金额必填`
                }
              })
            }
            if (error) {
              this.$Message.error(error)
            } else {
              let payList = this.formData.order.payList.filter(f => f.orderType !== 'receivableOther')
              payList = payList.concat(addList.map(f => {
                return {
                  orderId: null,
                  orderType: '其他应收单',
                  orderCode: null,
                  orderRouter: 'receivableOther',
                  orderMoney: f.advanceMoney
                }
              }))
              let payTotal = payList.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
              payTotal = NP.plus(payTotal, this.formData.main.preferential || 0)
              if (payTotal > this.formData.order.total) {
                error = `应收金额总和小于核销总额，应收金额总和：${this.formData.order.total}，立即收款总和：${this.formData.main.total}，已核销金额：${NP.minus(this.formData.order.total, this.formData.main.total)}`
                this.$Message.error(error)
              } else {
                this.formData.status = payTotal === this.formData.order.total ? '全部核销' : payTotal > 0 ? '部分核销' : '未核销'
                this.formData.order.payList = payList
                this.formData.order.payTotal = payTotal
                if (this.formData._id) {
                  this.formData.editor = this.myUser._id
                  this.formData.eAt = new Date()
                } else {
                  this.formData.creator = this.myUser._id
                  this.formData.cAt = new Date()
                }
                updateReceivableOther(this.formData).then(res => {
                  this.$Message.success(`保存成功`)
                  if (isAdd) {
                    if (this.$route.query.id) {
                      this.$router.replace({
                        name: this.$route.name
                      })
                    } else {
                      location.reload()
                    }
                  } else {
                    if (this.$route.query.id) {
                      location.reload()
                    } else {
                      this.$router.replace({
                        name: this.$route.name,
                        query: { id: res.data.result._id }
                      })
                    }
                  }
                }).catch(err => {
                  this.$Message.error(err.message)
                })
              }
            }
          }
        }
      })
    },
    rowClassName (row, index) {
      return ((row.advanceType !== undefined ? 'm' : 'o') + index) === this.currentRow ? 'active' : ''
    },
    rowClick (row, index) {
      this.currentRow = (row.advanceType !== undefined ? 'm' : 'o') + index
    },
    batchFun (title, id, val) {
      if (title === '反审核') {
        if (this.formData.audit === '未审核') {
          this.$Message.error('该单据未审核')
          return
        } else if (this.formData.credentialsId) {
          this.$Message.error('该单据存在财务凭证')
          return
        } else if (this.formData.credentialsCaseId) {
          this.$Message.error('该单据存在暂存业务凭证')
          return
        } else if (this.formData.main.payTotal) {
          this.$Message.error('已有核销金额')
          return
        }
      }
      this.$Modal.confirm({
        title: `${title}其他应收单`,
        content: `确定${title}其他应收单`,
        onOk: () => {
          batchReceivableOther({
            action: {
              audit: val,
              auditor: val === '已审核' ? this.myUser._id : null,
              aAt: val === '已审核' ? new Date() : null
            },
            ids: [id]
          }).then(res => {
            this.$Message.success(`成功${title}其他应收单`)
            this.loadReceivableOther()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    },
    setList (isAdd, index, which) {
      if (isAdd) {
        if (which === 'order') {
          this.formData[which].list.push({
            advanceAccountId: null,
            advanceMoney: null,
            des: null
          })
        } else {
          this.formData[which].list.push({
            advanceAccountId: null,
            advanceType: null,
            advanceMoney: null,
            transactionNo: null,
            des: null
          })
        }
      } else {
        if (which === 'order' && this.formData[which].list.length === 1) {
          this.$Message.error('至少录入一条应收信息')
        } else {
          this.formData[which].list.splice(index, 1)
        }
      }
    },
    handleSummary ({ columns, data }) {
      const sums = {}
      columns.forEach((column, index) => {
        const key = column.key
        if (index === 0) {
          sums[key] = {
            key,
            value: '合计'
          }
          return
        }
        const values = data.map(item => item[key])
        if (!values.every(value => isNaN(value))) {
          const v = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[key] = {
            key,
            value: this.formatMoney(v, '', 2)
          }
          if (column.title === '收款金额') {
            this.$set(this.formData.main, 'total', NP.plus(v || 0, this.formData.main.preferential || 0))
          } else {
            this.$set(this.formData.order, 'total', v)
          }
        } else {
          sums[key] = {
            key,
            value: ' '
          }
        }
      })
      return sums
    },
    goNav (type) {
      let navList = this.receivableOther
      if (!navList.length) {
        navList = JSON.parse(localStorage.getItem('receivableOther'))
      }
      let index = navList.indexOf(this.$route.query.id)
      let goIndex = null
      switch (type) {
        case 'D':
          if (index <= 0) {
            this.$Message.error('已是当前搜索列表页第一条')
          } else {
            goIndex = 0
          }
          break
        case 'L':
          if (index <= 0) {
            this.$Message.error('已是当前搜索列表页第一条')
          } else {
            goIndex = index - 1
          }
          break
        case 'N':
          if (index >= navList.length - 1) {
            this.$Message.error('已是当前搜索列表页最后一条')
          } else {
            goIndex = navList.length - 1
          }
          break
        case 'Z':
          if (index >= navList.length - 1) {
            this.$Message.error('已是当前搜索列表页最后一条')
          } else {
            goIndex = index + 1
          }
          break
      }
      if (goIndex !== null) {
        this.$router.push({
          name: this.$route.name,
          query: { id: navList[goIndex] }
        })
      }
    }
  }
}
</script>

<style lang="less">
  .input_table {
    .text {
      padding-left: 8px;
    }
    .hover_layer {
      display: none;
    }

    .ivu-table-row:hover,
    .ivu-table-row.active {
      .text {
        display: none;
      }
      .hover_layer {
        display: block;
      }
    }
  }
</style>
