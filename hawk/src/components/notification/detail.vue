<template>
    <f7-page style="  background: #FFFFFF;">
        <f7-navbar :title="'系统消息'" back-link>
            <f7-nav-right>
                <f7-link @click="chear">删除</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <div class="msg-detail">
            <div class="title">{{msg.title}}</div>
            <div class="time">{{formatDate(msg.createdAt)}}</div>
            <div class="content" v-html="msg.content"></div>
            <div class="content"
                 v-if="(msg.category === '加班' ||
                        msg.category === '请假' ||
                        msg.category === '出差') &&
                        msg.applyId && msg.applyId.length"
                 @click="go(msg.category, msg.applyId)"
                 style="cursor: pointer; color: #007aff">
                审批
            </div>

            <div class="content"
                 v-if="(msg.category === '拜访' ||
                        msg.category === '报销' ||
                        msg.category === '采购' ||
                        msg.category === '付款' ||
                        msg.category === '用车' ||
                        msg.category === '用章' ||
                        msg.category === '日报' ||
                        msg.category === '财务审批'||
                        msg.category === '合同审批'||
                        msg.category === '绩效报告'||
                        msg.category === '物品领用'||
                        msg.category === '邀约到访'||
                        msg.category === '销售业绩'||
                        msg.category === '铺货上报'||
                        msg.category === '库存上报'||
                        msg.category === '销量上报'||
                        msg.category === '综合上报'||
                        msg.category === '终端形象采集'||
                        msg.category === '竞品上报'||
                        msg.category === '销售订单'||
                        msg.category === '销售退货单'||
                        msg.category === '收款登记'||
                        msg.category === '退款登记'||
                        msg.category === '调拨单据'||
                        msg.category === '库存盘点'||
                        msg.category === '提货申请'||
                        msg.category === '回库申请'||
                        msg.category === '车载库存盘点'||
                        msg.category === '车销单'||
                        msg.category === '退换货再售'||
                        msg.category === '终端拜访'||
                        msg.category === '进货单'||
                        msg.category === '公司内部联络单') &&
                        msg.applyId && msg.applyId.length"
                 @click="look(msg.category, msg.applyId)"
                 style="cursor: pointer; color: #007aff">
                查看
            </div>

            <div class="content"
                 v-if="msg.category === '汇报' && msg.content.includes('条汇报未读')"
                 @click="goReportList"
                 style="cursor: pointer; color: #007aff">
                查看
            </div>

            <div class="content"
                 v-if="msg.category === '日报' && msg.content.includes('条日报未读')"
                 @click="goJournalList"
                 style="cursor: pointer; color: #007aff">
                查看
            </div>

            <div class="content"
                 v-if="msg.category === '员工评分'"
                 @click="look('员工评分')"
                 style="cursor: pointer; color: #007aff">
                查看
            </div>

            <div class="content"
                 v-if="(msg.category === '日报' || msg.category === '汇报') && msg.content.includes('还没提交')"
                 @click="goSubmit(msg.category)"
                 style="cursor: pointer; color: #007aff">
                提交
            </div>
        </div>
    </f7-page>
</template>
<style scoped>
   .msg-detail{
       padding: 10px 15px;

   }
   .msg-detail .title{
       font-size: 21px;
       line-height: 35px;
       font-weight: 500;
       color: #333333;
   }
   .msg-detail .time{
       font-size: 13px;
       color: #999999;


   }
   .msg-detail .content{
       margin-top: 15px;
       color: #333333;
       font-size: 15px;
       line-height: 28px;

   }
