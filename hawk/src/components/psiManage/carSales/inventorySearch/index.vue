<template>
    <f7-page>
        <f7-navbar title="车载库存查询" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="searchFun">筛选</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="list_item" v-for="(v, i) in getList" @click="go(v)">
                    <div class="list_l">
                        <div class="title">
                            车号：{{v.numberPlate}}
                        </div>
                    </div>
                    <img class="arrow" src='../../../../assets/images/arrow_right_gray copy 2@2x.png' style="width: 8px; height: 12px;">
                </div>
            </div>
        </div>
    </f7-page>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import axios from 'axios';
    import moment from 'moment'
    export default {
        name: "index",
        data () {
            return {
                list: [],
                filter: {
                    numberPlate: ''
                }
            }
        },
        computed: {
            ...mapGetters([
                'who'
            ]),
            getList () {
                let list = this.list
                if (this.filter.numberPlate) {
                    list = list.filter(v => v.numberPlate.includes(this.filter.numberPlate))
                }
                return list
            }
        },
        methods: {
            moment,
            searchFun () {
                this.$f7router.navigate('/psiManage/carSales/inventorySearch/search', {
                    props: {
                        search: (val) => {
                            this.filter = {...val}
                            this.$f7router.back()
                        }
                    }
                })
            },
            load () {
                axios.post('api/carSales/inventory/list', this.filter).then(res => {
                    if (res.data && res.data.length) {
                        this.list = res.data[0].inventory
                    }
                }).catch(err => {
                    console.error(err.message);
                    $alert('查询公司车载库存列表失败')
                })
            },
            go (defaultVal) {
                this.$f7router.navigate('/selectCommodity', {
                    props: {
                        cId: '',
                        commodity: defaultVal.commodity,
                        isInventorySearch: true,
                        choose: (val) => {
                            this.formData.commodity = val
                            this.$f7router.back()
                        }
                    }
                })
            }
        },
        created() {
            this.load()
        }
    }
</script>

<style lang="scss" scoped>
    .p_content {
        height: 100%;
        display: flex;
        flex-direction: column;

        .pc_layer {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;

            .select_group {
                width: 100%;
                height: 44px;
                background: #fff;

                .select {
                    list-style: none;
                    text-align: center;
                    margin: 0;
                }
            }
        }


        .list_item {
            display: flex;
            flex-direction: row;
            align-items: center;
            background: #fff;
            padding: 15px;
            border-bottom: 1px solid #D8D8D8;

            .list_l {
                flex-grow: 1;
            }

            .title {
                display: flex;
                flex-direction: row;
                font-size: 15px;
                color: #000;
                line-height: 15px;

                .tip {
                    font-size: 12px;
                    line-height: 12px;
                    height: 12px;
                    padding: 1px;
                    color: #FFAB00;
                    border: 1px solid #FFAB00;
                    margin-left: 5px;

                    &.success {
                        color: #01B38B;
                        border: 1px solid #01B38B;
                    }

                    &.error {
                        color: #FF715A;
                        border: 1px solid #FF715A;
                    }
                }
            }

            .other {
                font-size: 14px;
                color: #999;
                line-height: 14px;
                padding: 10px 0;
                border-bottom: 1px solid #D8D8D8;

                div { display: inline-block; }
                .name { margin-left: 5px; }
            }

            p {
                font-size: 14px;
                color: #666;
                margin: 6px 0 0 0;
            }
        }
    }
    .bt_add {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 55px;
        height: 55px;
        text-align: center;
        line-height: 50px;
        font-size: 18px;
        z-index: 99;
    }
</style>
