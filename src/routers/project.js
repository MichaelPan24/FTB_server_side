const express= require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');
const ProjectModel = require('../models/project');

/** 
 * 拦截get请求,返回json数据
 * GET api/project/current
*/

router.get('/current',  projectController.getCurrentProject);

/**
 * 插入新的project
 * POST api/project/
 */
router.post('/', projectController.insertProject);

module.exports = router;