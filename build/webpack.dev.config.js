const path = require("path");
const merge = require("webpack-merge");
const webpackConfigBase = require("./webpack.config.js");


const webpackConfigDev = {
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        // publicPath: '/',
        // host: 'local.pcteam.com.cn',
        // host: '0.0.0.0' || 'config.dev.host', //手机联测使用
        port: '8000',
        overlay: true, // 浏览器页面上显示错误
        open: true, // 开启浏览器
        // stats: "errors-only", //stats: "errors-only"表示只打印错误：
        // hot: true, // 开启热更新
        // inline: true,
        //服务器代理配置项
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://test.pcteam.com.cn',
                changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
                secure: false,
                // pathRewrite: {
                // 	'^/files': ''
                // }
                //修改服务端返回的cookie路径
                // cookiePathRewrite: {
                //     '///': '///',
                // },
                //修改服务端返回的cookie domain
                // cookieDomainRewrite: {
                //     'unchanged.domain': 'unchanged.domain',
                //     'pcteam.com': 'local.pcteam.com:8000',
                //     '*': '',
                // },
            },
        },
    },
    plugins: [
        //热更新 hot: true 需要同时配置
        // new webpack.HotModuleReplacementPlugin(),
    ],
    // 生成map格式的文件，里面包含映射关系的代码，如果想查看在源文件中错误的位置，则需要使用映射关系，找到对应的位置。
    devtool: 'source-map', 
}

//合并基础配置和dev配置
module.exports = merge(webpackConfigBase, webpackConfigDev)


