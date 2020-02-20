<template>
    <f7-page>
        <f7-navbar title="明细账" back-link></f7-navbar>

        <div class="p_content">
            <div class="list-item">
                <label>当前账套</label>
                <span style="padding-right: 20px;">{{accountSet && accountSet.accountSetName}}</span>
            </div>
            <div class="list-item list-type">
                <label>选择期间</label>
                <div>
                    <date-picker v-model="accountingPeriod"
                                 type="month"
                                 :editable="false"
                                 class="date-picker"
                                 width="90px"
                                 :confirm="true"
                                 :confirm-text="'确定'"
                                 placeholder=""
                                 format="YYYY-MM"
                                 :minute-step="1">
                    </date-picker>
                </div>
            </div>

            <div class="subject_info" v-if="tableData.balance">
                <div class="title">
                    {{subjectCode}} {{subjectName}}
                </div>

                <ul>
                    <li>
                        <div class="li_t">
                            {{tableData.balance.time.split('-')[1] === '1' ? '年初' : '期初'}}余额
                            <span :class="{active: getDirection(tableData.balance.beginningBalance || 0, tableData.balance.balance) === '借'}">
                                {{getDirection(tableData.balance.beginningBalance || 0, tableData.balance.balance)}}
                            </span>
                        </div>
                        <div class="money">{{tableData.balance && formatMoney(tableData.balance.beginningBalance || 0, '', 2)}}</div>
                    </li>
                    <li>
                        <div class="li_t">
                            期末余额
                            <span :class="{active: getDirection(total('all'), tableData.balance.balance) === '借'}">
                                {{getDirection(total('all'), tableData.balance.balance)}}
                            </span>
                        </div>
                        <div class="money">{{formatMoney(total('all'), '', 2)}}</div>
                    </li>
                </ul>
            </div>

            <div class="c_list_layer" v-for="(v, i) in tableData.list" :key="i">
                <div class="c_list" v-for="(v1, i1) in v.day" :key="i1">
                    <div class="left">
                        {{v1.time.split('-')[1]}}月{{v1.time.split('-')[2]}}日
                    </div>

                    <div class="right">
                        <ul>
                            <li v-for="(v2, i2) in v1.child" :key="i2" @click="go(v2._id)">
                                <div class="icon">
                                     <span :class="{active: parseFloat(v2.borrower) !== 0}">
                                        {{parseFloat(v2.borrower) !== 0 ? '借' : '贷'}}
                                    </span>
                                </div>
                                <div class="li_c">
                                    <p>{{formatMoney(parseFloat(v2.borrower) !== 0 ? v2.borrower : v2.lender, '', 2)}}</p>
                                    <p>{{v2.abstract}}</p>
                                </div>
                                <img class="arrow" src="../../../assets/images/arrow_right_gray.png"/>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import axios from 'axios'
import DatePicker from 'vue2-datepicker'
import moment from 'moment'
import NP from 'number-precision'
import { formatMoney } from 'accounting'
export default {
    name: "index",
    components: {
        DatePicker
    },
    props: {
        accountSet: {
            type: Object,
            required: true
        },
        subjectCode: {
            type: String,
            required: true
        },
        subjectName: {
            type: String,
            required: true
        },
        period: {
            type: String
        }
    },
    data () {
        return {
            accountingPeriod: null,
            search: '',
            tableData: {},
            credentialsList: []
        }
    },
    computed: {
        ...mapGetters([
            'myProfile'
        ])
    },
    watch: {
        accountingPeriod () {
            this.loadCredentials()
        }
    },
    methods: {
        moment,
        formatMoney,
        getDirection (money, direction) {
            if (money === 0) {
                return '平'
            } else {
                return direction ? direction.charAt(0) : ''
            }
        },
        total (type) {
            let direction = this.tableData.balance.balance === '借方'
            let money = type === 'all' ? this.tableData.balance.beginningBalance : 0
            this.tableData.list.forEach(v => {
                v.day.forEach(d => {
                    money = d.child.reduce((total, v) => {
                        if (type === 'all') {
                            if (v.borrower) {
                                total = NP[direction ? 'plus' : 'minus'](total, v.borrower)
                            } else if (v.lender) {
                                total = NP[direction ? 'minus' : 'plus'](total, v.lender)
                            }
                        } else if (type === 'borrower') {
                            total = NP.plus(total, v.borrower || 0)
                        } else {
                            total = NP.plus(total, v.lender || 0)
                        }
                        return total
                    }, money)
                })
            })
            return money
        },
        loadCredentials () {
            axios.post(CONFIG.server.tradeApiUrl + 'credentials/credentialsSubject', {
                accountSetId: this.myProfile.accountSetId,
                accountingPeriod: this.accountingPeriod,
                subjectCode: this.subjectCode
            }).then(res => {
                let { balance, list } = res.data
                let arr = []
                let total = balance.beginningBalance
                this.credentialsList = list
                list.forEach(v => {
                    let findData = arr.find(a => a.accountingPeriod === v.accountingPeriod)
                    let subjectList = JSON.parse(JSON.stringify(
                        v.child.filter(c => {
                            let isIt = c.subjectCode.includes(this.subjectCode)
                            return isIt
                        })
                    ))
                    subjectList.forEach(s => {
                        s.time = v.time
                        s.proofWords = v.proofWords
                        s.certificateNumber = v.certificateNumber
                        s._id = v._id
                    })
                    if (findData) {
                        let day = findData.day.find(d => this.moment(d.time).format('YYYY-MM-DD') === this.moment(v.time).format('YYYY-MM-DD'))
                        if (day) {
                            day.child = day.child.concat(subjectList)
                        } else {
                            findData.day.push({
                                time: this.moment(v.time).format('YYYY-MM-DD'),
                                child: subjectList
                            })
                        }
                    } else {
                        arr.push({
                            accountingPeriod: v.accountingPeriod,
                            day: [{
                                time: this.moment(v.time).format('YYYY-MM-DD'),
                                child: subjectList
                            }]
                        })
                    }
                })
                arr.map(v => {
                    v.day.map(d => {
                        d.child.map(c => {
                            if (c.borrower) {
                                total = NP[balance.balance === '借方' ? 'plus' : 'minus'](total, c.borrower)
                            } else if (c.lender) {
                                total = NP[balance.balance === '借方' ? 'minus' : 'plus'](total, c.lender)
                            }
                            c.balance = total
                        })
                        d.balance = d.child[d.child.length - 1].balance
                        d.borrower = d.child.reduce((total, r) => (total = NP.plus(total, r.borrower || 0)), 0)
                        d.lender = d.child.reduce((total, r) => (total = NP.plus(total, r.lender || 0)), 0)
                    })
                    v.balance = v.day[v.day.length - 1].balance
                    v.borrower = v.day.reduce((total, r) => (total = NP.plus(total, r.borrower || 0)), 0)
                    v.lender = v.day.reduce((total, r) => (total = NP.plus(total, r.lender || 0)), 0)
                })
                this.tableData = {
                    balance,
                    list: arr
                }
                console.log(this.tableData)
            }).catch(err => {
                $alert(err.message)
            })
        },
        getTotal (list) {
            let result = list.reduce((total, v) => (
                total = NP.plus(total, v.borrower ? Number(v.borrower) : 0)
            ), 0)
            return this.formatMoney(result, '', 2)
        },
        go (id) {
            this.$f7router.navigate('/finance/credentials/detail', {
                props: {
                    printData: this.credentialsList.find(f => f._id === id),
                    accountSet: this.accountSet
                }
            })
        }
    },
    mounted () {
        if (this.period) {
            this.accountingPeriod = this.period
        } else {
            this.accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
        }
    }
}
</script>

