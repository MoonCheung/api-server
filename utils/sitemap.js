/*
 * @Description: 生成网站地图
 * @Author: MoonCheung
 * @Date: 2020-07-09 21:37:22
 * @Github: https://github.com/MoonCheung
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const error = chalk.bold.red;
const success = chalk.bold.green;
const tagsModel = require('../models/tag');
const cateModel = require('../models/category');
const articleModel = require('../models/article');
const { SitemapStream, streamToPromise } = require('sitemap');

const createXmlFilePath = path.format({
  root: path.join(__dirname, '../../', '/nuxt-blog/static/'),
  name: 'sitemap',
  ext: '.xml'
});

class siteMap {
  static async getSiteMapData() {
    try {
      const smStream = new SitemapStream({
        hostname: 'https://ikmoons.com',
        lastmodDateOnly: false,
        xmlns: {
          news: true,
          xhtml: true,
          image: true,
          video: true
        }
      });

      // 创建xml文件
      smStream.pipe(fs.createWriteStream(createXmlFilePath));
      // 写入流
      smStream.write({ url: '', changefreq: 'always', priority: 1 });
      smStream.write({ url: '/sitemap', changefreq: 'always', priority: 1 });
      smStream.write({ url: '/about', changefreq: 'always', priority: 1 });
      smStream.write({ url: '/archive', changefreq: 'always', priority: 1 });

      // add tags
      await tagsModel
        .find()
        .sort({ _id: '-1' })
        .where({
          status: 1
        })
        .then(data => {
          data.forEach(item => {
            smStream.write({
              url: `/tags/${item.tagname}`,
              changefreq: 'daily',
              priority: 0.6
            });
          });
        });

      // add category
      await cateModel
        .find()
        .sort({ _id: '-1' })
        .then(data => {
          data.forEach(item => {
            smStream.write({
              url: `/catg/${item.categoryname}`,
              changefreq: 'daily',
              priority: 0.6
            });
          });
        });

      // add article
      await articleModel
        .find()
        .sort({ _id: '-1' })
        .where({
          status: 1
        })
        .then(data => {
          data.forEach(artData => {
            smStream.write({
              url: `/article/${artData.id}`,
              changefreq: 'daily',
              priority: 0.8,
              lastmod: artData.cdate
            });
          });
        });

      // 获取一个流返回一个承诺，该承诺将在流发出结束时解析
      streamToPromise(smStream).then(data => {
        data.toString();
      });
      // 确保在结束之前附加一个写流
      smStream.end();
    } catch (err) {
      console.error(error('生成地图 XML 发生时错误:'), err);
    }
  }
}

module.exports = siteMap;
