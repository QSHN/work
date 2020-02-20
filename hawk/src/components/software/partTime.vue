<template>
    <f7-page style="background: #fff">
        <f7-navbar title="我要兼职" back-link></f7-navbar>
        <div class="p_content">
            <p class="title">
                你想创业吗？你想做兼职吗？你想积累经验吗？是不是认为自己空有才华无处施展，那就不要犹豫，快来加入我们！
                只要你扩展了客户，付费后，你能拿到对应提成，具体提成细节可添加微信13790990690，微信与手机同号，也可直接打电话联系沟通。
            </p>

            <div class="content_layer">
                <div class="content">
                    <f7-list>
                        <f7-list-item>
                            <span  slot="title" style="color:red">* </span>
                            <span slot="title">名称</span>
                            <input
                                    slot="inner" style="text-align:right; width: calc(100% - 90px); height: inherit;"
                                    type="text"
                                    v-model="name"
                            >
                        </f7-list-item>

                        <f7-list-item>
                            <span  slot="title" style="color:red">* </span>
                            <span slot="title">联系电话</span>
                            <input
                                    slot="inner" style="text-align:right; width: calc(100% - 90px); height: inherit;"
                                    type="tel"
                                    v-model="phone"
                            >
                        </f7-list-item>


                        <f7-list-item>
                            <span  slot="title" style="color:red">* </span>
                            <span slot="title">通讯地址</span>
                            <input
                                    slot="inner" style="text-align:right; width: calc(100% - 90px); height: inherit;"
                                    type="text"
                                    v-model="address"
                            >
                        </f7-list-item>

                        <f7-list-item>
                            <span  slot="title" style="color:red">* </span>
                            <span slot="title">意向时间</span>
                            <date-picker v-model="appointmentTime" type="datetime"
                                         :editable="false"
                                         class="date-picker"
                                         width="180px"
                                         :confirm="true"
                                         :not-before="new Date()"
                                         :confirm-text="'确定'"
                                         placeholder=""
                                         :readonly="'disabled'"
                                         format="YYYY-MM-DD HH:mm" :minute-step="30"
                                         :first-day-of-week="1"></date-picker>
                        </f7-list-item>
                    </f7-list>
                </div>

                <div class="bt_save">
                    <div @click="save">提交</div>
                    <p>
                        提交后小牛外勤相关人员将通过公用电话或手机与你联系，然后可进入后台网址
                        <span style="color: red">adminniu.sanfanerp.com</span>
                        登陆，登陆账号为您提交的手机号，密码默认123@abc，登陆后在销售员管理中拿到自己的推广码和二维码，即可进行推广，推广成功的客户将能在客户管理中体现。
                    </p>
                </div>
            </div>
        </div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import axios from 'axios'
import DatePicker from 'vue2-datepicker'
import moment from 'moment'
export default {
    name: "visitingService",
    components: {
        DatePicker
    },
    data () {
        return {
            name: '',
            phone: '',
            address: '',
            appointmentTime: ''
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
            if (
                !this.name ||
                !this.phone ||
                !this.address ||
                !this.appointmentTime
            ) {
                $alert('请填写完整资料')
            } else {
                if (/^[0-9]{11}$/.test(this.phone)) {
                    axios.post(CONFIG.server.tradeApiUrl + '_backstage/partTimeJob', {
                        companyId: this.myCompany._id,
                        phone: this.phone,
                        linkName: this.name,
                        address: this.address,
                        appointmentTime: moment(this.appointmentTime).format('YYYY-MM-DD HH:mm:ss')
                    }).then(res => {
                        if (res.data && res.data.map && res.data.map.username) {
                            $alert(`提交成功，您的账号是：${this.phone}，密码：123@abc, 相关提成请致电号码13790990690咨询`)
                        } else if (res.data && res.data.msg) {
                            $alert(res.data.msg)
                        } else {
                            $alert('请检查手机号是否有效')
                        }
                    }).catch(err => {
                        $alert('提交失败', '操作错误');
                    })
                } else {
                    $alert('请输入正确手机号')
                }
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

        p {
            font-size: 14px;
            color: gray;
            margin: 5px 0 0 0;
        }

    }
    .bt_save>div{
        width: 100%;
        height: 45px;
        background-color: #3385FF;
        font-size: 16px;
        color: white;
        text-align: center;
        line-height: 45px;
    }
}
</style>
