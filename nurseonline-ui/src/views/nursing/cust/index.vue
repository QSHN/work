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
  <div class="cust">
    <basic-container title="服务对象管理">
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
                 @on-load="getList"
                 @refresh-change="refreshChange"
                 @search-change="handleFilter"
                 @search-reset="handleReset"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @row-del="rowDel"
                 fixed>
        <template slot="menuLeft">
          <!--<el-button type="primary"-->
                     <!--@click="handleAdd"-->
                     <!--size="mini">新 增-->
          <!--</el-button>-->
          <br/><br/>
        </template>
        <template slot="search">
          <el-form-item label="服务对象类型">
            <tree-select size="small" class-code="cust_type" @node-select="handleTreeSelect"/>
          </el-form-item>
          <!--<el-form-item label="服务对象类型">-->
            <!--<TreeSelect size="mini" :options="treeData" :value="searchParams.custType.value"-->
                        <!--@node-select="handleTreeSelect"/>-->
          <!--</el-form-item>-->
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
        <template slot-scope="scope" slot="menu">
          <el-tooltip content="查看" placement="bottom-end" v-if="permissions.oms_cust_view">
            <span><i class="icon-ry-chakan iconBtn" @click="handleView(scope.row,scope.index)"></i></span>
          </el-tooltip>

          <el-tooltip content="编辑" placement="bottom-end" v-if="permissions.oms_cust_edit">
            <span><i class="icon-ry-bianji iconBtn" @click="handleEdit(scope.row,scope.index)"></i></span>
          </el-tooltip>

          <el-tooltip content="删除" placement="bottom-end" v-if="permissions.oms_cust_delete">
            <span><i class="icon-ry-shanchu iconBtn" @click="handleDel(scope.row,scope.index)"></i></span>
          </el-tooltip>


          <el-dropdown trigger="hover">
            <i class="icon-ry-gengduo mainColor"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleCert(scope.row,scope.index)" v-if="permissions.oms_cust_cert_fetchlist">
                <i class="icon-ry-zizhichayan"></i>资质维护
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleDisease(scope.row,scope.index)" v-if="permissions.oms_cust_disease_fetchlist">
                <i class="icon-ry-jibingweihu"></i>疾病维护
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleTreatRec(scope.row,scope.index)" v-if="permissions.oms_cust_treatrec_fetchlist">
                <i class="icon-ry-jiuzhenjilu"></i>就诊信息
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleCustDetail(scope.row,scope.index)" v-if="permissions.oms_cust_detail_fetchlist">
                <i class="icon-ry-jiankangdangan"></i>健康档案
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </avue-crud>
      <el-dialog title="资质维护" :visible.sync="showCert" :show-close="false">
        <div class="certTable">
          <avue-crud ref="certCurd"
                     :row-class-name="getCertRowClass"
                     :cell-class-name="getCertCellClass"
                     :upload-after="afterUpload"
                     :upload-before="beforeUpload"
                     :data="certTableData"
                     :option="certOption"
                     @on-load="getCert"
                     @refresh-change="getCert"
                     @row-update="handleCertUpdate"
                     @row-save="handleCertSave"
                     @row-del="certRowDel">

            <template slot="menuLeft">
              <el-button type="primary"
                         @click="handleAddCert"
                         v-if="permissions.oms_cust_cert_add"
                         size="small">新 增
              </el-button>
              <!--v-if="permissions.nursing_cust_add"-->
              <br/><br/>
            </template>
            <template slot-scope="scope" slot="certImgPath">
              <div class="certImage" @click="showCertImgView(scope.row,scope.index)">
                <img :src="scope.row.certImgPath" style="width: 100%">
              </div>
              <div class="certDetail">
                <div v-if="scope.row.certNo!=''">
                  <el-tag size="mini" style="width:170px;overflow: hidden;">{{scope.row.certTypeName}}</el-tag>
                  <el-tag size="mini" type="info" style="width:170px;overflow: hidden;">{{scope.row.certNo}}
                  </el-tag>
                </div>
                <div v-if="scope.row.fromDate"> 生效日期 {{scope.row.fromDate}}</div>
                <div v-if="scope.row.validDate"> 有效期至 {{scope.row.validDate}}</div>
              </div>
              <div class="buttons">
                <el-button-group style="float: left;">
                  <el-button size="mini"
                             type="info"
                             icon="el-icon-search"
                             v-if="permissions.oms_cust_cert_view"
                             @click="handleShowCert(scope.row,scope.index)"></el-button>
                  <el-button size="mini"
                             type="primary"
                             icon="el-icon-edit"
                             v-if="permissions.oms_cust_cert_edit"
                             @click="handleEditCert(scope.row,scope.index)"></el-button>
                </el-button-group>
                <el-button-group style="float: right;">
                  <el-button size="mini"
                             type="danger"
                             icon="el-icon-delete"
                             v-if="permissions.oms_cust_cert_delete"
                             @click="handleDelCert(scope.row,scope.index)"></el-button>
                </el-button-group>
              </div>
            </template>
          </avue-crud>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showCert = false">关闭</el-button>
        </span>
        <el-dialog
          width="70%"
          title="查看资质"
          :visible.sync="showCertImg"
          append-to-body>
          <img :src="certImgUrl"/>
          <span slot="footer" class="dialog-footer">
          <el-button @click="showCertImg = false">关闭</el-button></span>
        </el-dialog>
      </el-dialog>
      <el-dialog title="疾病管理"
                 :visible.sync="showDisease">
        <div style="text-align: center">
          <el-transfer v-model="custDiseaseKeys"
                       v-if="showDisease"
                       style="text-align: left; display: inline-block"
                       :filterable=true
                       :titles="['疾病', '客户-疾病']"
                       :button-texts="['从客户删除', '添加到客户']"
                       :props="{key: 'diseaseId',label: 'diseaseName'}"
                       :data="baseDiseaseData"
                       @change="handlCheckChange">
          </el-transfer>
        </div>
        <span slot="footer" class="dialog-footer">
              <el-button @click="showDisease = false">取消</el-button>
              <el-button type="primary" @click="handleCustDisease()">保存</el-button>
            </span>
      </el-dialog>
      <el-dialog
        width="80%"
        title="就诊信息查询"
        :visible.sync="showTreatRec">
        <CustTreatRec v-if="showTreatRec" :currcust="currCust"/>
        <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="showTreatRec = false">关闭</el-button>
            </span>
      </el-dialog>
      <el-dialog
        title="健康档案查询"
        :visible.sync="showCustDetail">
        <CustDetail v-if="showCustDetail" :currcust="currCust"/>
        <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="showCustDetail = false">关闭</el-button>
            </span>
      </el-dialog>
      <!--</el-col>-->
      <!--</el-row>-->
    </basic-container>
  </div>
