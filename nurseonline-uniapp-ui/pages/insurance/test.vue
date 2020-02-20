<template>
	<view class="padding-20 test-area">
		<view class="title">为了让我们更好地为你服务，请对申请人的日常生活能力做以下评估，请根据实际情况选择（总分100分）</view>
		<view class="test-box">
			<view class="test-title">1.进食：指用餐具将食物由容器送到口中、咀嚼、吞咽等过程</view>
			<radio-group @change="radioChange">
                <label class="align-center test-list" v-for="(item, index) in items" :key="index">
                    <view>
                        <radio :value="item.value" :checked="index === current" color="#6E8CFA" class="radio"/>
                    </view>
                    <view>{{item.name}}</view>
                </label>
            </radio-group>
		</view>
		<view class="button-area">
			<button>提交</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
            current: 0,
			items: [
				{
					value: '0',
					name: '需极大帮助或完全依赖他人，或有留置营养管（0分）'
				},
				{
					value: '5',
					name: '需部分帮助（5分）'
				},
				{
					value: '10',
					name: '可独立进食（10分）'
				}
			]
		}
	},
	methods: {
		radioChange(evt) {
			for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].value === evt.target.value) {
                    this.current = i;
                    break;
                }
            }
		}
	},
}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
	.test-box {
		margin-top: 40rpx;
		line-height: 50rpx;
		
		.radio {
			// vertical-align: middle;
			.wx-radio-input {
				width: 30rpx;
				height: 30rpx;
				// vertical-align: middle;
			}
		}
	}
	.button-area {
		margin-top: 40rpx;
	}
</style>