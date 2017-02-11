/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const decompress = require('decompress')
const webpack = require('webpack')

function ExtractTarballPlugin (archive, to) {
  return {
    apply: (compiler) => {
      compiler.plugin('emit', (compilation, callback) => {
        decompress(path.resolve(archive), path.resolve(to))
          .then(() => callback())
          .catch(error => console.error('Unable to extract archive ', archive, to, error.stack))
      })
    },
  }
}

module.exports = {
  entry: './src/handler',
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: __dirname,
        exclude: /node_modules/,
      },
      { test: /\.json$/, loader: 'json-loader' },
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: '.webpack',
    filename: 'handler.js', // this should match the first part of function handler in serverless.yml
  },
  externals: ['sharp', 'aws-sdk'],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true, sourceMap: false, warnings: false }),
    new ExtractTarballPlugin(
      path.join(__dirname, 'lib/sharp-0.17.1-linux-x64.tar.gz'),
      // path.join(__dirname, 'lib/poop.tar.gz'),
      path.join(__dirname, '.webpack/')
    ),
  ],
}
