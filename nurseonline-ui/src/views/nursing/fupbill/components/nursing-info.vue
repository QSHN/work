<template>
  <div class="nursing-info">
    <el-dialog :visible.sync="showModal" title="护理记录详情" width="1150px">
      <div v-loading="loading" style="overflow:hidden;">
        <div v-if="dt">
          <div class="part" v-for="(part, i) in initData" :key="i">
            <div class="part-title">{{part.title}}</div>
            <div class="part-cnt">
              <template v-if="part.obj">
                <template>
                  <div
                    :class="['part-item', item.type ? 'form-row' : '']"
                    v-for="(item, key) in part.data"
                    :key="key"
                  >
                    <i>{{item.title || item}}：</i>
                    <span v-if="dics[key]">{{dics[key][dt[part.prop][part.childProp][key]]}}</span>
                    <span v-else :title="dt[part.prop][part.childProp][key]">{{dt[part.prop][part.childProp][key]}}</span>
                  </div>
                </template>
              </template>
              <template v-else>
                <div
                  :class="['part-item', item.type ? 'form-row' : '']"
                  v-for="(item, key) in part.data"
                  :key="key"
                >
                  <i>{{item.title || item}}：</i>
                  <span v-if="dics[key]">{{dics[key][dt[key]]}}</span>
                  <span class="form-img" v-else-if="item.type === 'img' && dt[key]">
                    <div v-for="(item, index) in dt[key].split(';')" :key="index">
                      <img :src="item" />
                    </div>
                  </span>
                  <span v-else :title="dt[key]">{{dt[key]}}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div v-else>暂无记录</div>
      </div>
      <div slot="footer">
        <el-button @click="showModal = false;">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getNurseRec } from '@/api/nursing/fupbill/fupbill'
// import {getDics} from "@/util/util"

