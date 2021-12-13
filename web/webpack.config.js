const path = require("path"); //路径管理模块,使用它可以高效获取项目路径,避免路径错误.
const HtmlPlugin = require('html-webpack-plugin');

let mods = ["index", "about"];

let entry = {};
let plugins = [];

(function(){
	mods.forEach(i => {
		let name = mods[i]
		entry[name] = `./src/views/${name}/index.js`;
		
		plugins.push(
			new HtmlPlugin({
				favicon: path.resolve(__dirname, `./src/assets/img/favicon.ico`),
				filename: path.resolve(__dirname, `./dist/${name}.html`),
				template: path.resolve(__dirname, `./src/views/${name}/index.html`),
				chunks: name,
				chunksSortMode: 'manual',
				minify: {
					collapseWhitespace: true,
					removeComments: true
				}
			})
		);
    });
})();

/**
 * 在这个对象中配置webpack的运行参数
 */
var config = {
  entry: {index:"./src/index.js", about:"./src/about.js"},
  output: {
    filename: "[name].js",  //name为entry键值对的键名
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
		{ test: /\.css$/, use: ["style-loader", "css-loader"] },
		{ test: /\.(jpg|jpeg|png|gif)$/, use: "url-loader" },
		{ test: /\.(woff|woff2|ttf|eot|svg)$/, use: "url-loader" },
		{
			test: require.resolve('jquery'),
			use: [{
				loader: 'expose-loader',
				options: 'jQuery'
			}, {
				loader: 'expose-loader',
				options: '$'
			}]
		},
		{
			test: /\.(html|htm)$/,
			use: ['html-withimg-loader']
		}
    ]
  },
  stats: "errors-only",
  plugins: plugins,
  //配置webpack-dev-server的运行参数
  devServer: {
    open: true, //运行后自动打开浏览器
    port: 9001, //启动的服务器的监听端口
    contentBase: path.join(__dirname, "./dist"), //指定托管的网站文件的根目录
  }
};

/**
 * 向外暴露配置webpack的对象
 */
module.exports = config;