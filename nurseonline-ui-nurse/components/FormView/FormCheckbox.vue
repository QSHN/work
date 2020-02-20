<template>
    <view class="bottom-01 bg-white padding border-bottom">
        <view class="uni-title uni-common-pl">{{formInfo.name}}</view>
        <view class="uni-list">
            <checkbox-group :disabled="disabled" @change="checkboxChnage($event, formInfo)">
                <label
                    class="uni-list-cell uni-list-cell-pd"
                    v-for="option in formInfo.options"
                    :key="formInfo.value"
                >
                    <view>
                        <checkbox :disabled="disabled" :value="option.value" :checked="option.checked" />
                    </view>
                    <view class="pl10">{{ option.name }}</view>
                </label>
            </checkbox-group>
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
        value: [String, Array],
        item: Object,
        disabled: Boolean,
    },
    data() {
        return {
            formInfo: {},
        }
    },
    created() {
        this.initData()
    },
    methods: {
        initData() {
            let itemStr = JSON.stringify(this.item)
            this.formInfo = JSON.parse(itemStr)
            let values = this.formInfo.value
            for (let o of this.formInfo.options) {
                if (values.indexOf(o.value) > -1) {
                    o.checked = true
                }
            }
        },
        checkboxChnage(event, item) {
            var options = item.options
            var values = event.detail.value

			for (let i = 0; i < options.length; i++) {
				const option = options[i]
				if (values.indexOf(option.value) > -1) {
					this.$set(option, 'checked', true)
				} else {
					this.$set(option, 'checked', false)
				}
            }
            
            this.value = values
            this.$emit('updateChange', this.value)
        },
    },
}
</script>
