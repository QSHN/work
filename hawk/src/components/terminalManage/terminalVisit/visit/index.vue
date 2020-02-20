<template>
    <f7-page @page:reinit="resetLoad">
        <f7-navbar title="临时拜访" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="searchFun">筛选</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="select_group">
                    <f7-list class="select">
                        <f7-list-item title="全部状态" smart-select :smart-select-params="{openIn: 'popover'}">
                            <select name="status" v-model="status">
                                <option v-for="(v, i) in statusList" :value="v" :selected="v == status">{{v}}</option>
                            </select>
                        </f7-list-item>
                    </f7-list>
                </div>

                <div class="list_item" v-for="(v, i) in list"  @click="visitFun(v)">
                    <div class="title">
                        {{who(v.visitor) && who(v.visitor).name}}
                        <span :class="v.status == '已拜访' ? 'tip success' : v.status == '已失访'  ? 'tip error' : 'tip'">{{v.status}}</span>
                    </div>
                    <p>拜访时间：{{v.startVisit && moment(v.startVisit.time).format('YYYY-MM-DD HH:mm:ss') || '还没开始'}}</p>
                    <p>拜访客户： {{v.client && v.client.name}}</p>
                </div>

                <infinite-loading @infinite="onInfinite" :identifier="identifier" style="margin: 20px 0;">
                    <span slot="no-more">
                        已加载完所有内容
                    </span>
                </infinite-loading>
            </div>
        </div>

        <img @click="addFun" class="bt_add" src="../../../../assets/images/btn_oval_add_green@2x.png">
    </f7-page>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import InfiniteLoading from 'vue-infinite-loading';
    import axios from 'axios';
    import moment from 'moment'
    export default {
        name: "index",
        components: {
            InfiniteLoading
        },
        data () {
            return {
                status: '全部状态',
                statusList: ['全部状态', '待拜访', '访问中', '已失效', '已拜访'],
                page: 0,
                isDo: true,
                identifier: 0,
                list: [],
                filter: {
                    visitor: '',
                    startTime: '',
                    endTime: '',
                    page: 1,
                    limit: 10,
                    status: '',
                    visitType: '临时拜访'
                }
            }
        },
        computed: {
            ...mapGetters([
                'superAdmin',
                'myUserId',
                'myProfile',
                'who',
                'userDepartment',
                'isDepartmentAdmin',
                'personnel'
            ]),
            pList() {
                if (this.superAdmin._id == this.myUserId) return this.personnel;

                // non-admin can only has itself
                let d = this.userDepartment(this.myUserId);
                if (!d.admin.includes(this.myUserId)) return this.personnel.filter(p => p._id == this.myUserId);

                // admin can has all its subordinates
                let subordinates = (function listE(d) {
                    return d.employees.slice(0).concat(
                        d.sub.reduce((accum, s) => {return accum.concat(listE(s))}, [])
                    ) || [];
                })(d);

                subordinates = subordinates.filter(id => !(d.admin.includes(id) && id !== this.myUserId))
                return this.personnel.filter(p => subordinates.includes(p._id))
            }
        },
        watch: {
            status () {
                this.filter.status = this.status !== '全部状态' ? this.status : ''
                this.resetLoad()
            }
        },
        methods: {
            moment,
            visitFun (val) {
                this.$f7router.navigate(`/terminalManage/terminalVisit/visit/${val.task.length === 0 ? 'flow' : 'detail'}`, {
                    props: {
                        detail: val
                    }
                })
            },
            addFun () {
                this.$f7router.navigate('/terminalManage/terminalVisit/visit/update')
            },
            searchFun () {
                this.$f7router.navigate('/terminalManage/terminalVisit/visit/search', {
                    props: {
                        search: (val) => {
                            this.filter = {...val}
                            if (val.startTime) this.filter.startTime = new Date(val.startTime).toHawkDateString() + ' 00:00:00.000'
                            if (val.endTime) this.filter.endTime = new Date(val.endTime).toHawkDateString() + ' 23:59:59.999'
                            this.filter.page = 1
                            this.filter.limit = 10
                            this.filter.status = ''
                            this.filter.visitType ='临时拜访'
                            // console.log(this.filter)
                            this.resetLoad()
                            this.$f7router.back()
                        }
                    }
                })
            },
            resetLoad () {
                this.page = 0
                this.isDo = true
                this.identifier = 0
                this.list = []
            },
            onInfinite ($state) {
                if (this.isDo) {
                    this.page++;
                    // console.log(this.page);
                    let cb = (isFnish) => {
                        if (isFnish) {
                            $state.loaded();
                            $state.complete();
                        } else {
                            $state.loaded();
                        }
                    }
                    this.load($state, cb);
                } else {
                    $state.loaded();
                    $state.complete();
                }
            },
            async load (state, cb) {
                this.filter.page = this.page
                this.filter.visitor = this.pList.map(v => v._id)
                await axios.post('api/terminalVisit/visit/list', this.filter).then(res => {
                    this.identifier++;
                    if (res.data && res.data.length) {
                        if (this.page === 1) this.list = []
                        this.list = this.list.concat(res.data)
                        if (cb) cb(false);
                    } else {
                        if (cb) cb(true);
                        this.isDo = false
                    }
                }).catch(err => {
                    console.error(err.message);
                    $alert('查询临时拜访列表失败')
                })
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
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;

            .select_group {
                width: 100%;
                height: 44px;
                background: #fff;

                .select {
                    list-style: none;
                    text-align: center;
                    margin: 0;
                }
            }
        }


        .list_item {
            border-radius: 4px;
            background: #fff;
            margin: 10px 10px 0;
            padding: 10px;

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

            .other {
                font-size: 14px;
                color: #999;
                line-height: 14px;
                padding: 10px 0;
                border-bottom: 1px solid #D8D8D8;

                div { display: inline-block; }
                .name { margin-left: 5px; }
            }

            p {
                font-size: 14px;
                color: #666;
                margin: 6px 0 0 0;
            }
        }
    }
    .bt_add {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 55px;
        height: 55px;
        text-align: center;
        line-height: 50px;
        font-size: 18px;
        z-index: 99;
    }
</style>
