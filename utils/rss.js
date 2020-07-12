/*
 * @Description: 生成 RSS
 * @Author: MoonCheung
 * @Date: 2020-07-12 15:02:52
 * @Github: https://github.com/MoonCheung
 */
const fs = require('fs');
const rss = require('rss');
const path = require('path');
const chalk = require('chalk');
const error = chalk.bold.red;
const app = require('../package');
const articleModel = require('../models/article');

const createXmlFilePath = path.format({
  root: path.join(__dirname, '../../', '/nuxt-blog/static/'),
  name: 'rss',
  ext: '.xml'
});

class feed {
  static async getRSSData() {
    try {
      const getYearTime = new Date().getFullYear();
      const feed = new rss({
        title: 'iKmoons.com',
        description: 'iKmoons.com',
        language: 'zh',
        site_url: `${app.author.website}`,
        feed_url: `${app.author.website}/rss.xml`,
        image_url: `${app.author.website}/icon.png`,
        copyright: `${getYearTime} iKmoons.com`,
        generator: `api-server ${app.version}`
      });

      // add article data
      await articleModel
        .find()
        .sort({ _id: '-1' })
        .where({
          status: 1
        })
        .then(data => {
          data.forEach(artData => {
            feed.item({
              title: artData.title,
              description: artData.desc,
              url: `${app.author.website}/article/${artData.id}`,
              author: app.author.name,
              date: artData.cdate,
              enclosure: {
                url: artData.banner
              }
            });
          });
        });

      // 缓存要发送给客户机的XML
      return fs.writeFileSync(createXmlFilePath, feed.xml());
    } catch (err) {
      console.error(error('生成RSS发生时错误:'), err);
    }
  }
}

module.exports = feed;
