<template>
    <f7-page class="commodity_other">
        <f7-navbar title="选择拜访流程" back-link></f7-navbar>

        <div class="other_c">
            <div class="other_list">
                <div class="list" v-for="(v, i) in list" :key="i"  @click="v.selected = !v.selected">
                    <div class="it_l">
                        {{v.name}}
                    </div>
                    <div class="it_r">
                        <img v-if="!v.selected" src="../../../../assets/images/btn_tick_empty_gray@2x.png"/>
                        <img v-else src="../../../../assets/images/btn_tick_green@2x.png">
                    </div>
                </div>
            </div>

            <div class="footer" @click="submit">确定</div>
        </div>
    </f7-page>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import axios from 'axios'
    export default {
        name: "other",
        props: {
            detail: {
                type: Object,
                required: true
            },
        },
        data () {
            return {
                list: [
                    {name: '拜访总结', list: [], selected: true},
                    {name: '订单上报', list: [], selected: true},
                    {name: '库存上报', list: [], selected: true},
                    {name: '铺货上报', list: [], selected: true},
                    {name: '收款登记', list: [], selected: true},
                    {name: '退货上报', list: [], selected: true},
                    {name: '销量上报', list: [], selected: true},
                    {name: '竞品上报', list: [], selected: true},
                    {name: '终端形象采集', list: [], selected: true},
                    {name: '综合上报', list: [], selected: true},
                ]
            }
        },
        computed: {
            ...mapGetters([
                'who',
                'myUserId'
            ])
        },
        methods: {
            submit() {
                if (this.detail.visitor !== this.myUserId) {
                    $alert('你不是这次终端拜访的拜访人，无权限操作')
                } else {
                    let task = this.list.filter(v => v.selected)
                    let detail = Object.assign({}, this.detail);
                    detail.task = task
                    axios.post('api/terminalVisit/visit/', detail).then(res => {
                        $alert('已添加拜访流程', () => {
                            this.$f7router.navigate(`/terminalManage/terminalVisit/visit/detail`, {
                                props: {
                                    detail
                                }
                            })
                        });
                    }).catch(err => {
                        console.error(err.message);
                        $alert('拜访流程上传失败');
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .commodity_other {
        .other_c {
            position: relative;
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;

            .other_list {
                flex-grow: 1;
                overflow: auto;
                -webkit-overflow-scrolling: touch;

                .list {
                    padding: 0 15px;
                    height: 44px;
                    border-bottom: 1px solid #D8D8D8;
                    background: #fff;
                    margin: 0;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .it_l {
                        margin-right: 20px;
                        flex-grow: 1;
                        font-size: 14px;
                        color: #000;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }

                    .it_r {
                        height: 20px;

                        img {
                            width: 20px;
                            height: 20px;
                        }
                    }
                }
            }

            .footer {
                height: 45px;
                line-height: 45px;
                font-size: 16px;
                color: #333333;
                /*background: #fff;*/
                text-align: center;
                box-shadow: 0 0 5px rgba(0, 0, 0, .15);
            }
        }
    }
</style>
