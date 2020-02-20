<template>
  <div class="bills">
    <el-dialog title="卖家机构的商品列表" :visible.sync="show" width="1100px">

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

      <el-table ref="goodsSelection" :data="list" style="width: 100%" v-loading="tableLoading" highlight-current-row
                @selection-change="colSelChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="orgGoodsId" label="商品id" width="80"></el-table-column>
        <el-table-column prop="orgGoodsCode" label="商品代码" width="140"></el-table-column>
        <el-table-column prop="goodsLabel" label="商品标签" width="240"></el-table-column>
        <el-table-column prop="spec" label="规格" width="120"></el-table-column>
        <el-table-column prop="unit" label="计价单位" width="80"></el-table-column>
        <el-table-column prop="price" label="价格" width="80"></el-table-column>
        <el-table-column prop="comboFlag" label="是否套餐" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.comboFlag == 0">否</span>
            <span v-else-if="scope.row.comboFlag == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column prop="qty" label="数量">
          <template slot-scope="scope">
            <el-input-number v-model="nums[scope.$index]" @change="qtyChange" :min="1" size="mini"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :page-size="page.size" :current-page="fd.current" :total="page.total"
                     @current-change="pageChange"></el-pagination>
      <div slot="footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click="fSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {orgGoodsListByOrgId} from '@/api/nursing/stock/stockbill'

  export default {
    name: "items",
    data() {
      return {
        nums :[1,1,1,1,1],
        list: [],
        show: false,
        tableLoading: false,
        selList: [],  //当前选择的订单
        // allSelList: new Map(),  //历史选择的订单
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
        options: [
          {
            value: "org_goods_id",
            label: "商品id",
          }, {
            value: "org_goods_code",
            label: "商品代码",
          }, {
            value: "goods_label",
            label: "商品标签",
          }
        ]
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      sellOrgId: [Number, String],
      allSelList : Map
      // allSelList: new Map(),  //历史选择的订单
    },
    watch: {
      show(val) {
        this.list = [];
        this.fd.current = 1;
        if (val === false) {
          this.$emit("input", val);
        } else {
          this.search();
        }
        console.log(val)
      },
      value(val) {
        this.show = val;
      },
      list: {  // 列表一旦改变，则重置已选择的订单列表
        handler(val) {
          // this.selList = [];
        },
        deep: true
      },
    },
    mounted() {
    },
    methods: {
      search(refresh) {
        if (refresh === true) this.fd.current = 1;
        this.tableLoading = true;
        orgGoodsListByOrgId(this.fd, this.sellOrgId).then(res => {

          //在选择历史中删除被取消的按钮，就算本来就没被选中也没关系，一样删
          let selIds = this.selList.map(i => i.orgGoodsId);
          //删除没被选中的
          this.list.forEach(item => {
            if (!selIds.includes(item.orgGoodsId)) {
              this.allSelList.delete(item.orgGoodsId);
            }
          });

          // 每次切换数据都保存已选择的选项
          if (this.selList && this.selList.length) {
            for (let i = 0; i < this.list.length; i++) {
              if (this.selList.includes(this.list[i])) {
                this.allSelList.set(this.list[i].orgGoodsId, this.nums[i]);
              }
            }
            // this.selList.map(m => m.orgGoodsId).forEach(id => this.allSelList.add(id));
          }

          if (res.data && res.data.data) {
            this.page.total = res.data.data.total;

            this.list = res.data.data.records || [];

            //判断当前页面的所有数据，如果存在选择历史的话就默认选中
            setTimeout(() => {
              //放延迟外面值不会刷新
              for (let i = 0; i < this.list.length; i++) {
                if (this.allSelList.has(this.list[i].orgGoodsId)) {
                  this.$refs.goodsSelection.toggleRowSelection(this.list[i]);
                  this.nums[i] = this.allSelList.get(this.list[i].orgGoodsId);
                }
              }
            }, 1);
            //放延迟里面值不会刷新
            for (let i = 0; i < this.list.length; i++) {
              if (!this.allSelList.has(this.list[i].orgGoodsId)) {
                this.nums[i] = 1;
              }
            }
          }
          this.tableLoading = false;
        }).catch(err => {
          this.tableLoading = false;
        });
      },
      colSelChange(e) {
        this.selList = e;
      },
      pageChange(index) {
        this.fd.current = index;
        this.search(false);
      },
      qtyChange(value) {

      },
      fSubmit() {
        //删掉当前页面没选中的数据，防止里面包含了历史数据
        let selIds = this.selList.map(i => i.orgGoodsId);
        this.list.forEach(item => {
          if (!selIds.includes(item.orgGoodsId)) {
            this.allSelList.delete(item.orgGoodsId);
          }
        });

        // 直接提交的时候加上当前页面的数据
        for (let i = 0; i < this.list.length; i++) {
          if (this.selList.includes(this.list[i])) {
            this.allSelList.set(this.list[i].orgGoodsId, this.nums[i]);
          }
        }

        let e = this.allSelList;
        console.log(e)
        if (e.size) {
          this.$emit("change", e);
          this.$emit("input", false);
        } else {
          this.$message.warning("请先点击选择商品");
        }
      }
    }
  }
</script>
