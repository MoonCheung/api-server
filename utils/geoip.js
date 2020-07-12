/*
 * @Description: IP地址统一查询模块
 * @Author: MoonCheung
 * @Date: 2020-02-01 22:55:38
 * @Github: https://github.com/MoonCheung
 */
const CryptoJS = require('crypto-js');
const request = require('request');
const CONFIG = require('../config');

// 云市场分配的密钥Id
const secretId = CONFIG.GEOIP.SecretID;
// 云市场分配的密钥Key
const secretKey = CONFIG.GEOIP.SecretKey;
const source = 'market';

const queryIpInfo = ip => {
  // url
  const url = `https://service-bny0kzwt-1256724964.sh.apigw.tencentcs.com/release/ipquery?ip=${ip}`;

  // 签名
  const datetime = new Date().toGMTString();
  const signStr = 'x-date: ' + datetime + '\n' + 'x-source: ' + source;
  const sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(signStr, secretKey));
  const auth =
    'hmac id="' +
    secretId +
    '", algorithm="hmac-sha1", headers="x-date x-source", signature="' +
    sign +
    '"';

  // 请求头
  const headers = {
    'X-Source': source,
    'X-Date': datetime,
    Authorization: auth
  };

  const options = {
    url: url,
    timeout: 5000,
    headers: headers
  };

  return new Promise((resolve, reject) => {
    request(options, function(error, response, body) {
      const message = response.statusMessage;
      if (!error && response.statusCode == 200) {
        const result = JSON.parse(body);
        if (result) {
          resolve(result.data);
        } else {
          reject(result.data);
        }
      } else {
        reject(error || message);
      }
    });
  });
};

module.exports = queryIpInfo;
