const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

module.exports = {
  mode: process.env.mode,
  entry: {
    app: path.join(__dirname, './client/src/index.jsx'),
  },
  output: {
    path: path.join(__dirname, './client/dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  module: {
    rules: [
      // Babel for JSX syntax
      { 
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          }
        }
      },
      // Node-SASS loader for SASS
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Boilerplate',
      template: path.join(__dirname, './client/src/template.html'),
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, './client/dist'),
    },
    port: parseInt(process.env.PORT) || 3000,
    compress: true,
  },
  devtool: 'inline-source-map',
};
