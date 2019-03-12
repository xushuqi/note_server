var mongoose = require('mongoose');
var RemindSchema = require('../schemas/remind');//拿到导出的数据集模块
var Remind = mongoose.model('remind', RemindSchema);//编译生成Remind模型

module.exports = Remind;