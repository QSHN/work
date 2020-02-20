const treeUrl = `/nursing/oms/aid/itemtrees`
const allOrgUrl = `/nursing/oms/org/all`;

let validateOptions = (rule, value, callback) => {
  let values = value.split("\n");

  values = values.map(v => v.trim());
  values = values.filter(v => v);

  values.forEach(v => {
    if (v.match("-|##")) {
      callback(new Error('不允许包含“-”和“##”字符!'));
      return;
    }
  });

  if (values.length < 2) {
    callback(new Error('选项必须一个以上!'));
    return;
  }

  if (values.length > 26) {
    callback(new Error('选项不支持26个以上!'));
    return;
  }
  callback();
};

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
    // {
    //   label: '系统id',
    //   prop: 'questionId'
    // },
    {
      label: '题目序号',
      prop: 'questionNo',
      rules: [{
        required: true,
        message: '请输入序号'
      }]
    },
    {
      label: '所属机构',
      prop: 'orgName',
      disabled: true,
      addDisplay: false
    },
    {
      label: '服务人员类别',
      prop: 'staffType',
      type: 'select',
      dicUrl: `${treeUrl}/staff_type`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: true, message: '请选择服务人员类别', trigger: 'blur'}]
    },
    {
      label: '题目级别',
      prop: 'level',
      type: 'select',
      dicUrl: `${treeUrl}/question_level`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: true, message: '请选择题目级别', trigger: 'blur'}]
    },
    {
      label: '标题',
      prop: 'title',
      type: "textarea",
      rules: [{
        required: true,
        message: '请输入标题'
      }]
    },
    {
      label: '描述',
      hide: true,
      type: "textarea",
      prop: 'descr'
    },
    {
      label: '选项',
      hide: true,
      prop: 'options',
      type: "textarea",
      placeholder: "请输入选项，每行代表一个选项，空行会自动忽略",
      // change: validateOptions,
      rules: [{
        required: true,
        message: '请输入选项，每行代表一个选项'
      },
        {validator: validateOptions, trigger: 'blur'},]
    },
    {
      label: '参考答案',
      hide: true,
      prop: 'answer',
      rules: [{
        required: true,
        message: '请输入参考答案'
      }]
    },
    {
      label: '分值',
      prop: 'score',
      rules: [{
        required: true,
        message: '请输入分值'
      }]
    },
    // {
    //   label: '是否删除',
    //   prop: 'delFlag'
    // },
    {
      label: '创建时间',
      prop: 'createTime'
    },
  ]
};
