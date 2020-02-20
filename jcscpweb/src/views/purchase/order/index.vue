<template>
  <div v-if="form.temp" class="purchase-order-container">
    <el-row v-if="this.$route.query && this.$route.query.type !== 'look'">
      <el-button plain size="small" @click="init(true)">新增</el-button>
      <el-button v-if="form.status === '未审核'" type="primary" plain size="small" @click="save">保存</el-button>
      <el-button type="success" plain size="small" :disabled="!this.$route.query.id || form.status === '已审核'" @click="setOrder('审核')">审核</el-button>
      <el-button type="warning" plain size="small" :disabled="!this.$route.query.id || form.status === '未审核'" @click="setOrder('反审核')">反审核</el-button>
      <span v-if="this.$route.query.id" style="font-size: 14px; margin-left: 10px;">合同状态：{{ form.status }}</span>
    </el-row>

    <div class="purchase-order-container-tabs-layer">
      <el-tabs :tab-position="'left'" style="margin-top: 20px;">
        <template v-for="(item, key) in tempList">
          <el-tab-pane v-if="item.type === 'order'" :key="key" :label="item.name">
            <div v-if="form.temp[key]" class="purchase-order-container-tabs">
              <template v-for="(v, i) in item.temp">
                <div :key="key + i">
                  <div v-if="v.isShow" class="p-list" :style="{width: v.width + '%'}">
                    <div :class="{'list-t': true, active: v.isRequired}">{{ v.name }}</div>
                    <template v-if="v.type === 'input'">
                      <el-input
                        v-model="form.temp[key][v.code]"
                        size="small"
                        clearable
                        placeholder="请输入"
                        :disabled="!v.isEdit"
                      />
                    </template>
                    <template v-if="v.type === 'number'">
                      <el-input
                        v-model="form.temp[key][v.code]"
                        size="small"
                        clearable
                        placeholder="请输入"
                        :disabled="!v.isEdit"
                        @blur="setNumber(key, v.code, v.float)"
                      />
                    </template>
                    <template v-if="v.type === 'date'">
                      <el-date-picker
                        v-model="form.temp[key][v.code]"
                        size="small"
                        type="date"
                        style="width: 100%"
                        placeholder="请选择"
                        :disabled="!v.isEdit"
                      />
                    </template>
                    <template v-if="v.type === 'textarea'">
                      <el-input
                        v-model="form.temp[key][v.code]"
                        type="textarea"
                        size="small"
                        :rows="2"
                        placeholder="请输入"
                        :disabled="!v.isEdit"
                      />
                    </template>
                    <template v-if="v.type === 'boolean'">
                      <el-switch v-model="form.temp[key][v.code]" size="small" :disabled="!v.isEdit" />
                    </template>
                    <template v-if="v.type === 'select'">
                      <el-select
                        v-model="form.temp[key][v.code]"
                        size="small"
                        style="width: 100%"
                        filterable
                        allow-create
                        clearable
                        default-first-option
                        :disabled="!v.isEdit"
                        @change="selectVal($event, getSelectList(v.selectInfo || null, v.selectContract || null), v.target, v.relevance || [])"
                      >
                        <template v-if="!v.selectContract && getSelectGroup(v.selectInfo || null).length > 1">
                          <el-option-group
                            v-for="group in getSelectGroup(v.selectInfo || null)"
                            :key="group.id"
                            :label="group.name"
                          >
                            <template v-for="(s, s1) in getSelectList(v.selectInfo || null)">
                              <el-option
                                v-if="s.groupId === group.id"
                                :key="key + i + '_' + s1"
                                :label="s[v.target]"
                                :value="s[v.target]"
                              />
                            </template>
                          </el-option-group>
                        </template>
                        <template v-else>
                          <el-option
                            v-for="(s, s1) in getSelectList(v.selectInfo || null, v.selectContract || null, v.target)"
                            :key="key + i + '_' + s1"
                            :label="v.target ? s[v.target] : s.temp.supplier.contractNumber"
                            :value="v.target ? s[v.target] : s.temp.supplier.contractNumber"
                          />
                        </template>
                      </el-select>
                    </template>
                  </div>
                  <div v-if="v.lineBreak" style="clear: both;" />
                </div>
              </template>
            </div>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>

    <el-row type="flex" style="margin-top: 20px;">
      <el-button type="info" plain size="small" @click="custom">自定义</el-button>
      <el-button type="info" plain size="small" @click="setTable('add')">增加行</el-button>
      <upload-file ref="uploadFile" :files="form.files" style="margin-left: 10px;" @change="updateFiles" />
      <el-button type="primary" size="small" style="margin-left: 10px;" @click="calculateCost">计算成本</el-button>
      <el-button v-if="form._id" type="primary" size="small" style="margin-left: 10px;" @click="goContract">跳转合同</el-button>
    </el-row>

    <template v-for="(item, key) in tempList">
      <el-table
        v-if="item.type === 'orderTable'"
        :key="key"
        :data="form.temp.orderTable"
        border
        show-summary
        :summary-method="getSummaries"
        size="small"
        style="margin-top: 10px;"
      >
        <el-table-column
          type="index"
          width="50"
        />
        <template v-for="(v, i) in item.temp">
          <el-table-column
            v-if="v.isShow"
            :key="key + i"
            :label="v.name"
            :code="v.code"
            :label-class-name="v.isRequired ? 'isRequired' : ''"
            :class-name="'table_cell'"
            :show-overflow-tooltip="true"
            width="180"
          >
            <template slot-scope="scope">
              <div v-if="whichCell !== scope.$index" class="table_cell_c_hover">
                {{ form.temp.orderTable[scope.$index][v.code] }}
              </div>
              <div v-if="v.type === 'input'" :class="{'table_cell_c': true, 'active': whichCell === scope.$index}">
                <el-input
                  v-model="form.temp.orderTable[scope.$index][v.code]"
                  size="small"
                  clearable
                  placeholder="请输入"
                  :disabled="!v.isEdit"
                  @focus="cellClick(scope.$index, i)"
                />
              </div>
              <div v-if="v.type === 'number'" :class="{'table_cell_c': true, 'active': whichCell === scope.$index}">
                <el-input
                  v-model="form.temp.orderTable[scope.$index][v.code]"
                  size="small"
                  clearable
                  placeholder="请输入"
                  :disabled="!v.isEdit"
                  @blur="setNumber('orderTable', v.code, v.float, scope.$index)"
                  @focus="cellClick(scope.$index, i)"
                />
              </div>
              <div v-if="v.type === 'date'" :class="{'table_cell_c': true, 'active': whichCell === scope.$index}">
                <el-date-picker
                  v-model="form.temp.orderTable[scope.$index][v.code]"
                  size="small"
                  type="date"
                  style="width: 100%"
                  placeholder="请选择"
                  :disabled="!v.isEdit"
                  @focus="cellClick(scope.$index, i)"
                />
              </div>
              <div v-if="v.type === 'textarea'" :class="{'table_cell_c': true, 'active': whichCell === scope.$index}">
                <el-input
                  v-model="form.temp.orderTable[scope.$index][v.code]"
                  type="textarea"
                  size="small"
                  :rows="1"
                  placeholder="请输入"
                  :disabled="!v.isEdit"
                  @focus="cellClick(scope.$index, i)"
                />
              </div>
              <div v-if="v.type === 'boolean'" :class="{'table_cell_c': true, 'active': whichCell === scope.$index}">
                <el-switch v-model="form.temp.orderTable[scope.$index][v.code]" size="small" :disabled="!v.isEdit" />
              </div>
              <div v-if="v.type === 'select'" :class="{'table_cell_c': true, 'active': whichCell === scope.$index}">
                <el-select
                  v-model="form.temp.orderTable[scope.$index][v.code]"
                  size="small"
                  style="width: 100%"
                  filterable
                  allow-create
                  default-first-option
                  clearable
                  :disabled="!v.isEdit"
                  @change="selectVal($event, getSelectList(v.selectInfo || null, v.selectContract || null, v.target, form.temp.orderTable[scope.$index]), v.target, v.relevance || [], scope.$index)"
                  @focus="cellClick(scope.$index, i)"
                >
                  <el-option
                    v-for="(s, s1) in getSelectList(v.selectInfo || null, v.selectContract || null, v.target, form.temp.orderTable[scope.$index])"
                    :key="key + i + '_' + s1"
                    :label="v.target ? s[v.target] : s.temp.supplier.contractNumber"
                    :value="v.target ? s[v.target] : s.temp.supplier.contractNumber"
                  />
                </el-select>
              </div>
            </template>
          </el-table-column>
        </template>

        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="140"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="setTable('insertion', '插入', scope.$index)">插入</el-button>
            <el-button type="text" size="small" @click="setTable('copy', '复制', scope.$index, scope.row)">复制</el-button>
            <el-button type="text" size="small" style="color: #F56C6C" @click="setTable('delete', '删除', scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <temp ref="temp" @setType="setType" @setTemp="setTemp" @loadTemp="loadTemp" />
    <edit-type ref="editType" />
    <createTemp ref="createTemp" :is-select-contract="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryPurchaseTemp, updatePurchaseOrder, queryPurchaseContract, queryPurchaseOrder } from '../../../api/purchase'
