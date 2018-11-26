const path = require("path");

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
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "../../dist"),
    filename: "[name].js",
    chunkFilename: "[chunkhash].js",
  },
};
