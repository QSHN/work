<template>
    <f7-page>
        <f7-navbar title="新增进货单" back-link></f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>进货单号：</label>
                    <div style="float: right">
                        <input class="item-input"
                               type="text"
                               placeholder="请输入"
                               v-model="formData.coding" />
                    </div>
                </div>

                <div class="list-item clear-float" @click="selectClient">
                    <span class="item-icon">*</span>
                    <label>进货仓库：</label>
                    <div style="float: right">
                        <div style="width: 20px; height: 46px; float: right;">
                            <img style="height: 12px; margin-top: 17px;" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                        </div>

                        <input class="item-input"
                               type="text"
                               placeholder="请选择"
                               v-model="formData.warehouse"
                               style="padding-right: 5px;"
                               readonly />
                    </div>
                </div>

                <div class="list-item clear-float" @click="selectCommodity">
                    <span class="item-icon">*</span>
                    <label>商品清单：</label>
                    <div style="float: right">
                        <div class="list_item_btn">添加商品</div>
                    </div>
                </div>

                <div class="commodity" v-if="formData.commodity.length">
                    <div class="item" v-for="(v, i) in formData.commodity">
                        <div class="title">
                            <div class="name">{{v.commodity.name}}</div>
                            <span class="label" v-if="v.commodity.label">{{v.commodity.label}}</span>
                        </div>
                        <p>编号： {{v.commodity.coding || '无'}}</p>
                        <p class="line">规格： {{v.commodity.standard || '无'}}</p>
                        <p>生产日期：{{v.commodity.produced && moment(v.commodity.produced).format('YYYY-MM-DD')}}</p>
                        <p>保质期：{{v.commodity.expiration}} {{v.commodity.expiration && v.commodity.dateUnit}}</p>
                        <p>库存数量：{{v.realNumber}} {{v.commodity.unit}}</p>
                        <p>进货数量：{{v.number}}  {{v.commodity.unit}}</p>
                        <p>进货金额：{{v.number * v.price}} 元</p>
                        <img src="../../../assets/images/icon_prune_gray@2x.png"  @click="formData.commodity.splice(i, 1)" />
                        <div class="btn" @click="selectCommodity(v)">修改</div>
                    </div>
                </div>

                <div class="list-item clear-float textarea-item">
                    <span class="item-icon"></span>
                    <label>备注</label>
                    <textarea  placeholder="请输入"
                               v-model="formData.des"
                               maxlength="500">
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
                                <div class="delete-person" @click="deleteperson(index)">
                                    <img :src=btn_close_small_black width="13" height="13">
                                </div>
                                <span class="spanname">{{item.uid ? who(item.uid).name:"请选择"}}</span>
                            </div>

                            <div class="item-person" v-if="index !== formData.approver.length-1" style="float: left;">
                                <img :src=arrow_process_right_gray style="position: relative; width: 13px;height: 13px; margin: 14px 5px;">
                            </div>
                        </div>
                        <div class="item-selpon" @click="selectorPersonnelShow=true">
                            <div class="item-image">
                                <img :src=btn_add_people width="40px" height="40px">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p>合计金额： <span>{{getAllPrice}}元</span></p>
                <div class="btn" @click="submit">提交</div>
            </div>

            <f7-popup :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
                <permissionselector
                        :noFinanceOrTrative = "true"
                        :isMultiple="true"
                        @employee:selected="onSelectorapprover"
                        @employee:cancel="selectorPersonnelShow = false"
                ></permissionselector>
            </f7-popup>
        </div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import axios from 'axios'
