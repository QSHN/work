<template>
  <div class="orgs">
    <el-dialog title="请点击选择机构" :visible.sync="show" width="980px">
      <div class="form-filter">
          <el-form :model="fd" style="width:230px;">
            <el-row :gutter="6">
              <el-col :span="40">
                <el-select v-model="fd.queryKey" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="40">
                <el-input v-model="fd.queryValue" placeholder="请输入查询内容" clearable></el-input>
              </el-col>
              <el-col :span="20">
                <el-button @click="search(true)">查询</el-button>
              </el-col>
            </el-row>
          </el-form>
      </div>
      <el-table :data="orgs" style="width: 100%" v-loading="orgLoading" highlight-current-row
                @current-change="orgSelChange">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="orgId" label="机构ID"></el-table-column>
        <el-table-column prop="orgCode" label="机构代码"></el-table-column>
        <el-table-column prop="orgName" label="机构名称"></el-table-column>
        <el-table-column prop="leader" label="负责人"></el-table-column>
      </el-table>
      <el-pagination :page-size="page.size" :total="page.total" @current-change="pageChange"></el-pagination>
      <div slot="footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click="fSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList} from '@/api/nursing/org/org'

  export default {
    name: "orgs",
    data() {
      return {
        orgs: [],
        show: false,
        orgLoading: false,
        page: {
          size: 5,
          total: 0,
          current: 1
        },
        fd: {
          current: 1,
          size: 5,
          queryKey: "",
          queryValue: "",
        },
        orgSel: {},  //已选择的机构
        options: [
          {
            value: "org_id",
            label: "机构id",
          }, {
            value: "org_code",
            label: "机构代码",
          }, {
            value: "org_name",
            label: "机构名称",
          }, {
            value: "leader",
            label: "负责人",
          }
        ]
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      // orgSel : {}
    },
    watch: {
      show(val) {
        this.orgs = [];
        this.fd.current = 1;
        if (val === false) {
          this.$emit("input", val);
        } else {
          this.search();
        }
      },
      value(val) {
        this.show = val;
      },
      orgs: {  // 列表一旦改变，则重置已选择的机构
        handler(val) {
          this.orgSel = {};
        },
        deep: true
      }
    },
    methods: {
      search(refresh) {
        if (refresh === true) this.fd.current = 1;
        this.orgLoading = true;
        fetchList(this.fd).then(res => {
          if (res.data && res.data.data) {
            this.page.total = res.data.data.total;
            this.orgs = res.data.data.records || [];
          }
          this.orgLoading = false;
        }).catch(err => {
          this.orgLoading = false;
        });
      },
      pageChange(index) {
        this.fd.current = index;
        this.search(false);
      },
      orgSelChange(e) {
        console.log(e);
        if (e) {
          this.orgSel = e;
        }
      },
      fSubmit() {
        let e = this.orgSel;
        if (e && e.orgId) {
          this.$emit("change", e);
          this.$emit("input", false);
        } else {
          this.$message.warning("请先点击选择机构");
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

</style>
