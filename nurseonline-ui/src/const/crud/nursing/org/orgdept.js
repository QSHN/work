/* 防止选择当前及下级节点当做上级节点的验证，验证失败页面不会提示错误 */
let validateParent = (rule, value, callback) => {

  let root = tableOption.column[0].dicData[0];
  let deptId = tableOption.column[9].value;
  let parentId = value;

  /* 如果当前部门为空则不验证 */
  if (deptId === "" || deptId == null || deptId) {
    callback();
    return;
  }
  if (deptId === parentId) {
    callback(new Error("不能选择当前节点做上级节点"));
    return;
  }
  /* 获取当期节点及其所有下级节点 */
  let ids = getNode(root, deptId);

  console.log(ids);
  console.log(parentId);
  console.log(ids.includes(Number(parentId)));
  if (ids.includes(Number(parentId))) {
    callback(new Error("不能选择当前节点的下级节点做上级节点"));
    console.log("错误")
  } else {
    callback();
  }

};

//获取指定的节点
let getNode = (currentNode, nodeId) => {
  if (currentNode.deptId === nodeId) {
    var ids = [];
    getNodeIds(currentNode, ids);
    return ids;
  }
  for (let i = 0; i < currentNode.children.length; i++) {
    let ret = getNode(currentNode.children[i], nodeId);
    if (ret != null) {
      return ret;
    }
  }
  return null;
};

let getNodeIds = (node, ids) => {
  /* 保存当前节点 */
  ids.push(node.deptId);
  for (let i = 0; i < node.children.length; i++) {
    getNodeIds(node.children[i], ids);
  }
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
    //   label: '系统编码',
    //   prop: 'deptId'
    // },
    {
      label: '上级部门',
      prop: 'parentId',
      type: 'tree',
      defaultExpandAll: false,
      dicData: [],
      props: {
        children: 'children',
        label: 'deptName',
        value: 'deptId'
      },
      rules: [
        {required: true, message: '请选择部门', trigger: 'blur'},
        {validator: validateParent, trigger: 'blur'}
      ]
    },
    {
      label: '部门代码',
      prop: 'deptCode'
    },
    {
      label: '对应临床科室',
      prop: 'clinicalDeptId',
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: `/nursing/oms/aid/itemtrees/clinical_dept`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: true, message: '请选择对应临床科室', trigger: 'blur'}]
    },
    {
      label: '部门名称',
      prop: 'deptName',
      rules: [{
        required: true,
        message: '请输入部门名称'
      }]
    },
    {
      label: '部门联系人',
      prop: 'linkman'
    },
    {
      label: '部门联系电话',
      prop: 'phone'
    },
    {
      label: '部门级别，1~9',
      prop: 'level'
    },
    {
      label: '部门简介',
      prop: 'intro'
    },
    {
      label: '备注说明',
      prop: 'remark'
    },
    // {
    //   label: '是否删除',
    //   prop: 'delFlag'
    // },
    // {
    //   label: '建档人id',
    //   prop: 'creatorId'
    // },
    // {
    //   label: '建档人name',
    //   prop: 'creatorName'
    // },
    // {
    //   label: '创建时间',
    //   prop: 'createTime'
    // },
    // {
    //   label: '修改时间',
    //   prop: 'updateTime'
    // },
    {
      label: '所属机构id',
      prop: 'orgId',
      hide: true,
      value: "",
      display: false
    },
    // {
    //   label: '版本号',
    //   prop: 'versionNo',
    //   hide: true,
    //   display: false
    // },
  ]
}
