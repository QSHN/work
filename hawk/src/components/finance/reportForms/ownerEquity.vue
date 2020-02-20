<template>
    <f7-page>
        <f7-navbar title="所有者权益变动表" back-link>
        </f7-navbar>

        <div class="p_c">
            <div class="list-item list-type">
                <label>选择期间</label>
                <div>
                    <date-picker v-model="search.accountingPeriod"
                                 type="month"
                                 :editable="false"
                                 class="date-picker"
                                 width="150px"
                                 :confirm="true"
                                 :confirm-text="'确定'"
                                 placeholder="   选择期间"
                                 format="YYYY-MM"
                                 :minute-step="1">
                    </date-picker>
                </div>
            </div>

            <div v-for="(v, i) in tableData" :key="i" class="oe_list">
                <div class="title">{{v.title}}</div>
                <ul class="oe_list">
                    <li class="title1">本年金额</li>
                    <li>负实收基本（或股本）：<span>{{v.val1 !== undefined ? formatMoney(v.val1, '', 2) : ''}}</span></li>
                    <li>资本公积：<span>{{v.val2 !== undefined ? formatMoney(v.val2, '', 2) : ''}}</span></li>
                    <li>减：库存股：<span>{{v.val3 !== undefined ? formatMoney(v.val3, '', 2) : ''}}</span></li>
                    <li>盈余公积：<span>{{v.val4 !== undefined ? formatMoney(v.val4, '', 2) : ''}}</span></li>
                    <li>未分配利润：<span>{{v.val5 !== undefined ? formatMoney(v.val5, '', 2) : ''}}</span></li>
                    <li>所有者权益合计: <span>{{v.val6 !== undefined ? formatMoney(v.val6, '', 2) : ''}}</span></li>
                    <li class="title1">上年金额</li>
                    <li>负实收基本（或股本）：<span>{{v.val7 !== undefined ? formatMoney(v.val7, '', 2) : ''}}</span></li>
                    <li>资本公积：<span>{{v.val8 !== undefined ? formatMoney(v.val8, '', 2) : ''}}</span></li>
                    <li>减：库存股：<span>{{v.val9 !== undefined ? formatMoney(v.val9, '', 2) : ''}}</span></li>
                    <li>盈余公积：<span>{{v.val10 !== undefined ? formatMoney(v.val10, '', 2) : ''}}</span></li>
                    <li>未分配利润：<span>{{v.val11 !== undefined ? formatMoney(v.val11, '', 2) : ''}}</span></li>
                    <li>所有者权益合计：<span>{{v.val12 !== undefined ? formatMoney(v.val12, '', 2) : ''}}</span></li>
                </ul>
            </div>


        </div>
    </f7-page>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import axios from 'axios'
