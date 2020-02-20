<template>
    <f7-page>
        <f7-navbar title="计划详情" back-link></f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>拜访人：</label>
                    <div style="float: right">
                        <div style="width: 20px; height: 46px; float: right;">
                            <img style="height: 12px; margin-top: 17px;" src='../../../../assets/images/arrow_right_gray copy 2@2x.png'>
                        </div>

                        <input class="item-input"
                               type="text"
                               placeholder="请选择"
                               v-model="who(formData.visitor) && who(formData.visitor).name"
                               style="padding-right: 5px;"
                               readonly />
                    </div>
                </div>

                <div class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>开始时间：</label>
                    <div style="float: right">
                        <div style="padding-right: 15px;">{{moment(formData.planStartTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
                    </div>
                </div>

                <div class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>结束时间：</label>
                    <div style="float: right">
                        <div style="padding-right: 15px;">{{moment(formData.planEndTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
                    </div>
                </div>

                <div class="list-item clear-float textarea-item">
                    <span class="item-icon">*</span>
                    <label>计划内容</label>
                    <textarea  placeholder="请输入"
                               v-model="formData.plan"
                               readonly>
                    </textarea>
                </div>

                <div class="list-item clear-float">
                    <span class="item-icon"></span>
                    <label>拜访客户：</label>
                </div>

                <div class="list_item1" v-for="(v, i) in formData.client" @click="visitFun(visitData[v._id])">
                    <div class="list_l">
                        <div class="title">
                            {{v.name}}
                            <span v-if="visitData[v._id]" :class="visitData[v._id].status === '已拜访' ? 'tip success' : visitData[v._id].status === '已失访' ? 'tip error' : 'tip'">{{visitData[v._id].status}}</span>
                        </div>
                        <p>地址： {{v.location && v.location.address || '无'}}</p>
                    </div>

                    <img class="arrow" src='../../../../assets/images/arrow_right_gray copy 2@2x.png' style="width: 8px; height: 12px;">
                </div>
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
    props: {
        detail: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            formData: {
                visitor: '',
                planStartTime: '',
                planEndTime: '',
                plan: '',
                client: []
            },
            visitData: {},
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
        visitFun (val) {
            if (this.formData.visitor !== this.myUserId && val.status === '待拜访') {
                $alert(this.who(this.formData.visitor).name + '还没开始拜访该客户')
            } else {
                this.$f7router.navigate(`/terminalManage/terminalVisit/visit/${val.task.length === 0 ? 'flow' : 'detail'}`, {
                    props: {
                        detail: val
                    }
                })
            }
        },
        load (id) {
            axios.post('api/terminalVisit/visit/list/', {
                planId: id
            }).then(res => {
                if (res.data) {
                    let list = res.data;
                    list.forEach(v => {
                        if (v.visitType === '计划拜访' && v.endTime && !v.endVisit && moment().isAfter(v.endTime)) {
                            v.status = '已失访'
                        }
                        this.$set(this.visitData, v.clientId, v)
                    })
                }
            }).catch(err => {
                console.error(err.message);
                $alert('获取今日拜访数据失败')
            })
        }
    },
    mounted() {
        if (this.detail) {
            this.formData = this.detail
            this.load(this.detail._id)
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
            overflow-x: hidden;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            flex-grow: 1;
        }
    }

    .list_item_btn {
        margin: 13px 12px 0 0;
        width: 70px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: #3385FF;
        font-size: 12px;
        color: #fff;
        border-radius: 20px;
    }
    .clear-float {
        clear:both;
        height: 0;
        line-height: 0;
        font-size: 0;
    }
    .textarea-item{
        height: 120px!important;
    }
    .textarea-item textarea{
        width: 100%;
        background:none;
        outline:none;
        border:0px;
        float: left;
        font-size: 14px;
        line-height: 1.5em;
        margin-top: -10px;
        padding-right: 15px;
        padding-left: 20px;
        box-sizing: border-box;
        height: 70%;
        color: #333;
    }

    .item_t {
        height: 44px;
        line-height: 44px;
        padding: 0 15px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .title {
            font-size: 14px;
            color: #666;
        }

        .delete {
            width: 80px;
            text-align: right;
            font-size: 12px;
            color: #FF715A;
        }
    }
    .list-item{
        background: #FFFFFF;
        width: 100%;
        height: 46px;
        font-size: 14px;
        line-height: 46px;
        border-bottom: 1px solid #f8f8f8;

    }
    .list-type {

        background: white;
        line-height: 45px;
        font-size: 14px;
        margin-top: 0px;
        margin-bottom: 0px;
    }
    .list-type div{
        display: inline-block;
        width: 50%;
        text-align: right;
        float: right;
        margin-right: 10px;
        color: darkgray;
    }
    .item-icon{
        display: inline-block;
        color: red;
        width: 18px;
        text-align: right;
    }

    .list-item .item-input{
        width: 150px;
        background:none;
        outline:none;
        border:0px;
        float: right;
        text-align: right;
        font-size: 14px;
        line-height: 46px;
        padding-right: 15px;
        box-sizing: border-box;
        color: #333;
    }

    .photo-item{

        background: #FFFFFF;
        width: 100%;
        font-size: 14px;
        line-height: 30px;
        min-height: 90px!important;
        margin-bottom: 10px;
        padding-bottom: 10px;
    }
    .item-selpon{
        /*width: 60px;*/
        height: 60px;
        margin-top: 5px;
        /*margin-left: 20px;*/
        float: left;
        &:nth-child(1){ margin-left: 10px; }
        &:last-child { margin-left: 20px; }
    }
    .item-selpon .item-image{

        width: 40px;
        margin: 0 auto;
        height: 40px;
        background-color: gainsboro;
        /*float: top;*/
        border-radius:20px;
        overflow: hidden;
    }
    .item-selpon span{
        display: block;
        font-size: 12px;
        text-align: center;
    }

    .spanname{
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 60px;
        line-height: 20px;
        /*background: red;*/
        position: relative;
        /*right: 5px;*/
    }

    .delete-person{
        width: 13px;
        height: 13px;
        top: -8px;
        right: 0;
        position: absolute;
        display: inline-block;
    }

    .submit-button{
        width:100%;
        height:45px;
        line-height: 45px;
        font-size:16px;
        color: #FFFFFF;
        text-align: center;
        background:#3385FF;
        margin-top: 50px;
    }
    .item-person{
        position: relative;
        float: left;
    }


    .commodity {
        background: #fff;
        margin: -1px 0 10px 0;
        padding: 0 10px 10px;
        /*overflow: hidden;*/

        .item {
            position: relative;
            background: #F8F8F8;
            border-radius: 4px;
            margin-top: 10px;
            padding: 10px;

            &:nth-child(1) { margin-top: 0; }


            img {
                position: absolute;
                right: 0;
                top: 0;
                width: 30px;
                height: 30px;
            }

            .btn {
                position: absolute;
                right: 0;
                bottom: 0;
                font-size: 14px;
                line-height: 34px;
                padding: 0 10px;
                color: #3385FF;
            }
        }

        .title {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;

            .name {
                font-size: 14px;
                line-height: 14px;
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
            font-size: 12px;
            line-height: 12px;
            margin: 5px 0 0;
            color: #999;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .line {
            border-bottom: 1px solid #D8D8D8;
            padding-bottom: 5px;
        }
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

    .list_item1 {
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #fff;
        padding: 15px;
        border-bottom: 1px solid #f8f8f8;

        .list_l {
            flex-grow: 1;
            margin-right: 15px;
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
</style>
