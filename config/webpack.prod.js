const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',

	output: {
		path: __dirname + '/../build',
		filename: '[name].bundle.[contenthash:8].js'
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: __dirname + '/../public/index.html',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: "public/assets", to: "assets" },
			],
		})
	],
});