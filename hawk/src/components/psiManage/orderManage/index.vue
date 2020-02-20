<template>
    <f7-page>
        <f7-navbar title="订单管理" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="go('orderManage/list', {})">我的订单</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <ol class="car_nav">
            <li v-for="(v, i) in list" @click="go(v.url, v.props)">
                <img class="icon" :src="getImg(i)" />
                <span>{{v.name}}</span>
                <img class="arrow" src="../../../assets/images/arrow_right_gray.png"/>
            </li>
        </ol>
    </f7-page>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    export default {
        name: "index",
        data () {
            return {
                list: [
                    {name: '订单审批', url: 'salesOrder/', props: {}},
                    {name: '部门订单', url: 'orderManage/department', props: {}},
                    {name: '商品订单', url: 'orderManage/statistics', props: {dataType: '商品'}},
                    {name: '客户订单', url: 'orderManage/statistics', props: {dataType: '客户'}},
                    {name: '员工订单', url: 'orderManage/statistics', props: {dataType: '员工'}},
                ]
            }
        },
        computed: {
            ...mapGetters([
                'superAdmin',
                'myUserId',
                'myProfile',
                'who',
                'isDepartmentAdmin'
            ]),
            isAdministrative () {
                return this.myProfile.privilege.some(i => ['合同管理', '企业设置'].includes(i))
            },
            isFinance () {
                return this.myProfile.accountType === '财务'
            },
            isEmployee () {
                return this.superAdmin._id === this.myUserId || this.isDepartmentAdmin(this.myUserId) || this.isAdministrative || this.isFinance
            },
        },
        methods: {
            getImg (index) {
                return require(`../../../assets/images/om${index + 1}.png`)
            },
            go (url, props) {
                if (url !== 'orderManage/list' && !this.isEmployee) {
                    $alert('您无权限查看')
                    return
                }
                this.$f7router.navigate(`/psiManage/${url}`, {props: props})
            }
        }
    }
</script>

<style lang="scss" scoped>
    .car_nav {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 44px;
            border-bottom: 1px solid #D8D8D8;
            background: #fff;
            padding: 0 20px;


            .icon {
                width: 20px;
                height: 20px;
            }

            span {
                flex-grow: 1;
                margin: 0 10px;
                font-size: 14px;
                color: #333;
            }
        }
    }
</style>
