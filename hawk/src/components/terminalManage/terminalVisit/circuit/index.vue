<template>
    <f7-page @page:reinit="resetLoad">
        <f7-navbar title="线路选择" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="searchFun">搜索</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="list_item" v-for="(v, i) in list" @click="go(v)">
                    <div class="list_l">
                        <div class="title">
                            {{v.name}}
                        </div>
                        <p v-if="v.client.length > 1">拜访客户： {{v.client[0].name}}等{{v.client.length}}名客户</p>
                        <p v-else>拜访客户： {{v.client.length && v.client[0].name}}</p>
                    </div>

                    <img class="arrow" src='../../../../assets/images/arrow_right_gray copy 2@2x.png' style="width: 8px; height: 12px;">
                </div>

                <infinite-loading @infinite="onInfinite" :identifier="identifier" style="margin: 20px 0;">
                    <span slot="no-more">
                        已加载完所有内容
                    </span>
                </infinite-loading>
            </div>

            <img @click="addFun" class="bt_add" src="../../../../assets/images/btn_oval_add_green@2x.png">
        </div>
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
        props: {
            choose: {
                type: Function,
                required: true
            }
        },
        data () {
            return {
                page: 0,
                isDo: true,
                identifier: 0,
                list: [],
                filter: {
                    name: '',
                    creator: '',
                    creatorId: null,
                    page: 1,
                    limit: 10,
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
        methods: {
            moment,
            go (client) {
                let turn = (bool) => {
                    if (bool) {
                        this.choose(client.client)
                    } else {
                        this.$f7router.navigate('/terminalManage/terminalVisit/circuit/detail', {
                            props: {
                                detail: client
                            }
                        })
                    }
                }
                $dialog.create({
                    title: '操作',
                    buttons: [
                        { text: '选择该线路', onClick: () => { turn(true) } },
                        { text: '查看该线路', onClick: () => { turn(false) } },
                        { text: '取消'},
                    ],
                    verticalButtons: true,
                }).open();
            },
            addFun () {
                this.$f7router.navigate('/terminalManage/terminalVisit/circuit/update')
            },
            searchFun () {
                this.$f7router.navigate('/terminalManage/terminalVisit/circuit/search', {
                    props: {
                        search: (val) => {
                            this.filter = {...val}
                            this.filter.creatorId = this.filter.creator ? [this.filter.creator] : null
                            this.load()
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
                this.filter.creator = this.filter.creatorId || this.pList.map(v => v._id)
                await axios.post('api/terminalVisit/circuit/list', this.filter).then(res => {
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
                    $alert('查询线路列表失败')
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
            display: flex;
            flex-direction: row;
            align-items: center;
            background: #fff;
            padding: 15px;
            border-bottom: 1px solid #D8D8D8;

            .list_l {
                flex-grow: 1;
            }

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
