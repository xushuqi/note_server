var express = require('express');
var router = express.Router();

var Note = require('../models/note');//导入模型数据模块
var resp = require('../user_modules/response');//公共返回对象

/* 查询列表. */
router.post('/list', function(req, res, next) {
    Note.fetch(function (err, result) {
        if(err)
            console.log(err);
        if(result != null){
            resp.meta.code = 'success';
            resp.meta.msg = 'success';
            resp.result = result;
            res.send(resp);
        }else{
            resp.meta.code = 'success';
            resp.meta.msg = 'success';
            resp.result = [];
            res.send(resp);
        }
    });
});

router.post('/admin', function(req, res, next){
    var queryObj = req.body;
    var note = new Note(queryObj);
    if(queryObj.id){//更新
        Note.update(queryObj.id, queryObj, function (err, result) {
            if(err){
                console.log(err);
                resp.meta.code = 'error';
                resp.meta.msg = '更新失败，请重试...';
                res.send(resp);
            }
            if(result != null){
                resp.meta.code = 'success';
                resp.meta.msg = 'success';
                res.send(resp);
            }
        })
    }else{//新增
        note.save(function (err, result) {
            if(err){
                console.log(err);
                resp.meta.code = 'error';
                resp.meta.msg = '新增失败，请重试...';
                res.send(resp);
            }
            if(result != null){
                resp.meta.code = 'success';
                resp.meta.msg = 'success';
                res.send(resp);
            }else{
                resp.meta.code = 'error';
                resp.meta.msg = '新增失败，请重试...';
                res.send(resp);
            }
        })
    }
})
router.post('/del', function (req, res, next) {
    var queryObj = req.body;
    Note.delOne(queryObj.id, function (err, result) {
        if(err){
            console.log(err);
            resp.meta.code = 'error';
            resp.meta.msg = '删除数据失败，请重试...';
            res.send(resp);
        }
        if(result != null){
            resp.meta.code = 'success';
            resp.meta.msg = 'success';
            res.send(resp);
        }else{
            resp.meta.code = 'error';
            resp.meta.msg = '删除数据失败，请重试...';
            res.send(resp);
        }
    })
})
module.exports = router;
