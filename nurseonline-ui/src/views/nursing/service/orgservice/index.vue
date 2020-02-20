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
    <basic-container title="机构服务管理">
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 v-model="form"
                 @on-load="getList"
                 @refresh-change="refreshChange"
                 @search-change="handleFilter"
                 @search-reset="handleReset"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @row-del="rowDel">
        <template slot="menuLeft">
          <el-button type="primary"
                     v-if="permissions.scms_orgservice_add"
                     @click="handleAdd"
                     size="small">新 增
          </el-button>
          <br/><br/>
        </template>
        <template slot-scope="scope"
                  slot="menu">
          <el-tooltip v-if="permissions.scms_orgservice_view" class="item" effect="dark" content="查看" placement="top">
            <el-button type="text" icon="icon-ry-chakan" plain @click="handleView(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="permissions.scms_orgservice_edit && scope.row.itemFlag != 0" class="item" effect="dark" content="服务明细" placement="top">
            <el-button type="text"
                       icon="icon-ry-mingxi-line"
                       size="small"
                       plain
                       @click="handleItem(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="permissions.scms_orgservice_edit" class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text"
                       icon="icon-ry-bianji"
                       size="small"
                       plain
                       @click="handleEdit(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="permissions.scms_orgservice_delete" class="item" effect="dark" content="删除" placement="top">
            <el-button type="text"
                       icon="icon-ry-shanchu"
                       size="small"
                       plain
                       @click="handleDel(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
        </template>

        <!-- 服务类别过滤搜索栏 -->
        <template slot="search">
          <el-form-item class="search-panel" label="服务类别" size="small">
            <el-select v-model="searchParams.treeType" placeholder="请选择" clearable>
              <template v-for="item in serviceTypeList">
                <el-option v-if="item.itemId != -1" :label="item.itemName" :value="item.itemId"
                           :key="item.itemId"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item class="search-panel">
            <el-input clearable v-model="searchParams.queryValue" class="input-with-select" size="small" placeholder="请输入内容">
              <el-select v-model="searchParams.queryKey" slot="prepend" placeholder="请选择">
                <el-option v-for="item in searchKeys" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </template>

        <!-- 服务类别选择下拉列表删除【未分类】 -->
        <template slot="serviceTypeForm" slot-scope="scope">
          <el-select v-model="form.serviceType" :disabled="readOnly" filterable placeholder="请选择">
            <template v-for="item in scope.dic">
              <el-option v-if="item.itemId != -1" :label="item.itemName" :value="item.itemId"
                         :key="item.itemId"></el-option>
            </template>
          </el-select>
        </template>

        <!--<template slot="search">-->
        <!--<el-form-item class="search-panel">-->
        <!--<el-input v-model="searchParams.queryValue"-->
        <!--class="input-with-select"-->
        <!--size="small"-->
        <!--placeholder="请输入内容">-->
        <!--<el-select v-model="searchParams.queryKey"-->
        <!--slot="prepend"-->
        <!--placeholder="请选择">-->
        <!--<el-option v-for="item in searchKeys"-->
        <!--:key="item.value"-->
        <!--:label="item.label"-->
        <!--:value="item.value"></el-option>-->
        <!--</el-select>-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <!--</template>-->

        <!-- 服务ID 从平台服务选取（在新增，编辑框中的样式） -->
        <template slot-scope="scope" slot="serviceIdForm">
          <el-button @click="scope.row.itemFlag == 0 ? showService = true : showService = false;"
                     :disabled= "readOnly || scope.row.itemFlag != 0"
          >
            <!--<span v-if="scope.value">{{selVipName}}（商品ID：{{scope.value}}）</span>-->
            <span v-if="scope.row.itemFlag != 0" class="grey">机构服务为套餐时，不需选择平台服务</span>
            <span v-else-if="scope.value">（平台服务ID：{{scope.value}}）</span>
            <span v-else >请点击选择平台服务</span>
          </el-button>
        </template>

        <!-- 工具包商品ID 从机构服务中选取（在新增，编辑框中的样式） -->
        <template slot-scope="scope" slot="kitGoodsIdForm">
          <!-- 有工具包(flag == 1)，点击才显示嵌套页 -->
          <el-button @click="scope.row.kitFlag == 1 ? showOrgGoods = true : showOrgGoods = false;"
                     :disabled= "readOnly || scope.row.kitFlag != 1"
          >
            <!--<span v-if="scope.value">{{selVipName}}（商品ID：{{scope.value}}）</span>-->
            <span v-if="scope.row.kitFlag != 1" class="grey">无工具包时，不需选择工具包商品</span>
            <span v-else-if="scope.value">（工具包商品ID：{{scope.value}}）</span>
            <span v-else class="grey">请点击选择工具包商品</span>
          </el-button>
        </template>


      </avue-crud>

      <!-- 机构服务明细明细维护的嵌套页 -->
      <el-dialog
        width="90%"
        title="机构服务明细维护"
        :visible.sync="showItem">
        <OrgServiceItem v-if="showItem" :currOrgService="currOrgService"/>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="showItem = false">关闭</el-button>
        </span>
      </el-dialog>

      <!-- 选取平台服务的嵌套页 -->
      <el-dialog
        width="90%"
        title="选取平台服务"
        :visible.sync="showService">
        <service v-model="showService" @change="serviceChange"/>
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="showGoods = false;">取消</el-button>-->
        <!--<el-button type="primary" @click="goodsChange">确定</el-button>-->
        <!--</span>-->
      </el-dialog>

      <!-- 选取机构商品（工具包商品）的嵌套页 -->
      <el-dialog
        width="90%"
        title="选取工具包商品"
        :visible.sync="showOrgGoods">
        <orgGoods v-model="showOrgGoods" @change="orgGoodsChange"/>
      </el-dialog>


    </basic-container>
  </div>
