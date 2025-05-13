const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptWebpackPlugin = require('html-inline-script-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? "production" : "development",
    entry: "./src/js/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
      publicPath: '',
      assetModuleFilename: 'assets/[name][ext][query]' // Для asset/resource, если понадобится
    },
    devtool: isProduction ? false : "inline-source-map",
    devServer: {
      static: "./dist",
      hot: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",
        inject: "body",
      }),
      isProduction && new HtmlInlineScriptWebpackPlugin({scriptMatchPattern: [/.+\.js$/]}),
      isProduction && new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/inline",
        },
        {

          test: /\.atlas\.txt$/i,
          type: "asset/source",
        },
        {

          test: /spineboy-pro\.json$/i,
          type: "asset/source",
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.json', '.atlas.txt'],
    },
    optimization: {
      runtimeChunk: false,
      splitChunks: isProduction
        ? {chunks: 'all'}
        : false,
    },
    performance: {
      hints: false,
      maxEntrypointSize: isProduction ? 5120000 : 1024000,
      maxAssetSize: isProduction ? 5120000 : 1024000,
    }
  };
};
