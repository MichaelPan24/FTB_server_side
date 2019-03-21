const express= require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: __dirname+'/../public/upload/projects/'});

const workController = require('../controllers/workController');

/** 
 * 拦截get请求,返回json数据
 * GET api/project/current
*/

router.get('/current',  workController.getCurrentProject);

/**
 * 插入新的project
 * POST api/project/insert
 */
router.post('/upload',  upload.array('image', 3) , workController.upload);

module.exports = router;