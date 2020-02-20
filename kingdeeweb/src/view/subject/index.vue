<template>
  <Card shadow style="height: 100%; overflow:hidden;">
    <Row type="flex" justify="space-between">
      <div>
        类别
        <RadioGroup v-model="whichType" type="button" style="margin-left: 5px;">
          <Radio v-for="(v, i) in subject" :key="i" :label="v._id">{{ v.name }}</Radio>
        </RadioGroup>
      </div>

      <Row>
        <Button type="primary" @click="setSubject('add', null, '新增')">新增</Button>
        <Button style="margin-left: 10px;" @click="batchOperation('删除')">批量删除</Button>
        <Button style="margin-left: 10px;" @click="batchOperation('启用')">批量启用</Button>
        <Button style="margin-left: 10px;" @click="batchOperation('禁用')">批量禁用</Button>
      </Row>
    </Row>

    <div class="mu_c">
      <Table border ref="selection" :columns="subjectColumns" :data="tableData" style="margin-top: 10px;" :height="getTableHeight" @on-selection-change="selectTable">
        <template slot-scope="{ row }" slot="action">
          <Button size="small" @click="setSubject('add', row, '新增')" style="margin-right: 5px">新增</Button>
          <Button size="small" @click="setSubject('edit', row, '修改')" style="margin-right: 5px">修改</Button>
          <Button size="small" @click="setSubject('delete', row, '删除')">删除</Button >
        </template>

        <template slot-scope="{ row }" slot="name">
          <span :style="{paddingLeft: row.parentId.length * 10 + 'px'}">{{ row.name }}</span>
        </template>

        <template slot-scope="{ row }" slot="balance">
          {{ row.balance.substr(0, 1) }}
        </template>

        <template slot-scope="{ row }" slot="accountItem">
          {{ row.accountItem.join('/') }}
        </template>

        <template slot-scope="{ row }" slot="status">
          <Button v-if="row.status === '启用'" type="primary" size="small" @click="setSubject('stop', row, '禁用')">已启用</Button>
          <Button v-if="row.status === '禁用'" type="error" size="small" @click="setSubject('unstop', row, '启用')">已禁用</Button>
        </template>
      </Table>
    </div>

    <subjectForm ref="subjectForm" @load="loadSubject" :subjectList="subjectList" :whichType="whichType"></subjectForm>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import subjectForm from './form'
import { subject } from '../../libs/subject'
import {
  updateSubject,
  querySubject,
  querySubjectType,
  subjectBatchOperation
} from '../../api/subject'
export default {
  name: 'subjectIndex',
  components: {
    subjectForm
  },
  data () {
    return {
      whichType: 1,
      groupList: [],
      tableList: [],
      selectList: [],
      subjectColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center'
        },
        {
          title: '科目编码',
          width: 200,
          key: 'code'
        },
        {
          title: '科目名称',
          slot: 'name'
        },
        {
          title: '科目类别',
          key: 'type',
          width: 200
        },
        {
          title: '余额方向',
          slot: 'balance',
          width: 100,
          align: 'center',
          key: 'balance'
        },
        {
          title: '项目辅助核算',
          width: 200,
          slot: 'accountItem'
        },
        {
          title: '状态',
          width: 120,
          slot: 'status',
          align: 'center'
        }
      ],
      subjectList: [],
      subject
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
      const g = this.groupList.filter(v => v.type === this.whichType)
      return this.subjectList.filter(v => g.filter(i => v.typeId === i._id).length)
    },
    getTableHeight () {
      return window.innerHeight - 204
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadGroup()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    loadGroup () {
      querySubjectType({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('querySubjectType', res.data)
        this.groupList = res.data
        this.loadSubject()
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
    },
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '科目') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}科目的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadSubject () {
      querySubject({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('querySubject', res.data)
        this.subjectList = res.data.map(v => {
          if (v.balance === '贷方') {
            return Object.assign({
              cellClassName: {
                balance: 'active_tb_cell'
              }
            }, v)
          } else {
            return v
          }
        })
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
    },
    setSubject (type, item, title) {
      if (!this.judge(title)) return
      let formData
      if (type !== 'add') {
        formData = this.subjectList.find(v => v._id === item._id)
      } else {
        if (item) {
          let sList = this.subjectList.filter(v => v.parentId.length > item.parentId.length && v.parentId[v.parentId.length - 1] === item._id)
          let num = sList.length + 1
          if (num > 99) {
            this.$Notice.error({
              title: '科目',
              desc: '科目编码超出范围'
            })
            return
          }
          formData = JSON.parse(JSON.stringify(item))
          formData.parentId.push(item._id)
          formData.code = item.code + '.' + (num > 10 ? num : '0' + num)
          formData.name = ''
          delete formData._id
        } else {
          formData = {
            accountSetId: this.accountSet._id,
            typeId: null,
            type: '',
            code: '',
            balance: '借方',
            currency: '不核算',
            parentId: []
          }
        }
      }
      const gList = this.groupList.filter(v => v.type === this.whichType)
      switch (type) {
        case 'add':
          this.$refs.subjectForm.show('新建', null, this.subjectList, formData, gList)
          break
        case 'edit':
          this.$refs.subjectForm.show('修改', formData, this.subjectList, null, gList)
          break
        case 'stop':
        case 'unstop':
          let status = type === 'stop' ? '禁用' : '启用'
          this.batchOperation(status, [item._id])
          break
        case 'delete':
          this.batchOperation('删除', [item._id])
          break
      }
    },
    updateSubject (formData) {
      updateSubject(formData).then(res => {
        this.loadSubject()
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchOperation (action, list = this.selectList) {
      if (!this.judge(action)) return
      let ajax = {
        action: action,
        subjectList: list.map(id => {
          let fData = this.subjectList.find(v => v._id === id)
          return {
            _id: fData._id,
            code: fData.code,
            name: fData.name
          }
        })
      }
      let error = ''
      ajax.subjectList.forEach(v => {
        if (action === '删除' && this.subjectList.find(f => f.parentId.includes(v._id))) {
          error += (error ? '、' : '') + (v.code + '-' + v.name)
        }
      })
      if (error) {
        this.$Notice.error({
          title: '删除科目',
          desc: `以下科目${error}，还存在子科目， 无法直接删除。`
        })
      } else {
        let txt = ajax.subjectList.reduce((total, v) => (total += (total ? '、' : '') + (v.code + '-' + v.name)), '')
        this.$Modal.confirm({
          title: action + '科目',
          content: `是否${action}科目：${txt}`,
          onOk: () => {
            subjectBatchOperation(ajax).then(res => {
              if (res.data && res.data.error) {
                this.$Notice.error({
                  title: '科目',
                  desc: res.data.error
                })
              }
              this.loadSubject()
            }).catch(err => {
              this.$Notice.error({
                title: '科目',
                desc: err.message
              })
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="less">
.active_tb_cell {
  background-color: #ff6600 !important;
  color: #fff;
}
</style>
