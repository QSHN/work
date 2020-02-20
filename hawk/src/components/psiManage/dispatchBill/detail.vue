<template>
    <f7-page>
        <f7-navbar title="发货单详情" back-link></f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="commodity_t">
                    <div class="title">
                        {{formData.name}}
                        <span :class="formData.shippingStatus ? 'tip success' :  'tip'">{{formData.shippingStatus ? '已发货' : '待发货'}}</span>
                    </div>
                    <p>订单编号：{{formData.coding}}</p>
                    <p>订单日期：{{moment(formData.createdAt).format('YYYY-MM-DD HH:mm:ss')}}</p>
                    <p>申请人：{{who(formData.creator) && who(formData.creator).name}}</p>
                    <p>发货仓库：{{formData.warehouse}}</p>
                    <p>交货日期：{{moment(formData.time).format('YYYY-MM-DD HH:mm:ss')}}</p>
                    <p v-if="formData.shipper">发货人：{{who(formData.shipper) && who(formData.shipper).name}}</p>
                    <p>收货人：{{formData.contactName}}</p>
                    <p>联系号码：{{formData.contactPhone}}</p>
                    <p>交货地址：{{formData.contactAddress}}</p>
                    <p class="line">订单备注：{{formData.des || '无'}}</p>
                    <p>合计金额：{{formData.allPrice}} 元</p>
                    <p>本单优惠：{{formData.receivable ? formData.receivable < formData.allPrice ? formData.allPrice - formData.receivable : 0 : ''}} 元</p>
                    <p>本单应收：{{formData.receivable}} 元</p>
                </div>

                <div class="commodity" v-if="formData.commodity.length">
                    <div class="all_price">
                        <span>商品清单</span>
                        <p>共{{formData.commodity.length}}种</p>
                    </div>

                    <div class="item" v-for="(v, i) in formData.commodity">
                        <div class="title">
                            <div class="name">{{v.commodity.name}}</div>
                            <span class="label" v-if="v.commodity.label">{{v.commodity.label}}</span>
                        </div>
                        <p>编号： {{v.commodity.coding || '无'}}</p>
                        <p>规格： {{v.commodity.standard || '无'}}</p>
                        <p>销售： {{parseInt(v.number)}} {{v.commodity.unit}}</p>
                        <p>赠送： {{parseInt(v.giveNumber)}} {{v.commodity.unit}}</p>
                        <p>单价： {{v.price}} 元</p>
                    </div>
                </div>
            </div>

            <div v-if="!formData.shippingStatus" class="submit-button" @click="submit">发货</div>
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
            formData: null
        }
    },
    computed: {
        ...mapGetters([
            'who',
            'myUserId'
        ])
    },
    methods: {
        moment,
        load () {
            axios.get('api/salesOrder/id/' + this.formData._id).then(res => {
                if (res.data) {
                    this.formData = res.data
                }
            }).catch(err => {
                console.error(err.message);
                $alert('获取订单详情失败')
            })
        },
        submit () {
            let data = Object.assign({}, this.formData)
            data.shippingStatus = true
            data.shipper = this.myUserId
            $confirm('确定发货吗？', '操作确认', () => {
                axios.post('api/salesOrder/', data).then(res => {
                    $alert('发货成功', () => {
                        this.load()
                    });
                    if (cordova.plugins.aMapLocation) {
                        this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: `发货`})
                    }
                }).catch(err => {
                    // console.error(err.message);
                    $alert(err.response.data.message)
                })
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

    .list_item_btn {
        margin: 13px 12px 0 0;
        width: 70px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: #3385FF;
        font-size: 12px;
        color: #fff;
        border-radius: 20px;
    }
    .clear-float {
        clear:both;
        height: 0;
        line-height: 0;
        font-size: 0;
    }
    .textarea-item{
        height: 120px!important;
    }
    .textarea-item textarea{
        width: 100%;
        background:none;
        outline:none;
        border:0px;
        float: left;
        font-size: 14px;
        line-height: 1.5em;
        margin-top: -10px;
        padding-right: 15px;
        padding-left: 20px;
        box-sizing: border-box;
        height: 70%;
        color: #333;
    }

    .item_t {
        height: 44px;
        line-height: 44px;
        padding: 0 15px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .title {
            font-size: 14px;
            color: #666;
        }

        .delete {
            width: 80px;
            text-align: right;
            font-size: 12px;
            color: #FF715A;
        }
    }
    .list-item{
        background: #FFFFFF;
        width: 100%;
        height: 46px;
        font-size: 14px;
        line-height: 46px;
        border-bottom: 1px solid #f8f8f8;

    }
    .list-type {

        background: white;
        line-height: 45px;
        font-size: 14px;
        margin-top: 0px;
        margin-bottom: 0px;
    }
    .list-type div{
        display: inline-block;
        width: 50%;
        text-align: right;
        float: right;
        margin-right: 10px;
        color: darkgray;
    }
    .item-icon{
        display: inline-block;
        color: red;
        width: 18px;
        text-align: right;
    }

    .list-item .item-input{
        width: 150px;
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

    .photo-item{

        background: #FFFFFF;
        width: 100%;
        font-size: 14px;
        line-height: 30px;
        min-height: 90px!important;
        margin-bottom: 10px;
        padding-bottom: 10px;
    }

    .item-selpon{
        /*width: 60px;*/
        height: 60px;
        margin-top: 5px;
        /*margin-left: 20px;*/
        float: left;
        &:nth-child(1){ margin-left: 10px; }
    }
    .item-selpon .item-image{

        width: 40px;
        margin: 0 auto;
        height: 40px;
        background-color: gainsboro;
        /*float: top;*/
        border-radius:20px;
        overflow: hidden;
    }
    .item-selpon span{
        display: block;
        font-size: 12px;
        text-align: center;
    }

    .spanname{
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 60px;
        line-height: 20px;
        /*background: red;*/
        position: relative;
        /*right: 5px;*/
    }

    .delete-person{
        width: 13px;
        height: 13px;
        top: -8px;
        right: 0;
        position: absolute;
        display: inline-block;
    }

    .submit-button{
        width:100%;
        height:45px;
        line-height: 45px;
        font-size:16px;
        color: #FFFFFF;
        text-align: center;
        background:#3385FF;
        margin-top: 50px;
    }
    .item-person{
        position: relative;
        float: left;
    }


    .commodity {
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

        .line {
            border-bottom: 1px solid #D8D8D8;
            padding-bottom: 5px;
        }

        .other {
            font-size: 14px;
            color: #999;
            line-height: 14px;

            div { display: inline-block; }
            .name { margin-left: 5px; }
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
</style>
