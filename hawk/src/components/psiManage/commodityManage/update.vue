<template>
    <f7-page class="commodity_manage">
        <f7-navbar title="新增商品" back-link></f7-navbar>

        <div class="list-item clear-float"
             @click="$f7router.navigate('/psiManage/commodityManage/type', {
                    props: {
                        chooseType: chooseType
                    }
             })">
            <span class="item-icon">*</span>
            <label>类型：</label>
            <div style="float: right">
                <div style="width: 20px; height: 46px; float: right;">
                    <img style="height: 12px; margin-top: 17px;" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                </div>

                <input class="item-input"
                       type="text"
                       placeholder="请选择"
                       v-model="formData.type"
                       style="padding-right: 5px;"
                       readonly />
            </div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon">*</span>
            <label>名称：</label>
            <div style="float: right">
                <input class="item-input"
                       type="text"
                       placeholder="请输入"
                       v-model="formData.name" />
            </div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon">*</span>
            <label>编码：</label>
            <div style="float: right">
                <input class="item-input"
                       type="text"
                       v-model="formData.coding"
                       readonly  />
            </div>
        </div>

        <div class="list-item clear-float"
             @click="$f7router.navigate('/psiManage/commodityManage/other', {
                    props: {
                        which: {
                            name: '标签',
                            type: 'label'
                        },
                        choose: choose
                    }
             })">
            <span class="item-icon"></span>
            <label>标签：</label>
            <div style="float: right">
                <div style="width: 20px; height: 46px; float: right;">
                    <img style="height: 12px; margin-top: 17px;" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                </div>

                <input class="item-input"
                       type="text"
                       placeholder="请选择"
                       v-model="formData.label"
                       style="padding-right: 5px;"
                       readonly />
            </div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>条形码：</label>
            <div style="float: right">
                <div style="width: 30px; height: 46px; float: right;">
                    <bar-code-btn @change="getBarCode" style="width: 18px; height: 18px; margin-top: 14px" />
                </div>

                <input class="item-input"
                       type="text"
                       placeholder="请扫描"
                       v-model="formData.barCode"
                       style="padding-right: 5px;"
                       readonly />
            </div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>规格：</label>
            <div style="float: right">
                <input class="item-input"
                       type="text"
                       placeholder="请输入"
                       v-model="formData.standard" />
            </div>
        </div>

        <div class="list-item clear-float"
             @click="$f7router.navigate('/psiManage/commodityManage/other', {
                    props: {
                        which: {
                            name: '品牌',
                            type: 'brand'
                        },
                        choose: choose
                    }
             })">
            <span class="item-icon"></span>
            <label>品牌：</label>
            <div style="float: right">
                <div style="width: 20px; height: 46px; float: right;">
                    <img style="height: 12px; margin-top: 17px;" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                </div>

                <input class="item-input"
                       type="text"
                       placeholder="请选择"
                       v-model="formData.brand"
                       style="padding-right: 5px;"
                       readonly />
            </div>
        </div>

        <div class="list-item photo-item" style="height: 110px">
            <span class="item-icon">*</span>
            <label>商品照片 ({{formData.photos.length}} / 5)</label>
            <photoeditor
                    slot="inner"
                    :gallery="true"
                    :photos="formData.photos"
                    @photo:update="(photos) => {formData.photos = photos}"
            ></photoeditor>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>建议零售价(元)：</label>
            <div style="float: right">
                <input class="item-input"
                       placeholder="请输入"
                       v-model="formData.retailPrice"
                       type="tel" />
                <!--"^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$"-->
            </div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon">*</span>
            <label>进货价(元)：</label>
            <div style="float: right">
                <input class="item-input"
                       placeholder="请输入"
                       v-model="formData.costPrice"
                       type="tel" />
            </div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon">*</span>
            <label>统一单价(元)：</label>
            <div style="float: right">
                <input class="item-input"
                       placeholder="请输入"
                       v-model="formData.price"
                       type="tel" />
            </div>
        </div>
        <div class="list-item clear-float"
             @click="$f7router.navigate('/psiManage/commodityManage/class', {
                    props: {
                        choose: choose
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
                       :placeholder="formData.classPrice ? '已设置' : '请设置'"
                       style="padding-right: 5px;"
                       readonly />
            </div>
        </div>

        <div class="list-item clear-float" style="margin: 10px 0;"
             @click="$f7router.navigate('/psiManage/commodityManage/other', {
                    props: {
                        which: {
                            name: '单位',
                            type: 'unit'
                        },
                        choose: choose
                    }
             })">
            <span class="item-icon">*</span>
            <label>基本单位：</label>
            <div style="float: right">
                <div style="width: 20px; height: 46px; float: right;">
                    <img style="height: 12px; margin-top: 17px;" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                </div>

                <input class="item-input"
                       type="text"
                       placeholder="请选择"
                       v-model="formData.unit"
                       style="padding-right: 5px;"
                       readonly />
            </div>
        </div>
        <div v-for="(v, i) in formData.unitList" :key="i" style="margin-top: -10px;">
            <div class="item_t">
                <div class="title">辅助单位{{i + 1}}</div>
                <div class="delete" @click="deleteFun(i)">删除</div>
            </div>
            <div class="list-item clear-float"
                 @click="$f7router.navigate('/psiManage/commodityManage/other', {
                    props: {
                        which: {
                            name: '单位',
                            type: 'unit'
                        },
                        choose: (type, val) => {
                            v.unit = val;
                            $f7router.back();
                        }
                    }
                 })">
                <span class="item-icon">*</span>
                <label>辅助单位：</label>
                <div style="float: right">
                    <div style="width: 20px; height: 46px; float: right;">
                        <img style="height: 12px; margin-top: 17px;" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                    </div>

                    <input class="item-input"
                           type="text"
                           placeholder="请选择"
                           v-model="v.unit"
                           style="padding-right: 5px;"
                           readonly />
                </div>
            </div>
            <div class="list-item clear-float" v-if="v.unit">
                <span class="item-icon"></span>
                <label>换算关系：</label>
                <div style="float: right">
                    1{{formData.unit}} =
                    <input class="item-input"
                           placeholder="请输入"
                           v-model="v.count"
                           type="tel"
                           style="float: none; display: inline-block; width: 100px; height: 30px; border-radius: 4px; border: 1px solid #999; text-align: center; padding: 0;"/>
                    {{v.unit}}
                </div>
            </div>
        </div>
        <div style="width: 100%; font-size: 14px; color: #3385FF; height: 40px; line-height: 40px; text-align: center; background: #fff; margin: 10px 0;"
             @click="addUnit" v-if="formData.unit">添加辅助单位</div>

        <div class="list-item clear-float">
            <span class="item-icon">*</span>
            <label>生产日期：</label>
            <div style="float: right; margin-right: 5px;">
                <date-picker v-model="formData.produced" type="date"
                             :editable="false"
                             class="date-picker"
                             width="150px"
                             :confirm="true"
                             :confirm-text="'确定'"
                             placeholder="   请选择生产日期"
                             :readonly="'disabled'"
                             format="YYYY-MM-DD"
                             :minute-step="30"
                             :first-day-of-week="1">
                </date-picker>
            </div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>保质期：</label>
            <div style="float: right">
                <input class="item-input"
                       type="tel"
                       placeholder="请输入"
                       v-model="formData.expiration" />
            </div>
        </div>

        <div class="list-item clear-float" @click="selectDateUnit">
            <span class="item-icon"></span>
            <label>保质期单位：</label>
            <div style="float: right">
                <div style="width: 20px; height: 46px; float: right;">
                    <img style="height: 12px; margin-top: 17px;" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                </div>
                <input class="item-input"
                       type="tel"
                       placeholder="请选择"
                       v-model="formData.dateUnit"
                       readonly />
            </div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>通知过期日期：</label>
            <div style="float: right">
                <input class="item-input"
                       type="tel"
                       placeholder="提前几天开始通知"
                       v-model="formData.noteTime" />
            </div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>重量：</label>
            <div style="float: right">
                <input class="item-input"
                       type="text"
                       placeholder="请输入"
                       v-model="formData.weight" />
            </div>
        </div>

        <div class="list-item clear-float">
            <span class="item-icon"></span>
            <label>助记码：</label>
            <div style="float: right">
                <input class="item-input"
                       type="text"
                       placeholder="请输入"
                       v-model="formData.mnemonic" />
            </div>
        </div>

        <div class="list-item clear-float textarea-item">
            <span class="item-icon"></span>
            <label>备注</label>
            <textarea  placeholder="请输入"
                       v-model="formData.des">
                </textarea>
        </div>

        <div class="submit-button" @click="submit">提交</div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import axios from 'axios'
