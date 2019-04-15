const express= require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: __dirname+'/../public/upload/works/'});

const workController = require('../controllers/workController');

/** 
 * 拦截get请求,返回json数据
 * GET api/works/current
*/

router.get('/current',  workController.getCurrentWork);

/**
 * 插入新的project
 * POST api/project/insert
 */
router.post('/upload',  upload.array('image', 9) , workController.uploadWork);

module.exports = router;