<style lang="scss" scoped>
    .list-item{
        background: #FFFFFF;
        /*width: 100%;*/
        height: 46px;
        font-size: 14px;
        line-height: 46px;
        border-bottom: 1px solid #f8f8f8;
        margin: 0;
        padding: 0 0 0 20px;
        display: flex;
        justify-content: space-between;
    }

    .list-type div{
        width: 50%;
        text-align: right;
        margin-right: 10px;
        color: darkgray;
    }
    .list-item .item-input{
        width: 50%;
        background:none;
        outline:none;
        border:0px;
        float: right;
        text-align: right;
        font-size: 14px;
        line-height: 46px;
        padding-right: 15px;
        box-sizing: border-box;
        color: #333;
    }

    .subject_info {
        background: #fff;
        border-bottom: 1px solid #f8f8f8;
        overflow: hidden;
        padding: 0 15px;
        margin-bottom: 10px;

        .title {
            font-size: 16px;
            margin-top: 8px;
        }

        ul {
            list-style: none;
            margin: 0;
            padding: 0;

            li {
                height: 36px;
                line-height: 36px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .li_t {
                    display: flex;
                    font-size: 16px;
                    align-items: center;

                    span {
                        width: 20px;
                        height: 20px;
                        border-radius: 20px;
                        font-size: 12px;
                        line-height: 20px;
                        text-align: center;
                        margin-left: 10px;
                        display: block;
                        color: red;
                        background: #fee1e1;

                        &.active {
                            color: blue;
                            background: #c9dffa;
                        }
                    }
                }

                &:first-child {
                    border-bottom: 1px solid #f8f8f8;
                }
            }
        }
    }

    .c_list_layer {
        background: #fff;
        border-top: 1px solid #f8f8f8;
        overflow: hidden;

        .c_list {
            display: flex;
            flex-direction: row;
            border-bottom: 1px solid #f8f8f8;
            padding: 0 15px 0;

            .left {
                width: 60px;
                text-align: center;
                line-height: 34px;
                padding-right: 15px;
            }

            .right {
                display: flex;
                flex-grow: 1;

                ul {
                    width: 100%;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                li {
                    height: 50px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #f8f8f8;
                    padding: 0 10px;

                    .icon {
                        height: 100%;
                        span {
                            width: 20px;
                            height: 20px;
                            border-radius: 20px;
                            font-size: 12px;
                            line-height: 20px;
                            text-align: center;
                            margin-right: 10px;
                            display: block;
                            color: red;
                            background: #fee1e1;
                            margin-top: 8px;

                            &.active {
                                color: blue;
                                background: #c9dffa;
                            }
                        }
                    }


                    .li_c {
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;

                        p {
                            margin: 0;
                            height: 20px;
                            line-height: 20px;

                            &:nth-child(1) {
                                font-size: 14px;
                                color: #000;
                                margin-top: 3px;
                            }

                            &:nth-child(2) {
                                font-size: 12px;
                                color: #999;
                            }
                        }
                    }

                    img {}
                }
            }
        }
    }
</style>
