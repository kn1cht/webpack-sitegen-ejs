'use strict';

const globule = require('globule');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const targetTypes = { ejs : 'html', js : 'js' };

const getEntriesList = (targetTypes) => {
  const entriesList = {};
  for(const [ srcType, targetType ] of Object.entries(targetTypes)) {
    const filesMatched = globule.find([`**/*.${srcType}`, `!**/_*.${srcType}`], { cwd : `${__dirname}/src` });
    
    for(const srcName of filesMatched) {
      const targetName = srcName.replace(new RegExp(`.${srcType}$`, 'i'), `.${targetType}`);
      entriesList[targetName] = `${__dirname}/src/${srcName}`;
    }
  }
  return entriesList;
}

const app = {
  entry  : getEntriesList(targetTypes),
  output : {
    filename : '[name]',
    path     : `${__dirname}/public`
  },
  module : {
    rules : [{
      test : /\.ejs$/,
      use  : [
        'html-loader',
        'ejs-html-loader'
      ]
    }]
  },
  plugins : [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.ejs'
    })
  ]
};

module.exports = app;