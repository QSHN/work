<template>
  <div>
    <Row type="flex" justify="space-between">
      <div style="display: flex; align-items: center;">
        <template v-if="$route.query.id">
          审核状态：
          <span :style="{marginRight: '20px', color: formData.audit === '未审核' ? '#ed4014' : '#19be6b'}">
            {{ formData.audit }}
          </span>
          关闭状态：
          <span :style="{marginRight: '20px', color: formData.close === '未关闭' ? '#ed4014' : '#19be6b'}">
            {{ formData.close }}
          </span>
          出库状态：
          <span :style="{marginRight: '20px', color: formData.storage === '未出库' ? '#ed4014' : '#19be6b'}">
            {{ formData.storage }}
          </span>
        </template>
      </div>
      <div>
        <Button type="primary" style="margin-right: 10px;" @click="save(false)" :disabled="!isCanEdit">保存</Button>
        <Button style="margin-right: 10px;" @click="save(true)" >新增</Button>
        <Button style="margin-right: 10px;" v-if="formData.audit === '未审核'" :disabled="!$route.query.id" @click="batchFun('审核', $route.query.id, '已审核')">审核</Button>
        <Button style="margin-right: 10px;" v-if="formData.audit === '已审核'" :disabled="!$route.query.id" @click="batchFun('反审核', $route.query.id, '未审核')">反审核</Button>
        <Button style="margin-right: 10px;" @click="$router.push({
          name: 'salesOrderList'
        })">历史单据</Button>
        <Button style="margin-right: 10px;" :disabled="formData.audit !== '已审核'" @click="go">出库</Button>
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
          <FormItem label="单据编号" style="margin: 0 30px 0 0;" prop="code">
            <Input style="width: 200px" v-model="formData.code" />
          </FormItem>
          <FormItem label="单据日期" style="margin: 0 30px 0 0;" prop="dateTime">
            <DatePicker type="date" style="width: 200px" v-model="formData.dateTime" :clearable="false" format="yyyy-MM-dd" />
          </FormItem>
          <FormItem label="客户" style="margin: 0 30px 0 0;" prop="customerId">
            <Select v-model="formData.customerId" style="width:200px">
              <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('customer', loadCustomer)" style="font-size: 20px; opacity: 0.6" />
              <Option v-for="item in customerList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="业务员" style="margin: 0 30px 0 0;">
            <Select v-model="formData.clerkId" style="width:200px">
              <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('clerk', loadClerk)" style="font-size: 20px; opacity: 0.6" />
              <Option v-for="item in clerkList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="部门" style="margin: 0 30px 0 0;">
            <Select v-model="formData.departmentId" style="width:200px">
              <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('department', loadDepartment)" style="font-size: 20px; opacity: 0.6" />
              <Option v-for="item in departmentList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
        </Row>
      </Form>
    </Card>

    <Card style="margin-top: 10px;">
      <Row>
        <Button style="margin-right: 10px;" @click="addCommodity(true)">添加商品</Button>
        <span style="font-size: 12px; margin-right: 5px;">整单折扣额</span>
        <InputNumber :min="0" :step="0.01" style="width: 100px; margin-right: 20px;" v-model="formData.discount" @on-blur="disCount('discount')" />
        <span style="font-size: 12px; margin-right: 5px;">整单折扣率%</span>
        <InputNumber :min="0" :step="0.01" style="width: 100px; margin-right: 20px;" v-model="formData.discountRate" @on-blur="disCount('discountRate')" />
        <span style="font-size: 12px; margin-right: 5px;">预计销售费用: {{ formatMoney(getSalesExpense, '', 2) }}</span>
        <Button size="small" @click="salesExpense(false)">更改</Button>
      </Row>

      <Table height="350"
             border
             :columns="columns"
             :data="formData.list"
             @on-row-click="rowClick"
             :row-class-name="rowClassName"
             show-summary
             :summary-method="handleSummary"
             class="input_table"
             style="margin-top: 10px;">
        <template slot-scope="{ row }" slot="action">
          <div class="text" style="padding-left: 0;">{{ row._index + 1 }}</div>
          <div class="hover_layer">
            <Icon type="md-add-circle" style="font-size: 20px; color: #348EED; cursor: pointer;" @click="addCommodity(true)" />
            <Icon type="md-remove-circle" style="font-size: 20px; color: #ed3f14; cursor: pointer;" @click="formData.list.splice(row._index, 1)" />
          </div>
        </template>

        <template slot-scope="{ row }" slot="code">
          {{ row.code }}
        </template>
        <template slot-scope="{ row }" slot="name">
          {{ row.name }}
        </template>
        <template slot-scope="{ row }" slot="auxiliary">
          {{ row.auxiliary }}
        </template>
        <template slot-scope="{ row }" slot="warehouseId">
          <div class="text">{{ warehouseList.find(f => f._id === row.warehouseId) && warehouseList.find(f => f._id === row.warehouseId).name }}</div>
          <div class="hover_layer">
            <Select v-model="formData.list[row._index].warehouseId">
              <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('warehouse', loadWarehouse)" style="font-size: 20px; opacity: 0.6" />
              <Option v-for="item in warehouseList" :value="item._id" :key="item._id">
                {{ item.name }}
                ( 库存数量: {{ getInventory(warehouseList.find(f => f._id === item._id), row, true) }} )
              </Option>
            </Select>
          </div>
        </template>
        <template slot-scope="{ row }" slot="inventory">
          {{ getInventory(warehouseList.find(f => f._id === row.warehouseId), row) }}
        </template>
        <template slot-scope="{ row }" slot="unit">
          <div class="text">{{ row.unit }}</div>
          <div class="hover_layer">
            <Select v-model="formData.list[row._index].unit" @on-change="changeUnit($event, row.unit, row._index)">
              <Option v-for="(item, i) in row.unitList" :value="item.name" :key="i">{{ item.name }}</Option>
            </Select>
          </div>
        </template>
        <template slot-scope="{ row }" slot="number">
          <div class="text">{{ row.number }}</div>
          <div class="hover_layer">
            <InputNumber
              v-model="formData.list[row._index].number"
              :min="0"
              :step="1"
              style="width: 110px"
              @on-blur="changePrice(row._index)"/>
          </div>
        </template>
        <template slot-scope="{ row }" slot="package">
          <div class="text">{{ row.package }}</div>
          <div class="hover_layer">
            <Poptip placement="bottom-start">
              <Input :value="row.package" readonly />
              <div slot="content">
                <ul class="package_ul">
                  <li v-for="(v, i) in row.packageList" :key="i">
                    <span style="width: 30%; padding: 0 5px;">{{ v.name }}</span>
                    <InputNumber
                      v-model="formData.list[row._index].packageList[i].number"
                      :min="0"
                      :step="1"
                      style="display: flex; flex-grow: 1;"
                      @on-blur="changePackage(row._index)"/>
                  </li>
                </ul>
              </div>
            </Poptip>
          </div>
        </template>
        <template slot-scope="{ row }" slot="conversionRate">
          <div v-for="(v, i) in row.unitList" :key="i" v-if="i > 0">1 {{ v.name }} = {{ v.equation }} {{ row.unitList[0].name }}</div>
        </template>
        <template slot-scope="{ row }" slot="price">
          <div class="text">{{ row.price ? formatMoney(row.price, '', 2) : '' }}</div>
          <div class="hover_layer">
            <Poptip placement="bottom-start">
              <InputNumber
                v-model="formData.list[row._index].price"
                :min="0"
                :step="0.01"
                style="width: 110px"
                @on-blur="changePrice(row._index)"/>

              <div slot="content">
                <ul>
                  <li v-for="(v, i) in getPriceAuto(row)" :key="i">
                    {{ v.title }} {{ v.price }}
                  </li>
                </ul>
              </div>
            </Poptip>
          </div>
        </template>
        <template slot-scope="{ row }" slot="unitPrice">
          {{ row.unitPrice || '' }}
        </template>
        <template slot-scope="{ row }" slot="taxRate">
          <div class="text">{{ formatMoney(row.taxRate, '', 2) }}</div>
          <div class="hover_layer">
            <InputNumber
              v-model="formData.list[row._index].taxRate"
              :min="0"
              :step="1"
              style="width: 110px"
              @on-blur="changePrice(row._index)" />
          </div>
        </template>
        <template slot-scope="{ row }" slot="payable">
          {{ row.payable ? formatMoney(row.payable, '', 2) : '' }}
        </template>
        <template slot-scope="{ row }" slot="payableTotal">
          {{ row.payableTotal ? formatMoney(row.payableTotal, '', 2) : '' }}
        </template>
        <template slot-scope="{ row }" slot="deliveryDate">
          <div class="text">{{ row.deliveryDate ? moment(row.deliveryDate).format('YYYY-MM-DD') : '' }}</div>
          <div class="hover_layer">
            <DatePicker type="date" v-model="formData.list[row._index].deliveryDate" :clearable="false" format="yyyy-MM-dd" />
          </div>
        </template>
        <template slot-scope="{ row }" slot="commodityDes">
          <div class="text">{{ row.commodityDes || '' }}</div>
          <div class="hover_layer">
            <Input v-model="formData.list[row._index].commodityDes" />
          </div>
        </template>
      </Table>

      <Row style="margin-top: 10px;">
        <span>预收定金</span>
        <Select v-model="formData.advanceAccountId" placeholder="收款账号" style="width: 150px; margin-left: 10px;">
          <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('bankAccount', loadBank)" style="font-size: 20px; opacity: 0.6" />
          <Option v-for="item in bankAccountList" :value="item._id" :key="item._id">{{ item.name }}</Option>
        </Select>
        <Select v-model="formData.advanceType" placeholder="收款方式" style="width: 150px; margin-left: 10px;">
          <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('clearingForm', loadClearingForm)" style="font-size: 20px; opacity: 0.6" />
          <Option v-for="item in clearList" :value="item._id" :key="item._id">{{ item.name }}</Option>
        </Select>
        <Input style="width: 100px; margin-left: 10px;" v-model="formData.advanceMoney" @on-blur="advanceMoney" />
