<template>
  <Card shadow style="height: 100%; overflow:hidden;" class="mu_card">
    <div style="display: flex; height: 100%">
      <div style="width: 180px; min-width: 180px;">
        <div style="height: 100%; border: 1px solid #ccc; border-right: none;">
          <div slot="left" style="height: 100%; display: flex; flex-direction: column;">
            <div style="background: #f8f8f9; height: 40px; line-height: 40px; padding-left: 10px;">
              核算项目管理
            </div>
            <div style="flex-grow: 1; overflow: auto;">
              <div style="padding: 0 0 20px 5px; overflow: hidden;">
                <Tree :data="groupData" :render="groupContent" style="margin-left: 5px;"></Tree>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="flex-grow: 1; height: 100%;  overflow: hidden;" class="ap_card_layer">
        <keep-alive>
          <router-view/>
        </keep-alive>
      </div>
    </div>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import { accountingProgram } from '../../libs/accountingProgram'
export default {
  name: 'index',
  data () {
    return {
      accountingProgram,
      selectGroup: '0',
      groupData: [{
        title: '核算项目',
        expand: true,
        code: '0',
        render: (h, { root, node, data }) => {
          return h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            }
          }, [
            h('span', {
              style: {
                display: 'inline-block',
                lineHeight: '24px',
                padding: '0 5px',
                cursor: 'pointer',
                background: this.selectGroup === data.code ? '#d5e8fc' : 'none'
              },
              on: {
                click: () => {
                  this.selectGroup = data.code
                  this.$router.push({
                    name: 'apMain'
                  })
                }
              }
            }, data.title)
          ])
        },
        children: []
      }]
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList'
    ])
  },
  watch: {
    '$route': {
      handler () {
        if (this.$route.name !== 'accountingProgram') return
        let name = this.$route.name
        if (name === 'apMain') {
          this.selectGroup = '0'
        } else {
          this.selectGroup = this.accountingProgram.find(v => v.routerName === name) && this.accountingProgram.find(v => v.routerName === name).code
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    groupContent (h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span', {
          style: {
            display: 'inline-block',
            lineHeight: '24px',
            padding: '0 5px',
            cursor: 'pointer',
            background: this.selectGroup === data.code ? '#d5e8fc' : 'none'
          },
          on: {
            click: () => {
              this.selectGroup = data.code
              this.$router.push({
                name: data.routerName
              })
            }
          }
        }, data.title)
      ])
    }
  },
  mounted () {
    this.groupData[0].children = this.accountingProgram
  }
}
</script>

<style lang="less">
  .ap_card_layer .ivu-card-body {
    padding: 0;
  }
  .mu_card  .ivu-card-body {
    display: flex;
    flex-direction: column;
    height: 100%;

    .mu_c {
      flex-grow: 1;
      position: relative;
      border: 1px solid #ccc;
    }

    .ivu-split-wrapper {
      position: absolute;
    }

    .ivu-split-horizontal {
      height: 100%;
    }

    .ivu-split-trigger-con {
      width: 6px;
      height: 100%;
    }
  }
</style>
