/*
 * @Description: 七牛云上传配置
 * @Author: MoonCheung
 * @Date: 2019-05-15 23:18:04
 * @Github: https://github.com/MoonCheung
 */

const qiniu = require('qiniu');
const CONFIG = require('../config');

// 创建上传之前需要两个凭证
const accessKey = CONFIG.QINIU.AccessKey;
const secretKey = CONFIG.QINIU.SecretKey;

/**
 * 上传图片七牛云配置
 */
class QNController {
  // 获取七牛上传token
  static async getQiniu(ctx) {
    try {
      let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
      let options = {
        scope: CONFIG.QINIU.Bucket,
        expires: 7200
      };
      let putPolicy = new qiniu.rs.PutPolicy(options);
      //上传鉴权
      let uploadToken = putPolicy.uploadToken(mac);
      ctx.body = {
        error: 0,
        msg: '获取upload Token 成功',
        result: {
          token: uploadToken
        }
      };
    } catch (err) {
      ctx.response.status = 500;
      ctx.body = {
        code: 500,
        msg: '获取Token失败',
        err
      };
    }
  }
}

module.exports = {
  QNController
};
