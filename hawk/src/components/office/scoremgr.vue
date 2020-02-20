<template>
    <f7-page>
        <f7-navbar title="绩效设置" back-link></f7-navbar>
        <f7-list  v-if="isAdmin" style="background-color: white">
            <f7-list-item title="汇报" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'report',pageName:'汇报'})"></f7-list-item>
            <f7-list-item title="考勤" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'attendance',pageName:'考勤'})"></f7-list-item>
            <f7-list-item title="任务" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'task',pageName:'任务'})"></f7-list-item>
            <f7-list-item title="日报" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'daily',pageName:'日报'})"></f7-list-item>
            <f7-list-item title="拜访" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'visit',pageName:'拜访'})"></f7-list-item>
            <f7-list-item title="终端拜访" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'terminalVisit',pageName:'终端拜访'})"></f7-list-item>
            <f7-list-item title="铺货上报" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'shopGoods',pageName:'铺货上报'})"></f7-list-item>
            <f7-list-item title="库存上报" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'inventory',pageName:'库存上报'})"></f7-list-item>
            <f7-list-item title="销量上报" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'salesVolume',pageName:'销量上报'})"></f7-list-item>
            <f7-list-item title="综合上报" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'salesIntegrated',pageName:'综合上报'})"></f7-list-item>
            <f7-list-item title="终端形象采集" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'imageAcquisition',pageName:'终端形象采集'})"></f7-list-item>
            <f7-list-item title="竞品上报" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'competingGoods',pageName:'竞品上报'})"></f7-list-item>
            <f7-list-item title="库存盘点" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'inventoryVerification',pageName:'库存盘点'})"></f7-list-item>
            <f7-list-item title="销售业绩" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'salesmanage',pageName:'销售业绩'})"></f7-list-item>
            <f7-list-item title="绩效报告" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'performance',pageName:'绩效报告'})"></f7-list-item>
            <f7-list-item title="自定义" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'custom',pageName:'自定义'})"></f7-list-item>
        </f7-list>
    </f7-page>
</template>

<style scoped>

    .ts_con {
        height: 95px;
        width: 100%;
    }

    .ts {
        text-align: center;
        width: 120px;
        margin-top: 10px;
        float: left;
    }

    .ts > div:first-child {
        font-size: 22px;
    }

    .ts > div {
        font-size: 18px;
        line-height: inherit;
    }

    .ts > span {
        font-size: 14px;
        color: #616161;
    }

    .asp {
        margin: 24px 0px;
        width: 100px;
        float: right;
    }

    .asp > div {
        font-size: 16px;
        color: #444444;
    }

    .mark {
        font-size: 14px;
        height: 95px;
        margin-top: 38px;
        float: right;
        color: #acacac;
    }
</style>
<script>
    import {createDateTimePicker} from 'lib/datetime';
    import {mapGetters, mapActions} from 'vuex';
    import employeepicker from 'gadget/employeepicker.vue';
    import axios from 'axios';

    export default {
        components: {
            employeepicker
        },
        data() {
            return {
                selectorPersonnelShow:false,
            }
        },
        created(){
        },
        mounted() {
        },

        computed: {
            ...mapGetters([
                'myUserId',
                'myProfile',
                'myCompany'
            ]),
            isAdmin(){
                return this.myProfile.superadmin || this.myProfile.privilege.filter(item=>item=='绩效设置').length
            }
        },

        methods: {
            jumpTo(path, props) {
                console.log(props)
                props = props || {}
                this.$f7router.navigate(path, {props});
            }
        }
    }
</script>
