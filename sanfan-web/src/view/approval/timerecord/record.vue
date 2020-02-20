<template>
  <div>
    <Row type="flex"
         justify="center"
         align="middle"
         class="timerecord">
      <Col span="5">
      <Avatar :src="photoURL"
              shape="square"
              class="timerecord-pic"
              size="large">{{photoStr}}</Avatar>
      </Col>
      <Col span="19">

      <div :style="'color:' + textClr ">
        <Row type="flex"
             justify="space-between"
             class="timerecord-head">
          <Col span="6"><span class="timerecord-attendances">{{workStr}}</span></Col>
          <Col span="4">
          <Tag v-if="isAuditing">待审核</Tag>
          <span v-else
                class="timerecord-auditStatus"
                :style="'color:' + auditStatusClr ">{{auditStatusStr}}</span>
          </Col>
        </Row>
        <p v-if="record.checkInDate">
          {{positionStr}}，{{attendancesStr}}打卡({{record.checkInDate.slice(-5)}})
        </p>
        <p v-else>未打卡</p>
      </div>

      <div v-if="record.checkInDate"
           class="timerecord-location">
        <Icon type="ios-pin"
              size="18"
              color="#19be6b" />
        <span class="timerecord-location-text">{{record.positioningType === 'UNKNOWN' ? '暂时无法定位' : record.address}} </span>
      </div>

      </Col>
    </Row>
    <Divider class="timerecord-divider" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSignUrl } from '../../../libs/aliyun'
// !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
import mixin from '../timerecord.mixin.js'

export default {
  name: 'record',
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  mixins: [mixin],
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  components: {
    ...mapGetters([
      'getUserInfo'
    ])
  },
  data () {
    return {
      photoURL: '',
      photoStr: '无图片'
    }
  },
  props: {
    'record': {
      type: Object,
      required: true
    }
  },
  mounted () {
    console.log('Time Record : %o', this.record)
    getSignUrl(this.record.photo, ret => {
      if (ret instanceof Error) {
        this.photoStr = '加载失败'
      } else {
        console.info('Success pic', ret)
        this.photoUrl = ret
      }
    })
  }
}
</script>
<style lang="less">
@hd: ~".timerecord";
@piclen: 52px;
@{hd}-pic {
  height: @piclen;
  width: @piclen;
  border-radius: 0;
}
@{hd}-divider {
  margin: 8px auto 0 auto;
}
@{hd}-attendances {
  font-size: 16px;
}
@{hd}-location {
  display: flex;
  width: 220px;
  &-text {
    display: inline-block;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
