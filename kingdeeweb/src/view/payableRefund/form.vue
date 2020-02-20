<template>
  <div>
    <Row type="flex" justify="space-between">
      <div style="display: flex; align-items: center;">
        <template v-if="$route.query.id">
          审核状态：
          <span :style="{marginRight: '20px', color: formData.audit === '未审核' ? '#ed4014' : '#19be6b'}">
            {{ formData.audit }}
          </span>
        </template>
      </div>
      <div>
        <Button type="primary" style="margin-right: 10px;" @click="save(false)" :disabled="!isCanEdit">保存</Button>
        <Button style="margin-right: 10px;" @click="save(true)" >新增</Button>
        <Button style="margin-right: 10px;" v-if="formData.audit === '未审核'" :disabled="!$route.query.id" @click="batchFun('审核', $route.query.id, '已审核')">审核</Button>
        <Button style="margin-right: 10px;" v-if="formData.audit === '已审核'" :disabled="!$route.query.id" @click="batchFun('反审核', $route.query.id, '未审核')">反审核</Button>
        <Button style="margin-right: 10px;" @click="$router.push({
          name: 'payableRefundList'
        })">历史单据</Button>
        <Button style="margin-right: 10px;" @click="selectOrder(null)">选源单</Button>
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
        <Row type="flex" style="margin-top: 15px">
          <FormItem label="单据编号" style="margin: 0 30px 0 0;" prop="code">
            <Input style="width: 200px" v-model="formData.code" />
          </FormItem>
          <FormItem label="单据日期" style="margin: 0 30px 0 0;" prop="dateTime">
            <DatePicker type="date" style="width: 200px" v-model="formData.dateTime" :clearable="false" format="yyyy-MM-dd" />
          </FormItem>
          <FormItem label="供应商" style="margin: 0 30px 0 0;" prop="supplierId">
            <Select v-model="formData.supplierId" style="width:200px" @on-change="loadBalance">
              <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('supplier', loadSupplier)" style="font-size: 20px; opacity: 0.6" />
              <Option v-for="item in supplierList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
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
          <FormItem label="应退款余额" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" v-model="formData.balance" :disabled="true" />
          </FormItem>
        </Row>
      </Form>
    </Card>

    <Card style="margin-top: 10px;">
      <div slot="title" style="display: flex; align-items: center">
        退款信息
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
    </Card>

    <Card style="margin-top: 10px;">
      <div slot="title">
        源单信息
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
          <Button size="small" @click="setList(false, row._index, 'order')">删除</Button>
        </template>

        <template slot-scope="{ row }" slot="dateTime">
          {{ row.dateTime ? moment(row.dateTime).format('YYYY-MM-DD') : '' }}
        </template>

        <template slot-scope="{ row }" slot="orderType">
          {{ row.orderType }}
        </template>

        <template slot-scope="{ row }" slot="code">
          {{ row.code }}
        </template>

        <template slot-scope="{ row }" slot="des">
          {{ row.des }}
        </template>

        <template slot-scope="{ row }" slot="money">
          {{ row.money ? formatMoney(row.money, '', 2) : '' }}
        </template>

        <template slot-scope="{ row }" slot="payed">
          {{ row.payed ? formatMoney(row.payed, '', 2) : '' }}
        </template>

        <template slot-scope="{ row }" slot="unPayed">
          {{ row.unPayed ? formatMoney(row.unPayed, '', 2) : '' }}
        </template>

        <template slot-scope="{ row }" slot="thisPay">
          <div class="text">{{ row.unPayed ? formatMoney(row.thisPay, '', 2) : '' }}</div>
          <div class="hover_layer">
            <InputNumber
              v-model="formData.order.list[row._index].thisPay"
              :max="row.unPayed"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\ \s?|(,*)/g, '')"
              style="width: 160px" />
          </div>
        </template>

        <template slot-scope="{ row }" slot="payDes">
          <div class="text">{{ row.payDes }}</div>
          <div class="hover_layer">
            <Input v-model="formData.order.list[row._index].payDes" />
          </div>
        </template>
      </Table>
    </Card>

    <orderModel ref="orderModel" @selectOrder="selectOrder" :hasList="formData.order.list" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  parameterPayableRefund,
  updatePayableRefund,
  queryPayableRefund,
  batchPayableRefund
} from '../../api/payableRefund'
import { querySupplier } from '../../api/supplier'
import { queryClerk } from '../../api/clerk'
import { queryDepartment } from '../../api/department'
import { queryBankAccount } from '../../api/bankAccount'
import { queryClearingForm } from '../../api/clearingForm'
import { queryPayableReport } from '../../api/payableReport'
import { queryPayablePayments } from '../../api/payablePayments'
import moment from 'moment'
import NP from 'number-precision'
import { formatMoney } from 'accounting'
import orderModel from './orderModel'
export default {
  name: 'payableRefund',
  components: {
    orderModel
  },
  data () {
    return {
      isCanEdit: true,
      currentRow: null,
      formData: {
        accountSetId: null,
        code: null,
        dateTime: null,
        supplierId: null,
        clerkId: null,
        departmentId: null,
        des: null,
        balance: null,
        main: {
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
          list: [],
          total: null
        },
        audit: '未审核',
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
        supplierId: [
          { required: true, message: '供应商不能为空', trigger: 'change' }
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
          title: '源单日期',
          slot: 'dateTime',
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
          title: '源单类型',
          slot: 'orderType',
          width: 200,
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
          title: '源单单号',
          slot: 'code',
          width: 200,
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
          title: '源单备注',
          slot: 'des',
          width: 200
        },
        {
          title: '源单金额',
          slot: 'money',
          width: 150,
          key: 'money'
        },
        {
          title: '源单已核销金额',
          slot: 'payed',
          width: 150,
          key: 'payed'
        },
        {
          title: '源单未核销金额',
          slot: 'unPayed',
          width: 150,
          key: 'unPayed'
        },
        {
          title: '本次核销金额',
          slot: 'thisPay',
          width: 200,
          key: 'thisPay',
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
          title: '备注',
          slot: 'payDes',
          width: 200
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
          title: '退款账户',
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
          title: '退款方式',
          slot: 'advanceType',
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
          title: '退款金额',
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
          title: '交易号',
          slot: 'transactionNo',
          width: 200
        },
        {
          title: '应付备注',
          slot: 'des',
          width: 300
        },
        {
          title: ' '
        }
      ],
      departmentList: [],
      clerkList: [],
      supplierList: [],
      bankAccountList: [],
      clearList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myUser',
      'myPermission',
      'payableRefund'
    ]),
    getTableWidth () {
      return window.innerWidth - 134
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          if (this.$route.query.id) {
            this.loadPayableRefund()
          } else {
            this.loadParameter()
          }
          this.loadSupplier()
          this.loadClerk()
          this.loadDepartment()
          this.loadBank()
          this.loadClearingForm()
        }
      },
      immediate: true,
      deep: true
    },
    '$route': {
      handler () {
        if (this.$route.name !== 'payableRefund') return
        if (this.accountSet) {
          if (this.$route.query.id && this.$route.query.id !== this.formData._id) {
            this.loadPayableRefund()
          }
          this.loadSupplier()
          this.loadClerk()
          this.loadDepartment()
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
          if (f.title === '预付退款') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}预付退款的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadParameter () {
      let time = this.moment().format('YYYY-MM-DD')
      parameterPayableRefund({
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
          code: `YFKTKD-${time.split('-').join('')}-${total}`,
          dateTime: new Date(),
          supplierId: null,
          clerkId: null,
          departmentId: null,
          des: null,
          balance: null,
          main: {
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
            list: [],
            total: null
          },
          audit: '未审核',
          creator: null,
          auditor: null,
          editor: null,
          cAt: null,
          aAt: null,
          eAt: null,
          custom: null
        }
        if (this.$route.query.pId && this.$route.query.type && this.$route.query.supplierId) {
          switch (this.$route.query.type) {
            case 'payablePayments':
              this.loadPayablePayments()
              break
          }
        }
      }).catch(() => {
        this.$Message.error('获取单据参数出错')
      })
    },
    loadPayablePayments () {
      queryPayablePayments({
        filter: {
          accountSetId: this.accountSet._id,
          _id: { $in: this.$route.query.pId.split(',') }
        },
        pageInfo: {
          limit: 100,
          page: 1
        }
      }).then(res => {
        let list = []
        res.data.list.forEach(f => {
          let unPayed = NP.minus(f.main.total || 0, f.main.payTotal || 0)
          list.push({
            orderId: f._id,
            orderType: '预付款单',
            code: f.code,
            dateTime: f.dateTime,
            des: f.des,
            money: f.main.total || 0,
            payed: f.main.payTotal || 0,
            unPayed: unPayed,
            thisPay: unPayed,
            payDes: null
          })
        })
        this.formData.order = {
          list: [],
          total: null
        }
        this.updateList(list)
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    loadSupplier () {
      querySupplier({ accountSetId: this.accountSet._id }).then(res => {
        this.supplierList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '供应商',
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
    loadBank: function () {
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
    loadPayableRefund () {
      queryPayableRefund({
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
          title: '退款单',
          desc: err.message
        })
      })
    },
    loadBalance (id) {
      if (id) {
        queryPayableReport({
          accountSetId: this.accountSet._id,
          supplierId: id
        }).then(res => {
          this.formData.balance = res.data.balance
        }).catch(err => {
          this.$Notice.error({
            title: '供应商余额',
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
          if (this.formData.main.list.length === 0) {
            error = '退款信息必填且至少一条'
          } else {
            this.formData.main.list.forEach((v, i) => {
              if (!v.advanceAccountId || !v.advanceMoney || !v.advanceType) {
                error = `退款信息第${i + 1}条退款账户、退款方式和退款金额必填`
              }
            })
          }
          if (error) {
            this.$Message.error(error)
          } else {
            let addList = this.formData.order.list.filter(f => f.orderId || f.thisPay || f.payDes)
            if (addList.length) {
              this.formData.order.list.forEach((v, i) => {
                if (!v.orderId || !v.thisPay) {
                  error = `源单信息第${i + 1}条本次核销金额必填`
                }
              })
            }
            if (error) {
              this.$Message.error(error)
            } else {
              if (this.formData.order.total !== this.formData.main.total) {
                this.$Message.error('核销总金额不等于本次退款总金额')
              } else {
                if (this.formData._id) {
                  this.formData.editor = this.myUser._id
                  this.formData.eAt = new Date()
                } else {
                  this.formData.creator = this.myUser._id
                  this.formData.cAt = new Date()
                }
                updatePayableRefund(this.formData).then(res => {
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
      if (!this.judge(title)) return
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
        }
      }
      this.$Modal.confirm({
        title: `${title}预付退款单`,
        content: `确定${title}预付退款单`,
        onOk: () => {
          batchPayableRefund({
            action: {
              audit: val,
              auditor: val === '已审核' ? this.myUser._id : null,
              aAt: val === '已审核' ? new Date() : null
            },
            ids: [id]
          }).then(res => {
            this.$Message.success(`成功${title}预付退款单`)
            this.loadPayableRefund()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    },
    setList (isAdd, index, which) {
      if (isAdd) {
        this.formData[which].list.push({
          advanceAccountId: null,
          advanceType: null,
          advanceMoney: null,
          transactionNo: null,
          des: null
        })
      } else {
        if (which === 'main' && this.formData[which].list.length === 1) {
          this.$Message.error('至少录入一条退款信息')
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
          if (key === 'thisPay') {
            this.$set(this.formData.order, 'total', this.formatMoney(v, '', 2))
          } else if (key === 'advanceMoney') {
            this.$set(this.formData.main, 'total', this.formatMoney(v, '', 2))
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
    selectOrder (changeList) {
      if (changeList) {
        let list = JSON.parse(JSON.stringify(changeList))
        this.updateList(list)
      } else {
        if (this.formData.supplierId) {
          this.$refs.orderModel.show(this.formData.supplierId)
        } else {
          this.$Message.error('请选择供应商')
        }
      }
    },
    updateList (list) {
      this.formData.order.list = this.formData.order.list.concat(list)
    },
    goNav (type) {
      let navList = this.payableRefund
      if (!navList.length) {
        navList = JSON.parse(localStorage.getItem('payableRefund'))
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
