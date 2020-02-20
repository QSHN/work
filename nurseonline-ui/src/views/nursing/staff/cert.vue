
<template>
  <div class="execution">
    <basic-container>
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
                 @selection-change="selectionChange">
                 @row-del="rowDel">

        <template slot="imgUrl" slot-scope="scope">
          <el-button @click="openPreview(scope.row.imgUrl, 0)">查看资质图片</el-button>
          <!--<img v-for="(item, index) of scope.row.imgUrl" :src="item.thumbUrl" @click="openPreview(scope.row.imgUrl, index)">-->
        </template>

        <template slot="search">
          <div class="staffInfo">
              <span>{{currstaff.staffName}}</span>
              <span>{{currstaff.sex==1?'男':currstaff.sex==2?'女':'未知'}}</span>
              <span>{{currstaff.idNo}}</span>
              <span>{{currstaff.jobOrg}}</span>
          </div>
        </template>

        <template slot="menuLeft">
          <el-button type="primary"
                     @click="showBatch = true;batchOption = 1;progress = 0"
                     size="small"
                     v-if="permissions.oms_staff_cert_process">一键审核通过
          </el-button>
          <el-button type="danger"
                     @click="showBatch = true;batchOption = 2;progress = 0"
                     size="small"
                     v-if="permissions.oms_staff_cert_process">一键审核不通过
          </el-button>
          <el-button type="primary"
                     size="mini"
                     @click="handleCertCheck"
                     plain
                     v-if="currstaff.staffState!=0 && (permissions.oms_staff_certcheck || permissions.scms_staff_certcheck )">认证审核
          </el-button>
        </template>

        <template slot-scope="scope" slot="menu">
          <el-button type="text"
                     icon="el-icon-check"
                     size="small"
                     plain
                     v-if="scope.row.certState==0"
                     @click="handlePass(scope.row,scope.index)">审核通过
          </el-button>
          <el-button type="text"
                     icon="el-icon-close"
                     size="small"
                     plain
                     v-if="scope.row.certState==0"
                     @click="handleReject(scope.row,scope.index)">审核不通过
          </el-button>
        </template>
      </avue-crud>

      <el-dialog :visible.sync="showBatch"
                 :close-on-click-modal="false"
                 :close-on-press-escape="false"
                 class="hideHeader"
                 width="60%"
                 append-to-body>
        <div class="batch-view">
          <el-table :data="rowSelected" empty-text="请先选择要处理的数据！">
            <el-table-column prop="staffName" label="人员名称" width="180px">
            </el-table-column>
            <el-table-column prop="certTypeName" label="资质类型" width="180px">
            </el-table-column>
            <el-table-column prop="certNo" label="材料号码" width="220px">
            </el-table-column>
            <el-table-column prop="progress" label="进度" width="120px">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.progress==1" type="info" size="mini" ><i class="el-icon-loading"></i>进 行 中</el-tag>
                <el-tag v-else-if="scope.row.progress==2" type="success" size="mini">完 成</el-tag>
                <el-tag v-else-if="scope.row.progress==3" type="warning" size="mini">错 误</el-tag>
                <el-tag v-else size="mini">等 待</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="error" label="错误信息">
            </el-table-column>
          </el-table>

          <div class="btn-group">
            <template v-if="progress!=2">
              <div class="reason el-alert el-alert--error is-light"  v-if="batchOption==2">
                <span>反馈信息：</span>
                <el-input type="textarea"
                          placeholder="请输入反馈信息"
                          v-model="reason"
                          maxlength="128"
                          :disabled="progress==1"
                          show-word-limit>
                </el-input>
              </div>

              <el-button size="small" :disabled="progress==1" type="primary" @click="handleBatch">开始审核</el-button>
              <el-button size="small" :disabled="progress==1" @click="showBatch=false">取 消</el-button>
              <el-button size="small" :disabled="progress==1" @click="handleClearSelected">清 空</el-button>
            </template>
            <template v-else>
              <el-button size="small" @click="handleFinishBatch">完 成</el-button>
            </template>
          </div>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import {certCheck} from '@/api/nursing/staff/staff'
  import {fetchList, getObj, addObj, putObj, delObj, process} from '@/api/nursing/staff/cert'
  import {tableOption} from '@/const/crud/nursing/staff/cert'
  import {mapGetters} from 'vuex'

  export default {
    name: 'StaffCert',
    props: {
      currstaff: {
        type: Object,
        default: () => {
        }
      }
    },
    data() {
      return {
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption,
        searchParams:{
          certState: 0,
        },

        rowSelected: [],
        showBatch: false,
        progress: 0, // 进度 0 等待， 1 进行中， 2 完成
        batchOption: 0, // 操作 1 通过 2 拒绝
        reason: '',
      }
    },
    created() {
      this.tableOption = JSON.parse(JSON.stringify(tableOption))
      this.tableOption.menu = false
      this.tableOption.column[2].search = false // 人员名称
      this.tableOption.column[1].hide = true // 资质类别
      this.tableOption.column[4].hide = true // 资质名称
      this.tableOption.column[9].hide = true // 资质描述

      this.tableOption.selection = true
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      getList(page, params) {
        this.tableLoading = true
        fetchList(Object.assign({
          current: page.currentPage,
          size: page.pageSize,
          staffId: this.currstaff.staffId
        }, params, this.searchParams)).then(response => {
          // 处理imgUrl
          let datas = response.data.data.records
          let count = response.data.data.records.length
          if (datas && response.data.data.total > 0) {
            for (let i = 0; i < count; i++) {
              let arr = []
              let data = datas[i]
              console.log(data.imgUrl)
              arr.push({
                // label: data.certTypeName,
                // value: data.imgUrl
                thumbUrl: data.imgUrl,
                url: data.imgUrl,
              })
              data.imgUrl = arr
            }
          }
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
        this.$confirm('是否确认删除ID为' + row.staffCertId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.staffCertId)
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
      selectionChange(list){
        this.rowSelected = list
      },
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList(this.page)
      },
      handleFilter(params) {
        this.searchParams = Object.assign({}, params)
        this.page.currentPage = 1
        this.getList(this.page, params)
      },
      handleReset() {
        this.searchParams={
          certState:0,
        }
        this.getList(this.page)
      },

      handlePass(row, index) {
        const action = 'pass'
        let staffId = this.currstaff.staffId
        let staffCertId = row.staffCertId
        this.processCert(staffId, staffCertId, action)
      },
      handleReject(row, index) {
        const action = 'reject'
        let staffId = this.currstaff.staffId
        let staffCertId = row.staffCertId
        this.processCert(staffId, staffCertId, action)
      },
      processCert(staffId, staffCertId, action) {
        let _this = this
        let questions = {pass: '是否审核通过？', reject: '是否审核不通过？'}
        let params = {
          action: action,
          staffId: staffId,
          staffCertId: staffCertId,
          reason: '',
        }

        this.$prompt(questions[action], '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showInput: action==='reject',
          type: 'warning',
          inputPlaceholder:'请填写原因',
          inputPattern: /.+/,
          inputErrorMessage: '请填写原因'
        }).then(({ value }) => {
          params.reason = value
          return process(params)
        }).then(() => {
          _this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          })
          _this.getList(this.page)
        })
      },
      handleCertCheck(){
        let staffId = this.currstaff.staffId
        let _this = this
        let params = {
          staffId: staffId,
        }
        this.$confirm('是否开始审查' + staffId + '的资质认证状态', '提示', {
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
        }).catch(function (err) {
        })
      },
      async handleBatch(){
        if(this.rowSelected.length==0){
          this.$message.error("请选择要处理的记录！")
          return;
        }

        if(this.batchOption===2 && (!this.reason || this.reason=='')){
          this.$message.error("反馈信息不能为空！")
          return;
        }

        let _this = this
        let success = 0;
        let failure = 0;
        this.progress = 1; // 进行中
        for(let index in this.rowSelected){
          // 开始
          this.$set(this.rowSelected[index],'progress', 1);

          let params = {
            action: this.batchOption==1?'pass':'reject',
            staffId: this.rowSelected[index].staffId,
            staffCertId: this.rowSelected[index].staffCertId,
            reason: this.reason,
          }
          // 不是待审的记录
          if(this.rowSelected[index].certState!=0){
            _this.$set(_this.rowSelected[index],'error', "不是“待审”状态的记录！");
            _this.$set(_this.rowSelected[index],'progress', 3);
            failure++;
            continue;
          }

          await process(params).then(()=>{
            // 完成
            _this.$set(_this.rowSelected[index],'progress', 2);
            success++;
          }).catch( err =>{
            // 失败
            _this.$set(_this.rowSelected[index],'error', err.toString());
            _this.$set(_this.rowSelected[index],'progress', 3);
            failure++;
          })
        }
        this.progress = 2 // 完成
        this.getList(this.page)
        this.$message("提交完成，成功"+success+"条，失败"+failure+"条。")
      },
      handleFinishBatch(){
        this.$refs.crud.selectClear()
        this.showBatch=false
      },
      handleClearSelected(){
        this.$refs.crud.selectClear()
      },
      openPreview(items, index){
        // console.log(item)
        this.$ImagePreview(items, index);

        let preview = document.getElementsByClassName('avue-image-preview__box')
        let div = document.createElement("div")
        div.id ="closeBtnDiv"
        div.innerHTML = '点击关闭'
        div.style.position = 'absolute';
        div.style.right = '20px';
        div.style.top = '20px';
        div.style.zIndex = 9999;
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.style.background = '#ffffff';
        preview[preview.length-1].insertBefore(div, preview.firstElementChild)
      }
    }
  }
</script>

<style lang="scss" scoped>

  /deep/ .avue-crud-search__search{
    margin-top: 50px;

    .staffInfo{
      position: absolute;
      top: 90px;
      width: 100%;
      border-left: 5px solid #d3dce6;
      line-height: 30px;
      padding-left: 10px;

      span{
        padding-right: 20px;
      }
    }

  }

  /deep/ .avue-crud__menu {
    right: 35px;
    top: 16px !important;
    width: auto;
  }

  /deep/ .batch-view {
    .btn-group {
      margin-top: 50px;
      text-align: center;
      /*display: flex;*/

      .reason {
        margin-top: 5px;
        margin-bottom: 5px;
        text-align: center;

        span {
          width: 20%;
        }

        .el-input {
          width: 80%;
        }
      }
    }
  }
</style>
