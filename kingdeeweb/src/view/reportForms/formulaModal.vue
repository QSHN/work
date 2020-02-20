<template>
  <Modal
    v-model="modal"
    title="修改公式"
    :mask-closable="false"
    width="1000"
    @on-cancel="cancel">

    <template v-if="formula">
      <Row type="flex" style="line-height: 32px; margin-bottom: 10px;" v-if="formula.type === 'ACCT'">
        <p>运算符号：</p>
        <Select v-model="formData.type" style="width:100px; margin-right: 10px;">
          <Option v-for="item in typeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
        </Select>
        <p>科目：</p>
        <Select v-model="formData.list[0]" filterable style="width: 200px">
          <Option v-for="item in getSubjectList" :value="item.code" :key="item.code">{{ item.code }} {{ item.name }}</Option>
        </Select>
        <p style="margin: 0 5px;">至</p>
        <Select v-model="formData.list[1]" filterable clearable style="width: 200px" placeholder="非必填">
          <Option v-for="item in getSubjectList" :value="item.code" :key="item.code">{{ item.code }} {{ item.name }}</Option>
        </Select>
        <p style="margin-left: 10px;">取数规则：</p>
        <Select v-model="formData.fetch" style="width:150px; margin-right: 10px;">
          <Option v-for="item in fetchList" :value="item.code" :key="item.code">{{ item.code }} {{ item.name }}</Option>
        </Select>
        <Button type="success" @click="addFormula(true)">{{formData._index !== undefined ? '修改' : '添加'}}</Button>
      </Row>

      <Row type="flex" style="line-height: 32px; margin-bottom: 10px;" v-else>
        <p>运算符号：</p>
        <Select v-model="formData.type" style="width:100px; margin-right: 10px;">
          <Option v-for="item in typeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
        </Select>
        <p>单元格：</p>
        <Select v-model="formData.list[0]" filterable style="width: 200px">
          <OptionGroup v-for="(item, index) in sumList" :label="item" :key="index">
            <Option v-for="v in ajaxData.length" :value="item + v" :key="item + v" :disabled="unSelect.includes(v)">{{ item + v }}</Option>
          </OptionGroup>
        </Select>
        <p style="margin: 0 5px;">至</p>
        <Select v-model="formData.list[1]" filterable clearable style="width: 200px; margin-right: 10px;" placeholder="非必填">
          <OptionGroup v-for="(item, index) in sumList" :label="item" :key="index">
            <Option v-for="v in ajaxData.length" :value="item + v" :key="item + v" :disabled="unSelect.includes(v)">{{ item + v }}</Option>
          </OptionGroup>
        </Select>
        <Button type="success" @click="addFormula(false)">{{formData._index !== undefined ? '修改' : '添加'}}</Button>
      </Row>

      <Table :columns="formula.type === 'ACCT' ? columns : columns1" :data="formula.child" border style="width: 100%">
        <template slot-scope="{ row }" slot="type">
          <span>{{typeList.find(v => v.code === row.type).name}}</span>
        </template>
        <template slot-scope="{ row }" slot="title">
          <span v-if="formula.type === 'ACCT'">
            {{row.list[0]}} {{subjectList.find(v => v.code === row.list[0]).name}}
            <template v-if="row.list[1]">
              至
              {{row.list[1]}} {{subjectList.find(v => v.code === row.list[1]).name}}
            </template>
          </span>
          <span v-else>
            {{row.list[0]}}
            <template v-if="row.list[1]">
              至
              {{row.list[1]}}
            </template>
          </span>
        </template>
        <template slot-scope="{ row }" slot="fetch">
          <span>{{fetchList.find(v => v.code === row.fetch).name}}</span>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button type="primary" size="small" @click="editFun(row)" style="margin-right: 5px">修改</Button>
          <Button type="error" size="small" @click="deleteFun(row._index)">删除</Button>
        </template>
      </Table>
    </template>

    <template v-else>
      <RadioGroup v-model="formulaType" style="margin-right: 10px;">
        <Radio label="ACCT"></Radio>
        <Radio label="SUM"></Radio>
      </RadioGroup>
      <Button @click="createFormula">创建</Button>
    </template>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button @click="changType">更改函数类型</Button>
      <Button @click="sure">保存并更新数据</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { formulaUpdate } from '../../api/formula'
