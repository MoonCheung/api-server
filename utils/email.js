/*
 * @Description: 邮件模块
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2020-02-02 14:42:56
 * @LastEditors: MoonCheung
 * @LastEditTime: 2020-02-05 19:57:31
 */

const nodemailer = require('nodemailer');
const CONFIG = require('../config');
const chalk = require("chalk");
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const success = chalk.bold.green;
const error = chalk.bold.red;
const transporter = nodemailer.createTransport({
  host: CONFIG.EMAIL.host,
  port: CONFIG.EMAIL.port,
  secureConnection: true, // 使用了 SSL
  auth: {
    user: CONFIG.EMAIL.user,
    pass: CONFIG.EMAIL.pass
  }
});

const sendMails = param => {
  // 生成模板
  const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, '../views/comment.ejs'), 'utf8'));
  const html = template({
    param,
    date: new Date().toLocaleString().replace(/\//g, "-")
  });

  const mailOptions = {
    from: `"MoonCheung" <${param.email}>`, // sender address
    to: `"${param.to_name}" <${param.to_email}>`, // list of receivers
    subject: '你好,你在MoonCheung的博客有新的评论回复,点击查看吧', // Subject line
    html
  };

  // 发送邮件
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(error('Message sent err:'), err.Error);
    } else {
      console.info(success('Message sent success:'), info.response);
    }
  });
}

module.exports = sendMails;