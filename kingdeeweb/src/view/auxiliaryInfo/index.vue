<template>
  <div>
    <div style="display: flex">
      <leftExpand ref="leftExpand"
                  :title="'辅助资料'"
                  :groupList="groupList"
                  :unitList="auxiliaryList"
                  :selectGroup="selectGroup"
                  :updateFun="updateAuxiliaryInfoGroup"
                  :deleteFun="deleteAuxiliaryInfoGroup"
                  @load="loadGroup"
                  @selectGroup="(id) => { selectGroup = id}"/>

      <div class="measure_c">
        <div>
          <Row style="margin-bottom: 10px;">
            <Button style="margin-right: 10px;" @click="setAuxiliary('add', {groupId: selectGroup, accountSetId: accountSet._id}, '新增')">新增</Button>
            <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchAuxiliary('删除', selectList)">删除</Button>
            <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchAuxiliary('启用', selectList)">启用</Button>
            <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchAuxiliary('禁用', selectList)">禁用</Button>
            <Button style="margin-right: 10px;" @click="loadGroup(), loadAuxiliary()">刷新</Button>
          </Row>

          <Table :height="getTableHeight" border :columns="auxiliaryColumns" :data="tableData"  @on-selection-change="selectTable">
            <template slot-scope="{ row }" slot="status">
              <div @click="batchAuxiliary(row.status === '启用' ? '禁用' : '启用', [row._id])" style="position: relative;">
                <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
                <i-switch size="small" :value="row.status === '启用'" />
              </div>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button size="small" style="margin-right: 5px;" @click="setAuxiliary('edit', row, '修改')">修改</Button>
              <Button size="small" @click="batchAuxiliary('删除', [row._id])">删除</Button>
            </template>
          </Table>
        </div>
      </div>
    </div>

    <auxiliaryForm ref="auxiliaryForm" @load="loadAuxiliary" :groupList="groupList"></auxiliaryForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import auxiliaryForm from './auxiliaryForm'
import leftExpand from '../../components/leftExpand/index'
import {
  queryAuxiliaryInfo,
  batchAuxiliaryInfo,
  updateAuxiliaryInfoGroup,
  queryAuxiliaryInfoGroup,
  deleteAuxiliaryInfoGroup
} from '../../api/auxiliaryInfo'
export default {
  name: 'index',
  components: {
    auxiliaryForm,
    leftExpand
  },
  data () {
    return {
      groupList: [],
      selectGroup: null,
      auxiliaryColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '编码',
          key: 'code'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '备注',
          key: 'des'
        },
        {
          title: '状态',
          slot: 'status',
          width: 150,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      auxiliaryList: [],
      selectList: []
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
      let list = this.auxiliaryList
      if (this.selectGroup) {
        list = this.auxiliaryList.filter(v => v.groupId === this.selectGroup)
      }
      if (this.selectList.length) {
        list.forEach(f => {
          if (this.selectList.includes(f._id)) {
            f._checked = true
          }
        })
      }
      return list
    },
    getTableHeight () {
      return window.innerHeight - 195
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadGroup()
          this.loadAuxiliary()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    updateAuxiliaryInfoGroup,
    deleteAuxiliaryInfoGroup,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '辅助资料') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}辅助资料的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadGroup () {
      queryAuxiliaryInfoGroup({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('queryAuxiliaryInfoGroup', res.data)
        this.groupList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    loadAuxiliary () {
      queryAuxiliaryInfo({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('queryAuxiliaryInfo', res.data)
        this.auxiliaryList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    setAuxiliary (type, item, title) {
      if (!this.judge(title)) return
      let formData = Object.assign({}, item)
      switch (type) {
        case 'add':
          this.$refs.auxiliaryForm.show('新建', null, this.auxiliaryList, formData)
          break
        case 'edit':
          this.$refs.auxiliaryForm.show('修改', formData, this.auxiliaryList)
          break
      }
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchAuxiliary (action, list) {
      if (!this.judge(action)) return
      this.$Modal.confirm({
        title: `${action}辅助资料`,
        content: `是否${action}所选辅助资料`,
        onOk: () => {
          batchAuxiliaryInfo({
            ids: list,
            action: action
          }).then(res => {
            this.$Message.success(`成功${action}所选辅助资料`)
            this.loadAuxiliary()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .measure_c {
    display: flex;
    flex-grow: 1;
    background: #fff;
    padding: 10px;
  }
</style>
