<template>
    <f7-page class="commodity_manage">
        <f7-navbar title="库存查询" back-link> </f7-navbar>

        <div class="cm_content">
            <div class="list_layer">
                <div class="barcodesearch">
                    <div class="searchbar searchbar-inline">
                        <div class="searchbar-input-wrap">
                            <input type="search" v-model="search" placeholder="请输入商品名称">
                            <i class="searchbar-icon"></i>
                        </div>
                    </div>
                </div>
                <div class="list" v-for="(v, i) in getList" :key="i"
                     @click="$f7router.navigate('/psiManage/stock/list', {
                        props: {
                            commodity: v
                        }
                     })">
                    <div class="title">{{v.name}}</div>
                    <img class="arrow-right" src="../../../assets/images/arrow_right_gray@2x.png" width="8px" />
                </div>
            </div>

            <div class="submit-button" @click="getCode">扫二维码查询库存</div>
        </div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import axios from 'axios'
export default {
    name: "index",
    data() {
        return {
            list: [],
            search: ''
        }
    },
    computed: {
        getList () {
            let list = this.list
            if (this.search) {
                list = list.filter(v => v.includes(this.search))
            }
            return list
        }
    },
    methods: {
        load () {
            $preloader.show()
            axios.get('api/commodity/').then(res => {
                if (res.data) {
                    this.list = res.data
                }
                $preloader.hide()
            }).catch(err => {
                $preloader.hide()
                console.error(err.message)
                $alert('库存查询失败')
            })
        },
        getCode () {
            $preloader.show();
            let self = this
            if (cordova.plugins.barcodeScanner) {
                cordova.plugins.barcodeScanner.scan(
                    (result) => {
                        $preloader.hide();
                        if (result && result.text) {
                            let commodity = this.list.filter(v => v.name === result.text)
                            if (commodity.length) {
                                this.$f7router.navigate('/psiManage/stock/list', {
                                    props: {
                                        commodity: commodity[0]
                                    }
                                })
                            } else {
                                $alert("找不到该商品");
                            }
                        }
                    },
                    (error) => {
                        $preloader.hide();
                        $alert("扫描条码失败: " + error);
                    }, {
                        preferFrontCamera : false, // iOS and Android
                        showFlipCameraButton : false, // iOS and Android
                        showTorchButton : true, // iOS and Android
                        torchOn: false, // Android, launch with the torch switched on (if available)
                        saveHistory: false, // Android, save scan history (default false)
                        prompt : "请将条形码放在扫描框中", // Android
                        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                        formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
                        orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                        disableAnimations : true, // iOS
                        disableSuccessBeep: false // iOS and Android
                    }
                );
            } else {
                $preloader.hide();
            }
        }
    },
    created() {
        this.load()
    }
}
</script>

<style lang="scss" scoped>
.ios .searchbar {
    overflow: hidden;
    background: #f7f7f8;
    padding: 10px;
    width: auto;
    height: auto;
}
.cm_content {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;

    .list_layer {
        flex-grow: 1;
        -webkit-overflow-scrolling: touch;
        overflow-y: auto;
    }


    .list {
        padding: 0 15px;
        height: 40px;
        border-bottom: 1px solid #d8d8d8;
        background: #fff;
        margin: 0 auto;
        font-size: 14px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .title {
            flex-grow: 1;
        }
    }

    .submit-button{
        width:100%;
        height:45px;
        line-height: 45px;
        font-size:16px;
        color: #FFFFFF;
        text-align: center;
        background:#3385FF;
        margin-top: 10px;
    }
}
</style>
