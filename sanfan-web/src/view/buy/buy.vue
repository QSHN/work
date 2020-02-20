<template>
  <Card>

    <div class="tips" v-if="orderType == 'DREDGE'">
      续费暂时不支持增加人数，如需请在上个页面中增加
    </div>
    <div class="people-number">
      <div class="label">公司人数：</div>
      <div class="number" v-if="inited">

        <div class="stepper stepper-init color-gray">
          <div class="stepper-input-wrap">
            <InputNumber type="number" v-model="order.number" :min="2" @change="checkOrder" @blur="checkOrder" ></InputNumber>
          </div>
        </div>
      </div>
      <!--<input type="number" placeholder="请输入人数" v-model="order.number" >-->
    </div>
    <div class="duration-list">
      <div class="title">会员套餐：</div>
      <ul class="item-list">
        <li class="item clear-float" v-for="(item,index) in comboList" :key="index" :class="{active:item.id == combo.id}" @click="combo = item">
          <span class="item-month">{{item.duration}}个月</span>
          <div v-if="item.freeDuration > 0" class="free">送{{item.freeDuration}}个月</div>
          <span class="item-money"><span class="price">{{item.duration * order.number * item.price}}</span> 元</span>
        </li>
      </ul>
    </div>
    <div class="invite-code">
      <label>邀请码：</label>
      <input placeholder="请输入" v-model="order.invitationCode">
    </div>
    <div class="paySort">
      <div class="title">支付方式：</div>
      <ul class="paysort-list">
        <li @click="order.paySort = 'ALIPAY' ">
          <div><img :src="icon_alipay"><span>支付宝</span></div>
          <div class="select"><img :src="order.paySort == 'ALIPAY'?icon_selected:icon_unselected"></div>
        </li>
        <li @click="order.paySort = 'WEIXIN' ">
          <div><img :src="icon_wechat_pay"><span>微信</span></div>
          <div class="select"><img :src="order.paySort == 'WEIXIN'?icon_selected:icon_unselected"></div>
        </li>
      </ul>
    </div>
    <div style="height: 100px"></div>
    <div class="footer">
      <div class="money">金额：<span>￥<span>{{sum}}</span></span></div>
      <div class="pay-btn" @click="submit">支付</div>
    </div>
    <Modal v-model="qrcode.show" :width="320">
      <div class="buy_qr_con">
        <div class="title" v-if="order.paySort == 'ALIPAY'">支付宝</div>
        <div class="title" v-if="order.paySort == 'WEIXIN'">微信</div>
        <div id="qrcode" ref="qrcode"></div>
        <div class="tip">请扫支付二维码支付</div>
        <div style="font-size: 16px;margin-top: 10px;font-weight: bold;" v-if="qrcode.status == 'WAITING_PAY'">等待支付</div>
        <div style="font-size: 16px;margin-top: 10px;font-weight: bold;" v-if="qrcode.status == 'COMPLETED'">交易成功</div>
        <div style="font-size: 16px;margin-top: 10px;font-weight: bold;" v-if="qrcode.status == 'CANCEL'">订单取消</div>
        <div style="font-size: 16px;margin-top: 10px;font-weight: bold;" v-if="qrcode.status == 'CLOSE'">订单关闭</div>
      </div>
      <div slot="footer">
        <Button size="large" long @click="qrcode.show=false">关闭</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getEnterpriseComboList, createOrder, orderNo } from '../../api/trade'
// import { getByCompanyId } from '../../api/companylife'
import QRCode from 'qrcodejs2'
import { getCompany } from '../../api/company'

