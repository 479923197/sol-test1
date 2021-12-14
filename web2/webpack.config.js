// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

let pages = ["index", "about"];
let entry = {common:'./src/assets/common.js'}; //要编译的js
let plugins = [
    new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
    }),
    new NodePolyfillPlugin()
];
pages.forEach(_name => {
    entry[_name] = `./src/views/${_name}/index.js`;
    let thisModuleJss = ["common", _name]; //当前页面用到的js
    
    plugins.push(
        new HtmlWebpackPlugin({
            //favicon: path.resolve(__dirname, `./src/assets/img/favicon.ico`),
            filename: path.resolve(__dirname, `./dist/${_name}.html`),
            template: path.resolve(__dirname, `./src/views/${_name}/index.html`),
            chunks: thisModuleJss,
            chunksSortMode: 'manual',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    );
});

const config = {
    entry: entry,
    output: {
        filename: "[name].js",  //name为entry键值对的键名
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: plugins,
    module: {
        rules: [
            {
                test: /\.(html|htm)$/,
                use: ['html-withimg-loader']
            },
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(png|jpg|jpe?g|gif)$/,
                use: ['url-loader', 'image-webpack-loader']
            },
            {
                test: /\.(svg|woff|woff2|ttf|eot)(\?.*$|$)/,
                loader: 'file-loader'
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        config.plugins.push(new MiniCssExtractPlugin());
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
