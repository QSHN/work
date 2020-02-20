<template>
    <f7-page>
        <f7-navbar title="查凭证" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="go">修改凭证</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <div style="position: fixed; opacity: 0;">
            <div ref="printMe" style="background: #fff">
                <div class="c_title" style="width: 1274px;
                    font-size: 30px;
                    padding-top: 20px;
                    text-align: center;">
                    记账凭证
                </div>

                <div class="c_info" style="width: 1274px;
                    margin: 10px 0 5px 0;
                    display: flex;
                    font-size: 16px;">
                    <p style="flex-grow: 1; margin: 0;">公司名称：{{accountSet && accountSet.organization}}</p>
                    <p style="flex-grow: 1; margin: 0; text-align: center;">{{moment(printData.time).format('YYYY-MM-DD')}}</p>
                    <p style="flex-grow: 1; margin: 0; text-align: right;">凭证编号：{{printData.proofWords}} - {{printData.certificateNumber}}</p>
                </div>

                <div class="c_table" style="width: 1274px;
                        overflow: hidden;
                        display: table;
                        font-size: 16px;">
                    <div class="t_h" style="height: 52px;
                          min-height: 52px;
                          display: table;">
                        <div class="t1" style="
                            display: table-cell;
                            height: 52px;
                            text-align: center;
                            vertical-align: middle;
                            border: 1px solid #dcdee2;
                            width: 200px;">
                            <span>摘要</span>
                        </div>
                        <div class="t2" style="display: table-cell;
                            height: 52px;
                            text-align: center;
                            vertical-align: middle;
                            border: 1px solid #dcdee2;
                            width: 360px;
                            position: relative">
                            <span style="position: absolute; left: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                            <span style="position: absolute; right: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                            <span>科目</span>
                        </div>
                        <div class="t3" style="display: table-cell;
                                height: 52px;
                                text-align: center;
                                vertical-align: middle;
                                width: 100px;
                                border: 1px solid #dcdee2;
                                position: relative;">
                            <span style="position: absolute; right: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                            <span style="position: absolute; left: 0; right: 0; top: 26px; height: 1px; background: #dcdee2;"></span>
                            <p style="height: 26px;
                                  line-height: 26px;
                                  vertical-align: middle;
                                  margin: 0;
                                  padding: 0;">
                                币别
                            </p>
                            <p style="height: 26px;
                                  line-height: 26px;
                                  margin: 0;
                                  padding: 0;
                                  vertical-align: middle;">
                                    单位
                            </p>
                        </div>
                        <div class="t4" style="display: table-cell;
                                height: 52px;
                                text-align: center;
                                vertical-align: middle;
                                border: 1px solid #dcdee2;
                                position: relative;
                                width: 100px;">
                            <span style="position: absolute; right: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                            <span style="position: absolute; left: 0; right: 0; top: 26px; height: 1px; background: #dcdee2;"></span>
                            <p style="height: 26px;
                                  line-height: 26px;
                                  vertical-align: middle;
                                  margin: 0;
                                  padding: 0;">汇率</p>
                            <p style="height: 26px;
                              line-height: 26px;
                              margin: 0;
                              padding: 0;
                              vertical-align: middle;">单价</p>
                        </div>
                        <div class="t5" style="display: table-cell;
                            height: 52px;
                            text-align: center;
                            vertical-align: middle;
                            border: 1px solid #dcdee2;
                            position: relative;
                            width: 100px;">
                            <span style="position: absolute; right: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                            <span style="position: absolute; left: 0; right: 0; top: 26px; height: 1px; background: #dcdee2;"></span>
                            <p style="height: 26px;
                                  line-height: 26px;
                                  vertical-align: middle;
                                  margin: 0;
                                  padding: 0;">
                                原币金额
                            </p>
                            <p style="height: 26px;
                                  line-height: 26px;
                                  margin: 0;
                                  padding: 0;
                                  vertical-align: middle;">
                                数量
                            </p>
                        </div>
                        <div class="t6" style="display: table-cell;
                                height: 52px;
                                text-align: center;
                                vertical-align: middle;
                                border: 1px solid #dcdee2;
                                position: relative;
                                width: 200px;">
                            <span style="position: absolute; right: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                            <span style="position: absolute; left: 0; right: 0; top: 26px; height: 1px; background: #dcdee2;"></span>
                            <p style="height: 26px;
                                  line-height: 26px;
                                  margin: 0;
                                  padding: 0;
                                  vertical-align: middle;">
                                借方
                            </p>
                            <div style="font-size: 14px; height: 26px; line-height: 26px;">
                                <financialLine :value="['亿','千','百','十','万','千','百','十','元','角','分']" />
                            </div>
                        </div>
                        <div class="t7" style="display: table-cell;
                                height: 52px;
                                text-align: center;
                                vertical-align: middle;
                                border: 1px solid #dcdee2;
                                position: relative;
                                width: 200px;">
                            <span style="position: absolute; left: 0; right: 0; top: 26px; height: 1px; background: #dcdee2;"></span>
                            <p style="height: 26px;
                                  line-height: 26px;
                                  vertical-align: middle;
                                  margin: 0;
                                  padding: 0;">
                                贷方
                            </p>
                            <div style="font-size: 14px; height: 26px; line-height: 26px;">
                                <financialLine :value="['亿','千','百','十','万','千','百','十','元','角','分']" />
                            </div>
                        </div>
                    </div>

                    <div class="t_m">
                        <div class="t_l"
                             v-for="(v, i) in printData.child"
                             :key="i"
                             style="min-height: 52px; display: table;">
                            <div class="t1" style="display: table-cell;
                                  vertical-align: middle;
                                  border: 1px solid #dcdee2;
                                  width: 200px;
                                  position: relative;">
                                <span style="position: absolute; left: 0; top: -1px; right: 0; height: 1px; background: #fff;"></span>
                                <div style="text-align: left; padding: 1px 3px">{{v.abstract}}</div>
                            </div>

                            <div class="t2" style="display: table-cell;
                                  vertical-align: middle;
                                  border: 1px solid #dcdee2;
                                  width: 360px;
                                  position: relative;">
                                <span style="position: absolute; left: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                                <span style="position: absolute; left: 0; top: -1px; right: 0; height: 1px; background: #fff;"></span>
                                <span style="position: absolute; right: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                                <div style="text-align: left;"> {{v.subjectCode}} {{v.subject}}</div>
                            </div>

                            <div class="t3" style="display: table-cell;
                                  text-align: center;
                                  vertical-align: middle;
                                  border: 1px solid #dcdee2;
                                  width: 100px;
                                  position: relative;">
                                <span style="position: absolute; left: 0; top: -1px; right: 0; height: 1px; background: #fff;"></span>
                                <span style="position: absolute; right: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                                <span style="position: absolute; left: 0; right: 0; top: 26px; height: 1px; background: #dcdee2;"></span>
                                <p style="height: 26px;
                                    line-height: 26px;
                                    vertical-align: middle;
                                    margin: 0;
                                    padding: 0;">
                                    {{v.currency}}
                                </p>
                                <p style="height: 26px;
                                        line-height: 26px;
                                        margin: 0;
                                        padding: 0;
                                        vertical-align: middle;">
                                    {{v.unit || ''}}
                                </p>
                            </div>

                            <div class="t4" style="display: table-cell;
                                  text-align: center;
                                  vertical-align: middle;
                                  border: 1px solid #dcdee2;
                                  position: relative;
                                  width: 100px;">
                                <span style="position: absolute; left: 0; top: -1px; right: 0; height: 1px; background: #fff;"></span>
                                <span style="position: absolute; right: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                                <span style="position: absolute; left: 0; right: 0; top: 26px; height: 1px; background: #dcdee2;"></span>
                                <p style="height: 26px;
                                    line-height: 26px;
                                    vertical-align: middle;
                                    margin: 0;
                                    padding: 0;">
                                    {{v.rate}}
                                </p>
                                <p style="height: 26px;
                                    line-height: 26px;
                                    margin: 0;
                                    padding: 0;
                                    vertical-align: middle;">
                                    {{v.price || ''}}
                                </p>
                            </div>

                            <div class="t5" style="display: table-cell;
                                  text-align: center;
                                  vertical-align: middle;
                                  border: 1px solid #dcdee2;
                                  position: relative;
                                  width: 100px;">
                                <span style="position: absolute; left: 0; top: -1px; right: 0; height: 1px; background: #fff;"></span>
                                <span style="position: absolute; right: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                                <span style="position: absolute; left: 0; right: 0; top: 26px; height: 1px; background: #dcdee2;"></span>
                                <p style="height: 26px;
                                    line-height: 26px;
                                    vertical-align: middle;
                                    margin: 0;
                                    padding: 0;">
                                    {{formatMoney(v.currencyAmount, '', 2)}}
                                </p>
                                <p style="height: 26px;
                                    line-height: 26px;
                                    margin: 0;
                                    padding: 0;
                                    vertical-align: middle;">
                                    {{v.number || ''}}
                                </p>
                            </div>

                            <div class="t6" style="display: table-cell;
                                  text-align: center;
                                  vertical-align: middle;
                                  border: 1px solid #dcdee2;
                                  width: 200px;
                                  position: relative;">
                                <span style="position: absolute; left: 0; top: -1px; right: 0; height: 1px; background: #fff;"></span>
                                <span style="position: absolute; right: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                                <div style="position: absolute; left: 0; top: 0; right: 0; bottom: 0">
                                    <financialLine :value="getFinancial(v.borrower)" />
                                </div>
                            </div>

                            <div class="t7" style="display: table-cell;
                                  text-align: center;
                                  vertical-align: middle;
                                  border: 1px solid #dcdee2;
                                  position: relative;
                                  width: 200px;">
                                <span style="position: absolute; left: 0; top: -1px; right: 0; height: 1px; background: #fff;"></span>
                                <div style="position: absolute; left: 0; top: 0; right: 0; bottom: 0">
                                    <financialLine :value="getFinancial(v.lender)" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="t_b" style="height: 52px; min-height: 52px; display: table;">
                        <div class="t1" style="display: table-cell;
                            height: 52px;
                            text-align: center;
                            vertical-align: middle;
                            border: 1px solid #dcdee2;
                            width: 200px;
                            position: relative;">
                            <span style="position: absolute; left: 0; top: -1px; right: 0; height: 1px; background: #fff;"></span>
                            合计
                        </div>

                        <div class="t8" style="display: table-cell;
                            height: 52px;
                            text-align: center;
                            vertical-align: middle;
                            border: 1px solid #dcdee2;
                            position: relative;
                            width: 666px;">
                            <span style="position: absolute; left: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                            <span style="position: absolute; left: 0; top: -1px; right: 0; height: 1px; background: #fff;"></span>
                            <span style="position: absolute; right: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                        </div>

                        <div class="t6" style="display: table-cell;
                            height: 52px;
                            text-align: center;
                            vertical-align: middle;
                            border: 1px solid #dcdee2;
                            width: 200px;
                            position: relative;">
                            <span style="position: absolute; left: 0; top: -1px; right: 0; height: 1px; background: #fff;"></span>
                            <span style="position: absolute; right: -1px; top: 0; bottom: 0; width: 1px; background: #fff;"></span>
                            <div style="position: absolute; left: 0; top: 0; right: 0; bottom: 0">
                                <financialLine :value="borrower" />
                            </div>
                        </div>

                        <div class="t7" style="display: table-cell;
                                height: 52px;
                                text-align: center;
                                vertical-align: middle;
                                border: 1px solid #dcdee2;
                                width: 200px;
                                position: relative;">
                            <span style="position: absolute; left: 0; top: -1px; right: 0; height: 1px; background: #fff;"></span>
                            <div style="position: absolute; left: 0; top: 0; right: 0; bottom: 0">
                                <financialLine :value="lender" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="c_user" style="width: 1274px;
                        margin: 10px 0 0 0;
                        display: flex;
                        font-size: 16px;">
                    <p style="flex-grow: 1; margin: 0;">审核：{{getUserName(printData.audit)}}</p>
                    <p style="flex-grow: 1; margin: 0;">核准：{{getUserName(printData.examine)}}</p>
                    <p style="flex-grow: 1; margin: 0;">过账：{{getUserName(printData.post)}}</p>
                    <p style="flex-grow: 1; margin: 0;">出纳：{{getUserName(printData.cashier)}}</p>
                    <p style="flex-grow: 1; margin: 0;">制单：{{getUserName(printData.voucher)}}</p>
                    <p style="flex-grow: 1; margin: 0;">经办：{{printData.handle}}</p>
                </div>
            </div>
        </div>

        <!-- OUTPUT -->
        <div class="credentials_img" v-if="output">
            <img :src="output" @click="preview">
        </div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import financialLine from './financial_line'