import permissionselector from '../../gadget/permissionselector.vue';
const hp_default_96 = require("assets/images/hp_default_96@2x.png");
const btn_add_people = require("assets/images/btn_add_people@2x.png");
const arrow_process_right_gray = require("assets/images/arrow_process_right_gray@2x.png");
const btn_close_small_black = require("assets/images/btn_close_small_black@2x.png");
const arrow_right_gray = require("assets/images/arrow_right_gray@2x.png");
import moment from 'moment'
export default {
    name: "update",
    components: {
        permissionselector
    },
    props: ['uData'],
    data () {
        return {
            hp_default_96,
            btn_add_people,
            arrow_right_gray,
            btn_close_small_black,
            arrow_process_right_gray,
            formData: {
                coding: `JH${Date.parse(new Date())}${Math.floor(Math.random () * 900) + 100}`,
                warehouse: '',
                commodity: [],
                des: '',
                allPrice: '',
                approver: [],
                status: '待审批',
            },
            warehouse: null,
            selectorPersonnelShow: false
        }
    },
    computed: {
        ...mapGetters([
            'who',
            'myCompany',
            'myProfile',
            'departmentName'
        ]),
        getAllPrice () {
            this.formData.allPrice = this.formData.commodity.reduce((all, v) => all += v.number * v.price, 0).toFixed(2)
            return this.formData.allPrice
        }
    },
    methods: {
        moment,
        deleteperson(index){
            this.formData.approver.splice(index,1)
        },
        selectClient () {
            this.$f7router.navigate('/selectList', {
                props: {
                    isAdd: true,
                    which: {
                        name: '仓库',
                        type: 'warehouse'
                    },
                    url: 'warehouse/',
                    choose: (type, val) => {
                        this.formData.warehouse = val.name
                        this.warehouse = val
                        this.$f7router.back()
                    }
                }
            })
        },
        selectCommodity (defaultVal) {
            if (!this.formData.warehouse) {
                $alert('请先选择进货仓库', () => {
                    this.selectClient()
                })
            } else {
                this.$f7router.navigate('/selectCommodity', {
                    props: {
                        cId: defaultVal && defaultVal.commodity && defaultVal.commodity._id || '',
                        commodity: this.formData.commodity,
                        inventoryType: '进货',
                        warehouse: this.warehouse,
                        choose: (val) => {
                            this.formData.commodity = val
                            this.$f7router.back()
                        }
                    }
                })
            }
        },
        onSelectorapprover(ulist){
            this.selectorPersonnelShow = false;
            this.formData.approver = [];
            ulist.forEach(v => {
                this.formData.approver.push({
                    uid: v,
                    comment: '',
                    status: '待审批'
                })
            })
            this.$forceUpdate();
        },
        submit () {
            if (!this.formData.warehouse) {
                $alert('请选择盘点仓库')
            } else if (!this.formData.commodity.length) {
                $alert('请添加商品')
            } else if (!this.formData.approver.length) {
                $alert('请选择审批人')
            } else {
                $confirm(`是否确定${this.uData ? '更新' : '新增'}该订货单`, () => {
                    axios[this.uData ? 'post' : 'put']('api/purchase/', this.formData).then(res => {
                        $alert(`进货单${this.uData ? '更新' : '新增'}成功`, () => {
                            this.$f7router.back();
                        });
                        if (cordova.plugins.aMapLocation) {
                            this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: `进货单`})
                        }
                    }).catch(err => {
                        console.error(err.message);
                        $alert(`进货单${this.uData ? '更新' : '新增'}失败`);
                    })
                })
            }
        }
    },
    mounted() {
        if (this.uData) {
            this.formData = this.uData
        } else {
            this.formData.creator = this.myProfile._id
        }
    }
}
</script>


<style lang="scss" scoped>
    .p_content {
        height: 100%;
        display: flex;
        flex-direction: column;

        .pc_layer {
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
        min-height: 90px !important;
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
        &:last-child { margin-left: 20px; }
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
        margin: -1px 0 10px 0;
        padding: 0 10px 10px;
        /*overflow: hidden;*/

        .item {
            position: relative;
            background: #F8F8F8;
            border-radius: 4px;
            margin-top: 10px;
            padding: 10px;

            &:nth-child(1) { margin-top: 0; }


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

