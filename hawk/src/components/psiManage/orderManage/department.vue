<template>
    <f7-page>
        <f7-navbar title="部门统计" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="searchFun">筛选</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="pc_content">
            <ul class="d_list title">
                <li>总计</li>
                <li>订单总数</li>
                <li>销售总量</li>
            </ul>

            <ul class="d_list">
                <li>所有</li>
                <li>{{list.length}}</li>
                <li>{{getNumber('sales')}}</li>
            </ul>

            <ul class="d_list title">
                <li>员工名字</li>
                <li>订单总数</li>
                <li>销售总量</li>
            </ul>

            <ul class="d_list line" v-for="(v,i) in Array.from(employee)">
                <li>{{who(v) && who(v).name}}</li>
                <li>{{getNumber('order', v)}}</li>
                <li>{{getNumber('sales', v)}}</li>
            </ul>
        </div>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import axios from 'axios';
export default {
    name: "department",
    data () {
        return {
            list: [],
            employee: new Set(),
            filter: {
                orderType: '',
                startTime: '',
                endTime: '',
                creator: ''
            }
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
        searchFun () {
            this.$f7router.navigate('/psiManage/orderManage/search', {
                props: {
                    search: (val) => {
                        this.filter = {...val}
                        if (val.startTime) this.filter.startTime = new Date(val.startTime).toHawkDateString() + ' 00:00:00.000'
                        if (val.endTime) this.filter.endTime = new Date(val.endTime).toHawkDateString() + ' 23:59:59.999'
                        this.load();
                        this.$f7router.back();
                    }
                }
            })
        },
        getNumber (type, id) {
            let fList = this.list
            if (id) fList = this.list.filter(v => v.creator == id)
            if (type === 'order') {
                return fList.length
            } else {
                let number = 0
                fList.forEach(v => {
                    number += v.commodity.reduce((all, v) => all += parseInt(v.salesNumber || v.number), 0)
                })
                return number
            }
        },
        load () {
            this.filter.creator = this.pList.map(v => v._id)
            this.filter.status = "已审批"
            axios.post('api/orderManage/list', this.filter).then(res => {
                if (res.data && res.data.length) {
                    res.data.forEach(v => {
                        this.employee.add(v.creator)
                    })
                    this.list = res.data
                }
            }).catch(err => {
                console.error(err.message);
                $alert('查询订单数据失败')
            })
        }
    },
    created() {
        this.load()
    }
}
</script>

<style lang="scss" scoped>
.pc_content {
    height: 100%;
    background: #fff;

    .d_list {
        list-style: none;
        margin: 0;
        padding: 0 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 14px;
        color: #333;
        height: 40px;

        &.title {
            height: 35px;
            background: #F8F8F8;
        }

        li {
            width: 33.33%;
        }

        &.line {
            border-bottom: 1px solid #d8d8d8;
        }
    }
}
</style>
