<template>
    <f7-page :page-content="false"  @page:beforein="loadPage">
        <f7-navbar title="公告栏" back-link>
            <f7-nav-right>
                <f7-link href="/office/announce/" v-if="IamAdmin">新建</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-toolbar tabbar>
            <f7-link tab-link="#announce" tab-link-active>已发布</f7-link>
            <f7-link tab-link="#announce-draft">未发布</f7-link>
        </f7-toolbar>

        <f7-tabs>

            <f7-tab id="announce" class="page-content" tab-active>
                <f7-list media-list>
                    <f7-list-item
                        v-for = "(a, index) in announces" :key="index"
                        :header = "a.title"
                        :title = "a.content"
                        v-if = "!a.draft && (a.creator == myUserId || a.receiver.includes(myUserId))"
                        link = "#"
                        after = "详情"
                        @click="goto(a)"
                    ></f7-list-item>

                    <p style="width:100%; text-align:center" slot="after-list">
                        <small style="color:gray">没有更多的公告</small>
                    </p>
                </f7-list>
            </f7-tab>

            <f7-tab id="announce-draft" class="page-content">
                <f7-list media-list>
                    <f7-list-item
                        v-for = "(a, index) in announces"
                        :key = "index"
                        v-if = "a.draft && (a.creator == myUserId || a.receiver.includes(myUserId))"
                        :header = "a.title"
                        :title = "a.content"
                        link="#"
                        after="详情"
                        @click="goto(a)"
                    ></f7-list-item>

                    <p style="width:100%; text-align:center" slot="after-list">
                        <small style="color:gray">没有更多的公告</small>
                    </p>
                </f7-list>
            </f7-tab>

        </f7-tabs>

    </f7-page>
</template>
<style scoped>
    .ios .tabbar a.tab-link-active, .ios .tabbar-labels a.tab-link-active{
        color: #3385FF;
    }
</style>
<script>
import {mapGetters, mapActions} from 'vuex';
import axios from 'axios';

export default {
    props: {
        lastPage: {
            type: String,
            default: '上一页'
        },
    },

    data() {
        return {

            announces:[]
        }
    },

    computed: {
        ...mapGetters([
            'myCompany',
            'superAdmin',
            'userDepartment',
            'myUserId',
            'myProfile'
        ]),

        IamAdmin() {
            let isBoss = (this.superAdmin && this.superAdmin._id == this.myUserId);
            let isDepartmentAdmin = this.userDepartment(this.myUserId) && this.userDepartment(this.myUserId).admin.includes(this.myUserId);
            let administrative = this.myProfile.privilege.some(i => ['合同管理', '企业设置'].includes(i))
            let advanced = this.myProfile.accountType === '财务'
            return isBoss || isDepartmentAdmin || administrative || advanced;
        },

        // announce() {
        //     return this.myCompany.announces;
        // }
    },

    mounted() {


    },

    methods: {

        loadPage(){

            let filters = {};

            axios.get('api/company/getannounce?q=' + JSON.stringify(filters)).then(resp => {

                this.announces = resp.data;

            }).catch(err => {

            });

        },
        goto(announce) {
            this.$f7router.navigate('/office/announce/', {
                props: {
                    lastPage: '通知公告',
                    reference: announce,
                    isEdit: true
                }
            })
        }
    }
}
</script>

