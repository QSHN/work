<template>
    <view class="flex-box horizontal-between vertical-center">
        <view class="uni-title uni-common-pl">{{ item.name }}</view>
        <view class="uni-list">
            <view class="uni-list-cell">
                <view class="uni-list-cell-db color999">
                    <picker
                        :disabled="disabled"
                        @change="selectOption($event, item)"
                        :value="value"
                        :range="item.options"
                    >
                        <view class="uni-input inline-block">{{ item.options[value] }}</view>
                        <text class="iconfont">&#xe6f8;</text>
                    </picker>
                </view>
            </view>
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
        value: [String, Number],
        item: Object,
        disabled: Boolean,
    },
    methods: {
        selectOption(event, item) {
            let value = event.target.value
            this.value = value
            this.$emit('updateChange', this.value)
		},
    },
}
</script>
