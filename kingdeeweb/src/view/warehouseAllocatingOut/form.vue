<template>
  <div>
    <Row type="flex" justify="space-between">
      <div style="display: flex; align-items: center;">
        <template v-if="$route.query.id">
          审核状态：
          <span :style="{marginRight: '20px', color: formData.audit === '未审核' ? '#ed4014' : '#19be6b'}">
            {{ formData.audit }}
          </span>
          差异处理状态：
          <span :style="{marginRight: '20px', color: formData.resultStatus === '未处理' ? '#ed4014' : '#19be6b'}">
            {{ formData.resultStatus }}
          </span>
        </template>
      </div>
      <div>
        <Button type="primary" style="margin-right: 10px;" @click="save(false)" :disabled="!isCanEdit">保存</Button>
        <Button style="margin-right: 10px;" @click="save(true)" >新增</Button>
        <Button style="margin-right: 10px;" v-if="formData.audit === '未审核'" :disabled="!$route.query.id" @click="batchFun('审核', $route.query.id, '已审核')">审核</Button>
        <Button style="margin-right: 10px;" v-if="formData.audit === '已审核'" :disabled="!$route.query.id" @click="batchFun('反审核', $route.query.id, '未审核')">反审核</Button>
        <Button style="margin-right: 10px;" @click="$router.push({
          name: 'warehouseAllocatingOutList'
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
          <FormItem label="单据编号" style="margin: 0 30px 0 0;" prop="code">
            <Input style="width: 200px" v-model="formData.code" />
          </FormItem>
          <FormItem label="单据日期" style="margin: 0 30px 0 0;" prop="dateTime">
            <DatePicker type="date" style="width: 200px" v-model="formData.dateTime" :clearable="false" format="yyyy-MM-dd" />
          </FormItem>
          <FormItem label="调出部门" style="margin: 0 30px 0 0;">
            <Select v-model="formData.departmentIdOut" style="width:200px">
              <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('department', loadDepartment)" style="font-size: 20px; opacity: 0.6" />
              <Option v-for="item in departmentList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="调入部门" style="margin: 0 30px 0 0;">
            <Select v-model="formData.departmentIdIn" style="width:200px">
              <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('department', loadDepartment)" style="font-size: 20px; opacity: 0.6" />
              <Option v-for="item in departmentList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="业务类型" style="margin: 0 30px 0 0;">
            <Select v-model="formData.businessType" style="width:200px">
              <Option v-for="(item, index) in ['同价调拨', '异价调拨']" :value="item" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
        </Row>
      </Form>
    </Card>

    <Card style="margin-top: 10px;">
      <Row>
        <Button style="margin-right: 10px;" @click="addCommodity(true)">添加商品</Button>
      </Row>

      <Table :height="getTableHeight"
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
        <template slot-scope="{ row }" slot="warehouseIdIn">
          <div class="text">{{ warehouseList.find(f => f._id === row.warehouseIdIn) && warehouseList.find(f => f._id === row.warehouseIdIn).name }}</div>
          <div class="hover_layer">
            <Select v-model="formData.list[row._index].warehouseIdIn">
              <Icon type="md-add-circle" slot="prefix" @click.stop="$refs.selectInfoModel.show('warehouse', loadWarehouse)" style="font-size: 20px; opacity: 0.6" />
              <Option v-for="item in warehouseList" :value="item._id" :key="item._id">
                {{ item.name }}
                ( 库存数量: {{ getInventory(warehouseList.find(f => f._id === item._id), row, true) }} )
              </Option>
            </Select>
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
        <template slot-scope="{ row }" slot="batch">
          <template v-if="row.isBatch">
            <div class="text">{{ row.batch }}</div>
            <div class="hover_layer">
              <AutoComplete
                v-model="formData.list[row._index].batch"
                @on-change="changeBatch($event, warehouseList.find(f => f._id === row.warehouseId), row)"
                :data="warehouseList.find(f => f._id === row.warehouseId) ? warehouseList.find(f => f._id === row.warehouseId).inventoryList.filter(f =>
                  f.commodityId === row.commodityId &&
                  (!f.auxiliary || (f.auxiliary === row.auxiliary))
                ).map(m => m.batch) : []">
              </AutoComplete>
            </div>
          </template>
        </template>
        <template slot-scope="{ row }" slot="generateDate">
          <template v-if="row.isShelfLife">
            <div class="text">{{ row.generateDate ||  '' }}</div>
            <div class="hover_layer">
              <DatePicker type="date" v-model="formData.list[row._index].generateDate" :clearable="false" format="yyyy-MM-dd" />
            </div>
          </template>
        </template>
        <template slot-scope="{ row }" slot="shelfLifeDays">
          <template v-if="row.isShelfLife">
            {{ row.shelfLifeDays }}
          </template>
        </template>
        <template slot-scope="{ row }" slot="effectiveDate">
          <template v-if="row.isShelfLife">
            {{ getEffectiveDate(row) }}
          </template>
        </template>
        <template slot-scope="{ row }" slot="inventory">
          {{ getInventory(warehouseList.find(f => f._id === row.warehouseIdIn), row) }}
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
        <template slot-scope="{ row }" slot="unitDelivery">
          <div class="text">{{ row.unitDelivery ? formatMoney(row.unitDelivery, '', 2) : '' }}</div>
          <div class="hover_layer">
            <InputNumber
              v-model="formData.list[row._index].unitDelivery"
              :min="0"
              :step="0.01"
              style="width: 110px"
              @on-blur="changePrice(row._index)"/>
          </div>
        </template>
        <template slot-scope="{ row }" slot="deliveryCost">
          {{ row.deliveryCost ? formatMoney(row.deliveryCost, '', 2) : '' }}
        </template>
        <template slot-scope="{ row }" slot="commodityDes">
          <div class="text">{{ row.commodityDes || '' }}</div>
          <div class="hover_layer">
            <Input v-model="formData.list[row._index].commodityDes" />
          </div>
        </template>
      </Table>
    </Card>

    <commodityModal ref="commodityModal" @addCommodity="addCommodity" />
    <selectInfoModel ref="selectInfoModel" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  parameterWarehouseAllocatingOut,
  updateWarehouseAllocatingOut,
  queryWarehouseAllocatingOut,
  batchWarehouseAllocatingOut
} from '../../api/warehouseAllocatingOut'
import { queryDepartment } from '../../api/department'
import { queryWarehouse } from '../../api/warehouse'
import commodityModal from '../../components/commodity/index'
import moment from 'moment'
import NP from 'number-precision'
import { formatMoney } from 'accounting'
import selectInfoModel from '../../components/selectInfo/model'
export default {
  name: 'warehouseAllocatingOut',
  components: {
    commodityModal,
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
        departmentIdOut: null,
        departmentIdIn: null,
        businessType: '同价调拨',
        list: [],
        audit: '未审核',
        resultStatus: '未处理',
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
      departmentList: [],
      warehouseList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'warehouseAllocatingOut'
    ]),
    getTableHeight () {
      return window.innerHeight - 460
    },
    columns () {
      let c = [
        {
          title: ' ',
          width: 80,
          fixed: 'left',
          slot: 'action',
          align: 'center',
          key: 'action'
        },
        {
          title: '调出仓库',
          width: 200,
          resizable: true,
          slot: 'warehouseId',
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
          title: '调入仓库',
          width: 200,
          resizable: true,
          slot: 'warehouseIdIn',
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
          title: '商品行备注',
          width: 150,
          resizable: true,
          slot: 'commodityDes'
        },
        {
          title: ' '
        }
      ]
      if (this.formData.businessType === '异价调拨') {
        c.splice(10, 0, {
          title: '调出单价',
          width: 150,
          resizable: true,
          slot: 'unitDelivery'
        })
        c.splice(11, 0, {
          title: '调出金额',
          width: 150,
          resizable: true,
          slot: 'deliveryCost',
          key: 'deliveryCost'
        })
      }
      let isBatch = this.formData.list.find(f => f.isBatch)
      let isShelfLife = this.formData.list.find(f => f.isShelfLife)
      if (isBatch && c[6].title === '库存数量') {
        c.splice(6, 0, {
          title: '批次',
          width: 150,
          resizable: true,
          slot: 'batch',
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
        })
      }
      if (isShelfLife && c[7].title === '库存数量') {
        c.splice(7, 0, {
          title: '到期日',
          width: 150,
          resizable: true,
          slot: 'effectiveDate'
        })
        c.splice(7, 0, {
          title: '保质期（天）',
          width: 150,
          resizable: true,
          slot: 'shelfLifeDays',
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
        })
        c.splice(7, 0, {
          title: '生产日期',
          width: 150,
          resizable: true,
          slot: 'generateDate',
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
        })
      }
      return c
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          if (this.$route.query.id) {
            this.loadWarehouseAllocatingOut()
          } else {
            this.loadParameter()
          }
          this.loadDepartment()
          this.loadWarehouse()
        }
      },
      immediate: true,
      deep: true
    },
    '$route': {
      handler () {
        if (this.$route.name !== 'warehouseAllocatingOut') return
        if (this.accountSet) {
          if (this.$route.query.id && this.$route.query.id !== this.formData._id) {
            this.loadWarehouseAllocatingOut()
          }
          this.loadDepartment()
          this.loadWarehouse()
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
          if (f.title === '调拨出库') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}调拨出库的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadParameter () {
      let time = this.moment().format('YYYY-MM-DD')
      parameterWarehouseAllocatingOut({
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
          code: `DBCK-${time.split('-').join('')}-${total}`,
          dateTime: new Date(),
          departmentIdOut: null,
          departmentIdIn: null,
          businessType: '同价调拨',
          list: [],
          audit: '未审核',
          resultStatus: '未处理',
          custom: null
        }
      }).catch(() => {
        this.$Message.error('获取单据参数出错')
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
    loadWarehouse () {
      queryWarehouse({ accountSetId: this.accountSet._id }).then(res => {
        this.warehouseList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    loadWarehouseAllocatingOut () {
      queryWarehouseAllocatingOut({
        filter: {
          accountSetId: this.accountSet._id,
          _id: this.$route.query.id
        },
        isOne: true
      }).then(res => {
        this.formData = res.data
        this.formData.dateTime = new Date(res.data.dateTime)
        this.formData.list.forEach(f => {
          if (f.generateDate) f.generateDate = this.moment(f.generateDate).format('YYYY-MM-DD')
          if (f.effectiveDate) f.effectiveDate = this.moment(f.effectiveDate).format('YYYY-MM-DD')
        })
        this.isCanEdit = res.data.audit === '未审核'
      }).catch(err => {
        this.$Notice.error({
          title: '调拨出库单',
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
            this.$Message.error('请添加调拨商品')
          } else if (this.formData.list.filter(f =>
            !f.commodityId ||
            !f.unit ||
            !f.number ||
            !f.warehouseId ||
            !f.warehouseIdIn ||
            (f.isBatch && !f.batch) ||
            (f.isShelfLife && (!f.generateDate || !f.shelfLifeDays))
          ).length) {
            this.$Message.error(`调拨商品的标记红点的项必录，请检查！`)
          } else {
            updateWarehouseAllocatingOut(this.formData).then(res => {
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
    rowClassName (row, index) {
      return index === this.currentRow ? 'active' : ''
    },
    rowClick (row, index) {
      this.currentRow = index
    },
    addCommodity (bool, list = []) {
      if (bool && list.length) {
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
            warehouseIdIn: null,
            inventory: null,
            number: null,
            inNumber: null,
            unitDelivery: null,
            deliveryCost: null,
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
    getEffectiveDate (row) {
      let date = null
      if (row.shelfLifeDays && row.generateDate) {
        date = this.moment(row.generateDate).add(parseFloat(row.shelfLifeDays), 'days')
        if (!this.moment(this.formData.list[row._index].effectiveDate).isSame(date, 'day')) {
          this.$set(this.formData.list[row._index], 'effectiveDate', date)
        }
      }
      return date ? this.moment(date).format('YYYY-MM-DD') : null
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
    changeBatch (val, warehouse, row) {
      if (warehouse) {
        let iData = warehouse.inventoryList.find(f =>
          f.commodityId === row.commodityId &&
          (!f.auxiliary || (f.auxiliary === row.auxiliary)) &&
          (!val || (f.batch && f.batch === val))
        )
        if (iData) {
          this.$set(this.formData.list[row._index], 'generateDate', this.moment(iData.generateDate).format('YYYY-MM-DD'))
        }
      }
    },
    changePrice (index) {
      let data = this.formData.list[index]
      if (data.unitDelivery !== null) {
        if (data.number !== null) {
          this.$set(this.formData.list[index], 'deliveryCost', NP.times(data.number || 0, data.unitDelivery || 0))
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
          sums[key] = {
            key,
            value: this.formatMoney(v, '', 2)
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
        title: `${title}调拨出库单`,
        content: `确定${title}调拨出库单`,
        onOk: () => {
          batchWarehouseAllocatingOut({
            action: { audit: val },
            ids: [id]
          }).then(res => {
            this.$Message.success(`成功${title}调拨出库单`)
            this.loadWarehouseAllocatingOut()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    },
    goNav (type) {
      let navList = this.warehouseAllocatingOut
      if (!navList.length) {
        navList = JSON.parse(localStorage.getItem('warehouseAllocatingOut'))
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
