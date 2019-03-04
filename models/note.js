var mongoose = require('mongoose');
var NoteSchema = require('../schemas/note');//拿到导出的数据集模块
var Note = mongoose.model('note', NoteSchema);//编译生成Note模型

module.exports = Note;