<template>
    <f7-page class="commodity_type">
        <f7-navbar title="添加类型" back-link></f7-navbar>

        <div class="add_c">
            <div class="add_form">
                <div class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>类型名称：</label>
                    <div style="float: right">
                        <input class="item-input"
                               type="text"
                               placeholder="请输入"
                               v-model="formData.name" />
                    </div>
                </div>

                <div class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>选择父类型：</label>
                    <div style="float: right" @click="$f7router.navigate('/psiManage/commodityManage/type', {
                            props: {
                                chooseType: chooseType
                            }
                        })">
                        <div style="width: 20px; height: 46px; float: right;">
                            <img style="height: 12px; margin-top: 5px;" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                        </div>

                        <input class="item-input"
                               type="text"
                               placeholder="无父类型"
                               v-model="formData.parentName"
                               style="padding-right: 5px;"
                               readonly />
                    </div>
                </div>
            </div>

            <div class="submit-button" @click="submit">提交</div>
        </div>
    </f7-page>
</template>

<script>
export default {
    name: "addType",
    props: {
        addType: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            formData: {
                name: '',
                parentId: '',
                parentName: ''
            }
        }
    },
    methods: {
        chooseType (val, id) {
            this.formData.parentId = id
            this.formData.parentName = val
        },
        submit () {
            $confirm('确定提交吗', '操作确认', () => {
                if (!this.formData.name) {
                    $alert('请输入添加类型名称')
                } else {
                    this.addType(this.formData, () => {
                        $alert(this.formData.parentId ? `您新增的商品类型已被归类在${this.formData.parentName}（父类型）里` : '新增成功', () => {
                            this.$f7router.back()
                        })
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .add_c {
        height: 100%;
        display: flex;
        flex-direction: column;

        .add_form {
            flex-grow: 1;
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