</template>

<script>
  import CustTreatRec from '@/views/nursing/cust/treatrec'
  import CustDetail from '@/views/nursing/cust/detail'
  import TreeSelect from '@/components/my/treeselect'
  import {fetchTreeByItemClassCode} from '@/api/nursing/aid/itemclass'
  import {fetchList, getObj, addObj, putObj, delObj} from '@/api/nursing/cust/cust'
  import {getCertList, addCert, putCert, delCert} from '@/api/nursing/cust/cert'
  import {getCustDisease, saveCustDisease} from '@/api/nursing/cust/disease'
  import {getBaseDisease} from '@/api/nursing/disease/disease'
  import {tableOption} from '@/const/crud/nursing/cust/cust'
  import {certOption} from '@/const/crud/nursing/cust/cert'
  import {mapGetters} from 'vuex'

  export default {
    name: 'cust',
    components: {CustTreatRec, CustDetail, TreeSelect},
    data() {
      return {
        currCust: {},
        tableData: [],
        certTableData: [],
        baseDiseaseData: [],
        custDiseaseKeys: [],
        custDiseaseData: [],
        treeData: [],
        certImgUrl: "",
        showCert: false,
        showCertImg: false,
        showDisease: false,
        showTreatRec: false,
        showCustDetail: false,
        tableLoading: false,
        tableOption: tableOption,
        certOption: certOption,
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        search: {
          key: 'cust_name', // 搜索条件的key
          value: '', // 搜索条件的值
          custType: '', // 客户类型
          custTypeName: '', // 类型名称
        },
        searchParams: {
          key: {value: 'cust_name', label: ''},
          value: {value: '', label: ''},
          custType: {value: '', label: ''},
        },
        searchKeys: {
          key: [
            {
              value: 'cust_code',
              label: '客户代码'
            }, {
              value: 'cust_name',
              label: '客户姓名'
            }, {
              value: 'phone',
              label: '联系电话'
            }, {
              value: 'address',
              label: '地址'
            }
          ]
        },
        clazzs: {
          certRow: 'certRow',
          certCell: 'certCell'
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
      }
    },
    created() {
      this.init()
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions']),
    },
    methods: {
      init() {
        // fetchTreeByItemClassCode('cust_type').then(response => {
        //   this.treeData = response.data.data
        // });
      },
      getList(page) {
        this.tableLoading = true
        let param = {
          current: page.currentPage,
          size: page.pageSize
        }
        for (let i in this.searchParams) {
          param[i] = this.searchParams[i].value
        }
        fetchList(param).then(response => {
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
        this.getList(this.page);
      },
      handleReset() {
        this.searchParams = {
          key: {value: 'cust_name', label: ''},
          value: {value: '', label: ''},
          custType: {value: '', label: ''},
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
      }
      ,
      handleView(row, index) {
        this.$refs.crud.rowView(row, index)
      }
      ,
      handleEdit(row, index) {
        this.$refs.crud.rowEdit(row, index)
      }
      ,
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      }
      ,
      rowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为' + row.custId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.custId)
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
      }
      ,
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
      }
      ,
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
      }
      ,
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList(this.page)
      }
      ,


      /**
       * 资质相关
       */
      showCertImgView(row, index) {
        this.certImgUrl = row.certImgPath;
        this.showCertImg = true;
      }
      ,
      getCertRowClass() {
        return this.clazzs.certRow
      }
      ,
      getCertCellClass() {
        return this.clazzs.certCell;
      }
      ,
      handleShowCert(row, index) {
        this.$refs.certCurd.rowView(row, index);
      }
      ,
      handleEditCert(row, index) {
        this.$refs.certCurd.rowEdit(row, index);
      }
      ,
      handleDelCert(row, index) {
        this.$refs.certCurd.rowDel(row, index)
      }
      ,
      handleAddCert: function () {
        this.$refs.certCurd.rowAdd();
      }
      ,
      getCert() {
        getCertList(Object.assign({
          custId: this.currCust.custId
        })).then(response => {
          this.certTableData = response.data.data;
        })
      }
      ,
      handleCert(row, index) {
        getCertList(Object.assign({
          custId: row.custId
        })).then(response => {
          this.currCust = row;
          this.certTableData = response.data.data;
          this.showCert = true;
        })
      }
      ,
      handleCertUpdate: function (row, index, done) {
        var params = Object.assign({}, {custId: this.currCust.custId}, row)
        putCert(params).then(data => {
          this.certTableData.splice(index, 1, Object.assign({}, row))
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
          done()
          this.getCert()
        })
      }
      ,
      handleCertSave: function (row, done) {
        var params = Object.assign({}, {custId: this.currCust.custId}, row)
        addCert(params).then(data => {
          this.certTableData.push(Object.assign({}, row))
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
          done()
          this.getCert()
        })
      }
      ,
      certRowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为' + row.custCertId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delCert(Object.assign({
            custId: _this.currCust.custId,
            custCertId: row.custCertId
          }))
        }).then(data => {
          _this.certTableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getCert()
        }).catch(function (err) {
        })
      }
      ,
      afterUpload(res, done) {
        if (!res.statusText === "OK") {
          this.$message.error('上传头像图片只能是 JPG、PNG、bmp 格式!');
        }
        done()
      }
      ,
      beforeUpload(file, done) {
        const typeArr = ['image/jpg', 'image/jpeg', 'image/png', 'image/pjpeg', 'image/bmp', 'image/x-png']
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 1;
        const typeCheck = typeArr.includes(file.type)

        if (!typeCheck) {
          this.$message.error('上传头像图片只能是 JPG、PNG、bmp 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 1MB!');
        }
        done()
      },
      /**
       * 疾病相关
       */
      handleDisease(row, index) {
        let _that = this;
        this.currCust = row;
        this.custDiseaseKeys = [];
        this.custDiseaseData = [];
        this.handleBaseDisease();
        getCustDisease(row.custId).then(response => {
          for (let index in response.data.data) {
            this.custDiseaseKeys.push(response.data.data[index]['diseaseId']);
            this.custDiseaseData.push({
              custId: this.currCust.custId,
              diseaseId: response.data.data[index]['diseaseId'],
              diseaseName: response.data.data[index]['diseaseName']
            })
          }
          this.showDisease = true;
        })
      },
      handleBaseDisease() {
        getBaseDisease().then(
          response => {
            this.baseDiseaseData = response.data.data.records;
          }
        )
      }
      ,
      handlCheckChange(obj, operate, arr) {
        this.custDiseaseData = [];
        for (let key in obj) {
          let disease = this.baseDiseaseData.filter(({diseaseId}) => diseaseId == obj[key])[0];
          this.custDiseaseData.push({
            custId: this.currCust.custId,
            diseaseId: disease.diseaseId,
            diseaseName: disease.diseaseName
          });
        }
      }
      ,
      handleCustDisease() {
        // this.custDiseaseData.forEach(function(disease){
        //   console.log(disease.custId+"--"+disease.diseaseId+"--"+disease.diseaseName);
        // })
        saveCustDisease(this.custDiseaseData).then(response => {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
          this.showDisease = false
        })
      },
      handleTreatRec(row, index) {
        this.currCust = row
        this.showTreatRec = true
      },
      handleCustDetail(row, index) {
        this.currCust = row
        this.showCustDetail = true
      },
      nodeClick(data) {
        this.page.page = 1
        this.searchParams.custType.value = data.itemId
        this.searchParams.custType.label = data.itemName
        this.getList(this.page)
      },
      handelTagClick(data) {
        this.searchParams[data] = {value: '', label: ''}
        this.getList(this.page)
      },
      handleTreeSelect(itemId) {
        this.searchParams.custType.value = itemId;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .certTable {
    table {
      display: inline-flex;
    }

    /deep/ .el-table .cell {
      height: auto;
    }

    /deep/ .certRow {
      float: left;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      width: 200px;
      margin: 10px 12px;
    }

    /deep/ .certCell {
      height: 100%;
    }

    .certImage {
      height: 150px;
      overflow: hidden;
    }

    .certDetail {
      margin: 5px;
      padding-top: 5px;
      border-top: 1px solid #eee;
      height: 105px;
      text-align: left;
      font-size: 12px;
    }

    .buttons {
      bottom: 0px;
      height: 28px;
    }

    /deep/ .el-table .cell {
      height: unset;
      line-height: unset;
      white-space: normal;
    }
  }

  .cust {
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
