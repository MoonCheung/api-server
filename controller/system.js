/*
 * @Description: node的os模块
 * @Author: MoonCheung
 * @Date: 2019-04-22 16:45:08
 * @Github: https://github.com/MoonCheung
 */

const os = require('os');

/**
 *@param {String} constants 已发生异常进程
 *@param {String} release 系统发行版本
 *@param {String} platform Node.js编译时的操作系统平台
 *@param {Array} cpus CPU核心数详细信息
 *@param {String} hostname 主机名
 *@param {Number|String} totalmem 系统内存总数
 *@param {String} type 操作系统类型
 *@param {String} percentage 内存占用率百分比
 *@param {Number|String} freemem 系统空闲内存
 */

async function controller(ctx, next) {
  let { freemem, cpus, hostname, platform, release, totalmem, type, constants } = os;
  let total = parseInt(totalmem() / 1024 / 1024);
  let num = parseInt(freemem() / 1024 / 1024);
  let percentage = parseInt((num / total) * 100);
  ctx.body = {
    code: 1,
    error: 0,
    constants: constants.SIGTRAP ? '1' : '0',
    release: release(),
    platform: platform(),
    hostname: hostname(),
    type: type(),
    cpus: cpus(),
    totalmemory: `${total}MB`,
    Freememory: `${num}MB`,
    percentage
  };
}

module.exports = {
  controller
};
