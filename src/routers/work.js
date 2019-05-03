const express= require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: __dirname+'/../public/upload/caches/'});

const workController = require('../controllers/workController');

/** 
 * 拦截get请求,返回json数据
 * GET api/show/current
*/

router.get('/current',  workController.getCurrentWork);

/**
 * 插入新的project
 * POST api/show/upload
 */
router.post('/upload',  upload.array('image', 9) , workController.uploadWork);

module.exports = router;