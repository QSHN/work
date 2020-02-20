<template>
  <div :class="{left_expand: true, active: !isExpand}">
    <div class="le_c">
      <div class="le_m">
        <div class="title">
          <span>{{title}}</span>
          <div class="add_btn" @click="show(null)">
            <img src="../../assets/images/icon/add.svg" title="新增" />
          </div>
        </div>

        <div class="search">
          <Input v-model="search" placeholder="按名称模糊查询" style="width: 190px" />
        </div>

        <GeminiScrollbar
          class="scroll_layer"
          :autoshow="true"
          :forceGemini="true"
          :minThumbSize="20">
          <div style="padding: 0 10px;">
            <Tree :data="getGroupList" :render="renderContent"></Tree>
          </div>
        </GeminiScrollbar>
      </div>
    </div>

    <div :class="{expand_btn: true, active: !isExpand}" @click="isExpand = !isExpand">
      <img src="../../assets/images/icon/left.svg" :title="isExpand ? '收起' : '展开'" />
    </div>

    <Modal
      v-model="modal"
      :title="`${formData._id ? '修改' : '新增' + title}组`"
      :mask-closable="false"
      width="500"
      height="1200"
      @on-cancel="cancel">
      <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
        <FormItem label="名称" prop="name">
          <Input v-model="formData.name" style="width: 200px" />
        </FormItem>

        <FormItem label="上级分类">
          <Cascader v-model="formData.parentIds" :data="getSelectList" style="width: 200px" change-on-select></Cascader>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="success" @click="sure">{{formData._id ? '保存' : '新增'}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'index',
  props: {
    title: String,
    groupList: Array,
    list: Array,
    selectGroup: String,
    updateFun: Function,
    deleteFun: Function
  },
  data () {
    return {
      isExpand: true,
      search: '',
      modal: false,
      formData: {},
      oldData: {},
      hoverId: null,
      formDataRule: {
        name: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('名称不能为空'))
              } else if (this.oldData.name !== value && this.groupList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getGroupList () {
      let list = this.groupList.filter(f => !this.search || (this.search && f.name.includes(this.search)))
      let result = [
        {
          _id: null,
          name: '全部',
          expand: true,
          children: []
        }
      ]
      let add = (list, child) => {
        list.forEach(v => {
          let subList = list.filter(g => g.parentIds.length && g.parentIds[g.parentIds.length - 1] === v._id)
          let children = []
          if (subList.length) add(subList, children)
          child.push({
            _id: v._id,
            name: v.name,
            parentIds: v.parentIds,
            expand: true,
            children: children
          })
        })
      }
      add(list.filter(f => f.parentIds.length === 0), result[0].children)
      return result
    },
    getSelectList () {
      let result = []
      let add = (list, child) => {
        list.forEach(v => {
          let subList = this.groupList.filter(g => g.parentIds.length && g.parentIds[g.parentIds.length - 1] === v._id)
          let children = []
          if (subList.length) add(subList, children)
          let addObj = {
            value: v._id,
            label: v.name
          }
          if (children.length) addObj.children = children
          if (!this.formData._id || (this.formData._id && this.formData._id !== v._id)) child.push(addObj)
        })
      }
      add(this.groupList.filter(f => f.parentIds.length === 0), result)
      return result
    }
  },
  watch: {
    isExpand () {
      this.$emit('updateExpand', this.isExpand)
    }
  },
  methods: {
    show (item) {
      this.formData = item ? Object.assign({}, item) : {
        accountSetId: this.accountSet._id,
        name: '',
        parentIds: []
      }
      if (item) this.oldData = Object.assign({}, item)
      this.modal = true
    },
    cancel () {
      this.formData = {}
      this.oldData = {}
      this.modal = false
      this.$refs.formData.resetFields()
    },
    sure () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.updateFun(this.formData).then(res => {
            this.$Message.success(`成功${this.formData._id ? '修改' : '新增' + this.title}组`)
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    },
    deleteGroup (id, name) {
      if (this.groupList.find(f => f.parentIds.includes(id))) {
        this.$Message.error(`该分组还包含其他组， 无法删除`)
      } else if (this.list.find(f => f.groupId === id)) {
        this.$Message.error(`该分组还有${this.title}， 无法删除`)
      } else {
        this.$Modal.confirm({
          title: `删除${this.title}组`,
          content: `确定是否删除${this.title}组：${name}`,
          onOk: () => {
            this.deleteFun({ id: id }).then(res => {
              this.$Message.success(`成功删除`)
              this.$emit('load')
            }).catch(err => {
              this.$Message.error(err.message)
            })
          }
        })
      }
    },
    renderContent (h, { root, node, data }) {
      return h('div', {
        style: {
          display: 'inline-block'
        },
        on: {
          'mouseenter': () => {
            this.hoverId = data._id
          },
          'mouseleave': () => {
            this.hoverId = null
          }
        }
      }, [
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center'
          }
        }, [
          h('span', {
            style: {
              maxWidth: '100px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              display: 'block',
              height: '24px',
              lineHeight: '24px',
              cursor: 'pointer',
              padding: '0 5px',
              background: data._id === this.selectGroup ? '#5cadff' : '',
              color: data._id === this.selectGroup ? '#fff' : ''
            },
            on: {
              click: () => {
                this.$emit('selectGroup', data._id)
              }
            }
          }, data.name),
          h('img', {
            domProps: {
              title: '修改',
              src: require('../../assets/images/icon/edit.svg')
            },
            style: {
              width: '18px',
              height: '18px',
              cursor: 'pointer',
              marginLeft: '5px',
              opacity: data._id === this.selectGroup || data._id === this.hoverId ? 1 : 0,
              display: data._id === null ? 'none' : 'inline-block'
            },
            on: {
              click: () => {
                this.show(this.groupList.find(f => f._id === data._id))
              }
            }
          }, '修改'),
          h('img', {
            domProps: {
              title: '删除',
              src: require('../../assets/images/icon/close.svg')
            },
            style: {
              width: '18px',
              height: '18px',
              cursor: 'pointer',
              marginLeft: '5px',
              opacity: data._id === this.selectGroup || data._id === this.hoverId ? 1 : 0,
              display: data._id === null ? 'none' : 'inline-block'
            },
            on: {
              click: () => {
                this.deleteGroup(data._id, data.name)
              }
            }
          }, '删除')
        ])
      ])
    }
  }
}
</script>

<style lang="less" scoped>
.left_expand {
  position: relative;
  width: 210px;
  height: ~"calc(100vh - 132px)";
  margin-right: 10px;
  background: #fff;
  transition: 300ms;

  .expand_btn {
    position: absolute;
    right: 0;
    top: 50%;
    z-index: 1;
    width: 20px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #c5c8ce;
    margin-top: -15px;
    cursor: pointer;
    transition: 300ms;

    img {
      width: 10px;
    }

    &:hover {
      opacity: .8;
    }
  }

  &.active {
    width: 0;
    margin-right: 0;

    .expand_btn {
      right: -20px;
      transform: rotateY(180deg);
    }
  }

  .le_c {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .le_m {
      width: 210px;
      height: 100%;

      .title {
        width: 100%;
        height: 36px;
        min-height: 36px;
        border-bottom: 1px solid #dcdee2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;

        .add_btn {
          width: 18px;
          height: 18px;
          cursor: pointer;

          img {
            width: 100%;
            height: 100%;
            filter: grayscale(100%)
          }
        }
      }

      .search {
        padding: 8px 10px;
      }

      .scroll_layer {
        height: ~"calc(100% - 37px - 48px)";
        overflow: hidden;
      }
    }
  }
}
</style>