export default {
  name: 'buy',
  components: {
    QRCode
  },
  data () {
    return {
      orderType: 'DREDGE',
      order: {
        number: 2,
        paySort: 'ALIPAY',
        orderType: 'DREDGE',
        invitationCode: ''
      },
      max: 1000,
      combo: null,
      errorMsg: '',
      companylife: null,
      comboList: [],
      icon_alipay: require('../../assets/images/pay/icon_alipay@2x.png'),
      icon_wechat_pay: require('../../assets/images/pay/icon_wechat_pay@2x.png'),
      icon_unselected: require('../../assets/images/pay/icon_oval_unselected_gray@2x.png'),
      icon_selected: require('../../assets/images/pay/btn_oval_selected_green@2x.png'),
      inited: false,
      qrcode: {
        show: false,
        url: '',
        orderNo: '',
        status: '等待支付'
      },
      myCompany: {}
    }
  },

  computed: {
    ...mapGetters([
      'who',
      'myProfile'
    ]),
    sum () {
      let sum = 0
      if (this.combo) {
        sum = this.combo.price * this.combo.duration * this.order.number
      }
      if (sum < 0) { sum = 0 }
      return sum
    }
  },
  created () {
    this.orderType = this.$route.params.orderType
    this.order.orderType = this.orderType
    this.loadCompanyLife()
  },

  mounted () {
    this.loadComboList()
    this.qrcode.instance = new QRCode('qrcode', {
      width: 232, // 设置宽度
      height: 232, // 设置高度
      text: this.qrcode.url
    })
    this.watchStatus()
  },
  watch: {
    combo (value) {
      if (value) {
        this.order.comboId = value.id
      }
    }
  },
  methods: {
    ...mapActions([
      'getCompany'
    ]),
    orderMinus () {
      this.order.number--
      this.checkOrder()
    },
    orderPlus () {
      this.order.number++
      this.checkOrder()
    },
    checkOrder () {
      if (this.order.number < 2) {
        this.order.number = 2
        this.toast('开通人数不能少于2人')
      } else if (this.order.orderType === 'RENEWAL' && this.order.number > this.companylife.number) {
        this.order.number = this.companylife.number
        this.toast('抱歉续费暂时不支持增加人数，如需请在上个页面中增加后再续费')
      } else if (this.order.number > 10000) {
        this.order.number = 10000
        this.toast('超过10000人，请联系客服开通')
      }
    },
    // 弹窗提醒
    toast (message) {
      if (message) {
        let r = this.$f7.toast.create({
          text: message,
          position: 'center',
          closeTimeout: 3000
        })

        r.open()
      }
    }, // reminder
    loadComboList () {
      this.comboList = []
      let self = this
      getEnterpriseComboList().then(resp => {
        self.comboList = resp.data
        if (self.comboList && self.comboList.length > 0) {
          self.combo = self.comboList[0]
        }
      })
    },

    loadCompanyLife () {
      let self = this
      getCompany().then(resp => {
        self.myCompany = resp.data
        this.order.number = self.myCompany.quota
        if (self.companyLifeList) {
          if (self.companylife.items && self.companylife.items.length > 0) {
            self.order.number = self.companylife.items[0].number
          } else {
            self.order.number = self.companylife.number
          }
          if (self.order.orderType === 'RENEWAL') {
            self.max = self.order.number
          }
        }
        self.inited = true
      })
    },
    submit () {
      // let self = this
      // this.order.companyId = this.myCompany.id
      // this.order.companyName = this.myCompany.name
      // $preloader.show()
      let data = {
        comboId: this.combo.id,
        quota: this.order.number,
        invitationCode: this.order.invitationCode,
        paySort: this.order.paySort
      }
      createOrder(data).then(resp => {
        // if (self.order.paySort === 'WEIXIN') {
        let data = resp.data
        var params = {
          amount: data.amount,
          codeUrl: data.codeUrl,
          orderNo: data.orderNo
        }
        if (params.codeUrl) {
          this.qrcode.orderNo = data.orderNo
          this.$nextTick(() => {
            this.showQRCode(params.codeUrl)
            this.watchStatus()
          })
        } else {
          this.$Modal.error({
            title: '操作失败',
            content: '创建订单失败，请稍后重试 ！'
          })
        }
        // }
      }).catch(e => {
        this.$Modal.error({
          title: '操作失败',
          content: '创建订单失败，请稍后重试 ！'
        })
      })
    },
    showQRCode (url) {
      if (url) this.qrcode.url = url
      this.qrcode.instance.makeCode(this.qrcode.url)
      this.qrcode.show = true
    },
    watchStatus () {
      if (this.qrcode.time) return
      this.qrcode.time = setInterval(() => {
        if (this.qrcode.show && this.qrcode.orderNo) {
          orderNo(this.qrcode.orderNo).then(res => {
            this.qrcode.status = res.data.status
            if (res.data.status === 'COMPLETED') {
              clearInterval(this.qrcode.time)
              this.qrcode.time = null
              this.$Modal.success({ title: '温馨提示',
                content: '支付成功！',
                onOk: () => {
                  this.getCompany().then(() => {
                    this.$router.push({ name: 'home' })
                  })
                },
                onCancel: () => {
                  this.getCompany().then(() => {
                    this.$router.push({ name: 'home' })
                  })
                }
              })
            }
            console.log(res)
          })
        }
      }, 1000)
    }
  }
}
</script>
<style>
  .buy_qr_con{
    text-align: center;
  }
  .buy_qr_con .title{
    font-size: 20px;
    font-weight: bold;
    color: #66b8ed;
    margin-bottom: 10px;
  }
  .buy_qr_con .tip{
    color: #ff4d31;
    margin-top: 10px;
  }
  .buy_qr_con img{
    display: inline-block!important;
  }
