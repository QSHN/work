<template>
    <f7-page class="select_commodity" @page:reinit="restLoad">
        <f7-navbar title="添加商品" back-link>
            <f7-nav-right v-if="inventoryType === '进货'">
                <f7-link href="#" @click="add">添加</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="p_content">
            <template v-if="!cId">
                <bar-code-search ref="barCodeSearch" :title="'搜索（商品名称）'" />

                <div class="select_group">
                    <f7-list class="select">
                        <f7-list-item title="品牌" smart-select :smart-select-params="{openIn: 'popover'}">
                            <select name="brand" v-model="brand">
                                <option v-for="(v, i) in brandList" :value="v" :selected="v == brand">{{v}}</option>
                            </select>
                        </f7-list-item>
                    </f7-list>

                    <f7-list class="select">
                        <f7-list-item title="标签" smart-select :smart-select-params="{openIn: 'popover'}">
                            <select name="label" v-model="label">
                                <option v-for="(v, i) in labelList" :value="v" :selected="v == label">{{v}}</option>
                            </select>
                        </f7-list-item>
                    </f7-list>
                </div>

                <div class="pc_layer">
                    <div class="left">
                        <ul>
                            <li v-for="(v, i) in Array.from(typeList)" :class="{active: v == selectType}" @click="selectType = v">{{v}}</li>
                        </ul>
                    </div>

                    <div class="right">
                        <div class="item" v-for="(v, i) in getList">
                            <div class="item_t" v-if="!isInventorySearch && !isInventoryCheck">
                                <div class="it_l">
                                    <div class="title">
                                        <div class="name">{{v.name}}</div>
                                        <span class="label" v-if="v.label">{{v.label}}</span>
                                    </div>
                                    <p>生产日期：{{v.produced && moment(v.produced).format('YYYY-MM-DD')}}</p>
                                    <p>保质期：{{v.expiration}} {{v.expiration && v.dateUnit}}</p>
                                    <p >

                                        <span v-if="inventoryType === '进货'">进货价：{{v.costPrice}} 元</span>
                                        <span v-else>单价：{{getPrice(v)}} 元</span>
                                        <span v-if="warehouse" style="margin-left: 20px">仓库数量：{{v.realNumber}} {{v.unit}}</span>
                                        <span v-if="cxInventory" style="margin-left: 20px">车载库存：{{v.realNumber}} {{v.unit}}</span>
                                    </p>
                                </div>
                                <div class="it_r" @click="selectChange(v)">
                                    <img v-if="!selected[v._id]" src="../../assets/images/btn_tick_empty_gray@2x.png"/>
                                    <img v-else src="../../assets/images/btn_tick_green@2x.png">
                                </div>
                            </div>

                            <div class="item_t" style="height: auto; padding: 15px 0"  v-else>
                                <div class="it_l">
                                    <div class="title">
                                        <div class="name">{{v.name}}</div>
                                        <span class="label" v-if="v.label">{{v.label}}</span>
                                    </div>
                                    <p>单价：{{getPrice(v)}} 元</p>
                                    <p>车上剩余库存： {{v.realNumber}} {{v.unit}}</p>
                                    <p>已售： {{v.salesNumber}} {{v.unit}}</p>
                                    <p>退货： {{v.returnNumber}} {{v.unit}}</p>
                                    <p>换货： {{v.swapNumber}} {{v.unit}}</p>
                                </div>
                                <div class="it_r" @click="selectChange(v)" v-if="isInventoryCheck" style="height: 100px">
                                    <img v-if="!selected[v._id]" src="../../assets/images/btn_tick_empty_gray@2x.png"/>
                                    <img v-else src="../../assets/images/btn_tick_green@2x.png">
                                </div>
                            </div>

                            <div class="item_form" v-if="selected[v._id] && !noForm">
                                <template v-if="cxInventory && !isInventoryCheck">
                                    <template v-if="!isCxReturn">
                                        <div class="number" style="height: 50px; line-height: 50px">
                                            销售单价：
                                            <input class="input" v-model="selected[v._id].salesPrice" />
                                            元 / {{v.unit}}
                                        </div>
                                        <div class="number" style="height: 50px; line-height: 50px">
                                            销售数量：
                                            <f7-stepper :min="0" :max="v.realNumber" :value="selected[v._id].salesNumber" @stepper:change="(val) => { selected[v._id].salesNumber = val }"></f7-stepper>
                                            {{v.unit}}
                                        </div>
                                        <div class="text">
                                            <div>销售备注</div>
                                            <textarea placeholder="请输入备注" v-model="selected[v._id].salesDes"></textarea>
                                        </div>
                                        <p class="line" style="height: 40px; line-height: 40px">总额： {{selected[v._id].salesPrice * selected[v._id].salesNumber}} 元</p>
                                        <div class="number" style="height: 50px; line-height: 50px">
                                            赠品数量：
                                            <f7-stepper :min="0" :max="v.realNumber" :value="selected[v._id].giveNumber" @stepper:change="(val) => { selected[v._id].giveNumber = val }"></f7-stepper>
                                            {{v.unit}}
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="number" style="height: 50px; line-height: 50px">
                                            退货单价：
                                            <input class="input" v-model="selected[v._id].returnPrice" />
                                            元 / {{v.unit}}
                                        </div>
                                        <div class="number" style="height: 50px; line-height: 50px">
                                            退货数量：
                                            <f7-stepper :min="0" :value="selected[v._id].returnNumber" @stepper:change="(val) => { selected[v._id].returnNumber = val }"></f7-stepper>
                                            {{v.unit}}
                                        </div>
                                        <div class="text">
                                            <div>退货备注</div>
                                            <textarea placeholder="请输入备注" v-model="selected[v._id].returnDes"></textarea>
                                        </div>
                                        <p class="line" style="height: 40px; line-height: 40px">总额： {{selected[v._id].returnPrice * selected[v._id].returnNumber}} 元</p>
                                        <div class="number line" style="height: 50px; line-height: 50px">
                                            换货数量：
                                            <f7-stepper :min="0" :max="v.realNumber" :value="selected[v._id].swapNumber" @stepper:change="(val) => { selected[v._id].swapNumber = val }"></f7-stepper>
                                            {{v.unit}}
                                        </div>
                                    </template>
                                </template>
                                <template v-else-if="isInventoryCheck">
                                    <div class="number">
                                        车载库存：
                                        <f7-stepper :min="0" :max="99999999" :value="selected[v._id].number" @stepper:change="(val) => { selected[v._id].number = val }"></f7-stepper>
                                        {{v.unit}}
                                    </div>
                                    <div class="text">
                                        <div>备注</div>
                                        <textarea placeholder="请输入备注" v-model="selected[v._id].des"></textarea>
                                    </div>
                                </template>
                                <template v-else-if="addPrice">
                                    <div class="number" style="height: 50px; line-height: 50px">
                                        单价：
                                        <input class="input" v-model="selected[v._id].price" />
                                        元 / {{v.unit}}
                                    </div>
                                    <div class="number" style="height: 50px; line-height: 50px">
                                        数量：
                                        <f7-stepper :min="0" :max="warehouse ? v.realNumber : 99999999" :value="selected[v._id].number" @stepper:change="(val) => { selected[v._id].number = val }"></f7-stepper>
                                        {{v.unit}}
                                    </div>
                                    <div v-if="isGive" class="number" style="height: 50px; line-height: 50px">
                                        赠品：
                                        <f7-stepper :min="0" :max="warehouse ? v.realNumber : 99999999" :value="selected[v._id].giveNumber" @stepper:change="(val) => { selected[v._id].giveNumber = val }"></f7-stepper>
                                        {{v.unit}}
                                    </div>
                                    <p class="line" style="height: 40px; line-height: 40px">总额： {{selected[v._id].price * selected[v._id].number}} 元</p>
                                </template>
                                <template v-else>
                                    <div v-if="inventoryType === '进货'" class="number" style="height: 50px; line-height: 50px">
                                        进货价：
                                        <input class="input" v-model="selected[v._id].price" />
                                        元 / {{v.unit}}
                                    </div>
                                    <div class="number line">
                                        数量：
                                        <f7-stepper :min="0" :max="warehouse && !inventoryType ? v.realNumber : 99999999" :value="selected[v._id].number" @stepper:change="(val) => { selected[v._id].number = val }"></f7-stepper>
                                        {{v.unit}}
                                    </div>
                                </template>
                                <template v-if="addInventory">
                                    <div class="number line">
                                        库存：
                                        <f7-stepper :min="0" :max="99999999" :value="selected[v._id].inventory" @stepper:change="(val) => { selected[v._id].inventory = val }"></f7-stepper>
                                        {{v.unit}}
                                    </div>
                                </template>
                                <div class="text" v-if="!cxInventory">
                                    <div>备注</div>
                                    <textarea placeholder="请输入备注" v-model="selected[v._id].des"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer" v-if="!isInventorySearch">
                    <p>已选商品 {{selectList.length}}</p>
                    <div class="btn" @click="sure">确定</div>
                </div>
            </template>
            <template v-else>
                <div class="pc_layer">
                    <div class="right">
                        <template v-for="(v, i) in selectList">
                            <div class="item" v-if="cId === v.commodity._id" style="border-bottom: none;">
                                <div class="item_t">
                                    <div class="it_l">
                                        <div class="title">
                                            <div class="name">{{v.commodity.name}}</div>
                                            <span class="label" v-if="v.commodity.label">{{v.commodity.label}}</span>
                                        </div>
                                        <p>生产日期：{{moment(v.produced).format('YYYY-MM-DD')}}</p>
                                        <p>保质期：{{v.expiration}} {{v.expiration && v.dateUnit}}</p>
                                        <p>
                                            <span v-if="inventoryType === '进货'">进货价：{{v.commodity.costPrice}} 元</span>
                                            <span v-else>单价：{{getPrice(v.commodity)}} 元</span>
                                            <span v-if="warehouse" style="margin-left: 20px">仓库数量：{{v.realNumber}} {{v.commodity.unit}}</span>
                                        </p>
                                    </div>
                                </div>

                                <div class="item_form">
                                    <template v-if="cxInventory && !isInventoryCheck">
                                        <template v-if="!isCxReturn">
                                            <div class="number" style="height: 50px; line-height: 50px">
                                                销售单价：
                                                <input class="input" v-model="v.salesPrice" />
                                                元 / {{v.commodity.unit}}
                                            </div>
                                            <div class="number" style="height: 50px; line-height: 50px">
                                                销售数量：
                                                <f7-stepper :min="0" :max="v.commodity.realNumber" :value="v.salesNumber" @stepper:change="(val) => { v.salesNumber = val }"></f7-stepper>
                                                {{v.commodity.unit}}
                                            </div>
                                            <div class="text">
                                                <div>销售备注</div>
                                                <textarea placeholder="请输入备注" v-model="v.salesDes"></textarea>
                                            </div>
                                            <p class="line" style="height: 40px; line-height: 40px">总额： {{v.salesPrice * v.salesNumber}} 元</p>
                                            <div class="number" style="height: 50px; line-height: 50px">
                                                赠品数量：
                                                <f7-stepper :min="0" :max="v.commodity.realNumber" :value="v.giveNumber" @stepper:change="(val) => { v.giveNumber = val }"></f7-stepper>
                                                {{v.commodity.unit}}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="number" style="height: 50px; line-height: 50px">
                                                退货单价：
                                                <input class="input" v-model="v.returnPrice" />
                                                元 / {{v.commodity.unit}}
                                            </div>
                                            <div class="number" style="height: 50px; line-height: 50px">
                                                退货数量：
                                                <f7-stepper :min="0" :value="v.returnNumber" @stepper:change="(val) => { v.returnNumber = val }"></f7-stepper>
                                                {{v.commodity.unit}}
                                            </div>
                                            <div class="text">
                                                <div>退货备注</div>
                                                <textarea placeholder="请输入备注" v-model="v.returnDes"></textarea>
                                            </div>
                                            <p class="line" style="height: 40px; line-height: 40px">总额： {{v.returnPrice * v.returnNumber}} 元</p>
                                            <div class="number line" style="height: 50px; line-height: 50px">
                                                换货数量：
                                                <f7-stepper :min="0" :max="v.commodity.realNumber" :value="v.swapNumber" @stepper:change="(val) => { v.swapNumber = val }"></f7-stepper>
                                                {{v.commodity.unit}}
                                            </div>
                                        </template>
                                    </template>
                                    <template v-else-if="isInventoryCheck">
                                        <div class="number">
                                            {{isInventoryBack ? '归还：' : '车载库存：'}}
                                            <f7-stepper :min="0" :max="backNumber >= 0 ? backNumber : 99999999" :value="v.number" @stepper:change="(val) => { v.number = val }"></f7-stepper>
                                            {{v.commodity.unit}}
                                        </div>
                                        <div class="text">
                                            <div>备注</div>
                                            <textarea placeholder="请输入备注" v-model="v.des"></textarea>
                                        </div>
                                    </template>
                                    <template v-else-if="addPrice">
                                        <div class="number" style="height: 50px; line-height: 50px">
                                            单价：
                                            <input class="input" v-model="v.price" />
                                            元 / {{v.commodity.unit}}
                                        </div>
                                        <div class="number" style="height: 50px; line-height: 50px">
                                            数量：
                                            <f7-stepper :min="0" :max="warehouse ? v.realNumber : 99999999" :value="v.number" @stepper:change="(val) => { v.number = val }"></f7-stepper>
                                            {{v.commodity.unit}}
                                        </div>
                                        <div v-if="isGive" class="number" style="height: 50px; line-height: 50px">
                                            赠品：
                                            <f7-stepper :min="0" :max="warehouse ? v.realNumber : 99999999" :value="v.giveNumber" @stepper:change="(val) => { v.giveNumber = val }"></f7-stepper>
                                            {{v.unit}}
                                        </div>
                                        <p class="line" style="height: 40px; line-height: 40px">总额： {{v.price * v.number}} 元</p>
                                    </template>
                                    <template v-else>
                                        <div v-if="inventoryType === '进货'" class="number" style="height: 50px; line-height: 50px">
                                            进货价：
                                            <input class="input" v-model="v.price" />
                                            元 / {{v.commodity.unit}}
                                        </div>
                                        <div class="number line">
                                            数量：
                                            <f7-stepper :min="0" :max="warehouse && !inventoryType ? v.realNumber : 99999999" :value="v.number" @stepper:change="(val) => { v.number = val }"></f7-stepper>
                                            {{v.commodity.unit}}
                                        </div>
                                    </template>
                                    <template v-if="addInventory">
                                        <div class="number line">
                                            库存：
                                            <f7-stepper :min="0" :max="99999999" :value="v.inventory" @stepper:change="(val) => { v.inventory = val }"></f7-stepper>
                                            {{v.commodity.unit}}
                                        </div>
                                    </template>
                                    <div class="text" v-if="!cxInventory">
                                        <div>备注</div>
                                        <textarea placeholder="请输入备注" v-model="v.des"></textarea>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

                <div class="submit-button" @click="sure">提交</div>
            </template>
        </div>
    </f7-page>