</template>

<script>
  import service from './index-service.vue'
  import orgGoods from "./index-org-goods"
  import {fetchList, getObj, addObj, putObj, delObj, serviceType} from '@/api/nursing/service/org-service'
  import {tableOption} from '@/const/crud/nursing/service/org-service'
  import OrgServiceItem from '@/views/nursing/service/orgservice/item'
  import {mapGetters} from 'vuex'

  export default {
    name: 'orgservice',
    components: {
      service,
      OrgServiceItem,
      orgGoods
    },
    data() {
      return {
        tableData: [],
        showItem: false,
        showService: false,
        showOrgGoods: false,
        readOnly: true,
        serviceTypeList: [],
        form: {
          serviceId: "",
          kitGoodsId: "",
          kitGoodsLabel: "",
          kitPrice: ""
        },
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption,
        search: {
          // queryKey: 'service_label',
          // queryValue: '',
        },
        searchParams: {
          queryKey: 'service_label'
        },
        searchKeys: [
          {
            value: 'service_label',
            label: '服务名称'
          }
        ],
      }
    },
    created() {
    },
    mounted: function () {
      this.getCodes();
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
      /**
       * @title 打开新增窗口
       * @detail 调用crud的handleadd方法即可
       *
       **/
      handleAdd: function () {
        this.readOnly = false,
        this.$refs.crud.rowAdd()
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
        this.$confirm('是否确认删除ID为' + row.orgServiceId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.orgServiceId)
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
      // 搜索
      handleFilter(param) {
        this.getList(true);
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
      handleItem(row, index) {
        this.currOrgService = row;
        this.showItem = true;
      },
      handleView: function (row, index) {
        this.readOnly = true,
        this.$refs.crud.rowView(row, index);
      },
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList(this.page)
      },

      // 商品修改
      serviceChange(e) {
        this.form.serviceId = e.serviceId;
      },

      // 点击清空
      handleReset() {
        this.searchParams = {};
      },

      // 初始化分类数据
      getCodes() {
        serviceType().then(res => {
          this.serviceTypeList = res.data.data;
        }).catch(err => {
        });
      },

      // 工具包商品修改
      orgGoodsChange(e) {
        this.form.kitGoodsId = e.orgGoodsId;
        this.form.kitGoodsLabel = e.goodsLabel;
        this.form.kitPrice = e.price;
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
