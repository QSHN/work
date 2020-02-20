<template>
    <f7-page style="background: #fff">
        <f7-navbar title="意见吐槽" back-link></f7-navbar>
        <div class="p_content">
            <p class="title">欢迎各用户对APP使用过程提出任何意见或建议，我们公司将会及时对反馈意见跟进处理。</p>

            <div class="content_layer">
                <f7-list>
                    <div class="list-item clear-float textarea-item">
                        <span class="item-icon">*</span>
                        <label>意见吐槽</label>
                        <textarea  placeholder="请输入"
                                   :value="content"
                                   @input="content = $event.target.value">
                    </textarea>
                    </div>
                </f7-list>

                <div class="bt_save">
                    <div @click="save">提交</div>
                    <p></p>
                </div>
            </div>
        </div>
    </f7-page>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import axios from 'axios'
    export default {
        name: "message",
        data () {
            return {
                content: ''
            }
        },
        computed: {
            ...mapGetters([
                'myProfile',
                'myCompany'
            ]),
        },
        methods: {
            save () {
                if (!this.content) {
                    $alert('请填写您的宝贵意见')
                } else {
                    axios.post(CONFIG.server.tradeApiUrl + '_backstage/feedback', {
                        companyId: this.myCompany._id,
                        phone: this.myProfile.phone,
                        linkName: this.myProfile.name,
                        content: this.content
                    }).then(res => {
                        $alert('已经提交成功')
                    }).catch(err => {
                        $alert('提交失败', '操作错误');
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .p_content {
        padding: 20px;
        p {
            font-size: 18px;
            color: gray;
            margin: 0 0 5px;

            &.title {
                margin: 0 0 15px;
            }
        }

        .bt_save{
            height: 45px;
            width: 100%;
            margin-top: 30px;

            p {
                font-size: 14px;
                color: gray;
                margin: 5px 0 0 0;
            }

        }
        .bt_save>div{
            width: 100%;
            height: 45px;
            background-color: #01b38b;
            font-size: 16px;
            color: white;
            text-align: center;
            line-height: 45px;
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
        background: #f8f8f8;
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
</style>
