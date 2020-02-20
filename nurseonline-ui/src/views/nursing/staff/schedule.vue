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
  <div class="schedule">
    <div class="header">
      <el-button-group class="picker">
        <el-button :disabled="!showLastBtn" size="small" @click="handleLastWeek">上一周</el-button>
        <el-date-picker size="small" v-model="selectWeekStart"
                        type="week" format="yyyy 第 WW 周" placeholder="选择周" :picker-options="dpOption"
                        @change="dateChange"></el-date-picker>
        <el-button :disabled="!showNextBtn" size="small" @click="handleNextWeek">下一周</el-button>
        <el-button :disabled="!showThisBtn" size="small" @click="handleThisWeek">当前周</el-button>
      </el-button-group>
      <div class="graphical">
        <!--这周一：{{dayOffset.thisMon}}-->
        <!--这周日：{{dayOffset.thisSun}}-->
        <!--上周一：{{dayOffset.lastWeekMon}}-->
        <!--下周一：{{dayOffset.nextWeekMon}}-->
        <span>
          查询日期：
          <el-tag type="success" size="mini">{{dayOffset.thisMon}} 至 {{dayOffset.thisSun}}</el-tag>
        </span>

        <span>
          图示：
          <el-tag size="mini">空闲</el-tag>
          <el-tag type="info" size="mini">勿扰</el-tag>
        </span>
      </div>
    </div>


    <div class="weeks-wrap">
      <template v-if="!dateData.data1">
        <span>本周没有数据。</span>
      </template>
      <template v-else>
        <div class="week-ul">
          <div class="top-side">
            <div class="day-name-ul" v-for="index in 7" :key="index">
              <span class="day-name-li">星期{{dayData[index]}}</span>
            </div>
          </div>
          <el-scrollbar wrap-class="bottom-side-wrap" view-class="bottom-side-box">
            <div class="day-ul" :class="['week-li', index%2===0 ? 'week-li-odd' : '']" v-for="index in 7" :key="index">
              <template v-if="dateData['data' + index]">
                <div class="day-name-ul" v-for="(item, i) in dateData['data' + index]" :key="i">
                  <el-tag class="dy-name-li" :type="item == '1' ? 'info' : ''">{{(i > 9 ? i : "0" + i)}}:00</el-tag>
                  <!-- <el-tag :type="item == 1 ? '' : 'info'" :color="item == 1 ? '' : '#FFF'">{{(i > 9 ? i : "0" + i)}}:00</el-tag> -->
                </div>
              </template>
            </div>
          </el-scrollbar>
        </div>
      </template>
    </div>
  </div>
</template>

