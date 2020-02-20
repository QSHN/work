<template>
    <f7-page class="commodity_type">
        <f7-navbar title="选择类型" back-link></f7-navbar>

        <div class="ct_content">
            <div class="layer">
                <div class="left" v-if="currentId !== '0'">
                    <div class="back" @click="backLast">上一级</div>
                    <ul>
                        <li v-for="(v, i) in getList(parentId)"
                            :key="i"
                            @click="goType(v, false)"
                            :class="{active: v._id == currentId}">
                            {{v.name}}
                        </li>
                    </ul>
                </div>
                <div class="right">
                    <div class="title">类型</div>
                    <ul>
                        <li  v-for="(v, i) in getList(currentId)"
                             :key="i">
                            <div class="li_t">{{v.name}}</div>
                            <div class="btn-group">
                                <div class="btn" v-if="getList(v._id).length" @click="goType(v, true)">选择子类</div>
                                <div class="btn active" v-else>无子类型</div>
                                <div class="btn" @click="chooseType(v.name, v._id), $f7router.back()">选择当前</div>
                            </div>
                        </li>
                        <li v-if="!getList(currentId).length">
                            <div class="li_t">暂无子类型</div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="footer"
                 @click="$f7router.navigate('/psiManage/commodityManage/addType', {
                    props: {
                        addType: addType
                    }
                 })">
                新增类型
            </div>
        </div>
    </f7-page>
</template>

<script>
import axios from 'axios'
export default {
    name: "type",
    props: {
        chooseType: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            currentId: '0',
            parentId: '0',
            typeList: [],
            typeId: null,
            chooseLayer: ['0']
        }
    },
    watch: {
        chooseLayer () {
            this.currentId = this.chooseLayer[this.chooseLayer.length - 1]
            this.parentId = this.chooseLayer[this.chooseLayer.length - 2] || '0'
        }
    },
    methods: {
        backLast () {
            this.chooseLayer.splice(this.chooseLayer.length - 1, 1)
        },
        goType (data, isNew) {
            if (isNew) {
                this.chooseLayer.push(data._id)
            } else {
                this.chooseLayer.splice(this.chooseLayer.length - 1, 1, data._id)
            }
        },
        addType (data, cb) {
            if (this.typeList.filter(v => v.name == data.name).length) {
                $alert('已存在相同类型')
            } else {
                let ajaxData = Object.assign([], this.typeList)
                ajaxData.push({
                    id: Date.parse(new Date()).toString(),
                    name: data.name,
                    parentId: data.parentId || '0'
                })
                axios[this.typeId ? 'post' : 'put']('api/commodity/type', {
                    type: ajaxData
                }).then(res => {
                    this.load();
                    cb();
                    if (cordova.plugins.aMapLocation) {
                        this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: `新增类型`})
                    }
                }).catch(err => {
                    console.error(err.message)
                    $alert('添加失败')
                })
            }
        },
        load () {
            axios.get('api/commodity/type').then(res => {
                if (res.data) {
                    this.typeList = res.data.type || []
                    this.typeId = res.data._id
                }
            }).catch(err => {
                console.error(err.message)
                $alert('无法获取类型列表')
            })
        },
        getList(id) {
            return this.typeList.filter(v => v.parentId == id)
        }
    },
    created() {
        this.load()
    }
}
</script>

<style lang="scss" scoped>
.commodity_type {
    .ct_content {
        position: relative;
        height: 100%;
        overflow: hidden;
        display: flex;
        background: #fff;
        flex-direction: column;

        .layer {
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-grow: 1;
            overflow: hidden;
        }

        .footer {
            height: 45px;
            min-height: 45px;
            line-height: 45px;
            font-size: 16px;
            color: #333333;
            text-align: center;
            box-shadow: 0 0 5px rgba(0, 0, 0, .15);
        }

        ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .left {
            width: 80px;
            border-right: 1px solid #D8D8D8;
            overflow: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;

            .back, li {
                height: 45px;
                line-height: 45px;
                text-align: center;
                background: #3385FF;
                font-size: 14px;
                color: #fff;
            }

            li {
                padding: 0 10px;
                height: 44px;
                line-height: 44px;
                border-bottom: 1px solid #D8D8D8;
                color: #666;
                background: #fff;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;/*文本不换行*/

                &.active {
                    background: #F8F8F8;
                }
            }
        }

        .right {
            flex-grow: 1;
            overflow: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;

            .title {
                height: 45px;
                line-height: 45px;
                font-size: 14px;
                color: #666;
                background: #F8F8F8;
                padding-left: 10px;
            }

            li {
                color: #333;
                display: flex;
                height: 44px;
                line-height: 44px;
                border-bottom: 1px solid #D8D8D8;
                background: #fff;


                .li_t {
                    flex-grow: 1;
                    padding: 0 10px;
                    flex-direction: row;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;/*文本不换行*/
                }

                .btn-group {
                    display: flex;
                    margin-right: 15px;
                    align-self: center;

                    .btn {
                        margin-left: 5px;
                        width: 70px;
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        background: #3385FF;
                        font-size: 12px;
                        color: #fff;
                        border-radius: 20px;

                        &.active {
                            background: #fff;
                            color: #999;
                        }
                    }
                }
            }
        }
    }
}
</style>
