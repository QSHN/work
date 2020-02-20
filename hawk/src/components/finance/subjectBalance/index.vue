<template>
    <f7-page>
        <f7-navbar title="科目" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="selectAccountSet">选择账套</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="p_content">
            <div>
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
                <div class="list-item" style="background: #f8f8f8;">
                    <label>搜索</label>
                    <input class="item-input"
                           type="text"
                           placeholder="搜索科目"
                           v-model="search" />
                </div>
            </div>

            <div class="s_list" v-for="(v, i) in getSubjectList" :key="i" @click="go(v.code, v.name)">
                <div class="list_t">{{v.code}}{{v.name}}</div>
                <div class="list_c">
                    <div class="title">
                        期初余额
                        <span :class="{active: getDirection(v.beginningBalance, v.direction) === '借'}">
                            {{getDirection(v.beginningBalance, v.direction)}}
                        </span>
                    </div>
                    <div class="money">{{formatMoney(v.beginningBalance, '', 2)}}</div>
                </div>
                <div class="list_c">
                    <div class="title">
                        本月借方发生额
                    </div>
                    <div class="money">{{formatMoney(v.borrower, '', 2)}}</div>
                </div>
                <div class="list_c">
                    <div class="title">
                        本月贷方发生额
                    </div>
                    <div class="money">{{formatMoney(v.lender, '', 2)}}</div>
                </div>
                <div class="list_c">
                    <div class="title">
                        期末余额
                        <span :class="{active: getDirection(v.balance, v.direction) === '借'}">
                            {{getDirection(v.balance, v.direction)}}
                        </span>
                    </div>
                    <div class="money">{{formatMoney(v.balance, '', 2)}}</div>
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
    data () {
        return {
            currentId: 1,
            accountingPeriod: null,
            search: '',
            accountList: [],
            accountSet: null,
            tableData: []
        }
    },
    computed: {
        ...mapGetters([
            'myProfile'
        ]),
        getSubjectList () {
            let list = this.tableData
            if (this.search) {
                list = list.filter(v => v.code.includes(this.search) || v.name.includes(this.search))
                list = list.filter(v => list.find(f => v._id === f._id || v.pFirstId === f._id || v.pSecondId === f._id))
            }
            return list
        }
    },
    watch: {
        accountingPeriod () {
            this.loadSubject()
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
        updateMyInfo (accountSetId) {
            this.$store.dispatch('SAVE_USER_KEY', { accountSetId: accountSetId })
        },
        selectAccountSet () {
            let buttons = []
            this.accountList.forEach(v => {
                if (!(v.status === '编辑中' || v.status === '已停用' || v.status === '已删除')) {
                    buttons.push({
                        text: v.accountSetName,
                        onClick: () => {
                            this.updateMyInfo(v._id)
                            this.updateAccountSet()
                            this.$forceUpdate()
                        }
                    })
                }
            })
            buttons.push({
                text: '取消'
            })
            $dialog.create({
                title: '选择账套',
                buttons: buttons,
                verticalButtons: true,
            }).open();
        },
        updateAccountSet () {
            let accountSet = this.accountList.find(v => v._id === this.myProfile.accountSetId)
            this.accountSet = accountSet
            this.accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
        },
        loadSubject () {
            axios.post(CONFIG.server.tradeApiUrl + 'credentials/generalLedger', {
                accountSetId: this.accountSet._id,
                subjectCode: null,
                subjectCodeEnd: null,
                accountingPeriod: this.accountingPeriod,
                post: true,
                detail: false
            }).then(res => {
                let { subject, credentials, detail } = res.data
                let list = []
                let period = this.moment(new Date(this.accountingPeriod)).format('YYYY-MM-DD').split('-')
                let periodEnd = period
                let pushFun = (v, time, endTime) => {
                    let info = v.eachBalance.find(e => e.time === time)
                    let direction = v.balance === '借方'
                    let borrower = credentials.reduce((total, c) => {
                        c.child.forEach(cc => {
                            if (cc.subjectCode.includes(v.code)) {
                                total = NP.plus(total, cc.borrower || 0)
                            }
                        })
                        return total
                    }, 0)
                    let lender = credentials.reduce((total, c) => {
                        c.child.forEach(cc => {
                            if (cc.subjectCode.includes(v.code)) {
                                total = NP.plus(total, cc.lender || 0)
                            }
                        })
                        return total
                    }, 0)
                    let allBorrow = v.eachBalance.reduce((total, c) => {
                        if (c.time >= time && c.time <= endTime) {
                            total = NP.plus(total, c.borrower || 0)
                        }
                        return total
                    }, 0)
                    let allLender = v.eachBalance.reduce((total, c) => {
                        if (c.time >= time && c.time <= endTime) {
                            total = NP.plus(total, c.lender || 0)
                        }
                        return total
                    }, 0)
                    let beginningBalance = 0
                    if (v.balance === '借方') {
                        beginningBalance = NP.minus(NP.plus(v.beginningBalance || 0, v.yearBorrow || 0), v.yearCredit || 0)
                    } else {
                        beginningBalance = NP.minus(NP.plus(v.beginningBalance || 0, v.yearCredit || 0), v.yearBorrow || 0)
                    }
                    let obj = {
                        child: detail.filter(f => f.code === v.code),
                        code: v.code,
                        name: v.name,
                        mnemonic: v.mnemonic,
                        borrower: NP.plus(allBorrow, borrower),
                        lender: NP.plus(allLender, lender),
                        beginningBalance: info ? info.beginningBalance || 0 : beginningBalance || 0,
                        yearBorrow: NP.plus(allBorrow, borrower),
                        yearCredit: NP.plus(allLender, lender),
                        direction: v.balance,
                        isParent: subject.filter(f => (f.pFirstId && f.pFirstId.toString() === v._id.toString()) || (f.pSecondId && f.pSecondId.toString() === v._id.toString())).length,
                        pFirstId: v.pFirstId,
                        pSecondId: v.pSecondId
                    }
                    obj.balance = NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](obj.beginningBalance || 0, obj.borrower || 0), obj.lender || 0)
                    if (obj.borrower || obj.lender || obj.beginningBalance || obj.balance || obj.yearBorrow || obj.yearCredit) {
                        list.push(obj)
                    }
                }
                subject.forEach(v => {
                    pushFun(v, period[0] + '-' + parseInt(period[1]), periodEnd[0] + '-' + parseInt(periodEnd[1]))
                })
                this.tableData = list
                // console.log(this.tableData)
            }).catch(err => {
                $alert(err.message)
            })
        },
        go (code, name) {
            let p = this.moment(new Date(this.accountingPeriod)).format('YYYY-MM-DD').split('-')
            let time = p[0] + '-' + (parseInt(p[1]))
            this.$f7router.navigate('/finance/detailAccount/detail', {
                props: {
                    accountSet: this.accountSet,
                    subjectCode: code,
                    subjectName: name,
                    period: time
                }
            })
        }
    },
    created() {
        $preloader.show();
        axios.post(CONFIG.server.tradeApiUrl + 'accountSet/query', {
            companyId: this.myProfile.bClientId
        }).then(res => {
            $preloader.hide();
            this.accountList = res.data
            if (!this.myProfile.accountSetId) {
                this.selectAccountSet()
            } else {
               this.updateAccountSet()
            }
            this.loadSubject()
        }).catch(err => {
            $alert('查询账套列表失败')
            $preloader.hide();
        })
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

    .s_list {
        background: #fff;
        border-bottom: 1px solid #f8f8f8;
        margin-bottom: 10px;
        padding: 5px 20px;

        .list_t {
            font-size: 16px;
            color: #000;
            line-height: 36px;
        }

        .list_c {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            height: 20px;

            .title {
                display: flex;
                font-size: 12px;
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

            .money {
                color: #999999;
            }
        }
    }
</style>
