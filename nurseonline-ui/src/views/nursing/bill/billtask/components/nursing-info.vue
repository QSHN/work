<template>
	<div class="nursing-info">
		<el-dialog :visible.sync="showModal" title="护理记录详情" width="1150px">
			<div v-loading="loading" style="overflow:hidden;">
        <div v-if="dt">
					<div class="part" v-for="(part, i) in initData" :key="i">
						<div class="part-title">{{part.title}}</div>
						<div class="part-cnt">
							<template v-if="part.obj">
                <template v-if="!((part.prop == 'assessmentRequiredData') && dt.assessmentRequiredData.otherData && (dt.assessmentRequiredData.otherData.length > 0))">
                  <div :class="['part-item', item.type ? 'form-row' : '']" v-for="(item, key) in part.data" :key="key">
                    <i>{{item.title || item}}：</i>
                    <span v-if="dics[key]">{{dics[key][dt[part.prop][key]]}}</span>
                    <span v-else :title="dt[part.prop][key]">{{dt[part.prop][key]}}</span>
                  </div>
                </template>
                <template v-else>
                  <div :class="['part-item', verifyType.row.includes(item.type) ? 'form-row' : '']" v-for="(item, key) in dt.assessmentRequiredData.otherData" :key="key">
                    <template v-if="item.type != 'text'">
                      <i>{{item.name}}：</i>
                      <span :title=" transitionValue(item)">{{ transitionValue(item) }}</span>
                    </template>
                    <template v-else>
                      <fieldset>
                        <legend>{{item.name}}{{item.value}}{{item.unit}}</legend>
                        <div :class="['part-item', childItem.type == 'textarea' ? 'form-row' : '']" v-for="(childItem, childKey) in item.children" :key="childKey">
                            <i>{{childItem.name}}：</i>
                            <span :title=" transitionValue(childItem)">{{ transitionValue(childItem) }}</span>
                        </div>
                      </fieldset>
                    </template>
                  </div>
                </template>
							</template>
							<template v-else>
								<div :class="['part-item', item.type ? 'form-row' : '']" v-for="(item, key) in part.data" :key="key">
									<i>{{item.title || item}}：</i>
									<span v-if="dics[key]">{{dics[key][dt[key]]}}</span>
									<span class="form-img" v-else-if="item.type === 'img' && dt[key]">
										<div v-for="(item, index) in dt[key].split(';')" :key="index">
											<img :src="item"/>
										</div>
									</span>
									<span v-else :title="dt[key]">{{dt[key]}}</span>
								</div>
							</template>
						</div>
					</div>
				</div>
				<div v-else>暂无记录</div>
			</div>
			<div slot="footer"><el-button @click="showModal = false;">取消</el-button></div>
		</el-dialog>
	</div>
</template>

