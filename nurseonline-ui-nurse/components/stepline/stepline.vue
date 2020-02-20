<template>
    <view class="dateContent">
        <view class="line"></view>
        <view  v-for="(item,key) in dateList" :class="{'item':true, 'item-checked': key==nowIndex, 'item-close': !item.isActive}" :key="key" @click="choseTime(item,key)">
            <view class="circle"></view>
            <view class="week">{{item.name}}</view>
        </view>
    </view>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'month',
      },
    },
    computed: {
      dateList() {
        var arr = this.getArr(this.type)
        return arr
      }
    },
    data() {
      return {
        nowIndex: 0
      }
    },
		onLoad() {
			this.init()
		},
    methods: {
			init(){
				//init whichstep
				this.nowIndex=this.$store.state.stepCurrent
			},
      getArr(type) {
        var timeArr = []
        if(type == 'month'){
          timeArr = [
            {
              name: '身份证',
              isActive: true,
              checked: false,
              value: 1
            },
            {
              name: '基本信息',
              isActive: true,
              checked: false,
              value: 2
            },
            {
              name: '相关资质',
              isActive: true,
              checked: false,
              value: 3
            },
// 						{
// 						  name: '入驻机构',
// 						  isActive: true,
// 						  checked: false,
// 						  value: 4
// 						}
          ]
        }
        return timeArr;
      },
      choseTime(item, index) {//切换步骤
			console.log(index)
      }
    }
  }
</script>

<style lang="scss">
  .dateContent{
      background: $uni-bg-color;
      display: flex;
      flex-direction: row;
      padding: 18upx 6upx 4upx 6upx;
      .item{
          z-index: 9;
          color: $uni-text-color-grey;
          flex: 1;
          text-align: center;
          padding-bottom: 12upx;
          &-checked{
              color: #666;
              // font-weight: bolder;
              .circle{
                  background-color: #6E8CFA!important;
									border:5px solid #C0D5FC!important;
									margin:12rpx auto!important;
              }
          }
          &-close{
              color: $uni-text-color-grey;
          }
          .week{
              margin-top: 4upx;
              font-size: $uni-font-size-base;
          }
          .circle{
              width: 30upx;
              height: 30upx;
              border-radius: 50%;
              border:1px solid #ebedf0;
              margin: 20upx auto ;
              background-color: $uni-bg-color;
          }
      }
      .line{
          position: absolute;
          top: 53upx;
          width: 94%;
          left: 3%;
          height: 4upx;
          background-color: #ebedf0;
      }
			.line{
				border: none!important;
			}
  }

</style>