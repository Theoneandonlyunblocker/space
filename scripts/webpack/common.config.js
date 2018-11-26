const path = require("path");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, "../../"),
  entry:
  {
    main: "./src/main.ts",
    vendor: [
      "localforage",
      "pixi.js",
      "react",
      "react-dom",
      "react-dom-factories",
      "react-motion",
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader',
          options: {
              transpileOnly: true,
              experimentalWatchApi: true,
          },
        }],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, "../../dist"),
    filename: "[name].js",
    chunkFilename: "[chunkhash].js",
  },
};
