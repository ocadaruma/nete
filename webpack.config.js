const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const baseConfig = {
  node: { __dirname: false, __filename: false },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '@main': path.join(__dirname, 'src/main'),
      '@models': path.join(__dirname, 'src/models'),
      '@public': path.join(__dirname, 'public'),
      '@renderer': path.join(__dirname, 'src/renderer'),
      '@utils': path.join(__dirname, 'src/utils'),
      'vue$': 'vue/dist/vue.esm.js',
    },
    extensions: ['.js', '.json', '.ts', '.tsx', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|svg|ico|icns)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
};

if (process.env.NODE_ENV === 'development') {
  baseConfig.devtool = 'source-map'
}

const mainConfig = Object.assign({
  entry: './src/main/main.ts',
  target: 'electron-main',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.bundle.js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './public/images', to: 'images', },
    ]),
  ],
}, baseConfig);

const rendererConfig = Object.assign({
  entry: './src/renderer/renderer.ts',
  target: 'electron-renderer',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'renderer.bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
    new VueLoaderPlugin(),
  ],
}, baseConfig);

module.exports = [mainConfig, rendererConfig];
