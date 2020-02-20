<template>
  <div class="execution">
    <basic-container title="服务知情书管理">
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
      >
        <template slot="menuLeft">
          <el-button v-if="permissions.service_informed_add" type="primary" @click="handleAdd" size="small">新 增</el-button>
        </template>
        <template slot-scope="scope" slot="menu">
          <!-- <el-tooltip v-if="permissions.oms_service_view" class="item" effect="dark" content="查看" placement="top">
            <el-button type="text" icon="icon-ry-chakan" plain @click="handleView(scope.row,scope.index)">
            </el-button>
          </el-tooltip> -->
          <el-tooltip v-if="permissions.service_informed_edit" class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text" icon="icon-ry-bianji" size="small" plain @click="handleEdit(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="permissions.service_informed_del" class="item" effect="dark" content="删除" placement="top">
            <el-button type="text" icon="icon-ry-shanchu" size="small" plain @click="handleDel(scope.row,scope.index)">
            </el-button>
          </el-tooltip>
        </template>
      </avue-crud>
    </basic-container>
    <!-- 新增或编辑知情通知书 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form
        :model="formData"
        class="form-content"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="知情书名称：" prop="name">
          <el-input v-model.trim="formData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="知情书内容：" porp="content" :error="contentError">
          <form-editor
            ref="editor"
            :value="formData.content"
            @input="handleFetchContent"
            @blur="handleContentBlur"
          ></form-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看知情书 -->
    <el-dialog
      title="查看知情书"
      :visible.sync="dialogDetailVisible"
    >
      <h3 class="informed-title">{{ formData.name }}</h3>
      <form-editor :value="formData.content" :detail="true"></form-editor>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj } from '@/api/nursing/service/informed'
import {tableOption} from '@/const/crud/nursing/service/informed'
import {mapGetters} from 'vuex'
import FormEditor from '@/components/form-editor/form-editor'

export default {
  name: 'informed',
  components: {
    FormEditor
  },
  data() {
    return {
      dialogStatus: '',
      textMap: {
          create: '新增知情书',
          update: '编辑知情书',
      },
      dialogVisible: false,
      dialogDetailVisible: false,
      tableData: [],
      showItem: false,
      readOnly: true,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,

      formData: {
        name: '',
        content: ''
      },
      form: {
        serviceType: 1
      },
      serviceTypeList: [],
      rules: {
        name: [
          { required: true, message: '知情书名称不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '知情书内容不能为空', trigger: 'change' }
        ],
      },
      contentError: '',
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  methods: {
    getList(page, item) {
      this.tableLoading = true
      let param = {
        current: page === true ? 1 : page.currentPage,
        size: page === true ? this.page.pageSize : page.pageSize
      }
      if (item) {
        for (let i in item) {
          param[i] = item[i]
        }
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
      this.getList(true, param);
    },
    uploadReset() {
      this.formData = {
        name: '',
        content: '',
      }
      if (this.$refs.editor) {
        this.$refs.editor.setEditorContent(this.formData.content)
      }
    },

    /**
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd() {
      this.uploadReset()
      this.dialogStatus = 'create'
      this.dialogVisible = true
    },
    handleClose() {
      this.contentError = ''
      this.$refs['formRef'].resetFields()
    },
    handleFetchContent(value) {
      this.formData.content = value
    },
    handleContentBlur(data) {
      this.contentError = ''
      if (data === '') {
        this.contentError = '知情书内容不能为空'
      }
    },
    handleView(row, index) {
      getObj(row.id).then(res => {
        let resData = res.data
        let o = resData.data
        this.formData = {
          id: o.id,
          name: o.name,
          content: o.content,
        }
        this.dialogDetailVisible = true
      })
    },
    handleEdit(row, index) {
      this.uploadReset()
      getObj(row.id).then(res => {
        let resData = res.data
        let o = resData.data
        this.formData = {
          id: o.id,
          name: o.name,
          content: o.content,
        }

        this.dialogStatus = 'update'
        this.dialogVisible = true

        if (this.$refs.editor) {
          this.$refs.editor.setEditorContent(this.formData.content)
        }
      })
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(row.id)
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

      let iconUrl = [];
      if (this.iconUploader.modify === true) {
        iconUrl = this.setIconUrl();
      } else {
        iconUrl = this.iconUploader.fileList.map(item => {
          return item.url;
        }).join(";");
      }
      row.iconUrl = iconUrl;

      // 把数组转为字符串，逗号分割
      row.specialist = row.specialist.join(",");

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
    handleSave() {
      this.$refs['formRef'].validate(valid => {
        this.handleContentBlur(this.formData.content)

        if (valid && this.contentError === '') {
          let requestMethod = addObj
          let message = '添加成功'
          if (this.dialogStatus == 'update') {
            requestMethod = putObj
            message = '修改成功'
          }

          requestMethod(this.formData).then(res => {
            this.$message({
              showClose: true,
              message: message,
              type: 'success'
            })
            this.dialogVisible = false
            this.getList(this.page)
          })
        }
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
      this.getList(true)
    },
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

  /*/deep/ .icon-hide-card .el-upload .el-upload--picture-card {*/
    /*display: none;*/
  /*}*/
  .form-content {
    padding: 20px;
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

  .custom-form {
    border: 1px dashed #aaa;
    min-height: 200px;
  }
  .informed-title {
    text-align: center;
  }
</style>
