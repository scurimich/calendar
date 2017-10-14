'user strict';

const webpack = require('webpack');
const path = require('path');
const NODE_ENV = process.env.NODE_ENV || 'dev';
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
	entry: './client/index.jsx',
	output: {
		filename: 'build.js',
		path: path.resolve(__dirname, 'public/build/'),
		publicPath: 'build'
	},
	devtool: NODE_ENV == 'dev' ? 'inline-source-map' : null,
	devServer: {
		hot: true,
		port: 9000,
		proxy: {
			'*': 'http://localhost:3000'
		}
	},
	watch: NODE_ENV == 'dev',
	watchOptions: {
		aggregateTimeout: 100
	},
	resolve: {
		modules: ['node_modules'],
		extensions: ['.js', '.jsx', '.json']
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new ExtractTextPlugin({
			filename: 'style.css',
			allChunks: true
		})
	],
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: 'babel-loader',
				exclude: [/node_modules/, /public/]
			},
			{
				test: /\.scss/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader']
				}),
				exclude: [/node_modules/, /public/]
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader']
				}),
				exclude: [/public/]
			}
		]
	},
}

if (NODE_ENV == 'prod') {
	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: true
			}
		})
	);
}