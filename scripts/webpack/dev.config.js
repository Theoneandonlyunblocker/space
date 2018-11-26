const merge = require("webpack-merge");

const common = require("./common.config.js");

module.exports = merge(common,
{
  mode: "development",
  devtool: "source-map",
  output:
  {
    filename: "[name].js",
    chunkFilename: "[name].js",
  },
});
