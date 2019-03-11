const express = require('express');
const mongoose = require('mongoose');
const async = require('async');

const {connect} = require('./src/config/db');
const Project = require('./src/models/project');

const port = process.env.port || 3301

const db = mongoose.connection;
const app = express();

function createProject(companyName, title, description, contact, data){
    Project.create({
        companyName: companyName,
        title: title,
        description: description,
        contact: contact,
        data: data
    }, (err, project) => {
        if(!err) console.log('insert successfully');
    })
}

//连接数据库
connect();

async.parallel([
    (callback)  =>  createProject('三星', '全是曲面屏设计', '飞机拉萨风林火山覅u我iu哦青浦区', {phone: 14244, qq: 235709}),
    (callback)  =>  createProject('nike', '球鞋设计', '造就轻薄与功能性于一体的全气候球鞋', {phone: 14244, qq: 235709}),
    (callback)  =>  createProject('洛可可', '智能化多功能公共垃圾桶外观、结构设计（升级设计）', "背景：我们做自动化设备，做代加工行业; \n 产品：智能化多功能公共垃圾桶外观、结构设计。 \n 材质：外壳钣金为主。内桶用塑料。\n 设备尺寸：暂定 \n 产品状态：已有在售产品，做新功能开发升级；"
    , {phone: 14244, qq: 235709}),
    (callback)  =>  createProject('**欸', '产品结构设计', '需要定制两款：一款质量好一些的（卡簧式滚轴轴承）；另一款普通便宜点的（不是卡簧式的） 独眼万向卡簧式滚轴轴承（不锈钢、灵活、稳定、耐用）', {phone: 14244, qq: 235709}),
    (callback)  =>  createProject('*是', '自动化', '自动化', {phone: 14244, qq: 235709}),
    (callback)  =>  createProject('*拍', '购物空间设计', '购物空间设计', {phone: 14244, qq: 235709}),
    (callback)  =>  createProject('*额', '智能家居', '智能家居设计', {phone: 14244, qq: 235709}),
    (callback)  =>  createProject('*你', '产品外观设计', '新型垃圾桶设计', {phone: 14244, qq: 235709}),
    (callback)  =>  createProject('*更', 'logos设计', '军运会logo设计', {phone: 14244, qq: 235709}),
    (callback)  =>  createProject('*图', '室内设计', '欧式家装风格设计', {phone: 14244, qq: 235709}),
    (callback)  =>  createProject('*吧', 'ui设计', 'app logo及界面展示设计', {phone: 14244, qq: 235709})
], (result) => {
    console.log(result);
})

db.on('connected', console.log.bind(console, 'hi'));

app.listen(port,() => console.log('server running'))

