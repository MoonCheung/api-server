const qiniu = require('qiniu')
const CONFIG = require('../config/index')

// 创建上传之前需要两个凭证
const accessKey = CONFIG.QINIU.AccessKey;
const secretKey = CONFIG.QINIU.SecretKey;

/**
 * 上传图片七牛云配置
 */
const QNController = {
  getQiniu(ctx) {
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
    }
  }
}

module.exports = {
  QNController
}