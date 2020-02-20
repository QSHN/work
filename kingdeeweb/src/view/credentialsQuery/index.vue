<template>
  <Card shadow style="height: 100%; overflow:hidden;" class="mu_card">
    <Row type="flex" style="min-height: 32px">
      <div style="margin-right: 20px">
        <span style="line-height: 30px;">日期：</span>
        <DatePicker type="daterange" split-panels v-model="search.time" style="width: 200px"></DatePicker>
      </div>

      <div style="margin-right: 20px">
        <span style="line-height: 30px;">会计年度：</span>
        <DatePicker type="year" v-model="search.year" style="width: 150px"></DatePicker>
      </div>

      <div style="margin-right: 20px">
        <span style="line-height: 30px;">会计期间：</span>
        <DatePicker type="month" v-model="search.month" style="width: 150px"></DatePicker>
      </div>

      <div style="margin-right: 20px">
        <span style="line-height: 30px;">审核状态：</span>
        <Select v-model="search.audit" style="width: 125px;">
          <Option v-for="(item, index) in search.auditList" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </div>

      <div style="margin-right: 20px">
        <span style="line-height: 30px;">过账状态：</span>
        <Select v-model="search.post" style="width: 125px;">
          <Option v-for="(item, index) in search.postList" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </div>

      <!--<div>-->
        <!--<span style="line-height: 30px;">凭证字：</span>-->
        <!--<Select v-model="search.proofWords" style="width: 150px;">-->
          <!--<Option v-for="(item, index) in search.wordsList" :value="item.name" :key="index">{{ item.name }}</Option>-->
        <!--</Select>-->
      <!--</div>-->

      <!--<div>-->
        <!--<span style="line-height: 30px;">凭证号：</span>-->
        <!--<Select v-model="search.equation" style="width: 80px;">-->
          <!--<Option v-for="(item, index) in search.equationList" :value="item" :key="index">{{ item }}</Option>-->
        <!--</Select>-->
        <!--<InputNumber :min="1" v-model="search.certificateNumber" style="width: 150px; margin-left: 10px;"></InputNumber>-->
      <!--</div>-->
    </Row>

    <Row type="flex" style="min-height: 32px; margin: 15px 0;">
      <ButtonGroup style="margin-right: 10px">
        <Button @click="operation('detail', '明细账')">明细账</Button>
      </ButtonGroup>

      <ButtonGroup style="margin-right: 10px">
        <Button type="primary" @click="operation('audit', '审核')">审核</Button>
        <Button type="primary" @click="operation('cashier', '复核')">复核</Button>
        <Button type="primary" @click="operation('examine', '核准')">核准</Button>
        <Button type="primary" @click="operation('post', '过账')">过账</Button>
      </ButtonGroup>

      <ButtonGroup style="margin-right: 10px">
        <Button type="success" @click="operation('add', '新增')">新增</Button>
        <Button type="success" @click="operation('edit', '修改')">修改</Button>
        <Button type="success" @click="operation('copy', '复制')">复制</Button>
      </ButtonGroup>

      <ButtonGroup style="margin-right: 10px">
        <Button type="error" @click="operation('delete', '删除')">删除</Button>
        <Button type="error" @click="operation('invalid', '作废')">作废</Button>
        <Button type="error" @click="operation('unInvalid', '反作废')">反作废</Button>
        <Button type="error" @click="operation('unAudit', '反审核')">反审核</Button>
        <Button type="error" @click="operation('unCashier', '反复核')">反复核</Button>
        <Button type="error" @click="operation('unExamine', '反核准')">反核准</Button>
        <Button type="error" @click="operation('unPost', '反过账')">反过账</Button>
        <Button type="error" @click="operation('sterilisation', '冲销')">冲销</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button @click="printConfirm = true">预览/打印</Button>
        <Button @click="operation('broken', '凭证整理')">凭证整理</Button>
        <Button @click="loadCredentials">刷新</Button>
      </ButtonGroup>
    </Row>

    <div style="flex-grow: 1; display: flex; height: 100%;">
      <credentialsTable ref="credentialsTable" :tableData="tableData" :currencyList="currencyList" />
    </div>

    <printModal ref="printModal" :printList="tableData" :printType="'credentialsList'" :isPrintMore="isPrintMore" />

    <Modal
      v-model="printConfirm"
      title="打印选择"
      :mask-closable="false"
      @on-cancel="printConfirm = false">
      <p>
        请选择你想要打印的模式(A4: 请选择竖打，一张纸包含两张凭证， A5：请选择横打，一张纸一张凭证)
      </p>
      <div slot="footer">
        <Button type="text" @click="printConfirm = false">取消</Button>
        <Button type="primary" @click="print(true)">A4</Button>
        <Button type="success" @click="print(false)">A5</Button>
      </div>
    </Modal>

    <confirmModal ref="confirmModal" />
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryProofWords } from '../../api/proofWords'
import printModal from '../../components/print/index'
import {
  queryCredentials,
  updateCredentials,
  deleteCredentials,
  credentialsPost,
  credentialsUnPost,
  credentialsBroken,
  credentialsListUpdate
} from '../../api/credentials'
import { currencyQuery } from '../../api/currency'
import credentialsTable from '../../components/credentialsTable/all'
import confirmModal from './confirmModal'
export default {
  name: 'credentialsIndex',
  components: {
    credentialsTable,
    printModal,
    confirmModal
  },
  data () {
    return {
      search: {
        audit: '全部',
        auditList: ['未审核', '已审核', '全部'],
        post: '全部',
        postList: ['未过账', '已过账', '全部'],
        time: null,
        year: null,
        month: null,
        proofWords: null,
        wordsList: [],
        equation: '',
        equationList: ['=', '!=', '>', '>=', '<', '<='],
        certificateNumber: null
      },
      tableData: [],
      currencyList: [],
      printConfirm: false,
      isPrintMore: false
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList'
    ])
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadProof()
          this.loadCredentials()
          this.loadCurrency()
        }
      },
      immediate: true,
      deep: true
    },
    search: {
      handler () {
        this.loadCredentials()
      },
      deep: true
    }
  },
  methods: {
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '凭证') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}凭证的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadProof () {
      queryProofWords({ accountSetId: this.accountSet._id }).then(res => {
        this.search.wordsList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '凭证字',
          desc: err.message
        })
      })
    },
    loadCredentials () {
      if (!this.accountSet || !this.accountSet._id) return
      let {
        audit,
        post,
        time,
        year,
        month,
        proofWords,
        equation,
        certificateNumber
      } = this.search
      queryCredentials({
        audit,
        post,
        time,
        year,
        month,
        proofWords,
        equation,
        certificateNumber,
        accountSetId: this.accountSet._id
      }).then(res => {
        this.tableData = res.data
        localStorage.setItem('credentials', JSON.stringify(res.data))
      }).catch(err => {
        this.$Notice.error({
          title: '凭证',
          desc: err.message
        })
      })
    },
    loadCurrency () {
      currencyQuery({
        accountSetId: this.accountSet._id
      }).then(res => {
        this.currencyList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '币别',
          desc: err.message
        })
      })
    },
    isDo (which, name, cName, title) {
      if (which[0] !== -1 && which[1] !== -1) {
        if (!this.tableData[which[0]][name] || !name) {
          return true
        } else {
          this.$Notice.error({
            title: '凭证',
            desc: `该凭证已${cName}，无法${title}`
          })
          return false
        }
      } else {
        this.$Notice.error({
          title: '凭证',
          desc: `请选择要${title}凭证`
        })
        return false
      }
    },
    update (uData, title) {
      this.$Modal.confirm({
        title: `${title}凭证`,
        content: `确定是否${title}凭证`,
        onOk: () => {
          updateCredentials(uData).then(res => {
            this.$Notice.success({
              title: '凭证',
              desc: `成功${title}凭证`
            })
            this.loadCredentials()
          }).catch(err => {
            this.$Notice.error({
              title: '凭证',
              desc: err.message
            })
          })
        }
      })
    },
    operation (type, title) {
      if (!this.judge(title)) return
      let which = this.$refs.credentialsTable.which
      let accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
      switch (type) {
        case 'detail':
          if (
            this.isDo(which, null, null, '查看明细的')
          ) {
            this.$router.push({
              name: 'credentialsSubjectIndex',
              query: {
                accountSetId: this.accountSet._id,
                subjectCode: this.tableData[which[0]].child[which[1]].subjectCode,
                subject: this.tableData[which[0]].child[which[1]].subject,
                accountingPeriod: this.tableData[which[0]].accountingPeriod
              }
            })
          }
          break
        case 'audit':
          if (which[0] !== -1 && which[1] !== -1) {
            this.$refs.confirmModal.show(
              '凭证审核',
              `您想审核${accountingPeriod}期所有凭证还是审核当前所选凭证，本次操作只处理未过账未审核并且制表人不是当前操作人的凭证`,
              (isOk) => {
                if (isOk) {
                  credentialsListUpdate({
                    accountSetId: this.accountSet._id,
                    type: 'audit'
                  }).then(res => {
                    this.$Notice.success({
                      title: '凭证审核',
                      desc: `${accountingPeriod}期所有凭证审核成功`
                    })
                    this.loadCredentials()
                  }).catch(err => {
                    this.$Modal.error({
                      title: '凭证审核失败',
                      content: err.message
                    })
                  })
                } else {
                  if (
                    this.isDo(which, 'post', '过账', '修改')
                  ) {
                    if (this.tableData[which[0]].voucher !== this.myUser._id) {
                      this.$router.push({
                        name: 'voucherInputIndex',
                        query: {
                          id: this.tableData[which[0]]._id,
                          type: 'audit'
                        }
                      })
                    } else {
                      this.$Notice.error({
                        title: '凭证',
                        desc: '制表人和审核人不能是同一个人'
                      })
                    }
                  }
                }
              }
            )
          } else {
            this.$Modal.confirm({
              title: '凭证审核',
              content: `确定审核${accountingPeriod}期所有凭证吗，本次操作只处理未过账未审核并且制表人不是当前操作人的凭证`,
              onOk: () => {
                credentialsListUpdate({
                  accountSetId: this.accountSet._id,
                  type: 'audit'
                }).then(res => {
                  this.$Notice.success({
                    title: '凭证审核',
                    desc: `${accountingPeriod}期所有凭证审核成功`
                  })
                  this.loadCredentials()
                }).catch(err => {
                  setTimeout(() => {
                    this.$Modal.error({
                      title: '凭证审核失败',
                      content: err.message
                    })
                  }, 500)
                })
              }
            })
          }
          break
        case 'cashier':
          if (which[0] !== -1 && which[1] !== -1) {
            this.$refs.confirmModal.show(
              '凭证复核',
              `您想复核${accountingPeriod}期所有凭证还是复核当前所选凭证，本次操作只处理未过账未复核的凭证`,
              (isOk) => {
                if (isOk) {
                  credentialsListUpdate({
                    accountSetId: this.accountSet._id,
                    type: 'cashier'
                  }).then(res => {
                    this.$Notice.success({
                      title: '凭证复核',
                      desc: `${accountingPeriod}期所有凭证复核成功`
                    })
                    this.loadCredentials()
                  }).catch(err => {
                    this.$Modal.error({
                      title: '凭证复核失败',
                      content: err.message
                    })
                  })
                } else {
                  if (
                    this.isDo(which, 'post', '过账', '修改')
                  ) {
                    this.$router.push({
                      name: 'voucherInputIndex',
                      query: {
                        id: this.tableData[which[0]]._id,
                        type: 'cashier'
                      }
                    })
                  }
                }
              }
            )
          } else {
            this.$Modal.confirm({
              title: '凭证复核',
              content: `确定复核${accountingPeriod}期所有凭证吗，本次操作只处理未过账未复核的凭证`,
              onOk: () => {
                credentialsListUpdate({
                  accountSetId: this.accountSet._id,
                  type: 'cashier'
                }).then(res => {
                  this.$Notice.success({
                    title: '凭证复核',
                    desc: `${accountingPeriod}期所有凭证复核成功`
                  })
                  this.loadCredentials()
                }).catch(err => {
                  setTimeout(() => {
                    this.$Modal.error({
                      title: '凭证复核失败',
                      content: err.message
                    })
                  }, 500)
                })
              }
            })
          }
          break
        case 'examine':
          if (which[0] !== -1 && which[1] !== -1) {
            this.$refs.confirmModal.show(
              '凭证核准',
              `您想核准${accountingPeriod}期所有凭证还是核准当前所选凭证，本次操作只处理未过账未核准的凭证`,
              (isOk) => {
                if (isOk) {
                  credentialsListUpdate({
                    accountSetId: this.accountSet._id,
                    type: 'examine'
                  }).then(res => {
                    this.$Notice.success({
                      title: '凭证核准',
                      desc: `${accountingPeriod}期所有凭证核准成功`
                    })
                    this.loadCredentials()
                  }).catch(err => {
                    this.$Modal.error({
                      title: '凭证核准失败',
                      content: err.message
                    })
                  })
                } else {
                  if (
                    this.isDo(which, 'post', '过账', '修改')
                  ) {
                    this.$router.push({
                      name: 'voucherInputIndex',
                      query: {
                        id: this.tableData[which[0]]._id,
                        type: 'examine'
                      }
                    })
                  }
                }
              }
            )
          } else {
            this.$Modal.confirm({
              title: '凭证核准',
              content: `确定核准${accountingPeriod}期所有凭证吗，本次操作只处理未过账未核准并且制表人不是当前操作人的凭证`,
              onOk: () => {
                credentialsListUpdate({
                  accountSetId: this.accountSet._id,
                  type: 'examine'
                }).then(res => {
                  this.$Notice.success({
                    title: '凭证核准',
                    desc: `${accountingPeriod}期所有凭证核准成功`
                  })
                  this.loadCredentials()
                }).catch(err => {
                  setTimeout(() => {
                    this.$Modal.error({
                      title: '凭证核准失败',
                      content: err.message
                    })
                  }, 500)
                })
              }
            })
          }
          break
        case 'unAudit':
          if (
            this.isDo(which, 'post', '过账', '修改')
          ) {
            let fData = JSON.parse(JSON.stringify(this.tableData[which[0]]))
            if (which[0] !== -1 && which[1] !== -1) {
              this.$refs.confirmModal.show(
                '凭证反审核',
                `您想反审核${accountingPeriod}期所有凭证还是反审核当前所选凭证，本次操作只处理未过账已审核并且审核人是当前操作人的凭证`,
                (isOk) => {
                  if (isOk) {
                    credentialsListUpdate({
                      accountSetId: this.accountSet._id,
                      type: 'unAudit'
                    }).then(res => {
                      this.$Notice.success({
                        title: '凭证反审核',
                        desc: `${accountingPeriod}期所有凭证反审核成功`
                      })
                      this.loadCredentials()
                    }).catch(err => {
                      this.$Modal.error({
                        title: '凭证反审核失败',
                        content: err.message
                      })
                    })
                  } else {
                    if (fData.audit) {
                      if (this.tableData[which[0]].audit === this.myUser._id) {
                        fData.audit = null
                        this.update(fData, '反审核')
                      } else {
                        this.$Notice.error({
                          title: '凭证反审核',
                          desc: '审核和反审核必须是同一个人'
                        })
                      }
                    } else {
                      this.$Notice.error({
                        title: '凭证反审核',
                        desc: '该凭证没有审核，无需反审核'
                      })
                    }
                  }
                }
              )
            } else {
              this.$Modal.confirm({
                title: '凭证反审核',
                content: `确定反审核${accountingPeriod}期所有凭证吗，本次操作只处理未过账已审核并且审核人是当前操作人的凭证`,
                onOk: () => {
                  credentialsListUpdate({
                    accountSetId: this.accountSet._id,
                    type: 'unAudit'
                  }).then(res => {
                    this.$Notice.success({
                      title: '凭证反审核',
                      desc: `${accountingPeriod}期所有凭证反审核成功`
                    })
                    this.loadCredentials()
                  }).catch(err => {
                    setTimeout(() => {
                      this.$Modal.error({
                        title: '凭证反审核失败',
                        content: err.message
                      })
                    }, 500)
                  })
                }
              })
            }
          }
          break
        case 'unCashier':
          if (
            this.isDo(which, 'post', '过账', '修改')
          ) {
            if (which[0] !== -1 && which[1] !== -1) {
              this.$refs.confirmModal.show(
                '凭证反复核',
                `您想反复核${accountingPeriod}期所有凭证还是反复核当前所选凭证，本次操作只处理未过账已复核并且复核人是当前操作人的凭证`,
                (isOk) => {
                  if (isOk) {
                    credentialsListUpdate({
                      accountSetId: this.accountSet._id,
                      type: 'unCashier'
                    }).then(res => {
                      this.$Notice.success({
                        title: '凭证反复核',
                        desc: `${accountingPeriod}期所有凭证反复核成功`
                      })
                      this.loadCredentials()
                    }).catch(err => {
                      this.$Modal.error({
                        title: '凭证反复核失败',
                        content: err.message
                      })
                    })
                  } else {
                    if (
                      this.isDo(which, 'post', '过账', '修改')
                    ) {
                      let fData = JSON.parse(JSON.stringify(this.tableData[which[0]]))
                      if (fData.cashier) {
                        if (this.tableData[which[0]].cashier === this.myUser._id) {
                          fData.cashier = null
                          this.update(fData, '反复核')
                        } else {
                          this.$Notice.error({
                            title: '凭证',
                            desc: '复核和反复核必须是同一个人'
                          })
                        }
                      } else {
                        this.$Notice.error({
                          title: '凭证',
                          desc: '该凭证没有复核，无需反复核'
                        })
                      }
                    }
                  }
                }
              )
            } else {
              this.$Modal.confirm({
                title: '凭证反复核',
                content: `确定反复核${accountingPeriod}期所有凭证吗，本次操作只处理未过账已复核并且复核人是当前操作人的凭证`,
                onOk: () => {
                  credentialsListUpdate({
                    accountSetId: this.accountSet._id,
                    type: 'unCashier'
                  }).then(res => {
                    this.$Notice.success({
                      title: '凭证反复核',
                      desc: `${accountingPeriod}期所有凭证反复核成功`
                    })
                    this.loadCredentials()
                  }).catch(err => {
                    setTimeout(() => {
                      this.$Modal.error({
                        title: '凭证反复核失败',
                        content: err.message
                      })
                    }, 500)
                  })
                }
              })
            }
          }
          break
        case 'unExamine':
          if (which[0] !== -1 && which[1] !== -1) {
            this.$refs.confirmModal.show(
              '凭证反核准',
              `您想反核准${accountingPeriod}期所有凭证还是反核准当前所选凭证，本次操作只处理未过账已核准并且核准人是当前操作人的凭证`,
              (isOk) => {
                if (isOk) {
                  credentialsListUpdate({
                    accountSetId: this.accountSet._id,
                    type: 'unExamine'
                  }).then(res => {
                    this.$Notice.success({
                      title: '凭证反核准',
                      desc: `${accountingPeriod}期所有凭证反核准成功`
                    })
                    this.loadCredentials()
                  }).catch(err => {
                    this.$Modal.error({
                      title: '凭证反核准失败',
                      content: err.message
                    })
                  })
                } else {
                  if (
                    this.isDo(which, 'post', '过账', '修改')
                  ) {
                    let fData = JSON.parse(JSON.stringify(this.tableData[which[0]]))
                    if (fData.examine) {
                      if (this.tableData[which[0]].examine === this.myUser._id) {
                        fData.examine = null
                        this.update(fData, '反核准')
                      } else {
                        this.$Notice.error({
                          title: '凭证',
                          desc: '核准和反核准必须是同一个人'
                        })
                      }
                    } else {
                      this.$Notice.error({
                        title: '凭证',
                        desc: '该凭证没有核准，无需反核准'
                      })
                    }
                  }
                }
              }
            )
          } else {
            this.$Modal.confirm({
              title: '凭证反核准',
              content: `确定反核准${accountingPeriod}期所有凭证吗，本次操作只处理未过账已核准并且核准人是当前操作人的凭证`,
              onOk: () => {
                credentialsListUpdate({
                  accountSetId: this.accountSet._id,
                  type: 'unExamine'
                }).then(res => {
                  this.$Notice.success({
                    title: '凭证反核准',
                    desc: `${accountingPeriod}期所有凭证反核准成功`
                  })
                  this.loadCredentials()
                }).catch(err => {
                  setTimeout(() => {
                    this.$Modal.error({
                      title: '凭证反核准失败',
                      content: err.message
                    })
                  }, 500)
                })
              }
            })
          }
          break
        case 'post':
          if (which[0] !== -1 && which[1] !== -1) {
            this.$refs.confirmModal.show(
              '凭证过账',
              `您想过账${accountingPeriod}期所有凭证还是过账当前所选凭证`,
              (isOk) => {
                if (isOk) {
                  credentialsPost({
                    accountSetId: this.accountSet._id
                  }).then(res => {
                    this.$Notice.success({
                      title: '凭证过账',
                      desc: `${accountingPeriod}期所有凭证过账成功`
                    })
                    this.loadCredentials()
                  }).catch(err => {
                    this.$Modal.error({
                      title: '凭证过账失败',
                      content: err.message
                    })
                  })
                } else {
                  if (this.tableData[which[0]].post) {
                    this.$Modal.error({
                      title: '凭证过账',
                      content: '该凭证已过账，无需再过账'
                    })
                  } else {
                    let title = `${this.tableData[which[0]].proofWords}-${this.tableData[which[0]].certificateNumber}`
                    credentialsPost({
                      accountSetId: this.accountSet._id,
                      id: this.tableData[which[0]]._id,
                      proofWords: this.tableData[which[0]].proofWords,
                      certificateNumber: this.tableData[which[0]].certificateNumber
                    }).then(res => {
                      this.$Notice.success({
                        title: '凭证过账',
                        desc: `${title}过账成功`
                      })
                      this.loadCredentials()
                    }).catch(err => {
                      setTimeout(() => {
                        this.$Modal.error({
                          title: '凭证过账失败',
                          content: err.message
                        })
                      }, 500)
                    })
                  }
                }
              }
            )
          } else {
            this.$Modal.confirm({
              title: '凭证过账',
              content: `确定过账${accountingPeriod}期所有凭证吗`,
              onOk: () => {
                credentialsPost({
                  accountSetId: this.accountSet._id
                }).then(res => {
                  this.$Notice.success({
                    title: '凭证过账',
                    desc: `${accountingPeriod}期所有凭证过账成功`
                  })
                  this.loadCredentials()
                }).catch(err => {
                  setTimeout(() => {
                    this.$Modal.error({
                      title: '凭证过账失败',
                      content: err.message
                    })
                  }, 500)
                })
              }
            })
          }
          break
        case 'add':
          this.$router.push({
            name: 'voucherInputIndex'
          })
          break
        case 'edit':
          if (
            this.isDo(which, 'audit', '审核', '修改') &&
            this.isDo(which, 'cashier', '复核', '修改') &&
            this.isDo(which, 'examine', '核准', '修改') &&
            this.isDo(which, 'post', '过账', '修改')
          ) {
            this.$router.push({
              name: 'voucherInputIndex',
              query: {
                id: this.tableData[which[0]]._id,
                type: 'edit'
              }
            })
          }
          break
        case 'copy':
          if (
            this.isDo(which, null, null, '复制')
          ) {
            this.$router.push({
              name: 'voucherInputIndex',
              query: {
                id: this.tableData[which[0]]._id,
                type: 'copy'
              }
            })
          }
          break
        case 'delete':
          if (
            this.isDo(which, 'audit', '审核', '修改') &&
            this.isDo(which, 'cashier', '复核', '修改') &&
            this.isDo(which, 'examine', '核准', '修改') &&
            this.isDo(which, 'post', '过账', '修改')
          ) {
            let fData = this.tableData[which[0]]
            this.$Modal.confirm({
              title: '删除凭证',
              content: `确定是否删除凭证`,
              onOk: () => {
                deleteCredentials({
                  accountSetId: this.accountSet._id,
                  id: fData._id
                }).then(res => {
                  this.$Notice.success({
                    title: '凭证',
                    desc: `成功删除凭证`
                  })
                  this.loadCredentials()
                }).catch(err => {
                  this.$Notice.error({
                    title: '凭证',
                    desc: err.message
                  })
                })
              }
            })
          }
          break
        case 'invalid':
          if (
            this.isDo(which, 'audit', '审核', '修改') &&
            this.isDo(which, 'cashier', '复核', '修改') &&
            this.isDo(which, 'examine', '核准', '修改') &&
            this.isDo(which, 'post', '过账', '修改')
          ) {
            let fData = JSON.parse(JSON.stringify(this.tableData[which[0]]))
            if (!fData.invalid) {
              fData.invalid = true
              this.update(fData, '作废')
            } else {
              this.$Notice.error({
                title: '凭证',
                desc: '该凭证已经作废，无需再作废'
              })
            }
          }
          break
        case 'unInvalid':
          if (
            this.isDo(which, 'audit', '审核', '修改') &&
            this.isDo(which, 'cashier', '复核', '修改') &&
            this.isDo(which, 'examine', '核准', '修改') &&
            this.isDo(which, 'post', '过账', '修改')
          ) {
            let fData = JSON.parse(JSON.stringify(this.tableData[which[0]]))
            if (fData.invalid) {
              fData.invalid = false
              this.update(fData, '反作废')
            } else {
              this.$Notice.error({
                title: '凭证',
                desc: '该凭证状态正常，无需反作废'
              })
            }
          }
          break
        case 'sterilisation':
          if (
            this.isDo(which, null, null, '冲销')
          ) {
            if (this.tableData[which[0]].post) {
              this.$router.push({
                name: 'voucherInputIndex',
                query: {
                  id: this.tableData[which[0]]._id,
                  type: 'sterilisation'
                }
              })
            } else {
              this.$Modal.error({
                title: '凭证冲销',
                content: '该凭证还未过账，无法冲销'
              })
            }
          }
          break
        case 'unPost':
          if (which[0] !== -1 && which[1] !== -1) {
            if (!this.tableData[which[0]].post) {
              this.$Notice.error({
                title: '凭证反过账',
                desc: `该凭证还没过账，无需反过账`
              })
            } else {
              let title = `${this.tableData[which[0]].proofWords}-${this.tableData[which[0]].certificateNumber}`
              this.$refs.confirmModal.show(
                '凭证反过账',
                `您想反过账${accountingPeriod}期所有凭证还是过账当前所选凭证`,
                (isOk) => {
                  if (isOk) {
                    credentialsUnPost({
                      accountingPeriod,
                      accountSetId: this.accountSet._id
                    }).then(res => {
                      this.$Notice.success({
                        title: '凭证反过账',
                        desc: `${accountingPeriod}期所有凭证反过账成功`
                      })
                      this.loadCredentials()
                    }).catch(err => {
                      setTimeout(() => {
                        this.$Modal.error({
                          title: '凭证反过账失败',
                          content: err.message
                        })
                      }, 500)
                    })
                  } else {
                    credentialsUnPost({
                      accountSetId: this.accountSet._id,
                      id: this.tableData[which[0]]._id
                    }).then(res => {
                      this.$Notice.success({
                        title: '凭证反过账',
                        desc: `${title}反过账成功`
                      })
                      this.loadCredentials()
                    }).catch(err => {
                      this.$Modal.error({
                        title: '凭证反过账失败',
                        content: err.message
                      })
                    })
                  }
                }
              )
            }
          } else {
            this.$Modal.confirm({
              title: '凭证反过账',
              content: `确定反过账${accountingPeriod}期所有凭证吗`,
              onOk: () => {
                credentialsUnPost({
                  accountingPeriod,
                  accountSetId: this.accountSet._id
                }).then(res => {
                  this.$Notice.success({
                    title: '凭证反过账',
                    desc: `${accountingPeriod}期所有凭证反过账成功`
                  })
                  this.loadCredentials()
                }).catch(err => {
                  setTimeout(() => {
                    this.$Modal.error({
                      title: '凭证反过账失败',
                      content: err.message
                    })
                  }, 500)
                })
              }
            })
          }
          break
        case 'broken':
          this.$Modal.confirm({
            title: '自动处理断号凭证',
            content: `自动处理断号凭证，重新排序`,
            onOk: () => {
              credentialsBroken({
                accountSetId: this.accountSet._id
              }).then(res => {
                this.$Notice.success({
                  title: '自动处理断号凭证',
                  desc: `成功处理断号凭证`
                })
                this.loadCredentials()
              }).catch(err => {
                setTimeout(() => {
                  this.$Modal.error({
                    title: '自动处理断号凭证',
                    content: err.message
                  })
                }, 500)
              })
            }
          })
          break
        default:
          this.$Notice.error({
            title: '凭证',
            desc: '该功能在紧急开发中'
          })
          break
      }
    },
    print (bool) {
      this.printConfirm = false
      this.isPrintMore = bool
      this.$nextTick(() => {
        this.$refs.printModal.show()
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>

<style lang="less">
  .mu_card .ivu-card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
