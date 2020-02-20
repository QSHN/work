<template>
    <Card ref="card">
      <div class="chan_con clearfloat">
        <Button :disabled="chan.length<=1" @click="gotoLevel" size="small" style="float: left;margin-right: 20px">上一级</Button>
        <div v-for="(item, index) in chan" :key="index">{{item.name||'目录'}}</div>
        <span style="float: right">
          <div style="display: inline-block;margin-left: 5px;" @click="newFile">添加文件</div>
        </span>
      </div>
      <div class="explorer_con clearfloat" @contextmenu.prevent="popMenu($event)" @click="handleCloseMenu">
        <div class="file_con"
             v-for="(item, index) in currDirList"
             v-if="item.folder"
             :key="'dir_'+index"
             :class="{file_select:(currSelects.filter(i=>i===item).length>0),isCut:isCut&&pasteData.list.filter(i=>i===item).length>0}"
             @click="onCurrDir(item)"
             @dblclick="currSelect={};openFolder(item)"
             @contextmenu.prevent="popMenu($event, item)">
          <div class="file_img"><img src="../../assets/images/files/icon_folder_yellow@2x.png"></div>
          <div class="file_name">{{item.name}}</div>
<!--          <div class="file_size">文件夹({{item.files.length+item.sub.length}})</div>-->
        </div>
        <div class="file_con"
             v-for="(item, index) in currDirList"
             v-if="!item.folder"
             :key="'file_'+index"
             :class="{file_select:(currSelects.filter(i=>i===item).length>0),isCut:isCut&&pasteData.list.filter(i=>i===item).length>0}"
             @click="onCurrDir(item)"
             @contextmenu.prevent="popMenu($event, item)">
          <div class="file_img"><img :src="file_icon(item.name)"></div>
          <div class="file_name">{{item.name}}</div>
          <div class="file_size">大小:{{sizeToString(item.size)}}</div>
        </div>
        <Spin size="large" fix  v-if="spinShow"></Spin>
      </div>
      <div class="info_con">
        <div v-if="currSelects.length">选中：{{currSelects.length==1?currSelects[0].name:currSelects.length+'个'}}</div>
        <div v-else>当前目录：{{currDir.name}} {{currDirList.length}}</div>
        <div v-if="pasteData.list.length">{{isCut?'剪切中':'复制中'}}：{{pasteData.list.length==1?pasteData.list[0].name:pasteData.list.length+'个'}}</div>
      </div>
      <div class="rightMenu" :style="mousePosition">
        <div @click="all">全选</div>
        <div v-if="currSelects.length" @click="copy(true)">剪切</div>
<!--        <div v-if="currSelects.length" @click="copy()">复制</div>-->
        <div v-if="pasteData.list.length" @click="paste()">粘贴</div>
        <div v-if="currSelects.length===1" @click="renameShow">重命名</div>
        <div v-if="currSelects.length" @click="remove(currDir,currSelects)">删除</div>
        <div v-if="currSelect&&currSelect.fileKey" @click="download"><a :download='downloadName' :href="downloadUrl" target= _blank><div style="width: 100%;height: 100%">下载</div></a></div>
        <div v-if="!currSelects.length" @click="newFolderModal.show=true">新建文件夹</div>
        <div @click="info">属性</div>
      </div>
      <Modal title="修改名称" v-model="renameModal.show" @on-ok="renameChange">
        <Form>
          <FormItem label="新名称">
            <Input v-model="renameModal.value" style="width: 200px"></Input>
          </FormItem>
        </Form>
      </Modal>
      <Modal title="新建文件夹" v-model="newFolderModal.show" @on-ok="newFolder">
        <Form>
          <FormItem label="名称">
            <Input v-model="newFolderModal.value" style="width: 200px"></Input>
          </FormItem>
        </Form>
      </Modal>
    </Card>
