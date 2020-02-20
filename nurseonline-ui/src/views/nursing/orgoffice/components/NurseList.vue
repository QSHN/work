
<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
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
        <!-- <template slot="menuLeft">
          <el-button
            type="primary"
            @click="handleAdd"
            size="small"
          >一键添加</el-button>
        </template> -->
        <template slot-scope="scope" slot="menu">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              type="text"
              size="small"
              icon="icon-ry-shanchu"
              plain
              @click="handleDel(scope.row,scope.index)"
            ></el-button>
          </el-tooltip>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { getOfficeStaff, deleteStaff } from '@/api/nursing/orgoffice/orgoffice'
import { tableOption } from '@/const/crud/nursing/orgoffice/nures'
import { mapGetters } from 'vuex'

export default {
  name: 'StaffCert',
  props: {
    currstaff: {
      type: Object,
      default: () => {}
    },
    officeId: [String, Number],
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
      searchParams: {
        certState: 0
      },

      rowSelected: [],
      showBatch: false,
      progress: 0, // 进度 0 等待， 1 进行中， 2 完成
      batchOption: 0, // 操作 1 通过 2 拒绝
      reason: ''
    }
  },
  created() {
    this.tableOption = JSON.parse(JSON.stringify(tableOption))
    this.tableOption.menu = true
  },
  mounted: function() {},
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true
      getOfficeStaff(this.officeId).then(response => {
        // 处理imgUrl
        let datas = response.data.data
        let count = response.data.data.length
        if (datas && response.data.data.total > 0) {
          for (let i = 0; i < count; i++) {
            let arr = []
            let data = datas[i]
            console.log(data.imgUrl)
            arr.push({
              // label: data.certTypeName,
              // value: data.imgUrl
              thumbUrl: data.imgUrl,
              url: data.imgUrl
            })
            data.imgUrl = arr
          }
        }
        this.tableData = response.data.data
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
    handleAdd: function() {
      if (this.rowSelected.length == 0) {
        this.$message.error('请选择要处理的记录！')
        return
      }
      let staffIds = this.rowSelected.map(item => {
        return item.staff_id
      })
      let data = {
        officeId: this.officeId,
        staffIds: staffIds
      }
      addStaffs(data).then(response => {
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        this.rowSelected = []
        this.refreshChange()
        this.$refs.crud.selectClear()
      })
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    handleDel(row, index) {
      let data = {
        officeId: this.officeId,
        staffId: row.staff_id
      }
      deleteStaff(data).then(response => {
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        this.refreshChange()
      })
    },
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
    selectionChange(list) {
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
      this.searchParams = {
        certState: 0
      }
      this.getList(this.page)
    },
    handleFinishBatch() {
      this.$refs.crud.selectClear()
      this.showBatch = false
    },
    handleClearSelected() {
      this.$refs.crud.selectClear()
    },
    openPreview(items, index) {
      // console.log(item)
      this.$ImagePreview(items, index)

      let preview = document.getElementsByClassName('avue-image-preview__box')
      let div = document.createElement('div')
      div.id = 'closeBtnDiv'
      div.innerHTML = '点击关闭'
      div.style.position = 'absolute'
      div.style.right = '20px'
      div.style.top = '20px'
      div.style.zIndex = 9999
      div.style.padding = '10px'
      div.style.borderRadius = '5px'
      div.style.background = '#ffffff'
      preview[preview.length - 1].insertBefore(div, preview.firstElementChild)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .avue-crud-search__search {
  .staffInfo {
    position: absolute;
    top: 90px;
    width: 100%;
    border-left: 5px solid #d3dce6;
    line-height: 30px;
    padding-left: 10px;

    span {
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
