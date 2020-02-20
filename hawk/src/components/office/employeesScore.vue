<template>
    <f7-page @page:beforein="loadGrade">
        <f7-navbar>
            <f7-nav-left>
                <f7-link icon-only @click="back">
                    <i class="icon icon-back"></i>
                </f7-link>
            </f7-nav-left>
            <f7-nav-title>员工评分</f7-nav-title>
            <f7-nav-right v-if="parentDepartmentId">
                <f7-link v-if="superAdmin._id !== myProfile._id" @click="selectorPersonnelShow=true">
                    其它员工
                </f7-link>
            </f7-nav-right>
        </f7-navbar>

        <template v-if="!selectId">
            <div class="other_btn" @click="selectorPersonnelShow=true">
                <span style="flex: 1;">查看其它员工评分</span>
                <img :src="arrowRight">
            </div>
            <div class="list_title">直属员工列表</div>
            <f7-list class="p-list">
                <f7-list-item
                        v-for = "(p, index) in userList"
                        :key = "index"
                        @click="toggle_employee(p._id)">
                    <div class="task-contact-list" >
                        <img class="avatar" :src="who(p._id) && who(p._id).avatarUrl || avatar">
                        <div class="info">
                            <p class="name">{{p.name}}</p>
                            <p class="depart">{{ (p._id && userDepartmentName(p._id) || '') + ' ' + (p.job || '') }}</p>
                        </div>

                        <div class="contact-btn">
                            查看
                        </div>
                    </div>
                </f7-list-item>
            </f7-list>
        </template>

        <template v-else>
            <div class="p_l">
                <div class="p_c">
                    <f7-list style="background-color: white; margin: 0px;" v-if="filter">
                        <f7-list-item>
                            <div class="ts_con clearfix">
                                <div class="ts">
                                    <div>{{who(selectId).name}}</div>
                                    <div>绩效考核总分：<span class="score">{{score}}</span><span>（初始分{{initScore}}）</span></div>
                                </div>
                                <div class="asp">
                                    <div @click="openPicker()">{{filter.from.getFullYear()}}年{{filter.from.getMonth()+1}}月评分
                                    </div>
                                </div>
                                <p @click="goscore">详情</p>
                            </div>
                        </f7-list-item>
                    </f7-list>

                    <div style="line-height: 45px; font-size: 16px; padding-left: 10px; overflow: hidden">
                        绩效报告：
                    </div>
                    <div style="overflow-x: hidden;">
                        <div class="list-item-content">
                            <label>本月工作内容：</label>
                            <div>{{performance.lastContent}}</div>
                        </div>

                        <div class="list-item-content">
                            <label>本月完成情况：</label>
                            <div>{{performance.lastSchedule}}</div>
                        </div>

                        <div class="list-item  list-type">
                            <label>完成率：</label>
                            <span>{{performance.finishing}}</span>
                        </div>

                        <div class="list-item-content">
                            <label>本月工作自评：</label>
                            <div>{{performance.selfAssessment}}</div>
                        </div>

                        <div class="list-item-content">
                            <label>下月工作目标：</label>
                            <div>{{performance.content}}</div>
                        </div>

                        <div class="list-item-content">
                            <label>下月工作计划：</label>
                            <div>{{performance.plan}}</div>
                        </div>

                        <div class="list-item  list-type">
                            <label>审批状态：</label>
                            <span>{{performance.status}}</span>
                        </div>

                        <div class="list-item  list-type" v-if="performance.comment">
                            <label>拒绝理由：</label>
                            <span>{{performance.comment}}</span>
                        </div>

                        <div class="list-item  list-type">
                            <label>审批人：</label>
                            <span>{{who(performance.approver) && who(performance.approver).name}}</span>
                        </div>
                    </div>

                    <template v-if="employeesscore && employeesscore.leader.length">
                        <div style="line-height: 45px; font-size: 16px; padding-left: 10px; overflow: hidden">
                            上级评分：
                        </div>
                        <template v-for="(v, i) in employeesscore.leader">
                            <div class="list-item-content">
                                <label>{{who(v.leaderId) && who(v.leaderId).name}}评分：</label>
                                <div>{{v.leaderScore}}</div>
                            </div>
                            <div class="list-item-content">
                                <label>{{who(v.leaderId) && who(v.leaderId).name}}评语：</label>
                                <div>{{v.leaderComment}}</div>
                            </div>
                        </template>
                    </template>

                    <template v-if="employeesscore && employeesscore.score">
                        <div style="line-height: 45px; font-size: 16px; padding-left: 10px; overflow: hidden">
                            最终评分：
                        </div>
                        <div class="list-item-content">
                            <label>Boss评分：</label>
                            <div>{{employeesscore.score}}</div>
                        </div>
                        <div class="list-item-content">
                            <label>Boss评语：</label>
                            <div>{{employeesscore.comment}}</div>
                        </div>
                    </template>
                </div>

                <div class="submit-button" v-if="selectId !== myUserId" v-show="canGrade" @click="grade">评分</div>
            </div>
        </template>

        <f7-popup :opened="selectorPersonnelShow" @popup:close="selectorPersonnelShow = false">
            <employeepicker
                    :multiple="false"
                    :parentDepartmentId="parentDepartmentId"
                    :showSuperAdmin="false"
                    :hideSameLevel="true"
                    @employee:selected="onSelectorPersonne"
                    @employee:cancel="selectorPersonnelShow = false"
            ></employeepicker>
        </f7-popup>
    </f7-page>
