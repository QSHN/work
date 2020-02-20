<template>
    <f7-page class="orderManage_page">
        <f7-navbar title="经营分析" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="load">刷新</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="pc_content">
            <div class="select_group">
                <f7-list class="select">
                    <f7-list-item title="时间" smart-select :smart-select-params="{openIn: 'popover'}">
                        <select name="brand" v-model="time">
                            <option v-for="(v, i) in timeList" :value="v" :selected="v == time">{{v}}</option>
                        </select>
                    </f7-list-item>
                </f7-list>
            </div>

            <div class="chart_layer">
                <v-chart :options="chart" :auto-resize="false" ref="line"/>
            </div>

            <ul class="more_list">
                <li>
                    <span>订单总金额</span>
                    <span>{{getNumber()}} 元</span>
                </li>

                <li>
                    <span>订单总笔数</span>
                    <span>{{list.length}} 笔</span>
                </li>
            </ul>

            <ol class="nav_list">
                <li v-for="(v, i) in routerList" @click="go(v.url, v.props)">
                    <span>{{v.name}}</span>
                    <img class="arrow" src='../../../assets/images/arrow_right_gray copy 2@2x.png' style="width: 8px; height: 12px;" />
                </li>
            </ol>
        </div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import axios from 'axios';
import moment from 'moment'
import ECharts from 'lib/chart/ECharts.vue';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
export default {
    name: "index",
    components: {
        'v-chart': ECharts,
    },
    data () {
        return {
            time: '最近一周',
            timeList: ["最近一周","最近两周","最近一个月","最近两个月","最近三个月","最近半年"],
            list: [],
            chart: {},
            filter: {
                startTime: '',
                endTime: '',
                orderType: '',
                creator: '',
                status: ''
            },
            routerList: [
                {name: '经营汇总分析', url: '/psiManage/operationAnalysis/list', props: {}},
                {name: '商品销量分析', url: '/psiManage/orderManage/statistics', props: {dataType: '商品'}},
                {name: '客户销量分析', url: '/psiManage/orderManage/statistics', props: {dataType: '客户'}},
                {name: '员工销量分析', url: '/psiManage/orderManage/statistics', props: {dataType: '员工'}},
                {name: '部门销量分析', url: '/psiManage/orderManage/department', props: {}},
                {name: '铺货上报', url: '/terminalManage/shopGoods/', props: {}},
                {name: '库存上报', url: '/terminalManage/inventory/', props: {}},
                {name: '销量上报', url: '/terminalManage/salesVolume/', props: {}},
                {name: '综合上报', url: '/terminalManage/salesIntegrated/', props: {}}
            ]
        }
    },
    computed: {
        ...mapGetters([
            'who',
            'personnel'
        ]),
    },
    watch: {
        time: {
            immediate: true,
            handler: function () {
                switch (this.time) {
                    case '最近一周':
                        this.filter.startTime = moment({hour: 0}).subtract(1, 'week');
                        break
                    case '最近两周':
                        this.filter.startTime =  moment({hour: 0}).subtract(2, 'week');
                        break
                    case '最近一个月':
                        this.filter.startTime =  moment({hour: 0}).subtract(1, 'month');
                        break
                    case '最近两个月':
                        this.filter.startTime =  moment({hour: 0}).subtract(2, 'month');
                        break
                    case '最近三个月':
                        this.filter.startTime =  moment({hour: 0}).subtract(3, 'month');
                        break
                    case '最近半年':
                        this.filter.startTime =  moment({hour: 0}).subtract(6, 'month');
                        break
                }
                this.load()
            }
        }
    },
    methods: {
        go (url, props) {
            this.$f7router.navigate(url, {props: props})
        },
        load () {
            this.filter.creator = this.personnel.map(v => v._id)
            this.filter.status = "已审批"
            axios.post('api/orderManage/list', this.filter).then(res => {
                if (res.data && res.data.length) {
                    this.list = res.data
                }
                this.getChart()
            }).catch(err => {
                console.error(err.message);
                $alert('查询经营数据失败')
            })
        },
        getNumber () {
            let all = 0
            this.list.forEach((v, i) => {
                all += v.commodity.reduce((all, v1) => all += (v1.salesNumber ? v1.salesNumber * v1.salesPrice : v1.number * v1.price), 0)
            })
            return all
        },
        getChart () {
            let arr = []
            let time = new Set()
            this.list.forEach((v, i) => {
                let createdAt = moment(v.createdAt).format('MM-DD')
                let index = Array.from(time).indexOf(createdAt)
                let number = v.commodity.reduce((all, v1) => all += (v1.salesNumber ? v1.salesNumber * v1.salesPrice : v1.number * v1.price), 0)
                time.add(createdAt)
                if (index < 0) {
                    arr.push(number)
                } else {
                    arr[index] = parseFloat(arr[index]) +  number
                }
            })
            console.log(Array.from(time), arr)
            this.chart = {
                title: {
                    text: '销售额分析（单位：元）',
                    show: true,
                    textStyle: {
                        color: '#666666',
                        fontSize: 14
                    },
                    x: 'center',
                    top: 15
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow'
                    }
                },
                grid: {
                    top: '15%',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: Array.from(time)
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    type: 'line',
                    name:'总金额',
                    barWidth: '60%',
                    data: arr,
                    areaStyle: {},
                }],
                color: ['#01B38B'],
                noDataLoadingOption: {
                    text: '暂无数据',
                    effect: 'bubble',
                    effectOption: {
                        effect: {
                            n: 0
                        }
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .pc_content {
        overflow-x: hidden;
    }

    .select_group {
        height: 44px;
        background: #fff;
        margin-bottom: 10px;


        .select {
            width: 100%;
            list-style: none;
            text-align: center;
            margin: 0;
        }
    }

    .chart_layer {
        height: 350px;
        background: #fff;
        padding-bottom: 10px;
    }

    .more_list {
        list-style: none;
        padding: 0;
        margin: 0;
        background: #fff;
        border-top: 1px solid #d8d8d8;

        li {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 44px;
            padding: 0 15px;
            border-bottom: 1px solid #d8d8d8;

            span {
                &:nth-child(1) {
                    flex-grow: 1;
                }
                &:nth-child(2) {
                    color: #4B946A;
                }
            }
        }
    }


    .nav_list {
        list-style: none;
        padding: 0;
        margin: 10px 0 0;
        background: #fff;

        li {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 44px;
            padding: 0 15px;
            border-bottom: 1px solid #d8d8d8;

            span {
                flex-grow: 1;
            }
        }
    }
</style>
<style lang="scss">
    .orderManage_page .chart_layer .echarts {
        width: 100% !important;
        height: 100% !important;
    }
</style>
