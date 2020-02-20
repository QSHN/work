<template>
    <f7-page class="commodity_manage" @page:reinit="resetLoad">
        <f7-navbar title="商品详情" back-link>
            <f7-nav-right v-if="isEmployee">
                <f7-link href="#" @click="$f7.actions.open('#files-action', true);">操作</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="list" style="margin: 10px 0;">
            <div class="list_l">
                <img v-if="img" :src="img" />
                <img v-else src="../../../assets/images/pic_no_photo@2x.png" />
            </div>

            <div class="list_c">
                <div class="title">
                    <div class="name">{{formData.name}}</div>
                    <span class="label" v-if="formData.label">{{formData.label}}</span>
                </div>
                <p>编号：{{formData.coding}}</p>
                <p>条形码：{{formData.barCode}}</p>
            </div>

            <div class="list_r">
                <img class="status" :src='getStatusImg(formData.status)'>
                <img class="arrow" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
            </div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>单价：</label>
            <div style="float: right; margin-right: 14px;">{{formData.price}} 元</div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>建议零售价(元)：</label>
            <div style="float: right; margin-right: 14px;">{{formData.retailPrice}} 元</div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>进货价(元)：</label>
            <div style="float: right; margin-right: 14px;">{{formData.costPrice}} 元</div>
        </div>

        <div class="list-item clear-float"
             @click="$f7router.navigate('/psiManage/commodityManage/class', {
                    props: {
                        choose: () => {},
                        isLook: true,
                        uList: formData.classPrice
                    }
             })">
            <span class="item-icon"></span>
            <label>等级价：</label>
            <div style="float: right">
                <div style="width: 20px; height: 46px; float: right;">
                    <img style="height: 12px; margin-top: 17px;" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                </div>

                <input class="item-input"
                       type="text"
                       placeholder="查看"
                       style="padding-right: 5px;"
                       readonly />
            </div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>助记码：</label>
            <div style="float: right; margin-right: 14px;">{{formData.mnemonic || '无'}}</div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>类型：</label>
            <div style="float: right; margin-right: 14px;">{{formData.type}}</div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>品牌：</label>
            <div style="float: right; margin-right: 14px;">{{formData.brand}}</div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>规格：</label>
            <div style="float: right; margin-right: 14px;">{{formData.standard}}</div>
        </div>

        <div class="list-item clear-float" style="margin: 10px 0;">
            <span class="item-icon"></span>
            <label>基本单位：</label>
            <div style="float: right; margin-right: 14px;">{{formData.unit}}</div>
        </div>

        <div v-for="(v, i) in formData.unitList" :key="i" style="margin-top: -10px;">
            <div class="list-item clear-float">
                <span class="item-icon"></span>
                <label>辅助单位{{i + 1}}：</label>
                <div style="float: right; margin-right: 14px;">{{v.unit}}</div>
            </div>

            <div class="list-item clear-float" v-if="v.unit">
                <span class="item-icon"></span>
                <label>换算关系：</label>
                <div style="float: right; margin-right: 14px;">
                    1{{formData.unit}} = {{v.count}} {{v.unit}}
                </div>
            </div>
        </div>

        <div class="list-item photo-item" style="height: 110px; margin-top: 10px">
            <span class="item-icon"></span>
            <label>商品照片 ({{formData.photos.length}} / 5)</label>
            <photoeditor
                    slot="inner"
                    :gallery="true"
                    :photos="formData.photos"
                    :readonly="true"
                    @photo:update="(photos) => {formData.photos = photos}"
            ></photoeditor>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>生产日期：</label>
            <div style="float: right; margin-right: 14px;">{{formData.produced && moment(formData.produced).format('YYYY-MM-DD')}}</div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>保质期：</label>
            <div style="float: right; margin-right: 14px;">{{formData.expiration}}{{formData.expiration && formData.dateUnit}}</div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>通知过期日期：</label>
            <div style="float: right; margin-right: 14px;">提前{{formData.noteTime || 10 }}天开始通知</div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>重量：</label>
            <div style="float: right; margin-right: 14px;">{{formData.weight}}</div>
        </div>


        <div class="list-item clear-float textarea-item">
            <span class="item-icon"></span>
            <label>备注</label>
            <textarea  placeholder=""
                       v-model="formData.des"
                        readonly>
            </textarea>
        </div>

        <f7-actions id="files-action">
            <f7-actions-group>
                <f7-actions-button class="hawk-actions-button" @click="goDetail">编辑商品</f7-actions-button>
                <f7-actions-button class="hawk-actions-button" @click="changeStatus">{{formData.status ? '停售' : '起售'}}商品</f7-actions-button>
                <f7-actions-button class="hawk-actions-button" @click="deleteFun">删除商品</f7-actions-button>
            </f7-actions-group>
            <f7-actions-group>
                <f7-actions-button color="red">取消</f7-actions-button>
            </f7-actions-group>
        </f7-actions>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import barCodeBtn from '../../_module/barcodeBtn'
