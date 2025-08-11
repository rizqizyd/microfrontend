// Import plugin to generate an HTML file and inject bundled scripts automatically
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        // Apply this rule to JavaScript files (both .js and .mjs)
        test: /\.m?js$/,
        // Skip processing for files inside node_modules to improve build speed
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Transpiles modern JS/JSX to compatible JS
          options: {
            // Presets for transforming React JSX and modern JavaScript
            presets: ["@babel/preset-react", "@babel/preset-env"],
            // Plugin to optimize helper code and avoid duplication
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // Template HTML file where bundled JS will be injected
      template: "./public/index.html",
    }),
  ],
};
