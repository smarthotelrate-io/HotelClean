const path = require('path');
const webpack = require('webpack');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const HardSourceWebpackPlugin = require ("hard-source-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const groupsOptions = {chunks: "all", minSize:0, minChunks: 1, reuseExistingChunk: true, enforce: true };
const CircularDependencyPlugin = require('circular-dependency-plugin')
module.exports = {
    optimization: {
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
                react: { test: /[\\/]node_modules[\\/]((react).*)[\\/]/, name: "react", ...groupsOptions },
                lodash: { test: /[\\/]node_modules[\\/]((lodash).*)[\\/]/, name: "lodash", ...groupsOptions },
                commons: { test: /[\\/]node_modules[\\/]((?!react)|(?!lodash).*)[\\/]/, name: "common" }
            }
        }
    },
	name: 'client',
	entry: {
		main: [
			'react-hot-loader/patch',
			'@babel/runtime/regenerator',
			'webpack-hot-middleware/client?reload=true',
			'./src/client.js',
		],
	},
	mode: 'development',
	output: {
		filename: '[name].js',
		chunkFilename: '[name].js',
		path: path.resolve(__dirname, '../buildClient'),
		publicPath: '/',
	},
	devtool: 'source-map',
    node: {
        net: 'empty',
        tls: 'empty',
        fs: 'empty'
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
                        loader:ExtractCssChunks.loader,
                        options: {
                            hot: true,
                            reloadAll: true,
                        }
                    },
                    "css-loader",
                    'sass-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
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
                        name: "assets/fonts/webfonts/[name].[ext]",
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
                    },
                ],
            },
		],
	},
	plugins: [
        new CircularDependencyPlugin({
            exclude: /a\.js|node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd(),
        }),
        new HardSourceWebpackPlugin({
            info: {
                level: 'info',
            },
        }),
        new CleanWebpackPlugin(['buildClient'], { root: process.cwd() }),
        new WriteFilePlugin(),
		new ExtractCssChunks({
			filename: '[name].css',
			chunkFilename: '[name]-[contenthash].css',
			hot: true,
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('development'),
				WEBPACK: true,
			},
		}),
		new webpack.HotModuleReplacementPlugin(),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale/, /en|fr|de/),
	],
};
