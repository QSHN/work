<template>
    <f7-page>
        <f7-navbar title="凭证" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="selectAccountSet">选择账套</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="p_content">
            <div class="page_scroll">
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
                           placeholder="搜索摘要/科目"
                           v-model="search" />
                </div>

                <ol class="c_nav" >
                    <li v-for="(v, i) in getTableData" @click="go(v)">
                        <div class="info">
                            <div class="title">
                                {{v.child[0].abstract}}
                                <span :class="v.post || v.audit ? 'tip success' : v.invalid  ? 'tip error' : 'tip'">{{v.post ? '已过账' : v.invalid  ? '已作废' : v.audit ? '已审核' : ''}}</span>
                            </div>
                            <div class="other">
                                <span style="margin-right: 5px;">{{moment(v.time).format('YYYY-MM-DD')}}</span>
                                {{v.proofWords}} - {{v.certificateNumber}}
                            </div>
                        </div>
                        <div class="money">
                            <span style="font-size: 18px;">{{getTotal(v.child)}}</span>
                            <img class="arrow" src="../../../assets/images/arrow_right_gray.png"/>
                        </div>
                    </li>
                </ol>
            </div>

            <div class="add-button" @click="add">
                <img :src="add_img" width="55px" height="55px">
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
const add_img = require("assets/images/btn_oval_add_green@2x.png");
export default {
    name: "index",
    components: {
        DatePicker
    },
    data () {
        return {
            add_img,
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
        getTableData () {
            let list = this.tableData
            if (this.search) {
                list = list.filter(v => v.child.find(f => {
                    return (
                        f.abstract.includes(this.search) ||
                        f.subjectCode.includes(this.search) ||
                        f.subject.includes(this.search)
                    )
                }))
            }
            return list
        }
    },
    watch: {
        accountingPeriod () {
            this.loadCredentials()
        }
    },
    methods: {
        moment,
        formatMoney,
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
            this.loadCredentials()
        },
        loadCredentials () {
            axios.post(CONFIG.server.tradeApiUrl + 'credentials/query', {
                accountSetId: this.myProfile.accountSetId,
                month: this.accountingPeriod
            }).then(res => {
                this.tableData = res.data
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
        go (printData) {
            this.$f7router.navigate('/finance/credentials/detail', {
                props: {
                    printData,
                    accountSet: this.accountSet
                }
            })
        },
        add () {
            this.$f7router.navigate('/finance/credentials/add', {
                props: {
                    accountSet: this.accountSet
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

    .c_nav {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            background: #fff;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #f8f8f8;
            align-items: center;
            padding: 0 20px;

            .info {
                padding: 10px 0;
                .title {
                    font-size: 16px;
                    line-height: 16px;
                    display: flex;

                    .tip {
                        font-size: 12px;
                        margin-left: 10px;

                        &.success {
                            color: #01B38B;
                        }

                        &.error {
                            color: #FF715A;
                        }
                    }
                }

                .other {
                    color: #999;
                    margin-top: 5px;
                    font-size: 12px;
                    line-height: 12px;
                    margin-right: 5px;
                }
            }
        }
    }

    .p_content {
        position: relative;
        height: 100%;
        overflow: hidden;

        .page_scroll {
            height: 100%;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }

        .add-button{
            position: absolute;
            bottom: 20px;
            right: 20px;
            width:55px;
            height:55px;
            z-index: 99;
        }
    }
</style>
