<template>
  <div class="execution certmag">
    <basic-container title="服务人员资质审核">
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @on-load="getList"
                 @sort-change="sortChange"
                 @size-change="sizeChange"
                 @current-change="currentChange"
                 @search-change="handleFilter"
                 @search-reset="handleReset"
                 @refresh-change="refreshChange"
                 @selection-change="selectionChange">
        <template slot-scope="scope" slot="search">
          <el-form-item label="日期过滤">
            <!--
              Avue2.0已废弃
              <avue-date-group ref="dateSelect" size="mini" @change="dateChange" default></avue-date-group>
            -->
            <el-date-picker
              v-model="searchDate"
              value-format="yyyy-MM-dd"
              size="small"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
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
        </template>
        <template slot-scope="scope" slot="menu">

          <el-tooltip content="审核" placement="bottom-end" v-if="permissions.oms_staff_cert_process">
            <span><i class="icon-ry-shenhe iconBtn" @click="handleShowDetail(scope.row,scope.index)"></i></span>
          </el-tooltip>
          <el-tooltip content="查看反馈" placement="bottom-end" v-if="permissions.oms_staff_cert_feedback">
            <span><i class="icon-ry-fankui iconBtn" @click="handleFeedback(scope.row,scope.index)"></i></span>
          </el-tooltip>

          <!--<el-button type="text" icon="el-icon-edit" size="mini" plain v-if="scope.row.certState==0"-->
                     <!--@click="handleShowView(scope.row,scope.index)">审核-->
          <!--</el-button>-->
          <!--<el-button type="text" icon="el-icon-search" size="mini" plain-->
                     <!--@click="handleFeedback(scope.row,scope.index)">查看反馈-->
          <!--</el-button>-->
        </template>
      </avue-crud>
      <!-- 反馈信息 -->
      <StaffCertFeedback ref="certFeedback"/>
    </basic-container>
    <div class="detail-view">
      <el-dialog width="65%" title="viewTitle" :visible.sync="showDetail" >
        <el-tabs value="first" type="border-card">
          <el-tab-pane label="服务人员信息" name="first">
            <avue-detail v-if="currStaff" v-model="currStaff" :option="staffDetailOption"> </avue-detail>
            <el-alert v-if="!currStaff"
                      title="服务人员信息不存在！"
                      description="请检查服务人员信息。"
                      type="error"
                      show-icon
                      :closable="false">
            </el-alert>
          </el-tab-pane>
          <el-tab-pane label="资质信息" name="second">
            <el-row>
              <el-col :span="19" class="certImg">
                <img :src="currCert.imgUrl" preview="1">
              </el-col>
              <el-col :span="5" class="certInfo">
                <avue-detail v-model="currCert" :option="certDetailOption">
                </avue-detail>
                <el-row style="margin-top: 10px;">
                  <el-col :span="24" style="text-align: center;">
                    <a :href="currCert.imgUrl" target="_blank">
                      <el-button icon="el-icon-search" size="mini" type="info">新窗口打开图片</el-button>
                    </a>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <!-- footer -->
        <template slot="footer" class="dialog-footer">
          <template v-if="currStaff && currCert.certState=='0'">
            <el-button type="danger" @click="handleReject">审核不通过</el-button>
            <el-button type="success" @click="handlePass">审核通过</el-button>
          </template>
          <template v-if="!currStaff">
            <el-button type="danger" @click="handleDelete">删除失效的资质信息</el-button>
          </template>
          <el-button @click="showDetail = false">关闭</el-button>
        </template>
      </el-dialog>
    </div>
    <div class="batch-view">
      <el-dialog :visible.sync="showBatch"
                 :close-on-click-modal="false"
                 :close-on-press-escape="false"
                 class="hideHeader"
                 width="60%">
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
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import StaffCertFeedback from '@/views/nursing/staff/certfeedback'
  import {fetchList, process, delObj} from '@/api/nursing/staff/cert'
  import {getObj as getStaff} from '@/api/nursing/staff/staff'
  import {tableOption, detailOption as certDetailOption} from '@/const/crud/nursing/staff/cert'
  import {detailOption as staffDetailOption} from '@/const/crud/nursing/staff/staff'
  import {mapGetters} from 'vuex'

  export default {
    name: "certmag",
    components: {
      moment,
      StaffCertFeedback
    },
    data() {
      return {
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        showDetail: false,
        tableData: [],
        tableOption: {},
        rowSelected: [],
        showBatch: false,
        progress: 0, // 进度 0 等待， 1 进行中， 2 完成
        batchOption: 0, // 操作 1 通过 2 拒绝
        reason: '',
        staffDetailOption: {},
        certDetailOption: certDetailOption,
        searchParams: {},
        searchDate:[],
        currCert: {},
        currStaff: {},
      }
    },
    created() {
      this.tableOption = JSON.parse(JSON.stringify(tableOption))
      this.tableOption.menuWidth = 200
      this.tableOption.column[9].hide = true  // 资质描述
      this.tableOption.selection = true

      this.staffDetailOption = JSON.parse(JSON.stringify(staffDetailOption))
      this.staffDetailOption.size = 'mini'
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      getList(page, params) {
        this.tableLoading = true
        fetchList(Object.assign(this.searchParams, {
          current: page.currentPage,
          size: page.pageSize
        }, params)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.page.currentPage = response.data.data.current
          this.page.pageSize = response.data.data.size
          this.tableLoading = false
        })
      },
      refreshChange() {
        this.getList(this.page)
      },
      sizeChange: function (pageSize) {
        this.page.pageSize = pageSize
        this.getList(this.page)
      },
      currentChange: function (page) {
        this.page.currentPage = page
        this.getList(this.page)
      },
      handleFilter(params) {
        this.searchParams = Object.assign({},{
          startTime:this.searchDate[0],
          endTime:this.searchDate[1]
        })
        this.page.currentPage = 1
        this.getList(this.page, params)
      },
      handleReset() {
        // 清空日期选择器
        // this.$refs.dateSelect.$data.datetime=[]
        this.searchDate=[]
        this.searchParams = {}
        this.getList(this.page)
      },
      dateChange(value) {
        let today = moment().format("YYYY-MM-DD")
        let yesterday = moment().subtract(1, "days").format("YYYY-MM-DD")
        let _7dayago = moment().subtract(7, "days").format("YYYY-MM-DD")
        let dates = value.split(',')
        if (dates.length == 1) {
          this.searchParams.startTime = dates[0]
          if (dates[0] == today) {
            // 今天
            this.searchParams.endTime = dates[0]
          } else if (dates[0] == yesterday) {
            // 昨天
            this.searchParams.endTime = dates[0]
          } else if (dates[0] == _7dayago) {
            // 7天内
            this.searchParams.endTime = today
          } else if (dates[0] == -1) {
            this.searchParams.startTime = ''
            this.searchParams.endTime = ''
          }
        } else if (dates.length == 2) {
          this.searchParams.startTime = dates[0]
          this.searchParams.endTime = dates[1]
        } else {
          this.searchParams.startTime = ''
          this.searchParams.endTime = ''
        }
        // this.getList(this.page)
      },
      sortChange(value) {
        // UI控件与SQL相反
        if (value.order == 'descending') {
          this.searchParams.dateSequence = 'asc'
        } else {
          this.searchParams.dateSequence = 'desc'
        }
        this.getList(this.page)
      },
      selectionChange(list){
        this.rowSelected = list
      },

      /**
       * ------------- ===================资质证明审核反馈======================= ----------------
       */

      handleFeedback(row, index) {
        this.$refs.certFeedback.getList({staffCertId: row.staffCertId});
      },
      /**
       * ------------- ===================审核窗口相关======================= ----------------
       */
      handleShowDetail(row, index) {
        this.showDetail = true
        this.currCert = row
        this.getStaff(row.staffId)
      },
      getStaff(staffId) {
        this.currStaff = {}
        getStaff(staffId).then(response => {
          this.currStaff = response.data.data
        })
      },
      handlePass() {
        let _this = this
        let params = {
          action: 'pass',
          staffId: this.currCert.staffId,
          staffCertId: this.currCert.staffCertId,
          reason: '审核通过。',
        }

        this.$confirm('是否确认资质审核通过？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return process(params)
        }).then(() => {
          _this.$message({
            showClose: true,
            message: '审核成功',
            type: 'success'
          })
          _this.currCert.certState = 1
          _this.showDetail=false
        }).catch(function (err) {
        })
      },
      handleReject() {
        let _this = this
        let params = {
          action: 'reject',
          staffId: this.currCert.staffId,
          staffCertId: this.currCert.staffCertId,
          reason: '',
        }
        this.$prompt('是否审核不通过？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showInput: true,
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
          _this.currCert.certState = 2
          _this.showDetail=false
        }).catch(function (err) {
        })
      },
      handleDelete(){
        let _this = this
        let params = {
          staffId: this.currCert.staffId,
          staffCertId: this.currCert.staffCertId
        }

        this.$confirm('是否确认删除该资质？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(params)
        }).then(() => {
          _this.showDetail=false
          // this.getList(this.page)
          _this.$message({
            showClose: true,
            message: '删除成功',
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
      }
    }
  }
</script>

<style lang="scss">
  .certmag {
    .avue-crud {
      .avue-crud__tip {
        display: none;
      }

      .avue-crud__menu {
        width: auto;
      }

      .el-input__inner, .avue-form .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
    }
    .batch-view{

    }

    .detail-view {
      .el-dialog__header {
        display: none !important;
      }

      .certInfo {
        background-color: #f9fafc;
        height: 550px;

        .avue-detail {
          padding-top: 0px;

          .avue-group__item {
            padding: 3px 10px;
            margin: 0;

            .el-col-md-8 {
              width: 100% !important;
              margin-bottom: 0;

              .avue-detail__box {
                min-height: unset;
                line-height: unset;

                .avue-detail__label {
                  min-width: unset;
                  line-height: 30px;
                }
              }
            }
          }
        }
      }

      .certImg {
        text-align: center;
        height: 550px;
        overflow-y: scroll;

        img {
          width: 100%;
        }
      }
    }

    .btn-group{
      margin-top: 50px;
      text-align: center;
      /*display: flex;*/

      .reason{
        margin-top: 5px;
        margin-bottom: 5px;
        text-align: center;

        span{
          width: 20%;
        }
        .el-input{
          width: 80%;
        }
      }


    }
  }
</style>
