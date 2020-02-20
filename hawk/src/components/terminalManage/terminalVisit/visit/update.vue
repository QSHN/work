<template>
    <f7-page>
        <f7-navbar title="临时拜访" back-link></f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="list-item clear-float" @click="selectorvisitorShow=true">
                    <span class="item-icon">*</span>
                    <label>拜访人：</label>
                    <div style="float: right">
                        <div style="width: 20px; height: 46px; float: right;">
                            <img style="height: 12px; margin-top: 17px;" src='../../../../assets/images/arrow_right_gray copy 2@2x.png'>
                        </div>

                        <input class="item-input"
                               type="text"
                               placeholder="请选择"
                               v-model="who(formData.visitor) && who(formData.visitor).name"
                               style="padding-right: 5px;"
                               readonly />
                    </div>
                </div>

                <div class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>拜访客户：</label>
                    <div style="float: right">
                        <div class="list_item_btn" style="float: right;" @click="selectClient">添加</div>
                    </div>
                </div>

                <div class="commodity" v-if="formData.client">
                    <div class="item">
                        <div class="title">
                            <div class="name">{{formData.client.name}}</div>
                        </div>
                        <p>地址： {{formData.client.location && formData.client.location.address || '无'}}</p>
                        <p>类型： {{formData.client.type || '无'}}</p>
                        <p>等级： {{formData.client.grade || '无'}}</p>
                    </div>
                </div>
            </div>

            <div class="submit-button" @click="submit">提交</div>

            <f7-popup :opened="selectorvisitorShow" @popup:closed="(selectorvisitorShow = false)">
                <personnelselector
                        :multiple="true"
                        :subordinate="true"
                        :isFilterSub="true"
                        :isFilterSuper="false"
                        @submit="onSelectorPersonne"
                        @cancel="selectorvisitorShow = false"
                ></personnelselector>
            </f7-popup>
        </div>
    </f7-page>
</template>

<script>
    import personnelselector from '../../../gadget/personnelselector.vue';
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import axios from 'axios'
    import DatePicker from 'vue2-datepicker'
    export default {
        name: "index",
        components: {
            personnelselector,
            DatePicker
        },
        props: ['uData'],
        data () {
            return {
                formData: {
                    visitor: '',
                    visitType: '临时拜访',
                    status: '待拜访',
                    clientId: '',
                    client: ''
                },
                selectorvisitorShow: false
            }
        },
        computed: {
            ...mapGetters([
                'who',
            ])
        },
        methods: {
            selectClient () {
                this.$f7router.navigate('/selectList', {
                    props: {
                        isAdd: false,
                        which: {
                            name: '客户',
                            type: 'name'
                        },
                        url: 'client/',
                        choose: (type, val) => {
                            this.formData.clientId = val._id
                            this.formData.client = val
                            this.$f7router.back()
                        }
                    }
                })
            },
            onSelectorPersonne(uIds) {
                this.selectorvisitorShow = false;
                this.formData.visitor = uIds[0].toString();
            },
            submit () {
                if (!this.formData.visitor) {
                    $alert('请选择拜访人')
                } else if (!this.formData.clientId) {
                    $alert('请选择拜访客户')
                } else {
                    axios[this.uData ? 'post' : 'put']('api/terminalVisit/visit/', this.formData).then(res => {
                        $alert('临时拜访生成成功', () => {
                            this.$f7router.back()
                        });
                        if (cordova.plugins.aMapLocation) {
                            this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: `终端拜访-临时拜访`})
                        }
                    }).catch(err => {
                        console.error(err.message);
                        $alert('临时拜访生成失败');
                    })
                }
            }
        },
        mounted() {
            if (this.uData) this.formData = this.uData
        }
    }
</script>

<style lang="scss" scoped>
    .p_content {
        height: 100%;
        display: flex;
        flex-direction: column;

        .pc_layer {
            overflow-x: hidden;
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
