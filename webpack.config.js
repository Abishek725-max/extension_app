const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    background: "./src/background.js",
    content: "./src/content.js", // Ensure this path is correct
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: "/",
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/manifest.json", to: "manifest.json" },
        { from: "./src/popup.html", to: "popup.html" },
      ],
    }),
    new Dotenv(),
    new webpack.DefinePlugin({
      "process.env.NEXT_PUBLIC_WS_URL": JSON.stringify(
        process.env.NEXT_PUBLIC_WS_URL
      ),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            sourceMaps: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  target: ["web"], // Broader compatibility
  target: "web", // Broader compatibility
  devtool: "source-map",
};
