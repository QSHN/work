<template>
    <f7-page>
        <f7-navbar :title="backName" back-link></f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="list-item clear-float" @click="createCar">
                    <span class="item-icon">*</span>
                    <label>换货车辆：</label>
                    <div style="float: right">
                        <div style="width: 20px; height: 46px; float: right;">
                            <img style="height: 12px; margin-top: 17px;" src='../../../../assets/images/arrow_right_gray copy 2@2x.png'>
                        </div>

                        <input class="item-input"
                               type="text"
                               placeholder="请创建"
                               v-model="formData.numberPlate"
                               style="padding-right: 5px;"
                               readonly />
                    </div>
                </div>

                <div class="list-item clear-float" @click="selectWarehouse">
                    <span class="item-icon">*</span>
                    <label>归还仓库：</label>
                    <div style="float: right">
                        <div style="width: 20px; height: 46px; float: right;">
                            <img style="height: 12px; margin-top: 17px;" src='../../../../assets/images/arrow_right_gray copy 2@2x.png'>
                        </div>

                        <input class="item-input"
                               type="text"
                               placeholder="请选择"
                               v-model="formData.warehouse"
                               style="padding-right: 5px;"
                               readonly />
                    </div>
                </div>

                <div class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>商品清单：</label>
                </div>

                <div class="commodity" v-if="formData.commodity.length">
                    <div class="item" v-for="(v, i) in formData.commodity">
                        <div class="title">
                            <div class="name">{{v.commodity.name}}</div>
                            <span class="label" v-if="v.commodity.label">{{v.commodity.label}}</span>
                        </div>
                        <p>编号： {{v.commodity.coding || '无'}}</p>
                        <p class="line">规格： {{v.commodity.standard || '无'}}</p>
                        <p>车载库存： {{v.realNumber}}</p>
                        <template v-if="backType === 'return'">
                            <p>退货： {{v.returnNumber}}</p>
                        </template>
                        <template v-else-if="backType === 'swap'">
                            <p>换货： {{v.swapNumber}}</p>
                        </template>
                        <p>归还： {{v.number}}</p>
                        <template v-if="backType !== 'all'">
                            <p>备注： {{v.des || '无'}}</p>
                            <img src="../../../../assets/images/icon_prune_gray@2x.png" @click="formData.commodity.splice(i, 1)" />
                            <div class="btn" @click="selectCommodity(v)">修改</div>
                        </template>
                    </div>
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

            <div class="submit-button" @click="submit">提交</div>

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
    import permissionselector from '../../../gadget/permissionselector.vue';
    const hp_default_96 = require("assets/images/hp_default_96@2x.png");
    const btn_add_people = require("assets/images/btn_add_people@2x.png");
    const arrow_process_right_gray = require("assets/images/arrow_process_right_gray@2x.png");
    const btn_close_small_black = require("assets/images/btn_close_small_black@2x.png");
    const arrow_right_gray = require("assets/images/arrow_right_gray@2x.png");
    export default {
        name: "index",
        components: {
            permissionselector
        },
        props: ['uData', 'backType', 'backName'],
        data () {
            return {
                hp_default_96,
                btn_add_people,
                arrow_right_gray,
                btn_close_small_black,
                arrow_process_right_gray,
                formData: {
                    numberPlate: '',
                    warehouse: '',
                    commodity: [],
                    approver: [],
                    status: '待审批',
                    backType: ''
                },
                selectorPersonnelShow: false
            }
        },
        computed: {
            ...mapGetters([
                'who',
                'myUserId'
            ])
        },
        methods: {
            deleteperson(index){
                this.formData.approver.splice(index,1)
            },
            createCar () {
                this.$f7router.navigate('/psiManage/carSales/car/update', {
                    props: {
                        uData: null,
                        isMyCreated: true,
                        update: (val) => {
                            this.formData.numberPlate = val
                        }
                    }
                })
            },
            selectWarehouse () {
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
                if (!this.formData.numberPlate) {
                    $alert('请先创建自己的提货车辆', () => {
                        this.createCar()
                    })
                } else if (!this.formData.warehouse) {
                    $alert('请先选择归还仓库', () => {
                        this.selectWarehouse()
                    })
                } else {
                    let backNumber = 0
                    if (this.backType === 'return') {
                        backNumber = defaultVal.returnNumber
                    } else if (this.backType === 'swap') {
                        backNumber = defaultVal.swapNumber
                    } else if (this.backType === 'part') {
                        backNumber = defaultVal.number
                    }
                    this.$f7router.navigate('/selectCommodity', {
                        props: {
                            cId: defaultVal && defaultVal.commodity && defaultVal.commodity._id || '',
                            commodity: this.formData.commodity,
                            cxInventory: this.inventory,
                            isInventoryCheck: true,
                            isInventoryBack: true,
                            backNumber: backNumber,
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
                    $alert('请选择归还仓库')
                } else if (!this.formData.commodity.length) {
                    $alert('请添加商品或车上没有商品')
                } else if (!this.formData.approver.length) {
                    $alert('请选择审批人')
                } else {
                    axios[this.uData ? 'post' : 'put']('api/carSales/back/', this.formData).then(res => {
                        $alert('提交回库申请成功', () => {
                            this.$f7router.back()
                        });
                        if (!this.uData) {
                            if (cordova.plugins.aMapLocation) {
                                this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: '回库申请'})
                            }
                        }
                    }).catch(err => {
                        console.error(err.message);
                        $alert('提交回库申请失败');
                    })
                }
            },
            loadInventory (numberPlate) {
                axios.post('api/carSales/inventory/list').then(res => {
                    if (res.data && res.data.length && res.data[0].inventory) {
                        res.data[0].inventory.forEach(v => {
                            if (v.numberPlate === numberPlate) {
                                this.formData.numberPlate = numberPlate
                                this.formData.commodity = []
                                this.inventory = v
                                v.commodity.forEach(v => {
                                    let obj = Object.assign({}, v)
                                    if (this.backType === 'return') {
                                        obj.number = v.returnNumber
                                    } else if (this.backType === 'swap') {
                                        obj.number = v.swapNumber
                                    } else {
                                        obj.number = v.realNumber
                                        obj.des = ''
                                    }
                                    if (obj.number > 0) this.formData.commodity.push(obj)
                                })
                            }
                        })
                        console.log(this.inventory)
                    }
                    if (!this.formData.numberPlate) $alert('您的车载没有库存');
                }).catch(err => {
                    console.error(err.message);
                    $alert('查询您的车载库存失败');
                })
            }
        },
        mounted() {
            if (this.uData) {
                this.formData = this.uData
            } else {
                axios.post('api/carSales/car/list', {
                    salesman: this.myUserId
                }).then(res => {
                    if (res.data && res.data.length) {
                        if (res.data[0].status === '启用') {
                            this.loadInventory(res.data[0].numberPlate)
                        } else {
                            $alert('您的提货车辆已被禁用，请前往设置开启', () => {
                                this.$f7router.navigate('/psiManage/carSales/car/update', {
                                    props: {
                                        uData: res.data[0]
                                    }
                                })
                            })
                        }
                    }
                }).catch(err => {
                    console.error(err.message);
                    $alert('获取不到您的提货车辆')
                })
            }
            this.formData.backType = this.backType
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
