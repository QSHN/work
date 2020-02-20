<template>
    <f7-page  @page:reinit="load">
        <f7-navbar title="公司内部联络单" back-link>
            <f7-nav-right>
                <f7-link @click="$f7router.navigate('/office/internalContact/update/')">新增</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="p_layer">
            <div class="p_c">
                <div class="list_item" v-for="(v, i) in list" @click="$f7router.navigate('/office/internalContact/detail/', { props: { detail: v }})">
                    <div class="title">
                        发文人：{{who(v.creator) && who(v.creator).name}}
                    </div>
                    <div class="other">
                        <div class="time">{{moment(v.createdAt).format('YYYY-MM-DD HH:mm:ss')}}</div>
                    </div>
                    <p>发文类型： {{v.cType}}</p>
                    <p>收文人： {{v.send && who(v.send[0]) && who(v.send[0]).name}}等{{v.send.length}}人</p>
                    <p :style="{color: v.status == '已审批' ? '#01B38B' : v.status == '被驳回' ? '#FF715A' : '#FFAB00'}">审批状态： {{v.status}}</p>
                </div>
            </div>

            <div class="p_bottom">
                <div v-for="(v, i) in typeList"
                     :class="{p_list: true, active: whichList === i}"
                    @click="whichList = i">{{v}}</div>
            </div>
        </div>
    </f7-page>
</template>

<script>
    import axios from 'axios'
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import moment from 'moment'
    export default {
        name: "internalContact",
        props: {
          which: {
              type: Number,
              default: 0
          }
        },
        data () {
            return {
                whichList: 0,
                typeList: ['审批', '发起', '回复'],
                allList: [],
                list: []
            }
        },
        computed: {
            ...mapGetters([
                'myUserId',
                'who'
            ]),
        },
        watch: {
            whichList () {
                $preloader.show()
                this.updateList()
            }
        },
        methods: {
            moment,
            updateList () {
                if (this.whichList === 0) {
                    this.list = this.allList.filter(v => v.approver.filter(a => a.uid === this.myUserId).length)
                } else if (this.whichList === 1) {
                    this.list = this.allList.filter(v => v.creator === this.myUserId)
                } else {
                    this.list = this.allList.filter(v => v.send.includes(this.myUserId) && v.status)
                }
                setTimeout(() => {
                    $preloader.hide()
                }, 300)
            },
            load () {
                $preloader.show()
                axios.get('api/internalContact/').then(res => {
                    this.allList = res.data
                    this.updateList()
                }).catch(err => {
                    console.error(err.message);
                    $alert('获取公司内部联络单列表失败');
                    $preloader.hide()
                })
            }
        },
        mounted() {
            this.whichList = this.which
            this.load()
        }
    }
</script>

<style lang="scss" scoped>
.p_layer {
    height: 100%;
    display: flex;
    flex-direction: column;

    .p_c {
        flex-grow: 1;
        overflow: auto;
        -webkit-overflow-scrolling: touch;

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

                div {
                    display: inline-block;
                }

                .name {
                    margin-left: 5px;
                }
            }

            p {
                font-size: 14px;
                color: #666;
                margin: 6px 0 0 0;
            }
        }
    }

    .p_bottom {
        width: 100%;
        height: 46px;
        line-height: 46px;
        border-top: 1px solid #d8d8d8;
        background: #fff;
        display: flex;
        flex-direction: row;

        .p_list {
            flex-grow: 1;
            text-align: center;
            color: #999999;
            font-size: 16px;

            &.active {
                color: #3385FF;
            }
        }
    }
}
</style>
