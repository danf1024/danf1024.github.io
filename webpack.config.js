var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build/js'),
    APP_DIR = path.resolve(__dirname, 'src/js');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(APP_DIR),
      path.resolve('./node_modules')
    ],
    extensions: ['.js', '.jsx']
  }
};

module.exports = config;
