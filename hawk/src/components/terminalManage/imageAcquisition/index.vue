<template>
    <f7-page @page:reinit="resetLoad">
        <f7-navbar title="终端形象采集" back-link></f7-navbar>

        <div class="p_content">
            <div class="pc_layer">
                <div class="list_item" v-for="(v, i) in list" @click="$f7router.navigate('/terminalManage/imageAcquisition/detail', { props: { detail: v }})">
                    <div class="pic">
                        <img :src="imgList[v._id]">
                    </div>
                    <div class="list_c">
                        <div class="title">{{v.name}}</div>
                        <p>{{moment(v.createdAt).format('YYYY-MM-DD HH:mm:ss')}}</p>
                        <p>{{who(v.creator) && who(v.creator).name}} 上传</p>
                    </div>

                    <img style="height: 12px;" src='../../../assets/images/arrow_right_gray copy 2@2x.png'>
                </div>

                <infinite-loading @infinite="onInfinite" :identifier="identifier" style="margin: 20px 0;">
                    <span slot="no-more">
                        已加载完所有内容
                    </span>
                </infinite-loading>
            </div>
        </div>

        <img @click="addFun" class="bt_add" src="../../../assets/images/btn_oval_add_green@2x.png">
    </f7-page>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import InfiniteLoading from 'vue-infinite-loading';
    import {getSignUrl} from 'lib/aliyun';
    import axios from 'axios';
    import moment from 'moment'
    export default {
        name: "index",
        components: {
            InfiniteLoading
        },
        props: {
            visitData: {
                type: Object,
                default: null
            }
        },
        data () {
            return {
                page: 0,
                isDo: true,
                identifier: 0,
                list: [],
                filter: {
                    creator: '',
                    page: 1,
                    limit: 10
                },
                imgList: {}
            }
        },
        computed: {
            ...mapGetters([
                'superAdmin',
                'myUserId',
                'myProfile',
                'who',
                'userDepartment',
                'isDepartmentAdmin',
                'personnel'
            ]),
            pList() {
                if (this.superAdmin._id == this.myUserId) return this.personnel;

                // non-admin can only has itself
                let d = this.userDepartment(this.myUserId);
                if (!d.admin.includes(this.myUserId)) return this.personnel.filter(p => p._id == this.myUserId);

                // admin can has all its subordinates
                let subordinates = (function listE(d) {
                    return d.employees.slice(0).concat(
                        d.sub.reduce((accum, s) => {return accum.concat(listE(s))}, [])
                    ) || [];
                })(d);

                subordinates = subordinates.filter(id => !(d.admin.includes(id) && id !== this.myUserId))
                return this.personnel.filter(p => subordinates.includes(p._id))
            }
        },
        methods: {
            moment,
            async getImgSrc (data) {
                let arr = data.photos.filter(v => v.photos.length)
                if (arr.length) {
                    let p = arr[0].photos[0]
                    let url = p.substr(0, 4) == 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
                    await getSignUrl(url, (ret) => {
                        if (ret instanceof Error) {
                            this.$set(this.imgList, data._id, require('assets/images/pic_no_photo@2x.png'))
                        } else {
                            this.$set(this.imgList, data._id, ret)
                        }
                    });
                } else {
                    this.$set(this.imgList, data._id, require('assets/images/pic_no_photo@2x.png'))
                }
            },
            addFun () {
                if (this.visitData && this.visitData.visitor !== this.myUserId) {
                    $alert('你不是这次终端拜访的拜访人，无权限操作')
                } else {
                    this.$f7router.navigate('/terminalManage/imageAcquisition/update', {
                        props: {
                            visitData: this.visitData
                        }
                    })
                }
            },
            resetLoad () {
                this.page = 0
                this.isDo = true
                this.identifier = 0
                this.list = []
            },
            onInfinite ($state) {
                if (this.isDo) {
                    this.page++;
                    // console.log(this.page);
                    let cb = (isFnish) => {
                        if (isFnish) {
                            $state.loaded();
                            $state.complete();
                        } else {
                            $state.loaded();
                        }
                    }
                    this.load($state, cb);
                } else {
                    $state.loaded();
                    $state.complete();
                }
            },
            async load (state, cb) {
                this.filter.page = this.page
                this.filter.creator = this.pList.map(v => v._id)
                if (this.visitData) this.filter.visitId = this.visitData._id
                await axios.post('api/imageAcquisition/list', this.filter).then(res => {
                    this.identifier++;
                    if (res.data && res.data.length) {
                        if (this.page === 1) this.list = []
                        this.list = this.list.concat(res.data)
                        if (cb) cb(false);
                        res.data.forEach(v => {
                            this.getImgSrc(v)
                        })
                    } else {
                        if (cb) cb(true);
                        this.isDo = false
                    }
                }).catch(err => {
                    console.error(err.message);
                    $alert('查询终端形象采集列表失败')
                })
            }
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
        }


        .list_item {
            background: #fff;
            padding: 15px;
            border-bottom: 1px solid #D8D8D8;
            display: flex;
            flex-direction: row;
            align-items: center;

            .pic {
                width: 60px;
                height: 60px;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .list_c {
                flex-grow: 1;
                margin: 0 10px;

                .title {
                    font-size: 15px;
                    color: #000;
                    line-height: 15px;
                }


                p {
                    font-size: 14px;
                    line-height: 14px;
                    color: #666;
                    margin: 8px 0 0 0;
                }
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
