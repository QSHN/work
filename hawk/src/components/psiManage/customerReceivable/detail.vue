<template>
    <f7-page  @page:reinit="load">
        <f7-navbar title="客户对账单详情" back-link></f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="commodity_t">
                    <div class="title">
                        {{formData.name}}
                    </div>
                    <p>应收账款：{{formData.sales - (formData.refund > formData['return'] ? formData.refund : formData['return']) - formData.payment}} 元</p>
                    <p>待付欠款：{{formData['return'] - formData.refund}} 元</p>
                </div>

                <div class="date">
                    <p>
                        <span>销售金额：{{formData.sales}}</span>
                        <span>已收金额：{{formData.payment}}</span>
                    </p>
                    <p>
                        <span>退货金额：{{formData['return']}}</span>
                        <span>退款金额：{{formData.refund}}</span>
                    </p>
                </div>

                <div class="customer_group">
                    <span :class="{active: type === 'salesList'}" @click="type = 'salesList'">销售单据</span>
                    <span :class="{active: type === 'paymentList'}" @click="type = 'paymentList'">收款单据</span>
                    <span :class="{active: type === 'returnList'}" @click="type = 'returnList'">退货单据</span>
                    <span :class="{active: type === 'refundList'}" @click="type = 'refundList'">退款单据</span>
                </div>
                <div class="list_item" v-for="(v, i) in formData[type]">
                    <template v-if="type=== 'salesList'">
                        <div class="list1" @click="$f7router.navigate('/psiManage/salesOrder/detail', { props: { detail: v }})">
                            <div class="list_l">
                                <div class="title">
                                    {{v.name}}
                                </div>
                                <p>订单编号：{{v.coding}}</p>
                                <p>销售金额：{{v.allPrice}} 元</p>
                            </div>
                            <img class="arrow" src='../../../assets/images/arrow_right_gray copy 2@2x.png' style="width: 8px; height: 12px;">
                        </div>
                        <div class="item" v-for="(item, i) in v.commodity">
                            <div class="title">
                                <div class="name">{{item.commodity.name}}</div>
                                <span class="label" v-if="item.commodity.label">{{item.commodity.label}}</span>
                            </div>
                            <p>编号： {{item.commodity.coding || '无'}}</p>
                            <p>单价： {{item.price}}元 / {{item.commodity.unit}}</p>
                            <p>销量： {{item.number}} {{item.commodity.unit}}</p>
                            <p>金额： {{item.price * item.number}} 元</p>
                        </div>
                    </template>
                    <template v-else-if="type=== 'returnList'">
                        <div class="list1" @click="$f7router.navigate('/psiManage/salesReturn/detail', { props: { detail: v }})">
                            <div class="list_l">
                                <div class="title">
                                    {{v.name}}
                                </div>
                                <p>订单编号：{{v.coding}}</p>
                                <p>退货金额：{{v.allPrice}} 元</p>
                            </div>
                            <img class="arrow" src='../../../assets/images/arrow_right_gray copy 2@2x.png' style="width: 8px; height: 12px;">
                        </div>
                        <div class="item" v-for="(item, i) in v.commodity">
                            <div class="title">
                                <div class="name">{{item.commodity.name}}</div>
                                <span class="label" v-if="item.commodity.label">{{item.commodity.label}}</span>
                            </div>
                            <p>编号： {{item.commodity.coding || '无'}}</p>
                            <p>单价： {{item.price}}元 / {{item.commodity.unit}}</p>
                            <p>数量： {{item.number}} {{item.commodity.unit}}</p>
                            <p>金额： {{item.price * item.number}} 元</p>
                        </div>
                    </template>
                    <template v-else-if="type=== 'paymentList'">
                        <div class="list1" @click="$f7router.navigate('/psiManage/paymentRegistration/detail', { props: { detail: v }})">
                            <div class="list_l">
                                <div class="title2">
                                    {{v.name}}
                                    <span :class="v.status == '已审批' ? 'tip success' : v.status == '被驳回'  ? 'tip error' : 'tip'">{{v.status}}</span>
                                </div>
                                <p>订单编号：{{v.coding}}</p>
                                <p>待收账款：{{v.receivable}} 元</p>
                            </div>
                            <img class="arrow" src='../../../assets/images/arrow_right_gray copy 2@2x.png' style="width: 8px; height: 12px;">
                        </div>
                    </template>
                    <template v-else-if="type=== 'refundList'">
                        <div class="list1" @click="$f7router.navigate('/psiManage/paymentRegistration/detail', { props: { detail: v, isTK: true }})">
                            <div class="list_l">
                                <div class="title2">
                                    {{v.name}}
                                    <span :class="v.status == '已审批' ? 'tip success' : v.status == '被驳回'  ? 'tip error' : 'tip'">{{v.status}}</span>
                                </div>
                                <p>{{v.coding}}</p>
                                <p>待付欠款：{{v.receivable}} 元</p>
                            </div>
                            <img class="arrow" src='../../../assets/images/arrow_right_gray copy 2@2x.png' style="width: 8px; height: 12px;">
                        </div>
                    </template>
                </div>
            </div>

            <div class="footer">
                <div class="btn error" v-if="formData['return'] > 0" @click="$f7router.navigate('/psiManage/paymentRegistration/update', {
                    props: {
                        uData: null,
                        isTK: true,
                        name: formData.name,
                        payment: formData['return']
                    }
                })">退款</div>
                <div class="btn success" @click="$f7router.navigate('/psiManage/paymentRegistration/update', {
                    props: {
                        uData: null,
                        isTK: false,
                        name: formData.name,
                        payment: formData.sales - formData.refund - formData.payment
                    }
                })">收款</div>
            </div>
        </div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import moment from 'moment'
