const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');
/**
 * 用户登录
 * POST
 * /api/user/login
 */
router.post('/login', UserController.logIn);

/**
 * 用户注册
 * POST
 * /api/user/register
 */
router.post('/register', UserController.register);

/**
 * 用户登出
 * GET
 * /api/user/logout
 */
router.get('/logout', UserController.logOut);

module.exports = router;