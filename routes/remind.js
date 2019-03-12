var express = require('express');
var router = express.Router();

var Remind = require('../models/remind');//导入模型数据模块
var resp = require('../user_modules/response');//公共返回对象

router.post('/insert', function(req, res, next){
    var queryObj = req.body;
    var remind = new Remind(queryObj);
    remind.save(function (err, result) {
        if(err){
            console.log(err);
            resp.meta.code = 'error';
            resp.meta.msg = '操作失败，请重试...';
            res.send(resp);
        }
        if(result != null){
            resp.meta.code = 'success';
            resp.meta.msg = 'success';
            res.send(resp);
        }
    });
})

module.exports = router;
