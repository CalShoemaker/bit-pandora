const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = (_, argv) => ({
  output: {
    publicPath: "http://localhost:8078/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".vue", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 8078,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.tsx?$/,
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              appendTsSuffixTo: ["\\.vue$"],
              happyPackMode: true,
            },
          },
        ],
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },

  plugins: [
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: "vue_store",
      filename: "remoteEntry.js",
      remotes: {
        vue_store: "vue_store@http://localhost:8078/remoteEntry.js",
      },
      exposes: {
        "./store": "./src/store/",
      },
      shared: require("./package.json").dependencies,
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
});
