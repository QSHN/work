<template>
    <f7-page>
        <f7-navbar title="选择科目" back-link></f7-navbar>

        <div class="p_content">
            <div>
                <div class="list-item" style="background: #f8f8f8;">
                    <label>搜索</label>
                    <input class="item-input"
                           type="text"
                           placeholder="搜索科目"
                           v-model="search" />
                </div>
            </div>

            <div class="layer">
                <div class="left" v-if="currentId !== '0'">
                    <ul>
                        <li v-for="(v, i) in subjectType"
                            :key="i"
                            @click="currentId = v._id"
                            :class="{active: v._id == currentId}">
                            {{v.name}}
                        </li>
                    </ul>
                </div>
                <div class="right">
                    <ul>
                        <li v-for="(v, i) in getSubjectList"
                             @click="go(v)"
                             :key="i">
                            <div class="li_t">
                                <span>{{v.code}}</span>
                                {{v.name}}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </f7-page>
</template>

<script>
import axios from 'axios'
export default {
    name: "index",
    props: ['accountSet', 'subjectList', 'go'],
    data () {
        return {
            currentId: 1,
            search: '',
            subjectType: [
                {
                    _id: 1,
                    name: '资产',
                    isEdit: false
                },
                {
                    _id: 2,
                    name: '负债',
                    isEdit: false
                },
                {
                    _id: 7,
                    name: '共同',
                    isEdit: false
                },
                {
                    _id: 3,
                    name: '权益',
                    isEdit: false
                },
                {
                    _id: 4,
                    name: '成本',
                    isEdit: false
                },
                {
                    _id: 5,
                    name: '损益',
                    isEdit: false
                },
                {
                    _id: 6,
                    name: '表外',
                    isEdit: false
                }
            ],
            groupList: []
        }
    },
    computed: {
        getSubjectList () {
            let list = this.subjectList.filter(f => !f.controlledSystem)
            list = list.filter(v => !this.subjectList.filter(f => f.pFirstId === v._id || f.pSecondId === v._id).length)
            if (this.search) {
                list = list.filter(v => v.code.includes(this.search) || v.name.includes(this.search))
                list = this.subjectList.filter(v => list.find(f => v._id === f._id || v.pFirstId === f._id || v.pSecondId === f._id))
            } else {
                let g = this.groupList.filter(v => v.type === this.currentId)
                list = list.filter(v => g.filter(i => v.typeId === i._id).length)
            }
            return list
        }
    },
    methods: {
        loadSubject () {
            axios.post(CONFIG.server.tradeApiUrl + 'subject/type/query', {
                accountSetId: this.accountSet._id
            }).then(res => {
                this.groupList = res.data
                $preloader.hide();
            }).catch(err => {
                $preloader.hide();
                $alert(err.message)
            })
        }
    },
    created() {
        $preloader.show();
        this.loadSubject()
    }
}
</script>

<style lang="scss" scoped>
    .list-item{
        background: #FFFFFF;
        /*width: 100%;*/
        height: 46px;
        font-size: 14px;
        line-height: 46px;
        border-bottom: 1px solid #f8f8f8;
        margin: 0;
        padding: 0 0 0 20px;
        display: flex;
        justify-content: space-between;
    }

    .list-type div{
        width: 50%;
        text-align: right;
        margin-right: 10px;
        color: darkgray;
    }
    .list-item .item-input{
        width: 50%;
        background:none;
        outline:none;
        border:0px;
        float: right;
        text-align: right;
        font-size: 14px;
        line-height: 46px;
        padding-right: 15px;
        box-sizing: border-box;
        color: #333;
    }

    .p_content {
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
                    display: flex;

                    span {
                        width: 120px;
                        display: block;
                    }
                }
            }
        }
    }
</style>
