<template>
    <f7-page>
        <f7-navbar title="车销" back-link></f7-navbar>

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
export default {
    name: "index",
    data () {
        return {
            list: [
                {name: '提货申请', url: 'bill', props: {}},
                {name: '装车拍照', url: 'truck', props: {}},
                {name: '车载库存查询', url: 'inventorySearch', props: {}},
                {name: '到店销售', url: 'store', props: {}},
                {name: '回库申请', url: 'back', props: {}},
                {name: '车载库存盘点', url: 'inventoryCheck', props: {}},
                {name: '车销单', url: 'order', props: {}},
                {name: '退换货再售', url: 'refundable', props: {}},
                {name: '车辆管理', url: 'car', props: {}}
            ]
        }
    },
    methods: {
        getImg (index) {
            return require(`../../../assets/images/cx_${index + 1}.png`)
        },
        go (url, props) {
            this.$f7router.navigate(`/psiManage/carSales/${url}`, {props: props})
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
