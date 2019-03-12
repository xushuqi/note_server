var mongoose = require('mongoose');
var moment = require('moment');
//声明mongoose对象
var RemindSchema = new mongoose.Schema({
    noteId: String,
    userId: String,
    userName: String,
    phone: String,
    content: String,
    remindTime: String
});

//查询的静态方法
RemindSchema.statics = {
	fetch: function(cb) {//查询所有数据
		return this
			.find({})
			.exec(cb)//回调
	},
	save: function(cb) {
		return this
			.save(obj)
			.exec(cb)
	},
	delOne: function(id, cb) {
		return this
			.deleteOne({_id: id})
			.exec(cb)
	}
}

//暴露出去的方法
module.exports = RemindSchema;