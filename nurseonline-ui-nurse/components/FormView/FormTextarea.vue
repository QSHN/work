<template>
    <view class="bottom-01 bg-white padding border-bottom">
        <view class="uni-title uni-common-pl">{{item.name}}</view>
        <view class="uni-textarea mt20">
            <textarea
                :disabled="disabled"
                class="padding"
                v-model="value"
                :placeholder="item.placeholder"
                @input="handleInput"
            />
        </view>
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
