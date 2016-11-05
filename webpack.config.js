
var path = require('path');
module.exports = {
  entry: "./src/app.js",
  output: {
      path: __dirname,
      filename: "dist/bundle.js"
  },
  module: {
    loaders: [
      {
        test: path.join(__dirname, 'src'),
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a valid name to reference
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}
