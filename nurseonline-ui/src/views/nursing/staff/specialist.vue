<template>
      <el-dialog
        width="50%"
        title="服务人员专业方向维护"
        :show-close="false"
        :visible="showSpecialist">
        <div style="text-align: center">
          <el-transfer ref="specialistTransfer"
                       v-model="staffSpecialistKeys"
                       style="text-align: left; display: inline-block"
                       v-if="showSpecialist"
                       :filterable=true
                       :titles="['专业方向表', '已有专业方向']"
                       :button-texts="['删除专业方向', '添加专业方向']"
                       :props="{key: 'specialist',label: 'specialistName'}"
                       :data="baseSpecialistData"
                       @change="handlCheckChange">
          </el-transfer>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleStaffSpecialist" v-if="permissions.oms_staff_specialist_edit || permissions.scms_orgstaff_specialist_edit">保存</el-button>
          <el-button @click="showSpecialist = false">关闭</el-button>
        </span>
      </el-dialog>
</template>

<script>
  import {fetchList, saveSpecialist, getBaseSpecialistData} from '@/api/nursing/staff/specialist'
  import {mapGetters} from 'vuex'

  export default {
    name: 'StaffSpecialist',
    props: {},
    data() {
      return {
        currStaff: {},
        tableData: [],
        baseSpecialistData: [],
        staffSpecialistKeys: [],
        staffSpecialistData: [],
        showSpecialist: false,
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
        // params = Object.assign(params, this.currStaff);
        this.showSpecialist = true;
        this.currStaff = params;
        this.handleBaseSpecialist();
        fetchList(params).then(response => {
          this.staffSpecialistKeys = [];
          this.staffSpecialistData = [];
          for (let index in response.data.data) {
            this.staffSpecialistKeys.push(response.data.data[index]['specialist']);
            this.staffSpecialistData.push({
              staffId: this.currStaff.staffId,
              specialist: response.data.data[index]['specialist'],
              specialistName: response.data.data[index]['specialistName']
            })
          }
        })
      },
      /**
       * 获取所有专业方向（服务项）
       */
      handleBaseSpecialist() {
        getBaseSpecialistData().then(response => {
          this.baseSpecialistData=[]
          for (let index in response.data.data) {
            if(response.data.data[index]['itemId']==-1)
              continue;
            this.baseSpecialistData.push({
              specialist: response.data.data[index]['itemId'],
              specialistName: response.data.data[index]['itemName']
            })
          }
        }).catch(err => {
          this.baseSpecialistData=[]
        })
      }
      ,
      handlCheckChange(obj, operate, arr) {
        this.staffSpecialistData = []
        for (let key in obj) {
          let specialist = this.baseSpecialistData.filter(({specialist}) => specialist == obj[key])[0];
          this.staffSpecialistData.push({
            staffId: this.currStaff.staffId,
            specialist: specialist.specialist,
            specialistName: specialist.specialistName
          });
        }
      }
      ,
      handleStaffSpecialist() {
        saveSpecialist(this.staffSpecialistData).then(response => {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
