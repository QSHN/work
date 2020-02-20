<template>
  <div>
    <Row type="flex" justify="space-between" style="margin-bottom: 15px;">
      <Col>
        <span style="margin-right: 10px; line-height: 30px;">会计期间：</span>
        <DatePicker type="month" v-model="search.accountingPeriod" style="width: 200px" :clearable="false"></DatePicker>
        <span style="margin: 0 20px; line-height: 30px;">至</span>
        <DatePicker type="month" v-model="search.accountingPeriodEnd" style="width: 200px" placement="bottom-end" :disabled="!search.accountingPeriod"></DatePicker>
        <Button @click="getValue" style="width: 80px; margin: 0 10px;">搜索</Button>
        <Button @click="getValue">重新计算</Button>
      </Col>

      <Col>
        <Button @click="isShowData = !isShowData">切换显示公式/数据</Button>
        <Button @click="$refs.printModal.show()" style="margin: 0 0 0 10px;">预览/打印</Button>
      </Col>
    </Row>

    <Table
      class="input_table"
      :width="getTableWidth"
      :height="getTableHeight"
      :columns="columns"
      :data="tableData" border>
      <template slot-scope="{ row }" slot="index">
        <template v-if="row._index === 0 || isShowData">
          {{ row._index + 1 }}
        </template>
        <template v-else>
          <div class="text" style="padding-left: 0">{{ row._index + 1 }}</div>
          <div class="hover_layer" style="padding-left: 0">
            <div class="btn_group">
              <div class="add" @click="editRow(false, $route.query.type, tableData, row._index)"><Icon type="md-add-circle" /></div>
              <div class="delete" @click="editRow(true, $route.query.type, tableData, row._index)"><Icon type="md-close-circle" /></div>
            </div>
          </div>
        </template>
      </template>

      <template slot-scope="{ row, column }" slot="content">
        <div v-if="(row._index === 0 || tableData[0][column.title].type === 'title')"
             :class="{change: !isShowData}"
             :style="{ textAlign: row[column.title].align, padding: `2px 5px 2px ${row[column.title].padding}px` }"
             @click="editTitle($route.query.type, tableData, row, column.title)">
          {{ row[column.title].val || (isShowData ? '' : '无')}}
        </div>

        <template v-else-if="tableData[0][column.title].type === 'formula'">
          <div v-if="!isShowData"
               style="height: 60px; display: flex; align-items: center; justify-content: center;"
               class="change"
               v-html="getFormulaContent(row[column.title], 'formula')"
               @click="editFormula($route.query.type, tableData, row, column.title)">
          </div>
          <div v-else :style="{ textAlign: row[column.title].align, padding: `2px 5px 2px 0`}">
            {{ row[column.title].money !== undefined ? formatMoney(row[column.title].money, '', 2) : '' }}
          </div>
        </template>
      </template>
    </Table>

    <formulaModal ref="formulaModal" @load="loadFormula" :subjectList="subjectList" />
    <titleModal ref="titleModal" @load="loadFormula" />
    <printModal ref="printModal" :printList="getPrint" :printType="'custom'" :period="search" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { querySubject } from '../../api/subject'
