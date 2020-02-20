const router = require('express').Router();
const CredentialsTemplate = require('./credentialsTemplate.controller');

module.exports = router;

/*******凭证模板接口模板*******/

// 凭证模板
router.post('/update', CredentialsTemplate.credentialsTemplateUpdate);                 // 创建/更新
router.post('/query', CredentialsTemplate.credentialsTemplateQuery);                   // 查询
router.delete('/delete', CredentialsTemplate.credentialsTemplateDelete);               // 删除
