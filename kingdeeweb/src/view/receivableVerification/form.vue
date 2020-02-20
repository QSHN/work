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
          name: 'receivableVerificationList'
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
        <Row type="flex" style="margin-top: 15px">
          <FormItem label="单据编号" style="margin: 0 30px 0 0;" prop="code">
            <Input style="width: 200px" v-model="formData.code" />
          </FormItem>
          <FormItem label="单据日期" style="margin: 0 30px 0 0;" prop="dateTime">
            <DatePicker type="date" style="width: 200px" v-model="formData.dateTime" :clearable="false" format="yyyy-MM-dd" />
          </FormItem>
          <FormItem label="核销类型" style="margin: 0 30px 0 0;">
            <Select v-model="formData.orderType" style="width:200px" @on-change="initFormData">
              <Option v-for="item in verificationType" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </FormItem>
          <template v-if="formData.orderType === '预收冲应收' || formData.orderType === '应收冲应付'">
            <FormItem label="客户" style="margin: 0 30px 0 0;">
              <Select v-model="formData.customerId" style="width:200px">
                <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('customer', loadCustomer)" style="font-size: 20px; opacity: 0.6" />
                <Option v-for="item in customerList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="客户-部门" style="margin: 0 30px 0 0;">
              <Select v-model="formData.customerDepartmentId" style="width:200px">
                <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('department', loadDepartment)" style="font-size: 20px; opacity: 0.6" />
                <Option v-for="item in departmentList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="客户-业务员" style="margin: 0 30px 0 0;">
              <Select v-model="formData.customerClerkId" style="width:200px">
                <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('clerk', loadClerk)" style="font-size: 20px; opacity: 0.6" />
                <Option v-for="item in clerkList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
              </Select>
            </FormItem>
          </template>
          <template v-else>
            <FormItem label="供应商" style="margin: 0 30px 0 0;">
              <Select v-model="formData.supplierId" style="width:200px">
                <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('supplier', loadSupplier)" style="font-size: 20px; opacity: 0.6" />
                <Option v-for="item in supplierList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="供应商-部门" style="margin: 0 30px 0 0;">
              <Select v-model="formData.supplierDepartmentId" style="width:200px">
                <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('department', loadDepartment)" style="font-size: 20px; opacity: 0.6" />
                <Option v-for="item in departmentList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="供应商-业务员" style="margin: 0 30px 0 0;">
              <Select v-model="formData.supplierClerkId" style="width:200px">
                <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('clerk', loadClerk)" style="font-size: 20px; opacity: 0.6" />
                <Option v-for="item in clerkList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
              </Select>
            </FormItem>
          </template>
        </Row>

        <Row type="flex" style="margin-top: 15px">
          <template v-if="formData.orderType === '应收冲应付'">
            <FormItem label="供应商" style="margin: 0 30px 0 0;">
              <Select v-model="formData.supplierId" style="width:200px">
                <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('supplier', loadSupplier)" style="font-size: 20px; opacity: 0.6" />
                <Option v-for="item in supplierList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="供应商部门" style="margin: 0 30px 0 0;">
              <Select v-model="formData.supplierDepartmentId" style="width:200px">
                <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('department', loadDepartment)" style="font-size: 20px; opacity: 0.6" />
                <Option v-for="item in departmentList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="供应商业务员" style="margin: 0 30px 0 0;">
              <Select v-model="formData.supplierClerkId" style="width:200px">
                <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('clerk', loadClerk)" style="font-size: 20px; opacity: 0.6" />
                <Option v-for="item in clerkList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
              </Select>
            </FormItem>
          </template>
          <FormItem label="单据备注" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" v-model="formData.des" />
          </FormItem>
        </Row>
      </Form>
    </Card>

    <Card style="margin-top: 10px;">
      <div slot="title" style="display: flex; align-items: center">
        {{formData.orderType === '预收冲应收' ? '预收单据' : formData.orderType === '预付冲应付' ? '预付单据' : '应收单据'}}
        <Button style="margin-left: 20px;" @click="selectOrder(formData.orderType === '预收冲应收' ? '预收单据' : formData.orderType === '预付冲应付' ? '预付单据' : '应收单据', null)">选源单</Button>
      </div>

      <Table :width="getTableWidth"
             border
             :columns="columns"
             :data="formData.main.list"
             @on-row-click="rowClick"
             :row-class-name="rowClassName"
             show-summary
             :summary-method="handleSummary"
             class="input_table">
        <template slot-scope="{ row }" slot="action">
          <Button size="small" @click="setList(row._index, 'main')">删除</Button>
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
              v-model="formData.main.list[row._index].thisPay"
              :max="row.unPayed"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\ \s?|(,*)/g, '')"
              style="width: 160px" />
          </div>
        </template>

        <template slot-scope="{ row }" slot="payDes">
          <div class="text">{{ row.payDes }}</div>
          <div class="hover_layer">
            <Input v-model="formData.main.list[row._index].payDes" />
          </div>
        </template>
      </Table>
    </Card>

    <Card style="margin-top: 10px;">
      <div slot="title">
        {{formData.orderType === '预收冲应收' ? '应收单据' : '应付单据'}}
        <Button style="margin-left: 20px;" @click="selectOrder(formData.orderType === '预收冲应收' ? '应收单据' : '应付单据', null)">选源单</Button>
      </div>

      <Table :width="getTableWidth"
             border
             :columns="bluntColumns"
             :data="formData.blunt.list"
             @on-row-click="rowClick"
             :row-class-name="rowClassName"
             show-summary
             :summary-method="handleSummary"
             class="input_table">
        <template slot-scope="{ row }" slot="action">
          <Button size="small" @click="setList(row._index, 'blunt')">删除</Button>
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
              v-model="formData.blunt.list[row._index].thisPay"
              :max="row.unPayed"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\ \s?|(,*)/g, '')"
              style="width: 160px" />
          </div>
        </template>

        <template slot-scope="{ row }" slot="payDes">
          <div class="text">{{ row.payDes }}</div>
          <div class="hover_layer">
            <Input v-model="formData.blunt.list[row._index].payDes" />
          </div>
        </template>
      </Table>
    </Card>

    <orderModel ref="orderModel" @selectOrder="selectOrder"/>
    <selectInfoModel ref="selectInfoModel" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  parameterReceivableVerification,
  updateReceivableVerification,
  queryReceivableVerification,
  batchReceivableVerification
} from '../../api/receivableVerification'
import { querySupplier } from '../../api/supplier'
import { queryCustomer } from '../../api/customer'
import { queryClerk } from '../../api/clerk'
import { queryDepartment } from '../../api/department'
import moment from 'moment'
// import NP from 'number-precision'
import { formatMoney } from 'accounting'
import orderModel from './orderModel'
import selectInfoModel from '../../components/selectInfo/model'
export default {
  name: 'receivableVerification',
  components: {
    orderModel,
    selectInfoModel
  },
  data () {
    return {
      isCanEdit: true,
      currentRow: null,
      verificationType: ['预收冲应收', '预付冲应付', '应收冲应付'],
      formData: {
        accountSetId: null,
        code: null,
        dateTime: null,
        orderType: '预收冲应收',
        customerId: null,
        customerClerkId: null,
        customerDepartmentId: null,
        supplierId: null,
        supplierClerkId: null,
        supplierDepartmentId: null,
        des: null,
        main: {
          list: [],
          total: null
        },
        blunt: {
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
        ]
      },
      columns: [
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
          which: 'main',
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
      bluntColumns: [
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
          which: 'blunt',
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
      departmentList: [],
      clerkList: [],
      customerList: [],
      supplierList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myUser',
      'myPermission',
      'receivableVerification'
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
            this.loadReceivableVerification()
          } else {
            this.loadParameter()
          }
          this.loadCustomer()
          this.loadSupplier()
          this.loadClerk()
          this.loadDepartment()
        }
      },
      immediate: true,
      deep: true
    },
    '$route': {
      handler () {
        if (this.$route.name !== 'receivableVerification') return
        if (this.accountSet) {
          if (this.$route.query.id && this.$route.query.id !== this.formData._id) {
            this.loadReceivableVerification()
          }
          this.loadCustomer()
          this.loadSupplier()
          this.loadClerk()
          this.loadDepartment()
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
          if (f.title === '核销') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}核销的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadParameter () {
      let time = this.moment().format('YYYY-MM-DD')
      parameterReceivableVerification({
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
          code: `HXD-${time.split('-').join('')}-${total}`,
          dateTime: new Date(),
          orderType: '预收冲应收',
          customerId: null,
          customerClerkId: null,
          customerDepartmentId: null,
          supplierId: null,
          supplierClerkId: null,
          supplierDepartmentId: null,
          des: null,
          main: {
            list: [],
            total: null
          },
          blunt: {
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
      }).catch(() => {
        this.$Message.error('获取单据参数出错')
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
    loadReceivableVerification () {
      queryReceivableVerification({
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
          let mainTitle = this.formData.orderType === '预收冲应收' ? '预收单据' : this.formData.orderType === '预付冲应付' ? '预付单据' : '应收单据'
          let bluntTitle = this.formData.orderType === '预收冲应收' ? '应收单据' : '应付单据'
          if (this.formData.main.list.length === 0) {
            error = mainTitle + '必填且至少一条'
          } else {
            this.formData.main.list.forEach((v, i) => {
              if (!v.orderId || !v.thisPay) {
                error = mainTitle + `第${i + 1}条本次核销金额必填`
              }
            })
          }
          if (this.formData.blunt.list.length === 0) {
            error = bluntTitle + '必填且至少一条'
          } else {
            this.formData.blunt.list.forEach((v, i) => {
              if (!v.orderId || !v.thisPay) {
                error = bluntTitle + `第${i + 1}条本次核销金额必填`
              }
            })
          }
          if (error) {
            this.$Message.error(error)
          } else {
            if (this.formData.main.total !== this.formData.blunt.total) {
              this.$Message.error(`${mainTitle}核销总金额不等于${bluntTitle}核销总金额`)
            } else {
              if (this.formData._id) {
                this.formData.editor = this.myUser._id
                this.formData.eAt = new Date()
              } else {
                this.formData.creator = this.myUser._id
                this.formData.cAt = new Date()
              }
              updateReceivableVerification(this.formData).then(res => {
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
      })
    },
    rowClassName (row, index) {
      return row.orderType + index === this.currentRow ? 'active' : ''
    },
    rowClick (row, index) {
      this.currentRow = row.orderType + index
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
        title: `${title}核销单`,
        content: `确定${title}核销单`,
        onOk: () => {
          batchReceivableVerification({
            action: {
              audit: val,
              auditor: val === '已审核' ? this.myUser._id : null,
              aAt: val === '已审核' ? new Date() : null
            },
            ids: [id]
          }).then(res => {
            this.$Message.success(`成功${title}核销单`)
            this.loadReceivableVerification()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    },
    setList (index, which) {
      if (this.formData[which].list.length === 1) {
        this.$Message.error('至少录入一条信息')
      } else {
        this.formData[which].list.splice(index, 1)
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
          if (column.which) {
            this.$set(this.formData[column.which], 'total', this.formatMoney(v, '', 2))
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
    selectOrder (type, changeList = null) {
      let obj = {}
      switch (type) {
        case '预收单据':
          obj = {
            type,
            id: this.formData.customerId,
            which: 'main',
            list: this.formData.main.list,
            orderType: '预收款单'
          }
          break
        case '预付单据':
          obj = {
            type,
            id: this.formData.supplierId,
            which: 'main',
            list: this.formData.main.list,
            orderType: '预付款单'
          }
          break
        case '应收单据':
          obj = {
            type,
            id: this.formData.customerId,
            which: this.formData.orderType === '应收冲应付' ? 'main' : 'blunt',
            list: this.formData.orderType === '应收冲应付' ? this.formData.main.list : this.formData.blunt.list,
            orderType: '其他应收单'
          }
          break
        case '应付单据':
          obj = {
            type,
            id: this.formData.supplierId,
            which: 'blunt',
            list: this.formData.blunt.list,
            orderType: '其他应付单'
          }
          break
      }
      if (changeList) {
        let list = JSON.parse(JSON.stringify(changeList))
        this.updateList(obj.which, list)
      } else {
        if (obj.id) {
          this.$refs.orderModel.show(obj)
        } else {
          this.$Message.error('请选择' + (obj.orderType.includes('收') ? '客户' : '供应商'))
        }
      }
    },
    updateList (which, list) {
      this.formData[which].list = this.formData[which].list.concat(list)
    },
    initFormData () {
      this.formData.customerId = null
      this.formData.customerDepartmentId = null
      this.formData.customerClerkId = null
      this.formData.supplierId = null
      this.formData.supplierDepartmentId = null
      this.formData.supplierClerkId = null
      this.formData.main = {
        list: [],
        total: null
      }
      this.formData.blunt = {
        list: [],
        total: null
      }
    },
    goNav (type) {
      let navList = this.receivableVerification
      if (!navList.length) {
        navList = JSON.parse(localStorage.getItem('receivableVerification'))
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
