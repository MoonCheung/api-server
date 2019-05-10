const router = require('koa-router')();
const user = require('../controller/user');
const system = require('../controller/system');
const article = require('../controller/article')

/*添加router的前缀 */
router.prefix('/api');
// 控制面板信息接口
router.post('/system', system.controller);
// login接口
router.post('/login', user.login);
// 登录信息接口
router.get('/info', user.info);
// logout接口
router.post('/logout', user.logout);
// 添加文章接口
router.post('/article/insfront', article.insertArticle);


module.exports = router;