const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {

    mode: 'production',

    entry: './src/index.js',

    output: {
        path: path.join(__dirname, './dist'),
        filename: 'index.js',
        library: 'pjpg',
        libraryTarget: 'umd',
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

    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            ie8: false,
            compress: true,
            comments: false,
            ecma: 7,
            mangle: {
              keep_fnames: true,
              keep_classnames: true,
            }
          }
        })
      ]
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false
        }),
     ],
}
