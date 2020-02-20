<template>
  <div class="custs">
    <el-dialog title="请点击选择客户" :visible.sync="show" width="980px">
      <div class="form-filter">
        <el-form :model="fd" inline>

          <el-form-item class="search-panel">
            <el-input v-model="fd.value"
                      class="input-with-select"
                      size="small"
                      placeholder="请输入内容">
              <el-select v-model="fd.key"
                         slot="prepend"
                         placeholder="请选择">
                <el-option v-for="item in searchKeys"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-button @click="query(true)">查询</el-button>
        </el-form>
      </div>
      <el-table :data="custs" style="width: 100%" v-loading="custLoading" highlight-current-row
                @current-change="custSelChange">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="custId" label="客户ID" width="70"></el-table-column>
        <el-table-column prop="custCode" label="客户代码" width="120"></el-table-column>
        <el-table-column prop="custName" label="姓名" width="70"></el-table-column>
        <el-table-column prop="age" label="年龄" width="60"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="140"></el-table-column>
        <el-table-column prop="sex" label="性别" width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == 0">未知</span>
            <span v-else-if="scope.row.sex == 1">男</span>
            <span v-else-if="scope.row.sex == 2">女</span>
            <span v-else-if="scope.row.sex == 3">保密</span>
          </template>
        </el-table-column>
        <el-table-column prop="idNo" label="身份证号" width="150"></el-table-column>
        <el-table-column prop="linkman" label="联系人" width="80"></el-table-column>
      </el-table>
      <el-pagination :page-size="page.size" :total="page.total" @current-change="pageChange"></el-pagination>
      <div slot="footer">
        <el-button @click="show = false;">取消</el-button>
        <el-button type="primary" @click="fSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {currentCusts} from '@/api/nursing/vip/ltci/vipltciform'

  export default {
    name: "custs",
    data() {
      return {
        custs: [],
        show: false,
        custLoading: false,
        search: {
          key: '',
          value: '',
        },
        page: {
          size: 5,
          total: 0,
          current: 1
        },
        fd: {
          current: 1,
          size: 5,
          custType: "",
          key: "",
          value: "",
        },
        total : 0,
        custSel: {},  //已选择的客户
        searchKeys: [
          {
            value: 'cust_code',
            label: '客户代码'
          }, {
            value: 'cust_name',
            label: '客户姓名'
          }, {
            value: 'id_no',
            label: '身份证号'
          }, {
            value: 'phone',
            label: '联系电话'
          }
        ],
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      show(val) {
        this.custs = [];
        if (val === false) {
          this.$emit("input", val);
        } else {
          this.query();
        }
      },
      value(val) {
        this.show = val;
      },
      custs: {  // 列表一旦改变，则重置已选择的人
        handler(val) {
          this.custSel = {};
        },
        deep: true
      }
    },
    methods: {
      query(refresh) {
        if (refresh === true) this.fd.current = 1;
        this.custLoading = true;
        currentCusts(this.fd).then(res => {
          if (res.data && res.data.data) {
            this.total = res.data.data.total;
            this.custs = res.data.data.records || [];
          }
          this.custLoading = false;
        }).catch(err => {
          this.custLoading = false;
        });
      },
      pageChange(index) {
        this.fd.current = index;
        //判断总数据量是否足够显示到目标页数，能够显示才刷新
        this.search(false);
      },
      fSubmit() {
        let e = this.custSel;
        if (e && e.custId) {
          this.$emit("change", e);
          this.$emit("input", false);
        } else {
          this.$message.warning("请先点击选择会员");
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
