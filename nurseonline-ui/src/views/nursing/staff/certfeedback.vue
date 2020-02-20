<template>
  <el-dialog
    width="580px"
    title="资质证明审核反馈"
    :visible.sync="showCertFeedback">
    <avue-timeline pending time :time-width="150">
      <avue-timeline-item v-for="(item, index) in tableData" :key="index" :icon="item.result == '0'?'el-icon-upload2':(item.result == '1'?'el-icon-check':'el-icon-close')">
        <div slot="time">
          {{item.createTime}}
          <p>{{item.checkerName}}</p>
        </div>
        <div slot="content">
            {{item.result=='0'?'上传资质':
            (item.result=='1'?'审核通过':
            (item.result=='2'?'审核不通过':'未知'))}}
          <p>{{item.reason}}</p>
        </div>
      </avue-timeline-item>
    </avue-timeline>

    <!--<div style="max-height:300px;overflow-y: scroll;">-->
      <!--<div class="delate-step-lt">-->
        <!--<div class="delate-time2" v-for="(item, index) in tableData" :key="index">-->
          <!--{{item.createTime}}-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="delate-step-rt">-->
        <!--<el-steps direction="vertical" space="85px" :active="0">-->
          <!--<el-step v-for="(item, index) in tableData" :key="index">-->
            <!--<template slot="icon">-->
              <!--<i v-if="item.result == '0'" class="el-icon-upload2"/>-->
              <!--<i v-if="item.result == '1'" class="el-icon-check"/>-->
              <!--<i v-if="item.result == '2'" class="el-icon-close"/>-->
            <!--</template>-->
            <!--<template slot="title">-->
                <!--<div style="float: left;width:280px;">-->
                  <!--{{item.result=='0'?'服务人员上传资质':-->
                  <!--(item.result=='1'?'审核通过':-->
                  <!--(item.result=='2'?'审核不通过':'未知'))}}-->
                <!--</div>-->
                <!--<div style="float: right;width:100px;text-align: right;font-size: 12px;">-->
                  <!--{{item.checkerName}}-->
                <!--</div>-->
            <!--</template>-->
            <!--<template slot="description" v-if="item.reason!=''">-->
              <!--{{item.reason}}-->
              <!--&lt;!&ndash;<el-alert :title="item.reason" type="error" :closable="false"></el-alert>&ndash;&gt;-->
            <!--</template>-->
          <!--</el-step>-->
        <!--</el-steps>-->
      <!--</div>-->
    <!--</div>-->
    <span slot="footer" class="dialog-footer">
          <el-button @click="showCertFeedback = false" alt="123">关闭</el-button>
        </span>
  </el-dialog>
</template>

<script>
  import {fetchList} from '@/api/nursing/staff/staffcertfeedback'
  import {mapGetters} from 'vuex'

  export default {
    name: 'StaffCertFeedback',
    data() {
      return {
        tableData: [],
        showCertFeedback: false,
      }
    },
    created() {
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      getList(params) {
        this.tableLoading = true
        fetchList(params).then(response => {
          this.tableData = response.data.data
          this.showCertFeedback = true
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .delate-step-lt {
    width: 90px;
    color: #818181;
    font-size: 13px;
    display: table-cell;
    position: relative;

    .delate-time {
      position: absolute;
      // &:first-child {
      //   top: 4px;
      // }
      // &:nth-child(2) {
      //   top: 80px;
      // }
      // &:nth-child(3) {
      //   top: 170px;
      // }
      // &:last-child {
      //   bottom: 24px;
      // }
    }

    .delate-time2{
      height: 85px;
    }
  }

  .delate-step-rt {
    display: table-cell;
  }

</style>
