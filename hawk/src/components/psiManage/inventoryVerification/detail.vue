<template>
    <f7-page  @page:reinit="load">
        <f7-navbar title="盘点详情" back-link>
            <f7-nav-right>
                <f7-link href="#" v-if="formData.status === '草稿' && formData.creator === myUserId" @click="selectPicker">操作</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="commodity_t">
                    <div class="title">
                        {{formData.coding}}
                        <span :class="formData.status == '已入账' ? 'tip success' : formData.status == '草稿' || formData.status == '被驳回' ? 'tip error' : 'tip'">{{formData.status}}</span>
                    </div>
                    <p>盘点类型：{{formData.inventoryType}}</p>
                    <p>盘点仓库：{{formData.warehouse}}</p>
                    <p>经办人：{{who(formData.operator) && who(formData.operator).name}}</p>
                    <p>提交日期：{{moment(formData.createdAt).format('YYYY-MM-DD HH:mm:ss')}}</p>
                    <p v-if="formData.status == '被驳回'" style="color: red">驳回理由：{{formData.approver.reduce((val, v) => val += v.comment, '')}}</p>
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
                        <p>仓库数量： {{v.realNumber}} {{v.commodity.unit}}</p>
                        <p>实际数量： {{v.number}} {{v.commodity.unit}}</p>
                        <p>差异数量： {{v.number - v.realNumber}} {{v.commodity.unit}}</p>
                    </div>
                </div>

                <div class="list-item clear-float textarea-item">
                    <span class="item-icon"></span>
                    <label>备注</label>
                    <textarea  :value="formData.des || '无'"
                               maxlength="500"
                               readonly>
                    </textarea>
                </div>

                <div class="list-item photo-item" style="min-height: 115px !important;">
                    <span class="item-icon">*</span>
                    <label>审批人</label>
                    <div class="clearfix">
                        <div class="item-selpon" v-for="(item,index) in formData.approver">
                            <div class="item-person">
                                <div class="item-image">
                                    <img :src="item.uid && who(item.uid).avatarUrl || hp_default_96" width="40px" height="40px" style="float: left">
                                </div>
                                <span class="spanname">{{item.uid && who(item.uid).name}}</span>
                                <span class="spanname"
                                      :style="{
                                      lineHeight: '14px',
                                      fontSize: '12px',
                                      color: item.status == '已批准' ? '#01B38B' : item.status == '被驳回' ? '#FF715A' : '#FFAB00'}">
                                    {{item.status || '待审批'}}
                                </span>
                            </div>

                            <div class="item-person" v-if="index !== formData.approver.length-1" style="float: left;">
                                <img :src=arrow_process_right_gray style="position: relative; width: 13px;height: 13px; margin: 14px 5px;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer" v-if="isShow">
                <div class="btn error" @click="reject">驳回</div>
                <div class="btn success" @click="agree">同意</div>
            </div>
        </div>
    </f7-page>
</template>

<script>
const hp_default_96 = require("assets/images/hp_default_96@2x.png");
const arrow_process_right_gray = require("assets/images/arrow_process_right_gray@2x.png");
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
            hp_default_96,
            arrow_process_right_gray,
            formData: null
        }
    },
    computed: {
        ...mapGetters([
            'who',
            'myUserId'
        ]),
        isShow () {
            if (this.formData.status !== '草稿') {
                let list = this.formData.approver
                for (let i = 0; i < list.length; i++) {
                    if (list[i].status === '已驳回') {
                        return false
                    } else if (list[i].status === '待审批') {
                        return list[i].uid === this.myUserId
                    }
                }
            } else {
                return false
            }
        }
    },
    methods: {
        moment,
        load () {
            axios.get('api/inventoryVerification/id/' + this.formData._id).then(res => {
                if (res.data) {
                    this.formData = res.data
                }
            }).catch(err => {
                console.error(err.message);
                $alert('库存盘点获取内容失败')
            })
        },
        reject () {
            $prompt('请输入驳回原因', '驳回原因', (name) => {
                if (!name) {
                    $alert('驳回原因不能为空', '操作错误');
                    return;
                }
                let data = Object.assign({}, this.formData)
                data.approver.forEach(v => {
                    if (v.uid === this.myUserId) {
                        v.status = '被驳回'
                        v.comment = name
                        data.status = '被驳回'
                        this.$forceUpdate()
                    }
                })
                axios.post('api/inventoryVerification', data).then(res => {
                    $preloader.hide();
                    $alert('驳回成功！', () => {
                        this.$f7router.back()
                    })
                    if (cordova.plugins.aMapLocation) {
                        this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: `驳回库存盘点`})
                    }
                }).catch(err => {
                    $preloader.hide();
                    $alert('驳回失败！')
                })
            })
        },
        agree () {
            $confirm('确定通过该库存盘点吗？', () => {
                $preloader.show();
                let data = Object.assign({}, this.formData)
                data.approver.forEach((v, i) => {
                    if (v.uid === this.myUserId) {
                        v.status = '已批准'
                        if (i == data.approver.length - 1) {
                            data.status = '已入账'
                        }
                        this.$forceUpdate()
                    }
                })
                axios.post('api/inventoryVerification', data).then(res => {
                    $preloader.hide();
                    $alert('审批成功！', () => {
                        this.$f7router.back()
                    })
                    if (cordova.plugins.aMapLocation) {
                        this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: `审批通过库存盘点`})
                    }
                }).catch(err => {
                    $preloader.hide();
                    $alert('审批失败！')
                })
            })
        },
        selectPicker() {
            $dialog.create({
                title: '操作',
                buttons: [
                    { text: '修改', onClick:  this.update },
                    { text: '删除', onClick: this.deleteFun },
                    { text: '取消'},
                ],
                verticalButtons: true,
            }).open();
        },
        update () {
            this.$f7router.navigate('/psiManage/inventoryVerification/update', {
                props: {
                    uData: this.formData
                }
            })
        },
        deleteFun () {
            $confirm('确定删除该库存盘点吗？', () => {
                $preloader.show();
                axios.delete('api/inventoryVerification/'+ this.formData._id).then(res => {
                    $preloader.hide();
                    $alert('删除成功！', () => {
                        this.$f7router.back()
                    })
                }).catch(err => {
                    $preloader.hide();
                    $alert('删除失败！')
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
