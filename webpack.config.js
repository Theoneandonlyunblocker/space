const path = require("path");

module.exports = {
  cache: true,
  context: path.resolve(__dirname),
  entry:
  {
    main: "./src/App.ts",
    vendor: [
      "localforage",
      "pixi.js",
      "react",
      "react-dom",
      "react-dom-factories",
      "react-motion",
    ],
  },
  devtool: 'inline-source-map',
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "[chunkhash].js",
  },
};
