<template>
    <f7-page class="commodity_type">
        <f7-navbar title="客户等级价" back-link></f7-navbar>

        <div class="ct_content">
            <div class="layer">
                <div class="item" v-for="(v, i) in uList.length ? uList : list" :key="i">
                    <div class="item_t">
                        <div class="title">客户等级价{{i + 1}}</div>
                        <div class="delete" v-if="!isLook" @click="deleteFun(i)">删除</div>
                    </div>

                    <div class="list-item clear-float" @click="selectPicker(v)">
                        <span class="item-icon">*</span>
                        <label>客户等级：</label>
                        <div style="float: right">
                            <div style="width: 20px; height: 46px; float: right;">
                                <img style="height: 12px; margin-top: 17px;" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                            </div>
                            <input class="item-input"
                                   type="text"
                                   placeholder="请选择"
                                   v-model="v.type"
                                   style="padding-right: 5px;"
                                   readonly />
                        </div>
                    </div>

                    <div class="list-item clear-float">
                        <span class="item-icon">*</span>
                        <label>等级价(元)：</label>
                        <div style="float: right">
                            <input class="item-input"
                                   placeholder="请输入正确金额"
                                   v-model="v.price"
                                   type="tel" v-if="!isLook"/>
                            <span v-else style="margin-right: 14px;">{{v.price}} 元</span>
                            <!--"^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$"-->
                        </div>
                    </div>
                </div>
                <div style="width: 100%; font-size: 14px; color: #3385FF; height: 40px; line-height: 40px; text-align: center; background: #fff; margin-top: 10px;"
                     @click="add"
                     v-if="!isLook">添加客户等级价</div>
            </div>

            <div class="submit-button" @click="sure" v-if="!isLook">确定</div>
        </div>
    </f7-page>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    name: "commodityClass",
    props: {
        choose: {
            type: Function,
            required: true
        },
        isLook: {
            type: Boolean,
            default: false
        },
        uList: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            list: [{
                type: '',
                price: ''
            }]
        }
    },
    computed: {
        ...mapGetters([
            'myCompany'
        ])
    },
    methods: {
        selectPicker(v) {
            if (this.isLook) return
            const self = this;
            const picker = this.$f7.picker.create({
                inputEl: '#picker-expense',
                toolbarCloseText: '完成',
                cols: [
                    {
                        textAlign: 'center',
                        values: self.myCompany.clientGrade,
                    }
                ],
                on: {
                    change: (picker, values, displayValues) => {
                        v.type = values[0];
                        self.$forceUpdate();
                    }
                }
            });
            picker.open();
        },
        add () {
          this.list.push({
              type: '',
              price: ''
          })
        },
        deleteFun (index) {
            this.list.splice(index, 1)
        },
        sure () {
            let isCan = this.list.filter(v => !v.type || !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(v.price)).length
            if (isCan) {
                $alert('请检查所有数据已按要求正确输入')
            } else {
                this.choose('classPrice', this.list)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.commodity_type {
    .ct_content {
        position: relative;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .layer {
            width: 100%;
            flex-grow: 1;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }

        .submit-button{
            width:100%;
            height:45px;
            line-height: 45px;
            font-size:16px;
            color: #FFFFFF;
            text-align: center;
            background:#3385FF;
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
    }
}
</style>
