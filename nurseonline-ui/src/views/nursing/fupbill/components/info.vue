<template>
  <div class="bill-info">
    <el-dialog :visible.sync="showModal" title="随访服务订单详情" width="1000px">
      <div>
        <div class="options">
          <el-button icon="icon-ry-jiuzhenjilu" type="text" @click="showCert = true;">查看就医证明</el-button>
          <!-- <el-button icon="icon-ry-personal-info" type="text" @click="showObjInfo = true;">查看服务对象详情</el-button> -->
          <el-button icon="icon-ry-nurse" type="text" @click="showStaff = true;">查看服务人员详情</el-button>
          <el-button icon="icon-ry-nursing" type="text" @click="showNursing = true;">查看护理记录信息</el-button>
        </div>
        <div type="border-card">
          <div class="part" v-for="(part, index) in dt" :key="index">
            <template v-if="!part.column">
              <div class="part-title">{{part.title}}</div>
              <div class="part-cnt">
                <div class="part-item" v-for="(item, key) in part.data" :key="key">
                  <i>{{item}}：</i>
                  <span v-if="dic[key]">{{dic[key][tRow[key]]}}</span>
                  <span v-else :title="tRow[key]">{{tRow[key]}}</span>
                </div>
              </div>
            </template>
          </div>
          <div>
            <el-tabs type="border-card">
              <template v-for="(part, index) in dt">
                <el-tab-pane v-if="part.column" :label="part.title" class="part" :key="index">
                  <el-table :data="[tRow]">
                    <el-table-column
                      v-for="(item, key) in part.column"
                      align="center"
                      :prop="key"
                      :label="item"
                      :key="key"
                    ></el-table-column>
                  </el-table>
                </el-tab-pane>
              </template>
            </el-tabs>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="showModal = false;">取消</el-button>
      </div>
    </el-dialog>
    <!-- <bill-obj-info v-model="showObjInfo" :cust-id="row.custId"></bill-obj-info> -->
    <bill-cert v-model="showCert" :bill-path="row.proveImgPath"></bill-cert>
    <bill-staff v-model="showStaff" :staff-id="row.staffId"></bill-staff>
    <nursing-info v-model="showNursing" :task-id="row.fupBillId"></nursing-info>
  </div>
</template>

<script>
import { fetchTreeByItemClassCode } from '@/api/nursing/aid/itemclass'
import billCert from './cert.vue'
import billStaff from './staff.vue'
import nursingInfo from './nursing-info.vue'
import { getDics } from '@/util/util'

export default {
  name: 'billInfo',
  components: { billCert, billStaff, nursingInfo },
  data() {
    return {
      showModal: false,
      dt: [
        {
          title: '预约单信息',
          data: {
            // taskId: '预约单号',
            fupBillId: '服务单号',
            orgName: '服务机构名称',
            // fupBillState: '订单类型',
            executeState: '执行状态',
            // fupBillState: '预约状态',
            _reserveTime: '预约时间',
            officeName: '科室名称',
            bedNo: '病床号',
            doctorName: '住院时主医医生姓名',
            inDate: '住院时间',
            outDate: '出院时间',
            symptomsDesc: '主要诊断',
            diseaseDesc: '主要症状',
          }
        },
        {
          title: '下单会员&服务对象信息',
          data: {
            vipName: '会员姓名',
            linkman: '联系人',
            linkmanPhone: '联系人电话',
            // custZoneId: '服务区域id',
            custAddress: '服务地址',
            custName: '服务对象名称'
          }
        },
        {
          title: '服务人员信息',
          data: {
            staffName: '服务人员',
            // assignTime: '分派时间'
          }
        },
        {
          title: '服务信息',
          column: {
            fupBillType: '服务项目名称',
            // unit: '计价单位',
            // followUpPrice: '服务单价',
            // qty: '数量',
            followUpPrice: '服务金额'
          }
        },
        // {
        //   title: '耗材信息',
        //   column: {
        //     kitGoodsLabel: '耗材包标题',
        //     _kitCount: '数量', //qty * kitScale
        //     kitAmt: '金额'
        //   }
        // },
        {
          title: '费用说明（元）',
          column: {
            followUpPrice: '服务金额',
            // kitAmt: '耗材费',
            visitPrice: '上门费',
            premiumPrice: '保险费'
          }
        },
        {
          title: '分账说明（元）',
          column: {
            staffAmt: '服务人员应收',
            orgAmt: '服务机构应收',
            operatorAmt: '运营机构应收'
          }
        }
      ],
      dic: {
        billType: {},
        executeState: {},
        taskState: {}
      },
      showObjInfo: false,
      showCert: false,
      showStaff: false,
      showNursing: false,
      tRow: {}
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    showModal(val) {
      if (val === false) {
        this.$emit('input', val)
      } else {
        this.getCodes()
      }
    },
    value(val) {
      this.showModal = val
    },
    row: {
      handler(val) {
        let row = { ...val }
        row._kitCount = row.qty * row.kitScale
        row._reserveTime =
          row.reserveDate + '  ' + row.reserveTime1 + '~' + row.reserveTime2
        this.tRow = { ...row }
      },
      deep: true
    }
  },
  methods: {
    getCodes() {
      getDics(this.dic)
    },
    check() {
      this.$confirm('您确定要将该订单通过审核吗？', '提示', {
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            check(this.row.billId)
              .then(res => {
                this.$message.success('审核成功')
                this.showModal = false
                this.$emit('refresh')
                done()
                instance.confirmButtonLoading = false
              })
              .catch(err => {
                instance.confirmButtonLoading = false
              })
          } else {
            done()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bill-info {
  .options {
    position: absolute;
    top: 16px;
    left: 200px;
    .el-button {
      margin: 0 8px;
    }
  }
  .part {
    .part-title {
      font-weight: 600;
      line-height: 30px;
    }
    .part-cnt {
      overflow: hidden;
      margin-bottom: 20px;
    }
    .part-item {
      float: left;
      width: 33.3%;
      height: 26px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      & > i {
        font-style: normal;
      }
    }
  }
}
</style>
