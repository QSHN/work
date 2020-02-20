<template>
    <f7-page id="registration">
        <f7-navbar title="重置密码" back-link></f7-navbar>
        <f7-list inline-labels no-hairlines-md>
            <f7-list-input
                    label="手机号码"
                    type="text"
                    placeholder="请输入手机号码"
                    required
                    validate
                    pattern="^[0-9]{11}$"
                    :value="userInput.phone"
                    @input="userInput.phone = $event.target.value"
                    error-message="请输入正确的手机号码"
                    clear-button>
            </f7-list-input>

            <f7-list-input
                    label="验证码"
                    type="number"
                    placeholder="请输入验证码"
                    size="5"
                    :value="userInput.code"
                    @input="userInput.code = $event.target.value">
                <f7-button
                        slot="inner-end"
                        style="min-width:120px; margin-left:15px"
                        outline
                        :class="veriCodeBtnStyle"
                        @click="sendVeriCode">
                    {{veriCode.text}}
                </f7-button>
            </f7-list-input>

            <f7-list-input
                    label="新密码"
                    type="password"
                    placeholder="6位以上字母或数字组合"
                    required
                    validate
                    pattern="^[0-9a-zA-Z]{6,}$"
                    :value="userInput.passwd"
                    @input="userInput.passwd = $event.target.value"
                    error-message="必须是6位以上字母或数字的组合"
                    clear-button>
            </f7-list-input>
        </f7-list>

        <f7-block>
            <f7-button raised big fill style="background-color: #01B38B;" @click="resetPassword">
                <span style="font-size:1.3em">重置密码</span>
            </f7-button>
        </f7-block>

        <div v-if="company.show" class="companyList">
            <div class="title">
                请选择重置那个公司的密码
            </div>
            <div class="list_con">
                <div>
                    <div v-for="(item,index) in company.list"
                         @click="companySelect(item)"
                         :key="index"
                         class="list_item">
                        {{item.name}}
                    </div>
                </div>
                <div @click="company.select=null;company.show=false" class="close_bt">取消</div>
            </div>
        </div>
    </f7-page>
</template>

<script>
    import axios from 'axios';
    import {setInterval, clearInterval, setTimeout} from 'timers';
    export default {
        data: () => {
            return {
                userInput: {
                    phone: '',
                    code: null,
                    passwd: '',
                },
                veriCode: {
                    text: '获取验证码',
                    sent: false
                },
                company: {
                    show: false,
                    list: [],
                    select: null
                }
            }
        },

        computed: {
            uInput() {
                return JSON.stringify(this.userInput);
            },

            veriCodeBtnStyle() {
                if (/^[0-9]{11}$/.test(this.userInput.phone) && !this.veriCode.sent) {
                    return {disabled: false};
                } else {
                    return {disabled: true};
                }
            }
        },
        methods: {
            sendVeriCode() {
                const self = this;
                $dialog.preloader('正在发送验证码');
                if (this.veriCode.sent) return

                this.veriCode.sent = true;

                // generate random code
                // let possible = '0123456789';
                // let length = 4;
                // let code = '';
                //
                // for (let i = 0; i < length; i++) {
                //     code += possible.charAt(Math.floor(Math.random() * possible.length))
                // }

                axios.post('api/utils/vericode', {
                    "phone": self.userInput.phone
                }).then((res) => {
                    // this.veriCode.code = (res.data && res.data.code) ? res.data.code.toString() : 'unknown';
                    // this.veriCode.phone = this.userInput.phone
                    $dialog.close();
                }).catch((err) => {
                    $dialog.close();
                    if (err.message) $alert(err.message);
                });

                let countdown = 30; // sec
                let counter = setInterval(() => {
                    countdown = countdown - 1;
                    self.veriCode.text = "已发送 (" + countdown.toString() + ")";

                    if (countdown < 1) {
                        self.veriCode.sent = false;
                        self.veriCode.text = "获取验证码";
                        clearInterval(counter);
                    }
                }, 1000);

            },
            resetPassword() {
                let self = this;
                if (!/^[0-9]{11}$/.test(this.userInput.phone)) {
                    $alert('请输入手机号码。', "提示");
                }
                else if (!self.userInput.code) {
                    $alert('请输入验证码。', "提示");
                }
                else if (!/^[0-9a-zA-Z]{6,}$/.test(this.userInput.passwd)) {
                    $alert('请输入新密码。', "提示");
                } else {
                    $preloader.show()
                    if (this.company.select) this.userInput.cId = this.company.select
                    axios.post('api/user/resetPassword', this.userInput).then((res) => {
                        $preloader.hide()
                        if (res.data) {
                            $alert('请选择需要重置密码的公司', '重置密码', () => {
                                self.company.list = res.data
                                self.company.show = true
                            })
                        } else {
                            $alert('修改密码成功，请重新登录', '重置密码', () => {
                                self.$f7router.navigate('/login/')
                            });
                        }
                    }).catch((err) => {
                        $preloader.hide()
                        if (err.response && err.response.data.message) $alert(err.response.data.message);
                    });
                }
            },
            companySelect(item){
                this.company.select = item._id
                this.company.show = false
                this.resetPassword()
            }
        }

    }
</script>