import barCodeBtn from '../../_module/barcodeBtn'
import photoeditor from '../../gadget/photoeditor.vue';
import DatePicker from 'vue2-datepicker'
export default {
    name: "update",
    components: {
        barCodeBtn,
        photoeditor,
        DatePicker
    },
    props: {
        uData: {
            type: Object
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
                produced: '',
                expiration: '',
                dateUnit: '月',
                noteTime: '',
                weight: '',
                mnemonic: '',
                des: '',
                status: true
            }
        }
    },
    methods: {
        getBarCode (val) {
            this.formData.barCode = val
        },
        chooseType (val) {
            this.formData.type = val
        },
        choose (type, val) {
            this.formData[type] = val
            this.$f7router.back()
        },
        addUnit () {
           this.formData.unitList.push({
               unit: '',
               count: ''
           })
        },
        deleteUnit (index) {
            this.formData.unitList.splice(index, 1)
        },
        selectDateUnit () {
            let self = this
            const picker = this.$f7.picker.create({
                inputEl: '#picker-payment',
                toolbarCloseText: '完成',
                cols: [
                    {
                        textAlign: 'center',
                        values: ['天', '月', '年'],
                    }
                ],
                on: {
                    change: (picker, values, displayValues) => {
                        self.formData.dateUnit = values[0];
                    }
                }
            });
            picker.open();
        },
        submit () {
            if (!this.formData.type) {
                $alert('请选择商品类型')
            } else if (!this.formData.name) {
                $alert('请输入商品名称')
            } else if (!this.formData.photos.length) {
                $alert('请上传商品图片')
            } else if (!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(this.formData.price)) {
                $alert('请输入统一单价')
            } else if (this.formData.retailPrice && !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(this.formData.retailPrice)) {
                $alert('请输入建议零售价')
            } else if (!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(this.formData.costPrice)) {
                $alert('请输入进货价')
            } else if (!this.formData.unit) {
                $alert('请选择基本单位')
            } else if (!this.formData.produced) {
                $alert('请选择生产日期')
            } else if (this.formData.unitList.length && this.formData.unitList.filter(v => !v.unit || !/^([1-9][0-9]*)$/.test(v.count)).length) {
                $alert('请检查辅助单位以及换算关系')
            } else if (this.formData.expiration && !(/^([1-9][0-9]*)$/.test(this.formData.expiration))) {
                $alert('请输入正确的保质期')
            } else if (this.formData.noteTime && !(/^([1-9][0-9]*)$/.test(this.formData.noteTime))) {
                $alert('请输入正确的提前通知时间')
            } else {
                $confirm('确定提交吗', '操作确认', () => {
                    axios[this.formData._id ? 'post' : 'put']('api/commodity/', this.formData).then(res => {
                        this.$f7router.back();
                        if (cordova.plugins.aMapLocation) {
                            this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: `添加商品`})
                        }
                    }).catch(err => {
                        if (err.response && err.response.data.message) $alert(err.response.data.message);
                    })
                })
            }
        }
    },
    mounted () {
        if (this.uData) this.formData = this.uData
    }
}
</script>

<style lang="scss" scoped>
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

