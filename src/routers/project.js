const express= require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: __dirname+'/../public/upload/projects/'});

const projectController = require('../controllers/projectController');

/** 
 * 拦截get请求,返回json数据
 * GET api/project/current
*/

router.get('/current',  projectController.getCurrentProject);

/**
 * 插入新的project
 * POST api/project/insert
 */
router.post('/upload',  upload.array('image', 9) , projectController.uploadProject);

module.exports = router;