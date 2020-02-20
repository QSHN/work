<!--
  Creater: Huanggx
  Author: https://blog.csdn.net/Mr_JavaScript/article/details/88604270
  CreateTime: 2019-5-10
-->
<template>
  <el-select ref="treeselect" :size="size" :value="valueTitle" :clearable="clearable" @clear="clearHandle">
    <el-option :value="valueTitle" :label="valueTitle">
      <el-tree id="tree-option"
               ref="selectTree"
               v-loading="loading"
               :accordion="accordion"
               :data="treeData"
               :props="props"
               :node-key="props.value"
               :default-expanded-keys="defaultExpandedKey"
               @node-click="handleNodeClick">
      </el-tree>
    </el-option>
    <div class="operate">
      <el-button size="mini" type="text" @click="handleRefresh">刷新</el-button>
    </div>
  </el-select>
</template>

<script>
  import {fetchTreeByItemClassCode} from '@/api/nursing/aid/itemclass'

  export default {
    name: "tree-select",
    props: {
      /* 配置项 */
      props: {
        type: Object,
        default: () => {
          return {
            value: 'itemId',             // ID字段名
            label: 'itemName',         // 显示名称
            children: 'childNodes'    // 子级字段名
          }
        }
      },
      /* 选项列表数据(树形结构的对象数组) */
      options: {
        type: Array,
        default: () => {
          return []
        }
      },
      /* 辅助资料类别代码 */
      classCode: {
        type: String,
        default: () => {
          return ''
        }
      },
      /* 初始值 */
      value: {
        type: [String, Number],
        default: () => {
          return ''
        }
      },
      // value: {},

      /* 可清空选项 */
      clearable: {
        type: Boolean,
        default: () => {
          return true
        }
      },
      /* 自动收起 */
      accordion: {
        type: Boolean,
        default: () => {
          return false
        }
      },
      /* 控件大小 */
      size: {
        type: String,
        default: () => {
          return 'medium'
        }
      },
    },
    data() {
      return {
        valueId: '',    // 初始值
        valueTitle: '',
        defaultExpandedKey: [],
        treeData: [],
        loading:true,
      }
    },
    mounted() {
      this.valueId = this.value;
      // this.initHandle()
      (async () => {
        await this.getTree()
        await this.initHandle()
      })();
    },
    methods: {
      // 初始化值
      initHandle() {
        if (this.valueId) {
          if(!this.$refs.selectTree.getNode(this.valueId) ){
            return;
          }
          this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[this.props.label]     // 初始化显示
          this.$refs.selectTree.setCurrentKey(this.valueId)       // 设置默认选中
          this.defaultExpandedKey = [this.valueId]      // 设置默认展开
        }else{
          this.clearHandle()
        }
      },
      // 获取分类树
      getTree(){
        this.loading = true
        fetchTreeByItemClassCode(this.classCode).then(({data})=>{
          this.treeData = data.data
          this.loading = false
        })
      },
      // 刷新
      handleRefresh:function(){
        this.getTree()
      },
      // 切换选项
      handleNodeClick(node) {
        this.valueTitle = node[this.props.label]
        this.valueId = node[this.props.value]
        this.$emit('node-select', node[this.props.value])
        this.$emit("input", node[this.props.value]);
        this.$refs.treeselect.blur()
        this.defaultExpandedKey = []
      },
      // 清除选中
      clearHandle() {
        this.valueTitle = ''
        this.valueId = null
        this.defaultExpandedKey = []
        this.clearSelected()
        this.$emit('node-select', null)
      },
      /* 清空选中样式 */
      clearSelected() {
        let allNode = document.querySelectorAll('.tree-select #tree-option .el-tree-node')
        allNode.forEach((element) => element.classList.remove('is-current'))
      }
    },
    watch: {
      value() {
        this.valueId = this.value
        this.initHandle()
      }
    },
  };
</script>

<style lang="scss" scoped>
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    /*max-height: 274px;*/
    padding: 0;
    overflow: hidden;
    /*overflow-y: auto;*/
  }

  .el-select-dropdown__item.selected {
    font-weight: normal;
  }

  ul li > > > .el-tree .el-tree-node__content {
    height: auto;
    padding: 0 20px;
  }

  .el-tree-node__label {
    font-weight: normal;
  }

  .el-tree > > > .is-current .el-tree-node__label {
    color: #409EFF;
    font-weight: 700;
  }

  .el-tree > > > .is-current .el-tree-node__children .el-tree-node__label {
    color: #606266;
    font-weight: normal;
  }
  .operate{
    width:100%;
    text-align: right;

    .el-button{
      margin: 0 15px;
    }
  }
</style>
