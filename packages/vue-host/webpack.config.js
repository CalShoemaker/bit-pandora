const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { VueLoaderPlugin } = require("vue-loader");
const deps = require("./package.json");

module.exports = (_, argv) => ({
  output: {
    publicPath: "http://localhost:8080/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".vue", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 8080,
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
      name: "vue_host",
      filename: "remoteEntry.js",
      remotes: {
        vue_store: "vue_store@http://localhost:8078/remoteEntry.js",
        vue_modules:"vue_modules@http://localhost:8079/remoteEntry.js"
      },
      exposes: {
        // "./store": "./src/store/index.ts" //
      },
      shared: require("./package.json").dependencies,
      // shared: {
      //   vue: {
      //     eager: true,
      //     singleton: true,
      //     requiredVersion: deps.vue
      //   },
      //   "vue-router": {
      //     eager: true,
      //     singleton: true,
      //     requiredVersion: deps["vue-router"]
      //   },
      //   vuex: {
      //     eager: true,
      //     singleton: true,
      //     requiredVersion: deps["vuex"]
      //   },
      // },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
});
