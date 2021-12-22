const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
	mode: 'development',

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.[contenthash:8].js'
	},

	devServer: {
		port: 3000,
		hot: true,
		client: {
			logging: 'error',
		},
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: __dirname + '/../public/index.html',
		}),
	],
});