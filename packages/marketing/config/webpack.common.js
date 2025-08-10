module.exports = {
  module: {
    rules: [
      {
        // whenever we import in a file that ends with and extension of either 'mjs' or 'js', we want it to be processed by babel
        test: /\.m?js$/,
        // don't try to run this babel thing on any file out of our node_modules directory
        exclude: /node_modules/,
        use: {
          // tell webpack to process some different files as we start to import them into our project
          loader: "babel-loader",
          options: {
            // preset-react: babel is gonna process all the different jsx tags, so we add into our application (so that's a little bit of react related code)
            // preset-env: transform our code in a variety of different ways, so take all the kind of ES2015, 16, 17, and so on and convert it down to ES5
            presets: ["@babel/preset-react", "@babel/preset-env"],
            // plugin-transform-runtime: add in a little bit of additional code, just to enable some different features for our project inside the browser (such as async await syntax)
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ],
  },
};