</template>
<style scoped lang="less">
  .info_con{
    margin-top: 10px;
    font-size: 12px;
    &>div{
      display: inline-block;
      margin-right: 20px;
    }
  }
  .chan_con{
    padding-bottom: 10px;
    border-bottom: 1px solid #e6e6e6;
    &>div{
      float: left;
      line-height: 24px;
      color: #999;
    }
    &>div:after{
      margin: 5px;
      content: '/';
      color: #999;
    }
    &>div:last-child{
      font-weight: bold;
      color: #515a6e;
    }
    &>div:last-child:after{
      content: '';
    }
  }
  .rightMenu{
    display: none;
    position: absolute;
    width: 100px;
    text-align: center;
    background-color: rgb(248, 248, 248);
    border: 1px solid #eaeaea;
    border-radius: 4px;
    overflow: hidden;
    &>div{
      line-height: 30px;
      cursor: pointer;
      color: #363636;
      font-size: 12px;
      border-bottom: 1px solid #eeeeee;
      /*border-radius: 4px;*/
      /*background-color: #6f6f6f;*/
    }
    &>div:hover{
      background-color: #cacaca;
    }
    &>div:last-child{
      border-bottom: none;
    }
  }
  .file_select{
    background-color: #f2f2f2;
  }
  .isCut{
    opacity: 0.7;
  }
  .explorer_con{
    min-height: 500px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e6e6e6;
  }
  .file_con{
    width: 100px;
    height: 110px;
    border-radius: 6px;
    /*border: 1px solid #c3c3c3;*/
    padding: 10px 2px;
    margin: 10px;
    /*cursor: pointer;*/
    float: left;
    .file_img{
      width: 50px;
      height: 50px;
      /*background-color: #999999;*/
      margin: 0px auto;
      border-radius: 6px;
      img{
        text-align: center;
        height: 100%;
        max-width: 100%;
      }
    }
    .file_name{
      margin-top: 5px;
      text-align: center;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      font-size: 12px;
    }
    .file_size{
      text-align: center;
      font-size: 12px;
      color: #c3c3c3;
    }
  }
  .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
  .clearfloat{zoom:1}
