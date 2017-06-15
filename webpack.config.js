const path = require('path')
const webpack = require('webpack')

module.exports = {

  entry: './src/index.js',
  devtool: 'source-map',
  output: {
      path: path.join(__dirname, './dist'),
      filename: 'index.js',
      library: 'parsejpeg',
      libraryTarget: 'var',
      umdNamedDefine: true
  },

  module: {
    // use `test` to split a single file
    // or `include` to split a whole folder
    rules: [
      { test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [
            ['env', {
              modules: false,
              targets: {
                'browsers': ['last 2 versions']
              }
            }],
            'stage-0',
          ],
          plugins: [
            'transform-runtime',
          ]
        },
        exclude: /node_modules/
      },
    ]
  },

  resolve: {
      extensions: ['.js']
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        keep_fnames: true
      },
      comments: false,
      sourceMap: true,
    }),
  ]

}
