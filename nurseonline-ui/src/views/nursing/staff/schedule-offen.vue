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
      <div class="graphical">
        <span>
          图示：
          <el-tag size="mini">空闲</el-tag>
          <el-tag type="info" size="mini">勿扰</el-tag>
        </span>
      </div>
    </div>


    <div class="weeks-wrap">
      <template v-if="!dateData.data1">
        <span>没有模板数据。</span>
      </template>
      <template v-else>
        <div class="week-ul">
          <div class="top-side">
            <div class="day-name-ul" :class="['week-li', index%2===0 ? 'week-li-odd' : '']" v-for="index in 7" :key="index">
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
  import {fetchList, getObj, addObj, putObj, delObj} from '@/api/nursing/staff/schedule-offen'
  import {tableOption} from '@/const/crud/nursing/staff/schedule-offen'
  import {mapGetters} from 'vuex'

  export default {
    name: 'StaffScheduleOffen',
    components: {
      moment,
    },
    props: {
      staffId: [String, Number],
    },
    data() {
      return {
        fd: {
          staffId: ""
        },
        dateData: {},
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
    created() {
    },
    mounted: function () {
      this.setStaffId();
      this.getOffen();
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      getOffen() {
        fetchList(this.fd).then(res => {
          let dateData = {};
          let dt = res.data.data[0];
          if (dt != null) {
            for (let i = 1; i < 8; i++) {
              dateData["data" + i] = dt["data" + i].split('');
            }
          }
          this.dateData = dateData;
        }).catch(err => {
        });
      },
      setStaffId() {
        this.fd.staffId = this.staffId;
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
