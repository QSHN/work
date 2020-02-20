<template>
  <div>
    <div style="display: flex">
      <leftExpand ref="leftExpand"
                  :title="'商品品牌'"
                  :groupList="groupList"
                  :unitList="brandList"
                  :selectGroup="selectGroup"
                  :updateFun="updateCommodityBrandGroup"
                  :deleteFun="deleteCommodityBrandGroup"
                  @load="loadGroup"
                  @selectGroup="(id) => { selectGroup = id}"/>

      <div class="measure_c">
        <div>
          <Row style="margin-bottom: 10px;">
            <Button style="margin-right: 10px;" @click="setBrand('add', {groupId: selectGroup, accountSetId: accountSet._id}, '新增')">新增</Button>
            <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchBrand('删除', selectList)">删除</Button>
            <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchBrand('启用', selectList)">启用</Button>
            <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchBrand('禁用', selectList)">禁用</Button>
            <Button style="margin-right: 10px;" @click="loadGroup(), loadBrand()">刷新</Button>
          </Row>

          <Table :height="getTableHeight" border :columns="brandColumns" :data="tableData"  @on-selection-change="selectTable">
            <template slot-scope="{ row }" slot="status">
              <div @click="batchBrand(row.status === '启用' ? '禁用' : '启用', [row._id])" style="position: relative;">
                <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
                <i-switch size="small" :value="row.status === '启用'" />
              </div>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button size="small" style="margin-right: 5px;" @click="setBrand('edit', row, '修改')">修改</Button>
              <Button size="small" @click="batchBrand('删除', [row._id])">删除</Button>
            </template>
          </Table>
        </div>
      </div>
    </div>

    <brandForm ref="brandForm" @load="loadBrand" :groupList="groupList"></brandForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import brandForm from './brandForm'
import leftExpand from '../../components/leftExpand/index'
import {
  queryCommodityBrand,
  batchCommodityBrand,
  updateCommodityBrandGroup,
  queryCommodityBrandGroup,
  deleteCommodityBrandGroup
} from '../../api/commodityBrand'
export default {
  name: 'index',
  components: {
    brandForm,
    leftExpand
  },
  data () {
    return {
      groupList: [],
      selectGroup: null,
      brandColumns: [
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
      brandList: [],
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
      let list = this.brandList
      if (this.selectGroup) {
        list = this.brandList.filter(v => v.groupId === this.selectGroup)
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
          this.loadBrand()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    updateCommodityBrandGroup,
    deleteCommodityBrandGroup,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '商品品牌') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}商品品牌的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadGroup () {
      queryCommodityBrandGroup({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('queryCommodityBrandGroup', res.data)
        this.groupList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    loadBrand () {
      queryCommodityBrand({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('queryCommodityBrand', res.data)
        this.brandList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    setBrand (type, item, title) {
      if (!this.judge(title)) return
      let formData = Object.assign({}, item)
      switch (type) {
        case 'add':
          this.$refs.brandForm.show('新建', null, this.brandList, formData)
          break
        case 'edit':
          this.$refs.brandForm.show('修改', formData, this.brandList)
          break
      }
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchBrand (action, list) {
      if (!this.judge(action)) return
      this.$Modal.confirm({
        title: `${action}商品品牌`,
        content: `是否${action}所选商品品牌`,
        onOk: () => {
          batchCommodityBrand({
            ids: list,
            action: action
          }).then(res => {
            this.$Message.success(`成功${action}所选商品品牌`)
            this.loadBrand()
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
