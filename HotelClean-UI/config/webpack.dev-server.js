const path = require('path');
const webpack = require('webpack');
const externals = require('./node-externals');
const WriteFilePlugin = require('write-file-webpack-plugin');
const HardSourceWebpackPlugin = require ("hard-source-webpack-plugin");
module.exports = {
	name: 'server',
	target: 'node',
	externals,
	entry: './src/server/render.js',
	mode: 'development',
	output: {
		filename: '[name].js',
		chunkFilename: '[name].js',
		path: path.resolve(__dirname, '../buildServer'),
		libraryTarget: 'commonjs2',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
					},
				],
			},
			{
				test: /\.css|scss$/i,
				use: [
					{
						loader: 'css-loader/locals',
						options: {
							modules: true,
							localIdentName: '[name]__[local]--[hash:base64:5]',
							minimize: true,
						},
					},
					'sass-loader',
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
						},
					},
				],
			},
            {
                test: /\.(woff(2)?|ttf|eot|svg|jpg|png|gif)$/,
                exclude: /node_modules|semantic/,
				use: {
					loader: "url-loader",
					options: {
						limit: 50000,
						name: "assets/fonts/webfonts/averta/[name].[ext]",
						esModule: false
					}
				}
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|jpg|png|gif)$/,
                include: /node_modules|semantic/,
				use: [{
					loader: 'file-loader',
					options: {
						name: './assets/fonts/webfonts/semantic/[name].[ext]',
						esModule: false
					},
				}],
            },
		],
	},
	plugins: [
        new HardSourceWebpackPlugin({
            info: {
                level: 'info',
            },
        }),
        new WriteFilePlugin(),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('development'),
			},
		}),
	],
};
