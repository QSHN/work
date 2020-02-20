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
          <el-form-item class="search-panel" label="服务类别">
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

        <template slot="serviceTypeForm" slot-scope="scope">
          <el-select v-model="form.serviceType" filterable placeholder="请选择">
            <template v-for="item in scope.dic">
              <el-option v-if="item.itemId != -1" :label="item.itemName" :value="item.itemId"
                         :key="item.itemId"></el-option>
            </template>
          </el-select>
        </template>

        <template slot="menuLeft">
          <br/><br/>
        </template>

        <template slot-scope="scope" slot="menu">
          <!--<el-tooltip class="item" effect="dark" content="编辑" placement="top">-->
          <el-button type="text" icon="el-icon-check" size="small" plain @click="handleEdit(scope.row,scope.index)">编辑
          </el-button>
          <!--</el-tooltip>-->
          <el-button type="text" icon="el-icon-delete" size="small" plain @click="handleDel(scope.row,scope.index)">删除
          </el-button>
          <el-button type="text"
                     icon="el-icon-check"
                     size="small"
                     plain
                     @click="handleItem(scope.row,scope.index)">适用疾病
          </el-button>

        </template>

        <!-- 列表页面表格里面显示图片，对应字段定义里的 imgUrl字段的属性 slot: true -->
        <!--<template slot-scope="scope" slot="imgUrl">-->
          <!--<img v-if="scope.row.imgUrl" :src="scope.row.imgUrl.split(';')[0]" class="service-img"/>-->
        <!--</template>-->

        <!-- 新增和编辑页面中图片插件，对应 imgUrl字段的属性 formslot: true, -->
        <template slot-scope="scope" slot="imgUrlForm">
          <div class="form-imgs">
            <el-upload
              ref="upload"
              :class="{'hide-card': ((uploader.modify ? uploader.files.length : uploader.fileList.length) >= uploader.limit)}"
              :file-list="uploader.fileList"
              :action="uploader.url"
              :headers="headers"
              :data="uploader.data"
              :limit="uploader.limit"
              list-type="picture-card"
              :before-upload="beforeUpload"
              :before-remove="beforeRemove"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              :on-progress="uploadProgress"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="grey">提示：最多可上传{{uploader.limit}}张图片，每张大小不超过{{uploader.maxSize}}kb。第一张图片将设为商品主图。</div>
          </div>
        </template>

        <!-- 新增和编辑页面中图片插件中，可以点击图片上的放大镜预览对话框 -->
        <el-dialog :visible.sync="preview.show" title="图片预览">
          <div style="text-align:center;min-height:280px;"><img style="max-width:100%;" :src="preview.src" alt="商品图片预览">
          </div>
        </el-dialog>

        <el-dialog
          width="90%"
          title="适用疾病"
          :visible.sync="showItem">
          <disease v-if="showItem" :currService="currService"/>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="showItem = false">关闭</el-button>
          </span>
        </el-dialog>

      </avue-crud>
    </basic-container>
    <div class="footer">
      <el-button type="primary"
                 @click="handleSelectService"
                 size="small">
        确认
      </el-button>
      <el-button @click="closePage"
                 size="small">
        取消
      </el-button>
      <el-button @click="deleteSelete"
                 size="small">
        不选择服务
      </el-button>
    </div>
  </div>
</template>

