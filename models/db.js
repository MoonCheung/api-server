const autoIncrement = require('mongoose-auto-increment');
const mongoose = require('mongoose')
const chalk = require('chalk')
//导入config配置
const CONFIG = require('../config')
const success = chalk.bold.blue;
const error = chalk.bold.red;

const db = mongoose.createConnection(`${CONFIG.mongodb}`, {
  keepAlive: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})

autoIncrement.initialize(db);

db.once('open', () => {
  console.log(success('数据库连接成功!'))
})

db.once('error', () => {
  console.log(error('数据库连接失败!'))
})

module.exports = db