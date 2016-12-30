
var ClosureCompiler = require('google-closure-compiler-js').webpack;
var webpack = require('webpack');

var config = {
  target: 'node',
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
      { test: /\.json$/, loaders: ['json-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'watch-yo-profamity',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  node: {
    fs: 'empty'
  }
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourcemap: false,
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  );
}

module.exports = config;
