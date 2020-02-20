
const baseUrl = `/nursing`
const treeUrl = `${baseUrl}/oms/aid/itemtrees`
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 200,
  align: 'center',
  maxWidth: 380,
  maxHeight: 520,
  size: 'small',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
    {
      fixed: true,
      label: '服务Id',
      hide: true,
      prop: 'id',
      editDisabled: true,
      addDisplay: false
    },
    {
      label: '知情书名称',
      prop: 'name',
      // width: 200,
      // search: true,
      overHidden: true,
      rules: [{
        required: true,
        message: '请输入知情书名称'
      }]
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd',
      width: 100,
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      addDisplay: false,
      editDisplay: false
    },
  ]
}
