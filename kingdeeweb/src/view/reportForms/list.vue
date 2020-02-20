<template>
 <div>
   <Row style="margin-bottom: 10px;">
     <Button style="margin-right: 5px" @click="create">创建</Button>
   </Row>
   <Table
     width="502"
     :columns="columns"
     :data="tableData"
     border>
     <template slot-scope="{ row }" slot="action">
       <Button size="small" style="margin-right: 5px" @click="go(row.type)">查看</Button>
       <Button size="small" style="margin-right: 5px" @click="copy(row)">复制</Button>
       <Button size="small" :disabled="row._index <= 2" @click="deleteFun(row.type)">删除</Button>
     </template>
   </Table>

   <Modal
     v-model="modal"
     title="创建报表"
     :mask-closable="false"
     width="500"
     @on-cancel="cancel">

     <Row type="flex" style="line-height: 32px; margin-bottom: 10px;">
       <p style="width: 100px; text-align: right; margin-right: 5px;">表名：</p>
       <Input v-model="formData.title" style="width: 200px" />
     </Row>

     <Row type="flex" style="line-height: 32px; margin-bottom: 10px;">
       <p style="width: 100px; text-align: right; margin-right: 5px;">行数：</p>
       <InputNumber :min="2" :disabled="!!formData.list.length" v-model="formData.rowNumber" style="width: 200px" />
     </Row>

     <Row type="flex" style="line-height: 32px; margin-bottom: 10px;">
       <p style="width: 100px; text-align: right; margin-right: 5px;">列数：</p>
       <InputNumber :min="2" :disabled="!!formData.list.length" v-model="formData.columnNumber" style="width: 200px" />
     </Row>

     <div slot="footer">
       <Button type="text" @click="cancel">取消</Button>
       <Button @click="sure">保存</Button>
     </div>
   </Modal>
 </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formulaQuery, formulaUpdate, formulaDelete } from '../../api/formula'
export default {
  name: 'reportFormsList',
  data () {
    return {
      tableData: [],
      columns: [
        {
          title: '表名',
          key: 'title',
          width: 300,
          resizable: true
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center',
          resizable: true
        }
      ],
      modal: false,
      formData: {
        title: null,
        rowNumber: 10,
        columnNumber: 3,
        list: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ])
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadFormula()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    loadFormula () {
      formulaQuery({ accountSetId: this.accountSet._id }).then(res => {
        let {
          assets,
          profit,
          ownerEquity,
          custom
        } = res.data
        let list = []
        list.push({
          title: '资产负债表',
          list: assets,
          type: 'assets'
        })
        list.push({
          title: '利润表',
          list: profit,
          type: 'profit'
        })
        list.push({
          title: '所有者权益变动表',
          list: ownerEquity,
          type: 'ownerEquity'
        })
        if (custom) {
          for (let key in custom) {
            list.push(Object.assign({
              type: key
            }, custom[key]))
          }
        }
        this.tableData = list
      }).catch(err => {
        this.$Notice.error({
          title: '公式',
          desc: err.message
        })
      })
    },
    go (type) {
      if (type === 'assets') {
        this.$router.push({ name: 'balanceSheetIndex' })
      } else if (type === 'profit') {
        this.$router.push({ name: 'profitIndex' })
      } else if (type === 'ownerEquity') {
        this.$router.push({ name: 'ownerEquityIndex' })
      } else {
        this.$router.push({
          name: 'reportFormsCustom',
          query: { type: type }
        })
      }
    },
    deleteFun (type) {
      this.$Modal.confirm({
        title: `删除`,
        content: `确定是否该财务报表吗`,
        onOk: () => {
          formulaDelete({
            accountSetId: this.accountSet._id,
            type: type
          }).then(res => {
            this.cancel()
            this.loadFormula()
          }).catch(err => {
            this.$Notice.error({
              title: '公式',
              desc: err.message
            })
          })
        }
      })
    },
    copy (row) {
      this.modal = true
      this.formData = {
        title: null,
        rowNumber: row.list.length,
        columnNumber: Object.keys(row.list[0]).length,
        list: row.list
      }
    },
    create () {
      this.modal = true
    },
    cancel () {
      this.modal = false
      this.formData = {
        title: null,
        rowNumber: 10,
        columnNumber: 3,
        list: []
      }
    },
    sure () {
      let ajaxData = {}
      if (!this.formData.title) {
        this.$Message.error('标题必填')
      } else {
        if (this.formData.list.length) {
          ajaxData = {
            title: this.formData.title,
            list: this.formData.list
          }
        } else {
          let list = []
          let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
          for (let r = 0; r < this.formData.rowNumber; r++) {
            let obj = {}
            for (let c = 0; c < this.formData.columnNumber; c++) {
              if (r === 0) {
                this.$set(obj, arr[c], {
                  padding: 0,
                  align: 'center',
                  val: '',
                  type: c === 0 ? 'title' : 'formula'
                })
              } else {
                this.$set(obj, arr[c], {
                  padding: 0,
                  align: c === 0 ? 'left' : 'right',
                  val: c === 0 ? '' : null
                })
              }
            }
            list.push(obj)
          }
          ajaxData = {
            title: this.formData.title,
            list: list
          }
        }
        formulaUpdate({
          accountSetId: this.accountSet._id,
          list: ajaxData,
          type: 'custom'
        }).then(res => {
          this.cancel()
          this.loadFormula()
        }).catch(err => {
          this.$Notice.error({
            title: '公式',
            desc: err.message
          })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
