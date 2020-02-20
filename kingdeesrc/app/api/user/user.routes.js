const router = require('express').Router();
const User = require('./user.controller');

module.exports = router;

/*******用户接口*******/
router.post('/register', User.register);                      // 注册
router.post('/login', User.login);                            // 登录
router.get('/current', User.getCurrent);                      // 获取当前用户
router.post('/update', User.update);                          // 更新当前用户
router.post('/queryUserList', User.queryUserList);            // 获取公司用户列表