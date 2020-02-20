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
  <div class="staff">
    <basic-container title="服务人员档案管理">
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
                 @row-del="rowDel">
        <template slot="search">
          <el-form-item label="状态">
            <el-select v-model="stateOptionValue" multiple placeholder="请选择" size="small" @change="handleStateChange" style="width: 250px !important;">
              <el-option-group
                v-for="group in stateOptions"
                :key="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>

          <el-form-item label="服务人员类型">
            <!--<TreeSelect size="mini" :options="staffTypes" :value="searchParams.staffType.value"-->
                        <!--@node-select="handleTreeSelect"/>-->
            <tree-select size="small" class-code="staff_type" :value="this.searchParams.staffType.value" @node-select="handleTreeSelect"/>
          </el-form-item>
          <el-form-item class="search-panel">
            <el-input v-model="searchParams.value.value"
                      class="input-with-select"
                      size="small"
                      placeholder="请输入内容">
              <el-select v-model="searchParams.key.value"
                         slot="prepend"
                         placeholder="请选择">
                <el-option v-for="item in searchKeys.key"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </template>
        <template slot="menuLeft">
          <el-button type="primary"
                     @click="handleAdd"
                     v-if="!permissions.oms_orgstaff"
                     size="small">新 增
          </el-button>
          <!--<el-tag closable-->
          <!--v-for="(value, key) in searchParams"-->
          <!--v-if="value.label!=''"-->
          <!--:key="key"-->
          <!--@close="handelTagClick(key)">-->
          <!--{{value.label}}-->
          <!--</el-tag>-->
          <br/><br/>
        </template>
        <template slot-scope="scope"
                  slot="menu">
<!--
          <el-tooltip content="积分" placement="bottom-end">
            <i class="icon-ry-jifen iconBtn" @click="handlePointRec(scope.row,scope.index)"></i>
          </el-tooltip>
          <el-tooltip content="余额" placement="bottom-end">
            <i class="icon-ry-yue iconBtn" @click="handleBalanceRec(scope.row,scope.index)"></i>
          </el-tooltip>
          <el-tooltip content="资质" placement="bottom-end">
            <i class="icon-ry-zizhichayan iconBtn" @click="handleCert(scope.row,scope.index)"></i>
          </el-tooltip>
          <el-tooltip content="技能" placement="bottom-end">
            <i class="icon-ry-jineng iconBtn" @click="handleService(scope.row,scope.index)"></i>
          </el-tooltip>
          <el-tooltip content="地址" placement="bottom-end">
            <i class="icon-ry-dizhi iconBtn" @click="handleAddress(scope.row,scope.index)"></i>
          </el-tooltip>
          <el-tooltip content="排班" placement="bottom-end">
            <i class="icon-ry-paiban iconBtn" @click="handleSchedule(scope.row,scope.index)"></i>
          </el-tooltip>
          <el-tooltip content="排班历史" placement="bottom-end">
            <i class="icon-ry-paibanlishi iconBtn" @click="handleScheduleHistory(scope.row,scope.index)"></i>
          </el-tooltip>
          <el-tooltip content="排班模板" placement="bottom-end">
            <i class="icon-ry-paibanmoban iconBtn" @click="handleScheduleOffen(scope.row,scope.index)"></i>
          </el-tooltip>
          <el-tooltip content="考核结果" placement="bottom-end">
            <i class="icon-ry-kaohejieguo iconBtn" @click="handleTestResult(scope.row,scope.index)"></i>
          </el-tooltip>
          <el-tooltip content="提现记录" placement="bottom-end">
            v-if="!permissions.oms_orgstaff"
            <i class="icon-ry-tixianjilu iconBtn" @click="handleWithdrawReq(scope.row,scope.index)"></i>
          </el-tooltip>
          <el-tooltip content="审查资质" placement="bottom-end">
            v-if="!permissions.oms_orgstaff"
            <i class="icon-ry-zizhishenhe iconBtn" @click="handleCertCheck(scope.row,scope.index)"></i>
          </el-tooltip>
