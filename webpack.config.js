const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/pages/index.js',
    contacto: './src/pages/contacto.js',
    servicios: './src/pages/servicios.js',
    // Añadir más puntos de entrada según sea necesario
    // clientes: './src/pages/clientes.js',
    // proyectos: './src/pages/proyectos.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].bundle.js',
    publicPath: '/'
  },
  // Configuración para depuración
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../', // Esto ayuda a resolver las rutas relativas en CSS
            },
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: 'public/images', 
          to: 'images' 
        },
        { 
          from: 'public/css',
          to: 'css'
        },
        { 
          from: 'src/assets', 
          to: 'images/tech' 
        }
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/index.html',
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/servicios.html',
      filename: 'servicios.html',
      chunks: ['servicios']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/clientes.html',
      filename: 'clientes.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/proyectos.html',
      filename: 'proyectos.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/contacto.html',
      filename: 'contacto.html',
      chunks: ['contacto']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/test.html',
      filename: 'test.html',
      chunks: ['index']
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    historyApiFallback: true
  }
};