import NP from 'number-precision'
import temp from '../temp'
import editType from '../type'
import createTemp from '../create'
import uploadFile from '../../../components/Upload/uploadMoreFiles'
import moment from 'moment'
const files = [
  {
    group: '海关资料',
    child: [
      { name: '进口合同', url: '' },
      { name: '商业发票', url: '' },
      { name: '装箱清单', url: '' },
      { name: '提单复印件', url: '' },
      { name: '健康证', url: '' },
      { name: '卫生证', url: '' },
      { name: '检验证', url: '' },
      { name: '产地证', url: '' },
      { name: '核销单', url: '' },
      { name: '报关单', url: '' },
      { name: '税费单', url: '' },
      { name: '关税专用缴款书', url: '' },
      { name: '增值税专用缴款书', url: '' }
    ]
  },
  {
    group: '银行付款资料',
    child: [
      { name: '预付款境外汇款申请书', url: '' },
      { name: '预付款报文', url: '' },
      { name: '预付款售汇单', url: '' },
      { name: '尾款境外汇款申请书', url: '' },
      { name: '尾款报文', url: '' },
      { name: '尾款售汇单', url: '' },
      { name: '索赔资料或退柜资料', url: '' },
      { name: '附件1', url: '' },
      { name: '附件2', url: '' },
      { name: '附件3', url: '' }
    ]
  }
]
export default {
  name: 'PurchaseOrder',
  components: {
    temp,
    editType,
    createTemp,
    uploadFile
  },
  data() {
    return {
      tempData: null,
      tempList: [],
      form: {},
      contractList: [],
      whichCell: null
    }
  },
  computed: {
    ...mapGetters([
      'basicInfo',
      'myInfo'
    ])
  },
  watch: {
    tempList: {
      handler() {
        if (!this.$route.query.id || this.$route.query.id === 'null') {
          this.init()
        } else {
          this.loadOrder()
        }
      },
      deep: true
    },
    '$route.query': {
      handler() {
        if (!this.$route.query.id || this.$route.query.id === 'null') {
          this.init()
        }
      },
      deep: true
    }
  },
  created() {
    this.loadTemp()
    this.loadContract()
  },
  methods: {
    moment,
    loadContract() {
      queryPurchaseContract().then(res => {
        this.contractList = res
      })
    },
    loadOrder() {
      queryPurchaseOrder({ _id: this.$route.query.id }).then(res => {
        const order = res[0]
        for (const k in this.tempList) {
          const item = this.tempList[k]
          if (item.type === 'order' || item.type === 'orderTable') {
            if (item.type === 'order') {
              item.temp.forEach(f => {
                if (f.type === 'date' && order.temp[k][f.code]) {
                  this.$set(order.temp[k], f.code, moment(order.temp[k][f.code]))
                }
              })
            } else {
              item.temp.forEach(f => {
                if (f.type === 'date') {
                  order.temp[k].forEach((c, cIndex) => {
                    if (c[f.code]) {
                      this.$set(order.temp[k][cIndex], f.code, moment(c[f.code]))
                    }
                  })
                }
              })
              const obj = {}
              item.temp.forEach(f => {
                this.$set(obj, f.code, f.default || null)
              })
              const list = order.temp[k]
              for (let i = order.temp[k].length; i < 4; i++) {
                list.push(JSON.parse(JSON.stringify(obj)))
              }
              this.$set(order.temp, k, list)
            }
          }
        }
        this.form = JSON.parse(JSON.stringify(order))
      })
    },
    loadTemp() {
      queryPurchaseTemp().then(res => {
        this.tempList = res.temp
        this.tempData = res
      })
    },
    setNumber(key, code, float, tableIndex = null) {
      let val = tableIndex !== null ? this.form.temp[key][tableIndex][code] : this.form.temp[key][code]
      if (val) {
        val = parseFloat(val.toString().replace(/[^\d.]/g, ''))
        if (float) val = val.toFixed(float || 0)
        if (tableIndex !== null) {
          this.$set(this.form.temp[key][tableIndex], code, val)
        } else {
          this.$set(this.form.temp[key], code, val)
        }
        this.$nextTick(() => {
          let notUpdate = code
          if (code === 'oPrepaidRate') {
            notUpdate = 'oPrepaidAmount'
          } else if (code === 'oFinalRate') {
            notUpdate = 'oFinalAmount'
          }
          this.calculate(notUpdate)
        })
      }
    },
    init(bool) {
      if (bool && !this.judgeAuthority('新增')) {
        this.$message.error('对不起，您没有新增采购订单的权限，请联系管理员')
        return
      }
      this.form = {
        temp: {}
      }
      for (const k in this.tempList) {
        const item = this.tempList[k]
        if (item.type === 'order' || item.type === 'orderTable') {
          const obj = {}
          item.temp.forEach(f => {
            this.$set(obj, f.code, f.default || null)
          })
          if (item.type === 'order') {
            this.$set(this.form.temp, k, obj)
          } else {
            const list = []
            for (let i = 0; i < 4; i++) {
              list.push(JSON.parse(JSON.stringify(obj)))
            }
            this.$set(this.form.temp, k, list)
          }
        }
      }
      this.$set(this.form, 'files', files)
      this.$set(this.form, 'creator', this.myInfo._id)
      this.$set(this.form, 'status', '未审核')
    },
    getSelectList(info, contractId, target = null, row = null) {
      let list = []
      if (info) list = this.basicInfo[info] ? this.basicInfo[info].list : []
      if (contractId) list = this.contractList
      if (info === 'goods' && target === 'goodsNameC') {
        const filter = []
        list.forEach(v => {
          if (filter.find(f => f.goodsNameC === v.goodsNameC)) {
            if (!filter.find(f => f[target] === v[target])) {
              filter.push(v)
            }
          } else {
            if (
              target === 'goodsNameC' ||
              row && row.goodsNameC && row.goodsNameC === v.goodsNameC
            ) {
              filter.push(v)
            }
          }
        })
        list = filter
      }
      return list
    },
    getSelectGroup(info) {
      return info && this.basicInfo[info] ? this.basicInfo[info].group : []
    },
    selectVal(val, list, target, relevance, tableIndex = null) {
      if (relevance.length) {
        const fData = target ? list.find(f => f[target] === val) : list.find(f => f.temp.supplier.contractNumber === val).temp
        console.log(fData)
        relevance.forEach(f => {
          let targetVal = null
          if (f.target.includes('.')) {
            const t = f.target.split('.')
            targetVal = fData[t[0]][t[1]]
          } else {
            targetVal = fData[f.target]
          }
          if (tableIndex !== null) {
            this.$set(this.form.temp.orderTable[tableIndex], f.code, targetVal)
          } else {
            if (f.code.includes('.')) {
              const code = f.code.split('.')
              this.$set(this.form.temp[code[0]], code[1], targetVal)
            } else {
              const obj = {}
              this.tempList.orderTable.temp.forEach(f => {
                this.$set(obj, f.code, f.default || null)
              })
              const list = fData[f.target]
              for (let i = fData[f.target].length; i < 4; i++) {
                list.push(JSON.parse(JSON.stringify(obj)))
              }
              this.$set(this.form.temp, f.code, targetVal)
            }
          }
        })
        this.$forceUpdate()
      }
    },
    calculate(code) {
      const shareholder = this.form.temp.order.contractNumber ? this.contractList.find(f => f.temp.supplier.contractNumber === this.form.temp.order.contractNumber).temp.supplier.shareholder : null
      const update = (item, k, index) => {
        item.temp.forEach(f => {
          if (f.formula && f.code !== code && (
            f.code !== 'serviceCharge' ||
            (
              f.code === 'serviceCharge' &&
              !shareholder
            )
          )) {
            let total = null
            let isUpdate = true
            if (f.formula.child.length) {
              f.formula.child.forEach((v, i) => {
                const code = v.code ? v.code.split('.') : null
                const val = (code ? index !== null && code[0].includes('Table') ? this.form.temp[code[0]][index][code[1]] : this.form.temp[code[0]][code[1]] : v.val)
                if (val === '所有货物美元金额合计') {
                  const totalA = this.form.temp.orderTable.reduce((total, r) => (total = NP.plus(total, r.totalAmount || 0)), 0)
                  console.log(totalA)
                  total = NP[f.formula.child[i - 1].mode](total, parseFloat(totalA))
                } else {
                  if ((val !== null && val > 0 || f.code === 'singleBoxCost') && isUpdate) {
                    if (i === 0) {
                      total = parseFloat(val || 0)
                    } else {
                      if (val !== 0) total = NP[f.formula.child[i - 1].mode](total, parseFloat(val || 0))
                    }
                  } else {
                    isUpdate = false
                  }
                }
              })
            } else {
              total = index !== null ? this.form.temp[k][index][f.code] : this.form.temp[k][f.code]
            }
            if (total && isUpdate) {
              if (f.formula.min && total < f.formula.min) total = f.formula.min
              if (f.formula.max && total > f.formula.max) total = f.formula.max
              if (f.float) total = parseFloat(total).toFixed(f.float || 0)
              this.$set(index !== null ? this.form.temp[k][index] : this.form.temp[k], f.code, total)
            }
          }
          if (f.code === 'serviceCharge' && shareholder) {
            this.$set(this.form.temp[k], f.code, null)
          }
        })
      }
      for (const k in this.tempList) {
        const item = this.tempList[k]
        if (item.type === 'order') {
          update(item, k, null)
        }
        if (item.type === 'orderTable') {
          this.form.temp.orderTable.forEach((f, i) => {
            update(item, k, i)
          })
        }
      }
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      let isShow = 0
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计'
          return
        }
        const temp = this.tempData.temp['orderTable'].temp[index - 1]
        if (temp && !temp.isShow) isShow++
        if (temp && temp.isTotal) {
          let val = 0
          this.form.temp.orderTable.forEach(f => {
            if (f[temp.code]) {
              val = NP.plus(val, f[temp.code])
            }
          })
          sums[index - isShow] = val ? temp.float ? parseFloat(val).toFixed(temp.float) : val : ''
        } else {
          sums[index - isShow] = ''
        }
      })
      return sums
    },
    custom() {
      if (!this.judgeAuthority('自定义')) {
        this.$message.error('对不起，您没有自定义采购订单的权限，请联系管理员')
        return
      }
      this.$refs.temp.show(this.tempData, 'order')
    },
    setType(fData, cb) {
      this.$refs.editType.show(fData, this.tempData.temp, 'order', cb)
    },
    setTemp(row, whichTemp, cb) {
      this.$refs.createTemp.show(row, whichTemp, this.tempData.temp, 'order', cb)
    },
    setTable(action, title, index, row) {
      const obj = {}
      this.tempList.orderTable.temp.forEach(f => {
        this.$set(obj, f.code, f.default || null)
      })
      if (action === 'add') {
        this.form.temp.orderTable.push(JSON.parse(JSON.stringify(obj)))
      } else {
        if (action === 'insertion') {
          this.form.temp.orderTable.splice(index, 0, JSON.parse(JSON.stringify(obj)))
        } else if (action === 'copy') {
          this.form.temp.orderTable.splice(index, 0, JSON.parse(JSON.stringify(row)))
        } else if (action === 'delete') {
          this.form.temp.orderTable.splice(index, 1)
        }
      }
    },
    updateFiles(files) {
      this.$set(this.form, 'files', files)
    },
    save() {
      if (!this.judgeAuthority('修改')) {
        this.$message.error('对不起，您没有修改采购订单的权限，请联系管理员')
        return
      }
      let isSave = true
      const ajaxData = JSON.parse(JSON.stringify(this.form))
      for (const k in this.tempList) {
        const item = this.tempList[k]
        if (item.type === 'order' || item.type === 'orderTable') {
          if (item.type === 'order') {
            for (let i = 0; i < item.temp.length; i++) {
              const temp = item.temp[i]
              if (temp.isRequired && !ajaxData.temp[k][temp.code]) {
                isSave = false
                this.$message.error(`${item.name}：${temp.name}必填`)
                return
              }
            }
          } else {
            const list = []
            for (let t = 0; t < ajaxData.temp.orderTable.length; t++) {
              const row = ajaxData.temp.orderTable[t]
              let isAdd = false
              for (const c in row) {
                if (row[c]) isAdd = true
              }
              if (isAdd) {
                for (let i = 0; i < item.temp.length; i++) {
                  const temp = item.temp[i]
                  if (temp.isRequired && !row[temp.code]) {
                    isAdd = false
                    isSave = false
                    this.$message.error(`${item.name}：${temp.name}必填`)
                    return
                  }
                }
                if (isAdd) {
                  list.push(row)
                }
              }
            }
            if (isSave) ajaxData.temp.orderTable = list
          }
        }
      }
      if (isSave) {
        console.log(ajaxData)
        updatePurchaseOrder(ajaxData).then(res => {
          this.$message.success(`保存成功！`)
          this.$router.push({
            name: 'PurchaseOrder',
            query: {
              type: 'edit',
              id: res._id
            }
          })
        })
      }
    },
    setOrder(action) {
      if (!this.judgeAuthority(action)) {
        this.$message.error(`对不起，您没有${action}采购订单的权限，请联系管理员`)
        return
      }
      this.$confirm(`确定${action}该订单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ajaxData = JSON.parse(JSON.stringify(this.form))
        if (action === '审核') {
          ajaxData.status = '已审核'
          ajaxData.auditor = this.myInfo._id
          ajaxData.unAuditor = null
        } else {
          ajaxData.status = '未审核'
          ajaxData.auditor = null
          ajaxData.unAuditor = this.myInfo._id
        }
        updatePurchaseOrder(ajaxData).then(res => {
          this.$message.success(`${action}成功！`)
          this.loadOrder()
        })
      })
    },
    cellClick(rowIndex) {
      this.whichCell = rowIndex
    },
    judgeAuthority(action) {
      let bool = false
      // && this.myInfo.role !== 'admin'
      if (this.myInfo && this.myInfo.role !== 'admin') {
        const pList = this.myInfo.permission.permission
        const checked = this.myInfo.permission.checked
        const findFun = (list) => {
          for (let i = 0; i < list.length; i++) {
            if (list[i].label === '采购订单') {
              const look = list[i].children[0].children.find(f => f.label === action)
              bool = !!checked.find(id => look.id.substr(0, id.length) === id)
              return
            } else if (list[i].children && list[i].children.length) {
              findFun(list[i].children)
            }
          }
        }
        findFun(pList)
      } else {
        bool = true
      }
      return bool
    },
    calculateCost() {
      const data = this.form.temp
      let results = ''
      const prefix = `<p>（${data.order.RMBAmount || 0} + ${data.order.oFinalRMBAmount || 0} + ${data.logistics.customsTariff || 0} + ${data.logistics.customsTax || 0} + ${data.logistics.customsFee || 0} + ${data.logistics.otherCost || 0}）`
      const prefixResult = NP.plus(NP.plus(NP.plus(NP.plus(NP.plus(data.order.RMBAmount || 0, data.order.oFinalRMBAmount || 0), data.logistics.customsTariff || 0), data.logistics.customsTax || 0), data.logistics.customsFee || 0), data.logistics.otherCost || 0)
      const totalA = data.orderTable.reduce((total, r) => (total = NP.plus(total, r.totalAmount || 0)), 0)
      data.orderTable.forEach(f => {
        const total = NP.divide(NP.times(NP.divide(prefixResult, totalA || 0), f.totalAmount || 0), f.number || 0)
        if (total) results += prefix + ` / ${totalA || 0} * ${f.totalAmount || 0} / ${f.number || 0} = ${total} </p>`
      })
      this.$alert(`
          <p style="margin-bottom: 10px;">
          公式：（预付汇率的人民币金额 + 尾款人民币金额 + 海关关税 + 海关增值税 + 清关费 + 其他费用）/ 所有货物美元金额合计 * 单个货物美元金额 / 单个货物美元箱数 = 单个货物的人民币成本
          </p>
          <p>计算：</p>
          ${results}
        `, '计算成本', {
        dangerouslyUseHTMLString: true
      })
    },
    goContract() {
      if (this.form.temp.order.contractNumber) {
        const fData = this.contractList.find(f => f.temp.supplier.contractNumber === this.form.temp.order.contractNumber)
        if (fData) {
          this.$router.push({
            name: 'PurchaseContract',
            query: {
              type: 'look',
              id: fData._id
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .purchase-order {
    &-container {
      margin: 30px;

      thead .isRequired .isRequired:before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
      }

      .el-table__body {
        .table_cell_c{
          display: none;

          &.active {
            display: block;
          }
        }
        .table_cell_c_hover {
          display: block;
        }
        .el-table__row:hover {
          .table_cell_c{
            display: block;
          }
          .table_cell_c_hover {
            display: none;
          }
        }
      }

      &-tabs {
        overflow: hidden;

        .p-list {
          min-height: 32px;
          float: left;
          display: flex;
          align-items: center;
          font-size: 14px;
          margin-bottom: 10px;

          .list-t{
            width: 160px;
            min-width: 160px;
            text-align: right;
            margin-right: 10px;

            &.active:before {
              content: "*";
              color: #f56c6c;
              margin-right: 4px;
            }
          }
        }
      }
    }
  }
</style>
