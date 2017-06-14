const path = require('path')
const webpack = require('webpack')

module.exports = {

  entry: {
    main: './src/index.js',
  },

  output: {
      path: path.join(__dirname, './dist'),
      filename: '[name].bundle.js',
      publicPath: '/'
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
      extensions: ['.js', '.jsx']
  },


  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    })
  ]
}
