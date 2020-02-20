const router = require('express').Router();
const Credentials = require('./credentials.controller');

module.exports = router;

/*******凭证接口*******/

// 凭证
router.post('/update', Credentials.credentialsUpdate);                 // 创建/更新
router.post('/query', Credentials.credentialsQuery);                   // 查询
router.delete('/delete', Credentials.credentialsDelete);               // 删除
router.post('/queryLastInfo', Credentials.queryLastInfo);              // 查询最后一条信息
router.post('/credentialsPost', Credentials.credentialsPost);          // 过账
router.post('/credentialsUnPost', Credentials.credentialsUnPost);      // 反过账
router.post('/credentialsBroken', Credentials.credentialsBroken);      // 自动处理断号凭证
router.post('/credentialsListUpdate', Credentials.credentialsListUpdate);  // 凭证批量更新（只用于前端批量审核等操作）

// 账簿
router.post('/credentialsSubject', Credentials.credentialsSubject);    // 科目明细账
router.post('/generalLedger', Credentials.generalLedger);              // 总分类账
router.post('/allAccounting', Credentials.allAccounting);              // 核算项目分类总账
router.post('/numberAccounting', Credentials.numberAccounting);        // 数量金额总账
router.post('/moreColumn', Credentials.moreColumn);                    // 多栏账

// 财务报表
router.post('/dailyReport', Credentials.dailyReport);                  // 日报表
router.post('/abstractQuery', Credentials.abstractQuery);              // 摘要汇总表
router.post('/accountingItemBalance', Credentials.accountingItemBalance);   // 核算项目余额表
router.post('/accountingItemDetail', Credentials.accountingItemDetail);   // 核算项目明细表
router.post('/accountingItemSummary', Credentials.accountingItemSummary);   // 核算项目汇总表
router.post('/accountingItemCombination', Credentials.accountingItemCombination);   // 核算项目组合表
router.post('/accountingItemSubject', Credentials.accountingItemSubject);   // 核算项目组合表
router.post('/finalTuningHistory', Credentials.finalTuningHistory);   // 调汇历史信息
router.post('/interest', Credentials.interest);                         // 科目计息

// 结账
router.post('/finalTuning', Credentials.finalTuning);                  // 期末调汇
router.post('/carrForward', Credentials.carrForward);                  // 结转损益
router.post('/invoicing', Credentials.invoicing);                      // 期末结转
router.post('/automaticTransfer', Credentials.automaticTransfer);      // 自动过账
