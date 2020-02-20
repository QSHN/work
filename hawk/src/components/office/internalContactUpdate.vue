<template>
    <f7-page>
        <f7-navbar title="公司内部联络单" back-link>
        </f7-navbar>

        <div class="p_layer">
            <div class="p_c">
                <div class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>发文人：</label>
                    <div style="float: right">
                        <input class="item-input"
                               type="text"
                               placeholder=""
                               :value="formData.creator && myProfile.name"
                               style="padding-right: 5px;"
                               readonly />
                    </div>
                </div>

                <div class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>收文人：</label>
                    <div style="float: right"  @click = "(personnelPopup = true)">
                        <input class="item-input"
                               type="text"
                               placeholder="确定收文人"
                               :value="employees"
                               style="padding-right: 5px;"
                               readonly />
                    </div>
                </div>

                <div class="list-item clear-float" @click="selectType">
                    <span class="item-icon">*</span>
                    <label>发文类型：</label>
                    <div style="float: right">
                        <div style="width: 20px; height: 46px; float: right;">
                            <img style="height: 12px; margin-top: 17px;" src='../../assets/images/arrow_right_gray copy 2@2x.png'>
                        </div>

                        <input class="item-input"
                               type="text"
                               placeholder="请选择"
                               v-model="formData.cType"
                               style="padding-right: 5px;"
                               readonly />
                    </div>
                </div>

                <div class="list-item clear-float textarea-item">
                    <span class="item-icon">*</span>
                    <label>联络内容</label>
                    <textarea  placeholder="请输入"
                               v-model="formData.content"
                               maxlength="500">
                    </textarea>
                </div>

                <div class="list-item photo-item" style="min-height: 115px !important;">
                    <span class="item-icon">*</span>
                    <label>审批人</label>
                    <div class="clearfix">
                        <div class="item-selpon" v-for="(item,index) in formData.approver">
                            <div class="item-person">
                                <div class="item-image">
                                    <img :src="item.uid && who(item.uid).avatarUrl || hp_default_96" width="40px" height="40px" style="float: left">
                                </div>
                                <div class="delete-person" @click="deleteperson(index)">
                                    <img :src=btn_close_small_black width="13" height="13">
                                </div>
                                <span class="spanname">{{item.uid ? who(item.uid).name:"请选择"}}</span>
                            </div>

                            <div class="item-person" v-if="index !== formData.approver.length-1" style="float: left;">
                                <img :src=arrow_process_right_gray style="position: relative; width: 13px;height: 13px; margin: 14px 5px;">
                            </div>
                        </div>
                        <div class="item-selpon" @click="selectorPersonnelShow=true">
                            <div class="item-image">
                                <img :src=btn_add_people width="40px" height="40px">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="submit-button" @click="submit">提交</div>
            </div>

            <f7-popup :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
                <permissionselector
                        :noFinanceOrTrative = "true"
                        :isMultiple="true"
                        @employee:selected="onSelectorapprover"
                        @employee:cancel="selectorPersonnelShow = false"
                ></permissionselector>
            </f7-popup>

            <f7-popup :opened="personnelPopup" @popup:closed="personnelPopup = false">
                <personnelselector
                        :multiple="true"
                        @submit="selectEmployee"
                        @cancel="personnelPopup = false"
                ></personnelselector>
            </f7-popup>
        </div>
    </f7-page>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import axios from 'axios'
    import permissionselector from '../gadget/permissionselector.vue';
    import personnelselector from '../gadget/personnelselector.vue';
    const hp_default_96 = require("assets/images/hp_default_96@2x.png");
    const btn_add_people = require("assets/images/btn_add_people@2x.png");
    const arrow_process_right_gray = require("assets/images/arrow_process_right_gray@2x.png");
    const btn_close_small_black = require("assets/images/btn_close_small_black@2x.png");
    const arrow_right_gray = require("assets/images/arrow_right_gray@2x.png");

    export default {
        name: "internalContactUpdate",
        components: {
            personnelselector,
            permissionselector
        },
        props: ['uData'],
        data () {
            return {
                hp_default_96,
                btn_add_people,
                arrow_right_gray,
                btn_close_small_black,
                arrow_process_right_gray,
                formData: {
                    creator: '',
                    approver: [],
                    status: '待审批',
                    send: [],
                    content: '',
                    cType: ''
                },
                selectorPersonnelShow: false,
                personnelPopup: false
            }
        },
        computed: {
            ...mapGetters([
                'who',
                'myProfile',
                'personnel'
            ]),
            employees() {
                let l = [];
                this.personnel.forEach((p) => {
                    if (this.formData.send.includes(p._id)) {
                        l.push(p.name);
                    }
                });
                if (l.length == 0) { return '' }
                return l[0] + '等' + l.length + '人';
            },
        },
        methods: {
            onSelectorapprover(ulist){
                this.selectorPersonnelShow = false;
                this.formData.approver = [];
                ulist.forEach(v => {
                    this.formData.approver.push({
                        uid: v,
                        comment: '',
                        status: '待审批'
                    })
                })
                this.$forceUpdate();
            },
            selectEmployee(pList) {
                this.formData.send = pList;
                this.personnelPopup = false;
                this.$forceUpdate();
            },
            selectType () {
                this.$f7router.navigate('/selectList', {
                    props: {
                        isAdd: true,
                        which: {
                            name: '公司内部联络单类型',
                            type: 'type'
                        },
                        url: 'internalContact/type',
                        choose: (type, val) => {
                            this.formData.cType = val
                            this.$f7router.back()
                        }
                    }
                })
            },
            submit () {
                if (!this.formData.creator) {
                    $alert('数据出错，请返回重新进来')
                } else if (!this.formData.send.length) {
                    $alert('请选择收文人')
                } else if (!this.formData.cType) {
                    $alert('请选择发文类型')
                } else if (!this.formData.content.length) {
                    $alert('请输入联络内容')
                } else if (!this.formData.approver.length) {
                    $alert('请选择审批人')
                } else {
                    axios[this.uData ? 'post' : 'put']('api/internalContact/', this.formData).then(res => {
                        $alert('公司内部联络单发起成功', () => {
                            this.$f7router.back()
                        });
                        if (cordova.plugins.aMapLocation) {
                            this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: `公司内部联络单`})
                        }
                    }).catch(err => {
                        console.error(err.message);
                        $alert('公司内部联络单生成失败');
                    })
                }
            }
        },
        mounted() {
            if (this.uData) {
                this.formData = this.uData
            } else {
                if (this.myProfile) {
                    this.formData.creator = this.myProfile._id
                }
            }

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
    min-height: 90px !important;
    padding-bottom: 10px;

    .photo_label {
        width: calc(100% - 36px);
        display: inline-block;

        span {
            width: 80px;
            font-size: 12px;
            color: #FF715A;
            float: right;
            text-align: right;
        }
    }
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
    margin-top: 10px;
}
.item-person{
    position: relative;
    float: left;
}
</style>
