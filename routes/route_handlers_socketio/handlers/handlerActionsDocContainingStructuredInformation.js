"use strict";

const MyError = require("../../../libs/helpers/myError");
const showNotify = require("../../../libs/showNotify");
const helpersFunc = require("../../../libs/helpers/helpersFunc");
const writeLogFile = require("../../../libs/writeLogFile");
const checkUserAuthentication = require("../../../libs/check/checkUserAuthentication");
const sendCommandsModuleNetworkInteraction = require("../../../libs/processing/route_socketio/sendCommandsModuleNetworkInteraction");

/**
 * Модуль обработчик действий над документами содержащими структурированную информацию
 *
 * @param {*} socketIo 
 */
module.exports.addHandlers = function(socketIo) {
    const handlers = {
        "managing records structured information: get all count doc type 'reports'": getAllCountDocTypeReport,
    };
    //network interaction:
    for (let e in handlers) {
        socketIo.on(e, handlers[e].bind(null, socketIo));
    }
};

/**
 * Обработчик запроса на получение общего количества всех документов типа 'reports'
 * 
 * @param {*} socketIo 
 * @param {*} data 
 */
function getAllCountDocTypeReport(socketIo, data){
/**
debug("func 'startDownloadingFiles', START...");
    debug(data);

    let funcName = " (func 'getListFilesTask')";

    checkUserAuthentication(socketIo)
        .then((authData) => {
            //авторизован ли пользователь
            if (!authData.isAuthentication) {
                throw new MyError("management auth", "Пользователь не авторизован.");
            }

            //может ли пользователь создавать задачи на скачивание файлов
            if (!authData.document.groupSettings.management_network_interaction.element_settings.management_tasks_import.element_settings.resume.status) {
                throw new MyError("management auth", "Невозможно отправить запрос на скачивание файлов. Недостаточно прав на выполнение данного действия.");
            }

            return authData.document.userName;
        }).then((userName) => {
            return new Promise((resolve, reject) => {
                process.nextTick(() => {
                    if (!globalObject.hasData("descriptionAPI", "networkInteraction", "connectionEstablished")) {
                        return reject(new MyError("management network interaction", "Передача списка источников модулю сетевого взаимодействия невозможна, модуль не подключен."));
                    }

                    let conn = globalObject.getData("descriptionAPI", "networkInteraction", "connection");

                    if (conn !== null) {

                        debug("send request file list--->");

                        data.arguments.un = userName;

                        conn.sendMessage({
                            msgType: "command",
                            msgSection: "download control",
                            msgInstruction: "to start downloading",
                            taskID: require("../../../libs/helpers/helpersFunc").getRandomHex(),
                            options: data.arguments.o,
                        });
                    }

                    resolve();
                });
            });
        }).catch((err) => {
            debug(err);

            if (err.name === "management auth") {
                showNotify({
                    socketIo: socketIo,
                    type: "danger",
                    message: err.message.toString()
                });
            } else {
                showNotify({
                    socketIo: socketIo,
                    type: "danger",
                    message: "Внутренняя ошибка приложения. Пожалуйста обратитесь к администратору.",
                });
            }

            writeLogFile("error", err.toString() + funcName);
        });
 */
}