export default {
  name: 'currency',
  props: {
    subjectList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      type: '',
      which: '',
      formData: {},
      row: {},
      formulaType: 'ACCT',
      formula: null,
      ajaxData: [],
      columns: [
        {
          title: '元算符号',
          align: 'center',
          slot: 'type',
          width: '100'
        },
        {
          title: '科目',
          align: 'center',
          slot: 'title',
          width: '500'
        },
        {
          title: '取数规则',
          align: 'center',
          slot: 'fetch',
          width: '200'
        },
        {
          title: '操作',
          align: 'center',
          slot: 'action'
        }
      ],
      columns1: [
        {
          title: '元算符号',
          align: 'center',
          slot: 'type',
          width: '100'
        },
        {
          title: '单元格',
          align: 'center',
          slot: 'title',
          width: '500'
        },
        {
          title: '操作',
          align: 'center',
          slot: 'action'
        }
      ],
      fetchList: [
        { code: 'C', name: '期初余额' },
        { code: 'Y', name: '期末余额' },
        { code: 'JC', name: '借方期初余额' },
        { code: 'DC', name: '贷方期初余额' },
        { code: 'JY', name: '借方期末余额' },
        { code: 'DY', name: '贷方期末余额' },
        { code: 'JF', name: '借方发生额' },
        { code: 'DF', name: '贷方发生额' },
        { code: 'SY', name: '损益表本期实际发生额' }
      ],
      typeList: [
        { code: 'add', name: '+' },
        { code: 'minus', name: '-' }
      ],
      sumList: [],
      unSelect: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getSubjectList () {
      return this.subjectList.filter(f => f.parentId.length === 0)
    }
  },
  methods: {
    show (type, data, row, which, sumList, unSelect) {
      this.modal = true
      this.type = type
      this.which = which
      this.formData = {
        type: null,
        list: [null, null],
        fetch: null
      }
      this.ajaxData = JSON.parse(JSON.stringify((data)))
      this.row = JSON.parse(JSON.stringify((row)))
      this.formula = row[which].formula ? JSON.parse(JSON.stringify(row[which].formula)) : null
      if (this.formula) {
        this.formulaType = this.formula.type
      } else {
        this.formulaType = 'ACCT'
      }
      this.sumList = sumList
      this.unSelect = unSelect
    },
    cancel () {
      this.modal = false
      this.formData = {
        type: null,
        list: [null, null],
        fetch: null
      }
      this.row = {}
      this.formula = null
      this.ajaxData = []
    },
    sure () {
      this.ajaxData[this.row._index][this.which] = this.formula
      let fData = {
        accountSetId: this.accountSet._id,
        list: this.ajaxData,
        type: this.type
      }
      formulaUpdate(fData).then(res => {
        this.cancel()
        this.$emit('load')
      }).catch(err => {
        this.$Notice.error({
          title: '公式',
          desc: err.message
        })
      })
    },
    createFormula () {
      if (this.formulaType) {
        this.formula = {
          type: this.formulaType,
          child: []
        }
      } else {
        this.$Notice.error({
          title: '公式',
          desc: '请选择公式函数'
        })
      }
    },
    deleteFun (i) {
      this.formula.child.splice(i, 1)
      if (this.formData._index === i) {
        this.formData = {
          type: null,
          list: [null, null],
          fetch: null
        }
      }
    },
    editFun (row) {
      this.formData = JSON.parse(JSON.stringify(row))
      if (this.formData.list.length === 1) this.formData.list.push(null)
    },
    addFormula (isFetch) {
      let data = JSON.parse(JSON.stringify(this.formData))
      data.list = data.list.filter(v => v)
      if (data.list.length && data.type && ((isFetch && data.fetch) || !isFetch)) {
        if ((isFetch && data.list.length > 1 && data.list[0] >= data.list[1]) ||
          (!isFetch && data.list.length > 1 && (data.list[0].charAt(0) !== data.list[1].charAt(0) || data.list[0] >= data.list[1]))
        ) {
          this.$Notice.error({
            title: '公式',
            desc: '范围取值不对，请检查'
          })
        } else {
          if (data._index !== undefined) {
            this.formula.child.splice(data._index, 1, data)
          } else {
            this.formula.child.push(data)
          }
          this.formData = {
            type: null,
            list: [null, null],
            fetch: null
          }
        }
      } else {
        this.$Notice.error({
          title: '公式',
          desc: '请填写完整'
        })
      }
    },
    changType () {
      this.formData = {
        type: null,
        list: [null, null],
        fetch: null
      }
      this.formula = null
    }
  }
}
</script>

<style lang="less">

</style>
