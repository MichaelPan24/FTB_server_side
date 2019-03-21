const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs');

const upload = multer({dest: __dirname+'/public/upload/projects/'});
app.use(function(req, res, next){
    //设置跨域访问
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200); /*让options请求快速返回*/
    }else {
        next();
    }
})
app.use(express.static(__dirname + '/public'))


app.get('/',(req,res,next)=>{res.send('hi')})
app.post('/upload', upload.array('image', 9), (req, res, next)=> {
    const files = req.files;
    for(let i=0, l = files.length; i<l; i++){
        console.log(files[i].fieldname)
        console.log(files[i].originalname);
        console.log(files[i].encoding);
        console.log(files[i].mimetype);
        console.log(files[i].filename);
        console.log(files[i].path);
        fs.rename(req.files[i].path, "src/public/upload/projects/" + req.files[i].originalname, function(err) {
            if (err) {
                throw err;
            }
            console.log('done!');
        })
    }
    res.send('成功上传')
})

app.listen(8000, ()=>{
    console.log('test server running')
});
