/*
 * @Description: MD5
 * @Author: MoonCheung
 * @Github: https://github.com/MoonCheung
 * @Date: 2019-05-02 22:41:11
 * @LastEditors: MoonCheung
 * @LastEditTime: 2019-05-30 21:41:58
 */

const crypto = require('crypto');

/**
 * @param {String} MD5
 * @return {String}
 */
module.exports = (pwd) => {
    let md5 = crypto.createHash('md5');
    let password = md5.update(pwd).digest('hex');
    return password;
};
