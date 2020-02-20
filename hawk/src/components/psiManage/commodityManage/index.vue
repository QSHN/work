<template>
    <f7-page class="commodity_manage" @page:reinit="resetLoad">
        <f7-navbar title="商品管理" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="selectPicker">筛选</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="cm_content">
            <div class="cm_layer">
                <bar-code-search ref="barCodeSearch" :title="'编码/名称/条形码'" />

                <div class="list_layer">
                    <div class="list" v-for="(v, i) in getList" :key="i"
                         @click="$f7router.navigate('/psiManage/commodityManage/detail', {
                        props: {
                            img: imgObj[v._id],
                            uData: v
                        }
                     })">
                        <div class="list_l">
                            <img v-if="imgObj[v._id]" :src="imgObj[v._id]" />
                            <img v-else src="../../../assets/images/pic_no_photo@2x.png" />
                        </div>

                        <div class="list_c">
                            <div class="title">
                                <div class="name">{{v.name}}</div>
                                <span class="label" v-if="v.label">{{v.label}}</span>
                            </div>
                            <!--<p>编号：{{v.coding}}</p>-->
                            <!--<p>类型：{{v.type}}</p>-->
                            <p>生产日期：{{v.produced && moment(v.produced).format('YYYY-MM-DD')}}</p>
                            <p>保质期：{{v.expiration}} {{v.expiration && v.dateUnit}}</p>
                        </div>

                        <div class="list_r">
                            <img class="status" :src='getStatusImg(v.status)'>
                            <img class="arrow" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                        </div>
                    </div>
                </div>

                <infinite-loading @infinite="onInfinite" :identifier="identifier" style="margin: 20px 0">
                <span slot="no-more">
                    已加载完所有内容
                </span>
                </infinite-loading>
            </div>

            <img @click="addFun" class="bt_add" src="../../../assets/images/btn_oval_add_green@2x.png" v-if="isEmployee">
        </div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import barCodeSearch from '../../_module/barcodesearch'
import InfiniteLoading from 'vue-infinite-loading';
import {getSignUrl} from 'lib/aliyun';
import axios from 'axios'
import moment from 'moment'
export default {
    name: "index",
    components: {
        barCodeSearch,
        InfiniteLoading
    },
    data() {
        return {
            list: [],
            page: 0,
            isDo: true,
            identifier: 0,
            imgObj: {},
            typeList: new Set(),
            filterVal: null
        }
    },
    computed: {
        ...mapGetters([
            'superAdmin',
            'myUserId',
            'myProfile',
            'who',
            'isDepartmentAdmin'
        ]),
        isAdministrative () {
            return this.myProfile.privilege.some(i => ['合同管理', '企业设置'].includes(i))
        },
        isFinance () {
            return this.myProfile.accountType === '财务'
        },
        isEmployee () {
            return this.superAdmin._id === this.myUserId || this.isDepartmentAdmin(this.myUserId) || this.isAdministrative || this.isFinance
        },
        getList () {
            let list = this.list
            let search = this.$refs.barCodeSearch && this.$refs.barCodeSearch.search || ''
            if (this.filterVal) {
                list = list.filter(v => v.type == this.filterVal)
            }
            if (search) {
                console.log(search)
                list = list.filter(v => v.name.includes(search) || v.coding.includes(search) || v.barCode.includes(search) )
            }
            return list
        }
    },
    methods: {
        moment,
        async getImg (id, p) {
            let url = p.substr(0, 4) == 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
            await getSignUrl(url, (ret) => {
                this.imgObj[id] = ret instanceof Error ? '#' : ret
            });
        },
        getStatusImg (status) {
            return require(`../../../assets/images/${status ? 'icon_sold _in_the_label_green' : 'icon_stop_label_red'}@2x.png`)
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
        addFun () {
            this.$f7router.navigate('/psiManage/commodityManage/update')
        },
        async load (state, cb) {
            await axios.get('api/commodity/?page=' + this.page + '&limit=' + 10).then(res => {
                this.identifier++;
                if (res.data && res.data.length) {
                    if (this.page === 1) this.list = []
                    if (this.page === 1) this.list = []
                    this.list = this.list.concat(res.data)
                    if (cb) cb(false);
                    res.data.forEach(v => {
                        this.getImg(v._id, v.photos[0])
                        this.typeList.add(v.type);
                    })
                } else {
                    if (cb) cb(true);
                    this.isDo = false
                }
            }).catch(err => {
                console.error(err.message);
                $alert('查询商品列表失败')
            })
        },
        selectPicker() {
            const self = this;
            const picker = this.$f7.picker.create({
                inputEl: '#picker-expense',
                toolbarCloseText: '完成',
                cols: [
                    {
                        textAlign: 'center',
                        values: Array.from(self.typeList),
                    }
                ],
                on: {
                    change: (picker, values, displayValues) => {
                        self.filterVal = values[0]
                        console.log(self.filterVal)
                    }
                }
            });
            picker.open();
        },
    },
    created() {
    }
}
</script>

<style lang="scss" scoped>
.cm_content {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;


    .cm_layer {
        flex-grow: 1;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .list {
        width: 100%;
        height: 84px;
        border-bottom: 1px solid #D8D8D8;
        display: flex;
        flex-direction: row;
        margin: 0;
        background: #fff;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
        }

        .list_l {
            width: 60px;
            height: 60px;
            margin: 10px;
        }

        .list_c {
            padding-right: 20px;
            flex-grow: 1;
            overflow: hidden;

            .title {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-top: 12px;

                .name {
                    font-size: 16px;
                    line-height: 16px;
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
                font-size: 14px;
                line-height: 14px;
                margin: 6px 0 0;
                color: #666;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }

        .list_r {
            width: 35px;

            .status {
                width: 35px;
                height: 35px;
            }

            .arrow {
                width: 8px;
                height: 12px;
                margin: 2px 0 0 12px;
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
}
</style>
