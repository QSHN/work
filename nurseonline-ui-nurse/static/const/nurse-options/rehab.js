// 康复治疗居家护理评估表

const inputArray = [
    {
        name: 'T（体温）',
        unit: '℃',
    },
    {
        name: 'P（脉搏）',
        unit: '次/分',
    },
    {
        name: 'R（呼吸）',
        unit: '次/分',
    },
    {
        name: 'BP（血压）',
        unit: 'mmHg',
    },
    {
        name: 'SaO2',
        unit: '%',
    },
    {
        name: '随机血糖',
        unit: 'mmol/L',
    },
]

let options = [
    {
        type: 'select',
        name: '既往病史',
        value: '',
        options: ['高血压', '糖尿病', '冠心病', '心房纤颤', '其他',],
        children: {
            '4': [
                {
                    type: 'input',
                    name: '',
                    value: '',
                    placeholder: '请输入',
                    unit: '',
                }
            ]
        },
    },
]

for (let item of inputArray) {
    let option = {
        type: 'input',
        name: item.name,
        value: '',
        placeholder: '请输入',
        unit: item.unit,
    }
    options.push(option)
}

const otherArray = [
    {
        type: 'select',
        name: '过敏史',
        value: '',
        options: ['无', '有'],
        children: {
            '1': [
                {
                    type: 'input',
                    name: '',
                    value: '',
                    placeholder: '请输入',
                    unit: '',
                }
            ]
        },
    },
    {
        type: 'select',
        name: '意识状况',
        value: '',
        options: ['清醒', '模糊', '嗜睡', '昏迷',],
    },
    {
        type: 'select',
        name: '用药依从性',
        value: '',
        options: ['好', '差',],
    },
    {
        type: 'select',
        name: '心理状况',
        value: '',
        options: ['平稳', '焦虑', '兴奋 ', '抑郁', '其他',],
        children: {
            '4': [
                {
                    type: 'input',
                    name: '',
                    value: '',
                    placeholder: '请输入',
                    unit: '',
                }
            ]
        },
    },
    {
        type: 'select',
        name: '最近三个月有无跌倒',
        value: '',
        options: ['无', '有',],
        children: {
            '1': [
                {
                    type: 'input',
                    name: '跌倒评分',
                    value: '',
                    placeholder: '请输入',
                    unit: '分',
                }
            ]
        },
    },
    {
        type: 'select',
        name: '皮肤状况',
        value: '',
        options: ['完整', '苍白', '黄疸', '潮红', '发绀', '出血点', '压疮', '破损', '水肿', '皮疹',],
        children: {
            '6': [
                {
                    type: 'input',
                    name: '压疮风险评分',
                    value: '',
                    placeholder: '请输入',
                }
            ]
        },
    },
    {
        type: 'select',
        name: '吞咽功能',
        value: '',
        options: ['正常', '吞咽困难',],
    },
    {
        type: 'select',
        name: '进食方式',
        value: '',
        options: ['留置胃管', '间歇置管', '普食', '半流', '糊餐', '浓流质', '稀流质',],
    },
    {
        type: 'input',
        name: '身高',
        value: '',
        placeholder: '请输入',
        unit: 'm',
    },
    {
        type: 'input',
        name: '体重',
        value: '',
        placeholder: '请输入',
        unit: 'Kg',
    },
    {
        type: 'input',
        name: 'BMI',
        value: '',
        placeholder: '请输入',
        unit: 'kg/m²',
    },
    {
        type: 'input',
        name: 'NRS-2000/MNA-SF评分',
        value: '',
        placeholder: '请输入',
        unit: '分',
    },
    {
        type: 'select',
        name: '言语功能',
        value: '',
        options: ['可表达', '不能表达', '不能理解和表达',],
    },
    {
        type: 'checkbox',
        name: '四肢活动',
        value: '',
        options: [
            {
                value: '1',
                name: '自如'
            },
            {
                value: '2',
                name: '无力'
            },
            {
                value: '3',
                name: '左上肢偏瘫'
            },
            {
                value: '4',
                name: '左下肢偏瘫'
            },
            {
                value: '5',
                name: '右上肢偏瘫'
            },
            {
                value: '6',
                name: '右下肢偏瘫'
            },
            {
                value: '7',
                name: '截瘫'
            },
            {
                value: '8',
                name: '全瘫'
            },
        ],
    },
    {
        type: 'select',
        name: '活动能力',
        value: '',
        options: ['独立活动', '拐杖', '三脚架', '四脚架', '行走架', '轮椅', '其他', '他人协助', '完全依赖',],
        children: {
            '6': [
                {
                    type: 'input',
                    name: '',
                    value: '',
                    placeholder: '请输入',
                }
            ]
        },
    },
    {
        type: 'checkbox',
        name: '视力',
        value: '',
        options: [
            {
                value: '1',
                name: '正常'
            },
            {
                value: '2',
                name: '模糊'
            },
            {
                value: '3',
                name: '复视'
            },
            {
                value: '4',
                name: '左眼视野缺损'
            },
            {
                value: '5',
                name: '右眼视野缺损'
            },
            {
                value: '6',
                name: '戴镜'
            },
            {
                value: '7',
                name: '左盲'
            },
            {
                value: '8',
                name: '右盲'
            },
        ],
    },
    {
        type: 'checkbox',
        name: '听力',
        value: '',
        options: [
            {
                value: '1',
                name: '正常'
            },
            {
                value: '2',
                name: '差'
            },
            {
                value: '3',
                name: '左耳聋'
            },
            {
                value: '4',
                name: '右耳聋'
            },
            {
                value: '5',
                name: '左助听器'
            },
            {
                value: '6',
                name: '右助听器'
            },
        ],
    },
    {
        type: 'checkbox',
        name: '感觉',
        value: '',
        options: [
            {
                value: '1',
                name: '正常'
            },
            {
                value: '2',
                name: '左上肢障碍'
            },
            {
                value: '3',
                name: '左下肢障碍'
            },
            {
                value: '4',
                name: '右上肢障碍'
            },
            {
                value: '5',
                name: '右下肢障碍'
            },
        ],
    },
    {
        type: 'input',
        name: 'ADL',
        value: '',
        placeholder: '请输入',
        unit: '分',
    },
    {
        type: 'select',
        name: '排尿',
        value: '',
        options: ['失禁', '包尿片', '尿套', '尿管',],
        children: {
            '3': [
                {
                    type: 'date',
                    name: '留置时间',
                    value: '',
                    placeholder: '请输入',
                }
            ]
        },
    },
    {
        type: 'select',
        name: '排便',
        value: '',
        options: ['失禁', '便秘', '腹泻',],
        children: {
            '1': [
                {
                    type: 'input',
                    name: '次数',
                    value: '',
                    placeholder: '请输入',
                    unit: '次/天',
                }
            ],
            '2': [
                {
                    type: 'input',
                    name: '次数',
                    value: '',
                    placeholder: '请输入',
                    unit: '次/天',
                }
            ],
        },
    },
    {
        type: 'select',
        name: '睡眠',
        value: '',
        options: ['好', '差',],
        children: {
            '1': [
                {
                    type: 'input',
                    name: '需服药',
                    value: '',
                    placeholder: '请输入',
                }
            ]
        },
    },
    {
        type: 'select',
        name: '认知',
        value: '',
        options: ['正常', '短期记忆受损', '长期记忆受损', '痴呆',],
    },
    {
        type: 'select',
        name: '日常照顾者',
        value: '',
        options: ['自我照顾', '父母', '配偶', '子女', '保姆', '其他',],
        children: {
            '5': [
                {
                    type: 'input',
                    name: '',
                    value: '',
                    placeholder: '请输入',
                }
            ]
        },
    },
    {
        type: 'select',
        name: '对患者康复期望',
        value: '',
        options: ['无', '低', '中', '高',],
    },
    {
        type: 'select',
        name: '照顾技能',
        value: '',
        options: ['无', '低', '中', '高',],
    },
    {
        type: 'textarea',
        name: '其他情况',
        value: '',
        placeholder: '请输入内容',
    },
    {
        type: 'textarea',
        name: '主要问题及处理',
        value: '',
        placeholder: '请输入内容',
    },
]

options = options.concat(otherArray)

export default options
