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
  <div class="execution">
    <basic-container title="机构商品管理">
      <!--<el-row :span="24">-->
      <!--<el-col :xs="24"-->
      <!--:sm="24"-->
      <!--:md="5"-->
      <!--class="cust__tree">-->
      <!--<avue-tree :option="treeOption"-->
      <!--:data="treeData"-->
      <!--@node-click="nodeClick"></avue-tree>-->
      <!--</el-col>-->
      <!--<el-col :xs="24"-->
      <!--:sm="24"-->
      <!--:md="19"-->
      <!--class="cust__main">-->
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 v-model="form"
                 @on-load="getList"
                 @search-change="handleFilter"
                 @refresh-change="refreshChange"
                 @search-reset="handleReset"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @row-del="rowDel">

        <template slot="search">
          <el-form-item class="search-panel">
            <el-input clearable
                      v-model="searchParams.queryValue"
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


        <template slot="menuLeft">
          <el-button type="primary"
                     v-if="permissions.scms_orggoods_add"
                     @click="handleAdd"
                     size="mini">新 增
          </el-button>
          <br/><br/>
        </template>
        <template slot-scope="scope"
                  slot="menu">
          <el-tooltip v-if="permissions.scms_orggoods_view" class="item" effect="dark" content="查看" placement="top">
            <el-button type="text" icon="icon-ry-chakan" plain @click="handleView(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="permissions.scms_orggoods_detail && scope.row.comboFlag == 1" class="item" effect="dark" content="套餐明细" placement="top">
            <el-button type="text"
                       icon="icon-ry-mingxi-line"
                       size="small"
                       plain
                       @click="handleItem(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="permissions.scms_orggoods_edit" class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text"
                       icon="icon-ry-bianji"
                       size="small"
                       plain
                       @click="handleEdit(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="permissions.scms_orggoods_delete" class="item" effect="dark" content="删除" placement="top">
            <el-button type="text"
                       icon="icon-ry-shanchu"
                       size="small"
                       plain
                       @click="handleDel(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
        </template>

        <!-- 商品ID 从平台商品选取（在新增，编辑框中的样式） -->
        <template slot-scope="scope" slot="goodsIdForm">
          <!-- 非套餐时(flag == 0)，点击才显示嵌套页 -->
          <el-button @click="scope.row.comboFlag == 0 ? showGoods = true : showGoods = false;"
                     :disabled= "readOnly || scope.row.comboFlag != 0"
          >
            <!--<span v-if="scope.value">{{selVipName}}（商品ID：{{scope.value}}）</span>-->
            <span v-if="scope.row.comboFlag != 0" class="grey">机构商品为套餐时，不需选择平台商品</span>
            <span v-else-if="scope.value">（平台商品ID：{{scope.value}}）</span>
            <span v-else>请点击选择平台商品</span>
          </el-button>
        </template>

      </avue-crud>

      <!-- 套餐明细维护的嵌套页 -->
      <el-dialog
        width="90%"
        title="套餐明细维护"
        :visible.sync="showItem">
        <OrgGoodsItem v-if="showItem" :currOrgGoods="currOrgGoods"/>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="showItem = false">关闭</el-button>
        </span>
      </el-dialog>

      <!-- 选取平台商品的嵌套页 -->
      <el-dialog
        width="90%"
        title="选取平台商品"
        :visible.sync="showGoods">
        <goods v-model="showGoods" @change="goodsChange"/>
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="showGoods = false;">取消</el-button>-->
        <!--<el-button type="primary" @click="goodsChange">确定</el-button>-->
        <!--</span>-->
      </el-dialog>

    </basic-container>

  </div>
</template>

