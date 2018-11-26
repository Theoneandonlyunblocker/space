const merge = require("webpack-merge");

const common = require("./common.config.js");

module.exports = merge(common,
{
  mode: "production",
  devtool: "source-map",
  output:
  {
    filename: "[name].min.js",
    chunkFilename: "[name].min.js",
  },
});
