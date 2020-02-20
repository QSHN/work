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
        <el-form-item label="诊断类型" prop="diagnoseType">
          <el-cascader
            :change-on-select=true
            expand-trigger="hover"
            :options="diagnoseTreeData"
            v-model="diagnoseTypes"
            :props="diagnoseTypeProps"
            @change="diagnoseNodeClick">
          </el-cascader>
        </el-form-item>
        <el-form-item label="诊断代码" prop="diagnoseCode">
          <el-input v-model="form.diagnoseCode" placeholder="请输入diagnoseCode（如 1 ）"></el-input>
        </el-form-item>
        <el-form-item label="诊断缩写" prop="diagnoseAbbr">
          <el-input v-model="form.diagnoseAbbr" placeholder="请输入诊断缩写（如 fy ）"></el-input>
        </el-form-item>
        <el-form-item label="诊断名称" prop="diagnoseName">
          <el-input v-model="form.diagnoseName" placeholder="请输入诊断名称（如肺炎）"></el-input>
        </el-form-item>
        <el-form-item label="诊断详情" prop="diagnoseDesc">
          <el-input v-model="form.diagnoseDesc" placeholder="请输入诊断详情（如肺炎，肺功能不全）"></el-input>
        </el-form-item>
        <el-form-item label="医院科室" prop="clinicalDeptId">
          <el-cascader
            :change-on-select=true
            expand-trigger="hover"
            :options="clinicalDeptData"
            v-model="clinetTypes"
            :props="clinicalDeptProps"
            @change="clinetNodeClick">
          </el-cascader>
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
  import {getRootTree} from '@/api/nursing/diagnose/diagnose'
  import {fetchTreeByItemClassCode} from '@/api/nursing/aid/itemclass'
  import {addObj, delObj, delSubObj, putObj} from '@/api/nursing/diagnose/diagnose'

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
        diagnoseTypes: [],
        clinetTypes: [],
        showDiagnoseTree: false,
        diagnoseTypeProps: {
          label: "itemName",
          value: 'itemId',
          children: 'childNodes'
        },
        diagnoseTreeData: [],
        diagnoseTypeCode: 'diagnose_type',
        showClinicalTree: false,
        clinicalDeptProps: {
          label: "itemName",
          value: 'itemId',
          children: 'childNodes'
        },
        clinicalDeptData: [],
        clinicalDeptCode: 'clinical_dept',
        treeLoading: true,
        filterText: '',
        defaultProps: {
          children: 'childNodes',
          label: 'diagnoseName'
        },
        data: [],
        nodeDialog: false,
        isEdit: true,
        form: {
          diagnoseId: 0,
          diagnoseType: 0,
          diagnoseCode: '',
          diagnoseAbbr: '',
          diagnoseName: '',
          parent_id: 0,
          diagnoseDesc: '',
          clinicalDeptId: 0
        },
        rules: {
          diagnoseCode: [
            {required: true, message: '诊断代码不能为空', trigger: 'blur'}
          ],
          diagnoseName: [
            {required: true, message: '诊断名不能为空', trigger: 'blur'}
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
      fetchTreeByItemClassCode(this.diagnoseTypeCode).then(response => {
        this.diagnoseTreeData = Object.assign([], response.data.data)
      });
      fetchTreeByItemClassCode(this.clinicalDeptCode).then(response => {
        this.clinicalDeptData = Object.assign([], response.data.data)
      });
      this.filterText = this.searchingString
    },
    updated() {
      if (this.isIniting) {
        this.$refs.tree.filter(this.filterText)
        this.isIniting = false
      }
    },
    methods: {
      initTreeData() {
        this.form = Object.assign({}, {
          diagnoseId: 0,
          diagnoseType: 0,
          diagnoseCode: '',
          diagnoseAbbr: '',
          diagnoseName: '',
          parent_id: 0,
          diagnoseDesc: '',
          clinicalDeptId: 0
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
        })
      },
      //删除子节点请求
      deleteTreeNode(data) {
        delObj(data).then(res => {
          this.$message.success('删除节点信息成功')
        })
      },
      //更新子节点请求
      updateTreeNode(data) {
        putObj(data).then(res => {
          this.$message.success('更新节点信息成功')
          setTimeout(() => {
            this.fetchTree()
          },3000 )
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
        let diagnoseAbbrMatch = false
        let diagnoseCodeMatch = false
        let diagnoseNameMatch = false
        for (let i = 0; i < values.length; i++) {
          if (data.diagnoseAbbr != undefined & data.diagnoseAbbr != null) {
            diagnoseAbbrMatch = data.diagnoseAbbr.indexOf(values[i]) !== -1
          }
          if (data.diagnoseCode != undefined & data.diagnoseCode != null) {
            diagnoseCodeMatch = data.diagnoseCode.indexOf(values[i]) !== -1
          }
          if (data.diagnoseName != undefined & data.diagnoseName != null) {
            diagnoseNameMatch = data.diagnoseName.indexOf(values[i]) !== -1
          }
          result = diagnoseAbbrMatch || diagnoseCodeMatch || diagnoseNameMatch
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
        this.form = Object.assign({}, this.form, {parentId: data.diagnoseId ? data.diagnoseId : null})
        this.form.diagnoseType = data.diagnoseType
        this.form.clinicalDeptId = data.clinicalDeptId
        this.findDiagnoseTypeChain(this.form.diagnoseType)
        this.findClinetTypeChain(this.form.clinicalDeptId)
      },
      //编辑子节点操作
      edit(node, data) {
        this.isEdit = true
        this.nodeDialog = true
        this.form = Object.assign({}, this.form, data)
        this.findDiagnoseTypeChain(this.form.diagnoseType)
        this.findClinetTypeChain(this.form.clinicalDeptId)
      },
      //删除子节点操作
      removeItem(data) {
        this.$confirm(`是否删除当前节点信息（单个）：${data.diagnoseName}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(data.diagnoseId).then(res => {
            this.fetchTree()
          })
        }).catch(() => {
          this.$message.info('操作已取消')
        })
      },
      removeAll(data) {
        this.$confirm(`是否删除节点信息（包括子节点）：${data.diagnoseName}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delSubObj(data.diagnoseId).then(res => {
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
          <span className="node_label">{data.diagnoseName}</span>
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
          data = Object.assign(data, {parentId: parent.data.diagnoseId ? parent.data.diagnoseId : null})
        }
        this.updateTreeNode(data)
      },
      diagnoseNodeClick(data) {
        this.form.diagnoseType = data[data.length - 1]
        this.showDiagnoseTree = false
      },
      clinetNodeClick(data) {
        this.form.clinicalDeptId = data[data.length - 1]
        this.showDiagnoseTree = false
      },
      showDiagnoseTypeTree() {
        this.showDiagnoseTree = true
      },
      findDiagnoseTypeChain(id) {
        let currentArray = []
        this.findDiagnoseTypeTree(id, this.diagnoseTreeData, currentArray)
        this.diagnoseTypes = Object.assign([], currentArray)
      },
      findClinetTypeChain(id) {
        let currentArray = []
        this.findDiagnoseTypeTree(id, this.clinicalDeptData, currentArray)
        this.clinetTypes = Object.assign([], currentArray)
      },
      findDiagnoseTypeTree(id, tree, currentArray) {
        for (let i = 0; i < tree.length; i++) {
          if (tree[i].itemId == id) {
            currentArray.push(tree[i].itemId)
            return currentArray
          } else if (tree[i].childNodes == undefined) {
            return currentArray
          } else if (tree[i].childNodes.length != 0) {
            currentArray.push(tree[i].itemId)
            currentArray = this.findDiagnoseTypeTree(id, tree[i].childNodes, currentArray)
            if (currentArray.includes(id)) {
              return currentArray
            } else {
              if (currentArray.length != 0) {
                currentArray.splice(currentArray.length - 1, 1);
              }
            }
          }
        }
        return currentArray
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
