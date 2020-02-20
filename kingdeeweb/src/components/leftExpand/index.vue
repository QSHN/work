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
          <ul>
            <li @click="$emit('selectGroup', null)"  :class="{active: !selectGroup}" style="padding-left: 20px;">
              <p>全部</p>
            </li>
            <li v-for="(v, i) in groupList.filter(f => !search || (search && f.name.includes(search)))"
                :key="i"
                @click="$emit('selectGroup', v._id)"
                :class="{active: selectGroup && selectGroup === v._id}">
              <p>{{ v.name }}</p>
              <div class="btn" @click="show(v)">
                <img src="../../assets/images/icon/edit.svg" title="修改" />
              </div>
              <div class="btn" @click="deleteGroup(v._id, v.name)">
                <img src="../../assets/images/icon/close.svg" title="删除" />
              </div>
            </li>
          </ul>
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
        <FormItem label="编码" prop="code">
          <Input v-model="formData.code" style="width: 200px" />
        </FormItem>

        <FormItem label="名称" prop="name">
          <Input v-model="formData.name" style="width: 200px" />
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
    unitList: Array,
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
      formDataRule: {
        code: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('编码不能为空'))
              } else if (this.oldData.code !== value && this.groupList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该编码，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
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
    ])
  },
  methods: {
    show (item) {
      this.formData = item ? Object.assign({}, item) : {
        accountSetId: this.accountSet._id,
        code: '',
        name: ''
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
      if (this.unitList.find(f => f.groupId === id)) {
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

      ul {
        list-style: none;

        li {
          display: flex;
          align-items: center;
          height: 24px;
          padding: 0 20px 0 30px;
          cursor: pointer;

          p {
            margin: 0;
            width: 100px;
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
          }

          .btn {
            width: 18px;
            height: 18px;
            cursor: pointer;
            margin-left: 5px;
            opacity: 0;

            img {
              width: 100%;
              height: 100%;
            }
          }

          &:hover .btn {
            opacity: 1;
          }

          &.active {
            background: #5cadff;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
