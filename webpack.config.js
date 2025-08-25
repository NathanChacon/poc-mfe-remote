const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.js'), // should only do: import('./bootstrap')
  output: {
    // single output block — don't duplicate below
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    chunkFilename: '[name].js',
    publicPath: 'auto',          // ← important for MF
    clean: true
  },
  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, use: 'babel-loader' },
      {
        test: /\.module\.css$/,
        use: ['style-loader', { loader: 'css-loader', options: { modules: { localIdentName: '[path][name]__[local]' } } }]
      },
      { test: /\.css$/, exclude: /\.module\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|jpe?g|gif|svg|webp|avif)$/i, type: 'asset' },
      { test: /\.(woff2?|eot|ttf|otf)$/i, type: 'asset/resource' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public/index.html'), inject: 'body' }),
    new ReactRefreshWebpackPlugin(),
    new ModuleFederationPlugin({
      name: 'light',                 // must match host's remotes key (left of @)
      filename: 'remoteEntry.js',
      exposes: {
        './ProductPage': './src/pages/Product/ProductPage.jsx',
        './ProductRoutes': './src/routes/product/index.jsx'
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        'react-router-dom': { singleton: true, requiredVersion: false },
        'react/jsx-runtime': { singleton: true },
        'react/jsx-dev-runtime': { singleton: true }
      }
    })
  ],
  devServer: {
    port: 4000,
    historyApiFallback: true,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  performance: { hints: false }
};