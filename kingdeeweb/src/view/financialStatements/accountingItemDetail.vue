<template>
  <div>
    <Row style="line-height: 30px; font-size: 18px;">
      核算项目明细表
    </Row>

    <Card shadow style="margin: 10px 0">
      <Row type="flex">
        <div style="display: flex;">
          <span style="margin-right: 5px; line-height: 30px;">显示项目：</span>
          <Select v-model="search.accountItem" multiple style="width: 300px">
            <Option v-for="(v, i) in accountingProgram" :value="v.title" :key="i">{{v.title}}</Option>
          </Select>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;">会计期间：</span>
          <DatePicker type="month" v-model="search.accountingPeriod" style="width: 100px" :clearable="false"></DatePicker>
          <span style="margin: 0 10px; line-height: 30px;">至</span>
          <DatePicker type="month" v-model="search.accountingPeriodEnd" style="width: 100px"></DatePicker>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;">科目：</span>
          <Select v-model="search.subjectCode" filterable clearable style="width: 168px">
            <Option v-for="item in getSubjectList" :value="item.code" :key="item.code">{{ item.code }} {{ item.name }}</Option>
          </Select>
          <Button type="default" style="margin-left: 10px;" @click="selectSubject(false)">选择</Button>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;">包括未过账凭证：</span>
          <Checkbox v-model="search.post" style="margin-top: 7px;"></Checkbox>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <Button type="primary" @click="load" style="width: 100px;">搜索</Button>
        </div>
      </Row>
    </Card>

    <Card shadow>
      <div class="c_table">
        <div class="t_h">
          <div class="tb"></div>
          <div class="tb tb2" v-for="(v, i) in search.accountItem" :key="i">{{v}}</div>
        </div>

        <div class="t_c">
          <ul>
            <li>
              <div class="tb">条件</div>
              <div class="tb tb2" v-for="(type, tIndex) in search.accountItem" :key="tIndex">
                <Select v-model="select[tIndex]">
                  <Option v-for="(v, i) in selectObj[type]" :value="v" :key="i">{{v}}</Option>
                </Select>
              </div>
            </li>
            <li v-for="(v, i) in getTableList()" :key="i">
              <div class="tb">{{i + 1}}</div>
              <div class="tb tb2" v-for="(type, tIndex) in search.accountItem" :key="tIndex">
                {{getContent(v.accountingItem || [], type)}}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Card>

    <selectSubject ref="subject" :isReturnObj="true" :isAccountItem="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { accountingItemDetail } from '../../api/credentials'
import { formatMoney } from 'accounting'
import { querySubject } from '../../api/subject'
import { accountingProgram } from '../../libs/accountingProgram'
import moment from 'moment'
import selectSubject from '../../components/subject/index'
export default {
  name: 'accountingItemDetailIndex',
  components: {
    selectSubject
  },
  data () {
    return {
      accountingProgram,
      which: -1,
      search: {
        accountSetId: null,
        subjectCode: null,
        accountingPeriod: null,
        accountingPeriodEnd: null,
        post: false,
        accountItem: ['客户']
      },
      tableData: [],
      selectObj: {},
      select: ['全部', '全部', '全部', '全部', '全部', '全部', '全部'],
      subjectList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getSubjectList () {
      let list = this.subjectList.filter(f => f.accountItem.length)
      return list
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.search.accountSetId = this.accountSet._id
          this.search.accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
          this.load()
          this.loadSubject()
        }
      },
      immediate: true,
      deep: true
    },
    search: {
      handler () {
        if (this.search.accountingPeriod && this.search.accountingPeriodEnd) {
          if (this.moment(this.accountingPeriodEnd).isBefore(this.search.accountingPeriod)) {
            this.search.accountingPeriodEnd = this.search.accountingPeriod
          }
        }
      },
      deep: true
    }
  },
  methods: {
    formatMoney,
    moment,
    getTableList () {
      let list = this.tableData
      return list
    },
    getContent (list, type) {
      let fData = list.find(l => l.type === type)
      return fData ? fData.code + '-' + fData.name : ''
    },
    selectSubject (isEnd) {
      this.$refs.subject.show(obj => {
        if (!isEnd) {
          this.search.subjectCode = obj.code
        } else {
          if (obj.code <= this.search.subjectCode) {
            this.search.subjectCodeEnd = this.search.subjectCode
          } else {
            this.search.subjectCodeEnd = obj.code
          }
        }
      })
    },
    loadSubject () {
      querySubject({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('querySubject', res.data)
        this.subjectList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
    },
    load () {
      accountingItemDetail(this.search).then(res => {
        let list = []
        res.data.forEach(r => {
          r.child.forEach(c => {
            if (c.accountingItem && c.accountingItem.length) {
              c.accountingItem.forEach(cf => {
                if (this.selectObj[cf.type]) {
                  if (!this.selectObj[cf.type].includes(cf.name)) {
                    this.selectObj[cf.type].push(`${cf.code}-${cf.name}`)
                  }
                } else {
                  this.selectObj[cf.type] = ['全部', `${cf.code}-${cf.name}`]
                }
              })
              list.push({
                ...c,
                accountingPeriod: r.accountingPeriod
              })
            }
          })
        })
        this.tableData = list
      }).catch(err => {
        this.$Notice.error({
          title: '核算项目明细表',
          desc: err.message
        })
      })
    },
    goDetail (v) {
      this.$router.push({
        name: 'accountingDetailIndex',
        query: {
          accountSetId: this.accountSet._id,
          subjectCode: v.code,
          subject: v.name,
          accountingPeriod: v.time
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .c_table {
    position: relative;
    /*width: 1404px;*/
    /*height: 100%;*/
    display: flex;
    flex-direction: column;
    border: 1px solid #dcdee2;
    max-width: 1404px;
    width: 100%;
    overflow: auto;

    .tb {
      position: relative;
      width: 100px;
      display: table-cell;
      border-left: 1px solid #dcdee2;
      font-size: 14px;
      /*overflow: hidden;*/
    }
    .tb2 {
      width: 180px;

    }

    .t_h {
      position: relative;
      /*width: 1402px;*/
      height: 49px;
      line-height: 48px;
      background: #f8f8f9;
      text-align: center;
      border-bottom: 1px solid #dcdee2;

      & > div {}
    }

    .t_c {
      flex-grow: 1;
    }

    .t_h, li {
      .tb:nth-child(1) {
        border: none;
      }
    }

    .t_c > ul {
      /*width: 1402px;*/
      list-style: none;
      /*border-bottom: 1px solid #dcdee2;*/
      padding: 0;

      & > li {
        width: 100%;
        cursor: pointer;
        border-bottom: 1px solid #dcdee2;

        &.active {
          background: #000;
          color: #fff;
        }

        .tb {
          font-size: 12px;
          padding: 3px 5px;
        }
      }
    }
  }
</style>
