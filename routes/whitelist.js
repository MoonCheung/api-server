/*
 * @Description: 白名单API
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-05-25 23:17:40
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-09-23 09:41:06
 */

const whitelist = [
  // 设置除了私有接口外的其它资源，可不需要认证访问
  /^((?!\/api).)*$/,
  /^\/api\/login/,
  /^\/api\/art\/getallart/,
  /^\/api\/getartdeil/,
  /^\/api\/catg\/catglist/,
  /^\/api\/art\/apptcatg/,
  /^\/api\/art\/chglike/,
  /^\/api\/system/,
  /^\/api\/sendmail/,
];
module.exports = whitelist;