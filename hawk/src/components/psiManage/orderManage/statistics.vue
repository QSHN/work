<template>
    <f7-page class="orderManage_page">
        <f7-navbar :title="dataType + '订单报表'" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="go">列表</f7-link>
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

                <f7-list class="select">
                    <f7-list-item title="类型" smart-select :smart-select-params="{openIn: 'popover'}">
                        <select name="label" v-model="order">
                            <option v-for="(v, i) in orderList" :value="v" :selected="v == order">{{v}}</option>
                        </select>
                    </f7-list-item>
                </f7-list>
            </div>

            <div class="chart_layer" v-for="(v, i) in chart">
                <v-chart :options="v" :auto-resize="false" :ref="v.name"/>
            </div>
        </div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import axios from 'axios';
import moment from 'moment'
import ECharts from 'lib/chart/ECharts.vue';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
export default {
    name: "index",
    components: {
        'v-chart': ECharts,
    },
    props: {
        dataType: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            time: '最近一周',
            timeList: ["最近一周","最近两周","最近一个月","最近两个月","最近三个月","最近半年"],
            order: '全部订单',
            orderList: ['全部订单', '销售订单', '车销单'],
            list: [],
            chart: [],
            typeList: new Set(),
            filter: {
                startTime: '',
                endTime: '',
                orderType: '',
                creator: '',
                status: ''
            }
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
        },
        order () {
            this.filter.orderType = this.order !== '全部订单' ? this.order : ''
            this.load()
        }
    },
    methods: {
        go () {
            this.$f7router.navigate('/psiManage/orderManage/type', {
                props: {
                    dataType: this.dataType,
                }
            })
        },
        load () {
            this.filter.creator = this.personnel.map(v => v._id)
            this.filter.status = "已审批"
            axios.post('api/orderManage/list', this.filter).then(res => {
                if (res.data && res.data.length) {
                    res.data.forEach(v => {
                        if (this.dataType === '商品') {
                            v.commodity.forEach(v1 => {
                                this.typeList.add(v1.commodity.name)
                            })
                        } else if (this.dataType === '客户') {
                            this.typeList.add(v.name)
                        } else {
                            this.typeList.add(v.creator)
                        }
                    })
                    this.list = res.data
                    this.getChart()
                    this.$forceUpdate()
                }
            }).catch(err => {
                console.error(err.message);
                $alert('查询订单数据失败')
            })
        },
        getChart () {
            switch (this.dataType) {
                case '商品':
                    this.getChartCommodity()
                    break;
                case '客户':
                    this.getChartClient()
                    break;
                case '员工':
                    this.getChartEmployee()
                    break;
            }
        },
        getNumber (label, type) {
            let arr = []
            Array.from(this.typeList).forEach((v, i) => {
                arr.push(0)
                this.list.forEach(v1 => {
                    v1.commodity.forEach(v2 => {
                        if (
                            label === 'order' && v2.commodity.name === v ||
                            label === 'client' && v1.name === v ||
                            label === 'employee' && v1.creator === v
                        ) {
                            if (type === 'money') {
                                arr[i] += (v2.salesNumber ? v2.salesNumber * v2.salesPrice : v2.number * v2.price)
                            } else if (type === 'orderNumber') {
                                arr[i]++
                            } else {
                                arr[i] += parseInt(v2.salesNumber || v2.number)
                            }
                        }
                    })
                })
            })
            console.log(label, type, arr)
            return arr
        },
        getChartCommodity () {
            this.chart = [
                {
                    title: {
                        text: '商品订单总金额（单位：元）',
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
                    xAxis: {
                        type: 'category',
                        data: Array.from(this.typeList),
                        axisTick: {
                            alignWithLabel: true
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    grid: {
                        top: '15%',
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    series: [{
                        type: 'bar',
                        name:'总金额',
                        barWidth: '60%',
                        data: this.getNumber('order', 'money'),
                    }],
                    color: ['#FFAB00'],
                    noDataLoadingOption: {
                        text: '暂无数据',
                        effect: 'bubble',
                        effectOption: {
                            effect: {
                                n: 0
                            }
                        }
                    }
                },
                {
                    title: {
                        text: '商品订单个数（单位：个）',
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
                    xAxis: {
                        type: 'category',
                        data: Array.from(this.typeList),
                        axisTick: {
                            alignWithLabel: true
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    grid: {
                        top: '15%',
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    series: [{
                        type: 'bar',
                        name:'总单数',
                        barWidth: '60%',
                        data: this.getNumber('order', 'orderNumber'),
                    }],
                    color: ['#13AEF8'],
                    noDataLoadingOption: {
                        text: '暂无数据',
                        effect: 'bubble',
                        effectOption: {
                            effect: {
                                n: 0
                            }
                        }
                    }
                },
                {
                    title: {
                        text: '商品销售数',
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
                    xAxis: {
                        type: 'category',
                        data: Array.from(this.typeList),
                        axisTick: {
                            alignWithLabel: true
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    grid: {
                        top: '15%',
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    series: [{
                        type: 'bar',
                        name:'总个数',
                        barWidth: '60%',
                        data: this.getNumber('order', 'number'),
                    }],
                    color: ['#FFAB00'],
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
            ]
        },
        getChartClient () {
            this.chart = [
                {
                    title: {
                        text: '客户订单总金额（单位：元）',
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
                    xAxis: {
                        type: 'category',
                        data: Array.from(this.typeList),
                        axisTick: {
                            alignWithLabel: true
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    grid: {
                        top: '15%',
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    series: [{
                        type: 'bar',
                        name:'总金额',
                        barWidth: '60%',
                        data: this.getNumber('client', 'money'),
                    }],
                    color: ['#FFAB00'],
                    noDataLoadingOption: {
                        text: '暂无数据',
                        effect: 'bubble',
                        effectOption: {
                            effect: {
                                n: 0
                            }
                        }
                    }
                },
                {
                    title: {
                        text: '客户订单个数（单位：个）',
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
                    xAxis: {
                        type: 'category',
                        data: Array.from(this.typeList),
                        axisTick: {
                            alignWithLabel: true
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    grid: {
                        top: '15%',
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    series: [{
                        type: 'bar',
                        name:'总单数',
                        barWidth: '60%',
                        data: this.getNumber('client', 'orderNumber'),
                    }],
                    color: ['#13AEF8'],
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
            ]
        },
        getChartEmployee () {
            let employee = []
            Array.from(this.typeList).forEach(async (v,i) => {
                employee[i] = await this.who(v) && this.who(v).name || ''
            })
            this.chart = [
                {
                    title: {
                        text: '员工订单总金额（单位：元）',
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
                    xAxis: {
                        type: 'category',
                        data: employee,
                        axisTick: {
                            alignWithLabel: true
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    grid: {
                        top: '15%',
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    series: [{
                        type: 'bar',
                        name:'总金额',
                        barWidth: '60%',
                        data: this.getNumber('employee', 'money'),
                    }],
                    color: ['#FFAB00'],
                    noDataLoadingOption: {
                        text: '暂无数据',
                        effect: 'bubble',
                        effectOption: {
                            effect: {
                                n: 0
                            }
                        }
                    }
                },
                {
                    title: {
                        text: '员工订单个数（单位：个）',
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
                    xAxis: {
                        type: 'category',
                        data: employee,
                        axisTick: {
                            alignWithLabel: true
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    grid: {
                        top: '15%',
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    series: [{
                        type: 'bar',
                        name:'总单数',
                        barWidth: '60%',
                        data: this.getNumber('employee', 'orderNumber'),
                    }],
                    color: ['#13AEF8'],
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
            ]
        }
    },
    created() {
        // this.load()
    }
}
</script>

<style lang="scss" scoped>
.select_group {
    height: 44px;
    background: #fff;
    display: flex;
    flex-direction: row;


    .select {
        width: 50%;
        list-style: none;
        text-align: center;
        margin: 0;

        &:nth-child(1) {
            border-right: 1px solid #D8D8D8;
        }
    }
}

.chart_layer {
    height: 350px;
    background: #fff;
    padding-bottom: 10px;
}

.pc_content {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

</style>
<style lang="scss">
.orderManage_page .chart_layer .echarts {
    width: 100% !important;
    height: 100% !important;
}
</style>
