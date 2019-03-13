var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const ROUNDS = 10;//the number of rounds to process the data for.
//声明mongoose对象
var UserSchema = new mongoose.Schema({
	name: String,
	password: String,
	phone: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

//每次执行都会调用，时间更新操作
UserSchema.pre('save', function(next){
	var user = this;
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	if(user.password !== ''){
		var round = 10;
		var hash = bcrypt.hashSync(user.password.toString(), round);
		user.password = hash;
	}
	next();
	// bcrypt.genSalt(ROUNDS, function(err, salt) {
	// 	if(err)
	// 		return next(err);
	// 	bcrypt.hash(user.password, salt, function(err, hash) {
	// 		if(err)
	// 			return next(err);
	// 		user.password = hash;
	// 		next();
	// 	})
	// })
});
/**
 * 比较密码和数据库密码是否一致
 * @param pwd 用户输入密码
 * @param hash 数据库存储的密码hash值
 * @returns {*}
 */
UserSchema.methods.comparePwd = function(pwd, hash) {
	return bcrypt.compareSync(pwd, hash);
}

//查询的静态方法
UserSchema.statics = {
	fetch: function(cb) {//查询所有数据
		return this
			.find({})
			//.sort('meta.updateAt')//排序
			.exec(cb)//回调
	},
	findById: function(id, cb) {//根据id查询单条数据
		return this
			.findOne({_id: id})
			.exec(cb)
	},
	findByName: function(name, cb) {//根据name查询
		var obj = {};
		obj.name = name;
		return this.findOne(obj).exec(cb);
	},
	save: function(cb) {//新增用户
		return this
			.save(obj)
			.exec(cb)
	},
	update: function (id, obj, options, cb) {
		if(obj.password !== ''){
			var round = 10;
			var hash = bcrypt.hashSync(obj.password.toString(), round);
			obj.password = hash;
		}
		return this
			.findOneAndUpdate(id, obj, options)
			.exec(cb)
	}
}

//暴露出去的方法
module.exports = UserSchema;