import NP from 'number-precision'
import moment from 'moment'
import html2canvas from 'html2canvas'
import { formatMoney } from 'accounting'
import axios from 'axios'
export default {
    components: {
        financialLine
    },
    props: {
        printData: {
            type: Object,
            required: true
        },
        accountSet: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            output: null,
            userList: []
        }
    },
    computed: {
        ...mapGetters([
            'myProfile'
        ]),
        borrower () {
            let borrower = this.printData.child.reduce((total, v) => (total = NP.plus(total, v.borrower ? Number(v.borrower) : 0)), 0)
            return borrower ? this.formatMoney(borrower).replace(/[$,.]/g, '').split('') : [0, 0, 0]
        },
        lender () {
            let lender = this.printData.child.reduce((total, v) => (total = NP.plus(total, v.lender ? Number(v.lender) : 0)), 0)
            return lender ? this.formatMoney(lender).replace(/[$,.]/g, '').split('') : [0, 0, 0]
        }
    },
    methods: {
        moment,
        formatMoney,
        rotateBase64Img(src, edg, callback) {
            let canvas = document.createElement("canvas")
            let ctx = canvas.getContext("2d")
            let imgW; // 图片宽度
            let imgH; // 图片高度
            let size; // canvas初始大小
            if (edg % 90 != 0) {
                console.error("旋转角度必须是90的倍数!");
                throw '旋转角度必须是90的倍数!';
            }
            (edg < 0) && (edg = (edg % 360) + 360)
            let quadrant = (edg / 90) % 4; //旋转象限
            let cutCoor = {sx: 0, sy: 0, ex: 0, ey: 0}; //裁剪坐标

            let image = new Image();
            // image.crossOrigin = "anonymous"
            image.onload = function () {
                imgW = image.width;
                imgH = image.height;
                size = imgW > imgH ? imgW : imgH;

                canvas.width = size * 2;
                canvas.height = size * 2;
                switch (quadrant) {
                    case 0:
                        cutCoor.sx = size;
                        cutCoor.sy = size;
                        cutCoor.ex = size + imgW;
                        cutCoor.ey = size + imgH;
                        break;
                    case 1:
                        cutCoor.sx = size - imgH;
                        cutCoor.sy = size;
                        cutCoor.ex = size;
                        cutCoor.ey = size + imgW;
                        break;
                    case 2:
                        cutCoor.sx = size - imgW;
                        cutCoor.sy = size - imgH;
                        cutCoor.ex = size;
                        cutCoor.ey = size;
                        break;
                    case 3:
                        cutCoor.sx = size;
                        cutCoor.sy = size - imgW;
                        cutCoor.ex = size + imgH;
                        cutCoor.ey = size + imgW;
                        break;
                }


                ctx.translate(size, size);
                ctx.rotate(edg * Math.PI / 180);
                ctx.drawImage(image, 0, 0);

                let imgData = ctx.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey);
                if (quadrant % 2 == 0) {
                    canvas.width = imgW;
                    canvas.height = imgH;
                } else {
                    canvas.width = imgH;
                    canvas.height = imgW;
                }
                ctx.putImageData(imgData, 0, 0);
                callback(canvas.toDataURL())
            };

            image.setAttribute('crossOrigin', 'anonymous')
            image.src = src;
        },
        print () {
            $preloader.show();
            let el = this.$refs.printMe
            // console.log(this.$refs)
            html2canvas(el, {
                x: -20,
                width: el.offsetWidth + 40,
                height: el.offsetHeight + 20
            }).then(canvas => {
              if (device.platform == "Android") {
                this.rotateBase64Img(canvas.toDataURL(), 90, (url) => {
                  this.output = url
                  $preloader.hide();
                })
              } else if (device.platform == "iOS") {
                this.output = canvas.toDataURL()
                $preloader.hide();
              } else {
                // this.output = canvas.toDataURL()
                // $preloader.hide();
                this.rotateBase64Img(canvas.toDataURL(), 90, (url) => {
                  this.output = url
                  $preloader.hide();
                })
              }
            });
        },
        getFinancial (val) {
            if (val !== null) {
                let money = this.formatMoney(val).replace(/[$,.]/g, '')
                return money.split('')
            } else {
                return []
            }
        },
        getUserName (id) {
            if (!id) return ''
            let info = this.userList.find(v => v.userId === id)
            return info ? info.name : ''
        },
        preview () {
            let pb = $f7.photoBrowser.create({
                photos: [this.output],
                theme: 'dark',
                backLinkText: '返回',
                navbarOfText: '查凭证',
                swipeToClose: false,
                toolbar: false
            });

            pb.on('closed', () => {
                pb.destroy();
            })
            pb.open();
        },
        loadUserList () {
            axios.post(CONFIG.server.tradeApiUrl + 'userManage/userInfoQuery', {
                accountSetId: this.accountSet._id,
                companyId:  this.myProfile.bClientId
            }).then(res => {
                this.userList = res.data
            }).catch(err => {
                $alert('查询用户列表失败')
            })
        },
        go () {
            if (this.printData.audit) {
              $alert('该凭证已审核，无法修改')
            } else if (this.printData.cashier) {
              $alert('该凭证已复核，无法修改')
            } else if (this.printData.examine) {
              $alert('该凭证已核准，无法修改')
            } else if (this.printData.post) {
              $alert('该凭证已过账，无法修改')
            } else {
                this.$f7router.navigate('/finance/credentials/input', {
                    props: {
                        accountSet: this.accountSet,
                        credentialsChild: null,
                        credentialsData: JSON.parse(JSON.stringify(this.printData))
                    }
                })
            }
        }
    },
    mounted() {
        this.print()
        this.loadUserList()
    }
}
</script>

<style lang="scss">
    .credentials_img {
        position: relative;
        z-index: 99;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;

        img {
            width: 100%;
            object-fit: contain;
        }
    }
    .photo-browser-current,
    .photo-browser-total {
        display: none !important;
    }
</style>
