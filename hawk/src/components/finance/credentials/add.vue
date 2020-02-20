<template>
    <f7-page class="cre_add">
        <f7-navbar title="录凭证" back-link>
        </f7-navbar>

        <div class="p_content">
            <div class="add_btn" @click="go(null)">新增凭证</div>

            <div class="c_list">
                <p>凭证模板</p>
                <ol class="c_nav" >
                    <li v-for="(v, i) in tableData" @click="go(v.child)">
                        {{v.name}}
                    </li>
                </ol>
            </div>
        </div>
    </f7-page>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "add",
    props: {
      accountSet: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        tableData: []
      }
    },
    methods: {
      go (list) {
        this.$f7router.navigate('/finance/credentials/input', {
          props: {
            accountSet: this.accountSet,
            credentialsChild: JSON.parse(JSON.stringify(list)),
            credentialsData: null
          }
        })
      },
      loadTemp () {
        $preloader.show();
        axios.post(CONFIG.server.tradeApiUrl + 'credentialsTemplate/query', {
          accountSetId: this.accountSet._id
        }).then(res => {
          $preloader.hide();
          this.tableData = res.data
        }).catch(err => {
          $alert('查询凭证模板列表失败')
          $preloader.hide();
        })
      }
    },
    mounted () {
      if (this.accountSet) this.loadTemp()
    }
  }
</script>

<style lang="scss" scoped>
.cre_add {
    .p_content {
        padding: 0 20px;

        .add_btn {
            width: 100%;
            height: 36px;
            line-height: 36px;
            text-align: center;
            background: #fff;
            border-radius: 5px;
            margin: 10px 0;
        }

        .c_nav {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;

            li {
                width: 30%;
                height: 44px;
                background: #007aff;
                border-radius: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                color: #fff;
                margin-bottom: 20px;
            }
        }
    }
}
</style>
