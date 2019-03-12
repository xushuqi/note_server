var mongoose = require('mongoose');
var moment = require('moment');
//声明mongoose对象
var NoteSchema = new mongoose.Schema({
	userId: String,
	userName:String,
	title: String,
	content: String,
	meta: {
		createAt: {
			type: String,
			default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss').toString()
		},
		updateAt: {
			type: String,
			default:  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss').toString()
		},
		remindTime: {
			type: String,
			default:  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss').toString()
		}
	}
});

//每次执行都会调用，时间更新操作
NoteSchema.pre(['save', 'update'], function(next){
	if(this.isNew) {
		this._doc.meta.createAt = this.meta.updateAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss').toString();
	}else{
		this._doc.meta.updateAt =  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss').toString();
	}
	
	next();
});

//查询的静态方法
NoteSchema.statics = {
	fetch: function(cb) {//查询所有数据
		return this
			.find({})
			.sort({'meta.updateAt': '-1'})//排序
			.exec(cb)//回调
	},
	findById: function(id, cb) {//根据id查询单条数据
		return this
			.findOne({_id: id})
			.exec(cb)
	},
	findByUserId: function(id, cb) {//根据id查询单条数据
		return this
			.find({userId: id})
			.sort({'meta.createAt': '-1'})
			.exec(cb)
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
	},
	update: function(id, obj, cb) {
		return this
			.findByIdAndUpdate(id, obj, {new: true})
			.exec(cb)
	}
}

//暴露出去的方法
module.exports = NoteSchema;