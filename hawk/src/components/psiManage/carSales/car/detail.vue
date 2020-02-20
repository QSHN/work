<template>
    <f7-page  @page:reinit="load">
        <f7-navbar title="车辆详情" back-link>
            <f7-nav-right>
                <f7-link href="#" v-if="formData.creator === myUserId" @click="selectPicker">操作</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>车号：</label>
                    <div style="float: right">
                        <input class="item-input"
                               type="tel"
                               placeholder="请输入"
                               v-model="formData.numberPlate"
                               readonly/>
                    </div>
                </div>

                <div class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>跟车员业务员：</label>
                    <div style="float: right">
                        <div style="width: 20px; height: 46px; float: right;">
                            <img style="height: 12px; margin-top: 17px;" src='../../../../assets/images/arrow_right_gray copy 2@2x.png'>
                        </div>

                        <input class="item-input"
                               type="text"
                               placeholder="请选择"
                               v-model="who(formData.salesman) && who(formData.salesman).name"
                               style="padding-right: 5px;"
                               readonly />
                    </div>
                </div>

                <div class="list-item clear-float">
                    <span class="item-icon"></span>
                    <label>状态：</label>
                    <div style="float: right">
                        <div style="width: 20px; height: 46px; float: right;">
                            <img style="height: 12px; margin-top: 17px;" src='../../../../assets/images/arrow_right_gray copy 2@2x.png'>
                        </div>

                        <input class="item-input"
                               type="text"
                               placeholder="请选择"
                               v-model="formData.status"
                               style="padding-right: 5px;"
                               readonly />
                    </div>
                </div>
            </div>
        </div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
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
        load () {
            axios.get('api/carSales/car/id/' + this.formData._id).then(res => {
                if (res.data) {
                    this.formData = res.data
                }
            }).catch(err => {
                console.error(err.message);
                $alert('获取车辆详情失败')
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
            this.$f7router.navigate('/psiManage/carSales/car/update', {
                props: {
                    uData: this.formData
                }
            })
        },
        deleteFun () {
            $confirm('确定删除该车辆吗？', () => {
                $preloader.show();
                axios.delete('api/carSales/car/'+ this.formData._id).then(res => {
                    $preloader.hide();
                    $alert('删除成功！', () => {
                        this.$f7router.back()
                    })
                    if (cordova.plugins.aMapLocation) {
                        this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: `删除车辆`})
                    }
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
