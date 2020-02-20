const assets = [
  {
    A: {
      align: 'center',
      val: '资产',
      type: 'title'
    },
    B: {
      align: 'center',
      val: '期末数',
      type: 'formula'
    },
    C: {
      align: 'center',
      val: '年初数',
      type: 'formula'
    },
    D: {
      align: 'center',
      val: '负债和所有（或股东）权益',
      type: 'title'
    },
    E: {
      align: 'center',
      val: '期末数',
      type: 'formula'
    },
    F: {
      align: 'center',
      val: '年初数',
      type: 'formula'
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '流动资产：',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      val: '流动负债：',
      align: 'left'
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    }
  },
  {
    A: {
      padding: 23,
      val: '货币资金',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1001', '1012'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1001', '1012'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '短期借款',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2001'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2001'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '交易性金融资产',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1101'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1101'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '交易性金融负债',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2101'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2101'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '应收票据',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1121'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1121'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '应付票据',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2201'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2201'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '应收账款',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1122'],
            fetch: 'JY'
          },
          {
            type: 'add',
            list: ['2203'],
            fetch: 'JY'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1122'],
            fetch: 'JC'
          },
          {
            type: 'add',
            list: ['2203'],
            fetch: 'JC'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '应付账款',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2202'],
            fetch: 'DY'
          },
          {
            type: 'add',
            list: ['1123'],
            fetch: 'DY'
          },
          {
            type: 'add',
            list: ['2204'],
            fetch: 'DY'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2202'],
            fetch: 'DC'
          },
          {
            type: 'add',
            list: ['1123'],
            fetch: 'DC'
          },
          {
            type: 'add',
            list: ['2204'],
            fetch: 'DC'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '预付款项',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1123'],
            fetch: 'JY'
          },
          {
            type: 'add',
            list: ['2202'],
            fetch: 'JY'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1123'],
            fetch: 'JC'
          },
          {
            type: 'add',
            list: ['2202'],
            fetch: 'JC'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '预收款项',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2203'],
            fetch: 'DY'
          },
          {
            type: 'add',
            list: ['1122'],
            fetch: 'DY'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2203'],
            fetch: 'DC'
          },
          {
            type: 'add',
            list: ['1122'],
            fetch: 'DC'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '应收股利',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1131'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1131'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '应付职工薪酬',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2211'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2211'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '应收利息',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1132'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1132'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '应交税费',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2221'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2221'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '其他应收款',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1221'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1221'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '应付利息',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2231'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2231'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '存货',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1401', '1408'],
            fetch: 'Y'
          },
          {
            type: 'minus',
            list: ['1471'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1401', '1408'],
            fetch: 'C'
          },
          {
            type: 'minus',
            list: ['1471'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '应付股利',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2232'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2232'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '一年内到期的非流动资产',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      val: null
    },
    C: {
      padding: 23,
      align: 'right',
      val: null
    },
    D: {
      padding: 23,
      val: '其他应付款',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2241'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2241'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '其他流动资产',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      val: null
    },
    C: {
      padding: 23,
      align: 'right',
      val: null
    },
    D: {
      padding: 23,
      val: '一年内到期的非流动负债',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      val: null
    },
    F: {
      padding: 23,
      align: 'right',
      val: null
    }
  },
  {
    A: {
      padding: 23,
      val: '流动资产合计',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B3', 'B13']
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['C3', 'C13']
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '其他流动负债',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      val: null
    },
    F: {
      padding: 23,
      align: 'right',
      val: null
    }
  },
  {
    A: {
      padding: 0,
      val: '非流动资产:',
      align: 'left',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 23,
      align: 'right',
      val: null
    },
    D: {
      padding: 23,
      val: '流动负债合计',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['E3', 'E14']
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['F3', 'F14']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '可供出售金融资产',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1503'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1503'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '非流动负债',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      val: null
    },
    F: {
      padding: 23,
      align: 'right',
      val: null
    }
  },
  {
    A: {
      padding: 23,
      val: '持有至到期投资',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1501'],
            fetch: 'Y'
          },
          {
            type: 'minus',
            list: ['1502'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1501'],
            fetch: 'C'
          },
          {
            type: 'minus',
            list: ['1502'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '长期借款',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2501'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2501'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '长期应收款',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1531'],
            fetch: 'Y'
          },
          {
            type: 'minus',
            list: ['1532'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1531'],
            fetch: 'C'
          },
          {
            type: 'minus',
            list: ['1532'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '应付债券',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2502'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2502'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '长期股权投资',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1511'],
            fetch: 'Y'
          },
          {
            type: 'minus',
            list: ['1512'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1511'],
            fetch: 'C'
          },
          {
            type: 'minus',
            list: ['1512'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '长期应付款',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2701'],
            fetch: 'Y'
          },
          {
            type: 'minus',
            list: ['2702'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2701'],
            fetch: 'C'
          },
          {
            type: 'minus',
            list: ['2702'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '投资性房地产',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1521'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1521'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '专项应付款',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2711'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2711'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '固定资产',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1601'],
            fetch: 'Y'
          },
          {
            type: 'minus',
            list: ['1602'],
            fetch: 'Y'
          },
          {
            type: 'minus',
            list: ['1603'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1601'],
            fetch: 'C'
          },
          {
            type: 'minus',
            list: ['1602'],
            fetch: 'C'
          },
          {
            type: 'minus',
            list: ['1603'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '预计负债',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2801'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2801'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '在建工程',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1604'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1604'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '递延所得税负债',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2901'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['2901'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '工程物资',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1605'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1605'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '其他非流动负债',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      val: null
    },
    F: {
      padding: 23,
      align: 'right',
      val: null
    }
  },
  {
    A: {
      padding: 23,
      val: '固定资产清理',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1606'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1606'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '非流动负债合计',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['E17', 'E23']
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['F17', 'F23']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '生产性生物资产',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      val: null
    },
    C: {
      padding: 23,
      align: 'right',
      val: null
    },
    D: {
      padding: 23,
      val: '负债合计',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['E15']
          },
          {
            type: 'add',
            list: ['E24']
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['F15']
          },
          {
            type: 'add',
            list: ['F24']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '油气资产',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      val: null
    },
    C: {
      padding: 23,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      val: '所有者权益（或股东权益）：',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      val: null
    },
    F: {
      padding: 23,
      align: 'right',
      val: null
    }
  },
  {
    A: {
      padding: 23,
      val: '无形资产',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1701'],
            fetch: 'Y'
          },
          {
            type: 'minus',
            list: ['1702'],
            fetch: 'Y'
          },
          {
            type: 'minus',
            list: ['1703'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'minus',
            list: ['1701'],
            fetch: 'C'
          },
          {
            type: 'minus',
            list: ['1702'],
            fetch: 'C'
          },
          {
            type: 'minus',
            list: ['1703'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '实收资本（或股东）',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4001'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4001'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '开发支出',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['5301'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['5301'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '资本公积',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4002'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4002'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '商誉',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1711'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1711'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '减：库存股',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4201'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4201'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '长摊待摊费用',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1801'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1801'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '盈余公积',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4101'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4101'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '递延所得税资产',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1811'],
            fetch: 'Y'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['1811'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '未分配利润',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4104'],
            fetch: 'Y'
          },
          {
            type: 'add',
            list: ['4103'],
            fetch: 'Y'
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4104'],
            fetch: 'C'
          },
          {
            type: 'add',
            list: ['4103'],
            fetch: 'C'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      val: '其他非流动资产',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      val: null
    },
    C: {
      padding: 23,
      align: 'right',
      val: null
    },
    D: {
      padding: 23,
      val: '所有者权益（或股东权益）合计',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['E27', 'E28']
          },
          {
            type: 'minus',
            list: ['E29']
          },
          {
            type: 'add',
            list: ['E30', 'E31']
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['F27', 'F28']
          },
          {
            type: 'minus',
            list: ['F29']
          },
          {
            type: 'add',
            list: ['F30', 'F31']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 46,
      val: '非流动资产合计',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B16', 'B32']
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['C16', 'C32']
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      val: null
    },
    F: {
      padding: 23,
      align: 'right',
      val: null
    }
  },
  {
    A: {
      padding: 69,
      val: '资产总计',
      align: 'left',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B14']
          },
          {
            type: 'add',
            list: ['B33']
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['C14']
          },
          {
            type: 'add',
            list: ['C33']
          }
        ]
      }
    },
    D: {
      padding: 23,
      val: '负债和所有者权益（或股东权益）总计',
      align: 'left'
    },
    E: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['E25']
          },
          {
            type: 'add',
            list: ['E32']
          }
        ]
      }
    },
    F: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['F25']
          },
          {
            type: 'add',
            list: ['F32']
          }
        ]
      }
    }
  }
]

const profit = [
  {
    A: {
      align: 'center',
      val: '项目',
      type: 'title'
    },
    B: {
      align: 'center',
      val: '本期金额',
      type: 'formula'
    },
    C: {
      align: 'center',
      val: '上期金额',
      type: 'formula'
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '一、营业收入',
    },
    B: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6001'],
            fetch: 'SY'
          },
          {
            type: 'add',
            list: ['6051'],
            fetch: 'SY'
          }
        ]
      }
    },
    C: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6001'],
            fetch: 'SY'
          },
          {
            type: 'add',
            list: ['6051'],
            fetch: 'SY'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      align: 'left',
      val: '减：营业成本',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6401'],
            fetch: 'SY'
          },
          {
            type: 'add',
            list: ['6402'],
            fetch: 'SY'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6401'],
            fetch: 'SY'
          },
          {
            type: 'add',
            list: ['6402'],
            fetch: 'SY'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 46,
      align: 'left',
      val: '营业税金及附加',
    },
    B: {
      padding: 46,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6405'],
            fetch: 'SY'
          }
        ]
      }
    },
    C: {
      padding: 46,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6405'],
            fetch: 'SY'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 46,
      align: 'left',
      val: '销售费用',
    },
    B: {
      padding: 46,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6601'],
            fetch: 'SY'
          }
        ]
      }
    },
    C: {
      padding: 46,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6601'],
            fetch: 'SY'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 46,
      align: 'left',
      val: '管理费用',
    },
    B: {
      padding: 46,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6602'],
            fetch: 'SY'
          }
        ]
      }
    },
    C: {
      padding: 46,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6602'],
            fetch: 'SY'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 46,
      align: 'left',
      val: '财务费用',
    },
    B: {
      padding: 46,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6603'],
            fetch: 'SY'
          }
        ]
      }
    },
    C: {
      padding: 46,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6603'],
            fetch: 'SY'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 46,
      align: 'left',
      val: '资产减值损失',
    },
    B: {
      padding: 46,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6701'],
            fetch: 'SY'
          }
        ]
      }
    },
    C: {
      padding: 46,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6701'],
            fetch: 'SY'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      align: 'left',
      val: '加：公允价值变动收益（损失以“-”号填列）',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6101'],
            fetch: 'SY'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6101'],
            fetch: 'SY'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 46,
      align: 'left',
      val: '投资收益（损失以“-”号填列）',
    },
    B: {
      padding: 46,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6111'],
            fetch: 'SY'
          }
        ]
      }
    },
    C: {
      padding: 46,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6111'],
            fetch: 'SY'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 46,
      align: 'left',
      val: '其中：对联营企业和合营企业的投资收益',
    },
    B: {
      padding: 46,
      align: 'right',
      val: null
    },
    C: {
      padding: 46,
      align: 'right',
      val: null
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '二、营业利润（亏损以“-”号填列）',
    },
    B: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B2']
          },
          {
            type: 'minus',
            list: ['B3', 'B8']
          },
          {
            type: 'add',
            list: ['B9']
          },
          {
            type: 'add',
            list: ['B10']
          }
        ]
      }
    },
    C: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['C2']
          },
          {
            type: 'minus',
            list: ['C3', 'C8']
          },
          {
            type: 'add',
            list: ['C9']
          },
          {
            type: 'add',
            list: ['C10']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      align: 'left',
      val: '加：营业外收入',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6301'],
            fetch: 'SY'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6301'],
            fetch: 'SY'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      align: 'left',
      val: '减：营业外支出',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6711'],
            fetch: 'SY'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6711'],
            fetch: 'SY'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 46,
      align: 'left',
      val: '其中：非流动资产处置损失',
    },
    B: {
      padding: 46,
      align: 'right',
      val: null
    },
    C: {
      padding: 46,
      align: 'right',
      val: null
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '三、利润总额（亏损总额以“-”号填列）',
    },
    B: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B12']
          },
          {
            type: 'add',
            list: ['B13']
          },
          {
            type: 'minus',
            list: ['B14']
          }
        ]
      }
    },
    C: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['C12']
          },
          {
            type: 'add',
            list: ['C13']
          },
          {
            type: 'minus',
            list: ['C14']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      align: 'left',
      val: '减：所得税费用',
    },
    B: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6801'],
            fetch: 'SY'
          }
        ]
      }
    },
    C: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['6801'],
            fetch: 'SY'
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '四、净利润（净亏损以“-”号填列）',
    },
    B: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B16']
          },
          {
            type: 'minus',
            list: ['B17']
          }
        ]
      }
    },
    C: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['C16']
          },
          {
            type: 'minus',
            list: ['C17']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '五、每股收益：',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '（一）基本每股收益',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '（二）稀释每股收益',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    }
  },
]

