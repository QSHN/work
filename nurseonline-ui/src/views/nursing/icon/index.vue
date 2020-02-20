<template>
  <div class="execution">
    <basic-container>
      <el-tabs type="card" addable @tab-add="handleAddTab">
        <template v-for="(iconfont, index) in iconfonts">
          <el-tab-pane :label="iconfont.label" :key="index">
            <!-- label插槽 -->
            <span slot="label"><i :class="index<groupNames.length?'el-icon-s-help':'el-icon-share'"></i> {{iconfont.label}}</span>

            <!-- 编辑 -->
            <template v-if="index>=groupNames.length">
              <el-collapse>
                <el-collapse-item :title="' 编辑 '+iconfont.label+' 配置 '">
                  <avue-form ref="form" v-model="iconfontDatas[index-groupNames.length]" :option="formOption" @submit="handleSubmit(iconfontDatas[index-groupNames.length], index-groupNames.length)">
                    <template slot-scope="scope" slot="menuForm">
                      <el-button @click="handleDel(iconfontDatas[index-groupNames.length])" icon="el-icon-delete">删 除</el-button>
                    </template>
                  </avue-form>
                </el-collapse-item>
              </el-collapse>
            </template>

            <!-- 图标展示 -->
            <ul class="icon-list">
              <template v-for="icon in iconfont.list">
                <el-tooltip :content="'复制 '+icon" placement="bottom" effect="light" :enterable="false" :key="icon">
                  <li class="icon" @click="handleCopyIconCode(icon)">
                    <span>
                      <i :class="icon"></i>
                      <label>{{icon}}</label>
                    </span>
                  </li>
                </el-tooltip>
              </template>
              <template v-if="iconfont.list.length==0">
                <el-alert title="获取图标失败，请检查图标库是否正确！" type="error" :closable="false"></el-alert>
              </template>
            </ul>
          </el-tab-pane>
        </template>
      </el-tabs>

      <el-dialog :visible.sync="showNew" title="添加新图标库">
        <avue-form v-model="newIconfont" :option="formOption" @submit="handleNew">
        </avue-form>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import {iconfontUrl, iconfontVersion} from '@/config/env'
  import {fetchList, addObj, putObj, delObj, setEnabled} from '@/api/nursing/sys/iconfont/iconfont'
  import {tableOption} from '@/const/crud/nursing/sys/iconfont/iconfont'
  import {mapGetters} from 'vuex'

  import {loadStyle} from '@/util/util'

  export default {
    name: 'iconview',
    data() {
      return {
        elementUIVersion: '2.9.1',
        loadedIconFonts:[],
        iconfonts:[],
        iconfontDatas:[],
        newIconfont:{},
        showNew:false,
        formOption: tableOption,
        groupNames:['Avue图标','Pigx图标','eleUI@$ver图标']
      }
    },
    created() {
    },
    mounted: function () {
      this.refresh()
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      handleCSS(label, ele, url, iconReg){
        // 参数
        let reg = iconReg || /(?=icon-).+?(?=:before|$)/g
        let cssurl = url || iconfontUrl

        // 引入css
        loadStyle(cssurl.replace('$key', ele))
        let iconfont = {
          label : label,
          list: [],
        }
        // 请求资源，获取资源内容
        let xhr = new XMLHttpRequest();
        xhr.open("GET", cssurl.replace('$key', ele))
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            let text = xhr.responseText
            // 获取 “icon-”开头“:before”结尾的图标
            // let reg = /(?=icon-).+?(?=:before|$)/g
            let match;
            while ((match = reg.exec(text))) {
              iconfont.list.push(match[0])
            }
          }
        }
        xhr.send();
        return iconfont;
      }
      ,eleUIList(){
        // $key 要在handleCss中替换为版本。目前写死版本在data中。
        let url = 'https://unpkg.com/element-ui@$key/lib/theme-chalk/index.css'
        // {0,30} ==> 30是为了防止匹配不正确而加的限制，不然可能会匹配到一长串没用的字符串。
        let reg = /(?=el-icon-).{0,30}?(?=:+before|$)/g
        let iconfont = this.handleCSS(this.groupNames[2].replace('$ver', this.elementUIVersion), this.elementUIVersion, url, reg)
        this.iconfonts.push(iconfont)
        this.loadedIconFonts.push('element-ui@'+this.elementUIVersion)
      }
      ,pigxList(){
        iconfontVersion.forEach((ele, index) => {
          let iconfont = this.handleCSS(this.groupNames[index], ele)
          this.iconfonts.push(iconfont)
          this.loadedIconFonts.push(ele)
        })
      }
      ,sysList(){
        fetchList().then(({data})=>{
          if(data.data){
            this.iconfontDatas = data.data
            data.data.forEach(rec => {
              let ele = rec.projectId + "_" + rec.projectVersion
              let iconfont = this.handleCSS(rec.projectName, ele)
              this.iconfonts.push(iconfont)
              // 已经加载的图标库
              this.loadedIconFonts.push(ele)
            })
          }
        })
      }
      ,refresh(){
        this.iconfonts = []
        this.pigxList()
        this.eleUIList()
        this.sysList()
      }
      ,handleCopyIconCode(txt){
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', txt);
        input.select();
        if (document.execCommand('copy')) {
          document.execCommand('copy');
          this.$message('复制成功！');
        }
        document.body.removeChild(input);
      }
      ,handleSubmit(obj, index){
        putObj(obj).then(data => {
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
          this.loadStyle(obj)
        })
      },
      loadStyle(obj){
        let ele = obj.projectId + "_" + obj.projectVersion
        let url = iconfontUrl.replace('$key', ele)

        // 是否已经被加载
        if(this.loadedIconFonts.indexOf(ele)==-1){
          this.loadedIconFonts.push(ele)
          const link = document.createElement('link')
          link.type = 'text/css'
          link.rel = 'stylesheet'
          link.href = url
          const head = document.getElementsByTagName('head')[0]
          head.appendChild(link)
        }
        this.refresh()
      }
      ,handleAddTab(){
        this.newIconfont = {}
        this.showNew = true
      }
      ,handleNew(){
        addObj(this.newIconfont).then(()=>{
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.showNew = false
          this.loadStyle(this.newIconfont)
        })
      }
      ,handleDel(obj){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(obj.iconfontId).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.refresh()
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icon-list{
    overflow: hidden;
    list-style: none;
    padding: 0;
    border: 1px solid #eaeefb;
    border-radius: 4px;

    .icon{
      float: left;
      width: 12.5%;
      text-align: center;
      height: 120px;
      line-height: 120px;
      color: #666;
      font-size: 13px;
      transition: color .15s linear;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
      margin-right: -1px;
      margin-bottom: -1px;

      span{
        display: inline-block;
        line-height: normal;
        vertical-align: middle;
        font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
        color: #606266;

        i{
          display: block;
          font-size: 32px !important;
          margin-bottom: 15px;
        }
        label{
          display: inline-block;
          padding: 0 3px;
          height: 1em;
        }
      }

      &:hover {
        cursor: pointer;
        > * {
          color: #6A83F8;
        }
        label{
          cursor: pointer;
        }
      }
    }
  }
</style>