</style>
<script>
import {mapGetters, mapActions} from 'vuex';
import dateFormat from 'lib/dateformat.js';
import axios from 'axios';
export default {
    name: "message",
    props: {
        msg: {
            type: Object,
            default: function () {
                return {};
            }
        },
    },
    data: () => {
        return {
            systemImg:require("assets/images/icon_system_messages_orange@2x.png")
        }
    },

    computed: {
        ...mapGetters([
            'notification',
            'who',
            'myCompany'
        ])
    },

    methods: {

        chear(){

            $dialog.confirm('确定要删除这条消息吗？', '删除后无法复原', (ok) => {
                $preloader.show();
                axios.delete("/api/notification/"+this.msg._id).then(resp=>{
                    this.$f7router.back();
                    this.$forceUpdate();
                    $preloader.hide()
                    if (cordova.plugins.aMapLocation) {
                        this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: '上传消息'})
                    }
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                });
            });

        },
        formatDate(date){
            return dateFormat(date,'yyyy-mm-dd HH:MM');
        },
        go (type, id) {
            let filters = {
                _id: id,
                category: type
            }
            axios.get('api/application?q=' + JSON.stringify(filters)).then(resp => {
                let category = {
                    '请假': 'leave',
                    '加班': 'overtime',
                    '出差': 'travel'
                }
                this.records = [];
                this.$f7router.navigate('/office/' + category[type] + '/', {
                    props: {
                        lastPage: '考勤审批',
                        reference: resp.data[0]
                    }
                });
            }).catch(err => {
                console.error(err);
                this.inform('无法获取数据，请稍后再试', '操作失败');
            })
        },

        look (type, id) {
            if (type === '报销') {
                axios.get('api/expensemgr/' + id).then(resp => {
                    this.$f7router.navigate('/office/expensedateil/', {
                        props: {
                            lastPage: '费用报销',
                            reference: resp.data
                        }
                    });
                }).catch(err => {
                    console.error(err);
                });
            } else if (type === '拜访') {
                axios.get('api/visit/' + id).then(resp => {
                    this.$f7router.navigate('/client/visitdateil/', {
                        props: {
                            visit: resp.data,
                            statue: 0
                        }
                    });
                }).catch(error => {
                    console.error(error);
                })
            } else if (type === '采购') {
                axios.get('api/procurement/' + id).then(resp => {
                    this.$f7router.navigate('/office/procurementdateil/', {
                        props: {
                            lastPage: '采购申请',
                            reference: resp.data
                        }
                    });
                }).catch(err => {
                    console.error(err);
                });
            } else if (type === '付款') {
                axios.get('api/paymentmgr/' + id).then(resp => {
                    this.$f7router.navigate('/office/paymentdateil/', {
                        props: {
                            lastPage: '付款申请',
                            reference: resp.data
                        }
                    });
                }).catch(err => {
                    console.error(err);
                });
            } else if (type === '用车') {
                axios.get('/api/car/?id=' + id).then(res => {
                    this.$f7router.navigate('/office/carList/detail/',{
                        props: {
                            item: res.data[0]
                        }
                    })
                    $preloader.hide();
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            } else if (type === '用章') {
                axios.get('/api/seal/?id=' + id).then(res => {
                    this.$f7router.navigate('/office/sealList/detail/',{
                        props: {
                            item: res.data[0]
                        }
                    })
                    $preloader.hide();
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            } else if (type === '日报') {
                axios.get('/api/journalmgr/' + id).then(res => {
                    this.$f7router.navigate('/office/journaldetail/', {
                        props: {
                            item: res.data
                        }
                    });
                    $preloader.hide();
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            } else if (type === '财务审批') {
                axios.get(`api/finance/transaction?q=${JSON.stringify({_id: id})}`).then(resp => {
                    let item = resp.data[0]
                    let name = ''
                    let shortname = ''
                    if (/^GZ/.test(item.code)) {
                        name = '固定支出'
                        shortname = '支出'
                    }
                    if (/^YS/.test(item.code)) {
                        name = '应收账款'
                        shortname = '应收'
                    }
                    if (/^YF/.test(item.code)) {
                        name = '应付账款'
                        shortname = '应付'
                    }
                    this.$f7router.navigate('/finance/transaction/', {
                        props: {
                            contextType: '_detail',
                            name,
                            shortname,
                            reference: item
                        }
                    });
                }).catch(err => {
                    console.log(err);
                    $alert('无法更新数据', '操作错误');
                })
            } else if (type === '合同审批') {
                axios.get('/api/contract/?id=' + id).then(res => {
                    this.$f7router.navigate('/office/contractList/detail/',{
                        props: {
                            item: res.data[0]
                        }
                    })
                    $preloader.hide();
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            } else if (type === '绩效报告') {
                axios.get('/api/performance/?id=' + id).then(res => {
                    this.$f7router.navigate('/office/performanceList/detail/',{
                        props: {
                            item: res.data[0]
                        }
                    })
                    $preloader.hide();
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            } else if (type === '物品领用') {
                axios.get('/api/goods/?id=' + id).then(res => {
                    this.$f7router.navigate('/office/goodsList/detail/',{
                        props: {
                            item: res.data[0]
                        }
                    })
                    $preloader.hide();
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            } else if (type === '邀约到访') {
                axios.get('/api/invitation/?id=' + id).then(res => {
                    this.$f7router.navigate('/client/invitationList/detail/',{
                        props: {
                            item: res.data[0]
                        }
                    })
                    $preloader.hide();
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            } else if (type === '销售业绩') {
                axios.get('/api/salesmanage/?id=' + id).then(res => {
                    this.$f7router.navigate('/office/salesmanageList/detail/',{
                        props: {
                            item: res.data[0]
                        }
                    })
                    $preloader.hide();
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            } else if (type === '铺货上报') {
                this.getDetail('/api/shopGoods/id/' + id, '/terminalManage/shopGoods/detail')
            } else if (type === '库存上报') {
                this.getDetail('/api/inventory/id/' + id, '/terminalManage/inventory/detail')
            } else if (type === '销量上报') {
                this.getDetail('/api/salesVolume/id/' + id, '/terminalManage/salesVolume/detail')
            } else if (type === '综合上报') {
                this.getDetail('/api/salesIntegrated/id/' + id, '/terminalManage/salesIntegrated/detail')
            } else if (type === '终端形象采集') {
                this.getDetail('/api/imageAcquisition/id/' + id, '/terminalManage/imageAcquisition/detail')
            } else if (type === '竞品上报') {
                this.getDetail('/api/competingGoods/id/' + id, '/terminalManage/competingGoods/detail')
            } else if (type === '销售订单') {
                this.getDetail('/api/salesOrder/id/' + id, '/psiManage/salesOrder/detail')
            } else if (type === '销售退货单') {
                this.getDetail('/api/salesReturn/id/' + id, '/psiManage/salesReturn/detail')
            } else if (type === '收款登记') {
                this.getDetail('/api/paymentRegistration/id/' + id, '/psiManage/paymentRegistration/detail')
            } else if (type === '退款登记') {
                this.getDetail('/api/refundRegistration/id/' + id, '/psiManage/paymentRegistration/detail', 'isTK')
            } else if (type === '调拨单据') {
                this.getDetail('/api/transfersDocuments/id/' + id, '/psiManage/transfersDocuments/detail')
            } else if (type === '库存盘点') {
                this.getDetail('/api/inventoryVerification/id/' + id, '/psiManage/inventoryVerification/detail')
            } else if (type === '提货申请') {
                this.getDetail('/api/carSales/bill/id/' + id, '/psiManage/carSales/bill/detail')
            } else if (type === '回库申请') {
                this.getDetail('/api/carSales/back/id/' + id, '/psiManage/carSales/back/detail')
            } else if (type === '车载库存盘点') {
                this.getDetail('/api/carSales/inventoryCheck/id/' + id, '/psiManage/carSales/inventoryCheck/detail')
            } else if (type === '车销单') {
                this.getDetail('/api/carSales/order/id/' + id, '/psiManage/carSales/order/detail')
            } else if (type === '退换货再售') {
                this.getDetail('/api/carSales/refundable/id/' + id, '/psiManage/carSales/refundable/detail')
            } else if (type === '终端拜访') {
                this.getDetail('/api/terminalVisit/visit/id/' + id, '/terminalManage/terminalVisit/visit/', 'terminalVisit')
            } else if (type === '进货单') {
                this.getDetail('/api/purchase/id/' + id, '/psiManage/purchase/detail')
            } else if (type === '公司内部联络单') {
                axios.get('api/internalContact/', {
                    id: id
                }).then(res => {
                    this.$f7router.navigate('/office/internalContact/detail/',{
                        props: {
                            detail: res.data[0]
                        }
                    })
                    $preloader.hide();
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('获取公司内部联络单详情失败')
                })
            } else if (type === '员工评分') {
                this.$f7router.navigate('/office/employeesScore/')
            }
        },
        getDetail (url, router, type) {
            axios.get(url).then(res => {
                let props = {
                    detail: res.data
                }
                if (type === 'isTK') props.isTK = true
                if (type === 'terminalVisit') router = router + (res.data && res.data.task.length ? 'detail' : 'flow')
                this.$f7router.navigate(router,{
                    props: props
                })
                $preloader.hide();
            }).catch(err => {
                $preloader.hide();
                console.error(err);
                $alert('无法更新数据，请稍后再试', '操作错误');
            });
        },

        goReportList () {
            this.$f7router.navigate('/report/statistics/', {
                props: {
                    which: 'tabStatistic'
                }
            });
        },

        goJournalList () {
            this.$f7router.navigate('/office/journalList/');
        },

        goSubmit (type) {
            this.$f7router.navigate(type === '日报' ? '/office/journalmgr/' : '/report/submitdata');
        }
    }
};
</script>
