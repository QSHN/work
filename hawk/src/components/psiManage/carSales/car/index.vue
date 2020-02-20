<template>
    <f7-page @page:reinit="resetLoad">
        <f7-navbar title="车辆管理" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="searchFun">筛选</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="list_item" v-for="(v, i) in list" @click="$f7router.navigate('/psiManage/carSales/car/detail', { props: { detail: v }})">
                    <div class="list_l">
                        <div class="title">
                            {{v.numberPlate}}
                            <span :class="v.status === '启用' ? 'tip success' : 'tip error'">{{v.status}}</span>
                        </div>
                        <p>跟车业务员： {{who(v.salesman) && who(v.salesman).name}}</p>
                    </div>
                    <img class="arrow" src='../../../../assets/images/arrow_right_gray copy 2@2x.png' style="width: 8px; height: 12px;">
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
            page: 0,
            isDo: true,
            identifier: 0,
            list: [],
            filter: {
                status: '',
                numberPlate: '',
                salesman: '',
                page: 1,
                limit: 10
            }
        }
    },
    computed: {
        ...mapGetters([
            'who'
        ]),
    },
    methods: {
        moment,
        addFun () {
            this.$f7router.navigate('/psiManage/carSales/car/update')
        },
        searchFun () {
            this.$f7router.navigate('/psiManage/carSales/car/search', {
                props: {
                    search: (val) => {
                        this.filter = {...val}
                        this.filter.status = val.status === '全部状态' ? '' : val.status
                        this.filter.page = 1
                        this.filter.limit = 10
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
            await axios.post('api/carSales/car/list', this.filter).then(res => {
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
                $alert('获取车辆管理列表失败')
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
                margin-left: 5px;

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
