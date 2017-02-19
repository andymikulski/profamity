var webpack = require('webpack');

var config = {
  target: 'node',
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'] },
      { test: /\.json$/, loaders: ['json-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'profamity',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
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
