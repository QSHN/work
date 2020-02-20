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
                     @search-change="handleFilter"
                     @refresh-change="refreshChange"
                     @selection-change="selectionChange"
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

            <template slot-scope="scope"
                      slot="menu">
              <el-button type="text"
                         icon="el-icon-check"
                         size="small"
                         plain
                         @click="handleEdit(scope.row,scope.index)">编辑
              </el-button>
              <el-button type="text"
                         icon="el-icon-delete"
                         size="small"
                         plain
                         @click="handleDel(scope.row,scope.index)">删除
              </el-button>
            </template>

            <!-- 列表页面表格里面显示图片，对应字段定义里的 imgUrl字段的属性 slot: true -->
            <template slot-scope="scope" slot="imgUrl">
              <img v-if="scope.row.imgUrl" :src="scope.row.imgUrl.split(';')[0]" class="goods-img"/>
            </template>

          </avue-crud>
        </el-col>
      </el-row>
    </basic-container>

    <div class="footer">
      <el-button type="primary"
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
  import {fetchList, getObj, addObj, putObj, delObj} from '@/api/nursing/goods/goods'
  import {addObjs} from '@/api/nursing/goods/org-goods-item.js'
  import {tableOption} from '@/const/crud/nursing/goods/goods'
  import {fetchTreeByItemClassCode} from '@/api/nursing/aid/itemclass'
  import {mapGetters} from 'vuex'

  export default {
    name: 'goods',

    props: {
      orgGoodsId: {
        type: Number,
        default: () => {
        }
      },
      showAddGoods: {
        type: Boolean,
        default: () => {
        }
      }
    },

    data() {
      return {
        treeData: [],
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        search: {
          queryKey: 'goods_name',
          queryValue: '',
        },
        searchParams: {},
        searchKeys: [
          {
            value: 'goods_code',
            label: '商品代码'
          }, {
            value: 'goods_name',
            label: '商品名称'
          }, {
            value: 'manufacturer',
            label: '生产企业'
          }, {
            value: 'spec',
            label: '包装规格'
          }, {
            value: 'creator_name',
            label: '建档人名称'
          }
        ],
        tableLoading: false,
        tableOption: tableOption,

        form: {
          datetime: '1398250549123'//时间戳例子
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

        listData: []
      }
    },
    created() {
      this.init()
      this.tableOption = Object.assign({}, tableOption, {
        menu: false,
        selection: true
      })
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      init() {
        fetchTreeByItemClassCode('goods_type').then(response => {
          this.treeData = [{
            id: '',
            itemId: '',
            itemName: '所有商品',
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

      // 过滤搜索
      handleFilter(param) {
        // 去除上一次搜索遗留下来的值
        if (this.searchParams.startTime || this.searchParams.endTime) {
          this.searchParams.startTime = "";
          this.searchParams.endTime = "";
        }
        if (param.createTime) {
          this.searchParams.startTime = param.createTime[0];
          this.searchParams.endTime = param.createTime[1];
        }
        // this.getList(this.page, Object.assign(param, this.search));
        this.getList(true);
      },

      // 点击节点
      nodeClick(data) {
        this.page.page = 1
        this.searchParams.goodsType = data.itemId
        // this.searchParams.goodsType.label= data.itemName
        this.getList(true)
      },

      // 点击清空搜索条件
      handleReset() {
        this.searchParams = {};
        this.getList(this.page)
      },

      // 取消行选择
      toggleSelection(val) {
        this.$refs.crud.toggleSelection(val);
      },

      //
      selectionChange(list) {
        this.listData = list
        // this.$message.success('选中的数据'+ JSON.stringify(list));
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
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      rowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为' + row.goodsId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.goodsId)
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
       * @title 批量添加套餐明细
       * @param row 为当前的数据
       * @param done 为表单关闭函数
       **/
      handleSaveItems: function (list, done) {
        for (let i in this.listData) {

          // 组装需要的属性
          this.listData[i] = Object.assign({
            orgGoodsId: this.orgGoodsId,
            goodsLabel: this.listData[i].goodsName,
            unit: this.listData[i].baseUnit
          }, this.listData[i]);

          // 删除不必要的属性
          delete this.listData[i].baseUnit;
          delete this.listData[i].createTime;
          delete this.listData[i].goodsCode;
          delete this.listData[i].goodsName;
          delete this.listData[i].goodsType;
          delete this.listData[i].imgUrl;
          delete this.listData[i].intro;
          delete this.listData[i].manufacturer;
          delete this.listData[i].refPrice;
          delete this.listData[i].versionNo;
        }
        // 调用批量添加套餐明细方法
        addObjs(this.listData).then(data => {
          this.tableData.push(Object.assign({}, this.listData))
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
          // 关闭嵌套页面
          this.closePage();
        })
      },

      // 关闭嵌套页面
      closePage() {
        this.$emit("pageClose", false)
      },
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList(this.page)
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

  .footer{
    width: 98%;
    text-align: right;
  }

</style>
