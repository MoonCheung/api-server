/*
 * @Description: 邮件接口
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-09-22 18:08:34
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-09-22 19:13:26
 */

async function sendEmail(ctx) {
  // const {
  //   email,
  //   name
  // } = ctx.request.body;
  // console.log(email, name)
  // console.log(ctx.request.body);
  console.log(ctx.request.body);

  // let transporter = nodemailer.createTransport({
  //   // host: 'smtp.ethereal.email',
  //   service: 'qq', // no need to set host or port etc.
  //   port: 465,
  //   secure: true, // true for 465, false for other ports
  //   secureConnection: true,
  //   auth: {
  //     user: '295059753@qq.com', //邮箱账号
  //     pass: 'zgcpcmqsnjhncajf' // SMTP 密码
  //   }
  // });

  // let mailOptions = {
  //   from: '"MoonCheung" <295059753@qq.com>', // sender address
  //   to: 'salvador23@163.com', // list of receivers
  //   subject: 'Hello ✔', // Subject line
  //   text: 'Hello world?', // plain text body
  //   html: '<b>Hello world?</b>' // html body
  // };

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     return console.log(error);
  //   }
  //   console.log('Message sent: %s', info.messageId);
  // });
}

module.exports = {
  sendEmail
}