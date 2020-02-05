/*
 * @Description: 百度SEO 推送
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2020-02-06 00:08:37
 * @LastEditors: MoonCheung
 * @LastEditTime: 2020-02-06 01:06:23
 */
const request = require('request');
const CONFIG = require('../config');
const chalk = require("chalk");
const success = chalk.bold.green;
const info = chalk.bold.blue;
const error = chalk.bold.red;

// POST request
const postRequest = ({ type, urls, msg }) => {
  return request.post({
    body: `${CONFIG.BAIDU.site}/article/${urls}`,
    headers: { 'Content-Type': 'text/plain' },
    url: `http://data.zz.baidu.com/${type}?site=${CONFIG.BAIDU.site}&token=${CONFIG.BAIDU.token}`,
  }, function(error, response, body) {
    console.info(info(urls, msg, error, body));
  })
}

// 推送成功
exports.baiduSeoPush = urls => {
  postRequest({ type: 'urls', urls, msg: '推送成功:' })
}

// 推送更新成功
exports.baiduSeoUpdate = urls => {
  postRequest({ type: 'update', urls, msg: '推送更新:' })
}

// 推送删除成功
exports.baiduSeoDel = urls => {
  postRequest({ type: 'del', urls, msg: '推送删除:' })
}