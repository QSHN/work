// 导管居家护理评估表

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

const common = {
    date: {
        type: 'date',
        name: '置管时间',
        value: '',
    },
    complication: {
        type: 'select',
        name: '合并症',
        value: '',
        options: ['无', '有',],
        children: {
            '1': [
                {
                    type: 'input',
                    name: '',
                    placeholder: '请输入',
                }
            ]
        }
    },
    texture: {
        type: 'select',
        name: '材质',
        value: '',
        options: ['硅胶', '橡胶', '其他',],
        children: {
            '2': [
                {
                    type: 'input',
                    name: '',
                    placeholder: '请输入',
                }
            ]
        }
    },
    expedite: {
        type: 'select',
        name: '是否通畅',
        value: '',
        options: ['是', '否',],
    },
    length: {
        type: 'input',
        name: '外露长度',
        value: '',
        unit: 'cm',
        placeholder: '请输入',
    }
}

const copyObject = function(data) {
    let s = JSON.stringify(data)
    return JSON.parse(s)
}

// 胃管
const stomachTube = {
    type: 'text',
    name: '胃管',
    children: [
        copyObject(common.date),
        {
            type: 'input',
            name: '胃管型号',
            value: '',
            placeholder: '请输入',
        },
        copyObject(common.length),
        copyObject(common.expedite),
        {
            type: 'select',
            name: '置管部位',
            value: '',
            options: ['左鼻腔', '右鼻腔', '口腔',],
        },
        copyObject(common.texture),
        {
            type: 'select',
            name: '置管目的',
            value: '',
            options: ['管饲', '引流', '其他',],
            children: {
                '2': [
                    {
                        type: 'input',
                        name: '',
                        placeholder: '请输入',
                    }
                ]
            }
        },
        copyObject(common.complication),
        {
            type: 'textarea',
            name: '主要护理问题及处理',
            value: '',
            placeholder: '请输入内容',
        },
    ]
}
// 尿管
const ureter = {
    type: 'text',
    name: '尿管',
    children: [
        copyObject(common.date),
        {
            type: 'input',
            name: '尿管型号',
            value: '',
            placeholder: '请输入',
        },
        copyObject(common.length),
        copyObject(common.texture),
        {
            type: 'select',
            name: '尿管通畅',
            value: '',
            options: ['是', '否',],
        },
        {
            type: 'select',
            name: '尿液颜色',
            value: '',
            options: ['澄清', '黄色', '橙色', '血尿', '茶色', '混浊',],
        },
        {
            type: 'select',
            name: ' 沉淀物',
            value: '',
            options: ['无', '有',],
        },
        {
            type: 'select',
            name: ' 管道（尿管尿道口处）外渗 ',
            value: '',
            options: ['经常', '偶尔', '否',],
        },
        copyObject(common.complication),
        {
            type: 'textarea',
            name: '主要护理问题及处理',
            value: '',
            placeholder: '请输入内容',
        },
    ]
}
// 造瘘管
const makeFistula = {
    type: 'text',
    name: '造瘘管',
    children: [
        copyObject(common.date),
        {
            type: 'input',
            name: '导管型号',
            value: '',
            placeholder: '请输入',
        },
        copyObject(common.length),
        {
            type: 'select',
            name: '置管部位',
            value: '',
            options: ['左上腹', '右上腹', '左下腹', '右下腹', '其他部位',],
            children: {
                '4': [
                    {
                        type: 'input',
                        name: '',
                        placeholder: '请输入',
                    }
                ]
            }
        },
        copyObject(common.texture),
        copyObject(common.expedite),
        {
            type: 'select',
            name: '管饲方式',
            value: '',
            options: ['注射器', '重力滴注', '其他',],
            children: {
                '2': [
                    {
                        type: 'input',
                        name: '',
                        placeholder: '请输入',
                    }
                ]
            }
        },
        copyObject(common.complication),
        {
            type: 'textarea',
            name: '主要护理问题及处理',
            value: '',
            placeholder: '请输入内容',
        },
    ]
}
// 填写管道
const otherTube = {
    type: 'text',
    value: '',
    unit: '管',
    placeholder: '请输入',
    children: [
        copyObject(common.date),
        {
            type: 'input',
            name: '导管型号',
            value: '',
            placeholder: '请输入',
        },
        copyObject(common.length),
        {
            type: 'select',
            name: '置管部位',
            value: '',
            options: ['左上腹', '右上腹', '左下腹', '右下腹', '左胸', '右胸', '其他部位',],
            children: {
                '6': [
                    {
                        type: 'input',
                        name: '',
                        placeholder: '请输入',
                    }
                ]
            }
        },
        copyObject(common.texture),
        copyObject(common.expedite),
        {
            type: 'select',
            name: '引流液性质',
            value: '',
            options: ['血性', '脓性', '脓血性', '乳白色', '墨绿色', '褐色', '淡红色', '淡黄色', '其他性质',],
            children: {
                '8': [
                    {
                        type: 'input',
                        name: '',
                        placeholder: '请输入',
                    }
                ]
            }
        },
        copyObject(common.complication),
        {
            type: 'textarea',
            name: '主要护理问题及处理',
            value: '',
            placeholder: '请输入内容',
        },
    ]
}

const otherArray = [
    {
        type: 'select',
        name: '意识状态',
        value: '',
        options: ['清醒', '模糊', '混乱', '健忘', '嗜睡', '昏迷',],
    },
    {
        type: 'select',
        name: '饮食',
        value: '',
        options: ['经口饮食', '鼻胃管灌', '胃造口',],
    },
    {
        type: 'select',
        name: '排尿',
        value: '',
        options: ['正常', '失禁', '尿频', '尿急', '尿痛', '尿潴留', '尿路造口', '穿纸尿裤', '使用尿套', '留置尿管', '间导', '其他', ],
        children: {
            '11': [
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
        name: '排便',
        value: '',
        options: ['软便', '硬便', '烂便', '稀便', '腹泻', '便秘', '便失禁', '肠造口', '其他',],
        children: {
            '8': [
                {
                    type: 'input',
                    name: '',
                    value: '',
                    placeholder: '请输入',
                }
            ],
            '5': [
                {
                    type: 'input',
                    name: '',
                    value: '',
                    placeholder: '请输入',
                    unit: '次/天',
                }
            ],
            '86': [
                {
                    type: 'input',
                    name: '',
                    value: '',
                    placeholder: '请输入',
                    unit: '次/天',
                }
            ],
        },
    },
    {
        type: 'select',
        name: '慢性疾病',
        value: '',
        options: ['高血压', '心脏病', '中风', '吞咽障碍', '其他',],
        children: {
            '2': [
                {
                    type: 'date',
                    name: '最近一次日期',
                    value: '',
                }
            ],
            '4': [
                {
                    type: 'input',
                    name: '',
                    value: '',
                    placeholder: '请输入',
                }
            ],
        },
    },
    stomachTube,
    ureter,
    makeFistula,
    otherTube,
]

options = options.concat(otherArray)

export default options
