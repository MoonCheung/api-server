/*
 * @Description: 白名单API
 * @Author: MoonCheung
 * @Date: 2019-05-25 23:17:40
 * @Github: https://github.com/MoonCheung
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
  /^\/api\/art\/fetchallart/,
  /^\/api\/art\/fetchartdeil/,
  /^\/api\/art\/fetchhotart/,
  /^\/api\/tag\/fetchalltag/,
  /^\/api\/catg\/fetchallcatg/,
  /^\/api\/catg\/fetchapptcatg/,
  /^\/api\/tag\/fetchappttag/,
  /^\/api\/art\/fetchartarch/,
  /^\/api\/cmt\/fetchaddcmt/,
  /^\/api\/cmt\/addreplycmt/,
  /^\/api\/cmt\/addsubreply/,
  /^\/api\/art\/updlikeart/,
  /^\/api\/cmt\/updlikecmt/,
  /^\/api\/art\/fetchkeyword/
];
module.exports = whitelist;
