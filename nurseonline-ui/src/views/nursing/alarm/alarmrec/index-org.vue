<!--
  -    Copyright (c) 2018-2025, lengleng All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lengleng (wangiegie@gmail.com)
  -->

<template>
  <div class="execution inner-dialog">
    <basic-container>
      <el-row :span="24">
        <el-col :xs="24"
                :sm="24"
                :md="3"
                class="cust__tree">
          <avue-tree :option="treeOption"
                     :data="treeData"
                     @node-click="nodeClick"></avue-tree>
        </el-col>
        <el-col :xs="24"
                :sm="24"
                :md="21"
                class="cust__main">
          <avue-crud ref="crud"
                     :page="page"
                     :data="tableData"
                     :table-loading="tableLoading"
                     :option="tableOption"
                     @on-load="getList"
                     @refresh-change="refreshChange"
                     @row-update="handleUpdate"
                     @search-reset="handleReset"
                     @search-change="handleFilter"
                     @selection-change="selectionChange"
                     @row-save="handleSave"
                     @row-del="rowDel">

            <template slot="search">
              <el-form-item class="search-panel">
                <el-input v-model="searchParams.queryValue"
                          class="input-with-select"
                          size="small"
                          placeholder="请输入内容">
                  <el-select v-model="searchParams.queryKey"
                             slot="prepend"
                             placeholder="请选择">
                    <el-option v-for="item in searchKeys"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </template>

            <template slot-scope="scope"
                      slot="menu">
              <el-tooltip class="item" effect="dark" content="查看" placement="top">
                <el-button type="text"
                           icon="icon-ry-chakan"
                           size="small"
                           plain
                           @click="handleView(scope.row,scope.index)">
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="text"
                           icon="icon-ry-bianji"
                           size="small"
                           plain
                           @click="handleEdit(scope.row,scope.index)">
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="text"
                           icon="icon-ry-shanchu"
                           size="small"
                           plain
                           @click="handleDel(scope.row,scope.index)">
                </el-button>
              </el-tooltip>
            </template>
          </avue-crud>
        </el-col>
      </el-row>
    </basic-container>
    <div class="footer">
      <el-button type="primary"
                 v-if="!readOnly"
                 @click="handleSaveItems"
                 size="small">
        确认添加
      </el-button>
      <el-button @click="closePage">
        关闭
      </el-button>
    </div>
  </div>
</template>

