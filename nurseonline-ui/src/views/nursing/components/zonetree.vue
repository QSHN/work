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
    <el-dialog
      title="提示"
      :visible.sync="nodeDialog"
      append-to-body
      @close="closeDialog"
      width="30%">
      <el-form :model="form" ref="form" :rules="rules" label-width="90px">
        <el-form-item label="区域代码" prop="zoneCode">
          <el-input v-model="form.zoneCode" placeholder="请输入区域代码（如广州为GZ）"></el-input>
        </el-form-item>
        <el-form-item label="区域名称" prop="zoneName">
          <el-input v-model="form.zoneName" placeholder="请输入区域名称（如广州）"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="zipcode">
          <el-input v-model="form.zipcode" placeholder="请输入邮政编码（如广州 51000）"></el-input>
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
  import {getRootTree} from '@/api/nursing/zone/zone'
  import {addObj, delObj, delSubObj, putObj} from '@/api/nursing/zone/zone'

  export default {
    name: 'tree',
    props: {
      rootCode: {
        type: String,
        default: ''
      },
      searchingString: {
        type: String,
        default: ''
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
        isIniting: true,
        treeLoading: true,
        filterText: '',
        defaultProps: {
          children: 'childNodes',
          label: 'zoneName'
        },
        data: [],
        nodeDialog: false,
        isEdit: true,
        form: {
          zoneCode: '',
          zoneName: '',
          zipcode: '',
          createTime: '',
          updateTime: ''
        },
        rules: {
          zoneCode: [
            {required: true, message: '区域代码不能为空', trigger: 'blur'}
          ],
          zoneName: [
            {required: true, message: '区域名不能为空', trigger: 'blur'}
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
      this.filterText = this.searchingString
    },
    updated() {
      if (this.isIniting) {
        this.$refs.tree.filter(this.filterText)
        this.isIniting = false
      }
    },
    methods: {
      ts() {
        this.$refs.tree.filter(this.searchingString)
      },
      initTreeData() {
        this.form = Object.assign({}, {
          zoneCode: '',
          zoneName: '',
          zipcode: '',
          createTime: '',
          updateTime: ''
        })
      },
      //获取树结构
      fetchTree() {
        this.treeLoading = true
        getRootTree(this.rootCode).then(res => {
          this.data = res.data.data
          this.treeLoading = false
        })
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
        let values = []
        if (!value) {
          return true
        } else {
          values = value.split(' ')
        }
        let result = true
        let diagnoseCodeMatch = false
        let diagnoseNameMatch = false

        for (let i = 0; i < values.length; i++) {
          if (data.zoneCode != undefined & data.zoneCode != null) {
            diagnoseCodeMatch = data.zoneCode.indexOf(values[i]) !== -1
          }
          if (data.zoneName != undefined & data.zoneName != null) {
            diagnoseNameMatch = data.zoneName.indexOf(values[i]) !== -1
          }
          result = diagnoseCodeMatch || diagnoseNameMatch
        }
        return result
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
        this.form = Object.assign({}, this.form, {parentId: data.zoneId ? data.zoneId : null})
      },
      //编辑子节点操作
      edit(node, data) {
        this.isEdit = true
        this.nodeDialog = true
        this.form = Object.assign({}, this.form, data)
      },
      //删除子节点操作
      removeItem(data) {
        this.$confirm(`是否删除当前节点信息（单个）：${data.zoneName}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(data.zoneId).then(res => {
            this.fetchTree()
          })
        }).catch(() => {
          this.$message.info('操作已取消')
        })
      },
      removeAll(data) {
        this.$confirm(`是否删除节点信息（包括子节点）：${data.zoneName}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delSubObj(data.zoneId).then(res => {
            this.fetchTree()
          })
        }).catch((e) => {
          this.$message.info('操作已取消')
        })
      },
      //树结构操作
      renderContent(h, {node, data, store}) {
        return (
          <span class="custom-tree-node">
          <span className="node_label">{data.zoneName}</span>
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
          data = Object.assign(data, {parentId: parent.data.zoneId ? parent.data.zoneId : null})
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
