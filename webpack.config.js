let config = {
    entry: process.env.mode == 'production' ? "./src/index.ts" : './dev/game.ts',
    output: {
        filename: "jy.js",
        path: __dirname
    },
    mode: 'development',
    // Enable sourcemaps for debugging webpack's output.
    devtool: process.env.mode == 'production' ? "none" : "source-map",
    // devServer
    // devServer: {
    //     contentBase: __dirname + "/dev",
    //     compress: true,
    //     port: 9000,
    //     hot:true
    // },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    }
};
if (process.env.mode == 'development') {
    //开发调试环境编译game.js
    config.output = {
        filename: "game.js",
        path: __dirname + '/dev/'
    }
    //watch打包参数
    config.watchOptions = {
        poll: 1000,//监测修改的时间(ms)
        aggregateTimeout: 500, //防止重复按键，500毫米内算按键一次
        ignored: /node_modules///不监测
    }
}
module.exports = config;