<script>
  import goods from './index-goods.vue'
  import OrgGoodsItem from '@/views/nursing/goods/orggoods/item'
  import {fetchList, getObj, addObj, putObj, delObj} from '@/api/nursing/goods/orggoods'
  import {tableOption} from '@/const/crud/nursing/goods/orggoods'
  import {fetchTreeByItemClassCode} from '@/api/nursing/aid/itemclass'
  import {mapGetters} from 'vuex'

  export default {
    name: 'orggoods',
    components: {
      goods,
      OrgGoodsItem
    },
    data() {
      return {
        // treeData: [],
        tableData: [],
        currOrgGoods: {},
        showItem: false,
        showGoods: false,
        readOnly: true,
        form: {
          goodsId: "",
          goodsLabel: "",
          spec: "",
          model: "",
          unit: ""
        },
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption,
        // treeOption: {
        //   nodeKey: 'itemId',
        //   addBtn: false,
        //   menu: false,
        //   props: {
        //     id: 'id',
        //     label: 'itemName',
        //     value: 'itemId',
        //     children: 'childNodes'
        //   }
        // },

        search: {},
        searchParams: {
          queryKey: 'goods_label'
        },
        searchKeys: [
          {
            value: 'org_goods_code',
            label: '机构商品代码'
          }, {
            value: 'goods_label',
            label: '商品标题'
          }, {
            value: 'spec',
            label: '规格'
          }
        ],
      }
    },


    created() {
      // this.init()
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      // init() {
      //   fetchTreeByItemClassCode('goods_type').then(response => {
      //     this.treeData = [{
      //       id: '',
      //       itemId: '',
      //       itemName: '所有商品',
      //       itemCode: '',
      //       childNodes: response.data.data
      //     }]
      //
      //     {// 目前props的children映射不生效（BUG），手动处理一下children字段名问题。
      //       let recursive = function (data) {
      //         if (!data.childNodes || data.childNodes.length == 0)
      //           return
      //         data.children = data.childNodes;
      //         for (let i = 0; i < data.childNodes.length; i++) {
      //           recursive(data.childNodes[i]);
      //         }
      //       }
      //       recursive(this.treeData[0])
      //     }
      //   });
      // },
      getList(page) {
        this.tableLoading = true
        let param = {
          current: page === true ? 1 : page.currentPage,
          size: page === true ? this.page.pageSize : page.pageSize
        }
        for (let i in this.searchParams) {
          param[i] = this.searchParams[i]
        }
        fetchList(param).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.page.currentPage = response.data.data.current
          this.page.pageSize = response.data.data.size
          this.tableLoading = false
        })
      },

      handleFilter(param) {
        this.page.page = 1;
        this.searchParams.comboFlag = param.comboFlag;
        // this.searchParams.startTime = param.createTime[0];
        // this.searchParams.endTime = param.createTime[1];

        // this.getList(this.page, Object.assign(param, this.search));
        this.getList(true);
      },

      // 点击节点
      // nodeClick(data) {
      //   this.page.page = 1
      //   this.searchParams.goodsType = data.itemId
      //   // this.searchParams.goodsType.label = data.itemName
      //   this.getList(this.page)
      // },
      /**
       * @title 打开新增窗口
       * @detail 调用crud的handleadd方法即可
       *
       **/
      handleAdd: function () {
        this.readOnly = false,
        this.$refs.crud.rowAdd()
      },
      handleItem(row, index) {
        this.currOrgGoods = row;
        this.showItem = true;
      },
      handleView: function (row, index) {
        this.readOnly = true;
        this.$refs.crud.rowView(row, index);
      },
      handleEdit(row, index) {
        this.readOnly = false,
        this.$refs.crud.rowEdit(row, index)
      },
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      rowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为' + row.orgGoodsId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.orgGoodsId)
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
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList(this.page)
      },

      // 点击清空
      handleReset() {
        this.searchParams = {};
        // this.getList(this.page)
      },

      // 商品修改
      goodsChange(e) {
        this.form.goodsId = e.goodsId;
        this.form.goodsLabel = e.goodsName,
        this.form.spec = e.spec,
        this.form.model = e.model,
        this.form.unit = e.baseUnit
      }
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

  .grey {
    color: #BBB;
  }
</style>
