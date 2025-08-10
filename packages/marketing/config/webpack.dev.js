// Import the `merge` function from webpack-merge to combine multiple configs
const { merge } = require("webpack-merge");

// Import plugin to generate HTML files and inject scripts
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Import Webpack's Module Federation Plugin for microfrontend architecture
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

// Import the common Webpack config shared between environments
const commonConfig = require("./webpack.common");

// Import package.json to reuse dependency versions in shared modules
const packageJson = require("../package.json");

// Development-specific Webpack configuration
const devConfig = {
  // Enable development mode for better debugging & faster builds
  mode: "development",

  // Configure the base URL where this app will be served
  output: {
    publicPath: "http://localhost:8081/",
  },

  // Local development server settings
  devServer: {
    port: 8081, // Run on port 8081
    historyApiFallback: {
      historyApiFallback: true, // Support client-side routing without 404 errors
    },
  },

  // List of plugins to use in this config
  plugins: [
    // Configure Module Federation
    new ModuleFederationPlugin({
      name: "marketing", // Unique name for this remote module
      filename: "remoteEntry.js", // File that will be served for other apps to consume

      // Modules this app will expose to others
      exposes: {
        "./MarketingApp": "./src/bootstrap", // Alias : Local file path
      },

      // Shared dependencies configuration
      shared: {
        ...packageJson.dependencies, // Share all dependencies from package.json

        // Ensure React is a singleton (only one version loaded at runtime)
        react: {
          singleton: true,
          requiredVersion: packageJson.dependencies.react,
        },

        // Ensure ReactDOM is also singleton
        "react-dom": {
          singleton: true,
          requiredVersion: packageJson.dependencies["react-dom"],
        },

        // Ensure React Router DOM is singleton
        "react-router-dom": {
          singleton: true,
          requiredVersion: packageJson.dependencies["react-router-dom"],
        },
      },
    }),

    // Generate index.html with injected script tags
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

// Merge the common config with the development-specific config
module.exports = merge(commonConfig, devConfig);
