"use strict";

const debug = require("debug")("hadcsi");

const MyError = require("../../../libs/helpers/myError");
const showNotify = require("../../../libs/showNotify");
const getSessionId = require("../../../libs/helpers/getSessionId");
const createUniqID = require("../../../libs/helpers/createUniqID");
const globalObject = require("../../../configure/globalObject");
const writeLogFile = require("../../../libs/writeLogFile");
const checkUserAuthentication = require("../../../libs/check/checkUserAuthentication");

/**
 * Модуль обработчик действий над документами содержащими структурированную информацию
 *
 * @param {*} socketIo 
 */
module.exports.addHandlers = function(socketIo) {
    const handlers = {
        "isems-mrsi ui request: get count doc type 'reports' status 'open'": getCountOpenReports,
        "isems-mrsi ui request: get count doc type 'reports' status 'published'": getCountPublishedReports,
    };
    //network interaction:
    for (let e in handlers) {
        socketIo.on(e, handlers[e].bind(null, socketIo));
    }
};

/**
 * Обработчик запроса на получение общего количества открытых документов типа 'reports'
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
function getCountOpenReports(socketIo, data){
    debug("func 'getCountOpenReports', START...");
    debug(data);

    let funcName = " (func 'getCountOpenReports')";

    checkUserAuthentication(socketIo)
        .then((authData) => {
            //авторизован ли пользователь
            if (!authData.isAuthentication) {
                throw new MyError("management auth", "Пользователь не авторизован.");
            }

            return authData.document.userName;
        }).then((un) => {
            return new Promise((resolve, reject) => {
                getSessionId("socketIo", socketIo, (err, sid) => {
                    if (err) reject(err);
                    else resolve({ userName: un, sessionId: sid });
                });
            });
        }).then((result) => {
            return new Promise((resolve, reject) => {
                process.nextTick(() => {
                    if (!globalObject.hasData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connectionEstablished")) {
                        return reject(new MyError("management MRSICT", "Невозможно обработать запрос, модуль учета информации о компьютерных угрозах не подключен."));
                    }

                    let conn = globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connection");
                    if (conn !== null) {
                        let taskID = createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`);

                        globalObject.setData("tasks", taskID, {
                            eventName: "doc type 'reports' status 'open'",
                            eventForWidgets: true,
                            userSessionID: result.sessionId,
                            generationTime: +new Date(),
                            socketId: socketIo.id,
                        });


                        conn.sendMessage({
                            task_id: taskID,
                            section: "handling search requests",
                            user_name_generated_task: result.userName,
                            request_details: {
                                collection_name: "stix object",
                                paginate_parameters: {
                                    max_part_size: 0,
                                    current_part_number: 0,
                                },
                                sortable_field: "data_created",
                                search_parameters: {
                                    documents_id: [],
                                    documents_type: ["report"],
                                    created: {},
                                    modified: {},
                                    created_by_ref: "",
                                    specific_search_fields: [{
                                        published: "0001-01-01T00:00:00.000+00:00",
                                    }],
                                },
                            },
                        });
                    }

                    resolve();
                });
            });
        }).catch((err) => {
            debug(err);

            if ((err.name === "management auth") || (err.name === "management MRSICT")) {
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
}

/**
 * Обработчик запроса на получение общего количества опубликованных документов типа 'reports'
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
function getCountPublishedReports(socketIo, data){
    debug("func 'getCountPublishedReports', START...");
    debug(data);

    let funcName = " (func 'getCountPublishedReports')";

    checkUserAuthentication(socketIo)
        .then((authData) => {
            //авторизован ли пользователь
            if (!authData.isAuthentication) {
                throw new MyError("management auth", "Пользователь не авторизован.");
            }

            return authData.document.userName;
        }).then((un) => {
            return new Promise((resolve, reject) => {
                getSessionId("socketIo", socketIo, (err, sid) => {
                    if (err) reject(err);
                    else resolve({ userName: un, sessionId: sid });
                });
            });
        }).then((result) => {
            return new Promise((resolve, reject) => {
                process.nextTick(() => {
                    if (!globalObject.hasData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connectionEstablished")) {
                        return reject(new MyError("management MRSICT", "Невозможно обработать запрос, модуль учета информации о компьютерных угрозах не подключен."));
                    }

                    let conn = globalObject.getData("descriptionAPI", "managingRecordsStructuredInformationAboutComputerThreats", "connection");
                    if (conn !== null) {
                        let taskID = createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`);

                        globalObject.setData("tasks", taskID, {
                            eventName: "get count doc type 'reports' status 'published'",
                            eventForWidgets: true,
                            userSessionID: result.sessionId,
                            generationTime: +new Date(),
                            socketId: socketIo.id,
                        });


                        conn.sendMessage({
                            task_id: taskID,
                            section: "handling search requests",
                            user_name_generated_task: result.userName,
                            request_details: {
                                collection_name: "stix object",
                                paginate_parameters: {
                                    max_part_size: 0,
                                    current_part_number: 0,
                                },
                                sortable_field: "data_created",
                                search_parameters: {
                                    documents_id: [],
                                    documents_type: ["report"],
                                    created: {},
                                    modified: {},
                                    created_by_ref: "",
                                    specific_search_fields: [{
                                        published: "2000-01-01T00:00:00.000+00:00",
                                    }],
                                },
                            },
                        });
                    }

                    resolve();
                });
            });
        }).catch((err) => {
            debug(err);

            if ((err.name === "management auth") || (err.name === "management MRSICT")) {
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
}
