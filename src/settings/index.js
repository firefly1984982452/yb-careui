'use strict'
const merge = require('webpack-merge')
const setting = require('./setting') // 基础配置

// 根据环境引入不同配置 process.env.NODE_ENV  ex:development.js
const envSetting = require('./' + process.env.NODE_ENV + '.js')
module.exports = merge(setting, envSetting)
