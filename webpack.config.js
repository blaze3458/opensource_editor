const path = require('path');
const webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode:'production',
	entry:{one:'./src/js/deneme/editor.js'},
	output: {
		filename: '[name]-bundle.js',
		path: __dirname+'/src/dist'
		
	},
	watch:true,
	devServer:{
		contentBase: path.join(__dirname, "/"),
		port:3000
	},
	module: {
		rules: [
		{
			test: /\.(js|jsx)$/,
			use: 'babel-loader'
		}
		]
	},
	plugins: [
		new webpack.ProgressPlugin(),
		new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
