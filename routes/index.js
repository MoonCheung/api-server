/*
 * @Description: 路由API
 * @Author: MoonCheung
 * @Date: 2019-04-12 16:51:06
 * @Github: https://github.com/MoonCheung
 */

const Router = require('koa-router');
const user = require('../controller/user');
const system = require('../controller/system');
const article = require('../controller/article');
const category = require('../controller/category');
const tags = require('../controller/tag');
const qiniu = require('../controller/qiniu');
const comment = require('../controller/comment');

/* 添加router的前缀 */
const router = new Router({
  prefix: '/api'
});
// 控制面板信息接口
router.get('/system', system.controller);
// login接口
router.post('/login', user.login);
// 登录信息接口
router.post('/info', user.info);
// 更新用户信息接口
router.patch('/upduser', user.updateInfo);
// logout接口
router.post('/logout', user.logout);
// 添加文章接口
router.post('/article/insart', article.insertArticle);
// 获取文章列表接口
router.post('/article/artlist', article.articleList);
// 获取文章列表状态接口
router.get('/article/artalllist', article.artAllList);
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
// 获取所有标签数量接口
router.get('/tag/gettagtot', tags.getTagTotal);
// 获取所有分类接口
router.get('/category/getallcatg', category.getAllCatg);
// 获取上传图片七牛云接口
router.get('/getQNToken', qiniu.QNController.getQiniu);
// 获取页面浏览数接口
router.get('/art/getpvtot', article.getPvTotal);
// 获取评论数接口
router.get('/cmt/getallcmt', comment.getCommentTotal);

/***** 小程序相关API *****/
// 获取文章列表API
router.post('/art/getallart', article.getallAtrApplet);
// 获取文章详情API
router.get('/getartdeil/:id', article.getArtDeilApplet);
// 获取分类列表API
router.get('/catg/catglist', category.getAllCatgApplet);
// 获取指定分类列表API
router.post('/art/apptcatg', article.getApptCatgApplet);
// 改变点赞文章API
router.post('/art/chglike', article.chgLikeArtApplet);

/***** Nuxt博客相关API *****/
// 获取文章列表API
router.post('/art/fetchallart', article.fetchAllArt);
// 获取指定ID文章详情API
router.post('/art/fetchartdeil', article.fetchArtDeil);
// 获取热门文章列表API
router.get('/art/fetchhotart', article.fetchHotArt);
// 获取所有标签API
router.get('/tag/fetchalltag', tags.fetchAllTag);
// 获取所有分类API
router.get('/catg/fetchallcatg', category.fetchAllCatg);
// 获取指定分类文章API
router.post('/catg/fetchapptcatg', category.fetchApptCatg);
// 获取指定标签文章API
router.post('/tag/fetchappttag', tags.fetchApptTag);
// 获取文章归档API
router.get('/art/fetchartarch', article.fetchArtArch);
// 添加评论API
router.post('/cmt/fetchaddcmt', comment.fetchAddComment);
// 添加回复评论API
router.post('/cmt/addreplycmt', comment.addReplyComment);
// 添加子回复评论API
router.post('/cmt/addsubreply', comment.addSubReplyComment);
// 更新点赞文章详情API
router.patch('/art/updlikeart/:id', article.updLikeAtrPage);
// 更新点赞评论API
router.patch('/cmt/updlikecmt/:type/:id', comment.updLikeComment);
// 搜索关键词API
router.post('/art/fetchkeyword', article.fetchArtKeyWord);

module.exports = router;