</style>
<script>
import { mapGetters, mapActions } from 'vuex'
import { generateId, deepCopy } from '../../libs/util'
import { getSignUrl, selectAndUpload } from '../../libs/aliyun'
import { deleteFile, listFiles, newFile, move, rename } from '../../api/file'
const clickoutside = {
  // 初始化指令
  bind (el, binding, vnode) {
    function documentHandler (e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e)
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler
    document.addEventListener('mousedown', documentHandler)
  },
  update () {},
  unbind (el, binding) {
    // 解除事件监听
    document.removeEventListener('mousedown', el.__vueClickOutside__)
    delete el.__vueClickOutside__
  }
}
export default {
  name: 'file',
  directives: { clickoutside },
  props: {
    classify: {
      type: String
    }
  },
  data () {
    return {
      spinShow: false,
      currDirList: [], // 当前目录所有文件或文件夹
      currDir: {},
      currSelect: {}, // 点击文件
      currSelects: [], // 多点文件
      mousePosition: [], // 鼠标位置，用于右键菜单定位
      chan: [], // 路径
      isshift: false, // 按下SHIFT
      isctrl: false, // 按下CTRL
      pasteData: { target: {}, list: [] }, // 粘贴板数据
      isCut: false, // 剪切
      moment: false, // 延时标志
      // 重命名
      renameModal: {
        show: false,
        value: '',
        file: {}
      },
      // 新建文件夹
      newFolderModal: {
        show: false,
        value: ''
      },
      downloadUrl: '',
      downloadName: ''
    }
  },
  computed: {
    ...mapGetters([
      // 'myCompany',
      'myUserId',
      'myProfile'
    ]),
    getLayer () {
      if (this.parentPath) {
        let arr = this.parentPath.split('/').map(item => {
          return { name: item }
        })
        if (arr.length) return arr
      }
      return [{ name: '目录' }]
    }
  },
  mounted () {
    this.openFolder({ name: '目录' })
    this.keyevent()
    console.log(this.$refs.card.$el.offsetLeft, this.$refs.card.$el.offsetTop)
  },
  methods: {
    ...mapActions([
      'UPDATE_COMPANY'
    ]),
    updateFolder () {
      let data = { model: this.classify }
      if (this.currDir && this.currDir.id)data.parentId = this.currDir.id
      this.spinShow = true
      listFiles(data).then(res => {
        this.spinShow = false
        this.currDirList = res.data
      }).catch(() => {
        this.spinShow = false
      })
    },
    gotoLevel () {
      let item = this.chan.pop()
      let data = { model: this.classify }
      if (item && item.parentId)data.parentId = item.parentId
      this.spinShow = true
      listFiles(data).then(res => {
        this.currDirList = res.data
        this.currDir = this.chan.length ? this.chan[this.chan.length - 1] : null
        this.spinShow = false
      }).catch(() => {
        this.chan.push(item)
        this.spinShow = false
      })
    },
    openFolder (item) {
      this.chan.push(item)
      let data = { model: this.classify }
      if (item && item.id)data.parentId = item.id
      this.spinShow = true
      listFiles(data).then(res => {
        this.spinShow = false
        this.currDirList = res.data
        this.currDir = item
        this.currSelect = {}
        this.currSelects = []
      }).catch(() => {
        this.chan.pop()
        this.spinShow = false
      })
    },
    clear () {
      this.currSelect = {}
      this.currSelects = []
      this.pasteData = { target: {}, list: [] }
    },
    keyevent () {
      var that = this
      document.onkeydown = function (e) { // 按下键盘
        // // ctrl+x
        // if (e.ctrlKey && window.event.keyCode === 88) {
        //   that.copy(true)
        // }
        // // ctrl+c
        // if (e.ctrlKey && window.event.keyCode === 67) {
        //   that.copy()
        // }
        // // ctrl+v
        // if (e.ctrlKey && window.event.keyCode === 86) {
        //   that.paste()
        // }

        switch (e.keyCode) {
          case 16:
            that.isshift = true
            break
          case 17:
            that.isctrl = true
            break
        }
      }
      document.onkeyup = function (e) { // 放弃键盘
        switch (e.keyCode) {
          case 16:
            that.isshift = false
            break
          case 17:
            that.isctrl = false
            break
        }
      }
    },
    sizeToString (b/* bytes */) {
      if (!b) return '未知大小'
      if (b < 1024) return b + 'B'
      if (b < 1028 * 1024) return (b / 1024).toFixed(2) + 'KB'
      if (b < 1024 * 1024 * 1024) return (b / (2014 * 1024)).toFixed(2) + 'MB'
      return '大于1G'
    },
    onCurrDir (item, right) {
      console.log(1)
      this.onMoment()
      this.currSelect = item
      let index = this.currSelects.indexOf(item)
      if (this.isctrl || this.isshift) {
        if (index > -1) {
          this.currSelects.splice(index, 1)
        } else {
          this.currSelects.push(item)
        }
      } else {
        if (index > -1 && right) {
        } else {
          this.currSelects = item ? [item] : []
        }
      }
    },
    // 右键菜单
    popMenu (e, item) {
      console.log(2)
      this.onMoment()
      let self = this
      e.cancelBubble = true
      e.preventDefault()
      if (e.button === 2) {
        this.onCurrDir(item, true)
        let x = e.clientX - this.$refs.card.$el.offsetLeft
        let y = e.clientY - this.$refs.card.$el.offsetTop
        self.mousePosition = { left: x + 'px', top: y + 'px', display: 'block' }
      } else if (e.button === 0) {
        this.handleCloseMenu()
      }
    },
    handleCloseMenu () {
      console.log(3)
      if (!this.moment) this.currSelects = []
      this.mousePosition = { left: 0, top: 0, display: 'none' }
    },
    file_icon (name) {
      let ext = name.split('.').pop()
      ext = ext.toLowerCase()
      if (['doc', 'dot', 'wps', 'wpt', 'docx', 'dotx', 'docm', 'dotm'].includes(ext)) { return require('../../assets/images/files/icon_document_word_blue@2x.png') }

      if (['xls', 'xlt', 'et', 'ett', 'xlsx', 'xltx', 'csv', 'xlsm', 'xlsm', 'xltm'].includes(ext)) { return require('../../assets/images/files/icon_document_excel_green@2x.png') }

      if (['pdf'].includes(ext)) { return require('../../assets/images/files/icon_document_pdf_pink@2x.png') }

      if (['gif', 'png', 'jpg', 'jpeg', 'image'].includes(ext)) { return require('../../assets/images/files/icon_document_picture_orange@2x.png') }

      if (['pptx', 'ppt', 'pot', 'potx', 'pps', 'ppsx', 'dps', 'dpt', 'pptm', 'potm', 'ppsm'].includes(ext)) { return require('../../assets/images/files/icon_document_ppt_red@2x.png') }

      if (['txt', 'log', 'lrc', 'rtf', 'xml', 'htm', 'html'].includes(ext)) { return require('../../assets/images/files/icon_document_txt_purple@2x.png') }

      if (['zip', '7z', 'rar'].includes(ext)) { return require('../../assets/images/files/icon_document_zip_multicolor@2x.png') }

      // return compressed file icon by default
      return require('../../assets/images/files/icon_document_unknown_gray@2x.png')
    },
    renameShow () {
      this.onMoment()
      this.renameModal.file = this.currSelect
      this.renameModal.value = this.currSelect.name || ''
      this.renameModal.show = true
      this.handleCloseMenu()
    },
    renameChange () {
      const id = this.renameModal.file.id
      const name = this.renameModal.value
      rename({ id, name }).then(res => {
        this.renameModal.file.name = this.renameModal.value
        this.$Message.error('修改成功！')
      }).catch(() => {
        this.$Message.error('修改失败！')
      })
      this.update()
    },
    onMoment () {
      this.moment = true
      setTimeout(() => { this.moment = false }, 100)
    },
    copy (cut) {
      this.onMoment()
      this.isCut = !!cut
      this.pasteData.list = [].concat(this.currSelects)
      this.pasteData.target = this.currDir
      this.handleCloseMenu()
    },
    all () {
      this.onMoment()
      this.currSelects = [].concat(this.currDirList)
      this.handleCloseMenu()
    },
    remove (currDir, files) {
      this.onMoment()
      this.$Modal.confirm({ title: '注意',
        content: '您确定要删除吗？',
        onOk: () => {
          let ids = this.currSelects.map(item => item.id)
          deleteFile({ ids }).then(res => {
            this.clear()
            this.$Message.success('删除成功！')
            this.updateFolder()
          }).catch(() => {
            this.$Message.error('删除失败！')
          })
        }
      })
      this.handleCloseMenu()
    },
    update () {
      // let data = {}
      // data[this.classify] = this.files
      // this.UPDATE_COMPANY(data)
    },
    paste () {
      this.onMoment()
      let ids = this.pasteData.list.map(file => file.id)
      let parentId = this.currDir.id
      if (this.currSelect && this.currSelect.folder) {
        parentId = this.currSelect.id
      }
      move({ ids, parentId }).then(res => {
        this.$Message.success('操作成功！')
        this.clear()
        this.updateFolder()
      }).catch(() => {
        this.$Message.error('操作失败！')
      })
      // return
      // this.pasteData.list.forEach(file => {
      //   if (file.fileId) {
      //     if (!this.currDir.files.filter((f, index) => f.fileId === file.fileId).length) {
      //       let newFile = this.deepCopy(file)
      //       this.currDir.files.push(newFile)
      //       if (this.isCut) {
      //         this.pasteData.target.files.forEach((f, index) => {
      //           if (f.fileId === file.fileId) {
      //             this.pasteData.target.files.splice(index, 1)
      //           }
      //         })
      //       }
      //     }
      //   } else if (file.folderId) {
      //     if (!this.currDir.sub.filter((f, index) => f.folderId === file.folderId).length) {
      //       let folder = this.deepCopy(file)
      //       this.currDir.sub.push(folder)
      //       if (this.isCut) {
      //         this.pasteData.target.sub.forEach((f, index) => {
      //           if (f.folderId === file.folderId) {
      //             this.pasteData.target.sub.splice(index, 1)
      //           }
      //         })
      //       }
      //     }
      //   }
      // })
      this.handleCloseMenu()
    },
    newFolder () {
      this.onMoment()
      let data = {
        'name': this.newFolderModal.value,
        'model': this.classify,
        'parentId': this.currDir ? this.currDir.id : null,
        'folder': true // 不是文件夹,
      }
      newFile(data).then(res => {
        this.$Message.success('创建成功！')
        this.updateFolder()
      }).catch(() => {
        this.$Message.error('创建失败！')
      })
      this.newFolderModal.value = ''
      this.handleCloseMenu()
    },
    newFile (file) {
      this.onMoment()
      let nFile = {}
      let fileKey = this.myProfile.companyId + '/' + this.classify + '/' + Date.now() + '_'
      selectAndUpload(file => {
        console.log(file)
        nFile.name = file.name
        nFile.size = file.size
        nFile.type = file.name.replace(/^.+\./, '')
      }, oss => {
        nFile.oss = oss
        let data = {
          'name': nFile.name,
          'model': this.classify,
          'parentId': this.currDir ? this.currDir.id : null,
          'folder': false, // 不是文件夹,
          'fileKey': nFile.oss
        }
        newFile(data).then(res => {
          this.updateFolder()
        })
      }, null, fileKey)
      this.handleCloseMenu()
    },
    download () {
      this.onMoment()
      const file = this.currSelect
      this.downloadUrl = ''
      this.downloadName = file.name
      getSignUrl(file.fileKey, (url) => {
        this.downloadUrl = url
      })
      this.handleCloseMenu()
    },
    info () {
      this.onMoment()
      let info = ''
      if (this.currSelects.length) {
        info = this.currSelects.length === 1 ? this.currSelects[0].name : this.currSelects.length + '个'
      } else {
        info = '当前目录：' + this.currDir.name + ' ' + this.currDirList.filter(f => f.folder).length + '文件夹 ' + ' ' + this.currDirList.filter(f => !f.folder).length + '个文件'
      }
      this.$Modal.success({ title: '属性', content: info })
      this.handleCloseMenu()
    },
    deepCopy (oldfiles) {
      let files = deepCopy(oldfiles)
      let dir = (files) => {
        files.forEach(f => {
          if (f.fileId) f.fileId = generateId()
          if (f.folderId) f.folderId = generateId()
          if (f.files) dir(f.files)
          if (f.sub) dir(f.sub)
        })
      }
      dir([files])
      return files
    }
  }
}
</script>

<style scoped>

</style>
