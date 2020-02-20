<template>
  <div class="basic-info-table-container">
    <el-row style="margin-bottom: 15px;">
      <el-button type="text" style="color: #409EFF" @click="back">基础资料</el-button>
      <span style="margin: 0 10px;">/</span>
      <el-dropdown v-if="which" placement="top-start" style="width: 200px" @command="(key) => { which = key }">
        <span class="el-dropdown-link">
          {{ basicInfo[which].name }}
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown" style="width: 200px; height: 400px; overflow: auto">
          <el-dropdown-item v-for="(item, key) in basicInfo" :key="key" :command="key">{{ item.name }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>

    <template v-if="bInfoData && group">
      <el-tabs v-model="group" type="card">
        <el-tab-pane
          v-for="(item, index) in bInfoData.group"
          :key="index"
          :label="item.name"
          :name="item.name"
        >
          <el-row style="margin-bottom: 10px;">
            <el-button-group>
              <el-button type="primary" size="small" @click="setList('add', null, null)">新增{{ bInfoData.name }}</el-button>
              <el-button type="primary" size="small" @click="setTemp">设置{{ bInfoData.name }}模板</el-button>
              <el-button type="primary" size="small" @click="setGroup('add', null, null)">新增分类</el-button>
              <el-button type="primary" size="small" @click="setGroup('edit', index)">修改分类</el-button>
              <el-button type="primary" size="small" @click="setGroup('delete', index)">删除分类</el-button>
            </el-button-group>
          </el-row>

          <el-table
            :data="getInfoList"
            size="small"
            border
            resizable
          >
            <el-table-column
              v-for="(temp, tIndex) in bInfoData.temp"
              :key="tIndex"
              :label="temp.name"
              sortable
              :sort-by="temp.name"
            >
              <template slot-scope="scope">
                {{ temp.type === 'boolean' ? scope.row[temp.code] ? '是' : '否' : scope.row[temp.code] }}
              </template>
            </el-table-column>

            <!--            <el-table-column-->
            <!--              label="是否默认"-->
            <!--              sortable-->
            <!--            >-->
            <!--              <template slot-scope="scope">-->
            <!--                {{ scope.row.isDefault ? '是' : '否' }}-->
            <!--              </template>-->
            <!--            </el-table-column>-->

            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="setList('edit', scope.row, scope.$index)">编辑</el-button>
                <el-button type="text" size="small" @click="setList('copy', scope.row, null)">复制</el-button>
                <el-button type="text" size="small" style="color: #F56C6C" @click="setList('delete', scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </template>

    <edit-group ref="editGroup" />
    <temp ref="temp" />
    <info ref="info" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateBasicInfo } from '../../api/basicInfo'
