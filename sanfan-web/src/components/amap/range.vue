<template>
  <div id="app">
    <Card class="amap-wrapper">
      <el-amap-search-box class="search-box"
                          :search-option="searchOption"
                          :on-search-result="onSearchResult"
                          slot="title"></el-amap-search-box>
      <div class="amap-box">
        <el-amap :vid="vid"
                 :zoom="15"
                 :plugin="plugin"
                 :center="mapCenter">
          <template v-if="marker">
            <el-amap-marker :position="marker.position"></el-amap-marker>
            <el-amap-info-window :position="marker.position"
                                 :content="marker.address">
            </el-amap-info-window>
            <el-amap-circle :center="mapCenter"
                            :radius="range"
                            fillColor="#3395f0"
                            strokeColor="#3395f0"
                            :strokeWeight="2"
                            :fill-opacity="0.3"></el-amap-circle>
          </template>
        </el-amap>
      </div>
      <Divider class="amap-divider" />
      <div>
        <p :class="{'no-address': !address }">{{address ? address : '未选定'}}</p>
        <p>
          范围半径：
          <InputNumber :min="300"
                       :step="50"
                       @on-change="changeMap"
                       v-model="range" />
          米
        </p>
      </div>
    </Card>
  </div>

</template>

<script>
export default {
  name: 'amapRange',
  props: {
    'initlng': {
      type: Number,
      default: () => 121.59996
    },
    'initlat': {
      type: Number,
      default: () => 31.197646
    },
    'initRange': {
      type: Number,
      default: () => 300
    },
    'initAddress': {
      type: String,
      default: () => ''
    },
    // 多个数组调用的时候可以直接返回idx
    'idx': {
      type: Number,
      default: () => 0
    }
  },
  data () {
    let self = this
    return {
      vid: 'amap-vid',
      marker: null,
      range: 300,
      address: '',
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
        console.log('Pois : %o', pois)
        this.marker = {
          position: [lng, lat],
          addresskeyword: name,
          address: address
        }
        this.mapCenter = [lng, lat]
        this.address = this.marker.addresskeyword + ' ' + this.marker.address

        this.changeMap()
      }
    },
    changeMap () {
      this.$emit('location', {
        marker: this.marker,
        range: this.range,
        index: this.idx
      })
    }
  },
  mounted () {
    if (!isNaN(this.idx)) this.vid = 'amap-vid' + this.idx
    this.mapCenter = [this.initlng, this.initlat]
    this.range = this.initRange
    this.address = this.initAddress
  }
}
</script>

<style lang="less">
.amap-wrapper {
  // position: relative;
  width: 400px;
  height: 620px;
}
.amap-box {
  width: 100%;
  height: 400px;
}
.search-box {
  // position: absolute;
  // left: 10px;
  // top: 10px;
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
.amap-divider {
  margin: 8px auto;
}
.no-address {
  color: red;
  font-weight: 800;
}
</style>
