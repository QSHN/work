<template>
  <Card shadow style="height: 100%; overflow:auto; overflow-x: hidden;">
    <Row type="flex" justify="space-between" style="margin-bottom: 15px;">
      <Input search enter-button v-model="search" placeholder="输入职位名称" style="width: 250px;" />
      <Button type="success" @click="setAdmin('add', {})">新建职位</Button>
    </Row>

    <Table border :columns="columns" :data="pageContent">
      <template slot-scope="{ row }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px"  @click="setAdmin('edit', row)">修改</Button>
        <Button type="error" size="small" style="margin-right: 5px"  @click="setAdmin('delete', row)">删除</Button>
      </template>
    </Table>

    <Row type="flex" justify="end" style="margin-top: 15px;">
      <Page :total="page.total" :current="page.current" :pageSize="page.size" @on-change="changePage"></Page>
    </Row>
  </Card>
</template>

<script>
import { queryClerk, deleteClerk, updateClerk } from '../../api/user'
import iviewTableDrag from '../../libs/iviewTableDrag'
export default {
  name: 'position',
  data () {
    return {
      search: '',
      page: {
        total: 1,
        current: 1,
        size: 20
      },
      columns: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center'
        }
      ],
      clerkList: [],
      tableList: [],
      pageContent: []
    }
  },
  watch: {
    search: {
      handler () {
        let list = this.clerkList
        if (this.search) list = list.filter(v => v.name.includes(this.search))
        this.changePage(1, list)
      },
      deep: true
    }
  },
  mounted () {
    setTimeout(() => {
      iviewTableDrag()
    }, 1500)
  },
  methods: {
    changePage (current, list) {
      if (list) {
        this.tableList = list
        this.page.total = list.length
      }
      this.page.current = current
      this.pageContent = this.tableList.slice((current - 1) * this.page.size, current * this.page.size)
    },
    load () {
      queryClerk().then(res => {
        this.clerkList = res.data
        this.changePage(1, res.data)
      }).catch(err => {
        this.$Notice.error({
          title: '职位列表',
          desc: err.message
        })
      })
    },
    setAdmin (type, data) {
      let formData = Object.assign({}, data)
      let edit = (title, name) => {
        let newName = name
        formData.name = name
        this.$Modal.confirm({
          title: `${title}职位`,
          render: (h) => {
            return h('Input', {
              props: {
                value: name,
                autofocus: true,
                placeholder: '输入职位名称'
              },
              on: {
                input: (val) => {
                  newName = val
                }
              }
            })
          },
          onOk: () => {
            if (newName) {
              if (newName !== formData.name && this.clerkList.filter(v => v.name.trim() === newName.trim()).length) {
                this.$Notice.error({
                  title: `${title}职位`,
                  desc: `已存在该职位，无法${title}`
                })
              } else {
                formData.name = newName
                updateClerk(formData).then(res => {
                  this.$Notice.success({
                    title: '职位',
                    desc: `成功${title}职位：${formData.name}`
                  })
                  this.load()
                }).catch(err => {
                  this.$Notice.error({
                    title: '职位',
                    desc: err.message
                  })
                })
              }
            } else {
              this.$Notice.error({
                title: `${title}职位`,
                desc: '职位名称必填'
              })
            }
          }
        })
      }
      switch (type) {
        case 'add':
          edit('新增', '')
          break
        case 'edit':
          edit('修改', data.name)
          break
        case 'delete':
          this.$Modal.confirm({
            title: '删除职位',
            content: `是否删除职位：${data.name}`,
            onOk: () => {
              deleteClerk({
                id: data._id
              }).then(res => {
                this.$Notice.success({
                  title: '职位',
                  desc: `成功删除职位：${data.name}`
                })
                this.load()
              }).catch(err => {
                this.$Notice.error({
                  title: '职位',
                  desc: err.message
                })
              })
            }
          })
          break
      }
    }
  },
  created () {
    this.load()
  }
}
</script>

<style scoped>

</style>
