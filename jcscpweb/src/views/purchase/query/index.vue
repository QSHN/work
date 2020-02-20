<template>
  <div v-loading="loading" class="purchase-query-container">
    <el-row type="flex">
      <el-form>
        <el-form-item label="提单号：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-autocomplete
            v-model="search.oneBill"
            :fetch-suggestions="queryBill"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item label="发票号：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-autocomplete
            v-model="search.invoiceNumber"
            :fetch-suggestions="queryInvoiceNumber"
            size="small"
            clearable
          />
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="合同号：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-autocomplete
            v-model="search.contractNumber"
            :fetch-suggestions="queryContractNumber"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item label="柜号：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-autocomplete
            v-model="search.tankNo"
            :fetch-suggestions="queryTankNo"
            size="small"
            clearable
          />
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="编号：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-autocomplete
            v-model="search.serialNumber"
            :fetch-suggestions="querySerialNumber"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item label="跟单员：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-autocomplete
            v-model="search.merchandiser"
            :fetch-suggestions="queryMerchandiser"
            size="small"
            clearable
          />
        </el-form-item>
      </el-form>
      <div>
        <el-form>
          <el-form-item label="入库时间：" :label-width="'100px'" style="margin-bottom: 5px;">
            <el-date-picker
              v-model="search.storageTime"
              type="daterange"
              align="right"
              size="small"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 370px"
              :picker-options="pickerOptions"
              clearable
            />
          </el-form-item>

          <el-form-item label="合同日期：" :label-width="'100px'" style="margin-bottom: 5px;">
            <el-date-picker
              v-model="search.contractDate"
              type="daterange"
              align="right"
              size="small"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 370px"
              :picker-options="pickerOptions"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
    </el-row>

    <el-row type="flex">
      <el-form inline>
        <el-form-item label="客户名：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-autocomplete
            v-model="search.clientName"
            :fetch-suggestions="queryClientName"
            size="small"
            clearable
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="订单状态：" :label-width="'85px'" style="margin-bottom: 5px;">
          <el-autocomplete
            v-model="search.orderStatus"
            :fetch-suggestions="orderStatus"
            size="small"
            clearable
          />
        </el-form-item>

        <el-form-item label="审核状态：" :label-width="'85px'" style="margin-bottom: 5px;">
          <el-select
            v-model="search.status"
            size="small"
          >
            <el-option
              v-for="(v1, i1) in ['全部', '已审核', '未审核']"
              :key="i1"
              :label="v1"
              :value="v1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label=" " :label-width="'100px'" style="margin-bottom: 5px; margin-left: -15px;">
          <el-button size="small" @click="load(true, currentPage)">清空并刷新</el-button>
          <el-button size="small" style="width: 68px" @click="load(false, 1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row style="margin-top: 20px;">
      <el-radio-group v-model="whichType" size="small" style="margin-right: 10px;">
        <el-radio-button label="全部" />
        <el-radio-button label="合同" />
        <el-radio-button label="订单" />
      </el-radio-group>
      <el-button size="small" @click="custom">自定义</el-button>
      <el-button size="small" @click="exportFun">导出</el-button>
    </el-row>

    <el-table
      :data="tableList"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      border
      row-key="rowId"
      default-expand-all
      size="small"
      style="margin-top: 10px;"
      :max-height="getTableHeader"
    >
      <el-table-column
        type="index"
        width="50"
      />
      <template v-for="(v, i) in tempList">
        <el-table-column
          v-if="v.isShow"
          :key="'temp' + i"
          :label="v.name"
          width="180"
          sortable
          :sort-by="v.name"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <template v-if="v.type === 'date'">
              {{ getValue(scope.row, v.code, v.type) ? moment(getValue(scope.row, v.code)).format('YYYY-MM-DD') : '' }}
            </template>
            <template v-else-if="v.type === 'boolean'">
              {{ getValue(scope.row, v.code, v.type) ? '是' : '否' }}
            </template>
            <template v-else-if="v.type === 'number'">
              {{ formatMoney(getValue(scope.row, v.code, v.type) || 0, '', 2) }}
            </template>
            <template v-else>
              {{ getValue(scope.row, v.code, v.type) }}
            </template>
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
          <el-button type="text" size="small" @click="set('look', scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="set('edit', scope.row)">编辑</el-button>
          <el-button type="text" size="small" style="color: #F56C6C" @click="set('delete', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next"
      :current-page.sync="currentPage"
      :page-size="10"
      :total="total"
    />

    <temp ref="temp" @setTemp="setTemp" @loadTemp="loadTemp" />
    <createTemp ref="createTemp" :is-select-contract="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  queryPurchaseContract,
  queryPurchaseOrder,
  queryPurchaseSelfTemp,
  deletePurchaseContract,
  deletePurchaseOrder,
  queryContractOrOrder,
  exportData
} from '../../../api/purchase'
import moment from 'moment'
import temp from './temp'
import createTemp from './create'
import NP from 'number-precision'
import { formatMoney } from 'accounting'
export default {
  name: 'PurchaseQuery',
  components: {
    temp,
    createTemp
  },
  data() {
    return {
      tempData: null,
      loading: false,
      contractList: [],
      orderList: [],
      tempList: [],
      total: 0,
      search: {
        oneBill: '',
        invoiceNumber: '',
        contractNumber: '',
        tankNo: '',
        clientName: '',
        serialNumber: '',
        merchandiser: '',
        orderStatus: '运输中',
        storageTime: null,
        contractDate: null,
        status: '全部'
      },
      currentPage: 1,
      whichType: '全部',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      tableCList: [],
      tableOList: []
    }
  },
  computed: {
    ...mapGetters([
      'myInfo',
      'allUserList',
      'basicInfo'
    ]),
    tableList() {
      let result = []
      if (!this.loading) {
        if (this.whichType === '订单') {
          result = this.tableOList.map((m, mIndex) => {
            const fData = this.contractList.find(f => f.temp.supplier.contractNumber === m.temp.order.contractNumber)
            return {
              _id: m._id,
              temp: Object.assign(m.temp, fData ? fData.temp : {}),
              rowId: (mIndex + 1) + '0000',
              routerName: 'PurchaseOrder',
              status: m.status
            }
          })
        } else {
          this.tableCList.forEach((v, i) => {
            const obj = JSON.parse(JSON.stringify(v))
            obj.rowId = (i + 1) + '0000'
            obj.routerName = 'PurchaseContract'
            const children = this.tableOList.filter(f =>
              f.temp.order.contractNumber === v.temp.supplier.contractNumber
            ).map((m, mIndex) => {
              return {
                _id: m._id,
                temp: Object.assign(m.temp, v.temp),
                rowId: parseInt((i + 1) + '0000' + (mIndex + 1)),
                routerName: 'PurchaseOrder',
                status: m.status
              }
            })
            if (this.whichType === '全部') {
              obj.children = children
              result.push(obj)
            } else if (this.whichType === '合同') {
              result.push(obj)
            }
          })
        }
      }
      // console.log(result)
      return result
    },
    getTableHeader() {
      return window.innerHeight - 330
    }
  },
  watch: {
    whichType() {
      this.load(false, this.currentPage)
    },
    currentPage() {
      this.load(false, this.currentPage)
    }
  },
  created() {
    this.load(true, 1)
    this.loadTemp()
    this.loadAll()
  },
  methods: {
    formatMoney,
    moment,
    load(clear, currentPage) {
      this.loading = true
      this.currentPage = currentPage
      const isSub = this.judgeAuthority('采购列表', 1, '查看自己和下属的采购订单和合同')
      const isAll = this.judgeAuthority('采购列表', 1, '查看所有采购订单和合同')
      let subList = []
      if (isSub) {
        subList = this.allUserList.filter(f => f.employeeSuperior.includes(this.myInfo._id)).map(m => m._id)
      }
      subList.push(this.myInfo._id)
      if (clear) {
        this.search = {
          oneBill: '',
          invoiceNumber: '',
          contractNumber: '',
          tankNo: '',
          clientName: '',
          serialNumber: '',
          merchandiser: '',
          storageTime: null,
          orderStatus: '运输中',
          contractDate: null,
          status: '全部'
        }
      }
      const filter = {
        type: this.whichType,
        contract: {},
        order: {},
        pageInfo: {
          limit: 10,
          page: this.currentPage
        }
      }
      if (this.myInfo.infoCode) {
        this.$set(filter.contract, 'temp.supplier.clientName', this.myInfo.infoCode)
      } else {
        if (!isAll) this.$set(filter.contract, 'creator', { $in: subList })
      }
      if (this.search.contractNumber) this.$set(filter.contract, 'temp.supplier.contractNumber', { $regex: this.search.contractNumber })
      if (this.search.clientName) this.$set(filter.contract, 'temp.supplier.clientName', { $regex: this.search.clientName })
      if (this.search.serialNumber) this.$set(filter.contract, 'temp.supplier.serialNumber', { $regex: this.search.serialNumber })
      if (this.search.merchandiser) this.$set(filter.contract, 'temp.supplier.merchandiser', { $regex: this.search.merchandiser })
      if (this.search.status !== '全部') this.$set(filter.contract, 'status', this.search.status)

      if (this.search.oneBill) this.$set(filter.order, 'temp.document.oneBill', { $regex: this.search.oneBill })
      if (this.search.tankNo) this.$set(filter.order, 'temp.document.tankNo', { $regex: this.search.tankNo })
      if (this.search.invoiceNumber) this.$set(filter.order, 'temp.order.invoiceNumber', { $regex: this.search.invoiceNumber })
      if (this.search.orderStatus) this.$set(filter.order, 'temp.logistics.orderStatus', { $regex: this.search.orderStatus })
      if (this.search.status !== '全部') this.$set(filter.order, 'status', this.search.status)

      if (this.search.storageTime) {
        this.$set(filter.order, 'temp.logistics.storageTime', {
          $gte: this.moment(this.moment(this.search.storageTime[0]).format('YYYY-MM-DD') + ' 00:00:00'),
          $lte: this.moment(this.moment(this.search.storageTime[1]).format('YYYY-MM-DD') + ' 23:59:59.999')
        })
      }
      if (this.search.contractDate) {
        this.$set(filter.contract, 'temp.supplier.contractDate', {
          $gte: this.moment(this.moment(this.search.contractDate[0]).format('YYYY-MM-DD') + ' 00:00:00'),
          $lte: this.moment(this.moment(this.search.contractDate[1]).format('YYYY-MM-DD') + ' 23:59:59.999')
        })
      }
      queryContractOrOrder(filter).then(res => {
        this.total = res.total
        this.tableCList = res.cList || []
        this.tableOList = res.oList || []
        this.loading = false
      })
    },
    loadAll() {
      queryPurchaseContract().then(res => {
        this.contractList = res
      })
      queryPurchaseOrder().then(res => {
        this.orderList = res
      })
    },
    loadTemp() {
      queryPurchaseSelfTemp().then(res => {
        this.tempList = res.temp.purchaseTable.temp
        this.tempData = res
      })
    },
    queryBill(queryString, cb) {
      const list = []
      this.orderList.forEach(f => {
        const oneBill = f.temp.document.oneBill
        if (oneBill &&
          oneBill.includes(this.search.oneBill) &&
          list.filter(v => v.value === oneBill).length === 0
        ) list.push({ value: oneBill })
      })
      cb(list)
    },
    queryInvoiceNumber(queryString, cb) {
      const list = []
      this.orderList.forEach(f => {
        const invoiceNumber = f.temp.order.invoiceNumber
        if (invoiceNumber &&
          invoiceNumber.includes(this.search.invoiceNumber) &&
          list.filter(v => v.value === invoiceNumber).length === 0
        ) list.push({ value: invoiceNumber })
      })
      cb(list)
    },
    queryContractNumber(queryString, cb) {
      const list = []
      this.contractList.forEach(f => {
        const contractNumber = f.temp.supplier.contractNumber
        if (contractNumber &&
          contractNumber.includes(this.search.contractNumber) &&
          list.filter(v => v.value === contractNumber).length === 0
        ) list.push({ value: contractNumber })
      })
      cb(list)
    },
    queryTankNo(queryString, cb) {
      const list = []
      this.orderList.forEach(f => {
        const tankNo = f.temp.document.tankNo
        if (tankNo &&
          tankNo.includes(this.search.tankNo) &&
          list.filter(v => v.value === tankNo).length === 0
        ) list.push({ value: tankNo })
      })
      cb(list)
    },
    queryClientName(queryString, cb) {
      const list = []
      this.contractList.forEach(f => {
        const clientName = f.temp.supplier.clientName
        if (clientName &&
          clientName.includes(this.search.clientName) &&
          list.filter(v => v.value === clientName).length === 0
        ) list.push({ value: clientName })
      })
      cb(list)
    },
    querySerialNumber(queryString, cb) {
      const list = []
      this.contractList.forEach(f => {
        const serialNumber = f.temp.supplier.serialNumber
        if (serialNumber &&
          serialNumber.includes(this.search.serialNumber) &&
          list.filter(v => v.value === serialNumber).length === 0
        ) list.push({ value: serialNumber })
      })
      cb(list)
    },
    queryMerchandiser(queryString, cb) {
      const list = []
      this.contractList.forEach(f => {
        const merchandiser = f.temp.supplier.merchandiser
        if (merchandiser &&
          merchandiser.includes(this.search.merchandiser) &&
          list.filter(v => v.value === merchandiser).length === 0
        ) list.push({ value: merchandiser })
      })
      cb(list)
    },
    orderStatus(queryString, cb) {
      const list = []
      if (this.basicInfo && this.basicInfo.orderStatus) {
        this.basicInfo.orderStatus.list.forEach(f => {
          if (f.orderStatus.includes(this.search.orderStatus) &&
            list.filter(v => v.value === f.orderStatus).length === 0
          ) list.push({ value: f.orderStatus })
        })
      }
      cb(list)
    },
    getValue(row, code, type) {
      if (code) {
        if (code === 'status') return row.status
        const c = code.split('.')
        if (c[0].includes('Table')) {
          if (row.temp[c[0]]) {
            return row.temp[c[0]].reduce((total, r, i) => {
              if (type === 'number') {
                total = NP.plus(total, r[c[1]])
              } else {
                if (!total.includes(r[c[1]])) {
                  total += (i !== 0 ? ',' : '') + r[c[1]]
                }
              }
              return total
            }, '')
          }
        } else {
          if (row.temp[c[0]]) {
            return row.temp[c[0]][c[1]]
          }
        }
      }
      return ''
    },
    set(action, row) {
      if (action === 'delete') {
        const isContract = row.routerName === 'PurchaseContract'
        if (!this.judgeAuthority(isContract ? '采购合同' : '采购订单', 0, '删除')) {
          this.$message.error(`对不起，您没有删除${isContract ? '采购合同' : '采购订单'}的权限，请联系管理员`)
          return
        }
        if (row.status === '已审核') {
          this.$message.error(`该${isContract ? '合同' : '订单'}已审核，无法删除`)
        } else {
          this.$confirm(`确定删除该${isContract ? '合同' : '订单'}?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            const ajax = isContract ? deletePurchaseContract : deletePurchaseOrder
            ajax({
              _id: row._id
            }).then(res => {
              this.load()
            })
          })
        }
      } else {
        const isContract = row.routerName === 'PurchaseContract'
        if (!this.judgeAuthority(isContract ? '采购合同' : '采购订单', action === 'look' ? 1 : 0, action === 'look' ? null : '修改')) {
          this.$message.error(`对不起，您没有${action === 'look' ? '查看' : '修改'}${isContract ? '采购合同' : '采购订单'}的权限，请联系管理员`)
          return
        }
        this.$router.push({
          name: row.routerName,
          query: {
            type: action,
            id: row._id
          }
        })
        // const { href } = this.$router.resolve({
        //   name: row.routerName,
        //   query: {
        //     type: action,
        //     id: row._id
        //   }
        // })
        // window.open(href, '_blank')
      }
    },
    judgeAuthority(title, index, action) {
      let bool = false
      // && this.myInfo.role !== 'admin'
      if (this.myInfo && this.myInfo.role !== 'admin') {
        const pList = this.myInfo.permission.permission
        const checked = this.myInfo.permission.checked
        const findFun = (list) => {
          for (let i = 0; i < list.length; i++) {
            if (list[i].label === title) {
              const look = action ? list[i].children[index].children.find(f => f.label === action) : list[i].children[index]
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
    setTemp(row, whichTemp, cb) {
      this.$refs.createTemp.show(row, whichTemp, this.tempData.temp, 'purchaseTable', cb)
    },
    custom() {
      if (!this.judgeAuthority('采购列表', 0, '自定义')) {
        this.$message.error(`对不起，您没有自定义采购列表的权限，请联系管理员`)
        return
      }
      this.$refs.temp.show(this.tempData, 'purchaseTable')
    },
    exportFun() {
      if (!this.judgeAuthority('采购列表', 0, '导出')) {
        this.$message.error(`对不起，您没有导出采购列表的权限，请联系管理员`)
        return
      }
      this.$message.success('正在导出中...')
      exportData({
        type: this.whichType,
        isDetail: false
      }).then(res => {
        const blob = new Blob([res])
        const fileName = `采购表${this.moment().format('YYYY-MM-DD')}.xls`
        const linkNode = document.createElement('a')

        linkNode.download = fileName // a标签的download属性规定下载文件的名称
        linkNode.style.display = 'none'
        linkNode.href = URL.createObjectURL(blob) // 生成一个Blob URL
        document.body.appendChild(linkNode)
        linkNode.click() // 模拟在按钮上的一次鼠标单击

        URL.revokeObjectURL(linkNode.href) // 释放URL 对象
        document.body.removeChild(linkNode)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.purchase-query {
  &-container {
    margin: 30px 30px 0;
  }
}
</style>