</template>

<style lang="scss" scoped>
    .p_l {
        height: 100%;
        display: flex;
        flex-direction: column;

        .p_c {
            flex-grow: 1;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
        }
    }
    .other_btn {
        height: 45px;
        line-height: 45px;
        background: #fff;
        font-size: 14px;
        color: #333;
        margin-top: 10px;
        padding: 0 15px;
        display: flex;
        align-items: center;

        img {
            width: 6px;
            height: 12px;
            display: block;
        }
    }

    .list_title {
        height: 30px;
        line-height: 30px;
        padding-left: 15px;
        background: #f8f8f8;
        font-size: 12px;
        color: #666;
    }

    .p-list {
        margin-top: 0;
    }

    .task-contact-list {
        width: 100%;
        height: 48px;
        display: flex;
        align-items: center;
        overflow: hidden;

        .avatar {
            width: 35px;
            height: 35px;
            margin-right: 10px;
            display: block;
        }

        .info {
            flex: 1;
        }

        .name {
            max-width: 100px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            margin: 0;
            font-size: 16px;
            color: #333;
        }

        .depart {
            margin: 0;
            font-size: 13px;
            color: #666;
        }

        .contact-btn {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #3385FF;
            margin-left: 20px;
        }
    }
    .ts_con {
        width: 100%;

        p {
            text-align: right;
            margin: 0;
            font-size: 14px;
            color: #3385FF;
        }
    }

    .ts {
        text-align: left;
        /*width: 240px;*/
        margin-top: 20px;
        margin-left: 10px;
    }

    .ts > div:first-child {
        font-size: 22px;
    }

    .ts > div {
        font-size: 18px;
        line-height: inherit;
    }

    .score {
        font-size: 24px !important;
    }

    .ts > div > span {
        font-size: 14px;
        color: #616161;
    }

    .asp {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #3385FF;
        border-radius: 12px;
        padding: 2px 8px;
    }

    .asp > div {
        font-size: 14px;
        color: white;
    }
    .list-item{
        background: #FFFFFF;
        width: 100%;
        height: 46px;
        font-size: 14px;
        line-height: 46px;
        border-bottom: 1px solid #f8f8f8;

    }
    .list-type {

        background: white;
        line-height: 45px;
        font-size: 14px;
    }

    .list-type label{

        float: left;
        margin-left: 15px;
        display: inline-block;
        color: #666666;
        font-size: 14px;
    }

    .list-type span {

        float: right;
        margin-right: 15px;
        display: inline-block;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
    }

    .list-item-content{

        background: #FFFFFF;
        border-bottom: 1px solid #f8f8f8;
    }

    .list-item-content label{

        display: inline-block;
        margin-top: 10px;
        margin-left: 15px;
        color: #666666;
        font-size: 14px;
    }

    .list-item-content div{

        margin-left: 15px;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-right: 15px;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
    }

    .image-top{

        margin-top: 0px;
        min-height: 50px;
        background: #FFFFFF;
        margin-bottom: 30px;
    }

    .imagetite {

        color: #666666;
        width: 100%;
        margin-top: 10px;
        height: 20px;
        display: inline-block;
        margin-left: 15px;
        margin-bottom: 8px;
        font-size: 14px;
    }

    .imgDiv{

        display: inline-block;
        margin-left: 15px;
        margin-bottom: 10px;
    }

    .submit-button{
        width:100%;
        height:45px;
        line-height: 45px;
        font-size:16px;
        color: #FFFFFF;
        text-align: center;
        background:#3385FF;
    }

    .expense-list {
        width: 100%;
        margin-top: 10px;
    }

    .expense-left {
        display: inline-block;
        width: 15%;

        margin-bottom: 15px;
    }

    .expense-left-icon {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-color: #2196F3;
        margin: 0px auto;
        overflow: hidden;
    }

    .expense-left-icon > img {
        width: 100%;
        height: 100%;
    }

    .expense-right {

        float: right;
        width: 85%;
    }