export default {
  name: 'nursingInfo',
  data() {
    return {
      showModal: false,
      dt: null,
      loading: false,
      dics: {
        sex: { '0': '不填', '1': '男', '2': '女' }
      },
      phoneOptions: {
        title: '护理评估',
        prop: 'assessmentRequiredData',
        childProp: 'phone',
        obj: true,
        data: {
          followUpDate: '随访时间',
          conversationTime: '通话时间',
          connected: '电话是否接通',
          interviewee: '受访人',
          completion: { title: '随访内容完成情况', type: 'textarea' },
          thelocationofthepain: '疼痛部位',
          grade: '评分',
          painkiller: { title: '止痛药', type: 'textarea' },
          usageDosage: { title: '用法用量', type: 'textarea' },
          medicineOnTime: '是否按时按量用药',
          satisfaction: '目前止痛是否满意',
          influenceSleep: '疼痛是否影响睡眠',
          diet: { title: '饮食情况', type: 'textarea' },
          constipation: '是否便秘',
          OtherAdverseReactions: { title: '其他不良反应', type: 'textarea' },
          scruple: '是否有用药顾虑',
          specialCircumstances: { title: '特殊情况及指导', type: 'textarea' },
          suggest: '对医院的意见及建议',
          result: { title: '处理结果', type: 'textarea' },
          followUpAgain: '是否需要再次随访',
          followUpAgainQuestion: { title: '再次随访时，需关注的问题', type: 'textarea' },
        }
      },
      step1: {
        title: '随访基本信息',
        prop: 'assessmentRequiredData',
        childProp: 'step1',
        obj: true,
        data: {
          followUpDate: '随访时间',
          followUpWay: '随访方式',
          lossFollowUp: '是否失访',
          lossFollowUpCause: { title: '失访原因', type: 'textarea' },
          death: '是否死亡',
          deathCause: { title: '死亡原因', type: 'textarea' },
          deathDate: '死亡时间',
        }
      },
      step2: {
        title: '随访期间就诊信息',
        prop: 'assessmentRequiredData',
        childProp: 'step2',
        obj: true,
        data: {
          outpatientNum: '门诊就诊次数',
          emergencyNum: '急诊就诊次',
          hospitalNum: '住院次数',
          monthExpense: '月均门诊医疗费用',
          newEvent: { title: '新发疾病事件', type: 'textarea' },
        }
      },
      step3: {
        title: '随访期间生活方式',
        prop: 'assessmentRequiredData',
        childProp: 'step3',
        obj: true,
        data: {
          smoke: '吸烟情况',
          drink: '饮酒情况',
          exercise: '运动情况',
          bloodPressureFrequency: '血压测量频率',
          bloodPressureLevels: '平时血压水平',
          systolicPressure: '收缩压',
          diastolicPressure: '舒张压',
          bloodGlucoseFrequency: '血糖测量频率',
          bloodGlucoseLevels: '平时血糖水平（空腹血糖）',
          mealAfterBloodGlucose: '餐后两小时血糖',
        }
      },
      step4: {
        title: '随访期间用药情况',
        prop: 'assessmentRequiredData',
        childProp: 'step4',
        obj: true,
        data: {
          antithromboticDrugs: '抗栓药物',
          medicineName: { title: '服用药物名称', type: 'textarea' },
          hypotensor: '降压药',
          hypotensorNum: '服用降压药种类',
          hypotensorType: '服用降压药类型',
          antidiabetic: '降糖药',
          antidiabeticType: '服用降糖药类型',
          lipidMedicine: '调脂药',
          lipidMedicineType: '服用调脂药类型',
        }
      },
      step5: {
        title: 'mRS 评分',
        prop: 'assessmentRequiredData',
        childProp: 'step5',
        obj: true,
        data: {
          mRS: 'mRS 评分',
        }
      },
      step6: {
        title: 'NIHSS 评分',
        prop: 'assessmentRequiredData',
        childProp: 'step6',
        obj: true,
        data: {
          NIHSS: 'NIHSS 评分',
        }
      },
      step7: {
        title: '检查',
        prop: 'assessmentRequiredData',
        childProp: 'step7',
        obj: true,
        data: {
          weight: '体重',
          systolicPressure: '收缩压',
          diastolicPressure: '舒张压',
          ECG: '心电图',
          inspectionResult: '检查结果',
          FBG: '空腹血糖',
          mealAfterBloodGlucose: '餐后两小时血糖',
          glycatedHemoglobin: '糖化血红蛋白',
          triglyceride: '甘油三酯',
          cholesterol: '胆固醇',
          lowCholesterol: '低密度脂蛋白胆固醇',
          highCholesterol: '高密度脂蛋白胆固醇',
          homocysteine: '同型半胱氨酸',
        }
      },
      initData: [
        {
          title: '评估人信息',
          data: {
            visitingTime: '探访时间',
            recordingTime: '记录时间',
            staffName: '访视护士'
          }
        },
        {
          title: '服务完成情况',
          data: {
            finishTime: '完成时间',
            finishedRecord: '简单描述',
            imgUrl: { title: '相关图片', type: 'img' }
          }
        },
      ],
      verifyType: {
        text: ['input', 'textarea'],
        row: ['textarea', 'text'],
        select: ['select', 'checkbox']
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    taskId: [String, Number]
  },
  watch: {
    showModal(val) {
      if (val === false) {
        this.$emit('input', val)
      } else {
        this.loading = true
        this.dt = null
        getNurseRec(this.taskId)
          .then(res => {
            if (res.data && res.data.data) {
              this.initData = [
                {
                  title: '评估人信息',
                  data: {
                    visitingTime: '探访时间',
                    recordingTime: '记录时间',
                    staffName: '访视护士'
                  }
                },
                {
                  title: '服务完成情况',
                  data: {
                    finishTime: '完成时间',
                    finishedRecord: '简单描述',
                    imgUrl: { title: '相关图片', type: 'img' }
                  }
                },
              ]
              let dt = res.data.data
              // dt.personalAndFamilyData = JSON.parse(dt.personalAndFamily)
              let assessmentRequiredData = JSON.parse(dt.assessmentRequired)
              if (assessmentRequiredData.phone) {
                this.handleConvertPhone(assessmentRequiredData.phone)
                this.initData.unshift(this.phoneOptions)
              } else {
                this.handleConvertVisit(assessmentRequiredData)
                for (let i = 7; i > 0; i--) {
                  this.initData.unshift(this[`step${i}`])
                }
              }
              dt.assessmentRequiredData = assessmentRequiredData
              // dt.assessmentOptionData = JSON.parse(dt.assessmentOption)
              this.dt = dt
            }
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
        // this.getCodes();
      }
    },
    value(val) {
      this.showModal = val
    }
  },
  methods: {
    handleConvertPhone(data) {
      if (data.completion.length > 0) {
        let completion = []
        for (const item of data.completion) {
          completion.push(item.name)
        }
        data.completion = completion.join('，')
      }
    },
    handleConvertVisit(data) {
      // 处理 step1 数据
      let step1 = data.step1
      if (step1.followUpWay == '其他') {
        step1.followUpWay = step1.followUpWayOther
      }
      // 处理 step2 数据
      let step2 = data.step2
      let newEvent = []
      if (step2.newEvent.length > 0) {
        let newEventOther = step2.newEventOther
        for (const item of step2.newEvent) {
          let name = item.name
          let value = Number(item.value) - 1
          let other = ''
          if (newEventOther[value].date) {
            other = '发病时间：' + newEventOther[value].date
          } else {
            other = '住院主要诊断：' + newEventOther[value].text
          }
          name += `（${other}）`
          newEvent.push(name)
        }
      }
      step2.newEvent = newEvent.join('，')

      // 处理 step4 数据
      let step4 = data.step4
      let medicineName = []
      if (step4.medicineName.length > 0) {
        let medicineNameOther = step4.medicineNameOther
        for (const item of step4.medicineName) {
          let name = item.name
          let value = Number(item.value) - 1
          let other = ''
          if (medicineNameOther[value].date) {
            other = '每日剂量：' + medicineNameOther[value].date
          } else {
            other = '每日剂量：' + medicineNameOther[value].text
          }
          name += `（${other}）`
          medicineName.push(name)
        }
      }
      step4.medicineName = medicineName.join('，')

      // 处理 step5 数据
      let step5 = data.step5
      if (step5.mRS === '已评分') {
        step5.mRS += `（${step5.grade}分）`
      }
      // 处理 step6 数据
      let step6 = data.step6
      if (step6.NIHSS === '已评分') {
        step6.NIHSS += `（${step6.grade}分）`
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.nursing-info {
  .part {
    overflow: hidden;
    .part-title {
      font-weight: 600;
      line-height: 30px;
      margin-bottom: 10px;
    }
    .part-cnt {
      overflow: hidden;
      margin-bottom: 20px;
      // min-height: 180px;
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
        display: inline-block;
        min-width: 100px;
        text-align: right;
        margin-right: 10px;
      }
      &.form-row {
        float: none;
        clear: both;
        width: 100%;
        height: auto;
        white-space: normal;
        margin-bottom: 10px;
        & > i {
          float: left;
        }
        & > span {
          margin-left: 90px;
          display: block;
        }
      }
      .form-img {
        img {
          max-width: 100%;
        }
        & > div {
          float: left;
          width: 18%;
          margin: 5px;
        }
      }
    }
  }
}
</style>
