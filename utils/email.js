/*
 * @Description: 邮件模块
 * @Author: MoonCheung
 * @Date: 2020-02-02 14:42:56
 * @Github: https://github.com/MoonCheung
 */

const nodemailer = require('nodemailer');
const CONFIG = require('../config');
const chalk = require('chalk');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const success = chalk.bold.green;
const error = chalk.bold.red;
// 使用默认的SMTP传输创建可重用的transporter对象
const transporter = nodemailer.createTransport({
  host: CONFIG.EMAIL.host,
  port: CONFIG.EMAIL.port,
  secure: true, // 使用了 SSL
  auth: {
    user: CONFIG.EMAIL.user, // 邮箱用户
    pass: CONFIG.EMAIL.pass // 授权码，而不是登录密码
  }
});

const sendMails = param => {
  // 生成模板
  const template = ejs.compile(
    fs.readFileSync(path.resolve(__dirname, '../views/comment.ejs'), 'utf8')
  );
  const html = template({
    param,
    date: new Date().toLocaleString().replace(/\//g, '-')
  });

  const mailOptions = {
    from: `"MoonCheung" <${param.email}>`, // 发件人地址，from和auth.user必须一致，否则回报错，
    to: `${param.to_name} <${param.to_email}>`, // 接收人清单
    subject: '你好,你在MoonCheung的博客有新的评论回复,点击查看吧', // 主题行
    html
  };

  // 发送邮件
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(error('Message sent err:'), err);
    } else {
      console.info(success('Message sent success:'), info.response);
    }
  });
};

module.exports = sendMails;
