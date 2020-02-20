<template>
    <view class="nursing-form">
        <view 
            class="nursing-form-item"
			v-for="(item, index) in nurseData"
            :key="index"
        >
        	<!-- input -->
			<form-input v-if="item.type == 'input'" v-model="item.value" :item="item" :disabled="ReadRecOnly"></form-input>
			<!-- select -->
            <view
				class="bottom-01 bg-white padding border-bottom"
				v-if="item.type == 'select'"
			>
                <form-select v-model="item.value" :item="item" :disabled="ReadRecOnly"></form-select>
                <view
                    v-if="item.children && item.children[item.value]"
                    class="mt20"
                >
                    <view
                        v-for="(childItem, childIndex) in item.children[item.value]"
                        :key="childIndex"
                    >
						<form-sub-input
							v-if="childItem.type == 'input'"
							v-model="childItem.value"
							:item="childItem"
                                :disabled="ReadRecOnly"
						></form-sub-input>
						<form-date
							v-if="childItem.type == 'date'"
                                v-model="childItem.value"
							:item="childItem"
							 :disabled="ReadRecOnly"
						></form-date>
                        </view>
                    </view>
                </view>
			<!-- date -->
			<form-date
				v-if="item.type == 'date'"
				v-model="item.value"
				:item="item"
				 :disabled="ReadRecOnly"
			></form-date>
			<!-- textarea -->
			<form-textarea
				v-if="item.type == 'textarea'"
				v-model="item.value"
				:item="item"
				 :disabled="ReadRecOnly"
			></form-textarea>
			<!-- checkbox -->
			<form-checkbox
				v-if="item.type == 'checkbox'"
				v-model="item.value"
				:item="item"
				 :disabled="ReadRecOnly"
			></form-checkbox>
			<!-- fieldset text -->
			<view
				class="bottom-01 bg-white padding border-bottom"
				v-if="item.type == 'text'"
			>
				<view class="bottom-01 bg-white flex-box vertical-center bold">
					<view class="flex-item" v-show="item.name">{{item.name}}</view>
					<view class="border-bottom" v-show="!item.name">
						<input
						:disabled="ReadRecOnly"
							class="flex-item uni-input"
						v-model="item.value"
							placeholder-class="holder"
							:placeholder="item.placeholder"
						>
				</view>
					<view v-show="item.unit">{{ item.unit }}</view>
			</view>
				<view
                    v-if="item.children && item.children"
                    class="mt20"
                >
                    <view
                        v-for="(childItem, childIndex) in item.children"
                        :key="childIndex"
                    >
						<form-input
							v-if="childItem.type == 'input'"
							v-model="childItem.value"
							:item="childItem"
							 :disabled="ReadRecOnly"
						></form-input>
						<form-date
							v-if="childItem.type == 'date'"
							v-model="childItem.value"
							:item="childItem"
							 :disabled="ReadRecOnly"
						></form-date>
						<form-textarea
							v-if="childItem.type == 'textarea'"
							v-model="childItem.value"
							:item="childItem"
							 :disabled="ReadRecOnly"
						></form-textarea>
			<view
				class="bottom-01 bg-white padding border-bottom"
							v-if="childItem.type == 'select'"
						>
							<form-select v-model="childItem.value" :item="childItem" :disabled="ReadRecOnly"></form-select>
							<view
								v-if="childItem.children && childItem.children[childItem.value]"
								class="mt20"
			>
								<view
									v-for="(selectItem, selectIndex) in childItem.children[childItem.value]"
									:key="selectIndex"
						>
									<form-sub-input
										v-if="selectItem.type == 'input'"
										v-model="selectItem.value"
										:item="selectItem"
										 :disabled="ReadRecOnly"
									></form-sub-input>
									<form-date
										v-if="selectItem.type == 'date'"
										v-model="selectItem.value"
										:item="selectItem"
										 :disabled="ReadRecOnly"
									></form-date>
								</view>
							</view>
						</view>
							</view>
				</view>
			</view>
        </view>
    </view>
</template>

