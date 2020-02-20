<template>
  <div class="basic-info-container">
    <el-tabs v-if="bInfoDataGroup" v-model="group" type="card">
      <el-tab-pane
        v-for="(item, index) in bInfoDataGroup.group"
        :key="index"
        :label="item.name"
        :name="item.name"
      >
        <el-row style="margin-bottom: 10px;">
          <el-button type="primary" size="small" @click="createBasicInfo('add', null, null)">新增基础资料</el-button>
          <el-button type="primary" size="small" @click="setGroup('add', null, null)">新增组</el-button>
          <el-button type="primary" size="small" @click="setGroup('edit', index)">修改组</el-button>
          <el-button type="primary" size="small" @click="setGroup('delete', index)">删除组</el-button>
        </el-row>

        <el-table
          :data="tableData.filter(data => data.gId === item.id && (!search || data.name.toLowerCase().includes(search.toLowerCase())))"
          size="small"
          border
          resizable
          style="width: 402px;"
        >
          <el-table-column
            prop="name"
            label="标题"
            sortable
            width="200px;"
          />
          <el-table-column
            align="center"
            width="200px;"
          >
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"
                style="display: block;"
              />
              <span v-if="scope" v-show="false" />
            </template>
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="go(scope.row.key)">查看详情</el-button>
              <el-button type="text" size="small" @click="createBasicInfo('edit', scope.row.data, scope.row.key)">设置</el-button>
              <el-button type="text" size="small" style="color: #F56C6C" @click="deleteFun(scope.row.key)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <createBI ref="createBI" />
    <edit-group ref="editGroup" :is-b-i="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  updateBasicInfo,
  queryBasicInfoGroup,
  updateBasicInfoGroup
} from '../../api/basicInfo'
import createBI from './createBI'
import editGroup from './group'
export default {
  name: 'BasicInfoIndex',
  components: {
    createBI,
    editGroup
  },
  data() {
    return {
      search: '',
      bInfoDataGroup: null,
      group: null
    }
  },
  computed: {
    ...mapGetters([
      'basicInfo',
      'basicData',
      'myInfo'
    ]),
    tableData() {
      const list = []
      for (const key in this.basicInfo) {
        list.push({
          key: key,
          gId: this.basicInfo[key].gId,
          name: this.basicInfo[key].name,
          data: this.basicInfo[key]
        })
      }
      return list
    }
  },
  mounted() {
    this.loadGroup()
  },
  methods: {
    loadGroup(name) {
      queryBasicInfoGroup().then(res => {
        this.bInfoDataGroup = res
        this.group = name || res.group[0].name
      })
    },
    go(key) {
      if (!this.judgeAuthority(this.group, 1, '查看权')) {
        this.$message.error(`对不起，您没有查看${this.group}里基础资料的权限，请联系管理员`)
        return
      }
      this.$router.push({
        name: 'BasicInfoIndexTable',
        query: {
          type: key,
          group: this.group
        }
      })
    },
    createBasicInfo(action, name, which) {
      if (!this.judgeAuthority(name ? this.group : '基础资料', 0, name ? '修改' : '新增基础资料')) {
        this.$message.error(`对不起，您没有${name ? `修改${this.group}里基础资料` : '新增基础资料'}的权限，请联系管理员`)
        return
      }
      this.$refs.createBI.show(action, name, which, this.bInfoDataGroup.group, this.group)
    },
    deleteFun(key) {
      const ajaxData = JSON.parse(JSON.stringify(this.basicData))
      const name = ajaxData.info[key].name
      if (!this.judgeAuthority(this.group, 0, '删除')) {
        this.$message.error(`对不起，您没有删除${this.group}组里基础资料的权限，请联系管理员`)
        return
      }
      this.$confirm(`确定删除${name}基础资料，一旦删除将无法恢复`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // delete ajaxData.info[key]
        // console.log(ajaxData)
        updateBasicInfo({
          type: 'deleteBI',
          which: key
        }).then(res => {
          this.$store.dispatch('basicInfo/queryBasicInfo')
          this.$message.success(`成功删除${name}基础资料`)
        })
      })
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
              if (look.children) {
                look.children.forEach((f, i) => {
                  if (checked.find(id => f.id.substr(0, id.length) === id)) {
                    bool = true
                  }
                })
              } else {
                bool = !!checked.find(id => look.id.substr(0, id.length) === id)
              }
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
    },
    setGroup(type, index) {
      const updateData = JSON.parse(JSON.stringify(this.bInfoDataGroup))
      if (type === 'delete') {
        if (!this.judgeAuthority('基础资料', 0, '删除组')) {
          this.$message.error(`对不起，您没有删除基础资料组的权限，请联系管理员`)
          return
        }
        if (index === 0) {
          this.$message.error('默认组无法删除')
        } else if (this.tableData.find(f => f.gId === updateData.group[index].id)) {
          this.$message.error('该组还有基础资料，无法删除')
        } else {
          const name = updateData.group[index].name
          this.$confirm(`确定删除${name}组?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updateData.group.splice(index, 1)
            updateBasicInfoGroup(updateData).then(res => {
              this.loadGroup()
              this.$message.success(`已删除组：${name}`)
            })
          })
        }
      } else {
        const fData = updateData.group[type === 'add' ? updateData.group.length - 1 : index]
        const name = type === 'add' ? '' : fData.name
        if (!this.judgeAuthority('基础资料', 0, name ? '修改组' : '新增组')) {
          this.$message.error(`对不起，您没有${name ? '修改' : '新增'}基础资料组的权限，请联系管理员`)
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
          updateBasicInfoGroup(updateData).then(res => {
            this.loadGroup(name)
            this.$message.success(`成功${type === 'add' ? '添加' : '修改'}组`)
          })
        })
      }
    }
  }
}
</script>

<style lang="scss">
.basic-info {
  &-container {
    margin: 30px;

    .basic-info-router {
      margin-top: 30px;
      overflow: hidden;

      .card {
        position: relative;
        width: 300px;
        margin: 0 20px 30px;
        text-align: center;
        cursor: pointer;
        float: left;
        font-size: 14px;

        .active {
          background: rgba(#20a0ff, .7);
          color: #fff;

          .el-card__body {
            padding: 20px;
          }
        }

        .el-card__body {
          padding: 0;
        }

        .c_c {
          display: flex;
        }

        .c_t {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-grow: 1;
          padding: 20px;
        }

        &:hover {
          .c_h { width: 150px; }
        }

        .c_h {
          list-style: none;
          transition: 300ms;
          display: flex;
          margin: 0;
          padding: 0;
          width: 0;
          overflow: hidden;

          li {
            height: 100%;
            width: 50px;
            min-width: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            background: rgba(#20a0ff, .7);
            transition: 300ms;

            &:hover {
              opacity: .7;
            }
          }
        }
      }
    }
  }
}
</style>
