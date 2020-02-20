<template>
    <f7-page>
        <f7-navbar title="筛选" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="clear">重置</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="list-item clear-float" @click="selectClient">
                    <span class="item-icon"></span>
                    <label>客户名称：</label>
                    <div style="float: right">
                        <div style="width: 20px; height: 46px; float: right;">
                            <img style="height: 12px; margin-top: 17px;" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                        </div>

                        <input class="item-input"
                               type="text"
                               placeholder="请选择"
                               v-model="formData.name"
                               style="padding-right: 5px;"
                               readonly />
                    </div>
                </div>

                <div class="list-item clear-float" @click="selectWarehouse">
                    <span class="item-icon"></span>
                    <label>退货仓库：</label>
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

                <div class="list-item clear-float">
                    <span class="item-icon"></span>
                    <label>退货单号：</label>
                    <div style="float: right">
                        <input class="item-input"
                               type="text"
                               placeholder="请输入"
                               v-model="formData.coding" />
                    </div>
                </div>

                <div class="list-item clear-float" @click="selectorPersonnelShow=true">
                    <span class="item-icon"></span>
                    <label>提交人：</label>
                    <div style="float: right">
                        <div style="width: 20px; height: 46px; float: right;">
                            <img style="height: 12px; margin-top: 17px;" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                        </div>

                        <input class="item-input"
                               type="text"
                               placeholder="请选择"
                               v-model="who(formData.creator) && who(formData.creator).name"
                               style="padding-right: 5px;"
                               readonly />
                    </div>
                </div>

                <div class="list-item clear-float">
                    <span class="item-icon"></span>
                    <label>提交时间起：</label>
                    <div style="float: right; margin-right: 5px;">
                        <date-picker v-model="formData.startTime" type="date"
                                     :editable="false"
                                     class="date-picker"
                                     width="150px"
                                     :confirm="true"
                                     :not-before="new Date()"
                                     :confirm-text="'确定'"
                                     placeholder="   请选择开始时间"
                                     :readonly="'disabled'"
                                     format="YYYY-MM-DD"
                                     :minute-step="30"
                                     :first-day-of-week="1">
                        </date-picker>
                    </div>
                </div>

                <div class="list-item clear-float">
                    <span class="item-icon"></span>
                    <label>提交时间止：</label>
                    <div style="float: right; margin-right: 5px;">
                        <date-picker v-model="formData.endTime" type="date"
                                     :editable="false"
                                     class="date-picker"
                                     width="150px"
                                     :confirm="true"
                                     :not-before="new Date()"
                                     :confirm-text="'确定'"
                                     placeholder="   请选择截止时间"
                                     :readonly="'disabled'"
                                     format="YYYY-MM-DD"
                                     :minute-step="30"
                                     :first-day-of-week="1">
                        </date-picker>
                    </div>
                </div>
            </div>

            <div class="submit-button" @click="submit">提交</div>
        </div>

        <f7-popup :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
            <personnelselector
                    :multiple="false"
                    :subordinate="true"
                    :isFilterSub="true"
                    @submit="onSelectorPersonne"
                    @cancel="selectorPersonnelShow = false"
            ></personnelselector>
        </f7-popup>
    </f7-page>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import personnelselector from '../../gadget/personnelselector.vue';
    import DatePicker from 'vue2-datepicker'
    export default {
        name: "search",
        components: {
            personnelselector,
            DatePicker
        },
        props: {
            search: {
                type: Function,
                required: true
            }
        },
        data () {
            return {
                formData: {
                    name: '',
                    warehouse: '',
                    coding: '',
                    creator: '',
                    startTime: '',
                    endTime: '',
                },
                selectorPersonnelShow: false
            }
        },
        computed: {
            ...mapGetters([
                'who'
            ]),
        },
        methods: {
            clear () {
                this.formData = {
                    name: '',
                    warehouse: '',
                    coding: '',
                    creator: '',
                    startTime: '',
                    endTime: '',
                }
            },
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
                            this.formData.name = val.name
                            this.$f7router.back()
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
                            this.$f7router.back()
                        }
                    }
                })
            },
            onSelectorPersonne(uIds) {
                this.selectorPersonnelShow = false;
                this.formData.creator = uIds[0].toString();
            },
            submit () {
                this.search(this.formData)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .p_content {
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        display: flex;
        flex-direction: column;

        .pc_layer {
            flex-grow: 1;
        }
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
</style>
