<template>
    <f7-page>
        <f7-navbar title="新增" back-link></f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="list-item clear-float" @click="selectClient">
                    <span class="item-icon">*</span>
                    <label>客户名称：</label>
                    <div style="float: right">
                        <div style="width: 20px; height: 46px; float: right;">
                            <img style="height: 12px; margin-top: 17px;" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                        </div>

                        <input class="item-input"
                               type="text"
                               placeholder="请选择"
                               v-model="formData.name"
                               style="padding-right: 5px;"
                               readonly />
                    </div>
                </div>

                <div class="list-item photo-item" style="height: 110px" v-for="(v, i) in formData.photos" :key="i">
                    <span class="item-icon"></span>
                    <label class="photo_label">
                        {{v.name}} ({{v.photos.length}} / 5)
                        <span v-if="i > 4" @click="deleteType(i)">删除</span>
                    </label>
                    <div style="margin-left: 5px;">
                        <photoeditor
                                slot="inner"
                                :gallery="true"
                                :photos="v.photos"
                                @photo:update="(photos) => {v.photos = photos}">
                        </photoeditor>
                    </div>
                </div>

                <div class="add" @click="addType">新增自定义终端形象拍照类型</div>

                <div class="list-item clear-float textarea-item">
                    <span class="item-icon"></span>
                    <label>备注</label>
                    <textarea  placeholder="请输入"
                               v-model="formData.des"
                               maxlength="500">
                    </textarea>
                </div>
            </div>

            <div class="submit-button" @click="submit">提交</div>
        </div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import axios from 'axios'
import photoeditor from '../../gadget/photoeditor.vue';
export default {
    name: "update",
    components: {
        photoeditor
    },
    props: ['uData', 'visitData'],
    data () {
        return {
            formData: {
                name: '',
                photos: [
                    {name: '终端', photos: []},
                    {name: '门头', photos: []},
                    {name: '货架', photos: []},
                    {name: '堆头', photos: []},
                    {name: '陈列', photos: []}
                ],
                des: ''
            }
        }
    },
    computed: {
        ...mapGetters([
            'who',
            'myCompany',
            'myProfile',
            'departmentName',
            'getSuperiorAdmin',
            'myUserId',
            'superAdmin'
        ]),
    },
    methods: {
        selectClient () {
            this.$f7router.navigate('/selectList', {
                props: {
                    isAdd: false,
                    which: {
                        name: '客户',
                        type: 'name'
                    },
                    url: 'client/',
                    choose: (type, val) => {
                        this.formData.name = val.name
                        this.$f7router.back()
                    }
                }
            })
        },
        addType () {
            this.$f7router.navigate('/terminalManage/imageAcquisition/type', {
                props: {
                    tList: this.formData.photos,
                    choose: (name) => {
                        this.formData.photos.push({name: name, photos: []})
                        this.$f7router.back()
                    }
                }
            })
        },
        deleteType (index) {
            this.formData.photos.splice(index, 1);
        },
        submit () {
            if (!this.formData.name) {
                $alert('请选择客户')
            } else {
                let admin = []
                let superior = this.getSuperiorAdmin(this.myUserId)
                if (this.superAdmin._id === this.myUserId) {
                    admin = [this.superAdmin._id]
                } else if (superior.length) {
                    superior.map(v => {
                        if (!admin.includes(v)) admin.push(v)
                    })
                }
                if (admin.length == 0) admin = [this.superAdmin._id]
                this.formData.approver = admin
                axios[this.uData ? 'post' : 'put']('api/imageAcquisition/', this.formData).then(res => {
                    $alert('终端形象采集成功', () => {
                       this.$f7router.back();
                    });
                    if (!this.uData) {
                        if (cordova.plugins.aMapLocation) {
                            this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: '终端形象采集'})
                        }
                    }
                }).catch(err => {
                    console.error(err.message);
                    $alert('终端形象采集失败');
                })
            }
        }
    },
    mounted() {
        if (this.uData) this.formData = this.uData
        if (this.visitData) {
            this.formData.visitId = this.visitData._id
            this.formData.name = this.visitData.client.name
        }
    }
}
</script>


<style lang="scss" scoped>
    .p_content {
        height: 100%;
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

    .add {
        height: 45px;
        line-height: 45px;
        text-align: center;
        font-size: 14px;
        color: #333;
        margin: 10px 0;
        background: #fff;
    }
</style>

