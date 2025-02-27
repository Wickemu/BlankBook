// webpack.config.js
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './public/js/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 8080,
    hot: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true
      }
    ],
    historyApiFallback: true,
    devMiddleware: {
      writeToDisk: true,
    }
  }
};