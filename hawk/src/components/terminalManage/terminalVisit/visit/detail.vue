<template>
    <f7-page @page:reinit="load">
        <f7-navbar :title="formData.visitType" back-link>
            <f7-nav-right v-if="formData.status !== '已拜访'">
                <f7-link href="#" @click="lossFun">失访{{formData.status == '已失访' ? '原因' : ''}}</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="pc_content" v-if="formData.client">
            <div class="v_header" @click="$f7router.navigate('/client/client/', {props: {reference: formData.client}});">
                <div class="vh_c">
                    {{formData.client.name}}
                    <p v-if="formData.client.contacts && formData.client.contacts.length">
                        <span>联系人：{{formData.client.contacts[0].name}}</span>
                        <span>电话号码：{{formData.client.contacts[0].phone}}</span>
                    </p>
                </div>
                <span>查看</span>
                <img class="bt_add" src="../../../../assets/images/arrow_right_gray.png">
            </div>

            <div class="v_time">
                <div class="btn" v-if="!formData.startVisit">
                    <div>到店签到</div>
                    <span @click="location(false)" v-if="formData.status !== '已失访'">开始</span>
                </div>

                <div class="v_time_c" v-else>
                    <div class="v_time_t">
                        <p>开始时间</p>
                        <span>{{formData.startVisit.time}}</span>
                    </div>
                    <div class="v_time_l">
                        <div class="v_time_ct">
                            <p>{{formData.client.name}}</p>
                            <span>到店签到</span>
                        </div>
                        <p>签到地址：{{formData.startVisit.position.address}}</p>
                        <p>和客户的地址偏差{{Math.floor(formData.startVisit.position.offset)}}米</p>
                    </div>
                </div>
            </div>

            <div class="v_list_layer">
                <div class="v_list_t">执行任务</div>
                <div class="v_list" v-for="(v, i) in formData.task" :key="i" @click="go(v.name)">
                    <div :style="{color: formData.startVisit ? '#333' : '#999'}">{{v.name}}</div>
                    <span v-if="v.list.length">已完成</span>
                    <img v-if="formData.startVisit" class="bt_add" src="../../../../assets/images/arrow_right_gray.png">
                </div>
            </div>

            <div class="v_time">
                <div class="btn"  v-if="!formData.endVisit">
                    <div>离店签退</div>
                    <span v-if="formData.startVisit && formData.status !== '已失访'"  @click="location(true)">结束</span>
                </div>

                <div class="v_time_c" v-else>
                    <div class="v_time_t">
                        <p>离店时间</p>
                        <span>{{formData.endVisit.time}}</span>
                    </div>
                    <div class="v_time_l">
                        <div class="v_time_ct">
                            <p>{{formData.client.name}}</p>
                            <span>离店签退</span>
                        </div>
                        <p>签退地址：{{formData.endVisit.position.address}}</p>
                        <p>和客户的地址偏差{{Math.floor(formData.endVisit.position.offset)}}米</p>
                    </div>
                </div>
            </div>
        </div>
    </f7-page>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import axios from 'axios';
    import moment from 'moment';
    export default {
        name: "index",
        props: {
            detail: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                formData: {}
            }
        },
        computed: {
            ...mapGetters([
                'who',
                'myUserId'
            ])
        },
        methods: {
            moment,
            location (bool) {
                if (this.formData.visitor !== this.myUserId) {
                    $alert('你不是这次终端拜访的拜访人，无权限操作')
                } else {
                    this.$f7router.navigate('/terminalManage/terminalVisit/visit/location', {
                        props: {
                            isLeave: bool,
                            title: bool ? '离店签退' : '到店签到',
                            client: this.formData.client,
                            change: (visit) => {
                                let data = Object.assign({}, this.formData)
                                data[bool ? 'endVisit' : 'startVisit'] = visit
                                if (bool) {
                                    data.status = '已拜访'
                                    data.endTime = visit.time
                                } else {
                                    data.status = '拜访中'
                                    data.startTime = visit.time
                                }
                                axios.post('api/terminalVisit/visit/', data).then(res => {
                                    $alert(bool ? '离店签退成功' : '到店签到成功', () => {
                                        this.formData = data
                                        this.$f7router.back()
                                    });
                                    if (!bool) {
                                        if (cordova.plugins.aMapLocation) {
                                            this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: '到店拜访'})
                                        }
                                    }
                                }).catch(err => {
                                    console.error(err.message);
                                    $alert(bool ? '离店签退失败' : '到店签到失败');
                                })
                            }
                        }
                    })
                }
            },
            lossFun () {
                if (this.formData.visitor !== this.myUserId) {
                    $alert('你不是这次终端拜访的拜访人，无权限操作')
                } else {
                    this.$f7router.navigate('/terminalManage/terminalVisit/visit/lost', {
                        props: {
                            visitData: this.formData
                        }
                    })
                }
            },
            go (name) {
                let turn = (url) => {
                    this.$f7router.navigate(url, {
                        props: {
                            visitData: this.formData
                        }
                    })
                }
                switch (name) {
                    case '拜访总结':
                        turn('/terminalManage/terminalVisit/visit/summary')
                        break
                    case '订单上报':
                        turn('/psiManage/salesOrder/')
                        break
                    case '库存上报':
                        turn('/terminalManage/inventory/list')
                        break
                    case '铺货上报':
                        turn('/terminalManage/shopGoods/list')
                        break
                    case '收款登记':
                        turn('/psiManage/paymentRegistration/')
                        break
                    case '退货上报':
                        turn('/psiManage/salesReturn/')
                        break
                    case '销量上报':
                        turn('/terminalManage/salesVolume/')
                        break
                    case '竞品上报':
                        turn('/terminalManage/competingGoods/')
                        break
                    case '终端形象采集':
                        turn('/terminalManage/imageAcquisition/')
                        break
                    case '综合上报':
                        turn('/terminalManage/salesIntegrated/list')
                        break
                }
            },
            load () {
                axios.get('api/terminalVisit/visit/id/' + this.formData._id).then(res => {
                    if (res.data) {
                        let data = res.data;
                        if (data.visitType === '计划拜访' && data.endTime && !data.endVisit && moment().isAfter(data.endTime)) {
                            data.status = '已失访'
                        }
                        this.formData = data
                    }
                }).catch(err => {
                    console.error(err.message);
                    $alert('获取今日拜访数据失败')
                })
            }
        },
        mounted() {
            if (this.detail) this.formData = this.detail
        }
    }