import axios from 'axios';
export default {
    name: "detail",
    props: {
        detail: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            formData: null,
            type: 'salesList'
        }
    },
    computed: {
        ...mapGetters([
            'who',
            'myUserId',
            'myCompany'
        ])
    },
    methods: {
        moment,
        load () {
            axios.post('api/customerReceivable/list', {
                name: this.formData.name
            }).then(res => {
                if (res.data && res.data.length) {
                    this.formData = res.data[0]
                }
            }).catch(err => {
                console.error(err.message);
                $alert('查询客户对账单失败')
            })
        }
    },
    created () {
        this.formData = this.detail
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
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            flex-grow: 1;
        }
    }

    .commodity,
    .list_item {
        background: #fff;
        margin: 10px 0;
        padding: 0 10px 10px;
        /*overflow: hidden;*/

        .item {
            position: relative;
            background: #F8F8F8;
            border-radius: 4px;
            margin-top: 10px;
            padding: 10px;

            img {
                position: absolute;
                right: 0;
                top: 0;
                width: 30px;
                height: 30px;
            }

            .btn {
                position: absolute;
                right: 0;
                bottom: 0;
                font-size: 14px;
                line-height: 34px;
                padding: 0 10px;
                color: #3385FF;
            }
        }

        .title {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;

            .name {
                font-size: 14px;
                line-height: 14px;
                color: #000;
                margin-right: 10px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            .label {
                font-size: 12px;
                line-height: 12px;
                height: 12px;
                color: #01B38B;
                padding: 1px;
                border: 1px solid #01B38B;
            }
        }

        p {
            font-size: 12px;
            line-height: 12px;
            margin: 5px 0 0;
            color: #999;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .line {
            border-bottom: 1px solid #D8D8D8;
            padding-bottom: 5px;
        }

        .all_price {
            height: 26px;
            line-height: 26px;
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            font-size: 14px;
            color: #333;

            p {
                flex-grow: 1;
                text-align: right;
                margin: 0;
                line-height: 26px;
                font-size: 14px;
                color: #333;
            }
        }
    }

    .commodity_t {
        background: #fff;
        padding: 15px;

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

        p {
            font-size: 14px;
            color: #999;
            margin: 5px 0 0;
        }

        .other {
            font-size: 14px;
            color: #999;
            line-height: 14px;

            div { display: inline-block; }
            .name { margin-left: 5px; }
        }
    }

    .date {
        background: #fff;
        margin: 10px 0;
        padding: 5px 15px;

        p {
            display: flex;
            flex-direction: row;
            font-size: 14px;
            line-height: 14px;
            color: #999;
            margin: 8px 0;

            span {
                display: block;
                &:nth-child(1) {
                    flex-grow: 1;
                }

                &:nth-child(2) {
                    width: 150px;
                }
            }
        }
    }

    .customer_group {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 44px;
        min-height: 44px;
        line-height: 44px;
        border-bottom: 1px solid #D8D8D8;
        text-align: center;
        background: #fff;

        span {
            display: block;
            flex-grow: 1;

            &.active {
                color: #3385FF;
                border-bottom: 2px solid #3385FF;
            }
        }
    }

    .list_item {
        padding: 15px;
        margin: 0;
        border-bottom: 1px solid #D8D8D8;

        .list1 {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .list_l {
            flex-grow: 1;
            margin-right: 15px;
        }

        .title2 {
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
    }

    .footer {
        padding: 0 15px;
        height: 50px;
        min-height: 50px;
        background: #fff;
        border-top: 1px solid #D8D8D8;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .btn {
            flex-grow: 1;
            height: 35px;
            line-height: 35px;
            text-align: center;
            font-size: 16px;
            color: #fff;
            border-radius: 2px;
        }

        .success {
            background: #01B38B;
        }

        .error {
            background: #FF715A;
            margin-right: 15px;
        }
    }

    .submit_button {
        height: 45px;
        line-height: 45px;
        font-size: 16px;
        color: #FFFFFF;
        text-align: center;
        background: rgba(1, 179, 139, 1);
        width: 100%;
    }

    .close_button {
        height: 45px;
        line-height: 45px;
        font-size: 16px;
        color: #FFFFFF;
        text-align: center;
        background: rgb(205, 205, 205);
        width: 100%;
    }
</style>
