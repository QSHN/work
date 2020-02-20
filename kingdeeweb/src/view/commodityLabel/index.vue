<template>
  <div>
    <div style="display: flex">
      <leftExpand ref="leftExpand"
                  :title="'商品标签'"
                  :groupList="groupList"
                  :unitList="labelList"
                  :selectGroup="selectGroup"
                  :updateFun="updateCommodityLabelGroup"
                  :deleteFun="deleteCommodityLabelGroup"
                  @load="loadGroup"
                  @selectGroup="(id) => { selectGroup = id}"/>

      <div class="measure_c">
        <div>
          <Row style="margin-bottom: 10px;">
            <Button style="margin-right: 10px;" @click="setLabel('add', {groupId: selectGroup, accountSetId: accountSet._id}, '新增')">新增</Button>
            <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchLabel('删除', selectList)">删除</Button>
            <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchLabel('启用', selectList)">启用</Button>
            <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchLabel('禁用', selectList)">禁用</Button>
            <Button style="margin-right: 10px;" @click="loadGroup(), loadLabel()">刷新</Button>
          </Row>

          <Table :height="getTableHeight" border :columns="labelColumns" :data="tableData"  @on-selection-change="selectTable">
            <template slot-scope="{ row }" slot="status">
              <div @click="batchLabel(row.status === '启用' ? '禁用' : '启用', [row._id])" style="position: relative;">
                <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
                <i-switch size="small" :value="row.status === '启用'" />
              </div>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button size="small" style="margin-right: 5px;" @click="setLabel('edit', row, '修改')">修改</Button>
              <Button size="small" @click="batchLabel('删除', [row._id])">删除</Button>
            </template>
          </Table>
        </div>
      </div>
    </div>

    <labelForm ref="labelForm" @load="loadLabel" :groupList="groupList"></labelForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import labelForm from './labelForm'
import leftExpand from '../../components/leftExpand/index'
import {
  queryCommodityLabel,
  batchCommodityLabel,
  updateCommodityLabelGroup,
  queryCommodityLabelGroup,
  deleteCommodityLabelGroup
} from '../../api/commodityLabel'
export default {
  name: 'index',
  components: {
    labelForm,
    leftExpand
  },
  data () {
    return {
      groupList: [],
      selectGroup: null,
      labelColumns: [
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
      labelList: [],
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
      let list = this.labelList
      if (this.selectGroup) {
        list = this.labelList.filter(v => v.groupId === this.selectGroup)
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
          this.loadLabel()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    updateCommodityLabelGroup,
    deleteCommodityLabelGroup,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '商品标签') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}商品标签的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadGroup () {
      queryCommodityLabelGroup({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('queryCommodityLabelGroup', res.data)
        this.groupList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    loadLabel () {
      queryCommodityLabel({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('queryCommodityLabel', res.data)
        this.labelList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    setLabel (type, item, title) {
      if (!this.judge(title)) return
      let formData = Object.assign({}, item)
      switch (type) {
        case 'add':
          this.$refs.labelForm.show('新建', null, this.labelList, formData)
          break
        case 'edit':
          this.$refs.labelForm.show('修改', formData, this.labelList)
          break
      }
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchLabel (action, list) {
      if (!this.judge(action)) return
      this.$Modal.confirm({
        title: `${action}商品标签`,
        content: `是否${action}所选商品标签`,
        onOk: () => {
          batchCommodityLabel({
            ids: list,
            action: action
          }).then(res => {
            this.$Message.success(`成功${action}所选商品标签`)
            this.loadLabel()
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
