const pList = [
  {
    id: '1',
    label: '汇总表',
    children: [
      {
        id: '1-1',
        label: '查看权',
        children: [
          {
            id: '1-1-1',
            label: '查看自己的数据'
          },
          {
            id: '1-1-2',
            label: '查看自己和下属的数据'
          },
          {
            id: '1-1-3',
            label: '查看所有数据'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    label: '采购',
    children: [
      {
        id: '2-1',
        label: '采购合同',
        children: [
          {
            id: '2-1-1',
            label: '管理权',
            children: [
              {
                id: '2-1-1-1',
                label: '新增'
              },
              {
                id: '2-1-1-2',
                label: '修改'
              },
              {
                id: '2-1-1-3',
                label: '审核'
              },
              {
                id: '2-1-1-4',
                label: '反审核'
              },
              {
                id: '2-1-1-5',
                label: '删除'
              },
              {
                id: '2-1-1-6',
                label: '自定义'
              },
              {
                id: '2-1-1-7',
                label: '导出'
              }
            ]
          },
          {
            id: '2-1-2',
            label: '查看权'
          }
        ]
      },
      {
        id: '2-2',
        label: '采购订单',
        children: [
          {
            id: '2-2-1',
            label: '管理权',
            children: [
              {
                id: '2-2-1-1',
                label: '新增'
              },
              {
                id: '2-2-1-2',
                label: '修改'
              },
              {
                id: '2-2-1-3',
                label: '审核'
              },
              {
                id: '2-2-1-4',
                label: '反审核'
              },
              {
                id: '2-2-1-5',
                label: '删除'
              },
              {
                id: '2-2-1-6',
                label: '自定义'
              }
            ]
          },
          {
            id: '2-2-2',
            label: '查看权'
          }
        ]
      },
      {
        id: '2-3',
        label: '采购列表',
        children: [
          {
            id: '2-3-1',
            label: '管理权',
            children: [
              {
                id: '2-3-1-1',
                label: '自定义'
              },
              {
                id: '2-3-1-2',
                label: '导出'
              }
            ]
          },
          {
            id: '2-3-2',
            label: '查看权',
            children: [
              {
                id: '2-3-2-1',
                label: '查看自己的采购订单和合同'
              },
              {
                id: '2-3-2-2',
                label: '查看自己和下属的采购订单和合同'
              },
              {
                id: '2-3-2-3',
                label: '查看所有采购订单和合同'
              }
            ]
          }
        ]
      },
      {
        id: '2-4',
        label: '采购明细列表',
        children: [
          {
            id: '2-4-1',
            label: '管理权',
            children: [
              {
                id: '2-4-1-1',
                label: '自定义'
              },
              {
                id: '2-4-1-2',
                label: '导出'
              }
            ]
          },
          {
            id: '2-4-2',
            label: '查看权',
            children: [
              {
                id: '2-4-2-1',
                label: '查看自己的采购订单和合同'
              },
              {
                id: '2-4-2-2',
                label: '查看自己和下属的采购订单和合同'
              },
              {
                id: '2-4-2-3',
                label: '查看所有采购订单和合同'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '3',
    label: '基础资料',
    children: []
  },
  {
    id: '4',
    label: '账号管理',
    children: [
      {
        id: '4-1',
        label: '员工账号',
        children: [
          {
            id: '4-1-1',
            label: '管理权',
            children: [
              {
                id: '4-1-1-1',
                label: '新增'
              },
              {
                id: '4-1-1-2',
                label: '修改'
              },
              {
                id: '4-1-1-3',
                label: '启用'
              },
              {
                id: '4-1-1-4',
                label: '禁用'
              },
              {
                id: '4-1-1-5',
                label: '解锁'
              },
              {
                id: '4-1-1-6',
                label: '删除'
              },
              {
                id: '4-1-1-7',
                label: '自定义'
              }
            ]
          },
          {
            id: '4-1-2',
            label: '查看权'
          }
        ]
      },
      {
        id: '4-2',
        label: '客户账号',
        children: [
          {
            id: '4-2-1',
            label: '管理权',
            children: [
              {
                id: '4-2-1-1',
                label: '新增'
              },
              {
                id: '4-2-1-2',
                label: '修改'
              },
              {
                id: '4-2-1-3',
                label: '启用'
              },
              {
                id: '4-2-1-4',
                label: '禁用'
              },
              {
                id: '4-2-1-5',
                label: '解锁'
              },
              {
                id: '4-2-1-6',
                label: '删除'
              },
              {
                id: '4-2-1-7',
                label: '自定义'
              }
            ]
          },
          {
            id: '4-2-2',
            label: '查看权'
          }
        ]
      }
    ]
  },
  {
    id: '5',
    label: '权限管理',
    children: [
      {
        id: '5-1',
        label: '管理权'
      },
      {
        id: '5-2',
        label: '查看权'
      }
    ]
  },
  {
    id: '6',
    label: '系统设置',
    children: [
      {
        id: '6-1',
        label: '管理权'
      },
      {
        id: '6-2',
        label: '查看权'
      }
    ]
  },
  {
    id: '7',
    label: '个人资料',
    children: [
      {
        id: '7-1',
        label: '管理权'
      },
      {
        id: '7-2',
        label: '查看权'
      }
    ]
  },
]

const expanded = [
  '1',
  '2', '2-1', '2-1-1', '2-2', '2-2-1', '2-3', '2-3-1', '2-3-2',
  '3', '3-1',
  '4', '4-1', '4-1-1', '4-2', '4-2-1',
  '5',
  '6',
  '7'
]

const checked = [
  '7', '7-1', '7-2'
]

const permission = {
  pList,
  expanded: expanded,
  checked: checked
}

module.exports = {
  permission
}