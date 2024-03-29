"use strict";

const debug = require("debug")("hadcsihg");
const uuid = require("uuid");

const models = require("../../../controllers/models");
const MyError = require("../../../libs/helpers/myError");
const showNotify = require("../../../libs/showNotify");
const helpersFunc = require("../../../libs/helpers/helpersFunc");
const getSessionId = require("../../../libs/helpers/getSessionId");
const createUniqID = require("../../../libs/helpers/createUniqID");
const globalObject = require("../../../configure/globalObject");
const writeLogFile = require("../../../libs/writeLogFile");
const mongodbQueryProcessor = require("../../../middleware/mongodbQueryProcessor");
const checkUserAuthentication = require("../../../libs/check/checkUserAuthentication");

/**
 * Обработчик запроса на получение общего количества открытых документов типа 'reports'
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
module.exports.getCountOpenReports = function(socketIo, data){
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
                        let taskID = createUniqID.getMD5(`sid_${uuid.v4()}_${(+new Date).toString(16)}_open_reports`);

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
};

/**
 * Обработчик запроса на получение общего количества опубликованных документов типа 'reports'
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
module.exports.getCountPublishedReports = function(socketIo, data){
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
                        let taskID = createUniqID.getMD5(`sid_${uuid.v4()}_${(+new Date).toString(16)}_published_reports`);

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
};

/**
 * Обработчик запроса на получение общего количества документов типа Report со статусом "types decisions made computer threat"
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
module.exports.getCountStatusesDecisionsMadeComputerThreats = function(socketIo, data){
    let funcName = " (func 'getCountStatusesDecisionsMadeComputerThreats')";

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
                        let taskID = createUniqID.getMD5(`sid_${uuid.v4()}_${(+new Date).toString(16)}_decisions_made_computer_threats`);

                        globalObject.setData("tasks", taskID, {
                            eventName: "get count doc statuses decisions made computer threats",
                            eventForWidgets: true,
                            userSessionID: result.sessionId,
                            generationTime: +new Date(),
                            socketId: socketIo.id,
                        });

                        conn.sendMessage({
                            task_id: taskID,
                            section: "handling statistical requests",
                            user_name_generated_task: result.userName,
                            request_details: {
                                collection_name: "stix object",
                                paginate_parameters: {
                                    max_part_size: 0,
                                    current_part_number: 0,
                                },
                                sortable_field: "",
                                type_statistical_information: "types decisions made computer threat",
                            },
                        });
                    }

                    resolve();
                });
            });
        }).catch((err) => {
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
};

/**
 * Обработчик запроса для получения списка групп которым доступен Отчёт с определенным ID
 * 
 * @param {*} socketIo 
 * @param {*} data 
 */
