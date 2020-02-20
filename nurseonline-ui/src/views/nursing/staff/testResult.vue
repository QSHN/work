<template>
  <div class="testResults">
    <template v-if="!testResults || testResults.length == 0">
      <span>暂无数据。</span>
    </template>
    <el-tabs tabPosition="left">
      <el-tab-pane class="questions" v-for="(res, index) in testResults" :label="'测试题集 '+(index+1)" :key="index">
        <div class="question"  v-for="item in res" :key="item.index">
          <div class="title">
            <i class="el-icon-question"></i>
            <template v-if="item.isManySelect">
              【多选题】
            </template>
            <template v-else>
              【单选题】
            </template>
            {{item.title}}
          </div>
          <div class="options" v-for="option in item.items" :key="option.no">
            <div class="option">
              <!-- 多选 -->
              <template v-if="item.isManySelect">

                <!-- 选中，且是正确选项 -->
                <template v-if="item.selected.indexOf(option.no)!=-1 && item.trueItems.indexOf(option.no)!=-1">
                  <el-tag size="medium" type="success">
                    <div style="width: 82%;float: left;">{{ option.no }}. {{ option.content }}</div>
                    <div style="width: 60px;float: left;"><i class="el-icon-success">正确选项</i></div>
                  </el-tag>
                </template>

                <!-- 没选中，但是正确选项 -->
                <template v-else-if="item.selected.indexOf(option.no)==-1 && item.trueItems.indexOf(option.no)!=-1">
                  <el-tag size="medium" type="danger">
                    <div style="width: 82%;float: left;">{{ option.no }}. {{ option.content }}</div>
                    <div style="width: 60px;float: left;"><i class="el-icon-success">正确选项</i></div>
                  </el-tag>
                </template>

                <!-- 选中，但不是正确选项 -->
                <template v-else-if="item.selected.indexOf(option.no)!=-1 && item.trueItems.indexOf(option.no)==-1">
                  <el-tag size="medium" type="danger">
                    <span>{{ option.no }}. {{ option.content }}</span>
                  </el-tag>
                </template>

                <!-- 没选中，又不是正确选项 -->
                <template v-else-if="item.selected.indexOf(option.no)==-1 && item.trueItems.indexOf(option.no)==-1">
                  <span>{{ option.no }}. {{ option.content }}</span>
                </template>

              </template>

              <!-- 单选 -->
              <template v-else>
                <!-- 选中，但不是正确选项 -->
                <span v-if="item.selected==option.no && item.selected!=item.trueItems">
                  <el-tag size="medium" type="danger">
                    <span>{{ option.no }}. {{ option.content }}</span>
                  </el-tag>
                </span>
                <!-- 没选中，却是正确选项 -->
                <span v-else-if="option.no==item.trueItems">
                  <el-tag size="medium" type="success">
                    <span>{{ option.no }}. {{ option.content }}</span>
                  </el-tag>
                </span>
                <span v-else>
                  <span>{{ option.no }}. {{ option.content }}</span>
                </span>
              </template>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {testResultByStaffId} from '@/api/nursing/org/orgquestion'
  import {mapGetters} from 'vuex'

  export default {
    name: 'TestResult',
    props: {
      currstaff: {
        type: Object,
        default: () => {
        }
      }
    },
    data() {
      return {
        testResults: [],
      }
    },
    created() {
      this.getList();
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      getList() {
        testResultByStaffId(this.currstaff.staffId).then(response => {
          this.testResults = response.data.data
          // 把多选的trueItems和selected，字符串转数组，如 “ABC”=>[“A”，“B”，“C”]
          this.testResults.forEach((res) => {
            res.forEach((item) => {
              if (item.isManySelect) {
                item.selected = item.selected.split('')
                item.trueItems = item.trueItems.split('')
              }
            })
          })
        }).catch(function (err) {
          console.log("err", err)
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .testResults {

    /deep/ .el-tabs__header {
      /*margin-bottom: 0px !important;*/
    }

    .questions {
      max-height: 500px;
      overflow-y: scroll;

      .question {
        margin-bottom: 50px;

        .title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .options {
          font-size: 14px;
          padding-left: 16px;

          .option {
            margin: 2px 0;

            /deep/ .el-tag {
              width: 100%;
              height: auto;
              margin: 0 0 0 -11px;
              white-space: pre-wrap;
              display: inline-flex;
            }
          }
        }
      }
    }
  }

</style>
