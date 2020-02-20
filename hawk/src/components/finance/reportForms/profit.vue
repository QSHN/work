<template>
    <f7-page>
        <f7-navbar title="利润表" back-link>
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

            <table style="width: 100%; line-height: 32px; font-size: 14px; background: #fff;">
                <thead>
                    <td style="border: 1px solid #dcdee2; border-right: none; text-align: center; width: 60%;">项目</td>
                    <td style="border: 1px solid #dcdee2; text-align: center; width: 20%;">本期金额</td>
                    <td style="border: 1px solid #dcdee2; border-left: none; text-align: center; width: 20%;">上期金额</td>
                </thead>
                <tbody>
                    <tr v-for="(v, i) in tableData" :key="i">
                        <td :style="{
                              border: '1px solid #dcdee2',
                              borderRight: 'none',
                              borderTop: 'none',
                              paddingLeft: (v.padding + 10) + 'px',
                              width: '60%'
                          }">
                            {{v.title}}
                        </td>
                        <td style="border: 1px solid #dcdee2; border-top: none; text-align: right; width: 20%; padding-right: 10px;">
                            {{v.val !== undefined ? formatMoney(v.val, '', 2) : ''}}
                        </td>
                        <td style="border: 1px solid #dcdee2; border-top: none; border-left: none; text-align: right; width: 20%; padding-right: 10px;">
                            {{v.lastVal !== undefined ? formatMoney(v.lastVal, '', 2) : ''}}
                        </td>
                    </tr>
                </tbody>
            </table>
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
    name: "profit",
    props: {
        accountSet: {
            type: Object,
            required: true
        }
    },
    components: {
        DatePicker
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
                    slot: 'title'
                },
                {
                    title: '本期金额',
                    align: 'center',
                    slot: 'now'
                },
                {
                    title: '上期金额',
                    align: 'center',
                    slot: 'last'
                }
            ]
        }
    },
    watch: {
        search () {
            this.load()
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
                let { profit } = res.data
                this.tableData = profit
                this.load()
            }).catch(err => {
                $alert(err.message)
            })
        },
        load () {
            let time = ''
            let lastTime = ''
            if (this.search.accountingPeriodEnd) {
                time = this.moment(new Date(this.search.accountingPeriodEnd)).format('YYYY-M')
                let ap = this.moment(new Date(this.search.accountingPeriod)).format('YYYY-M').split('-')
                if (ap[1] === '1') {
                    lastTime = (parseInt(ap[0]) - 1) + '-' + 12
                } else {
                    lastTime = ap[0] + '-' + (parseInt(ap[1]) - 1)
                }
            } else {
                if (this.search.accountingPeriod) {
                    time = this.moment(new Date(this.search.accountingPeriod)).format('YYYY-M')
                    let ap = time.split('-')
                    if (ap[1] === '1') {
                        lastTime = (parseInt(ap[0]) - 1) + '-' + 12
                    } else {
                        lastTime = ap[0] + '-' + (parseInt(ap[1]) - 1)
                    }
                }
            }
            if (time && lastTime) this.getValue(time, lastTime)
        },
        getValue (time, lastTime) {
            let formula = (list, fTime, fLastTime) => {
                let val = 0
                list.forEach((v, i) => {
                    if (v.list.length > 1) {
                        val = NP[i === 0 ? 'plus' : list[i - 1].type === 'add' ? 'plus' : 'minus'](val, this.getFormula(v.list[0], v.list[1], fTime, fLastTime, v.fetch))
                    } else {
                        val = NP[i === 0 ? 'plus' : list[i - 1].type === 'add' ? 'plus' : 'minus'](val, this.getFormula(v.list[0], null, fTime, fLastTime, v.fetch))
                    }
                })
                return val
            }
            this.tableData.forEach(v => {
                if (v.formula1) {
                    if (v.formula1.type === 'ACCT') v.val = formula(v.formula1.child, time, null)
                }
                if (v.formula2) {
                    if (v.formula2.type === 'ACCT') v.lastVal = formula(v.formula2.child, null, lastTime)
                }
                if (!v.formula1 && !v.val) v.val = null
                if (!v.formula2 && !v.lastVal) v.lastVal = null
            })
            this.calculate(null, 'tableData')
        },
        getFormula (code, codeEnd, time, lastTime, type) {
            let val = 0
            this.subjectList.forEach(v => {
                let direction = v.balance === '借方'
                if (
                    (codeEnd && v.code >= code && v.code <= codeEnd && !v.pFirstId) ||
                    (!codeEnd && v.code === code)
                ) {
                    let fData = v.eachBalance.find(f => (time && f.time === time) || (lastTime && f.time === lastTime))
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
                            v.val = this.total(v.formula1.child, this[whichTable])
                            this.$set(this[whichTable][i].formula1, 'val', v.val)
                        }
                    }
                    if (v.formula2) {
                        if (v.formula2.type === 'SUM') {
                            v.lastVal = this.total(v.formula2.child, this[whichTable])
                            this.$set(this[whichTable][i].formula2, 'lastVal', v.lastVal)
                        }
                    }
                })
            }
            update(this[whichTable])
            update(this[whichTable])
            $preloader.hide()
        },
        total (list, tableData) {
            let val = 0
            list.forEach((v, i) => {
                let startType = v.list[0].charAt(0)
                let startWhich = parseInt(v.list[0].substr(1, v.list[0].length - 1))
                if (v.list.length > 1) {
                    let endWhich = parseInt(v.list[1].substr(1, v.list[1].length - 1))
                    let totalVal = 0
                    for (let index = startWhich; index <= endWhich; index++) {
                        totalVal = NP.plus(totalVal, tableData[index - 1][startType === 'B' ? 'val' : 'lastVal'] || 0)
                    }
                    val = NP[i === 0 ? 'plus' : list[i - 1].type === 'add' ? 'plus' : 'minus'](val, totalVal)
                } else {
                    val = NP[i === 0 ? 'plus' : list[i - 1].type === 'add' ? 'plus' : 'minus'](val, tableData[startWhich - 1][startType === 'B' ? 'val' : 'lastVal'] || 0)
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
</style>