</style>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import employeepicker from 'gadget/employeepicker.vue';
    import axios from 'axios';
    const hp_default_96 = require("assets/images/hp_default_96@2x.png");
    export default {
        components: {
            employeepicker
        },
        props: [
            'which',
            'uId' // 用于查看其他员工
        ],
        data() {
            return {
                avatar: require('assets/images/hp_default_70@2x.png'),
                arrowRight: require('assets/images/arrow_right_gray@2x.png'),
                userList: [],
                parentDepartmentId: null,
                selectorPersonnelShow: false,
                selectId: null,
                score: 0,
                initScore: 0,
                filter: null,
                tmp_filter: {},
                performance: {},
                gradeData: null,
                employeesscore: null,
                hp_default_96
            }
        },
        computed: {
            ...mapGetters([
                'myProfile',
                'userDepartmentName',
                'adminDepartment',
                'who',
                'superAdmin',
                'isDepartmentAdmin',
                'myUserId',
                'userDepartment',
                'getSuperiorAdmin'
            ]),
            canGrade () {
                let bool = false
                if (!this.employeesscore) {
                    bool = true
                } else {
                    if (!this.employeesscore.score) {
                        if (this.superAdmin._id === this.myProfile._id) {
                            bool = true
                        } else {
                            if (this.employeesscore.leader.filter(v => v.leaderId === this.myUserId).length === 0) {
                                bool = true
                            }
                        }
                    }
                }
                return bool
            }
        },
        watch: {
            selectId () {
                if (this.selectId) {
                    this.filter = {
                        user: this.selectId,
                        from: this.getNowFilter().from,
                        to: this.getNowFilter().to
                    }
                    this.loadscore(this.filter)
                }
            }
        },
        created() {
            if (this.superAdmin._id === this.myProfile._id) {
                this.load();
            } else {
                if (this.isDepartmentAdmin(this.myProfile._id)) {
                    let myDepartment = this.adminDepartment(this.myProfile._id)
                    this.parentDepartmentId = myDepartment ? myDepartment.departmentId : null
                }
                this.selectId = this.myProfile._id
            }
            if (this.which === 'selectorPersonnelShow') {
                this.$nextTick(() => {
                    this.selectorPersonnelShow = true
                })
            }
        },
        methods: {
            getNowFilter(nowDate) {
                let now = nowDate || new Date()
                let year = now.getFullYear()
                let month = now.getMonth()
                let date = new Date(year, month + 1, 0).getDate();
                let from = new Date(year, month, 1)
                let to = new Date(year, month, date)
                return {from, to}
            },
            loadscore (filter) {
                $preloader.show();
                axios.get('/api/user/getSalary/' + filter.user).then(res => {
                    this.initScore = res.data && res.data.salary && parseInt(res.data.salary) || 0
                    axios.get('api/score?q=' + JSON.stringify(filter)).then(res => {
                        $preloader.hide();     let score = this.initScore
                        if (res.data) {
                            res.data.forEach(v => {
                                if (v.rule.valueType === 'add') {
                                    score += v.score
                                } else {
                                    score -= v.score
                                }
                            })
                        }
                        this.score = score
                        $preloader.hide();
                    }).catch(err => {
                        $preloader.hide();
                        console.error(err);
                        $alert('无法更新数据，请稍后再试', '操作错误');
                    })
                }).catch(err => {
                    $alert('无法获取总分', '操作错误');
                })
                axios.get('/api/performance/?creator=' + filter.user + '&time=' + JSON.stringify({
                    from: filter.from.toHawkDateString(),
                    to: filter.to.toHawkDateString()
                })).then(res => {
                    if (res.data && res.data.length) {
                        this.performance = res.data[0]
                    } else {
                        this.performance = {}
                    }
                    $preloader.hide();
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
                this.loadGrade()
            },
            load(){
                let self=this;
                $preloader.show();
                axios.get('api/user/getDirectlyUsers').then(resp => {
                    self.userList = resp.data;
                    $preloader.hide();
                });
            },
            onSelectorPersonne(uIds) {
                this.selectorPersonnelShow = false;
                if (uIds.length) {
                    this.selectId = uIds[0]
                }
            },
            toggle_employee(uid) {
                this.onSelectorPersonne([uid]);
            },
            openPicker() {
                function getYear(tip) {
                    let arr = []
                    let year = new Date().getFullYear()
                    let index = year - 10
                    for (index; index <= year; index++) {
                        arr.push(tip ? (index + tip) : index);
                    }
                    return arr
                }

                let picker = this.$f7.picker.create({
                    inputEl: '#picker-device',
                    toolbarCloseText: '完成',
                    // rotateEffect: true,
                    value: [this.filter.from.getFullYear(), this.filter.from.getMonth() + 1],
                    cols: [
                        {
                            textAlign: 'left',
                            values: getYear(),
                            displayValues: getYear("年")
                        },
                        {
                            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                            displayValues: ('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月').split(' ')
                        },
                    ],
                    on: {
                        change: (picker, values, displayValues) => {
                            let date = new Date()
                            date.setFullYear(values[0])
                            date.setMonth(values[1] - 1)
                            let filter = this.getNowFilter(date)
                            this.tmp_filter = filter
                        },
                        close: (picker) => {
                            this.filter.from = this.tmp_filter.from
                            this.filter.to = this.tmp_filter.to
                            this.loadscore(this.filter)
                        }
                    }
                });
                picker.open();
            },
            goscore () {
                this.$f7router.navigate('/office/scorepersonal/', {
                    props: {
                        lastPage: '员工管理',
                        uId: this.selectId
                    }
                });
            },
            back () {
                if (this.selectId && this.superAdmin._id === this.myProfile._id) {
                    this.selectId = null
                    this.performance = {}
                } else {
                    this.$f7router.back()
                }
            },

            grade () {
                if (this.performance._id) {
                    if (this.performance.status === '待审批') {
                        $confirm('该员工的绩效报告还没审批，是否提醒审批员', () => {
                            axios.post('/api/notification/pushMsg', {
                                userId: this.performance.approver,
                                category: '绩效报告',
                                content: `${this.performance.approver === this.myProfile._id || this.superAdmin._id === this.myProfile._id ? '' : '您的上级提示你，'}您还有未审批的绩效报告`,
                                title: "绩效报告",
                                applyId: this.performance._id
                            })
                        })
                    } else if (this.performance.status === '被驳回') {
                        $confirm('该员工的绩效报告被驳回，是否提醒该员工重新提交', () => {
                            axios.post('/api/notification/pushMsg', {
                                userId: this.selectId,
                                category: '绩效报告',
                                content: '您的上级提示你，您的绩效报告已被驳回，请尽快重新提交',
                                title: "绩效报告"
                            })
                        })
                    } else if (this.superAdmin._id === this.myUserId &&
                        this.userList.filter(v => v._id === this.selectId).length === 0 &&
                        ((this.employeesscore && this.employeesscore.leader.length === 0) || !this.employeesscore)) {
                        $confirm('是否通知该员工上级进行绩效评分', () => {
                            let admin = this.getSuperiorAdmin(this.selectId);
                            admin.forEach(v => {
                                if (v !== this.superAdmin._id) {
                                    axios.post('/api/notification/pushMsg', {
                                        userId: v,
                                        category: '员工评分',
                                        content: `您的上级提示你，请尽快对您的下属${this.who(this.selectId).name}进行绩效评分`,
                                        title: "员工评分"
                                    })
                                }
                            })
                        })
                    } else {
                        this.$f7router.navigate('/office/employeesScore/reply', {
                            props: {
                                detail: this.gradeData,
                                selectId: this.selectId,
                                time: this.filter.from.getFullYear() + '-' + (this.filter.from.getMonth() + 1)
                            }
                        })
                    }
                } else {
                    $confirm('该员工还没有提交绩效报告，是否提醒', () => {
                        axios.post('/api/notification/pushMsg', {
                            userId: this.selectId,
                            category: '绩效报告',
                            content: '您的上级提示你，请尽快提交绩效报告',
                            title: "绩效报告"
                        })
                    })
                }
            },

            loadGrade () {
                if (this.filter) {
                    axios.get('/api/employeesScore/?uId=' + this.filter.user).then(res => {
                        this.gradeData = res.data
                        this.employeesscore = null
                        if (res.data) {
                            res.data.score.forEach(v => {
                                if (v.time === (this.filter.from.getFullYear() + '-' + (this.filter.from.getMonth() + 1))) {
                                    this.employeesscore = v
                                }
                            })
                        }
                    }).catch(err => {
                        console.error(err);
                        $alert('无法获取评分数据');
                    });
                }
            }
        }
    }
</script>
