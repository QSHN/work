<template>
    <f7-page class="orderManage_page">
        <f7-navbar :title="dataType + '订单列表'" back-link></f7-navbar>

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

            <div class="o_list" v-for="(v, i) in Array.from(typeList)" @click="go(v)">
                <div class="list_l">
                    <div>
                        <p>{{dataType === '员工' ? who(v) && who(v).name : v}}</p>
                        <p>总金额：{{getNumber(dataType === '商品' ? 'order' : dataType === '客户' ? 'client' : 'employee', 'money', v)}} 元</p>
                    </div>
                    <div>
                        <p></p>
                        <p>订单数：{{getNumber(dataType === '商品' ? 'order' : dataType === '客户' ? 'client' : 'employee', 'orderNumber', v)}} 个</p>
                    </div>
                </div>

                <img class="arrow" src='../../../assets/images/arrow_right_gray copy 2@2x.png' style="width: 8px; height: 12px;">
            </div>
        </div>
    </f7-page>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import axios from 'axios';
    import moment from 'moment'
    export default {
        name: "index",
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
                        // console.log(Array.from(this.typeList))
                        this.list = res.data
                        this.$forceUpdate()
                    }
                }).catch(err => {
                    console.error(err.message);
                    $alert('查询订单数据失败')
                })
            },
            getNumber (label, type, v) {
                let number = 0
                this.list.forEach(v1 => {
                    v1.commodity.forEach(v2 => {
                        if (
                            label === 'order' && v2.commodity.name === v ||
                            label === 'client' && v1.name === v ||
                            label === 'employee' && v1.creator === v
                        ) {
                            if (type === 'money') {
                                number += (v2.salesNumber ? v2.salesNumber * v2.salesPrice : v2.number * v2.price)
                            } else if (type === 'orderNumber') {
                                number++
                            } else {
                                number += parseInt(v2.salesNumber || v2.number)
                            }
                        }
                    })
                })
                return number
            },
            go (type) {
                let list = []
                switch (this.dataType) {
                    case '商品':
                        list = this.list.filter(v => v.commodity.filter(v1 => v1.commodity.name === type).length)
                        break;
                    case '客户':
                        list = this.list.filter(v => v.name === type)
                        break;
                    case '员工':
                        list = this.list.filter(v => v.creator === type)
                        break;
                }
                this.$f7router.navigate('/psiManage/orderManage/list', {
                    props: {
                        uList: list
                    }
                })
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
        margin-bottom: 10px;


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
    .o_list {
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #fff;
        padding: 10px 15px;

        .list_l {
            flex-grow: 1;
            font-size: 14px;
            color: #333;
            margin-right: 10px;

            p { margin: 0; }

            div {
                display: flex;
                flex-direction: row;
                align-items: center;

                &:nth-child(1) { margin-bottom: 3px; }
                p:nth-child(1) {
                    flex-grow: 1;
                }
            }
        }
    }
</style>
