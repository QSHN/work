<template>
    <f7-page>
        <f7-navbar title="铺货上报" back-link>
            <f7-nav-right v-if="!visitData">
                <f7-link href="#" @click="$f7router.navigate('/terminalManage/shopGoods/list')">上报记录</f7-link>
            </f7-nav-right>
        </f7-navbar>

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

                <div class="list-item clear-float" @click="selectCommodity">
                    <span class="item-icon">*</span>
                    <label>SKU数：</label>
                    <div style="display: inline-block; margin-left: 10px;">
                        标准
                        <span style="color: #4B946A; margin-right: 10px;">0</span>
                        实际
                        <span style="color: #4B946A;">{{formData.commodity.length}}</span>
                    </div>
                    <div style="float: right">
                        <div class="list_item_btn">添加商品</div>
                    </div>
                </div>

                <div class="commodity" v-if="formData.commodity.length">
                    <div class="item" v-for="(v, i) in formData.commodity">
                        <div class="title">
                            <div class="name">{{v.name}}</div>
                            <span class="label" v-if="v.label">{{v.label}}</span>
                        </div>
                        <p>商品编号： {{v.coding || '无'}}</p>
                        <p>类型： {{v.type}}</p>
                        <p>规格： {{v.standard || '无'}}</p>

                        <img src="../../../assets/images/icon_prune_gray@2x.png"  @click="formData.commodity.splice(i, 1)" />
                    </div>
                </div>

                <div class="list-item photo-item" style="height: 110px">
                    <span class="item-icon">*</span>
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
import {mapGetters,mapMutations,mapActions} from 'vuex';
import photoeditor from '../../gadget/photoeditor.vue';
import axios from 'axios'
export default {
    name: "index",
    components: {
        photoeditor
    },
    props: {
        visitData: {
            type: Object,
            default: null
        }
    },
    data () {
        return {
            formData: {
                name: '',
                commodity: [],
                photos: [],
                des: ''
            },
            clientGrade: ''
        }
    },
    computed:{
        ...mapGetters([
            'getSuperiorAdmin',
            'myUserId',
            'superAdmin'
        ])
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
                        this.clientGrade = val.grade
                        this.$f7router.back()
                    }
                }
            })
        },
        selectCommodity (defaultVal) {
            if (!this.formData.name) {
                $alert('请先选择客户', () => {
                    this.selectClient()
                })
            } else {
                this.$f7router.navigate('/selectCommodity', {
                    props: {
                        cId: defaultVal && defaultVal.commodity && defaultVal.commodity._id || '',
                        commodity: this.formData.commodity,
                        clientGrade: this.clientGrade,
                        noForm: true,
                        choose: (val) => {
                            this.formData.commodity = val
                            this.$f7router.back()
                        }
                    }
                })
            }
        },
        submit () {
            if (!this.formData.name) {
                $alert('请选择客户')
            } else if (!this.formData.commodity.length) {
                $alert('请添加商品')
            } else if (!this.formData.photos.length) {
                $alert('请上传相片')
            } else {
                $alert('是否提交？', () => {
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
                    axios.put('api/shopGoods/', this.formData).then(res => {
                        $alert('铺货上报成功', () => {
                            if (this.visitData) {
                                this.$f7router.back()
                            } else {
                                this.$f7router.navigate('/terminalManage/shopGoods/list')
                            }
                        })
                        if (cordova.plugins.aMapLocation) {
                            this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: '铺货上报'})
                        }
                    }).catch(err => {
                        console.error(err.message);
                        $alert('铺货上报失败')
                    })
                })
            }
        }
    },
    mounted() {
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
        display: flex;
        flex-direction: column;

        .pc_layer {
            flex-grow: 1;
            overflow-y: auto;
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
        min-height: 90px!important;
        margin-bottom: 10px;
        padding-bottom: 10px;
    }

    .item-selpon{
        width: 60px;
        height: 60px;
        margin-top: 17px;
        margin-left: 20px;
        float: left;

    }
    .item-selpon .item-image{

        width: 40px;
        margin: 0 auto;
        height: 40px;
        background-color: gainsboro;
        float: top;
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
        width: 30px;
        line-height: 20px;
        /*background: red;*/
        position: relative;
        right: 5px;
    }

    .delete-person{
        width: 10px;
        height: 10px;
        float: left;
        bottom: 45px;
        left: 33px;
        position: relative;
        display: inline-block;
    }

    .submit-button{
        width:100%;
        height:45px;
        min-height: 45px;
        line-height: 45px;
        font-size:16px;
        color: #FFFFFF;
        text-align: center;
        background:#3385FF;
        margin-top: 50px;
    }
    .item-person{
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
</style>