<script>
import nurseOptions from '@/static/const/nurse-options'
import FormInput from '@/components/FormView/FormInput'
import FormSubInput from '@/components/FormView/FormSubInput'
import FormDate from '@/components/FormView/FormDate'
import FormTextarea from '@/components/FormView/FormTextarea'
import FormCheckbox from '@/components/FormView/FormCheckbox'
import FormSelect from '@/components/FormView/FormSelect'

let assessmentRequired;
export default {
	components: {
		FormInput,
		FormSubInput,
		FormDate,
		FormTextarea,
		FormCheckbox,
		FormSelect,
	},
	props: {
		index: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			ReadRecOnly: false,
			nurseData: [],
		}
	},
	onLoad() {
		this.init()
	},
	computed: {
	},
	methods: {
		async init(){
			let state = this.$store.state
			//是否只读
			this.ReadRecOnly = state.ReadRecOnly
			if (!this.ReadRecOnly) {
				state.assessmentData = nurseOptions[this.index]
			}
			this.nurseData = state.assessmentData
		},
		selectOption(event, item) {
            let value = event.target.value
            item.value = value
		},
		selectDate(event, item) {
			var value = event.target.value
			item.value = value
		},
		checkboxChnage(event, item) {
			var options = item.options
			var values = event.detail.value
			item.value = values

			var valueName = []
			for (let i = 0; i < options.length; i++) {
				const option = options[i]
				if (values.includes(option.value)) {
					valueName.push(option.name)
					this.$set(option, 'checked', true)
				} else {
					this.$set(option, 'checked', false)
				}
			}
		},
	}
}
</script>

<style lang="scss">
	.content{
		background-color: $uni-bg-color;
	}
	
	.part{
		background: $uni-bg-color;
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		margin-bottom: 20upx;
	}

	.padding {
		padding: 25upx 30upx;
	}

	.flexRow{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
	}

    .tj{
		margin-bottom: 0;
		padding-bottom: 0;
		.tjTitle{
			display: flex;
			flex-direction: row;
			border-bottom: 1upx solid #ebedf0;
			padding: 40upx 0;
            .left{
				flex: 1;
				text-align: left;
				font-size: $uni-font-size-base;
				font-weight: bold;
			}
			.right{
				flex: 1;
				text-align: right;
				color: $uni-text-color-grey;
			}
		}
		.tjBody{
			justify-content: flex-start;
			border-bottom: 1upx solid #f5f5f5;
		}
	}
.list{
	width:100%;border-bottom:solid 26upx #f1f1f1;
	.li{
		width:92%;height:100upx;padding:0 4%;border-bottom:solid 1upx #e7e7e7;display:flex;align-items:center;
	&.noborder{border-bottom:0}
		.icon{
			flex-shrink:0;width:50upx;height:50upx;
			image{width:50upx;height:50upx}
		}
		.text{padding-left:20upx;width:100%;color:#666}
		.to{flex-shrink:0;width:40upx;height:40upx}
	}
}
.uni-textarea textarea{
	width:auto;
	height:80px;
	background-color: #eeeff3;
}
.inline-block{
	display: inline-block
}
.to{flex-shrink:0;width:40upx;height:28upx}
input{
	text-align: right;
}
.pl20 {
	padding-left: 20px;
}
.pl10 {
	padding-left: 10px;
}

.pr20 {
	padding-right: 20px;
}

/* 列表 */
.uni-list-cell {
	position: relative;
	display: flex;
	flex-direction: row;
	// justify-content: space-between;
	justify-content: flex-start;
	align-items: center;
}
.uni-list-cell-hover {
	background-color: #eee;
}
.uni-list-cell-pd {
	padding: 22upx 30upx 22upx 0upx;
}
.uni-list-cell-left {
	font-size:28upx;
	padding: 0 30upx;
}
.uni-list-cell-db,
.uni-list-cell-right {
	flex: 1;
}
.uni-list-cell::after {
	position: absolute;
  	z-index: 3;
	right: 0;
	bottom: 0;
	left: 0rpx;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(.5);
	transform: scaleY(.5);
	background-color: #c8c7cc;
}
.uni-list .uni-list-cell:last-child::after {
	height: 0upx;
}
.bold {
	font-weight: bold;
}
</style>