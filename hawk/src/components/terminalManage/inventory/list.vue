<template>
    <f7-page @page:reinit="resetLoad">
        <f7-navbar title="库存上报清单" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="searchFun">筛选</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="pc_content">
            <div class="pc_layer">
                <div class="list_item" v-for="(v, i) in list" @click="$f7router.navigate('/terminalManage/inventory/detail', { props: { detail: v }})">
                    <div class="title">{{v.name}}</div>
                    <div class="other">
                        <div class="time">{{moment(v.createdAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
                        <div class="name">{{who(v.creator) && who(v.creator).name}}</div>提交
                    </div>
                    <p>流水号： {{v.coding}}</p>
                    <p>品种数： {{v.commodity.length}}</p>
                </div>

                <infinite-loading @infinite="onInfinite" :identifier="identifier" style="margin: 20px 0;">
                    <span slot="no-more">
                        已加载完所有内容
                    </span>
                </infinite-loading>
            </div>
        </div>

        <img @click="addFun" v-if="visitData" class="bt_add" src="../../../assets/images/btn_oval_add_green@2x.png">
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import axios from 'axios';
import moment from 'moment'
export default {
    name: "list",
    components: {
        InfiniteLoading
    },
    props: {
        visitData: {
            type: Object,
            default: null
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
                coding: '',
                creator: '',
                startTime: '',
                endTime: '',
                page: 1,
                limit: 10
            },
            creatorId: null
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
        addFun () {
            if (this.visitData && this.visitData.visitor !== this.myUserId) {
                $alert('你不是这次终端拜访的拜访人，无权限操作')
            } else {
                this.$f7router.navigate('/terminalManage/inventory/', {
                    props: {
                        visitData: this.visitData
                    }
                })
            }
        },
        searchFun () {
            this.$f7router.navigate('/terminalManage/inventory/search', {
                props: {
                    search: (val) => {
                        this.filter = {...val}
                        if (val.startTime) this.filter.startTime = new Date(val.startTime).toHawkDateString() + ' 00:00:00.000'
                        if (val.endTime) this.filter.endTime = new Date(val.endTime).toHawkDateString() + ' 23:59:59.999'
                        this.filter.page = 1
                        this.filter.limit = 10
                        this.filter.creatorId = this.filter.creator ? [this.filter.creator] : null
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
            this.filter.creator = this.filter.creatorId || this.pList.map(v => v._id)
            if (this.visitData) this.filter.visitId = this.visitData._id
            await axios.post('api/inventory/list', this.filter).then(res => {
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
                $alert('查询库存上报清单失败')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.pc_content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .pc_layer {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding: 0 10px;
        overflow: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .list_item {
        border-radius: 4px;
        background: #fff;
        margin-top: 10px;
        padding: 10px;

        .title {
            font-size: 15px;
            color: #000;
            line-height: 15px;
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
