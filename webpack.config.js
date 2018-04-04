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
    new CopyWebpackPlugin(
      [{ from : `${__dirname}/src` }],
      { ignore : Object.keys(targetTypes).map((ext) => `*.${ext}`) }
    )
  ]
};

for(const [ targetName, srcName ] of Object.entries(getEntriesList({ ejs : 'html' }))) {
  app.plugins.push(new HtmlWebpackPlugin({
    filename : targetName,
    template : srcName
  }));
}

module.exports = app;