<script>
  import {fetchList, getObj, addObj, putObj, delObj, fetchTree} from '@/api/nursing/org/org'
  import {fetchTreeByItemClassCode} from '@/api/nursing/aid/itemclass'
  import {tableOption} from '@/const/crud/nursing/org/org'
  import {mapGetters} from 'vuex'

  export default {
    name: 'org',
    props: {
      showOrg: {
        type: Boolean,
        default: () => {
        }
      },
      readOnly: {                 // 是否只读，只读情况下不显示操作按钮
        type: Boolean,
        default: () => {
        }
      },
      allSelList: Set             // 全局所有选择
    },
    data() {
      return {
        treeData: [],
        tableData: [],
        pageList: [],             // 当前页所有数据
        pageSelList: [],          // 当前页已选择
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption,
        search: {
          queryKey: 'org_code',
          queryValue: '',
        },
        searchParams: {
          queryKey: 'org_name'
        },
        treeOption: {
          nodeKey: 'itemId',
          addBtn: false,
          menu: false,
          props: {
            id: 'id',
            label: 'itemName',
            value: 'itemId',
            children: 'childNodes'
          }
        },
        searchKeys: [
          {
            value: 'org_code',
            label: '机构代码'
          }, {
            value: 'org_name',
            label: '机构名称'
          }, {
            value: 'leader',
            label: '负责人'
          }, {
            value: 'leader_phone',
            label: '负责人联系电话'
          }, {
            value: 'org_phone',
            label: '机构电话'
          }, {
            value: 'creator_name',
            label: '建档人名称'
          }
        ],
      }
    },

    created() {
      this.init();
      this.tableOption = Object.assign({}, tableOption, {
        menu: false,
        selection: true
      })
    },
    watch: {
      showOrg(val) {
        this.pageList = [];
        if (val === false) {
          this.$emit("input", val);
        } else {
          this.getList(true);
        }
      },
      value(val) {
        this.show = val;
      },
      list: {  // 列表一旦改变，则重置已选择的订单列表
        handler(val) {
          // this.selList = [];
        },
        deep: true
      }
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      init() {
        fetchTreeByItemClassCode('org_category').then(response => {
          // console.log(response)
          this.treeData = [{
            id: '',
            itemId: '',
            itemName: '所有机构',
            itemCode: '',
            childNodes: response.data.data
          }]

          {// 目前props的children映射不生效（BUG），手动处理一下children字段名问题。
            let recursive = function (data) {
              if (!data.childNodes || data.childNodes.length == 0)
                return
              data.children = data.childNodes;
              for (let i = 0; i < data.childNodes.length; i++) {
                recursive(data.childNodes[i]);
              }
            }
            recursive(this.treeData[0])
          }
        });
      },

      getList(page) {


        // 更新 allSelList
        this.updateAllSelList();


        this.tableLoading = true
        let param = {
          current: page === true ? 1 : page.currentPage,
          size: page === true ? this.page.pageSize : page.pageSize
        }
        for (let i in this.searchParams) {
          param[i] = this.searchParams[i]
        }
        fetchTree(param).then(response => {
          if (response.data && response.data.data) {
            this.pageList = response.data.data.records || [];
            //判断当前页面的所有数据，如果存在选择历史的话就默认选中
            setTimeout(() => {
              //放延迟外面值不会刷新
              for (let i = 0; i < this.pageList.length; i++) {
                if (this.allSelList.has(this.pageList[i].orgId)) {
                  this.$refs.crud.toggleRowSelection(this.pageList[i]);
                }
              }
            }, 1);
          }

          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.tableLoading = false
        })
      },

      // 更新 allSelList（allSelList和父组件双向绑定，所以能同步更新）
      updateAllSelList() {
        // 在选择历史中删除当前页被取消(没选中)的按钮（就算本来就没被选中也没关系，一样删）
        let selIds = this.pageSelList.map(e => e.orgId);
        this.pageList.forEach(item => {
          if (!selIds.includes(item.orgId)) {
            this.allSelList.delete(item.orgId);
          }
        });

        // 保存当前页已选择的选项（allSelList 是 Set 除重）
        if (this.pageSelList && this.pageSelList.length) {
          this.pageSelList.map(m => m.orgId).forEach(id => this.allSelList.add(id));
        }
      },

      handleFilter(param) {
        this.getList(true);
      },
      // 点击节点
      nodeClick(data) {
        this.page.page = 1
        this.searchParams.treeType = data.itemId
        // this.searchParams.treeType.label = data.itemName
        this.getList(this.page)
      },
      // 点击清空
      handleReset() {
        this.searchParams = {
          queryKey: 'org_code'
        };
        this.getList(this.page)
      },
      /**
       * @title 打开新增窗口
       * @detail 调用crud的handleadd方法即可
       *
       **/
      handleAdd: function () {
        this.$refs.crud.rowAdd()
      },
      handleEdit(row, index) {
        this.$refs.crud.rowEdit(row, index)
      },
      handleView(row, index) {
        this.$refs.crud.rowView(row, index)
      },
      rowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为' + row.orgId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.orgId)
        }).then(data => {
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getList(this.page)
        }).catch(function (err) {
        })
      },
      /**
       * @title 数据更新
       * @param row 为当前的数据
       * @param index 为当前更新数据的行数
       * @param done 为表单关闭函数
       *
       **/
      handleUpdate: function (row, index, done) {
        putObj(row).then(data => {
          this.tableData.splice(index, 1, Object.assign({}, row))
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
          done()
          this.getList(this.page)
        })
      },
      /**
       * @title 数据添加
       * @param row 为当前的数据
       * @param done 为表单关闭函数
       *
       **/
      handleSave: function (row, done) {
        addObj(row).then(data => {
          this.tableData.push(Object.assign({}, row))
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
          done()
          this.getList(this.page)
        })
      },

      // 保存所选
      handleSaveItems: function (list, done) {

        // 更新 allSelList
        this.updateAllSelList();

        if (this.allSelList.size) {
          // 机构列表的数据格式为【,orgId,orgId,】，前后有【,】是为了方便后台数据库查询
          let listStr = "," + [...this.allSelList].join(",") + ",";
          this.$emit("change", listStr);  // 传递值
          this.$emit("input", false);     // 关闭页面
        } else {
          this.$message.warning("请先点击选择机构");
        }
      },

      // 关闭嵌套页面
      closePage() {
        this.$emit("input", false);
      },

      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList(this.page)
      },

      // 取消行选择
      toggleSelection(val) {
        this.allSelList.clear();
        this.$refs.crud.toggleSelection(val);
      },

      // 行选中操作
      selectionChange(list) {
        this.pageSelList = list
      },


    }
  }
</script>


<style lang="scss" scoped>
  /deep/ .search-panel .el-select .el-input {
    width: 130px;
  }

  /deep/ .search-panel .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .footer{
    width: 98%;
    text-align: right;
  }

</style>
