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
    <basic-container title="机构商品库存管理">
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 v-model="form"
                 @on-load="getList"
                 @refresh-change="refreshChange"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @search-change="handleFilter"
                 @search-reset="handleReset"
                 @row-del="rowDel">

        <template slot="date">
          <el-form-item label="单据日期">
            <el-date-picker v-model="search.slot" type="daterange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期" :clearable="false"></el-date-picker>
          </el-form-item>
        </template>

        <template slot="search">
          <el-form-item class="search-panel">
            <el-input size="small" v-model="searchParams.queryValue" class="input-with-select" placeholder="请输入内容">
              <el-select v-model="searchParams.queryKey" slot="prepend" placeholder="请选择">
                <el-option v-for="item in searchKeys" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </template>

        <template slot="menuLeft">
          <el-tooltip class="item" v-if="permissions.scms_stock_bill_add" effect="dark" content="新 增" placement="top">
            <el-button type="primary"
                       @click="handleAdd"
                       icon="icon-ry-jia"
                       size="small"></el-button>
          </el-tooltip>
          <br/><br/>
        </template>
        <template slot-scope="scope"
                  slot="menu">
          <el-tooltip class="item" v-if="permissions.scms_stock_bill_view" effect="dark" content="查看" placement="top">
            <el-button type="text"
                       icon="icon-ry-chakan"
                       size="small"
                       plain
                       @click="handleView(scope.row,scope.index)"></el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.billState == 0 && permissions.scms_stock_bill_edit" class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text"
                       icon="icon-ry-bianji"
                       size="small"
                       plain
                       @click="handleEdit(scope.row,scope.index)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" v-if="permissions.scms_stock_bill_items" content="明细" placement="top">
            <el-button type="text"
                       icon="icon-ry-mingxi"
                       size="small"
                       plain
                       @click="handleItems(scope.row,scope.index)"></el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.billState == 0 && permissions.scms_stock_bill_delete" class="item" effect="dark" content="删除" placement="top">
            <el-button type="text"
                       icon="icon-ry-shanchu"
                       size="small"
                       plain
                       @click="handleDel(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.billState == 0 && permissions.scms_stock_bill_commit" class="item" effect="dark" content="提交" placement="top">
            <el-button type="text"
                       icon="icon-ry-tijiao"
                       size="small"
                       plain
                       @click="handleCommit(scope.row,scope.index)"></el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.billState == 1 && permissions.scms_stock_bill_processSuccess" class="item" effect="dark" content="审核通过" placement="top">
            <el-button type="text"
                       icon="icon-ry-shtongguo"
                       size="small"
                       plain
                       @click="handleSuccessful(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.billState == 1 && permissions.scms_stock_bill_processFail" class="item" effect="dark" content="审核不通过" placement="top">
            <el-button type="text"
                       icon="icon-ry-shbutongguo"
                       size="small"
                       plain
                       @click="handleFailed(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.billState == 2 && scope.row.shipmentState == 0 && permissions.scms_stock_bill_onDelivery" class="item" effect="dark" content="确认发货" placement="top">
            <el-button type="text"
                       icon="icon-ry-fahuo"
                       size="small"
                       plain
                       @click="onDelivery(scope.row,scope.index)"></el-button>
          </el-tooltip>
        </template>

        <template slot-scope="scope" slot="sellOrgIdForm">
          <el-button @click="showOrgs = true" :disabled="readOnly">
            <span v-if="scope.value">{{subStr(selOrgName + '（机构ID：' + scope.value + '）')}}</span>
            <span class="grey" v-else>请点击选择机构</span>
          </el-button>
        </template>

        <template slot-scope="scope" slot="stockBillItemsForm">
          <el-button @click="itemsClick">
            <div v-if="allSelList">
              {{allSelList}}
            </div>
            <span class="grey" v-else>请点击选择商品</span>
          </el-button>
        </template>
      </avue-crud>

      <el-dialog
        title="出入库单详情"
        :visible.sync="showStockBillDetail">
        <stockDetail v-if="showStockBillDetail" :billId=billId></stockDetail>
      </el-dialog>

    </basic-container>
    <orgs v-model="showOrgs" @change="orgChange"></orgs>
    <items v-model="showItems" v-bind:allSelList="allSelList" :sellOrgId="form.sellOrgId" @change="itemChange"></items>
  </div>
</template>

