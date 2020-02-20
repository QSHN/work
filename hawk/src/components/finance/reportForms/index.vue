<template>
    <f7-page>
        <f7-navbar title="新会计准则报表" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="selectAccountSet">选择账套</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="p_content">
            <ul class="rf_nav">
                <li>当前账套：{{accountSetName}}</li>
                <li @click="go('profit')">利润表</li>
                <li @click="go('ownerEquity')">所有者权益变动表</li>
                <li @click="go('balanceSheet')">资产负债表</li>
            </ul>
        </div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import axios from 'axios'
export default {
    name: "index",
    data () {
        return {
            accountList: []
        }
    },
    computed: {
        ...mapGetters([
            'myProfile'
        ]),
        accountSetName () {
            let accountSet = ''
            if (this.myProfile.accountSetId) {
                accountSet = this.accountList.find(v => v._id === this.myProfile.accountSetId)
            }
            return accountSet ? accountSet.accountSetName : ''
        }
    },
    methods: {
        updateMyInfo (accountSetId) {
            this.$store.dispatch('SAVE_USER_KEY', { accountSetId: accountSetId })
        },
        selectAccountSet () {
            let buttons = []
            this.accountList.forEach(v => {
                if (!(v.status === '编辑中' || v.status === '已停用' || v.status === '已删除')) {
                    buttons.push({
                        text: v.accountSetName,
                        onClick: () => {
                            this.updateMyInfo(v._id)
                            this.$forceUpdate()
                        }
                    })
                }
            })
            buttons.push({
                text: '取消'
            })
            $dialog.create({
                title: '选择账套',
                buttons: buttons,
                verticalButtons: true,
            }).open();
        },
        go (url) {
            if (!this.myProfile.accountSetId) {
                this.selectAccountSet()
            } else {
                let accountSet = this.accountList.find(v => v._id === this.myProfile.accountSetId)
                this.$f7router.navigate('/finance/reportForms/' + url, {
                    props: { accountSet }
                });
            }
        }
    },
    created() {
        $preloader.show();
        axios.post(CONFIG.server.tradeApiUrl + 'accountSet/query', {
            companyId: this.myProfile.bClientId
        }).then(res => {
            $preloader.hide();
            this.accountList = res.data
            if (!this.myProfile.accountSetId) this.selectAccountSet()
        }).catch(err => {
            $alert('查询账套列表失败')
            $preloader.hide();
        })
    }
}
</script>

<style lang="scss" scoped>
.rf_nav {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
        height: 44px;
        line-height: 44px;
        border-bottom: 1px solid #D8D8D8;
        background: #fff;
        padding: 0 20px;
    }
}
</style>
