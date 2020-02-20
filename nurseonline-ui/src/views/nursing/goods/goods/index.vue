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
  <div class="execution goods">
    <basic-container title="商品档案管理">
      <el-row :span="24">
        <el-col :xs="24" :sm="24" :md="3" class="cust__tree">
          <avue-tree :option="treeOption" :data="treeData" @node-click="nodeClick"></avue-tree>
        </el-col>
        <el-col :xs="24" :sm="24" :md="21" class="cust__main">
          <avue-crud ref="crud"
                     :page="page"
                     :data="tableData"
                     :table-loading="tableLoading"
                     :option="tableOption"
                     @on-load="getList"
                     @search-change="handleFilter"
                     @refresh-change="refreshChange"
                     @search-reset="handleReset"
                     @row-update="handleUpdate"
                     @row-save="handleSave"
                     @row-del="rowDel"
          >

            <!--<template slot-scope="scope" slot="imgUrl">-->
            <!--<img v-if="scope.row.imgUrl" :src="scope.row.imgUrl.split(';')[0]" class="good-img"/>-->
            <!--</template>-->

            <template slot="date">
              <el-form-item label="创建时间" size="small">
                <el-date-picker v-model="search.slot"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :clearable="false">
                </el-date-picker>
              </el-form-item>
            </template>

            <template slot="search">
              <el-form-item class="search-panel" size="small">
                <el-input clearable v-model="searchParams.queryValue" class="input-with-select" placeholder="请输入内容">
                  <el-select v-model="searchParams.queryKey" slot="prepend" placeholder="请选择">
                    <el-option v-for="item in searchKeys" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </template>

            <template slot="menuRight">
              <el-button v-if="permissions.oms_goods_add" type="primary" @click="handleAdd">新 增</el-button>
            </template>

            <template slot-scope="scope" slot="menu">
              <el-tooltip v-if="permissions.oms_goods_view" class="item" effect="dark" content="查看" placement="top">
                <el-button type="text" icon="icon-ry-chakan" plain @click="handleView(scope.row,scope.index)">
                </el-button>
              </el-tooltip>
              <el-tooltip v-if="permissions.oms_goods_edit" class="item" effect="dark" content="编辑" placement="top">
                <el-button type="text" icon="icon-ry-bianji" plain @click="handleEdit(scope.row,scope.index)">
                </el-button>
              </el-tooltip>
              <el-tooltip v-if="permissions.oms_goods_delete" class="item" effect="dark" content="删除" placement="top">
                <el-button type="text" icon="icon-ry-shanchu" plain @click="handleDel(scope.row,scope.index)">
                </el-button>
              </el-tooltip>
            </template>

            <template slot-scope="scope" slot="imgUrlForm">
              <div class="form-imgs">
                <el-upload
                  ref="upload"
                  :class="{'hide-card': (
                      readOnly ||
                      ((uploader.modify ? uploader.files.length : uploader.fileList.length) >= uploader.limit)
                  )}"
                  :file-list="uploader.fileList"
                  :action="uploader.url"
                  :headers="headers"
                  :data="uploader.data"
                  :limit="uploader.limit"
                  :disabled="readOnly"
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

          </avue-crud>
        </el-col>
      </el-row>
    </basic-container>
    <el-dialog :visible.sync="preview.show" title="图片预览">
      <div style="text-align:center;min-height:280px;"><img style="max-width:100%;" :src="preview.src" alt="商品图片预览">
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList, getObj, addObj, putObj, delObj, saveGood} from '@/api/nursing/goods/goods'
  import {tableOption} from '@/const/crud/nursing/goods/goods'
  import {fetchTreeByItemClassCode} from '@/api/nursing/aid/itemclass'
  import {mapGetters} from 'vuex'

  export default {
    name: 'goods',
    data() {
      return {
        treeData: [],
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        readOnly: true,
        search: {
          // queryKey: 'goods_name',
          // queryValue: '',
        },
        searchParams: {
          queryKey: 'goods_name'
        },
        searchKeys: [
          {
            value: 'goods_code',
            label: '商品代码'
          }, {
            value: 'goods_name',
            label: '商品名称'
          }, {
            value: 'manufacturer',
            label: '生产企业'
          }, {
            value: 'spec',
            label: '包装规格'
          }, {
            value: 'creator_name',
            label: '建档人名称'
          }
        ],
        tableLoading: false,
        tableOption: tableOption,
        form: {
          datetime: '1398250549123'//时间戳例子
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
        uploader: {
          url: "/nursing/file/upload",
          fileBaseUrl: "/nursing/file/link?url=",
          maxSize: 500,  //每张图片最多500kb
          data: {resType: "goods"},
          limit: 5,  //最大可上传图片数
          files: [],  //已上传的文件列表
          // dataFiles: [],
          fileList: [],
          modify: false  //是否修改了图片
        },
        preview: {
          src: "",
          show: false
        }
      }
    },
    created() {
      this.init();
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions', "access_token"]),
      headers() {
        let headers = {Authorization: 'Bearer ' + this.access_token};
        return headers;
      }
      // filesTemp(){
      // 	return this.uploader.files;
      // }
    },
    // watch: {
    // 	filesTemp: {
    // 		handler(val){
    // 		},
    // 		deep: true
    // 	}
    // },
    methods: {
      init() {
        fetchTreeByItemClassCode('goods_type').then(response => {
          this.treeData = [{
            id: '',
            itemId: '',
            itemName: '所有商品',
            itemCode: '',
            childNodes: response.data.data
          }]

          {// 目前props的children映射不生效（BUG），手动处理一下children字段名问题。
            let recursive = function (data) {
              if (!data.childNodes || data.childNodes.length == 0)
                return
              data.children = data.childNodes;
              for (let i = 0; i < data.childNodes.length; i++) {
                recursive(data.childNodes[i]);
              }
            }
            recursive(this.treeData[0])
          }
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
          let dt = response.data.data;
          this.tableData = dt.records;
          this.page.total = dt.total;
          this.page.currentPage = dt.current;
          this.page.pageSize = dt.size
          this.tableLoading = false;
        });
      },
      // 过滤搜索
      handleFilter(param) {
        this.page.page = 1;
        // 去除上一次搜索遗留下来的值
        if (this.searchParams.startTime || this.searchParams.endTime) {
          this.searchParams.startTime = "";
          this.searchParams.endTime = "";
        }
        if (param.createTime) {
          this.searchParams.startTime = param.createTime[0];
          this.searchParams.endTime = param.createTime[1];
        }

        // this.getList(this.page, Object.assign(param, this.search));
        this.getList(true);
      },
      // 点击节点
      nodeClick(data) {
        this.page.page = 1
        this.searchParams.goodsType = data.itemId
        // this.searchParams.goodsType.label= data.itemName
        this.getList(true)
      },
      // 点击清空
      handleReset() {
        this.searchParams = {};
        this.getList(this.page)
      },

      /**
       * @title 打开新增窗口
       * @detail 调用crud的handleadd方法即可
       *
       **/
      handleAdd: function () {
        this.uploadReset();
        this.readOnly = false;
        this.$refs.crud.rowAdd();
      },
      handleView: function (row, index) {
        this.uploadReset();
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
        this.readOnly = true;
        this.$refs.crud.rowView(row, index);
      },
      handleEdit(row, index) {
        this.uploadReset();
        // row.imgUrl = "/sldkjfskdjfksdjkfj.jpg";
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
        this.readOnly = false;
        this.$refs.crud.rowEdit(row, index)
      },
      handleDel(row, index) {
        this.$refs.crud.rowDel(row, index)
      },
      rowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为' + row.goodsId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.goodsId)
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
        // if(!canSubmit){
        // 	this.$message.warning("还有图片正在上传，请稍候");
        // 	loading = false;
        // 	return false;
        // }
        row.imgUrl = imgUrl;
        saveGood(row).then(data => {
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
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList(this.page)
      },
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
        // this.uploader.dataFiles.push(res.data);
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
        // this.uploader.dataFiles = [];
        this.uploader.fileList = [];
        this.modify = false;
      },
      uploadProgress(e) {
      },
      setImgUrl() {
        let imgUrl = this.uploader.files.map(item => {
          // if(item.status === "uploading"){
          // 	canSubmit = false;
          // }
          let res = item.response;
          let url = (res && res.code == 0 && res.data) ? res.data : item.url;
          return url;
        });
        return imgUrl.join(";");
      }
    }
  }
</script>

<style lang="scss">
  // .avue-form__group .avue-form__row:nth-child(2){
  // 	width: 100%;
  // }
</style>

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

  .good-img {
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
</style>
