const router = require('koa-router')();
const user = require('../controller/user');
const system = require('../controller/system');
const article = require('../controller/article')
const articleList = require('../controller/articleList')
const category = require('../controller/category')
const tags = require("../controller/tag")

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
// front文章列表接口
router.get('/article/frontlist', articleList.frontList);
// 添加分类接口
router.post('/category/addcatg', category.addCategory);
// 获取分类列表接口
router.post('/category/getcatg', category.getCategory);
// 编辑分类接口
router.post('/category/editcatg', category.editCategory);
// 删除分类接口
router.post('/category/delcatg', category.delCategory);
// 添加标签接口
router.post('/tag/addtag', tags.addTag);
// 获取标签接口
router.post('/tag/gettag', tags.getTag);
// 编辑标签接口
router.post('/tag/edittag', tags.editTag);
// 删除标签接口
router.post('/tag/deltag', tags.delTag);

module.exports = router;