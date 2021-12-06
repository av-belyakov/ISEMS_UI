"use strict";

const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV || "development";

let bootstrapPath = path.join(__dirname, "node_modules/bootstrap/dist/css");

module.exports = {
    //место откуда берутся js файлы
    context: __dirname + "/public/js",

    //точки входа
    entry: {
        vendors: [
            "utf8",
            "uuid",
            "react",
            "reactDom",
            "lodash",
            "reactBootstrap",
            "material-ui-lab",
            "material-ui-core",
            "material-ui-pickers",
            "dateIoFnsUtils",
            "bootstrap",
            "bootstrapNotify",
            "bootstrapToggle",
            "datatablesNetBs",
            "select2",
            "md5js",
            "moment",
            "jquery",
            "socket.io-client",
            "socket.io-stream",
            "react-circle",
            "quoted-printable",
            "react-scrollbar",
            "react-beautiful-dnd",
            "react-router-dom",
            "react-customize-token-input",
            "react-infinite-scroll-component",
        ],
        authPage: "./authPage.js",
        mainPage: "./mainPage.js",
        headerMenu: "./headerMenu.jsx",
        settingUsersPage: "./settings/user/settingUsersPage.jsx",
        settingGroupsPage: "./settings/group/settingGroupsPage.jsx",
        settingOrganizationAndSourcesPage: "./settings/organizations_and_sources/organizationAndSources.jsx",
        settingRulesSAOPage: "./settings/rules_soa/rulesSOA.jsx",
        createVerticalMenuItems: "./module_network_interaction/createVerticalMenuItems.jsx",
        networkInteractionMainHeader: "./module_network_interaction/networkInteractionMainHeader.jsx",
        networkInteractionPageTelemetry: "./module_network_interaction/networkInteractionPageTelemetry.jsx",
        networkInteractionPageTemplateLog: "./module_network_interaction/networkInteractionPageTemplateLog.jsx",
        networkInteractionMainPageDinamic: "./module_network_interaction/networkInteractionMainPageDinamic.jsx",
        networkInteractionPageDownloadFile: "./module_network_interaction/networkInteractionPageDownloadFile.jsx",
        networkInteractionPageSearchTasks: "./module_network_interaction/networkInteractionPageSearchTasks.jsx",
        networkInteractionPageNotificationLog: "./module_network_interaction/networkInteractionPageNotificationLog.jsx",
        networkInteractionPageStatisticsAndAnalytics: "./module_network_interaction/networkInteractionPageStatisticsAndAnalytics.jsx",
        networkInteractionPageStatisticsAndAnalyticsDetalTask: "./module_network_interaction/networkInteractionPageStatisticsAndAnalyticsDetalTask.jsx",
        managingRecordsStractInfoMainPage: "./module_managing_records_structured_information/managingRecordsStractInfoMainPage.jsx",
        managingRecordsStractInfoPageInformationReportSTIX: "./module_managing_records_structured_information/managingRecordsStractInfoPageInformationReportSTIX.jsx",
        managingAnalusisMainHeader: "./module_analysis/pageManagingAnalysis.jsx",
        drawingAlertsMessage: "./drawingAlertsMessage.jsx",
        common: "./common.js",
        styles: "./styles.js"
    },

    output: {
        //вывод обработанных webpack js файлов в указанную директорию
        path: path.resolve(__dirname, "public/dist"),

        //интернет путь до указанной директории
        publicPath: "/dist/",

        //шаблоны файлов, применяется при сборке основных файлов
        filename: "[name].js",

        //применяется при сборке файлов через require.ensure
        chunkFilename: "[name].bundle.js",
        //chunkFilename: "[id].js",

        //экспорт каждой точки входа должен попадать в переменную с соответствующем именем
        library: "[name]"
    },

    watch: NODE_ENV === "development",

    devtool: NODE_ENV === "development" ? "source-map" : null,

    devServer: {
        contentBase: path.join(__dirname, "public/dist"),
    },

    watchOptions: {
        poll: true,
        ignored: /node_modules/
    },

    resolve: {
        modules: ["node_modules", bootstrapPath],
        extensions: [".js", "jsx", ".css"],
        alias: {
            "utf8": "utf8/utf8.js",
            "uuid": "uuid",
            "react": "react",
            "reactDom": "react-dom",
            "lodash": "lodash",
            "reactBootstrap": "react-bootstrap/dist/react-bootstrap.min.js",
            "bootstrap": "bootstrap/dist/js/bootstrap.min.js",
            "bootstrapNotify": "bootstrap-notify/bootstrap-notify.min.js",
            "bootstrapToggle": "bootstrap-toggle/js/bootstrap-toggle.min.js",
            "datatablesNetBs": "datatables.net-bs/js/dataTables.bootstrap.min.js",
            "material-ui-lab": "@material-ui/lab",
            "material-ui-core": "@material-ui/core",
            "material-ui-pickers": "@material-ui/pickers",
            "dateIoFnsUtils": "@date-io/date-fns/build",
            "md5js": "crypto-js/md5.js",
            "moment": "moment/moment.js",
            "select2": "select2/dist/js/select2.full.min.js",
            "jquery": "jquery/dist/jquery.min.js",
            "socket.io-client": "socket.io-client/dist/socket.io.js",
            "socket.io-stream": "socket.io-stream/socket.io-stream.js",
            "react-circle": "react-circle/dist/index.js",
            "quoted-printable": "quoted-printable/quoted-printable.js",
            "react-scrollbar": "react-scrollbar",
            "react-beautiful-dnd":"react-beautiful-dnd",
            "react-router-dom": "react-router-dom",
            "react-customize-token-input": "react-customize-token-input/lib/index.js",
            "react-infinite-scroll-component": "react-infinite-scroll-component/dist/index.js",
        }
    },

    resolveLoader: {
        modules: ["node_modules"],
        extensions: [".js"],
        //moduleExtensions: ["*-loader"]
    },

    plugins: [
        //не собирать если есть ошибки
        new webpack.NoEmitOnErrorsPlugin(),

        //переменные окружения
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),

        //выносит все стили в отдельные файлы
        //new ExtractTextPlugin("css/[id]_[name].css", { allChunks: true }),

        new webpack.ContextReplacementPlugin(/moment[\\/\\]locale$/, /ru|en-gb/),

        //new webpack.optimize.OccurrenceOrderPlugin(true),
    ],

    module: {
        rules: [{
            test: /\.(js|jsx)$/, // определяем тип файлов
            exclude: /node_modules/, // исключаем из обработки папку node_modules
            loader: "babel-loader", // определяем загрузчик
            options: {
                presets: ["@babel/preset-env", "@babel/preset-react"] // используемые плагины
            }
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader"]
            })
        }, {
            test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?.*)?$/,
            include: /\/node_modules\//,
            use: [{
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]",
                    publicPath: "dist/",
                },
            }],
        }, {
            test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?.*)?$/,
            exclude: /\/node_modules\//,
            use: [{
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]",
                    publicPath: "dist/",
                },
            }],
        }, {
            test: /\.ejs$/,
            loader: "ejs-loader"
        }]
    }
};