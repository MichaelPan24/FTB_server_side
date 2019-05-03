const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: __dirname+'/../public/upload/caches/', limits: {fieldSize: '10MB'}});

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
router.post('/register',upload.single('avatar'), UserController.register);

/**
 * 用户登出
 * GET
 * /api/user/logout
 */
router.get('/logout', UserController.logOut);

/**
 * 更新用户的基本信息
 * PUT
 * /api/user/update/:userId
 */
router.put('/update/:userId', upload.single('avatar'), UserController.updateInfo);

/**
 * 更新用户的收藏列表
 * PUT
 * /api/user/update/:userId/updateFav
 */
router.put('/update/:userId/updateFav', UserController.updateFav);

/**
 * 获取用户的项目发布列表
 * GET
 * /api/user/:userId/:identify/projects
 */
router.get('/:userId/:identify/projects', UserController.getProject);

/**
 * 根据identify获取用户的需求或是作品收藏列表
 * GET
 * /api/user/:userId/favorite/:type
 */
router.get('/:userId/favorite/:type', UserController.getFav)

/**
 * 
 * PUT
 * /api/user/:userId/remove/:removeType/:projectId
 */
router.put('/:userId/remove/:removeType', UserController.removeProject)

/**
 * POST
 * /api/user/:userId/work/:workId
 */
router.post('/:userId/comment/:workId', UserController.pushComment)

module.exports = router;