<template>
  <div class="statistic_chart">
    <div style="padding-left: 10px;">
      <Select v-model="tSelect" style="width:200px">
        <Option v-for="item in tSelectList" :value="item.label" :key="item.value">{{ item.value }}</Option>
      </Select>

      <Select v-model="vSelect" style="width:200px; margin-left: 20px;">
        <Option v-for="item in vSelectList" :value="item.value" :key="item.value">{{ item.value }}</Option>
      </Select>

      <template v-if="tab === 'department'"  >
        <Select v-model="dSelect" style="width: 200px; margin-left: 20px;">
          <Option v-for="item in dSelectList"
                  :value="item.id"
                  :key="item.name">{{item.name}}
          </Option>
        </Select>
      </template>

      <div v-if="tab === 'employ'" style="width:260px; margin-left: 20px; display: inline-block">
        <Select v-model="eSelect" style="width: 200px;">
          <Option v-for="item in eSelectList"
                  :value="item.id"
                  :key="item.name">{{item.name}}
          </Option>
        </Select>
      </div>

    </div>

    <div class="chart_layer" style="height: 300px; position: relative; margin: 10px 0;">
      <div ref="visitChart" class="charts chart-bar" style="width: 100%; height: 100%"></div>
      <Spin fix v-if="loading">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
    </div>

    <Table border :columns="columns" :data="tableData" :loading="loading"></Table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { selectData } from '@/libs/select.js'
import { getVisitChart } from '@/api/client'
import echarts from 'echarts'
import tdTheme from './theme.json'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'echart',
  props: {
    tab: {
      type: String,
      required: true
    },
    dSelectList: {
      type: Array
    },
    eSelectList: {
      type: Array
    },
    clientVisitingType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      tSelect: 'WEEK',
      tSelectList: [
        { value: '最近一周', label: 'WEEK' },
        { value: '最近一个月', label: 'MONTH' },
        { value: '最近三个月', label: 'SEASON' },
        { value: '最近半年', label: 'HALF_YEAR' },
        { value: '最近一年', label: 'YEAR' }
      ],
      vSelect: '',
      vSelectList: [],
      dSelect: '',
      eSelect: '',
      loading: true,
      chartDom: null,
      chartOptions: {
        title: {
          text: '',
          x: 'center'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      },
      chartData: null,
      columns: [
        {
          title: '图表',
          render: (h, params) => {
            return h('span', {
              style: {
                color: params.row.color
              }
            }, params.row.name)
          }
        },
        {
          title: '数据',
          render: (h, params) => {
            return h('span', {
              style: {
                color: params.row.color
              }
            }, params.row.count)
          }
        }
      ],
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'organization'
    ])
  },
  watch: {
    dSelectList () {
      if (this.dSelectList.length) this.dSelect = this.dSelectList[0].id
    },
    eSelectList () {
      if (this.eSelectList.length) this.eSelect = this.eSelectList[0].id
    },
    vSelect () {
      this.showSeries()
    },
    dSelect () {
      if (this.dSelect && this.tab === 'department') this.getChart()
    },
    eSelect () {
      if (this.eSelect && this.tab === 'employ') this.getChart()
    },
    tSelect () {
      if (this.tSelect) this.getChart()
    }
  },
  methods: {
    selectData,
    showSeries () {
      let chart = this.chartData[this.vSelect]
      this.chartOptions.title.text = chart.name
      this.chartOptions.xAxis.data = chart.days
      this.chartOptions.series = [{
        name: chart.name,
        type: 'line',
        // smooth: true,
        data: chart.datas,
        itemStyle: {
          normal: {
            lineStyle: {
              color: chart.color
            }
          }
        }
      }]
      this.$forceUpdate()
      console.log('chartOptions', this.chartOptions)
      this.chartDom.setOption(this.chartOptions)
    },
    getChart () {
      let ajaxData = {
        clientVisitingTimeCycle: this.tSelect,
        clientVisitingType: this.clientVisitingType
      }
      switch (this.tab) {
        case 'department':
          if (!this.dSelect.length) return
          ajaxData.departmentId = this.dSelect
          break
        case 'employ':
          if (!this.eSelect.length) return
          ajaxData.employeeId = this.eSelect
          break
        default:
          break
      }
      console.log(ajaxData)
      getVisitChart(ajaxData).then((res) => {
        let statisticsDatas = res.data.statisticsDTOList
        console.log(this.tab + 'chart', statisticsDatas)
        if (statisticsDatas.length === 0) {
          this.chartData = {}
          this.tableData = []
          this.chartOptions.title.text = ''
          this.chartOptions.xAxis.data = []
          this.chartOptions.series = [{
            name: '',
            type: 'line',
            data: []
          }]
          this.chartDom.setOption(this.chartOptions)
          this.vSelectList = []
          this.loading = false
          return
        }

        this.chartData = {}
        this.tableData = []
        this.vSelectList = []
        statisticsDatas.forEach(v => {
          this.chartData[v.name] = v
          this.vSelectList.push({ value: v.name })
          this.tableData.push({
            name: v.name,
            count: v.count,
            color: v.color
          })
        })
        this.vSelect = this.vSelectList[0].value
        this.$forceUpdate()
        this.showSeries()
        this.loading = false
      }).catch((err) => {
        if (err.message) {
          this.$Notice.error({
            title: '错误提示',
            desc: err.message
          })
          this.loading = false
        }
      })
    }
  },
  mounted () {
    this.getChart()
    this.$nextTick(() => {
      this.chartDom = echarts.init(this.$refs.visitChart, 'tdTheme')
    })
  }
}
</script>

<style lang="less" scoped>
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
</style>