import editGroup from './group'
import temp from './temp'
import info from './info'
export default {
  name: 'BasicInfoIndexTable',
  components: {
    editGroup,
    temp,
    info
  },
  data() {
    return {
      which: null,
      group: null
    }
  },
  computed: {
    ...mapGetters([
      'basicInfo',
      'basicData',
      'myInfo'
    ]),
    bInfoData() {
      return this.basicInfo[this.which] || null
    },
    getInfoList() {
      let list = this.bInfoData.list
      if (this.group) list = list.filter(f => f.group === this.group)
      return list
    }
  },
  watch: {
    which() {
      if (this.which !== this.$route.query.type) {
        this.$router.push({
          name: 'BasicInfoIndexTable',
          query: {
            type: this.which
          }
        })
      }
    },
    bInfoData: {
      handler() {
        if (this.bInfoData && !this.group) {
          this.group = this.bInfoData.group[0].name
        }
      },
      immediate: true
    }
  },
  created() {
    this.which = this.$route.query.type
    this.$forceUpdate()
  },
  methods: {
    back() {
      this.$router.push({
        name: 'BasicInfoIndex'
      })
    },
    setGroup(type, index) {
      const updateData = JSON.parse(JSON.stringify(this.bInfoData))
      if (type === 'delete') {
        if (!this.judgeAuthority(this.$route.query.group, 0, '删除分类')) {
          this.$message.error(`对不起，您没有删除分类的权限，请联系管理员`)
          return
        }
        if (index === 0) {
          this.$message.error('默认分类无法删除')
        } else if (this.getInfoList.length) {
          this.$message.error('该分类还有内容无法删除')
        } else {
          const name = updateData.group[index].name
          this.$confirm(`确定删除${name}分类?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updateData.group.splice(index, 1)
            this.update(updateData, () => {
              this.group = this.bInfoData.group[0].name
              this.$message.success(`已删除分类：${name}`)
            })
          })
        }
      } else {
        const fData = updateData.group[type === 'add' ? updateData.group.length - 1 : index]
        const name = type === 'add' ? '' : fData.name
        if (!this.judgeAuthority(this.$route.query.group, 0, name ? '修改分类' : '新增分类')) {
          this.$message.error(`对不起，您没有${name ? '修改分类' : '新增分类'}的权限，请联系管理员`)
          return
        }
        this.$refs.editGroup.show(name, updateData.group, (name) => {
          const form = {
            id: type === 'add' ? fData.id + 1 : fData.id,
            name: name
          }
          if (type === 'add') {
            updateData.group.push(form)
          } else {
            updateData.group.splice(index, 1, form)
          }
          this.update(updateData, () => {
            this.group = name
            this.$message.success(`成功${type === 'add' ? '添加' : '修改'}分类`)
          })
        })
      }
    },
    update(updateData, cb) {
      // const ajaxData = JSON.parse(JSON.stringify(this.basicData))
      // this.$set(ajaxData.info, this.which, updateData)
      updateBasicInfo({
        type: 'updateGroup',
        which: this.which,
        setData: updateData.group
      }).then(res => {
        this.$store.dispatch('basicInfo/queryBasicInfo')
        if (cb) cb()
      })
    },
    setTemp() {
      if (!this.judgeAuthority(this.$route.query.group, 0, '自定义')) {
        this.$message.error(`对不起，您没有自定义模板的权限，请联系管理员`)
        return
      }
      this.$refs.temp.show(this.which)
    },
    setList(action, row, index) {
      if (action === 'delete') {
        if (!this.judgeAuthority(this.$route.query.group, 0, '删除')) {
          this.$message.error(`对不起，您没有删除的权限，请联系管理员`)
          return
        }
        // const ajaxData = JSON.parse(JSON.stringify(this.basicData))
        this.$confirm(`确定删除该选项吗，一旦删除将无法恢复`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // let num = 0
          // this.bInfoData.list.forEach((f, i) => {
          //   if (f.group === this.group) {
          //     if (num === index) {
          //       ajaxData.info[this.which].list.splice(i, 1)
          //     } else {
          //       num++
          //     }
          //   }
          // })
          // console.log(ajaxData)
          updateBasicInfo({
            type: 'deleteList',
            which: this.which,
            group: this.group,
            setData: index
          }).then(res => {
            this.$store.dispatch('basicInfo/queryBasicInfo')
            this.$message.success(`成功删除`)
          })
        })
      } else {
        if (!this.judgeAuthority(this.$route.query.group, 0, action === 'edit' ? '修改' : '新增')) {
          this.$message.error(`对不起，您没有${action === 'add' ? '新增' : action === 'copy' ? '复制' : '修改'}的权限，请联系管理员`)
          return
        }
        let form = {}
        if (row) {
          form = row
        } else {
          form = {
            group: this.group,
            groupId: this.bInfoData.group.find(f => f.name === this.group).id,
            isDefault: false
          }
          this.bInfoData.temp.forEach(f => {
            this.$set(form, f.code, null)
          })
        }
        this.$refs.info.show(this.which, form, index)
      }
    },
    judgeAuthority(title, index, action) {
      let bool = false
      // console.log(title, index, action)
      // && this.myInfo.role !== 'admin'
      if (this.myInfo && this.myInfo.role !== 'admin') {
        const pList = this.myInfo.permission.permission
        const checked = this.myInfo.permission.checked
        const findFun = (list) => {
          for (let i = 0; i < list.length; i++) {
            if (list[i].label === title) {
              const look = index === 0 ? list[i].children[index].children.find(f => f.label === action) : list[i].children[1]
              bool = !!checked.find(id => look.id.substr(0, id.length) === id)
              return
            } else if (list[i].children && list[i].children.length) {
              findFun(list[i].children)
            }
          }
        }
        findFun(pList[2].children)
      } else {
        bool = true
      }
      return bool
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-info-table {
  &-container {
    margin: 30px;
  }
}
</style>
