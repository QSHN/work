// PICC居家护理评估表

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
        options: ['无', '是'],
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
        name: '心理状况',
        value: '',
        options: ['平静', '焦虑', '兴奋', '抑郁', '其他',],
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
        name: 'ADL',
        value: '',
        options: ['独立', '轻度依赖', '中度依赖', '完全依赖',],
    },
    {
        type: 'select',
        name: '穿刺点及周围皮肤情况',
        value: '',
        options: ['干燥', '渗液', '渗血', '红肿', '压痛', '皮疹', '其他',],
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
        name: '贴膜',
        value: '',
        options: ['完整', '松脱', '卷边', '潮湿',],
    },
    {
        type: 'date',
        name: '贴膜上次更换时间',
        value: '',
        placeholder: '请输入',
        unit: '',
    },
    {
        type: 'input',
        name: '贴膜其他',
        value: '',
        placeholder: '请输入',
        unit: '',
    },
    {
        type: 'input',
        name: '导管外露',
        value: '',
        placeholder: '请输入',
        unit: 'cm',
    },
    {
        type: 'input',
        name: '导管置入',
        value: '',
        placeholder: '请输入',
        unit: 'cm',
    },
    {
        type: 'select',
        name: '是否通畅',
        value: '',
        options: ['是', '否',],
    },
    {
        type: 'input',
        name: '上臂围',
        value: '',
        placeholder: '请输入',
        unit: 'cm',
    },
    {
        type: 'input',
        name: '左右对称',
        value: '',
        placeholder: '请输入',
        unit: '',
    },
    {
        type: 'input',
        name: '活动度',
        value: '',
        placeholder: '请输入',
        unit: '',
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
