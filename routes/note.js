var express = require('express');
const json2csv = require('json2csv').parse;
const fs = require('fs');
var router = express.Router();

var Note = require('../models/note');//导入模型数据模块
var resp = require('../user_modules/response');//公共返回对象
router.post('/findById', function (req, res, next) {
    var queryObj = req.body;
    Note.findById(queryObj.id, function (err, results) {
        if(err)
            console.log(err)
        if(results !== null){
            resp.meta.code = 'success'
            resp.meta.msg = 'success'
            resp.result = results
            res.send(resp)
        }else{
            resp.meta.code = 'error'
            resp.meta.msg = '查询信息失败'
            res.send(resp)
        }
    })
});
/* 查询列表. */
router.post('/list', function(req, res, next) {
    var queryObj = req.body;
    var userId = queryObj._id;
    Note.findByUserId(userId, function (err, result) {
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
    if(queryObj._id){//更新
        Note.update(queryObj._id, queryObj, function (err, result) {
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
router.post('/del', function(req, res, next){
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

router.post('/export', async function(req, res) {
    const fields = ['car', 'price', 'color'];
    const myCars = [
        {
            'car': 'Audi',
            'price': 40000,
            'color': 'blue'
        },{
            'car': 'BMW',
            'price': 35000,
            'color': 'black'
        }
    ];
    fs.writeFile('../note_server/fileTemp/notes.txt', JSON.stringify(myCars), function (err) {
        if(err)
            return console.error(err);
        console.log('数据写入成功...');
    });

    res.setHeader('Content-Type', 'application/text;charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename='+encodeURIComponent('notes')+'.txt')
    res.download('../note_server/fileTemp/notes.txt', 'notes.txt', function (err) {
        if(err)
            console.error(err);
        console.log('下载文件完成...')
    })
})

module.exports = router;
