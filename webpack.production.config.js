var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

module.exports = {
  resolve: {
    extensions: ['', '.js', '.jsx', '.js', '.css'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main', 'index']
  },
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [],
  module: {
    loaders: [
      {
        test: /^((?!\.module).)*\.css$/,
        loaders: [
          'style-loader',
          'css-loader'
        ]
      }, {
        test: /\.module\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!'
        ]
      }, {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: [node_modules_dir],
        include: [path.join(__dirname, 'src'),]
      }]
  }
};