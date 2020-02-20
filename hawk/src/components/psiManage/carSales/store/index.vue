<template>
    <f7-page @page:reinit="load">
        <f7-navbar title="到店销售" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="searchFun">查看</f7-link>
            </f7-nav-right>
        </f7-navbar>


        <div class="p_content">
            <div class="table">
                <ul>
                    <li>今日拜访</li>
                    <li>统计数</li>
                    <li>待拜访</li>
                    <li>拜访中</li>
                    <li>已拜访</li>
                </ul>
                <ul>
                    <li>计划拜访</li>
                    <li>{{GetNumber('计划拜访', '统计')}}</li>
                    <li>{{GetNumber('计划拜访', '待拜访')}}</li>
                    <li>{{GetNumber('计划拜访', '拜访中')}}</li>
                    <li>{{GetNumber('计划拜访', '已拜访')}}</li>
                </ul>
                <ul>
                    <li>临时拜访</li>
                    <li>{{GetNumber('临时拜访', '统计')}}</li>
                    <li>{{GetNumber('临时拜访', '待拜访')}}</li>
                    <li>{{GetNumber('临时拜访', '拜访中')}}</li>
                    <li>{{GetNumber('临时拜访', '已拜访')}}</li>
                </ul>
                <p>
                    总拜访： {{GetNumber('all')}}
                    <span>失访：{{GetNumber('all', '已失访')}}</span>
                </p>
            </div>

            <div class="pc_layer">
                <div class="title1">任务列表</div>

                <div class="list_item" v-for="(v, i) in list" @click="visitFun(v)">
                    <div class="title">
                        {{v.client.name}}
                        <span :class="v.status == '已拜访' ? 'tip success' : v.status == '已失访'  ? 'tip error' : 'tip'">{{v.status}}</span>
                    </div>
                    <p>拜访时间：{{v.startVisit && moment(v.startVisit.time).format('YYYY-MM-DD HH:mm:ss') || '还没开始'}}</p>
                    <p>拜访人：{{who(v.visitor) && who(v.visitor).name}}</p>
                    <p>拜访类型： {{v.visitType}}</p>
                </div>

                <img @click="addFun" class="bt_add" src="../../../../assets/images/btn_oval_add_green@2x.png">
            </div>
        </div>
    </f7-page>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import moment from 'moment'
    import axios from 'axios'
    export default {
        name: "index",
        data () {
            return {
                list: []
            }
        },
        computed: {
            ...mapGetters([
                'who',
                'myUserId'
            ]),
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
            go (url) {
                this.$f7router.navigate(`/terminalManage/terminalVisit/${url}`)
            },
            addFun () {
                $dialog.create({
                    title: '添加终端拜访',
                    buttons: [
                        { text: '计划拜访', onClick: () => { this.go('plan/update') } },
                        { text: '临时拜访', onClick: () => { this.go('visit/update') } },
                        { text: '取消'},
                    ],
                    verticalButtons: true,
                }).open();
            },
            searchFun () {
                $dialog.create({
                    title: '查看记录',
                    buttons: [
                        { text: '计划拜访', onClick: () => { this.go('plan') } },
                        { text: '临时拜访', onClick: () => { this.go('visit') } },
                        { text: '全部记录', onClick: () => { this.go('list') } },
                        { text: '取消'},
                    ],
                    verticalButtons: true,
                }).open();
            },
            GetNumber (type, status) {
                let list = []
                if (type === 'all') {
                    if (status) {
                        list = this.list.filter(v => v.status === '已失访')
                    } else {
                        list = Object.assign([], this.list)
                    }
                } else {
                    list = this.list.filter(v => v.visitType === type && (v.status === status || status === '统计'))
                }
                return list.length
            },
            load () {
                axios.post('api/terminalVisit/visit/list', {
                    visitor: this.myUserId,
                    time: new Date().toHawkDateString() + ' 23:59:59.999'
                }).then(res => {
                    if (res.data) {
                        let list = res.data;
                        list.forEach(v => {
                            if (v.visitType === '计划拜访' && v.endTime && !v.endVisit && moment().isAfter(v.endTime)) {
                                v.status = '已失访'
                            }
                        })
                        this.list = list
                    }
                }).catch(err => {
                    console.error(err.message);
                    $alert('获取今日拜访数据失败')
                })
            }
        },
        created() {
            this.load()
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
        }

        .table {
            margin-bottom: 10px;
            background: #fff;

            ul {
                list-style: none;
                display: flex;
                flex-direction: row;
                align-items: center;
                margin: 0;
                padding: 0;

                li {
                    height: 44px;
                    line-height: 44px;
                    text-align: center;
                    border-bottom: 1px solid #D8D8D8;
                    border-right: 1px solid #D8D8D8;
                    flex-grow: 1;
                    font-size: 14px;
                    color: #666;

                    &:nth-child(1) {
                        width: 84px;
                        min-width: 84px;
                        max-width: 84px;
                    }

                    &:last-child {
                        border-right: none;
                    }
                }
            }

            p {
                font-size: 14px;
                color: #666;
                padding: 0 15px;
                height: 46px;
                line-height: 46px;
                margin: 0;

                span {
                    margin-left: 24px;
                    color: #3385FF;
                }
            }
        }

        .title1 {
            height: 46px;
            line-height: 46px;
            background: #fff;
            font-size: 14px;
            color: #666;
            padding: 0 15px;
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
