<template>
  <Modal v-model="modal"
         width="600"
         title="搜索定位"
         class="search_map_modal"
         @on-ok="ok"
         @on-cancel="cancel">
    <div id="app" v-if="modal">
      <div class="amap-wrapper">
        <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult" ></el-amap-search-box>
        <el-amap class="amap-box" :vid="'amap-vue'" :zoom="12" :plugin="plugin" :center="mapCenter">
          <template v-if="marker">
            <el-amap-marker :position="marker.position" ></el-amap-marker>
            <el-amap-info-window
              :position="marker.position"
              :content="marker.address">
            </el-amap-info-window>
          </template>
        </el-amap>
      </div>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'amapSearch',
  data () {
    let self = this
    return {
      modal: false,
      marker: null,
      searchOption: {
        city: '上海',
        citylimit: true
      },
      mapCenter: [121.59996, 31.197646],
      plugin: [ // 一些工具插件
        {
          pName: 'Geolocation', // 定位
          events: {
            init (o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.searchOption = {
                    city: result.addressComponent.city,
                    citylimit: true
                  }
                  self.mapCenter = [result.position.lng, result.position.lat]
                  self.$nextTick() // 页面渲染好后
                }
              })
            }
          }
        }
      ]
    }
  },
  methods: {
    onSearchResult (pois) {
      if (pois.length > 0) {
        let { lng, lat, name, address } = pois[0]
        console.log(pois)
        this.marker = {
          position: [lng, lat],
          address: `${name}(${address})`
        }
        this.mapCenter = [lng, lat]
      }
    },
    show () {
      this.modal = true
    },
    ok () {
      this.$emit('location', this.marker)
      this.cancel()
    },
    cancel () {
      this.modal = false
    }
  }
}
</script>

<style lang="less">
  .search_map_modal {
    .amap-wrapper {
      position: relative;
      width: 570px;
      height: 400px;
    }
    .search-box {
      position: absolute;
      left: 10px;
      top: 10px;
      width: 300px;
      height: 35px;
    }
    .search-tips {
      max-height: 200px;
      overflow: auto;
    }
    .amap-info-contentContainer {
      margin-bottom: 18px;
    }
    .amap-info-close {
      display: none;
    }
    .bottom-center .amap-info-sharp {
      bottom: auto;
    }
  }
</style>
