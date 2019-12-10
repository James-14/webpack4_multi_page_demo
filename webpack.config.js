const path = require('path');
const glob = require("glob");

const extractTextPlugin = require("extract-text-webpack-plugin");
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");


//读取所有.js文件,动态设置多入口
function getEntry() {
	var entry = {};
	//读取src目录下page下的所有.js文件
	glob.sync('./src/pages/**/*.js')
		.forEach(function (name) {
            let start = name.indexOf('src/') + 10,
				end = name.length - 3;
            let n = name.slice(start, end);
            let key = n.slice(0, n.lastIndexOf('/')); //保存各个组件的入口

            //如果key已经有了，对应的index.js入口文件也有了，不要再重新设置入口
            if(entry.hasOwnProperty(key)){
                if(entry[key].indexOf("index.js")>-1){
                    return
                }
            }

			entry[key] = name;
        });
        
	return entry;
};

module.exports = {
    //配置多个入口
    // entry: {
    //     'index': './src/pages/index/index.js',
    //     'home': './src/pages/home/index.js',
    // },
    entry:getEntry(),
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
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/, //不包含node_modules、bower_components
                use: {
                  loader: 'babel-loader',
                }
            },
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
    // 提取公共代码
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {   // 抽离第三方插件
					test: /node_modules/,   // 指定是node_modules下的第三方包
					chunks: 'initial',
					name: 'vendor',  // 打包后的文件名，任意命名    
					// 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
					priority: 10
				},
				utils: { // 抽离自己写的公共代码，common这个名字可以随意起
					chunks: 'initial',
					name: 'common',  // 任意命名
					minSize: 0,    // 只要超出0字节就生成一个新包
					minChunks: 2
				}
			}
		}
	},
    plugins: [
        // 删除文件 保留新文件
        new CleanWebpackPlugin(),
        new extractTextPlugin({
            // filename: 'css/[name].[hash:8].min.css',
            filename: path.posix.join('assets', '/css/[name].[hash:8].min.css'),
        }),
        
        // new HtmlWebpackPlugin({
        //     title: '多页面开发框架',
        //     template: './src/pages/home/index.html', // 源模板文件
        //     filename: './home/index.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
        //     showErrors: true,
        //     inject: 'true',          //所有JavaScript资源插入到body元素的底部
        //     chunks: ["common", 'home'] //配置写入哪些js和css
        // }),
    ],
}

// 设置html-webpack-plugin参数，返回参数对象
let getHtmlConfig = function (name, chunks) {
	var _template = `./src/pages/${name}/index.html`;
	var _filename = `${name}/index.html`;
	//index单独处理
	if (name === "index") {
		_filename = `index.html`;
	}
	let config = {
		template: _template,
		filename: _filename,
		// favicon: './favicon.ico',
        // title: title,
        showErrors: true,
		inject: true, //设置为true插入的元素放入body元素的底部
		hash: true, //开启hash  ?[hash]
        chunks: chunks,
		minify: process.env.NODE_ENV === "development" ? false : {
			removeComments: true, //移除HTML中的注释
			collapseWhitespace: true, //折叠空白区域 也就是压缩代码
			removeAttributeQuotes: true, //去除属性引用
		}
	};
	return config;
};

//插入htmlWebpackPlugin
 (function(){
    //取得配置的入口key
    const entryObj = getEntry();
    //存储路径和chunks
    const htmlArray = [];
    for(let key in entryObj){
        htmlArray.push({
            html: key,
            chunks: ['vendor', 'common', key]
        })
    }
    //自动生成html模板
    htmlArray.forEach((element) => {
        module.exports.plugins.push(new htmlWebpackPlugin(getHtmlConfig(element.html, element.chunks)));
    });
 })();