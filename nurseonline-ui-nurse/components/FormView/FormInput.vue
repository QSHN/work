<template>
    <view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom">
        <view class="flex-item">{{item.name}}</view>
        <view>
            <input :disabled="disabled" class="flex-item uni-input" v-model="value" name="item.name" :placeholder="item.placeholder" placeholder-class="holder" @input="handleInput" />
        </view>
        <text v-show="item.unit">{{item.unit}}</text>
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