const ownerEquity = [
  {
    A: {
      padding: 0,
      align: 'center',
      val: '项目',
      type: 'title'
    },
    B: {
      padding: 0,
      align: 'center',
      val: '本年金额',
      type: 'formula'
    },
    C: {
      padding: 0,
      align: 'center',
      val: '本年金额',
      type: 'formula'
    },
    D: {
      padding: 0,
      align: 'center',
      val: '本年金额',
      type: 'formula'
    },
    E: {
      padding: 0,
      align: 'center',
      val: '本年金额',
      type: 'formula'
    },
    F: {
      padding: 0,
      align: 'center',
      val: '本年金额',
      type: 'formula'
    },
    G: {
      padding: 0,
      align: 'center',
      val: '本年金额',
      type: 'formula'
    },
    H: {
      padding: 0,
      align: 'center',
      val: '上年金额',
      type: 'formula'
    },
    I: {
      padding: 0,
      align: 'center',
      val: '上年金额',
      type: 'formula'
    },
    J: {
      padding: 0,
      align: 'center',
      val: '上年金额',
      type: 'formula'
    },
    K: {
      padding: 0,
      align: 'center',
      val: '上年金额',
      type: 'formula'
    },
    L: {
      padding: 0,
      align: 'center',
      val: '上年金额',
      type: 'formula'
    },
    M: {
      padding: 0,
      align: 'center',
      val: '上年金额',
      type: 'formula'
    }
  },
  {
    A: {
      padding: 0,
      align: 'center',
      val: '项目',
      type: 'title'
    },
    B: {
      padding: 0,
      align: 'center',
      val: '实收基本（或股本）',
      type: 'formula'
    },
    C: {
      padding: 0,
      align: 'center',
      val: '资本公积',
      type: 'formula'
    },
    D: {
      padding: 0,
      align: 'center',
      val: '减：库存股',
      type: 'formula'
    },
    E: {
      padding: 0,
      align: 'center',
      val: '盈余公积',
      type: 'formula'
    },
    F: {
      padding: 0,
      align: 'center',
      val: '未分配利润',
      type: 'formula'
    },
    G: {
      padding: 0,
      align: 'center',
      val: '所有者权益合计',
      type: 'formula'
    },
    H: {
      padding: 0,
      align: 'center',
      val: '实收基本（或股本）',
      type: 'formula'
    },
    I: {
      padding: 0,
      align: 'center',
      val: '资本公积',
      type: 'formula'
    },
    J: {
      padding: 0,
      align: 'center',
      val: '减：库存股',
      type: 'formula'
    },
    K: {
      padding: 0,
      align: 'center',
      val: '盈余公积',
      type: 'formula'
    },
    L: {
      padding: 0,
      align: 'center',
      val: '未分配利润',
      type: 'formula'
    },
    M: {
      padding: 0,
      align: 'center',
      val: '所有者权益合计',
      type: 'formula'
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '一、上年年末余额',
    },
    B: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4001'],
            fetch: 'C'
          }
        ]
      }
    },
    C: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4002'],
            fetch: 'C'
          }
        ]
      }
    },
    D: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4201'],
            fetch: 'C'
          }
        ]
      }
    },
    E: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4101'],
            fetch: 'C'
          }
        ]
      }
    },
    F: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4104'],
            fetch: 'C'
          },
          {
            type: 'add',
            list: ['4103'],
            fetch: 'C'
          }
        ]
      }
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B3']
          },
          {
            type: 'add',
            list: ['C3']
          },
          {
            type: 'minus',
            list: ['D3']
          },
          {
            type: 'add',
            list: ['E3']
          },
          {
            type: 'add',
            list: ['F3']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4001'],
            fetch: 'C'
          }
        ]
      }
    },
    I: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4002'],
            fetch: 'C'
          }
        ]
      }
    },
    J: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4201'],
            fetch: 'C'
          }
        ]
      }
    },
    K: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4101'],
            fetch: 'C'
          }
        ]
      }
    },
    L: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'ACCT',
        child: [
          {
            type: 'add',
            list: ['4104'],
            fetch: 'C'
          },
          {
            type: 'add',
            list: ['4103'],
            fetch: 'C'
          }
        ]
      }
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H3']
          },
          {
            type: 'add',
            list: ['I3']
          },
          {
            type: 'minus',
            list: ['J3']
          },
          {
            type: 'add',
            list: ['K3']
          },
          {
            type: 'add',
            list: ['L3']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '加：会计政策变更',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B4']
          },
          {
            type: 'add',
            list: ['C4']
          },
          {
            type: 'minus',
            list: ['D4']
          },
          {
            type: 'add',
            list: ['E4']
          },
          {
            type: 'add',
            list: ['F4']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H4']
          },
          {
            type: 'add',
            list: ['I4']
          },
          {
            type: 'minus',
            list: ['J4']
          },
          {
            type: 'add',
            list: ['K4']
          },
          {
            type: 'add',
            list: ['L4']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 23,
      align: 'left',
      val: '前期差错更正',
    },
    B: {
      padding: 23,
      align: 'right',
      val: null
    },
    C: {
      padding: 23,
      align: 'right',
      val: null
    },
    D: {
      padding: 23,
      align: 'right',
      val: null
    },
    E: {
      padding: 23,
      align: 'right',
      val: null
    },
    F: {
      padding: 23,
      align: 'right',
      val: null
    },
    G: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B5']
          },
          {
            type: 'add',
            list: ['C5']
          },
          {
            type: 'minus',
            list: ['D5']
          },
          {
            type: 'add',
            list: ['E5']
          },
          {
            type: 'add',
            list: ['F5']
          }
        ]
      }
    },
    H: {
      padding: 23,
      align: 'right',
      val: null
    },
    I: {
      padding: 23,
      align: 'right',
      val: null
    },
    J: {
      padding: 23,
      align: 'right',
      val: null
    },
    K: {
      padding: 23,
      align: 'right',
      val: null
    },
    L: {
      padding: 23,
      align: 'right',
      val: null
    },
    M: {
      padding: 23,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H5']
          },
          {
            type: 'add',
            list: ['I5']
          },
          {
            type: 'minus',
            list: ['J5']
          },
          {
            type: 'add',
            list: ['K5']
          },
          {
            type: 'add',
            list: ['L5']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '二、本年年初余额',
    },
    B: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B3']
          },
          {
            type: 'add',
            list: ['B4']
          },
          {
            type: 'add',
            list: ['B5']
          }
        ]
      }
    },
    C: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['C3']
          },
          {
            type: 'add',
            list: ['C4']
          },
          {
            type: 'add',
            list: ['C5']
          }
        ]
      }
    },
    D: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['D3']
          },
          {
            type: 'add',
            list: ['D4']
          },
          {
            type: 'add',
            list: ['D5']
          }
        ]
      }
    },
    E: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['E3']
          },
          {
            type: 'add',
            list: ['E4']
          },
          {
            type: 'add',
            list: ['E5']
          }
        ]
      }
    },
    F: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['F3']
          },
          {
            type: 'add',
            list: ['F4']
          },
          {
            type: 'add',
            list: ['F5']
          }
        ]
      }
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B6']
          },
          {
            type: 'add',
            list: ['C6']
          },
          {
            type: 'minus',
            list: ['D6']
          },
          {
            type: 'add',
            list: ['E6']
          },
          {
            type: 'add',
            list: ['F6']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H3']
          },
          {
            type: 'add',
            list: ['H4']
          },
          {
            type: 'add',
            list: ['H5']
          }
        ]
      }
    },
    I: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['I3']
          },
          {
            type: 'add',
            list: ['I4']
          },
          {
            type: 'add',
            list: ['I5']
          }
        ]
      }
    },
    J: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['J3']
          },
          {
            type: 'add',
            list: ['J4']
          },
          {
            type: 'add',
            list: ['J5']
          }
        ]
      }
    },
    K: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['K3']
          },
          {
            type: 'add',
            list: ['K4']
          },
          {
            type: 'add',
            list: ['K5']
          }
        ]
      }
    },
    L: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['L3']
          },
          {
            type: 'add',
            list: ['L4']
          },
          {
            type: 'add',
            list: ['L5']
          }
        ]
      }
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H6']
          },
          {
            type: 'add',
            list: ['I6']
          },
          {
            type: 'minus',
            list: ['J6']
          },
          {
            type: 'add',
            list: ['K6']
          },
          {
            type: 'add',
            list: ['L6']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '三、本年增减变动金额（减少以“-”号填列）',
    },
    B: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B8']
          },
          {
            type: 'add',
            list: ['B9']
          },
          {
            type: 'add',
            list: ['B15']
          },
          {
            type: 'add',
            list: ['B19']
          },
          {
            type: 'add',
            list: ['B23']
          }
        ]
      }
    },
    C: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['C8']
          },
          {
            type: 'add',
            list: ['C9']
          },
          {
            type: 'add',
            list: ['C15']
          },
          {
            type: 'add',
            list: ['C19']
          },
          {
            type: 'add',
            list: ['C23']
          }
        ]
      }
    },
    D: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['D8']
          },
          {
            type: 'add',
            list: ['D9']
          },
          {
            type: 'add',
            list: ['D15']
          },
          {
            type: 'add',
            list: ['D19']
          },
          {
            type: 'add',
            list: ['D23']
          }
        ]
      }
    },
    E: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['E8']
          },
          {
            type: 'add',
            list: ['E9']
          },
          {
            type: 'add',
            list: ['E15']
          },
          {
            type: 'add',
            list: ['E19']
          },
          {
            type: 'add',
            list: ['E23']
          }
        ]
      }
    },
    F: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['F8']
          },
          {
            type: 'add',
            list: ['F9']
          },
          {
            type: 'add',
            list: ['F15']
          },
          {
            type: 'add',
            list: ['F19']
          },
          {
            type: 'add',
            list: ['F23']
          }
        ]
      }
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B7']
          },
          {
            type: 'add',
            list: ['C7']
          },
          {
            type: 'minus',
            list: ['D7']
          },
          {
            type: 'add',
            list: ['E7']
          },
          {
            type: 'add',
            list: ['F7']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H8']
          },
          {
            type: 'add',
            list: ['H9']
          },
          {
            type: 'add',
            list: ['H15']
          },
          {
            type: 'add',
            list: ['H19']
          },
          {
            type: 'add',
            list: ['H23']
          }
        ]
      }
    },
    I: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['I8']
          },
          {
            type: 'add',
            list: ['I9']
          },
          {
            type: 'add',
            list: ['I15']
          },
          {
            type: 'add',
            list: ['I19']
          },
          {
            type: 'add',
            list: ['I23']
          }
        ]
      }
    },
    J: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['J8']
          },
          {
            type: 'add',
            list: ['J9']
          },
          {
            type: 'add',
            list: ['J15']
          },
          {
            type: 'add',
            list: ['J19']
          },
          {
            type: 'add',
            list: ['J23']
          }
        ]
      }
    },
    K: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['K8']
          },
          {
            type: 'add',
            list: ['K9']
          },
          {
            type: 'add',
            list: ['K15']
          },
          {
            type: 'add',
            list: ['K19']
          },
          {
            type: 'add',
            list: ['K23']
          }
        ]
      }
    },
    L: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['L8']
          },
          {
            type: 'add',
            list: ['L9']
          },
          {
            type: 'add',
            list: ['L15']
          },
          {
            type: 'add',
            list: ['L19']
          },
          {
            type: 'add',
            list: ['L23']
          }
        ]
      }
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H7']
          },
          {
            type: 'minus',
            list: ['I7']
          },
          {
            type: 'add',
            list: ['J7']
          },
          {
            type: 'add',
            list: ['K7']
          },
          {
            type: 'add',
            list: ['L7']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '（一）净利润',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B8']
          },
          {
            type: 'add',
            list: ['C8']
          },
          {
            type: 'minus',
            list: ['D8']
          },
          {
            type: 'add',
            list: ['E8']
          },
          {
            type: 'add',
            list: ['F8']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H8']
          },
          {
            type: 'add',
            list: ['I8']
          },
          {
            type: 'minus',
            list: ['J8']
          },
          {
            type: 'add',
            list: ['K8']
          },
          {
            type: 'add',
            list: ['L8']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '（二）直接计入所有者权益的利得和损失',
    },
    B: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B10', 'B13']
          }
        ]
      }
    },
    C: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['C10', 'C13']
          }
        ]
      }
    },
    D: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['D10', 'D13']
          }
        ]
      }
    },
    E: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['E10', 'E13']
          }
        ]
      }
    },
    F: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['F10', 'F13']
          }
        ]
      }
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B9']
          },
          {
            type: 'add',
            list: ['C9']
          },
          {
            type: 'minus',
            list: ['D9']
          },
          {
            type: 'add',
            list: ['E9']
          },
          {
            type: 'add',
            list: ['F9']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H10', 'H13']
          }
        ]
      }
    },
    I: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['I10', 'I13']
          }
        ]
      }
    },
    J: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['J10', 'J13']
          }
        ]
      }
    },
    K: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['K10', 'K13']
          }
        ]
      }
    },
    L: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['L10', 'L13']
          }
        ]
      }
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H9']
          },
          {
            type: 'add',
            list: ['I9']
          },
          {
            type: 'minus',
            list: ['J9']
          },
          {
            type: 'add',
            list: ['K9']
          },
          {
            type: 'add',
            list: ['L9']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '1. 可供出售金融资产公允价值变动净额',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B10']
          },
          {
            type: 'add',
            list: ['C10']
          },
          {
            type: 'minus',
            list: ['D10']
          },
          {
            type: 'add',
            list: ['E10']
          },
          {
            type: 'add',
            list: ['F10']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H10']
          },
          {
            type: 'add',
            list: ['I10']
          },
          {
            type: 'minus',
            list: ['J10']
          },
          {
            type: 'add',
            list: ['K10']
          },
          {
            type: 'add',
            list: ['L10']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '2. 权益法下被投资单位其他所有者权益变动的影响',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B11']
          },
          {
            type: 'add',
            list: ['C11']
          },
          {
            type: 'minus',
            list: ['D11']
          },
          {
            type: 'add',
            list: ['E11']
          },
          {
            type: 'add',
            list: ['F11']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H11']
          },
          {
            type: 'add',
            list: ['I11']
          },
          {
            type: 'minus',
            list: ['J11']
          },
          {
            type: 'add',
            list: ['K11']
          },
          {
            type: 'add',
            list: ['L11']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '3. 与计入所有者权益项目相关的所得税影响',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B12']
          },
          {
            type: 'add',
            list: ['C12']
          },
          {
            type: 'minus',
            list: ['D12']
          },
          {
            type: 'add',
            list: ['E12']
          },
          {
            type: 'add',
            list: ['F12']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H12']
          },
          {
            type: 'add',
            list: ['I12']
          },
          {
            type: 'minus',
            list: ['J12']
          },
          {
            type: 'add',
            list: ['K12']
          },
          {
            type: 'add',
            list: ['L12']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '4. 其他',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B13']
          },
          {
            type: 'add',
            list: ['C13']
          },
          {
            type: 'minus',
            list: ['D13']
          },
          {
            type: 'add',
            list: ['E13']
          },
          {
            type: 'add',
            list: ['F13']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H13']
          },
          {
            type: 'add',
            list: ['I13']
          },
          {
            type: 'minus',
            list: ['J13']
          },
          {
            type: 'add',
            list: ['K13']
          },
          {
            type: 'add',
            list: ['L13']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '上述（一）和（二）小计',
    },
    B: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B8']
          },
          {
            type: 'add',
            list: ['B9']
          }
        ]
      }
    },
    C: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['C8']
          },
          {
            type: 'add',
            list: ['C9']
          }
        ]
      }
    },
    D: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['D8']
          },
          {
            type: 'add',
            list: ['D9']
          }
        ]
      }
    },
    E: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['E8']
          },
          {
            type: 'add',
            list: ['E9']
          }
        ]
      }
    },
    F: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['F8']
          },
          {
            type: 'add',
            list: ['F9']
          }
        ]
      }
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B14']
          },
          {
            type: 'add',
            list: ['C14']
          },
          {
            type: 'minus',
            list: ['D14']
          },
          {
            type: 'add',
            list: ['E14']
          },
          {
            type: 'add',
            list: ['F14']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H8']
          },
          {
            type: 'add',
            list: ['H9']
          }
        ]
      }
    },
    I: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['I8']
          },
          {
            type: 'add',
            list: ['I9']
          }
        ]
      }
    },
    J: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['J8']
          },
          {
            type: 'add',
            list: ['J9']
          }
        ]
      }
    },
    K: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['K8']
          },
          {
            type: 'add',
            list: ['K9']
          }
        ]
      }
    },
    L: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['L8']
          },
          {
            type: 'add',
            list: ['L9']
          }
        ]
      }
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H14']
          },
          {
            type: 'add',
            list: ['I14']
          },
          {
            type: 'minus',
            list: ['J14']
          },
          {
            type: 'add',
            list: ['K14']
          },
          {
            type: 'add',
            list: ['L14']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '（三）所有者投入和减少资本',
    },
    B: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B16', 'B18']
          }
        ]
      }
    },
    C: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['C16', 'C18']
          }
        ]
      }
    },
    D: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['D16', 'D18']
          }
        ]
      }
    },
    E: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['E16', 'E18']
          }
        ]
      }
    },
    F: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['F16', 'F18']
          }
        ]
      }
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B15']
          },
          {
            type: 'add',
            list: ['C15']
          },
          {
            type: 'minus',
            list: ['D15']
          },
          {
            type: 'add',
            list: ['E15']
          },
          {
            type: 'add',
            list: ['F15']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H16', 'H18']
          }
        ]
      }
    },
    I: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['I16', 'I18']
          }
        ]
      }
    },
    J: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['J16', 'J18']
          }
        ]
      }
    },
    K: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['K16', 'K18']
          }
        ]
      }
    },
    L: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['L16', 'L18']
          }
        ]
      }
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H15']
          },
          {
            type: 'add',
            list: ['I15']
          },
          {
            type: 'minus',
            list: ['J15']
          },
          {
            type: 'add',
            list: ['K15']
          },
          {
            type: 'add',
            list: ['L15']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '1. 所有者投入资本',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B16']
          },
          {
            type: 'add',
            list: ['C16']
          },
          {
            type: 'minus',
            list: ['D16']
          },
          {
            type: 'add',
            list: ['E16']
          },
          {
            type: 'add',
            list: ['F16']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H16']
          },
          {
            type: 'add',
            list: ['I16']
          },
          {
            type: 'minus',
            list: ['J16']
          },
          {
            type: 'add',
            list: ['K16']
          },
          {
            type: 'add',
            list: ['L16']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '2. 股份支付计入所有者权益的金额',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B17']
          },
          {
            type: 'add',
            list: ['C17']
          },
          {
            type: 'minus',
            list: ['D17']
          },
          {
            type: 'add',
            list: ['E17']
          },
          {
            type: 'add',
            list: ['F17']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H17']
          },
          {
            type: 'add',
            list: ['I17']
          },
          {
            type: 'minus',
            list: ['J17']
          },
          {
            type: 'add',
            list: ['K17']
          },
          {
            type: 'add',
            list: ['L17']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '3. 其他',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B18']
          },
          {
            type: 'add',
            list: ['C18']
          },
          {
            type: 'minus',
            list: ['D18']
          },
          {
            type: 'add',
            list: ['E18']
          },
          {
            type: 'add',
            list: ['F18']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H18']
          },
          {
            type: 'add',
            list: ['I18']
          },
          {
            type: 'minus',
            list: ['J18']
          },
          {
            type: 'add',
            list: ['K18']
          },
          {
            type: 'add',
            list: ['L18']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '（四）利润分配',
    },
    B: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B20', 'B22']
          }
        ]
      }
    },
    C: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['C20', 'C22']
          }
        ]
      }
    },
    D: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['D20', 'D22']
          }
        ]
      }
    },
    E: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['E20', 'E22']
          }
        ]
      }
    },
    F: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['F20', 'F22']
          }
        ]
      }
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B19']
          },
          {
            type: 'add',
            list: ['C19']
          },
          {
            type: 'minus',
            list: ['D19']
          },
          {
            type: 'add',
            list: ['E19']
          },
          {
            type: 'add',
            list: ['F19']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H20', 'H22']
          }
        ]
      }
    },
    I: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['I20', 'I22']
          }
        ]
      }
    },
    J: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['J20', 'J22']
          }
        ]
      }
    },
    K: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['K20', 'K22']
          }
        ]
      }
    },
    L: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['L20', 'L22']
          }
        ]
      }
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H19']
          },
          {
            type: 'add',
            list: ['I19']
          },
          {
            type: 'minus',
            list: ['J19']
          },
          {
            type: 'add',
            list: ['K19']
          },
          {
            type: 'add',
            list: ['L19']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '1. 提取盈余公积',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B20']
          },
          {
            type: 'add',
            list: ['C20']
          },
          {
            type: 'minus',
            list: ['D20']
          },
          {
            type: 'add',
            list: ['E20']
          },
          {
            type: 'add',
            list: ['F20']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H20']
          },
          {
            type: 'add',
            list: ['I20']
          },
          {
            type: 'minus',
            list: ['J20']
          },
          {
            type: 'add',
            list: ['K20']
          },
          {
            type: 'add',
            list: ['L20']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '2. 对所有者（或股东）的分配',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B21']
          },
          {
            type: 'add',
            list: ['C21']
          },
          {
            type: 'minus',
            list: ['D21']
          },
          {
            type: 'add',
            list: ['E21']
          },
          {
            type: 'add',
            list: ['F21']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H21']
          },
          {
            type: 'add',
            list: ['I21']
          },
          {
            type: 'minus',
            list: ['J21']
          },
          {
            type: 'add',
            list: ['K21']
          },
          {
            type: 'add',
            list: ['L21']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '3. 其他',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B22']
          },
          {
            type: 'add',
            list: ['C22']
          },
          {
            type: 'minus',
            list: ['D22']
          },
          {
            type: 'add',
            list: ['E22']
          },
          {
            type: 'add',
            list: ['F22']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H22']
          },
          {
            type: 'add',
            list: ['I22']
          },
          {
            type: 'minus',
            list: ['J22']
          },
          {
            type: 'add',
            list: ['K22']
          },
          {
            type: 'add',
            list: ['L22']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '（五）所有者权益内部结转',
    },
    B: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B24', 'B27']
          }
        ]
      }
    },
    C: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['C24', 'C27']
          }
        ]
      }
    },
    D: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['D24', 'D27']
          }
        ]
      }
    },
    E: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['E24', 'E27']
          }
        ]
      }
    },
    F: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['F24', 'F27']
          }
        ]
      }
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B23']
          },
          {
            type: 'add',
            list: ['C23']
          },
          {
            type: 'minus',
            list: ['D23']
          },
          {
            type: 'add',
            list: ['E23']
          },
          {
            type: 'add',
            list: ['F23']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H24', 'H27']
          }
        ]
      }
    },
    I: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['I24', 'I27']
          }
        ]
      }
    },
    J: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['J24', 'J27']
          }
        ]
      }
    },
    K: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['K24', 'K27']
          }
        ]
      }
    },
    L: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['L24', 'L27']
          }
        ]
      }
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H23']
          },
          {
            type: 'add',
            list: ['I23']
          },
          {
            type: 'minus',
            list: ['J23']
          },
          {
            type: 'add',
            list: ['K23']
          },
          {
            type: 'add',
            list: ['L23']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '1. 资本公积转增资本（或股本）',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B24']
          },
          {
            type: 'add',
            list: ['C24']
          },
          {
            type: 'minus',
            list: ['D24']
          },
          {
            type: 'add',
            list: ['E24']
          },
          {
            type: 'add',
            list: ['F24']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H24']
          },
          {
            type: 'add',
            list: ['I24']
          },
          {
            type: 'minus',
            list: ['J24']
          },
          {
            type: 'add',
            list: ['K24']
          },
          {
            type: 'add',
            list: ['L24']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '2. 盈余公积转增资本（或股本）',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B25']
          },
          {
            type: 'add',
            list: ['C25']
          },
          {
            type: 'minus',
            list: ['D25']
          },
          {
            type: 'add',
            list: ['E25']
          },
          {
            type: 'add',
            list: ['F25']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H25']
          },
          {
            type: 'add',
            list: ['I25']
          },
          {
            type: 'minus',
            list: ['J25']
          },
          {
            type: 'add',
            list: ['K25']
          },
          {
            type: 'add',
            list: ['L25']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '3. 盈余公积弥补亏损',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B26']
          },
          {
            type: 'add',
            list: ['C26']
          },
          {
            type: 'minus',
            list: ['D26']
          },
          {
            type: 'add',
            list: ['E26']
          },
          {
            type: 'add',
            list: ['F26']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H26']
          },
          {
            type: 'add',
            list: ['I26']
          },
          {
            type: 'minus',
            list: ['J26']
          },
          {
            type: 'add',
            list: ['K26']
          },
          {
            type: 'add',
            list: ['L26']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '4. 其他',
    },
    B: {
      padding: 0,
      align: 'right',
      val: null
    },
    C: {
      padding: 0,
      align: 'right',
      val: null
    },
    D: {
      padding: 0,
      align: 'right',
      val: null
    },
    E: {
      padding: 0,
      align: 'right',
      val: null
    },
    F: {
      padding: 0,
      align: 'right',
      val: null
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B27']
          },
          {
            type: 'add',
            list: ['C27']
          },
          {
            type: 'minus',
            list: ['D27']
          },
          {
            type: 'add',
            list: ['E27']
          },
          {
            type: 'add',
            list: ['F27']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      val: null
    },
    I: {
      padding: 0,
      align: 'right',
      val: null
    },
    J: {
      padding: 0,
      align: 'right',
      val: null
    },
    K: {
      padding: 0,
      align: 'right',
      val: null
    },
    L: {
      padding: 0,
      align: 'right',
      val: null
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H27']
          },
          {
            type: 'add',
            list: ['I27']
          },
          {
            type: 'minus',
            list: ['J27']
          },
          {
            type: 'add',
            list: ['K27']
          },
          {
            type: 'add',
            list: ['L27']
          }
        ]
      }
    }
  },
  {
    A: {
      padding: 0,
      align: 'left',
      val: '四、 本年年末余额',
    },
    B: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B6']
          },
          {
            type: 'add',
            list: ['B7']
          }
        ]
      }
    },
    C: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['C6']
          },
          {
            type: 'add',
            list: ['C7']
          }
        ]
      }
    },
    D: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['D6']
          },
          {
            type: 'add',
            list: ['D7']
          }
        ]
      }
    },
    E: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['E6']
          },
          {
            type: 'add',
            list: ['E7']
          }
        ]
      }
    },
    F: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['F6']
          },
          {
            type: 'add',
            list: ['F7']
          }
        ]
      }
    },
    G: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['B28']
          },
          {
            type: 'add',
            list: ['C28']
          },
          {
            type: 'minus',
            list: ['D28']
          },
          {
            type: 'add',
            list: ['E28']
          },
          {
            type: 'add',
            list: ['F28']
          }
        ]
      }
    },
    H: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H6']
          },
          {
            type: 'add',
            list: ['H7']
          }
        ]
      }
    },
    I: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['I6']
          },
          {
            type: 'add',
            list: ['I7']
          }
        ]
      }
    },
    J: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['J6']
          },
          {
            type: 'add',
            list: ['J7']
          }
        ]
      }
    },
    K: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['K6']
          },
          {
            type: 'add',
            list: ['K7']
          }
        ]
      }
    },
    L: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['L6']
          },
          {
            type: 'add',
            list: ['L7']
          }
        ]
      }
    },
    M: {
      padding: 0,
      align: 'right',
      formula: {
        type: 'SUM',
        child: [
          {
            type: 'add',
            list: ['H28']
          },
          {
            type: 'add',
            list: ['I28']
          },
          {
            type: 'minus',
            list: ['J28']
          },
          {
            type: 'add',
            list: ['K28']
          },
          {
            type: 'add',
            list: ['L28']
          }
        ]
      }
    }
  }
]

const cash = [
]

const department = [
]

module.exports = {
  assets,
  profit,
  ownerEquity,
  cash,
  department
}