<script>
  import disease from '@/views/nursing/service/disease/index'
  import {fetchList, getObj, addObj, putObj, delObj, serviceType, saveService} from '@/api/nursing/service/service'
  import {tableOption} from '@/const/crud/nursing/service/service'
  import {mapGetters} from 'vuex'

  export default {
    name: 'service',
    components: {
      disease
    },
    props: {
      showService: {
        type: Boolean,
        default: () => {
        }
      }
    },
    data() {
      return {
        tableData: [],
        showItem: false,
        serviceSelect: {},
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption,

        uploader: {
          url: "/nursing/file/upload",
          fileBaseUrl: "/nursing/file/link?url=",
          maxSize: 500,  //每张图片最多500kb
          data: {resType: "service"},
          limit: 1,  //最大可上传图片数
          files: {},  //已上传的文件列表
          fileList: [],
          modify: false  //是否修改了图片
        },
        preview: {
          src: "",
          show: false
        },

        search: {
          queryKey: 'service_name',
          queryValue: ''
        },
        searchParams: {},
        searchKeys: [
          {
            value: 'service_code',
            label: '服务代码'
          }, {
            value: 'service_name',
            label: '服务名称'
          }
        ],
        form: {
          serviceType: 1
        },
        serviceTypeList: []
      }
    },
    created() {
      this.tableOption = Object.assign({}, tableOption, {
        menu: false,
        highlightCurrentRow: true
      })
    },
    mounted: function () {
      this.getCodes();
    },
    computed: {
      ...mapGetters(['permissions', "access_token"]),
      /* 用于图片插件上传时使用token */
      headers() {
        let headers = {Authorization: 'Bearer ' + this.access_token};
        return headers;
      }
    },
    methods: {
      getCodes() {
        serviceType().then(res => {
          this.serviceTypeList = res.data.data;
        }).catch(err => {
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
        });
      },

      /* 搜索栏 */
      handleFilter(param) {
        this.getList(true);
      },

      /**
       * @title 打开新增窗口
       * @detail 调用crud的handleadd方法即可
       *
       **/
      handleAdd: function () {
        this.uploadReset();   // 必须加这个，不然第二次打开数据还在，插件无法正常使用
        this.$refs.crud.rowAdd()
      },
      handleEdit(row, index) {
        this.uploadReset();   // 必须加这个，不然第二次打开数据还在，插件无法正常使用
        if (row.imgUrl) {
          let list = row.imgUrl.split(";").map(item => {
            let imgItem = item.split("?")[0];
            imgItem = imgItem ? imgItem.split("/") : [];
            let name = imgItem[imgItem.length - 1];
            let url = item;
            // let source = item;  //保存原url
            return {name, url};
          });
          this.uploader.fileList = list;
        }
        this.$refs.crud.rowEdit(row, index)
      },
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      rowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为' + row.serviceId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.serviceId)
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
      handleUpdate: function (row, index, done, loading) {
        let imgUrl = [];
        if (this.uploader.modify === true) {
          imgUrl = this.setImgUrl();
        } else {
          imgUrl = this.uploader.fileList.map(item => {
            return item.url;
          }).join(";");
        }
        row.imgUrl = imgUrl;
        saveService(row).then(data => {
          this.tableData.splice(index, 1, Object.assign({}, row))
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
          done();
          this.getList(this.page);
        });
      },
      /**
       * @title 数据添加
       * @param row 为当前的数据
       * @param done 为表单关闭函数
       *
       **/
      handleSave: function (row, done) {
        row.imgUrl = this.setImgUrl();
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
      // 点击清空
      handleReset() {
        this.searchParams = {};
        // this.getList(this.page)
      },
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList(this.page)
      },
      /**
       * 适用疾病
       */
      handleItem(row, index) {
        this.currService = row;
        this.showItem = true;
      },

      // 上传前：校验图片，赋值上传插件中上传对象（this.$refs.upload.uploadFiles）给 this.uploader.files
      // * 之后上传完成时，会回写上传请求的 response 到这个上传对象中，也就能获取到在 minio 文件系统中的文件名
      beforeUpload(file) {
        this.uploader.modify = true;
        let maxSize = this.uploader.maxSize;
        if (file.size > maxSize * 1024) {
          this.$message.warning("图片大小不可超过" + maxSize + "kb");
          return false;
        }
        this.uploader.files = this.$refs.upload.uploadFiles;
      },
      uploadSuccess(res) {
        this.uploader.modify = true;
      },
      uploadError(err) {
        this.$message.error("上传失败，请重试");
      },
      beforeRemove(file, files) {
        this.uploader.modify = true;
        return true;
      },
      uploadPreview(file) {
        this.preview = {
          src: file.url,
          show: true
        };
      },
      uploadReset() {
        this.uploader.files = [];
        this.uploader.fileList = [];
        this.modify = false;
      },
      uploadProgress(e) {
      },
      setImgUrl() {
        let imgUrl = this.uploader.files.map(item => {
          let res = item.response;
          let url = (res && res.code == 0 && res.data) ? res.data : item.url;
          return url;
        });
        return imgUrl.join(";");
      },

      // 行单击
      handleRowClick(e) {
        if(e){
          this.serviceSelect = e;
        }
      },

      // 关闭页面
      closePage() {
        this.$emit("input", false);
      },

      // 确定提交选择的商品
      handleSelectService() {
        let e = this.serviceSelect;
        if (e && e.serviceId) {
          this.$emit("change", e);
          this.$emit("input", false);
        } else {
          this.$message.warning("请先点击选择服务");
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

  /deep/ .hide-card .el-upload--picture-card {
    display: none;
  }

  $imgS: 70px;
  /deep/ .el-upload--picture-card,
  /deep/ .el-upload-list__item {
    width: $imgS;
    height: $imgS;
    line-height: $imgS;
  }

  .service-img {
    max-width: $imgS;
    max-height: $imgS;
  }

  /deep/ .el-upload-list--picture-card .el-upload-list__item-status-label i {
    position: absolute;
    left: 15px;
  }

  .grey {
    color: #AAA;
    font-size: 12px;
  }
  .footer{
    width: 98%;
    text-align: right;
  }

</style>
