<template>
    <f7-page class="commodity_other">
        <f7-navbar :title="`选择${which.name}`" back-link></f7-navbar>

        <div class="other_c">
            <div class="other_list">
                <div class="list" v-for="(v, i) in list" :key="i" @click="choose(which.type, v)">
                    {{v}}
                </div>
            </div>

            <div class="footer" @click="add">新增{{which.name}}</div>
        </div>
    </f7-page>
</template>

<script>
import axios from 'axios'
export default {
    name: "other",
    props: {
        which: {
            type: Object,
            required: true
        },
        choose: {
            type: Function,
            required: true
        }
    },
    data () {
        return {
            list: [],
            id: null
        }
    },
    methods: {
        load() {
            axios.get(`api/commodity/${this.which.type}`).then(res => {
                if (res.data) {
                    this.list = res.data[this.which.type]
                    this.id = res.data._id
                }
            }).catch(err => {
                console.error(err.message)
                $alert('无法获取列表')
            })
        },
        add () {
            $prompt(`请输入新${this.which.name}`, `新增${this.which.name}`, (name) => {
                if (!name) {
                    $alert(`${this.which.name}不能为空'`, '操作错误');
                    return;
                }
                let list = Object.assign([], this.list)
                list.push(name)

                axios[this.id ? 'post' : 'put'](`api/commodity/${this.which.type}`, {
                    [this.which.type]: list
                }).then(res=>{
                    this.load()
                    if (cordova.plugins.aMapLocation) {
                        this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: `新增${this.which.name}`})
                    }
                }).catch(err => {
                    console.error(err.message);
                    $alert('添加失败')
                });
            });
        }
    },
    created() {
        this.load()
    }
}
</script>

<style lang="scss" scoped>
.commodity_other {
    .other_c {
        position: relative;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .other_list {
            flex-grow: 1;
            overflow: auto;
            -webkit-overflow-scrolling: touch;

            .list {
                padding: 0 15px;
                height: 44px;
                line-height: 44px;
                border-bottom: 1px solid #D8D8D8;
                font-size: 14px;
                color: #333;
                background: #fff;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;/*文本不换行*/
                margin: 0;
            }
        }

        .footer {
            height: 45px;
            line-height: 45px;
            font-size: 16px;
            color: #333333;
            background: #fff;
            text-align: center;
            box-shadow: 0 0 5px rgba(0, 0, 0, .15);
        }
    }
}
</style>