</template>

<script>
import barCodeSearch from './barcodesearch'
import axios from 'axios'
import moment from 'moment'
export default {
    name: "selectCommodity",
    components: {
        barCodeSearch
    },
    props: {
        cId: {
            type: String,
            required: true
        },
        commodity: {
            type: Array,
            required: true
        },
        choose: {
            type: Function,
            required: true
        },
        clientGrade: {
            type: String,
            default: ''
        },
        noForm: {
            type: Boolean,
            required: false
        },
        addPrice: {
            type: Boolean,
            default: false
        },
        addInventory: {
            type: Boolean,
            default: false
        },
        inventoryType: {
            type: String,
            default: ''
        },
        warehouse: {
            type: Object,
            default: null
        },
        isGive: {
            type: Boolean,
            default: false
        },
        isInventorySearch: {
            type: Boolean,
            default: false
        },
        cxInventory: {
            type: Object,
            default: null
        },
        isCxReturn: {
            type: Boolean,
            default: false
        },
        isInventoryCheck: {
            type: Boolean,
            default: false
        },
        isInventoryBack: {
            type: Boolean,
            default: false
        },
        backNumber: {
            type: Number,
            default: null
        }
    },
    data () {
        return {
            list: [],
            typeList: new Set(),
            labelList: [],
            brandList: [],
            label: '全部',
            brand: '全部',
            selected: {},
            selectList: [],
            selectType: '全部'
        }
    },
    computed: {
        getList () {
            let list = this.list
            let search = this.$refs.barCodeSearch && this.$refs.barCodeSearch.search || ''
            if (search) {
                list = list.filter(v => v.name.includes(search) || v.barCode.includes(search))
            }
            if (this.label !== '全部') {
                list = list.filter(v => v.label === this.label)
            }
            if (this.brand !== '全部') {
                list = list.filter(v => v.brand === this.brand)
            }
            if (this.selectType !== '全部') {
                list = list.filter(v => v.type === this.selectType)
            }
            return list
        }
    },
    watch: {
        selected: {
            deep: true,
            handler: function (val, oldVal) {
                this.selectList = []
                for(let key in this.selected) {
                    this.selectList.push(this.selected[key])
                }
            }
        }
    },
    methods: {
        moment,
        add () {
            this.$f7router.navigate('/psiManage/commodityManage/update')
        },
        selectChange (v) {
            if (this.selected[v._id]) {
                delete this.selected[v._id]
                this.selectList = []
                for(let key in this.selected) {
                    this.selectList.push(this.selected[key])
                }
            } else if (this.cxInventory && !this.isInventoryCheck) {
                let obj = {
                    commodity: v,
                    salesPrice: this.getPrice(v),
                    returnPrice: this.getPrice(v),
                    salesNumber: 0,
                    returnNumber: 0,
                    swapNumber: 0,
                    giveNumber: 0,
                    salesDes: '',
                    returnDes: '',
                    realNumber: v.realNumber
                }
                this.$set(this.selected, v._id, obj)
            } else {
                let obj = this.noForm ? v : {
                    commodity: v,
                    price: this.inventoryType === '进货' ? v.costPrice : this.getPrice(v),
                    number: 0,
                    des: '',
                    realNumber: v.realNumber
                }
                if (this.addInventory) obj.inventory = v.inventory || 0
                if (this.isGive) obj.giveNumber = 0
                this.$set(this.selected, v._id, obj)
            }
            this.$forceUpdate()
            console.log('selected', this.selected)
        },
        getPrice (val) {
            let price = ''
            if (val.classPrice.length) {
                val.classPrice.forEach(v => {
                    if (v.type == this.clientGrade) price = v.price
                })
            }
            return price || val.price
        },
        load () {
            $preloader.show()
            axios.get('api/commodity/').then(res => {
                if (res.data) {
                    if (this.inventoryType) {
                        this.list = res.data
                    } else {
                        this.list = res.data.filter(v => v.status)
                    }
                    this.typeList.add('全部')
                    this.list.forEach(v => {
                        if (this.warehouse) {
                            v.realNumber = 0
                            this.warehouse.commodity.forEach(item => {
                                if (item.commodity._id === v._id) v.realNumber = parseInt(item.realNumber)
                            })
                        }
                        this.typeList.add(v.type);
                    })
                    this.$forceUpdate()
                }
                $preloader.hide()
            }).catch(err => {
                $preloader.hide()
                console.error(err.message)
                $alert('无法获取商品列表')
            })
        },
        sure () {
            // console.log(this.selectList)
            if (this.selectList.filter(v => !v.number).length && !this.noForm && !this.cxInventory) {
                $alert('请检查选择添加的商品的数量是否正确')
            } else if (this.isGive && this.selectList.filter(v => v.number + v.giveNumber > v.realNumber).length) {
                $alert('请检查, 选择添加的商品的数量加赠品数量已大于库存')
            } else if (this.cxInventory && this.selectList.filter(v => !v.salesNumber).length && !this.noForm && !this.isCxReturn && !this.isInventoryCheck && !this.isInventoryBack) {
                $alert('请检查选择添加的商品的数量是否正确')
            } else if (this.cxInventory && this.selectList.filter(v => v.salesNumber + v.giveNumber > v.realNumber).length && !this.isCxReturn && !this.isInventoryCheck && !this.isInventoryBack) {
                $alert('请检查, 选择添加的商品的数量加赠品数量已大于库存')
            } else if (this.isCxReturn && this.selectList.filter(v => !v.swapNumber && !v.returnNumber).length && !this.noForm) {
                $alert('请检查选择添加的商品的数量是否正确')
            } else if (this.isCxReturn && this.selectList.filter(v => v.swapNumber > v.realNumber).length) {
                $alert('换货数量大于库存，无法换货')
            } else if (this.isInventoryBack && this.selectList.filter(v => !v.number).length) {
                $alert('请检查选择添加的商品归还数量是否正确')
            } else if (this.inventoryType === '进货' && this.selectList.filter(v => !(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(v.price))).length) {
                $alert('请检查进货价是否输入正确')
            } else {
                this.choose(this.selectList)
            }
        },
        getInventoryList () {
            this.list = []
            this.typeList.add('全部')
            let iList = this.cxInventory && this.cxInventory.commodity || this.commodity
            iList.forEach(v => {
                let obj = v.commodity
                obj.realNumber = v.realNumber
                obj.salesNumber = v.salesNumber
                obj.returnNumber = v.returnNumber
                obj.swapNumber = v.swapNumber
                this.list.push(obj)
                this.typeList.add(obj.type);
            })
        },
        restLoad () {
            this.load()
            axios.get(`api/commodity/brand`).then(res => {
                if (res.data) {
                    this.brandList = res.data.brand
                    this.brandList.unshift('全部')
                }
            }).catch(err => {
                console.error(err.message)
                $alert('无法获取品牌列表')
            })
            axios.get(`api/commodity/label`).then(res => {
                if (res.data) {
                    this.labelList = res.data.label
                    this.labelList.unshift('全部')
                }
            }).catch(err => {
                console.error(err.message)
                $alert('无法获取标签列表')
            })
        }
    },
    created() {
        if (!this.isInventorySearch) {
            if (!this.cId) {
                if (this.cxInventory) {
                    this.getInventoryList()
                } else {
                    this.load()
                }
            }
            if (this.commodity.length) {
                this.selectList = this.commodity
            } else {
                if (this.warehouse && this.warehouse.commodity.length && this.inventoryType === '全部盘点') {
                    this.selectList = this.warehouse.commodity
                }
            }
            this.selectList.forEach(v => {
                let obj = v
                if (obj.number) obj.number = parseInt(obj.number)
                this.selected[v.commodity._id] = obj
            })
        } else {
            this.getInventoryList()
        }

        axios.get(`api/commodity/brand`).then(res => {
            if (res.data) {
                this.brandList = res.data.brand
                this.brandList.unshift('全部')
            }
        }).catch(err => {
            console.error(err.message)
            $alert('无法获取品牌列表')
        })
        axios.get(`api/commodity/label`).then(res => {
            if (res.data) {
                this.labelList = res.data.label
                this.labelList.unshift('全部')
            }
        }).catch(err => {
            console.error(err.message)
            $alert('无法获取标签列表')
        })
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
        flex-direction: row;
        flex-grow: 1;
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .left {
        width: 80px;
        background: #F8F8F8;
        overflow: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;

        .back, li {
            height: 45px;
            line-height: 45px;
            text-align: center;
            font-size: 14px;
            color: #fff;
        }

        li {
            padding: 0 10px;
            height: 44px;
            line-height: 44px;
            border-bottom: 1px solid #D8D8D8;
            color: #666;
            background: none;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;/*文本不换行*/

            &.active {
                background: #fff;
            }
        }
    }

    .right {
        padding: 0 10px;
        flex-grow: 1;
        background: #fff;
        overflow: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;

        .item {
            border-bottom: 1px solid #D8D8D8;

            .item_t {
                height: 90px;
                overflow: hidden;
                display: flex;
                flex-direction: row;
                align-items: center;

                .it_l {
                    margin-right: 20px;
                    flex-grow: 1;

                    .title {
                        display: flex;
                        flex-direction: row;
                        align-items: center;

                        .name {
                            font-size: 14px;
                            line-height: 14px;
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
                        font-size: 12px;
                        line-height: 12px;
                        margin: 5px 0 0;
                        color: #999;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }

                .it_r {
                    margin-right: 15px;

                    img {
                        width: 20px;
                        height: 20px;
                    }
                }
            }

            .item_form {
                padding: 0 10px;
                background: #F8F8F8;
                margin-bottom: 10px;
                font-size: 14px;
                color: #999;
                overflow: hidden;

                .number {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    height: 60px;

                    .stepper {
                        margin: 0 10px 0 5px;
                    }

                    .input {
                        width: 100px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        font-size: 14px;
                        background: #fff;
                        border: 1px solid #D8D8D8;
                        margin: 0 10px 0 5px;
                    }
                }

                p { margin: 0; }

                .line {   border-bottom: 1px solid #D8D8D8; }

                .text {
                    div {
                        height: 34px;
                        line-height: 34px;
                    }

                    textarea {
                        border-radius: 5px;
                        border: 1px solid #D5D5D5;
                        background: #fff;
                        margin-bottom: 10px;
                        display: table-cell;
                        padding: 3px 10px;
                        width: 100%;
                        min-height: 50px;
                        line-height: 20px;
                    }
                }
            }
        }
    }

    .footer {
        height: 45px;
        min-height: 45px;
        font-size: 16px;
        color: #333333;
        text-align: center;
        box-shadow: 0 0 5px rgba(0, 0, 0, .15);
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 15px;

        p {
            flex-grow: 1;
            text-align: left;
            margin: 0;
        }

        .btn {
            width: 80px;
            height: 36px;
            line-height: 36px;
            background: #3385FF;
            color: #fff;
        }
    }

    .select_group {
        height: 44px;
        background: #fff;
        display: flex;
        flex-direction: row;


        .select {
            width: 50%;
            list-style: none;
            text-align: center;
            margin: 0;

            &:nth-child(1) {
                border-right: 1px solid #D8D8D8;
            }
        }
    }

    .submit-button{
        width:100%;
        height:45px;
        min-height: 45px;
        line-height: 45px;
        font-size:16px;
        color: #FFFFFF;
        text-align: center;
        background:#3385FF;
    }
}
</style>
