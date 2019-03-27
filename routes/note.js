var express = require('express');
var schedule = require('node-schedule');
var moment = require('moment');
const json2csv = require('json2csv').parse;
const fs = require('fs');
var router = express.Router();

var request = require('request');
var querystring = require('querystring');

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
    var startLine = queryObj.startLine;
    Note.findByUserId(userId, startLine, function (err, result) {
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
});
router.post('/remind', function (req, res) {
    var queryObj = req.body;
    var obj = {};
    obj.noteId = queryObj._id;
    obj.userId = queryObj.userId;
    obj.userName = queryObj.userName;
    obj.phone = queryObj.phone;
    obj.content = queryObj.content;
    obj.remindTime = queryObj.remindTime;
    var dateTime = new Date(obj.remindTime);
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth();
    var day = dateTime.getDate();
    var hour = dateTime.getHours();
    var minute = dateTime.getMinutes();
    var date = new Date(year, month, day, hour, minute, 0, 0);
    console.log(moment(date).format('YYYY-MM-DD hh:mm'));
    var dayJob = schedule.scheduleJob(date, function(){//每天0点0分触发 0 0 0 * * ? *
        //调用短信接口
        var queryData = querystring.stringify({
            'mobile': obj.phone,  // 接受短信的用户手机号码
            'tpl_id': '143898',  // 您申请的短信模板ID，根据实际情况修改
            'tpl_value': '',//'#code#=1235231',  // 您设置的模板变量，根据实际情况修改
            'key': '25b7f126eb03f846884ea1b147de251f',  // 应用APPKEY(应用详细页查询)
        });
        var queryUrl = 'http://v.juhe.cn/sms/send?'+queryData;
        request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // 打印接口返回内容

                var jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
                console.log(jsonObj)
            } else {
                console.log('请求异常');
            }
        });
        console.log('sended msg at ' + obj.remindTime);
    });
    Note.update(obj.noteId, {showRemind: false}, function (err, results) {
        if(err){
            console.log(err);
        }
        if(results != null){
            Note.findByUserId(results._doc.userId, 0, function (err, result) {
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
        }else{
           console.log('update showRemind failed...')
        }
    });
})

module.exports = router;