<script>

  import moment from 'moment'
  import {getWeek} from '@/api/nursing/staff/schedule'
  import {getWeek as getWeekHistory} from '@/api/nursing/staff/schedule-history'
  import {tableOption} from '@/const/crud/nursing/staff/schedule'
  import {mapGetters} from 'vuex'

  // const getDay = date => {
  //   date = date || new Date();
  //   let MM = date.getMonth() + 1;
  //   MM = MM > 9 ? MM : "0" + MM;
  //   let dd = date.getDate();
  //   dd = dd > 9 ? dd : "0" + dd;
  //   let today = `${date.getFullYear()}-${MM}-${dd}`;
  //   return today;
  // }

  const formater = "YYYY-MM-DD";
  const mon = "Monday";
  const days = "days"

  export default {
    name: 'StaffSchedule',
    components: {
      moment,
    },
    data() {
      return {
        showLastBtn: true,
        showNextBtn: true,
        showThisBtn: true,
        dayOffset: {},
        fd: {
          anyDate: "",
          staffId: ""
        },
        dpOption: {
          firstDayOfWeek: 1,
        },
        selectWeekStart: "",
        dateData: {},
        dateDataA: {},
        dayData: {
          "1": "一",
          "2": "二",
          "3": "三",
          "4": "四",
          "5": "五",
          "6": "六",
          "7": "日"
        },
      }
    },
    props: {
      staffId: [String, Number],
      isHistory: {
        type: Boolean,
        default: false,
      }
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    mounted() {
      let history = this.isHistory;
      this.setStaffId();
      this.selectWeekStart = this.getDayData(this.isHistory?moment(new Date()).day(mon).subtract(14, days).format(formater):undefined);
      this.dpOption.disabledDate = function(time) {
        let t = moment(time).format(formater);
        let n = moment(new Date()).day(mon).subtract(7, days).format(formater);
        return history ? t >= n : t < n;
      },
      this.setBtnDisplay()
      this.getWeek();
    },
    methods: {
      getWeek() {
        let func = getWeek;
        // 是否查询历史
        if (this.isHistory) {
          func = getWeekHistory;
        }
        func(this.fd).then(res => {
          let dateData = {};
          let dateDataA = {};
          let dt = res.data.data;
          if (dt != null) {
            for (let i = 1; i < 8; i++) {
              dateData["data" + i] = dt["data" + i].split('');
              // 后台已忽略DataA的字段
              // if (!this.isHistory) {
              //   dateDataA["data" + i + "a"] = dt["data" + i + "a"].split('');
              // }
            }
          }
          this.dateData = dateData;
          this.dateDataA = dateDataA;
        }).catch(err => {
        });
      },
      handleLastWeek() {
        let date = moment(this.fd.anyDate, formater).day(mon).subtract(7, days).format(formater)
        this.dateChange(date);
      },
      handleNextWeek() {
        let date = moment(this.fd.anyDate, formater).day(mon).add(7, days).format(formater);
        this.dateChange(date);
      },
      handleThisWeek() {
        this.dateChange();
      },
      getDayData(date) {
        date = moment(date || new Date(), formater).format(formater);
        this.fd.anyDate = date;
        this.dayOffset = {
          thisMon: moment(date, formater).day(mon).format(formater),
          thisSun: moment(date, formater).day(mon).add(6, days).format(formater),
          lastWeekMon: moment(date, formater).day(mon).subtract(7, days).format(formater),
          nextWeekMon: moment(date, formater).day(mon).add(7, days).format(formater),
        }
        return date;
      },
      dateChange(date) {
        this.selectWeekStart = this.getDayData(date);
        this.setBtnDisplay();
        this.getWeek();
      },
      setStaffId() {
        this.fd.staffId = this.staffId;
      },
      setBtnDisplay(){
        if(this.isHistory){
          this.showNextBtn = this.selectWeekStart < moment(new Date()).day(mon).subtract(14, days).format(formater);
          this.showThisBtn = false;
        } else {
          this.showLastBtn = this.selectWeekStart > moment(new Date()).day(mon).subtract(7, days).format(formater);
          this.showThisBtn = true;
        }
      }


    }
  }
</script>

<style lang="scss" scoped>

  $tag-color-bg: #FFF;
  $tag-color-color: #BBB;

  .schedule {
    height: 620px;

    .header {
      text-align: center;
    }

    .picker {
      margin: 0 auto;
      width: 55%;
      display: flex;

      /deep/ .el-date-editor {
        border: 0px;

        /deep/ .el-input__inner {
          border-radius: 0;
          border-right: 0px;
        }
      }
    }

    .graphical {
      width: 100%;
      padding: 5px;
      text-align: center;
      font-size: 12px;

      .el-tag--info {
        background-color: $tag-color-bg;
        color: $tag-color-color;
      }
    }

    .week-ul{
      .top-side{
        display: flex;
        width:100%;
        box-shadow:0px 15px 10px -15px #ccc;

        .day-name-ul{
          padding: 0px;
          width: 100px;
          text-align: center;
          line-height: 32px;
        }
      }

      /deep/ .bottom-side-wrap{
        height:550px;
      }

      /deep/ .bottom-side-box{
        display: flex;
        width:100%;

        .day-ul{
          display: table;
          padding: 0px;
          width: 100px;
          text-align: center;

          .day-name-ul{
            padding-top: 5px;

            .dy-name-li{
              margin-bottom: 3px;
            }

            .el-tag--info {
              background-color: $tag-color-bg;
              color: $tag-color-color;
            }
          }
        }
      }

      .week-li{
        margin: 0px;
        padding-top: 10px;
        padding-bottom: 10px;

        &:hover {
          background: #ecf5ff;
        }
      }

      .week-li-odd {
        @extend .week-li;
        background: #fafafa;
      }
    }
  }
</style>
