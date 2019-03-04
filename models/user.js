var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');//拿到导出的数据集模块
var User = mongoose.model('user', UserSchema);//编译生成User模型

module.exports = User;