<template>
    <f7-page class="commodity_other">
        <f7-navbar :title="`选择${which.name}`" back-link></f7-navbar>

        <div class="other_c">
            <div class="other_list">
                <div class="list" v-for="(v, i) in list" :key="i">
                    <div class="it_l">
                        {{v.name || v}}
                    </div>
                    <div class="it_r" @click="selectChange(v)">
                        <img v-if="!selected[v._id]" src="../../assets/images/btn_tick_empty_gray@2x.png"/>
                        <img v-else src="../../assets/images/btn_tick_green@2x.png">
                    </div>
                </div>
            </div>

            <div class="footer" @click="choose(selectList)">提交</div>
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
        },
        url: {
            type: String,
            required: true
        },
        sData: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            list: [],
            selectList: [],
            selected: {},
            id: null
        }
    },
    watch: {
        selected () {
            this.selectList = []
            for(let key in this.selected) {
                this.selectList.push(this.selected[key])
            }
        }
    },
    methods: {
        selectChange (v) {
            if (this.selected[v._id]) {
                delete this.selected[v._id]
            } else {
                this.$set(this.selected, v._id, v)
            }
            this.$forceUpdate()
        },
        load() {
            axios.get(`api/${this.url}`).then(res => {
                if (res.data) {
                    if (res.data._id) {
                        this.list = res.data[this.which.type]
                        this.id = res.data._id
                    } else {
                        this.list = res.data
                    }
                }
            }).catch(err => {
                console.error(err.message)
                $alert('无法获取列表')
            })
        }
    },
    created() {
        this.load()
        if (this.sData && this.sData.length) {
            this.sData.forEach(v => {
                this.$set(this.selected, v._id, v)
            })
        }
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
                border-bottom: 1px solid #D8D8D8;
                background: #fff;
                margin: 0;
                display: flex;
                flex-direction: row;
                align-items: center;

                .it_l {
                    margin-right: 20px;
                    flex-grow: 1;
                    font-size: 14px;
                    color: #000;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }

                .it_r {
                    height: 20px;

                    img {
                        width: 20px;
                        height: 20px;
                    }
                }
            }
        }

        .footer {
            height: 45px;
            line-height: 45px;
            font-size: 16px;
            color: #333333;
            /*background: #fff;*/
            text-align: center;
            box-shadow: 0 0 5px rgba(0, 0, 0, .15);
        }
    }
}
</style>
