<template>
    <f7-page>
        <f7-navbar title="库存详情" back-link></f7-navbar>

        <div class="pc_content">
            <div class="commodity_t">
                <div class="title">{{detail.name}}</div>
                <p>{{detail.coding}}</p>
                <div class="other">
                    <div class="time">{{moment(detail.createdAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
                    <div class="name">{{who(detail.creator) && who(detail.creator).name}}</div>提交
                </div>
            </div>

            <div class="commodity" v-if="detail.commodity.length">
                <div class="item" v-for="(v, i) in detail.commodity">
                    <div class="title">
                        <div class="name">{{v.commodity.name}}</div>
                        <span class="label" v-if="v.commodity.label">{{v.commodity.label}}</span>
                    </div>
                    <p>编号： {{v.commodity.coding || '无'}}</p>
                    <p class="line">规格： {{v.commodity.standard || '无'}}</p>
                    <p>{{(v.price)}}元 / 个 X {{v.number}} 个</p>
                    <p>总金额： {{v.price * v.number}}元</p>
                </div>

                <div class="all_price">
                    <span>合计金额</span>
                    <p>{{getAllPrice()}}元</p>
                </div>
            </div>

            <div class="list-item photo-item" style="height: 110px; margin-top: 10px">
                <span class="item-icon"></span>
                <label>相片 ({{detail.photos.length}} / 5)</label>
                <div style="margin-left: 5px;">
                    <photoeditor
                            slot="inner"
                            :gallery="true"
                            :photos="detail.photos"
                            :readonly="true">
                    </photoeditor>
                </div>
            </div>

            <div class="list-item clear-float textarea-item">
                <span class="item-icon"></span>
                <label>备注</label>
                <textarea  :value="detail.des || '无'"
                           maxlength="500"
                           readonly>
                </textarea>
            </div>
        </div>
    </f7-page>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import photoeditor from '../../gadget/photoeditor.vue';
    import moment from 'moment'
    export default {
        name: "detail",
        components: {
            photoeditor
        },
        props: {
            detail: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
            }
        },
        computed: {
            ...mapGetters([
                'who'
            ])
        },
        methods: {
            moment,
            getAllPrice () {
                return this.detail.commodity.reduce((all, v) => all + v.price * v.number, 0);
            }
        }
    }
</script>

<style lang="scss" scoped>
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
        width: 60px;
        height: 60px;
        margin-top: 17px;
        margin-left: 20px;
        float: left;

    }
    .item-selpon .item-image{

        width: 40px;
        margin: 0 auto;
        height: 40px;
        background-color: gainsboro;
        float: top;
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
        width: 30px;
        line-height: 20px;
        /*background: red;*/
        position: relative;
        right: 5px;
    }

    .delete-person{
        width: 10px;
        height: 10px;
        float: left;
        bottom: 45px;
        left: 33px;
        position: relative;
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

        p {
            font-size: 14px;
            color: #999;
            margin: 0;
        }

        .other {
            font-size: 14px;
            color: #999;
            line-height: 14px;

            div { display: inline-block; }
            .name { margin-left: 5px; }
        }
    }
</style>