import { formulaQuery } from '../../api/formula'
import NP from 'number-precision'
import { formatMoney } from 'accounting'
import formulaModal from './formulaModal'
import titleModal from './titleModal'
import printModal from '../../components/print/index'
import moment from 'moment'
export default {
  name: 'notCache',
  components: {
    formulaModal,
    titleModal,
    printModal
  },
  data () {
    return {
      search: {
        accountingPeriod: null,
        accountingPeriodEnd: null
      },
      subjectList: [],
      tableData: [],
      columns: [
        {
          title: ' ',
          align: 'center',
          width: 50,
          slot: 'index'
        },
        {
          title: 'A',
          align: 'center',
          slot: 'content'
        },
        {
          title: 'B',
          align: 'center',
          slot: 'content'
        },
        {
          title: 'C',
          align: 'center',
          slot: 'content'
        },
        {
          title: 'D',
          align: 'center',
          slot: 'content'
        },
        {
          title: 'E',
          align: 'center',
          slot: 'content'
        },
        {
          title: 'F',
          align: 'center',
          slot: 'content'
        }
      ],
      isShowData: true,
      isUpdateData: false
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getPrint () {
      return this.isUpdateData ? [] : this.tableData
    },
    getTableHeight () {
      return window.innerHeight - 180
    },
    getTableWidth () {
      return window.innerWidth - 100
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.search.accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
          this.loadSubject()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    formatMoney,
    loadSubject () {
      querySubject({ accountSetId: this.accountSet._id }).then(res => {
        this.subjectList = res.data
        this.loadFormula()
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
    },
    loadFormula () {
      formulaQuery({ accountSetId: this.accountSet._id }).then(res => {
        let { custom } = res.data
        let columns = [{
          title: ' ',
          align: 'center',
          width: 50,
          slot: 'index',
          resizable: true
        }]
        for (let key in custom[this.$route.query.type].list[0]) {
          columns.push({
            title: key,
            align: 'center',
            slot: 'content',
            resizable: true,
            renderHeader: (h, params) => {
              return h('div', {
                class: 'table_hover_header'
              }, [
                h('Icon', {
                  props: {
                    type: 'md-add-circle',
                    size: 18
                  },
                  style: {
                    position: 'absolute',
                    right: '25px',
                    cursor: 'pointer',
                    display: this.isShowData ? 'none' : 'block'
                  },
                  on: {
                    click: (val) => {
                      this.editColumn(false, this.$route.query.type, this.tableData, params.column.title)
                    }
                  }
                }),
                h('Icon', {
                  props: {
                    type: 'md-close-circle',
                    size: 18
                  },
                  style: {
                    position: 'absolute',
                    right: '5px',
                    cursor: 'pointer',
                    display: this.isShowData ? 'none' : 'block'
                  },
                  on: {
                    click: (val) => {
                      this.editColumn(true, this.$route.query.type, this.tableData, params.column.title)
                    }
                  }
                }),
                h('span', params.column.title)
              ])
            }
          })
        }
        this.columns = columns
        this.tableData = custom[this.$route.query.type].list
        this.getValue()
      }).catch(err => {
        this.$Notice.error({
          title: '公式',
          desc: err.message
        })
      })
    },
    getValue () {
      let time = this.moment(new Date(this.search.accountingPeriodEnd || this.search.accountingPeriod)).format('YYYY-M')
      let year = time.split('-')[0]
      let formula = (list, fTime, fYear) => {
        let val = 0
        list.forEach((v, i) => {
          if (v.list.length > 1) {
            val = NP[list[i].type === 'add' ? 'plus' : 'minus'](val, this.getFormula(v.list[0], v.list[1], fTime, fYear, v.fetch))
          } else {
            val = NP[list[i].type === 'add' ? 'plus' : 'minus'](val, this.getFormula(v.list[0], null, fTime, fYear, v.fetch))
          }
        })
        return val
      }
      this.tableData.forEach(v => {
        for (let key in v) {
          let isYear = this.tableData[0][key].val.includes('年') && !this.tableData[0][key].val.includes('本')
          let item = v[key]
          if (item.formula) {
            if (item.formula.type === 'ACCT') item.money = formula(item.formula.child, isYear ? null : time, isYear ? year : null)
          }
        }
      })
      this.calculate()
    },
    getFormula (code, codeEnd, time, year, type) {
      let val = 0
      this.subjectList.forEach(v => {
        let direction = v.balance === '借方'
        if (
          (codeEnd && v.code >= code && v.code <= codeEnd && v.parentId.length === 0) ||
            (!codeEnd && v.code === code)
        ) {
          let fData = null
          if (time) {
            fData = v.eachBalance.find(f => f.time === time)
          } else if (year) {
            fData = v.eachYearBalance.find(f => f.time === year)
          }
          if (fData) {
            switch (type) {
              case 'Y':
                val = NP.plus(val, NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](fData.beginningBalance || 0, fData.borrower || 0), fData.lender || 0))
                break
              case 'JY':
                if (direction) val = NP.plus(val, NP.minus(NP.plus(fData.beginningBalance || 0, fData.borrower || 0), fData.lender || 0))
                break
              case 'DY':
                if (!direction) val = NP.plus(val, NP.minus(NP.plus(fData.beginningBalance || 0, fData.lender || 0), fData.borrower || 0))
                break

              case 'C':
                val = NP.plus(val, fData.beginningBalance || 0)
                break
              case 'JC':
                if (direction) val = NP.plus(val, fData.beginningBalance || 0)
                break
              case 'DC':
                if (!direction) val = NP.plus(val, fData.beginningBalance || 0)
                break

              case 'JF':
                val = NP.plus(val, fData.borrower || 0)
                break
              case 'DF':
                val = NP.plus(val, fData.lender || 0)
                break

              case 'SY':
                if (direction) {
                  val = NP.minus(fData.borrower || 0, fData.lender || 0)
                } else {
                  val = NP.minus(fData.lender || 0, fData.borrower || 0)
                }
                break
            }
          }
        }
      })
      return val
    },
    calculate () {
      this.isUpdateData = true
      this.tableData.forEach((v, i) => {
        for (let key in v) {
          let item = v[key]
          if (item.formula) {
            if (item.formula.type === 'SUM') item.money = this.total(item.formula.child)
          }
        }
      })
      this.$nextTick(() => {
        this.isUpdateData = false
      })
    },
    total (list) {
      let val = 0
      list.forEach((v, i) => {
        let startType = v.list[0].charAt(0)
        let startWhich = parseInt(v.list[0].substr(1, v.list[0].length - 1))
        if (v.list.length > 1) {
          let endWhich = parseInt(v.list[1].substr(1, v.list[1].length - 1))
          let totalVal = 0
          for (let index = startWhich; index <= endWhich; index++) {
            totalVal = NP.plus(totalVal, this.tableData[index - 1][startType].money || 0)
          }
          val = NP[list[i].type === 'add' ? 'plus' : 'minus'](val, totalVal)
        } else {
          val = NP[list[i].type === 'add' ? 'plus' : 'minus'](val, this.tableData[startWhich - 1][startType].money || 0)
        }
      })
      return val
    },
    getFormulaContent (row, type) {
      let text = ''
      if (!row[type]) return '无'
      text = '= '
      let formula = row[type]
      if (formula.type === 'ACCT') {
        formula.child.forEach((v, i) => {
          if (v.list.length > 1) {
            text += `ACCT("${v.list[0]}：${v.list[1]}"，"${v.fetch}"，${type.includes('1') ? '0，0，0' : '0，1，1'}，"") ${i !== (formula.child.length - 1) ? v.type === 'add' ? '+' : '-' : ''}</br>`
          } else {
            text += `ACCT("${v.list[0]}"，"${v.fetch}"，${type.includes('1') ? '0，0，0' : '0，1，1'},"") ${i !== (formula.child.length - 1) ? v.type === 'add' ? '+' : '-' : ''}</br>`
          }
        })
      } else if (formula.type === 'SUM') {
        formula.child.forEach((v, i) => {
          if (v.list.length > 1) {
            text += 'SUM(' + v.list[0] + ':' + v.list[1] + ')' + (i !== (formula.child.length - 1) ? v.type === 'add' ? '+' : '-' : '')
          } else {
            text += v.list[0] + (i !== (formula.child.length - 1) ? v.type === 'add' ? '+' : '-' : '')
          }
        })
      }
      return text
    },
    editFormula (type, data, row, which) {
      let sumList = this.columns.filter(f => f.title !== ' ' && this.tableData[0][f.title].type === 'formula').map(m => m.title)
      let unSelect = [1]
      this.$refs.formulaModal.show(type, data, row, which, sumList, unSelect)
    },
    editTitle (type, data, row, which) {
      if (this.isShowData) return
      this.$refs.titleModal.show(type, data, row, which)
    },
    editRow (isDelete, type, data, index) {
      this.$refs.titleModal.editRow(isDelete, type, data, index)
    },
    editColumn (isDelete, type, data, index) {
      this.$refs.titleModal.editColumn(isDelete, type, data, index)
    }
  }
}
</script>

<style lang="less" scoped>
  .change {
    cursor: pointer;

    &:hover {
      opacity: 0.5;
    }
  }
  .btn_group {
    display: inline-block;

    .add,
    .delete {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;

      &:hover {
        color: #4d8afa;
      }
    }
  }
</style>

<style lang="less">
  .table_hover_header {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      opacity: 0;

      &:hover {
        color: #4d8afa;
      }
    }

    &:hover i {
      opacity: 1;
    }
  }
</style>