<script>
  import {
    onDelivery,
    commit,
    successful,
    failed,
    fetchList,
    getObj,
    addObj,
    putObj,
    delObj
  } from '@/api/nursing/stock/stockbill'
  import {tableOption} from '@/const/crud/nursing/stock/stockbill'
  import {getStockDetail} from '@/api/nursing/stock/stockbill'
  import stockDetail from './stockDetail.vue'
  import {mapGetters} from 'vuex'
  import orgs from "./components/orgs.vue"
  import items from "./components/items.vue"

  export default {
    name: 'stockbill',
    components: {stockDetail, orgs, items},
    data() {
      return {
        tableData: [],
        form: {
          sellOrgId: "",
          stockBillItems: ""
        },
        allSelList : new Map(),
        // allSelList : new Map().set("1","2"),
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条1
        },
        showStockBillDetail: false,
        billId: "",
        readOnly: false,
        tableLoading: false,
        tableOption: tableOption,
        search: {},
        searchParams: {
          queryKey: 'bill_id'
        },
        searchKeys: [
          {
            value: 'bill_id',
            label: '单号'
          }, {
            value: 'rel_staff_name',
            label: '服务人员名称'
          }, {
            value: 'sell_org_name',
            label: '卖家机构名称'
          }, {
            value: 'buy_org_name',
            label: '买家机构名称'
          }
        ],
        option: {
          labelWidth: 110,
          column: [{
            label: "日期范围",
            prop: "daterange",
            type: "daterange",
            startPlaceholder: '日期开始范围自定义',
            endPlaceholder: '日期结束范围自定义',
          }]
        },
        daterange: {
          startDate: '',
          endDate: ''
        },
        showOrgs: false,
        showItems: false,
        selOrgName: "",
        itemSelList: []
      }
    },
    created() {
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      getList(page) {
        console.log(this.page)
        this.tableLoading = true
        let param = {
          current: page === true ? 1 : page.currentPage,
          size: page === true ? this.page.pageSize : page.pageSize
        }
        for (let i in this.searchParams) {
          param[i] = this.searchParams[i]
        }
        fetchList(param).then(response => {
          let dt = response.data.data;
          this.tableData = dt.records;
          this.page.currentPage = dt.current;
          if (response.data.data.pages < param.current) {
            this.page.currentPage = dt.pages;
          }
          this.page.total = dt.total;
          this.tableLoading = false;
        });
      },
      // 过滤搜索
      handleFilter(param) {
        console.log("asdfsfs")
        this.page = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        };
        // 去除上一次搜索遗留下来的值
        if (this.searchParams.startDate || this.searchParams.endDate) {
          this.searchParams.startDate = "";
          this.searchParams.endDate = "";
        }
        if (param.billDate) {
          this.searchParams.startDate = param.billDate[0];
          this.searchParams.endDate = param.billDate[1];
        }
        this.searchParams.billState = param.billState;
        this.searchParams.payState = param.payState;
        this.searchParams.shipmentState = param.shipmentState;
        this.getList(this.page);
      },
      // 点击清空
      handleReset() {
        this.searchParams = {
          queryKey: 'bill_no'
        };
        this.getList(this.page)
      },
      /**
       * @title 打开新增窗口
       * @detail 调用crud的handleadd方法即可
       *
       **/
      handleAdd: function () {
        //新增就清空子页面的已选择商品
        this.allSelList.clear();
        this.readOnly = false;
        this.$refs.crud.rowAdd()
      },
      handleEdit(row, index) {
        //可以修改机构信息
        this.readOnly = false;

        getStockDetail(row.billId).then(res => {
          if (res.data && res.data.data) {
            let items = res.data.data || [];
            this.allSelList.clear();
            items.forEach(item => {
              this.allSelList.set(item.orgGoodsId, item.qty)
            });
            this.form.stockBillItems = this.allSelList;
          }
          console.log(this.allSelList)
          this.$refs.crud.rowEdit(row, index)
          this.loading = false;
        }).catch(err => {
          this.loading = false;
        });
      },
      handleView(row, index) {
        this.readOnly = true;
        this.$refs.crud.rowView(row, index)
      },
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      handleItems(row, index) {
        this.billId = row.billId;
        this.showStockBillDetail = true;
      },
      handleCommit(row, index) {
        commit(row.billId).then(res => {
          this.$message({
            showClose: true,
            message: '提交成功',
            type: 'success'
          });
          this.getList(this.page)
        });
      },
      subStr(str) {
        if (str.length <= 10)
          return str;
        return str.substring(0, 8) + '...';
      },
      handleSuccessful(row, index) {
        successful(row.billId).then(res => {
          this.$message({
            showClose: true,
            message: '提交成功',
            type: 'success'
          });
          this.getList(this.page)
        });
      },
      handleFailed(row, index) {
        this.$prompt('请输入异常原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[^ ]+/,
          inputErrorMessage: '异常原因不能为空'
        }).then(({value}) => {
          failed(row.billId, value).then(res => {
            this.$message({
              showClose: true,
              message: '提交成功',
              type: 'success'
            });
            this.getList(this.page)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      onDelivery(row, index) {
        onDelivery(row.billId).then(res => {
          this.$message({
            showClose: true,
            message: '提交成功',
            type: 'success'
          });
          this.getList(this.page)
        });
      },
      rowDel: function (row, index) {
        var _this = this;
        this.$confirm('是否确认删除ID为' + row.billId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.billId)
        }).then(data => {
          _this.tableData.splice(index, 1);
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          });
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
        let obj = {};
        for (let[k, v] of this.allSelList) {
          obj[k] = v;
        }
        row.stockBillItems = obj;
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
        let obj = {};
        for (let[k, v] of this.allSelList) {
          obj[k] = v;
        }
        row.stockBillItems = obj;
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
      orgChange(e) {
        this.form.sellOrgId = e.orgId;
        this.selOrgName = e.orgName;
      },
      itemsClick(e) {
        if (!this.form.sellOrgId) {
          this.$message.warning("请先选择卖家机构");
        } else {
          this.showItems = true;
        }
      },
      itemChange(e) {
        this.itemSelList = e;
        let list = [...e];
        list = list.map(item => {
          let tmp = {};
          tmp[item.orgGoodsId] = item.qty;
          return tmp;
        });
        this.form.stockBillItems = [...list];
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

</style>
