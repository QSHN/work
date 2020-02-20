<template>
  <Modal
    v-model="modal"
    :title="`附件管理`"
    :mask-closable="false"
    width="600"
    @on-cancel="cancel">
    <div class="upload_btn">
      <i-button type="primary">上传附件</i-button>
      <input type="file" ref="clearFile" @change="beforeAvatarUpload" />
    </div>

    <template v-if="form">
      <Table border :columns="columns" :data="form.files" style="margin-top: 10px;">
        <template slot-scope="{ row }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px"  @click="downFile(row.url)">下载</Button>
          <Button type="error" size="small" style="margin-right: 5px" :disabled="myUser.role !== 'admin'"  @click="deleteFun(row._index)">删除</Button>
        </template>
      </Table>

    </template>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import ossClient from '../../libs/aliyun'
import { filesManage } from '../../api/user'
export default {
  data () {
    return {
      modal: false,
      form: null,
      columns: [
        {
          title: '文件名',
          key: 'name'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'uploadConf',
      'myUser'
    ])
  },
  methods: {
    show (data) {
      this.form = JSON.parse(JSON.stringify(data))
      this.modal = true
    },
    cancel () {
      this.$emit('load')
      this.modal = false
    },
    uploadHttp (file) {
      const fileName = 'pc.' + Date.now() + '.' + file.name.split('.')[1]
      ossClient(this.uploadConf).put(fileName, file, {
        'ContentType': file.type
      }).then(({ res, url, name }) => {
        console.log(res, url, name)
        if (res && res.status === 200) {
          console.log(`阿里云OSS上传文件成功回调`, file.name, name)
          let ajaxData = JSON.parse(JSON.stringify(this.form))
          ajaxData.files.push({ name: file.name, url: name })
          filesManage(ajaxData).then(res => {
            this.form.files.push({ name: file.name, url: name })
            this.$refs.clearFile.value = ''
          }).catch(err => {
            this.$Message.error(`上传文件失败:${err}`)
            this.$refs.clearFile.value = ''
          })
        }
      }).catch((err) => {
        this.$Message.error(`上传文件失败:${err}`)
        this.$refs.clearFile.value = ''
      })
    },
    beforeAvatarUpload (e) {
      let file = e.target.files[0]
      console.log(file)
      const isLt = file.size > 1024 * 1024 * 50
      if (isLt) {
        this.$Message.error('文件大小不能超过 50M!')
      } else {
        this.uploadHttp(file)
      }
    },
    deleteFun (i) {
      if (this.myUser && this.myUser.role === 'admin') {
        this.$Modal.confirm({
          title: `附件管理`,
          content: `确定是否删除该文件`,
          onOk: () => {
            let ajaxData = JSON.parse(JSON.stringify(this.form))
            ajaxData.files.splice(i, 1)
            filesManage(ajaxData).then(res => {
              this.form.files.splice(i, 1)
            }).catch(err => {
              this.$Message.error(`删除文件失败:${err}`)
            })
          }
        })
      } else {
        this.$Message.error(`只有管理员才有权限删除客户资料文件`)
      }
    },
    previewUrl (url) {
      return ossClient(this.uploadConf).signatureUrl(url, { expires: 3600 * 24 * 30 })
    },
    downFile (url) {
      if (this.previewUrl(url)) window.open(this.previewUrl(url))
    }
  }
}
</script>

<style lang="less">
.upload_btn {
  position: relative;
  overflow: hidden;
  width: 80px;

  input {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 80px;
    padding: 0;
    cursor: pointer;
    font-size: 0;
    opacity: 0;
    z-index: 1;
    display: block;
  }
}
</style>
