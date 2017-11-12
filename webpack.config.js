'user strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const NODE_ENV = process.env.NODE_ENV || 'dev';
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const common = {
	entry: './client/index.jsx',
	output: {
		filename: 'build.js',
		path: path.resolve(__dirname, 'public/build/'),
		publicPath: 'build'
	},
	devServer: {
		hot: true,
		port: 9000,
		proxy: {
			'*': 'http://localhost:3000'
		}
	},
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

if (NODE_ENV == 'dev') {
	module.exports = merge(common, {
		devtool: 'inline-source-map',
		watch: true,
		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false,
					drop_console: true
				}
			})
		]
	});
} else {
	module.exports = common;
}