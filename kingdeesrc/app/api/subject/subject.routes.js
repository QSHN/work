const router = require('express').Router();
const Subject = require('./subject.controller');

module.exports = router;

/*******科目接口*******/

// 科目
router.post('/subjectUpdate', Subject.subjectUpdate);                 // 创建/更新
router.post('/subjectQuery', Subject.subjectQuery);                   // 查询
router.delete('/subjectDelete', Subject.subjectDelete);               // 删除
router.post('/subjectSave', Subject.subjectSave);                     // 多条保存
router.post('/subjectBatchOperation', Subject.subjectBatchOperation);                     // 批量操作

// 科目类别
router.post('/typeUpdate', Subject.typeUpdate);                       // 创建/更新
router.post('/typeQuery', Subject.typeQuery);                         // 查询
router.delete('/typeDelete', Subject.typeDelete);                     // 删除
