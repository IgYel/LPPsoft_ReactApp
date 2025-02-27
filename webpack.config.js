const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.scss$/, // Поддержка SCSS
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/, // Добавляем поддержку CSS
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    static: path.resolve(__dirname, "public"), // Путь к статике
    hot: true,
    port: 8080,
    open: true, // Автоматически открывать в браузере
  },
  plugins: [
    new CleanWebpackPlugin(), // Очищает папку dist перед сборкой
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Указывает шаблон для HTML
      filename: "index.html",
    }),
  ],
};
