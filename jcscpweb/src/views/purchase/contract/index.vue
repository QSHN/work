<template>
  <div v-if="form.temp" class="purchase-contract-container">
    <el-row v-if="this.$route.query && this.$route.query.type !== 'look'">
      <el-button plain size="small" @click="init(true)">新增</el-button>
      <el-button v-if="form.status === '未审核'" type="primary" plain size="small" @click="save">保存</el-button>
      <el-button v-if="this.$route.query.id" type="info" plain size="small" @click="exportFun">导出</el-button>
      <el-button type="success" plain size="small" :disabled="!this.$route.query.id || form.status === '已审核'" @click="setContract('审核')">审核</el-button>
      <el-button type="warning" plain size="small" :disabled="!this.$route.query.id || form.status === '未审核'" @click="setContract('反审核')">反审核</el-button>
      <span v-if="this.$route.query.id" style="font-size: 14px; margin-left: 10px;">合同状态：{{ form.status }}</span>
    </el-row>
    <el-row v-else>
      <el-button v-if="this.$route.query.id" type="info" plain size="small" @click="exportFun">导出</el-button>
    </el-row>

    <div class="purchase-contract-container-tabs-layer">
      <el-tabs :tab-position="'left'" style="margin-top: 20px;">
        <template v-for="(item, key) in tempList">
          <el-tab-pane v-if="item.type === 'contract'" :key="key" :label="item.name">
            <div v-if="form.temp[key]" class="purchase-contract-container-tabs">
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
                        default-first-option
                        clearable
                        :disabled="!v.isEdit"
                        @change="selectVal($event, getSelectList(v.selectInfo || null), v.target, v.relevance || [], null, v.selectInfo)"
                      >
                        <template v-if="getSelectGroup(v.selectInfo || null).length > 1">
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
                            v-for="(s, s1) in getSelectList(v.selectInfo || null)"
                            :key="key + i + '_' + s1"
                            :label="s[v.target]"
                            :value="s[v.target]"
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
    </el-row>

    <template v-for="(item, key) in tempList">
      <el-table
        v-if="item.type === 'contractTable'"
        :key="key"
        :data="form.temp.contractTable"
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
                {{ form.temp.contractTable[scope.$index][v.code] }}
              </div>
              <div v-if="v.type === 'input'" :class="{'table_cell_c': true, 'active': whichCell === scope.$index}">
                <el-input
                  v-model="form.temp.contractTable[scope.$index][v.code]"
                  size="small"
                  clearable
                  placeholder="请输入"
                  :disabled="!v.isEdit"
                  @focus="cellClick(scope.$index, i)"
                />
              </div>
              <div v-if="v.type === 'number'" :class="{'table_cell_c': true, 'active': whichCell === scope.$index}">
                <el-input
                  v-model="form.temp.contractTable[scope.$index][v.code]"
                  size="small"
                  clearable
                  placeholder="请输入"
                  :disabled="!v.isEdit"
                  @blur="setNumber('contractTable', v.code, v.float, scope.$index)"
                  @focus="cellClick(scope.$index, i)"
                />
              </div>
              <div v-if="v.type === 'date'" :class="{'table_cell_c': true, 'active': whichCell === scope.$index}">
                <el-date-picker
                  v-model="form.temp.contractTable[scope.$index][v.code]"
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
                  v-model="form.temp.contractTable[scope.$index][v.code]"
                  type="textarea"
                  size="small"
                  :rows="1"
                  placeholder="请输入"
                  :disabled="!v.isEdit"
                  @focus="cellClick(scope.$index, i)"
                />
              </div>
              <div v-if="v.type === 'boolean'" :class="{'table_cell_c': true, 'active': whichCell === scope.$index}">
                <el-switch v-model="form.temp.contractTable[scope.$index][v.code]" size="small" :disabled="!v.isEdit" />
              </div>
              <div v-if="v.type === 'select'" :class="{'table_cell_c': true, 'active': whichCell === scope.$index}">
                <el-select
                  v-model="form.temp.contractTable[scope.$index][v.code]"
                  size="small"
                  style="width: 100%"
                  filterable
                  allow-create
                  default-first-option
                  clearable
                  :disabled="!v.isEdit"
                  @change="selectVal($event, getSelectList(v.selectInfo || null, v.target, form.temp.contractTable[scope.$index]), v.target, v.relevance || [], scope.$index)"
                  @focus="cellClick(scope.$index, i)"
                >
                  <el-option
                    v-for="(s, s1) in getSelectList(v.selectInfo || null, v.target, form.temp.contractTable[scope.$index])"
                    :key="key + i + '_' + s1"
                    :label="s[v.target]"
                    :value="s[v.target]"
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
    <createTemp ref="createTemp" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryPurchaseTemp, updatePurchaseContract, queryPurchaseContract } from '../../../api/purchase'
