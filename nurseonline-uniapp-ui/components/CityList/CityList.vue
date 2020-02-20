<template>
  <view class="select-city-wrap">
    <view class="select-city">
      <view class="index">
        <view class="index-item" @click="scrollTo('#')">#</view>
        <view class="index-item" v-for="(item,index) in citys" :key="index" @click="scrollTo(index)">{{index}}</view>
      </view>
      <scroll-view :scroll-into-view="scrollIntoId" :scroll-y="true" :scroll-with-animation="true" :style="{height:windowHeight}">
        <view class="content">
          <view class="section" id="current">
            <view class="city-title">当前城市</view>
            <view class="city-list">
              <view class="city-item current">{{current}}</view>
            </view>
          </view>
          <!-- <view class="section" id="hot" v-if="hotCitys.length">
            <view class="city-title">热门城市</view>
            <view class="city-list">
              <view class="city-item" :class="{active: current === city}" v-for="(city, i) in hotCitys" :key="i" @click="onSelect(city)">{{city}}</view>
            </view>
          </view> -->
					<view class="section" :id="index" v-for="(item,index) in citys" :key="index">
					  <view class="letter">{{index}}</view>
					  <view class="city-list">
					    <view class="city-item"
										:class="{active: current === city.zoneName}"
										v-for="(city,itemIndex) in item"
										:key="itemIndex"
										@click="onSelect(city)">
										{{city.zoneName}}
							</view>
					  </view>
					</view> 
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
  // import Citys from './citys'
	import { getCityList } from '@/common/api/service/service'
  export default {
    props: {
      hotCitys: {
        type: Array,
        default () {
          return []
        }
      },
      value: {
        type: String,
        default: '未设置'
      }
    },
    data() {
      return {
        citys: [],
        windowHeight: '',
        scrollIntoId: 'F',
        current: this.value
      }
    },
    mounted() {
      this.getSystemInfo()
			getCityList().then(response => {
				this.citys = response.data.data
			})
    },
    methods: {
      getSystemInfo() {
        uni.getSystemInfo().then(res => {
          let [error, data] = res
          this.windowHeight = `${data.windowHeight}px`
        })
      },
      scrollTo(letter) {
        this.scrollIntoId = letter === '#' ? 'current' : letter
      },
      onSelect(city) {
        this.current = city.zoneName || city
        this.$emit('input', city)
        this.$emit('on-select', city)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .select-city-wrap {
    position: relative;
    padding: 0 30rpx;
    background-color: #fff;
  }
  .select-city {
    .index {
      position: absolute;
      right: 0;
      top: 40rpx;
      z-index: 999;
      color: #6E8CFA;
      font-size: 24rpx;
      .index-item {
        width: 40rpx;
        height: 42rpx;
        line-height: 42rpx;
        text-align: center;
      }
    }
    .section {
      margin-bottom: 19rpx;
      .city-title {
        color: #333;
        font-size: 28rpx;
        margin-bottom: 28rpx;
      }
      .letter {
        width: 44rpx;
        height: 44rpx;
        color: #fff;
        border-radius: 100%;
        background-color: #6E8CFA;
        font-size: 28rpx;
        line-height: 44rpx;
        text-align: center;
        margin-bottom: 30rpx;
      }
      .city-list {
        display: flex;
        flex-wrap: wrap;
        .city-item {
          width: 190rpx;
          height: 55rpx;
          margin-right: 36rpx;
          margin-bottom: 28rpx;
          line-height: 55rpx;
          text-align: center;
          border: 1px solid #dcdcdc;
          border-radius: 6rpx;
          color: #999;
          font-size: 28rpx;
					text-overflow:ellipsis;
					overflow:hidden;
					white-space:nowarp;
          &.active {
            background-color: #6E8CFA;
            border-color: #6E8CFA;
            color: #fff;
          }
					&.current {
						min-width: 190rpx;
						width: auto;
						padding: 0 10rpx;
						box-sizing: border-box;
					}
        }
      }
    }
  }
</style>