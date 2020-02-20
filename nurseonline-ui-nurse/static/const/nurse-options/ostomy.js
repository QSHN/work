// 造口居家护理评估表

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
]

let options = []

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
        name: '呼之',
        value: '',
        options: ['能应', '不应',],
    },
    {
        type: 'select',
        name: '对答',
        value: '',
        options: ['不切题', '切题', '不对答',],
    },
    {
        type: 'select',
        name: '意识',
        value: '',
        options: ['清醒', '模糊', '嗜睡', '昏迷',],
    },
    {
        type: 'select',
        name: '心理状况',
        value: '',
        options: ['平静', '开朗', '焦虑', '激惹', '悲哀', '抑郁', '其他',],
        children: {
            '6': [
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
        name: '造口位置情况',
        value: '',
        options: ['乙状结肠造口', '回肠造口', '横结肠造口', '尿路造口', '其他',],
        children: {
            '4': [
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
        name: '排泄（大便性状）',
        value: '',
        options: ['水状', '糊状', '稀便', '成形便', '其他',],
        children: {
            '4': [
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
        name: '排泄颜色',
        value: '',
        options: ['黄色', '血便', '其他',],
        children: {
            '2': [
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
        name: '造口粘膜颜色',
        value: '',
        options: ['牛肉色', '暗红', '紫红色', '黑色', '苍白', '其他',],
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
        type: 'input',
        name: '造口粘膜高度',
        value: '',
        placeholder: '请输入',
        unit: 'CM',
    },
    {
        type: 'input',
        name: '造口粘膜大小',
        value: '',
        placeholder: '请输入',
        unit: 'CM',
    },
    {
        type: 'select',
        name: '造口粘膜水肿',
        value: '',
        options: ['是', '否',],
    },
    {
        type: 'select',
        name: '造口粘膜（粘膜分离）',
        value: '',
        options: ['是', '否',],
        children: {
            '0': [
                {
                    type: 'input',
                    name: '',
                    value: '',
                    placeholder: '请输入',
                    unit: '（几点方向分离，大小深度）',
                }
            ]
        },
    },
    {
        type: 'select',
        name: '造口周围皮肤情况',
        value: '',
        options: ['正常', '造口皮炎',],
    },
    {
        type: 'select',
        name: '造口常见并发症及相关并发症情况',
        value: '',
        options: ['造口回缩', '造口出血', '造口坏死', '造口狭窄', '造口脱垂', '造口旁疝', '粪水性皮炎 ', '过敏性皮炎', '尿酸结晶 ',],
    },
    {
        type: 'checkbox',
        name: 'ADL自理能力',
        value: '',
        options: [
            {
                value: '1',
                name: '自理'
            },
            {
                value: '2',
                name: '进食自理'
            },
            {
                value: '3',
                name: '穿衣自理'
            },
            {
                value: '4',
                name: '行走自理'
            },
            {
                value: '5',
                name: '如厕自理'
            },
            {
                value: '6',
                name: '沐浴自理'
            },
            {
                value: '7',
                name: '转移自理'
            },
            {
                value: '8',
                name: '完全不能自理'
            },
        ],
    },
    {
        type: 'select',
        name: '活动能力',
        value: '',
        options: ['自理', '卧床', '轮椅', '拐杖', '三脚架', '四脚架', '行走架', '其他',],
        children: {
            '7': [
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
        name: '平衡&步态',
        value: '',
        options: ['不能确定', '平稳', '摇晃',],
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
        name: '皮肤及其他(完整性)',
        value: '',
        options: ['完整', '伤口',],
        children: {
            '1': [
                {
                    type: 'input',
                    name: '部位',
                    value: '',
                    placeholder: '请输入',
                },
                {
                    type: 'input',
                    name: '范围',
                    value: '',
                    placeholder: '请输入',
                },
                {
                    type: 'input',
                    name: '性质',
                    value: '',
                    placeholder: '请输入',
                },
            ]
        },
    },
    {
        type: 'select',
        name: '皮肤及其他(压疮)',
        value: '',
        options: ['无', '有',],
        children: {
            '1': [
                {
                    type: 'input',
                    name: 'Norton压疮危险因素评分',
                    value: '',
                    placeholder: '请输入',
                },
            ]
        },
    },
    {
        type: 'textarea',
        name: '其他情况',
        value: '',
        placeholder: '请输入内容',
    },
    {
        type: 'textarea',
        name: '主要问题及指导',
        value: '',
        placeholder: '请输入内容',
    },
]

options = options.concat(otherArray)

export default options