import NP from 'number-precision'
import temp from '../temp'
import editType from '../type'
import createTemp from '../create'
import uploadFile from '../../../components/Upload/uploadFiles'
import moment from 'moment'
export default {
  name: 'PurchaseContract',
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
      whichCell: null
    }
  },
  computed: {
    ...mapGetters([
      'basicInfo',
      'myInfo',
      'allUserList'
    ])
  },
  watch: {
    tempList: {
      handler() {
        if (!this.$route.query.id || this.$route.query.id === 'null') {
          this.init()
        } else {
          this.loadContract()
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
  },
  methods: {
    moment,
    loadContract() {
      queryPurchaseContract({ _id: this.$route.query.id }).then(res => {
        const contract = res[0]
        for (const k in this.tempList) {
          const item = this.tempList[k]
          if (item.type === 'contract' || item.type === 'contractTable') {
            if (item.type === 'contract') {
              item.temp.forEach(f => {
                if (f.type === 'date' && contract.temp[k][f.code]) {
                  this.$set(contract.temp[k], f.code, moment(contract.temp[k][f.code]))
                }
              })
            } else {
              item.temp.forEach(f => {
                if (f.type === 'date') {
                  contract.temp[k].forEach((c, cIndex) => {
                    if (c[f.code]) {
                      this.$set(contract.temp[k][cIndex], f.code, moment(c[f.code]))
                    }
                  })
                }
              })
              const obj = {}
              item.temp.forEach(f => {
                this.$set(obj, f.code, f.default || null)
              })
              const list = contract.temp[k]
              for (let i = contract.temp[k].length; i < 4; i++) {
                list.push(JSON.parse(JSON.stringify(obj)))
              }
              this.$set(contract.temp, k, list)
            }
          }
        }
        this.form = JSON.parse(JSON.stringify(contract))
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
        this.$message.error('对不起，您没有新增采购合同的权限，请联系管理员')
        return
      }
      this.form = {
        temp: {}
      }
      for (const k in this.tempList) {
        const item = this.tempList[k]
        if (item.type === 'contract' || item.type === 'contractTable') {
          const obj = {}
          item.temp.forEach(f => {
            this.$set(obj, f.code, f.default || null)
          })
          if (item.type === 'contract') {
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
      this.$set(this.form.temp.supplier, 'merchandiser', this.myInfo.name)
      this.$set(this.form, 'files', [])
      this.$set(this.form, 'creator', this.myInfo._id)
      this.$set(this.form, 'status', '未审核')
    },
    getSelectList(info, target = null, row = null) {
      let list = []
      if (info === 'systemAccount') {
        list = this.allUserList.filter(f => f.role === 'company' && f.accountStatus !== '已删除')
      } else {
        list = list = this.basicInfo[info] ? this.basicInfo[info].list : []
        if (info === 'goods' && target) {
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
      }
      return list
    },
    getSelectGroup(info) {
      return info && this.basicInfo[info] ? this.basicInfo[info].group : []
    },
    selectVal(val, list, target, relevance, tableIndex = null, selectInfo) {
      if (selectInfo === 'systemAccount') {
        const fData = list.find(f => f[target] === val)
        this.$set(this.form, 'creator', fData._id)
      } else if (relevance.length) {
        const fData = list.find(f => f[target] === val)
        relevance.forEach(f => {
          if (tableIndex !== null) {
            this.$set(this.form.temp.contractTable[tableIndex], f.code, fData[f.target])
          } else {
            if (f.code.includes('.')) {
              const code = f.code.split('.')
              this.$set(this.form.temp[code[0]], code[1], fData[f.target])
            } else {
              this.$set(this.form.temp, f.code, fData[f.target])
            }
          }
        })
        this.$forceUpdate()
      }
    },
    calculate(code) {
      const update = (item, k, index) => {
        item.temp.forEach(f => {
          if (f.formula && f.code !== code && (
            f.code !== 'serviceCharge' ||
            (
              f.code === 'serviceCharge' &&
              !this.form.temp.supplier.shareholder
            )
          )) {
            let total = null
            let isUpdate = true
            if (f.formula.child.length) {
              f.formula.child.forEach((v, i) => {
                const code = v.code ? v.code.split('.') : null
                const val = (code ? index !== null && code[0].includes('Table') ? this.form.temp[code[0]][index][code[1]] : this.form.temp[code[0]][code[1]] : v.val)
                if ((val !== null && val > 0 || f.code === 'singleBoxCost') && isUpdate) {
                  if (i === 0) {
                    total = parseFloat(val || 0)
                  } else {
                    if (val !== 0) total = NP[f.formula.child[i - 1].mode](total, parseFloat(val))
                  }
                } else {
                  isUpdate = false
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
          if (f.code === 'serviceCharge' && this.form.temp.supplier.shareholder) {
            this.$set(this.form.temp[k], f.code, null)
          }
        })
      }
      for (const k in this.tempList) {
        const item = this.tempList[k]
        if (item.type === 'contract') {
          update(item, k, null)
        }
        if (item.type === 'contractTable') {
          this.form.temp.contractTable.forEach((f, i) => {
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
        const temp = this.tempData.temp['contractTable'].temp[index - 1]
        if (temp && !temp.isShow) isShow++
        if (temp && temp.isTotal) {
          let val = 0
          this.form.temp.contractTable.forEach(f => {
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
        this.$message.error('对不起，您没有自定义采购合同的权限，请联系管理员')
        return
      }
      this.$refs.temp.show(this.tempData, 'contract')
    },
    setType(fData, cb) {
      this.$refs.editType.show(fData, this.tempData.temp, 'contract', cb)
    },
    setTemp(row, whichTemp, cb) {
      this.$refs.createTemp.show(row, whichTemp, this.tempData.temp, 'contract', cb)
    },
    setTable(action, title, index, row) {
      const obj = {}
      this.tempList.contractTable.temp.forEach(f => {
        this.$set(obj, f.code, f.default || null)
      })
      if (action === 'add') {
        this.form.temp.contractTable.push(JSON.parse(JSON.stringify(obj)))
      } else {
        if (action === 'insertion') {
          this.form.temp.contractTable.splice(index, 0, JSON.parse(JSON.stringify(obj)))
        } else if (action === 'copy') {
          this.form.temp.contractTable.splice(index, 0, JSON.parse(JSON.stringify(row)))
        } else if (action === 'delete') {
          this.form.temp.contractTable.splice(index, 1)
        }
      }
    },
    updateFiles(name, url, deleteIndex) {
      if (name && url) {
        this.form.files.push({
          name,
          url
        })
      } else {
        this.form.files.splice(deleteIndex, 1)
      }
    },
    save() {
      if (!this.judgeAuthority('修改')) {
        this.$message.error('对不起，您没有修改采购合同的权限，请联系管理员')
        return
      }
      let isSave = true
      const ajaxData = JSON.parse(JSON.stringify(this.form))
      for (const k in this.tempList) {
        const item = this.tempList[k]
        if (item.type === 'contract' || item.type === 'contractTable') {
          if (item.type === 'contract') {
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
            for (let t = 0; t < ajaxData.temp.contractTable.length; t++) {
              const row = ajaxData.temp.contractTable[t]
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
            if (isSave) ajaxData.temp.contractTable = list
          }
        }
      }
      if (isSave) {
        console.log(ajaxData)
        updatePurchaseContract(ajaxData).then(res => {
          this.$message.success(`保存成功！`)
          this.$router.push({
            name: 'PurchaseContract',
            query: {
              type: 'edit',
              id: res._id
            }
          })
        })
      }
    },
    setContract(action) {
      if (!this.judgeAuthority(action)) {
        this.$message.error(`对不起，您没有${action}采购合同的权限，请联系管理员`)
        return
      }
      this.$confirm(`确定${action}该合同?`, '提示', {
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
        updatePurchaseContract(ajaxData).then(res => {
          this.$message.success(`${action}成功！`)
          this.loadContract()
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
            if (list[i].label === '采购合同') {
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
    exportFun() {
      if (!this.judgeAuthority('导出')) {
        this.$message.error(`对不起，您没有导出采购合同的权限，请联系管理员`)
        return
      }
      this.$router.push({
        name: 'ContractExport',
        query: {
          id: this.$route.query.id
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .purchase-contract {
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