<script>
	import {getNurserec} from "@/api/nursing/nurserec/nurserec"
	// import {getDics} from "@/util/util"

	export default {
		name: "nursingInfo",
		data(){
			return {
				showModal: false,
				dt: null,
				loading: false,
				dics: {
					sex: {"0": "不填", "1": "男", "2": "女"}
				},
				initData: [{
					title: "服务对象基本信息",
					data: {
						custName: "姓名",
						sex: "性别",
						age: "年龄",
						idNo: "身份证号",
						mainDiagnosis: {title: "主要诊断", type: "textarea"},
						mainSymptom: {title: "目前症状", type: "textarea"},
						serviceContent: {title: "服务内容", type: "textarea"}
					}
				}, {
					title: "个人及家庭情况",
					prop: "personalAndFamilyData",
					obj: true,
					data: {
						home_address: "家庭住址",
						phone: "电话",
						elevator: "电梯",
						education: "教育程度",
						info_source: "资源来源",
						language: "常用语言",
						diet: "饮食",
						family_support: "家庭支持",
						caregiver: "日常照顾者",
						smoking: "吸烟",
						// checkTime: "支/天",
						// checkTime: "烟龄",
						// checkTime: "运动",
						movement_type: "运动种类",
						payment_method: "支付方式",
						allergic_history: "过敏史",
						allergic_history_drug: "过敏药物",
						allergic_history_food: "过敏食物",
						diseaseHistory: "既往史"
					}
				}, {
					title: "护理评估（必填）",
					prop: "assessmentRequiredData",
					obj: true,
					data: {
						temperature: "T(℃ )",
						pulse: "P(次/分)",
						respiratory: "R(次/分)",
						blood_pressure: "BP(mmHg)",
						language_expression: "语言表达",
						mind: "神志",
						complexion: "皮肤颜色"
					}
				}, {
					title: "护理评估（选填）",
					prop:　"assessmentOptionData",
					obj: true,
					data: {
						psychological_status: "心理状况",
						sleep_state: "睡眠时间(h/日)",
						sleep_position: "睡眠体位",
						sleep_state: "睡眠状态",
						applicantIdNo: "服用安眠药频率",
						relationForCust: "安眠药",
						move_by: "移动",
						walking_aids: "辅助器械",
						activities_of_daily_living: "ADL",
						balance_and_gait: "平衡和步态",
						muscle_strength: "肢体肌体情况",
						// custAddress: "身体部位",
						body_type: "体型",
						blood_glucose_value: "血糖值(mmol/L)",
						blood_glucose_time: "血糖时间",
						eating_problem: "进食困难",
						urination_color: "小便颜色",
						special_diet: "特殊饮食",
						avoid_foods: "避免饮食",
						urination_sediment: "小便沉淀物",
						defecating: "排便情况",
						// custAddress: "造口名称",
						defecating_habit: "排便习惯（次/日）",
						defecating_fecal: "粪便性状",
						urination_stoma: "排尿情况",
						// custAddress: "造口名称",
						medication: "服务药物",
					  medication_compliance: "服药依从性",
						skin_integrity: "皮肤完整性",
						// custAddress: "尿管/尿套号",
						urination_catheter: "尿管/尿套更换日期",
						// custAddress: "皮肤伤口部位"
					}
				}, {
					title: "评估人信息",
					data: {
						visitingTime: "探访时间",
						recordingTime: "记录时间",
						staffName: "访视护士"
						// avgPrice: "审核人"
					}
				}, {
					title: "服务完成情况",
					data: {
						finishTime: "完成时间",
						consumables: "使用材料",
						finishedRecord: "简单描述",
						imgUrl: {title: "相关图片", type: "img"}
					}
				}, {
					title: "确认信息",
					data: {
						// itemAmt: "患者或家属确认签名",
						// discountAmt: "评价"
					}
        }],
        verifyType: {
          text: ['input', 'textarea',],
          row: ['textarea', 'text'],
          select: ['select', 'checkbox'],
        },
			}
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			taskId: [String, Number]
		},
		watch: {
			showModal(val){
				if(val === false){
					this.$emit("input", val);
				}else{
					console.log("watch")
					this.loading = true;
					this.dt = null;
					getNurserec(this.taskId).then(res => {
						if(res.data && res.data.data){
							let dt = res.data.data;
							dt.personalAndFamilyData = JSON.parse(dt.personalAndFamily);
							dt.assessmentRequiredData = JSON.parse(dt.assessmentRequired);
              dt.assessmentOptionData = JSON.parse(dt.assessmentOption);
							this.dt = dt;
							console.log("dt", this.dt);
						}
						this.loading = false;
					}).catch(err => {
						this.loading = false;
					});
					// this.getCodes();
				}
			},
			value(val){
				this.showModal = val;
			}
		},
    methods: {
      transitionValue(item) {
        let type = item.type
        let value = ''
        switch(type) {
          case 'input':
            value = item.value
            if (item.unit) {
              value += ` ${item.unit}`
            }
            break
          case 'select':
            value = item.options[item.value]
            let index = item.value.toString()

            let children = item.children && item.children[index]
            let childValue = this.transitionChildValue(children, value)

            if (value == '其他') {
              value = childValue
            } else {
              value += childValue
            }
            break
          case 'checkbox':
            for (let o of item.options) {
              if (item.value.includes(o.value)) {
                if (value !== '') {
                  value += '、'
                }
                value += o.name
              }
            }
            break
          default:
            value = item.value
            break
        }
        return value
      },
      transitionChildValue(options, parentValue) {
        let value = ''

        if (options) {
          for (let i = 0; i < options.length; i++) {
            const o = options[i]

            if (value != '') {
              value += '，'
            }

            let name = o.name
            let childValue = `${o.value}${o.unit || ''}`
            if (name != '') {
              childValue = `${o.name}: ${o.value}${o.unit || ''}`
            }
            value += childValue
          }
          if (parentValue != '其他') {
            value = `（${value}）`
          }
        }

        return value
      },
    },
		// mounted(){
		// 	this.getCodes();
		// },
		// methods: {
		// 	getCodes(){
		// 		getDics(this.dics);
		// 	// 	for(let key in this.dics){
		// 	// 		if(JSON.stringify(this.dics[key]) === "{}"){
		// 	// 			fetchTreeByItemClassCode(key).then(res => {
		// 	// 				if(res.data && res.data.data){
		// 	// 					let obj = {};
		// 	// 					res.data.data.forEach(item => {
		// 	// 						obj[item.itemId] = item.itemName;
		// 	// 					});
		// 	// 					this.dics[key] = obj;
		// 	// 				}
		// 	// 			}).catch();
		// 	// 		}
		// 	// 	}
		// 	}
		// }
	}
</script>

<style lang="scss" scoped>
	.nursing-info{
		.part{
			overflow: hidden;
			.part-title{
				font-weight: 600;
				line-height: 30px;
				margin-bottom: 10px;
			}
			.part-cnt{
				overflow: hidden;
				margin-bottom: 20px;
				// min-height: 180px;
			}
			.part-item{
				float: left;
				width: 33.3%;
				height: 26px;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				&>i{
					font-style: normal;
					display: inline-block;
					min-width: 100px;
					text-align: right;
					margin-right: 10px;
				}
				&.form-row{
					float: none;
					clear: both;
					width: 100%;
					height: auto;
					white-space: normal;
					margin-bottom: 10px;
					&>i{
						float: left;
					}
					&>span{
						margin-left: 90px;
						display: block;
					}
				}
				.form-img{
					img{
						max-width: 100%;
					}
					&>div {
						float: left;
						width: 18%;
						margin: 5px;
					}
				}
			}
		}
	}
</style>
