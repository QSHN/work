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
    <basic-container title="紧急求助管理">
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @on-load="getList"
                 @refresh-change="refreshChange"
                 @search-change="handleFilter"
                 @search-reset="handleReset"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
      >

        <!--<template slot="menuLeft">-->
          <!--<el-button type="primary"-->
                     <!--@click="handleAdd"-->
                     <!--size="small">新 增-->
          <!--</el-button>-->
          <!--<br /><br />-->
        <!--</template>-->

        <!-- 创建时间过滤 -->
        <template slot="date">
          <el-form-item label="创建时间">
            <el-date-picker v-model="search.slot"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :clearable="false">
            </el-date-picker>
          </el-form-item>
        </template>

        <!-- 自定义搜索栏 -->
        <template slot="search">

          <el-form-item class="search-panel" label="报警类型" size="small">
            <el-select v-model="searchParams.alarmType" placeholder="请选择" clearable>
              <template v-for="item in alarmTypeList">
                <el-option v-if="item.itemId != -1" :label="item.itemName" :value="item.itemId"
                           :key="item.itemId">
                </el-option>
              </template>
            </el-select>
          </el-form-item>

          <el-form-item class="search-panel">
            <el-input clearable v-model="searchParams.queryValue"
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

        <!-- 相关机构列表 插槽，只用于查看 -->
        <template slot-scope="scope" slot="relOrgListForm">
          <!-- 非套餐时(flag == 0)，点击才显示嵌套页 -->
          <el-button @click="showRelOrgList(scope.row.relOrgList)" >
            <!--<span v-if="scope.value">{{selVipName}}（商品ID：{{scope.value}}）</span>-->
            <span v-if="!scope.row.relOrgList" class="grey">无相关机构列表</span>
            <span v-else-if="scope.value">（相关机构列表ID：{{scope.value.substring(1, scope.value.length - 1)}}）</span>
          </el-button>
        </template>

        <template slot-scope="scope" slot="menu">

          <el-tooltip v-if="permissions.oms_alarm_view" class="item" effect="dark" content="查看" placement="top">
            <el-button type="text" icon="icon-ry-chakan" plain @click="handleView(scope.row, scope.index)">
            </el-button>
          </el-tooltip>

          <el-tooltip v-if="permissions.oms_alarm_accept && scope.row.alarmState == 0" class="item" effect="dark" content="受理" placement="top">
            <el-button type="text" icon="icon-ry-kaishi" plain @click="handleAccept(scope.row,scope.index)">
            </el-button>
          </el-tooltip>

          <el-tooltip v-if="permissions.oms_alarm_handle && scope.row.alarmState == 1" class="item" effect="dark" content="处理" placement="top">
            <el-button type="text" icon="icon-ry-wancheng" plain @click="handleHandle(scope.row,scope.index)">
            </el-button>
          </el-tooltip>

        </template>

      </avue-crud>

      <!-- 受理的嵌套页 -->
      <el-dialog
        width="50%"
        title="受理"
        :visible.sync="showAccept">

        <el-form ref="myForm" :model="form" label-width="80px">
          <el-form-item label="受理描述">
            <el-input type="textarea"
                      v-model="form.acceptDesc"
                      placeholder = "描述内容应在250个字内"
                      :autosize="{ minRows: 2}">
            </el-input><br/><br/>

            <el-button @click="showOrg = true">
              <span v-if="form.relOrgList">（机构ID：{{form.relOrgList.substring(1, form.relOrgList.length - 1)}}）</span>
              <span v-else class="grey">请点击选择相关机构列表</span>
            </el-button><br/><br/>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="doHandleAccept">受理</el-button>
            <el-button @click="showAccept = false">取消</el-button>
          </el-form-item>

        </el-form>
      </el-dialog>

      <!-- 选择机构的嵌套页 -->
      <el-dialog width="90%"
                 title="选择相关机构列表"
                 :visible.sync="showOrg">
        <org v-if="showOrg" v-model="showOrg" v-bind:allSelList="allSelList" v-bind:readOnly="readOnly" @change="orgChange"/>
      </el-dialog>

    </basic-container>
  </div>
</template>

