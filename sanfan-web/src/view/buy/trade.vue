<template>
  <Card title="企业套餐">
    <div class="card_con">
      <div><span class="card_title">{{myCompany.name}}</span></div>
      <div><span class="card_count">剩余时间：{{myCompany.surplusDays}}天</span><span class="card_status">试用版</span></div>
      <div><span class="card_count">使用名额：{{myCompany.quota}}个</span><span class="card_time">有效期：<span>2019-04-05</span></span></div>
      <div style="text-align: right">
        <div class="card__fn" v-if="this.order.duration" style="width: 120px" @click="addUser">添加使用名额</div>
        <div v-if="myCompany.companyStatus=='UNUSE'||myCompany.companyStatus=='PROBATION'" class="card__fn" @click="dredge">开通</div>
        <div v-if="myCompany.companyStatus=='INUSE'" class="card__fn" @click="renewal">续费</div>
      </div>
    </div>
    <div>
      <div v-for="(companylife,index) in myCompany.companyLifeList" :key="index" class="info-content">
        <div class="content" v-if="companylife">
          <div>
            <div>使用名额：<span>{{companylife.quota}} 个</span></div>
            <div>使用期剩余时间：<span>{{companylife.surplusDays}} 天</span></div>
            <div style="clear: both">到期时间：<span>{{companylife.validDate}}</span></div>
          </div>
        </div>
      </div>
<!--      <div v-for="(item,index) in EnterpriseComboList" :key="index" class="info-content">-->
<!--        <div class="content" v-if="item">-->
<!--          <div>-->
<!--            <div>使用时长：<span>{{item.duration}}个月</span></div>-->
<!--            <div>赠送时长：<span>{{item.freeDuration}}个月</span></div>-->
<!--            <div>单价：<span>{{item.price}}元</span></div>-->
<!--            <div style="clear: both">总价：<span>{{item.duration*item.price}}元</span></div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <div>
      <Modal class="date-modal" v-model="dateDialog" @on-ok="dateDialog=false;jumpTo('pay_page',{'order':order})" @on-cancel="dateDialog=false">
        <div class="modal-title">添加使用名额</div>
        <div class="modal-form">
          <ul>
            <li class="clear-float">
              <div class="money-label">金额：</div>
              <div class="money">{{sum}}</div>
            </li>
            <li class="clear-float">
              <div class="staff-label">添加员工：</div>
              <div class="staff">
                <InputNumber :max="1000" :min="1" v-if="order.number != null" color="gray" v-model="order.number"></InputNumber>
              </div>
            </li>
          </ul>

        </div>
        <div class="modal-tips">
          注：为了方便统一管理，现在剩下使用期为{{order.duration}}天，所以添加的人数是计算{{order.duration}}天的
        </div>
      </Modal>
    </div>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import { getEnterprisePrice, getEnterpriseComboList } from '../../api/trade'
import moment from 'moment'
export default {
  name: 'trade',
  data () {
    return {
      order: {
        number: 1,
        paySort: 'ALIPAY',
        orderType: 'ADD_USER',
        duration: 0,
        invitationCode: '',
        price: 0
      },

      dateDialog: false,
      companylife: {

      },
      combo: null,
      errorMsg: '',
      comboList: [],
      EnterpriseComboList: []
    }
  },
  computed: {
    ...mapGetters([
      'who',
      'myProfile',
      'myCompany'
    ]),
    sum () {
      return (this.order.number * this.order.price * this.order.duration).toFixed(2)
    }
  },

  mounted () {
    this.loadPrice()
    // this.order.companyId = this.myCompany._id
    this.init()
  },
  methods: {
    init () {
      if (new Date(this.myCompany.validDate) > new Date()) {
        this.order.duration = moment(this.myCompany.validDate).diff(new Date(), 'days')
      }
      getEnterpriseComboList().then(res => {
        this.EnterpriseComboList = res.data
      })
      getEnterprisePrice().then(res => {
        this.order.price = res.data.price
      })
    },
    dredge () {
      this.jumpTo('buy_page', { orderType: 'DREDGE' })
    },
    addUser () {
      this.dateDialog = true
    },
    renewal () {
      this.jumpTo('buy_page', { orderType: 'RENEWAL' })
    },
    getValidDateStyle (date) {
      if (moment(date).diff(new Date(), 'days') < 10) {
        return { 'color': '#F96A0E' }
      }
    },

    dateFormat (date) {
      return new Date(date).toHawkDateString()
    },
    loadPrice () {
      let self = this
      getEnterprisePrice().then(resp => {
        if (resp.data) {
          self.order.price = (resp.data / 30).toFixed(2)
        }
      })
    },
    jumpTo (name, params) {
      this.$router.push({
        name,
        params
      })
    }
  }
}
</script>

