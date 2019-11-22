const path = require('path');

const extractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    //配置多个入口
    entry: {
        'index': './src/pages/index/index.js',
        'home': './src/pages/home/index.js',
    },
    output: {
        //__dirname node.js的一个全局环境变量,用于指向当前执行脚本（dirname.js）所在的目录路径，而且是绝对路径
        path: path.resolve(__dirname, 'dist'),
        // 多入口打包后的文件名
        publicPath: '/',
        filename: 'assets/js/[name].[hash:8].js',
    },
    module: {
        rules: [
            {
                test: /\.(css|scss|sass)$/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",// 将 JS 字符串生成为 style 节点，不打包成单独文件
                    use: [
                        "css-loader", // 将 CSS 转化成 CommonJS 模块
                        "sass-loader", // 将 Sass 编译成 CSS
                        "postcss-loader"], //autoprefixer postcss处理浏览器兼容
                    // publicPath: "/"  // css中的基础路径,默认使用输出配置中的路径
                })
            },
            {
                test: /\.(png|svg|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,    //小于这个数时，会转成DataURL
                            name:'assets/img/[name].[hash:9].[ext]',//输出到文件夹,基于output根目录
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // 删除文件 保留新文件
        new CleanWebpackPlugin(),
        new extractTextPlugin({
            // filename: 'css/[name].[hash:8].min.css',
            filename: path.posix.join('assets', '/css/[name].[hash:8].min.css'),
        }),
        new HtmlWebpackPlugin({
            title: '多页面开发框架',
            template: './src/pages/index/index.html', // 源模板文件
            filename: './index/index.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
            showErrors: true,
            inject: 'true',          //所有JavaScript资源插入到body元素的底部
            chunks: ["common", 'index'] //配置写入哪些js和css
        }),
        new HtmlWebpackPlugin({
            title: '多页面开发框架',
            template: './src/pages/home/index.html', // 源模板文件
            filename: './home/index.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
            showErrors: true,
            inject: 'true',          //所有JavaScript资源插入到body元素的底部
            chunks: ["common", 'home'] //配置写入哪些js和css
        }),
    ],
}