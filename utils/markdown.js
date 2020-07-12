/*
 * @Description: 解析 markdown 模块
 * @Author: MoonCheung
 * @Date: 2020-02-05 16:40:46
 * @Github: https://github.com/MoonCheung
 */

const markdown = require('markdown-it');
const abbr = require('markdown-it-abbr');
const deflist = require('markdown-it-deflist');
const emoji = require('markdown-it-emoji');
const footnote = require('markdown-it-footnote');
const imagesPreview = require('markdown-it-images-preview');
const ins = require('markdown-it-ins');
const mark = require('markdown-it-mark');
const sub = require('markdown-it-sub');
const sup = require('markdown-it-sup');
const taskLists = require('markdown-it-task-lists');
const toc = require('markdown-it-toc');

// markdown-it 配置
const config = {
  html: true,
  breaks: true,
  linkify: false,
  injected: true,
  xhtmlOut: true,
  langPrefix: 'md-',
  quotes: '“”‘’'
};

const parseMark = new markdown(config)
  .use(abbr)
  .use(deflist)
  .use(emoji)
  .use(footnote)
  .use(imagesPreview)
  .use(ins)
  .use(mark)
  .use(sub)
  .use(sup)
  .use(taskLists)
  .use(toc);

module.exports = parseMark;