<!--        <Button style="margin-left: 10px;" :disabled="true">多账户收款</Button>-->
        <Button style="margin-left: 10px;" @click="createAdvance">生成预收单</Button>
      </Row>

      <Row type="flex" justify="end" align="middle" style="margin-top: 10px; border-top: 1px solid #dcdee2; padding-top: 10px;">
        <span>本单成交金额</span>
        <span style="margin: 0 20px 0 5px;">{{ formatMoney(formData.payable || 0, '', 2) }}</span>
        <span>订金金额</span>
        <span style="margin: 0 20px 0 5px;">{{ formatMoney(formData.deposit || 0, '', 2) }}</span>
        <span>订金比率%</span>
        <span style="margin: 0 20px 0 5px;">{{ formatMoney(formData.depositRat || 0, '', 2) }}</span>
      </Row>
    </Card>

    <Card style="margin-top: 10px;">
      <div slot="title" style="display: flex; align-items: center">
        附件
        <span style="font-size: 12px; margin-left: 30px;">附件数</span>
        <InputNumber :min="0" :step="1"  style="width: 100px; margin-left: 10px;" v-model="formData.filesNum" />
      </div>

      <upload-file v-model="formData.files" :multiple="20"/>
    </Card>

    <advanceModal ref="advanceModal" :customerList="customerList" :spendingList="spendingList" @salesExpense="salesExpense" @loadSpendingCategory="loadSpendingCategory" @loadCustomer="loadCustomer" />
    <commodityModal ref="commodityModal" @addCommodity="addCommodity" />
    <selectInfoModel ref="selectInfoModel" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  parameterSalesOrder,
  updateSalesOrder,
  querySalesOrder,
  batchSalesOrder
} from '../../api/salesOrder'
import { queryCustomer } from '../../api/customer'
import { queryClerk } from '../../api/clerk'
import { queryDepartment } from '../../api/department'
import { querySpendingCategory } from '../../api/spendingCategory'
import { commodityPricesHistory } from '../../api/commodityPrices'
import { queryWarehouse } from '../../api/warehouse'
import { queryBankAccount } from '../../api/bankAccount'
import { queryClearingForm } from '../../api/clearingForm'
import advanceModal from './advance'
import commodityModal from '../../components/commodity/index'
import moment from 'moment'
import NP from 'number-precision'
import { formatMoney } from 'accounting'
import UploadFile from '../../components/upload/upload-file'
import selectInfoModel from '../../components/selectInfo/model'
export default {
  name: 'salesOrder',
  components: {
    advanceModal,
    commodityModal,
    UploadFile,
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
        customerId: null,
        clerkId: null,
        departmentId: null,
        discount: null,
        discountRate: null,
        salesExpense: [],
        list: [],
        des: null,
        advanceAccountId: null,
        advanceType: null,
        advanceMoney: null,
        advanceMore: [],
        payable: null,
        deposit: null,
        depositRat: null,
        filesNum: null,
        files: [],
        audit: '未审核',
        close: '未关闭',
        storage: '未出库',
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
      columns: [
        {
          title: ' ',
          width: 80,
          fixed: 'left',
          slot: 'action',
          align: 'center',
          key: 'action'
        },
        {
          title: '商品编码',
          width: 150,
          resizable: true,
          slot: 'code',
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
          title: '商品名称',
          width: 150,
          resizable: true,
          slot: 'name',
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
          title: '商品属性',
          width: 150,
          resizable: true,
          slot: 'auxiliary'
        },
        {
          title: '仓库',
          width: 200,
          resizable: true,
          slot: 'warehouseId'
        },
        {
          title: '库存数量',
          width: 150,
          resizable: true,
          slot: 'inventory'
        },
        {
          title: '单位',
          width: 150,
          resizable: true,
          slot: 'unit',
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
          title: '数量',
          width: 150,
          resizable: true,
          slot: 'number',
          key: 'number',
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
          title: '整件散包',
          width: 200,
          resizable: true,
          slot: 'package'
        },
        {
          title: '换算率',
          width: 200,
          resizable: true,
          slot: 'conversionRate'
        },
        {
          title: '单价',
          width: 150,
          resizable: true,
          slot: 'price'
        },
        {
          title: '含税单价',
          width: 150,
          resizable: true,
          slot: 'unitPrice'
        },
        {
          title: '增值税税率%',
          width: 150,
          resizable: true,
          slot: 'taxRate'
        },
        {
          title: '税额',
          width: 150,
          resizable: true,
          slot: 'payable',
          key: 'payable'
        },
        {
          title: '价税合计',
          width: 150,
          resizable: true,
          slot: 'payableTotal',
          key: 'payableTotal'
        },
        {
          title: '交货日期',
          width: 200,
          resizable: true,
          slot: 'deliveryDate'
        },
        {
          title: '商品行备注',
          width: 150,
          resizable: true,
          slot: 'commodityDes'
        }
      ],
      departmentList: [],
      clerkList: [],
      customerList: [],
      spendingList: [],
      priceList: [],
      warehouseList: [],
      bankAccountList: [],
      clearList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'salesOrder'
    ]),
    getSalesExpense () {
      let money = 0
      if (this.formData.salesExpense.length) {
        money = this.formData.salesExpense.reduce((total, v) => (
          total = NP.plus(total, v.money || 0)
        ), 0)
      }
      return money
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          if (this.$route.query.id) {
            this.loadSalesOrder()
          } else {
            this.loadParameter()
          }
          this.loadCustomer()
          this.loadClerk()
          this.loadDepartment()
          this.loadSpendingCategory()
          this.loadWarehouse()
          this.loadBank()
          this.loadClearingForm()
        }
      },
      immediate: true,
      deep: true
    },
    'formData.files': {
      handler (val, oldVal) {
        if (val !== oldVal) this.formData.filesNum = this.formData.files.length
      }
    },
    '$route': {
      handler () {
        if (this.$route.name !== 'salesOrder') return
        if (this.accountSet) {
          if (this.$route.query.id && this.$route.query.id !== this.formData._id) {
            this.loadSalesOrder()
          }
          this.loadCustomer()
          this.loadClerk()
          this.loadDepartment()
          this.loadSpendingCategory()
          this.loadWarehouse()
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
          if (f.title === '销售订单') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}销售订单的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadParameter () {
      let time = this.moment().format('YYYY-MM-DD')
      parameterSalesOrder({
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
          code: `XSDD-${time.split('-').join('')}-${total}`,
          dateTime: new Date(),
          customerId: null,
          clerkId: null,
          departmentId: null,
          discount: null,
          discountRate: null,
          salesExpense: [],
          list: [],
          des: null,
          advanceAccountId: null,
          advanceType: null,
          advanceMoney: null,
          advanceMore: [],
          payable: null,
          deposit: null,
          depositRat: null,
          filesNum: null,
          files: [],
          audit: '未审核',
          close: '未关闭',
          storage: '未出库',
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
    loadSpendingCategory () {
      querySpendingCategory({ accountSetId: this.accountSet._id }).then(res => {
        this.spendingList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '支出类别',
          desc: err.message
        })
      })
    },
    loadWarehouse () {
      queryWarehouse({ accountSetId: this.accountSet._id }).then(res => {
        this.warehouseList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
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
    loadPrice (list = []) {
      let pList = list.filter(f => !this.priceList.find(p => p.commodityId === f.commodityId && p.auxiliary === f.auxiliary && p.unit === f.unit))
      if (pList.length) {
        commodityPricesHistory(list).then(res => {
          this.priceList = this.priceList.concat(res.data || [])
        }).catch(err => {
          this.$Notice.error({
            title: '获取商品价格信息失败',
            desc: err.message
          })
        })
      }
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
    loadSalesOrder () {
      querySalesOrder({
        filter: {
          accountSetId: this.accountSet._id,
          _id: this.$route.query.id
        },
        isOne: true
      }).then(res => {
        this.formData = res.data
        this.formData.dateTime = new Date(res.data.dateTime)
        this.formData.list.forEach(f => {
          if (f.deliveryDate) f.deliveryDate = new Date(f.deliveryDate)
        })
        this.isCanEdit = res.data.audit === '未审核' && res.data.close === '未关闭' && res.data.storage === '未出库'
      }).catch(err => {
        this.$Notice.error({
          title: '销售订单',
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
          if (this.formData.list.length === 0) {
            this.$Message.error('请添加销售商品')
          } else if (this.formData.list.filter(f =>
            !f.commodityId ||
            !f.unit ||
            !f.number
          ).length) {
            this.$Message.error(`销售商品的标记红点的项必录，请检查！`)
          } else {
            updateSalesOrder(this.formData).then(res => {
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
      })
    },
    salesExpense (changeList) {
      if (changeList) {
        this.formData.salesExpense = JSON.parse(JSON.stringify(changeList))
      } else {
        if (this.formData.customerId) {
          this.$refs.advanceModal.show(this.formData.salesExpense, this.formData.customerId)
        } else {
          this.$Message.error('请选择客户')
        }
      }
    },
    rowClassName (row, index) {
      return index === this.currentRow ? 'active' : ''
    },
    rowClick (row, index) {
      this.currentRow = index
    },
    addCommodity (bool, list = []) {
      if (bool && list.length) {
        let pList = []
        list.forEach(v => {
          v.measureUnit.conversion.forEach(f => {
            pList.push({
              commodityId: v._id,
              auxiliary: v.auxiliary,
              unit: f.name
            })
          })
        })
        this.loadPrice(pList)
        this.formData.list = this.formData.list.concat(list.map(v => {
          return {
            commodityId: v._id,
            code: v.code,
            name: v.name,
            auxiliary: v.auxiliary,
            groupId: v.groupId,
            unit: v.unit,
            unitList: v.measureUnit.conversion,
            warehouseId: null,
            inventory: null,
            number: null,
            outStorage: null,
            unStorage: null,
            reStorage: null,
            price: null,
            unitPrice: null,
            taxRate: 13,
            payable: null,
            payableTotal: null,
            deliveryDate: null,
            commodityDes: null,
            isBatch: v.character.batch,
            isShelfLife: v.character.shelfLife,
            batch: '',
            shelfLifeDays: v.character.shelfLife ? v.character.shelfLifeData.shelfLifeDays || 0 : null,
            generateDate: null,
            effectiveDate: null,
            package: null,
            packageNumber: null,
            packageList: v.measureUnit.conversion.map(m => Object.assign({ number: null }, m))
          }
        }))
      } else {
        this.$refs.commodityModal.show(bool)
      }
    },
    getInventory (warehouse, row, isUpdate = true) {
      let num = 0
      if (warehouse) {
        warehouse.inventoryList.forEach(f => {
          if (
            f.commodityId === row.commodityId &&
            (!f.auxiliary || (f.auxiliary === row.auxiliary)) &&
            (!row.batch || (f.batch && f.batch === row.batch)) &&
            (!row.generateDate || (f.generateDate && this.moment(f.generateDate).isSame(this.moment(row.generateDate), 'day'))) &&
            (!row.shelfLifeDays || (f.shelfLifeDays && f.shelfLifeDays === row.shelfLifeDays))
          ) {
            num = NP.plus(num, f.inventory || 0)
          }
        })
      }
      if (row.unit) {
        let equation = row.unitList.find(v => v.name === row.unit).equation
        num = NP.times(num, equation)
      }
      if (isUpdate) this.$set(this.formData.list[row._index], 'inventory', num)
      return num
    },
    changePrice (index) {
      let data = this.formData.list[index]
      if (data.price !== null) {
        this.$set(this.formData.list[index], 'unitPrice', NP.times(data.price, (1 + NP.divide(data.taxRate, 100))))
        if (data.number !== null) {
          this.$set(this.formData.list[index], 'payable', NP.times(data.number, NP.times(data.price, NP.divide(data.taxRate, 100))))
          this.$set(this.formData.list[index], 'payableTotal', NP.times(data.unitPrice, data.number))
          this.$set(this.formData.list[index], 'unStorage', NP.minus(NP.minus(data.number, data.outStorage || 0), data.reStorage || 0))
        }
      }
      if (data.packageNumber && data.number !== data.packageNumber) {
        this.$set(this.formData.list[index], 'packageList', data.unitList.map(m => Object.assign({ number: null }, m)))
        this.$set(this.formData.list[index], 'package', null)
      }
    },
    changeUnit (val, oldVal, index) {
      let data = this.formData.list[index]
      if (data.packageNumber && val !== oldVal) {
        this.changePackage(index)
      }
    },
    changePackage (index) {
      let data = this.formData.list[index]
      if (data.packageList && data.packageList.length) {
        let number = 0
        let text = ''
        let equation = 1
        data.packageList.forEach(f => {
          if (f.number) {
            number = NP.plus(number, NP.times(f.number || 0, f.equation))
            text += (text.length ? '+' : '') + f.number + f.name
          }
          if (f.name === data.unit) equation = f.equation
        })
        if (number > 0) {
          number = NP.divide(number, equation)
          this.$set(this.formData.list[index], 'number', number)
          this.$set(this.formData.list[index], 'packageNumber', number)
          this.$set(this.formData.list[index], 'package', text)
          this.changePrice(index)
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
          // let total = key === 'number'
          //   ? v : key === 'payableTotal'
          //     ? NP.minus(v || 0, this.formData.discount || 0)
          //     : NP.times(v, NP.minus(1, NP.divide(this.formData.discountRate || 0, 100)))
          sums[key] = {
            key,
            value: key === 'number' ? v : this.formatMoney(v, '', 2)
          }
          if (key === 'payableTotal') {
            this.$set(this.formData, 'payable', NP.minus(v || 0, this.formData.discount || 0))
            if (this.formData.deposit) {
              this.$set(this.formData, 'depositRat', NP.times(NP.divide(this.formData.discount || 0, this.formData.payable || 0), 100))
            }
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
    disCount (type) {
      if (this.formData.list.length) {
        let val = this.formData[type]
        let total = this.formData.list.reduce((total, v) => (total = NP.plus(total, v.payableTotal || 0)), 0)
        if (val !== null) {
          if (type === 'discountRate') {
            this.$set(this.formData, 'discount', parseFloat((NP.times(total, NP.divide(val, 100))).toFixed(2)))
          } else {
            this.$set(this.formData, 'discountRate', parseFloat((NP.times(NP.divide(val, total), 100)).toFixed(4)))
          }
        }
      }
    },
    advanceMoney () {
      this.$set(this.formData, 'deposit', this.formData.advanceMoney)
    },
    getPriceAuto (row) {
      let fP = this.priceList.find(f => f.commodityId === row.commodityId && f.unit === row.unit && (!f.auxiliary || (f.auxiliary === row.auxiliary)))
      return [
        { title: '最近销售价:', price: fP ? fP.salesLatest : 0 },
        { title: '历史最高销售价:', price: fP ? fP.salesHigh : 0 },
        { title: '历史最低销售价:', price: fP ? fP.salesLow : 0 },
        { title: '批发价:', price: fP ? fP.wholesale : 0 },
        { title: '零售价:', price: fP ? fP.retail : 0 },
        { title: '配货价:', price: fP ? fP.cost : 0 },
        { title: '采购单价:', price: fP ? fP.purchasing : 0 },
        { title: '最近采购价:', price: fP ? fP.purchaseLatest : 0 },
        { title: '历史最高采购价:', price: fP ? fP.purchaseHigh : 0 },
        { title: '历史最低采购价:', price: fP ? fP.purchaseLow : 0 }
      ]
    },
    batchFun (title, id, val) {
      if (!this.judge(title)) return
      if (title === '反审核') {
        if (this.formData.audit === '未审核') {
          this.$Message.error('该单据未审核')
          return
        } else if (this.formData.close !== '未关闭') {
          this.$Message.error('该单据已关闭不允许反审核')
          return
        } else if (this.formData.storage !== '未出库') {
          this.$Message.error('该单据已有商品出库，不允许反审核')
          return
        }
      }
      this.$Modal.confirm({
        title: `${title}销售订单`,
        content: `确定${title}销售订单`,
        onOk: () => {
          batchSalesOrder({
            action: { audit: val },
            ids: [id]
          }).then(res => {
            this.$Message.success(`成功${title}销售订单`)
            this.loadSalesOrder()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    },
    go () {
      if (!this.judge('出库')) return
      this.$router.push({
        name: 'salesWarehouse',
        query: {
          pId: this.formData._id
        }
      })
    },
    createAdvance () {
      if (this.formData._id) {
        this.$router.push({
          name: 'receivablePayments',
          query: {
            pId: this.formData._id
          }
        })
      } else {
        this.$Message.error('请先保存单据')
      }
    },
    goNav (type) {
      let navList = this.salesOrder
      if (!navList.length) {
        navList = JSON.parse(localStorage.getItem('salesOrder'))
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
