<template>
  <Card :title="'支付选择'">
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
          <div style="font-size: 16px;margin-top: 10px;font-weight: bold;">{{qrcode.status}}</div>
        </div>
        <div slot="footer">
          <Button size="large" long @click="qrcode.show=false">关闭</Button>
        </div>
      </Modal>
  </Card>
</template>
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
        /*position: fixed;*/
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
<script>
import { mapGetters, mapActions } from 'vuex'
import { createAddUserOrder, orderNo } from '../../api/trade'
import QRCode from 'qrcodejs2'

export default {
  name: 'pay',
  components: {
    QRCode
  },
  data () {
    return {
      order: {
        number: 10,
        price: 2.67,
        paySort: 'ALIPAY',
        orderType: 'ADD_USER',
        invitationCode: ''
      },
      errorMsg: '',
      comboList: [],
      icon_alipay: require('../../assets/images/pay/icon_alipay@2x.png'),
      icon_wechat_pay: require('../../assets/images/pay/icon_wechat_pay@2x.png'),
      icon_unselected: require('../../assets/images/pay/icon_oval_unselected_gray@2x.png'),
      icon_selected: require('../../assets/images/pay/btn_oval_selected_green@2x.png'),
      qrcode: {
        show: false,
        url: '',
        orderNo: '',
        status: '等待支付',
        instance: null
      }
    }
  },

  computed: {
    ...mapGetters([
      'myCompany',
      'who',
      'myProfile'
    ]),
    sum () {
      return (this.order.number * this.order.price * this.order.duration).toFixed(2)
    }
  },
  mounted () {
    if (!this.$route.params.order) {
      this.$router.push({ name: 'trade_page' })
    }
    this.order = this.$route.params.order
    this.qrcode.instance = new QRCode('qrcode', {
      width: 232, // 设置宽度
      height: 232, // 设置高度
      text: this.qrcode.url
    })
    this.watchStatus()
  },
  watch: {
    '$route.params.order' () {
      this.order = this.$route.params.order
    }
  },
  methods: {
    ...mapActions([
      'getCompany'
    ]),
    submit () {
      let data = {
        quota: this.order.number,
        invitationCode: this.order.invitationCode,
        paySort: this.order.paySort
      }
      createAddUserOrder(data).then(resp => {
        let data = resp.data
        var params = {
          amount: data.amount,
          codeUrl: data.codeUrl,
          orderNo: data.orderNo
        }
        this.qrcode.orderNo = data.orderNo
        this.$nextTick(() => {
          this.showQRCode(params.codeUrl)
          this.watchStatus()
        })
      }).catch(e => {
        this.$Modal.error({
          title: '操作失败',
          content: '创建订单失败，请稍后重试 ！'
        })
      })
      console.log(this.order)
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
