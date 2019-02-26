# note_server
一.前端项目，使用vue
1.安装vue-cli
如果安装了老版本的vue-cli，需使用命令npm uninstall vue-cli卸载
npm install -g @vue/cli

查看vue版本
vue --version

2.初始化前端vue项目
vue init webpack-simple note_web

3.进到目录&初始化并启动项目
cd my-project & npm run serve

4.运行前端项目
npm run dev

二.后端项目，使用express node框架
node设置淘宝镜像
npm config set registry "https://registry.npm.taobao.org"

通过应用生成器工具 express-generator 可以快速创建一个应用的骨架。

express-generator 包含了 express 命令行工具。通过如下命令即可安装：

npm install express-generator -g

创建express项目
express note_server

安装依赖
npm install

安装cors，支持跨域
npm install cors --save

运行项目
SET DEBUG=note-server:* & npm start

安装mongoose
npm install mongoose --save


git 
git commit -m "first commit"
git remote add origin https://github.com/xushuqi/note_web.git
git push -u origin master

echo "# note_server" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/xushuqi/note_server.git
git push -u origin master //git push -f origin master //不更新直接提交