</script>

<style lang="scss" scoped>
.v_header {
    background: #fff;
    padding: 15px;
    font-size: 14px;
    color: #333;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;

    p {
        font-size: 12px;
        margin: 0;
        color: #999;
    }

    .vh_c {
        flex-grow: 1;
    }

    span {
        margin: 0 5px 0 0;
    }

    img {
        width: 8px;
        height: 12px;
    }
}

.v_time {
    .btn {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 40px;
        background: #fff;
        padding: 0 15px;
        font-size: 14px;
        color: #333;

        div {
            flex-grow: 1;
        }

        span {
            display: block;
            background: #01B38B;
            font-size: 12px;
            color: #fff;
            width: 53px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            border-radius: 22px;
        }
    }
}

.v_list_layer {
    margin-bottom: 20px;

    .v_list_t {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: #999;
        padding: 0 15px;
    }

    .v_list {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 40px;
        background: #fff;
        padding: 0 15px;
        font-size: 14px;
        color: #999;
        border-bottom: 1px solid #d8d8d8;

        div {
            flex-grow: 1;
        }

        span {
            margin-right: 10px;
            color: #4B946A;
        }

        img {
            width: 8px;
            height: 12px;
        }
    }
}

.v_time_c {
    background: #ffffff;

    .v_time_t {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 44px;
        background: #fff;
        padding: 0 15px;
        font-size: 14px;
        color: #666;
        border-bottom: 1px solid #d8d8d8;

        p {
            flex-grow: 1;
            margin: 0;
        }
    }

    .v_time_l {
        padding: 15px;
        .v_time_ct {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 14px;
            color: #333;
            p {
                flex-grow: 1;
                margin: 0;
            }
        }
        & > p {
            margin: 0;
            font-size: 12px;
            color: #999;
        }
    }
}
</style>