<script>
  import org from "./index-org"
  import { fetchList, getObj, putObj, accept, handle, alarmType } from '@/api/nursing/alarm/alarm-rec'
  import { tableOption } from '@/const/crud/nursing/alarm/alarm-rec'
  import { mapGetters } from 'vuex'
  export default {
    name: 'alarmrec',
    components: {
      org
    },
    data() {
      return {
        tableData: [],
        readOnly: true,
        showAccept: false,
        showOrg: false,
        alarmTypeList: [],
        allSelList: new Set(),
        form: {
          acceptDesc: "",
          relOrgList: "",
          recId: 0,
          versionNo: 0
        },
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        search: {},
        searchParams: {
          queryKey: 'user_name'
        },
        searchKeys: [
          {
            value: 'user_name',
            label: '用户名'
          }, {
            value: 'phone',
            label: '手机号'
          }, {
            value: 'accepter_name',
            label: '受理人'
          }, {
            value: 'handler_name',
            label: '处理人'
          }, {
            value: 'zone_name',
            label: '报警区域'
          }
        ],
        tableLoading: false,
        tableOption: tableOption,
      }
    },
    created() {
    },
    mounted: function() {
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
      handleView: function (row, index) {
        this.readOnly = true;
        this.$refs.crud.rowView(row, index);
      },

      // handleAdd: function() {
      //   this.$refs.crud.rowAdd()
      // },
      handleEdit(row, index) {
        this.$refs.crud.rowEdit(row, index)
      },
      // handleDel(row, index) {
      //   this.$refs.crud.rowDel(row, index)
      // },
      // rowDel: function(row, index) {
      //   var _this = this
      //   this.$confirm('是否确认删除ID为' + row.recId, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(function() {
      //       return delObj(row.recId)
      //     }).then(data => {
      //     _this.tableData.splice(index, 1)
      //     _this.$message({
      //       showClose: true,
      //       message: '删除成功',
      //       type: 'success'
      //     })
      //     this.getList(this.page)
      //   }).catch(function(err) { })
      // },
      /**
       * @title 数据更新
       * @param row 为当前的数据
       * @param index 为当前更新数据的行数
       * @param done 为表单关闭函数
       *
       **/
      handleUpdate: function(row, index, done) {
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

      // 受理
      handleAccept: function(row, index) {
        this.form.recId = row.recId;
        this.form.versionNo = row.versionNo;
        this.form.acceptDesc = "";
        this.form.relOrgList = "";
        this.allSelList.clear();
        // this.form = Object.assign({}, this.form, row);

        this.readOnly = false;
        this.showAccept = true;
      },

      doHandleAccept: function() {
        let param = {
          recId : this.form.recId,
          versionNo: this.form.versionNo,
          acceptDesc: this.form.acceptDesc,
          relOrgList: this.form.relOrgList
        }
        accept(param).then(data => {
          // this.tableData.splice(index, 1, Object.assign({}, row))
          this.$message({
            showClose: true,
            message: '受理成功',
            type: 'success'
          })
          this.showAccept = false;
          this.getList(this.page)
        })
      },

      // 处理
      handleHandle: function(row, index, done) {
        this.$prompt('请维护处理内容描述', '处理描述', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'textarea',
          inputPlaceholder: "描述内容应在250个字内",
          inputValidator: (value) => {
            if (value.length > 250) {
              return "描述内容不能超过250字";
            }
          }
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          let param = {
            recId : row.recId,
            versionNo: row.versionNo,
            handleDesc: value
          }
          handle(param).then(data => {
            this.tableData.splice(index, 1, Object.assign({}, row))
            this.$message({
              showClose: true,
              message: '处理成功',
              type: 'success'
            })
            // done()
            this.getList(this.page)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },

      /**
       * @title 数据添加
       * @param row 为当前的数据
       * @param done 为表单关闭函数
       *
       **/
      handleSave: function(row, done) {
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

      /**
       * 点击搜索按钮
       */
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
        this.searchParams.alarmState = param.alarmState;
        this.searchParams.userType = param.userType;
        // this.searchParams.alarmType = param.alarmType;
        this.getList(true);
      },

      // 点击清空
      handleReset() {
        this.searchParams = {};
      },

      getCodes() {
        alarmType().then(res => {
          this.alarmTypeList = res.data.data;
        }).catch(err => {
        });
      },

      // 机构修改
      orgChange(listStr) {
        this.form.relOrgList = listStr;
      },

      showRelOrgList(relOrgList) {
        if (relOrgList) {
          this.allSelList.clear();
          // 将 relOrgList(String) 转为 allSelList(Set)，allSelList 会传给子组件
          relOrgList.substring(1, relOrgList.length - 1).split(",").forEach(id => {
            this.allSelList.add(Number(id))
          })
          this.showOrg = true;
        }
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
