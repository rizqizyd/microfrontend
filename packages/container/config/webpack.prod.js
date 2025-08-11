// Import the merge function to combine the common config with production-specific config
const { merge } = require("webpack-merge");

// Import Webpack's Module Federation Plugin to enable microfrontend architecture
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

// Import common Webpack configuration (shared between dev & prod)
const commonConfig = require("./webpack.common");

// Import package.json so we can reuse dependency versions for shared modules
const packageJson = require("../package.json");

// Get the production domain from environment variables (set in CI/CD pipeline)
const domain = process.env.PRODUCTION_DOMAIN;

// Production-specific Webpack configuration
const prodConfig = {
  // Enable production mode (minified output, optimizations enabled)
  mode: "production",

  output: {
    // Use contenthash in filenames for long-term caching in production
    filename: "[name].[contenthash].js",

    // Public path where the container’s assets will be served from
    // This is specific for the "container" microfrontend
    publicPath: "/container/latest/",
  },

  plugins: [
    // Configure Module Federation for the container app
    new ModuleFederationPlugin({
      // Name of this microfrontend
      name: "container",

      // Remote apps that the container can load dynamically
      remotes: {
        // Format: <exposedName>@<url_to_remoteEntry.js>
        marketing: `marketing@${domain}/marketing/latest/remoteEntry.js`,
        auth: `auth@${domain}/auth/latest/remoteEntry.js`,
        dashboard: `dashboard@${domain}/dashboard/latest/remoteEntry.js`,
      },

      // Share dependencies between microfrontends to avoid duplicates
      shared: {
        ...packageJson.dependencies, // Share all dependencies by default

        // Force React to be singleton (only one instance at runtime)
        react: {
          singleton: true,
          requiredVersion: packageJson.dependencies.react,
        },

        // Force ReactDOM to be singleton
        "react-dom": {
          singleton: true,
          requiredVersion: packageJson.dependencies["react-dom"],
        },

        // Force React Router DOM to be singleton
        "react-router-dom": {
          singleton: true,
          requiredVersion: packageJson.dependencies["react-router-dom"],
        },
      },
    }),
  ],
};

// Merge the common configuration with this production-specific configuration
module.exports = merge(commonConfig, prodConfig);
