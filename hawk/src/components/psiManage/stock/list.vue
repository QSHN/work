<template>
    <f7-page class="commodity_manage">
        <f7-navbar :title="commodity.name" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="$f7router.navigate('/psiManage/stock/qrCode', { props: { name: commodity.name } })">
                    二维码
                </f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="cm_content">
            <div class="list_layer">
                <div class="list" v-for="(v, i) in list" :key="i"
                     v-if="v.realNumber > 0"
                     @click="$f7router.navigate('/psiManage/stock/detail', {
                        props: {
                            img: imgObj[v._id],
                            uData: v
                        }
                     })">
                    <div class="list_l">
                        <img v-if="imgObj[v._id]" :src="imgObj[v._id]" />
                        <img v-else src="../../../assets/images/pic_no_photo@2x.png" />
                    </div>

                    <div class="list_c">
                        <div class="title">
                            <div class="name">{{v.name}}</div>
                            <span class="label" v-if="v.label">{{v.label}}</span>
                        </div>
                        <p>仓库：{{v.warehouse}}</p>
                        <p>库存总数：{{v.realNumber}} {{v.unit}}</p>
                        <p>生产日期：{{v.produced && moment(v.produced).format('YYYY-MM-DD')}}</p>
                    </div>

                    <div class="list_r">
                        <img class="status" :src='getStatusImg(v.status)'>
                        <img class="arrow" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                    </div>
                </div>
            </div>
        </div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import {getSignUrl} from 'lib/aliyun';
import axios from 'axios'
import moment from 'moment'
export default {
    name: "index",
    props: {
        commodity: {
          type: Object,
          required: true
      }
    },
    data() {
        return {
            list: [],
            imgObj: {},
        }
    },
    methods: {
        moment,
        async getImg (id, p) {
            let url = p.substr(0, 4) == 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
            await getSignUrl(url, (ret) => {
                this.imgObj[id] = ret instanceof Error ? '#' : ret
                this.$forceUpdate()
            });
        },
        getStatusImg (status) {
            return require(`../../../assets/images/${status ? 'icon_sold _in_the_label_green' : 'icon_stop_label_red'}@2x.png`)
        },
        load (state, cb) {
            axios.get('api/warehouse/').then(res => {
                if (res.data && res.data.warehouse) {
                    this.list = []
                    res.data.warehouse.forEach(v => {
                        v.commodity.forEach(v1 => {
                            if (v1.commodity._id === this.commodity._id) {
                                let obj = Object.assign({}, this.commodity)
                                obj.realNumber = v1.realNumber
                                obj.dropShipping = v1.dropShipping || 0
                                obj.salesNumber = v1.salesNumber || v1.realNumber
                                obj.warehouse = v.name
                                this.list.push(obj)
                            }
                        })
                    })
                    this.list.forEach(v => {
                        this.getImg(v._id, v.photos[0])
                    })
                }
            }).catch(err => {
                console.error(err.message);
                $alert('库存查询失败')
            })
        }
    },
    created() {
        this.load()
    }
}
</script>

<style lang="scss" scoped>
.cm_content {
    position: relative;
    height: 100%;
    overflow-y: auto;

    .list {
        padding: 10px 0;
        border-bottom: 1px solid #D8D8D8;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0;
        background: #fff;
        overflow: hidden;
        position: relative;

        img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
        }

        .list_l {
            width: 60px;
            height: 60px;
            margin: 0 10px;
        }

        .list_c {
            padding-right: 20px;
            flex-grow: 1;
            overflow: hidden;

            .title {
                display: flex;
                flex-direction: row;
                align-items: center;

                .name {
                    font-size: 16px;
                    line-height: 16px;
                    color: #000;
                    margin-right: 10px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }

                .label {
                    font-size: 12px;
                    line-height: 12px;
                    height: 12px;
                    color: #01B38B;
                    padding: 1px;
                    border: 1px solid #01B38B;
                }
            }

            p {
                font-size: 14px;
                line-height: 14px;
                margin: 6px 0 0;
                color: #666;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }

        .list_r {
            position: absolute;
            right: 0;
            top: 0;
            width: 35px;
            height: 100%;

            .status {
                width: 35px;
                height: 35px;
                display: block;
            }

            .arrow {
                width: 8px;
                height: 12px;
                margin: 8px 0 0 12px;
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
}
</style>
