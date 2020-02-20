<template>
    <view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center">
        <view class="flex-item pr20" v-show="item.name">{{item.name}}</view>
        <view class="border-bottom">
            <input
                :disabled="disabled"
                class="flex-item uni-input"
                v-model="value"
                placeholder-class="holder"
                :placeholder="item.placeholder"
                @input="handleInput"
            >
        </view>
        <view class="pl20" v-show="item.unit">{{ item.unit }}</view>
    </view>
</template>

<script>
export default {
    model: {
        prop: 'value',
        event: 'updateInput',
    },
    props: {
        value: String,
        item: Object,
        disabled: Boolean,
    },
    methods: {
        handleInput(event) {
            this.$emit('updateInput', this.value)
        }
    },
}
</script>
