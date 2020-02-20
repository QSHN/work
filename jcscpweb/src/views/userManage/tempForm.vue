<template>
  <div class="temp-form">
    <div v-if="isChangeName" class="temp-label">
      <el-input
        v-model="obj.name"
        placeholder="请输入内容"
        size="small"
        clearable
      />
      ：
    </div>

    <div style="margin-right: 15px;">
      <template v-if="obj.type === 'img'">
        <Upload style="width: 49px; height: 49px;" :image-url="obj.val" @change="updateImg" />
      </template>

      <template v-else-if="obj.type === 'input'">
        <el-input
          v-model="obj.val"
          placeholder="请输入内容"
          size="small"
          clearable
          style="width: 240px;"
        />
      </template>

      <template v-else-if="obj.type === 'textarea'">
        <el-input
          v-model="obj.val"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          style="width: 240px;"
        />
      </template>
    </div>
  </div>
</template>

<script>
import Upload from '../../components/Upload/uploadImg'
export default {
  name: 'TempForm',
  components: {
    Upload
  },
  props: {
    formData: {
      type: Object,
      required: true
    },
    which: {
      type: Number,
      required: true
    },
    isChangeName: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      obj: {}
    }
  },
  watch: {
    formData: {
      handler() {
        this.obj = JSON.parse(JSON.stringify(this.formData))
      },
      deep: true,
      immediate: true
    },
    'obj.name'() {
      if (this.isChangeName) this.$emit('changeForm', this.obj, this.which)
    },
    'obj.val'() {
      if (!this.isChangeName) this.$emit('changeForm', this.obj, this.which)
    }
  },
  methods: {
    updateImg(url) {
      this.obj.val = url
      this.$emit('changeForm', this.obj, this.which)
    }
  }
}
</script>

<style lang="scss" scoped>
.temp-form {
  display: flex;
  align-items: center;

  .temp-label {
    font-size: 14px;
    min-width: 100px;
    text-align: right;
    margin-right: 20px;
    display: flex;
    align-items: center;
  }
}
</style>
