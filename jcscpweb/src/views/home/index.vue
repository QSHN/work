<template>
  <div class="home-container" style="overflow: auto;">
    <template v-if="judgeAuthority">
      <el-row type="flex" justify="center" style="font-size: 24px; margin: 50px 0 30px;">
        全联集采客户情况表
      </el-row>

      <el-row type="flex" justify="center" style="position: relative;">
        <el-button size="small" class="export_btn" @click="exportFun">导出</el-button>
        <div style="width: 1202px;">
          <el-table
            id="summaryTable"
            v-loading="loading"
            :data="tableData"
            border
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column
              prop="serialNumber"
              label="编号"
              sortable
              width="200"
            />
            <el-table-column
              prop="containerNumber"
              label="集装箱总数"
              sortable
              width="200"
            />
            <el-table-column
              prop="inStorage"
              label="已入库柜数"
              sortable
              width="200"
            />
            <el-table-column
              prop="shipped"
              label="已发货柜数"
              sortable
              width="200"
            />
            <el-table-column
              prop="portNumber"
              label="到港数（十个工作日）"
              sortable
              width="200"
            />
            <el-table-column
              prop="amountPayable"
              label="应付金额（十个工作日）"
              sortable
              width="200"
            >
              <template slot-scope="scope">
                {{ formatMoney(scope.row.amountPayable, '', 2) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-row>
    </template>

    <template v-else>
      <el-row type="flex" justify="center" style="font-size: 24px; margin: 50px 0 30px;">
        欢迎登录使用全联集采系统
      </el-row>
    </template>

    <div class="tip">湛江蓝卓科技有限公司</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { summarySheet } from '../../api/purchase'
import { formatMoney } from 'accounting'
export default {
  name: 'Home',
  data() {
    return {
      tableData: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'myInfo',
      'allUserList'
    ]),
    judgeAuthority() {
      let bool = false
      // && this.myInfo.role !== 'admin'
      if (this.myInfo && this.myInfo.role !== 'admin') {
        const pList = this.myInfo.permission.permission
        const checked = this.myInfo.permission.checked
        const findFun = (list) => {
          for (let i = 0; i < list.length; i++) {
            if (list[i].label === '汇总表') {
              const look = list[i].children.find(f => f.label === '查看权')
              let which = null
              look.children.forEach((f, i) => {
                if (checked.find(id => f.id.substr(0, id.length) === id)) {
                  bool = true
                  which = i
                }
              })
              if (bool) {
                let ids = []
                if (which === 0) {
                  ids = [this.myInfo._id]
                } else if (which === 1) {
                  ids = this.allUserList.filter(f => f.employeeSuperior.includes(this.myInfo._id)).map(m => m._id)
                  ids.push(this.myInfo._id)
                } else {
                  ids = this.allUserList.map(v => v._id)
                }
                if (ids.length) this.load(ids)
              }
              return
            } else if (list[i].children && list[i].children.length) {
              findFun(list[i].children)
            }
          }
        }
        findFun(pList)
      } else {
        bool = true
        const ids = this.allUserList.map(v => v._id)
        if (ids.length) this.load(ids)
      }
      return bool
    }
  },
  methods: {
    formatMoney,
    load(ids) {
      this.loading = true
      summarySheet({
        creators: ids
      }).then(res => {
        this.tableData = res
        this.loading = false
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
        if (index === columns.length - 1 && sums[index]) sums[index] = formatMoney(sums[index], '', 2)
      })
      return sums
    },
    exportFun() {
      const base64 = function(s) {
        return window.btoa(unescape(encodeURIComponent(s)))
      }
      // 替换table数据和worksheet名字
      const format = function(s, c) {
        return s.replace(/{(\w+)}/g,
          function(m, p) {
            return c[p]
          })
      }
      const uri = 'data:application/vnd.ms-excel;base64,'
      const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"' +
        'xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>' +
        '<x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets>' +
        '</x:ExcelWorkbook></xml><![endif]-->' +
        ' <style type="text/css">' +
        'table td {' +
        'width: 150px;' +
        'height: 40px;' +
        ' }' +
        '</style>' +
        '</head><body >{table}</body></html>'
      const ctx = { worksheet: 'sheet', table: document.getElementById('summaryTable').innerHTML }
      // console.log(document.getElementById('purchaseListTable'))
      const url = uri + base64(format(template, ctx))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute(
        'download',
        `全联集采汇总表`
      )
      document.body.appendChild(link)
      link.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-container {
    position: relative;
    margin: 30px;
    min-height: calc(100vh - 130px);

    .tip {
      position: fixed;
      right: 20px;
      bottom:  20px;
    }

    .export_btn {
      position: absolute;
      top: -40px;
      margin-left: 551px;
      width: 100px;
    }
  }
}
</style>
