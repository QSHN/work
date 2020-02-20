const L = require('debug')('Score:Visit')
const salesmanage = require('../../../api/salesmanage/salesmanage.model')
const ScoreRuleModel = require('../../../api/score/scorerule.model')
const Score = require('../../../api/score/score.model')
const timetool = require('../lib/time')
const {pushMsg} = require('../../../api/notification/notification.controller')

const ScoreRule = {
    name: "销售业绩",
    rules: {
        "salesmanageCount": {
            name: "销售业绩次数",
            cron: {
                open: true,
                time: '0 14 0 * * *', //第二天凌晨统计
                run: async function () {
                    let dayDate = timetool.getDayFilter(-1)
                    let weekDate
                    let monthDate
                    if (new Date().getDay() == 1) {
                        weekDate = {
                            form: timetool.getDayFilter(-7 + -1).from,
                            to: timetool.getDayFilter(-1).to
                        }
                    }
                    if (new Date().getDate() == 1) {
                        monthDate = timetool.getMonthFilter(-1)
                    }
                    let list = await ScoreRuleModel.find({
                        "ruleModule": "salesmanage",
                        "rules.rule": "salesmanageCount",
                        "run": true
                    })
                    list = list.filter(item => timetool.intersectionTime(item.date, dayDate))
                    list.forEach(async item => {
                        item.rules.forEach(async cr => {
                            let curr_rule = JSON.parse(JSON.stringify(cr))
                            if (curr_rule.rule == "salesmanageCount") {
                                let type = curr_rule.more.type.value
                                let date
                                if (type == '每日') {
                                    date = dayDate
                                }
                                if (type == '每周') {
                                    date = weekDate
                                }
                                if (type == '每月') {
                                    date = monthDate
                                }
                                if (!date) return
                                item.users.forEach(async user => {
                                    let visit_list = await salesmanage.find({
                                        creator: user,
                                        status: '已确认',
                                        createAt: {$gte: date.from, $lte: date.to}
                                    })
                                    const count = visit_list.length
                                    if (curr_rule.unitValue == 0) return
                                    if (count >= curr_rule.unitValue) {
                                        //加分
                                        if(curr_rule.more.add.value==0)return
                                        let score = {
                                            user: user,
                                            at: date.to,
                                            type: '销售业绩',
                                            category: "销售业绩次数",
                                            quantity: null,
                                            score: curr_rule.more.add.value,
                                            rule: {...curr_rule, valueType: 'add', value: curr_rule.more.add.value},
                                            // ref: visit,
                                            detail: date.to.toHawkDateString() + " 完成上报销售业绩次数",
                                        };
                                        let list = await Score.find(score);
                                        if (!list.length) {
                                            await Score.create(score);
                                            pushMsg({
                                                userId: user,
                                                category: "工作考核",
                                                content: '亲，您因为完成上报销售业绩次数，被奖励：' + curr_rule.more.add.value + '分',
                                                title: "完成上报销售业绩次数",
                                            });
                                        }
                                    } else {
                                        //扣分
                                        if(curr_rule.more.sub.value==0)return
                                        score = {
                                            user: user,
                                            at: date.to,
                                            type: '销售业绩',
                                            category: "销售业绩次数",
                                            quantity: null,
                                            score: curr_rule.more.sub.value,
                                            rule: {...curr_rule, valueType: 'sub', value: curr_rule.more.sub.value},
                                            // ref: visit,
                                            detail: date.to.toHawkDateString() + " 未完成上报销售业绩次数",
                                        };
                                        let list = await Score.find(score);
                                        if (!list.length) {
                                            await Score.create(score);
                                            pushMsg({
                                                userId: user,
                                                category: "工作考核",
                                                content: '亲，您因为未完成上报销售业绩次数，被扣分：' + curr_rule.more.sub.value + '分',
                                                title: "未上报销售业绩",
                                            });
                                        }
                                    }
                                })
                            }
                        })
                    })
                }
            },
            default: {
                title: "销售业绩次数",
                unit: "次",
                unitValue: 1,
                more: {
                    add: {
                        title: "加分",
                        value: 0,
                        valueType: 'add'
                    },
                    sub: {
                        title: "减分",
                        value: 0,
                        valueType: 'sub'
                    },
                    type: {
                        title: "周期",
                        value: '每日',
                        valueType: 'enum',
                        cols: [{
                            values: ['每日', '每周', '每月']
                        }]
                    }
                },
            }
        }
    }
}
// ScoreRule.rules.salesmanageCount.cron.run() //测试用
module.exports = ScoreRule