</style>
<style scoped>
  body,div,ul,li,input,label,form,a,p,textarea{
    margin: 0;
    padding: 0;
  }
  ol,ul,li{
    list-style: none;
  }
  .clear-float {
    clear:both;
    height: 0;
    line-height: 0;
    font-size: 0;
  }
  .tips{
    height:35px;
    background:rgba(255,245,228,1);
    color: #F96A0E;
    font-size: 12px;
    line-height: 35px;
    padding-left: 15px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;/*文本不换行*/
  }
  .people-number{
    background: #FFFFFF;
    width: 100%;
    height: 54px;
  }
  .people-number .label{
    float: left;
    margin-left: 20px;
    font-weight: 500;
    color: #333333;
    font-size: 14px;
    line-height: 54px;
    width: 40%;
  }
  .people-number .number{
    float: right;
    margin-top: 12px;
    margin-right: 20px;
  }

  .duration-list{
    margin-top: 10px;
    padding: 10px 20px;
    width: 100%;
    background: #FFFFFF;
    color: #333333;
    box-sizing: border-box;
  }
  .duration-list .title{
    width: 100%;
    height: 34px;
    line-height: 34px;

    font-size: 14px;
    font-weight: 500;
  }
  .item-list  .item {
    width: 100%;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .active{
    background: #D4FAF1;
    border-radius: 4px;
    border:1px solid rgba(1,179,139,1);
  }
  .item .item-month{
    float: left;
  }
  .item .item-money{
    float: right;
  }
  .item .item-money .price{
    color: #01B38B;
    font-weight: 500;

  }
  .item .free{
    display: inline-block;
    background: #FFAB00;
    border-radius:9px;
    font-size: 11px;
    line-height: 16px;
    color: #FFFFFF;
    padding: 0 5px;
    margin-left: 5px;
  }
  .invite-code{
    width: 100%;
    height: 50px;
    color: #333333;
    background: #FFFFFF;
    margin-top: 10px;
    line-height: 50px;
    padding: 0 20px;
    font-size: 14px;
    box-sizing: border-box;
  }
  .invite-code label{font-weight: 500}
  .invite-code input{
    float: right;
    line-height: 46px;
    font-size: 14px;
    text-align: right;
    background:none;
    outline:none;
    border: none;
  }
  .paySort{
    margin-top: 10px;
    background: #FFFFFF;
    width: 100%;
    padding: 0 20px;
    color: #333333;
    box-sizing: border-box;
  }
  .paySort .title{
    font-weight: 500;
    font-size: 14px;
    line-height: 44px;
    height: 44px;
  }
  .paysort-list{}
  .paysort-list li{
    line-height: 54px;
    border-top: 1px solid #D8D8D8;

  }
  .paysort-list li div{
    display: inline-block;
  }
  .paysort-list li img{
    width: 24px;
    height: 24px;
    vertical-align:middle;
    margin-right: 10px;
  }
  .paysort-list .select{
    float: right;
  }
  .footer{
    background: #FFFFFF;
    bottom: 0px;
    height: 45px;
    width: 100%;
  }
  .footer .money{
    float: left;
    width: 70%;
    padding-left: 20px;
    line-height: 45px;
    box-sizing: border-box;
  }
  .footer .money span{
    color: #FF4A26;
  }
  .footer .money span span{
    font-size: 21px;
    font-weight: 500;
    color: #FF4A26;
  }
  .footer .pay-btn{
    float: right;
    background: #01B38B;
    height: 100%;
    width: 30%;
    color: #FFFFFF;
    line-height: 45px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    box-sizing: border-box;
  }

</style>