<style scoped>
  .time_com{
    /*margin-bottom: 20px;*/
  }
  .card_con{
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 4px;
  }
  .card_status{
    float: right;
  }
  .card_time{
    float: right;
  }
  .card__fn{
    background-color: #01b38b;
    color: white;
    width: 60px;
    text-align: center;
    display: inline-block;
    padding: 5px 16px;
    border-radius: 50px;
    margin-left: 10px;
    cursor: pointer;
  }

  .clear-float {
    clear:both;
    height: 0;
    line-height: 0;
    font-size: 0;
  }
  .info-content{
    margin: 20px 10px;
    background: #FFFFFF;
    box-shadow:0px 0px 10px 2px rgba(0,0,0,0.2);
    border-radius:5px;
    padding: 15px;
    box-sizing: border-box;
    border-left: 4px solid #01B38B;
  }
  .info-content .header{
    font-size: 14px;
    color: #333333;
    font-weight: 500;
  }
  .info-content .content{
    color: #666;
    margin-top: 5px;

  }
  .info-content .content .people-number{
    line-height: 20px;
    font-size: 13px;
    /*float: left;*/
  }
  .info-content .content .valid-date{
    line-height: 20px;
    font-size: 13px;
    /*float: right;*/
  }
  .info-content .footer{
    height: 30px;
  }
  .footer-button{
    cursor: pointer;
    display: inline-block;
    padding: 0 15px;
    font-size: 12px;
    line-height: 26px;
    background:rgba(1,179,139,1);
    border-radius:12px;
    color: #FFFFFF;
    margin-left: 10px;
  }
  .date-modal{
    /*position: relative;*/
  }

  .modal-title{
    text-align: center;
    font-weight: 500;
    font-size: 16px;
    color: #333;
  }
  .modal-form{
    /*margin-top: 10px;*/
    margin: 10px auto 10px auto;
  }
  .modal-tips{
    clear: both;
    background: #FFF5E4;
    color: #F96A0E;
    bottom: 44px;
    padding: 5px 10px;
    font-size: 12px;
  }
  .modal-form .from-li{
    margin-top: 15px;
    height: 50px;
  }
  .modal-form .money-label{
    float: left;
    display: inline-block;
    width: 40%;
    text-align: right;

    font-size: 12px;
    color: #666;
    line-height: 50px;
  }
  .modal-form .money{
    float: left;
    display: inline-block;
    font-size: 21px;
    color: #FF4A26;
    font-weight: 500;
    line-height: 50px;
  }
  .modal-form .staff-label{
    float: left;
    width: 40%;
    text-align: right;
    font-weight: 500;
    display: inline-block;
    font-size: 14px;
    color: #333;
    line-height: 50px;
  }
  .modal-form .staff{
    float: left;
    margin-top: 10px;
    display: inline-block;
  }
  .modal-button{
    position: absolute;
    width: 100%;
    margin-top: 10px;
    margin-left: -15px;
    height: 44px;
    bottom: 0px;
    border-top: 1px solid #D8D8D8;
    font-size: 16px;

  }
  .modal-button .modal-save{
    float: right;
    width: 50%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #01B38B;

  }
  .modal-button .modal-cancel{
    width: 50%;
    float: left;
    height: 44px;
    line-height: 44px;
    text-align: center;
    border-right: 1px solid #D8D8D8;
    box-sizing: border-box;
    color: #333;
  }
</style>
