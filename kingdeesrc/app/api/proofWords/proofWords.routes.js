const router = require('express').Router();
const ProofWords = require('./proofWords.controller');

module.exports = router;

/*******凭证字接口*******/
router.post('/proofWordsUpdate', ProofWords.update);            // 创建/更新
router.post('/proofWordsQuery', ProofWords.query);              // 查询
router.delete('/deleteProofWords', ProofWords.wordDelete);      // 删除
