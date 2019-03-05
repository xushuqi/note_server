var express = require('express');
var mongoose = require('mongoose');//导入mongoose模块
var bcrypt = require('bcrypt');
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');

var router = express.Router();
var User = require('../models/user');//导入模型数据模块
var resp = require('../user_modules/response');//公共返回对象

var bcrypt = require('bcrypt');
const ROUNDS = 10;//the number of rounds to process the data for.
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/signIn', function (req, res, next) {
	var queryObj = req.body;
	queryObj.name = queryObj.name.trim();
	queryObj.password = queryObj.password.trim();
	User.findByName(queryObj.name, function (err, result) {
		if(err)
			console.log(err);
		if(!result){
			var user = new User(queryObj);
			bcrypt.genSalt(ROUNDS, function(err, salt) {
				if(err)
					return next(err);
				bcrypt.hash(queryObj.password, salt, function(err, hash) {
					if(err)
						return next(err);
					queryObj.password = hash;
					next();
				})
			});
			if(user.password == queryObj.password){
				req.session._id = results._doc._id;
				req.session.user = results._doc.name;
				resp.meta.code = 'success';
				resp.meta.msg = 'success';
				res.send(resp);
			}
		}else{
			resp.meta.code = 'error';
			resp.meta.msg = '用户名或密码不正确';
			res.send(resp);
		}
	})
});
/**
 * 注册账号
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {}          [description]
 * @return {[type]}       [description]
 */
router.post('/signUp', function(req, res, next) {
	var queryObj = req.body;
	queryObj.name = queryObj.name.trim();
	
	User.findByName(queryObj.name, function(err, results) {
		if(err)
			console.log(err);
		if(!results){
			var user = new User(queryObj);
			user.save(function(err, results) {
				if(err){
					console.log(err);
					resp.meta.code = 'error';
					resp.meta.msg = '插入数据库时发生错误，请重新注册';
				}
				req.session._id = results._doc._id;
				req.session.user = results._doc.name;
				resp.meta.code = 'success';
				resp.meta.msg = 'success';
				res.send(resp);
			});
		}else if(results._doc.name == queryObj.name){
			resp.meta.code = 'error';
			resp.meta.msg = '用户名已被使用';
			res.send(resp);
		}
	});
})
module.exports = router;
