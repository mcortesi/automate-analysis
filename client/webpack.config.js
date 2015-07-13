var webpack = require('webpack');
var path = require('path');

module.exports = {

  context: __dirname,

  entry: {
    app: ["./app/main.js"]
  },

  output: {
    path: "./build",
    publicPath: "/assets/",
    filename: "bundle.js"
  },

  resolve: {
    extensions: ["", ".js"],
  },

  module: {
    loaders: [
      {
      test: /\.jsx?$/,  exclude: /(node_modules|bower_components)/, loader: 'babel' },
      { test: /\.less$/, loader: "style!css!less" },
      { test: /\.(png|jpg|svg|gif|eot|woff|ttf)$/,
        loader: 'file-loader?name=[path][name]-[hash].[ext]'
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "root.jQuery": "jquery"
    })
  ],

  ///////////////////////////////////////////////////////////////
  // NOTE: COMMENT THIS for production!!
  ///////////////////////////////////////////////////////////////
  debug: true,
  devtool: 'eval'
  ///////////////////////////////////////////////////////////////
};

// check http://stackoverflow.com/questions/28969861/managing-jquery-plugin-dependency-in-webpack
// for tips on legacy scripts