import photoeditor from '../../gadget/photoeditor.vue';
import axios from 'axios'
import moment from 'moment'
export default {
    name: "update",
    components: {
        barCodeBtn,
        photoeditor
    },
    props: {
        uData: {
            type: Object
        },
        img: {
            type: String
        }
    },
    data () {
        return {
            formData: {
                type: '',
                name: '',
                coding: `SP${Date.parse(new Date())}${Math.floor(Math.random () * 900) + 100}`,
                label: '',
                barCode: '',
                standard: '',
                brand: '',
                photos: [],
                retailPrice: '',
                costPrice: '',
                price: '',
                classPrice: '',
                unit: '',
                unitList: [],
                expiration: '',
                weight: '',
                mnemonic: '',
                des: '',
                status: true
            },
            isRestLoad: false
        }
    },
    computed: {
        ...mapGetters([
            'superAdmin',
            'myUserId',
            'myProfile',
            'who',
            'isDepartmentAdmin'
        ]),
        isAdministrative () {
            return this.myProfile.privilege.some(i => ['合同管理', '企业设置'].includes(i))
        },
        isFinance () {
            return this.myProfile.accountType === '财务'
        },
        isEmployee () {
            return this.superAdmin._id === this.myUserId || this.isDepartmentAdmin(this.myUserId) || this.isAdministrative || this.isFinance
        }
    },
    methods: {
        moment,
        getStatusImg (status) {
            return require(`../../../assets/images/${status ? 'icon_sold _in_the_label_green' : 'icon_stop_label_red'}@2x.png`)
        },
        goDetail () {
            this.isRestLoad = true
            this.$f7router.navigate('/psiManage/commodityManage/update', {
                props: {
                    uData: this.formData
                }
            })
        },
        resetLoad () {
            if (this.isRestLoad) {
                this.isRestLoad = false
                axios.get('api/commodity/' + this.formData._id).then(res => {
                    this.formData = res.data
                }).catch(err => {
                    console.error(err.message);
                })
            }
        },
        changeStatus () {
            $confirm(`确定${this.formData.status ? '停售' : '起售'}吗`, '操作确认', () => {
                let obj = Object.assign({}, this.formData)
                obj.status = !obj.status
                axios.post('api/commodity/', obj).then(res => {
                    this.formData.status = obj.status
                    this.$forceUpdate()
                    $alert('成功修改商品销售状态')
                    if (cordova.plugins.aMapLocation) {
                        this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: `修改商品销售状态`})
                    }
                }).catch(err => {
                    console.error(err.message);
                    $alert('更改商品销售状态失败')
                })
            })
        },
        deleteFun () {
            $confirm(`确定删除吗吗`, '操作确认', () => {
                axios.delete('api/commodity/' + this.formData._id).then(res => {
                    $alert('删除成功', () => {
                        this.$f7router.back()
                    })
                    if (cordova.plugins.aMapLocation) {
                        this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: `删除商品`})
                    }
                }).catch(err => {
                    // console.error(err.message);
                    $alert(err.response.data.message)
                })
            })
        }
    },
    mounted () {
        if (this.uData) this.formData = this.uData
    }
}
</script>

<style lang="scss" scoped>
    .hawk-actions-button {
        color: #0B0B0B;
    }
    .list {
        width: 100%;
        height: 84px;
        border-bottom: 1px solid #D8D8D8;
        display: flex;
        flex-direction: row;
        margin: 0;
        background: #fff;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
        }

        .list_l {
            width: 60px;
            height: 60px;
            margin: 10px;
        }

        .list_c {
            padding-right: 20px;
            flex-grow: 1;
            overflow: hidden;

            .title {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-top: 12px;

                .name {
                    font-size: 16px;
                    line-height: 16px;
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
                font-size: 14px;
                line-height: 14px;
                margin: 6px 0 0;
                color: #666;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }

        .list_r {
            width: 35px;

            .status {
                width: 35px;
                height: 35px;
            }

            .arrow {
                width: 8px;
                height: 12px;
                margin: 2px 0 0 12px;
            }
        }
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
</style>

