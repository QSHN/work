<template>
  <Card class="company-list">
    <div class="company-list-title"
         slot="title">
      <Button @click="append"
              icon="md-add"
              type="primary">添加{{name}}</button>
      <!-- <Button @click="init"
              icon="md-undo"
              type="warning">撤回修改</button>
      <Button @click="submit"
              icon="md-checkmark"
              type="success">保存修改</button> -->
    </div>
    <div class="company-list-view">
      <div class="company-list-item"
           v-for="(v, i) in dataList"
           :key="i">
        <Input class="company-list-ipt"
               readonly
               v-model="v.name" />
        <Button @click="edit(v)"
                class="company-list-btn"
                type="warning">
          <Icon type="md-create"
                size="20" />
        </Button>
        <Button @click="remove(v)"
                class="company-list-btn"
                type="error">
          <Icon type="md-trash"
                size="20" />
        </Button>
      </div>

    </div>
  </Card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
      dataList: [],
      src: '',
      name: ''
    }
  },
  computed: {
    ...mapGetters(['settingType'])
  },
  methods: {
    ...mapActions([
      'getCompanySetting',
      'setCompanySetting',
      'addCompanySetting',
      'delCompanySetting'
    ]),

    init () {
      this.$Loading.start()
      this.getCompanySetting(this.src)
        .then(rtn => {
          this.dataList = rtn ? rtn.slice(0) : []
          this.$Loading.finish()
        })
        .catch(error => {
          console.error('Fail In GetComPanySetting', error)
          this.$Message.error('加载失败')
          this.$Loading.error()
        })
    },

    append () {
      let self = this
      let tmpText = ''

      this.$Modal.confirm({
        render: (h) => {
          return h('Input', {
            props: {
              autofocus: true,
              placeholder: `请输入${self.name}`
            },
            on: {
              input: (val) => {
                tmpText = val
              }
            }
          })
        },
        onOk: () => {
          if (!tmpText) return self.$Message.warning(`需要${self.name}`)
          this.$Loading.start()
          self.addCompanySetting({ 'type': self.src, 'name': tmpText })
            .then(rtn => {
              self.dataList = self.settingType(self.src).slice(0)
              self.$Loading.finish()
            })
            .catch(error => {
              console.error('Fail In AddComPanySetting', error)
              self.$Message.error('添加失败')
              self.$Loading.error()
            })
        }
      })
    },
    remove (item) {
      let self = this
      this.$Modal.confirm({
        title: `确认删除${item.name}`,
        onOk: () => {
          this.$Loading.start()
          self.delCompanySetting({ 'type': self.src, 'id': item.id })
            .then(rtn => {
              self.dataList = self.settingType(self.src).slice(0)
              self.$Loading.finish()
            })
            .catch(error => {
              console.error('Fail In AddComPanySetting', error)
              self.$Message.error('删除失败')
              self.$Loading.error()
            })
        }
      })
    },

    edit (item) {
      let self = this
      let tmpText = ''

      this.$Modal.confirm({
        render: (h) => {
          return h('Input', {
            props: {
              autofocus: true,
              value: item.name,
              placeholder: `请输入${self.name}`
            },
            on: {
              input: (val) => {
                tmpText = val
              }
            }
          })
        },
        onOk: () => {
          if (!tmpText) return self.$Message.warning(`需要${self.name}`)
          this.$Loading.start()
          self.setCompanySetting({ 'type': self.src, 'name': tmpText, 'id': item.id })
            .then(rtn => {
              self.dataList = self.settingType(self.src).slice(0)
              self.$Loading.finish()
            })
            .catch(error => {
              console.error('Fail In AddComPanySetting', error)
              self.$Message.error('修改失败')
              self.$Loading.error()
            })
        }
      })
    }
  },
  watch: {
    '$route': {
      handler: function (val) {
        console.log('meta view : %o ', val.meta)
        if (!val.meta.src) return
        // 赋值参数
        Object.assign(this.$data, val.meta)
        // 展示树
        this.init()
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="less">
@hd: ~".company-list";
@{hd} {
  min-width: 600px;
  @{hd}-title {
    button {
      margin-right: 1em;
    }
  }
  @{hd}-view {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    @{hd}-item {
      margin: 0.5em 1em;
      @{hd}-ipt {
        width: 160px;
      }
      @{hd}-btn {
        margin-left: 0.5em;
        padding: 3px;
      }
    }
  }
}
</style>
