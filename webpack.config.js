'use strict';

const path = require('path');
const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV || 'development';

let plugins = [
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(NODE_ENV)
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.ContextReplacementPlugin(
    new RegExp('\\' + path.sep + 'node_modules\\' + path.sep + 'moment\\' + path.sep + 'locale'),
    /en|de/
  ),
  new webpack.NoErrorsPlugin()
];

if (NODE_ENV == 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  );
}

module.exports = {
  entry: [
    path.resolve(__dirname, 'src/index')
  ],
  output: {
    path: path.resolve(__dirname, NODE_ENV == 'development' ? 'build' : 'dist'),
    filename: `i18n-bundle${NODE_ENV == 'production' ? '.min' : ''}.js`,
    library: 'I18nManager',
    libraryTarget: 'umd'
  },

  devtool: NODE_ENV == 'production' ? 'source-map' : 'eval-source-map',

  plugins: plugins,

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js']
  },

  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplates: ['*-loader', '*'],
    extensions: ['', '.js']
  },

  module: {
    loaders: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, 'src')
      ],
      loader: 'babel-loader'
    }],
    noParse: [
      /node_modules[\\\/]moment-timezone[\\\/]/,
      /node_modules[\\\/]moment-jdateformatparser[\\\/]/
    ]
  }
};
