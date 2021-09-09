"use strict";

const debug = require("debug")("hadcsihg");

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
                        let taskID = createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`);

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
 * Обработчик запроса для получения списка групп которым доступен доклад с определенным ID
 * 
 * @param {*} socketIo 
 * @param {*} data 
 */
module.exports.getListGroupsWhichReportAvailable = function(socketIo, data){
    let funcName = " (func 'getListGroupsWhichReportAvailable')",
        section = "list of groups to which the report is available",
        reportId = data.arguments;

    debug(`${funcName}, START...`);
    debug(data);

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

                debug(`${funcName}, send request to data bases`);

                mongodbQueryProcessor.querySelect(models.modelStorageSpecialGroupParameters, {
                    query: { "list_objects_available_viewing": { "$elemMatch" : { object_id: reportId }}},
                    select: { _id: 0, __v: 0 }
                }, (err, queryResult) => {
                    if(err) {
                        reject(err);
                    }

                    debug(`${funcName}, DB RESULT`);
                    debug(queryResult);

                    if(queryResult === null){
                        return;
                    }

                    helpersFunc.sendMessageByUserSocketIo(socketIo.id, "isems-mrsi response ui", { 
                        section: section,
                        eventForWidgets: false,
                        information: {
                            task_id: createUniqID.getMD5(`sid_${result.sessionId}_${(+new Date).toString(16)}`),
                            section: section,
                            additional_parameters: { list_groups_which_report_available: queryResult.list_objects_available_viewing },
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
 * Обработчик запроса для получения количества найденной информации на странице 'доклады' (STIX тип 'reports')
 * 
 * @param {*} socketIo - дескриптор websocket соединения
 * @param {*} data - данные 
 */
module.exports.getListComputerThreat = function(socketIo, data){
    let funcName = " (func 'getListComputerThreat')";

    debug(`${funcName}, START...`);
    debug(data);
/**
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
};