module.exports = {
    entry:process.env.mode =='production' ? "./src/index.ts" : './dev/app.ts',
    output: {
        filename: "jy.js",
        path: __dirname
    },
    mode: 'development',
    // Enable sourcemaps for debugging webpack's output.
    devtool:  process.env.mode =='production' ?"none" : "source-map",
    // devServer
    devServer: {
        contentBase: __dirname + "/dev",
        compress: true,
        port: 9000,
        hot:true
    },
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