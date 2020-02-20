<template>
  <div>
    <Row justify="space-between"
         type="flex"
         class="pannels">
      <Col class="left-pannel"
           span="12">
      <div class="search-bar">
        <Input prefix="md-contact"
               search
               v-model="search"
               :clearable="true"
               placeholder="搜索姓名/部门/职位" />
      </div>
      <div class="pick-list">
        <Row v-for="(item, idx) in filterList"
             :key="idx"
             @click.native="pick(item)"
             type="flex"
             align="middle"
             class-name="pick-one">
          <Col class="avatar"
               span="3">
          <Avatar icon="ios-person"
                  shape="square"
                  size="large" />
          </Col>
          <Col span="14">
          <div class="friend-name"
               v-text="item.name"></div>
          </Col>
          <Col span="2">
          <Icon :type="item.checked ? 'ios-checkmark-circle' : 'ios-radio-button-off'"
                :color="item.checked ? '#19be6b' : '#999' "
                size="22"
                class="clicker" />
          </Col>
        </Row>
      </div>
      </Col>
      <Col class="right-pannel"
           span="12">

      <div class="delete-list">
        <Row v-for="(item, idx) in deleteList"
             :key="idx"
             @click.native="cancle(item)"
             type="flex"
             align="middle"
             class-name="delete-one">
          <Col class="avatar"
               span="3">
          <Avatar icon="ios-person"
                  shape="square"
                  size="large" />
          </Col>
          <Col span="14">
          <div class="friend-name"
               v-text="item.name"></div>
          </Col>
          <Col span="2">
          <Icon type="ios-close-circle"
                color="#aaa"
                size="22"
                class="clicker" />
          </Col>
        </Row>
      </div>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    'currentList': {
      type: Array,
      default: () => []
    },
    'idKey': {
      type: String,
      required: true
    },
    'showPicker': {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      // 搜索内容
      search: '',
      // 可选列表
      pickList: [],
      // 可删列表
      deleteList: [],
      // 用于删除列表显示内容
      deleteIds: new Set()
    }
  },
  watch: {
    currentList () {
      this.init()
    },
    showPicker (val) {
      // 重新打卡对话框时应当再初始化
      if (val) return this.init()
      this.$emit('pickList', this.pickList.filter(p => p.checked), this.idKey)
    }
  },
  computed: {
    // 当前显示
    filterList () {
      return this.pickList.filter(p => {
        // debugger
        return (p.name && p.name.indexOf(this.search) >= 0) ||
          (p.departmentName && p.departmentName.indexOf(this.search) >= 0) ||
          (p.positionName && p.positionName.indexOf(this.search) >= 0)
      })
    }
  },
  methods: {
    init () {
      console.log('currentList %o in group picker', this.currentList)

      this.search = ''
      this.deleteList = []
      this.deleteIds.clear()

      // 不要直接标记在store里，所以进行了Object.assign复制
      // 注意 currentList有可能是[undefined]
      this.pickList = this.currentList.map(f => Object.assign({}, f))
    },
    pick (item) {
      item.checked = true
      if (this.deleteIds.has(item[this.idKey])) return
      this.deleteIds.add(item[this.idKey])
      this.deleteList.push(item)
    },
    cancle (item) {
      item.checked = false
      if (!this.deleteIds.has(item[this.idKey])) return
      this.deleteIds.delete(item[this.idKey])
      this.deleteList = this.deleteList.filter(p => p[this.idKey] !== item[this.idKey])
    }
  },
  destroyed () {
    this.deleteIds.clear()
    this.deleteIds = undefined
  }
}
</script>
<style lang="less" scoped>
.pannels {
  padding-top: 10px;

  .friend-name {
    font-size: 16px;
  }

  .left-pannel {
    border-right: 1px solid #eee;

    .search-bar {
      width: 100%;
      padding-right: 20px;
      margin-bottom: 16px;
    }
    .pick-list {
      height: 400px;
      margin-right: 2px;
      overflow-y: scroll;

      .pick-one {
        margin: 10px auto;
        cursor: pointer;

        &:hover .friend-name {
          color: #19be6b;
        }
      }
    }
  }
  .right-pannel {
    .delete-list {
      padding: 20px 0 0 20px;

      height: 440px;
      overflow-y: scroll;

      .delete-one {
        margin: 10px auto;
        cursor: pointer;
        &:hover .friend-name {
          color: #aaa;
        }
      }
    }
  }
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 8px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.1);
}
</style>
