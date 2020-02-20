<!-- 城市选择器 -->
<template>
  <Modal v-model="modal"
         width="900"
         height="600"
         :title=" marker.district ? (marker.district +' '+ marker.name) : '请选择' "
         class="search_map_modal"
         @on-ok="ok"
         @on-cancel="cancel">
    <div id="app">
      <div class="amap-wrapper">
        <!-- <div class="search-tips"><span class="search-tips-head">当前选址:</span> <span class="search-tips-body">{{this.marker.district}} {{this.marker.name}} </span></div> -->
        <el-amap-search-box class="search-box"
                            :search-option="searchOption"
                            :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap class="amap-box"
                 :vid="'amap-vue'"
                 :zoom="12"
                 :plugin="plugin"
                 :center="mapCenter"
                 :events="events">
          <template v-if="marker && marker.position">
            <el-amap-marker :position="marker.position"></el-amap-marker>
            <el-amap-info-window :position="marker.position"
                                 :content="marker.address">
            </el-amap-info-window>
          </template>
        </el-amap>
      </div>
    </div>
  </Modal>
</template>

<script>
// 这里通过高德 SDK 完成。
export default {
  name: 'amapCity',
  props: {
    'initlng': {
      type: Number,
      default: () => 121.59996
    },
    'initlat': {
      type: Number,
      default: () => 31.197646
    },
    'isCityLimit': {
      type: Boolean,
      default: () => false
    },
    'isAddressName': {
      type: Boolean,
      default: () => false
    }
  },
  watch: {
    initlng () {
      this.initPicker()
    },
    initlat () {
      this.initPicker()
    }
  },
  data () {
    let self = this
    return {
      modal: false,
      marker: {
        name: '',
        position: [121.59996, 31.197646],
        address: '',
        district: ''
      },
      // 默认的解码插件,不重复生成
      geocoder: new AMap.Geocoder({
        radius: 1000,
        extensions: 'all'
      }),
      searchOption: {
        city: '上海',
        citylimit: self.isCityLimit
      },
      mapCenter: [121.59996, 31.197646],
      plugin: [ // 一些工具插件
        'ToolBar', // 放大缩小工具栏
        {
          pName: 'Geolocation', // 定位
          events: {
            init (o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.searchOption = {
                    city: result.addressComponent.city,
                    citylimit: self.isCityLimit
                  }
                  self.mapCenter = [result.position.lng, result.position.lat]
                  self.$nextTick()
                }
              })
            }
          }
        }
      ],
      events: {
        'click': (mapsEvent) => {
          let { lng, lat } = mapsEvent.lnglat
          self.lng = lng
          self.lat = lat
          this.geocoder.getAddress([lng, lat], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                let a = result.regeocode.addressComponent
                self.marker = {
                  name: a.township + a.street + a.streetNumber,
                  id: a.adcode,
                  address: a.township + a.street + a.streetNumber,
                  district: a.province + a.city + a.district,
                  lng: self.lng,
                  lat: self.lat
                }
                self.$nextTick()
              }
            }
          })
        }
      },
      // 地图选的用的临时变量
      lng: 0,
      lat: 0
    }
  },
  methods: {
    onSearchResult (pois) {
      if (pois.length > 0) {
        let { lng, lat } = pois[0]
        this.lng = lng
        this.lat = lat
        this.mapCenter = [lng, lat]

        let self = this
        this.geocoder.getAddress([lng, lat], function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            if (result && result.regeocode) {
              let a = result.regeocode.addressComponent
              // 搜索可以显示建筑名字，点击只有街道门牌号
              self.marker = {
                name: self.isAddressName ? a.township + a.street + a.streetNumber : pois[0].name,
                id: a.adcode,
                address: a.township + a.street + a.streetNumber,
                district: a.province + a.city + a.district,
                lng: self.lng,
                lat: self.lat
              }
              self.$nextTick()
            }
          }
        })
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
    },
    initPicker () {
      this.mapCenter = [this.initlng, this.initlat]

      let self = this
      this.geocoder.getAddress([self.initlng, self.initlat], function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.regeocode) {
            let a = result.regeocode.addressComponent
            self.marker = {
              name: a.township + a.street + a.streetNumber,
              id: a.adcode,
              address: a.township + a.street + a.streetNumber,
              district: a.province + a.city + a.district,
              lng: self.initlng,
              lat: self.initlat
            }
            self.$nextTick()
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.search_map_modal {
  .amap-wrapper {
    position: relative;
    width: 870px;
    height: 570px;
  }
  .search-box {
    position: absolute;
    left: 100px;
    top: 30px;
    width: 300px;
    height: 35px;
  }
  .search-tips {
    overflow: hidden;
    font-size: 14px;
    text-align: center;
    background: #fefefe;
    margin-bottom: 0.5em;
    .search-tips-head {
      display: inline-block;
      margin-right: 1em;
      color: #999;
    }
    .search-tips-body {
      color: #555;
    }
  }
  .amap-info-contentContainer {
    margin-bottom: 18px;
  }
  .amap-info-close {
    display: none;
  }
}
</style>
