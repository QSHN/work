<template>
  <div class="purchase_files">
    <el-button size="small" type="primary" @click="dialog = true">附件管理</el-button>
    <el-dialog title="附件管理" :visible.sync="dialog" width="600px">
      <el-upload
        class="files-uploader"
        :show-file-list="false"
        action=""
        :drag="false"
        :multiple="true"
        :http-request="uploadHttp"
        :before-upload="beforeAvatarUpload"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-table
        :data="files"
        border
        size="small"
        style="margin-top: 10px;"
      >
        <el-table-column
          prop="name"
          label="文件名字"
        />
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="140"
        >
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="downFile(scope.row.url)">下载</el-button>
            <el-button size="small" type="text" style="color: #F56C6C" @click="deleteFun(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ossClient from '../../utils/aliyun'
export default {
  props: {
    files: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  computed: {
    ...mapGetters([
      'uploadConf'
    ])
  },
  methods: {
    uploadHttp({ file }) {
      const fileName = 'pc.' + Date.now() + '.' + file.name.split('.')[1]
      ossClient(this.uploadConf).put(fileName, file, {
        'ContentType': file.type
      }).then(({ res, url, name }) => {
        if (res && res.status === 200) {
          console.log(`阿里云OSS上传文件成功回调`, file.name, name)
          this.$emit('change', file.name, name)
        }
      }).catch((err) => {
        this.$message.error(`上传文件失败:${err}`)
      })
    },
    beforeAvatarUpload(file) {
      console.log(file)
      const isLt = file.size > 1024 * 1024 * 50
      if (isLt) {
        this.$message.error('文件大小不能超过 50M!')
      }
      return !isLt
    },
    deleteFun(i) {
      this.$emit('change', null, null, i)
    },
    previewUrl(url) {
      return ossClient(this.uploadConf).signatureUrl(url, { expires: 3600 * 24 * 30 })
    },
    downFile(url) {
      if (this.previewUrl(url)) window.open(this.previewUrl(url))
    }
  }
}
</script>

<style lang="scss">
  .purchase_files {
    .el-dialog__body {
      padding-top: 0;
    }
  }
</style>
