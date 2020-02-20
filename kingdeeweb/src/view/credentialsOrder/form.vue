<template>
  <Modal
    v-model="modal"
    :title="`${type}业务凭证模板`"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="1132"
    @on-cancel="cancel">
    <Form>
      <Row type="flex">
        <FormItem label="编号" style="margin-right: 20px; margin-bottom: 5px;">
          <Input v-model="formData.code" style="width: 200px" />
        </FormItem>
        <FormItem label="名称" style="margin-right: 20px; margin-bottom: 5px;">
          <Input v-model="formData.name" style="width: 200px" />
        </FormItem>
        <FormItem label="凭证字" style="margin-right: 20px; margin-bottom: 5px;">
          <Select v-model="formData.proofWordId" style="width: 200px">
            <Option v-for="(v, i) in wordsList" :key="i" :value="v._id">{{v.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="凭证日期" style="margin-right: 20px; margin-bottom: 5px;">
          <Select v-model="formData.dateTime" style="width: 200px">
            <Option v-for="(v, i) in ['单据日期', '系统日期']" :key="i" :value="v">{{ v }}</Option>
          </Select>
        </FormItem>
        <FormItem label="附件数" style="margin-bottom: 5px;">
          <Select v-model="formData.filesType" style="width: 200px">
            <Option v-for="(v, i) in ['业务单据数', '单据附件数']" :key="i" :value="v">{{ v }}</Option>
          </Select>
        </FormItem>
      </Row>

      <Row type="flex">
        <FormItem label="业务单元" style="margin-right: 20px;">
          <Input v-model="formData.category" :disabled="true" style="width: 200px" />
        </FormItem>
        <FormItem label="单据来源" style="margin-right: 20px;">
          <Input v-model="formData.orderType" :disabled="true" style="width: 200px" />
        </FormItem>
        <FormItem label="备注" style="margin-right: 20px;">
          <Input v-model="formData.ddes" style="width: 200px" />
        </FormItem>
      </Row>
    </Form>

    <Table
      v-if="formData.list"
      :width="1102"
      border
      :columns="columns"
      :data="formData.list"
      @on-row-click="rowClick"
      :row-class-name="rowClassName"
      class="input_table">
      <template slot-scope="{ row }" slot="action">
        <Button size="small" style="margin-right: 5px;" @click="setList(true)">增加</Button>
        <Button size="small" @click="setList(false, row._index)">删除</Button>
      </template>

      <template slot-scope="{ row }" slot="abstract">
        <span v-if="row._index === 0">名称-单据编号</span>
      </template>

      <template slot-scope="{ row }" slot="subjectForm">
        <div class="text">{{ row.subjectForm }}</div>
        <div class="hover_layer">
          <Select v-model="formData.list[row._index].subjectForm">
            <Option v-for="(item, index) in parameter.subjectForm" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </div>
      </template>

      <template slot-scope="{ row }" slot="subjectCode">
        <template v-if="row.subjectForm === '模板自定义科目'">
          <div class="text">{{ row.subjectCode ? subjectList.find(f => f.code === row.subjectCode).code : '' }} {{ row.subjectCode ? subjectList.find(f => f.code === row.subjectCode).name : '' }}</div>
          <div class="hover_layer">
            <Select v-model="formData.list[row._index].subjectCode" filterable clearable>
              <Option v-for="item in subjectList" :value="item.code" :key="item.code">{{ item.code }} {{ item.name }}</Option>
            </Select>
          </div>
        </template>
      </template>

      <template slot-scope="{ row }" slot="balance">
        <div class="text">{{ row.balance }}</div>
        <div class="hover_layer">
          <Select v-model="formData.list[row._index].balance">
            <Option v-for="(item, index) in ['借', '贷']" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </div>
      </template>

      <template slot-scope="{ row }" slot="currency">
        <span>人民币</span>
      </template>

      <template slot-scope="{ row }" slot="rate">
        <div class="text">{{ row.rate.toFixed(4) }}</div>
        <div class="hover_layer">
          <InputNumber :min="0" :step="0.0001"  v-model="formData.list[row._index].rate" style="width: 120px" />
        </div>
      </template>

      <template slot-scope="{ row }" slot="money">
        <div class="text">{{ row.money }}</div>
        <div class="hover_layer">
          <Select v-model="formData.list[row._index].money">
            <Option v-for="(item, index) in parameter.money" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </div>
      </template>
    </Table>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { querySubject } from '../../api/subject'
import { updateCredentialsOrder } from '../../api/credentialsOrder'
export default {
  name: 'currency',
  props: {
    credentialsOrderList: Array,
    wordsList: Array
  },
  data () {
    return {
      currentRow: null,
      modal: false,
      type: '',
      oldData: {},
      formData: {},
      parameter: {},
      columns: [
        {
          title: ' ',
          type: 'index',
          align: 'center',
          width: 50,
          resizable: true
        },
        {
          title: '操作',
          slot: 'action',
          width: 130,
          resizable: true
        },
        {
          title: '摘要',
          slot: 'abstract',
          width: 150,
          resizable: true
        },
        {
          title: '科目来源',
          slot: 'subjectForm',
          width: 200,
          resizable: true
        },
        {
          title: '科目',
          slot: 'subjectCode',
          width: 300,
          resizable: true
        },
        {
          title: '借贷方向',
          slot: 'balance',
          width: 150,
          resizable: true
        },
        {
          title: '币别',
          slot: 'currency',
          width: 150,
          resizable: true
        },
        {
          title: '汇率',
          slot: 'rate',
          width: 150,
          resizable: true
        },
        {
          title: '金额',
          slot: 'money',
          width: 150,
          resizable: true
        }
      ],
      subjectList: []
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
          this.loadSubject()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    show (type, data, parameter) {
      this.modal = true
      this.type = type
      this.parameter = parameter
      this.formData = Object.assign({}, data)
      this.oldData = data
    },
    cancel () {
      this.modal = false
      this.type = ''
      this.oldData = {}
      this.parameter = {}
    },
    sure () {
      if (!this.formData.accountSetId) {
        this.$Message.error('未知账套id')
      } else if (!this.formData.code) {
        this.$Message.error('编码为空')
      } else if (this.formData.code !== this.oldData.code && this.credentialsOrderList.filter(f => f.code.trim() === this.formData.code).length) {
        this.$Message.error('已存在编码')
      } else if (!this.formData.name) {
        this.$Message.error('名称不能为空')
      } else if (!this.formData.proofWordId) {
        this.$Message.error('凭证字不能为空')
      } else {
        let isCan = true
        for (let i = 0; i < this.formData.list.length; i++) {
          let item = this.formData.list[i]
          if (item.subjectForm === '模板自定义科目' && !item.subjectCode) {
            this.$Message.error(`第${i + 1}行科目来源为模板自定义科目时，科目不能为空`)
            isCan = false
            return
          }
          if (item.rate <= 0) {
            this.$Message.error(`第${i + 1}行汇率不正确`)
            isCan = false
            return
          }
          if (!item.money) {
            this.$Message.error(`第${i + 1}行金额不能为空`)
            isCan = false
            return
          }
        }
        if (isCan) {
          updateCredentialsOrder(this.formData).then(res => {
            this.$Message.success(`成功${this.type}业务凭证模板`)
            this.$emit('loadCredentialsOrder')
            this.cancel()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      }
    },
    rowClassName (row, index) {
      return index === this.currentRow ? 'active' : ''
    },
    rowClick (row, index) {
      this.currentRow = index
    },
    setList (action, index) {
      if (action) {
        this.formData.list.push({
          subjectForm: '模板自定义科目',
          subjectCode: null,
          balance: '借',
          number: '无',
          price: '无',
          rate: 1,
          money: null
        })
      } else {
        this.formData.list.splice(index, 1)
      }
    },
    loadSubject () {
      querySubject({ accountSetId: this.accountSet._id }).then(res => {
        this.subjectList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
    }
  }
}
</script>
