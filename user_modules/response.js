/**
 * 返回包装对象
 */
var response = {};
response.meta = {};
response.meta.code = '';//是否成功。1.success：成功 2.error：失败。
response.meta.msg = '';//成功或失败的提示信息。
response.result = [];//返回的集合

module.exports = response;