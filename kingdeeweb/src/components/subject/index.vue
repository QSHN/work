<template>
  <Modal
    v-model="modal"
    :title="`会计科目${isAccountItem ? '(核算项目)' : ''}`"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="800"
    @on-cancel="cancel">
    <Row type="flex" justify="space-between" style="height: 40px; line-height: 40px;">
      <RadioGroup v-model="type">
        <Radio v-for="(v, i) in subject" :key="i" :label="v._id">{{v.name}}</Radio>
      </RadioGroup>
      <Input search enter-button placeholder="科目编码/科目名称" v-model="search" style="width: 300px;" />
    </Row>
    <div style="height: 480px; overflow: auto; border-top: 1px solid #dcdee2; border-bottom: 1px solid #dcdee2;">
      <Table border :columns="subjectColumns" :data="tableData">
        <template slot-scope="{ row }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="select(row)">选择</Button>
        </template>
      </Table>
    </div>
    <div slot="footer">
      <Button type="text" @click="addSubject">创建</Button>
      <Button type="text" @click="cancel">取消</Button>
    </div>

    <subjectForm ref="subjectForm" @load="load" :subjectList="subjectAllList" :whichType="type"></subjectForm>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { subject } from '../../libs/subject'
import {
  querySubject,
  querySubjectType
} from '../../api/subject'
import subjectForm from '../../view/subject/form'
export default {
  name: 'sIndex',
  components: {
    subjectForm
  },
  props: {
    isReturnObj: {
      type: Boolean,
      default: false
    },
    isLimitAccounting: {
      type: Boolean,
      default: false
    },
    isAccountItem: {
      type: Boolean,
      default: false
    },
    isUnit: {
      type: Boolean,
      default: false
    },
    isLevel1: {
      type: Boolean,
      default: false
    },
    isMoreAccountItem: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      subject,
      modal: false,
      type: 1,
      page: {
        total: 1,
        current: 1,
        size: 20
      },
      search: '',
      pageContent: [],
      tableList: [],
      groupList: [],
      subjectList: [],
      subjectColumns: [
        {
          title: '科目编码',
          key: 'code'
        },
        {
          title: '科目名称',
          key: 'name'
        },
        {
          title: '选择',
          slot: 'action'
        }
      ],
      cb: null,
      subjectAllList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList'
    ]),
    tableData () {
      let list
      if (this.search) {
        list = this.subjectList.filter(v => v.code.includes(this.search) || v.name.includes(this.search))
        list = this.subjectList.filter(v => list.find(f => v._id === f._id || v.parentId.includes(f._id)))
      } else {
        let g = this.groupList.filter(v => v.type === this.type)
        list = this.subjectList.filter(v => g.filter(i => v.typeId === i._id).length)
      }
      if (this.isLevel1) {
        list = list.filter(f => f.parentId.length === 0)
      }
      return list
    }
  },
  watch: {
    search () {
      this.type = this.search ? -1 : 1
    },
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.load()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    show (cb) {
      this.modal = true
      this.cb = cb
    },
    cancel () {
      this.modal = false
      this.type = 1
    },
    load () {
      querySubjectType({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('querySubjectType', res.data)
        this.groupList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
      querySubject({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('querySubject', res.data)
        if (this.isAccountItem) {
          this.subjectList = res.data.filter(v => (this.isMoreAccountItem && v.accountItem.length > 1) || (!this.isMoreAccountItem && v.accountItem.length))
        } else if (this.isUnit) {
          this.subjectList = res.data.filter(v => v.numberUnit && v.unit)
        } else {
          this.subjectList = res.data
        }
        this.subjectAllList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
    },
    select (row) {
      if (this.cb) {
        if (this.isLimitAccounting) {
          if (row.controlledSystem) {
            this.$Notice.error({
              title: '选择科目',
              desc: `该科目受控于${row.controlledSystem}, 无法选择`
            })
            return
          } else if (this.subjectList.filter(v => v.parentId.includes(row._id)).length) {
            this.$Notice.error({
              title: '选择科目',
              desc: `请选择明细科目`
            })
            return
          }
        }
        let data = this.isReturnObj ? {
          code: row.code,
          name: row.name,
          currency: row.currency,
          unit: row.unit,
          accountItem: row.accountItem
        } : row.code
        this.cb(data)
        this.cancel()
      }
    },
    addSubject () {
      let formData = {
        accountSetId: this.accountSet._id,
        typeId: null,
        type: '',
        code: '',
        balance: '借方',
        currency: '不核算',
        parentId: []
      }
      let gList = this.groupList.filter(v => v.type === this.type)
      this.$refs.subjectForm.show('新建', null, this.subjectAllList, formData, gList)
    }
  }
}
</script>

<style scoped>

</style>
