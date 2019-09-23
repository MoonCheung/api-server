/*
 * @Description: 邮件接口暂时不做
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-09-22 18:08:34
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-09-23 16:46:34
 */

const nodemailer = require('nodemailer');
// const path = require('path');
// const ejs = require('ejs');
// const fs = require('fs');

async function sendEmail(ctx) {
  const {
    name,
    companyName,
    companyArea,
    email,
    phone
  } = ctx.request.body;

  let transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    service: 'qq', // no need to set host or port etc.
    port: 465,
    secureConnection: true, // 使用了 SSL
    auth: {
      user: '295059753@qq.com', // 邮箱账号
      pass: '******' // SMTP 密码
    }
  });

  // const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, '../views/contacts.ejs'), 'utf8'));
  // const html = template({
  //   name,
  //   companyName,
  //   companyArea,
  //   phone,
  //   date: new Date().toLocaleDateString()
  // });

  let mailOptions = {
    from: '"MoonCheung" <295059753@qq.com>', // sender address
    to: email, // list of receivers
    subject: 'Hello ✔✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
  };

  let error = ''
  await transporter.sendMail(mailOptions, (err, info) => {
    error = err;
    console.info('Message sent: %s', info.messageId);
  });
  if (error) {
    ctx.body = {
      code: 0,
      error: 1,
      msg: error
    }
  } else {
    ctx.body = {
      code: 1,
      error: 0,
      msg: "邮件已发送"
    }
  }
}

module.exports = {
  sendEmail
}