import NP from 'number-precision'
import { formatMoney } from 'accounting'
import moment from 'moment'
export default {
    name: "ownerEquity",
    props: {
        accountSet: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            search: {
                accountingPeriod: null
            },
            tableData: [],
            subjectList: [],
            columns: [
                {
                    align: 'center',
                    type: 'index',
                    width: 50
                },
                {
                    title: '项目',
                    align: 'center',
                    slot: 'title',
                    width: 400
                },
                {
                    title: '本年金额',
                    align: 'center',
                    children: [
                        {
                            title: '实收基本（或股本）',
                            align: 'center',
                            slot: 'a',
                            width: 150
                        },
                        {
                            title: '资本公积',
                            align: 'center',
                            slot: 'b',
                            width: 150
                        },
                        {
                            title: '减：库存股',
                            align: 'center',
                            slot: 'c',
                            width: 150
                        },
                        {
                            title: '盈余公积',
                            align: 'center',
                            slot: 'd',
                            width: 150
                        },
                        {
                            title: '未分配利润',
                            align: 'center',
                            slot: 'e',
                            width: 150
                        },
                        {
                            title: '所有者权益合计',
                            align: 'center',
                            slot: 'f',
                            width: 150
                        }
                    ]
                },
                {
                    title: '上年金额',
                    align: 'center',
                    children: [
                        {
                            title: '实收基本（或股本）',
                            align: 'center',
                            slot: 'g',
                            width: 150
                        },
                        {
                            title: '资本公积',
                            align: 'center',
                            slot: 'h',
                            width: 150
                        },
                        {
                            title: '减：库存股',
                            align: 'center',
                            slot: 'i',
                            width: 150
                        },
                        {
                            title: '盈余公积',
                            align: 'center',
                            slot: 'j',
                            width: 150
                        },
                        {
                            title: '未分配利润',
                            align: 'center',
                            slot: 'k',
                            width: 150
                        },
                        {
                            title: '所有者权益合计',
                            align: 'center',
                            slot: 'l',
                            width: 150
                        }
                    ]
                }
            ]
        }
    },
    components: {
        DatePicker
    },
    watch: {
        search () {
            if (this.search.accountingPeriod) {
                this.getValue()
            }
        }
    },
    methods: {
        formatMoney,
        moment,
        loadSubject () {
            axios.post(CONFIG.server.tradeApiUrl + 'subject/subject/query', {
                accountSetId: this.accountSet._id
            }).then(res => {
                this.subjectList = res.data
                this.loadFormula()
            }).catch(err => {
                $alert(err.message)
                $preloader.hide();
            })
        },
        loadFormula () {
            axios.post(CONFIG.server.tradeApiUrl + 'formula/formulaQuery', {
                accountSetId: this.accountSet._id
            }).then(res => {
                let { ownerEquity } = res.data
                this.tableData = ownerEquity
                this.getValue()
            }).catch(err => {
                this.$Notice.error({
                    title: '公式',
                    desc: err.message
                })
            })
        },
        getValue () {
            let time = this.moment(new Date(this.search.accountingPeriodEnd || this.search.accountingPeriod)).format('YYYY-M')
            let year = time.split('-')[0]
            let formula = (list, fTime, fYear) => {
                let val = 0
                list.forEach((v, i) => {
                    if (v.list.length > 1) {
                        val = NP[i === 0 ? 'plus' : list[i - 1].type === 'add' ? 'plus' : 'minus'](val, this.getFormula(v.list[0], v.list[1], fTime, fYear, v.fetch))
                    } else {
                        val = NP[i === 0 ? 'plus' : list[i - 1].type === 'add' ? 'plus' : 'minus'](val, this.getFormula(v.list[0], null, fTime, fYear, v.fetch))
                    }
                })
                return val
            }
            this.tableData.forEach(v => {
                if (v.formula1) {
                    if (v.formula1.type === 'ACCT') v.val1 = formula(v.formula1.child, time, null)
                } else {
                    if (!v.val1) v.val1 = null
                }

                if (v.formula2) {
                    if (v.formula2.type === 'ACCT') v.val2 = formula(v.formula2.child, time, null)
                } else {
                    if (!v.val2) v.val2 = null
                }

                if (v.formula3) {
                    if (v.formula3.type === 'ACCT') v.val3 = formula(v.formula3.child, time, null)
                } else {
                    if (!v.val3) v.val3 = null
                }

                if (v.formula4) {
                    if (v.formula4.type === 'ACCT') v.val4 = formula(v.formula4.child, time, null)
                } else {
                    if (!v.val4) v.val4 = null
                }

                if (v.formula5) {
                    if (v.formula5.type === 'ACCT') v.val5 = formula(v.formula5.child, time, null)
                } else {
                    if (!v.val5) v.val5 = null
                }

                if (v.formula6) {
                    if (v.formula6.type === 'ACCT') v.val6 = formula(v.formula6.child, time, null)
                } else {
                    if (!v.val6) v.val6 = null
                }

                if (v.formula7) {
                    if (v.formula7.type === 'ACCT') v.val7 = formula(v.formula7.child, null, year)
                } else {
                    if (!v.val7) v.val7 = null
                }

                if (v.formula8) {
                    if (v.formula8.type === 'ACCT') v.val8 = formula(v.formula8.child, null, year)
                } else {
                    if (!v.val8) v.val8 = null
                }

                if (v.formula9) {
                    if (v.formula9.type === 'ACCT') v.val9 = formula(v.formula9.child, null, year)
                } else {
                    if (!v.val9) v.val9 = null
                }

                if (v.formula10) {
                    if (v.formula10.type === 'ACCT') v.val10 = formula(v.formula10.child, null, year)
                } else {
                    if (!v.val10) v.val10 = null
                }

                if (v.formula11) {
                    if (v.formula11.type === 'ACCT') v.val11 = formula(v.formula11.child, null, year)
                } else {
                    if (!v.val11) v.val11 = null
                }

                if (v.formula12) {
                    if (v.formula12.type === 'ACCT') v.val12 = formula(v.formula12.child, null, year)
                } else {
                    if (!v.val12) v.val12 = null
                }
            })
            this.calculate(null, 'tableData')
        },
        getFormula (code, codeEnd, time, year, type) {
            let val = 0
            this.subjectList.forEach(v => {
                let direction = v.balance === '借方'
                if (
                    (codeEnd && v.code >= code && v.code <= codeEnd && !v.pFirstId) ||
                    (!codeEnd && v.code === code)
                ) {
                    let fData = null
                    if (time) {
                        fData = v.eachBalance.find(f => f.time === time)
                    } else if (year) {
                        fData = v.eachYearBalance.find(f => f.time === year)
                    }
                    if (fData) {
                        switch (type) {
                            case 'Y':
                                val = NP.plus(val, NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](fData.beginningBalance || 0, fData.borrower || 0), fData.lender || 0))
                                break
                            case 'JY':
                                if (direction) val = NP.plus(val, NP.minus(NP.plus(fData.beginningBalance || 0, fData.borrower || 0), fData.lender || 0))
                                break
                            case 'DY':
                                if (!direction) val = NP.plus(val, NP.minus(NP.plus(fData.beginningBalance || 0, fData.lender || 0), fData.borrower || 0))
                                break

                            case 'C':
                                val = NP.plus(val, fData.beginningBalance || 0)
                                break
                            case 'JC':
                                if (direction) val = NP.plus(val, fData.beginningBalance || 0)
                                break
                            case 'DC':
                                if (!direction) val = NP.plus(val, fData.beginningBalance || 0)
                                break

                            case 'JF':
                                val = NP.plus(val, fData.borrower || 0)
                                break
                            case 'DF':
                                val = NP.plus(val, fData.lender || 0)
                                break

                            case 'SY':
                                if (direction) {
                                    val = NP.minus(fData.borrower || 0, fData.lender || 0)
                                } else {
                                    val = NP.minus(fData.lender || 0, fData.borrower || 0)
                                }
                                break
                        }
                    }
                }
            })
            return val
        },
        calculate (row, whichTable, type) {
            if (row && whichTable && type) {
                this[whichTable][row._index][type] = row[type]
            }

            let update = (list) => {
                list.forEach((v, i) => {
                    if (v.formula1) {
                        if (v.formula1.type === 'SUM') {
                            v.val1 = this.total(v.formula1.child, this[whichTable])
                            this.$set(this[whichTable][i].formula1, 'val1', v.val1)
                        }
                    }
                    if (v.formula2) {
                        if (v.formula2.type === 'SUM') {
                            v.val2 = this.total(v.formula2.child, this[whichTable])
                            this.$set(this[whichTable][i].formula2, 'val2', v.val2)
                        }
                    }
                    if (v.formula3) {
                        if (v.formula3.type === 'SUM') {
                            v.val3 = this.total(v.formula3.child, this[whichTable])
                            this.$set(this[whichTable][i].formula3, 'val3', v.val3)
                        }
                    }
                    if (v.formula4) {
                        if (v.formula4.type === 'SUM') {
                            v.val4 = this.total(v.formula4.child, this[whichTable])
                            this.$set(this[whichTable][i].formula4, 'val4', v.val4)
                        }
                    }
                    if (v.formula5) {
                        if (v.formula5.type === 'SUM') {
                            v.val5 = this.total(v.formula5.child, this[whichTable])
                            this.$set(this[whichTable][i].formula5, 'val5', v.val5)
                        }
                    }
                    if (v.formula6) {
                        if (v.formula6.type === 'SUM') {
                            v.val6 = this.total(v.formula6.child, this[whichTable])
                            this.$set(this[whichTable][i].formula6, 'val6', v.val6)
                        }
                    }
                    if (v.formula7) {
                        if (v.formula7.type === 'SUM') {
                            v.val7 = this.total(v.formula7.child, this[whichTable])
                            this.$set(this[whichTable][i].formula7, 'val7', v.val7)
                        }
                    }
                    if (v.formula8) {
                        if (v.formula8.type === 'SUM') {
                            v.val8 = this.total(v.formula8.child, this[whichTable])
                            this.$set(this[whichTable][i].formula8, 'val8', v.val8)
                        }
                    }
                    if (v.formula9) {
                        if (v.formula9.type === 'SUM') {
                            v.val9 = this.total(v.formula9.child, this[whichTable])
                            this.$set(this[whichTable][i].formula9, 'val9', v.val9)
                        }
                    }
                    if (v.formula10) {
                        if (v.formula10.type === 'SUM') {
                            v.val10 = this.total(v.formula10.child, this[whichTable])
                            this.$set(this[whichTable][i].formula10, 'val10', v.val10)
                        }
                    }
                    if (v.formula11) {
                        if (v.formula11.type === 'SUM') {
                            v.val11 = this.total(v.formula11.child, this[whichTable])
                            this.$set(this[whichTable][i].formula11, 'val11', v.val11)
                        }
                    }
                    if (v.formula12) {
                        if (v.formula12.type === 'SUM') {
                            v.val12 = this.total(v.formula12.child, this[whichTable])
                            this.$set(this[whichTable][i].formula12, 'val12', v.val12)
                        }
                    }
                })
            }
            update(this[whichTable])
            update(this[whichTable])
            $preloader.hide();
        },
        getWhichType (type) {
            let which = 'val'
            switch (type) {
                case 'B':
                    which += 1
                    break
                case 'C':
                    which += 2
                    break
                case 'D':
                    which += 3
                    break
                case 'E':
                    which += 4
                    break
                case 'F':
                    which += 5
                    break
                case 'G':
                    which += 6
                    break
                case 'H':
                    which += 7
                    break
                case 'I':
                    which += 8
                    break
                case 'J':
                    which += 9
                    break
                case 'K':
                    which += 10
                    break
                case 'L':
                    which += 11
                    break
                case 'M':
                    which += 2
                    break
            }
            return which
        },
        total (list, tableData) {
            let val = 0
            list.forEach((v, i) => {
                let startType = v.list[0].charAt(0)
                let whichType = this.getWhichType(startType)
                let startWhich = parseInt(v.list[0].substr(1, v.list[0].length - 1))
                if (v.list.length > 1) {
                    let endWhich = parseInt(v.list[1].substr(1, v.list[1].length - 1))
                    let totalVal = 0
                    for (let index = startWhich; index <= endWhich; index++) {
                        totalVal = NP.plus(totalVal, tableData[index - 1][whichType] || 0)
                    }
                    val = NP[i === 0 ? 'plus' : list[i - 1].type === 'add' ? 'plus' : 'minus'](val, totalVal)
                } else {
                    val = NP[i === 0 ? 'plus' : list[i - 1].type === 'add' ? 'plus' : 'minus'](val, tableData[startWhich - 1][whichType] || 0)
                }
            })
            return val
        }
    },
    mounted () {
        this.search.accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
        this.loadSubject()
        $preloader.show();
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

    .oe_list {
        background: #fff;
        margin: 10px 0 0;
        padding: 0 10px 10px;

        .title {
            height: 46px;
            line-height: 46px;
            background: #fff;
            font-size: 14px;
            color: #666;
            font-weight: bold;
            border-bottom: 1px solid #d8d8d8;
        }

        ul {
            list-style: none;
            margin: 0;
            padding: 0;

            li {
                font-size: 14px;
                color: #666;
                margin: 6px 0 0 0;
                padding-left: 20px;
                display: flex;
                justify-content: space-between;
                padding-right: 20px;
            }

            .title1 {
                padding: 0;
            }
        }
    }
</style>
