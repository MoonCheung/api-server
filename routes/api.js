const router = require('koa-router')();
const system = require('../controller/system');
const article = require('../controller/article')

/*添加router的前缀 */
router.prefix('/api');
// 控制面板信息
router.post('/system', system.controller);
// 添加文章接口
router.post('/article/insfront', article.insertArticle);


module.exports = router;