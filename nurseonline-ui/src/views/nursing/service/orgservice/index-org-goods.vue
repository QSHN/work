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
<!-- 嵌套 机构服务页面 - 耗材包，工具包对应的商品ID - 嵌套选择页选择机构商品 -->

<template>
  <div class="execution inner-dialog">
    <basic-container>
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
                 @row-del="rowDel"
                 @row-click="handleRowClick"
      >

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

      </avue-crud>

    </basic-container>

    <div class="footer">
      <el-button type="primary"
                 @click="handleSelect"
                 size="small">
        确认
      </el-button>
      <el-button @click="closePage"
                 size="small">
        取消
      </el-button>
      <el-button @click="deleteSelete"
                 size="small">
        不选择商品
      </el-button>
    </div>

  </div>
</template>

<script>
  import {fetchList, getObj, addObj, putObj, delObj} from '@/api/nursing/goods/orggoods'
  import {tableOption} from '@/const/crud/nursing/goods/orggoods'
  import {fetchTreeByItemClassCode} from '@/api/nursing/aid/itemclass'
  import {mapGetters} from 'vuex'

  export default {
    name: 'orggoods',
    props: {
      showOrgGoods: {
        type: Boolean,
        default: () => {
        }
      }
    },
    data() {
      return {
        // treeData: [],
        tableData: [],
        currOrgGoods: {},
        readOnly: true,
        orgGoodsSelect: {},
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption,

        search: {
        },
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
      this.tableOption = Object.assign({}, tableOption, {
        highlightCurrentRow: true,
        menu: false
      })
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
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
        this.searchParams.comboFlag = param.comboFlag;
        this.getList(true);
      },

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

      // 行单击
      handleRowClick(e) {
        if(e){
          this.orgGoodsSelect = e;
        }
      },

      // 关闭页面
      closePage() {
        this.$emit("input", false);
      },

      // 确定提交选择的商品
      handleSelect() {
        let e = this.orgGoodsSelect;
        if (e && e.orgGoodsId) {
          this.$emit("change", e);
          this.$emit("input", false);
        } else {
          this.$message.warning("请先点击选择机构商品");
        }
      },

      // 取消选择
      deleteSelete() {
        let e = {};
        this.$emit("change", e);
        this.$emit("input", false);
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

  .footer{
    width: 98%;
    text-align: right;
  }

  .inner-dialog .avue-crud__menu{
      right: 20px;
  }

</style>

<!--<style>-->
  <!--/deep/ .inner-dialog .avue-crud__menu{-->
    <!--right: 80px;-->
  <!--}-->
<!--</style>-->