module.exports.getListGroupsWhichReportAvailable = function(socketIo, data){
    let funcName = " (func 'getListGroupsWhichReportAvailable')",
        section = "list of groups to which the report is available",
        reportId = data.arguments;

    checkUserAuthentication(socketIo)
        .then((authData) => {
            //авторизован ли пользователь
            if (!authData.isAuthentication) {
                throw new MyError("management auth", "Пользователь не авторизован.");
            }

            return { 
                userLogin: authData.document.userLogin, 
                userName: authData.document.userName,
                userGroup: authData.document.userGroup,
                isPrivilegedGroup: authData.document.groupSettings.management_security_event_management.element_settings.privileged_group.status,
            };
        }).then((result) => {
            return new Promise((resolve, reject) => {
                getSessionId("socketIo", socketIo, (err, sid) => {
                    if(err){
                        return reject(err);
                    }

                    result.sessionId = sid;

                    resolve(result);
                });
            });
        }).then((result) => {
            if(!result.isPrivilegedGroup){
                return;
            }
            
            return new Promise((resolve, reject) => {
                mongodbQueryProcessor.querySelect(models.modeStorageObjectsAvailableViewingUnprivilegedUsers, {
                    query: { object_id: reportId },
                    select: { _id: 0, __v: 0 },
                    isMany: true,
                }, (err, queryResult) => {
                    if(err) {
                        reject(err);
                    }

                    if(queryResult === null){
                        return;
                    }

                    helpersFunc.sendMessageByUserSocketIo(socketIo.id, "isems-mrsi response ui: list of groups to which the report is available", { 
                        section: section,
                        eventForWidgets: false,
                        information: {
                            task_id: createUniqID.getMD5(`sid_${uuid.v4()}_${(+new Date).toString(16)}_groups_which_report_available`),
                            section: section,
                            additional_parameters: { list_groups_which_report_available: queryResult},
                        },
                    });

                    resolve();
                });
            });
        }).catch((err) => {
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
};

/**
 * Обработчик запроса для получения списка типов компьютерых угроз
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
module.exports.getListTypesComputerThreat = function(socketIo, data){
    let funcName = " (func 'getListTypesComputerThreat')";

    debug(`${funcName}, START...`);
    debug(data);    

    checkUserAuthentication(socketIo)
        .then((authData) => {
            //авторизован ли пользователь
            if (!authData.isAuthentication) {
                throw new MyError("management auth", "Пользователь не авторизован.");
            }

            return authData.document.userName;
        }).then((userName) => {
            return new Promise((resolve, reject) => {
                getSessionId("socketIo", socketIo, (err, sessionId) => {
                    if(err){
                        return reject(err);
                    }

                    resolve({ userName: userName, sessionId: sessionId });
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
                        let taskID = createUniqID.getMD5(`sid_${uuid.v4()}_${(+new Date).toString(16)}_types_computer_threat`);

                        globalObject.setData("tasks", taskID, {
                            eventName: "list types computer threat",
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
                                collection_name: "get list computer threat",
                                paginate_parameters: {
                                    max_part_size: 0,
                                    current_part_number: 0,
                                },
                                sortable_field: "",
                                search_parameters: { type_list: "types computer threat" },
                            }, 
                        });
                    }

                    resolve();
                });
            });
        }).catch((err) => {
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
};

/**
 * Обработчик запроса для получения списка типов принимаемых решений по компьютерным угрозам
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
module.exports.getListTypesDecisionsMadeComputerThreat = function(socketIo, data){
    let funcName = " (func 'getListTypesDecisionsMadeComputerThreat')";

    debug(`${funcName}, START...`);
    debug(data);    

    checkUserAuthentication(socketIo)
        .then((authData) => {
            //авторизован ли пользователь
            if (!authData.isAuthentication) {
                throw new MyError("management auth", "Пользователь не авторизован.");
            }

            return authData.document.userName;
        }).then((userName) => {
            return new Promise((resolve, reject) => {
                getSessionId("socketIo", socketIo, (err, sessionId) => {
                    if(err){
                        return reject(err);
                    }

                    resolve({ userName: userName, sessionId: sessionId });
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
                        let taskID = createUniqID.getMD5(`sid_${uuid.v4()}_${(+new Date).toString(16)}_types_decisions_made_computer_threat`);

                        globalObject.setData("tasks", taskID, {
                            eventName: "list types decisions made computer threat",
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
                                collection_name: "get list computer threat",
                                paginate_parameters: {
                                    max_part_size: 0,
                                    current_part_number: 0,
                                },
                                sortable_field: "",
                                search_parameters: { type_list: "types decisions made computer threat" },
                            }, 
                        });
                    }

                    resolve();
                });
            });
        }).catch((err) => {
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
};

/**
 * Обработчик запроса для получения краткой информации о группах, которым доступен просмотр Отчётов с определенным набором ID
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
module.exports.getShortInfoGroupsWhichReportAvailable = function(socketIo, data){
    let funcName = " (func 'getShortInfoGroupsWhichReportAvailable')",
        section = "short information about groups which report available";

    //debug(`${funcName}, START...`);
    //debug(data);    

    checkUserAuthentication(socketIo)
        .then((authData) => {
            //авторизован ли пользователь
            if (!authData.isAuthentication) {
                throw new MyError("management auth", "Пользователь не авторизован.");
            }

            return;
        }).then(() => {
            return new Promise((resolve, reject) => {
                getSessionId("socketIo", socketIo, (err, sessionId) => {
                    if(err) reject(err);
                    resolve(sessionId);
                });
            });
        }).then((sessionId) => {
            return new Promise((resolve, reject) => {
                mongodbQueryProcessor.querySelect(models.modeStorageObjectsAvailableViewingUnprivilegedUsers, {
                    query: { object_id: { "$in": data.arguments } },
                    select: { _id: 0, __v: 0 },
                    isMany: true,
                }, (err, queryResult) => {
                    if(err) {
                        reject(err);
                    }

                    //debug(`${funcName}, RECEIVED RESULT`);
                    //debug(queryResult);

                    if(queryResult === null){
                        return;
                    }

                    helpersFunc.sendMessageByUserSocketIo(socketIo.id, "isems-mrsi response ui: short information about groups which report available", { 
                        section: section,
                        eventForWidgets: false,
                        information: {
                            task_id: createUniqID.getMD5(`sid_${sessionId}_${(+new Date).toString(16)}_short_info_groups_which_report_available`),
                            section: section,
                            additional_parameters: queryResult,
                        },
                    });

                    resolve();
                });
            });
        }).catch((err) => {
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
};

/**
 * "isems-mrsi ui request: types decisions made computer threat": handlerGetter.getListTypesDecisionsMadeComputerThreat,
        "isems-mrsi ui request: types computer threat": handlerGetter.getListTypesComputerThreat,
        7.1.  Структура и формат JSON документа, получаемого от графического пользовательского интерфейса ISEMS-UI и содержащего ЗАПРОС, для получения СПИСКА 
id и названий относящихся, к заранее определенному в приложении, списку, 'типы принимаемых решений по компьютерным угрозам' (types decisions made 
computer threat) или 'типы компьютерных угроз' (types computer threat).
{
    task_id: STRING // уникальный ID задачи (обязательное значение)
    section: "handling search requests",
    user_name_generated_task: "",
    request_details: {
        collection_name: "get list computer threat",
        paginate_parameters: { // в данном запросе не обязательно
            max_part_size: 0,
            current_part_number: 0
        }
        sortable_field: "", // в данном запросе не обязательно

        // параметры для поиска списка 
        search_parameters: {
            type_list: "" //"types decisions made computer threat" для 'типы принимаемых решений по компьютерным угрозам' или
                // "types computer threat" для 'типы компьютерных угроз'
        }
    } 
}

    7.2. Структура и формат JSON документа, отправляемого в графический пользовательский интерфейс ISEMS-UI и содержащего ОТВЕТ на запрос СПИСКА 
id и названий, относящихся, к заранее определенному в приложении списку 'типы принимаемых решений по компьютерным угрозам' (types decisions made 
computer threat) или 'типы компьютерных угроз' (types computer threat).
{
    task_id: STRING // уникальный ID задачи (обязательное значение)
    section: "handling search requests" // секция обработки данных (обязательное значение, для данного типа действия ТОЛЬКО "handling search requests")
	is_successful: BOOL // был ли запрос успешно обработан (в данном случае TRUE)
	description: STRING // дополнительное описание (В ДАННОМ СЛУЧАЕ НЕ ЗАПОЛНЯЕТСЯ)
	information_message: { // информационное сообщение (НЕ ОБЯЗАТЕЛЬНО К ЗАПОЛНЕНИЮ)
        msg_type: STRING // тип информационного сообщения
        msg: STRING // информационное сообщение
    }
    additional_parameters: {
        type_list: "" //"types decisions made computer threat" для 'типы принимаемых решений по компьютерным угрозам' или
            // "types computer threat" для 'типы компьютерных угроз'
        list: [
            {
                id: STRING // id типа 'grouping' относящийся к определенному списку
                description: "" // name типа 'grouping'
            }
        ]
    }
}
         */