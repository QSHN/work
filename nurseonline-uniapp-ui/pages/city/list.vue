<template>
  <view>
    <ss-select-city :value="city.zoneName" @on-select="onSelect"></ss-select-city>
  </view>
</template>

<script>
import ssSelectCity from '@/components/CityList/CityList.vue'
import { mapGetters,mapMutations } from 'vuex'
export default {
	data() {
	  return {
		// hotCitys: ['杭州', '天津', '北京', '上海', '深圳', '广州', '成都', '重庆', '厦门']
	  }
	},
	components: {
	  ssSelectCity
	},
	onLoad(e) {
		this.value = e.city
	},
	computed: {
		...mapGetters(['city'])
	},
	methods: {
	  onSelect(city) {
		this.$store.commit('SET_CITY',city)
		uni.navigateBack({
			delta: -1
		})
	  }
	}
}
</script>