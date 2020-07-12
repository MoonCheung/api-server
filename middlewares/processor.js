/*
 * @Description: 路由统一解析器模块
 * @Author: MoonCheung
 * @Date: 2020-02-04 00:38:42
 * @Github: https://github.com/MoonCheung
 */

// 处理成功
exports.handleSuccess = ({ ctx, msg = '', result = null }) => {
  ctx.body = { code: 1, error: 0, result, msg };
};

// 处理错误
exports.handleError = ({ ctx, msg = '', err = null }) => {
  ctx.body = { error: 1, msg, err };
};
