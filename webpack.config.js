const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    },
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
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
  ],
}, baseConfig);

module.exports = [mainConfig, rendererConfig];
