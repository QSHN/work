<template>
    <f7-page>
        <f7-navbar :title="title" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="loadP">刷新位置</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="v_list_layer">
                    <div class="v_list">
                        <div class="v_list_t">客户名称</div>
                        <div class="v_list_c">{{client.name}}</div>
                    </div>
                    <div class="v_list">
                        <div class="v_list_t">客户位置</div>
                        <div class="v_list_c">{{client.location.address}}</div>
                    </div>
                </div>

                <div class="v_list_layer">
                    <div class="v_list">
                        <div class="v_list_t">{{isLeave ? '离店' : '到店'}}时间</div>
                        <div class="v_list_c">{{formData.time}}</div>
                    </div>
                    <div class="v_list">
                        <div class="v_list_t">{{isLeave ? '离店' : '到店'}}位置</div>
                        <div class="v_list_c">{{formData.position && formData.position.address}}</div>
                    </div>
                    <div class="v_list">
                        <div class="v_list_t">{{isLeave ? '离店' : '到店'}}偏差</div>
                        <div class="v_list_c" v-if="locOffset">距离偏差{{Math.floor(locOffset)}}米</div>
                    </div>
                </div>

                <div class="list-item photo-item" style="height: 110px; margin-top: 10px;">
                    <span class="item-icon"></span>
                    <label>相片 ({{formData.photos.length}} / 5)</label>
                    <div style="margin-left: 5px;">
                        <photoeditor
                                slot="inner"
                                :gallery="true"
                                :photos="formData.photos"
                                @photo:update="(photos) => {formData.photos = photos}">
                        </photoeditor>
                    </div>
                </div>
            </div>

            <div class="submit-button" @click="submit">提交</div>
        </div>
    </f7-page>
</template>

<script>
import photoeditor from '../../../gadget/photoeditor.vue';
import {getDistBetween, getAddress} from 'lib/amap';
import moment from 'moment'
export default {
    name: "location",
    components: {
        photoeditor
    },
    props: {
        isLeave: {
            type: Boolean,
            required: true
        },
        title : {
            type: String,
            required: true
        },
        client: {
            type: Object,
            required: true
        },
        change: {
            type: Function,
            required: true
        }
    },
    data () {
        return {
            formData: {
                time: '',
                position: null,
                photos: [],
            }
        }
    },
    computed: {
        locOffset() {
            if (!this.formData.position) return 0;

            let a = [this.formData.position.lng, this.formData.position.lat];
            let b = [this.client.location.lng, this.client.location.lat];
            let offset = getDistBetween(a, b);
            this.formData.position.offset = offset
            return offset
        }
    },
    methods: {
        loadP () {
            if (device.platform == "Android" || device.platform == "iOS") {
                if (cordova.plugins.aMapLocation) {
                    let self = this
                    cordova.plugins.aMapLocation.getCurrentPosition(null,  (response) => {
                        self.formData.position = {
                            lng: response.longitude,
                            lat: response.latitude,
                            address: response.address,
                            at: response.date
                        }
                        self.formData.time = moment().format('YYYY-MM-DD HH:mm:ss')
                        self.$forceUpdate()
                        console.log(self.formData.position)
                        if (!response.address) {
                            getAddress(response.longitude, response.latitude).then(address => {
                                self.formData.position.address = address
                                self.$forceUpdate()
                            })
                        }
                    }, function (response) {
                        $alert('获取定位失败');
                    })
                }
            }
        },
        submit () {
            if (this.formData.position) {
                this.change(this.formData)
            } else {
                $alert('请在打开手机APP，获取相关定位');
            }
        }
    },
    created() {
        this.loadP()
    }
}
</script>

<style lang="scss" scoped>
    .p_content {
        height: 100%;
        display: flex;
        flex-direction: column;

        .pc_layer {
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

    .v_list_layer {
        margin: 10px 0 0;
        background: #fff;
        padding: 0 15px;

        .v_list {
            border-bottom: 1px solid #d8d8d8;
            padding: 15px;
            display: flex;
            flex-direction: row;
            align-items: center;

            .v_list_t {
                min-width: 80px;
            }

            .v_list_c {
                flex-grow: 1;
                text-align: right;
                margin-left: 20px;
            }
        }
    }
</style>
