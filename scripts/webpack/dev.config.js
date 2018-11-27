const merge = require("webpack-merge");
const path = require("path");

const common = require("./common.config.js");

module.exports = merge(common,
{
  mode: "development",
  devtool: "inline-source-map",
  devServer:
  {
    contentBase: "./",
    publicPath: "/dist/",
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
    pathinfo: false,
  },
});
