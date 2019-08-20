var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [{
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'jquerySwipeHandler.js',
    library: 'jquerySwipeHandler',
    libraryTarget: 'var'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['babel-preset-stage-0'].map(require.resolve)
        }
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: false
    })
  ],
  externals: {
    jquery: 'jQuery'
  }
}, ];