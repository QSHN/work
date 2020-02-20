<template>
    <f7-page>
        <f7-navbar title="回复" back-link>
        </f7-navbar>

        <div class="p_layer">
            <div class="p_c">
                <div class="list-item clear-float textarea-item">
                    <span class="item-icon">*</span>
                    <label>回复</label>
                    <textarea  placeholder="请输入"
                               v-model="reply"
                               maxlength="500">
                    </textarea>
                </div>

                <div class="submit-button" @click="submit">提交</div>
            </div>
        </div>
    </f7-page>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import axios from 'axios'
    export default {
        name: "internalContactUpdate",
        props: {
            detail: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                reply: '',
            }
        },
        computed: {
            ...mapGetters([
                'myUserId'
            ]),
        },
        methods: {
            submit () {
                if (!this.reply) {
                    $alert('请输入回复内容')
                } else {
                    let formData = Object.assign({}, this.detail)
                    formData.reply.push({
                        replyId: this.myUserId,
                        replyContent: this.reply
                    })
                    formData.isReply = true
                    axios.post('api/internalContact/', formData).then(res => {
                        $alert('公司内部联络单回复成功', () => {
                            this.$f7router.back()
                        });
                        if (cordova.plugins.aMapLocation) {
                            this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: `回复公司内部联络单`})
                        }
                    }).catch(err => {
                        console.error(err.message);
                        $alert('公司内部联络单回复失败');
                    })
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
