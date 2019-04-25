const router = require('koa-router')();
const system = require('../controller/system');

/*添加router的前缀 */
router.prefix('/api');
/*控制面板信息 */
router.post('/system', system.controller);

module.exports = router;