-->
          <el-tooltip content="查看" placement="bottom-end" v-if="permissions.oms_staff_view || permissions.scms_orgstaff_view">
            <span>
              <i class="icon-ry-chakan iconBtn" @click="handleView(scope.row,scope.index)"></i>
            </span>
          </el-tooltip>
          <el-tooltip content="编辑" placement="bottom-end" v-if="permissions.oms_staff_edit || permissions.scms_orgstaff_edit">
            <span>
              <i class="icon-ry-bianji iconBtn" @click="handleEdit(scope.row,scope.index)"></i>
            </span>
          </el-tooltip>
          <el-tooltip content="删除" placement="bottom-end" v-if="permissions.oms_staff_delete || permissions.scms_orgstaff_delete">
            <span>
              <i class="icon-ry-shanchu iconBtn" @click="handleDel(scope.row,scope.index)"></i>
            </span>
          </el-tooltip>

          <!--<el-tooltip v-if="scope.row.staffState!=0 && (permissions.oms_staff_certcheck || permissions.scms_staff_certcheck )" content="认证审核" placement="bottom-end">-->
            <!--<i class="icon-ry-zizhishenhe iconBtn" @click="handleCertCheck(scope.row,scope.index)"></i>-->
          <!--</el-tooltip>-->
          <el-tooltip v-if="permissions.oms_staff_cert_fetchlist || permissions.scms_orgstaff_cert_fetchlist" content="资质" placement="bottom-end">
            <span><i class="icon-ry-zizhichayan iconBtn" @click="handleCert(scope.row,scope.index)"></i></span>
          </el-tooltip>
          <el-tooltip v-if="scope.row.staffState==1 && permissions.oms_staff_audit" content="审核通过" placement="bottom-end">
            <span><i class="icon-ry-tongguo iconBtn" @click="handlePass(scope.row,scope.index)"></i></span>
          </el-tooltip>
          <el-tooltip v-if="scope.row.staffState==1 && permissions.oms_staff_audit" content="审核拒绝" placement="bottom-end">
            <span><i class="icon-ry-butongguo iconBtn" @click="handleReject(scope.row,scope.index)"></i></span>
          </el-tooltip>


          <el-dropdown trigger="hover">
            <i class="icon-ry-gengduo mainColor"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handlePointRec(scope.row,scope.index)" v-if="permissions.oms_staff_pointrec_fetchlist || permissions.scms_orgstaff_pointrec_fetchlist">
                <i class="icon-ry-jifen"></i>积分
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleBalanceRec(scope.row,scope.index)" v-if="permissions.oms_staff_balance_fetchlist || permissions.scms_orgstaff_balance_fetchlist">
                <i class="icon-ry-yue"></i>余额
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleWithdrawReq(scope.row,scope.index)" v-if="permissions.oms_staff_withdrawreq_fl || permissions.scms_orgstaff_withdrawreq_fl">
                <i class="icon-ry-tixianjilu"></i>提现记录
              </el-dropdown-item>
              <!--<el-dropdown-item @click.native="handleCert(scope.row,scope.index)" v-if="permissions.oms_staff_cert_fetchlist || permissions.scms_orgstaff_cert_fetchlist" divided>-->
                <!--<i class="icon-ry-zizhichayan"></i>资质-->
              <!--</el-dropdown-item>-->
              <!--<el-dropdown-item @click.native="handleCertCheck(scope.row,scope.index)" v-if="permissions.oms_staff_certcheck || permissions.scms_orgstaff_certcheck">-->
                <!--<i class="icon-ry-zizhishenhe"></i>审查资质-->
              <!--</el-dropdown-item>-->
              <el-dropdown-item @click.native="handleService(scope.row,scope.index)" v-if="permissions.oms_staff_service_fetchlist  || permissions.scms_orgstaff_service_fetchlist" divided>
                <i class="icon-ry-jineng"></i>技能
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleSpecialist(scope.row,scope.index)" v-if="permissions.oms_staff_specialist_fl || permissions.scms_orgstaff_specialist_fl">
                <i class="icon-ry-zhuanye"></i>专业方向
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleAddress(scope.row,scope.index)" v-if="permissions.oms_staff_address || permissions.scms_orgstaff_address">
                <i class="icon-ry-dizhi"></i>地址
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleTestResult(scope.row,scope.index)" v-if="permissions.oms_staff_testresult || permissions.scms_orgstaff_testresult">
                <i class="icon-ry-kaohejieguo"></i>考核结果
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleSchedule(scope.row,scope.index)" v-if="permissions.oms_staff_schedule || permissions.scms_orgstaff_schedule" divided>
                <i class="icon-ry-paiban"></i>排班
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleScheduleHistory(scope.row,scope.index)" v-if="permissions.oms_staff_schedulehistory || permissions.scms_orgstaff_schedulehistory">
                <i class="icon-ry-paibanlishi"></i>排班历史
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleScheduleOffen(scope.row,scope.index)" v-if="permissions.oms_staff_scheduleoffen || permissions.scms_orgstaff_scheduleoffen">
                <i class="icon-ry-paibanmoban"></i>排班模板
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </template>
        <template slot-scope="props" slot="expand">
          <div class="expandInfo">
            <el-tag>积分：{{props.row.point}}</el-tag>
            <el-tag>余额：{{props.row.balance}}</el-tag>
            <el-tag>身份证号码：{{props.row.idNo}}</el-tag>
            <el-tag v-if="props.row.userId && props.row.userId!=''">
              关联用户：{{props.row.userName}}「{{props.row.userId}}」
            </el-tag>
            <el-tag v-if="props.row.checkerId && props.row.checkerId!=''">
              审核人：{{props.row.checkerName}}「{{props.row.checkerId}}」 审核时间：{{props.row.checkTime}}
            </el-tag>
            <el-tag v-if="props.row.creatorId && props.row.creatorId!=''">
              创建人：{{props.row.creatorName}}「{{props.row.creatorId}}」
            </el-tag>
            <el-tag v-if="props.row.remark && props.row.remark!=''">备注：{{props.row.remark}}</el-tag>
          </div>
        </template>
        <template slot-scope="scope" slot="isLocked">
          <i class="el-icon-close" v-if="scope.row.isLocked==0" style="color: orangered;"></i>
          <i class="el-icon-check" v-if="scope.row.isLocked==1" style="color: green;"></i>
        </template>
        <template slot-scope="scope" slot="isCertificated">
          <i class="el-icon-close" v-if="scope.row.isCertificated==0" style="color: orangered;"></i>
          <i class="el-icon-check" v-if="scope.row.isCertificated==1" style="color: green;"></i>
        </template>
        <template slot-scope="scope" slot="isExamined">
          <i class="el-icon-close" v-if="scope.row.isExamined==0" style="color: orangered;"></i>
          <i class="el-icon-check" v-if="scope.row.isExamined==1" style="color: green;"></i>
        </template>
      </avue-crud>

      <el-dialog
        width="80%"
        title="积分详情"
        :visible.sync="showPointRec">
        <StaffPointRec v-if="showPointRec" :currstaff="currStaff"/>
        <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="showPointRec = false">关闭</el-button>
            </span>
      </el-dialog>
      <el-dialog
        width="80%"
        title="余额详情"
        :visible.sync="showBalanceRec">
        <StaffBalanceRec v-if="showBalanceRec" :currstaff="currStaff"/>
        <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="showBalanceRec = false">关闭</el-button>
            </span>
      </el-dialog>
      <el-dialog
        width="80%"
        title="服务人员资质维护"
        :visible.sync="showCert">
        <StaffCert v-if="showCert" :currstaff="currStaff"/>
        <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="showCert = false">关闭</el-button>
            </span>
      </el-dialog>

      <!-- 技能维护 -->
      <StaffService ref="sService"/>

      <!-- 专业方向 -->
      <StaffSpecialist ref="sSpecialist"/>

      <el-dialog
        width="80%"
        title="地址维护"
        :visible.sync="showAddress">
        <StaffAddress v-if="showAddress" :currstaff="currStaff"/>
        <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="showAddress = false">关闭</el-button>
            </span>
      </el-dialog>
      <el-dialog
        width="760px"
        title="排班"
        :visible.sync="showSchedule">
        <StaffSchedule v-if="showSchedule" :staff-id="currStaff.staffId"/>
        <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="showSchedule = false">关闭</el-button>
            </span>
      </el-dialog>
      <el-dialog
        width="760px"
        title="排班历史"
        :visible.sync="showScheduleHistory">
        <!--<StaffScheduleHistory v-if="showScheduleHistory" :currstaff="currStaff"/>-->
        <StaffSchedule v-if="showScheduleHistory" :staff-id="currStaff.staffId" :is-history="true"/>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="showScheduleHistory = false">关闭</el-button>
          </span>
      </el-dialog>
      <el-dialog
        width="760px"
        title="排班模板"
        :visible.sync="showScheduleOffen">
        <StaffScheduleOffen v-if="showScheduleOffen" :staff-id="currStaff.staffId"/>
        <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="showScheduleOffen = false">关闭</el-button>
            </span>
      </el-dialog>
      <el-dialog
        class="hideHeader"
        width="600px"
        title="测试结果"
        :visible.sync="showTestResult">
        <TestResult v-if="showTestResult" :currstaff="currStaff"/>
        <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="showTestResult = false">关闭</el-button>
            </span>
      </el-dialog>

      <el-dialog
        width="85%"
        title="提现记录"
        :visible.sync="showWithdrawReq">
        <staffwithdrawalreq v-if="showWithdrawReq" :currstaff="currStaff"/>
        <span slot="footer" class="dialog-footer">
              <el-button type="primary" size="mini" @click="showWithdrawReq = false">关闭</el-button>
            </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import StaffCert from '@/views/nursing/staff/cert'
  import StaffService from '@/views/nursing/staff/service'
  import StaffSpecialist from '@/views/nursing/staff/specialist'
  import StaffPointRec from '@/views/nursing/staff/pointrec'
  import StaffBalanceRec from '@/views/nursing/staff/balancerec'
  import StaffAddress from '@/views/nursing/staff/address'
  import StaffSchedule from '@/views/nursing/staff/schedule'
  import StaffScheduleHistory from '@/views/nursing/staff/schedule-history'
  import StaffScheduleOffen from '@/views/nursing/staff/schedule-offen'
  import TestResult from '@/views/nursing/staff/testResult'
  import staffwithdrawalreq from '@/views/nursing/staff/staffwithdrawalreq'
  import {fetchTreeByItemClassCode} from '@/api/nursing/aid/itemclass'
  import {
    fetchList,
    fetchListOfOrg,
    getObj,
    addObj,
    putObj,
    delObj,
    certCheck,
    process
  } from '@/api/nursing/staff/staff'
  import TreeSelect from '@/components/my/treeselect'
  import {tableOption} from '@/const/crud/nursing/staff/staff'
  import {mapGetters} from 'vuex'

  export default {
    name: 'staff',
    components: {
      StaffPointRec,
      StaffBalanceRec,
      StaffCert,
      StaffService,
      StaffSpecialist,
      StaffAddress,
      StaffSchedule,
      StaffScheduleHistory,
      StaffScheduleOffen,
      TestResult,
      staffwithdrawalreq,
      TreeSelect
    },
    data() {
      return {
        tableData: [],
        currStaff: {},
        staffTypes: [],
        tableLoading: false,
        showPointRec: false,
        showBalanceRec: false,
        showCert: false,
        showAddress: false,
        showSchedule: false,
        showScheduleHistory: false,
        showScheduleOffen: false,
        showTestResult: false,
        showWithdrawReq: false,
        tableOption: tableOption,
        // value搜索的值。label显示的值
        searchParams: {
          key: {value: 'staff_name', label: ''},
          value: {value: '', label: ''},
          staffType: {value: '', label: ''},
          phone: {value: '', label: ''},
          isLocked:{value:'', label:''},
          isCertificated:{value:'', label:''},
          isExamined:{value:'', label:''},
          isOrderReceiving:{value: '', label: ''}
        },
        searchKeys: {
          key: [
            {
              value: 'staff_code',
              label: '人员代码'
            }, {
              value: 'staff_name',
              label: '人员姓名'
            }, {
              value: 'id_no',
              label: '身份证号'
            }, {
              value: 'phone',
              label: '联系手机'
            }
          ]
        },
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
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
        stateOptionValue: [],
        stateOptions: [
          {
          label: '是否禁用',
          options: [{
            value: 'isLocked',
            label: '禁用'
          }, {
            value: 'isNotLocked',
            label: '非禁用'
          }]
        },
          {
          label: '通过认证',
          options: [{
            value: 'isCertificated',
            label: '通过认证'
          }, {
            value: 'isNotCertificated',
            label: '未通过认证'
          }]
        },
          {
          label: '通过考核',
          options: [{
            value: 'isExamined',
            label: '通过考核'
          }, {
            value: 'isNotExamined',
            label: '未通过考核'
          }],
        },
          {
            label: '接单',
            options: [{
              value: 'isOrderReceiving',
              label: '可接单'
            }, {
              value: 'isNotOrderReceiving',
              label: '不可接单'
            }]
          },
        ],
        value: ''
      }
    },
    created() {
      this.init();
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      init() {
        fetchTreeByItemClassCode('staff_type').then(res => {
          this.staffTypes = res.data.data;
        });
      },
      getList(page, params) {

        let listMethod = fetchListOfOrg
        if (this.permissions.oms_staff) {
          listMethod = fetchList
        }

        this.tableLoading = true
        let param = {
          current: page.currentPage,
          size: page.pageSize
        }
        for (let i in this.searchParams) {
          param[i] = this.searchParams[i].value
          // console.log(i, this.searchParams[i].value)
        }
        listMethod(param).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.page.currentPage = response.data.data.current
          this.page.pageSize = response.data.data.size
          this.tableLoading = false
        })
      },
      handleFilter(params) {
        this.page.currentPage = 1
        this.searchParams.value.label = this.searchParams.value.value;
        this.searchParams.phone.value = params.phone
        // this.searchParams.staffType.label = params.staffType;
        // this.searchParams.staffType.value = params.staffType;
        this.getList(this.page);
      },
      handleReset() {
        this.stateOptionValue = []
        this.searchParams = {
          key: {value: 'staff_name', label: ''},
          value: {value: '', label: ''},
          staffType: {value: '', label: ''},
          phone: {value: '', label: ''},
          isLocked:{value:'', label:''},
          isCertificated:{value:'', label:''},
          isExamined:{value:'', label:''},
        };
        this.getList(this.page)
      },
      handleStateChange(values){
        // isLocked
        if(this.stateOptionValue.toString().match("Locked")){
          if (this.searchParams.isLocked.value == 1 && this.stateOptionValue.indexOf("isNotLocked") != -1){
            this.searchParams.isLocked.value = 0
            this.stateOptionValue.splice(this.stateOptionValue.indexOf("isLocked"), 1)
          }else if (this.searchParams.isLocked.value == 0 && this.stateOptionValue.indexOf("isLocked") != -1){
            this.searchParams.isLocked.value = 1
            this.stateOptionValue.splice(this.stateOptionValue.indexOf("isNotLocked"), 1)
          } else{
            this.searchParams.isLocked.value = (this.stateOptionValue.indexOf("isLocked") == -1)?0:1
          }
        }else{
          this.searchParams.isLocked.value = null;
        }

        // isCertificated
        if(this.stateOptionValue.toString().match("Certificated")){
          if (this.searchParams.isCertificated.value == 1 && this.stateOptionValue.indexOf("isNotCertificated") != -1){
            this.searchParams.isCertificated.value = 0
            this.stateOptionValue.splice(this.stateOptionValue.indexOf("isCertificated"), 1)
          }else if (this.searchParams.isCertificated.value == 0 && this.stateOptionValue.indexOf("isCertificated") != -1){
            this.searchParams.isCertificated.value = 1
            this.stateOptionValue.splice(this.stateOptionValue.indexOf("isNotCertificated"), 1)
          } else{
            this.searchParams.isCertificated.value = (this.stateOptionValue.indexOf("isCertificated") == -1)?0:1
          }
        }else{
          this.searchParams.isCertificated.value = null;
        }

        //  isExamined
        if(this.stateOptionValue.toString().match("Examined")){
          if (this.searchParams.isExamined.value == 1 && this.stateOptionValue.indexOf("isNotExamined") != -1){
            this.searchParams.isExamined.value = 0
            this.stateOptionValue.splice(this.stateOptionValue.indexOf("isExamined"), 1)
          }else if (this.searchParams.isExamined.value == 0 && this.stateOptionValue.indexOf("isExamined") != -1){
            this.searchParams.isExamined.value = 1
            this.stateOptionValue.splice(this.stateOptionValue.indexOf("isNotExamined"), 1)
          } else{
            this.searchParams.isExamined.value = (this.stateOptionValue.indexOf("isExamined") == -1)?0:1
          }
        }else{
          this.searchParams.isExamined.value = null;
        }

        //  isOrderReceiving
        if(this.stateOptionValue.toString().match("isOrderReceiving")){
          if (this.searchParams.isOrderReceiving.value == 1 && this.stateOptionValue.indexOf("isNotOrderReceiving") != -1){
            this.searchParams.isOrderReceiving.value = 0
            this.stateOptionValue.splice(this.stateOptionValue.indexOf("isOrderReceiving"), 1)
          }else if (this.searchParams.isOrderReceiving.value == 0 && this.stateOptionValue.indexOf("isOrderReceiving") != -1){
            this.searchParams.isOrderReceiving.value = 1
            this.stateOptionValue.splice(this.stateOptionValue.indexOf("isNotOrderReceiving"), 1)
          } else{
            this.searchParams.isOrderReceiving.value = (this.stateOptionValue.indexOf("isOrderReceiving") == -1)?0:1
          }
        }else{
          this.searchParams.isOrderReceiving.value = null;
        }
      },
      /**
       * @title 打开新增窗口
       * @detail 调用crud的handleadd方法即可
       *
       **/
      handleAdd: function () {
        this.$refs.crud.rowAdd()
      },
      handleView(row, index) {
        this.$refs.crud.rowView(row, index)
      },
      handleEdit(row, index) {
        this.$refs.crud.rowEdit(row, index)
      },
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      rowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为' + row.staffId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.staffId)
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
      handleUpdate: function (row, index, done, unlock) {
        putObj(row).then(data => {
          this.tableData.splice(index, 1, Object.assign({}, row))
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
          done()
          this.getList(this.page)
        }).catch(()=>{
          unlock()
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

      /**
       *
       */
      handlePointRec(row, index) {
        this.currStaff = row;
        this.showPointRec = true;
      },
      handleBalanceRec(row, index) {
        this.currStaff = row;
        this.showBalanceRec = true;
      },
      handleCert(row, index) {
        this.currStaff = row;
        this.showCert = true;
      },
      handleAddress(row, index) {
        this.currStaff = row;
        this.showAddress = true;
      },
      handleService(row, index) {
        this.$refs.sService.getList({staffId: row.staffId});
      },
      handleSpecialist(row, index) {
        this.$refs.sSpecialist.getList({staffId: row.staffId});
      },
      handleSchedule(row, index) {
        this.currStaff = row;
        this.showSchedule = true;
      },
      handleScheduleHistory(row, index) {
        this.currStaff = row;
        this.showScheduleHistory = true;
      },
      handleScheduleOffen(row, index) {
        this.currStaff = row;
        this.showScheduleOffen = true;
      },
      handleTestResult(row, index) {
        this.currStaff = row;
        this.showTestResult = true;
      },
      handleWithdrawReq(row, index) {
        this.currStaff = row;
        this.showWithdrawReq = true;
      },
      handleCertCheck(row, index) {
        let _this = this
        let params = {
          staffId: row.staffId,
        }
        this.$confirm('是否开始审查' + row.staffId + '的资质认证状态', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return certCheck(params)
        }).then(data => {
          _this.$message({
            showClose: true,
            message: '审查成功',
            type: 'success'
          })
          this.getList(this.page)
        }).catch(function (err) {
        })
      },
      handelTagClick(data) {
        this.searchParams[data] = {value: '', label: ''}
        this.getList(this.page)
      },
      /**
       * 审核通过
       * @param row
       * @param index
       */
      handlePass(row, index) {
        this.staffProcess('pass', row)
      },
      /**
       * 审核拒绝
       * @param row
       * @param index
       */
      handleReject(row, index) {
        this.staffProcess('reject', row)
      },
      staffProcess(action, row) {
        let _this = this
        let params = {
          action: action,
          staffId: row.staffId,
        }
        this.$confirm('是否确认审核ID为' + row.staffId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return process(params)
        }).then(data => {
          _this.$message({
            showClose: true,
            message: '审核成功',
            type: 'success'
          })
          row.staffState = action=='pass'?2:3
        }).catch(function (err) {
        })
      },
      handleTreeSelect(itemId) {
        this.searchParams.staffType.value = itemId;
      }
    },
    updated() {
      console.log(this.searchParams)
    }
  }
</script>

<style lang="scss" scoped>
  .expandInfo {
    .el-tag {
      margin: 0 3px;
    }
  }

  .staff {
    height: 100%;

    &__tree {
      padding-top: 3px;
      padding-right: 20px;
    }

    &__main {
      .el-card__body {
        padding-top: 0;
      }
    }
  }

  /deep/ .search-panel .el-select .el-input {
    width: 130px;
  }

  /deep/ .search-panel .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
