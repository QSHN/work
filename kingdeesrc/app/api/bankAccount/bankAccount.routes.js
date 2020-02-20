const router = require('express').Router();
const BankAccount = require('./bankAccount.controller');

module.exports = router;

/*******银行账号接口*******/

// 银行账号
router.post('/bankAccountUpdate', BankAccount.bankAccountUpdate);                 // 创建/更新
router.post('/bankAccountQuery', BankAccount.bankAccountQuery);                   // 查询
router.delete('/batchBankAccount', BankAccount.batchBankAccount);

router.post('/bankAccountUpdateSubject', BankAccount.bankAccountUpdateSubject);