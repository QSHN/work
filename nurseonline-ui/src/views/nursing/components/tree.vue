<template>
  <div v-loading="treeLoading">
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText"
    ></el-input>
    <el-tree
      class="filter-tree"
      :data="data"
      node-key="id"
      :props="defaultProps"
      show-checkbox
      draggable
      :render-content="renderContent"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      @check="checkChange"
      @node-drop="nodeDrop"
      ref="tree"
    >
    </el-tree>
    <el-button type="text" @click="appendRoot">添加根节点</el-button>
    <el-button type="text" @click="refreshTree">刷新</el-button>
    <el-dialog
      title="提示"
      :visible.sync="nodeDialog"
      append-to-body
      @close="closeDialog"
      width="30%">
      <el-form :model="form" ref="form" :rules="rules" label-width="90px">
        <el-form-item label="资料类别">
          <el-input v-model="itemClassId" placeholder="请输入节点(辅助项)资料类别Id(itemClassId)" disabled></el-input>
        </el-form-item>
        <el-form-item label="节点Key" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入节点(辅助项)Key值(itemId)" type="Number"></el-input>
        </el-form-item>
        <el-form-item label="节点代码" prop="itemCode">
          <el-input v-model="form.itemCode" placeholder="请输入节点(辅助项)代码(itemCode)" ></el-input>
        </el-form-item>
        <el-form-item label="节点名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入节点(辅助项)名称(itemName)" ></el-input>
        </el-form-item>
        <el-form-item label="节点描述">
          <el-input v-model="form.descr" placeholder="请输入节点(辅助项)描述(descr)"></el-input>
        </el-form-item>
        <el-form-item label="节点排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入节点排序优先级（越小越靠前）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveNode">保存节点</el-button>
          <el-button @click="nodeDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
  import {fetchTreeByItemClassCode, resetTreeByItemClassCode} from '@/api/nursing/aid/itemclass'
  import {addObj, delObj, delSubObj, putObj} from '@/api/nursing/aid/item'
  import {constants} from 'fs';
  // import { getTrees } from '@/api/ldadmin/ryapi'
  export default {
    name: 'tree',
    props: {
      itemClassCode: {
        type: String,
        default: ''
      },
      itemClassId: {
        type: Number
      },
      callback: {
        type: Function,
        default: () => {
          return false
        }
      }
    },
    data() {
      return {
        treeLoading: true,
        filterText: '',
        defaultProps: {
          children: 'childNodes',
          label: 'itemName'
        },
        data: [],
        nodeDialog: false,
        isEdit: true,
        form: {
          itemClassId: '',
          itemName: '',
          descr: '',
          parentId: ''
        },
        rules: {
          itemId: [
            {required: true, message: '节点(辅助项)Key值不能为空', trigger: 'blur'}
          ],
          itemCode: [
            {required: true, message: '节点(辅助项)代码不能为空', trigger: 'blur'}
          ],
          itemName: [
            {required: true, message: '节点(辅助项)名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    created() {
      this.fetchTree()
    },
    methods: {
      initTreeData() {
        this.form = Object.assign({}, {
          itemClassId: '',
          itemName: '',
          descr: '',
          parentId: ''
        })
      },
      //获取树结构
      fetchTree() {
        this.treeLoading = true
        fetchTreeByItemClassCode(this.itemClassCode).then(res => {
          this.data = res.data.data
          this.data = this.sort(this.data)
          this.treeLoading = false
        })
      },
      sort(nodes) {
        let newNodes = []
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].childNodes!=undefined){
            if (nodes[i].childNodes.length!=0){
              nodes[i].childNodes = this.sort(nodes[i].childNodes)
            }
          }
          if (i == 0) {
            newNodes.push(nodes[i])
          } else {
            let _newNodes = []
            let inserted = false
            for (let j = 0; j < newNodes.length; j++) {
              if (nodes[i].sort < newNodes[j].sort&!inserted) {
                _newNodes.push(nodes[i])
                inserted =true
              }
              _newNodes.push(newNodes[j])
            }
            if (!inserted){
              _newNodes.push(nodes[i])
            }
            newNodes = _newNodes
          }
        }
        return newNodes;
      },
      //新增子节点请求
      appendTreeNode(data) {
        addObj(data).then(res => {
          this.$message.success('新增节点信息成功')
          this.fetchTree()
        })
      },
      //删除子节点请求
      deleteTreeNode(data) {
        delObj(data).then(res => {
          this.$message.success('删除节点信息成功')
          this.fetchTree()
        })
      },
      //更新子节点请求
      updateTreeNode(data) {
        putObj(data).then(res => {
          this.$message.success('更新节点信息成功')
          this.fetchTree()
        })
      },
      filterNode(value, data) {
        if (!value) return true
        if (!data.itemName) return false
        return data.itemName.indexOf(value) !== -1
      },
      checkChange() {
        let ids = ["1", "2"]
        let nodes = ["n1", "m2"]
        this.callback(ids, nodes)
      },
      getTree() {
      },
      //新增子节点操作
      append(data) {
        this.isEdit = false
        this.nodeDialog = true
        this.form = Object.assign({}, this.form, {parentId: data.id ? data.id : null})
      },
      //新增根部子节点操作
      appendRoot() {
        this.isEdit = false
        this.nodeDialog = true
        this.form = Object.assign({}, this.form, {parentId: 0})
      },
      //刷新节点
      refreshTree() {
        this.$confirm('刷新资料可能会短时间影响使用，确定刷新?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.treeLoading =true
          resetTreeByItemClassCode(this.itemClassCode).then(res => {
            this.data = res.data.data
            this.data = this.sort(this.data)
            this.treeLoading = false
          })
        }).catch(() => {
        });
      },
      //编辑子节点操作
      edit(node, data) {
        this.isEdit = true
        this.nodeDialog = true
        this.form = Object.assign({}, this.form, data)
      },
      //删除子节点操作
      removeItem(data) {
        this.$confirm(`是否删除当前节点信息（单个）：${data.itemName}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(data.id).then(res => {
            this.fetchTree()
          })
        }).catch(() => {
          this.$message.info('操作已取消')
        })
      },
      removeAll(data) {
        this.$confirm(`是否删除节点信息（包括子节点）：${data.itemName}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delSubObj(data.id).then(res => {
            this.fetchTree()
          })
        }).catch(() => {
          this.$message.info('操作已取消')
        })
      },
      //树结构操作
      renderContent(h, {node, data, store}) {
        return (
          <span class="custom-tree-node">
          <span className="node_label">{data.itemName}</span>
          <span class="tree_node_op">
            <el-button type="text" size="mini" on-click={(ev) => this.edit(node, data)}>编辑</el-button>
            <el-button type="text" size="mini" on-click={() => this.removeItem(data)}>删除</el-button>
            <el-button type="text" size="mini" on-click={() => this.removeAll(data)}>删除全部</el-button>
            <el-button type="text" size="mini" on-click={() => this.append(data)}>添加子节点</el-button>
          </span>
        </span>)
      },
      saveNode() {
        this.$refs.form.validate(valid => {
          this.form.itemClassId = this.itemClassId
          if (valid) {
            this.nodeDialog = false
            if (this.isEdit) {
              this.updateTreeNode(this.form)
            } else {
              this.appendTreeNode(this.form)
            }
          } else {
            this.$message.error('请检查输入是否有误')
          }
        })
      },
      closeDialog() {
        this.initTreeData()
        this.$refs.form.clearValidate()
      },
      //拖拽节点更新树
      nodeDrop(node, local) {
        let parent = local.parent
        let data = node.data
        if (parent.data.length && parent.data.length > 0) {
          data = Object.assign(data, {parentId: 0})
        } else {
          data = Object.assign(data, {parentId: parent.data.id ? parent.data.id : null})
        }
        this.updateTreeNode(data)
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .el-tree-node__content {
    height: 40px;
  }

  /deep/ .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
