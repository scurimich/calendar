'user strict';

const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV || 'dev';
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	context: __dirname,
	entry: './client/index',
	output: {
		filename: 'build.js',
		publicPath: 'build/',
		path: './public/build/'
	},
	devtool: NODE_ENV == 'dev' ? 'inline-source-map' : null,
	watch: NODE_ENV == 'dev',
	watchOptions: {
		aggregateTimeout: 100
	},
	resolve: {
		moduleDirectories: ['node_modules'],
		extensions: ['', '.js', '.jsx']
	},
	resolveLoader: {
		moduleDirectories: ['node_modules'],
		moduleTemplates: ['*-loader', '*'],
		extensions: ['', '.js']
	},
	// watch: true,
	// watchOptions: {
	// 	aggregateTimeout: 100
	// },
	devServer: {
		host: 'localhost',
		port: 3000,
		proxy: {
			'*': 'http://localhost:3000'
		}
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('style.css', {
        allChunks: true
    })
	],
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel',
				exclude: [/node_modules/, /public/]
			},
			// {
			// 	test:/\.json$/,
			// 	loader: 'json',
			// 	exclude: [/node_modules/, /public/]
			// },
			{
				test: /\.scss/,
				loader: ExtractTextPlugin.extract('css!sass'),
				exclude: [/node_modules/, /public/]
			}
		]
	}
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