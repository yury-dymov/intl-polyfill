var webpack            = require('webpack');
var path               = require('path');
// var CleanWebpackPlugin = require('clean-webpack-plugin');

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.optimize.OccurenceOrderPlugin());
}

module.exports = {
  entry: './src/index',
  debug: process.env.NODE_ENV !== 'production',
  resolve: {
    root:               path.join(__dirname, 'src'),
    modulesDirectories: ['node_modules'],
    extensions:         ['', '.js', '.jsx']
  },
  plugins,
  output: {
    path: `${__dirname}/dist/`,
    filename: 'intl-polyfill.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel!eslint-loader', exclude: [/node_modules/, /public/] }
    ]
  },
  eslint: {
    configFile: '.eslintrc'
  },
  devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : null,
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' }
  }
};
