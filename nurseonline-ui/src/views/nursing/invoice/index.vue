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
    <basic-container title="发票管理">
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 v-model="form"
                 @on-load="getList"
                 @search-reset="handleReset"
                 @refresh-change="refreshChange"
                 @search-change="handleFilter"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @row-del="rowDel">

        <template slot="date">
          <el-form-item label="开票日期">
            <el-date-picker v-model="search.slot" type="daterange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期" :clearable="false"></el-date-picker>
          </el-form-item>
        </template>

        <template slot="search">
          <el-form-item class="search-panel" size="small">
            <el-input v-model="searchParams.queryValue" class="input-with-select" placeholder="请输入内容">
              <el-select v-model="searchParams.queryKey" slot="prepend" placeholder="请选择">
                <el-option v-for="item in searchKeys" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </template>

        <template slot="menuLeft">
          <el-tooltip class="item" v-if="permissions.oms_invoice_add" effect="dark" content="新 增" placement="top">
            <el-button type="primary"
                       @click="handleAdd"
                       icon="icon-ry-jia"
                       size="small">
            </el-button>
          </el-tooltip>
          <br/><br/>
        </template>
        <template slot-scope="scope"
                  slot="menu">
          <el-tooltip v-if="permissions.oms_invoice_view" class="item" effect="dark" content="查看" placement="top">
            <el-button type="text"
                       size="small"
                       icon="icon-ry-chakan"
                       plain
                       @click="handleView(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.billState == 0 && permissions.oms_invoice_edit" class="item" effect="dark"
                      content="编辑" placement="top">
            <el-button type="text"
                       size="small"
                       icon="icon-ry-bianji"
                       plain
                       @click="handleEdit(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" v-if="permissions.oms_invoice_items" content="明细" placement="top">
            <el-button type="text"
                       icon="icon-ry-mingxi"
                       size="small"
                       plain
                       @click="handleItems(scope.row,scope.index)"></el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.billState == 0 && permissions.oms_invoice_delete" class="item" effect="dark"
                      content="删除" placement="top">
            <el-button type="text"
                       size="small"
                       icon="icon-ry-shanchu"
                       plain
                       @click="handleDel(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.billState == 0 && permissions.oms_invoice_commit" class="item" effect="dark"
                      content="提交" placement="top">
            <el-button type="text"
                       icon="icon-ry-tijiao"
                       size="small"
                       plain
                       @click="commit(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.billState == 1 && permissions.oms_invoice_revoke" class="item" effect="dark"
                      content="撤回" placement="top">
            <el-button type="text"
                       icon="icon-ry-chexiao"
                       size="small"
                       plain
                       @click="revoke(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.billState == 1 && permissions.oms_invoice_processSuccess" class="item"
                      effect="dark" content="审核" placement="top">
            <el-button type="text"
                       icon="icon-ry-shenhe"
                       size="small"
                       plain
                       @click="check(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
        </template>

        <template slot-scope="scope" slot="vipIdForm">
          <el-button @click="showVips = true" :disabled="readOnly">
            <span v-if="scope.value">{{selVipName}}（会员ID：{{scope.value}}）</span>
            <span class="grey" v-else>请点击</span>
          </el-button>
        </template>

        <template slot-scope="scope" slot="billIdsForm">
          <el-button @click="billsClick" :disabled="readOnly">
            <div v-if="scope.value">
              <span v-for="(item, index) in scope.value" :key="index">{{item}}{{index + 1 === scope.value.length ? "" : ","}}</span>
            </div>
            <span class="grey" v-else>请点击</span>
          </el-button>
        </template>

      </avue-crud>

      <el-dialog
        title="开票订单详情"
        :visible.sync="showInvoiceItmesDetail">
        <itemsDetail v-if="showInvoiceItmesDetail" :invoiceId=invoiceId></itemsDetail>
      </el-dialog>

    </basic-container>
    <vips v-model="showVips" @change="vipChange"></vips>
    <bills v-model="showBills" :vip-id="form.vipId" @change="billChange"></bills>
    <!--<check v-model="showCheck"  :currCheckInvoice="currCheckInvoice"></check>-->

    <el-dialog width="50%" title="审核" :visible.sync="showCheck">
      <avue-form ref="checkForm" v-model="currCheckInvoice" :option="checkTableOption">
        <template slot-scope="scope" slot="menuForm">
          <el-button @click="processSuccess(currCheckInvoice, 0)" type="primary">审核通过</el-button>
          <el-button @click="processFail(currCheckInvoice, 0)">审核不通过</el-button>
        </template>

        <template slot-scope="scope" slot="vipId">
          <el-button @click="showVips = true">
            <span v-if="scope.value">{{selVipName}}（会员ID：{{scope.value}}）</span>
            <span class="grey" v-else>请点击选择会员</span>
          </el-button>
        </template>

        <template slot-scope="scope" slot="billIds">
          <el-button @click="billsClick">
            <div v-if="scope.value">
              <span v-for="(item, index) in scope.value" :key="index">{{item}}{{index + 1 === scope.value.length ? "" : ","}}</span>
            </div>
            <span class="grey" v-else>请点击选择订单</span>
          </el-button>
        </template>
      </avue-form>
    </el-dialog>

    <!-- 审核成功的嵌套页 -->
    <el-dialog
      width="50%"
      title="审核通过"
      :visible.sync="showCheckSuccess">

      <el-form ref="myForm" :model="form" label-width="80px">
        <el-form-item label="税率">
          <el-input type="number"
                    v-model="form.taxRate"
                    placeholder="税率应该大于0，小于1"
                    clearable
                    min="0"
                    max="1">
          </el-input>
        </el-form-item>
        <el-form-item label="下载地址">
          <el-input type="text"
                    v-model="form.fileUrl"
                    clearable
                    placeholder="发票下载地址">
          </el-input>
        </el-form-item><br>

        <el-form-item>
          <el-button type="primary" @click="processSuccess0">确认</el-button>
          <el-button @click="showAccept = false">取消</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import {
    fetchList,
    itemsByInvoiceId,
    getObj,
    addObj,
    putObj,
    delObj,
    commit,
    revoke,
    processSuccess,
    processFail
  } from '@/api/nursing/invoice/invoice'
  import {tableOption} from '@/const/crud/nursing/invoice/invoice'
  import {checkTableOption} from '@/const/crud/nursing/invoice/checkInvoice'
  import {mapGetters} from 'vuex'
  import vips from "./components/vips.vue"
  import bills from "./components/bills.vue"
  import check from "./components/check.vue"
  import itemsDetail from './components/itemsDetail.vue'


  export default {
    name: 'invoice',
    components: {vips, bills, check, itemsDetail},
    data() {
      return {
        showCheckSuccess: false,
        tableData: [],
        showCheck: false,
        currCheckInvoice: {},
        readOnly: false,
        tmpRow: {},
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条1
        },
        tableLoading: false,
        tableOption: tableOption,
        checkTableOption: checkTableOption,
        search: {
          queryKey: 'goods_name',
          queryValue: '',
        },
        searchParams: {
          queryKey: 'invoice_no'
        },
        searchKeys: [
          {
            value: 'invoice_no',
            label: '发票号码'
          }, {
            value: 'org_id',
            label: '机构id'
          }, {
            value: 'invoice_title',
            label: '发票抬头'
          }, {
            value: 'invoice_tax_no',
            label: '纳税人识别号'
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
        columnBackups: [],
        daterange: {
          startTime: '',
          endTime: ''
        },
        showVips: false,
        showInvoiceItmesDetail: false,
        invoiceId: "",
        form: {
          taxRate: '',
          fileUrl: '',
          vipId: "",
          billIds: []
        },
        selVipName: "",
        showBills: false,
        billSelList: []
      }
    },
    created() {

      //备份所有字段
      for (let i = 0; i < checkTableOption.column.length; i++) {
        this.columnBackups[i] = checkTableOption.column[i];
      }

      this.checkTableOption = Object.assign({}, this.checkTableOption, {
        submitBtn: false,
        emptyBtn: false,
      })
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      getList(page, params) {
        this.tableLoading = true
        let param = {
          current: page === true ? 1 : page.currentPage,
          size: page === true ? this.page.pageSize : page.pageSize
        }
        console.log(param)
        for (let i in this.searchParams) {
          param[i] = this.searchParams[i]
        }
        fetchList(param).then(response => {
          let dt = response.data.data;
          this.tableData = dt.records;
          this.page.total = dt.total;
          this.page.currentPage = dt.current;
          this.tableLoading = false;
          // 如果当前页数大于最大页数，自动矫正到最后一页，防止删除后留在空白页
          if (dt.pages < param.current) {
            this.page.currentPage = dt.pages;
          }
          this.tableData.forEach(i => {
            Object.assign(i, {
              billIds: []
            });
            itemsByInvoiceId(i.invoiceId).then(res => {
              res.data.data.forEach(it => {
                i.billIds.push(it.billId)
              });
            })
          })

        });
      },
      // 过滤搜索
      handleFilter(param) {
        this.page = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        };
        this.searchParams.startDate = param.invoiceDate[0];
        this.searchParams.endDate = param.invoiceDate[1];
        this.searchParams.billState = param.billState;
        this.searchParams.invoiceType = param.invoiceType;
        this.getList(true);
      },
      handleItems(row, index) {
        this.invoiceId = row.invoiceId;
        this.showInvoiceItmesDetail = true;
      },
      // 点击清空
      handleReset() {
        this.searchParams = {
          queryKey: 'invoice_no'
        };
        this.getList(this.page)
      },
      /**
       * @title 打开新增窗口
       * @detail 调用crud的handleadd方法即可
       *
       **/
      handleAdd: function () {
        this.readOnly = false;
        this.$refs.crud.rowAdd()
      },
      handleView: function (row, index) {
        this.readOnly = true;
        this.$refs.crud.rowView(row, index);
      },
      check(row, index) {

        this.form.vipId = row.vipId;

        //重置字段
        for (let i = 0; i < this.columnBackups.length; i++) {
          checkTableOption.column[i] = this.columnBackups[i];
        }

        //忽略没有填写的信息
        for (let i = 0; i < checkTableOption.column.length; i++) {
          let item = checkTableOption.column[i];
          if (row[item.prop] === null || row[item.prop] === undefined || row[item.prop] === '') {
            checkTableOption.column.splice(i--, 1);
          }
        }

        this.currCheckInvoice = row;
        this.showCheck = true;
      },
      handleEdit(row, index) {
        this.readOnly = false;
        this.form.vipId = row.vipId;
        this.$refs.crud.rowEdit(row, index)
      },
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      rowDel: function (row, index) {
        var _this = this;
        this.$confirm('是否确认删除ID为' + row.invoiceId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.invoiceId)
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
      commit(row, index) {
        commit(Object.assign({
          invoiceId: row.invoiceId
        })).then(response => {
          this.$message({
            showClose: true,
            message: '提交成功',
            type: 'success'
          });
          this.getList(this.page)
        })
      },
      revoke(row, index) {
        revoke(Object.assign({
          invoiceId: row.invoiceId
        })).then(response => {
          this.currCust = row;
          this.certTableData = response.data.data;
          this.showCert = true;
          this.$message({
            showClose: true,
            message: '撤回成功',
            type: 'success'
          });
          this.getList(this.page)
        })
      },
      processSuccess0() {
        this.tmpRow.taxRate = this.form.taxRate;
        this.tmpRow.fileUrl = this.form.fileUrl;
        this.showCheckSuccess = false;
        processSuccess(this.tmpRow).then(response => {
          this.$message({
            showClose: true,
            message: response.data.msg,
            type: 'success'
          });
          this.getList(this.page);
        });
        this.showCheck = false;
      },
      processSuccess(row, index) {
        if (row.invoiceMedia === "0") {
          this.showCheckSuccess = true;
          this.form.taxRate = '';
          this.form.fileUrl = '';
          this.tmpRow = row;
        } else if (row.invoiceMedia === "1") {
          this.$prompt('请输入税率', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /[^ ]+/,
            inputErrorMessage: '税率不能为空'
          }).then(({value}) => {
            row.taxRate = value;
            processSuccess(row).then(response => {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: 'success'
              });
              this.getList(this.page);
            });
            this.showCheck = false;
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        } else {
          this.$message({
            showClose: true,
            message: '发票介质数据错误',
            type: 'fail'
          })
        }
      },
      processFail(row, index) {
        this.$prompt('请输入不通过原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[^ ]+/,
          inputErrorMessage: '不通过原因不能为空'
        }).then(({value}) => {
          row.reason = value;
          processFail(row).then(response => {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: 'success'
            });
            this.getList(this.page);
          });
          this.showCheck = false;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
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
      vipChange(e) {
        this.form.vipId = e.vipId;
        this.selVipName = e.vipName;
      },
      billsClick(e) {
        if (this.form.vipId === "" || this.form.vipId === null || this.form.vipId === undefined) {
          this.$message.warning("请先选择开票会员");
        } else {
          this.showBills = true;
        }
      },
      billChange(e) {
        this.billSelList = e;
        let list = [...e];
        list = list.map(item => {
          return item.billId;
        });
        this.form.billIds = [...list];
      },
      handlePass() {
        console.log("currInvoice", this.currInvoice)
      },
      handleRefuse() {

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
