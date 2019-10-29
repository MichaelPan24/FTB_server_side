const express= require('express');
const router = express.Router();
const multer = require('multer');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {cb(null, __dirname+'/../public/upload/caches/')},
    filename: (req, file, cb) => {cb(null, file.fieldname + '-' + Date.now())}
})
const upload = multer({storage: storage, limits: {fieldSize: '10MB'}});

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