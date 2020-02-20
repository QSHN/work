<template>
    <f7-page @page:reinit="load">
        <f7-navbar title="客户应收" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="searchFun">搜索</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="list_item" v-for="(v, i) in list"
                     v-if="v.salesList.length > 0"
                     @click="$f7router.navigate('/psiManage/customerReceivable/detail', { props: { detail: v }})">
                    <div class="list_l">
                        <div class="title">
                            {{v.name}}
                        </div>
                        <p>应收账款： {{v.sales - (v.refund > v['return'] ? v.refund : v['return']) - v.payment}} 元</p>
                        <p>应付欠款： {{v['return'] - v.refund}} 元</p>
                    </div>

                    <img class="arrow" src='../../../assets/images/arrow_right_gray copy 2@2x.png' style="width: 8px; height: 12px;">
                </div>
            </div>

            <div class="footer">
                <p>应收账款： <span>{{getAllPrice}}元</span></p>
                <div class="btn" @click="$f7router.navigate('/psiManage/paymentRegistration/update')">立即收款</div>
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
    data () {
        return {
            list: [],
            filter: {
                name: '',
                operator: '',
                startTime: '',
                endTime: '',
                operatorId: null
            }
        }
    },
    computed: {
        ...mapGetters([
            'superAdmin',
            'myUserId',
            'myProfile',
            'who',
            'userDepartment',
            'isDepartmentAdmin',
            'personnel'
        ]),
        pList() {
            if (this.superAdmin._id == this.myUserId) return this.personnel;

            // non-admin can only has itself
            let d = this.userDepartment(this.myUserId);
            if (!d.admin.includes(this.myUserId)) return this.personnel.filter(p => p._id == this.myUserId);

            // admin can has all its subordinates
            let subordinates = (function listE(d) {
                return d.employees.slice(0).concat(
                    d.sub.reduce((accum, s) => {return accum.concat(listE(s))}, [])
                ) || [];
            })(d);

            subordinates = subordinates.filter(id => !(d.admin.includes(id) && id !== this.myUserId))
            return this.personnel.filter(p => subordinates.includes(p._id))
        },
        getAllPrice () {
            return this.list.reduce((all, v) => all += (v.sales - (v.refund > v['return'] ? v.refund : v['return']) - v.payment), 0).toFixed(2)
        }
    },
    methods: {
        moment,
        searchFun () {
            this.$f7router.navigate('/psiManage/customerReceivable/search', {
                props: {
                    search: (val) => {
                        this.filter = {...val}
                        if (val.startTime) this.filter.startTime = new Date(val.startTime).toHawkDateString() + ' 00:00:00.000'
                        if (val.endTime) this.filter.endTime = new Date(val.endTime).toHawkDateString() + ' 23:59:59.999'
                        this.filter.operatorId = this.filter.operator ? [this.filter.operator] : null
                        this.load()
                        this.$f7router.back()
                    }
                }
            })
        },
        load () {
            this.filter.operator = this.filter.operatorId || this.pList.map(v => v._id)
            axios.post('api/customerReceivable/list', this.filter).then(res => {
                if (res.data) {
                    this.list = res.data
                }
            }).catch(err => {
                console.error(err.message);
                $alert('查询客户应收列表失败')
            })
        }
    },
    created() {
        this.load()
    }
}
</script>

<style lang="scss" scoped>
.p_content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .pc_layer {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;

        .select_group {
            width: 100%;
            height: 44px;
            background: #fff;

            .select {
                list-style: none;
                text-align: center;
                margin: 0;
            }
        }
    }


    .list_item {
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #fff;
        padding: 15px;
        border-bottom: 1px solid #D8D8D8;

        .list_l {
            flex-grow: 1;
        }

        .title {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            font-size: 15px;
            color: #000;
            line-height: 15px;

            .tip {
                font-size: 12px;
                line-height: 12px;
                height: 12px;
                padding: 1px;
                color: #FFAB00;
                border: 1px solid #FFAB00;

                &.success {
                    color: #01B38B;
                    border: 1px solid #01B38B;
                }

                &.error {
                    color: #FF715A;
                    border: 1px solid #FF715A;
                }
            }
        }

        .other {
            font-size: 14px;
            color: #999;
            line-height: 14px;
            padding: 10px 0;
            border-bottom: 1px solid #D8D8D8;

            div { display: inline-block; }
            .name { margin-left: 5px; }
        }

        p {
            font-size: 14px;
            color: #666;
            margin: 6px 0 0 0;
        }
    }
}
.bt_add {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 55px;
    height: 55px;
    text-align: center;
    line-height: 50px;
    font-size: 18px;
    z-index: 99;
}
.footer {
    height: 50px;
    min-height: 50px;
    font-size: 16px;
    color: #333333;
    text-align: center;
    box-shadow: 0 0 5px rgba(0, 0, 0, .15);
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 15px;
    background: #fff;

    p {
        flex-grow: 1;
        text-align: left;
        margin: 0;

        span {
            color: #3385FF;
        }
    }

    .btn {
        width: 80px;
        height: 36px;
        line-height: 36px;
        background: #3385FF;
        color: #fff;
    }
}
</style>
