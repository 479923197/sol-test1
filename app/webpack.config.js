const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    index:"./src/index.js", 
    gm:"./src/gm.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/gm.html", to: "gm.html" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
  module: {
    rules: [
      {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: 'babel-loader',
                  options: {
                      presets: [['@babel/preset-env', {//注意这里是一个map结构
                          "modules": false,
                           "useBuiltIns": "usage",//按需加载转换语法
                           "corejs": 2//使用useBuiltIns字段必须声明@babel/runtime版本
                      }]],
                       //plugins: ['@babel/plugin-transform-runtime']
                  }
              }
          ]
      }
    ]
  },
};
