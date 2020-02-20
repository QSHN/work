<template>
    <view class="bottom-01 bg-white padding border-bottom">
        <view  class="flex-msg">
            <view>{{item.name}}</view>
            <picker :disabled="disabled" mode="date" :value="value" @change="selectDate($event, item)">
                <view class="uni-input inline-block">{{value}}</view>
                <text class="iconfont">&#xe6f8;</text>
            </picker>
        </view>
    </view>
</template>

<script>
export default {
    model: {
        prop: 'value',
        event: 'updateChange',
    },
    props: {
        value: String,
        item: Object,
        disabled: Boolean,
    },
    methods: {
        selectDate(event, childItem) {
            var value = event.target.value
			this.value = value
            this.$emit('updateChange', this.value)
        }
    },
}
</script>
