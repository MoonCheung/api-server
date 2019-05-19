const router = require('koa-router')();
const user = require('../controller/user');
const system = require('../controller/system');
const article = require('../controller/article');
const category = require('../controller/category');
const tags = require('../controller/tag');
const qiniu = require('../controller/qiniu');

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
router.post('/article/insart', article.insertArticle);
// 获取文章列表接口
router.post('/article/artlist', article.articleList);
// 编辑文章接口
router.put('/article/editart', article.editArticle);
// 获取文章详情接口
router.post('/article/getartdetl', article.getArtDetl);
// 删除文章接口
router.post('/article/delart', article.delArticle);
// 改变文章状态接口
router.post('/article/chgartsts', article.chgArtStatus);
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
// 获取所有标签接口
router.get('/tag/getalltag', tags.getAllTag);
// 获取所有分类接口
router.get('/category/getallcatg', category.getAllCatg);
// 获取上传图片七牛云接口
router.get('/getQNToken', qiniu.QNController.getQiniu);

module.exports = router;