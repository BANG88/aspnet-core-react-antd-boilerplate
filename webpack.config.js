const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin
const merge = require('webpack-merge')
process.noDeprecation = true
module.exports = (env) => {
  const isDevBuild = !(env && env.prod)

  // Configuration in common to both client-side and server-side bundles
  const sharedConfig = () => ({
    stats: { modules: false },
    resolve: { extensions: [ '.js', '.jsx', '.ts', '.tsx' ] },
    output: {
      filename: '[name].js',
      publicPath: '/dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: /src/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: ['transform-runtime']
            }
          }
        },
        { test: /\.tsx?$/, include: /src/, use: 'awesome-typescript-loader?silent=true' }
      ]
    },
    plugins: [new CheckerPlugin()]
  })

  // Configuration for client-side bundle suitable for running in browsers
  const clientBundleOutputDir = './build/dist'
  const clientBundleConfig = merge(sharedConfig(), {
    entry: { 'main-client': './src/boot-client.tsx' },
    module: {
      rules: [
        { test: /\.css$/, use: ExtractTextPlugin.extract({ use: 'css-loader' }) },
        { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
      ]
    },
    output: { path: path.join(__dirname, clientBundleOutputDir) },
    plugins: [
      new ExtractTextPlugin('site.css'),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./build/dist/vendor-manifest.json')
      })
    ].concat(isDevBuild ? [
      // Plugins that apply in development builds only
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map', // Remove this line if you prefer inline source maps
        moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
      })
    ] : [
      // Plugins that apply in production builds only
      new webpack.optimize.UglifyJsPlugin()
    ])
  })

  // Configuration for server-side (prerendering) bundle suitable for running in Node
  const serverBundleConfig = merge(sharedConfig(), {
    resolve: { mainFields: ['main'] },
    entry: { 'main-server': './src/boot-server.tsx' },
    plugins: [
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./build/dist/server/vendor-manifest.json'),
        sourceType: 'commonjs2',
        name: './vendor'
      })
    ],
    output: {
      libraryTarget: 'commonjs',
      path: path.join(__dirname, './build/dist/server')
    },
    target: 'node',
    devtool: 'inline-source-map'
  })

  return [clientBundleConfig, serverBundleConfig]
}
