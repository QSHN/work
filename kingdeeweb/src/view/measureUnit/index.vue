<template>
  <div>
    <div style="display: flex">
      <leftExpand ref="leftExpand"
                  :title="'计量单位'"
                  :groupList="groupList"
                  :unitList="unitList"
                  :selectGroup="selectGroup"
                  :updateFun="updateMeasureUnitGroup"
                  :deleteFun="deleteMeasureUnitGroup"
                  @load="loadGroup"
                  @selectGroup="(id) => { selectGroup = id}"/>

      <div class="measure_c">
        <div>
          <Row style="margin-bottom: 10px;">
            <Button style="margin-right: 10px;" @click="setUnit('add', {groupId: selectGroup, accountSetId: accountSet._id}, '新增')">新增</Button>
            <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="deleteUnit(selectList)">删除</Button>
            <Button style="margin-right: 10px;" @click="loadGroup(), loadUnit()">刷新</Button>
          </Row>

          <Table :height="getTableHeight" border :columns="unitColumns" :data="tableData"  @on-selection-change="selectTable">
            <template slot-scope="{ row }" slot="isDefault">
              <div @click="change(row, findDefault(row.groupId))" style="position: relative;">
                <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
                <i-switch size="small" :value="row._id === findDefault(row.groupId)" />
              </div>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button size="small" style="margin-right: 5px;" @click="setUnit('edit', row, '修改')">修改</Button>
              <Button size="small" @click="deleteUnit([row._id])">删除</Button>
            </template>
          </Table>
        </div>
      </div>
    </div>

    <unitForm ref="unitForm" @load="loadUnit" :groupList="groupList"></unitForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import unitForm from './unitForm'
import leftExpand from '../../components/leftExpand/index'
import {
  updateMeasureUnit,
  queryMeasureUnit,
  deleteMeasureUnit,
  updateMeasureUnitGroup,
  queryMeasureUnitGroup,
  deleteMeasureUnitGroup
} from '../../api/measureUnit'
export default {
  name: 'index',
  components: {
    unitForm,
    leftExpand
  },
  data () {
    return {
      groupList: [],
      selectGroup: null,
      unitColumns: [
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
          title: '换算方式',
          key: 'conversion'
        },
        {
          title: '换算率',
          key: 'equation'
        },
        {
          title: '是否默认',
          slot: 'isDefault',
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
      unitList: [],
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
      let list = this.unitList
      if (this.selectGroup) {
        list = this.unitList.filter(v => v.groupId === this.selectGroup)
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
          this.loadUnit()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    updateMeasureUnitGroup,
    deleteMeasureUnitGroup,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '计量单位') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}计量单位的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadGroup () {
      queryMeasureUnitGroup({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('queryMeasureUnitGroup', res.data)
        this.groupList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    loadUnit () {
      queryMeasureUnit({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('queryMeasureUnit', res.data)
        this.unitList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    setUnit (type, item, title) {
      if (!this.judge(title)) return
      let formData = Object.assign({}, item)
      switch (type) {
        case 'add':
          this.$refs.unitForm.show('新建', null, this.unitList, formData)
          break
        case 'edit':
          this.$refs.unitForm.show('修改', formData, this.unitList)
          break
      }
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    change (item, defaultId) {
      this.$Modal.confirm({
        title: '设置默认',
        content: item._id === defaultId ? `是否取消默认单位：${item.name}` : `是否将${item.name}设置为默认单位`,
        onOk: () => {
          let formData = JSON.parse(JSON.stringify(item))
          formData.setDefault = item._id !== defaultId
          updateMeasureUnit(formData).then(res => {
            this.loadUnit()
            this.loadGroup()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    },
    findDefault (groupId) {
      let fData = this.groupList.find(f => f._id === groupId)
      return fData ? fData.defaultValue : null
    },
    deleteUnit (list) {
      if (!this.judge('删除')) return
      this.$Modal.confirm({
        title: '删除计量单位',
        content: `是否删除所选计量单位`,
        onOk: () => {
          deleteMeasureUnit({
            ids: list
          }).then(res => {
            this.$Message.success(`成功删除所选计量单位`)
            this.loadUnit()
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
