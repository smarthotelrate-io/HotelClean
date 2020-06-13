const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const HardSourceWebpackPlugin = require ("hard-source-webpack-plugin");

const groupsOptions = {chunks: "all", minSize:0, minChunks: 1, reuseExistingChunk: true, enforce: true};
module.exports = {
    optimization: {
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
            }),
        ],
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
		main: './src/client.js',
	},
    node: {
        net: 'empty',
        tls: 'empty',
        fs: 'empty'
    },
	mode: 'production',
	output: {
        chunkFilename: '[name].[contenthash].js',
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
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
                    },
                    "css-loader",
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
                },
                ],
            },
		],
	},
	plugins: [
        new HardSourceWebpackPlugin({
            info: {
                level: 'info',
            },
        }),
        new CleanWebpackPlugin(['dist'], { root: process.cwd() }),
        new StatsPlugin('stats.json'),
		new ExtractCssChunks({
			filename: '[name].css',
			chunkFilename: '[name]-[contenthash].css',
		}),
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require('cssnano'),
			cssProcessorOptions: { discardComments: { removeAll: true } },
			canPrint: true,
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
				WEBPACK: true,
			},
		}),
        new webpack.HashedModuleIdsPlugin(),
        new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        }),
		new BrotliPlugin({
            filename: '[path].br[query]',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale/, /en|fr|de/),
	],
};
