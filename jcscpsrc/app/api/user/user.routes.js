const router = require('express').Router();
const User = require('./user.controller');

module.exports = router;

/*******用户接口*******/
router.post('/register', User.register);        // 注册
router.post('/login', User.login);              // 登录
router.get('/current', User.getCurrent);        // 获取当前用户

router.post('/updateUser', User.updateUser);        // 更新用户
router.post('/queryUser', User.queryUser);          // 获取用户
router.post('/updateUserTemp', User.updateUserTemp);   // 更新用户模板
router.post('/queryUserTemp', User.queryUserTemp);     // 获取用户模板

router.post('/updateUserGroup', User.updateUserGroup);   // 更新用户组
router.post('/queryUserGroup', User.queryUserGroup);     // 获取用户组