const merge = require("webpack-merge");

const common = require("./common.config.js");

module.exports = merge(common,
{
  mode: "development",
  devtool: "source-map",
  devServer:
  {
    contentBase: "./",
    port: 9001,
    watchOptions: {
      ignored: /node_modules/,
    },
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  output:
  {
    filename: "[name].js",
    chunkFilename: "[name].js",
  },
});
